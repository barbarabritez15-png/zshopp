import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeTotals } from "@/lib/shipping";
import { processPayment } from "@/lib/payment";
import { formatOrderNumber } from "@/lib/format";

interface OrderBody {
  items: { productId: string; quantity: number }[];
  customer: {
    email: string;
    fullName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  payment: { cardNumber: string; expiry: string; cvc: string; name: string };
}

// GET /api/orders?email=... — list a customer's order history.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").trim().toLowerCase();
  if (!email) return NextResponse.json({ items: [] });

  const orders = await db.order.findMany({
    where: { email },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const items = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    email: o.email,
    fullName: o.fullName,
    subtotal: o.subtotal,
    shipping: o.shipping,
    tax: o.tax,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
    items: o.items,
  }));

  return NextResponse.json({ items });
}

// POST /api/orders — create a new order (checkout).
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as OrderBody;
    const items = body.items;
    const c = body.customer;
    const payment = body.payment;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }
    if (
      !c?.email ||
      !c?.fullName ||
      !c?.address ||
      !c?.city ||
      !c?.state ||
      !c?.zip ||
      !c?.country
    ) {
      return NextResponse.json(
        { error: "Please complete all required shipping fields." },
        { status: 400 }
      );
    }
    if (!payment?.cardNumber || !payment?.expiry || !payment?.cvc) {
      return NextResponse.json(
        { error: "Please complete payment details." },
        { status: 400 }
      );
    }

    const ids = items.map((i) => i.productId);
    const products = await db.product.findMany({ where: { id: { in: ids } } });
    if (products.length !== new Set(ids).size) {
      return NextResponse.json(
        { error: "Some items in your cart are no longer available." },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const orderLines = items.map((i) => {
      const p = products.find((x) => x.id === i.productId)!;
      const qty = Math.max(1, Math.min(i.quantity, p.stock || 99));
      subtotal += p.price * qty;
      const imgs: string[] = JSON.parse(p.images || "[]");
      return {
        productId: p.id,
        name: p.name,
        image: imgs[0] || "",
        price: p.price,
        quantity: qty,
      };
    });

    const totals = computeTotals(subtotal);

    const pay = await processPayment(payment);
    if (!pay.success) {
      return NextResponse.json(
        { error: pay.error || "Payment failed." },
        { status: 402 }
      );
    }

    const orderNumber = formatOrderNumber();
    const order = await db.order.create({
      data: {
        orderNumber,
        email: c.email.toLowerCase().trim(),
        fullName: c.fullName,
        address: c.address,
        city: c.city,
        state: c.state,
        zip: c.zip,
        country: c.country,
        phone: c.phone || "",
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        paymentMethod: "card",
        paymentLast4: pay.last4,
        status: "paid",
        itemsJson: JSON.stringify(orderLines),
        items: { create: orderLines },
      },
      include: { items: true },
    });

    // Decrement stock for purchased items.
    await Promise.all(
      items.map((i) =>
        db.product.update({
          where: { id: i.productId },
          data: { stock: { decrement: i.quantity } },
        })
      )
    );

    return NextResponse.json({
      order: {
        ...order,
        createdAt: order.createdAt.toISOString(),
        items: order.items,
      },
    });
  } catch (e) {
    console.error("Order creation failed:", e);
    return NextResponse.json(
      { error: "Unable to process your order. Please try again." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/orders/[orderNumber] — fetch a single order for the confirmation page.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({
    order: {
      ...order,
      createdAt: order.createdAt.toISOString(),
      items: order.items,
    },
  });
}

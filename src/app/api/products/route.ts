import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Product } from "@/lib/types";

function mapProduct(p: any): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stock: p.stock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    images: JSON.parse(p.images || "[]"),
    features: JSON.parse(p.features || "[]"),
    isFeatured: p.isFeatured,
    isDeal: p.isDeal,
    category: p.category,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "";
  const q = (searchParams.get("q") || "").trim();
  const sort = searchParams.get("sort") || "featured";
  const featured = searchParams.get("featured") === "1";
  const deal = searchParams.get("deal") === "1";
  const min = searchParams.get("min");
  const max = searchParams.get("max");

  const where: Record<string, unknown> = {};
  if (category) where.category = { slug: category };
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { brand: { contains: q } },
      { description: { contains: q } },
    ];
  }
  if (featured) where.isFeatured = true;
  if (deal) where.isDeal = true;
  if (min || max) {
    where.price = {};
    if (min) where.price.gte = parseFloat(min);
    if (max) where.price.lte = parseFloat(max);
  }

  let orderBy: Record<string, unknown>;
  switch (sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "rating":
      orderBy = { rating: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    default:
      orderBy = [{ isFeatured: "desc" }, { rating: "desc" }];
  }

  const products = await db.product.findMany({
    where: where as never,
    orderBy: orderBy as never,
    include: { category: true },
  });

  const items = products.map(mapProduct);
  return NextResponse.json({ items, total: items.length });
}

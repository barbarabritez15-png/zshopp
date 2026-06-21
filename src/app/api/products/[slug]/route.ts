import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Product, Review } from "@/lib/types";

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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const p = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!p) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const reviews: Review[] = p.reviews.map((r) => ({
    id: r.id,
    productId: r.productId,
    author: r.author,
    rating: r.rating,
    title: r.title,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
  }));

  const relatedRows = await db.product.findMany({
    where: { category: { slug: p.category.slug }, slug: { not: p.slug } },
    take: 4,
    include: { category: true },
    orderBy: { rating: "desc" },
  });

  return NextResponse.json({
    product: mapProduct(p),
    reviews,
    related: relatedRows.map(mapProduct),
  });
}

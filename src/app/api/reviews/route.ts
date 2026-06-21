import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, author, rating, title, body: reviewBody } = body;

    if (!productId || !author || !title || !reviewBody) {
      return NextResponse.json(
        { error: "Please fill in all review fields." },
        { status: 400 }
      );
    }
    const r = await db.review.create({
      data: {
        productId,
        author: String(author).slice(0, 60),
        rating: Math.min(5, Math.max(1, parseFloat(rating) || 5)),
        title: String(title).slice(0, 120),
        body: String(reviewBody).slice(0, 2000),
      },
    });

    const agg = await db.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await db.product.update({
      where: { id: productId },
      data: {
        rating: +((agg._avg.rating as number) || 0).toFixed(2),
        reviewCount: agg._count.rating,
      },
    });

    return NextResponse.json({
      review: {
        id: r.id,
        productId: r.productId,
        author: r.author,
        rating: r.rating,
        title: r.title,
        body: r.body,
        createdAt: r.createdAt.toISOString(),
      },
    });
  } catch (e) {
    console.error("Review creation failed:", e);
    return NextResponse.json(
      { error: "Unable to submit your review." },
      { status: 500 }
    );
  }
}

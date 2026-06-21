import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Category } from "@/lib/types";

export async function GET() {
  const cats = await db.category.findMany({ orderBy: { name: "asc" } });
  const items: Category[] = cats.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    description: c.description,
  }));
  return NextResponse.json({ items });
}

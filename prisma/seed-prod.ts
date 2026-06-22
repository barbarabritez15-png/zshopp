import { PrismaClient } from "@prisma/client";
import { CATEGORIES, PRODUCTS } from "../src/lib/catalog";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.category.count();
  if (existing > 0) {
    console.log("▶ Database already has data — skipping seed.");
    return;
  }

  console.log("▶ Seeding Z Shop production database...");

  const categoryMap = new Map<string, string>();
  for (const c of CATEGORIES) {
    const created = await prisma.category.create({
      data: { slug: c.slug, name: c.name, icon: c.icon, description: c.description },
    });
    categoryMap.set(c.slug, created.id);
    console.log(`  + Category: ${c.name}`);
  }

  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) throw new Error(`Missing category for ${p.slug}`);
    await prisma.product.create({
      data: {
        slug: p.slug, name: p.name, brand: p.brand, description: p.description,
        price: p.price, compareAtPrice: p.compareAtPrice ?? null, categoryId,
        stock: p.stock, rating: p.rating, reviewCount: p.reviewCount,
        images: JSON.stringify([p.image]), features: JSON.stringify(p.features),
        isFeatured: !!p.isFeatured, isDeal: !!p.isDeal,
      },
    });
    console.log(`  + Product: ${p.name}`);
  }

  const sampleReviews = [
    { productSlug: "aurora-noise-cancelling-headphones", reviews: [
      { author: "Jamie L.", rating: 5, title: "Best headphones I've owned", body: "The noise cancellation is unreal on flights. Battery lasts forever and they're super comfortable." },
      { author: "Priya K.", rating: 4, title: "Great sound, tight fit", body: "Sound quality is excellent. Slightly tight on my head after a few hours but manageable." },
      { author: "Marcus T.", rating: 5, title: "Worth every penny", body: "Use these daily for work calls and music. Mic quality surprised me too." },
    ]},
    { productSlug: "nimbus-ultrabook-14", reviews: [
      { author: "Sara M.", rating: 5, title: "Perfect travel laptop", body: "Light, fast, and the screen is gorgeous. Battery genuinely lasts a full workday." },
      { author: "Devon R.", rating: 4, title: "Powerful but pricey", body: "Handles my dev workload with ease. Wish it had more ports, hence the hub." },
    ]},
    { productSlug: "crispair-air-fryer", reviews: [
      { author: "Lin W.", rating: 5, title: "Family loves it", body: "Cook a whole batch of fries with barely any oil. The window is a game changer." },
      { author: "Bob S.", rating: 4, title: "Works great", body: "Easy to clean and the presets are handy. A bit large for my counter." },
      { author: "Aisha N.", rating: 5, title: "Use it every day", body: "Replaced my oven for most meals. Highly recommend." },
    ]},
  ];

  for (const entry of sampleReviews) {
    const product = await prisma.product.findUnique({ where: { slug: entry.productSlug } });
    if (!product) continue;
    for (const r of entry.reviews) {
      await prisma.review.create({
        data: { productId: product.id, author: r.author, rating: r.rating, title: r.title, body: r.body },
      });
    }
    console.log(`  + Reviews for: ${product.name}`);
  }

  console.log("✓ Seed complete.");
}

main().catch((e) => { console.error("Seed failed:", e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });

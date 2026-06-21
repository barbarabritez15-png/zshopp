"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset,
  Zap,
} from "lucide-react";
import type { Product, Category } from "@/lib/types";
import { useView } from "@/lib/store/view-store";
import { useT } from "@/lib/i18n/use-t";
import { useMoney } from "@/lib/i18n/use-money";
import { ProductCard } from "@/components/shop/product-card";
import { CategoryIcon } from "@/components/shop/category-icon";
import { Skeleton } from "@/components/ui/skeleton";

function HeroRow() {
  const go = useView((s) => s.go);
  const { t } = useT();
  const [imgOk, setImgOk] = useState(true);
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-amber-900">
      {imgOk && (
        <img
          src="/hero.png"
          alt=""
          aria-hidden
          onError={() => setImgOk(false)}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-14 sm:py-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/40">
          <Zap size={13} /> {t("home.badge")}
        </span>
        <h1 className="max-w-2xl text-3xl font-black leading-tight text-white sm:text-5xl">
          {t("home.title")}{" "}
          <span className="text-amber-400">{t("home.titleHighlight")}</span>
        </h1>
        <p className="max-w-xl text-sm text-slate-200 sm:text-base">
          {t("home.subtitle")}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => go({ name: "deals" })}
            className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-amber-300"
          >
            {t("home.ctaDeals")}
          </button>
          <button
            onClick={() => go({ name: "all" })}
            className="rounded-lg bg-white/10 px-5 py-2.5 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
          >
            {t("home.ctaBrowse")}
          </button>
        </div>
      </div>
    </section>
  );
}

function TrustBadges() {
  const { t } = useT();
  const { format } = useMoney();
  const badges = [
    { icon: Truck, title: t("home.trustFreeShip"), sub: t("home.trustFreeShipSub", { amount: format(50) }) },
    { icon: ShieldCheck, title: t("home.trustSecure"), sub: t("home.trustSecureSub") },
    { icon: RotateCcw, title: t("home.trustReturns"), sub: t("home.trustReturnsSub") },
    { icon: Headset, title: t("home.trustSupport"), sub: t("home.trustSupportSub") },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {badges.map((b) => (
          <div
            key={b.title}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700">
              <b.icon size={20} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900">
                {b.title}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {b.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryGrid() {
  const go = useView((s) => s.go);
  const { t } = useT();
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const r = await fetch("/api/categories");
      if (!r.ok) throw new Error("failed");
      return (await r.json()).items as Category[];
    },
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          {t("home.shopByCategory")}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-xl" />
            ))
          : categories?.map((c) => (
              <button
                key={c.id}
                onClick={() =>
                  go({
                    name: "category",
                    slug: c.slug,
                    categoryName: t("cat." + c.slug) || c.name,
                  })
                }
                className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
              >
                <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 transition group-hover:scale-110">
                  <CategoryIcon name={c.icon} size={26} />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-900">
                    {t("cat." + c.slug) || c.name}
                  </div>
                </div>
              </button>
            ))}
      </div>
    </section>
  );
}

function ProductScroller({
  title,
  products,
  isLoading,
  onSeeAll,
  accent,
}: {
  title: string;
  products?: Product[];
  isLoading: boolean;
  onSeeAll: () => void;
  accent?: boolean;
}) {
  const { t } = useT();
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
          {accent && <Zap size={18} className="text-amber-500" />}
          {title}
        </h2>
        <button
          onClick={onSeeAll}
          className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 transition hover:text-amber-800"
        >
          {t("home.seeAll")} <ChevronRight size={15} />
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-[3/4] w-44 shrink-0 rounded-xl sm:w-56"
              />
            ))
          : products?.map((p) => (
              <div key={p.id} className="w-44 shrink-0 sm:w-56">
                <ProductCard product={p} />
              </div>
            ))}
      </div>
    </section>
  );
}

export function HomeView() {
  const { t } = useT();
  const go = useView((s) => s.go);

  const dealsQ = useQuery({
    queryKey: ["products", { deal: true, sort: "featured" }],
    queryFn: async () => {
      const r = await fetch("/api/products?deal=1&sort=featured");
      if (!r.ok) throw new Error("failed");
      return (await r.json()).items as Product[];
    },
  });

  const featuredQ = useQuery({
    queryKey: ["products", { featured: true, sort: "rating" }],
    queryFn: async () => {
      const r = await fetch("/api/products?featured=1&sort=rating");
      if (!r.ok) throw new Error("failed");
      return (await r.json()).items as Product[];
    },
  });

  return (
    <div>
      <HeroRow />
      <TrustBadges />
      <CategoryGrid />
      <ProductScroller
        title={t("home.todaysDeals")}
        accent
        products={dealsQ.data}
        isLoading={dealsQ.isLoading}
        onSeeAll={() => go({ name: "deals" })}
      />
      <ProductScroller
        title={t("home.featuredProducts")}
        products={featuredQ.data}
        isLoading={featuredQ.isLoading}
        onSeeAll={() => go({ name: "featured" })}
      />
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {t("home.discoverTitle")}
          </h2>
          <p className="max-w-lg text-sm text-slate-600">
            {t("home.discoverSubtitle")}
          </p>
          <button
            onClick={() => go({ name: "all" })}
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            {t("home.browseAll")}
          </button>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PackageX } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/lib/i18n/use-t";
import { useMoney } from "@/lib/i18n/use-money";
import { cn } from "@/lib/utils";

interface BrowseGridProps {
  category?: string;
  q?: string;
  deal?: boolean;
  featured?: boolean;
  title: string;
  subtitle?: string;
}

export function BrowseGrid({
  category,
  q,
  deal,
  featured,
  title,
  subtitle,
}: BrowseGridProps) {
  const { t } = useT();
  const { format } = useMoney();
  const [sort, setSort] = useState("featured");
  const [priceIdx, setPriceIdx] = useState(0);

  // Threshold values stay in USD (sent to the API); labels are converted.
  const priceFilters = [
    { label: t("browse.priceAll"), min: "", max: "" },
    { label: t("browse.under", { amount: format(50) }), min: "", max: "50" },
    { label: t("browse.range", { min: format(50), max: format(150) }), min: "50", max: "150" },
    { label: t("browse.range", { min: format(150), max: format(400) }), min: "150", max: "400" },
    { label: t("browse.over", { amount: format(400) }), min: "400", max: "" },
  ];
  const pf = priceFilters[priceIdx];

  const sortOptions = [
    { value: "featured", label: t("browse.sortFeatured") },
    { value: "price-asc", label: t("browse.sortPriceAsc") },
    { value: "price-desc", label: t("browse.sortPriceDesc") },
    { value: "rating", label: t("browse.sortRating") },
    { value: "newest", label: t("browse.sortNewest") },
  ];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { category, q, deal, featured, sort, ...pf }],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (category) sp.set("category", category);
      if (q) sp.set("q", q);
      if (deal) sp.set("deal", "1");
      if (featured) sp.set("featured", "1");
      sp.set("sort", sort);
      if (pf.min) sp.set("min", pf.min);
      if (pf.max) sp.set("max", pf.max);
      const r = await fetch(`/api/products?${sp.toString()}`);
      if (!r.ok) throw new Error("failed");
      return (await r.json()) as { items: Product[] };
    },
  });

  const items = data?.items ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-muted-foreground">
            {t("browse.price")}
          </span>
          {priceFilters.map((p, i) => (
            <button
              key={i}
              onClick={() => setPriceIdx(i)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                priceIdx === i
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {t("browse.sortBy")}
          </span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-8 w-[180px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((s) => (
                <SelectItem key={s.value} value={s.value} className="text-xs">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        {isLoading
          ? t("browse.loading")
          : t(items.length === 1 ? "browse.result" : "browse.results", {
              count: items.length,
            })}
      </div>

      {isError ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-center text-muted-foreground">
          <PackageX size={40} />
          <p>{t("browse.couldNotLoad")}</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-center text-muted-foreground">
          <PackageX size={40} />
          <p>
            {t("browse.noResults", {
              for: q ? t("browse.noResultsFor", { q }) : "",
            })}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

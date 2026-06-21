"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingCart, Menu, Package } from "lucide-react";
import { useCart, cartCount } from "@/lib/store/cart-store";
import { useView } from "@/lib/store/view-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { useT } from "@/lib/i18n/use-t";
import { LanguageSwitcher } from "./language-switcher";
import type { Category } from "@/lib/types";

export function Header() {
  const { t } = useT();
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const go = useView((s) => s.go);
  const count = hydrated ? cartCount(items) : 0;
  const [q, setQ] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const r = await fetch("/api/categories");
      if (!r.ok) throw new Error("failed");
      return (await r.json()).items as Category[];
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) go({ name: "search", q: q.trim() });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        {/* Main bar */}
        <div className="flex h-16 items-center gap-2 sm:gap-4">
          <button
            onClick={() => go({ name: "home" })}
            className="flex shrink-0 items-center gap-1.5 rounded px-1 py-1 transition hover:bg-white/10"
            aria-label={t("header.home")}
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400 text-lg font-black text-slate-900">
              Z
            </span>
            <span className="hidden text-lg font-bold tracking-tight sm:block">
              Shop
            </span>
          </button>

          <form
            onSubmit={submit}
            className="flex min-w-0 flex-1 items-stretch overflow-hidden rounded-lg ring-2 ring-transparent focus-within:ring-amber-400"
            role="search"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("header.searchPlaceholder")}
              className="min-w-0 flex-1 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              aria-label={t("header.searchPlaceholder")}
            />
            <button
              type="submit"
              className="grid w-11 place-items-center bg-amber-400 text-slate-900 transition hover:bg-amber-300"
              aria-label={t("header.searchPlaceholder")}
            >
              <Search size={18} />
            </button>
          </form>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <button
              onClick={() => go({ name: "orders" })}
              className="hidden flex-col items-start rounded px-2 py-1 text-left transition hover:bg-white/10 sm:flex"
            >
              <span className="text-[10px] leading-none text-white/70">
                {t("header.returns")}
              </span>
              <span className="text-sm font-semibold leading-tight">
                {t("header.returnsSub")}
              </span>
            </button>
            <button
              onClick={() => go({ name: "orders" })}
              className="grid h-9 w-9 place-items-center rounded transition hover:bg-white/10 sm:hidden"
              aria-label={t("header.orders")}
            >
              <Package size={20} />
            </button>
            <LanguageSwitcher />
            <button
              onClick={() => go({ name: "cart" })}
              className="relative flex items-center rounded px-2 py-1 transition hover:bg-white/10"
              aria-label={t("header.cartWith", { count })}
            >
              <div className="relative">
                <ShoppingCart size={24} />
                {count > 0 && (
                  <span className="absolute -right-2.5 -top-2 grid h-5 min-w-[20px] place-items-center rounded-full bg-amber-400 px-1 text-xs font-bold text-slate-900">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </div>
              <span className="ml-1.5 hidden text-sm font-semibold sm:block">
                {t("header.cart")}
              </span>
            </button>
          </div>
        </div>

        {/* Secondary nav */}
        <nav className="flex h-10 items-center gap-1 overflow-x-auto no-scrollbar text-sm">
          <button
            onClick={() => go({ name: "all" })}
            className="flex shrink-0 items-center gap-1.5 rounded px-2 py-1 font-medium transition hover:bg-white/10"
          >
            <Menu size={14} /> {t("header.all")}
          </button>
          <button
            onClick={() => go({ name: "deals" })}
            className="shrink-0 rounded px-2 py-1 font-medium text-amber-300 transition hover:bg-white/10"
          >
            {t("header.deals")}
          </button>
          <button
            onClick={() => go({ name: "featured" })}
            className="shrink-0 rounded px-2 py-1 font-medium transition hover:bg-white/10"
          >
            {t("header.featured")}
          </button>
          <span className="px-1 text-white/20">|</span>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                go({
                  name: "category",
                  slug: c.slug,
                  categoryName: t("cat." + c.slug) || c.name,
                })
              }
              className="shrink-0 rounded px-2 py-1 font-medium transition hover:bg-white/10"
            >
              {t("cat." + c.slug) || c.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

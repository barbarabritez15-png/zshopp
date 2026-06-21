"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Search, ChevronRight } from "lucide-react";
import type { Order } from "@/lib/types";
import { useView } from "@/lib/store/view-store";
import { useT } from "@/lib/i18n/use-t";
import { useMoney } from "@/lib/i18n/use-money";
import { ProductImage } from "@/components/shop/product-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";

export function OrdersView() {
  const { t, locale } = useT();
  const { format } = useMoney();
  const go = useView((s) => s.go);
  // Lazy-init from localStorage. This view only mounts after client-side
  // navigation, so there is no SSR hydration mismatch.
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("zshop-last-email") || "";
  });
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["orders", submittedEmail],
    enabled: !!submittedEmail,
    queryFn: async () => {
      const r = await fetch(
        `/api/orders?email=${encodeURIComponent(submittedEmail)}`
      );
      if (!r.ok) throw new Error("failed");
      return (await r.json()).items as Order[];
    },
  });

  const orders = data ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">
        {t("orders.title")}
      </h1>
      <p className="mb-4 text-sm text-muted-foreground">{t("orders.subtitle")}</p>
      <form onSubmit={submit} className="mb-6 flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("orders.emailPlaceholder")}
          className="sm:max-w-xs"
        />
        <Button
          type="submit"
          disabled={isFetching}
          className="bg-amber-400 text-slate-900 hover:bg-amber-300"
        >
          <Search size={16} />{" "}
          {isFetching ? t("orders.searching") : t("orders.findOrders")}
        </Button>
      </form>

      {!submittedEmail ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
          <Package size={40} />
          <p>{t("orders.enterEmail")}</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
          <Package size={40} />
          <p>{t("orders.noOrders", { email: submittedEmail })}</p>
          <Button
            onClick={() => go({ name: "home" })}
            className="mt-2 bg-amber-400 text-slate-900 hover:bg-amber-300"
          >
            {t("orders.startShopping")}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const itemWord =
              o.items.length === 1 ? t("orders.item") : t("orders.items");
            return (
              <div
                key={o.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs">
                  <div>
                    <div className="text-muted-foreground">
                      {t("orders.orderPlaced")}
                    </div>
                    <div className="font-medium text-slate-900">
                      {formatDateTime(o.createdAt, locale)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">
                      {t("orders.total")}
                    </div>
                    <div className="font-medium text-slate-900">
                      {format(o.total)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">
                      {t("orders.orderNumber")}
                    </div>
                    <div className="font-mono font-medium text-slate-900">
                      {o.orderNumber}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {o.status}
                  </Badge>
                </div>
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm">
                    <ProductImage
                      src={o.items[0]?.image}
                      alt={o.items[0]?.name || ""}
                      name={o.items[0]?.name}
                      className="h-12 w-12 rounded-md border border-slate-200"
                    />
                    <div>
                      <div className="font-medium text-slate-900">
                        {o.items.length} {itemWord}
                      </div>
                      <button
                        onClick={() =>
                          go({
                            name: "order-confirmation",
                            orderNumber: o.orderNumber,
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 transition hover:text-amber-800"
                      >
                        {t("orders.viewDetails")} <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {o.items.slice(0, 5).map((it) => (
                      <button
                        key={it.id}
                        onClick={() =>
                          go({
                            name: "order-confirmation",
                            orderNumber: o.orderNumber,
                          })
                        }
                        className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 transition hover:border-amber-300"
                      >
                        <ProductImage
                          src={it.image}
                          alt={it.name}
                          name={it.name}
                          className="h-10 w-10 rounded"
                        />
                        <div className="max-w-[160px]">
                          <div className="line-clamp-1 text-xs font-medium text-slate-900">
                            {it.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t("conf.qty", { count: it.quantity })}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const em = email.trim().toLowerCase();
    if (!em || !/\S+@\S+\.\S+/.test(em)) return;
    setSubmittedEmail(em);
    localStorage.setItem("zshop-last-email", em);
  }
}

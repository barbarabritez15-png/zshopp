"use client";

import { Trash2, ArrowLeft, ShoppingBag, Truck } from "lucide-react";
import { useCart, cartSubtotal } from "@/lib/store/cart-store";
import { useView } from "@/lib/store/view-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { useT } from "@/lib/i18n/use-t";
import { useMoney } from "@/lib/i18n/use-money";
import { ProductImage } from "@/components/shop/product-image";
import { QuantityStepper } from "@/components/shop/quantity-stepper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { computeTotals, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

export function CartView() {
  const { t } = useT();
  const { format } = useMoney();
  const hydrated = useHydrated();
  const go = useView((s) => s.go);
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);

  if (!hydrated) return <CartSkeleton />;

  const subtotal = cartSubtotal(items);
  const totals = computeTotals(subtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-slate-100">
          <ShoppingBag size={36} className="text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {t("cart.empty.title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("cart.empty.subtitle")}</p>
        <Button
          onClick={() => go({ name: "home" })}
          className="mt-6 bg-amber-400 text-slate-900 hover:bg-amber-300"
        >
          {t("cart.continueShopping")}
        </Button>
      </div>
    );
  }

  const remaining = totals.freeShippingRemaining;
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">{t("cart.title")}</h1>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {items.map((it) => (
              <div key={it.productId} className="flex gap-4 p-4">
                <button
                  onClick={() => go({ name: "product", slug: it.slug })}
                  className="shrink-0"
                  aria-label={it.name}
                >
                  <ProductImage
                    src={it.image}
                    alt={it.name}
                    name={it.name}
                    className="h-24 w-24 rounded-lg border border-slate-200"
                  />
                </button>
                <div className="flex flex-1 flex-col gap-1">
                  <button
                    onClick={() => go({ name: "product", slug: it.slug })}
                    className="line-clamp-2 text-left text-sm font-semibold text-slate-900 hover:text-amber-700"
                  >
                    {it.name}
                  </button>
                  <div className="text-xs text-muted-foreground">{it.brand}</div>
                  <div className="text-xs text-green-700">{t("cart.inStock")}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <QuantityStepper
                      value={it.quantity}
                      onChange={(q) => setQuantity(it.productId, q)}
                      min={1}
                      max={Math.min(it.stock || 99, 99)}
                    />
                    <button
                      onClick={() => removeItem(it.productId)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-red-600"
                    >
                      <Trash2 size={14} /> {t("cart.remove")}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">
                    {format(it.price * it.quantity)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("cart.each", { amount: format(it.price) })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => go({ name: "home" })}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 transition hover:text-amber-800"
          >
            <ArrowLeft size={15} /> {t("cart.continueShopping")}
          </button>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-28 rounded-xl border border-slate-200 bg-white p-5">
            {remaining > 0 ? (
              <div className="mb-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                <div className="flex items-center gap-2">
                  <Truck size={15} />
                  {t("cart.addMore", { amount: format(remaining) })}
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-amber-200">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-3 rounded-lg bg-green-50 p-3 text-xs font-medium text-green-800">
                <Truck size={15} className="mr-1 inline" /> {t("cart.qualifiesFree")}
              </div>
            )}
            <div className="space-y-2 text-sm">
              <SummaryRow
                label={t("cart.subtotalItems", { count: itemCount })}
                value={format(totals.subtotal)}
              />
              <SummaryRow
                label={t("cart.shipping")}
                value={
                  totals.shipping === 0 ? t("cart.free") : format(totals.shipping)
                }
              />
              <SummaryRow
                label={t("cart.tax")}
                value={format(totals.tax)}
              />
              <div className="my-2 h-px bg-slate-200" />
              <div className="flex items-center justify-between text-base font-bold text-slate-900">
                <span>{t("cart.total")}</span>
                <span>{format(totals.total)}</span>
              </div>
            </div>
            <Button
              onClick={() => go({ name: "checkout" })}
              className="mt-4 w-full bg-amber-400 text-slate-900 hover:bg-amber-300"
            >
              {t("cart.proceed")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-slate-600">
      <span>{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Skeleton className="mb-4 h-8 w-48" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

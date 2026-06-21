"use client";

import { useState } from "react";
import { Lock, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useCart, cartSubtotal } from "@/lib/store/cart-store";
import { useView } from "@/lib/store/view-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { useT } from "@/lib/i18n/use-t";
import { useMoney } from "@/lib/i18n/use-money";
import { ProductImage } from "@/components/shop/product-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { computeTotals } from "@/lib/shipping";
import { cardBrand } from "@/lib/payment";

function fmtCard(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}
function fmtExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + "/" + d.slice(2);
}

interface CustomerForm {
  email: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}
interface PayForm {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
}

export function CheckoutView() {
  const { t } = useT();
  const { format } = useMoney();
  const hydrated = useHydrated();
  const go = useView((s) => s.go);
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  const [form, setForm] = useState<CustomerForm>({
    email: "",
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    phone: "",
  });
  const [pay, setPay] = useState<PayForm>({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!hydrated) {
    return (
      <div className="px-4 py-10 text-center text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  const subtotal = cartSubtotal(items);
  const totals = computeTotals(subtotal);

  if (items.length === 0 && !loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          {t("co.cartEmpty")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("co.cartEmptySub")}</p>
        <Button
          onClick={() => go({ name: "home" })}
          className="mt-6 bg-amber-400 text-slate-900 hover:bg-amber-300"
        >
          {t("co.continueShopping")}
        </Button>
      </div>
    );
  }

  const setF = (k: keyof CustomerForm, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));
  const setP = (k: keyof PayForm, v: string) =>
    setPay((p) => ({ ...p, [k]: v }));

  const validate = (): string => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      return t("co.validEmail");
    if (!form.fullName) return t("co.validName");
    if (!form.address) return t("co.validAddress");
    if (!form.city) return t("co.validCity");
    if (!form.state) return t("co.validState");
    if (!form.zip) return t("co.validZip");
    if (!pay.name) return t("co.validCardName");
    if (!pay.cardNumber) return t("co.validCardNumber");
    if (!pay.expiry) return t("co.validExpiry");
    if (!pay.cvc) return t("co.validCvc");
    return "";
  };

  const placeOrder = async () => {
    const v = validate();
    if (v) {
      setError(v);
      toast.error(v);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          customer: form,
          payment: pay,
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        const msg = data.error || t("co.paymentFailed");
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }
      clear();
      try {
        localStorage.setItem(
          "zshop-last-email",
          form.email.toLowerCase().trim()
        );
      } catch {
        /* ignore storage errors */
      }
      toast.success(t("toast.orderPlaced"));
      go({ name: "order-confirmation", orderNumber: data.order.orderNumber });
    } catch {
      setError(t("co.networkError"));
      toast.error(t("co.networkError"));
      setLoading(false);
    }
  };

  const brand = cardBrand(pay.cardNumber);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <button
        onClick={() => go({ name: "cart" })}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 transition hover:text-amber-800"
      >
        <ArrowLeft size={15} /> {t("co.backToCart")}
      </button>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        {t("co.secureCheckout")}{" "}
        <Lock size={18} className="ml-1 inline text-amber-600" />
      </h1>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-400 text-xs font-bold text-slate-900">
                1
              </span>{" "}
              {t("co.shippingAddress")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t("co.email")} full>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setF("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label={t("co.fullName")} full>
                <Input
                  value={form.fullName}
                  onChange={(e) => setF("fullName", e.target.value)}
                />
              </Field>
              <Field label={t("co.address")} full>
                <Input
                  value={form.address}
                  onChange={(e) => setF("address", e.target.value)}
                />
              </Field>
              <Field label={t("co.city")}>
                <Input
                  value={form.city}
                  onChange={(e) => setF("city", e.target.value)}
                />
              </Field>
              <Field label={t("co.state")}>
                <Input
                  value={form.state}
                  onChange={(e) => setF("state", e.target.value)}
                />
              </Field>
              <Field label={t("co.zip")}>
                <Input
                  value={form.zip}
                  onChange={(e) => setF("zip", e.target.value)}
                />
              </Field>
              <Field label={t("co.country")}>
                <Input
                  value={form.country}
                  onChange={(e) => setF("country", e.target.value)}
                />
              </Field>
              <Field label={t("co.phone")} full>
                <Input
                  value={form.phone}
                  onChange={(e) => setF("phone", e.target.value)}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-400 text-xs font-bold text-slate-900">
                2
              </span>{" "}
              {t("co.paymentMethod")}
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              <ShieldCheck size={13} className="mr-1 inline" />
              {t("co.demoNotice", { card: "4242 4242 4242 4242" })}
            </p>
            <div className="grid gap-3">
              <Field label={t("co.nameOnCard")} full>
                <Input
                  value={pay.name}
                  onChange={(e) => setP("name", e.target.value)}
                  placeholder="JANE DOE"
                />
              </Field>
              <Field label={t("co.cardNumber")} full>
                <div className="relative">
                  <Input
                    value={pay.cardNumber}
                    onChange={(e) => setP("cardNumber", fmtCard(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    className="pr-20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                    {brand}
                  </span>
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("co.expiry")}>
                  <Input
                    value={pay.expiry}
                    onChange={(e) => setP("expiry", fmtExpiry(e.target.value))}
                    placeholder="08/27"
                    inputMode="numeric"
                  />
                </Field>
                <Field label={t("co.cvc")}>
                  <Input
                    value={pay.cvc}
                    onChange={(e) =>
                      setP("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="123"
                    inputMode="numeric"
                  />
                </Field>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              {t("co.orderSummary")}
            </h2>
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1 scrollbar-thin">
              {items.map((it) => (
                <div key={it.productId} className="flex gap-3">
                  <div className="relative shrink-0">
                    <ProductImage
                      src={it.image}
                      alt={it.name}
                      name={it.name}
                      className="h-14 w-14 rounded-md border border-slate-200"
                    />
                    <span className="absolute -right-2 -top-2 grid h-5 min-w-[20px] place-items-center rounded-full bg-slate-900 px-1 text-xs font-bold text-white">
                      {it.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-xs font-medium text-slate-900">
                      {it.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("cart.each", { amount: format(it.price) })}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {format(it.price * it.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <SummaryRow
                label={t("co.subtotal")}
                value={format(totals.subtotal)}
              />
              <SummaryRow
                label={t("co.shipping")}
                value={
                  totals.shipping === 0
                    ? t("cart.free")
                    : format(totals.shipping)
                }
              />
              <SummaryRow label={t("co.tax")} value={format(totals.tax)} />
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between text-lg font-bold text-slate-900">
              <span>{t("co.total")}</span>
              <span>{format(totals.total)}</span>
            </div>
            {error && (
              <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <Button
              onClick={placeOrder}
              disabled={loading}
              className="mt-4 w-full bg-amber-400 py-3 text-base text-slate-900 hover:bg-amber-300"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />{" "}
                  {t("co.processing")}
                </>
              ) : (
                <>
                  <Lock size={16} className="mr-2" /> {t("co.placeOrder", {
                    amount: format(totals.total),
                  })}
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              <Lock size={11} className="inline" /> {t("co.securedWith")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label className="mb-1 block text-xs text-muted-foreground">{label}</Label>
      {children}
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

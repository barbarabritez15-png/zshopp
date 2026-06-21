"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/lib/types";
import { useView } from "@/lib/store/view-store";
import { useT } from "@/lib/i18n/use-t";
import { useMoney } from "@/lib/i18n/use-money";
import { ProductImage } from "@/components/shop/product-image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/format";

export function ConfirmationView({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const { t, locale } = useT();
  const { format } = useMoney();
  const go = useView((s) => s.go);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: async () => {
      const r = await fetch(`/api/orders/${orderNumber}`);
      if (!r.ok) throw new Error("failed");
      return (await r.json()).order as Order;
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">{t("conf.notFound")}</p>
        <Button
          onClick={() => go({ name: "home" })}
          className="mt-4 bg-amber-400 text-slate-900 hover:bg-amber-300"
        >
          {t("conf.backHome")}
        </Button>
      </div>
    );
  }

  const firstName = data.fullName.split(" ")[0] || "";

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(data.orderNumber);
      toast.success(t("toast.copied"));
    } catch {
      toast.message(data.orderNumber);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 grid h-16 w-16 place-items-center rounded-full bg-green-100">
          <CheckCircle2 size={36} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {t("conf.thankYou", { name: firstName })}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("conf.orderPlacedMsg", { email: data.email })}
        </p>
        <button
          onClick={copyNumber}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-mono text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          <Package size={14} /> {data.orderNumber} <Copy size={12} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard
          icon={Package}
          title={t("conf.orderDate")}
          value={formatDateTime(data.createdAt, locale)}
        />
        <InfoCard
          icon={Truck}
          title={t("conf.deliveryTo")}
          value={`${data.city}, ${data.state} ${data.zip}`}
        />
        <InfoCard
          icon={CheckCircle2}
          title={t("conf.payment")}
          value={`•••• ${data.paymentLast4}`}
        />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          {t("conf.orderSummary")}
        </h2>
        <div className="space-y-3">
          {data.items.map((it) => (
            <div key={it.id} className="flex items-center gap-3">
              <ProductImage
                src={it.image}
                alt={it.name}
                name={it.name}
                className="h-14 w-14 rounded-md border border-slate-200"
              />
              <div className="flex-1">
                <div className="line-clamp-1 text-sm font-medium text-slate-900">
                  {it.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("conf.qty", { count: it.quantity })} ×{" "}
                  {format(it.price)}
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {format(it.price * it.quantity)}
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-1.5 text-sm">
          <Row label={t("conf.subtotal")} value={format(data.subtotal)} />
          <Row
            label={t("conf.shipping")}
            value={data.shipping === 0 ? t("cart.free") : format(data.shipping)}
          />
          <Row label={t("conf.tax")} value={format(data.tax)} />
        </div>
        <Separator className="my-3" />
        <div className="flex items-center justify-between text-lg font-bold text-slate-900">
          <span>{t("conf.totalPaid")}</span>
          <span>{format(data.total)}</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 text-sm">
        <h3 className="mb-2 font-bold text-slate-900">
          {t("conf.shippingAddress")}
        </h3>
        <p className="leading-relaxed text-slate-600">
          {data.fullName}
          <br />
          {data.address}
          <br />
          {data.city}, {data.state} {data.zip}
          <br />
          {data.country}
          {data.phone ? ` · ${data.phone}` : ""}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button
          onClick={() => go({ name: "home" })}
          className="flex-1 bg-amber-400 text-slate-900 hover:bg-amber-300"
        >
          {t("conf.continueShopping")}
        </Button>
        <Button
          onClick={() => go({ name: "orders" })}
          variant="outline"
          className="flex-1"
        >
          {t("conf.viewHistory")} <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon size={14} /> {title}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-slate-600">
      <span>{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

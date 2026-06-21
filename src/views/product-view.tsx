"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ChevronRight,
  ShoppingCart,
  Zap,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  PackageX,
} from "lucide-react";
import type { ProductDetail, Review } from "@/lib/types";
import { useView } from "@/lib/store/view-store";
import { useCart } from "@/lib/store/cart-store";
import { useT } from "@/lib/i18n/use-t";
import { useMoney } from "@/lib/i18n/use-money";
import { ProductImage } from "@/components/shop/product-image";
import { StarRating } from "@/components/shop/star-rating";
import { PriceTag } from "@/components/shop/price-tag";
import { QuantityStepper } from "@/components/shop/quantity-stepper";
import { ProductCard } from "@/components/shop/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ProductView({ slug }: { slug: string }) {
  const { t } = useT();
  const { format } = useMoney();
  const go = useView((s) => s.go);
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const r = await fetch(`/api/products/${slug}`);
      if (!r.ok) throw new Error("failed");
      return (await r.json()) as ProductDetail;
    },
  });

  if (isLoading) return <ProductSkeleton />;
  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <PackageX size={48} className="mx-auto text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          {t("pv.notFound")}
        </h1>
        <Button
          onClick={() => go({ name: "home" })}
          className="mt-4 bg-amber-400 text-slate-900 hover:bg-amber-300"
        >
          {t("pv.backHome")}
        </Button>
      </div>
    );
  }

  const { product, reviews, related } = data;
  const inStock = product.stock > 0;

  const addLine = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    image: product.images[0] || "",
    price: product.price,
    stock: product.stock,
  };

  const addToCart = () => {
    addItem(addLine, qty);
    toast.success(t("toast.addedToCart"), {
      description: t("toast.addedDesc", { qty, name: product.name }),
    });
  };
  const buyNow = () => {
    addItem(addLine, qty);
    go({ name: "checkout" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <button onClick={() => go({ name: "home" })} className="hover:text-amber-700">
          {t("pv.home")}
        </button>
        <ChevronRight size={12} />
        <button
          onClick={() =>
            go({
              name: "category",
              slug: product.category.slug,
              categoryName: t("cat." + product.category.slug) || product.category.name,
            })
          }
          className="hover:text-amber-700"
        >
          {t("cat." + product.category.slug) || product.category.name}
        </button>
        <ChevronRight size={12} />
        <span className="truncate text-slate-700">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6">
            <ProductImage
              src={product.images[0]}
              alt={product.name}
              name={product.name}
              className="aspect-square w-full"
            />
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="text-sm font-medium uppercase tracking-wide text-amber-700">
            {product.brand}
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <StarRating
              rating={product.rating}
              size={16}
              showNumber
              count={product.reviewCount}
            />
          </div>
          <div className="my-4 h-px bg-slate-200" />
          <PriceTag
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="xl"
          />
          {product.isDeal && product.compareAtPrice && (
            <div className="mt-1 text-sm font-semibold text-red-600">
              {t("pv.youSave", {
                amount: format(product.compareAtPrice - product.price),
              })}
            </div>
          )}
          <div className="my-4 h-px bg-slate-200" />
          <div
            className={cn(
              "text-sm font-medium",
              inStock ? "text-green-700" : "text-red-600"
            )}
          >
            {inStock
              ? t("pv.inStockCount", { count: product.stock })
              : t("pv.outOfStock")}
          </div>

          {product.features.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-bold text-slate-900">
                {t("pv.aboutItem")}
              </h3>
              <ul className="space-y-1.5">
                {product.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-slate-600"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-green-600"
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-5 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
            {product.description}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="sticky top-28 rounded-xl border border-slate-200 bg-white p-4">
            <PriceTag
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              size="lg"
            />
            <div className="mt-3 flex items-center gap-3">
              <Label className="text-xs text-muted-foreground">{t("pv.qty")}</Label>
              <QuantityStepper
                value={qty}
                onChange={setQty}
                min={1}
                max={Math.min(product.stock || 99, 99)}
              />
            </div>
            <div className="mt-4 space-y-2">
              <Button
                onClick={addToCart}
                disabled={!inStock}
                className="w-full bg-amber-400 text-slate-900 hover:bg-amber-300"
              >
                <ShoppingCart size={16} /> {t("pv.addToCart")}
              </Button>
              <Button
                onClick={buyNow}
                disabled={!inStock}
                className="w-full border-0 bg-orange-500 text-white hover:bg-orange-600"
              >
                <Zap size={16} /> {t("pv.buyNow")}
              </Button>
            </div>
            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-amber-600" /> {t("pv.freeShip")}
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={15} className="text-amber-600" /> {t("pv.returns")}
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-amber-600" /> {t("pv.secure")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewsSection
        productId={product.id}
        reviews={reviews}
        avgRating={product.rating}
      />

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            {t("pv.alsoViewed")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ReviewsSection({
  productId,
  reviews,
  avgRating,
}: {
  productId: string;
  reviews: Review[];
  avgRating: number;
}) {
  const { t, locale } = useT();
  const qc = useQueryClient();
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !title || !body) {
      toast.error(t("toast.fillAllReview"));
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, author, rating, title, body }),
      });
      if (!r.ok) throw new Error("failed");
      toast.success(t("toast.reviewSubmitted"));
      setAuthor("");
      setTitle("");
      setBody("");
      setRating(5);
      qc.invalidateQueries({ queryKey: ["product"] });
    } catch {
      toast.error(t("toast.failedReview"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10 grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900">
            {t("pv.customerReviews")}
          </h2>
          <StarRating rating={avgRating} size={16} showNumber />
        </div>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("pv.noReviews")}</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                      {r.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {r.author}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(r.createdAt, locale)}
                      </div>
                    </div>
                  </div>
                  <StarRating rating={r.rating} size={14} />
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {r.title}
                </div>
                <p className="mt-1 text-sm text-slate-600">{r.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-base font-bold text-slate-900">
            {t("pv.writeReview")}
          </h3>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label className="mb-1 block text-xs text-muted-foreground">
                {t("pv.rating")}
              </Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setRating(n)}
                    aria-label={`${n}`}
                  >
                    <Star
                      size={26}
                      fill={n <= rating ? "#f59e0b" : "#e5e7eb"}
                      className={n <= rating ? "text-amber-400" : "text-slate-200"}
                      strokeWidth={0}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="rv-author" className="mb-1 block text-xs text-muted-foreground">
                {t("pv.yourName")}
              </Label>
              <Input
                id="rv-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={t("pv.namePlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="rv-title" className="mb-1 block text-xs text-muted-foreground">
                {t("pv.title")}
              </Label>
              <Input
                id="rv-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("pv.titlePlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="rv-body" className="mb-1 block text-xs text-muted-foreground">
                {t("pv.review")}
              </Label>
              <Textarea
                id="rv-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder={t("pv.reviewPlaceholder")}
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-400 text-slate-900 hover:bg-amber-300"
            >
              {submitting ? t("pv.submitting") : t("pv.submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-8 lg:grid-cols-12">
        <Skeleton className="aspect-square w-full rounded-xl lg:col-span-5" />
        <div className="space-y-3 lg:col-span-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl lg:col-span-3" />
      </div>
    </div>
  );
}

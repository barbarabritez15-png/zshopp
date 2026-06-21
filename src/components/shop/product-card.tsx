"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useView } from "@/lib/store/view-store";
import { useCart } from "@/lib/store/cart-store";
import { useT } from "@/lib/i18n/use-t";
import { ProductImage } from "./product-image";
import { StarRating } from "./star-rating";
import { PriceTag } from "./price-tag";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useT();
  const go = useView((s) => s.go);
  const addItem = useCart((s) => s.addItem);

  const open = () => go({ name: "product", slug: product.slug });

  const add = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.images[0] || "",
      price: product.price,
      stock: product.stock,
    });
    toast.success(t("toast.addedToCart"), { description: product.name });
  };

  return (
    <div
      onClick={open}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg"
    >
      <div className="relative aspect-square bg-white p-3">
        {product.isDeal && (
          <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {t("pc.deal")}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-2 top-2 z-10 rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {t("pc.outOfStock")}
          </span>
        )}
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          name={product.name}
          className="h-full w-full"
          imgClassName="transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="text-xs font-medium uppercase tracking-wide text-amber-700">
          {product.brand}
        </div>
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-slate-900 transition group-hover:text-amber-700">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} size={13} />
          <span className="text-xs text-muted-foreground">
            {product.reviewCount.toLocaleString()}
          </span>
        </div>
        <PriceTag
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="md"
          className="mt-auto pt-1"
        />
        <button
          onClick={add}
          disabled={product.stock === 0}
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          <ShoppingCart size={15} /> {t("pc.addToCart")}
        </button>
      </div>
    </div>
  );
}

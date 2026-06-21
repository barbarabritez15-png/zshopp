"use client";

import { useView, type View } from "@/lib/store/view-store";
import { useT } from "@/lib/i18n/use-t";
import { Header } from "@/components/shop/header";
import { Footer } from "@/components/shop/footer";
import { HomeView } from "@/views/home-view";
import { BrowseGrid } from "@/components/shop/browse-grid";
import { ProductView } from "@/views/product-view";
import { CartView } from "@/views/cart-view";
import { CheckoutView } from "@/views/checkout-view";
import { OrdersView } from "@/views/orders-view";
import { ConfirmationView } from "@/views/confirmation-view";

export default function Home() {
  const view = useView((s) => s.view);
  const { t } = useT();

  function renderView(v: View) {
    switch (v.name) {
      case "home":
        return <HomeView />;
      case "all":
        return (
          <BrowseGrid
            title={t("browse.allProducts")}
            subtitle={t("browse.allProductsSub")}
          />
        );
      case "deals":
        return (
          <BrowseGrid
            deal
            title={t("browse.dealsTitle")}
            subtitle={t("browse.dealsSub")}
          />
        );
      case "featured":
        return (
          <BrowseGrid
            featured
            title={t("browse.featuredTitle")}
            subtitle={t("browse.featuredSub")}
          />
        );
      case "category":
        return (
          <BrowseGrid
            category={v.slug}
            title={t("cat." + v.slug) || v.categoryName || v.slug}
          />
        );
      case "product":
        return <ProductView slug={v.slug} />;
      case "search":
        return (
          <BrowseGrid
            q={v.q}
            title={t("browse.searchTitle")}
            subtitle={v.q ? t("browse.resultsFor", { q: v.q }) : undefined}
          />
        );
      case "cart":
        return <CartView />;
      case "checkout":
        return <CheckoutView />;
      case "orders":
        return <OrdersView />;
      case "order-confirmation":
        return <ConfirmationView orderNumber={v.orderNumber} />;
      default:
        return <HomeView />;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1">{renderView(view)}</main>
      <Footer />
    </div>
  );
}

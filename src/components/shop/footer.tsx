"use client";

import { useView } from "@/lib/store/view-store";
import { useT } from "@/lib/i18n/use-t";
import { useMoney } from "@/lib/i18n/use-money";
import { ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react";

export function Footer() {
  const go = useView((s) => s.go);
  const { t } = useT();
  const { format } = useMoney();
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      {/* Back to top */}
      <button
        onClick={() => go({ name: "home" })}
        className="block w-full bg-slate-800 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-700"
      >
        {t("footer.backToTop")}
      </button>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-bold text-white">
              {t("footer.knowUs")}
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="cursor-pointer transition hover:text-white">
                {t("footer.about")}
              </li>
              <li className="cursor-pointer transition hover:text-white">
                {t("footer.careers")}
              </li>
              <li className="cursor-pointer transition hover:text-white">
                {t("footer.press")}
              </li>
              <li className="cursor-pointer transition hover:text-white">
                {t("footer.sustainability")}
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold text-white">
              {t("footer.makeMoney")}
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="cursor-pointer transition hover:text-white">
                {t("footer.sell")}
              </li>
              <li className="cursor-pointer transition hover:text-white">
                {t("footer.affiliate")}
              </li>
              <li className="cursor-pointer transition hover:text-white">
                {t("footer.advertise")}
              </li>
              <li className="cursor-pointer transition hover:text-white">
                {t("footer.selfPublish")}
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold text-white">
              {t("footer.help")}
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => go({ name: "orders" })}
                  className="transition hover:text-white"
                >
                  {t("footer.yourOrders")}
                </button>
              </li>
              <li className="cursor-pointer transition hover:text-white">
                {t("footer.shippingRates")}
              </li>
              <li className="cursor-pointer transition hover:text-white">
                {t("footer.returns")}
              </li>
              <li className="cursor-pointer transition hover:text-white">
                {t("footer.helpCenter")}
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold text-white">
              {t("footer.whyZShop")}
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Truck size={16} className="text-amber-400" />{" "}
                {t("footer.freeShip", { amount: format(50) })}
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-400" />{" "}
                {t("footer.secureCheckout")}
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw size={16} className="text-amber-400" />{" "}
                {t("footer.30returns")}
              </li>
              <li className="flex items-center gap-2">
                <CreditCard size={16} className="text-amber-400" />{" "}
                {t("footer.encrypted")}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <button
            onClick={() => go({ name: "home" })}
            className="flex items-center gap-1.5"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-amber-400 text-base font-black text-slate-900">
              Z
            </span>
            <span className="text-lg font-bold text-white">Shop</span>
          </button>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Z Shop. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}

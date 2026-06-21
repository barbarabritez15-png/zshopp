"use client";

import { useCallback } from "react";
import { useLocale } from "./store";
import { useHydrated } from "@/hooks/use-hydrated";
import { CURRENCIES, DEFAULT_LOCALE, type Locale } from "./locales";
import { formatMoney } from "@/lib/format";

/**
 * Returns a `format(usd)` function that converts USD amounts into the currency
 * bound to the current language, plus the active currency config.
 *
 * Uses the default locale until hydrated (persisted locale lives in
 * localStorage) to avoid SSR/CSR hydration mismatches.
 */
export function useMoney() {
  const locale = useLocale((s) => s.locale);
  const hydrated = useHydrated();
  const eff: Locale = hydrated ? locale : DEFAULT_LOCALE;
  const format = useCallback((usd: number) => formatMoney(usd, eff), [eff]);
  return { format, currency: CURRENCIES[eff], locale: eff };
}

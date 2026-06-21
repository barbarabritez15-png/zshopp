"use client";

import { useCallback } from "react";
import { useLocale } from "./store";
import { useHydrated } from "@/hooks/use-hydrated";
import { DEFAULT_LOCALE, translate, type Locale } from "./locales";

/**
 * Returns a `t(key, vars?)` translator bound to the current locale.
 *
 * To avoid SSR/CSR hydration mismatches, the default locale is used until the
 * client has hydrated (the persisted locale lives in localStorage, which is
 * only available on the client). After hydration the real chosen locale is
 * used.
 */
export function useT() {
  const locale = useLocale((s) => s.locale);
  const hydrated = useHydrated();
  const eff: Locale = hydrated ? locale : DEFAULT_LOCALE;
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(eff, key, vars),
    [eff]
  );
  return { t, locale: eff };
}

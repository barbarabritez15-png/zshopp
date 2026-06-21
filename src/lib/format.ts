// Formatting helpers for Z Shop.

import { CURRENCIES, type Locale } from "./i18n/locales";

/** Format a USD amount as USD (internal/legacy use). */
export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

/**
 * Convert a USD amount into the currency bound to the given locale and format
 * it using that locale's conventions (symbol, decimal/thousands separators).
 *  - es -> Guaraní (PYG), 0 decimals
 *  - en -> US Dollar (USD), 2 decimals
 *  - pt -> Brazilian Real (BRL), 2 decimals
 */
export function formatMoney(usd: number, locale: Locale): string {
  const c = CURRENCIES[locale];
  const converted = usd * c.rateFromUSD;
  return new Intl.NumberFormat(c.intlLocale, {
    style: "currency",
    currency: c.code,
    maximumFractionDigits: c.code === "PYG" ? 0 : 2,
  }).format(converted);
}

export function formatOrderNumber(): string {
  const rand = (len: number) =>
    Math.random()
      .toString(36)
      .slice(2, 2 + len)
      .toUpperCase()
      .padEnd(len, "0");
  return `ZS-${rand(6)}-${rand(4)}`;
}

export function formatDate(iso: string, locale: Locale = "en"): string {
  const intlLocale =
    locale === "es" ? "es-PY" : locale === "pt" ? "pt-BR" : "en-US";
  return new Date(iso).toLocaleDateString(intlLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(iso: string, locale: Locale = "en"): string {
  const intlLocale =
    locale === "es" ? "es-PY" : locale === "pt" ? "pt-BR" : "en-US";
  return new Date(iso).toLocaleString(intlLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

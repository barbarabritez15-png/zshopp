"use client";

import { Globe, Check } from "lucide-react";
import { useLocale } from "@/lib/i18n/store";
import { useT } from "@/lib/i18n/use-t";
import { useHydrated } from "@/hooks/use-hydrated";
import { LOCALES } from "@/lib/i18n/locales";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { t, locale } = useT();
  const setLocale = useLocale((s) => s.setLocale);
  const hydrated = useHydrated();

  // Before hydration, show the default locale so SSR and first client render
  // match.
  const current =
    LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium text-white transition hover:bg-white/10"
          aria-label={t("header.language")}
        >
          <Globe size={18} />
          <span className="hidden md:inline">{current.label}</span>
          <span className="md:hidden">{current.short}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe size={14} /> {t("header.language")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLocale(l.code)}
            className="flex cursor-pointer items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="text-base leading-none">{l.flag}</span>
              {l.label}
            </span>
            {hydrated && l.code === locale && (
              <Check size={15} className="text-amber-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

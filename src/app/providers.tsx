"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

/** Keeps <html lang> in sync with the chosen locale. */
function LocaleSync() {
  const locale = useLocale((s) => s.locale);
  const hydrated = useHydrated();
  useEffect(() => {
    document.documentElement.lang = hydrated ? locale : DEFAULT_LOCALE;
  }, [locale, hydrated]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleSync />
      {children}
    </QueryClientProvider>
  );
}

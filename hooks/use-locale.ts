"use client";

import { useState, useEffect } from "react";
import { getLocale, detectBrowserLocale, config, type LocaleStrings, type Locale } from "@/lib/locales";

/**
 * @deprecated Use useLocaleContext from @/contexts/locale-context instead
 */
export function useLocale() {
  const [locale, setLocale] = useState<Locale>("en");
  const [t, setT] = useState<LocaleStrings>(getLocale("en"));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const detectedLocale = detectBrowserLocale();
    setLocale(detectedLocale);
    setT(getLocale(detectedLocale));
    setIsLoaded(true);
  }, []);

  return { t, locale, config, isLoaded };
}

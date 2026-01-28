"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getLocale, detectBrowserLocale, config, type LocaleStrings, type Locale } from "@/lib/locales";

interface LocaleContextType {
  t: LocaleStrings;
  locale: Locale;
  config: typeof config;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [t, setT] = useState<LocaleStrings>(getLocale("en"));

  useEffect(() => {
    const detectedLocale = detectBrowserLocale();
    setLocale(detectedLocale);
    setT(getLocale(detectedLocale));
  }, []);

  return (
    <LocaleContext.Provider value={{ t, locale, config }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocaleContext must be used within a LocaleProvider");
  }
  return context;
}

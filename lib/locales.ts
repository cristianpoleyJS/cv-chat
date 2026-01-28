import enCommon from "@/locales/en/common.json";
import esCommon from "@/locales/es/common.json";
import config from "@/locales/config.json";

export type Locale = "en" | "es";

const locales = {
  en: enCommon,
  es: esCommon,
} as const;

export type LocaleStrings = typeof enCommon;

export const getLocale = (locale: Locale = "en"): LocaleStrings => {
  return locales[locale] || locales.en;
};

export const getConfig = () => config;

export const detectBrowserLocale = (): Locale => {
  if (typeof window === "undefined") {
    return "en";
  }
  
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || "en";
  return browserLang.toLowerCase().startsWith("es") ? "es" : "en";
};

export const getLocalizedStrings = (): LocaleStrings => {
  const locale = detectBrowserLocale();
  return getLocale(locale);
};

export const t = getLocale("en");
export { config };

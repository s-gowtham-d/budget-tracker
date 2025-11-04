// lib/currency.ts
import { useAuthStore } from "@/store/authStore";

export const CURRENCY_SYMBOLS: Record<string, string> = {
  usd: "$",
  eur: "€",
  gbp: "£",
  inr: "₹",
  jpy: "¥",
  cad: "C$",
  aud: "A$",
};

export const CURRENCY_NAMES: Record<string, string> = {
  usd: "US Dollar",
  eur: "Euro",
  gbp: "British Pound",
  inr: "Indian Rupee",
  jpy: "Japanese Yen",
  cad: "Canadian Dollar",
  aud: "Australian Dollar",
};

export const CURRENCY_CODES: Record<string, string> = {
  usd: "USD",
  eur: "EUR",
  gbp: "GBP",
  inr: "INR",
  jpy: "JPY",
  cad: "CAD",
  aud: "AUD",
};

/**
 * Format amount based on user's currency preference
 */
export function formatCurrency(
  amount: number,
  currencyCode?: string,
  options?: Intl.NumberFormatOptions
): string {
  const { user } = useAuthStore.getState();
  const currency = currencyCode || user?.currency || "inr";
  const symbol = CURRENCY_SYMBOLS[currency.toLowerCase()] || "₹";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });

  return `${symbol}${formatter.format(Math.abs(amount))}`;
}

/**
 * Format currency with full locale support
 */
export function formatCurrencyLocale(
  amount: number,
  currencyCode?: string,
  locale?: string
): string {
  const { user } = useAuthStore.getState();
  const currency = currencyCode || user?.currency || "inr";
  const userLocale = locale || getLocaleFromLanguage(user?.language || "en");
  const code = CURRENCY_CODES[currency.toLowerCase()] || "INR";

  return new Intl.NumberFormat(userLocale, {
    style: "currency",
    currency: code,
  }).format(amount);
}

/**
 * Get locale string from language code
 */
function getLocaleFromLanguage(language: string): string {
  const localeMap: Record<string, string> = {
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    hi: "hi-IN",
  };
  return localeMap[language] || "en-US";
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currencyCode?: string): string {
  const { user } = useAuthStore.getState();
  const currency = currencyCode || user?.currency || "inr";
  return CURRENCY_SYMBOLS[currency.toLowerCase()] || "₹";
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
}

/**
 * Hook to use currency formatting
 */
export function useCurrency() {
  const { user } = useAuthStore();
  const currency = user?.currency || "inr";
  const symbol = CURRENCY_SYMBOLS[currency.toLowerCase()] || "₹";
  const code = CURRENCY_CODES[currency.toLowerCase()] || "INR";
  const name = CURRENCY_NAMES[currency.toLowerCase()] || "Indian Rupee";

  return {
    currency,
    symbol,
    code,
    name,
    format: (amount: number, options?: Intl.NumberFormatOptions) =>
      formatCurrency(amount, currency, options),
    formatLocale: (amount: number, locale?: string) =>
      formatCurrencyLocale(amount, currency, locale),
  };
}

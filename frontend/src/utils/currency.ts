import type { CurrencyCode, CurrencySettings } from "../types";

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  GBP: "£",
  PKR: "Rs. ",
  EUR: "€",
  AED: "د.إ ",
  INR: "₹",
  CAD: "CA$",
  AUD: "A$",
  NZD: "NZ$",
  BDT: "৳",
  LKR: "Rs",
  SAR: "﷼",
};

export const CURRENCY_LOCALE: Record<CurrencyCode, string> = {
  USD: "en-US",
  GBP: "en-GB",
  PKR: "en-PK",
  EUR: "de-DE",
  AED: "ar-AE",
  INR: "en-IN",
  CAD: "en-CA",
  AUD: "en-AU",
  NZD: "en-NZ",
  BDT: "bn-BD",
  LKR: "si-LK",
  SAR: "ar-SA",
};

/** Format a number in its own currency, e.g. formatMoney(2500, "PKR") -> "Rs. 2,500" */
export function formatMoney(amount: number, currency: CurrencyCode): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${symbol}${formatted}`;
}

/**
 * Convert an amount from one currency into the base currency using the
 * rates table (rates are expressed as "units of X per 1 base currency unit").
 */
export function toBase(
  amount: number,
  from: CurrencyCode,
  settings: CurrencySettings
): number {
  const rateFrom = settings.exchangeRates[from] ?? 1;
  return amount / rateFrom;
}

export function convert(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  settings: CurrencySettings
): number {
  const baseAmount = toBase(amount, from, settings);
  const rateTo = settings.exchangeRates[to] ?? 1;
  return baseAmount * rateTo;
}

/** Format an amount converted into the base currency, for dashboard totals */
export function formatInBase(
  amount: number,
  from: CurrencyCode,
  settings: CurrencySettings
): string {
  const baseAmount = toBase(amount, from, settings);
  return formatMoney(baseAmount, settings.baseCurrency);
}

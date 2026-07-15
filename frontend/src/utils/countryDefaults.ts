// Country → Currency defaults for ScholarOps MVP
// Covers all supported onboarding countries.

export interface CurrencyInfo {
  code: string;
  symbol: string;
}

export const COUNTRY_CURRENCY_MAP: Record<string, CurrencyInfo> = {
  "United States":  { code: "USD", symbol: "$"    },
  "Canada":         { code: "CAD", symbol: "CA$"  },
  "United Kingdom": { code: "GBP", symbol: "£"    },
  "Australia":      { code: "AUD", symbol: "A$"   },
  "New Zealand":    { code: "NZD", symbol: "NZ$"  },
  "India":          { code: "INR", symbol: "₹"    },
  "Pakistan":       { code: "PKR", symbol: "₨"    },
  "Bangladesh":     { code: "BDT", symbol: "৳"    },
  "Sri Lanka":      { code: "LKR", symbol: "Rs"   },
  "United Arab Emirates": { code: "AED", symbol: "د.إ" },
  "Saudi Arabia":   { code: "SAR", symbol: "﷼"   },
};

/** Sorted list of supported countries for <select> elements. */
export const SUPPORTED_COUNTRIES: string[] = Object.keys(COUNTRY_CURRENCY_MAP).sort();

/**
 * Returns the currency info for a given country name.
 * Falls back to USD if the country is not in the map.
 */
export function getCurrencyForCountry(country: string): CurrencyInfo {
  return COUNTRY_CURRENCY_MAP[country] ?? { code: "USD", symbol: "$" };
}

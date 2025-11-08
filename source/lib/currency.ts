export type SupportedCurrency = 'XAF' | 'EUR' | 'USD';

export const DEFAULT_CURRENCY: SupportedCurrency = 'XAF';

// Taux indicatifs. En production: requête API taux de change.
let exchangeRates: Record<SupportedCurrency, number> = {
  XAF: 1,
  EUR: 1 / 655.957 * 1.0, // 1 XAF ≈ 0.001524 EUR (approx)
  USD: 1 / 610 * 1.0, // 1 XAF ≈ 0.00164 USD (approx)
};

export function setExchangeRates(rates: Partial<Record<SupportedCurrency, number>>): void {
  exchangeRates = { ...exchangeRates, ...rates };
}

export function convertAmount(amountInXaf: number, target: SupportedCurrency): number {
  if (target === 'XAF') return amountInXaf;
  const rate = exchangeRates[target] ?? 1;
  return amountInXaf * rate;
}

export function formatAmount(amountInXaf: number, currency: SupportedCurrency, locale?: string): string {
  const value = convertAmount(amountInXaf, currency);
  const intl = new Intl.NumberFormat(locale ?? guessLocaleFromCurrency(currency), {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'XAF' ? 0 : 2,
  });
  return intl.format(value);
}

export function guessCurrencyByRegion(countryCode?: string): SupportedCurrency {
  const code = (countryCode ?? guessUserCountry()).toUpperCase();
  if (code === 'CM') return 'XAF';
  // Afrique zone CEMAC/CFA: map rapide
  const xafCountries = ['CM', 'GA', 'CG', 'TD', 'GQ', 'CF'];
  if (xafCountries.includes(code)) return 'XAF';
  // Europe -> EUR
  const euCountries = ['FR','DE','ES','IT','PT','BE','NL','LU','IE','AT','FI','GR','MT','CY','SI','SK','EE','LV','LT'];
  if (euCountries.includes(code)) return 'EUR';
  // Sinon USD par défaut hors Afrique/Europe
  return 'USD';
}

function guessUserCountry(): string {
  try {
    const locale = navigator.language || (Array.isArray(navigator.languages) ? navigator.languages[0] : 'en-US');
    const match = locale.match(/-([A-Z]{2})$/i);
    return match ? match[1].toUpperCase() : 'US';
  } catch {
    return 'US';
  }
}

function guessLocaleFromCurrency(currency: SupportedCurrency): string {
  switch (currency) {
    case 'XAF':
      return 'fr-CM';
    case 'EUR':
      return 'fr-FR';
    case 'USD':
      return 'en-US';
    default:
      return 'en-US';
  }
}




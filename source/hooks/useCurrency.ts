import { useState, useEffect } from 'react';

// Liste des devises supportées avec taux de change approximatifs
export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'Dollar américain', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  XAF: { code: 'XAF', symbol: 'FCFA', name: 'Franc CFA', rate: 600 },
  GBP: { code: 'GBP', symbol: '£', name: 'Livre sterling', rate: 0.79 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Dollar canadien', rate: 1.36 },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  'US': 'USD', 'CA': 'CAD', 'MX': 'USD',
  'FR': 'EUR', 'DE': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'GB': 'GBP',
  'CM': 'XAF', 'CF': 'XAF', 'TD': 'XAF', 'CG': 'XAF', 'GQ': 'XAF', 'GA': 'XAF',
  'SN': 'XAF', 'CI': 'XAF', 'ML': 'XAF', 'BF': 'XAF', 'TG': 'XAF', 'BJ': 'XAF', 'NE': 'XAF',
  'ZA': 'USD', 'NG': 'USD', 'KE': 'USD',
};

type Currency = typeof CURRENCIES[keyof typeof CURRENCIES];

export const useCurrency = () => {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES.USD);
  const [country, setCountry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const detectCountry = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Impossible de détecter le pays');
      
      const data = await response.json();
      setCountry(data.country_code);
      updateCurrencyBasedOnCountry(data.country_code);
    } catch (error) {
      console.error('Erreur détection pays:', error);
      setCurrency(CURRENCIES.USD);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrencyBasedOnCountry = (countryCode: string) => {
    const currencyCode = COUNTRY_TO_CURRENCY[countryCode] || 'USD';
    setCurrency(CURRENCIES[currencyCode]);
    localStorage.setItem('userCurrency', currencyCode);
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem('userCurrency') as CurrencyCode;
    
    if (savedCurrency && CURRENCIES[savedCurrency]) {
      setCurrency(CURRENCIES[savedCurrency]);
      setIsLoading(false);
    } else {
      detectCountry();
    }
  }, []);

  const changeCurrency = (newCurrencyCode: CurrencyCode) => {
    if (CURRENCIES[newCurrencyCode]) {
      setCurrency(CURRENCIES[newCurrencyCode]);
      localStorage.setItem('userCurrency', newCurrencyCode);
    }
  };

  const formatPrice = (price: number, currencyCode?: CurrencyCode) => {
    const targetCurrency = currencyCode ? CURRENCIES[currencyCode] : currency;
    return `${targetCurrency.symbol} ${(price * targetCurrency.rate).toFixed(2)}`;
  };

  return {
    currency,
    country,
    isLoading,
    currencies: CURRENCIES,
    changeCurrency,
    formatPrice,
  };
};

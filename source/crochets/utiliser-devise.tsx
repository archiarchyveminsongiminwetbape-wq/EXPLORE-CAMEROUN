import * as React from 'react';
import { SupportedCurrency, guessCurrencyByRegion } from '@/lib/currency';

type CurrencyContextValue = {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
};

const CurrencyContext = React.createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = React.useState<SupportedCurrency>(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('currency') as SupportedCurrency | null) : null;
    return saved ?? guessCurrencyByRegion();
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('currency', currency);
    } catch {}
  }, [currency]);

  const value = React.useMemo(() => ({ currency, setCurrency }), [currency]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = React.useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}




import * as React from 'react';
import { Locale, messages } from '@/lib/i18n';

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState<Locale>(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('locale') as Locale | null) : null;
    return saved ?? 'fr';
  });

  React.useEffect(() => {
    try { localStorage.setItem('locale', locale); } catch {}
  }, [locale]);

  const t = React.useCallback((key: string) => {
    return messages[locale][key] ?? key;
  }, [locale]);

  const value = React.useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}




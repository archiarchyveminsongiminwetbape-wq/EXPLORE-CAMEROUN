import * as React from 'react';
import { SupportedCurrency, formatAmount } from '@/lib/currency';

export type CartItem = {
  id: string;
  title: string;
  priceXaf: number; // prix de base en XAF
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  setQuantity: (id: string, quantity: number) => void;
  totalXaf: number;
  totalFormatted: (currency: SupportedCurrency) => string;
};

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('cart:items');
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try { localStorage.setItem('cart:items', JSON.stringify(items)); } catch {}
  }, [items]);

  const addItem = React.useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  const setQuantity = React.useCallback((id: string, quantity: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []);

  const totalXaf = React.useMemo(() => items.reduce((sum, i) => sum + i.priceXaf * i.quantity, 0), [items]);

  const totalFormatted = React.useCallback((currency: SupportedCurrency) => formatAmount(totalXaf, currency), [totalXaf]);

  const value = React.useMemo(
    () => ({ items, addItem, removeItem, clear, setQuantity, totalXaf, totalFormatted }),
    [items, addItem, removeItem, clear, setQuantity, totalXaf, totalFormatted]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}




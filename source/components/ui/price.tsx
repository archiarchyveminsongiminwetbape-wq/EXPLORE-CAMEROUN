import { useAuth } from '@/contexts/AuthContext';

interface PriceProps {
  amount: number;
  className?: string;
  currencyCode?: string;
}

export function Price({ amount, className = '', currencyCode }: PriceProps) {
  const { currency } = useAuth();
  const formattedPrice = currency.formatPrice(amount, currencyCode as any);
  
  return <span className={className}>{formattedPrice}</span>;
}

import { useCurrency, type CurrencyCode } from '@/hooks/useCurrency';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export function CurrencySelector() {
  const { currency, currencies, changeCurrency, isLoading } = useCurrency();

  if (isLoading) {
    return <div className="px-4 py-2">Chargement...</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {currency.code} {currency.symbol}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(currencies).map(([code, { name, symbol }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => changeCurrency(code as CurrencyCode)}
            className="cursor-pointer"
          >
            {name} ({code} {symbol})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

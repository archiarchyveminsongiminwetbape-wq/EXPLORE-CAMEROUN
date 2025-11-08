import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/interface utilisateur/button';
import { useCurrency } from '@/crochets/utiliser-devise';
import type { SupportedCurrency } from '@/lib/currency';

interface HeaderProps {
  cartItemsCount?: number;
}

export default function Header({ cartItemsCount = 0 }: HeaderProps) {
  const { currency, setCurrency } = useCurrency();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-green-600">
              Explore Cameroun
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-600">
              Accueil
            </Link>
            <Link to="/destinations" className="text-gray-600 hover:text-green-600">
              Destinations
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-green-600">
              À propos
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-green-600">
              Contact
            </Link>
            <Link to="/admin/transactions" className="text-gray-600 hover:text-green-600">
              Admin
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <select
              aria-label="Devise"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value="XAF">XAF (FCFA)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-green-600 text-xs text-white flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
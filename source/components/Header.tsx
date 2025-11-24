import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ShoppingCart, Phone } from 'lucide-react';
import { Button } from '@/components/interface utilisateur/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/interface utilisateur/sheet';
import { Badge } from '@/components/interface utilisateur/badge';
import { useCurrency } from '@/crochets/utiliser-devise';
import type { SupportedCurrency } from '@/lib/currency';
import { useI18n } from '@/crochets/utiliser-i18n';

interface HeaderProps {
  cartItemsCount?: number;
}

export default function Header({ cartItemsCount = 0 }: HeaderProps) {
  const { currency, setCurrency } = useCurrency();
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: "J'organise mon voyage", href: '/organize-trip' },
    { name: 'Nos Destinations', href: '/destinations' },
    { name: 'À propos', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Admin', href: '/admin/transactions' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/assets/final_quest_240x240__.png" alt="Explore Afrique" className="h-10 w-10" />
            <span className="text-xl font-bold text-green-700">Explore Afrique</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${
                  isActive(item.href) ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Language */}
            <select
              aria-label="Language"
              value={locale}
              onChange={(e) => setLocale(e.target.value as any)}
              className="hidden sm:block border rounded-md px-2 py-1 text-sm"
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
            {/* Currency */}
            <select
              aria-label="Devise"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
              className="hidden sm:block border rounded-md px-2 py-1 text-sm"
            >
              <option value="XAF">XAF (FCFA)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>

            {/* Cart */}
            <Link to="/organize-trip" className="relative">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Ouvrir le menu"
                  aria-expanded={isOpen}
                  aria-controls="mobile-menu"
                  className="inline-flex items-center"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80" id="mobile-menu">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-green-600 ${
                        isActive(item.href) ? 'text-green-600' : 'text-gray-700'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                    <a 
                      href="https://wa.me/237657029080" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Phone className="h-4 w-4 mr-2" />
                        WhatsApp: 657029080
                      </Button>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
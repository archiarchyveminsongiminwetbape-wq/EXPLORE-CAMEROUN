import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Calendar, Info, BookOpen, Shield, LucideIcon } from 'lucide-react';

// Interface pour les éléments de navigation
interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

// Configuration de navigation avec types stricts
const navigation: NavigationItem[] = [
  { name: 'Accueil', href: '/', icon: MapPin },
  { name: "J'organise mon voyage", href: '/organize-trip', icon: Calendar },
  { name: 'Nos Destinations', href: '/destinations', icon: MapPin },
  { name: 'À propos', href: '/about', icon: Info },
  { name: 'Blog', href: '/blog', icon: BookOpen },
  { name: 'Admin', href: '/admin', icon: Shield },
];

export default function Header(): React.JSX.Element {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  // Gestion de l'échappement pour fermer le menu mobile
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Empêcher le scroll du body quand le menu est ouvert
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            aria-label="Retour à l'accueil"
          >
            <img 
              src="/assets/final_quest_240x240__.png" 
              alt="Logo Explore Afrique" 
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              loading="eager"
            />
            <span className="text-xl sm:text-2xl font-bold text-green-700 whitespace-nowrap">
              Explore Afrique
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2" role="navigation">
            {navigation.map((item: NavigationItem) => {
              const IconComponent = item.icon;
              const isItemActive = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    isItemActive 
                      ? 'text-green-600 bg-green-50 border-b-2 border-green-600' 
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                  aria-current={isItemActive ? 'page' : undefined}
                >
                  <IconComponent className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="lg:hidden flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
              {navigation.map((item: NavigationItem) => {
                const IconComponent = item.icon;
                const isItemActive = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      isItemActive
                        ? 'text-green-600 bg-green-50 border-l-4 border-green-600'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                    aria-current={isItemActive ? 'page' : undefined}
                  >
                    <IconComponent className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity duration-200"
          onClick={closeMobileMenu}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              closeMobileMenu();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Fermer le menu"
        />
      )}
    </header>
  );
}
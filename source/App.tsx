import { Toaster } from '@/components/interface utilisateur/sonner';
import { TooltipProvider } from '@/components/interface utilisateur/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Destinations from '@/pages/Destinations';
import OrganizeTrip from '@/pages/OrganizeTrip';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import NotFound from '@/pages/NotFound';
import { CurrencyProvider } from '@/crochets/utiliser-devise';
import { I18nProvider } from '@/crochets/utiliser-i18n';
import { CartProvider } from '@/crochets/utiliser-panier';
import Checkout from '@/pages/Checkout';
import PayMTN from '@/pages/PayMTN';
import PayOrange from '@/pages/PayOrange';
import PayCard from '@/pages/PayCard';
import PaymentCallback from '@/pages/PaymentCallback';
import AdminTransactions from '@/pages/AdminTransactions';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <CurrencyProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/organize-trip" element={<OrganizeTrip />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/pay/mtn" element={<PayMTN />} />
                <Route path="/pay/orange" element={<PayOrange />} />
                <Route path="/pay/card" element={<PayCard />} />
                <Route path="/payment/callback" element={<PaymentCallback />} />
                <Route path="/admin/transactions" element={<AdminTransactions />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </CurrencyProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
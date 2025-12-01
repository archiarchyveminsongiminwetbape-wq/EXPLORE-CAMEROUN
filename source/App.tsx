import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ErrorBoundary } from 'react-error-boundary'
import { useEffect } from 'react'

// Pages publiques
import Index from '@/pages/Index'
import Destinations from '@/pages/Destinations'
import OrganizeTrip from '@/pages/OrganizeTrip'
import About from '@/pages/About'
import Blog from '@/pages/Blog'
import NotFound from '@/pages/NotFound'
import { CurrencyProvider } from '@/crochets/utiliser-devise'
import { I18nProvider } from '@/crochets/utiliser-i18n'
import { CartProvider } from '@/crochets/utiliser-panier'
import Checkout from '@/pages/Checkout'
import PayMTN from '@/pages/PayMTN'
import PayOrange from '@/pages/PayOrange'
import PayCard from '@/pages/PayCard'
import PaymentCallback from '@/pages/PaymentCallback'
import AdminTransactions from '@/pages/AdminTransactions'

// Pages d'authentification
import { LoginForm } from '@/components/auth/LoginForm'

// Layouts
import { AdminLayout } from '@/layouts/AdminLayout'

// Pages d'administration
import AdminDashboard from '@/pages/admin/Dashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Composant pour afficher les erreurs
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div role="alert" className="p-4 max-w-2xl mx-auto mt-10 bg-red-50 rounded-lg">
      <h2 className="text-xl font-bold text-red-800">Une erreur est survenue</h2>
      <pre className="mt-2 p-4 bg-white rounded text-red-600 overflow-auto">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Réessayer
      </button>
    </div>
  )
}

// Composant pour protéger les routes d'administration
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

// Composant pour gérer le scroll en haut de page lors du changement de route
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Composant principal de l'application
const AppContent = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TooltipProvider>
        <Toaster position="top-right" richColors closeButton />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Routes publiques */}
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
            
            {/* Routes d'authentification */}
            <Route path="/login" element={<LoginForm />} />
            
            {/* Routes d'administration protégées */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminTransactions />} />
              <Route path="transactions" element={<AdminTransactions />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

// Fournisseurs de contexte principaux
const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <CurrencyProvider>
        <CartProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </CartProvider>
      </CurrencyProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
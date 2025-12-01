import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCurrency } from '@/crochets/utiliser-devise'
import { Button } from '@/components/ui/button'
import { LogOut, Home, Calendar, Users, Package, CreditCard, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SupportedCurrency } from '@/lib/currency'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AdminNav() {
  const { signOut, isAdmin, isOwner } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { 
      name: 'Tableau de bord', 
      path: '/admin', 
      icon: <Home className="h-4 w-4" />,
      roles: ['admin', 'owner']
    },
    { 
      name: 'Réservations', 
      path: '/admin/bookings', 
      icon: <Calendar className="h-4 w-4" />,
      roles: ['admin', 'owner']
    },
    { 
      name: 'Biens', 
      path: '/admin/properties', 
      icon: <Package className="h-4 w-4" />,
      roles: ['admin', 'owner']
    },
    { 
      name: 'Paiements', 
      path: '/admin/payments', 
      icon: <CreditCard className="h-4 w-4" />,
      roles: ['admin']
    },
    { 
      name: 'Utilisateurs', 
      path: '/admin/users', 
      icon: <Users className="h-4 w-4" />,
      roles: ['admin']
    },
  ]

  const { currency, setCurrency } = useCurrency()
  const currencies: { value: SupportedCurrency; label: string }[] = [
    { value: 'XAF', label: 'FCFA' },
    { value: 'EUR', label: 'EUR' },
    { value: 'USD', label: 'USD' },
  ]

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex flex-col border-b p-4">
          <div className="flex items-center justify-between">
            <Link className="flex items-center gap-2 font-semibold" to="/admin">
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="mt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-between">
                  {currencies.find(c => c.value === currency)?.label || 'XAF'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {currencies.map((curr) => (
                  <DropdownMenuItem 
                    key={curr.value} 
                    onClick={() => setCurrency(curr.value)}
                    className={cn(currency === curr.value && 'bg-accent')}
                  >
                    {curr.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {navItems
              .filter(item => isAdmin || item.roles.includes('owner'))
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    location.pathname === item.path
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  )
}

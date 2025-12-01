import { useState, useMemo } from 'react'
import { useBookings } from '@/hooks/useBookings'
import { BookingStatus, RoomBooking } from '@/types/booking'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'
import { Calendar as CalendarIcon, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const statusVariant = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const filters = {
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(dateRange?.from && { startDate: format(dateRange.from, 'yyyy-MM-dd') }),
    ...(dateRange?.to && { endDate: format(dateRange.to, 'yyyy-MM-dd') })
  }

  const { bookings, loading, page, totalPages, setPage } = useBookings(filters)

  const filteredBookings = useMemo(() => {
    if (!searchTerm) return bookings.map(b => b.resource as RoomBooking)

    const searchLower = searchTerm.toLowerCase()
    return bookings
      .filter(
        (b) =>
          b.resource.guestName.toLowerCase().includes(searchLower) ||
          b.resource.id.toLowerCase().includes(searchLower) ||
          b.resource.guestEmail?.toLowerCase().includes(searchLower)
      )
      .map(b => b.resource as RoomBooking)
  }, [bookings, searchTerm])

  const handleStatusUpdate = async (id: string, status: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status, 
          updatedAt: new Date().toISOString() 
        })
        .eq('id', id)

      if (error) throw error
      toast.success('Statut mis à jour avec succès')
      // Recharger les réservations
      window.location.reload()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut')
      console.error(error)
    }
  }

  const clearFilters = () => {
    setStatusFilter('all')
    setDateRange(undefined)
    setSearchTerm('')
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des réservations</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Réinitialiser les filtres
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une réservation..."
            className="pl-8"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select 
          value={statusFilter} 
          onValueChange={(value: BookingStatus | 'all') => setStatusFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmé</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                <div className="text-sm text-gray-500">
                  {format(dateRange.from, 'PPP', { locale: fr })}
                  {dateRange.to && ` - ${format(dateRange.to, 'PPP', { locale: fr })}`}
                </div>
              ) : (
                <span>Filtrer par date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange || { from: undefined, to: undefined }}
              onSelect={setDateRange as any}
              numberOfMonths={2}
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucune réservation trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">#{booking.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-medium">{booking.guestName}</span>
                      <span className="ml-2 text-sm text-gray-500">{booking.guestEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{format(new Date(booking.startDate as string), 'PPP', { locale: fr })}</div>
                    <div className="text-sm text-muted-foreground">
                      au {format(new Date(booking.endDate as string), 'PPP', { locale: fr })}
                    </div>
                  </TableCell>
                  <TableCell>{booking.totalPrice.toLocaleString()} FCFA</TableCell>
                  <TableCell>
                    <Badge className={cn(statusVariant[booking.status])}>
                      {booking.status === 'pending' && 'En attente'}
                      {booking.status === 'confirmed' && 'Confirmé'}
                      {booking.status === 'cancelled' && 'Annulé'}
                      {booking.status === 'completed' && 'Terminé'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                        >
                          Confirmer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                        >
                          Annuler
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(booking.id, 'completed')}
                      >
                        Marquer comme terminé
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prevPage: number) => Math.max(1, prevPage - 1))}
            disabled={page === 1}
          >
            Précédent
          </Button>
          <span className="text-sm">
            Page {page} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prevPage: number) => Math.min(totalPages, prevPage + 1))}
            disabled={page === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { RoomBooking, BookingStatus, CalendarEvent } from '@/types/booking'

interface UseBookingsReturn {
  bookings: CalendarEvent[]
  loading: boolean
  page: number
  totalPages: number
  setPage: (page: number | ((prevPage: number) => number)) => void
  refresh: () => Promise<void>
  createBooking: (booking: Omit<RoomBooking, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<{ success: boolean; error?: Error }>
}

export const useBookings = (filters: Record<string, any> = {}): UseBookingsReturn => {
  const [bookings, setBookings] = useState<RoomBooking[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(0)
  const pageSize = 10

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .order('createdAt', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      // Appliquer les filtres
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          if (key === 'startDate' && value) {
            query = query.gte('startDate', new Date(value).toISOString().split('T')[0])
          } else {
            query = query.eq(key, value)
          }
        }
      })

      const { data, count, error } = await query

      if (error) throw error

      // Convertir les dates en objets Date
      const formattedData = (data || []).map(booking => ({
        ...booking,
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate),
        createdAt: new Date(booking.createdAt),
        updatedAt: booking.updatedAt ? new Date(booking.updatedAt) : undefined
      } as RoomBooking))

      setBookings(formattedData)
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }, [page, JSON.stringify(filters)])

  // S'abonner aux changements en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('bookings_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings' 
        }, 
        () => {
          fetchBookings()
        }
      )
      .subscribe()

    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchBookings])

  // Chargement initial et rechargement lors du changement de page ou de filtre
  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const createBooking = async (booking: Omit<RoomBooking, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...booking,
          status: 'pending' as const,
          startDate: booking.startDate instanceof Date ? booking.startDate.toISOString() : booking.startDate,
          endDate: booking.endDate instanceof Date ? booking.endDate.toISOString() : booking.endDate,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchBookings();
      return { success: true };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('An unknown error occurred') 
      };
    }
  };

  return {
    bookings: bookings.map(b => ({
      start: new Date(b.startDate),
      end: new Date(b.endDate),
      title: `Réservation - ${b.guestName}`,
      resource: b
    })),
    loading,
    page,
    totalPages: Math.ceil(totalCount / pageSize),
    setPage,
    refresh: fetchBookings,
    createBooking,
  }
}

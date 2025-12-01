import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Room, RoomType, SpecialOffer } from '@/types/booking';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      setRooms(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSpecialOffers = useCallback(async () => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now);

      if (error) throw error;
      setSpecialOffers(data || []);
    } catch (err) {
      console.error('Error fetching special offers:', err);
    }
  }, []);

  const getRoomWithOffers = useCallback((room: Room) => {
    const applicableOffers = specialOffers.filter(offer => 
      offer.roomTypes.includes(room.type) &&
      (!offer.minNights || offer.minNights <= 1)
    );

    return {
      ...room,
      specialOffers: applicableOffers,
    };
  }, [specialOffers]);

  const getDiscountedPrice = useCallback((room: Room, nights: number): number => {
    const roomWithOffers = getRoomWithOffers(room);
    
    if (roomWithOffers.specialOffers.length === 0) {
      return room.price * nights;
    }

    const bestOffer = roomWithOffers.specialOffers[0];
    let discountedPrice = room.price * nights;

    if (bestOffer.discountType === 'percentage') {
      const discount = (room.price * nights * bestOffer.discountValue) / 100;
      discountedPrice -= discount;
    } else {
      discountedPrice -= bestOffer.discountValue * nights;
    }

    return Math.max(0, discountedPrice);
  }, [getRoomWithOffers]);

  useEffect(() => {
    fetchRooms();
    fetchSpecialOffers();
  }, [fetchRooms, fetchSpecialOffers]);

  return {
    rooms,
    loading,
    error,
    getRoomWithOffers,
    getDiscountedPrice,
    addRoom: async (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('rooms')
          .insert(room)
          .select()
          .single();

        if (error) throw error;

        setRooms(prev => [...prev, data]);
        return { success: true, room: data };
      } catch (err) {
        setError(err as Error);
        return { success: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    updateRoom: async (room: Room) => {
      try {
        setLoading(true);
        const { error } = await supabase
          .from('rooms')
          .update(room)
          .eq('id', room.id);

        if (error) throw error;

        setRooms(prev => 
          prev.map(r => (r.id === room.id ? room : r))
        );
        return { success: true };
      } catch (err) {
        setError(err as Error);
        return { success: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    refreshRooms: fetchRooms,
  };
}

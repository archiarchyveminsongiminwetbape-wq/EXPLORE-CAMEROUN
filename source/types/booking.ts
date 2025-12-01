export type RoomType = 'standard' | 'deluxe' | 'suite' | 'family';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  price: number;
  capacity: number;
  description: string;
  amenities: string[];
  imageUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RoomBooking {
  id: string;
  roomId: string;
  startDate: Date | string;
  endDate: Date | string;
  guestName: string;
  guestEmail: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  specialRequests?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: Date | string;
  endDate: Date | string;
  roomTypes: RoomType[];
  minNights?: number;
  maxNights?: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface BookingFormData {
  guestName: string;
  guestEmail: string;
  specialRequests?: string;
}

// Types pour le calendrier
export interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  allDay?: boolean;
  resource?: any;
}

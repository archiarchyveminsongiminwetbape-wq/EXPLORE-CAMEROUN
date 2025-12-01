export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Booking {
  id: string
  destination: string
  property: string
  guestName: string
  guestEmail: string
  guestPhone: string
  checkIn: Date | string
  checkOut: Date | string
  guests: number
  rooms: number
  totalAmount: number
  status: BookingStatus
  specialRequests?: string
  createdAt: Date | string
  updatedAt?: Date | string
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  activities: string[];
  accommodations: {
    name: string;
    type: string;
    price: number;
  }[];
  restaurants: {
    name: string;
    cuisine: string;
    priceRange: string;
  }[];
  transports: {
    type: string;
    price: number;
  }[];
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'lodge' | 'guesthouse' | 'resort';
  pricePerNight: number;
  rating: number;
  destinationId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  pricePerMeal: number;
  rating: number;
  destinationId: string;
}

export interface Transport {
  id: string;
  type: 'bus' | 'car' | 'plane' | 'boat';
  name: string;
  price: number;
  destinationId: string;
}

export interface CartItem {
  type: 'destination' | 'accommodation' | 'restaurant' | 'transport' | 'flight' | 'insurance';
  id: string;
  name: string;
  price: number;
  quantity: number;
  details?: Record<string, string | number>;
}

export interface BookingDetails {
  destination: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  accommodation?: string;
  restaurant?: string;
  transport?: string;
  needsFlight: boolean;
  needsInsurance: boolean;
}
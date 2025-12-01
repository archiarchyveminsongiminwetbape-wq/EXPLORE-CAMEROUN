import { useState } from 'react';
import { useRouter } from 'next/router';
import { AvailabilityCalendar } from '@/components/booking/AvailabilityCalendar';
import { RoomManagement } from '@/components/booking/RoomManagement';
import { BookingForm } from '@/components/booking/BookingForm';
import { useBookings } from '@/hooks/useBookings';
import { useRooms } from '@/hooks/useRooms';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function BookRoom() {
  const router = useRouter();
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showRoomManagement, setShowRoomManagement] = useState(false);

  const { bookings, createBooking } = useBookings();
  const { rooms, loading: roomsLoading, addRoom } = useRooms();

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDates({
      start: slotInfo.start,
      end: slotInfo.end,
    });
  };

  const handleBookingSubmit = async (bookingData: {
    guestName: string;
    guestEmail: string;
    specialRequests?: string;
  }) => {
    if (!selectedRoom || !selectedDates.start || !selectedDates.end) return;

    const room = rooms.find(r => r.id === selectedRoom);
    if (!room) return;

    const days = Math.ceil(
      (selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24)
    );

    await createBooking({
      roomId: selectedRoom,
      startDate: selectedDates.start,
      endDate: selectedDates.end,
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail,
      specialRequests: bookingData.specialRequests,
      totalPrice: room.price * days,
    });

    // Reset form
    setSelectedDates({ start: null, end: null });
    setSelectedRoom(null);
    
    // Rediriger vers la page de confirmation
    router.push('/booking/confirmation');
  };

  const clearSelection = () => {
    setSelectedDates({ start: null, end: null });
    setSelectedRoom(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Réserver une chambre</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Disponibilités</h2>
              {selectedDates.start && selectedDates.end && (
                <button
                  onClick={clearSelection}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <X className="h-4 w-4 mr-1" /> Réinitialiser
                </button>
              )}
            </div>
            <AvailabilityCalendar
              bookings={bookings}
              onSelectSlot={handleSelectSlot}
            />
          </div>

          {selectedDates.start && selectedDates.end && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Détails de la réservation</h2>
              <BookingForm
                selectedDates={selectedDates}
                rooms={rooms}
                selectedRoom={selectedRoom}
                onRoomSelect={setSelectedRoom}
                onSubmit={handleBookingSubmit}
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chambres disponibles</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRoomManagement(!showRoomManagement)}
              >
                {showRoomManagement ? 'Cacher la gestion' : 'Gérer les chambres'}
              </Button>
            </div>

            {showRoomManagement ? (
              <RoomManagement
                rooms={rooms}
                onUpdateRoom={(room) => console.log('Update room:', room)}
                onAddRoom={addRoom}
              />
            ) : (
              <div className="space-y-4">
                {roomsLoading ? (
                  <p>Chargement des chambres...</p>
                ) : (
                  rooms.map((room) => (
                    <div
                      key={room.id}
                      className={`p-4 border rounded-lg cursor-pointer ${
                        selectedRoom === room.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedRoom(room.id)}
                    >
                      <h3 className="font-medium">{room.name}</h3>
                      <p className="text-sm text-gray-600">{room.type}</p>
                      <p className="text-lg font-semibold">{room.price} FCFA/nuit</p>
                      <p className="text-sm">Capacité: {room.capacity} personnes</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Room, RoomType } from '@/types/booking';
import { useRooms } from '@/hooks/useRooms';

interface BookingFormProps {
  selectedDates: { start: Date | null; end: Date | null };
  rooms: Room[];
  selectedRoom: string | null;
  onRoomSelect: (roomId: string) => void;
  onSubmit: (data: {
    guestName: string;
    guestEmail: string;
    specialRequests?: string;
  }) => void;
}

export function BookingForm({
  selectedDates,
  rooms,
  selectedRoom,
  onRoomSelect,
  onSubmit,
}: BookingFormProps) {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const { getRoomWithOffers, getDiscountedPrice } = useRooms();

  const selectedRoomData = rooms.find(room => room.id === selectedRoom);
  const nights = selectedDates.start && selectedDates.end
    ? Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const totalPrice = selectedRoomData 
    ? selectedRoomData.price * nights 
    : 0;

  const discountedPrice = selectedRoomData && selectedDates.start && selectedDates.end
    ? getDiscountedPrice(selectedRoomData, nights)
    : null;

  const roomWithOffers = selectedRoomData 
    ? getRoomWithOffers(selectedRoomData)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ guestName, guestEmail, specialRequests });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Période sélectionnée</h3>
        <p>
          Du {selectedDates.start?.toLocaleDateString('fr-FR')} au{' '}
          {selectedDates.end?.toLocaleDateString('fr-FR')} ({nights} nuits)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Chambre</label>
        <select
          value={selectedRoom || ''}
          onChange={(e) => onRoomSelect(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="">Sélectionnez une chambre</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} - {room.price} FCFA/nuit
            </option>
          ))}
        </select>
      </div>

      {selectedRoom && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Détails de la chambre</h4>
          <p>Type: {selectedRoomData?.type}</p>
          <p>Capacité: {selectedRoomData?.capacity} personnes</p>
          
          {roomWithOffers?.specialOffers && roomWithOffers.specialOffers.length > 0 && (
            <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-yellow-700 font-medium">Offre spéciale !</p>
              <p className="text-yellow-600 text-sm">
                {roomWithOffers.specialOffers[0].description}
              </p>
              <p className="text-yellow-600 text-sm">
                Prix réduit: {discountedPrice} FCFA au lieu de {totalPrice} FCFA
              </p>
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="font-medium">
              Prix total: {discountedPrice ? (
                <>
                  <span className="line-through text-gray-500 mr-2">{totalPrice} FCFA</span>
                  <span className="text-green-600">{discountedPrice} FCFA</span>
                </>
              ) : (
                `${totalPrice} FCFA`
              )}
            </p>
            <p className="text-sm text-gray-500">({nights} nuits)</p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Votre nom complet</label>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Votre email</label>
        <input
          type="email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Demandes spéciales (optionnel)
        </label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={!selectedRoom}
        >
          Réserver maintenant
        </button>
      </div>
    </form>
  );
}

import { useState } from 'react';
import { Room, RoomType } from '@/types/booking';

interface RoomManagementProps {
  rooms: Room[];
  onUpdateRoom: (room: Room) => void;
  onAddRoom: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function RoomManagement({ rooms, onUpdateRoom, onAddRoom }: RoomManagementProps) {
  const [newRoom, setNewRoom] = useState<Omit<Room, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    type: 'standard',
    price: 0,
    capacity: 2,
    description: '',
    amenities: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRoom(newRoom);
    setNewRoom({
      name: '',
      type: 'standard',
      price: 0,
      capacity: 2,
      description: '',
      amenities: [],
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Gestion des Chambres</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom de la chambre</label>
            <input
              type="text"
              value={newRoom.name}
              onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Type de chambre</label>
            <select
              value={newRoom.type}
              onChange={(e) => setNewRoom({...newRoom, type: e.target.value as RoomType})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="family">Familiale</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prix par nuit (FCFA)</label>
            <input
              type="number"
              value={newRoom.price}
              onChange={(e) => setNewRoom({...newRoom, price: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Capacité (personnes)</label>
            <input
              type="number"
              value={newRoom.capacity}
              onChange={(e) => setNewRoom({...newRoom, capacity: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={newRoom.description}
            onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Ajouter la chambre
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h4 className="text-md font-medium mb-4">Liste des chambres</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room.id} className="border rounded-lg p-4">
              <h5 className="font-medium">{room.name}</h5>
              <p className="text-sm text-gray-600">{room.type}</p>
              <p className="text-lg font-semibold">{room.price} FCFA/nuit</p>
              <p className="text-sm">Capacité: {room.capacity} personnes</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

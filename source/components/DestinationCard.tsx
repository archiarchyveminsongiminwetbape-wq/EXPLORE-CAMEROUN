import { Card, CardContent, CardFooter, CardHeader } from '@/components/interface utilisateur/card';
import { Button } from '@/components/interface utilisateur/button';
import { Badge } from '@/components/interface utilisateur/badge';
import { MapPin, Star } from 'lucide-react';
import { Destination } from '@/types';
import { useCurrency } from '@/crochets/utiliser-devise';
import { formatAmount } from '@/lib/currency';

interface DestinationCardProps {
  destination: Destination;
  onDiscover: (destination: Destination) => void;
}

export default function DestinationCard({ destination, onDiscover }: DestinationCardProps) {
  const { currency } = useCurrency();
  const getCategoryColor = (region: string) => {
    // Simple region-based coloring; fallback to gray
    if (!region) return 'bg-gray-100 text-gray-800';
    const r = region.toLowerCase();
    if (r.includes('littoral') || r.includes('sud')) return 'bg-green-100 text-green-800';
    if (r.includes('ouest') || r.includes('centre')) return 'bg-blue-100 text-blue-800';
    if (r.includes('nord') || r.includes('extrême')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (region: string) => {
    return region || 'Autre';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <img 
            src={destination.image} 
            alt={destination.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge className={getCategoryColor(destination.region)}>
              {getCategoryLabel(destination.region)}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">4.5</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{destination.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{destination.region}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{destination.description}</p>
        <div className="mt-3">
          <span className="text-lg font-bold text-green-600">
            {formatAmount(destination.price, currency)}
          </span>
          <span className="text-sm text-gray-500 ml-1">à partir de</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onDiscover(destination)}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Découvrir
        </Button>
      </CardFooter>
    </Card>
  );
}
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Pied de page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/interface utilisateur/card';
import { Button } from '@/components/interface utilisateur/button';
import { Input } from '@/components/interface utilisateur/input';
import { Label } from '@/components/interface utilisateur/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/interface utilisateur/select';
import { Checkbox } from '@/components/interface utilisateur/checkbox';
import { Separator } from '@/components/interface utilisateur/separator';
import { Badge } from '@/components/interface utilisateur/badge';
import { Calendar, Users, MapPin, Bed, Utensils, Car, Plane, Shield, CreditCard, Trash2, Plus } from 'lucide-react';
import { destinations, accommodations, restaurants, transports } from '@/données/destinations';
import { Destination, CartItem, BookingDetails } from '@/types';

export default function OrganizeTrip() {
  const location = useLocation();
  const selectedDestination = location.state?.selectedDestination as Destination;
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    destination: selectedDestination?.id || '',
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    needsFlight: false,
    needsInsurance: false
  });
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedTransport, setSelectedTransport] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (selectedDestination) {
      addToCart({
        type: 'destination',
        id: selectedDestination.id,
        name: selectedDestination.name,
        price: selectedDestination.price,
        quantity: 1
      });
    }
  }, [selectedDestination]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id && cartItem.type === item.type);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id && cartItem.type === item.type
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string, type: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.type === type)));
  };

  const updateCartQuantity = (id: string, type: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, type);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.type === type
          ? { ...item, quantity }
          : item
      )
    );
  };

  const calculateTotal = () => {
    const baseTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const nights = bookingDetails.startDate && bookingDetails.endDate 
      ? Math.ceil((new Date(bookingDetails.endDate).getTime() - new Date(bookingDetails.startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 1;
    
    let accommodationTotal = 0;
    const accommodationItem = cart.find(item => item.type === 'accommodation');
    if (accommodationItem) {
      accommodationTotal = accommodationItem.price * nights * bookingDetails.numberOfPeople;
    }
    
    let restaurantTotal = 0;
    const restaurantItem = cart.find(item => item.type === 'restaurant');
    if (restaurantItem) {
      restaurantTotal = restaurantItem.price * nights * 3 * bookingDetails.numberOfPeople; // 3 meals per day
    }

    return baseTotal + accommodationTotal + restaurantTotal;
  };

  const handleAddAccommodation = () => {
    if (!selectedAccommodation) return;
    const accommodation = accommodations.find((acc: { id: string; }) => acc.id === selectedAccommodation);
    if (accommodation) {
      // Remove existing accommodation first
      setCart(prev => prev.filter(item => item.type !== 'accommodation'));
      
      addToCart({
        type: 'accommodation',
        id: accommodation.id,
        name: accommodation.name,
        price: accommodation.pricePerNight,
        quantity: 1,
        details: { type: accommodation.type, rating: accommodation.rating }
      });
      setSelectedAccommodation('');
    }
  };

  const handleAddRestaurant = () => {
    if (!selectedRestaurant) return;
    const restaurant = restaurants.find((rest: { id: string; }) => rest.id === selectedRestaurant);
    if (restaurant) {
      // Remove existing restaurant first
      setCart(prev => prev.filter(item => item.type !== 'restaurant'));
      
      addToCart({
        type: 'restaurant',
        id: restaurant.id,
        name: restaurant.name,
        price: restaurant.pricePerMeal,
        quantity: 1,
        details: { cuisine: restaurant.cuisine, rating: restaurant.rating }
      });
      setSelectedRestaurant('');
    }
  };

  const handleAddTransport = () => {
    if (!selectedTransport) return;
    const transport = transports.find((trans: { id: string; }) => trans.id === selectedTransport);
    if (transport) {
      // Remove existing transport first
      setCart(prev => prev.filter(item => item.type !== 'transport'));
      
      addToCart({
        type: 'transport',
        id: transport.id,
        name: transport.name,
        price: transport.price,
        quantity: 1,
        details: { type: transport.type }
      });
      setSelectedTransport('');
    }
  };

  const handleAddFlight = () => {
    if (bookingDetails.needsFlight) {
      addToCart({
        type: 'flight',
        id: 'flight-1',
        name: 'Billet d\'avion aller-retour',
        price: 450000,
        quantity: bookingDetails.numberOfPeople
      });
    } else {
      removeFromCart('flight-1', 'flight');
    }
  };

  const handleAddInsurance = () => {
    if (bookingDetails.needsInsurance) {
      addToCart({
        type: 'insurance',
        id: 'insurance-1',
        name: 'Assurance sanitaire voyage',
        price: 25000,
        quantity: bookingDetails.numberOfPeople
      });
    } else {
      removeFromCart('insurance-1', 'insurance');
    }
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      alert('Veuillez ajouter au moins un service à votre panier');
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      alert('Veuillez sélectionner un moyen de paiement');
      return;
    }
    
    // Simulate payment process
    alert(`Paiement de ${calculateTotal().toLocaleString()} FCFA confirmé via ${paymentMethod}. Merci pour votre réservation !`);
    
    // Reset form
    setCart([]);
    setShowPaymentForm(false);
    setPaymentMethod('');
  };

  useEffect(() => {
    handleAddFlight();
  }, [bookingDetails.needsFlight, bookingDetails.numberOfPeople]);

  useEffect(() => {
    handleAddInsurance();
  }, [bookingDetails.needsInsurance, bookingDetails.numberOfPeople]);

  const handleDestinationChange = (value: string) => {
    setBookingDetails(prev => ({ ...prev, destination: value }));
    // Add destination to cart when selected
    const destination = destinations.find(d => d.id === value);
    if (destination) {
      setCart(prev => prev.filter(item => item.type !== 'destination'));
      addToCart({
        type: 'destination',
        id: destination.id,
        name: destination.name,
        price: destination.price,
        quantity: 1
      });
    }
  };

  const currentDestination = destinations.find(dest => dest.id === bookingDetails.destination);
  const availableAccommodations = accommodations.filter(acc => acc.destinationId === bookingDetails.destination);
  const availableRestaurants = restaurants.filter(rest => rest.destinationId === bookingDetails.destination);
  const availableTransports = transports.filter(trans => trans.destinationId === bookingDetails.destination);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemsCount={cart.length} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">J'organise mon voyage</h1>
          <p className="text-gray-600">Personnalisez votre séjour selon vos préférences et votre budget</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Destination Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Choisir une destination
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={bookingDetails.destination} onValueChange={handleDestinationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map(destination => (
                      <SelectItem key={destination.id} value={destination.id}>
                        {destination.name} - {destination.region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {currentDestination && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start gap-4">
                      <img 
                        src={currentDestination.image} 
                        alt={currentDestination.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-green-800">{currentDestination.name}</h3>
                        <p className="text-sm text-green-600">{currentDestination.region}</p>
                        <p className="text-sm text-gray-600 mt-1">{currentDestination.description}</p>
                        <p className="text-lg font-bold text-green-700 mt-2">
                          {currentDestination.price.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dates and People */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Dates et nombre de personnes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Date d'arrivée</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={bookingDetails.startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingDetails(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Date de départ</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={bookingDetails.endDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingDetails(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="people">Nombre de personnes</Label>
                    <Input
                    id="people"
                    type="number"
                    min="1"
                    max="20"
                    value={bookingDetails.numberOfPeople}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingDetails(prev => ({ ...prev, numberOfPeople: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Accommodation */}
            {bookingDetails.destination && availableAccommodations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    Hébergement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={selectedAccommodation} onValueChange={setSelectedAccommodation}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Choisir un hébergement" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAccommodations.map(accommodation => (
                          <SelectItem key={accommodation.id} value={accommodation.id}>
                            {accommodation.name} - {accommodation.pricePerNight.toLocaleString()} FCFA/nuit
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddAccommodation} disabled={!selectedAccommodation}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Restaurant */}
            {bookingDetails.destination && availableRestaurants.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Restaurant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Choisir un restaurant" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRestaurants.map(restaurant => (
                          <SelectItem key={restaurant.id} value={restaurant.id}>
                            {restaurant.name} - {restaurant.cuisine} - {restaurant.pricePerMeal.toLocaleString()} FCFA/repas
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddRestaurant} disabled={!selectedRestaurant}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transport */}
            {bookingDetails.destination && availableTransports.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Transport local
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={selectedTransport} onValueChange={setSelectedTransport}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Choisir un transport" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTransports.map(transport => (
                          <SelectItem key={transport.id} value={transport.id}>
                            {transport.name} - {transport.price.toLocaleString()} FCFA
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddTransport} disabled={!selectedTransport}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services additionnels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flight"
                    checked={bookingDetails.needsFlight}
                    onCheckedChange={(checked: boolean) => setBookingDetails(prev => ({ ...prev, needsFlight: checked }))}
                  />
                  <Label htmlFor="flight" className="flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    Billet d'avion aller-retour (450,000 FCFA/personne)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="insurance"
                    checked={bookingDetails.needsInsurance}
                    onCheckedChange={(checked: boolean) => setBookingDetails(prev => ({ ...prev, needsInsurance: checked }))}
                  />
                  <Label htmlFor="insurance" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Assurance sanitaire voyage (25,000 FCFA/personne)
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shopping Cart */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Votre panier ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Votre panier est vide</p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {cart.map((item, index) => (
                        <div key={`${item.type}-${item.id}-${index}`} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <Badge variant="outline" className="mt-1">
                              {item.type === 'destination' && 'Destination'}
                              {item.type === 'accommodation' && 'Hébergement'}
                              {item.type === 'restaurant' && 'Restaurant'}
                              {item.type === 'transport' && 'Transport'}
                              {item.type === 'flight' && 'Vol'}
                              {item.type === 'insurance' && 'Assurance'}
                            </Badge>
                            <div className="flex items-center gap-2 mt-2">
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCartQuantity(item.id, item.type, parseInt(e.target.value) || 1)}
                                className="w-16 h-8"
                              />
                              <span className="text-sm font-medium">
                                {(item.price * item.quantity).toLocaleString()} FCFA
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id, item.type)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">{calculateTotal().toLocaleString()} FCFA</span>
                      </div>
                      {bookingDetails.startDate && bookingDetails.endDate && (
                        <p className="text-sm text-gray-600">
                          Pour {Math.ceil((new Date(bookingDetails.endDate).getTime() - new Date(bookingDetails.startDate).getTime()) / (1000 * 60 * 60 * 24))} nuit(s)
                          et {bookingDetails.numberOfPeople} personne(s)
                        </p>
                      )}
                    </div>
                    
                    {!showPaymentForm ? (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700" 
                        size="lg"
                        onClick={handleProceedToPayment}
                      >
                        Procéder au paiement
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="payment">Moyen de paiement</Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir un moyen de paiement" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mobile-money">Mobile Money</SelectItem>
                              <SelectItem value="orange-money">Orange Money</SelectItem>
                              <SelectItem value="carte-bancaire">Carte Bancaire</SelectItem>
                              <SelectItem value="virement">Virement Bancaire</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setShowPaymentForm(false)}
                          >
                            Retour
                          </Button>
                          <Button 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={handlePayment}
                          >
                            Payer
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <a 
                        href="https://wa.me/237657029080" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:underline"
                      >
                        Besoin d'aide ? Contactez-nous
                      </a>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
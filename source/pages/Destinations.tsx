import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DestinationCard from '@/components/DestinationCard';
import { Button } from '@/components/interface utilisateur/button';
import { Input } from '@/components/interface utilisateur/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/interface utilisateur/select';
import { Search, Filter } from 'lucide-react';
import { destinations, regions } from '@/data/destinations';
import { Destination } from '@/types';

export default function Destinations() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const filteredDestinations = destinations
      .filter(destination => {
      const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          destination.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          destination.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || destination.region === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleDiscover = (destination: Destination) => {
    navigate('/organize-trip', { state: { selectedDestination: destination } });
  };

  const getCategoryLabel = (region: string) => {
    if (!region || region === 'all') return 'Toutes';
    return region;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Nos Destinations
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Découvrez les merveilles du Cameroun à travers nos destinations 
            soigneusement sélectionnées pour vous offrir des expériences uniques.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher une destination..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Filtres:</span>
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r === 'Toutes' ? 'all' : r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nom A-Z</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                Aucune destination trouvée pour vos critères de recherche.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                }}
                variant="outline"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-lg text-gray-600">
                  {filteredDestinations.length} destination{filteredDestinations.length > 1 ? 's' : ''} 
                  {categoryFilter !== 'all' && ` dans la catégorie "${getCategoryLabel(categoryFilter)}"`}
                  {searchTerm && ` correspondant à "${searchTerm}"`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onDiscover={handleDiscover}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Besoin d'aide pour choisir ?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Notre équipe d'experts est là pour vous conseiller et vous aider 
            à trouver la destination parfaite selon vos envies.
          </p>
          <a href="https://wa.me/237657029080" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary">
              Contacter un expert
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
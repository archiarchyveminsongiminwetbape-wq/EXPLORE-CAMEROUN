import { Link } from 'react-router-dom';
import { Button } from '@/components/interface utilisateur/button';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/assets/final_quest_240x240__.png" 
                alt="Explore Afrique" 
                className="h-10 w-10"
              />
              <span className="text-xl font-bold text-green-400">Explore Afrique</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Votre partenaire de confiance pour découvrir les merveilles du Cameroun. 
              Nous organisons des voyages authentiques et mémorables pour les touristes 
              nationaux et internationaux.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation rapide */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-green-400 transition-colors">Accueil</Link></li>
              <li><Link to="/organize-trip" className="text-gray-300 hover:text-green-400 transition-colors">J'organise mon voyage</Link></li>
              <li><Link to="/destinations" className="text-gray-300 hover:text-green-400 transition-colors">Nos Destinations</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors">À propos</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-green-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Contact</h3>
            <div className="space-y-3">
              <a 
                href="https://wa.me/237657029080" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+237 657 029 080</span>
              </a>
              <a 
                href="mailto:minsongipaul@icloud.com"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>minsongipaul@icloud.com</span>
              </a>
              <a 
                href="mailto:pminsongi@gmail.com"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>pminsongi@gmail.com</span>
              </a>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Cameroun</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Explore Afrique. Tous droits réservés. | 
            Découvrez le Cameroun authentique avec passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
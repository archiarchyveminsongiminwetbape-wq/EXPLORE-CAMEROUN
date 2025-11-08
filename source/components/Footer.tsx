import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">À propos</h3>
            <p className="text-sm">
              Explore Cameroun est votre partenaire de confiance pour découvrir les merveilles
              du Cameroun. Nous vous offrons des expériences de voyage uniques et authentiques.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/destinations" className="text-sm hover:text-green-500">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-green-500">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-green-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-green-500">
                  Conditions générales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+237 657 029 080</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@explorecameroun.com" className="text-sm hover:text-green-500">
                  contact@explorecameroun.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Douala, Cameroun</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Newsletter</h3>
            <p className="text-sm">
              Abonnez-vous à notre newsletter pour recevoir nos dernières offres et actualités.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-3 py-2 bg-gray-800 rounded text-white text-sm"
              />
              <button
                type="submit"
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} Explore Cameroun. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/interface utilisateur/card';
import { Button } from '@/components/interface utilisateur/button';
import { MapPin, Users, Award, Heart, Target, Eye, ArrowRight } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'Nous aimons le Cameroun et nous voulons partager cette passion avec vous'
    },
    {
      icon: Users,
      title: 'Service Client',
      description: 'Votre satisfaction est notre priorité absolue'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Nous nous efforçons d\'offrir des expériences de qualité supérieure'
    },
    {
      icon: Target,
      title: 'Authenticité',
      description: 'Des expériences vraies et respectueuses des cultures locales'
    }
  ];

  const team = [
    {
      name: 'Paul Minsongi',
      role: 'Fondateur & Directeur',
      description: 'Passionné de tourisme et expert du Cameroun depuis plus de 10 ans',
      image: '/assets/img4.jpg'
    },
    {
      name: 'Équipe Locale',
      role: 'Guides Experts',
      description: 'Des guides locaux expérimentés dans chaque région du Cameroun',
      image: '/assets/img5.jpg'
    },
    {
      name: 'Service Client',
      role: 'Support 24/7',
      description: 'Une équipe dédiée pour vous accompagner avant, pendant et après votre voyage',
      image: '/assets/img6.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            À Propos d'Explore Afrique
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Votre partenaire de confiance pour découvrir les merveilles du Cameroun. 
            Nous créons des expériences de voyage authentiques et mémorables.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Explore Afrique a été créé avec une mission simple mais ambitieuse : 
                permettre à tous, nationaux et internationaux, de découvrir la richesse 
                exceptionnelle du Cameroun à travers des voyages organisés et personnalisés.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Nous croyons que le tourisme peut être un vecteur de développement 
                économique et culturel, tout en préservant l'authenticité et la beauté 
                naturelle de notre pays.
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Notre Vision</h3>
                  <p className="text-gray-600">Faire du Cameroun une destination touristique de référence en Afrique</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/Mont Cameroun.jpg" 
                alt="Mont Cameroun" 
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que nous faisons
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous prenons en charge tous les aspects de votre voyage pour vous offrir 
              une expérience sans stress et inoubliable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sélection de Destinations</h3>
                <p className="text-gray-600">
                  Nous sélectionnons soigneusement les plus beaux sites touristiques 
                  du Cameroun pour vous offrir des expériences uniques.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Organisation Complète</h3>
                <p className="text-gray-600">
                  Hébergement, restauration, transport, billets d'avion, assurance - 
                  nous nous occupons de tout pour votre confort.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Accompagnement Personnalisé</h3>
                <p className="text-gray-600">
                  Chaque voyage est unique. Nous adaptons nos services selon 
                  vos préférences et votre budget.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600">
              Les principes qui guident notre action au quotidien
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600">
              Des professionnels passionnés à votre service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Voyageurs satisfaits</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <div className="text-green-100">Destinations</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5</div>
              <div className="text-green-100">Années d'expérience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-green-100">Support client</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Prêt à découvrir le Cameroun ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez les centaines de voyageurs qui nous font confiance 
            pour leurs aventures camerounaises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/organize-trip">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Organiser mon voyage
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="https://wa.me/237657029080" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                Nous contacter
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
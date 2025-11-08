import { Link } from 'react-router-dom';
import { Button } from '@/components/interface utilisateur/button';
import { Card, CardContent } from '@/components/interface utilisateur/card';
import { MapPin, Users, Shield, Plane, ArrowRight, Star, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCurrency } from '@/crochets/utiliser-devise';
import React from 'react';

const i18n = {
  fr: {
    heroTitle: 'Découvrez le Cameroun Authentique',
    heroSubtitle: 'Votre voyage parfait vous attend. Nous organisons tout pour vous : hébergement, transport, activités et bien plus encore.',
    organizeBtn: 'Organiser mon voyage',
    seeDestBtn: 'Voir les destinations',
    featuresTitle: 'Pourquoi choisir Explore Afrique ?',
    featuresDesc: 'Nous prenons soin de chaque détail de votre voyage pour vous offrir une expérience inoubliable au Cameroun.',
    destPopular: 'Destinations Populaires',
    destPopularDesc: 'Découvrez quelques-unes de nos destinations les plus prisées',
    seeAllDest: 'Voir toutes les destinations',
    howItWorks: 'Comment ça marche ?',
    howItWorksSteps: ['Choisissez votre destination', 'Personnalisez votre séjour', 'Réservez et partez'],
    howItWorksTips: ['Parcourez nos destinations et sélectionnez celle qui vous inspire','Ajoutez hébergement, transport, activités selon vos préférences','Finalisez votre réservation et préparez-vous à vivre l\'aventure'],
    testimonials: 'Ce que disent nos voyageurs',
    testimonialsDesc: 'Des expériences authentiques partagées par nos clients',
    readyTitle: "Prêt pour l'aventure ?", readySubtitle: "Laissez-nous organiser le voyage de vos rêves au Cameroun. Une expérience unique vous attend !", startTrip: 'Commencer mon voyage', contactUs: 'Nous contacter',
  },
  en: {
    heroTitle: 'Discover Authentic Cameroon',
    heroSubtitle: 'Your perfect trip is waiting for you. We organize everything for you: accommodation, transport, activities and more.',
    organizeBtn: 'Plan my trip',
    seeDestBtn: 'View Destinations',
    featuresTitle: 'Why Choose Explore Africa?',
    featuresDesc: 'We take care of every detail of your trip to provide an unforgettable experience in Cameroon.',
    destPopular: 'Popular Destinations',
    destPopularDesc: 'Discover some of our most popular destinations',
    seeAllDest: 'See all destinations',
    howItWorks: 'How does it work?',
    howItWorksSteps: ['Choose your destination', 'Customize your stay', 'Book and go'],
    howItWorksTips: ['Browse our destinations and pick one you love','Add accommodation, transport, activities as you like','Complete your booking and get ready for adventure'],
    testimonials: 'What travelers say',
    testimonialsDesc: 'Authentic experiences shared by our clients',
    readyTitle: 'Ready for adventure?', readySubtitle: 'Let us arrange your dream Cameroon journey. Unique memories await!', startTrip: 'Start my trip', contactUs: 'Contact us',
  }
};

export default function Index() {
  const features = [
    {
      icon: MapPin,
      title: 'Destinations Authentiques',
      description: 'Découvrez les plus beaux sites touristiques du Cameroun'
    },
    {
      icon: Users,
      title: 'Service Personnalisé',
      description: 'Un accompagnement sur mesure pour chaque voyageur'
    },
    {
      icon: Shield,
      title: 'Assurance Voyage',
      description: 'Voyagez en toute sérénité avec nos assurances'
    },
    {
      icon: Plane,
      title: 'Réservation Complète',
      description: 'Billets d\'avion, hébergement, transport tout inclus'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      location: 'France',
      text: 'Un voyage inoubliable au Mont Cameroun ! L\'organisation était parfaite.',
      rating: 5,
      image: '/assets/img1.jpg'
    },
    {
      name: 'John Smith',
      location: 'USA',
      text: 'Les chutes de la Lobé sont magnifiques. Service client exceptionnel.',
      rating: 5,
      image: '/assets/img2.jpg'
    },
    {
      name: 'Amadou Bello',
      location: 'Cameroun',
      text: 'Fier de redécouvrir mon pays avec Explore Afrique. Très professionnel !',
      rating: 5,
      image: '/assets/img3.jpg'
    }
  ];

  const [lang, setLang] = React.useState<'fr'|'en'>('fr');
  const t = i18n[lang];
  const { currency } = useCurrency();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-row justify-end p-2 gap-3">
        <label className="text-sm mr-2">{lang==='fr' ? 'Langue' : 'Language'}:</label>
        <select value={lang} onChange={e => setLang(e.target.value as 'fr'|'en')} className="border rounded text-xs px-1 py-0.5">
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
        <div className="ml-8 text-xs py-1">{lang==='fr'?'Devise':'Currency'}: <span className="font-semibold">{currency}</span></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/Chutes de la Lobé.jpg" 
            alt="Cameroun Tourism" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {t.heroTitle}
            <span className="text-green-400 block">Cameroun Authentique</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <Link to="/organize-trip">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
                {t.organizeBtn}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/destinations">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4">
                {t.seeDestBtn}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.featuresTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.featuresDesc}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.destPopular}
            </h2>
            <p className="text-xl text-gray-600">
              {t.destPopularDesc}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="relative group overflow-hidden rounded-lg">
              <img 
                src="/assets/Mont Cameroun.jpg" 
                alt="Mont Cameroun" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Mont Cameroun</h3>
                <p className="text-sm">Le toit de l'Afrique de l'Ouest</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-lg">
              <img 
                src="/assets/Palais Royal de Foumban.jpg" 
                alt="Palais Royal de Foumban" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Palais Royal de Foumban</h3>
                <p className="text-sm">Patrimoine culturel Bamoun</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-lg">
              <img 
                src="/assets/Parc National de Waza.jpg" 
                alt="Parc National de Waza" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Parc National de Waza</h3>
                <p className="text-sm">Safari dans la savane</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/destinations">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                {t.seeAllDest}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.howItWorks}
            </h2>
            <p className="text-xl text-gray-600">
              Organisez votre voyage en 3 étapes simples
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.howItWorksSteps[0]}</h3>
              <p className="text-gray-600">{t.howItWorksTips[0]}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.howItWorksSteps[1]}</h3>
              <p className="text-gray-600">{t.howItWorksTips[1]}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.howItWorksSteps[2]}</h3>
              <p className="text-gray-600">{t.howItWorksTips[2]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.testimonials}
            </h2>
            <p className="text-xl text-gray-600">
              {t.testimonialsDesc}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t.readyTitle}
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            {t.readySubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/organize-trip">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                {t.startTrip}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="https://wa.me/237657029080" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4">
                {t.contactUs}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
export interface Destination {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
  price: number; // Prix moyen estimé pour un séjour (FCFA)
  rating: number;
  activities: string[];
  accommodations: {
    name: string;
    type: string;
    price: number; // Prix par nuit estimé (FCFA)
  }[];
  restaurants: {
    name: string;
    cuisine: string;
    priceRange: string; // Économique, Modéré, Élevé
  }[];
  transports: {
    type: string;
    price: number; // Prix estimé du transport (FCFA)
  }[];
  paymentMethods: string[]; // Moyen de paiement supporté
}

// ⚠️ N'oubliez pas que pour le paiement et la notification, 
// la collecte de l'adresse e-mail doit précéder la validation finale 
// de la transaction via un agrégateur de paiement.

export const destinations: Destination[] = [
  // 1️⃣ Mont Cameroun - Buéa
  {
    id: "mont-cameroun",
    name: "Mont Cameroun",
    region: "Sud-Ouest",
    description: "Le plus haut sommet d'Afrique de l'Ouest, lieu idéal pour le trekking et les vues panoramiques.",
    image: "/assets/Mont Cameroun.jpg",
    price: 250000,
    rating: 4.8,
    activities: ["Trekking", "Randonnée", "Ascension", "Observation de la nature"],
    accommodations: [
      { name: "Fini Hotel", type: "Hôtel", price: 45000 },
      { name: "Mountain Hotel", type: "Hôtel", price: 60000 },
    ],
    restaurants: [
      { name: "Savoy Restaurant", cuisine: "Internationale", priceRange: "Modéré" },
      { name: "Mountain Hotel Restaurant", cuisine: "Locale/Européenne", priceRange: "Modéré" },
    ],
    transports: [
      { type: "Taxi/Navette Buéa", price: 10000 },
      { type: "Voiture de location", price: 30000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money", "Visa/Mastercard"],
  },
  // 2️⃣ Chutés de la Lobé & 19️⃣ Le Phare - Kribi
  {
    id: "kribi-chutes-phare",
    name: "Kribi (Chutes de la Lobé & Phare)",
    region: "Sud",
    description: "Ville côtière célèbre pour ses plages, les chutes se jetant dans la mer et son phare historique.",
    image: "/assets/Le Phare de Kribi.jpg",
    price: 150000,
    rating: 4.5,
    activities: ["Plage", "Pêche", "Chutes de la Lobé", "Visite du Phare"],
    accommodations: [
      { name: "Les Gîtes de Kribi", type: "Hôtel/Résidence", price: 60000 },
      { name: "l’Hôtel du Phare", type: "Hôtel", price: 75000 },
      { name: "Hôtel Le Phare", type: "Hôtel", price: 80000 },
    ],
    restaurants: [
      { name: "Le Touloulou", cuisine: "Fruits de mer", priceRange: "Modéré" },
      { name: "Le Calypso-Kribi", cuisine: "Internationale", priceRange: "Élevé" },
    ],
    transports: [
      { type: "Bus", price: 15000 },
      { type: "Taxi", price: 35000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money", "Visa/Mastercard"],
  },
  // 3️⃣ The Botanic Garden - Limbé
  {
    id: "limbe-botanic-garden",
    name: "Jardin Botanique de Limbé",
    region: "Sud-Ouest",
    description: "Ville balnéaire avec plages de sable noir et l'un des plus anciens jardins botaniques d'Afrique.",
    image: "/assets/Jardin Botanique de Limbé.jpg",
    price: 180000,
    rating: 4.3,
    activities: ["Jardin botanique", "Zoo de Limbé", "Plage volcanique", "Exploration"],
    accommodations: [
      { name: "Seme Beach Hotel", type: "Hôtel", price: 80000 },
      { name: "Park Hotel Mirama", type: "Hôtel", price: 55000 },
    ],
    restaurants: [
      { name: "Le Panoramique", cuisine: "Internationale", priceRange: "Élevé" },
      { name: "The LK restaurant", cuisine: "Locale/Européenne", priceRange: "Modéré" },
    ],
    transports: [
      { type: "Bus", price: 20000 },
      { type: "Location de voiture", price: 45000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money", "Visa/Mastercard", "PayPal"],
  },
  // 4️⃣ Le Domaine de Petpenoun - Kouoptamo
  {
    id: "domaine-petpenoun",
    name: "Le Domaine de Petpenoun",
    region: "Ouest",
    description: "Un complexe hôtelier et de loisirs offrant des activités nautiques et de détente dans un cadre naturel.",
    image: "/assets/Le Domaine de Petpenoun.jpg",
    price: 300000,
    rating: 4.6,
    activities: ["Activités nautiques", "Équitation", "Détente", "Golf"],
    accommodations: [
      { name: "Le Domaine de Petpenoun", type: "Résidence/Resort", price: 90000 },
    ],
    restaurants: [
      { name: "restaurant du Domaine", cuisine: "Gastronomie", priceRange: "Élevé" },
    ],
    transports: [
      { type: "Bus/Taxi Bafoussam", price: 25000 },
      { type: "Voiture de location", price: 50000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money", "Visa/Mastercard"],
  },
  // 5️⃣ Le Lamidat de Ngaoundéré - Ngaoundéré
  {
    id: "lamidat-ngaoundere",
    name: "Le Lamidat de Ngaoundéré",
    region: "Adamaoua",
    description: "Centre du pouvoir traditionnel, un site d'une grande importance historique et culturelle dans le Grand Nord.",
    image: "/assets/Le Lamidat de Ngaoundéré.jpg",
    price: 180000,
    rating: 4.0,
    activities: ["Visite culturelle", "Découverte historique", "Artisanat local"],
    accommodations: [
      { name: "Adamaoua Hotel", type: "Hôtel", price: 35000 },
      { name: "Vina Hotel", type: "Hôtel", price: 40000 },
    ],
    restaurants: [
      { name: "La Plazza Restaurant", cuisine: "Locale/Internationale", priceRange: "Modéré" },
    ],
    transports: [
      { type: "Train (Transcamerounais)", price: 25000 },
      { type: "Taxi local", price: 5000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money", "Visa/Mastercard"],
  },
  // 6️⃣ Les chutes d’Ekom Nkam - Melong
  {
    id: "chutes-ekom-nkam",
    name: "Les chutes d’Ekom Nkam",
    region: "Ouest",
    description: "Des cascades majestueuses rendues célèbres par le film 'Greystoke, la légende de Tarzan'.",
    image: "/assets/Les chutes d’Ekom Nkam.jpg",
    price: 120000,
    rating: 4.7,
    activities: ["Randonnée", "Observation de la nature", "Photographie"],
    accommodations: [
      { name: "Villa Luciole", type: "Hébergement simple", price: 25000 },
      { name: "Kemal Hotel", type: "Hôtel", price: 30000 },
    ],
    restaurants: [
      { name: "Restaurant le Festival", cuisine: "Locale", priceRange: "Économique" },
    ],
    transports: [
      { type: "Taxi Bafang/Melong", price: 15000 },
      { type: "Voiture 4x4", price: 35000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money"],
  },
  // 7️⃣ Musée National - Yaoundé
  {
    id: "musee-national-yaounde",
    name: "Musée National",
    region: "Centre",
    description: "Situé dans l'ancien palais présidentiel, il expose l'histoire, l'art et les cultures du Cameroun.",
    image: "/assets/Musée National.jpg",
    price: 80000,
    rating: 4.1,
    activities: ["Visite culturelle", "Histoire", "Architecture"],
    accommodations: [
      { name: "Hôtel Mont Fébé", type: "Hôtel", price: 85000 },
      { name: "Hilton Hotel", type: "Hôtel", price: 120000 },
    ],
    restaurants: [
      { name: "Restaurant La Salsa", cuisine: "Internationale", priceRange: "Élevé" },
    ],
    transports: [
      { type: "Taxi urbain", price: 3000 },
      { type: "Moto-Taxi", price: 1500 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money", "Visa/Mastercard"],
  },
  // 8️⃣ Musée Maritime - Douala
  {
    id: "musee-maritime-douala",
    name: "Musée Maritime",
    region: "Littoral",
    description: "Musée moderne dédié à l'histoire et aux activités maritimes de la ville portuaire de Douala.",
    image: "/assets/Musée Maritime.jpg",
    price: 70000,
    rating: 3.9,
    activities: ["Visite culturelle", "Histoire maritime"],
    accommodations: [
      { name: "StarLand Hotel", type: "Hôtel", price: 70000 },
      { name: "Hôtel La Falaise", type: "Hôtel", price: 95000 },
    ],
    restaurants: [
      { name: "Restaurant 5 Fourchettes", cuisine: "Gastronomie", priceRange: "Élevé" },
    ],
    transports: [
      { type: "Taxi urbain", price: 3000 },
      { type: "Moto-Taxi", price: 1500 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money", "Visa/Mastercard"],
  },
  // 9️⃣ La Réserve de Faune du Dja
  {
    id: "reserve-faune-dja",
    name: "La Réserve de Faune du Dja",
    region: "Sud-Est",
    description: "Patrimoine mondial de l'UNESCO, une vaste forêt tropicale préservée abritant des espèces rares.",
    image: "/assets/La Réserve de Faune du Dja.jpg",
    price: 280000,
    rating: 4.7,
    activities: ["Randonnée en forêt", "Observation de primates", "Écotourisme"],
    accommodations: [
      { name: "Logements éco-touristiques locaux", type: "Campement", price: 40000 },
      // Aucune autre donnée fournie, ajouter un campement typique
    ],
    restaurants: [
      { name: "Cuisine locale (communautaire)", cuisine: "Locale", priceRange: "Économique" },
      // Aucune autre donnée fournie
    ],
    transports: [
      { type: "Voiture 4x4 Yaoundé", price: 70000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money"],
  },
  // 🔟 Palais Royal de Foumban
  {
    id: "palais-royal-foumban",
    name: "Palais Royal de Foumban",
    region: "Ouest",
    description: "Siège du royaume Bamoun, abritant un musée riche en œuvres d'art et artefacts royaux.",
    image: "/assets/Palais Royal de Foumban.jpg",
    price: 130000,
    rating: 4.4,
    activities: ["Visite culturelle", "Musée Bamoun", "Artisanat"],
    accommodations: [
      { name: "Hôtel BULON", type: "Hôtel", price: 30000 },
      { name: "Hôtel Pekassa De Karche", type: "Hôtel", price: 25000 },
    ],
    restaurants: [
      { name: "Restaurant le Safari", cuisine: "Locale/Internationale", priceRange: "Modéré" },
    ],
    transports: [
      { type: "Bus Bafoussam", price: 10000 },
      { type: "Taxi local", price: 3000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money"],
  },
  // 1️⃣1️⃣ Parc National de Korup - Sud-Ouest Cameroun
  {
    id: "parc-national-korup",
    name: "Parc National de Korup",
    region: "Sud-Ouest",
    description: "L'une des plus anciennes et des plus riches forêts tropicales d'Afrique, idéale pour l'écotourisme.",
    image: "/assets/Parc National de Korup.jpg",
    price: 220000,
    rating: 4.6,
    activities: ["Randonnée en forêt", "Observation des oiseaux", "Écotourisme"],
    accommodations: [
      { name: "Korup Rainforest Camp", type: "Campement/Auberge", price: 35000 },
    ],
    restaurants: [
      { name: "Cuisine locale (camp)", cuisine: "Locale", priceRange: "Économique" },
    ],
    transports: [
      { type: "Voiture 4x4 (Mundemba)", price: 60000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money"],
  },
  // 1️⃣2️⃣ Mont Manengouba - Littoral-Sud-ouest Cameroun
  {
    id: "mont-manengouba",
    name: "Mont Manengouba",
    region: "Ouest/Littoral",
    description: "Massif montagneux célèbre pour ses lacs de cratère (Lac Mâle et Lac Femelle) et ses paysages verdoyants.",
    image: "/assets/Mont Manengouba.jpg",
    price: 140000,
    rating: 4.6,
    activities: ["Randonnée", "Découverte des lacs", "Photographie de paysages"],
    accommodations: [
      { name: "Hébergements ruraux/Auberges", type: "Auberge", price: 20000 },
    ],
    restaurants: [
      { name: "Maquis locaux", cuisine: "Locale", priceRange: "Économique" },
    ],
    transports: [
      { type: "Moto-Taxi (Dschang/Nkongsamba)", price: 15000 },
      { type: "Voiture 4x4", price: 40000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money"],
  },
  // 1️⃣3️⃣ Parc National De Waza - Extrême-Nord Cameroun
  {
    id: "parc-national-waza",
    name: "Parc National De Waza",
    region: "Extrême-Nord",
    description: "L'un des parcs nationaux les plus célèbres pour l'observation de la faune africaine (lions, girafes, éléphants).",
    image: "/assets/Parc National De Waza.jpg",
    price: 350000,
    rating: 4.5,
    activities: ["Safari", "Observation d'oiseaux", "Photographie animalière"],
    accommodations: [
      { name: "Campement du Parc", type: "Campement", price: 50000 },
      { name: "Hôtel Saïga", type: "Hôtel", price: 45000 },
    ],
    restaurants: [
      { name: "Écho des Savanes", cuisine: "Locale", priceRange: "Modéré" },
    ],
    transports: [
      { type: "Avion (Maroua) + Voiture 4x4", price: 100000 },
      { type: "Véhicule 4x4 avec guide", price: 50000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money", "Visa/Mastercard"],
  },
  // 1️⃣4️⃣ Gorges de Kola - Guider, Nord Cameroun
  {
    id: "gorges-de-kola",
    name: "Gorges de Kola",
    region: "Nord",
    description: "Un canyon spectaculaire avec des falaises abruptes, témoignant de la richesse géologique de la région.",
    image: "/assets/Gorges de Kola.jpg",
    price: 160000,
    rating: 4.3,
    activities: ["Randonnée", "Exploration géologique", "Photographie de paysages"],
    accommodations: [
      { name: "Hôtel La Bénoué", type: "Hôtel", price: 35000 },
    ],
    restaurants: [
      { name: "LA CASA", cuisine: "Internationale/Locale", priceRange: "Modéré" },
      { name: "Restaurant Platinium", cuisine: "Locale", priceRange: "Modéré" },
    ],
    transports: [
      { type: "Bus (Garoua/Guider)", price: 15000 },
      { type: "Taxi", price: 30000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money"],
  },
  // 1️⃣5️⃣ Monument de la Réunification - Yaoundé
  {
    id: "monument-reunification",
    name: "Monument de la Réunification",
    region: "Centre",
    description: "Symbole de l'unité du Cameroun, une œuvre architecturale incontournable au cœur de Yaoundé.",
    image: "/assets/Monument de la Réunification.jpg",
    price: 60000,
    rating: 4.3,
    activities: ["Visite historique", "Photographie", "Promenade"],
    accommodations: [
      { name: "Djeuga Palace", type: "Hôtel", price: 70000 },
      { name: "Hôtel Azur", type: "Hôtel", price: 55000 },
    ],
    restaurants: [
      { name: "Seven Hills", cuisine: "Internationale", priceRange: "Élevé" },
      { name: "Socrat Restaurant", cuisine: "Locale", priceRange: "Modéré" },
    ],
    transports: [
      { type: "Taxi urbain", price: 3000 },
      { type: "Moto-Taxi", price: 1500 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money", "Visa/Mastercard"],
  },
  // 1️⃣6️⃣ Grotte Fovu - Baham, Ouest Cameroun
  {
    id: "grotte-fovu",
    name: "Grotte Fovu",
    region: "Ouest",
    description: "Site mystique et sacré de la chefferie Baham, lieu de rituels et d'histoire locale.",
    image: "/assets/Grotte Fovu.jpg",
    price: 90000,
    rating: 4.0,
    activities: ["Visite culturelle", "Découverte historique", "Randonnée légère"],
    accommodations: [
      { name: "Hôtel Mbatkam Palace", type: "Hôtel", price: 40000 },
    ],
    restaurants: [
      { name: "Restaurant Ômulema", cuisine: "Locale/Spécialités", priceRange: "Modéré" },
    ],
    transports: [
      { type: "Taxi Bafoussam/Baham", price: 5000 },
      { type: "Voiture de location", price: 25000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money"],
  },
  // 1️⃣7️⃣ La Nouvelle Liberté - Douala, Littoral Cameroun
  {
    id: "nouvelle-liberte-douala",
    name: "La Nouvelle Liberté (Statue)",
    region: "Littoral",
    description: "Œuvre d'art contemporaine emblématique de Douala, symbolisant la liberté et l'essor urbain.",
    image: "/assets/La Nouvelle Liberté (Statue).jpg",
    price: 75000,
    rating: 4.2,
    activities: ["Visite et Photographie", "Exploration urbaine"],
    accommodations: [
      { name: "Akwa Palace", type: "Hôtel", price: 110000 },
      { name: "SAWA Hotel", type: "Hôtel", price: 130000 },
    ],
    restaurants: [
      { name: "Complexe les Palétuviers", cuisine: "Internationale", priceRange: "Élevé" },
    ],
    transports: [
      { type: "Taxi urbain", price: 3000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money", "Visa/Mastercard"],
  },
  // 1️⃣8️⃣ Lac Baleng - Bafoussam, Ouest Cameroun
  {
    id: "lac-baleng",
    name: "Lac Baleng",
    region: "Ouest",
    description: "Un lac de cratère paisible près de Bafoussam, idéal pour la détente et les activités de plein air.",
    image: "/assets/Lac Baleng.jpg",
    price: 110000,
    rating: 4.1,
    activities: ["Promenade", "Pique-nique", "Randonnée légère"],
    accommodations: [
      { name: "Zingana Hotel", type: "Hôtel", price: 35000 },
      { name: "Hôtel Mbatkam Palace", type: "Hôtel", price: 40000 },
    ],
    restaurants: [
      { name: "LA TERRASSE", cuisine: "Locale/Européenne", priceRange: "Modéré" },
      { name: "ASAT Restaurant", cuisine: "Locale", priceRange: "Économique" },
    ],
    transports: [
      { type: "Taxi urbain Bafoussam", price: 2000 },
      { type: "Moto-Taxi", price: 1000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money"],
  },
  // 20️⃣ Monument Natchigal - Douala, Littoral Cameroun
  {
    id: "monument-natchigal",
    name: "Monument Natchigal",
    region: "Littoral",
    description: "Monument commémorant l'explorateur allemand Gustav Nachtigal, un point de repère historique à Douala.",
    image: "/assets/Monument Natchigal.jpg",
    price: 70000,
    rating: 3.8,
    activities: ["Visite historique", "Photographie", "Exploration urbaine"],
    accommodations: [
      { name: "Hôtel Le Château", type: "Hôtel", price: 65000 },
    ],
    restaurants: [
      { name: "Restaurant La Fourchette", cuisine: "Internationale", priceRange: "Élevé" },
      { name: "Maison H.", cuisine: "Gastronomie", priceRange: "Élevé" },
    ],
    transports: [
      { type: "Taxi urbain", price: 3000 },
    ],
    paymentMethods: ["MTN Mobile Money", "Orange Money", "Visa/Mastercard"],
  },
];

export const regions = ["Toutes", "Littoral", "Sud-Ouest", "Ouest", "Nord", "Sud", "Centre", "Est", "Adamaoua", "Extrême-Nord"];

export const accommodations = destinations.flatMap(dest => 
  dest.accommodations.map(acc => ({
    id: `${dest.id}-${acc.name.toLowerCase().replace(/\s+/g, '-')}`,
    destinationId: dest.id,
    name: acc.name,
    type: acc.type,
    pricePerNight: acc.price,
    rating: dest.rating
  }))
);

export const restaurants = destinations.flatMap(dest =>
  dest.restaurants.map(rest => ({
    id: `${dest.id}-${rest.name.toLowerCase().replace(/\s+/g, '-')}`,
    destinationId: dest.id,
    name: rest.name,
    cuisine: rest.cuisine,
    pricePerMeal: parseInt(rest.priceRange === "Élevé" ? "25000" : rest.priceRange === "Modéré" ? "15000" : "8000"), // Conversion estimée en FCFA
    rating: dest.rating
  }))
);

export const transports = destinations.flatMap(dest =>
  dest.transports.map(trans => ({
    id: `${dest.id}-${trans.type.toLowerCase().replace(/\s+/g, '-')}`,
    destinationId: dest.id,
    name: trans.type,
    type: trans.type.toLowerCase() as "bus" | "car" | "plane" | "boat" | "taxi" | "voiture", // Ajout des types
    price: trans.price
  }))
);
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader } from '@/components/interface utilisateur/card';
import { Button } from '@/components/interface utilisateur/button';
import { Input } from '@/components/interface utilisateur/input';
import { Badge } from '@/components/interface utilisateur/badge';
import { Search, Calendar, User, ArrowRight, Heart, MessageCircle, Share2 } from 'lucide-react';

const i18n = {
  fr: {
    blogTitle: 'Blog Explore Afrique',
    blogSubtitle: 'Découvrez les récits de voyage, conseils et expériences partagés par notre communauté de voyageurs passionnés du Cameroun.',
    allArticles: 'Tous les articles',
    featured: 'Article à la une',
    noArticle: 'Aucun article trouvé pour vos critères de recherche.',
    resetFilter: 'Réinitialiser les filtres',
    writeArticle: 'Écrire un article',
    shareIntro: 'Vous avez vécu une aventure incroyable au Cameroun ? Partagez votre histoire avec notre communauté !',
    shareExp: 'Partagez votre expérience',
    yourName: 'Votre nom',
    yourEmail: 'Votre email',
    yourTitle: 'Titre',
    yourCategory: 'Catégorie',
    yourExcerpt: 'Résumé court',
    yourContent: 'Votre expérience détaillée',
    yourPhoto: 'Votre photo (optionnel)',
    submit: 'Publier',
    postedSuccess: 'Article publié avec succès ! Merci.',
    categories: ['Tous', 'Aventure', 'Culture', 'Nature', 'Gastronomie'],
    langLabel: 'Langue / Language:',
    uploadLabel: 'Glisser-déposer ou cliquer pour choisir',
    readTime: '{n} min de lecture',
    likes: 'likes',
    comments: 'commentaires',
    subscribe: `S'abonner`,
    newsletterTitle: 'Restez connecté',
    newsletterText: 'Recevez nos derniers articles de blog et conseils de voyage directement dans votre boîte mail.',
    featuredRead: `Lire l'article`,
    author: 'Auteur',
    date: 'Date',
  },
  en: {
    blogTitle: 'Explore Africa Blog',
    blogSubtitle: 'Discover travel stories, tips and experiences shared by our community of Cameroon lovers.',
    allArticles: 'All articles',
    featured: 'Featured post',
    noArticle: 'No articles found for your search.',
    resetFilter: 'Reset filters',
    writeArticle: 'Write an article',
    shareIntro: 'Did you experience something amazing in Cameroon? Share your story with our community!',
    shareExp: 'Share your experience',
    yourName: 'Your name',
    yourEmail: 'Your email',
    yourTitle: 'Title',
    yourCategory: 'Category',
    yourExcerpt: 'Short highlight',
    yourContent: 'Your detailed experience',
    yourPhoto: 'Your photo (optional)',
    submit: 'Publish',
    postedSuccess: 'Story posted successfully! Thank you.',
    categories: ['All', 'Adventure', 'Culture', 'Nature', 'Food'],
    langLabel: 'Langue / Language:',
    uploadLabel: 'Drag & drop or click to choose',
    readTime: '{n} min read',
    likes: 'likes',
    comments: 'comments',
    subscribe: 'Subscribe',
    newsletterTitle: 'Stay in touch',
    newsletterText: 'Receive our latest blog posts and travel tips directly in your inbox.',
    featuredRead: 'Read more',
    author: 'Author',
    date: 'Date',
  }
};

export default function Blog() {
  const [lang, setLang] = useState<'fr'|'en'>('fr');
  const t = i18n[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const initialPosts = [
    {
      id: 1,
      title: 'Mon ascension du Mont Cameroun : Une expérience inoubliable',
      excerpt: 'Récit d\'une aventure de 3 jours sur le toit de l\'Afrique de l\'Ouest. Entre défis physiques et paysages à couper le souffle...',
      author: 'Marie Dubois',
      date: '2024-03-15',
      category: 'Aventure',
      image: '/assets/⿡ Mont Cameroun.jpg',
      readTime: 8,
      likes: 45,
      comments: 12,
      content: 'Récit d\'une aventure de 3 jours sur le toit de l\'Afrique de l\'Ouest. Entre défis physiques et paysages à couper le souffle...',
    },
    {
      id: 2,
      title: 'Découverte culturelle au Palais Royal de Foumban',
      excerpt: 'Plongée dans l\'histoire fascinante du royaume Bamoun. Architecture, traditions et rencontres avec les artisans locaux...',
      author: 'Jean-Paul Kamga',
      date: '2024-03-10',
      category: 'Culture',
      image: '/assets/🔟 Palais Royal de Foumban.jpg',
      readTime: 6,
      likes: 32,
      comments: 8,
      content: 'Plongée dans l\'histoire fascinante du royaume Bamoun. Architecture, traditions et rencontres avec les artisans locaux...',
    },
    {
      id: 3,
      title: 'Safari magique dans le Parc National de Waza',
      excerpt: 'Rencontre avec la faune sauvage du Cameroun. Éléphants, lions, girafes... Un spectacle naturel extraordinaire...',
      author: 'Sarah Johnson',
      date: '2024-03-05',
      category: 'Nature',
      image: '/assets/⿡⿣ Parc National de Waza.jpg',
      readTime: 10,
      likes: 67,
      comments: 15,
      content: 'Rencontre avec la faune sauvage du Cameroun. Éléphants, lions, girafes... Un spectacle naturel extraordinaire...',
    },
    {
      id: 4,
      title: 'Les Chutes de la Lobé : Où l\'eau rencontre l\'océan',
      excerpt: 'Phénomène unique au monde, ces cascades qui se jettent directement dans l\'Atlantique offrent un spectacle saisissant...',
      author: 'Pierre Ndongo',
      date: '2024-02-28',
      category: 'Nature',
      image: '/assets/⿢ Chutes de la Lobé.jpg',
      readTime: 5,
      likes: 89,
      comments: 23,
      content: 'Phénomène unique au monde, ces cascades qui se jettent directement dans l\'Atlantique offrent un spectacle saisissant...',
    },
    {
      id: 5,
      title: 'Gastronomie camerounaise : Un voyage culinaire',
      excerpt: 'De Yaoundé à Douala, découverte des saveurs authentiques du Cameroun. Ndolé, poulet DG, poisson braisé...',
      author: 'Aminata Diallo',
      date: '2024-02-20',
      category: 'Gastronomie',
      image: '/assets/img7.jpg',
      readTime: 7,
      likes: 54,
      comments: 18,
      content: 'De Yaoundé à Douala, découverte des saveurs authentiques du Cameroun. Ndolé, poulet DG, poisson braisé...',
    },
    {
      id: 6,
      title: 'Rhumsiki et ses paysages lunaires',
      excerpt: 'Voyage dans le temps à travers les formations rocheuses spectaculaires du Nord-Cameroun et la culture Kapsiki...',
      author: 'Thomas Müller',
      date: '2024-02-15',
      category: 'Aventure',
      image: '/assets/Rhumsiki.jpg',
      readTime: 9,
      likes: 76,
      comments: 11,
      content: 'Voyage dans le temps à travers les formations rocheuses spectaculaires du Nord-Cameroun et la culture Kapsiki...',
    }
  ];

  // Récupérer les articles existants
  const [blogPosts, setBlogPosts] = useState(initialPosts);
  // Gestion du formulaire de partage
  const [form, setForm] = useState({ name: '', email: '', title: '', category: '', excerpt: '', content: '', image: '' });
  const [success, setSuccess] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  // Upload image as base64 local mock
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setForm((f) => ({ ...f, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBlogPosts([
      {
        id: Date.now(),
        title: form.title,
        excerpt: form.excerpt,
        author: form.name,
        date: new Date().toISOString().slice(0,10),
        category: form.category,
        image: form.image,
        readTime: Math.max(3, Math.round(form.content.length / 650)),
        likes: 0,
        comments: 0,
        content: form.content,
      },
      ...blogPosts,
    ]);
    setForm({ name: '', email: '', title: '', category: '', excerpt: '', content: '', image: '' });
    setSuccess(t.postedSuccess);
    setTimeout(() => setSuccess(''), 2500);
  };

  // Rechercher/trier les posts visibles selon filters/langue
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) || (post.author || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Aventure':
        case 'Adventure':
          return 'bg-orange-100 text-orange-800';
        case 'Culture': return 'bg-purple-100 text-purple-800';
        case 'Nature': return 'bg-green-100 text-green-800';
        case 'Gastronomie':
        case 'Food':
          return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-row justify-end p-2">
        <label className="text-sm mr-2">{t.langLabel} </label>
        <select value={lang} onChange={e => setLang(e.target.value as 'fr'|'en')} className="border rounded text-xs px-1 py-0.5">
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Formulaire d'ajout d'expérience */}
      <section className="py-6 bg-gray-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">{t.shareExp}</h2>
          <p className="text-gray-600 mb-4">{t.shareIntro}</p>
          {success && <div className="p-2 bg-green-100 text-green-900 mb-2 rounded">{success}</div>}
          <form className="space-y-4" onSubmit={onFormSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1">{t.yourName}</label>
                <Input name="name" value={form.name} onChange={handleInput} required/></div>
              <div><label className="block text-sm mb-1">{t.yourEmail}</label>
                <Input name="email" type="email" value={form.email} onChange={handleInput} required/></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1">{t.yourTitle}</label>
                <Input name="title" value={form.title} onChange={handleInput} required/></div>
              <div><label className="block text-sm mb-1">{t.yourCategory}</label>
                <select name="category" className="border rounded p-2 w-full" value={form.category} onChange={handleInput} required>
                  <option value="">---</option>
                  {t.categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select></div>
            </div>
            <div><label className="block text-sm mb-1">{t.yourExcerpt}</label>
              <Input name="excerpt" value={form.excerpt} onChange={handleInput} required/></div>
            <div><label className="block text-sm mb-1">{t.yourContent}</label>
              <textarea name="content" value={form.content} onChange={handleInput} className="w-full border rounded p-2 h-24" required /></div>
            <div>
              <label className="block text-sm mb-1">{t.yourPhoto}</label>
              <input name="photo" type="file" accept="image/*" onChange={handleImage} className="block" />
              {form.image && <img src={form.image} alt="preview" className="h-24 my-2 rounded" />}
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">{t.submit}</Button>
            </div>
          </form>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t.blogTitle}
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            {t.blogSubtitle}
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={lang==='fr' ? 'Rechercher un article...' : 'Search a post...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {t.categories.map((category, idx) => (
                <Button
                  key={category}
                  variant={selectedCategory === (idx===0?'all':category) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(idx===0?'all':category)}
                  className={selectedCategory === (idx===0?'all':category) ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{t.featured}</h2>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <img 
                    src={filteredPosts[0].image} 
                    alt={filteredPosts[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(filteredPosts[0].category)}>
                      {filteredPosts[0].category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {filteredPosts[0].title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {filteredPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {filteredPosts[0].author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(filteredPosts[0].date).toLocaleDateString(lang==='fr'?'fr-FR':'en-GB')}
                      </div>
                      <span>{t.readTime.replace('{n}', filteredPosts[0].readTime?.toString()||'7')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {filteredPosts[0].likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {filteredPosts[0].comments}
                      </div>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      {t.featuredRead}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{t.allArticles}</h2>
            <p className="text-gray-600">
              {filteredPosts.length} article{filteredPosts.length > 1 && lang==='fr' ? 's' : ''}
              {selectedCategory !== 'all' && ` ${lang==='fr' ? 'dans' : 'in'} "${selectedCategory}"`}
            </p>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                {t.noArticle}
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                variant="outline"
              >
                {t.resetFilter}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                  <div className="relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.date).toLocaleDateString(lang==='fr'?'fr-FR':'en-GB')}
                      </div>
                      <span>{t.readTime.replace('{n}', post.readTime?.toString()||'6')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {post.comments}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t.newsletterTitle}
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            {t.newsletterText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Votre adresse email"
              className="bg-white"
            />
            <Button variant="secondary">
              {t.subscribe}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t.shareExp}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t.shareIntro}
          </p>
          <a href="mailto:minsongipaul@icloud.com?subject=Partage d'expérience - Blog Explore Afrique">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              {t.writeArticle}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
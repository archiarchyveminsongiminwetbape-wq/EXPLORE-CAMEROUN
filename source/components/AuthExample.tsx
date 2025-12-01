import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function AuthExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  
  const { user, profile, loading, signIn, signUp, signOut, isAdmin, isOwner } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password, fullName);
    }
  };

  if (loading) {
    return <div className="p-4">Chargement en cours...</div>;
  }

  if (user) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Bienvenue {profile?.full_name || user.email}!</h2>
        <div className="mb-4">
          <p>Email: {user.email}</p>
          <p>Rôle: {profile?.role || 'Utilisateur standard'}</p>
          {isAdmin && <p className="text-green-600">Accès administrateur activé</p>}
          {isOwner && <p className="text-blue-600">Accès propriétaire activé</p>}
        </div>
        <button
          onClick={signOut}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
          disabled={loading}
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {isLogin ? 'Connexion' : 'Créer un compte'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required={!isLogin}
            />
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {isLogin ? 'Se connecter' : 'S\'inscrire'}
        </button>
        
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          {isLogin 
            ? 'Pas encore de compte ? Créez-en un' 
            : 'Déjà un compte ? Connectez-vous'}
        </button>
      </form>
    </div>
  );
}

export default AuthExample;

// AuthContext.tsx
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isOwner: boolean;
  currency: {
    currency: {
      code: string;
      symbol: string;
      name: string;
      rate: number;
    };
    formatPrice: (amount: number, currencyCode?: string) => string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.warn('Profile not found, creating default profile...');
        const { data: { session } } = await supabase.auth.getSession();
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId,
            email: session?.user?.email || '',
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
        return;
      }
      
      setProfile(data);
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const handleAuthStateChange = async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      if (data.user) {
        await fetchProfile(data.user.id);
      }
      
      return { error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      const errorMessage = err instanceof Error ? err : new Error('Erreur de connexion');
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id,
            email: email,
            full_name: fullName,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
          
        if (profileError) throw profileError;
        
        await fetchProfile(data.user.id);
      }
      
      return { error: null };
    } catch (err) {
      console.error('Sign up error:', err);
      const errorMessage = err instanceof Error ? err : new Error("Erreur lors de l'inscription");
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      
    } catch (err) {
      console.error('Sign out error:', err);
      const errorMessage = err instanceof Error ? err : new Error('Erreur lors de la déconnexion');
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = useMemo(() => {
    return Boolean(profile?.role === 'admin' || user?.email?.endsWith('@admin.com'));
  }, [profile, user]);

  const isOwner = useMemo(() => {
    return Boolean(profile?.role === 'owner' || user?.email === 'owner@example.com');
  }, [profile, user]);

  // Logs de débogage en développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (user) {
        console.group('User Session');
        console.log('User:', user.email);
        console.log('Profile:', profile);
        console.log('Role:', profile?.role || 'user');
        console.log('Admin:', isAdmin);
        console.log('Owner:', isOwner);
        console.groupEnd();
      } else {
        console.log('No authenticated user');
      }
      
      if (error) {
        console.error('Auth Error:', error);
      }
    }
  }, [user, profile, isAdmin, isOwner, error]);

  // Initialisation de la devise par défaut
  const defaultCurrency = {
    currency: {
      code: 'XAF',
      symbol: 'FCFA',
      name: 'Franc CFA',
      rate: 1
    },
    formatPrice: (amount: number, currencyCode?: string) => {
      // Implémentation basique de formatPrice
      // Vous pouvez la remplacer par votre logique de formatage
      return `${amount.toFixed(2)} FCFA`;
    }
  };

  const contextValue = useMemo(() => ({
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isOwner,
    currency: defaultCurrency,
  }), [user, profile, loading, isAdmin, isOwner, signIn, signUp, signOut]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables d\'environnement Supabase manquantes. Vérifiez SUPABASE_URL et SUPABASE_ANON_KEY dans votre fichier .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// URL de paiement Lygos
export const LYGOS_PAYMENT_URL = process.env.LYGOS_PAYMENT_URL;

if (!LYGOS_PAYMENT_URL) {
  console.warn('⚠️  LYGOS_PAYMENT_URL non configurée dans les variables d\'environnement');
}

export default {
  supabase,
  LYGOS_PAYMENT_URL
};

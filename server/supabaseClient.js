import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://ocfyegyhnrzcuearskpx.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZnllZ3lobnJ6Y3VlYXJza3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODg5OTEsImV4cCI6MjA3OTc2NDk5MX0.1uc5cWNP_IvBuMCmabzHonCpkSH2XoFz1dO-LZnWnsI';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// URL de paiement Lygos
export const LYGOS_PAYMENT_URL = process.env.LYGOS_PAYMENT_URL || 'https://pay.lygosapp.com/link/ae004d7c-a01d-439a-bddd-3551e672adf4';

export default {
  supabase,
  LYGOS_PAYMENT_URL
};

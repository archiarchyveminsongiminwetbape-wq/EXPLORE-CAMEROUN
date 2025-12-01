import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ocfyegyhnrzcuearskpx.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZnllZ3lobnJ6Y3VlYXJza3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODg5OTEsImV4cCI6MjA3OTc2NDk5MX0.1uc5cWNP_IvBuMCmabzHonCpkSH2XoFz1dO-LZnWnsI'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    }
  }
})

export type UserRole = 'admin' | 'owner' | 'user'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

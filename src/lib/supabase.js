import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null

export function requireClient() {
  if (!supabase) {
    throw new Error('Add your Supabase URL and anon key in .env.local, then restart the app.')
  }
  return supabase
}

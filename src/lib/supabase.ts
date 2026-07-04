import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

// Fallback to dummy URL/Key if env vars are missing so the build doesn't break
// The user MUST set these in a .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxxxxxxxxxxxxxxxxxxx.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

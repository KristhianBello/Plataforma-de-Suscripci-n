import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for authentication
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    first_name?: string
    last_name?: string
    full_name?: string
  }
}

export interface SignUpData {
  email: string
  password: string
  options?: {
    data?: {
      first_name?: string
      last_name?: string
      full_name?: string
    }
  }
}

export interface SignInData {
  email: string
  password: string
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validate URL format before creating client
const isValidUrl = (url: string): boolean => {
  if (!url) return false
  // Check if it's still a placeholder
  if (url.includes('your_supabase') || url.includes('placeholder')) return false
  // Check if it's a valid HTTP/HTTPS URL
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

// Only create Supabase client if we have valid environment variables
// This allows the app to run without Supabase configured (for development)
export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey && !supabaseAnonKey.includes('your_supabase')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null


/**
 * Supabase Admin Client
 *
 * Uses the service role key for full database access.
 * Should only be used in server-side scripts and API routes.
 * NEVER expose the service role key to the client.
 */

import { createClient } from '@supabase/supabase-js'
import { isValidUrl } from './client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Create admin client with service role key (bypasses RLS)
export const supabaseAdmin = isValidUrl(supabaseUrl) && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

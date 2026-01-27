/**
 * Voice Lab Client
 *
 * Client for accessing Voice Lab data from Studio.
 * Uses direct database access (shared Supabase instance).
 *
 * In production, this could be converted to use HTTP calls
 * to the Voice Lab API for better separation.
 */

import { supabaseAdmin } from '@compass/database'

/**
 * Voice Profile interface matching Voice Lab's structure
 */
export interface VoiceProfile {
  id: string
  clerk_user_id: string
  name: string
  slug: string
  description: string | null
  style_guide: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

/**
 * Get a voice profile by ID
 */
export async function getVoiceProfile(id: string): Promise<VoiceProfile | null> {
  if (!supabaseAdmin) {
    console.warn('Supabase not configured')
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('voice_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to fetch voice profile:', error)
    return null
  }

  return data
}

/**
 * Get a voice profile by slug
 */
export async function getVoiceProfileBySlug(slug: string): Promise<VoiceProfile | null> {
  if (!supabaseAdmin) {
    console.warn('Supabase not configured')
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('voice_profiles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Failed to fetch voice profile by slug:', error)
    return null
  }

  return data
}

/**
 * Get all voice profiles for a user
 */
export async function getUserVoiceProfiles(clerkUserId: string): Promise<VoiceProfile[]> {
  if (!supabaseAdmin) {
    console.warn('Supabase not configured')
    return []
  }

  const { data, error } = await supabaseAdmin
    .from('voice_profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch user voice profiles:', error)
    return []
  }

  return data || []
}

/**
 * Get all public voice profiles
 */
export async function getPublicVoiceProfiles(): Promise<VoiceProfile[]> {
  if (!supabaseAdmin) {
    console.warn('Supabase not configured')
    return []
  }

  const { data, error } = await supabaseAdmin
    .from('voice_profiles')
    .select('*')
    .eq('is_public', true)
    .order('name')

  if (error) {
    console.error('Failed to fetch public voice profiles:', error)
    return []
  }

  return data || []
}

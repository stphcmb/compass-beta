/**
 * Voice Lab - Profile Store
 *
 * CRUD operations for voice profiles stored in Supabase.
 * Each profile contains a natural language style guide as markdown.
 */

import { supabase } from '@/lib/supabase'
import {
  VoiceProfile,
  CreateVoiceProfileInput,
  UpdateVoiceProfileInput,
} from './types'

// ============================================================================
// Read Operations
// ============================================================================

/**
 * Fetch all voice profiles for a user
 */
export async function getVoiceProfiles(
  clerkUserId: string
): Promise<VoiceProfile[]> {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty profiles')
    return []
  }

  const { data, error } = await supabase
    .from('voice_profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch voice profiles:', error)
    return []
  }

  return data || []
}

/**
 * Fetch a single voice profile by ID
 */
export async function getVoiceProfile(
  id: string
): Promise<VoiceProfile | null> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return null
  }

  const { data, error } = await supabase
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
 * Fetch a user's active voice profile (if any)
 */
export async function getActiveVoiceProfile(
  clerkUserId: string
): Promise<VoiceProfile | null> {
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('voice_profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .eq('is_active', true)
    .single()

  if (error) {
    // No active profile is not an error
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Failed to fetch active voice profile:', error)
    return null
  }

  return data
}

/**
 * Fetch a voice profile by ID and verify ownership
 */
export async function getVoiceProfileForUser(
  id: string,
  clerkUserId: string
): Promise<VoiceProfile | null> {
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('voice_profiles')
    .select('*')
    .eq('id', id)
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (error) {
    console.error('Failed to fetch voice profile:', error)
    return null
  }

  return data
}

// ============================================================================
// Write Operations
// ============================================================================

/**
 * Create a new voice profile
 */
export async function createVoiceProfile(
  input: CreateVoiceProfileInput
): Promise<VoiceProfile | null> {
  if (!supabase) {
    console.error('Supabase not configured')
    return null
  }

  const { data, error } = await supabase
    .from('voice_profiles')
    .insert({
      clerk_user_id: input.clerk_user_id,
      name: input.name,
      description: input.description || null,
      style_guide: input.style_guide || null,
      source_samples: input.source_samples || null,
      is_active: input.is_active ?? false,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create voice profile:', error)
    return null
  }

  return data
}

/**
 * Update an existing voice profile
 */
export async function updateVoiceProfile(
  id: string,
  input: UpdateVoiceProfileInput
): Promise<VoiceProfile | null> {
  if (!supabase) {
    return null
  }

  // Build update object with only provided fields
  const updateData: Record<string, unknown> = {}
  if (input.name !== undefined) updateData.name = input.name
  if (input.description !== undefined) updateData.description = input.description
  if (input.style_guide !== undefined) updateData.style_guide = input.style_guide
  if (input.source_samples !== undefined) updateData.source_samples = input.source_samples
  if (input.is_active !== undefined) updateData.is_active = input.is_active

  const { data, error } = await supabase
    .from('voice_profiles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update voice profile:', error)
    return null
  }

  return data
}

/**
 * Set a profile as active (deactivates all others for this user)
 */
export async function setActiveVoiceProfile(
  id: string,
  clerkUserId: string
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  // First, deactivate all profiles for this user
  const { error: deactivateError } = await supabase
    .from('voice_profiles')
    .update({ is_active: false })
    .eq('clerk_user_id', clerkUserId)

  if (deactivateError) {
    console.error('Failed to deactivate profiles:', deactivateError)
    return false
  }

  // Then activate the specified profile
  const { error: activateError } = await supabase
    .from('voice_profiles')
    .update({ is_active: true })
    .eq('id', id)
    .eq('clerk_user_id', clerkUserId)

  if (activateError) {
    console.error('Failed to activate profile:', activateError)
    return false
  }

  return true
}

/**
 * Deactivate all voice profiles for a user
 */
export async function deactivateAllVoiceProfiles(
  clerkUserId: string
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_profiles')
    .update({ is_active: false })
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Failed to deactivate profiles:', error)
    return false
  }

  return true
}

/**
 * Delete a voice profile
 */
export async function deleteVoiceProfile(id: string): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_profiles')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete voice profile:', error)
    return false
  }

  return true
}

/**
 * Delete a voice profile with user ownership verification
 */
export async function deleteVoiceProfileForUser(
  id: string,
  clerkUserId: string
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_profiles')
    .delete()
    .eq('id', id)
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Failed to delete voice profile:', error)
    return false
  }

  return true
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get the style guide content from a profile
 * Returns null if no profile or no style guide
 */
export async function getStyleGuideById(
  profileId: string
): Promise<string | null> {
  const profile = await getVoiceProfile(profileId)
  return profile?.style_guide || null
}

/**
 * Check if a user has any voice profiles
 */
export async function hasVoiceProfiles(
  clerkUserId: string
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { count, error } = await supabase
    .from('voice_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Failed to check voice profiles:', error)
    return false
  }

  return (count || 0) > 0
}

/**
 * Get count of voice profiles for a user
 */
export async function getVoiceProfileCount(
  clerkUserId: string
): Promise<number> {
  if (!supabase) {
    return 0
  }

  const { count, error } = await supabase
    .from('voice_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Failed to count voice profiles:', error)
    return 0
  }

  return count || 0
}

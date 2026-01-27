/**
 * Voice Lab - Profile Store
 *
 * CRUD operations for voice profiles stored in Supabase.
 * Each profile contains a natural language style guide as markdown.
 */

import { supabaseAdmin } from '@/lib/supabase-admin'

// Use admin client to bypass RLS (we filter by clerk_user_id in application code)
const supabase = supabaseAdmin
import {
  VoiceProfile,
  CreateVoiceProfileInput,
  UpdateVoiceProfileInput,
  VoiceProfileFilters,
  VoiceTrainingStatus,
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

  // Ensure all profiles have labels array (for pre-migration compatibility)
  return (data || []).map((profile) => ({
    ...profile,
    labels: profile.labels || [],
  }))
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

  return { ...data, slug: data.slug || null } as VoiceProfile
}

/**
 * Fetch a voice profile by slug (for URL-friendly lookups)
 */
export async function getVoiceProfileBySlug(
  clerkUserId: string,
  slug: string
): Promise<VoiceProfile | null> {
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('voice_profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .eq('slug', slug)
    .single()

  if (error) {
    // Try by ID as fallback (for backwards compatibility)
    if (error.code === 'PGRST116') {
      return getVoiceProfile(slug)
    }
    console.error('Failed to fetch voice profile by slug:', error)
    return null
  }

  return { ...data, slug: data.slug || null, labels: data.labels || [] } as VoiceProfile
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
 * Generate URL-friendly slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

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

  const slug = generateSlug(input.name)

  // Build insert object - try with labels first
  const insertData: Record<string, unknown> = {
    clerk_user_id: input.clerk_user_id,
    name: input.name,
    slug,
    description: input.description || null,
    style_guide: input.style_guide || null,
    source_samples: input.source_samples || null,
    is_active: input.is_active ?? false,
    labels: input.labels || [],
  }

  const { data, error } = await supabase
    .from('voice_profiles')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    // If labels column doesn't exist, retry without it
    if (error.message?.includes('labels') || error.code === '42703') {
      console.warn('labels column not found, retrying without labels')
      const { data: retryData, error: retryError } = await supabase
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

      if (retryError) {
        console.error('Failed to create voice profile (retry):', retryError)
        return null
      }

      // Add empty labels array for type compatibility
      return { ...retryData, labels: [] } as VoiceProfile
    }

    console.error('Failed to create voice profile:', error)
    return null
  }

  // Ensure labels is always an array
  return { ...data, labels: data.labels || [] } as VoiceProfile
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
  if (input.labels !== undefined) updateData.labels = input.labels

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

// ============================================================================
// Training Status Operations
// ============================================================================

/**
 * Update the training status of a profile
 */
export async function updateTrainingStatus(
  id: string,
  status: 'ready' | 'processing' | 'needs_update'
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_profiles')
    .update({ training_status: status })
    .eq('id', id)

  if (error) {
    console.error('Failed to update training status:', error)
    return false
  }

  return true
}

/**
 * Update profile counts (sample_count and insight_count)
 */
export async function updateProfileCounts(
  id: string,
  sampleCount: number,
  insightCount: number
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_profiles')
    .update({
      sample_count: sampleCount,
      insight_count: insightCount,
    })
    .eq('id', id)

  if (error) {
    console.error('Failed to update profile counts:', error)
    return false
  }

  return true
}

/**
 * Increment the style guide version and update synthesis timestamp
 */
export async function incrementStyleGuideVersion(
  id: string,
  newStyleGuide: string
): Promise<VoiceProfile | null> {
  if (!supabase) {
    return null
  }

  // First get current version
  const { data: current, error: fetchError } = await supabase
    .from('voice_profiles')
    .select('style_guide_version')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Failed to fetch current version:', fetchError)
    return null
  }

  const newVersion = (current?.style_guide_version || 0) + 1

  const { data, error } = await supabase
    .from('voice_profiles')
    .update({
      style_guide: newStyleGuide,
      style_guide_version: newVersion,
      last_synthesized_at: new Date().toISOString(),
      training_status: 'ready',
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to increment style guide version:', error)
    return null
  }

  return data
}

/**
 * Mark profile as needing style guide update
 */
export async function markProfileNeedsUpdate(id: string): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_profiles')
    .update({ training_status: 'needs_update' })
    .eq('id', id)

  if (error) {
    console.error('Failed to mark profile as needs update:', error)
    return false
  }

  return true
}

// ============================================================================
// Label Operations
// ============================================================================

/**
 * Fetch all voice profiles with optional filters
 */
export async function getVoiceProfilesFiltered(
  clerkUserId: string,
  filters?: VoiceProfileFilters
): Promise<VoiceProfile[]> {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty profiles')
    return []
  }

  let query = supabase
    .from('voice_profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)

  // Filter by status
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('training_status', filters.status)
  }

  // Filter by labels (any match using overlap) - skip if labels column doesn't exist
  const hasLabelFilter = filters?.labels && filters.labels.length > 0

  // Search by name or description
  if (filters?.search) {
    const searchTerm = `%${filters.search}%`
    query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
  }

  const { data, error } = await query.order('updated_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch filtered voice profiles:', error)
    return []
  }

  // Ensure all profiles have labels array (for pre-migration compatibility)
  let profiles = (data || []).map((profile) => ({
    ...profile,
    labels: profile.labels || [],
  }))

  // Apply label filter in-memory if column might not exist
  if (hasLabelFilter) {
    const filterLabels = filters!.labels!
    profiles = profiles.filter((p) =>
      p.labels.some((label: string) => filterLabels.includes(label))
    )
  }

  return profiles
}

/**
 * Get all unique labels used across a user's profiles
 */
export async function getProfileLabels(
  clerkUserId: string
): Promise<string[]> {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('voice_profiles')
    .select('labels')
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Failed to fetch profile labels:', error)
    return []
  }

  // Extract unique labels from all profiles
  const allLabels = new Set<string>()
  data?.forEach((profile) => {
    profile.labels?.forEach((label: string) => allLabels.add(label))
  })

  return Array.from(allLabels).sort()
}

/**
 * Add labels to a profile (merges with existing)
 */
export async function addLabelsToProfile(
  id: string,
  labels: string[]
): Promise<VoiceProfile | null> {
  if (!supabase) {
    return null
  }

  // First get current labels
  const { data: current, error: fetchError } = await supabase
    .from('voice_profiles')
    .select('labels')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Failed to fetch current labels:', fetchError)
    return null
  }

  const currentLabels = current?.labels || []
  const newLabels = [...new Set([...currentLabels, ...labels])]

  const { data, error } = await supabase
    .from('voice_profiles')
    .update({ labels: newLabels })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to add labels to profile:', error)
    return null
  }

  return data
}

/**
 * Remove a label from a profile
 */
export async function removeLabelFromProfile(
  id: string,
  label: string
): Promise<VoiceProfile | null> {
  if (!supabase) {
    return null
  }

  // First get current labels
  const { data: current, error: fetchError } = await supabase
    .from('voice_profiles')
    .select('labels')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Failed to fetch current labels:', fetchError)
    return null
  }

  const currentLabels = current?.labels || []
  const newLabels = currentLabels.filter((l: string) => l !== label)

  const { data, error } = await supabase
    .from('voice_profiles')
    .update({ labels: newLabels })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to remove label from profile:', error)
    return null
  }

  return data
}

/**
 * Get profile count by status
 */
export async function getProfileCountsByStatus(
  clerkUserId: string
): Promise<Record<VoiceTrainingStatus | 'all', number>> {
  if (!supabase) {
    return { all: 0, ready: 0, processing: 0, needs_update: 0 }
  }

  const { data, error } = await supabase
    .from('voice_profiles')
    .select('training_status')
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Failed to fetch profile counts:', error)
    return { all: 0, ready: 0, processing: 0, needs_update: 0 }
  }

  const counts: Record<VoiceTrainingStatus | 'all', number> = {
    all: data?.length || 0,
    ready: 0,
    processing: 0,
    needs_update: 0,
  }

  data?.forEach((profile) => {
    const status = profile.training_status as VoiceTrainingStatus
    if (status in counts) {
      counts[status]++
    }
  })

  return counts
}

/**
 * Voice Lab - Sample Store
 *
 * CRUD operations for voice samples stored in Supabase.
 * Samples are raw writing text used to train voice profiles.
 */

import { supabaseAdmin } from '@/lib/supabase-admin'

const supabase = supabaseAdmin

import {
  VoiceSample,
  CreateVoiceSampleInput,
  UpdateVoiceSampleInput,
  VoiceSampleSourceType,
  VoiceSampleCategory,
  CategoryStats,
} from './types'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Count words in a text string
 */
function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}

// ============================================================================
// Read Operations
// ============================================================================

/**
 * Fetch all samples for a voice profile
 */
export async function getVoiceSamples(
  voiceProfileId: string
): Promise<VoiceSample[]> {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty samples')
    return []
  }

  const { data, error } = await supabase
    .from('voice_samples')
    .select('*')
    .eq('voice_profile_id', voiceProfileId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch voice samples:', error)
    return []
  }

  return data || []
}

/**
 * Fetch a single voice sample by ID
 */
export async function getVoiceSample(
  id: string
): Promise<VoiceSample | null> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return null
  }

  const { data, error } = await supabase
    .from('voice_samples')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to fetch voice sample:', error)
    return null
  }

  return data
}

/**
 * Fetch unprocessed samples for a profile
 */
export async function getUnprocessedSamples(
  voiceProfileId: string
): Promise<VoiceSample[]> {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('voice_samples')
    .select('*')
    .eq('voice_profile_id', voiceProfileId)
    .eq('is_processed', false)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch unprocessed samples:', error)
    return []
  }

  return data || []
}

/**
 * Get sample count for a profile
 */
export async function getSampleCount(
  voiceProfileId: string
): Promise<number> {
  if (!supabase) {
    return 0
  }

  const { count, error } = await supabase
    .from('voice_samples')
    .select('*', { count: 'exact', head: true })
    .eq('voice_profile_id', voiceProfileId)

  if (error) {
    console.error('Failed to count voice samples:', error)
    return 0
  }

  return count || 0
}

/**
 * Get total word count for a profile
 */
export async function getTotalWordCount(
  voiceProfileId: string
): Promise<number> {
  if (!supabase) {
    return 0
  }

  const { data, error } = await supabase
    .from('voice_samples')
    .select('word_count')
    .eq('voice_profile_id', voiceProfileId)

  if (error) {
    console.error('Failed to get total word count:', error)
    return 0
  }

  return data?.reduce((sum, sample) => sum + (sample.word_count || 0), 0) || 0
}

// ============================================================================
// Write Operations
// ============================================================================

/**
 * Create a new voice sample
 */
export async function createVoiceSample(
  input: CreateVoiceSampleInput
): Promise<VoiceSample | null> {
  if (!supabase) {
    console.error('Supabase not configured')
    return null
  }

  const wordCount = countWords(input.content)

  const { data, error } = await supabase
    .from('voice_samples')
    .insert({
      voice_profile_id: input.voice_profile_id,
      clerk_user_id: input.clerk_user_id,
      content: input.content,
      source_type: input.source_type || 'manual',
      source_name: input.source_name || null,
      word_count: wordCount,
      quality_score: 0.5, // Will be updated after processing
      is_processed: false,
      category: input.category || null,
      notes: input.notes || null,
    })
    .select()
    .single()

  if (error) {
    // If category/notes columns don't exist, retry without them
    if (error.message?.includes('category') || error.message?.includes('notes') || error.code === '42703') {
      console.warn('category/notes columns not found, retrying without them')
      const { data: retryData, error: retryError } = await supabase
        .from('voice_samples')
        .insert({
          voice_profile_id: input.voice_profile_id,
          clerk_user_id: input.clerk_user_id,
          content: input.content,
          source_type: input.source_type || 'manual',
          source_name: input.source_name || null,
          word_count: wordCount,
          quality_score: 0.5,
          is_processed: false,
        })
        .select()
        .single()

      if (retryError) {
        console.error('Failed to create voice sample (retry):', retryError)
        return null
      }

      return { ...retryData, category: null, notes: null } as VoiceSample
    }

    console.error('Failed to create voice sample:', error)
    return null
  }

  return data
}

/**
 * Create multiple voice samples at once
 */
export async function createVoiceSamples(
  inputs: CreateVoiceSampleInput[]
): Promise<VoiceSample[]> {
  if (!supabase || inputs.length === 0) {
    return []
  }

  // Try with category/notes columns first
  const records = inputs.map((input) => ({
    voice_profile_id: input.voice_profile_id,
    clerk_user_id: input.clerk_user_id,
    content: input.content,
    source_type: input.source_type || 'manual',
    source_name: input.source_name || null,
    word_count: countWords(input.content),
    quality_score: 0.5,
    is_processed: false,
    category: input.category || null,
    notes: input.notes || null,
  }))

  const { data, error } = await supabase
    .from('voice_samples')
    .insert(records)
    .select()

  if (error) {
    // If category/notes columns don't exist, retry without them
    if (error.message?.includes('category') || error.message?.includes('notes') || error.code === '42703') {
      console.warn('category/notes columns not found, retrying without them')
      const basicRecords = inputs.map((input) => ({
        voice_profile_id: input.voice_profile_id,
        clerk_user_id: input.clerk_user_id,
        content: input.content,
        source_type: input.source_type || 'manual',
        source_name: input.source_name || null,
        word_count: countWords(input.content),
        quality_score: 0.5,
        is_processed: false,
      }))

      const { data: retryData, error: retryError } = await supabase
        .from('voice_samples')
        .insert(basicRecords)
        .select()

      if (retryError) {
        console.error('Failed to create voice samples (retry):', retryError)
        return []
      }

      // Add null category/notes for type compatibility
      return (retryData || []).map((s) => ({
        ...s,
        category: null,
        notes: null,
      })) as VoiceSample[]
    }

    console.error('Failed to create voice samples:', error)
    return []
  }

  return data || []
}

/**
 * Mark a sample as processed
 */
export async function markSampleProcessed(
  id: string,
  qualityScore?: number
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const updateData: Record<string, unknown> = {
    is_processed: true,
    processed_at: new Date().toISOString(),
  }

  if (qualityScore !== undefined) {
    updateData.quality_score = qualityScore
  }

  const { error } = await supabase
    .from('voice_samples')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Failed to mark sample as processed:', error)
    return false
  }

  return true
}

/**
 * Update sample quality score
 */
export async function updateSampleQuality(
  id: string,
  qualityScore: number
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_samples')
    .update({ quality_score: Math.max(0, Math.min(1, qualityScore)) })
    .eq('id', id)

  if (error) {
    console.error('Failed to update sample quality:', error)
    return false
  }

  return true
}

/**
 * Delete a voice sample
 */
export async function deleteVoiceSample(id: string): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_samples')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete voice sample:', error)
    return false
  }

  return true
}

/**
 * Delete a voice sample with user ownership verification
 */
export async function deleteVoiceSampleForUser(
  id: string,
  clerkUserId: string
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_samples')
    .delete()
    .eq('id', id)
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Failed to delete voice sample:', error)
    return false
  }

  return true
}

/**
 * Delete all samples for a profile
 */
export async function deleteAllSamplesForProfile(
  voiceProfileId: string
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_samples')
    .delete()
    .eq('voice_profile_id', voiceProfileId)

  if (error) {
    console.error('Failed to delete all samples for profile:', error)
    return false
  }

  return true
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get sample statistics for a profile
 */
export async function getSampleStats(voiceProfileId: string): Promise<{
  total: number
  processed: number
  unprocessed: number
  totalWords: number
  averageQuality: number
}> {
  if (!supabase) {
    return {
      total: 0,
      processed: 0,
      unprocessed: 0,
      totalWords: 0,
      averageQuality: 0,
    }
  }

  const { data, error } = await supabase
    .from('voice_samples')
    .select('is_processed, word_count, quality_score')
    .eq('voice_profile_id', voiceProfileId)

  if (error || !data) {
    console.error('Failed to get sample stats:', error)
    return {
      total: 0,
      processed: 0,
      unprocessed: 0,
      totalWords: 0,
      averageQuality: 0,
    }
  }

  const total = data.length
  const processed = data.filter((s) => s.is_processed).length
  const unprocessed = total - processed
  const totalWords = data.reduce((sum, s) => sum + (s.word_count || 0), 0)
  const avgQuality =
    total > 0
      ? data.reduce((sum, s) => sum + (s.quality_score || 0.5), 0) / total
      : 0

  return {
    total,
    processed,
    unprocessed,
    totalWords,
    averageQuality: Math.round(avgQuality * 100) / 100,
  }
}

// ============================================================================
// Category Operations
// ============================================================================

/**
 * Update a voice sample
 */
export async function updateVoiceSample(
  id: string,
  input: UpdateVoiceSampleInput
): Promise<VoiceSample | null> {
  if (!supabase) {
    return null
  }

  const updateData: Record<string, unknown> = {}
  if (input.category !== undefined) updateData.category = input.category
  if (input.notes !== undefined) updateData.notes = input.notes
  if (input.quality_score !== undefined) {
    updateData.quality_score = Math.max(0, Math.min(1, input.quality_score))
  }

  if (Object.keys(updateData).length === 0) {
    // Nothing to update
    return getVoiceSample(id)
  }

  const { data, error } = await supabase
    .from('voice_samples')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update voice sample:', error)
    return null
  }

  return data
}

/**
 * Get samples by category
 */
export async function getSamplesByCategory(
  voiceProfileId: string,
  category: VoiceSampleCategory | null
): Promise<VoiceSample[]> {
  if (!supabase) {
    return []
  }

  let query = supabase
    .from('voice_samples')
    .select('*')
    .eq('voice_profile_id', voiceProfileId)

  if (category === null) {
    query = query.is('category', null)
  } else {
    query = query.eq('category', category)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch samples by category:', error)
    return []
  }

  return data || []
}

/**
 * Get category statistics for a profile
 */
export async function getCategoryStats(
  voiceProfileId: string
): Promise<CategoryStats[]> {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('voice_samples')
    .select('category')
    .eq('voice_profile_id', voiceProfileId)

  if (error || !data) {
    console.error('Failed to get category stats:', error)
    return []
  }

  const counts: Record<string, number> = {}
  data.forEach((sample) => {
    const cat = sample.category || 'uncategorized'
    counts[cat] = (counts[cat] || 0) + 1
  })

  return Object.entries(counts).map(([category, count]) => ({
    category: category as VoiceSampleCategory | 'uncategorized',
    count,
  }))
}

/**
 * Get insight count for a sample
 */
export async function getInsightCountForSample(
  sampleId: string
): Promise<number> {
  if (!supabase) {
    return 0
  }

  const { count, error } = await supabase
    .from('voice_insights')
    .select('*', { count: 'exact', head: true })
    .eq('voice_sample_id', sampleId)

  if (error) {
    console.error('Failed to count insights for sample:', error)
    return 0
  }

  return count || 0
}

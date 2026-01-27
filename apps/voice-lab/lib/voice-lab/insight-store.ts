/**
 * Voice Lab - Insight Store
 *
 * CRUD operations for voice insights stored in Supabase.
 * Includes merge logic for accumulating insights over time.
 *
 * When new insights match existing ones:
 * - Increase confidence (capped at 1.0)
 * - Increment sample_count
 * - Append new examples
 */

import { supabaseAdmin } from '@compass/database'

const supabase = supabaseAdmin

import {
  VoiceInsight,
  CreateVoiceInsightInput,
  VoiceInsightType,
  ExtractedInsight,
} from './types'
import { areInsightsSimilar, normalizeInsightContent } from './insight-extractor'

// ============================================================================
// Read Operations
// ============================================================================

/**
 * Fetch all insights for a voice profile
 */
export async function getVoiceInsights(
  voiceProfileId: string
): Promise<VoiceInsight[]> {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty insights')
    return []
  }

  const { data, error } = await supabase
    .from('voice_insights')
    .select('*')
    .eq('voice_profile_id', voiceProfileId)
    .order('confidence', { ascending: false })

  if (error) {
    console.error('Failed to fetch voice insights:', error)
    return []
  }

  return data || []
}

/**
 * Fetch insights by type for a voice profile
 */
export async function getVoiceInsightsByType(
  voiceProfileId: string,
  insightType: VoiceInsightType
): Promise<VoiceInsight[]> {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('voice_insights')
    .select('*')
    .eq('voice_profile_id', voiceProfileId)
    .eq('insight_type', insightType)
    .order('confidence', { ascending: false })

  if (error) {
    console.error(`Failed to fetch ${insightType} insights:`, error)
    return []
  }

  return data || []
}

/**
 * Fetch insights linked to a specific sample
 */
export async function getInsightsForSample(
  voiceSampleId: string
): Promise<VoiceInsight[]> {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('voice_insights')
    .select('*')
    .eq('voice_sample_id', voiceSampleId)
    .order('insight_type')

  if (error) {
    console.error('Failed to fetch insights for sample:', error)
    return []
  }

  return data || []
}

/**
 * Get insight count for a profile
 */
export async function getInsightCount(
  voiceProfileId: string
): Promise<number> {
  if (!supabase) {
    return 0
  }

  const { count, error } = await supabase
    .from('voice_insights')
    .select('*', { count: 'exact', head: true })
    .eq('voice_profile_id', voiceProfileId)

  if (error) {
    console.error('Failed to count voice insights:', error)
    return 0
  }

  return count || 0
}

/**
 * Get insight counts by type for a profile
 */
export async function getInsightCountsByType(
  voiceProfileId: string
): Promise<Record<VoiceInsightType, number>> {
  if (!supabase) {
    return {
      tone: 0,
      vocabulary: 0,
      structure: 0,
      rhetoric: 0,
      principle: 0,
    }
  }

  const { data, error } = await supabase
    .from('voice_insights')
    .select('insight_type')
    .eq('voice_profile_id', voiceProfileId)

  if (error || !data) {
    console.error('Failed to get insight counts by type:', error)
    return {
      tone: 0,
      vocabulary: 0,
      structure: 0,
      rhetoric: 0,
      principle: 0,
    }
  }

  const counts: Record<VoiceInsightType, number> = {
    tone: 0,
    vocabulary: 0,
    structure: 0,
    rhetoric: 0,
    principle: 0,
  }

  for (const insight of data) {
    const type = insight.insight_type as VoiceInsightType
    if (type in counts) {
      counts[type]++
    }
  }

  return counts
}

/**
 * Get top insights for a profile (highest confidence, limited count)
 */
export async function getTopInsights(
  voiceProfileId: string,
  limit: number = 20
): Promise<VoiceInsight[]> {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('voice_insights')
    .select('*')
    .eq('voice_profile_id', voiceProfileId)
    .order('confidence', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch top insights:', error)
    return []
  }

  return data || []
}

// ============================================================================
// Write Operations
// ============================================================================

/**
 * Create a new voice insight
 */
export async function createVoiceInsight(
  input: CreateVoiceInsightInput
): Promise<VoiceInsight | null> {
  if (!supabase) {
    console.error('Supabase not configured')
    return null
  }

  const { data, error } = await supabase
    .from('voice_insights')
    .insert({
      voice_profile_id: input.voice_profile_id,
      voice_sample_id: input.voice_sample_id || null,
      clerk_user_id: input.clerk_user_id,
      insight_type: input.insight_type,
      content: input.content,
      examples: input.examples || [],
      confidence: input.confidence ?? 0.5,
      sample_count: 1,
      metadata: input.metadata || {},
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create voice insight:', error)
    return null
  }

  return data
}

/**
 * Update an existing insight (for merging)
 */
export async function updateVoiceInsight(
  id: string,
  updates: {
    confidence?: number
    sample_count?: number
    examples?: string[]
    metadata?: Record<string, unknown>
  }
): Promise<VoiceInsight | null> {
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('voice_insights')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update voice insight:', error)
    return null
  }

  return data
}

/**
 * Delete a voice insight
 */
export async function deleteVoiceInsight(id: string): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_insights')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete voice insight:', error)
    return false
  }

  return true
}

/**
 * Delete all insights for a sample (when sample is deleted)
 */
export async function deleteInsightsForSample(
  voiceSampleId: string
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_insights')
    .delete()
    .eq('voice_sample_id', voiceSampleId)

  if (error) {
    console.error('Failed to delete insights for sample:', error)
    return false
  }

  return true
}

/**
 * Delete all insights for a profile
 */
export async function deleteAllInsightsForProfile(
  voiceProfileId: string
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('voice_insights')
    .delete()
    .eq('voice_profile_id', voiceProfileId)

  if (error) {
    console.error('Failed to delete all insights for profile:', error)
    return false
  }

  return true
}

// ============================================================================
// Merge Logic
// ============================================================================

/**
 * Add extracted insights to a profile, merging with existing ones
 *
 * When new insights match existing ones:
 * - Increase confidence (capped at 1.0)
 * - Increment sample_count
 * - Append new examples (max 10)
 *
 * @param voiceProfileId - The profile to add insights to
 * @param clerkUserId - The user's Clerk ID
 * @param voiceSampleId - The sample these insights came from
 * @param extractedInsights - Insights to add/merge
 * @returns Number of new insights created and existing insights updated
 */
export async function mergeInsights(
  voiceProfileId: string,
  clerkUserId: string,
  voiceSampleId: string | null,
  extractedInsights: ExtractedInsight[]
): Promise<{ created: number; merged: number }> {
  if (!supabase || extractedInsights.length === 0) {
    return { created: 0, merged: 0 }
  }

  // Fetch existing insights for this profile
  const existingInsights = await getVoiceInsights(voiceProfileId)

  let created = 0
  let merged = 0

  for (const extracted of extractedInsights) {
    // Find matching existing insight (same type and similar content)
    const match = existingInsights.find(
      (existing) =>
        existing.insight_type === extracted.type &&
        areInsightsSimilar(existing.content, extracted.content)
    )

    if (match) {
      // Merge with existing insight
      const newConfidence = Math.min(
        1.0,
        match.confidence + extracted.confidence * 0.2 // Diminishing returns
      )

      // Combine examples, keeping unique ones (max 10)
      const existingExamples = match.examples || []
      const newExamples = extracted.examples || []
      const combinedExamples = [...new Set([...existingExamples, ...newExamples])].slice(0, 10)

      await updateVoiceInsight(match.id, {
        confidence: Math.round(newConfidence * 100) / 100,
        sample_count: (match.sample_count || 1) + 1,
        examples: combinedExamples,
      })

      merged++
    } else {
      // Create new insight
      const result = await createVoiceInsight({
        voice_profile_id: voiceProfileId,
        voice_sample_id: voiceSampleId || undefined,
        clerk_user_id: clerkUserId,
        insight_type: extracted.type,
        content: extracted.content,
        examples: extracted.examples,
        confidence: extracted.confidence,
      })

      if (result) {
        created++
        // Add to existing insights list for subsequent matching
        existingInsights.push(result)
      }
    }
  }

  return { created, merged }
}

/**
 * Recalculate insight confidence based on sample count
 *
 * Used when samples are removed to adjust confidence levels.
 * Confidence decreases when supporting samples are removed.
 *
 * @param voiceProfileId - The profile to recalculate
 * @param removedSampleId - The sample that was removed
 */
export async function recalculateInsightConfidence(
  voiceProfileId: string,
  removedSampleId: string
): Promise<void> {
  if (!supabase) {
    return
  }

  // Find insights that were associated with the removed sample
  const { data: affectedInsights, error } = await supabase
    .from('voice_insights')
    .select('*')
    .eq('voice_profile_id', voiceProfileId)
    .eq('voice_sample_id', removedSampleId)

  if (error || !affectedInsights) {
    console.error('Failed to find affected insights:', error)
    return
  }

  for (const insight of affectedInsights) {
    if (insight.sample_count <= 1) {
      // Only one sample contributed - delete the insight
      await deleteVoiceInsight(insight.id)
    } else {
      // Multiple samples contributed - reduce confidence
      const newSampleCount = (insight.sample_count || 1) - 1
      const confidenceReduction = 0.15 // Reduce confidence when sample is removed
      const newConfidence = Math.max(0.3, insight.confidence - confidenceReduction)

      await updateVoiceInsight(insight.id, {
        sample_count: newSampleCount,
        confidence: Math.round(newConfidence * 100) / 100,
      })
    }
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get insight statistics for a profile
 */
export async function getInsightStats(voiceProfileId: string): Promise<{
  total: number
  byType: Record<VoiceInsightType, number>
  averageConfidence: number
  highConfidenceCount: number
}> {
  const insights = await getVoiceInsights(voiceProfileId)

  const byType: Record<VoiceInsightType, number> = {
    tone: 0,
    vocabulary: 0,
    structure: 0,
    rhetoric: 0,
    principle: 0,
  }

  let totalConfidence = 0
  let highConfidenceCount = 0

  for (const insight of insights) {
    const type = insight.insight_type as VoiceInsightType
    if (type in byType) {
      byType[type]++
    }
    totalConfidence += insight.confidence
    if (insight.confidence >= 0.7) {
      highConfidenceCount++
    }
  }

  return {
    total: insights.length,
    byType,
    averageConfidence:
      insights.length > 0
        ? Math.round((totalConfidence / insights.length) * 100) / 100
        : 0,
    highConfidenceCount,
  }
}

/**
 * Get insights formatted for style guide synthesis
 *
 * Groups insights by type and weights by confidence.
 *
 * @param voiceProfileId - The profile to get insights from
 * @returns Insights organized by type with weighted importance
 */
export async function getInsightsForSynthesis(voiceProfileId: string): Promise<{
  tone: VoiceInsight[]
  vocabulary: VoiceInsight[]
  structure: VoiceInsight[]
  rhetoric: VoiceInsight[]
  principle: VoiceInsight[]
}> {
  const insights = await getVoiceInsights(voiceProfileId)

  // Sort by weighted score (confidence * sample_count) and group by type
  const weightedInsights = insights.map((insight) => ({
    ...insight,
    weight: insight.confidence * Math.sqrt(insight.sample_count || 1),
  }))

  const sorted = weightedInsights.sort((a, b) => b.weight - a.weight)

  const result: Record<VoiceInsightType, VoiceInsight[]> = {
    tone: [],
    vocabulary: [],
    structure: [],
    rhetoric: [],
    principle: [],
  }

  for (const insight of sorted) {
    const type = insight.insight_type as VoiceInsightType
    if (type in result) {
      result[type].push(insight)
    }
  }

  return result
}

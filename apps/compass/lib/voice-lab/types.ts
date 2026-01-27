/**
 * Voice Lab Module - Type Definitions
 *
 * Types for voice profiles that store writing styles as
 * natural language markdown style guides.
 */

// ============================================================================
// Voice Profile Types
// ============================================================================

/**
 * Training status for a voice profile
 */
export type VoiceTrainingStatus = 'ready' | 'processing' | 'needs_update'

/**
 * A voice profile containing a writing style guide
 */
export interface VoiceProfile {
  id: string
  clerk_user_id: string
  name: string
  /** URL-friendly slug (e.g., case-study-writer) */
  slug: string | null
  description: string | null
  /** AI-generated markdown style guide (the main content) */
  style_guide: string | null
  /** Original samples used to generate the style guide (legacy) */
  source_samples: string[] | null
  is_active: boolean
  /** Style guide version - increments on each regeneration */
  style_guide_version: number
  /** Timestamp of last style guide synthesis */
  last_synthesized_at: string | null
  /** Current training status */
  training_status: VoiceTrainingStatus
  /** Cached count of training samples */
  sample_count: number
  /** Cached count of extracted insights */
  insight_count: number
  /** Free-form labels for organizing profiles */
  labels: string[]
  created_at: string
  updated_at: string
}

// ============================================================================
// Voice Sample Types
// ============================================================================

/**
 * Source type for a voice sample
 */
export type VoiceSampleSourceType = 'manual' | 'pdf' | 'url' | 'draft'

/**
 * Sample category types
 */
export type VoiceSampleCategory = 'case-study' | 'blog' | 'email' | 'social' | 'documentation' | 'marketing' | 'other'

/**
 * A writing sample used for voice profile training
 */
export interface VoiceSample {
  id: string
  voice_profile_id: string
  clerk_user_id: string
  content: string
  source_type: VoiceSampleSourceType
  source_name: string | null
  word_count: number
  quality_score: number
  is_processed: boolean
  processed_at: string | null
  /** Category for organizing samples */
  category: VoiceSampleCategory | null
  /** Optional notes about the sample */
  notes: string | null
  created_at: string
  updated_at: string
}

/**
 * Input for creating a new voice sample
 */
export interface CreateVoiceSampleInput {
  voice_profile_id: string
  clerk_user_id: string
  content: string
  source_type?: VoiceSampleSourceType
  source_name?: string
  category?: VoiceSampleCategory
  notes?: string
}

/**
 * Input for updating an existing voice sample
 */
export interface UpdateVoiceSampleInput {
  category?: VoiceSampleCategory | null
  notes?: string | null
  quality_score?: number
}

// ============================================================================
// Voice Insight Types
// ============================================================================

/**
 * Insight type categories
 */
export type VoiceInsightType = 'tone' | 'vocabulary' | 'structure' | 'rhetoric' | 'principle'

/**
 * An extracted voice insight from writing samples
 */
export interface VoiceInsight {
  id: string
  voice_profile_id: string
  voice_sample_id: string | null
  clerk_user_id: string
  insight_type: VoiceInsightType
  content: string
  examples: string[]
  confidence: number
  sample_count: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

/**
 * Input for creating a new voice insight
 */
export interface CreateVoiceInsightInput {
  voice_profile_id: string
  voice_sample_id?: string
  clerk_user_id: string
  insight_type: VoiceInsightType
  content: string
  examples?: string[]
  confidence?: number
  metadata?: Record<string, unknown>
}

/**
 * Extracted insight from AI analysis (before merging)
 */
export interface ExtractedInsight {
  type: VoiceInsightType
  content: string
  examples: string[]
  confidence: number
}

/**
 * Input for creating a new voice profile
 */
export interface CreateVoiceProfileInput {
  clerk_user_id: string
  name: string
  description?: string
  style_guide?: string
  source_samples?: string[]
  is_active?: boolean
  labels?: string[]
}

/**
 * Input for updating an existing voice profile
 */
export interface UpdateVoiceProfileInput {
  name?: string
  description?: string
  style_guide?: string
  source_samples?: string[]
  is_active?: boolean
  labels?: string[]
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Request to generate a style guide from writing samples
 */
export interface GenerateStyleGuideRequest {
  /** Writing samples to analyze */
  samples: string[]
  /** Name for the resulting profile */
  name: string
  /** Optional description */
  description?: string
}

/**
 * Response from style guide generation
 */
export interface GenerateStyleGuideResponse {
  /** The generated style guide markdown */
  styleGuide: string
  /** The created profile (if saved) */
  profile?: VoiceProfile
}

/**
 * Request to create/import a voice profile
 */
export interface CreateProfileRequest {
  name: string
  description?: string
  styleGuide?: string
  sourceSamples?: string[]
}

/**
 * Request to update a voice profile
 */
export interface UpdateProfileRequest {
  name?: string
  description?: string
  styleGuide?: string
  sourceSamples?: string[]
  isActive?: boolean
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * List of voice profiles response
 */
export interface ListProfilesResponse {
  profiles: VoiceProfile[]
  count: number
}

/**
 * Single profile response
 */
export interface ProfileResponse {
  profile: VoiceProfile
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: string
  message?: string
}

// ============================================================================
// Voice Training API Types
// ============================================================================

/**
 * Request to add samples to a profile
 */
export interface AddSamplesRequest {
  samples: Array<{
    content: string
    sourceType?: VoiceSampleSourceType
    sourceName?: string
    category?: VoiceSampleCategory
    notes?: string
  }>
  autoResynthesize?: boolean
}

/**
 * Response from adding samples
 */
export interface AddSamplesResponse {
  samplesAdded: number
  insightsExtracted: number
  profile: VoiceProfile
}

/**
 * Response from listing samples
 */
export interface ListSamplesResponse {
  samples: VoiceSample[]
  count: number
}

/**
 * Response from listing insights
 */
export interface ListInsightsResponse {
  insights: VoiceInsight[]
  count: number
  byType: Record<VoiceInsightType, number>
}

/**
 * Response from synthesizing style guide
 */
export interface SynthesizeResponse {
  profile: VoiceProfile
  styleGuide: string
  version: number
}

// ============================================================================
// Library & Filtering Types
// ============================================================================

/**
 * Filter options for listing voice profiles
 */
export interface VoiceProfileFilters {
  status?: VoiceTrainingStatus | 'all'
  labels?: string[]
  search?: string
}

/**
 * Category statistics for a profile
 */
export interface CategoryStats {
  category: VoiceSampleCategory | 'uncategorized'
  count: number
}

/**
 * Extended profile with stats for library display
 */
export interface VoiceProfileWithStats extends VoiceProfile {
  categoryStats?: CategoryStats[]
}

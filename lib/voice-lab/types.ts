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
 * A voice profile containing a writing style guide
 */
export interface VoiceProfile {
  id: string
  clerk_user_id: string
  name: string
  description: string | null
  /** AI-generated markdown style guide (the main content) */
  style_guide: string | null
  /** Original samples used to generate the style guide */
  source_samples: string[] | null
  is_active: boolean
  created_at: string
  updated_at: string
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

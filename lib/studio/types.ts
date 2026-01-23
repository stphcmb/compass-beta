/**
 * Studio Module - Type Definitions
 *
 * Types for ICP (Integrated Content Platform) projects,
 * content generation, and analysis.
 */

// ============================================================================
// Project Types
// ============================================================================

/**
 * Content format options
 */
export type ContentFormat = 'blog' | 'linkedin' | 'memo' | 'byline'

/**
 * Content domain for validation routing
 */
export type ContentDomain = 'ai_discourse' | 'anduin_product' | 'hybrid'

/**
 * Project status through the workflow
 */
export type ProjectStatus = 'brief' | 'draft' | 'editing' | 'complete'

/**
 * Source of draft version change
 */
export type ChangeSource = 'generated' | 'user_edit' | 'regenerated' | 'ai_suggestion'

/**
 * Citation added to content
 */
export interface Citation {
  id: string
  authorName: string
  authorSlug?: string
  quote: string
  position?: string
  addedAt: string
}

/**
 * A project tracking content from brief to export
 */
export interface Project {
  id: string
  clerk_user_id: string

  // Brief
  title: string | null
  format: ContentFormat | null
  audience: string | null
  key_points: string[] | null
  additional_context: string | null
  content_domain: ContentDomain | null

  // Voice
  voice_profile_id: string | null

  // Current draft
  current_draft: string | null
  current_version: number
  word_count: number | null

  // Validation results
  last_voice_check: VoiceCheckResult | null
  last_canon_check: CanonCheckResult | null
  last_brief_coverage: BriefCoverageResult | null

  // Citations
  citations: Citation[] | null

  // Status
  status: ProjectStatus

  created_at: string
  updated_at: string
}

/**
 * A draft version snapshot
 */
export interface ProjectDraft {
  id: string
  project_id: string
  version: number
  content: string
  word_count: number | null

  change_source: ChangeSource | null
  change_summary: string | null

  voice_check_snapshot: VoiceCheckResult | null
  canon_check_snapshot: CanonCheckResult | null

  created_at: string
}

/**
 * User content defaults
 */
export interface UserContentDefaults {
  id: string
  clerk_user_id: string

  default_format: ContentFormat | null
  default_audience: string | null
  default_content_domain: ContentDomain | null
  default_voice_profile_id: string | null

  preferences: Record<string, unknown>

  created_at: string
  updated_at: string
}

// ============================================================================
// Validation Result Types
// ============================================================================

/**
 * Voice check result
 */
export interface VoiceCheckResult {
  score: number
  suggestions: VoiceSuggestion[]
  checked_at: string
}

export interface VoiceSuggestion {
  location: string
  issue: string
  original: string
  suggested: string
}

/**
 * Canon check result
 */
export interface CanonCheckResult {
  matched_camps: CanonCampMatch[]
  missing_perspectives: CanonMissingPerspective[]
  checked_at: string
}

export interface CanonCampMatch {
  camp: string
  relevance: number
  authors: string[]
}

export interface CanonMissingPerspective {
  camp: string
  reason: string
  suggested_paragraph?: string
}

/**
 * Brief coverage result
 */
export interface BriefCoverageResult {
  covered: string[]
  missing: string[]
  checked_at: string
}

// ============================================================================
// API Request Types
// ============================================================================

/**
 * Brief input for creating/updating a project
 */
export interface BriefInput {
  title: string
  format: ContentFormat
  audience: string
  key_points: string[]
  additional_context?: string
  content_domain: ContentDomain
}

/**
 * Request to create a new project
 */
export interface CreateProjectRequest {
  brief?: Partial<BriefInput>
  voice_profile_id?: string
}

/**
 * Request to update a project
 */
export interface UpdateProjectRequest {
  title?: string
  format?: ContentFormat
  audience?: string
  key_points?: string[]
  additional_context?: string
  content_domain?: ContentDomain
  voice_profile_id?: string
  current_draft?: string
  status?: ProjectStatus
  last_voice_check?: VoiceCheckResult
  last_canon_check?: CanonCheckResult
  last_brief_coverage?: BriefCoverageResult
  citations?: Citation[]
}

/**
 * Request to generate content
 */
export interface GenerateContentRequest {
  project_id?: string
  brief: BriefInput
  voice_profile_id?: string
  skip_voice?: boolean
}

/**
 * Request to analyze content
 */
export interface AnalyzeContentRequest {
  project_id: string
  content: string
  checks: {
    voice?: boolean
    canon?: boolean
    brief_coverage?: boolean
  }
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Project list response
 */
export interface ListProjectsResponse {
  projects: Project[]
  count: number
}

/**
 * Single project response
 */
export interface ProjectResponse {
  project: Project
}

/**
 * Draft list response
 */
export interface ListDraftsResponse {
  drafts: ProjectDraft[]
  count: number
}

/**
 * Single draft response
 */
export interface DraftResponse {
  draft: ProjectDraft
}

/**
 * Generate content response
 */
export interface GenerateContentResponse {
  project_id: string
  version: number
  draft: {
    content: string
    word_count: number
  }
  voice_match: {
    score: number
    notes: string[]
  }
}

/**
 * Analyze content response
 */
export interface AnalyzeContentResponse {
  voice_check?: VoiceCheckResult
  canon_check?: CanonCheckResult
  brief_coverage?: BriefCoverageResult
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: string
  message?: string
}

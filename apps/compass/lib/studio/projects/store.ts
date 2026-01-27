/**
 * Studio Projects Store
 *
 * CRUD operations for ICP projects stored in Supabase.
 */

import { supabaseAdmin } from '@/lib/supabase-admin'

// Use admin client to bypass RLS (we filter by clerk_user_id in application code)
const supabase = supabaseAdmin
import {
  Project,
  ProjectDraft,
  CreateProjectRequest,
  UpdateProjectRequest,
  ChangeSource,
  VoiceCheckResult,
  CanonCheckResult,
} from '../types'

// ============================================================================
// Project Read Operations
// ============================================================================

/**
 * Fetch all projects for a user
 */
export async function getProjects(clerkUserId: string): Promise<Project[]> {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty projects')
    return []
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }

  return data || []
}

/**
 * Fetch a single project by ID
 */
export async function getProject(id: string): Promise<Project | null> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return null
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to fetch project:', error)
    return null
  }

  return data
}

/**
 * Fetch a project by ID with user ownership verification
 */
export async function getProjectForUser(
  id: string,
  clerkUserId: string
): Promise<Project | null> {
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null
    }
    console.error('Failed to fetch project:', error)
    return null
  }

  return data
}

// ============================================================================
// Project Write Operations
// ============================================================================

/**
 * Create a new project
 */
export async function createProject(
  clerkUserId: string,
  input: CreateProjectRequest
): Promise<Project | null> {
  if (!supabase) {
    console.error('Supabase not configured')
    return null
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      clerk_user_id: clerkUserId,
      title: input.brief?.title || null,
      format: input.brief?.format || null,
      audience: input.brief?.audience || null,
      key_points: input.brief?.key_points || null,
      additional_context: input.brief?.additional_context || null,
      content_domain: input.brief?.content_domain || null,
      voice_profile_id: input.voice_profile_id || null,
      status: 'brief',
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create project:', error)
    return null
  }

  return data
}

/**
 * Update an existing project
 * Optionally creates a new draft version if content changed
 */
export async function updateProject(
  id: string,
  clerkUserId: string,
  input: UpdateProjectRequest,
  createVersion?: {
    changeSource: ChangeSource
    changeSummary?: string
  }
): Promise<Project | null> {
  if (!supabase) {
    return null
  }

  // Build update object with only provided fields
  const updateData: Record<string, unknown> = {}
  if (input.title !== undefined) updateData.title = input.title
  if (input.format !== undefined) updateData.format = input.format
  if (input.audience !== undefined) updateData.audience = input.audience
  if (input.key_points !== undefined) updateData.key_points = input.key_points
  if (input.additional_context !== undefined) updateData.additional_context = input.additional_context
  if (input.content_domain !== undefined) updateData.content_domain = input.content_domain
  if (input.voice_profile_id !== undefined) updateData.voice_profile_id = input.voice_profile_id
  if (input.current_draft !== undefined) updateData.current_draft = input.current_draft
  if (input.status !== undefined) updateData.status = input.status
  if (input.last_voice_check !== undefined) updateData.last_voice_check = input.last_voice_check
  if (input.last_canon_check !== undefined) updateData.last_canon_check = input.last_canon_check
  if (input.last_brief_coverage !== undefined) updateData.last_brief_coverage = input.last_brief_coverage
  if (input.citations !== undefined) updateData.citations = input.citations

  // Calculate word count if draft changed
  if (input.current_draft !== undefined) {
    updateData.word_count = input.current_draft
      ? input.current_draft.trim().split(/\s+/).filter(Boolean).length
      : 0
  }

  // If creating a new version, increment version number
  if (createVersion && input.current_draft !== undefined) {
    // First get current version
    const { data: currentProject } = await supabase
      .from('projects')
      .select('current_version')
      .eq('id', id)
      .eq('clerk_user_id', clerkUserId)
      .single()

    if (currentProject) {
      const newVersion = (currentProject.current_version || 0) + 1
      updateData.current_version = newVersion

      // Create draft version record
      await createProjectDraft(id, {
        version: newVersion,
        content: input.current_draft,
        wordCount: updateData.word_count as number,
        changeSource: createVersion.changeSource,
        changeSummary: createVersion.changeSummary,
        voiceCheckSnapshot: input.last_voice_check,
        canonCheckSnapshot: input.last_canon_check,
      })
    }
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .eq('clerk_user_id', clerkUserId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update project:', error)
    return null
  }

  return data
}

/**
 * Delete a project
 */
export async function deleteProject(
  id: string,
  clerkUserId: string
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Failed to delete project:', error)
    return false
  }

  return true
}

// ============================================================================
// Draft Version Operations
// ============================================================================

/**
 * Create a new draft version
 */
async function createProjectDraft(
  projectId: string,
  input: {
    version: number
    content: string
    wordCount?: number
    changeSource: ChangeSource
    changeSummary?: string
    voiceCheckSnapshot?: VoiceCheckResult
    canonCheckSnapshot?: CanonCheckResult
  }
): Promise<ProjectDraft | null> {
  if (!supabase) {
    return null
  }

  const wordCount = input.wordCount ?? (input.content
    ? input.content.trim().split(/\s+/).filter(Boolean).length
    : 0)

  const { data, error } = await supabase
    .from('project_drafts')
    .insert({
      project_id: projectId,
      version: input.version,
      content: input.content,
      word_count: wordCount,
      change_source: input.changeSource,
      change_summary: input.changeSummary || null,
      voice_check_snapshot: input.voiceCheckSnapshot || null,
      canon_check_snapshot: input.canonCheckSnapshot || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create project draft:', error)
    return null
  }

  return data
}

/**
 * Get all draft versions for a project
 */
export async function getProjectDrafts(
  projectId: string,
  clerkUserId: string
): Promise<ProjectDraft[]> {
  if (!supabase) {
    return []
  }

  // First verify project ownership
  const project = await getProjectForUser(projectId, clerkUserId)
  if (!project) {
    return []
  }

  const { data, error } = await supabase
    .from('project_drafts')
    .select('*')
    .eq('project_id', projectId)
    .order('version', { ascending: false })

  if (error) {
    console.error('Failed to fetch project drafts:', error)
    return []
  }

  return data || []
}

/**
 * Get a specific draft version
 */
export async function getProjectDraft(
  projectId: string,
  version: number,
  clerkUserId: string
): Promise<ProjectDraft | null> {
  if (!supabase) {
    return null
  }

  // First verify project ownership
  const project = await getProjectForUser(projectId, clerkUserId)
  if (!project) {
    return null
  }

  const { data, error } = await supabase
    .from('project_drafts')
    .select('*')
    .eq('project_id', projectId)
    .eq('version', version)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Failed to fetch project draft:', error)
    return null
  }

  return data
}

// ============================================================================
// User Defaults Operations
// ============================================================================

/**
 * Get user content defaults
 */
export async function getUserDefaults(
  clerkUserId: string
): Promise<Record<string, unknown> | null> {
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('user_content_defaults')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No defaults set yet
      return null
    }
    console.error('Failed to fetch user defaults:', error)
    return null
  }

  return data
}

/**
 * Update or create user content defaults
 */
export async function upsertUserDefaults(
  clerkUserId: string,
  defaults: Record<string, unknown>
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('user_content_defaults')
    .upsert({
      clerk_user_id: clerkUserId,
      ...defaults,
    }, {
      onConflict: 'clerk_user_id',
    })

  if (error) {
    console.error('Failed to upsert user defaults:', error)
    return false
  }

  return true
}

// ============================================================================
// Project Fork/Duplicate Operations
// ============================================================================

/**
 * Fork/duplicate a project to create a new independent copy
 * The new project preserves content but gets a new ID and fresh version history
 */
export async function forkProject(
  projectId: string,
  clerkUserId: string,
  options?: {
    newTitle?: string
    preserveVersionHistory?: boolean
  }
): Promise<Project | null> {
  if (!supabase) {
    return null
  }

  // Fetch the original project
  const original = await getProjectForUser(projectId, clerkUserId)
  if (!original) {
    console.error('Project not found or access denied')
    return null
  }

  // Create a new project with copied content
  const forkedTitle = options?.newTitle || `${original.title || 'Untitled'} (Copy)`

  const { data, error } = await supabase
    .from('projects')
    .insert({
      clerk_user_id: clerkUserId,
      title: forkedTitle,
      format: original.format,
      audience: original.audience,
      key_points: original.key_points,
      additional_context: original.additional_context,
      content_domain: original.content_domain,
      voice_profile_id: original.voice_profile_id,
      current_draft: original.current_draft,
      word_count: original.word_count,
      status: 'editing', // Start as editing since we have content
      current_version: 1,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to fork project:', error)
    return null
  }

  // Create initial version record for the forked project
  if (data && original.current_draft) {
    await supabase
      .from('project_drafts')
      .insert({
        project_id: data.id,
        version: 1,
        content: original.current_draft,
        word_count: original.word_count || 0,
        change_source: 'user_edit',
        change_summary: `Forked from "${original.title || 'Untitled'}"`,
      })
  }

  return data
}

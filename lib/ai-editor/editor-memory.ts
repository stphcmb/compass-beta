/**
 * Editor Memory Module
 *
 * Manages the "institutional memory" of the AI editor - what it has learned
 * about each user's writing style, stances, and preferences.
 *
 * These memories are stored as natural language statements that get injected
 * directly into prompts, making the AI feel like a senior editor who has
 * worked with this writer for years.
 */

import { supabase } from '@/lib/supabase'

// ============================================================================
// Types
// ============================================================================

export type EditorMemoryType =
  | 'voice'           // Writing style: tone, formality, sentence structure
  | 'stance'          // Opinions and perspectives on topics
  | 'guideline'       // Explicit rules to always apply
  | 'sample_insight'  // Insights learned from analyzing writing samples
  | 'feedback_pattern' // Patterns learned from user feedback

export interface EditorMemory {
  id: string
  clerk_user_id: string
  memory_type: EditorMemoryType
  content: string
  source: string | null
  confidence: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CreateEditorMemoryInput {
  clerk_user_id: string
  memory_type: EditorMemoryType
  content: string
  source?: string
  confidence?: number
  metadata?: Record<string, unknown>
}

export interface UpdateEditorMemoryInput {
  content?: string
  confidence?: number
  metadata?: Record<string, unknown>
}

// ============================================================================
// Database Operations
// ============================================================================

/**
 * Fetch all memories for a user
 */
export async function getEditorMemories(
  clerkUserId: string
): Promise<EditorMemory[]> {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty memories')
    return []
  }

  const { data, error } = await supabase
    .from('editor_memory')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .order('memory_type')
    .order('confidence', { ascending: false })

  if (error) {
    console.error('Failed to fetch editor memories:', error)
    return []
  }

  return data || []
}

/**
 * Fetch memories by type for a user
 */
export async function getEditorMemoriesByType(
  clerkUserId: string,
  memoryType: EditorMemoryType
): Promise<EditorMemory[]> {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('editor_memory')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .eq('memory_type', memoryType)
    .order('confidence', { ascending: false })

  if (error) {
    console.error(`Failed to fetch ${memoryType} memories:`, error)
    return []
  }

  return data || []
}

/**
 * Create a new memory
 */
export async function createEditorMemory(
  input: CreateEditorMemoryInput
): Promise<EditorMemory | null> {
  if (!supabase) {
    console.error('Supabase not configured')
    return null
  }

  const { data, error } = await supabase
    .from('editor_memory')
    .insert({
      clerk_user_id: input.clerk_user_id,
      memory_type: input.memory_type,
      content: input.content,
      source: input.source || null,
      confidence: input.confidence ?? 0.5,
      metadata: input.metadata || {},
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create editor memory:', error)
    return null
  }

  return data
}

/**
 * Create multiple memories at once
 */
export async function createEditorMemories(
  inputs: CreateEditorMemoryInput[]
): Promise<EditorMemory[]> {
  if (!supabase || inputs.length === 0) {
    return []
  }

  const records = inputs.map((input) => ({
    clerk_user_id: input.clerk_user_id,
    memory_type: input.memory_type,
    content: input.content,
    source: input.source || null,
    confidence: input.confidence ?? 0.5,
    metadata: input.metadata || {},
  }))

  const { data, error } = await supabase
    .from('editor_memory')
    .insert(records)
    .select()

  if (error) {
    console.error('Failed to create editor memories:', error)
    return []
  }

  return data || []
}

/**
 * Update an existing memory
 */
export async function updateEditorMemory(
  id: string,
  input: UpdateEditorMemoryInput
): Promise<EditorMemory | null> {
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('editor_memory')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update editor memory:', error)
    return null
  }

  return data
}

/**
 * Delete a memory
 */
export async function deleteEditorMemory(id: string): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase.from('editor_memory').delete().eq('id', id)

  if (error) {
    console.error('Failed to delete editor memory:', error)
    return false
  }

  return true
}

/**
 * Delete all memories for a user (useful for testing/reset)
 */
export async function deleteAllEditorMemories(
  clerkUserId: string
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { error } = await supabase
    .from('editor_memory')
    .delete()
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Failed to delete all editor memories:', error)
    return false
  }

  return true
}

// ============================================================================
// Context Building
// ============================================================================

/**
 * Build the editor context string to inject into prompts
 *
 * This transforms the user's memories into a natural language context
 * that makes the AI behave like a senior editor who knows this writer well.
 */
export function buildEditorContext(memories: EditorMemory[]): string {
  if (memories.length === 0) {
    return ''
  }

  // Group memories by type
  const voiceMemories = memories.filter((m) => m.memory_type === 'voice')
  const stanceMemories = memories.filter((m) => m.memory_type === 'stance')
  const guidelines = memories.filter((m) => m.memory_type === 'guideline')
  const sampleInsights = memories.filter(
    (m) => m.memory_type === 'sample_insight'
  )
  const feedbackPatterns = memories.filter(
    (m) => m.memory_type === 'feedback_pattern'
  )

  // Build context sections
  const sections: string[] = []

  // Voice section
  if (voiceMemories.length > 0) {
    sections.push(`### Their Writing Voice
${voiceMemories.map((m) => `- ${m.content}`).join('\n')}`)
  }

  // Stances section
  if (stanceMemories.length > 0) {
    sections.push(`### Their Stances & Perspectives
${stanceMemories.map((m) => `- ${m.content}`).join('\n')}`)
  }

  // Editorial Guidelines (highest priority - always apply)
  if (guidelines.length > 0) {
    sections.push(`### Editorial Guidelines (ALWAYS APPLY THESE)
${guidelines.map((m) => `- ${m.content}`).join('\n')}`)
  }

  // Insights from writing samples
  if (sampleInsights.length > 0) {
    sections.push(`### Insights from Their Writing
${sampleInsights.map((m) => `- ${m.content}`).join('\n')}`)
  }

  // Patterns from feedback
  if (feedbackPatterns.length > 0) {
    sections.push(`### Learned from Feedback
${feedbackPatterns.map((m) => `- ${m.content}`).join('\n')}`)
  }

  // Combine into full context
  return `
---
## EDITOR'S MEMORY

You are a senior editor who has worked with this writer for years. You know them well.
Use this knowledge to give feedback that feels personalized and builds on your history together.

${sections.join('\n\n')}

Apply these insights to your analysis. Personalize your feedback based on what you know about this writer.
Reference their preferences when relevant (e.g., "Given your usual focus on X..." or "This aligns with your perspective on Y...").
---

`
}

/**
 * Get the editor context for a user, ready to inject into a prompt
 */
export async function getEditorContextForUser(
  clerkUserId: string
): Promise<string> {
  const memories = await getEditorMemories(clerkUserId)
  return buildEditorContext(memories)
}

/**
 * Check if a user has any memories (to decide whether to show personalization)
 */
export async function hasEditorMemories(
  clerkUserId: string
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { count, error } = await supabase
    .from('editor_memory')
    .select('*', { count: 'exact', head: true })
    .eq('clerk_user_id', clerkUserId)

  if (error) {
    console.error('Failed to check editor memories:', error)
    return false
  }

  return (count || 0) > 0
}

/**
 * Get memory count by type for a user
 */
export async function getEditorMemoryStats(
  clerkUserId: string
): Promise<Record<EditorMemoryType, number>> {
  const memories = await getEditorMemories(clerkUserId)

  const stats: Record<EditorMemoryType, number> = {
    voice: 0,
    stance: 0,
    guideline: 0,
    sample_insight: 0,
    feedback_pattern: 0,
  }

  for (const memory of memories) {
    stats[memory.memory_type as EditorMemoryType]++
  }

  return stats
}

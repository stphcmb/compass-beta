'use server'

import { currentUser } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

/**
 * Server Action to fetch user's search history
 * Optimized with proper error handling and type safety
 */
export async function getUserSearchHistory() {
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  if (!supabase) {
    return { error: 'Database not configured' }
  }

  try {
    const { data, error } = await supabase
      .from('user_searches')
      .select('id, query, timestamp, domain, camp, cached_result, note')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(100) // Limit to recent 100 items for performance

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Failed to fetch search history:', error)
    return { error: 'Failed to fetch search history' }
  }
}

/**
 * Server Action to fetch user's analysis history
 */
export async function getUserAnalysisHistory() {
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  if (!supabase) {
    return { error: 'Database not configured' }
  }

  try {
    const { data, error } = await supabase
      .from('user_analyses')
      .select('id, text, preview, timestamp, cached_result, note')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(100)

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Failed to fetch analysis history:', error)
    return { error: 'Failed to fetch analysis history' }
  }
}

/**
 * Server Action to fetch user's favorite authors
 */
export async function getUserFavoriteAuthors() {
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  if (!supabase) {
    return { error: 'Database not configured' }
  }

  try {
    const { data, error } = await supabase
      .from('user_favorite_authors')
      .select('id, author_id, added_at')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false })

    if (error) throw error

    // Fetch author details efficiently in a single query
    if (data && data.length > 0) {
      const authorIds = data.map((fav) => fav.author_id)
      const { data: authors, error: authorsError } = await supabase
        .from('authors')
        .select('id, name')
        .in('id', authorIds)

      if (authorsError) throw authorsError

      // Merge favorite data with author details
      const favorites = data.map((fav) => ({
        id: fav.author_id,
        name: authors?.find((a) => a.id === fav.author_id)?.name || 'Unknown',
        addedAt: fav.added_at,
      }))

      return { success: true, data: favorites }
    }

    return { success: true, data: [] }
  } catch (error) {
    console.error('Failed to fetch favorite authors:', error)
    return { error: 'Failed to fetch favorite authors' }
  }
}

/**
 * Server Action to delete a search history item
 */
export async function deleteSearchItem(itemId: string) {
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  if (!supabase) {
    return { error: 'Database not configured' }
  }

  try {
    const { error } = await supabase
      .from('user_searches')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id) // Ensure user owns this item

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Failed to delete search item:', error)
    return { error: 'Failed to delete item' }
  }
}

/**
 * Server Action to delete an analysis history item
 */
export async function deleteAnalysisItem(itemId: string) {
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  if (!supabase) {
    return { error: 'Database not configured' }
  }

  try {
    const { error } = await supabase
      .from('user_analyses')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Failed to delete analysis item:', error)
    return { error: 'Failed to delete item' }
  }
}

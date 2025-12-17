/**
 * Shared Search Expansion Utilities
 *
 * Provides unified search term expansion for both main search and AI Editor.
 * Combines n8n expansion with semantic fallback for robust search.
 */

import { expandQuery, extractSearchTerms } from './client'
import { expandQuerySemantics } from './semantic-provider'

/**
 * Expand search input into relevant search terms
 *
 * This is the shared expansion logic used by both:
 * - Main search (app/results/page.tsx)
 * - AI Editor (lib/ai-editor/query.ts)
 *
 * Strategy:
 * 1. Try n8n expansion first (AI-powered, best quality)
 * 2. Fall back to local semantic expansion if n8n unavailable
 * 3. Always include original query terms
 *
 * @param input - User query or extracted keywords (string or array)
 * @returns Array of unique search terms
 */
export async function expandSearchTerms(input: string | string[]): Promise<string[]> {
  // Normalize input to string
  const queryText = Array.isArray(input) ? input.join(' ') : input

  if (!queryText || !queryText.trim()) {
    return []
  }

  const queryLower = queryText.toLowerCase().trim()
  const terms: string[] = []

  // Try n8n expansion first
  try {
    const expandedQueries = await expandQuery(queryLower)

    if (expandedQueries && expandedQueries.length > 0) {
      // Extract terms from n8n expanded queries
      const n8nTerms = extractSearchTerms(expandedQueries)
      terms.push(...n8nTerms)
    }
  } catch (error) {
    console.log('⚠️  n8n expansion failed, using semantic fallback:', error)
  }

  // Add semantic expansion (either as fallback or supplement)
  if (terms.length === 0) {
    // Fallback: Use semantic expansion when n8n fails
    const semanticTerms = expandQuerySemantics(queryLower)
    terms.push(...semanticTerms)
  }

  // Always include original query terms
  const originalWords = queryLower
    .split(/\s+/)
    .filter(word => word.length > 2)

  terms.push(...originalWords)

  // Return unique terms
  return Array.from(new Set(terms))
}

/**
 * Expand search input and also return the original expanded queries
 *
 * Used by main search to display the expanded queries in the UI.
 *
 * @param query - User search query
 * @returns Object with terms and original expanded queries
 */
export async function expandSearchTermsWithQueries(query: string): Promise<{
  terms: string[]
  expandedQueries: any[] | null
}> {
  if (!query || !query.trim()) {
    return { terms: [], expandedQueries: null }
  }

  const queryLower = query.toLowerCase().trim()
  let expandedQueriesResult: any[] | null = null

  // Try n8n expansion
  try {
    const expandedQueries = await expandQuery(queryLower)

    if (expandedQueries && expandedQueries.length > 0) {
      expandedQueriesResult = expandedQueries
      const n8nTerms = extractSearchTerms(expandedQueries)

      // Also include original query terms
      const originalWords = queryLower
        .split(/\s+/)
        .filter(word => word.length > 2)

      const terms = Array.from(new Set([...n8nTerms, ...originalWords]))
      return { terms, expandedQueries: expandedQueriesResult }
    }
  } catch (error) {
    console.log('⚠️  n8n expansion failed, using semantic fallback:', error)
  }

  // Fallback: Use semantic expansion
  const semanticTerms = expandQuerySemantics(queryLower)
  const originalWords = queryLower
    .split(/\s+/)
    .filter(word => word.length > 2)

  const terms = Array.from(new Set([...originalWords, ...semanticTerms]))

  // Create expanded queries for UI display (semantic fallback)
  if (semanticTerms.length > 0) {
    expandedQueriesResult = semanticTerms.map((term, idx) => ({
      query: term,
      role: 'context' as const,
      priority: 10 - idx
    }))
  }

  return { terms, expandedQueries: expandedQueriesResult }
}

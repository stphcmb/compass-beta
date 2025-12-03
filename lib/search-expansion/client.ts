/**
 * Search Expansion Client
 *
 * Main client for query expansion. Orchestrates multiple providers
 * and handles fallback logic.
 */

import { ExpandedQuery } from './types'
import { n8nProvider } from './providers/n8n-provider'
import { getConfig } from './config'

/**
 * Expand a search query into multiple related queries
 *
 * Uses configured providers (N8N, local semantic, etc.) with fallback.
 *
 * @param query - Original search query
 * @returns Array of expanded queries or null if all providers fail
 */
export async function expandQuery(query: string): Promise<ExpandedQuery[] | null> {
  if (!query || !query.trim()) {
    return null
  }

  const config = getConfig()

  // Try N8N provider first
  if (n8nProvider.isAvailable()) {
    const result = await n8nProvider.expand(query)
    if (result && result.length > 0) {
      return result
    }

    // If N8N fails and fallback is disabled, return null
    if (!config.enableFallback) {
      console.log('⚠️  N8N failed and fallback disabled')
      return null
    }
  }

  // Future: Add local/fallback providers here
  // if (localProvider.isAvailable()) {
  //   return await localProvider.expand(query)
  // }

  return null
}

/**
 * Extract search terms from expanded queries
 *
 * Converts expanded queries into individual search terms for filtering.
 * Useful for semantic search and result filtering.
 *
 * @param expandedQueries - Array of expanded queries
 * @returns Array of unique search terms
 */
export function extractSearchTerms(expandedQueries: ExpandedQuery[]): string[] {
  const terms: string[] = []

  expandedQueries.forEach(eq => {
    const queryLower = eq.query.toLowerCase()

    // Split query into words (filter out short words)
    const words = queryLower.split(/\s+/).filter(word => word.length > 2)
    terms.push(...words)

    // Also keep full query as a phrase for phrase matching
    if (words.length >= 2) {
      terms.push(queryLower)
    }
  })

  // Return unique terms
  return Array.from(new Set(terms))
}

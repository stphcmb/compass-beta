/**
 * Shared Search Expansion Utilities
 *
 * Provides unified search term expansion for both main search and AI Editor.
 * Combines n8n expansion with semantic fallback for robust search.
 */

import { expandQuery, extractSearchTerms } from './client'
import { expandQuerySemantics, expandWithSynonyms } from './semantic-provider'
import { understandQueryWithLLM, hasGoodLocalCoverage } from './llm-query-understanding'

/**
 * Expansion method indicator for UI display
 */
export type ExpansionMethod = 'ai' | 'local' | 'none'

export interface ExpansionMetadata {
  method: ExpansionMethod
  description: string
}

/**
 * Common stopwords to filter out from expanded search terms
 */
const STOPWORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one',
  'our', 'out', 'has', 'have', 'had', 'his', 'how', 'its', 'may', 'new', 'now', 'old',
  'see', 'way', 'who', 'did', 'get', 'got', 'let', 'put', 'say', 'she', 'too', 'use',
  'with', 'will', 'that', 'this', 'from', 'they', 'been', 'have', 'were', 'what', 'when',
  'which', 'their', 'there', 'these', 'those', 'would', 'could', 'should', 'about',
  'through', 'impact', 'effects', 'concerns', 'analysis', 'assessment', 'development'
])

/**
 * Filter words to only include meaningful search terms
 */
function filterMeaningfulWords(words: string[]): string[] {
  return words.filter(word => {
    if (word.length <= 2) return false
    if (STOPWORDS.has(word.toLowerCase())) return false
    if (!/[a-z]/i.test(word)) return false
    return true
  })
}

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
 * @returns Object with terms, original expanded queries, and expansion metadata
 */
export async function expandSearchTermsWithQueries(query: string): Promise<{
  terms: string[]
  expandedQueries: any[] | null
  expansionMeta: ExpansionMetadata
}> {
  if (!query || !query.trim()) {
    return {
      terms: [],
      expandedQueries: null,
      expansionMeta: { method: 'none', description: '' }
    }
  }

  const queryLower = query.toLowerCase().trim()
  let expandedQueriesResult: any[] | null = null

  // Always get synonyms for the query (used in both paths)
  const synonymTerms = expandWithSynonyms(queryLower)

  // Try n8n expansion (AI-powered)
  try {
    const expandedQueries = await expandQuery(queryLower)

    if (expandedQueries && expandedQueries.length > 0) {
      expandedQueriesResult = expandedQueries
      const n8nTerms = extractSearchTerms(expandedQueries)

      // Also include original query terms and synonyms
      const originalWords = queryLower
        .split(/\s+/)
        .filter(word => word.length > 2)

      const terms = Array.from(new Set([...n8nTerms, ...originalWords, ...synonymTerms]))
      return {
        terms,
        expandedQueries: expandedQueriesResult,
        expansionMeta: {
          method: 'ai',
          description: 'AI-powered expansion via Gemini'
        }
      }
    }
  } catch (error) {
    console.log('⚠️  n8n expansion failed, using semantic fallback:', error)
  }

  // Fallback: Use local semantic expansion (returns meaningful phrases)
  const semanticPhrases = expandQuerySemantics(queryLower)
  const originalWords = queryLower
    .split(/\s+/)
    .filter(word => word.length > 2)

  // For search terms, include original words, synonyms, and filtered words from semantic phrases
  const semanticWords = semanticPhrases.flatMap(phrase =>
    phrase.toLowerCase().split(/\s+/)
  )
  // Filter semantic words to remove stopwords, but keep original query words as-is
  const filteredSemanticWords = filterMeaningfulWords(semanticWords)
  let terms = Array.from(new Set([...originalWords, ...synonymTerms, ...filteredSemanticWords]))

  // Check if local coverage is good enough
  const goodLocalCoverage = hasGoodLocalCoverage(semanticPhrases, synonymTerms)

  // If local coverage is poor, try lightweight LLM understanding
  let llmEnhanced = false
  if (!goodLocalCoverage) {
    try {
      const llmUnderstanding = await understandQueryWithLLM(queryLower)
      if (llmUnderstanding) {
        // Add LLM-discovered concepts and synonyms
        const llmTerms = [
          ...llmUnderstanding.concepts,
          ...llmUnderstanding.synonyms
        ].filter(t => t && t.length > 2)

        terms = Array.from(new Set([...terms, ...llmTerms]))
        llmEnhanced = true

        // Add LLM concepts to expanded queries for UI
        if (llmUnderstanding.concepts.length > 0) {
          const llmPhrases = llmUnderstanding.concepts.map((concept, idx) => ({
            query: concept,
            role: 'llm concept' as const,
            priority: 8 - idx
          }))

          if (expandedQueriesResult) {
            expandedQueriesResult = [...expandedQueriesResult, ...llmPhrases]
          } else {
            expandedQueriesResult = llmPhrases
          }
        }
      }
    } catch {
      // Silently ignore LLM errors
    }
  }

  // Create expanded queries for UI display (semantic fallback)
  // Show the full semantic phrases to users
  if (!expandedQueriesResult && semanticPhrases.length > 0) {
    expandedQueriesResult = semanticPhrases.map((phrase, idx) => ({
      query: phrase,
      role: 'semantic context' as const,
      priority: 10 - idx
    }))
  }

  // Determine description based on what was found
  const hasSemanticExpansion = semanticPhrases.length > 0
  const hasSynonyms = synonymTerms.length > 0
  let description = 'Local pattern matching'

  if (llmEnhanced) {
    description = 'Enhanced with quick AI analysis'
  } else if (hasSemanticExpansion && hasSynonyms) {
    description = 'Pattern matching with concept synonyms'
  } else if (hasSynonyms) {
    description = 'Concept synonym expansion'
  } else if (hasSemanticExpansion) {
    description = 'Semantic pattern matching'
  }

  return {
    terms,
    expandedQueries: expandedQueriesResult,
    expansionMeta: {
      method: llmEnhanced ? 'ai' : 'local',
      description
    }
  }
}

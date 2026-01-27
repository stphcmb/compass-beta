/**
 * N8N Query Expansion Provider
 *
 * Integrates with n8n webhook for AI-powered query expansion using Gemini 2.0 Flash.
 * Provides robust error handling and graceful degradation.
 */

import { ExpandedQuery, QueryExpansionProvider } from '../types'
import { getWebhookUrl, getConfig, isTestMode } from '../config'

/**
 * N8N webhook response format
 */
interface N8NResponse {
  queries?: ExpandedQuery[]
  results?: any[]
}

/**
 * Cached demo query for the sample search on explore page
 * Only the exact phrase "future of work" is cached - other queries always call n8n
 */
const DEMO_QUERY_CACHE: Record<string, ExpandedQuery[]> = {
  'future of work': [
    { query: 'future of work', role: 'core', priority: 10 },
    { query: 'automation employment', role: 'related', priority: 8 },
    { query: 'AI job displacement', role: 'related', priority: 8 },
    { query: 'remote work trends', role: 'adjacent', priority: 7 },
    { query: 'workforce transformation', role: 'related', priority: 7 },
    { query: 'technological unemployment', role: 'related', priority: 6 },
    { query: 'skills economy', role: 'adjacent', priority: 6 },
    { query: 'labor market AI', role: 'related', priority: 5 }
  ]
}

/**
 * Normalize query for cache lookup
 * Lowercase, trim, collapse spaces
 */
function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ')
}

export class N8NQueryExpansionProvider implements QueryExpansionProvider {
  readonly name = 'N8N'

  /**
   * Check if N8N provider is available
   */
  isAvailable(): boolean {
    return getWebhookUrl() !== null
  }

  /**
   * Expand query using N8N webhook
   *
   * @param query - Original search query
   * @returns Array of expanded queries or null if service fails
   */
  async expand(query: string): Promise<ExpandedQuery[] | null> {
    // Check demo cache first to avoid n8n calls for sample searches
    const normalizedQuery = normalizeQuery(query)
    const cachedResult = DEMO_QUERY_CACHE[normalizedQuery]
    if (cachedResult) {
      return cachedResult
    }

    const webhookUrl = getWebhookUrl()

    if (!webhookUrl) {
      return null
    }

    const config = getConfig()

    try {
      // Sanitize query for n8n/Supabase compatibility
      // Replace multiple spaces with single space, trim
      const sanitizedQuery = query.trim().replace(/\s+/g, ' ')

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: sanitizedQuery,
          // Send a db-safe version with spaces replaced by wildcards
          queryForDb: sanitizedQuery.replace(/\s+/g, '%')
        }),
        signal: AbortSignal.timeout(config.timeoutMs),
      })

      if (!response.ok) {
        return null
      }

      const data = await this.parseResponse(response)
      if (!data) {
        return null
      }

      const queries = this.extractQueries(data)
      if (queries.length === 0) {
        return null
      }

      return queries

    } catch (error) {
      this.handleError(error, config.timeoutMs)
      return null
    }
  }

  /**
   * Parse and validate response from N8N webhook
   */
  private async parseResponse(response: Response): Promise<N8NResponse | null> {
    const responseText = await response.text()

    if (!responseText || responseText.trim() === '') {
      console.warn('⚠️  N8N returned empty response')
      return null
    }

    try {
      return JSON.parse(responseText)
    } catch (error) {
      console.error(
        '❌ Failed to parse N8N response:',
        responseText.substring(0, 100)
      )
      return null
    }
  }

  /**
   * Extract queries from N8N response
   *
   * Handles multiple response formats:
   * - Array format: [{ queries: [...], results: [] }]
   * - Object format: { queries: [...], results: [] }
   */
  private extractQueries(data: any): ExpandedQuery[] {
    if (Array.isArray(data)) {
      return data[0]?.queries || []
    }

    if (data && typeof data === 'object' && 'queries' in data) {
      return data.queries || []
    }

    console.warn('⚠️  N8N returned unexpected format:', data)
    return []
  }

  /**
   * Handle errors with appropriate logging
   */
  private handleError(error: unknown, timeoutMs: number): void {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`⏱️  N8N webhook timeout (${timeoutMs}ms)`)
    } else {
      console.error('❌ Error calling N8N webhook:', error)
    }
  }
}

/**
 * Singleton instance
 */
export const n8nProvider = new N8NQueryExpansionProvider()

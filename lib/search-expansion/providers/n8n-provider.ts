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
    const webhookUrl = getWebhookUrl()

    if (!webhookUrl) {
      console.log('⚠️  N8N webhook URL not configured, skipping')
      return null
    }

    const config = getConfig()

    // Log which mode we're in
    if (isTestMode()) {
      console.log('🧪 Using TEST n8n webhook')
    }

    try {
      // Sanitize query for n8n/Supabase compatibility
      // Replace multiple spaces with single space, trim
      const sanitizedQuery = query.trim().replace(/\s+/g, ' ')

      console.log('🔄 Calling N8N for query expansion:', sanitizedQuery)

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
        console.error(
          `❌ N8N webhook error: ${response.status} ${response.statusText}`
        )
        return null
      }

      const data = await this.parseResponse(response)
      if (!data) {
        return null
      }

      const queries = this.extractQueries(data)

      if (queries.length === 0) {
        console.log('ℹ️  N8N returned no expanded queries')
        return null
      }

      console.log(`✅ N8N returned ${queries.length} expanded queries`)
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

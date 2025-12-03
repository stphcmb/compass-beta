/**
 * Search Expansion Types
 *
 * Shared TypeScript interfaces and types for the search expansion module.
 */

/**
 * Role classification for expanded queries
 */
export type QueryRole = 'core' | 'context' | 'adjacent' | 'alternative' | 'related'

/**
 * A single expanded query with metadata
 */
export interface ExpandedQuery {
  /** The expanded search query text */
  query: string

  /** Role/category of the query relative to the original */
  role: QueryRole

  /** Priority/relevance score (higher = more relevant) */
  priority: number

  /** Number of expected hits/results (optional) */
  hits?: number
}

/**
 * Response from query expansion service
 */
export interface QueryExpansionResponse {
  /** Array of expanded queries */
  queries: ExpandedQuery[]

  /** Optional: Pre-fetched results for the queries */
  results?: any[]
}

/**
 * Configuration for query expansion providers
 */
export interface QueryExpansionConfig {
  /** N8N webhook URL for AI-powered expansion */
  n8nWebhookUrl?: string

  /** Test URL for development (overrides production URL) */
  n8nTestUrl?: string

  /** Request timeout in milliseconds */
  timeoutMs?: number

  /** Enable fallback to local expansion if remote fails */
  enableFallback?: boolean
}

/**
 * Query expansion provider interface
 */
export interface QueryExpansionProvider {
  /** Provider name for logging/debugging */
  name: string

  /**
   * Expand a query into multiple related queries
   * @param query - Original search query
   * @returns Array of expanded queries or null if unavailable
   */
  expand(query: string): Promise<ExpandedQuery[] | null>

  /**
   * Check if provider is available/configured
   */
  isAvailable(): boolean
}

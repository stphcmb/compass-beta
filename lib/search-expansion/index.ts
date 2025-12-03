/**
 * Search Expansion Module
 *
 * AI-powered query expansion using n8n + Gemini 2.0 Flash.
 * Expands user queries into multiple semantic variations for better search coverage.
 *
 * @example
 * ```typescript
 * import { expandQuery, extractSearchTerms } from '@/lib/search-expansion'
 *
 * // Expand a query
 * const queries = await expandQuery('artificial intelligence')
 * // Returns: [
 * //   { query: 'AI', role: 'core', priority: 10 },
 * //   { query: 'machine learning', role: 'context', priority: 8 },
 * //   { query: 'neural networks', role: 'adjacent', priority: 6 }
 * // ]
 *
 * // Extract search terms
 * if (queries) {
 *   const terms = extractSearchTerms(queries)
 *   // Returns: ['ai', 'machine', 'learning', 'neural', 'networks', ...]
 * }
 * ```
 */

// Core API
export { expandQuery, extractSearchTerms } from './client'

// Types
export type {
  ExpandedQuery,
  QueryRole,
  QueryExpansionResponse,
  QueryExpansionConfig,
  QueryExpansionProvider,
} from './types'

// Configuration
export { getConfig, getWebhookUrl, isEnabled, isTestMode } from './config'

// Providers (for advanced usage)
export { n8nProvider } from './providers/n8n-provider'

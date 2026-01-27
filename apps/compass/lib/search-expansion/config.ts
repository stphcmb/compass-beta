/**
 * Search Expansion Configuration
 *
 * Centralized configuration management for the search expansion module.
 * Reads from environment variables and provides sensible defaults.
 */

import { QueryExpansionConfig } from './types'

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<QueryExpansionConfig> = {
  n8nWebhookUrl: '',
  n8nTestUrl: '',
  timeoutMs: 5000, // 5 seconds - allow more time for n8n + Gemini
  enableFallback: true,
}

/**
 * Get the current query expansion configuration
 *
 * Reads from environment variables:
 * - N8N_QUERY_EXPANSION_URL: Production webhook URL
 * - N8N_QUERY_EXPANSION_TEST_URL: Test webhook URL (overrides production in dev)
 *
 * @returns Configuration object
 */
export function getConfig(): Required<QueryExpansionConfig> {
  return {
    n8nWebhookUrl: process.env.N8N_QUERY_EXPANSION_URL || DEFAULT_CONFIG.n8nWebhookUrl,
    n8nTestUrl: process.env.N8N_QUERY_EXPANSION_TEST_URL || DEFAULT_CONFIG.n8nTestUrl,
    timeoutMs: DEFAULT_CONFIG.timeoutMs,
    enableFallback: DEFAULT_CONFIG.enableFallback,
  }
}

/**
 * Get the active webhook URL
 *
 * Prefers test URL over production URL (for local development).
 *
 * @returns Active webhook URL or null if not configured
 */
export function getWebhookUrl(): string | null {
  const config = getConfig()

  // Test URL takes precedence (for local development)
  if (config.n8nTestUrl) {
    return config.n8nTestUrl
  }

  // Fall back to production URL
  if (config.n8nWebhookUrl) {
    return config.n8nWebhookUrl
  }

  // Not configured
  return null
}

/**
 * Check if query expansion is enabled
 *
 * @returns True if at least one webhook URL is configured
 */
export function isEnabled(): boolean {
  return getWebhookUrl() !== null
}

/**
 * Check if running in test mode (using test webhook)
 *
 * @returns True if test URL is configured and will be used
 */
export function isTestMode(): boolean {
  const config = getConfig()
  return !!config.n8nTestUrl
}

/**
 * N8N Query Expansion Service
 *
 * Server-side only module for expanding search queries using an n8n webhook.
 * DO NOT import this into client components.
 */

export interface ExpandedQuery {
  query: string
  role: 'core' | 'alternative' | 'related'
  priority: number
  hits: number
}

export interface QueryExpansionResponse {
  queries: ExpandedQuery[]
  results: any[]
}

/**
 * Call the n8n webhook to expand a user query into multiple related queries
 *
 * @param query - The original user query
 * @returns Expanded queries or null if the service fails/is unavailable
 */
export async function expandQuery(query: string): Promise<ExpandedQuery[] | null> {
  // Use test URL if set (for local development), otherwise use production URL
  const testUrl = process.env.N8N_QUERY_EXPANSION_TEST_URL
  const prodUrl = process.env.N8N_QUERY_EXPANSION_URL
  const n8nWebhookUrl = testUrl || prodUrl

  // If n8n URL is not configured, return null (graceful degradation)
  if (!n8nWebhookUrl) {
    console.log('⚠️  N8N_QUERY_EXPANSION_URL not configured, skipping query expansion')
    return null
  }

  // Log which URL is being used
  if (testUrl) {
    console.log('🧪 Using TEST n8n webhook')
  }

  try {
    console.log('🔄 Calling n8n for query expansion:', query)

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (!response.ok) {
      console.error('❌ N8N webhook returned error:', response.status, response.statusText)
      return null
    }

    // Get response text first to handle empty responses
    const responseText = await response.text()
    if (!responseText || responseText.trim() === '') {
      console.warn('⚠️  N8N returned empty response')
      return null
    }

    // Parse JSON
    let data: any
    try {
      data = JSON.parse(responseText)
    } catch (error) {
      console.error('❌ Failed to parse n8n response:', responseText.substring(0, 100))
      return null
    }

    // Handle both formats:
    // - Array format: [{ queries: [...], results: [] }]
    // - Object format: { queries: [...], results: [] }
    let expandedQueries: ExpandedQuery[] = []

    if (Array.isArray(data)) {
      // Array format
      expandedQueries = data[0]?.queries || []
    } else if (data && typeof data === 'object' && 'queries' in data) {
      // Object format
      expandedQueries = data.queries || []
    } else {
      console.warn('⚠️  N8N returned unexpected format:', data)
      return null
    }

    if (expandedQueries.length === 0) {
      console.log('ℹ️  N8N returned no expanded queries')
      return null
    }

    console.log(`✅ N8N returned ${expandedQueries.length} expanded queries`)
    return expandedQueries

  } catch (error) {
    // Gracefully handle errors - log but don't throw
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏱️  N8N webhook timeout (5s)')
    } else {
      console.error('❌ Error calling N8N webhook:', error)
    }
    return null
  }
}

/**
 * Extract search terms from expanded queries
 *
 * @param expandedQueries - Array of expanded queries from n8n
 * @returns Array of search terms to use for filtering
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

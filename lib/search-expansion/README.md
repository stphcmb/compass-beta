# Search Expansion Module

AI-powered query expansion using n8n + Gemini 2.0 Flash. Expands user search queries into multiple semantic variations for improved search coverage and relevance.

## Overview

This module transforms a single user query into multiple related queries with role classifications:
- **Core**: Direct reformulations of the original query
- **Context**: Queries that provide important contextual information
- **Adjacent**: Related topics that might be relevant

## Quick Start

```typescript
import { expandQuery, extractSearchTerms } from '@/lib/search-expansion'

// Expand a query
const queries = await expandQuery('artificial intelligence')

if (queries) {
  console.log(queries)
  // [
  //   { query: 'AI', role: 'core', priority: 10 },
  //   { query: 'machine learning', role: 'context', priority: 8 },
  //   { query: 'neural networks', role: 'adjacent', priority: 6 }
  // ]

  // Extract terms for filtering
  const terms = extractSearchTerms(queries)
  // ['ai', 'machine', 'learning', 'neural', 'networks', ...]
}
```

## Architecture

The module follows a modular provider pattern:

```
lib/search-expansion/
├── index.ts              # Public API
├── types.ts              # TypeScript types
├── config.ts             # Configuration management
├── client.ts             # Main orchestration
└── providers/
    └── n8n-provider.ts   # N8N webhook integration
```

### Key Components

#### Client (`client.ts`)
Main entry point that orchestrates providers and handles fallback logic.

**Functions:**
- `expandQuery(query: string)`: Expand a query using available providers
- `extractSearchTerms(queries: ExpandedQuery[])`: Extract searchable terms

#### Configuration (`config.ts`)
Manages environment variables and provides configuration utilities.

**Functions:**
- `getConfig()`: Get current configuration
- `getWebhookUrl()`: Get active webhook URL (test or production)
- `isEnabled()`: Check if expansion is enabled
- `isTestMode()`: Check if using test webhook

#### Providers (`providers/`)
Pluggable expansion implementations following the `QueryExpansionProvider` interface.

**Current Providers:**
- `N8NQueryExpansionProvider`: Integrates with n8n webhook + Gemini 2.0 Flash

**Future Providers:**
- Local semantic expansion (fallback)
- OpenAI integration
- Custom LLM providers

## Configuration

### Environment Variables

Set in Vercel environment variables (or `.env.local` for development):

```bash
# Production webhook URL
N8N_QUERY_EXPANSION_URL=https://free-n8n.anduin.center/webhook/ai-query-expansion

# Optional: Test webhook URL (overrides production in development)
N8N_QUERY_EXPANSION_TEST_URL=https://free-n8n.anduin.center/webhook-test/ai-query-expansion
```

### Configuration Options

```typescript
interface QueryExpansionConfig {
  n8nWebhookUrl?: string      // Production webhook URL
  n8nTestUrl?: string          // Test webhook URL
  timeoutMs?: number           // Request timeout (default: 5000ms)
  enableFallback?: boolean     // Enable fallback providers (default: true)
}
```

## API Reference

### `expandQuery(query: string): Promise<ExpandedQuery[] | null>`

Expand a search query into multiple related queries.

**Parameters:**
- `query`: The original search query

**Returns:**
- `ExpandedQuery[]`: Array of expanded queries with metadata
- `null`: If expansion fails or is not configured

**Example:**
```typescript
const queries = await expandQuery('blockchain technology')
```

### `extractSearchTerms(queries: ExpandedQuery[]): string[]`

Extract individual search terms from expanded queries.

**Parameters:**
- `queries`: Array of expanded queries

**Returns:**
- `string[]`: Array of unique lowercase search terms

**Example:**
```typescript
const terms = extractSearchTerms(queries)
// Use terms for semantic filtering
```

### Types

#### `ExpandedQuery`
```typescript
interface ExpandedQuery {
  query: string                               // Expanded query text
  role: 'core' | 'context' | 'adjacent'      // Query role
  priority: number                            // Relevance score
  hits?: number                               // Expected result count
}
```

#### `QueryRole`
```typescript
type QueryRole = 'core' | 'context' | 'adjacent' | 'alternative' | 'related'
```

## Usage in Components

### Server-Side (API Routes)

```typescript
import { expandQuery } from '@/lib/search-expansion'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')

  const expandedQueries = await expandQuery(query)

  return NextResponse.json({
    query,
    expandedQueries
  })
}
```

### Client-Side (React Components)

```typescript
import { ExpandedQueries } from '@/components/search-expansion'

export default function SearchResults({ query }: Props) {
  const [expandedQueries, setExpandedQueries] = useState(null)

  useEffect(() => {
    fetch(`/api/search?query=${query}`)
      .then(res => res.json())
      .then(data => setExpandedQueries(data.expandedQueries))
  }, [query])

  return (
    <>
      {expandedQueries && (
        <ExpandedQueries
          queries={expandedQueries}
          originalQuery={query}
        />
      )}
    </>
  )
}
```

## Error Handling

The module is designed for graceful degradation:

- **No configuration**: Returns `null` silently
- **Network errors**: Logs error and returns `null`
- **Timeout**: 5-second timeout with fallback to `null`
- **Invalid response**: Validates and handles various response formats

All errors are logged but don't throw exceptions, ensuring the app continues functioning even if expansion fails.

## Extending the Module

### Adding a New Provider

1. Create a new provider file:
```typescript
// providers/my-provider.ts
import { QueryExpansionProvider, ExpandedQuery } from '../types'

export class MyProvider implements QueryExpansionProvider {
  readonly name = 'MyProvider'

  isAvailable(): boolean {
    return true // Check if provider is configured
  }

  async expand(query: string): Promise<ExpandedQuery[] | null> {
    // Implementation
  }
}

export const myProvider = new MyProvider()
```

2. Register in client:
```typescript
// client.ts
import { myProvider } from './providers/my-provider'

export async function expandQuery(query: string) {
  // Try n8n first
  if (n8nProvider.isAvailable()) {
    const result = await n8nProvider.expand(query)
    if (result) return result
  }

  // Fallback to your provider
  if (myProvider.isAvailable()) {
    return await myProvider.expand(query)
  }

  return null
}
```

3. Export from index:
```typescript
// index.ts
export { myProvider } from './providers/my-provider'
```

## Testing

### Unit Tests
```typescript
import { expandQuery } from '@/lib/search-expansion'
import { n8nProvider } from '@/lib/search-expansion/providers/n8n-provider'

describe('expandQuery', () => {
  it('should expand query using n8n', async () => {
    const result = await expandQuery('AI')
    expect(result).toBeDefined()
    expect(result?.length).toBeGreaterThan(0)
  })

  it('should return null when not configured', async () => {
    // Mock empty config
    const result = await expandQuery('test')
    expect(result).toBeNull()
  })
})
```

### Integration Tests
```typescript
describe('search expansion integration', () => {
  it('should expand query and filter results', async () => {
    const queries = await expandQuery('machine learning')
    const terms = extractSearchTerms(queries!)

    // Use terms to filter database results
    const results = await filterResults(terms)
    expect(results.length).toBeGreaterThan(0)
  })
})
```

## Performance Considerations

- **Timeout**: 5-second timeout prevents hanging requests
- **Caching**: Consider caching expanded queries for common searches
- **Parallel execution**: Expansion runs in parallel with main search
- **Graceful degradation**: App works even if expansion fails

## Troubleshooting

### Expansion not working in production

1. Check Vercel environment variables are set:
   ```bash
   N8N_QUERY_EXPANSION_URL=https://free-n8n.anduin.center/webhook/ai-query-expansion
   ```

2. Check logs for error messages:
   ```
   ⚠️  N8N webhook URL not configured
   ❌ N8N webhook error: 500
   ⏱️  N8N webhook timeout (5000ms)
   ```

3. Test webhook manually:
   ```bash
   curl -X POST https://free-n8n.anduin.center/webhook/ai-query-expansion \
     -H "Content-Type: application/json" \
     -d '{"query": "test"}'
   ```

### Expansion working locally but not in production

- Verify test URL is NOT set in production environment
- Ensure production webhook URL is accessible from Vercel
- Check webhook service is running and healthy

## Related Documentation

- [ADR-0006: Search Expansion Module Architecture](../../Docs/adr/0006-search-expansion-module.md)
- [N8N Webhook Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Gemini API Documentation](https://ai.google.dev/docs)

## Contributing

When modifying this module:

1. Update types in `types.ts` if adding new interfaces
2. Document configuration changes in this README
3. Add tests for new functionality
4. Update the ADR if architecture changes significantly
5. Maintain backward compatibility in public API

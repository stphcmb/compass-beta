# Mini Brain Module

A focused service that reads user text, looks up relevant camps and authors in the canon, and returns editorial suggestions.

## Purpose

The Mini Brain helps product marketing writers improve their content by:
- Analyzing their drafts against the Compass canon of thought leaders
- Identifying which perspectives they're emphasizing
- Suggesting missing perspectives they should consider
- Matching relevant camps and key authors to their content

This transforms Compass from a search tool into a content partner that provides actionable editorial guidance at the moment of writing.

## Key Exports/Components

### `analyzeText()`

**Location:** `lib/mini-brain/analyzer.ts`

**Purpose:** Main entry point for analyzing user text and generating editorial suggestions

**Usage:**
```typescript
import { analyzeText } from '@/lib/mini-brain'

const result = await analyzeText('Your paragraph or draft here...')

console.log(result.summary) // 2-3 sentence summary
console.log(result.matchedCamps) // Relevant camps with authors
console.log(result.editorialSuggestions) // Present & missing perspectives
```

**Parameters:**
- `text` (string): User's text to analyze (1-3 paragraphs recommended, max 10,000 chars)
- `options` (object, optional):
  - `maxCamps` (number): Maximum number of camps to return (default: 10)
  - `includeDebugInfo` (boolean): Log debug information to console (default: false)

**Returns:** `MiniBrainAnalyzeResponse`
```typescript
{
  summary: string
  matchedCamps: Array<{
    campLabel: string
    topAuthors: Array<{ name: string }>
  }>
  editorialSuggestions: {
    presentPerspectives: string[]
    missingPerspectives: string[]
  }
}
```

**Related:**
- See [ADR-0007](../../Docs/adr/0007-mini-brain-architecture.md) for architectural context
- See [API Endpoint](#api-endpoint) for HTTP usage

### `validateText()`

**Location:** `lib/mini-brain/analyzer.ts`

**Purpose:** Validate user text before analysis

**Usage:**
```typescript
import { validateText } from '@/lib/mini-brain'

const validation = validateText(userInput)
if (!validation.isValid) {
  console.error(validation.error)
}
```

**Parameters:**
- `text` (string): Text to validate

**Returns:** `{ isValid: boolean, error?: string }`

### API Endpoint

**Location:** `app/api/brain/analyze/route.ts`

**Purpose:** HTTP endpoint for Mini Brain analysis

**Usage:**
```typescript
// Client-side usage
const response = await fetch('/api/brain/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Your draft here...' })
})

const result = await response.json()
```

**Request:**
```typescript
POST /api/brain/analyze
Content-Type: application/json

{
  "text": "Your paragraph or draft here..."
}
```

**Response:**
```typescript
{
  "summary": "2-3 sentence summary of the text",
  "matchedCamps": [
    {
      "campLabel": "Scaling Maximalists",
      "topAuthors": [
        { "name": "Sam Altman" },
        { "name": "Dario Amodei" }
      ]
    }
  ],
  "editorialSuggestions": {
    "presentPerspectives": [
      "You emphasize technical progress and scaling"
    ],
    "missingPerspectives": [
      "Consider adding perspectives on safety and governance"
    ]
  }
}
```

## Directory Structure

```
mini-brain/
├── analyzer.ts          # Main orchestration logic
├── gemini.ts           # Gemini API integration
├── query.ts            # Keyword extraction & database queries
├── types.ts            # TypeScript type definitions
├── index.ts            # Public exports
└── README.md           # This file
```

## Common Patterns

### Pattern 1: Hybrid Matching

The Mini Brain uses a hybrid approach combining keyword search and LLM semantic analysis:

```typescript
// 1. Extract keywords from text
const keywords = extractKeywords(text)

// 2. Query database for candidate camps
const candidates = await queryCampsByKeywords(keywords)

// 3. Use LLM to semantically rank and analyze
const analysis = await analyzeWithGemini(text, candidates)
```

**When to use:** For text longer than 10 words (most use cases)

**Why:** Balances speed, cost, and accuracy by narrowing search with keywords before calling the LLM

### Pattern 2: Graceful Degradation

The module handles missing dependencies gracefully:

```typescript
if (!supabase) {
  throw new Error('Supabase client not initialized')
}

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY not configured')
}
```

**When to use:** Always - the module validates dependencies before processing

**Example:** See error handling in `analyzer.ts:89`

## Usage Guidelines

### Do's ✅

- Use for text between 50-4000 characters for best results
- Validate text with `validateText()` before calling `analyzeText()`
- Handle errors gracefully (API may fail if Gemini is unavailable)
- Cache results client-side if analyzing the same text repeatedly
- Set `GEMINI_API_KEY` in environment variables before using

### Don'ts ❌

- Don't analyze very short text (< 10 words) - results will be poor
- Don't send extremely long text (> 10,000 chars) - will be rejected
- Don't call the API in rapid succession - respect rate limits
- Don't expose GEMINI_API_KEY client-side - it's server-only

## Dependencies

### Internal Dependencies

- `lib/supabase` - Database client for querying camps and authors
- `lib/database-types` - Type definitions for database models

### External Dependencies

- `@supabase/supabase-js` - Database queries
- Gemini API (gemini-2.0-flash model) - LLM analysis and suggestions
- `next` - Next.js framework for API routes

### Environment Variables

Required:
- `GEMINI_API_KEY` - Google Gemini API key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

## Performance Considerations

- **Database queries** are limited to 100 camps initially, then filtered
- **Keyword extraction** is fast and runs locally (< 10ms)
- **Gemini API calls** typically take 2-5 seconds depending on text length
- **Total latency** is ~3-6 seconds for a typical paragraph
- Results are not cached (stateless for v0)

**Optimization tips:**
- Send concise text for faster analysis
- Consider implementing client-side caching for repeated analyses
- Monitor Gemini API quota usage

## Error Handling

The module provides clear error messages for common issues:

| Error | Cause | Solution |
|-------|-------|----------|
| "GEMINI_API_KEY not set" | Missing env variable | Add key to `.env.local` |
| "Text cannot be empty" | Empty input | Validate before calling |
| "Supabase client not initialized" | Missing Supabase config | Check Supabase env vars |
| "Failed to parse Gemini analysis" | Unexpected LLM response | Retry or check API status |

## Related Documentation

- [ADR-0007: Mini Brain Architecture](../../Docs/adr/0007-mini-brain-architecture.md) - Architectural decisions
- [PRD: Mini Brain Feature](../../Docs/specs/wireframe/mvp-minibrain-prd.md) - Product requirements
- [Database Types](../database-types.ts) - Data models
- [Search Expansion Module](../search-expansion/README.md) - Related search feature

## FAQ

### How is this different from the search feature?

The search feature helps users find camps/authors by keyword. The Mini Brain analyzes their writing and provides editorial suggestions based on the canon.

### Why not use the N8N query expansion for Mini Brain?

The Mini Brain requires different LLM prompts (summary + editorial suggestions) than query expansion (keyword extraction). Keeping them separate maintains clean separation of concerns.

### Can I use this without Gemini?

No, Gemini is required for the semantic analysis and editorial suggestions. However, you could swap Gemini for another LLM by modifying `gemini.ts`.

### Why limit to 4000 characters?

This balances thoroughness with API cost and latency. Longer text could be supported but would increase costs and response time.

## Maintenance

**Last Updated:** 2025-12-07

**Maintainer:** Product Team

**Known Issues:**
- None currently

---

**Version:** 0.1.0 (Initial Release)

**Status:** ✅ Production Ready

**Next Planned Features (v0.2):**
- Persistent narrative memory (track coverage over time)
- Web search integration for real-time perspective discovery
- Multi-leader POV modeling

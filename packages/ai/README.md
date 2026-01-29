# @compass/ai

> Google Gemini AI integration for the Compass platform

## Purpose

Provides utilities for interacting with Google's Gemini AI models. Includes response caching, model selection, and common AI operations like keyword extraction. Supports both fast (Flash) and powerful (Pro) models.

## Installation

This package is internal to the Compass monorepo and is imported via workspace protocol.

```json
{
  "dependencies": {
    "@compass/ai": "workspace:*"
  }
}
```

## Usage

### Basic Text Generation

```typescript
import { callGemini } from '@compass/ai'

export async function analyzeText(text: string) {
  const prompt = `Analyze the following text and provide key insights:\n\n${text}`

  const response = await callGemini(prompt)

  return response
}
```

### Model Selection

Choose between Flash (fast/cheap) and Pro (powerful) models:

```typescript
import { callGemini } from '@compass/ai'

// Use Flash for simple tasks (default, cost-effective)
const quickResponse = await callGemini(
  'Summarize this in one sentence: ...',
  'flash'
)

// Use Pro for complex analysis (slower, more expensive)
const detailedResponse = await callGemini(
  'Provide a comprehensive analysis with citations: ...',
  'pro'
)
```

**When to use each model:**
- **Flash** (`gemini-2.5-flash`): Summaries, keyword extraction, simple Q&A, classification
- **Pro** (`gemini-2.5-pro`): Deep analysis, complex reasoning, multi-step tasks, creative writing

### Response Caching

Responses are automatically cached for 7 days to reduce API calls and costs:

```typescript
// First call - hits API
const response1 = await callGemini('What is AI?')

// Second call with same prompt - returns cached response
const response2 = await callGemini('What is AI?')

// Disable caching if needed (e.g., time-sensitive queries)
const freshResponse = await callGemini('What is AI?', 'flash', false)
```

### Keyword Extraction

Extract key concepts from user text:

```typescript
import { extractKeywordsWithGemini } from '@compass/ai'

export async function getKeywords(userText: string) {
  const keywords = await extractKeywordsWithGemini(userText)

  console.log(keywords)
  // ['artificial intelligence', 'machine learning', 'neural networks', ...]

  return keywords
}
```

### In Server Actions

```typescript
'use server'

import { currentUser } from '@clerk/nextjs/server'
import { callGemini } from '@compass/ai'
import { supabase } from '@compass/database'

export async function analyzeUserText(text: string) {
  // Always verify authentication first
  const user = await currentUser()
  if (!user) return { error: 'Unauthorized' }

  try {
    // Call AI
    const prompt = `Analyze this text for sentiment and key themes:\n\n${text}`
    const analysis = await callGemini(prompt, 'flash')

    // Store result
    await supabase.from('user_analyses').insert({
      user_id: user.id,
      text,
      analysis,
      created_at: new Date().toISOString()
    })

    return { success: true, analysis }
  } catch (error) {
    console.error('AI analysis failed:', error)
    return { error: 'Failed to analyze text' }
  }
}
```

### Structured Output

Request JSON responses for structured data:

```typescript
import { callGemini } from '@compass/ai'

export async function extractEntities(text: string) {
  const prompt = `Extract named entities from the following text.
Return a JSON object with this structure:
{
  "people": ["name1", "name2"],
  "organizations": ["org1", "org2"],
  "locations": ["loc1", "loc2"]
}

Text: ${text}`

  const response = await callGemini(prompt)

  try {
    return JSON.parse(response)
  } catch {
    throw new Error('Failed to parse AI response')
  }
}
```

### Error Handling

```typescript
import { callGemini } from '@compass/ai'

export async function safeAICall(prompt: string) {
  try {
    const response = await callGemini(prompt)
    return { success: true, data: response }
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific errors
      if (error.message.includes('API key')) {
        return { error: 'AI service not configured' }
      }
      if (error.message.includes('429')) {
        return { error: 'Rate limit exceeded. Please try again later.' }
      }
      return { error: 'AI analysis failed' }
    }
    return { error: 'Unknown error occurred' }
  }
}
```

## API Reference

### Functions

- `callGemini(prompt: string, model?: GeminiModel, useCache?: boolean): Promise<string>`
  - Call Gemini API with a prompt
  - **Parameters:**
    - `prompt` - Text prompt to send to Gemini
    - `model` - Model to use: `'flash'` (default, fast/cheap) or `'pro'` (powerful)
    - `useCache` - Whether to use response caching (default: `true`)
  - **Returns:** Text response from Gemini
  - **Throws:** Error if API call fails or API key is missing

- `extractKeywordsWithGemini(text: string): Promise<string[]>`
  - Extract 5-10 keywords from user text
  - **Parameters:**
    - `text` - User's text to analyze
  - **Returns:** Array of keyword strings
  - **Throws:** Error if extraction fails

### Types

- `GeminiModel` - Type for model selection: `'flash' | 'pro'`
- `GeminiRequest` - Request payload structure for Gemini API
- `GeminiResponse` - Response structure from Gemini API

## Dependencies

- **None** - Uses native Node.js `crypto` and `fetch`

## Development

### Environment Variables

Required in `.env.local`:

```bash
GEMINI_API_KEY=your_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Cache Management

The package uses an in-memory cache with:
- **TTL**: 7 days
- **Automatic cleanup**: 10% chance on each call
- **Cache key**: SHA-256 hash of `model:prompt`

To clear cache (server restart):
```bash
pnpm dev:compass
```

### Rate Limits

Gemini API has rate limits that vary by model and plan:
- **Free tier**: 60 requests per minute
- **Paid tier**: Higher limits based on your quota

Handle rate limits gracefully:
```typescript
try {
  const response = await callGemini(prompt)
} catch (error) {
  if (error.message.includes('429')) {
    // Wait and retry, or show user-friendly message
  }
}
```

### Cost Optimization

**Tips to reduce costs:**

1. **Use Flash model by default** - 20x cheaper than Pro
2. **Enable caching** - Avoid duplicate API calls
3. **Keep prompts concise** - Token usage affects cost
4. **Batch operations** - Process multiple items in one call when possible
5. **Set max output tokens** (future enhancement)

**Cost comparison:**
- **Flash**: ~$0.0001 per 1K tokens
- **Pro**: ~$0.002 per 1K tokens

### Prompt Engineering Tips

**Good prompts:**
```typescript
// Specific, clear instructions
const prompt = `Summarize this article in 3 bullet points.
Focus on key findings and actionable insights.

Article: ${text}`

// Request structured output
const prompt = `Extract main topics from this text.
Return a JSON array of strings.

Text: ${text}`
```

**Bad prompts:**
```typescript
// Vague, unclear
const prompt = `Tell me about this: ${text}`

// No format specification
const prompt = `What are the topics? ${text}`
```

### Testing

```typescript
// Mock in tests
jest.mock('@compass/ai', () => ({
  callGemini: jest.fn().mockResolvedValue('Mocked AI response'),
  extractKeywordsWithGemini: jest.fn().mockResolvedValue(['keyword1', 'keyword2'])
}))
```

### Advanced: Streaming (Future)

Currently not implemented, but Gemini supports streaming responses:

```typescript
// Future implementation
export async function* streamGemini(prompt: string) {
  // Stream response chunks
  for await (const chunk of stream) {
    yield chunk
  }
}
```

## Security

### API Key Safety

- **Never** commit `GEMINI_API_KEY` to git
- **Never** expose API key in client-side code
- **Never** log API keys or tokens
- Store in `.env.local` (gitignored)
- Use environment variables in production

### Content Filtering

Gemini has built-in content filtering. Responses may be blocked if:
- Input contains harmful content
- Output would contain sensitive information
- Content violates usage policies

Handle blocked responses:
```typescript
try {
  const response = await callGemini(prompt)
} catch (error) {
  if (error.message.includes('blocked')) {
    return { error: 'Content was filtered for safety' }
  }
}
```

### User Data

- **Don't send sensitive user data** to Gemini without consent
- **Anonymize personal information** when possible
- **Comply with data privacy regulations** (GDPR, CCPA, etc.)
- **Log AI interactions** for debugging, but not sensitive content

## Troubleshooting

### "API key not set" error

```bash
# Add to .env.local
GEMINI_API_KEY=your_api_key_here

# Restart dev server
pnpm dev:compass
```

### "Rate limit exceeded" error

Wait 60 seconds and retry, or upgrade your API plan.

### "No candidates returned" error

The model couldn't generate a response (blocked by safety filters or invalid prompt).

### Cache not working

Cache only works within the same Node.js process. It resets on server restart.

/**
 * Lightweight LLM Query Understanding
 *
 * Uses Gemini 2.0 Flash for fast, minimal-token query expansion
 * when local patterns don't provide good coverage.
 *
 * Design principles:
 * - Fast: 3-second timeout
 * - Cheap: Minimal tokens, simple prompt
 * - Graceful: Falls back silently on failure
 */

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// 3-second timeout for query understanding
const TIMEOUT_MS = 3000

export interface QueryUnderstanding {
  intent: string
  concepts: string[]
  synonyms: string[]
}

/**
 * Use LLM to understand query intent and expand concepts
 *
 * Only called when:
 * 1. Local patterns don't match well
 * 2. API key is available
 *
 * @param query - User's search query
 * @returns Expanded concepts and synonyms, or null if unavailable
 */
export async function understandQueryWithLLM(query: string): Promise<QueryUnderstanding | null> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return null
  }

  // Skip LLM for very short queries
  if (query.length < 5) {
    return null
  }

  const prompt = `Given this search query about AI topics, extract the core intent and related concepts.

Query: "${query}"

Return ONLY a JSON object with:
- intent: What the user wants to find (10 words max)
- concepts: 3-5 related topic keywords
- synonyms: 3-5 alternative words for key terms

Example for "woman and ai":
{"intent":"AI impact on women","concepts":["gender","workforce","women in tech","diversity"],"synonyms":["female","women","girl","feminine"]}

JSON only:`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 150, // Keep response small
          temperature: 0.1, // Low temperature for consistency
        }
      }),
      signal: controller.signal
    })

    clearTimeout(timeout)

    if (!response.ok) {
      console.log('⚠️ LLM query understanding failed:', response.status)
      return null
    }

    const data = await response.json()
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textResponse) {
      return null
    }

    // Extract JSON from response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return null
    }

    const result = JSON.parse(jsonMatch[0])

    // Validate structure
    if (!result.intent || !Array.isArray(result.concepts)) {
      return null
    }

    return {
      intent: result.intent || '',
      concepts: result.concepts || [],
      synonyms: result.synonyms || []
    }
  } catch (error) {
    clearTimeout(timeout)
    // Silently fail - this is a best-effort enhancement
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('⚠️ LLM query understanding timed out')
    }
    return null
  }
}

/**
 * Check if local patterns provide good coverage for a query
 * Used to decide whether to call LLM
 */
export function hasGoodLocalCoverage(
  semanticPhrases: string[],
  synonyms: string[]
): boolean {
  // Good coverage if we have semantic expansion AND synonyms
  return semanticPhrases.length >= 2 || synonyms.length >= 3
}

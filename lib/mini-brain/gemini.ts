/**
 * Mini Brain Module - Gemini API Integration
 *
 * Direct integration with Google Gemini API for text analysis and
 * editorial suggestion generation.
 */

import {
  GeminiRequest,
  GeminiResponse,
  GeminiAnalysisResult,
  CampWithAuthors,
} from './types'

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

/**
 * Call Gemini API with a prompt
 *
 * @param prompt - The prompt to send to Gemini
 * @returns The text response from Gemini
 * @throws Error if API call fails or API key is missing
 */
export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY environment variable is not set. Please configure it in .env.local'
    )
  }

  const requestBody: GeminiRequest = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Gemini API error (${response.status}): ${errorText}`
      )
    }

    const data: GeminiResponse = await response.json()

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Gemini API returned no candidates')
    }

    const textResponse = data.candidates[0].content.parts[0].text
    return textResponse
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to call Gemini API: ${error.message}`)
    }
    throw new Error('Failed to call Gemini API: Unknown error')
  }
}

/**
 * Extract keywords from user text using Gemini
 *
 * @param text - User's text to analyze
 * @returns Array of extracted keywords
 */
export async function extractKeywordsWithGemini(
  text: string
): Promise<string[]> {
  const prompt = `Extract 5-10 key concepts, themes, or topics from the following text. Return ONLY a JSON array of strings, nothing else.

Text:
${text}

Return format: ["keyword1", "keyword2", ...]`

  const response = await callGemini(prompt)

  try {
    // Try to parse the response as JSON
    const keywords = JSON.parse(response.trim())
    if (Array.isArray(keywords)) {
      return keywords.filter((k) => typeof k === 'string')
    }
    return []
  } catch {
    // If parsing fails, try to extract keywords from the text manually
    const matches = response.match(/"([^"]+)"/g)
    if (matches) {
      return matches.map((m) => m.replace(/"/g, ''))
    }
    return []
  }
}

/**
 * Analyze user text and generate editorial suggestions using Gemini
 *
 * This is the core LLM-based analysis that:
 * 1. Summarizes the text
 * 2. Matches it to relevant camps
 * 3. Generates editorial suggestions
 *
 * @param text - User's text to analyze
 * @param candidateCamps - Camps that potentially match (from keyword search)
 * @returns Structured analysis result
 */
export async function analyzeWithGemini(
  text: string,
  candidateCamps: CampWithAuthors[]
): Promise<GeminiAnalysisResult> {
  // Build context about camps for the LLM
  const campsContext = candidateCamps
    .map((camp) => {
      const authorsText = camp.authors
        .map((a) => `- ID: ${a.id} | Name: ${a.name}${a.affiliation ? ` (${a.affiliation})` : ''}${a.position_summary ? ` | Position: ${a.position_summary}` : ''}`)
        .join('\n')

      return `Camp: "${camp.name}"
Camp ID: ${camp.id}
Description: ${camp.description}
${camp.position_summary ? `Position: ${camp.position_summary}` : ''}
Domain: ${camp.domain || 'Unknown'}
Key Authors:
${authorsText}`
    })
    .join('\n\n---\n\n')

  const prompt = `You are a sharp, experienced editor helping a product marketing writer refine their content. Analyze their draft and provide specific, actionable feedback grounded in thought leaders from our canon.

USER'S DRAFT:
${text}

---

THOUGHT LEADERS IN OUR CANON (potential matches):
${campsContext}

---

YOUR TASK:
Act like an editorial partner, not a taxonomy classifier. Give concrete feedback a writer can act on.

1. Write an OPINIONATED editorial summary (2-3 sentences):
   - Call out what's strong or weak about their argument
   - Identify what perspective they're taking (even if they don't realize it)
   - Point out key gaps, contradictions, or missed opportunities
   - Be direct and honest - this is editorial feedback, not neutral description
2. Identify 2-4 camps that are most relevant (score 0-100, only include >= 30)
3. For EACH camp:
   - Explain what this perspective means in plain language (avoid jargon like "co-evolution" - explain the actual viewpoint)
   - Pick 2-3 specific authors and for EACH author provide:
     * Their core belief/position on this topic (1-2 sentences, specific)
     * Whether they AGREE, DISAGREE, or PARTIALLY align with what the user wrote
     * An actual quote that represents their view (if you can infer it from their position summary)
     * A source URL if available in the data
4. Editorial feedback in plain language:
   - What arguments/angles they're CURRENTLY using (be specific - name authors, not camps)
   - What they're MISSING (specific gaps, name authors they should cite)

CRITICAL: Use the EXACT IDs provided in the context above. For campId, use the "Camp ID" value. For authorId, use the "ID" value listed with each author. Do not make up or modify these IDs.

Return ONLY valid JSON (no markdown, no extra text):

{
  "summary": "What the user is arguing...",
  "rankedCamps": [
    {
      "campId": "exact-camp-id-from-context",
      "campName": "Camp Label",
      "campExplanation": "Plain language: what does this viewpoint actually mean?",
      "relevanceScore": 85,
      "reasoning": "Why this matters for their draft",
      "topAuthors": [
        {
          "authorId": "exact-author-id-from-context",
          "authorName": "Author Name",
          "position": "Their specific belief about this topic",
          "stance": "agrees|disagrees|partial",
          "quote": "A representative quote or key insight",
          "sourceUrl": "URL if available, otherwise null"
        }
      ]
    }
  ],
  "editorialSuggestions": {
    "presentPerspectives": [
      "You're citing [Author]'s view that [specific point]. This strengthens your argument by...",
      "Your emphasis on [specific theme] aligns with [Author]'s position on..."
    ],
    "missingPerspectives": [
      "Consider citing [Author] who argues [specific point] - this would balance your view by...",
      "You haven't addressed [Author]'s concern about [specific issue]. Adding this would..."
    ]
  }
}`

  const response = await callGemini(prompt)

  try {
    // Extract JSON from response (in case LLM adds extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response')
    }

    const result: GeminiAnalysisResult = JSON.parse(jsonMatch[0])

    // Validate the structure
    if (!result.summary || !result.rankedCamps || !result.editorialSuggestions) {
      throw new Error('Invalid response structure from Gemini')
    }

    return result
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse Gemini analysis: ${error.message}`)
    }
    throw new Error('Failed to parse Gemini analysis: Unknown error')
  }
}

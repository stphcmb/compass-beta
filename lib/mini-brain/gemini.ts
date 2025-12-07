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
        .map((a) => `- ${a.name}${a.affiliation ? ` (${a.affiliation})` : ''}`)
        .join('\n')

      return `Camp: "${camp.name}"
ID: ${camp.id}
Description: ${camp.description}
${camp.position_summary ? `Position: ${camp.position_summary}` : ''}
Domain: ${camp.domain || 'Unknown'}
Key Authors:
${authorsText}`
    })
    .join('\n\n---\n\n')

  const prompt = `You are an editorial analyst helping a product marketing writer. Analyze the following text and match it to relevant thought leader camps from our canon.

USER'S TEXT:
${text}

---

CANON CAMPS (potential matches):
${campsContext}

---

TASK:
1. Write a 2-3 sentence summary of the user's text
2. Rank the camps by relevance to the text (score 0-100, only include camps with score >= 30)
3. For each relevant camp, identify the top 2-3 most relevant authors
4. Generate editorial suggestions:
   - What perspectives ARE present in their writing
   - What perspectives are MISSING that they should consider

Return your analysis in this EXACT JSON format (no other text, just the JSON):

{
  "summary": "2-3 sentence summary here",
  "rankedCamps": [
    {
      "campId": "camp-id-here",
      "campName": "Camp Name",
      "relevanceScore": 85,
      "reasoning": "Why this camp is relevant to the text",
      "topAuthorIds": ["author-id-1", "author-id-2"]
    }
  ],
  "editorialSuggestions": {
    "presentPerspectives": [
      "You emphasize X perspective from the Y camp",
      "Your writing aligns with Z viewpoint"
    ],
    "missingPerspectives": [
      "Consider adding perspective from A camp",
      "You might want to address B viewpoint"
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

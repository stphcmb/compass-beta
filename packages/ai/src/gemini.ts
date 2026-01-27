/**
 * Gemini API Client
 *
 * Direct integration with Google Gemini API for text analysis and
 * content generation.
 */

import { createHash } from 'crypto'
import type { GeminiRequest, GeminiResponse } from './types'

// Model options for cost/speed tradeoff
export type GeminiModel = 'flash' | 'pro'

const GEMINI_MODELS = {
  flash: 'gemini-2.5-flash',          // Fast, cost-effective - good for triage/simple tasks
  pro: 'gemini-2.5-pro'               // Advanced thinking for complex analysis
}

// In-memory cache with TTL (7 days)
interface CacheEntry {
  response: string
  timestamp: number
}

const responseCache = new Map<string, CacheEntry>()
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

/**
 * Generate cache key from prompt and model
 */
function getCacheKey(prompt: string, model: GeminiModel): string {
  return createHash('sha256')
    .update(`${model}:${prompt}`)
    .digest('hex')
}

/**
 * Clean expired cache entries
 */
function cleanExpiredCache() {
  const now = Date.now()
  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      responseCache.delete(key)
    }
  }
}

/**
 * Call Gemini API with a prompt
 *
 * @param prompt - The prompt to send to Gemini
 * @param model - Model to use: 'flash' (fast/cheap) or 'pro' (powerful)
 * @param useCache - Whether to use caching (default: true)
 * @returns The text response from Gemini
 * @throws Error if API call fails or API key is missing
 */
export async function callGemini(
  prompt: string,
  model: GeminiModel = 'flash',
  useCache: boolean = true
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY environment variable is not set. Please configure it in .env.local'
    )
  }

  // Check cache first
  if (useCache) {
    const cacheKey = getCacheKey(prompt, model)
    const cached = responseCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.response
    }

    // Clean expired entries periodically (10% chance)
    if (Math.random() < 0.1) {
      cleanExpiredCache()
    }
  }

  const modelName = GEMINI_MODELS[model]
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`

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
    const response = await fetch(apiUrl, {
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

    // Store in cache
    if (useCache) {
      const cacheKey = getCacheKey(prompt, model)
      responseCache.set(cacheKey, {
        response: textResponse,
        timestamp: Date.now()
      })
    }

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

/**
 * AI Editor Module - Main Analyzer
 *
 * Orchestrates the full analysis pipeline:
 * 1. Extract keywords from user text
 * 2. Query database for matching camps
 * 3. Use Gemini to analyze and generate editorial suggestions
 * 4. Format and return results
 */

import { extractKeywords, queryCampsByKeywords, getCampsByIds } from './query'
import { analyzeWithGemini } from './gemini'
import {
  AIEditorAnalyzeResponse,
  AIEditorMatchedCamp,
  AIEditorAuthor,
  CampWithAuthors,
} from './types'

/**
 * Analyze user text and return editorial suggestions
 *
 * This is the main entry point for the AI Editor feature.
 * It implements a hybrid approach:
 * - For longer text, extracts keywords + uses LLM for semantic analysis
 * - Returns matched camps with authors and editorial suggestions
 *
 * @param text - User's text to analyze (1-3 paragraphs recommended)
 * @param options - Optional configuration
 * @returns Analysis result with summary, matched camps, and editorial suggestions
 */
export async function analyzeText(
  text: string,
  options: {
    maxCamps?: number
    includeDebugInfo?: boolean
  } = {}
): Promise<AIEditorAnalyzeResponse> {
  const { maxCamps = 10, includeDebugInfo = false } = options

  // Validate input
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty')
  }

  // Truncate text if too long (PRD suggests ~4000 chars max for v0)
  const maxLength = 4000
  const truncatedText =
    text.length > maxLength ? text.substring(0, maxLength) + '...' : text

  try {
    // Step 1: Extract keywords from the text
    const keywords = extractKeywords(truncatedText)

    if (includeDebugInfo) {
      console.log('Extracted keywords:', keywords)
    }

    // Step 2: Query database for candidate camps
    const candidateCamps = await queryCampsByKeywords(keywords, 20)

    if (includeDebugInfo) {
      console.log(`Found ${candidateCamps.length} candidate camps`)
    }

    if (candidateCamps.length === 0) {
      // No matching camps found - return empty result
      return {
        summary: 'No relevant camps found in the canon for this text.',
        matchedCamps: [],
        editorialSuggestions: {
          presentPerspectives: [],
          missingPerspectives: [
            'This text does not match any perspectives in our current canon. Consider exploring topics related to AI, technology, or organizational strategy.',
          ],
        },
      }
    }

    // Step 3: Use Gemini to analyze and rank camps
    const geminiAnalysis = await analyzeWithGemini(
      truncatedText,
      candidateCamps
    )

    if (includeDebugInfo) {
      console.log('Gemini analysis:', geminiAnalysis)
    }

    // Step 4: Format the response
    // Map Gemini's ranked camps to our response format
    const matchedCamps: AIEditorMatchedCamp[] = geminiAnalysis.rankedCamps
      .slice(0, maxCamps)
      .map((rankedCamp): AIEditorMatchedCamp => {
        // Gemini now returns authors with full details
        const topAuthors: AIEditorAuthor[] = rankedCamp.topAuthors.map((author) => ({
          ...(author.authorId && { id: author.authorId }),
          name: author.authorName,
          position: author.position,
          stance: author.stance,
          ...(author.quote && { quote: author.quote }),
          ...(author.sourceUrl && { sourceUrl: author.sourceUrl }),
        }))

        return {
          campLabel: rankedCamp.campName,
          explanation: rankedCamp.campExplanation,
          topAuthors,
        }
      })

    return {
      summary: geminiAnalysis.summary,
      matchedCamps,
      editorialSuggestions: geminiAnalysis.editorialSuggestions,
    }
  } catch (error) {
    if (error instanceof Error) {
      // Log the error for debugging
      console.error('AI Editor analysis error:', error.message)

      // Return a user-friendly error response
      throw new Error(
        `Failed to analyze text: ${error.message}. Please try again or contact support if the issue persists.`
      )
    }
    throw new Error('Failed to analyze text: Unknown error occurred')
  }
}

/**
 * Validate text input before analysis
 *
 * @param text - Text to validate
 * @returns Object with isValid and error message if invalid
 */
export function validateText(text: string): {
  isValid: boolean
  error?: string
} {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      error: 'Text cannot be empty',
    }
  }

  if (text.length < 10) {
    return {
      isValid: false,
      error: 'Text is too short. Please provide at least 10 characters.',
    }
  }

  if (text.length > 10000) {
    return {
      isValid: false,
      error:
        'Text is too long. Please provide text with less than 10,000 characters.',
    }
  }

  return {
    isValid: true,
  }
}

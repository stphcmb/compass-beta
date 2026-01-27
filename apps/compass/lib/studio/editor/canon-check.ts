/**
 * Studio Editor - Canon Check
 *
 * Validates content against the thought leadership canon.
 * Wraps the existing AI Editor analyzeText function.
 */

import { analyzeText } from '@/lib/ai-editor'
import { CanonCheckResult, CanonCampMatch, CanonMissingPerspective } from '../types'

/**
 * Check content against the canon of thought leaders
 *
 * @param content - The draft content to analyze
 * @returns Canon check result with matched camps and missing perspectives
 */
export async function checkCanon(content: string): Promise<CanonCheckResult> {
  try {
    const analysis = await analyzeText(content, {
      maxCamps: 5,
      includeDebugInfo: false,
    })

    // Transform the analysis result into our canon check format
    const matchedCamps: CanonCampMatch[] = analysis.matchedCamps.map(camp => ({
      camp: camp.campLabel,
      relevance: 80, // The existing analyzer doesn't return scores directly, default to 80
      authors: camp.topAuthors.map(a => a.name),
    }))

    // Extract missing perspectives from editorial suggestions
    const missingPerspectives: CanonMissingPerspective[] =
      analysis.editorialSuggestions.missingPerspectives.map(suggestion => ({
        camp: 'General', // The suggestion doesn't always specify a camp
        reason: suggestion,
      }))

    return {
      matched_camps: matchedCamps,
      missing_perspectives: missingPerspectives,
      checked_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Canon check failed:', error)
    return {
      matched_camps: [],
      missing_perspectives: [],
      checked_at: new Date().toISOString(),
    }
  }
}

/**
 * Get the full analysis from the canon check
 * This returns more detailed information than the standard check
 */
export async function getFullCanonAnalysis(content: string) {
  return analyzeText(content, {
    maxCamps: 5,
    includeDebugInfo: false,
  })
}

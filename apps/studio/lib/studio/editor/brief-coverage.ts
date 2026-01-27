/**
 * Studio Editor - Brief Coverage Check
 *
 * Analyzes whether content addresses all key points
 * from the original brief.
 */

import { callGemini } from '@compass/ai'
import { BriefCoverageResult } from '../types'

/**
 * Check if content covers all key points from the brief
 *
 * @param content - The draft content to analyze
 * @param keyPoints - The key points from the brief that should be covered
 * @param title - The brief title for context
 * @returns Brief coverage result showing covered and missing points
 */
export async function checkBriefCoverage(
  content: string,
  keyPoints: string[],
  title: string
): Promise<BriefCoverageResult> {
  if (!keyPoints || keyPoints.length === 0) {
    return {
      covered: [],
      missing: [],
      checked_at: new Date().toISOString(),
    }
  }

  const keyPointsList = keyPoints
    .map((p, i) => `${i + 1}. ${p}`)
    .join('\n')

  const prompt = `You are analyzing whether a piece of content adequately covers the required key points from a brief.

## BRIEF TOPIC
${title}

## KEY POINTS THAT SHOULD BE COVERED
${keyPointsList}

## CONTENT TO ANALYZE
${content}

## TASK
For each key point, determine if it is:
- COVERED: The content meaningfully addresses this point
- MISSING: The content does not address this point or only mentions it superficially

Be strict but fair. A point is "covered" if the content substantively addresses it, not just mentions a related word.

Return ONLY valid JSON in this format:
{
  "covered": [
    "Key point 1 text (exactly as provided)",
    "Key point 3 text (exactly as provided)"
  ],
  "missing": [
    "Key point 2 text (exactly as provided)"
  ]
}

Use the EXACT text of each key point in your response.`

  try {
    const response = await callGemini(prompt, 'flash', false)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const result = JSON.parse(jsonMatch[0])

    return {
      covered: result.covered || [],
      missing: result.missing || [],
      checked_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Brief coverage check failed:', error)
    // On failure, return all points as needing review
    return {
      covered: [],
      missing: keyPoints,
      checked_at: new Date().toISOString(),
    }
  }
}

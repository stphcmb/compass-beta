/**
 * Voice Lab - Analyze Writing Style API
 *
 * POST /api/voice-lab/analyze
 * Analyzes writing samples and returns style characteristics
 * (tone, patterns, vocabulary, suggestions) without generating a full profile
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { callGemini } from '@/lib/ai-editor/gemini'

interface AnalyzeRequest {
  samples: string[]
}

interface StyleAnalysis {
  tone: string[]
  patterns: string[]
  vocabulary: string[]
  suggestions: string[]
}

interface ErrorResponse {
  error: string
  message?: string
}

/**
 * POST /api/voice-lab/analyze
 * Analyze writing samples and extract style characteristics
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<StyleAnalysis | ErrorResponse>> {
  try {
    // Auth is optional for now
    try {
      await auth()
    } catch {
      // Continue without auth
    }

    const body: AnalyzeRequest = await request.json()

    // Validate input
    if (!body.samples || !Array.isArray(body.samples) || body.samples.length === 0) {
      return NextResponse.json(
        { error: 'At least one writing sample is required' },
        { status: 400 }
      )
    }

    // Filter out empty samples
    const validSamples = body.samples.filter(s => s && s.trim().length > 0)
    if (validSamples.length === 0) {
      return NextResponse.json(
        { error: 'At least one non-empty writing sample is required' },
        { status: 400 }
      )
    }

    // Combine samples for analysis
    const combinedText = validSamples.join('\n\n---\n\n')

    // Truncate if too long
    const maxLength = 8000
    const truncatedText = combinedText.length > maxLength
      ? combinedText.substring(0, maxLength) + '...'
      : combinedText

    // Build the analysis prompt
    const prompt = `Analyze the following writing sample(s) and extract key style characteristics.

WRITING SAMPLES:
${truncatedText}

---

Analyze the writing style and return a JSON object with these arrays:

1. "tone" - 4-6 single words or short phrases describing the overall tone
   Examples: "direct", "conversational", "urgent", "warm but firm", "intellectually rigorous"

2. "patterns" - 4-6 notable structural or rhetorical patterns you observe
   Examples: "Uses short punchy sentences for emphasis", "Opens with provocative questions", "Builds arguments through contrast pairs"

3. "vocabulary" - 4-6 vocabulary preferences or language patterns
   Examples: "Favors action verbs over passive constructions", "Uses metaphors from business/war", "Avoids jargon and corporate-speak"

4. "suggestions" - 3-4 specific suggestions for strengthening writing in this style
   Examples: "Add more concrete examples to support abstract claims", "Vary sentence length more dramatically"

Return ONLY valid JSON, no other text. Format:
{
  "tone": ["...", "...", ...],
  "patterns": ["...", "...", ...],
  "vocabulary": ["...", "...", ...],
  "suggestions": ["...", "...", ...]
}`

    // Call Gemini for analysis (use flash for speed)
    const response = await callGemini(prompt, 'flash', false)

    // Parse the response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const analysis: StyleAnalysis = JSON.parse(jsonMatch[0])

      // Validate and provide defaults
      const result: StyleAnalysis = {
        tone: Array.isArray(analysis.tone) ? analysis.tone.slice(0, 6) : [],
        patterns: Array.isArray(analysis.patterns) ? analysis.patterns.slice(0, 6) : [],
        vocabulary: Array.isArray(analysis.vocabulary) ? analysis.vocabulary.slice(0, 6) : [],
        suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions.slice(0, 4) : [],
      }

      return NextResponse.json(result)
    } catch (parseError) {
      console.error('Failed to parse analysis response:', parseError)
      // Return fallback analysis
      return NextResponse.json({
        tone: ['analytical', 'clear'],
        patterns: ['Unable to fully analyze patterns'],
        vocabulary: ['Standard vocabulary observed'],
        suggestions: ['Try providing more writing samples for better analysis'],
      })
    }
  } catch (error) {
    console.error('Voice Lab analyze error:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze writing samples',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

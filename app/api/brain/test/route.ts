/**
 * AI Editor Test Endpoint (No Gemini)
 *
 * POST /api/brain/test
 *
 * Tests keyword extraction and database queries without calling Gemini.
 * Useful for testing when Gemini quota is exceeded or for development.
 */

import { NextRequest, NextResponse } from 'next/server'
import { extractKeywords, queryCampsByKeywords } from '@/lib/ai-editor/query'
import { validateText } from '@/lib/ai-editor'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    if (!body.text) {
      return NextResponse.json(
        { error: 'Missing required field: text' },
        { status: 400 }
      )
    }

    // Validate text input
    const validation = validateText(body.text)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Step 1: Extract keywords
    const keywords = extractKeywords(body.text)

    // Step 2: Query database for matching camps
    const candidateCamps = await queryCampsByKeywords(keywords, 20)

    // Return debug info
    return NextResponse.json(
      {
        debug: {
          textLength: body.text.length,
          keywords: {
            words: keywords.words.slice(0, 10),
            phrases: keywords.phrases.slice(0, 5),
            totalTerms: keywords.allTerms.length,
          },
          candidateCamps: {
            count: candidateCamps.length,
            camps: candidateCamps.map((camp) => ({
              id: camp.id,
              name: camp.name,
              domain: camp.domain,
              authorCount: camp.authors.length,
              topAuthors: camp.authors.slice(0, 3).map((a) => a.name),
            })),
          },
        },
        message: `Found ${candidateCamps.length} matching camps. Keyword extraction and database queries are working correctly!`,
        note: 'This is a test endpoint that skips Gemini API calls. Use /api/brain/analyze for full analysis.',
      },
      { status: 200 }
    )
  } catch (error) {
    // Log error for debugging
    console.error('AI Editor test error:', error)

    // Return error response
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Test failed',
          message: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Test failed',
        message: 'An unknown error occurred',
      },
      { status: 500 }
    )
  }
}

// Return method not allowed for other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to test.' },
    { status: 405 }
  )
}

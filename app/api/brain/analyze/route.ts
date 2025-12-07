/**
 * Mini Brain API Endpoint
 *
 * POST /api/brain/analyze
 *
 * Accepts user text and returns:
 * - Summary of the text
 * - Matched camps from the canon
 * - Editorial suggestions (present/missing perspectives)
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  analyzeText,
  validateText,
  MiniBrainAnalyzeRequest,
} from '@/lib/mini-brain'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: MiniBrainAnalyzeRequest = await request.json()

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

    // Analyze the text
    const result = await analyzeText(body.text)

    // Return successful response
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    // Log error for debugging
    console.error('Mini Brain API error:', error)

    // Return error response
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Analysis failed',
          message: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Analysis failed',
        message: 'An unknown error occurred',
      },
      { status: 500 }
    )
  }
}

// Return method not allowed for other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to analyze text.' },
    { status: 405 }
  )
}

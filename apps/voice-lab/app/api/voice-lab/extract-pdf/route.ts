/**
 * Voice Lab - Extract PDF Text API
 *
 * POST /api/voice-lab/extract-pdf
 * Accepts a PDF file and returns the extracted text
 *
 * NOTE: PDF extraction is temporarily disabled due to serverless compatibility issues.
 * Users should copy/paste text directly for now.
 */

import { NextRequest, NextResponse } from 'next/server'

interface ExtractResponse {
  text: string
  pages: number
  info?: {
    title?: string
    author?: string
  }
}

interface ErrorResponse {
  error: string
  message?: string
}

/**
 * POST /api/voice-lab/extract-pdf
 * Extract text from an uploaded PDF file
 */
export async function POST(
  _request: NextRequest
): Promise<NextResponse<ExtractResponse | ErrorResponse>> {
  // PDF extraction temporarily disabled due to serverless compatibility issues
  // with pdf-parse library. Users should copy/paste text directly.
  return NextResponse.json(
    {
      error: 'PDF extraction is temporarily unavailable',
      message: 'Please copy and paste your text directly instead of uploading a PDF.',
    },
    { status: 503 }
  )
}

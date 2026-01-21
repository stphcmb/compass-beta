/**
 * Voice Lab - Extract PDF Text API
 *
 * POST /api/voice-lab/extract-pdf
 * Accepts a PDF file and returns the extracted text
 */

import { NextRequest, NextResponse } from 'next/server'
// @ts-expect-error - pdf-parse v1.1.1 doesn't have types
import pdf from 'pdf-parse/lib/pdf-parse'

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

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * POST /api/voice-lab/extract-pdf
 * Extract text from an uploaded PDF file
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ExtractResponse | ErrorResponse>> {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse PDF using pdf-parse v1.1.1
    const data = await pdf(buffer)

    // Clean up extracted text
    let text = data.text || ''

    // Remove excessive whitespace while preserving paragraph breaks
    text = text
      .replace(/\r\n/g, '\n')           // Normalize line endings
      .replace(/\n{3,}/g, '\n\n')       // Max 2 consecutive newlines
      .replace(/[ \t]+/g, ' ')          // Collapse horizontal whitespace
      .replace(/\n /g, '\n')            // Remove leading spaces after newlines
      .trim()

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. The file may be image-based or protected.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      text,
      pages: data.numpages || 1,
      info: {
        title: data.info?.Title,
        author: data.info?.Author,
      },
    })
  } catch (error) {
    console.error('PDF extraction error:', error)
    return NextResponse.json(
      {
        error: 'Failed to extract text from PDF',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Simple AI Text Generation API
 *
 * POST /api/ai/generate - Generate text from a prompt
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { callGemini } from '@/lib/ai-editor/gemini'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { prompt, max_tokens } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Use flash model for fast generation
    const response = await callGemini(prompt, 'flash', false)

    return NextResponse.json({
      text: response,
    })
  } catch (error) {
    console.error('AI generate error:', error)
    return NextResponse.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    )
  }
}

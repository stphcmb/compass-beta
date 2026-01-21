/**
 * AI Editor API Endpoint
 *
 * POST /api/brain/analyze
 *
 * Accepts user text and returns:
 * - Summary of the text
 * - Matched camps from the canon
 * - Editorial suggestions (present/missing perspectives)
 *
 * If the user is authenticated, their editor memory is used to personalize results.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  analyzeText,
  validateText,
  AIEditorAnalyzeRequest,
  getEditorContextForUser,
} from '@/lib/ai-editor'
import {
  getStyleGuideById,
  buildVoiceProfileContext,
  getVoiceProfile,
} from '@/lib/voice-lab'

// Extended request type to include profileId
interface ExtendedAnalyzeRequest extends AIEditorAnalyzeRequest {
  profileId?: string
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ExtendedAnalyzeRequest = await request.json()

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

    // Get user's editor memory context if authenticated
    let editorContext: string | undefined
    let voiceProfileContext: string | undefined

    try {
      const { userId } = await auth()
      if (userId) {
        editorContext = await getEditorContextForUser(userId)
        // Only use if there's actual content (not just empty template)
        if (editorContext && editorContext.trim().length < 50) {
          editorContext = undefined
        }
      }
    } catch (authError) {
      // Auth failed, continue without personalization
      console.log('Auth not available, continuing without personalization')
    }

    // Get voice profile context if profileId provided
    if (body.profileId) {
      try {
        const profile = await getVoiceProfile(body.profileId)
        if (profile?.style_guide) {
          voiceProfileContext = buildVoiceProfileContext(
            profile.style_guide,
            profile.name
          )
        }
      } catch (profileError) {
        console.log('Failed to fetch voice profile, continuing without it')
      }
    }

    // Analyze the text with optional personalization and voice profile
    const result = await analyzeText(body.text, { editorContext, voiceProfileContext })

    // Return successful response
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    // Log error for debugging
    console.error('AI Editor API error:', error)

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

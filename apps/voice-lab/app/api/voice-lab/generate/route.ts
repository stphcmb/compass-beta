/**
 * Voice Lab - Generate Style Guide API
 *
 * POST /api/voice-lab/generate
 * Generate a comprehensive style guide from writing samples
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  generateStyleGuide,
  createVoiceProfile,
  GenerateStyleGuideRequest,
  GenerateStyleGuideResponse,
  ErrorResponse,
} from '@/lib/voice-lab'

/**
 * POST /api/voice-lab/generate
 * Generate a style guide from writing samples and optionally save as a profile
 *
 * Body:
 * - samples: string[] (required) - Writing samples to analyze
 * - name: string (required) - Name for the profile
 * - description?: string - Optional description
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateStyleGuideResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: GenerateStyleGuideRequest = await request.json()

    // Validate input
    if (!body.samples || !Array.isArray(body.samples) || body.samples.length === 0) {
      return NextResponse.json(
        { error: 'At least one writing sample is required' },
        { status: 400 }
      )
    }

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Profile name is required' },
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

    // Generate the style guide using AI
    const styleGuide = await generateStyleGuide(validSamples, body.name.trim())

    // Create the profile with the generated style guide
    const profile = await createVoiceProfile({
      clerk_user_id: userId,
      name: body.name.trim(),
      description: body.description?.trim(),
      style_guide: styleGuide,
      source_samples: validSamples,
    })

    if (!profile) {
      // Return just the style guide if profile creation failed
      return NextResponse.json({
        styleGuide,
      })
    }

    return NextResponse.json({
      styleGuide,
      profile,
    }, { status: 201 })
  } catch (error) {
    console.error('Voice Lab generate error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate style guide',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

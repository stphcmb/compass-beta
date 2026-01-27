/**
 * Voice Lab - Synthesize API
 *
 * POST /api/voice-lab/profiles/[id]/synthesize - Regenerate style guide from insights
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getVoiceProfileForUser,
  incrementStyleGuideVersion,
  updateTrainingStatus,
  SynthesizeResponse,
  ErrorResponse,
} from '@/lib/voice-lab'
import { synthesizeStyleGuide } from '@/lib/voice-lab/style-synthesizer'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/voice-lab/profiles/[id]/synthesize
 * Regenerate the style guide from current insights
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<SynthesizeResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify ownership
    const profile = await getVoiceProfileForUser(id, userId)
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Mark profile as processing
    await updateTrainingStatus(id, 'processing')

    try {
      // Synthesize new style guide from insights
      const result = await synthesizeStyleGuide(id, profile.name)

      // Update profile with new style guide and increment version
      const updatedProfile = await incrementStyleGuideVersion(id, result.styleGuide)

      if (!updatedProfile) {
        throw new Error('Failed to update profile')
      }

      return NextResponse.json({
        profile: updatedProfile,
        styleGuide: result.styleGuide,
        version: updatedProfile.style_guide_version,
      })
    } catch (error) {
      // Reset status on failure
      await updateTrainingStatus(id, 'needs_update')
      throw error
    }
  } catch (error) {
    console.error('Voice Lab Synthesize API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to synthesize style guide',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

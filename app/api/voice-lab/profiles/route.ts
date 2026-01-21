/**
 * Voice Lab - Profiles API
 *
 * GET /api/voice-lab/profiles - List all profiles for the current user
 * POST /api/voice-lab/profiles - Create/import a new profile
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getVoiceProfiles,
  createVoiceProfile,
  CreateProfileRequest,
  ListProfilesResponse,
  ProfileResponse,
  ErrorResponse,
} from '@/lib/voice-lab'

/**
 * GET /api/voice-lab/profiles
 * List all voice profiles for the authenticated user
 */
export async function GET(): Promise<NextResponse<ListProfilesResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const profiles = await getVoiceProfiles(userId)

    return NextResponse.json({
      profiles,
      count: profiles.length,
    })
  } catch (error) {
    console.error('Voice Lab API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch profiles',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/voice-lab/profiles
 * Create or import a new voice profile
 *
 * Body:
 * - name: string (required)
 * - description?: string
 * - styleGuide?: string (markdown content)
 * - sourceSamples?: string[] (original samples, for reference)
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ProfileResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: CreateProfileRequest = await request.json()

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Profile name is required' },
        { status: 400 }
      )
    }

    const profile = await createVoiceProfile({
      clerk_user_id: userId,
      name: body.name.trim(),
      description: body.description?.trim(),
      style_guide: body.styleGuide,
      source_samples: body.sourceSamples,
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ profile }, { status: 201 })
  } catch (error) {
    console.error('Voice Lab API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

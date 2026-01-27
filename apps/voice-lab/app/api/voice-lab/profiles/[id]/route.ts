/**
 * Voice Lab - Single Profile API
 *
 * GET /api/voice-lab/profiles/[id] - Get a specific profile
 * PUT /api/voice-lab/profiles/[id] - Update a profile
 * DELETE /api/voice-lab/profiles/[id] - Delete a profile
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getVoiceProfileForUser,
  updateVoiceProfile,
  deleteVoiceProfileForUser,
  setActiveVoiceProfile,
  deactivateAllVoiceProfiles,
  UpdateProfileRequest,
  ProfileResponse,
  ErrorResponse,
} from '@/lib/voice-lab'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/voice-lab/profiles/[id]
 * Get a specific voice profile
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ProfileResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const profile = await getVoiceProfileForUser(id, userId)

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Voice Lab API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/voice-lab/profiles/[id]
 * Update a voice profile
 *
 * Body:
 * - name?: string
 * - description?: string
 * - styleGuide?: string
 * - sourceSamples?: string[]
 * - isActive?: boolean (if true, deactivates all other profiles)
 * - labels?: string[]
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ProfileResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body: UpdateProfileRequest & { labels?: string[] } = await request.json()

    // Verify ownership first
    const existingProfile = await getVoiceProfileForUser(id, userId)
    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Handle activation logic
    if (body.isActive === true) {
      // Set this profile as active (deactivates others)
      const success = await setActiveVoiceProfile(id, userId)
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to activate profile' },
          { status: 500 }
        )
      }
    } else if (body.isActive === false && existingProfile.is_active) {
      // Deactivate all profiles (no active profile)
      await deactivateAllVoiceProfiles(userId)
    }

    // Update other fields
    const profile = await updateVoiceProfile(id, {
      name: body.name?.trim(),
      description: body.description?.trim(),
      style_guide: body.styleGuide,
      source_samples: body.sourceSamples,
      is_active: body.isActive,
      labels: body.labels,
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Voice Lab API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/voice-lab/profiles/[id]
 * Delete a voice profile
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ success: boolean } | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const success = await deleteVoiceProfileForUser(id, userId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Voice Lab API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

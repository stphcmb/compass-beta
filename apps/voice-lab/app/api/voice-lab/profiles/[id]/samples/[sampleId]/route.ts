/**
 * Voice Lab - Single Sample API
 *
 * GET /api/voice-lab/profiles/[id]/samples/[sampleId] - Get a sample
 * PATCH /api/voice-lab/profiles/[id]/samples/[sampleId] - Update a sample
 * DELETE /api/voice-lab/profiles/[id]/samples/[sampleId] - Delete a sample
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getVoiceProfileForUser,
  getVoiceSample,
  updateVoiceSample,
  deleteVoiceSampleForUser,
  deleteInsightsForSample,
  recalculateInsightConfidence,
  updateProfileCounts,
  getSampleCount,
  getInsightCount,
  markProfileNeedsUpdate,
  VoiceSample,
  VoiceSampleCategory,
  ErrorResponse,
} from '@/lib/voice-lab'

interface RouteParams {
  params: Promise<{ id: string; sampleId: string }>
}

/**
 * GET /api/voice-lab/profiles/[id]/samples/[sampleId]
 * Get a specific sample
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ sample: VoiceSample } | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, sampleId } = await params

    // Verify profile ownership
    const profile = await getVoiceProfileForUser(id, userId)
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Get the sample
    const sample = await getVoiceSample(sampleId)
    if (!sample) {
      return NextResponse.json(
        { error: 'Sample not found' },
        { status: 404 }
      )
    }

    // Verify sample belongs to this profile
    if (sample.voice_profile_id !== id) {
      return NextResponse.json(
        { error: 'Sample not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ sample })
  } catch (error) {
    console.error('Voice Lab Sample API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch sample',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/voice-lab/profiles/[id]/samples/[sampleId]
 * Update a sample (category, notes)
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ sample: VoiceSample } | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, sampleId } = await params
    const body: { category?: VoiceSampleCategory | null; notes?: string | null } = await request.json()

    // Verify profile ownership
    const profile = await getVoiceProfileForUser(id, userId)
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Get the sample to verify it exists and belongs to this profile
    const existingSample = await getVoiceSample(sampleId)
    if (!existingSample || existingSample.voice_profile_id !== id) {
      return NextResponse.json(
        { error: 'Sample not found' },
        { status: 404 }
      )
    }

    // Update the sample
    const sample = await updateVoiceSample(sampleId, {
      category: body.category,
      notes: body.notes,
    })

    if (!sample) {
      return NextResponse.json(
        { error: 'Failed to update sample' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sample })
  } catch (error) {
    console.error('Voice Lab Sample API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update sample',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/voice-lab/profiles/[id]/samples/[sampleId]
 * Delete a sample and recalculate insight confidence
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

    const { id, sampleId } = await params

    // Verify profile ownership
    const profile = await getVoiceProfileForUser(id, userId)
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Get the sample to verify it exists and belongs to this profile
    const sample = await getVoiceSample(sampleId)
    if (!sample || sample.voice_profile_id !== id) {
      return NextResponse.json(
        { error: 'Sample not found' },
        { status: 404 }
      )
    }

    // Recalculate insight confidence for insights linked to this sample
    await recalculateInsightConfidence(id, sampleId)

    // Delete insights that were solely from this sample
    await deleteInsightsForSample(sampleId)

    // Delete the sample
    const success = await deleteVoiceSampleForUser(sampleId, userId)
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete sample' },
        { status: 500 }
      )
    }

    // Update profile counts
    const newSampleCount = await getSampleCount(id)
    const newInsightCount = await getInsightCount(id)
    await updateProfileCounts(id, newSampleCount, newInsightCount)

    // Mark profile as needing resynthesis
    await markProfileNeedsUpdate(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Voice Lab Sample API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete sample',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Voice Lab - Samples API
 *
 * POST /api/voice-lab/profiles/[id]/samples - Add training samples
 * GET /api/voice-lab/profiles/[id]/samples - List all samples
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getVoiceProfileForUser,
  createVoiceSamples,
  getVoiceSamples,
  markSampleProcessed,
  updateProfileCounts,
  getSampleCount,
  getInsightCount,
  mergeInsights,
  incrementStyleGuideVersion,
  updateTrainingStatus,
  AddSamplesRequest,
  AddSamplesResponse,
  ListSamplesResponse,
  ErrorResponse,
} from '@/lib/voice-lab'
import { extractInsightsFromSample } from '@/lib/voice-lab/insight-extractor'
import { synthesizeStyleGuide } from '@/lib/voice-lab/style-synthesizer'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/voice-lab/profiles/[id]/samples
 * Add training samples to a voice profile
 *
 * Body:
 * - samples: Array of { content, sourceType?, sourceName? }
 * - autoResynthesize?: boolean (default: true)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<AddSamplesResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body: AddSamplesRequest = await request.json()

    // Validate request
    if (!body.samples || !Array.isArray(body.samples) || body.samples.length === 0) {
      return NextResponse.json(
        { error: 'At least one sample is required' },
        { status: 400 }
      )
    }

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

    // Filter valid samples (non-empty content)
    const validSamples = body.samples.filter(
      (s) => s.content && s.content.trim().length >= 50
    )

    if (validSamples.length === 0) {
      await updateTrainingStatus(id, 'ready')
      return NextResponse.json(
        { error: 'All samples must have at least 50 characters' },
        { status: 400 }
      )
    }

    // Create sample records
    const sampleInputs = validSamples.map((s) => ({
      voice_profile_id: id,
      clerk_user_id: userId,
      content: s.content.trim(),
      source_type: s.sourceType,
      source_name: s.sourceName,
      category: s.category,
      notes: s.notes,
    }))

    const createdSamples = await createVoiceSamples(sampleInputs)

    if (createdSamples.length === 0) {
      await updateTrainingStatus(id, 'ready')
      return NextResponse.json(
        { error: 'Failed to create samples' },
        { status: 500 }
      )
    }

    // Extract insights from each sample
    let totalInsightsExtracted = 0

    for (const sample of createdSamples) {
      try {
        const extractionResult = await extractInsightsFromSample(sample.content)

        if (extractionResult.insights.length > 0) {
          // Merge insights with existing ones
          const { created, merged } = await mergeInsights(
            id,
            userId,
            sample.id,
            extractionResult.insights
          )
          totalInsightsExtracted += created + merged
        }

        // Mark sample as processed with quality score
        await markSampleProcessed(sample.id, extractionResult.qualityScore)
      } catch (error) {
        console.error(`Failed to extract insights from sample ${sample.id}:`, error)
        // Continue with other samples
      }
    }

    // Update profile counts
    const newSampleCount = await getSampleCount(id)
    const newInsightCount = await getInsightCount(id)
    await updateProfileCounts(id, newSampleCount, newInsightCount)

    // Auto-resynthesize style guide if requested (default: true)
    const autoResynthesize = body.autoResynthesize !== false
    let updatedProfile = profile

    if (autoResynthesize && totalInsightsExtracted > 0) {
      try {
        const result = await synthesizeStyleGuide(id, profile.name)
        const updated = await incrementStyleGuideVersion(id, result.styleGuide)
        if (updated) {
          updatedProfile = updated
        }
      } catch (error) {
        console.error('Failed to resynthesize style guide:', error)
        // Mark as needs update instead of failing
        await updateTrainingStatus(id, 'needs_update')
      }
    } else {
      await updateTrainingStatus(id, totalInsightsExtracted > 0 ? 'needs_update' : 'ready')
    }

    // Fetch the final profile state
    const finalProfile = await getVoiceProfileForUser(id, userId)

    return NextResponse.json({
      samplesAdded: createdSamples.length,
      insightsExtracted: totalInsightsExtracted,
      profile: finalProfile || updatedProfile,
    })
  } catch (error) {
    console.error('Voice Lab Samples API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to add samples',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/voice-lab/profiles/[id]/samples
 * List all samples for a profile
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ListSamplesResponse | ErrorResponse>> {
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

    const samples = await getVoiceSamples(id)

    return NextResponse.json({
      samples,
      count: samples.length,
    })
  } catch (error) {
    console.error('Voice Lab Samples API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch samples',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

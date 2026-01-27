/**
 * Voice Lab - Insights API
 *
 * GET /api/voice-lab/profiles/[id]/insights - List all insights
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getVoiceProfileForUser,
  getVoiceInsights,
  getInsightCountsByType,
  ListInsightsResponse,
  ErrorResponse,
} from '@/lib/voice-lab'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/voice-lab/profiles/[id]/insights
 * List all insights for a profile
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ListInsightsResponse | ErrorResponse>> {
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

    const insights = await getVoiceInsights(id)
    const byType = await getInsightCountsByType(id)

    return NextResponse.json({
      insights,
      count: insights.length,
      byType,
    })
  } catch (error) {
    console.error('Voice Lab Insights API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch insights',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

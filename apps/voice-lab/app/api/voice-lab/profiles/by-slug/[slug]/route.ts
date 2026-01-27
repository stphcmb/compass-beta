/**
 * Voice Lab - Profile by Slug API
 *
 * GET /api/voice-lab/profiles/by-slug/:slug
 * Fetch a profile by its URL-friendly slug
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getVoiceProfileBySlug } from '@/lib/voice-lab'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const profile = await getVoiceProfileBySlug(userId, slug)

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Get profile by slug error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get profile' },
      { status: 500 }
    )
  }
}

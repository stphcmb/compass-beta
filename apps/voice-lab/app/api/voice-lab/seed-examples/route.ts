/**
 * Voice Lab - Seed Example Profiles API
 *
 * POST /api/voice-lab/seed-examples
 * POST /api/voice-lab/seed-examples?force=true  (recreate)
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { seedExampleProfiles, EXAMPLE_PROFILE_NAMES } from '@/lib/voice-lab/seed-example-profiles'
import { getVoiceProfiles, deleteVoiceProfile, deleteAllSamplesForProfile, deleteAllInsightsForProfile } from '@/lib/voice-lab'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const force = new URL(request.url).searchParams.get('force') === 'true'

    // Check existing
    const existingProfiles = await getVoiceProfiles(userId)
    const existingExamples = existingProfiles.filter((p) => EXAMPLE_PROFILE_NAMES.includes(p.name))

    if (existingExamples.length > 0 && !force) {
      return NextResponse.json({
        message: 'Examples exist. Use force=true to recreate.',
        skipped: true,
      })
    }

    // Delete existing if force
    if (force && existingExamples.length > 0) {
      for (const profile of existingExamples) {
        await deleteAllInsightsForProfile(profile.id)
        await deleteAllSamplesForProfile(profile.id)
        await deleteVoiceProfile(profile.id)
      }
    }

    const results = await seedExampleProfiles({ clerkUserId: userId })

    return NextResponse.json({
      message: `Created ${results.length} example profiles`,
      profiles: results,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 }
    )
  }
}

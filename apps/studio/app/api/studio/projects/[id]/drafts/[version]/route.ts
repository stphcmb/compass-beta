/**
 * Studio Project Draft Version API
 *
 * GET /api/studio/projects/[id]/drafts/[version] - Get a specific draft version
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getProjectDraft,
  DraftResponse,
  ErrorResponse,
} from '@/lib/studio'

interface RouteParams {
  params: Promise<{ id: string; version: string }>
}

/**
 * GET /api/studio/projects/[id]/drafts/[version]
 * Get a specific draft version
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<DraftResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, version } = await params
    const versionNumber = parseInt(version, 10)

    if (isNaN(versionNumber) || versionNumber < 1) {
      return NextResponse.json(
        { error: 'Invalid version number' },
        { status: 400 }
      )
    }

    const draft = await getProjectDraft(id, versionNumber, userId)

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft version not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ draft })
  } catch (error) {
    console.error('Studio Projects API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch draft',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

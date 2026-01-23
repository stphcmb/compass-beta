/**
 * Studio Project Drafts API
 *
 * GET /api/studio/projects/[id]/drafts - List all draft versions for a project
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getProjectDrafts,
  ListDraftsResponse,
  ErrorResponse,
} from '@/lib/studio'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/studio/projects/[id]/drafts
 * List all draft versions for a project (newest first)
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ListDraftsResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const drafts = await getProjectDrafts(id, userId)

    // If no drafts and we got here, project either doesn't exist or has no drafts yet
    // The store already verified ownership

    return NextResponse.json({
      drafts,
      count: drafts.length,
    })
  } catch (error) {
    console.error('Studio Projects API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch drafts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

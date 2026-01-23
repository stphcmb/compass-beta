/**
 * Studio Single Project API
 *
 * GET /api/studio/projects/[id] - Get a specific project
 * PUT /api/studio/projects/[id] - Update a project (optionally creates draft version)
 * DELETE /api/studio/projects/[id] - Delete a project
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getProjectForUser,
  updateProject,
  deleteProject,
  ProjectResponse,
  UpdateProjectRequest,
  ChangeSource,
  ErrorResponse,
} from '@/lib/studio'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/studio/projects/[id]
 * Get a specific project
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ProjectResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const project = await getProjectForUser(id, userId)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Studio Projects API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch project',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/studio/projects/[id]
 * Update a project
 *
 * Body:
 * - title?: string
 * - format?: 'blog' | 'linkedin' | 'memo' | 'byline'
 * - audience?: string
 * - key_points?: string[]
 * - additional_context?: string
 * - content_domain?: 'ai_discourse' | 'anduin_product' | 'hybrid'
 * - voice_profile_id?: string
 * - current_draft?: string
 * - status?: 'brief' | 'draft' | 'editing' | 'complete'
 * - last_voice_check?: VoiceCheckResult
 * - last_canon_check?: CanonCheckResult
 * - last_brief_coverage?: BriefCoverageResult
 *
 * Query params:
 * - create_version?: 'true' - If true, creates a new draft version when content changes
 * - change_source?: ChangeSource - Source of the change (required if create_version=true)
 * - change_summary?: string - Optional summary of changes
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ProjectResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body: UpdateProjectRequest = await request.json()

    // Check if we should create a new version
    const createVersion = request.nextUrl.searchParams.get('create_version') === 'true'
    const changeSource = request.nextUrl.searchParams.get('change_source') as ChangeSource | null
    const changeSummary = request.nextUrl.searchParams.get('change_summary')

    // Verify project exists and user owns it
    const existingProject = await getProjectForUser(id, userId)
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // If creating version but no change source, default based on context
    let versionConfig: { changeSource: ChangeSource; changeSummary?: string } | undefined
    if (createVersion && body.current_draft !== undefined) {
      versionConfig = {
        changeSource: changeSource || 'user_edit',
        changeSummary: changeSummary || undefined,
      }
    }

    const project = await updateProject(id, userId, body, versionConfig)

    if (!project) {
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Studio Projects API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update project',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/studio/projects/[id]
 * Delete a project (and all its drafts via CASCADE)
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
    const success = await deleteProject(id, userId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Studio Projects API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete project',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

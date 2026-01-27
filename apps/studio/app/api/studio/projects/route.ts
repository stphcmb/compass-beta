/**
 * Studio Projects API
 *
 * GET /api/studio/projects - List all projects for the current user
 * POST /api/studio/projects - Create a new project
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getProjects,
  createProject,
  ListProjectsResponse,
  ProjectResponse,
  CreateProjectRequest,
  ErrorResponse,
} from '@/lib/studio'

/**
 * GET /api/studio/projects
 * List all projects for the authenticated user
 *
 * Query params:
 * - status?: 'brief' | 'draft' | 'editing' | 'complete' - Filter by status
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ListProjectsResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const projects = await getProjects(userId)

    // Apply status filter if provided
    const status = request.nextUrl.searchParams.get('status')
    const filteredProjects = status
      ? projects.filter(p => p.status === status)
      : projects

    return NextResponse.json({
      projects: filteredProjects,
      count: filteredProjects.length,
    })
  } catch (error) {
    console.error('Studio Projects API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch projects',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/studio/projects
 * Create a new project
 *
 * Body:
 * - brief?: { title, format, audience, key_points, content_domain, additional_context }
 * - voice_profile_id?: string
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ProjectResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: CreateProjectRequest = await request.json()

    const project = await createProject(userId, body)

    if (!project) {
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Studio Projects API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create project',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

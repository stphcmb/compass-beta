/**
 * Studio Editor Analysis API
 *
 * POST /api/studio/editor/analyze - Run validation checks on content
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getProjectForUser, updateProject } from '@/lib/studio/projects'
import { checkVoice } from '@/lib/studio/editor/voice-check'
import { checkBriefCoverage } from '@/lib/studio/editor/brief-coverage'
import { checkCanon } from '@/lib/studio/editor/canon-check'
import {
  AnalyzeContentRequest,
  AnalyzeContentResponse,
  ErrorResponse,
} from '@/lib/studio/types'

/**
 * POST /api/studio/editor/analyze
 * Run validation checks on content
 *
 * Body:
 * - project_id: string - Project to analyze
 * - content: string - Content to analyze (uses this instead of project's current_draft if provided)
 * - checks: { voice?: boolean, canon?: boolean, brief_coverage?: boolean }
 *
 * Query params:
 * - save: 'true' - If true, saves the check results to the project
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<AnalyzeContentResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: AnalyzeContentRequest = await request.json()

    // Validate required fields
    if (!body.project_id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Get the project
    const project = await getProjectForUser(body.project_id, userId)
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Use provided content or fall back to project's current draft
    const content = body.content || project.current_draft
    if (!content) {
      return NextResponse.json(
        { error: 'No content to analyze' },
        { status: 400 }
      )
    }

    // Default checks configuration
    const checks = {
      voice: body.checks?.voice ?? true,
      canon: body.checks?.canon ?? false, // Canon check is opt-in
      brief_coverage: body.checks?.brief_coverage ?? true,
    }

    // Run requested checks in parallel
    const results: AnalyzeContentResponse = {}

    const checkPromises: Promise<void>[] = []

    // Voice check
    if (checks.voice && project.voice_profile_id) {
      checkPromises.push(
        checkVoice(content, project.voice_profile_id)
          .then(result => {
            results.voice_check = result
          })
          .catch(error => {
            console.error('Voice check failed:', error)
          })
      )
    }

    // Brief coverage check
    if (checks.brief_coverage && project.key_points && project.key_points.length > 0) {
      checkPromises.push(
        checkBriefCoverage(content, project.key_points, project.title || 'Untitled')
          .then(result => {
            results.brief_coverage = result
          })
          .catch(error => {
            console.error('Brief coverage check failed:', error)
          })
      )
    }

    // Canon check (optional, more expensive)
    if (checks.canon) {
      checkPromises.push(
        checkCanon(content)
          .then(result => {
            results.canon_check = result
          })
          .catch(error => {
            console.error('Canon check failed:', error)
          })
      )
    }

    // Wait for all checks to complete
    await Promise.all(checkPromises)

    // Optionally save results to project
    const shouldSave = request.nextUrl.searchParams.get('save') === 'true'
    if (shouldSave) {
      await updateProject(body.project_id, userId, {
        last_voice_check: results.voice_check,
        last_canon_check: results.canon_check,
        last_brief_coverage: results.brief_coverage,
      })
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Studio Editor Analyze error:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze content',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

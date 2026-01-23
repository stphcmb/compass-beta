/**
 * Studio Content Generation API
 *
 * POST /api/studio/content/generate - Generate voice-constrained content from a brief
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateContent, regenerateContent } from '@/lib/studio/content-builder'
import {
  createProject,
  updateProject,
  getProjectForUser,
} from '@/lib/studio/projects'
import {
  GenerateContentRequest,
  GenerateContentResponse,
  ErrorResponse,
} from '@/lib/studio/types'

/**
 * POST /api/studio/content/generate
 * Generate voice-constrained content from a brief
 *
 * Body:
 * - project_id?: string - Optional: update existing project
 * - brief: { title, format, audience, key_points, content_domain, additional_context? }
 * - voice_profile_id: string
 *
 * Optional query params:
 * - regenerate: 'true' - If true and project_id provided, regenerates based on current content
 * - feedback: string - Specific feedback to address in regeneration
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateContentResponse | ErrorResponse>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: GenerateContentRequest = await request.json()

    // Validate required fields
    if (!body.brief) {
      return NextResponse.json(
        { error: 'Brief is required' },
        { status: 400 }
      )
    }

    if (!body.brief.title || body.brief.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Brief title is required' },
        { status: 400 }
      )
    }

    if (!body.brief.format) {
      return NextResponse.json(
        { error: 'Content format is required' },
        { status: 400 }
      )
    }

    if (!body.brief.key_points || body.brief.key_points.length === 0) {
      return NextResponse.json(
        { error: 'At least one key point is required' },
        { status: 400 }
      )
    }

    if (!body.voice_profile_id) {
      return NextResponse.json(
        { error: 'Voice profile ID is required' },
        { status: 400 }
      )
    }

    // Check for regeneration mode
    const isRegenerate = request.nextUrl.searchParams.get('regenerate') === 'true'
    const feedback = request.nextUrl.searchParams.get('feedback')

    let result: { content: string; wordCount: number; voiceMatch: { score: number; notes: string[] } }

    if (isRegenerate && body.project_id) {
      // Regeneration mode - get existing content and regenerate
      const existingProject = await getProjectForUser(body.project_id, userId)
      if (!existingProject || !existingProject.current_draft) {
        return NextResponse.json(
          { error: 'No existing content to regenerate' },
          { status: 400 }
        )
      }

      result = await regenerateContent(
        existingProject.current_draft,
        feedback || 'Improve the content while maintaining the voice profile',
        body.brief,
        body.voice_profile_id
      )
    } else {
      // Initial generation
      result = await generateContent(body.brief, body.voice_profile_id)
    }

    // Create or update project
    let projectId = body.project_id

    if (projectId) {
      // Update existing project
      const updated = await updateProject(
        projectId,
        userId,
        {
          title: body.brief.title,
          format: body.brief.format,
          audience: body.brief.audience,
          key_points: body.brief.key_points,
          additional_context: body.brief.additional_context,
          content_domain: body.brief.content_domain,
          voice_profile_id: body.voice_profile_id,
          current_draft: result.content,
          status: 'draft',
        },
        {
          changeSource: isRegenerate ? 'regenerated' : 'generated',
          changeSummary: isRegenerate
            ? feedback || 'Content regenerated'
            : 'Initial generation',
        }
      )

      if (!updated) {
        return NextResponse.json(
          { error: 'Failed to update project' },
          { status: 500 }
        )
      }
    } else {
      // Create new project
      const newProject = await createProject(userId, {
        brief: body.brief,
        voice_profile_id: body.voice_profile_id,
      })

      if (!newProject) {
        return NextResponse.json(
          { error: 'Failed to create project' },
          { status: 500 }
        )
      }

      projectId = newProject.id

      // Update with generated content
      await updateProject(
        projectId,
        userId,
        {
          current_draft: result.content,
          status: 'draft',
        },
        {
          changeSource: 'generated',
          changeSummary: 'Initial generation',
        }
      )
    }

    return NextResponse.json({
      project_id: projectId,
      version: 1, // Will be updated by the updateProject call
      draft: {
        content: result.content,
        word_count: result.wordCount,
      },
      voice_match: result.voiceMatch,
    }, { status: 201 })
  } catch (error) {
    console.error('Studio Content Generate error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate content',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

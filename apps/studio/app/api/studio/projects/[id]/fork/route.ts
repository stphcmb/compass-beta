import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { forkProject } from '@/lib/studio/projects/store'

/**
 * POST /api/studio/projects/[id]/fork
 * Fork/duplicate a project to create a new independent copy
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json().catch(() => ({}))
    const { newTitle } = body as { newTitle?: string }

    const forkedProject = await forkProject(id, userId, { newTitle })

    if (!forkedProject) {
      return NextResponse.json(
        { error: 'Failed to fork project. Project not found or access denied.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      project: forkedProject,
    })
  } catch (error) {
    console.error('Fork project error:', error)
    return NextResponse.json(
      { error: 'Failed to fork project' },
      { status: 500 }
    )
  }
}

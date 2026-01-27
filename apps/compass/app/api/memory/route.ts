/**
 * Editor Memory API
 *
 * CRUD operations for user's editor memory - the personalized context
 * that makes the AI editor feel like it knows the user.
 *
 * GET    /api/memory - List all memories for the authenticated user
 * POST   /api/memory - Create a new memory
 * PUT    /api/memory - Update an existing memory (requires id in body)
 * DELETE /api/memory - Delete a memory (requires id in query param)
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getEditorMemories,
  createEditorMemory,
  updateEditorMemory,
  deleteEditorMemory,
  getEditorMemoryStats,
  EditorMemoryType,
} from '@/lib/ai-editor'

/**
 * GET /api/memory
 *
 * Returns all memories for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check for stats-only request
    const { searchParams } = new URL(request.url)
    const statsOnly = searchParams.get('stats') === 'true'

    if (statsOnly) {
      const stats = await getEditorMemoryStats(userId)
      return NextResponse.json({ stats })
    }

    // Filter by type if specified
    const typeFilter = searchParams.get('type') as EditorMemoryType | null

    let memories = await getEditorMemories(userId)

    if (typeFilter) {
      memories = memories.filter((m) => m.memory_type === typeFilter)
    }

    return NextResponse.json({
      memories,
      count: memories.length,
    })
  } catch (error) {
    console.error('Error fetching editor memories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/memory
 *
 * Create a new memory for the authenticated user
 *
 * Body:
 * - memory_type: 'voice' | 'stance' | 'guideline' | 'sample_insight' | 'feedback_pattern'
 * - content: string (the natural language memory)
 * - source?: string (where this was learned from)
 * - confidence?: number (0-1)
 * - metadata?: object (additional context)
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body.memory_type || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: memory_type and content' },
        { status: 400 }
      )
    }

    // Validate memory type
    const validTypes: EditorMemoryType[] = [
      'voice',
      'stance',
      'guideline',
      'sample_insight',
      'feedback_pattern',
    ]
    if (!validTypes.includes(body.memory_type)) {
      return NextResponse.json(
        {
          error: `Invalid memory_type. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      )
    }

    const memory = await createEditorMemory({
      clerk_user_id: userId,
      memory_type: body.memory_type,
      content: body.content,
      source: body.source,
      confidence: body.confidence,
      metadata: body.metadata,
    })

    if (!memory) {
      return NextResponse.json(
        { error: 'Failed to create memory' },
        { status: 500 }
      )
    }

    return NextResponse.json({ memory }, { status: 201 })
  } catch (error) {
    console.error('Error creating editor memory:', error)
    return NextResponse.json(
      { error: 'Failed to create memory' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/memory
 *
 * Update an existing memory
 *
 * Body:
 * - id: string (required)
 * - content?: string
 * - confidence?: number
 * - metadata?: object
 */
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      )
    }

    // Build update object (only include provided fields)
    const updateData: { content?: string; confidence?: number; metadata?: Record<string, unknown> } = {}
    if (body.content !== undefined) updateData.content = body.content
    if (body.confidence !== undefined) updateData.confidence = body.confidence
    if (body.metadata !== undefined) updateData.metadata = body.metadata

    const memory = await updateEditorMemory(body.id, updateData)

    if (!memory) {
      return NextResponse.json(
        { error: 'Failed to update memory or memory not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ memory })
  } catch (error) {
    console.error('Error updating editor memory:', error)
    return NextResponse.json(
      { error: 'Failed to update memory' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/memory
 *
 * Delete a memory
 *
 * Query params:
 * - id: string (required)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required query parameter: id' },
        { status: 400 }
      )
    }

    const success = await deleteEditorMemory(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete memory or memory not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting editor memory:', error)
    return NextResponse.json(
      { error: 'Failed to delete memory' },
      { status: 500 }
    )
  }
}

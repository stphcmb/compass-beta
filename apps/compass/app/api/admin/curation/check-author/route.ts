import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { discoverSources, verifyPosition, fullCurationCheck } from '@/lib/curation/agents'

/**
 * POST /api/admin/curation/check-author
 *
 * Triggers a curation check for a specific author.
 * Can run source discovery, position verification, or both.
 */
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { authorId, checkType = 'full' } = body

    if (!authorId) {
      return NextResponse.json(
        { error: 'authorId is required' },
        { status: 400 }
      )
    }

    // Fetch author data
    // Note: position_summary may not exist as a column yet, so we don't select it
    const { data: author, error: authorError } = await supabase
      .from('authors')
      .select('id, name, header_affiliation, primary_affiliation, sources')
      .eq('id', authorId)
      .single()

    if (authorError || !author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      )
    }

    // Fetch author's camp assignments with position summaries
    const { data: campAssignments, error: campsError } = await supabase
      .from('camp_authors')
      .select(`
        why_it_matters,
        camps (
          label,
          description
        )
      `)
      .eq('author_id', authorId)

    if (campsError) {
      console.error('Error fetching camps:', campsError)
    }

    // Format existing sources
    const existingSources = (author.sources || []).map((src: any) => ({
      title: src.title || 'Untitled',
      url: src.url || '',
      year: src.year?.toString() || null,
      summary: src.summary || src.description || null
    }))

    // Format camp assignments with position summaries
    const camps = (campAssignments || [])
      .filter((ca: any) => ca.camps)
      .map((ca: any) => ({
        campName: ca.camps.label,
        campDescription: ca.camps.description || '',
        whyItMatters: ca.why_it_matters || ''
      }))

    // Combine all position summaries from camps
    // Each author has at least one position summary (why they believe/challenge certain things)
    const positionSummaries = camps
      .filter(c => c.whyItMatters)
      .map(c => `[${c.campName}] ${c.whyItMatters}`)

    const combinedPositionSummary = positionSummaries.length > 0
      ? positionSummaries.join('\n\n')
      : ''

    const affiliation = author.header_affiliation || author.primary_affiliation || null

    let result: any = {}

    if (checkType === 'sources') {
      // Only run source discovery
      result.sourceDiscovery = await discoverSources(
        author.id,
        author.name,
        affiliation,
        existingSources
      )
    } else if (checkType === 'position') {
      // Only run position verification
      // Skip position verification if no summary exists - go straight to source discovery
      if (!combinedPositionSummary || combinedPositionSummary.trim() === '') {
        result.positionVerification = {
          authorId: author.id,
          authorName: author.name,
          currentSummary: '',
          analysis: {
            aligned: false,
            shiftDetected: false,
            shiftSeverity: 'none' as const,
            shiftSummary: 'No position summary - skipping to source discovery',
            newTopics: [],
            suggestedUpdate: null,
            confidence: 'low' as const,
            reasoning: 'Author has no position summary yet. Finding sources first.'
          },
          status: 'needs_review' as const
        }
        // Auto-run source discovery
        result.sourceDiscovery = await discoverSources(
          author.id,
          author.name,
          affiliation,
          existingSources
        )
      } else {
        result.positionVerification = await verifyPosition(
          author.id,
          author.name,
          combinedPositionSummary,
          existingSources,
          camps
        )
      }
    } else {
      // Run full curation check
      result = await fullCurationCheck(
        author.id,
        author.name,
        affiliation,
        combinedPositionSummary,
        existingSources,
        camps
      )
    }

    // Store the result in curation_logs (if table exists)
    try {
      await supabase
        .from('curation_logs')
        .insert({
          author_id: authorId,
          check_type: checkType,
          result: result,
          created_at: new Date().toISOString()
        })
    } catch (logError) {
      // Table might not exist yet, that's okay
      console.log('Could not log curation result (table may not exist)')
    }

    return NextResponse.json({
      success: true,
      authorId,
      authorName: author.name,
      checkType,
      result
    })
  } catch (error) {
    console.error('Error in curation check:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to run curation check' },
      { status: 500 }
    )
  }
}

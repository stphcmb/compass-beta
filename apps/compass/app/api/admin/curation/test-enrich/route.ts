import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { enrichSourceDates } from '@/lib/curation/agents'

/**
 * POST /api/admin/curation/test-enrich
 *
 * Test endpoint to debug date enrichment for a single author
 */
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    const { authorId } = await request.json()

    if (!authorId) {
      return NextResponse.json(
        { error: 'authorId is required' },
        { status: 400 }
      )
    }

    // Fetch author with sources
    const { data: author, error: authorError } = await supabase
      .from('authors')
      .select('id, name, sources')
      .eq('id', authorId)
      .single()

    if (authorError || !author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      )
    }

    const sources = author.sources || []

    console.log('=== DEBUG TEST ENRICH ===')
    console.log('Author:', author.name)
    console.log('Total sources:', sources.length)
    console.log('First 3 sources:', JSON.stringify(sources.slice(0, 3), null, 2))

    // Run enrichment agent
    const enrichedDates = await enrichSourceDates(sources, author.name)

    console.log('Enriched dates returned:', enrichedDates.length)
    console.log('First 3 enriched:', JSON.stringify(enrichedDates.slice(0, 3), null, 2))

    // Try to match
    let matchCount = 0
    let lowConfidenceCount = 0
    let noDateCount = 0

    sources.forEach((source: any) => {
      const enriched = enrichedDates.find(e =>
        e.originalTitle === source.title ||
        e.originalTitle.trim().toLowerCase() === source.title.trim().toLowerCase()
      )

      if (enriched) {
        matchCount++
        if (enriched.confidence === 'low') lowConfidenceCount++
        if (!enriched.enrichedDate) noDateCount++
      }
    })

    return NextResponse.json({
      author: author.name,
      totalSources: sources.length,
      enrichedDatesReturned: enrichedDates.length,
      matchCount,
      lowConfidenceCount,
      noDateCount,
      sampleSources: sources.slice(0, 3),
      sampleEnriched: enrichedDates.slice(0, 3)
    })
  } catch (error) {
    console.error('Test enrich error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { enrichSourceDates } from '@/lib/curation/agents'

export const maxDuration = 60

/**
 * POST /api/admin/curation/enrich-dates
 *
 * Enriches source dates for an author using AI to extract dates from URLs,
 * conference info, ArXiv IDs, etc.
 *
 * Body: { authorId: string }
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

    if (sources.length === 0) {
      return NextResponse.json({
        authorId,
        authorName: author.name,
        enrichedCount: 0,
        results: [],
        message: 'No sources to enrich'
      })
    }

    // Run enrichment agent
    const enrichedDates = await enrichSourceDates(sources, author.name)

    console.log(`[${author.name}] Received ${enrichedDates.length} enriched dates`)

    // Update sources with enriched dates
    let enrichedCount = 0
    const updatedSources = sources.map((source: any) => {
      // Try exact match first, then fuzzy match (normalized)
      let enriched = enrichedDates.find(e => e.originalTitle === source.title)

      // If no exact match, try normalized match (trim whitespace, case-insensitive)
      if (!enriched) {
        const normalizedSourceTitle = source.title.trim().toLowerCase()
        enriched = enrichedDates.find(e =>
          e.originalTitle.trim().toLowerCase() === normalizedSourceTitle
        )
      }

      if (enriched) {
        console.log(`  Matched: "${source.title}" -> ${enriched.enrichedDate} (${enriched.confidence})`)
      }

      if (enriched && enriched.enrichedDate && enriched.confidence !== 'low') {
        enrichedCount++

        // Parse enriched date
        let published_date = null
        let year = null

        if (enriched.enrichedDate) {
          // Handle different date formats
          if (enriched.enrichedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // YYYY-MM-DD
            published_date = enriched.enrichedDate
            year = enriched.enrichedDate.substring(0, 4)
          } else if (enriched.enrichedDate.match(/^\d{4}-\d{2}$/)) {
            // YYYY-MM
            published_date = `${enriched.enrichedDate}-01`
            year = enriched.enrichedDate.substring(0, 4)
          } else if (enriched.enrichedDate.match(/^\d{4}$/)) {
            // YYYY
            year = enriched.enrichedDate
            published_date = `${enriched.enrichedDate}-01-01`
          }
        }

        return {
          ...source,
          published_date: published_date || source.published_date || source.date,
          year: year || source.year,
          date_enriched: true,
          date_enrichment_source: enriched.source,
          date_enrichment_confidence: enriched.confidence
        }
      }

      return source
    })

    // Update author in database
    const { error: updateError } = await supabase
      .from('authors')
      .update({ sources: updatedSources })
      .eq('id', authorId)

    if (updateError) {
      console.error('Error updating author sources:', updateError)
      return NextResponse.json(
        { error: 'Failed to update sources' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      authorId,
      authorName: author.name,
      totalSources: sources.length,
      enrichedCount,
      results: enrichedDates,
      message: `Enriched ${enrichedCount} of ${sources.length} sources`
    })
  } catch (error) {
    console.error('Error in enrich-dates API:', error)
    return NextResponse.json(
      { error: 'Failed to enrich source dates' },
      { status: 500 }
    )
  }
}

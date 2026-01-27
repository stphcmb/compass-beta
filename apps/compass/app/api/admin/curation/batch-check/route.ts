import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyPosition } from '@/lib/curation/agents'

export const maxDuration = 60 // Max 60 seconds for batch operations

/**
 * POST /api/admin/curation/batch-check
 *
 * Run position verification for multiple authors in parallel
 *
 * Body: { authorIds: string[] }
 */
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    const { authorIds } = await request.json()

    if (!Array.isArray(authorIds) || authorIds.length === 0) {
      return NextResponse.json(
        { error: 'authorIds must be a non-empty array' },
        { status: 400 }
      )
    }

    // Fetch author data for all requested authors with position summaries
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select(`
        id,
        name,
        header_affiliation,
        primary_affiliation,
        sources,
        camp_authors (
          why_it_matters,
          camps (
            label,
            description
          )
        )
      `)
      .in('id', authorIds)

    if (authorsError) throw authorsError

    if (!authors || authors.length === 0) {
      return NextResponse.json(
        { error: 'No authors found' },
        { status: 404 }
      )
    }

    // Run position verification in parallel for all authors
    const verificationPromises = authors.map(async (author) => {
      const sources = author.sources || []

      const recentSources = sources
        .map((src: any) => ({
          title: src.title || src.name || 'Untitled',
          year: src.year || src.published_date?.substring(0, 4) || src.date?.substring(0, 4),
          summary: src.summary || src.description || null
        }))
        .slice(0, 15)

      // Format camp assignments with position summaries
      const campAssignments = (author.camp_authors || [])
        .filter((ca: any) => ca.camps)
        .map((ca: any) => ({
          campName: ca.camps.label,
          campDescription: ca.camps.description || '',
          whyItMatters: ca.why_it_matters || ''
        }))

      // Combine all position summaries from camps
      const positionSummaries = campAssignments
        .filter(c => c.whyItMatters)
        .map(c => `[${c.campName}] ${c.whyItMatters}`)

      const positionSummary = positionSummaries.length > 0
        ? positionSummaries.join('\n\n')
        : ''

      try {
        // Skip position verification if no summary exists
        if (!positionSummary || positionSummary.trim() === '') {
          const skipResult = {
            authorId: author.id,
            authorName: author.name,
            currentSummary: '',
            analysis: {
              aligned: false,
              shiftDetected: false,
              shiftSeverity: 'none' as const,
              shiftSummary: 'No position summary - skipped verification',
              newTopics: [],
              suggestedUpdate: null,
              confidence: 'low' as const,
              reasoning: 'Author has no position summary yet. Skipped in batch check.'
            },
            status: 'needs_review' as const
          }

          return {
            authorId: author.id,
            authorName: author.name,
            affiliation: author.header_affiliation || author.primary_affiliation,
            success: true,
            result: skipResult,
            skipped: true
          }
        }

        const result = await verifyPosition(
          author.id,
          author.name,
          positionSummary,
          recentSources,
          campAssignments
        )

        return {
          authorId: author.id,
          authorName: author.name,
          affiliation: author.header_affiliation || author.primary_affiliation,
          success: true,
          result
        }
      } catch (error) {
        return {
          authorId: author.id,
          authorName: author.name,
          affiliation: author.header_affiliation || author.primary_affiliation,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    // Wait for all verifications to complete
    const results = await Promise.all(verificationPromises)

    // Calculate summary stats
    const summary = {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      driftDetected: results.filter(r => r.success && r.result?.status === 'drift_detected').length,
      needsReview: results.filter(r => r.success && r.result?.status === 'needs_review').length,
      verified: results.filter(r => r.success && r.result?.status === 'verified').length
    }

    return NextResponse.json({
      summary,
      results
    })
  } catch (error) {
    console.error('Error in batch-check API:', error)
    return NextResponse.json(
      { error: 'Failed to run batch position verification' },
      { status: 500 }
    )
  }
}

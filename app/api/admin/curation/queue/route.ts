import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/admin/curation/queue
 *
 * Returns a prioritized list of authors needing curation attention.
 * Considers both source staleness and position verification needs.
 */
export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    const now = new Date()

    // Fetch all authors with their sources and camp assignments
    // Note: last_curation_check, curation_status may not exist yet
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
            label
          )
        )
      `)

    if (authorsError) throw authorsError

    // Calculate staleness metrics for each author
    const authorMetrics = (authors || []).map(author => {
      const sources = author.sources || []

      // Find most recent source date - use timestamp to avoid TypeScript narrowing issues
      let mostRecentTimestamp = 0
      for (const src of sources) {
        let pubDate = src.published_date || src.date || src.publishedDate
        if (!pubDate && src.year) {
          pubDate = `${src.year}-01-01`
        }
        if (pubDate) {
          const date = new Date(pubDate)
          const timestamp = date.getTime()
          if (!isNaN(timestamp) && timestamp > mostRecentTimestamp) {
            mostRecentTimestamp = timestamp
          }
        }
      }

      const hasMostRecentSource = mostRecentTimestamp > 0
      const daysSinceLastSource = hasMostRecentSource
        ? Math.floor((now.getTime() - mostRecentTimestamp) / (1000 * 60 * 60 * 24))
        : null

      // These columns may not exist in the schema yet - handle gracefully
      const lastCurationCheckStr = (author as any).last_curation_check
      const lastCurationCheckTimestamp = lastCurationCheckStr ? new Date(lastCurationCheckStr).getTime() : 0

      const daysSinceLastCheck = lastCurationCheckTimestamp > 0
        ? Math.floor((now.getTime() - lastCurationCheckTimestamp) / (1000 * 60 * 60 * 24))
        : null

      // Check if author has position summaries (in camp_authors.why_it_matters)
      // Each author has at least one position summary per camp they belong to
      const hasPositionSummary = (author.camp_authors || [])
        .some((ca: any) => ca.why_it_matters && ca.why_it_matters.trim() !== '')

      // Get camp names
      const camps = (author.camp_authors || [])
        .filter((ca: any) => ca.camps)
        .map((ca: any) => ca.camps.label)

      // Calculate priority score (higher = more urgent)
      let priorityScore = 0
      let priorityReasons: string[] = []

      // No sources = highest priority
      if (sources.length === 0) {
        priorityScore += 100
        priorityReasons.push('No sources')
      }

      // Very stale sources (> 2 years)
      if (daysSinceLastSource && daysSinceLastSource > 730) {
        priorityScore += 80
        priorityReasons.push(`Sources ${Math.round(daysSinceLastSource / 365)} years old`)
      } else if (daysSinceLastSource && daysSinceLastSource > 365) {
        priorityScore += 50
        priorityReasons.push(`Sources ${Math.round(daysSinceLastSource / 30)} months old`)
      } else if (daysSinceLastSource && daysSinceLastSource > 180) {
        priorityScore += 30
        priorityReasons.push(`Sources ${Math.round(daysSinceLastSource / 30)} months old`)
      }

      // No position summary
      if (!hasPositionSummary) {
        priorityScore += 40
        priorityReasons.push('No position summary')
      }

      // Never been curated
      if (!lastCurationCheckStr) {
        priorityScore += 20
        priorityReasons.push('Never checked')
      } else if (daysSinceLastCheck && daysSinceLastCheck > 90) {
        priorityScore += 15
        priorityReasons.push(`Last check ${daysSinceLastCheck} days ago`)
      }

      // Boost priority for authors in many camps (more influential)
      if (camps.length >= 3) {
        priorityScore += 10
        priorityReasons.push(`In ${camps.length} camps`)
      }

      // Determine urgency level
      let urgency: 'critical' | 'high' | 'medium' | 'low' = 'low'
      if (priorityScore >= 100) urgency = 'critical'
      else if (priorityScore >= 60) urgency = 'high'
      else if (priorityScore >= 30) urgency = 'medium'

      return {
        id: author.id,
        name: author.name,
        affiliation: author.header_affiliation || author.primary_affiliation,
        sourceCount: sources.length,
        mostRecentSourceDate: hasMostRecentSource ? new Date(mostRecentTimestamp).toISOString().split('T')[0] : null,
        daysSinceLastSource,
        hasPositionSummary,
        lastCurationCheck: lastCurationCheckTimestamp > 0 ? new Date(lastCurationCheckTimestamp).toISOString().split('T')[0] : null,
        daysSinceLastCheck,
        curationStatus: (author as any).curation_status || 'pending',
        camps,
        priorityScore,
        priorityReasons,
        urgency
      }
    })

    // Sort by priority score (highest first)
    const sortedByPriority = [...authorMetrics].sort((a, b) => b.priorityScore - a.priorityScore)

    // Group by urgency
    const byUrgency = {
      critical: sortedByPriority.filter(a => a.urgency === 'critical'),
      high: sortedByPriority.filter(a => a.urgency === 'high'),
      medium: sortedByPriority.filter(a => a.urgency === 'medium'),
      low: sortedByPriority.filter(a => a.urgency === 'low')
    }

    // Summary stats
    const summary = {
      total: authorMetrics.length,
      critical: byUrgency.critical.length,
      high: byUrgency.high.length,
      medium: byUrgency.medium.length,
      low: byUrgency.low.length,
      withoutSources: authorMetrics.filter(a => a.sourceCount === 0).length,
      withoutPositionSummary: authorMetrics.filter(a => !a.hasPositionSummary).length,
      neverChecked: authorMetrics.filter(a => !a.lastCurationCheck).length
    }

    return NextResponse.json({
      summary,
      queue: sortedByPriority.slice(0, 50), // Top 50 needing attention
      byUrgency: {
        critical: byUrgency.critical.slice(0, 20),
        high: byUrgency.high.slice(0, 20),
        medium: byUrgency.medium.slice(0, 20)
      }
    })
  } catch (error) {
    console.error('Error in curation queue API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch curation queue' },
      { status: 500 }
    )
  }
}

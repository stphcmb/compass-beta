import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { supabase } from '@/lib/supabase'

// Types for database function returns
interface CurationQueueItem {
  id: string
  name: string
  affiliation: string | null
  source_count: number
  most_recent_date: string | null
  days_since_update: number | null
  has_position_summary: boolean
  camps: string[]
  priority_score: number
  urgency: string
}

interface CurationSummary {
  total: number
  critical: number
  high: number
  medium: number
  low: number
  without_sources: number
  without_position_summary: number
}

/**
 * GET /api/admin/curation/queue
 *
 * Returns a prioritized list of authors needing curation attention.
 * Considers both source staleness and position verification needs.
 */

// Cached data fetcher - revalidates every 5 minutes
const getCurationQueueMetrics = unstable_cache(
  async () => {
    if (!supabase) {
      throw new Error('Database not configured')
    }

    // Parallel fetch queue and summary using database functions
    const [queueResult, summaryResult] = await Promise.all([
      supabase.rpc('get_curation_queue', { p_limit: 50 }),
      supabase.rpc('get_curation_summary')
    ])

    if (queueResult.error) {
      console.error('Error fetching curation queue:', queueResult.error)
      throw queueResult.error
    }

    if (summaryResult.error) {
      console.error('Error fetching curation summary:', summaryResult.error)
      throw summaryResult.error
    }

    const queue = (queueResult.data || []) as CurationQueueItem[]
    const summaryData = (summaryResult.data || [])[0] as CurationSummary | undefined

    // Default summary if function returns empty
    const summary = summaryData || {
      total: queue.length,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      without_sources: 0,
      without_position_summary: 0
    }

    // Group by urgency
    const byUrgency = {
      critical: queue.filter(a => a.urgency === 'critical').slice(0, 20),
      high: queue.filter(a => a.urgency === 'high').slice(0, 20),
      medium: queue.filter(a => a.urgency === 'medium').slice(0, 20)
    }

    // Format response to match existing API contract
    return {
      summary: {
        total: summary.total,
        critical: summary.critical,
        high: summary.high,
        medium: summary.medium,
        low: summary.low,
        withoutSources: summary.without_sources,
        withoutPositionSummary: summary.without_position_summary,
        neverChecked: summary.total // All authors in this simplified view
      },
      queue: queue.map(item => ({
        id: item.id,
        name: item.name,
        affiliation: item.affiliation,
        sourceCount: item.source_count,
        mostRecentSourceDate: item.most_recent_date,
        daysSinceLastSource: item.days_since_update,
        hasPositionSummary: item.has_position_summary,
        lastCurationCheck: null, // Not tracked in simplified schema
        daysSinceLastCheck: null,
        curationStatus: 'pending',
        camps: item.camps,
        priorityScore: item.priority_score,
        priorityReasons: getPriorityReasons(item),
        urgency: item.urgency
      })),
      byUrgency: {
        critical: byUrgency.critical.map(formatQueueItem),
        high: byUrgency.high.map(formatQueueItem),
        medium: byUrgency.medium.map(formatQueueItem)
      }
    }
  },
  ['curation-queue-metrics'],
  {
    revalidate: 300, // 5 minutes
    tags: ['admin-metrics', 'curation-queue']
  }
)

// Helper to format queue items for response
function formatQueueItem(item: CurationQueueItem) {
  return {
    id: item.id,
    name: item.name,
    affiliation: item.affiliation,
    sourceCount: item.source_count,
    mostRecentSourceDate: item.most_recent_date,
    daysSinceLastSource: item.days_since_update,
    hasPositionSummary: item.has_position_summary,
    lastCurationCheck: null,
    daysSinceLastCheck: null,
    curationStatus: 'pending',
    camps: item.camps,
    priorityScore: item.priority_score,
    priorityReasons: getPriorityReasons(item),
    urgency: item.urgency
  }
}

// Generate priority reasons from item data
function getPriorityReasons(item: CurationQueueItem): string[] {
  const reasons: string[] = []

  if (item.source_count === 0) {
    reasons.push('No sources')
  }

  if (item.days_since_update !== null) {
    if (item.days_since_update > 730) {
      reasons.push(`Sources ${Math.round(item.days_since_update / 365)} years old`)
    } else if (item.days_since_update > 365) {
      reasons.push(`Sources ${Math.round(item.days_since_update / 30)} months old`)
    } else if (item.days_since_update > 180) {
      reasons.push(`Sources ${Math.round(item.days_since_update / 30)} months old`)
    }
  }

  if (!item.has_position_summary) {
    reasons.push('No position summary')
  }

  if (item.camps.length >= 3) {
    reasons.push(`In ${item.camps.length} camps`)
  }

  return reasons
}

// Fallback to original implementation if database functions don't exist yet
async function getCurationQueueMetricsFallback() {
  if (!supabase) {
    throw new Error('Database not configured')
  }

  const now = new Date()

  // Fetch all authors with their sources and camp assignments
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

    // Find most recent source date
    let mostRecentTimestamp = 0
    for (const src of sources) {
      let pubDate = (src as { published_date?: string; date?: string; publishedDate?: string; year?: number }).published_date ||
                   (src as { date?: string }).date ||
                   (src as { publishedDate?: string }).publishedDate
      if (!pubDate && (src as { year?: number }).year) {
        pubDate = `${(src as { year: number }).year}-01-01`
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

    // Check if author has position summaries
    const campAuthors = (author.camp_authors || []) as Array<{
      why_it_matters?: string | null
      camps?: { label: string } | { label: string }[] | null
    }>
    const hasPositionSummary = campAuthors
      .some((ca) => ca.why_it_matters && ca.why_it_matters.trim() !== '')

    // Get camp names - handle both single object and array responses from Supabase
    const camps = campAuthors
      .filter((ca) => ca.camps)
      .map((ca) => {
        const campsData = ca.camps
        if (Array.isArray(campsData)) {
          return campsData[0]?.label
        }
        return campsData?.label
      })
      .filter((label): label is string => typeof label === 'string')

    // Calculate priority score
    let priorityScore = 0
    const priorityReasons: string[] = []

    if (sources.length === 0) {
      priorityScore += 100
      priorityReasons.push('No sources')
    }

    if (daysSinceLastSource !== null) {
      if (daysSinceLastSource > 730) {
        priorityScore += 80
        priorityReasons.push(`Sources ${Math.round(daysSinceLastSource / 365)} years old`)
      } else if (daysSinceLastSource > 365) {
        priorityScore += 50
        priorityReasons.push(`Sources ${Math.round(daysSinceLastSource / 30)} months old`)
      } else if (daysSinceLastSource > 180) {
        priorityScore += 30
        priorityReasons.push(`Sources ${Math.round(daysSinceLastSource / 30)} months old`)
      }
    }

    if (!hasPositionSummary) {
      priorityScore += 40
      priorityReasons.push('No position summary')
    }

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
      lastCurationCheck: null,
      daysSinceLastCheck: null,
      curationStatus: 'pending',
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

  return {
    summary,
    queue: sortedByPriority.slice(0, 50),
    byUrgency: {
      critical: byUrgency.critical.slice(0, 20),
      high: byUrgency.high.slice(0, 20),
      medium: byUrgency.medium.slice(0, 20)
    }
  }
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    // Try optimized path first (uses database functions)
    const metrics = await getCurationQueueMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    // Check if it's a "function does not exist" error (migration not applied yet)
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('does not exist') || errorMessage.includes('could not find')) {
      console.warn('Curation queue functions not found, falling back to original implementation')
      try {
        const metrics = await getCurationQueueMetricsFallback()
        return NextResponse.json(metrics)
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
        return NextResponse.json(
          { error: 'Failed to fetch curation queue' },
          { status: 500 }
        )
      }
    }

    console.error('Error in curation queue API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch curation queue' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { supabase } from '@/lib/supabase'

// Domain ID to name mapping
const DOMAIN_MAP: Record<number, string> = {
  1: 'AI Technical Capabilities',
  2: 'AI & Society',
  3: 'Enterprise AI Adoption',
  4: 'AI Governance & Oversight',
  5: 'Future of Work'
}

// Types for database function returns
interface SummaryMetrics {
  total_authors: number
  authors_with_sources: number
  authors_without_sources: number
  total_sources: number
  sources_from_table: number
  sources_from_jsonb: number
  current_count: number
  moderate_count: number
  stale_count: number
  no_date_count: number
  specific_date_sources: number
  year_only_sources: number
  generic_sources: number
  oldest_source_date: string | null
  newest_source_date: string | null
  days_since_newest: number | null
  avg_days_since_update: number | null
  computed_at: string
}

interface StalestAuthor {
  id: string
  name: string
  affiliation: string | null
  source_count: number
  most_recent_date: string | null
  days_since_update: number | null
}

interface StalestCamp {
  id: string
  name: string
  domain_id: number
  author_count: number
  source_count: number
  most_recent_date: string | null
  days_since_update: number | null
}

interface DomainBreakdown {
  domain: string
  camp_count: number
  author_count: number
  source_count: number
  avg_days_since_update: number | null
}

// Cached data fetcher - revalidates every 5 minutes
const getCanonHealthMetrics = unstable_cache(
  async () => {
    if (!supabase) {
      throw new Error('Database not configured')
    }

    // Parallel fetch all metrics using database functions
    const [summaryResult, stalestAuthorsResult, stalestCampsResult, domainBreakdownResult] = await Promise.all([
      supabase.from('mv_admin_summary_metrics').select('*').single(),
      supabase.rpc('get_stalest_authors', { p_limit: 15 }),
      supabase.rpc('get_stalest_camps', { p_limit: 10 }),
      supabase.rpc('get_domain_breakdown')
    ])

    // Handle errors
    if (summaryResult.error) {
      console.error('Error fetching summary metrics:', summaryResult.error)
      throw summaryResult.error
    }

    const summary = summaryResult.data as SummaryMetrics
    const stalestAuthors = (stalestAuthorsResult.data || []) as StalestAuthor[]
    const stalestCamps = (stalestCampsResult.data || []) as StalestCamp[]
    const domainBreakdown = (domainBreakdownResult.data || []) as DomainBreakdown[]

    // Format response to match existing API contract
    return {
      totalAuthors: summary.total_authors,
      totalCamps: stalestCamps.length > 0 ? stalestCamps.length : 0,
      totalSources: summary.total_sources,
      authorsWithSources: summary.authors_with_sources,
      authorsWithoutSources: summary.authors_without_sources,
      coverageByAge: {
        current: summary.current_count,
        moderate: summary.moderate_count,
        stale: summary.stale_count,
        noDate: summary.no_date_count
      },
      sourceQuality: {
        specificDates: summary.specific_date_sources,
        yearOnly: summary.year_only_sources,
        noDate: summary.no_date_count,
        generic: summary.generic_sources,
        dateQualityPercent: summary.total_sources > 0
          ? ((summary.specific_date_sources / summary.total_sources) * 100).toFixed(1) + '%'
          : 'N/A'
      },
      sourceDateRange: {
        oldestDate: summary.oldest_source_date,
        newestDate: summary.newest_source_date,
        daysSinceNewest: summary.days_since_newest,
        sourcesFromTable: summary.sources_from_table,
        sourcesFromAuthors: summary.sources_from_jsonb
      },
      stalestCamps: stalestCamps.map(camp => ({
        id: camp.id,
        name: camp.name,
        domain: DOMAIN_MAP[camp.domain_id] || 'Unknown',
        authorCount: camp.author_count,
        sourceCount: camp.source_count,
        mostRecentDate: camp.most_recent_date,
        daysSinceUpdate: camp.days_since_update
      })),
      stalestAuthors: stalestAuthors.map(author => ({
        id: author.id,
        name: author.name,
        affiliation: author.affiliation,
        sourceCount: author.source_count,
        mostRecentDate: author.most_recent_date,
        daysSinceUpdate: author.days_since_update
      })),
      domainBreakdown: domainBreakdown.map(d => ({
        domain: d.domain,
        campCount: d.camp_count,
        authorCount: d.author_count,
        sourceCount: d.source_count,
        avgDaysSinceUpdate: d.avg_days_since_update
      })),
      // Cache metadata
      cachedAt: summary.computed_at
    }
  },
  ['canon-health-metrics'],
  {
    revalidate: 300, // 5 minutes
    tags: ['admin-metrics', 'canon-health']
  }
)

// Fallback to original implementation if database functions don't exist yet
// NOTE: Sources are stored only in authors.sources JSONB (no separate sources table)
async function getCanonHealthMetricsFallback() {
  if (!supabase) {
    throw new Error('Database not configured')
  }

  const now = new Date()

  // Fetch all authors with their inline sources
  const { data: authors, error: authorsError } = await supabase
    .from('authors')
    .select('id, name, header_affiliation, primary_affiliation, sources')

  if (authorsError) {
    console.error('Error fetching authors:', authorsError)
    throw authorsError
  }

  // Fetch all camps with their domain
  const { data: camps, error: campsError } = await supabase
    .from('camps')
    .select(`
      id,
      label,
      domain_id,
      camp_authors (
        author_id
      )
    `)

  if (campsError) {
    console.error('Error fetching camps:', campsError)
    throw campsError
  }

  // Calculate metrics from authors.sources JSONB only
  let oldestTimestamp = Infinity
  let newestTimestamp = 0
  let totalSourceCount = 0

  const coverageByAge = { current: 0, moderate: 0, stale: 0, noDate: 0 }
  let sourcesWithSpecificDates = 0
  let sourcesWithYearOnly = 0
  let genericSources = 0

  // Build author sources map from JSONB sources
  const authorSourcesMap = new Map<string, { sources: Array<Record<string, unknown>>, mostRecent: Date | null }>()

  authors?.forEach(author => {
    const sources = (author.sources || []) as Array<{ published_date?: string; date?: string; publishedDate?: string; year?: number; title?: string; url?: string }>
    const existing = { sources: sources as Array<Record<string, unknown>>, mostRecent: null as Date | null }
    totalSourceCount += sources.length

    sources.forEach((src) => {
      let pubDate = src.published_date || src.date || src.publishedDate
      if (!pubDate && src.year) {
        pubDate = `${src.year}-01-01`
      }

      if (!pubDate) {
        coverageByAge.noDate++
      } else {
        const date = new Date(pubDate)
        if (!isNaN(date.getTime())) {
          const pubDateStr = String(pubDate)
          if (pubDateStr.match(/^\d{4}$/) || pubDateStr.match(/^\d{4}-01-01$/)) {
            sourcesWithYearOnly++
          } else if (pubDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            sourcesWithSpecificDates++
          }

          if (!existing.mostRecent || date > existing.mostRecent) {
            existing.mostRecent = date
          }
          const dateTimestamp = date.getTime()
          if (dateTimestamp < oldestTimestamp) oldestTimestamp = dateTimestamp
          if (dateTimestamp > newestTimestamp) newestTimestamp = dateTimestamp

          const daysSince = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
          if (daysSince < 90) coverageByAge.current++
          else if (daysSince < 180) coverageByAge.moderate++
          else coverageByAge.stale++
        } else {
          coverageByAge.noDate++
        }
      }

      const title = String(src.title || '')
      const url = String(src.url || '')
      const isGeneric =
        title.toLowerCase().includes('channel') ||
        title.toLowerCase().includes('homepage') ||
        title.toLowerCase().includes('website') ||
        title.toLowerCase().includes('profile') ||
        url.includes('youtube.com/@') ||
        url.includes('youtube.com/channel/') ||
        url.match(/^https?:\/\/[^\/]+\/?$/)
      if (isGeneric) genericSources++
    })

    authorSourcesMap.set(author.id, existing)
  })

  let authorsWithSources = 0
  let authorsWithoutSources = 0

  authors?.forEach(author => {
    const authorData = authorSourcesMap.get(author.id)
    if (authorData && authorData.sources.length > 0) {
      authorsWithSources++
    } else {
      authorsWithoutSources++
    }
  })

  // Calculate stalest authors
  const authorStaleness = (authors || []).map(author => {
    const authorData = authorSourcesMap.get(author.id)
    const sourceCount = authorData?.sources.length || 0
    const mostRecentDate = authorData?.mostRecent
    const daysSinceUpdate = mostRecentDate
      ? Math.floor((now.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24))
      : null

    return {
      id: author.id,
      name: author.name,
      affiliation: author.header_affiliation || author.primary_affiliation,
      sourceCount,
      mostRecentDate: mostRecentDate?.toISOString().split('T')[0] || null,
      daysSinceUpdate
    }
  })
  .sort((a, b) => {
    if (a.daysSinceUpdate === null && b.daysSinceUpdate === null) return 0
    if (a.daysSinceUpdate === null) return -1
    if (b.daysSinceUpdate === null) return 1
    return b.daysSinceUpdate - a.daysSinceUpdate
  })
  .slice(0, 15)

  // Calculate camp staleness
  const campStaleness = (camps || []).map(camp => {
    const campAuthorIds = camp.camp_authors?.map((ca: { author_id: string }) => ca.author_id) || []

    let totalSources = 0
    let mostRecentTimestamp = 0

    for (const authorId of campAuthorIds) {
      const authorData = authorSourcesMap.get(authorId)
      if (authorData) {
        totalSources += authorData.sources.length
        if (authorData.mostRecent) {
          const timestamp = authorData.mostRecent.getTime()
          if (timestamp > mostRecentTimestamp) {
            mostRecentTimestamp = timestamp
          }
        }
      }
    }

    const hasMostRecent = mostRecentTimestamp > 0
    const daysSinceUpdate = hasMostRecent
      ? Math.floor((now.getTime() - mostRecentTimestamp) / (1000 * 60 * 60 * 24))
      : null

    return {
      id: camp.id,
      name: camp.label,
      domain: DOMAIN_MAP[camp.domain_id] || 'Unknown',
      authorCount: campAuthorIds.length,
      sourceCount: totalSources,
      mostRecentDate: hasMostRecent ? new Date(mostRecentTimestamp).toISOString().split('T')[0] : null,
      daysSinceUpdate
    }
  })
  .sort((a, b) => {
    if (a.daysSinceUpdate === null && b.daysSinceUpdate === null) {
      return b.authorCount - a.authorCount
    }
    if (a.daysSinceUpdate === null) return -1
    if (b.daysSinceUpdate === null) return 1
    return b.daysSinceUpdate - a.daysSinceUpdate
  })
  .slice(0, 10)

  // Calculate domain breakdown
  const domainStats = new Map<string, {
    campCount: number
    authorIds: Set<string>
    sourceCount: number
    totalDays: number
    sourcesWithDate: number
  }>()

  Object.values(DOMAIN_MAP).forEach(domain => {
    domainStats.set(domain, {
      campCount: 0,
      authorIds: new Set(),
      sourceCount: 0,
      totalDays: 0,
      sourcesWithDate: 0
    })
  })

  camps?.forEach(camp => {
    const domain = DOMAIN_MAP[camp.domain_id] || 'Unknown'
    const stats = domainStats.get(domain) || {
      campCount: 0,
      authorIds: new Set(),
      sourceCount: 0,
      totalDays: 0,
      sourcesWithDate: 0
    }

    stats.campCount++

    camp.camp_authors?.forEach((ca: { author_id: string }) => {
      stats.authorIds.add(ca.author_id)
      const authorData = authorSourcesMap.get(ca.author_id)
      if (authorData) {
        stats.sourceCount += authorData.sources.length
        if (authorData.mostRecent) {
          const days = Math.floor((now.getTime() - authorData.mostRecent.getTime()) / (1000 * 60 * 60 * 24))
          stats.totalDays += days
          stats.sourcesWithDate++
        }
      }
    })

    domainStats.set(domain, stats)
  })

  const domainBreakdown = Array.from(domainStats.entries())
    .map(([domain, stats]) => ({
      domain,
      campCount: stats.campCount,
      authorCount: stats.authorIds.size,
      sourceCount: stats.sourceCount,
      avgDaysSinceUpdate: stats.sourcesWithDate > 0
        ? Math.round(stats.totalDays / stats.sourcesWithDate)
        : null
    }))
    .filter(d => d.campCount > 0)
    .sort((a, b) => (b.avgDaysSinceUpdate || 999) - (a.avgDaysSinceUpdate || 999))

  const hasOldestDate = oldestTimestamp !== Infinity
  const hasNewestDate = newestTimestamp > 0
  const daysSinceNewest = hasNewestDate
    ? Math.floor((now.getTime() - newestTimestamp) / (1000 * 60 * 60 * 24))
    : null

  return {
    totalAuthors: authors?.length || 0,
    totalCamps: camps?.length || 0,
    totalSources: totalSourceCount,
    authorsWithSources,
    authorsWithoutSources,
    coverageByAge,
    sourceQuality: {
      specificDates: sourcesWithSpecificDates,
      yearOnly: sourcesWithYearOnly,
      noDate: coverageByAge.noDate,
      generic: genericSources,
      dateQualityPercent: totalSourceCount > 0
        ? ((sourcesWithSpecificDates / totalSourceCount) * 100).toFixed(1) + '%'
        : 'N/A'
    },
    sourceDateRange: {
      oldestDate: hasOldestDate ? new Date(oldestTimestamp).toISOString().split('T')[0] : null,
      newestDate: hasNewestDate ? new Date(newestTimestamp).toISOString().split('T')[0] : null,
      daysSinceNewest,
      sourcesFromTable: 0,
      sourcesFromAuthors: totalSourceCount
    },
    stalestCamps: campStaleness,
    stalestAuthors: authorStaleness,
    domainBreakdown
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
    // Try optimized path first (uses materialized view + functions)
    const metrics = await getCanonHealthMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    // Check if it's a "relation does not exist" error (migration not applied yet)
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('does not exist') || errorMessage.includes('could not find')) {
      console.warn('Admin metrics views not found, falling back to original implementation')
      try {
        const metrics = await getCanonHealthMetricsFallback()
        return NextResponse.json(metrics)
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
        return NextResponse.json(
          { error: 'Failed to fetch canon health metrics' },
          { status: 500 }
        )
      }
    }

    console.error('Error in canon-health API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch canon health metrics' },
      { status: 500 }
    )
  }
}

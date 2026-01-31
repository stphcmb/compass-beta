import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { supabase } from '@/lib/supabase'

// Topics that are known to be fast-moving (evolve quickly, need frequent updates)
const FAST_MOVING_TOPICS = [
  'ai agents',
  'multimodal',
  'reasoning',
  'open source',
  'frontier models',
  'llm',
  'gpt',
  'claude',
  'gemini',
  'alignment',
  'agi',
  'superintelligence',
  'regulation',
  'safety',
]

// Types for database function returns
interface TopicCoverage {
  id: string
  topic: string
  domain_id: number
  author_count: number
  source_count: number
  most_recent_date: string | null
  days_since_most_recent: number | null
  avg_days_since_update: number | null
}

// Calculate coverage strength
function calculateCoverageStrength(
  authorCount: number,
  sourceCount: number,
  avgDaysSinceUpdate: number | null,
  isFastMoving: boolean
): { level: 'strong' | 'moderate' | 'weak' | 'none'; score: number } {
  if (authorCount === 0) return { level: 'none', score: 0 }

  let score = 0

  // Author count contribution (0-40 points)
  if (authorCount >= 10) score += 40
  else if (authorCount >= 5) score += 30
  else if (authorCount >= 3) score += 20
  else score += 10

  // Source count contribution (0-30 points)
  if (sourceCount >= 20) score += 30
  else if (sourceCount >= 10) score += 20
  else if (sourceCount >= 5) score += 15
  else if (sourceCount > 0) score += 5

  // Freshness contribution (0-30 points)
  if (avgDaysSinceUpdate === null) {
    score += 0 // No data = can't assess
  } else if (isFastMoving) {
    // Fast-moving topics need fresher sources
    if (avgDaysSinceUpdate < 60) score += 30
    else if (avgDaysSinceUpdate < 120) score += 20
    else if (avgDaysSinceUpdate < 180) score += 10
    else score += 0
  } else {
    // Regular topics can be slightly older
    if (avgDaysSinceUpdate < 90) score += 30
    else if (avgDaysSinceUpdate < 180) score += 20
    else if (avgDaysSinceUpdate < 365) score += 10
    else score += 0
  }

  if (score >= 70) return { level: 'strong', score }
  if (score >= 45) return { level: 'moderate', score }
  if (score > 0) return { level: 'weak', score }
  return { level: 'none', score }
}

// Generate insight message based on coverage
function generateInsight(
  topic: string,
  coverage: { level: string; score: number },
  avgDaysSinceUpdate: number | null,
  isFastMoving: boolean,
  authorCount: number,
  totalAuthors: number
): string {
  const coveragePct = Math.round((authorCount / totalAuthors) * 100)

  if (coverage.level === 'none') {
    return `No authors currently cover "${topic}". Consider adding experts in this area.`
  }

  if (coverage.level === 'weak') {
    if (authorCount < 3) {
      return `Only ${authorCount} author${authorCount === 1 ? '' : 's'} cover${authorCount === 1 ? 's' : ''} this topic (${coveragePct}% of canon). Analysis may lack diverse perspectives.`
    }
    if (avgDaysSinceUpdate && avgDaysSinceUpdate > 180) {
      return `Coverage is ${Math.round(avgDaysSinceUpdate / 30)} months old. ${isFastMoving ? 'This is a fast-moving topic - our canon may not reflect latest developments.' : 'Consider refreshing sources.'}`
    }
    return `Limited coverage. Treat analysis as directional rather than comprehensive.`
  }

  if (coverage.level === 'moderate') {
    if (isFastMoving && avgDaysSinceUpdate && avgDaysSinceUpdate > 90) {
      return `This is a fast-moving topic. Our canon may not reflect the latest developments (last update: ${Math.round(avgDaysSinceUpdate / 30)} months ago). Treat analysis as directional.`
    }
    if (authorCount < 5) {
      return `${authorCount} authors cover this topic. Good for general direction but may miss niche perspectives.`
    }
    return `Decent coverage from ${authorCount} authors. Analysis should be reliable for mainstream viewpoints.`
  }

  // Strong coverage
  if (isFastMoving && avgDaysSinceUpdate && avgDaysSinceUpdate < 60) {
    return `Strong, up-to-date coverage from ${authorCount} authors. Analysis reflects current discourse.`
  }
  return `Well-covered topic with ${authorCount} authors and recent sources. High confidence in analysis.`
}

// Cached data fetcher - revalidates every 5 minutes
const getTopicCoverageMetrics = unstable_cache(
  async () => {
    if (!supabase) {
      throw new Error('Database not configured')
    }

    // Fetch topic coverage using database function
    const { data: topics, error } = await supabase.rpc('get_topic_coverage')

    if (error) {
      console.error('Error fetching topic coverage:', error)
      throw error
    }

    // Get total author count for percentage calculations
    const { count: totalAuthors } = await supabase
      .from('authors')
      .select('*', { count: 'exact', head: true })

    const topicData = (topics || []) as TopicCoverage[]
    const authorTotal = totalAuthors || 0

    // Process topics with coverage calculations
    const topicCoverage = topicData.map(topic => {
      const topicLower = topic.topic.toLowerCase()
      const isFastMoving = FAST_MOVING_TOPICS.some(ft => topicLower.includes(ft))

      const coverage = calculateCoverageStrength(
        topic.author_count,
        topic.source_count,
        topic.days_since_most_recent,
        isFastMoving
      )

      const insight = generateInsight(
        topic.topic,
        coverage,
        topic.days_since_most_recent,
        isFastMoving,
        topic.author_count,
        authorTotal
      )

      return {
        id: topic.id,
        topic: topic.topic,
        domainId: topic.domain_id,
        authorCount: topic.author_count,
        totalAuthors: authorTotal,
        sourceCount: topic.source_count,
        mostRecentDate: topic.most_recent_date,
        daysSinceMostRecent: topic.days_since_most_recent,
        avgDaysSinceUpdate: topic.avg_days_since_update,
        isFastMoving,
        coverage,
        insight,
      }
    })

    // Sort by coverage score (weakest first for admin attention)
    const sortedByNeed = [...topicCoverage].sort((a, b) => a.coverage.score - b.coverage.score)

    // Group by coverage level
    const summary = {
      strong: topicCoverage.filter(t => t.coverage.level === 'strong').length,
      moderate: topicCoverage.filter(t => t.coverage.level === 'moderate').length,
      weak: topicCoverage.filter(t => t.coverage.level === 'weak').length,
      none: topicCoverage.filter(t => t.coverage.level === 'none').length,
    }

    // Fast-moving topics that need attention
    const fastMovingNeedingAttention = topicCoverage
      .filter(t => t.isFastMoving && (t.coverage.level === 'weak' || t.coverage.level === 'moderate'))
      .sort((a, b) => (a.daysSinceMostRecent || 999) - (b.daysSinceMostRecent || 999))

    return {
      summary,
      topicsNeedingAttention: sortedByNeed.slice(0, 10),
      fastMovingTopics: fastMovingNeedingAttention.slice(0, 5),
      allTopics: topicCoverage,
    }
  },
  ['topic-coverage-metrics'],
  {
    revalidate: 300, // 5 minutes
    tags: ['admin-metrics', 'topic-coverage']
  }
)

// Fallback to original implementation if database function doesn't exist yet
// NOTE: Sources are stored only in authors.sources JSONB (no separate sources table)
async function getTopicCoverageMetricsFallback() {
  if (!supabase) {
    throw new Error('Database not configured')
  }

  const now = new Date()

  // Fetch camps with their authors and domain
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

  if (campsError) throw campsError

  // Fetch authors with their JSONB sources
  const { data: authors, error: authorsError } = await supabase
    .from('authors')
    .select('id, sources')

  if (authorsError) throw authorsError

  const totalAuthors = authors?.length || 0

  // Build author sources map from JSONB sources only
  const authorSourcesMap = new Map<string, { count: number; mostRecent: Date | null }>()

  authors?.forEach(author => {
    const sources = (author.sources || []) as Array<{ published_date?: string; date?: string; publishedDate?: string; year?: number }>
    const existing = { count: sources.length, mostRecent: null as Date | null }

    sources.forEach((src) => {
      let pubDate = src.published_date || src.date || src.publishedDate
      if (!pubDate && src.year) {
        pubDate = `${src.year}-01-01`
      }
      if (pubDate) {
        const date = new Date(pubDate)
        if (!isNaN(date.getTime())) {
          if (!existing.mostRecent || date > existing.mostRecent) {
            existing.mostRecent = date
          }
        }
      }
    })

    authorSourcesMap.set(author.id, existing)
  })

  // Calculate topic coverage for each camp
  const topicCoverage = (camps || []).map(camp => {
    const campAuthorIds = camp.camp_authors?.map((ca: { author_id: string }) => ca.author_id) || []
    const authorCount = campAuthorIds.length

    let totalSources = 0
    let mostRecentTimestamp = 0
    let totalDays = 0
    let authorsWithDates = 0

    for (const authorId of campAuthorIds) {
      const authorData = authorSourcesMap.get(authorId)
      if (authorData) {
        totalSources += authorData.count
        if (authorData.mostRecent) {
          const timestamp = authorData.mostRecent.getTime()
          if (timestamp > mostRecentTimestamp) {
            mostRecentTimestamp = timestamp
          }
          const days = Math.floor((now.getTime() - timestamp) / (1000 * 60 * 60 * 24))
          totalDays += days
          authorsWithDates++
        }
      }
    }

    const hasMostRecent = mostRecentTimestamp > 0
    const avgDaysSinceUpdate = authorsWithDates > 0 ? Math.round(totalDays / authorsWithDates) : null
    const daysSinceMostRecent = hasMostRecent
      ? Math.floor((now.getTime() - mostRecentTimestamp) / (1000 * 60 * 60 * 24))
      : null

    const topicLower = camp.label.toLowerCase()
    const isFastMoving = FAST_MOVING_TOPICS.some(ft => topicLower.includes(ft))

    const coverage = calculateCoverageStrength(
      authorCount,
      totalSources,
      daysSinceMostRecent,
      isFastMoving
    )

    const insight = generateInsight(
      camp.label,
      coverage,
      daysSinceMostRecent,
      isFastMoving,
      authorCount,
      totalAuthors
    )

    return {
      id: camp.id,
      topic: camp.label,
      domainId: camp.domain_id,
      authorCount,
      totalAuthors,
      sourceCount: totalSources,
      mostRecentDate: hasMostRecent ? new Date(mostRecentTimestamp).toISOString().split('T')[0] : null,
      daysSinceMostRecent,
      avgDaysSinceUpdate,
      isFastMoving,
      coverage,
      insight,
    }
  })

  // Sort by coverage score (weakest first)
  const sortedByNeed = [...topicCoverage].sort((a, b) => a.coverage.score - b.coverage.score)

  const summary = {
    strong: topicCoverage.filter(t => t.coverage.level === 'strong').length,
    moderate: topicCoverage.filter(t => t.coverage.level === 'moderate').length,
    weak: topicCoverage.filter(t => t.coverage.level === 'weak').length,
    none: topicCoverage.filter(t => t.coverage.level === 'none').length,
  }

  const fastMovingNeedingAttention = topicCoverage
    .filter(t => t.isFastMoving && (t.coverage.level === 'weak' || t.coverage.level === 'moderate'))
    .sort((a, b) => (a.daysSinceMostRecent || 999) - (b.daysSinceMostRecent || 999))

  return {
    summary,
    topicsNeedingAttention: sortedByNeed.slice(0, 10),
    fastMovingTopics: fastMovingNeedingAttention.slice(0, 5),
    allTopics: topicCoverage,
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
    // Try optimized path first (uses database function)
    const metrics = await getTopicCoverageMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    // Check if it's a "function does not exist" error (migration not applied yet)
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('does not exist') || errorMessage.includes('could not find')) {
      console.warn('Topic coverage function not found, falling back to original implementation')
      try {
        const metrics = await getTopicCoverageMetricsFallback()
        return NextResponse.json(metrics)
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
        return NextResponse.json(
          { error: 'Failed to fetch topic coverage metrics' },
          { status: 500 }
        )
      }
    }

    console.error('Error in topic-coverage API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topic coverage metrics' },
      { status: 500 }
    )
  }
}

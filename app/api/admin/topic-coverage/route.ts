import { NextResponse } from 'next/server'
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

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
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

    // Fetch all sources
    const { data: sources, error: sourcesError } = await supabase
      .from('sources')
      .select('id, author_id, published_date')

    const allSources = sources || []

    // Fetch authors with inline sources
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('id, sources')

    if (authorsError) throw authorsError

    const totalAuthors = authors?.length || 0

    // Build author sources map
    const authorSourcesMap = new Map<string, { count: number; mostRecent: Date | null }>()

    allSources.forEach(source => {
      if (!source.author_id) return
      const existing = authorSourcesMap.get(source.author_id) || { count: 0, mostRecent: null }
      existing.count++
      if (source.published_date) {
        const pubDate = new Date(source.published_date)
        if (!existing.mostRecent || pubDate > existing.mostRecent) {
          existing.mostRecent = pubDate
        }
      }
      authorSourcesMap.set(source.author_id, existing)
    })

    // Also count inline sources
    authors?.forEach(author => {
      if (author.sources && Array.isArray(author.sources)) {
        const existing = authorSourcesMap.get(author.id) || { count: 0, mostRecent: null }
        author.sources.forEach((src: any) => {
          existing.count++
          // Handle different date formats including year-only
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
      }
    })

    // Calculate topic coverage for each camp (treating camps as topics)
    const topicCoverage = (camps || []).map(camp => {
      const campAuthorIds = camp.camp_authors?.map((ca: any) => ca.author_id) || []
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

      // Check if topic is fast-moving
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

    return NextResponse.json({
      summary,
      topicsNeedingAttention: sortedByNeed.slice(0, 10),
      fastMovingTopics: fastMovingNeedingAttention.slice(0, 5),
      allTopics: topicCoverage,
    })
  } catch (error) {
    console.error('Error in topic-coverage API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topic coverage metrics' },
      { status: 500 }
    )
  }
}

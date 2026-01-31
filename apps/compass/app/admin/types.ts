// Admin Dashboard Types
// Shared interfaces and utility functions for admin dashboard components

export interface CanonHealthMetrics {
  totalAuthors: number
  totalCamps: number
  totalSources: number
  authorsWithSources: number
  authorsWithoutSources: number
  coverageByAge: {
    current: number
    moderate: number
    stale: number
    noDate: number
  }
  sourceDateRange: {
    oldestDate: string | null
    newestDate: string | null
    daysSinceNewest: number | null
    sourcesFromTable: number
    sourcesFromAuthors: number
  }
  stalestCamps: Array<{
    id: string
    name: string
    domain: string
    authorCount: number
    sourceCount: number
    mostRecentDate: string | null
    daysSinceUpdate: number | null
  }>
  stalestAuthors: Array<{
    id: string
    name: string
    affiliation: string | null
    sourceCount: number
    mostRecentDate: string | null
    daysSinceUpdate: number | null
  }>
  domainBreakdown: Array<{
    domain: string
    campCount: number
    authorCount: number
    sourceCount: number
    avgDaysSinceUpdate: number | null
  }>
}

export interface TopicCoverageData {
  summary: {
    strong: number
    moderate: number
    weak: number
    none: number
  }
  topicsNeedingAttention: Array<{
    id: string
    topic: string
    authorCount: number
    totalAuthors: number
    sourceCount: number
    mostRecentDate: string | null
    daysSinceMostRecent: number | null
    isFastMoving: boolean
    coverage: { level: string; score: number }
    insight: string
  }>
  fastMovingTopics: Array<{
    id: string
    topic: string
    authorCount: number
    totalAuthors: number
    sourceCount: number
    mostRecentDate: string | null
    daysSinceMostRecent: number | null
    isFastMoving: boolean
    coverage: { level: string; score: number }
    insight: string
  }>
}

export interface CurationQueueData {
  summary: {
    total: number
    critical: number
    high: number
    medium: number
    low: number
    withoutSources: number
    withoutPositionSummary: number
    neverChecked: number
  }
  queue: Array<{
    id: string
    name: string
    affiliation: string | null
    sourceCount: number
    mostRecentSourceDate: string | null
    daysSinceLastSource: number | null
    hasPositionSummary: boolean
    lastCurationCheck: string | null
    daysSinceLastCheck: number | null
    curationStatus: string
    camps: string[]
    priorityScore: number
    priorityReasons: string[]
    urgency: 'critical' | 'high' | 'medium' | 'low'
  }>
  byUrgency: {
    critical: Array<any>
    high: Array<any>
    medium: Array<any>
  }
}

export interface CurationResult {
  success: boolean
  authorId: string
  authorName: string
  checkType: string
  result: {
    sourceDiscovery?: {
      status: string
      discoveredSources: Array<{
        title: string
        url: string
        date: string | null
        type: string
        summary: string
        relevance: string
      }>
      searchSummary: string
    }
    positionVerification?: {
      status: string
      analysis: {
        aligned: boolean
        shiftDetected: boolean
        shiftSeverity: string
        shiftSummary: string | null
        newTopics: string[]
        suggestedUpdate: string | null
        confidence: string
        reasoning: string
      }
    }
  }
}

export interface PriorityAction {
  priority: 'critical' | 'high' | 'medium'
  action: string
  reason: string
  impact: string
  target?: { type: 'author' | 'camp' | 'domain'; id?: string; name: string }
}

export interface HealthGrade {
  grade: string
  score: number
  color: string
  bgColor: string
}

// Calculate overall health grade based on metrics
export function calculateHealthGrade(metrics: CanonHealthMetrics): HealthGrade {
  let score = 100

  // Penalize for stale sources (biggest impact on user experience)
  const totalWithDate = metrics.coverageByAge.current + metrics.coverageByAge.moderate + metrics.coverageByAge.stale
  if (totalWithDate > 0) {
    const stalePct = metrics.coverageByAge.stale / totalWithDate
    const moderatePct = metrics.coverageByAge.moderate / totalWithDate
    score -= stalePct * 40 // Up to -40 for all stale
    score -= moderatePct * 15 // Up to -15 for all moderate
  }

  // Penalize for authors without sources (credibility issue)
  if (metrics.totalAuthors > 0) {
    const noSourcePct = metrics.authorsWithoutSources / metrics.totalAuthors
    score -= noSourcePct * 25 // Up to -25 for all authors without sources
  }

  // Penalize for no-date sources (data quality issue)
  const totalSources = metrics.coverageByAge.current + metrics.coverageByAge.moderate + metrics.coverageByAge.stale + metrics.coverageByAge.noDate
  if (totalSources > 0) {
    const noDatePct = metrics.coverageByAge.noDate / totalSources
    score -= noDatePct * 20 // Up to -20 for all sources without dates
  }

  score = Math.max(0, Math.min(100, Math.round(score)))

  if (score >= 90) return { grade: 'A', score, color: '#059669', bgColor: '#d1fae5' }
  if (score >= 80) return { grade: 'B', score, color: '#0284c7', bgColor: '#e0f2fe' }
  if (score >= 70) return { grade: 'C', score, color: '#d97706', bgColor: '#fef3c7' }
  if (score >= 60) return { grade: 'D', score, color: '#ea580c', bgColor: '#ffedd5' }
  return { grade: 'F', score, color: '#dc2626', bgColor: '#fee2e2' }
}

// Generate priority actions based on metrics
export function generatePriorityActions(metrics: CanonHealthMetrics): PriorityAction[] {
  const actions: PriorityAction[] = []

  // Critical: Authors without any sources
  const authorsNoSources = metrics.stalestAuthors.filter(a => a.sourceCount === 0).slice(0, 3)
  authorsNoSources.forEach(author => {
    actions.push({
      priority: 'critical',
      action: `Add sources for ${author.name}`,
      reason: 'This author has zero sources - their viewpoints have no citations',
      impact: 'Users cannot verify claims or explore this author\'s work',
      target: { type: 'author', id: author.id, name: author.name }
    })
  })

  // Critical: Camps with no sources
  const campsNoSources = metrics.stalestCamps.filter(c => c.sourceCount === 0).slice(0, 2)
  campsNoSources.forEach(camp => {
    actions.push({
      priority: 'critical',
      action: `Add sources to "${camp.name}" camp`,
      reason: `Camp has ${camp.authorCount} authors but zero sources`,
      impact: 'This intellectual position appears unsupported',
      target: { type: 'camp', name: camp.name }
    })
  })

  // High: Very stale high-profile authors (>365 days)
  const veryStaleAuthors = metrics.stalestAuthors
    .filter(a => a.daysSinceUpdate && a.daysSinceUpdate > 365 && a.sourceCount > 0)
    .slice(0, 2)
  veryStaleAuthors.forEach(author => {
    const years = Math.floor(author.daysSinceUpdate! / 365)
    actions.push({
      priority: 'high',
      action: `Update ${author.name}'s sources`,
      reason: `Latest source is ${years}+ year${years > 1 ? 's' : ''} old (${author.mostRecentDate})`,
      impact: 'May be missing recent papers, talks, or position changes',
      target: { type: 'author', id: author.id, name: author.name }
    })
  })

  // High: Domains with poor coverage
  const staleDomains = metrics.domainBreakdown
    .filter(d => d.avgDaysSinceUpdate && d.avgDaysSinceUpdate > 180)
    .slice(0, 2)
  staleDomains.forEach(domain => {
    actions.push({
      priority: 'high',
      action: `Refresh "${domain.domain}" domain`,
      reason: `Average source age is ${Math.round(domain.avgDaysSinceUpdate!)} days`,
      impact: `${domain.authorCount} authors in this domain may have outdated viewpoints`,
      target: { type: 'domain', name: domain.domain }
    })
  })

  // Medium: Moderately stale authors (180-365 days)
  const moderatelyStale = metrics.stalestAuthors
    .filter(a => a.daysSinceUpdate && a.daysSinceUpdate >= 180 && a.daysSinceUpdate < 365 && a.sourceCount > 0)
    .slice(0, 2)
  moderatelyStale.forEach(author => {
    actions.push({
      priority: 'medium',
      action: `Check for new content from ${author.name}`,
      reason: `Last updated ${Math.round(author.daysSinceUpdate! / 30)} months ago`,
      impact: 'May be missing recent publications',
      target: { type: 'author', id: author.id, name: author.name }
    })
  })

  return actions.slice(0, 7) // Limit to top 7 actions
}

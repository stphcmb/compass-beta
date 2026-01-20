'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  Activity,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Database,
  ExternalLink,
  TrendingDown,
  Target,
  Zap,
  AlertCircle,
  XCircle,
  Flame,
  TrendingUp,
  MessageSquare,
  Search,
  Play,
  Loader2,
  FileSearch,
  GitCompare
} from 'lucide-react'
import Header from '@/components/Header'

// Admin email whitelist
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
  : [
    'huongnguyen@anduintransact.com',
    'ngthaohuong@gmail.com',
  ]

interface CanonHealthMetrics {
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

interface TopicCoverageData {
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

interface CurationQueueData {
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

interface CurationResult {
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

// Calculate overall health grade
function calculateHealthGrade(metrics: CanonHealthMetrics): { grade: string; score: number; color: string; bgColor: string } {
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
function generatePriorityActions(metrics: CanonHealthMetrics): Array<{
  priority: 'critical' | 'high' | 'medium'
  action: string
  reason: string
  impact: string
  target?: { type: 'author' | 'camp' | 'domain'; id?: string; name: string }
}> {
  const actions: Array<{
    priority: 'critical' | 'high' | 'medium'
    action: string
    reason: string
    impact: string
    target?: { type: 'author' | 'camp' | 'domain'; id?: string; name: string }
  }> = []

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

function CanonHealthDashboard() {
  const [metrics, setMetrics] = useState<CanonHealthMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    actions: true,
    insights: true,
    domains: false,
    staleCamps: false,
    staleAuthors: false,
  })

  const fetchMetrics = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/canon-health')
      if (!response.ok) throw new Error('Failed to fetch metrics')
      const data = await response.json()
      setMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Analyzing canon health...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Error loading metrics</span>
        </div>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <button
          onClick={fetchMetrics}
          className="mt-3 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!metrics) return null

  const health = calculateHealthGrade(metrics)
  const priorityActions = generatePriorityActions(metrics)

  const totalWithDate = metrics.coverageByAge.current + metrics.coverageByAge.moderate + metrics.coverageByAge.stale
  const stalePct = totalWithDate > 0 ? Math.round((metrics.coverageByAge.stale / totalWithDate) * 100) : 0
  const currentPct = totalWithDate > 0 ? Math.round((metrics.coverageByAge.current / totalWithDate) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Health Score Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            {/* Grade Circle */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center border-4"
              style={{ borderColor: health.color, backgroundColor: health.bgColor }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: health.color }}>{health.grade}</div>
                <div className="text-xs font-medium" style={{ color: health.color }}>{health.score}/100</div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Canon Health Score</h2>
              <p className="text-gray-600 mb-3">
                {health.score >= 80
                  ? 'Your canon is in good shape. Keep sources fresh!'
                  : health.score >= 60
                  ? 'Some attention needed. Focus on the priority actions below.'
                  : 'Significant gaps in coverage. Users may see outdated information.'
                }
              </p>

              {/* Quick Stats */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600"><strong>{metrics.totalAuthors}</strong> authors</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600"><strong>{metrics.totalSources}</strong> sources</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600"><strong>{metrics.totalCamps}</strong> camps</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={fetchMetrics}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Source Date Range - Key Transparency Metric */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Canon Source Timeline
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Oldest Source</div>
              <div className="text-lg font-bold text-gray-900">
                {metrics.sourceDateRange.oldestDate || 'No dates'}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Newest Source</div>
              <div className="text-lg font-bold text-gray-900">
                {metrics.sourceDateRange.newestDate || 'No dates'}
              </div>
              {metrics.sourceDateRange.daysSinceNewest !== null && (
                <div className={`text-xs mt-1 ${metrics.sourceDateRange.daysSinceNewest > 180 ? 'text-red-600' : metrics.sourceDateRange.daysSinceNewest > 90 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {metrics.sourceDateRange.daysSinceNewest} days ago
                </div>
              )}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Source Breakdown</div>
              <div className="text-sm text-gray-700">
                <div>{metrics.sourceDateRange.sourcesFromTable} from sources table</div>
                <div>{metrics.sourceDateRange.sourcesFromAuthors} inline (author.sources)</div>
              </div>
            </div>
          </div>
          {metrics.sourceDateRange.daysSinceNewest !== null && metrics.sourceDateRange.daysSinceNewest > 180 && (
            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                <strong>Canon is stale:</strong> No sources added in {metrics.sourceDateRange.daysSinceNewest} days. Users may see outdated analysis.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Priority Actions */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('actions')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Priority Actions</h3>
            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
              {priorityActions.filter(a => a.priority === 'critical').length} critical
            </span>
          </div>
          {expandedSections.actions ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
        </button>

        {expandedSections.actions && (
          <div className="px-4 pb-4">
            {priorityActions.length === 0 ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">No urgent actions needed. Canon is healthy!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {priorityActions.map((action, idx) => {
                  const priorityConfig = {
                    critical: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
                    high: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
                    medium: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
                  }
                  const config = priorityConfig[action.priority]
                  const Icon = config.icon

                  return (
                    <div key={idx} className={`p-4 rounded-lg border ${config.bg} ${config.border}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{action.action}</span>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.badge}`}>
                                {action.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{action.reason}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              <strong>Impact:</strong> {action.impact}
                            </p>
                          </div>
                        </div>
                        {action.target?.type === 'author' && action.target.id && (
                          <Link
                            href={`/authors/${action.target.id}`}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 whitespace-nowrap"
                          >
                            View Author
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('insights')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
          </div>
          {expandedSections.insights ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
        </button>

        {expandedSections.insights && (
          <div className="px-4 pb-4 grid grid-cols-2 gap-4">
            {/* Source Freshness Insight */}
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">Source Freshness</span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Fresh (&lt;90 days)</span>
                  <span className="font-medium text-emerald-600">{currentPct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${currentPct}%` }} />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  {currentPct >= 50
                    ? <><CheckCircle className="w-4 h-4 inline text-emerald-500 mr-1" />Good coverage - most sources are recent</>
                    : stalePct >= 50
                    ? <><TrendingDown className="w-4 h-4 inline text-red-500 mr-1" /><strong>{stalePct}% of sources are stale</strong> - users see outdated viewpoints</>
                    : <><AlertTriangle className="w-4 h-4 inline text-amber-500 mr-1" />Mixed freshness - prioritize updating key authors</>
                  }
                </p>
              </div>
            </div>

            {/* Author Coverage Insight */}
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">Author Coverage</span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">With sources</span>
                  <span className="font-medium text-blue-600">
                    {Math.round((metrics.authorsWithSources / metrics.totalAuthors) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(metrics.authorsWithSources / metrics.totalAuthors) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  {metrics.authorsWithoutSources === 0
                    ? <><CheckCircle className="w-4 h-4 inline text-emerald-500 mr-1" />All authors have sources</>
                    : <><AlertTriangle className="w-4 h-4 inline text-amber-500 mr-1" /><strong>{metrics.authorsWithoutSources} authors</strong> have no sources - their claims are unverifiable</>
                  }
                </p>
              </div>
            </div>

            {/* Domain Health Insight */}
            {metrics.domainBreakdown.length > 0 && (
              <div className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">Domain Balance</span>
                </div>

                <div className="space-y-2 mb-3">
                  {metrics.domainBreakdown.slice(0, 3).map(d => (
                    <div key={d.domain} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 truncate" style={{ maxWidth: '150px' }}>{d.domain}</span>
                      <span className={`font-medium ${
                        d.avgDaysSinceUpdate === null ? 'text-gray-400' :
                        d.avgDaysSinceUpdate < 90 ? 'text-emerald-600' :
                        d.avgDaysSinceUpdate < 180 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {d.avgDaysSinceUpdate ? `${Math.round(d.avgDaysSinceUpdate)}d avg` : 'No data'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {(() => {
                      const staleDomains = metrics.domainBreakdown.filter(d => d.avgDaysSinceUpdate && d.avgDaysSinceUpdate > 180)
                      if (staleDomains.length === 0) {
                        return <><CheckCircle className="w-4 h-4 inline text-emerald-500 mr-1" />All domains have recent coverage</>
                      }
                      return <><TrendingDown className="w-4 h-4 inline text-red-500 mr-1" /><strong>{staleDomains[0].domain}</strong> needs attention - {staleDomains[0].authorCount} authors with stale sources</>
                    })()}
                  </p>
                </div>
              </div>
            )}

            {/* Data Quality Insight */}
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">Data Quality</span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Sources with dates</span>
                  <span className="font-medium text-purple-600">
                    {metrics.totalSources > 0
                      ? Math.round(((metrics.totalSources - metrics.coverageByAge.noDate) / metrics.totalSources) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${metrics.totalSources > 0 ? ((metrics.totalSources - metrics.coverageByAge.noDate) / metrics.totalSources) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  {metrics.coverageByAge.noDate === 0
                    ? <><CheckCircle className="w-4 h-4 inline text-emerald-500 mr-1" />All sources have publication dates</>
                    : <><AlertTriangle className="w-4 h-4 inline text-amber-500 mr-1" /><strong>{metrics.coverageByAge.noDate} sources</strong> missing dates - can't assess freshness</>
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Domain Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('domains')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Domain Breakdown</h3>
          </div>
          {expandedSections.domains ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
        </button>

        {expandedSections.domains && (
          <div className="px-4 pb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Domain</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-700">Camps</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-700">Authors</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-700">Sources</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-700">Avg Age</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {metrics.domainBreakdown.map((domain) => {
                  const isStale = domain.avgDaysSinceUpdate && domain.avgDaysSinceUpdate > 180
                  const isModerate = domain.avgDaysSinceUpdate && domain.avgDaysSinceUpdate > 90 && domain.avgDaysSinceUpdate <= 180
                  return (
                    <tr key={domain.domain} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-900">{domain.domain}</td>
                      <td className="py-3 px-3 text-center text-gray-600">{domain.campCount}</td>
                      <td className="py-3 px-3 text-center text-gray-600">{domain.authorCount}</td>
                      <td className="py-3 px-3 text-center text-gray-600">{domain.sourceCount}</td>
                      <td className="py-3 px-3 text-center text-gray-600">
                        {domain.avgDaysSinceUpdate !== null ? `${Math.round(domain.avgDaysSinceUpdate)}d` : '-'}
                      </td>
                      <td className="py-3 px-3">
                        {isStale ? (
                          <span className="flex items-center gap-1 text-red-600 text-xs">
                            <XCircle className="w-3 h-3" /> Needs refresh
                          </span>
                        ) : isModerate ? (
                          <span className="flex items-center gap-1 text-amber-600 text-xs">
                            <AlertCircle className="w-3 h-3" /> Getting stale
                          </span>
                        ) : domain.avgDaysSinceUpdate !== null ? (
                          <span className="flex items-center gap-1 text-emerald-600 text-xs">
                            <CheckCircle className="w-3 h-3" /> Good
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">No data</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Authors Needing Updates */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('staleAuthors')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">Authors Needing Updates</h3>
            <span className="text-sm text-gray-500">Top {metrics.stalestAuthors.length}</span>
          </div>
          {expandedSections.staleAuthors ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
        </button>

        {expandedSections.staleAuthors && (
          <div className="px-4 pb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Author</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Affiliation</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-700">Sources</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-700">Last Updated</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {metrics.stalestAuthors.map((author) => (
                  <tr key={author.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-900">{author.name}</td>
                    <td className="py-3 px-3 text-gray-600 text-xs">{author.affiliation || '-'}</td>
                    <td className="py-3 px-3 text-center">
                      {author.sourceCount === 0 ? (
                        <span className="text-red-600 font-medium">0</span>
                      ) : (
                        <span className="text-gray-600">{author.sourceCount}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {author.mostRecentDate ? (
                        <span className={author.daysSinceUpdate && author.daysSinceUpdate > 365 ? 'text-red-600' : 'text-gray-600'}>
                          {author.mostRecentDate}
                        </span>
                      ) : (
                        <span className="text-red-600">Never</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Link
                        href={`/authors/${author.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Camps Needing Attention */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('staleCamps')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Camps Needing Attention</h3>
            <span className="text-sm text-gray-500">Top {metrics.stalestCamps.length}</span>
          </div>
          {expandedSections.staleCamps ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
        </button>

        {expandedSections.staleCamps && (
          <div className="px-4 pb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Camp</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Domain</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-700">Authors</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-700">Sources</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-700">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {metrics.stalestCamps.map((camp) => (
                  <tr key={camp.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-900">{camp.name}</td>
                    <td className="py-3 px-3 text-gray-600 text-xs">{camp.domain}</td>
                    <td className="py-3 px-3 text-center text-gray-600">{camp.authorCount}</td>
                    <td className="py-3 px-3 text-center">
                      {camp.sourceCount === 0 ? (
                        <span className="text-red-600 font-medium">0</span>
                      ) : (
                        <span className="text-gray-600">{camp.sourceCount}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {camp.mostRecentDate ? (
                        <span className={camp.daysSinceUpdate && camp.daysSinceUpdate > 365 ? 'text-red-600' : 'text-gray-600'}>
                          {camp.mostRecentDate}
                        </span>
                      ) : (
                        <span className="text-red-600">Never</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Topic Coverage Dashboard Component
function TopicCoverageDashboard() {
  const [data, setData] = useState<TopicCoverageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/topic-coverage')
      if (!response.ok) throw new Error('Failed to fetch topic coverage')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getCoverageStyle = (level: string) => {
    switch (level) {
      case 'strong': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' }
      case 'moderate': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' }
      case 'weak': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Analyzing topic coverage...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Error loading topic coverage</span>
        </div>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <button onClick={fetchData} className="mt-3 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200">
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  const totalTopics = data.summary.strong + data.summary.moderate + data.summary.weak + data.summary.none

  return (
    <div className="space-y-6">
      {/* Coverage Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Topic Coverage Overview</h2>
              <p className="text-sm text-gray-500">How well each intellectual position is covered in your canon</p>
            </div>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Coverage distribution bar */}
        <div className="mb-4">
          <div className="h-4 rounded-full overflow-hidden flex bg-gray-100">
            {data.summary.strong > 0 && (
              <div className="bg-emerald-500" style={{ width: `${(data.summary.strong / totalTopics) * 100}%` }} title={`Strong: ${data.summary.strong}`} />
            )}
            {data.summary.moderate > 0 && (
              <div className="bg-amber-400" style={{ width: `${(data.summary.moderate / totalTopics) * 100}%` }} title={`Moderate: ${data.summary.moderate}`} />
            )}
            {data.summary.weak > 0 && (
              <div className="bg-red-400" style={{ width: `${(data.summary.weak / totalTopics) * 100}%` }} title={`Weak: ${data.summary.weak}`} />
            )}
            {data.summary.none > 0 && (
              <div className="bg-gray-300" style={{ width: `${(data.summary.none / totalTopics) * 100}%` }} title={`None: ${data.summary.none}`} />
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-600">Strong: <strong className="text-emerald-700">{data.summary.strong}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-gray-600">Moderate: <strong className="text-amber-700">{data.summary.moderate}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-gray-600">Weak: <strong className="text-red-700">{data.summary.weak}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="text-gray-600">None: <strong className="text-gray-700">{data.summary.none}</strong></span>
          </div>
        </div>
      </div>

      {/* Fast-Moving Topics Alert */}
      {data.fastMovingTopics.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">Fast-Moving Topics Needing Attention</h3>
          </div>
          <p className="text-sm text-orange-700 mb-4">
            These topics evolve quickly. Stale coverage means users may get outdated analysis.
          </p>
          <div className="space-y-3">
            {data.fastMovingTopics.map((topic) => {
              const style = getCoverageStyle(topic.coverage.level)
              return (
                <div key={topic.id} className="bg-white rounded-lg p-4 border border-orange-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{topic.topic}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
                          {topic.coverage.level.toUpperCase()}
                        </span>
                        <span title="Fast-moving topic"><Flame className="w-3 h-3 text-orange-500" /></span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {topic.authorCount} of {topic.totalAuthors} authors · {topic.sourceCount} sources ·
                        {topic.mostRecentDate ? ` Last: ${topic.mostRecentDate}` : ' No dated sources'}
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <p className="text-sm text-orange-800">{topic.insight}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Topics Needing Attention */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Topics Needing Attention</h3>
            <span className="text-sm text-gray-500">Weakest coverage first</span>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {data.topicsNeedingAttention.map((topic) => {
            const style = getCoverageStyle(topic.coverage.level)
            const coveragePct = Math.round((topic.authorCount / topic.totalAuthors) * 100)
            return (
              <div key={topic.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{topic.topic}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
                        {topic.coverage.level.toUpperCase()}
                      </span>
                      {topic.isFastMoving && <span title="Fast-moving topic"><Flame className="w-3 h-3 text-orange-500" /></span>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {topic.authorCount} authors ({coveragePct}%)
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {topic.sourceCount} sources
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {topic.mostRecentDate || 'No dates'}
                      </span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      <p className="text-sm text-gray-700">{topic.insight}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-300">{topic.coverage.score}</div>
                    <div className="text-xs text-gray-400">score</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* What This Means for Users */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">How This Affects User Experience</h3>
        </div>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Strong coverage:</strong> Users get comprehensive analysis from multiple perspectives with recent sources.</p>
          <p><strong>Moderate coverage:</strong> Analysis is directionally correct but may miss niche viewpoints or recent developments.</p>
          <p><strong>Weak coverage:</strong> Analysis should be treated as preliminary. Consider adding a disclaimer for these topics.</p>
          <p><strong>Fast-moving topics:</strong> Even with good author coverage, stale sources mean users may get outdated information.</p>
        </div>
      </div>
    </div>
  )
}

// Curation Queue Dashboard Component
function CurationQueueDashboard() {
  const [data, setData] = useState<CurationQueueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [runningChecks, setRunningChecks] = useState<Set<string>>(new Set())
  const [results, setResults] = useState<Map<string, CurationResult>>(new Map())
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set())
  const [enrichingDates, setEnrichingDates] = useState<Set<string>>(new Set())
  // Batch processing state
  const [selectedAuthors, setSelectedAuthors] = useState<Set<string>>(new Set())
  const [batchRunning, setBatchRunning] = useState(false)
  const [enrichAllRunning, setEnrichAllRunning] = useState(false)
  // Human-in-the-loop review state (simplified to yes/no)
  const [reviews, setReviews] = useState<Map<string, {
    approved: boolean | null
    reviewedAt: string | null
  }>>(new Map())

  const fetchQueue = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/curation/queue')
      if (!response.ok) throw new Error('Failed to fetch curation queue')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  const runCurationCheck = async (authorId: string, checkType: 'full' | 'sources' | 'position' = 'full') => {
    setRunningChecks(prev => new Set(prev).add(authorId))

    try {
      const response = await fetch('/api/admin/curation/check-author', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId, checkType })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Check failed')
      }

      const result: CurationResult = await response.json()
      setResults(prev => new Map(prev).set(authorId, result))
      setExpandedResults(prev => new Set(prev).add(authorId))
    } catch (err) {
      console.error('Curation check failed:', err)
      alert(`Check failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setRunningChecks(prev => {
        const next = new Set(prev)
        next.delete(authorId)
        return next
      })
    }
  }

  const enrichSourceDates = async (authorId: string) => {
    setEnrichingDates(prev => new Set(prev).add(authorId))

    try {
      const response = await fetch('/api/admin/curation/enrich-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Enrichment failed')
      }

      const result = await response.json()
      alert(`✅ ${result.message}\n\nEnriched ${result.enrichedCount} of ${result.totalSources} sources with better dates.`)

      // Refresh queue to show updated dates
      fetchQueue()
    } catch (err) {
      console.error('Date enrichment failed:', err)
      alert(`Failed to enrich dates: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setEnrichingDates(prev => {
        const next = new Set(prev)
        next.delete(authorId)
        return next
      })
    }
  }

  const enrichAllDates = async () => {
    const confirmed = confirm('This will enrich dates for ALL authors with sources. This may take up to 5 minutes. Continue?')
    if (!confirmed) return

    setEnrichAllRunning(true)

    try {
      const response = await fetch('/api/admin/curation/enrich-all-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Batch enrichment failed')
      }

      const result = await response.json()

      const successCount = result.processedAuthors || 0
      const failedCount = result.failedAuthors || 0
      const totalEnriched = result.enrichedSources || 0

      alert(`✅ Batch Date Enrichment Complete\n\n` +
            `• Processed: ${successCount} authors\n` +
            `• Failed: ${failedCount} authors\n` +
            `• Total sources enriched: ${totalEnriched}\n\n` +
            `${result.topEnriched?.length > 0 ? `Top enriched authors:\n${result.topEnriched.map((a: any) => `  • ${a.name}: ${a.enrichedCount}/${a.totalSources}`).join('\n')}` : ''}`)

      // Refresh queue to show updated dates
      fetchQueue()
    } catch (err) {
      console.error('Batch date enrichment failed:', err)
      alert(`Failed to enrich all dates: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setEnrichAllRunning(false)
    }
  }

  const toggleResultExpanded = (authorId: string) => {
    setExpandedResults(prev => {
      const next = new Set(prev)
      if (next.has(authorId)) {
        next.delete(authorId)
      } else {
        next.add(authorId)
      }
      return next
    })
  }

  // Batch processing functions
  const toggleAuthorSelection = (authorId: string) => {
    setSelectedAuthors(prev => {
      const next = new Set(prev)
      if (next.has(authorId)) {
        next.delete(authorId)
      } else {
        next.add(authorId)
      }
      return next
    })
  }

  const selectAll = () => {
    const allIds = data?.queue.slice(0, 30).map(a => a.id) || []
    setSelectedAuthors(new Set(allIds))
  }

  const clearSelection = () => {
    setSelectedAuthors(new Set())
  }

  const runBatchCheck = async () => {
    if (selectedAuthors.size === 0) {
      alert('Please select at least one author')
      return
    }

    setBatchRunning(true)

    try {
      const response = await fetch('/api/admin/curation/batch-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorIds: Array.from(selectedAuthors) })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Batch check failed')
      }

      const batchResult = await response.json()

      // Update results for each author
      const newResults = new Map(results)
      batchResult.results.forEach((authorResult: any) => {
        if (authorResult.success) {
          newResults.set(authorResult.authorId, {
            authorId: authorResult.authorId,
            authorName: authorResult.authorName,
            result: {
              positionVerification: authorResult.result,
              sourceDiscovery: null // Batch check only runs position verification
            }
          })
          // Auto-expand results
          setExpandedResults(prev => new Set(prev).add(authorResult.authorId))
        }
      })
      setResults(newResults)

      // Show summary
      alert(`Batch check complete!\n\nSuccessful: ${batchResult.summary.successful}\nFailed: ${batchResult.summary.failed}\nDrift detected: ${batchResult.summary.driftDetected}\nNeeds review: ${batchResult.summary.needsReview}\nVerified: ${batchResult.summary.verified}`)
    } catch (err) {
      console.error('Batch check failed:', err)
      alert(`Batch check failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setBatchRunning(false)
    }
  }

  // Human-in-the-loop review functions (simplified)
  const submitReview = (authorId: string, approved: boolean) => {
    setReviews(prev => {
      const next = new Map(prev)
      next.set(authorId, {
        approved,
        reviewedAt: new Date().toISOString()
      })
      return next
    })

    // If approved, auto-run source discovery
    if (approved) {
      runCurationCheck(authorId, 'sources')
    }
  }

  const getReview = (authorId: string) => {
    return reviews.get(authorId) || { approved: null, reviewedAt: null }
  }

  const canProceedToSourceDiscovery = (authorId: string) => {
    const review = getReview(authorId)
    return review.approved === true
  }

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'critical': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' }
      case 'medium': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading curation queue...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Error loading curation queue</span>
        </div>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <button onClick={fetchQueue} className="mt-3 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200">
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Queue Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Curation Queue</h2>
              <p className="text-sm text-gray-500">Authors prioritized for source discovery and position verification</p>
            </div>
          </div>
          <button onClick={fetchQueue} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-700">{data.summary.critical}</div>
            <div className="text-xs text-red-600">Critical</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-700">{data.summary.high}</div>
            <div className="text-xs text-orange-600">High Priority</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-2xl font-bold text-amber-700">{data.summary.medium}</div>
            <div className="text-xs text-amber-600">Medium</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-700">{data.summary.neverChecked}</div>
            <div className="text-xs text-gray-600">Never Checked</div>
          </div>
        </div>

        {/* What these checks do */}
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            What the agents do
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-indigo-800">
            <div className="flex items-start gap-2">
              <FileSearch className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Source Discovery:</strong> Finds new papers, blog posts, talks, and interviews from the author that we don't have yet.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <GitCompare className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Position Verification:</strong> Checks if our summary of their views still matches their recent content, detecting any shifts.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">Priority Queue (Top 50)</h3>
              <p className="text-sm text-gray-500">Select authors for batch processing (runs position verification in parallel)</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedAuthors.size > 0 && (
                <>
                  <span className="text-sm text-gray-600">{selectedAuthors.size} selected</span>
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    Clear
                  </button>
                  <button
                    onClick={runBatchCheck}
                    disabled={batchRunning}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {batchRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                    Batch Check ({selectedAuthors.size})
                  </button>
                </>
              )}
              {selectedAuthors.size === 0 && (
                <>
                  <button
                    onClick={enrichAllDates}
                    disabled={enrichAllRunning}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-600 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Enrich dates for ALL authors using AI to extract dates from URLs, ArXiv IDs, conference info"
                  >
                    {enrichAllRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}
                    Fix All Dates
                  </button>
                  <button
                    onClick={selectAll}
                    className="px-3 py-1.5 text-sm text-indigo-600 rounded-lg hover:bg-indigo-50"
                  >
                    Select All
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {data.queue.slice(0, 30).map((author) => {
            const style = getUrgencyStyle(author.urgency)
            const isRunning = runningChecks.has(author.id)
            const result = results.get(author.id)
            const isExpanded = expandedResults.has(author.id)

            return (
              <div key={author.id} className="hover:bg-gray-50">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Checkbox for batch selection */}
                    <div className="flex items-start pt-1">
                      <input
                        type="checkbox"
                        checked={selectedAuthors.has(author.id)}
                        onChange={() => toggleAuthorSelection(author.id)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/authors/${author.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                          {author.name}
                        </Link>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
                          {author.urgency.toUpperCase()}
                        </span>
                        {!author.hasPositionSummary && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                            No Summary
                          </span>
                        )}
                      </div>

                      {author.affiliation && (
                        <div className="text-sm text-gray-500 mb-1">{author.affiliation}</div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
                        <span className={`flex items-center gap-1 ${author.sourceCount === 0 ? 'text-red-600 font-medium' : ''}`}>
                          <BookOpen className="w-3 h-3" />
                          {author.sourceCount} sources
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {author.mostRecentSourceDate || 'No dates'}
                          {author.daysSinceLastSource && (
                            <span className={author.daysSinceLastSource > 365 ? 'text-red-600' : ''}>
                              ({author.daysSinceLastSource}d ago)
                            </span>
                          )}
                        </span>
                        {author.camps.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Database className="w-3 h-3" />
                            {author.camps.slice(0, 2).join(', ')}{author.camps.length > 2 ? ` +${author.camps.length - 2}` : ''}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {author.priorityReasons.map((reason, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => enrichSourceDates(author.id)}
                        disabled={enrichingDates.has(author.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Enrich source dates using AI to extract dates from URLs, ArXiv IDs, conference info"
                      >
                        {enrichingDates.has(author.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}
                        Fix Dates
                      </button>
                      {!results.has(author.id) ? (
                        <button
                          onClick={() => runCurationCheck(author.id, 'position')}
                          disabled={isRunning}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Start curation: verify position first, then review before source discovery"
                        >
                          {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                          Start Check
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-emerald-700 bg-emerald-50 rounded-lg">
                          Check in progress
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Results display */}
                  {result && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleResultExpanded(author.id)}
                        className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        View Results
                        {result.result.sourceDiscovery?.discoveredSources?.length ? (
                          <span className="px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded">
                            {result.result.sourceDiscovery.discoveredSources.length} new sources
                          </span>
                        ) : null}
                        {result.result.positionVerification?.analysis?.shiftDetected && (
                          <span className="px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">
                            Position shift detected
                          </span>
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 space-y-3">
                          {/* Position Verification Results - shown first since it runs first */}
                          {result.result.positionVerification && (
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                <GitCompare className="w-4 h-4" />
                                Step 1: Position Verification
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  result.result.positionVerification.status === 'verified'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : result.result.positionVerification.status === 'drift_detected'
                                    ? 'bg-red-100 text-red-700'
                                    : result.result.positionVerification.status === 'needs_review'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {result.result.positionVerification.status.replace(/_/g, ' ')}
                                </span>
                              </h4>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-4">
                                  <span className={`flex items-center gap-1 ${
                                    result.result.positionVerification.analysis.aligned
                                      ? 'text-emerald-700'
                                      : 'text-red-700'
                                  }`}>
                                    {result.result.positionVerification.analysis.aligned
                                      ? <CheckCircle className="w-4 h-4" />
                                      : <XCircle className="w-4 h-4" />}
                                    {result.result.positionVerification.analysis.aligned ? 'Aligned' : 'Not Aligned'}
                                  </span>
                                  {result.result.positionVerification.analysis.shiftDetected && (
                                    <span className="flex items-center gap-1 text-amber-700">
                                      <AlertTriangle className="w-4 h-4" />
                                      Shift: {result.result.positionVerification.analysis.shiftSeverity}
                                    </span>
                                  )}
                                  <span className="text-gray-500">
                                    Confidence: {result.result.positionVerification.analysis.confidence}
                                  </span>
                                </div>

                                <p className="text-purple-800">{result.result.positionVerification.analysis.reasoning}</p>

                                {result.result.positionVerification.analysis.shiftSummary && (
                                  <div className="p-2 bg-amber-50 rounded border border-amber-200">
                                    <strong className="text-amber-800">Shift Detected:</strong>
                                    <p className="text-amber-700">{result.result.positionVerification.analysis.shiftSummary}</p>
                                  </div>
                                )}

                                {result.result.positionVerification.analysis.newTopics?.length > 0 && (
                                  <div>
                                    <strong className="text-purple-800">New Topics:</strong>
                                    <span className="ml-2 text-purple-700">
                                      {result.result.positionVerification.analysis.newTopics.join(', ')}
                                    </span>
                                  </div>
                                )}

                                {result.result.positionVerification.analysis.suggestedUpdate && (
                                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                                    <strong className="text-emerald-800">Suggested Update:</strong>
                                    <p className="text-emerald-700">{result.result.positionVerification.analysis.suggestedUpdate}</p>
                                  </div>
                                )}
                              </div>

                              {/* Human-in-the-loop Review Panel */}
                              {(() => {
                                const review = getReview(author.id)
                                const isReviewed = review.reviewedAt !== null

                                return (
                                  <div className="mt-4 pt-4 border-t border-purple-200">
                                    <h5 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                      <Users className="w-4 h-4" />
                                      Admin Review Required
                                      {isReviewed && (
                                        <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                                          Reviewed
                                        </span>
                                      )}
                                    </h5>

                                    {!isReviewed ? (
                                      <div className="space-y-3">
                                        <p className="text-sm text-gray-700">
                                          Should we proceed with source discovery for this author?
                                        </p>
                                        <div className="flex gap-3">
                                          <button
                                            onClick={() => submitReview(author.id, true)}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                                          >
                                            <CheckCircle className="w-4 h-4 inline-block mr-2" />
                                            Yes, Find Sources
                                          </button>
                                          <button
                                            onClick={() => submitReview(author.id, false)}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                          >
                                            <XCircle className="w-4 h-4 inline-block mr-2" />
                                            No, Skip for Now
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                          {review.approved ? (
                                            <>
                                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                                              <span className="font-medium text-emerald-700">Approved for source discovery</span>
                                            </>
                                          ) : (
                                            <>
                                              <XCircle className="w-4 h-4 text-gray-600" />
                                              <span className="font-medium text-gray-700">Skipped</span>
                                            </>
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          Reviewed: {new Date(review.reviewedAt!).toLocaleString()}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )
                              })()}
                            </div>
                          )}

                          {/* Source Discovery - shown after review is submitted */}
                          {result.result.positionVerification && canProceedToSourceDiscovery(author.id) && (
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                              <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                                <FileSearch className="w-4 h-4" />
                                Step 2: Source Discovery
                              </h4>

                              {!result.result.sourceDiscovery ? (
                                <div className="space-y-3">
                                  <p className="text-sm text-indigo-800">
                                    Review submitted. You can now search for new sources for this author.
                                  </p>
                                  <button
                                    onClick={() => runCurationCheck(author.id, 'sources')}
                                    disabled={runningChecks.has(author.id)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                  >
                                    {runningChecks.has(author.id) ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <FileSearch className="w-4 h-4" />
                                    )}
                                    Run Source Discovery
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    result.result.sourceDiscovery.status === 'new_content_found'
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : result.result.sourceDiscovery.status === 'error'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {result.result.sourceDiscovery.status.replace(/_/g, ' ')}
                                  </span>
                                  <p className="text-sm text-indigo-800 mb-3 mt-2">{result.result.sourceDiscovery.searchSummary}</p>

                                  {result.result.sourceDiscovery.discoveredSources?.length > 0 && (
                                    <div className="space-y-2">
                                      {result.result.sourceDiscovery.discoveredSources.map((src, idx) => (
                                        <div key={idx} className="p-3 bg-white rounded border border-indigo-100">
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                              <div className="font-medium text-gray-900 text-sm">{src.title}</div>
                                              <div className="text-xs text-gray-500 mt-1">
                                                <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded mr-2">{src.type}</span>
                                                {src.date && <span className="mr-2">{src.date}</span>}
                                                <span className={`px-1.5 py-0.5 rounded ${
                                                  src.relevance === 'high' ? 'bg-emerald-100 text-emerald-700' :
                                                  src.relevance === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                  'bg-gray-100 text-gray-600'
                                                }`}>
                                                  {src.relevance} relevance
                                                </span>
                                              </div>
                                              <p className="text-xs text-gray-600 mt-1">{src.summary}</p>
                                            </div>
                                            {src.url && src.url !== 'unknown' && (
                                              <a href={src.url} target="_blank" rel="noopener noreferrer"
                                                 className="text-blue-600 hover:text-blue-800">
                                                <ExternalLink className="w-4 h-4" />
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}

                          {/* Pending review message - when position verification done but not reviewed */}
                          {result.result.positionVerification && !canProceedToSourceDiscovery(author.id) && !result.result.sourceDiscovery && (
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Complete the review above to unlock source discovery</span>
                              </div>
                            </div>
                          )}

                          {/* Legacy: Source Discovery Results if run directly without position verification */}
                          {result.result.sourceDiscovery && !result.result.positionVerification && (
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                              <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                                <FileSearch className="w-4 h-4" />
                                Source Discovery
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  result.result.sourceDiscovery.status === 'new_content_found'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : result.result.sourceDiscovery.status === 'error'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {result.result.sourceDiscovery.status.replace(/_/g, ' ')}
                                </span>
                              </h4>
                              <p className="text-sm text-indigo-800 mb-3">{result.result.sourceDiscovery.searchSummary}</p>

                              {result.result.sourceDiscovery.discoveredSources?.length > 0 && (
                                <div className="space-y-2">
                                  {result.result.sourceDiscovery.discoveredSources.map((src, idx) => (
                                    <div key={idx} className="p-3 bg-white rounded border border-indigo-100">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-900 text-sm">{src.title}</div>
                                          <div className="text-xs text-gray-500 mt-1">
                                            <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded mr-2">{src.type}</span>
                                            {src.date && <span className="mr-2">{src.date}</span>}
                                            <span className={`px-1.5 py-0.5 rounded ${
                                              src.relevance === 'high' ? 'bg-emerald-100 text-emerald-700' :
                                              src.relevance === 'medium' ? 'bg-amber-100 text-amber-700' :
                                              'bg-gray-100 text-gray-600'
                                            }`}>
                                              {src.relevance} relevance
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-600 mt-1">{src.summary}</p>
                                        </div>
                                        {src.url && src.url !== 'unknown' && (
                                          <a href={src.url} target="_blank" rel="noopener noreferrer"
                                             className="text-blue-600 hover:text-blue-800">
                                            <ExternalLink className="w-4 h-4" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-700 mb-2">Estimated Cost</h4>
        <p className="text-sm text-gray-600">
          Using Gemini 1.5 Pro: ~$0.03-0.05 per full check (source discovery + position verification).
          Running all {data.summary.critical + data.summary.high} critical/high priority authors: ~${((data.summary.critical + data.summary.high) * 0.04).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get tab from URL or default to 'canon-health'
  const tabFromUrl = searchParams.get('tab') || 'canon-health'
  const [activeTab, setActiveTab] = useState(tabFromUrl)

  // Sync tab with URL on mount and when URL changes
  useEffect(() => {
    const urlTab = searchParams.get('tab') || 'canon-health'
    setActiveTab(urlTab)
  }, [searchParams])

  // Update URL when tab changes
  const changeTab = (newTab: string) => {
    setActiveTab(newTab)
    router.push(`/admin?tab=${newTab}`, { scroll: false })
  }

  const isAdmin = isLoaded && user?.emailAddresses?.some(
    email => ADMIN_EMAILS.includes(email.emailAddress.toLowerCase())
  )
  const isDev = process.env.NODE_ENV === 'development'
  const hasAccess = isDev || isAdmin

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-page-bg)' }}>
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
        <Header sidebarCollapsed={true} />
        <main className="flex-1 mt-16 flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <Header sidebarCollapsed={true} />

      <main className="flex-1 mt-16 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Monitor canon health and take action on issues</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => changeTab('canon-health')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'canon-health'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Activity className="w-4 h-4 inline-block mr-2" />
              Canon Health
            </button>
            <button
              onClick={() => changeTab('topic-coverage')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'topic-coverage'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline-block mr-2" />
              Topic Coverage
            </button>
            <button
              onClick={() => changeTab('curation-queue')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'curation-queue'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Search className="w-4 h-4 inline-block mr-2" />
              Curation Queue
            </button>
            <button
              onClick={() => changeTab('usage')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'usage'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Usage (Coming Soon)
            </button>
          </div>

          {activeTab === 'canon-health' && <CanonHealthDashboard />}
          {activeTab === 'topic-coverage' && <TopicCoverageDashboard />}
          {activeTab === 'curation-queue' && <CurationQueueDashboard />}
          {activeTab === 'usage' && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Analytics</h3>
              <p className="text-gray-500">Coming soon. Track API usage, search queries, and user activity.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

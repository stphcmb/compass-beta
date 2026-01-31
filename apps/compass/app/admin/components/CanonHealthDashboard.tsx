'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
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
  XCircle
} from 'lucide-react'

import {
  CanonHealthMetrics,
  calculateHealthGrade,
  generatePriorityActions
} from '../types'

interface CanonHealthDashboardProps {
  data: CanonHealthMetrics
  onRefresh?: () => void
}

export default function CanonHealthDashboard({ data: metrics, onRefresh }: CanonHealthDashboardProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    actions: true,
    insights: true,
    domains: false,
    staleCamps: false,
    staleAuthors: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

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

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          )}
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

'use client'

import {
  Users,
  BookOpen,
  AlertTriangle,
  Clock,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Flame,
  MessageSquare
} from 'lucide-react'

import { TopicCoverageData } from '../types'

interface TopicCoverageDashboardProps {
  data: TopicCoverageData
  onRefresh?: () => void
}

export default function TopicCoverageDashboard({ data, onRefresh }: TopicCoverageDashboardProps) {
  const getCoverageStyle = (level: string) => {
    switch (level) {
      case 'strong': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' }
      case 'moderate': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' }
      case 'weak': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

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
          {onRefresh && (
            <button onClick={onRefresh} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          )}
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

'use client'

import { useState } from 'react'
import { ChevronDown, FileText, Quote } from 'lucide-react'
import type { VoiceInsight, VoiceInsightType } from '@/lib/voice-lab/types'

interface InsightCardProps {
  insight: VoiceInsight
  showSourceLink?: boolean
  onViewSources?: (insightId: string) => void
}

const insightTypeConfig: Record<VoiceInsightType, { label: string; description: string; color: string; bgColor: string }> = {
  tone: { label: 'How It Sounds', description: 'Voice and attitude', color: 'text-violet-700', bgColor: 'bg-violet-100' },
  vocabulary: { label: 'Word Choices', description: 'Language patterns', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  structure: { label: 'How It Flows', description: 'Organization style', color: 'text-green-700', bgColor: 'bg-green-100' },
  rhetoric: { label: 'Persuasion Style', description: 'How it convinces', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  principle: { label: 'Writing Rules', description: 'Dos and don\'ts', color: 'text-pink-700', bgColor: 'bg-pink-100' },
}

function getConfidenceLabel(confidence: number): { label: string; width: string } {
  if (confidence >= 0.8) return { label: 'High', width: 'w-full' }
  if (confidence >= 0.6) return { label: 'Medium', width: 'w-3/4' }
  if (confidence >= 0.4) return { label: 'Low', width: 'w-1/2' }
  return { label: 'Very Low', width: 'w-1/4' }
}

export default function InsightCard({
  insight,
  showSourceLink = false,
  onViewSources,
}: InsightCardProps) {
  const [showExamples, setShowExamples] = useState(false)

  const typeConfig = insightTypeConfig[insight.insight_type] || insightTypeConfig.tone
  const confidenceInfo = getConfidenceLabel(insight.confidence)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded ${typeConfig.bgColor} ${typeConfig.color}`}>
          {typeConfig.label}
        </span>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>{insight.sample_count} samples</span>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Confidence:</span>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-violet-500 rounded-full ${confidenceInfo.width}`}
                style={{ width: `${Math.round(insight.confidence * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-700">
        {insight.content}
      </p>

      {/* Examples accordion */}
      {insight.examples && insight.examples.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800"
          >
            <Quote className="w-3.5 h-3.5" />
            {insight.examples.length} example{insight.examples.length !== 1 ? 's' : ''}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExamples ? 'rotate-180' : ''}`} />
          </button>

          {showExamples && (
            <div className="mt-2 space-y-2">
              {insight.examples.map((example, idx) => (
                <blockquote
                  key={idx}
                  className="text-xs text-gray-600 pl-3 border-l-2 border-gray-200 italic"
                >
                  "{example}"
                </blockquote>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Source link */}
      {showSourceLink && insight.sample_count > 0 && onViewSources && (
        <button
          onClick={() => onViewSources(insight.id)}
          className="mt-3 inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700"
        >
          <FileText className="w-3.5 h-3.5" />
          See source samples
        </button>
      )}
    </div>
  )
}

/**
 * Group insights by type for display
 */
export function groupInsightsByType(insights: VoiceInsight[]): Record<VoiceInsightType, VoiceInsight[]> {
  const grouped: Record<VoiceInsightType, VoiceInsight[]> = {
    tone: [],
    vocabulary: [],
    structure: [],
    rhetoric: [],
    principle: [],
  }

  for (const insight of insights) {
    const type = insight.insight_type as VoiceInsightType
    if (type in grouped) {
      grouped[type].push(insight)
    }
  }

  return grouped
}

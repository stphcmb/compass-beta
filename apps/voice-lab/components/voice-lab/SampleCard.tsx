'use client'

import { useState } from 'react'
import { FileText, Trash2, Eye, Lightbulb, ChevronDown } from 'lucide-react'
import type { VoiceSample, VoiceSampleCategory } from '@/lib/voice-lab/types'

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

interface SampleCardProps {
  sample: VoiceSample
  insightCount?: number
  onDelete?: (sampleId: string) => void
  onViewInsights?: (sampleId: string) => void
  onCategoryChange?: (sampleId: string, category: VoiceSampleCategory | null) => void
}

const CATEGORIES: { value: VoiceSampleCategory | 'none'; label: string }[] = [
  { value: 'none', label: 'No category' },
  { value: 'case-study', label: 'Case Study' },
  { value: 'blog', label: 'Blog Post' },
  { value: 'email', label: 'Email' },
  { value: 'social', label: 'Social Media' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Other' },
]

function getQualityLabel(score: number): { label: string; color: string } {
  if (score >= 0.8) return { label: 'High quality', color: 'text-green-600' }
  if (score >= 0.5) return { label: 'Good quality', color: 'text-blue-600' }
  return { label: 'Low quality', color: 'text-amber-600' }
}

export default function SampleCard({
  sample,
  insightCount = 0,
  onDelete,
  onViewInsights,
  onCategoryChange,
}: SampleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const quality = getQualityLabel(sample.quality_score)
  const createdAgo = formatTimeAgo(sample.created_at)

  const handleDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(sample.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!onCategoryChange) return
    const value = e.target.value
    onCategoryChange(sample.id, value === 'none' ? null : value as VoiceSampleCategory)
  }

  // Truncated preview of content
  const previewText = sample.content.length > 150
    ? sample.content.slice(0, 150) + '...'
    : sample.content

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
          <FileText className="w-4 h-4 text-gray-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Preview or full text */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-left w-full group"
          >
            <p className={`text-sm text-gray-700 ${isExpanded ? '' : 'line-clamp-2'}`}>
              "{isExpanded ? sample.content : previewText}"
            </p>
            {sample.content.length > 150 && (
              <span className="text-xs text-violet-600 hover:text-violet-700 mt-1 inline-flex items-center gap-1">
                {isExpanded ? 'Show less' : 'Show more'}
                <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </span>
            )}
          </button>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
            <span>{sample.word_count} words</span>
            <span className={quality.color}>{quality.label}</span>
            {sample.source_name && (
              <span className="truncate max-w-[120px]">{sample.source_name}</span>
            )}
            <span>{createdAgo}</span>
          </div>

          {/* Category and actions row */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {/* Category dropdown */}
            <select
              value={sample.category || 'none'}
              onChange={handleCategoryChange}
              disabled={!onCategoryChange}
              className="text-xs px-2 py-1 rounded border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Insight count */}
            {insightCount > 0 && (
              <button
                onClick={() => onViewInsights?.(sample.id)}
                className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                {insightCount} insights extracted
              </button>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Actions */}
            {onViewInsights && insightCount > 0 && (
              <button
                onClick={() => onViewInsights(sample.id)}
                aria-label="View insights for this sample"
                className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100"
              >
                <Eye aria-hidden="true" className="w-3.5 h-3.5" />
              </button>
            )}

            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                aria-label="Delete this sample"
                className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Notes (if any) */}
          {sample.notes && (
            <p className="text-xs text-gray-600 mt-2 italic">
              Note: {sample.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

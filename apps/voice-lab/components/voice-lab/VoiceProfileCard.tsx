'use client'

import Link from 'next/link'
import { Mic, FileText, Lightbulb, ArrowRight, Check } from 'lucide-react'
import type { VoiceProfile, VoiceTrainingStatus } from '@/lib/voice-lab/types'

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

interface VoiceProfileCardProps {
  profile: VoiceProfile
  onApplyVoice?: (profileId: string) => void
}

const statusConfig: Record<VoiceTrainingStatus, { label: string; color: string; bgColor: string }> = {
  ready: { label: 'Ready', color: 'text-green-700', bgColor: 'bg-green-100' },
  processing: { label: 'Processing', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  needs_update: { label: 'Needs Update', color: 'text-blue-700', bgColor: 'bg-blue-100' },
}

export default function VoiceProfileCard({ profile, onApplyVoice }: VoiceProfileCardProps) {
  const status = statusConfig[profile.training_status] || statusConfig.ready
  const updatedAgo = formatTimeAgo(profile.updated_at)

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-violet-300 hover:shadow-sm transition-all p-4">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Icon and content */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
            <Mic className="w-5 h-5 text-violet-600" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-gray-900 truncate">
                {profile.name}
              </h3>
              {profile.is_active && (
                <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                  <Check className="w-3 h-3" />
                  Active
                </span>
              )}
            </div>

            {profile.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {profile.description}
              </p>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {profile.sample_count} samples
              </span>
              <span className="flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                {profile.insight_count} patterns
              </span>
              <span>Updated {updatedAgo}</span>
            </div>

            {/* Labels */}
            {profile.labels && profile.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {profile.labels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Status and actions */}
        <div className="flex flex-col items-end gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${status.bgColor} ${status.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status.label}
          </span>

          <div className="flex items-center gap-2 mt-auto">
            <Link
              href={`/library/${profile.slug || profile.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:outline-none"
            >
              View
            </Link>
            {onApplyVoice && (
              <button
                onClick={() => onApplyVoice(profile.id)}
                className="text-sm text-violet-600 hover:text-violet-700 px-3 py-1.5 rounded-md hover:bg-violet-50 transition-colors flex items-center gap-1 focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:outline-none"
              >
                Apply Voice
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

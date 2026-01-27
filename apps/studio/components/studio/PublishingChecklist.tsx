'use client'

import { CheckCircle, XCircle, AlertCircle, Sparkles } from 'lucide-react'

interface PublishingChecklistProps {
  wordCount: number
  wordTarget: { min: number; max: number } | null
  voiceScore: number | null
  briefCoverage: { covered: number; total: number } | null
  citationCount: number
  className?: string
}

type CheckStatus = 'complete' | 'incomplete' | 'warning'

interface CheckItem {
  label: string
  status: CheckStatus
  detail: string
  optional?: boolean
}

/**
 * Publishing readiness checklist
 * Shows progress toward publication-ready content
 */
export default function PublishingChecklist({
  wordCount,
  wordTarget,
  voiceScore,
  briefCoverage,
  citationCount,
  className = '',
}: PublishingChecklistProps) {
  // Build checklist items
  const checks: CheckItem[] = []

  // Word count check
  if (wordTarget) {
    const wordStatus: CheckStatus =
      wordCount >= wordTarget.min && wordCount <= wordTarget.max
        ? 'complete'
        : wordCount < wordTarget.min
        ? 'incomplete'
        : 'warning'
    checks.push({
      label: 'Word count',
      status: wordStatus,
      detail:
        wordStatus === 'complete'
          ? `${wordCount} words (on target)`
          : wordStatus === 'incomplete'
          ? `${wordCount}/${wordTarget.min} min words`
          : `${wordCount} words (over ${wordTarget.max} max)`,
    })
  }

  // Voice score check (>70 is passing)
  if (voiceScore !== null) {
    const voiceStatus: CheckStatus =
      voiceScore >= 70 ? 'complete' : voiceScore >= 50 ? 'warning' : 'incomplete'
    checks.push({
      label: 'Voice consistency',
      status: voiceStatus,
      detail: `${voiceScore}%${voiceScore >= 70 ? '' : ' (aim for >70%)'}`,
    })
  } else {
    checks.push({
      label: 'Voice consistency',
      status: 'incomplete',
      detail: 'Not checked yet',
    })
  }

  // Brief coverage check (>75% is passing)
  if (briefCoverage && briefCoverage.total > 0) {
    const coveragePercent = Math.round((briefCoverage.covered / briefCoverage.total) * 100)
    const briefStatus: CheckStatus =
      coveragePercent >= 75 ? 'complete' : coveragePercent >= 50 ? 'warning' : 'incomplete'
    checks.push({
      label: 'Key points covered',
      status: briefStatus,
      detail: `${briefCoverage.covered}/${briefCoverage.total} points (${coveragePercent}%)`,
    })
  } else {
    checks.push({
      label: 'Key points covered',
      status: 'incomplete',
      detail: 'Not checked yet',
    })
  }

  // Citations (optional)
  checks.push({
    label: 'Citations added',
    status: citationCount > 0 ? 'complete' : 'incomplete',
    detail: citationCount > 0 ? `${citationCount} source${citationCount > 1 ? 's' : ''}` : 'None yet',
    optional: true,
  })

  // Calculate overall readiness
  const requiredChecks = checks.filter((c) => !c.optional)
  const completedRequired = requiredChecks.filter((c) => c.status === 'complete').length
  const isReady = completedRequired === requiredChecks.length

  const getStatusIcon = (status: CheckStatus, optional?: boolean) => {
    if (status === 'complete') {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
    if (status === 'warning') {
      return <AlertCircle className="w-4 h-4 text-amber-500" />
    }
    if (optional) {
      return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
    }
    return <XCircle className="w-4 h-4 text-red-400" />
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-500" />
          Publishing Readiness
        </h3>
        {isReady ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Ready
          </span>
        ) : (
          <span className="text-xs text-gray-500">
            {completedRequired}/{requiredChecks.length} complete
          </span>
        )}
      </div>

      <div className="space-y-2">
        {checks.map((check, i) => (
          <div
            key={i}
            className={`flex items-center justify-between py-1.5 ${
              check.optional ? 'opacity-70' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              {getStatusIcon(check.status, check.optional)}
              <span className="text-sm text-gray-700">
                {check.label}
                {check.optional && (
                  <span className="text-xs text-gray-400 ml-1">(optional)</span>
                )}
              </span>
            </div>
            <span
              className={`text-xs ${
                check.status === 'complete'
                  ? 'text-green-600'
                  : check.status === 'warning'
                  ? 'text-amber-600'
                  : 'text-gray-500'
              }`}
            >
              {check.detail}
            </span>
          </div>
        ))}
      </div>

      {isReady && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-green-600 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Your content meets all publishing criteria
          </p>
        </div>
      )}
    </div>
  )
}

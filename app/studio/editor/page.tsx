'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  PenTool,
  Loader2,
  Save,
  Check,
  AlertCircle,
  Mic,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Download,
  Clock,
  Sparkles,
} from 'lucide-react'
import type {
  Project,
  VoiceCheckResult,
  BriefCoverageResult,
  CanonCheckResult,
} from '@/lib/studio/types'

function EditorPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')

  // Project state
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Editor state
  const [content, setContent] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Analysis state
  const [analyzing, setAnalyzing] = useState(false)
  const [voiceCheck, setVoiceCheck] = useState<VoiceCheckResult | null>(null)
  const [briefCoverage, setBriefCoverage] = useState<BriefCoverageResult | null>(null)
  const [canonCheck, setCanonCheck] = useState<CanonCheckResult | null>(null)

  // Copy state
  const [copied, setCopied] = useState(false)

  // Load project
  useEffect(() => {
    if (!projectId) {
      setError('No project specified')
      setLoading(false)
      return
    }

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/studio/projects/${projectId}`)
        if (!res.ok) {
          if (res.status === 404) throw new Error('Project not found')
          throw new Error('Failed to load project')
        }
        const data = await res.json()
        setProject(data.project)
        setContent(data.project.current_draft || '')

        // Load existing check results
        if (data.project.last_voice_check) setVoiceCheck(data.project.last_voice_check)
        if (data.project.last_brief_coverage) setBriefCoverage(data.project.last_brief_coverage)
        if (data.project.last_canon_check) setCanonCheck(data.project.last_canon_check)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [projectId])

  // Track changes
  useEffect(() => {
    if (project) {
      setHasChanges(content !== (project.current_draft || ''))
    }
  }, [content, project])

  // Save content
  const handleSave = useCallback(async (createVersion = true) => {
    if (!projectId || !hasChanges) return

    setSaving(true)
    try {
      const url = createVersion
        ? `/api/studio/projects/${projectId}?create_version=true&change_source=user_edit`
        : `/api/studio/projects/${projectId}`

      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_draft: content,
          status: 'editing',
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      const data = await res.json()
      setProject(data.project)
      setHasChanges(false)
      setLastSaved(new Date())
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }, [projectId, content, hasChanges])

  // Auto-save on blur (without creating version)
  const handleBlur = useCallback(() => {
    if (hasChanges) {
      handleSave(false)
    }
  }, [hasChanges, handleSave])

  // Run analysis
  const runAnalysis = async (checks: { voice?: boolean; brief_coverage?: boolean; canon?: boolean }) => {
    if (!projectId) return

    setAnalyzing(true)
    try {
      const res = await fetch(`/api/studio/editor/analyze?save=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          content,
          checks,
        }),
      })

      if (!res.ok) throw new Error('Analysis failed')

      const data = await res.json()
      if (data.voice_check) setVoiceCheck(data.voice_check)
      if (data.brief_coverage) setBriefCoverage(data.brief_coverage)
      if (data.canon_check) setCanonCheck(data.canon_check)
    } catch (err) {
      console.error('Analysis failed:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  // Run all automatic checks
  const runAutoChecks = () => {
    runAnalysis({ voice: true, brief_coverage: true })
  }

  // Copy to clipboard
  const copyContent = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Export / mark complete
  const handleExport = async () => {
    if (!projectId) return

    // Save first
    if (hasChanges) {
      await handleSave(true)
    }

    // Mark as complete
    await fetch(`/api/studio/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'complete' }),
    })

    // Copy to clipboard
    await copyContent()
    alert('Content copied to clipboard and project marked as complete!')
  }

  // Word count
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-red-900 mb-2">
            {error || 'Project not found'}
          </h2>
          <button
            onClick={() => router.push('/studio/projects')}
            className="text-red-600 hover:text-red-700 underline"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            {project.title || 'Untitled Project'}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {project.format && (
              <span className="capitalize">{project.format}</span>
            )}
            <span>{wordCount} words</span>
            {lastSaved && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(true)}
            disabled={!hasChanges || saving}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${hasChanges
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : hasChanges ? (
              <Save className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : hasChanges ? 'Save' : 'Saved'}
          </button>

          <button
            onClick={copyContent}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <PenTool className="w-4 h-4" />
                <span>Editor</span>
              </div>
              {project.voice_profile_id && (
                <div className="flex items-center gap-1 text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
                  <Mic className="w-3 h-3" />
                  Voice Applied
                </div>
              )}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleBlur}
              placeholder="Start writing or generate content..."
              className="w-full min-h-[500px] p-6 text-gray-900 leading-relaxed resize-none focus:outline-none"
              style={{ fontSize: '1.05rem' }}
            />
          </div>
        </div>

        {/* Intelligence Panel */}
        <div className="space-y-4">
          {/* Analysis Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Intelligence Panel</h3>
              <button
                onClick={runAutoChecks}
                disabled={analyzing}
                className="flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700"
              >
                {analyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Run Checks
              </button>
            </div>

            {/* Voice Check */}
            <VoiceCheckPanel
              result={voiceCheck}
              onRunCheck={() => runAnalysis({ voice: true })}
              analyzing={analyzing}
            />

            {/* Brief Coverage */}
            <BriefCoveragePanel
              result={briefCoverage}
              keyPoints={project.key_points || []}
              onRunCheck={() => runAnalysis({ brief_coverage: true })}
              analyzing={analyzing}
            />

            {/* Canon Check */}
            <CanonCheckPanel
              result={canonCheck}
              onRunCheck={() => runAnalysis({ canon: true })}
              analyzing={analyzing}
            />
          </div>

          {/* Brief Summary */}
          {project.key_points && project.key_points.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-3">Brief</h3>
              <ul className="space-y-2">
                {project.key_points.map((point, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-violet-500 mt-0.5">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Voice Check Panel Component
function VoiceCheckPanel({
  result,
  onRunCheck,
  analyzing,
}: {
  result: VoiceCheckResult | null
  onRunCheck: () => void
  analyzing: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-medium text-gray-900">Voice Check</span>
        </div>
        <div className="flex items-center gap-2">
          {result ? (
            <span className={`text-sm font-medium ${
              result.score >= 80 ? 'text-green-600' :
              result.score >= 60 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {result.score}%
            </span>
          ) : (
            <span className="text-xs text-gray-400">Not run</span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {result ? (
            <>
              {/* Score Bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    result.score >= 80 ? 'bg-green-500' :
                    result.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="space-y-2">
                  {result.suggestions.slice(0, 3).map((suggestion, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm">
                      <p className="text-gray-500 text-xs mb-1">{suggestion.location}</p>
                      <p className="text-gray-700 mb-2">{suggestion.issue}</p>
                      <div className="flex items-start gap-2">
                        <span className="text-red-500 line-through text-xs">{suggestion.original}</span>
                        <span className="text-green-600 text-xs">→ {suggestion.suggested}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <button
              onClick={onRunCheck}
              disabled={analyzing}
              className="w-full py-2 text-sm text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
            >
              Run Voice Check
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Brief Coverage Panel Component
function BriefCoveragePanel({
  result,
  keyPoints,
  onRunCheck,
  analyzing,
}: {
  result: BriefCoverageResult | null
  keyPoints: string[]
  onRunCheck: () => void
  analyzing: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  const coveredCount = result?.covered.length || 0
  const totalCount = keyPoints.length

  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900">Brief Coverage</span>
        </div>
        <div className="flex items-center gap-2">
          {result ? (
            <span className={`text-sm font-medium ${
              coveredCount === totalCount ? 'text-green-600' :
              coveredCount > 0 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {coveredCount}/{totalCount}
            </span>
          ) : (
            <span className="text-xs text-gray-400">Not run</span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          {result ? (
            <>
              {result.covered.map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{point}</span>
                </div>
              ))}
              {result.missing.map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{point}</span>
                </div>
              ))}
            </>
          ) : keyPoints.length > 0 ? (
            <button
              onClick={onRunCheck}
              disabled={analyzing}
              className="w-full py-2 text-sm text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
            >
              Check Coverage
            </button>
          ) : (
            <p className="text-sm text-gray-400">No key points in brief</p>
          )}
        </div>
      )}
    </div>
  )
}

// Canon Check Panel Component
function CanonCheckPanel({
  result,
  onRunCheck,
  analyzing,
}: {
  result: CanonCheckResult | null
  onRunCheck: () => void
  analyzing: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-gray-900">Positioning</span>
        </div>
        <div className="flex items-center gap-2">
          {result ? (
            <span className="text-sm text-indigo-600">
              {result.matched_camps.length} camps
            </span>
          ) : (
            <span className="text-xs text-gray-400">Optional</span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-3">
          {result ? (
            <div className="space-y-2">
              {result.matched_camps.map((camp, i) => (
                <div key={i} className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-indigo-900">{camp.camp}</p>
                  <p className="text-xs text-indigo-600 mt-1">
                    {camp.authors.slice(0, 3).join(', ')}
                    {camp.authors.length > 3 && ` +${camp.authors.length - 3} more`}
                  </p>
                </div>
              ))}
              {result.missing_perspectives.length > 0 && (
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-amber-700 mb-1">Missing perspectives:</p>
                  {result.missing_perspectives.slice(0, 2).map((p, i) => (
                    <p key={i} className="text-xs text-amber-600">{p.reason}</p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-xs text-gray-500 mb-2">
                Validate against 200+ thought leaders
              </p>
              <button
                onClick={onRunCheck}
                disabled={analyzing}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300"
              >
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  'Run Canon Check'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    }>
      <EditorPageContent />
    </Suspense>
  )
}

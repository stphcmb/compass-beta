'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  PenTool,
  Loader2,
  Save,
  Check,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Download,
  Clock,
  Users,
  FileText,
  Target,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
} from 'lucide-react'
import type {
  Project,
  VoiceCheckResult,
  BriefCoverageResult,
  CanonCheckResult,
} from '@/lib/studio/types'

// Citation type
interface Citation {
  id: string
  authorName: string
  authorSlug?: string
  quote: string
  position?: string
  addedAt: Date
}

// Workflow stages
type WorkflowStage = 'write' | 'check' | 'cite' | 'export'

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

  // Citations state
  const [citations, setCitations] = useState<Citation[]>([])

  // UI state
  const [briefExpanded, setBriefExpanded] = useState(true)

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

  // Run all checks
  const runAllChecks = () => {
    runAnalysis({ voice: true, brief_coverage: true, canon: true })
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

    if (hasChanges) {
      await handleSave(true)
    }

    await fetch(`/api/studio/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'complete' }),
    })

    await copyContent()
    alert('Content copied to clipboard and project marked as complete!')
  }

  // Citation handlers
  const handleAddCitation = (authorName: string, authorSlug?: string, quote?: string, position?: string) => {
    // Check if already cited
    if (citations.some(c => c.authorName.toLowerCase() === authorName.toLowerCase())) {
      return
    }
    const newCitation: Citation = {
      id: `cite-${Date.now()}`,
      authorName,
      authorSlug,
      quote: quote || '',
      position,
      addedAt: new Date(),
    }
    setCitations(prev => [...prev, newCitation])
  }

  const handleRemoveCitation = (id: string) => {
    setCitations(prev => prev.filter(c => c.id !== id))
  }

  // Word count
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  // Calculate workflow stage
  const getWorkflowStage = (): WorkflowStage => {
    if (project?.status === 'complete') return 'export'
    if (citations.length > 0) return 'cite'
    if (voiceCheck || briefCoverage || canonCheck) return 'check'
    return 'write'
  }

  // Calculate health score
  const getHealthScore = () => {
    let total = 0
    let count = 0

    if (voiceCheck) {
      total += voiceCheck.score
      count++
    }
    if (briefCoverage && project?.key_points?.length) {
      const briefScore = (briefCoverage.covered.length / project.key_points.length) * 100
      total += briefScore
      count++
    }

    return count > 0 ? Math.round(total / count) : null
  }

  const currentStage = getWorkflowStage()
  const healthScore = getHealthScore()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    )
  }

  if (error || !project) {
    const isNotFound = error === 'Project not found' || error === 'No project specified'
    return (
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <div className={`${isNotFound ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'} border rounded-xl p-8 text-center`}>
          <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isNotFound ? 'text-gray-400' : 'text-red-400'}`} />
          <h2 className={`text-lg font-medium mb-2 ${isNotFound ? 'text-gray-900' : 'text-red-900'}`}>
            {error === 'No project specified' ? 'No Project Selected' : error || 'Project not found'}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {isNotFound
              ? 'Select a project from your list or create new content to get started.'
              : 'There was a problem loading your project. Please try again.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => router.push('/studio/projects')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              View Projects
            </button>
            <button
              onClick={() => router.push('/studio/builder')}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700"
            >
              Create New Content
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {project.title || 'Untitled Project'}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
            {project.format && (
              <span className="capitalize bg-gray-100 px-2 py-0.5 rounded">{project.format}</span>
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(true)}
            disabled={!hasChanges || saving}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              hasChanges
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : hasChanges ? <Save className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving...' : hasChanges ? 'Save' : 'Saved'}
          </button>

          <button
            onClick={copyContent}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Brief Section (Collapsible, at top) */}
      {project.key_points && project.key_points.length > 0 && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl mb-4 overflow-hidden">
          <button
            onClick={() => setBriefExpanded(!briefExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-violet-100/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-600" />
              <span className="font-medium text-gray-900">Your Brief</span>
              <span className="text-xs text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">
                {project.key_points.length} key points
              </span>
            </div>
            {briefExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {briefExpanded && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {project.format && (
                  <span className="text-xs bg-white border border-violet-200 text-violet-700 px-2 py-1 rounded">
                    {project.format}
                  </span>
                )}
                {project.audience && (
                  <span className="text-xs bg-white border border-violet-200 text-violet-700 px-2 py-1 rounded">
                    Audience: {project.audience}
                  </span>
                )}
                {project.voice_profile_id && (
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded">
                    Voice profile applied
                  </span>
                )}
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.key_points.map((point, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2 bg-white rounded-lg px-3 py-2 border border-violet-100">
                    <Target className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Progress:</span>
          <div className="flex items-center gap-1">
            {(['write', 'check', 'cite', 'export'] as WorkflowStage[]).map((stage, i) => (
              <div key={stage} className="flex items-center">
                <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                  currentStage === stage
                    ? 'bg-violet-100 text-violet-700 font-medium'
                    : i < ['write', 'check', 'cite', 'export'].indexOf(currentStage)
                      ? 'text-green-600'
                      : 'text-gray-400'
                }`}>
                  {i < ['write', 'check', 'cite', 'export'].indexOf(currentStage) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : currentStage === stage ? (
                    <div className="w-2 h-2 bg-violet-500 rounded-full" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  )}
                  <span className="capitalize">{stage}</span>
                </div>
                {i < 3 && <div className="w-4 h-px bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Editor - Takes more space */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full">
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PenTool className="w-4 h-4" />
                <span className="font-medium">Draft</span>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleBlur}
              placeholder="Start writing your content here..."
              className="w-full min-h-[550px] p-6 text-gray-900 leading-relaxed resize-none focus:outline-none"
              style={{ fontSize: '1.05rem' }}
            />
          </div>
        </div>

        {/* Feedback Panel - Compact */}
        <div className="lg:col-span-2 space-y-4">
          {/* Health & Checks */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-gray-900">Feedback</h3>
                {healthScore !== null && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          healthScore >= 80 ? 'bg-green-500' :
                          healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${healthScore}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      healthScore >= 80 ? 'text-green-600' :
                      healthScore >= 60 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {healthScore}%
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={runAllChecks}
                disabled={analyzing || wordCount < 20}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {analyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {analyzing ? 'Checking...' : 'Run Checks'}
              </button>
            </div>

            {wordCount < 20 && (
              <p className="text-sm text-gray-500 mb-4 bg-gray-50 rounded-lg p-3">
                Add at least 20 words to run checks on your content.
              </p>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <PenTool className="w-4 h-4 text-violet-500" />
                  <span className="text-xs text-gray-500">Voice</span>
                </div>
                <span className={`text-lg font-semibold ${
                  voiceCheck
                    ? voiceCheck.score >= 80 ? 'text-green-600' : voiceCheck.score >= 60 ? 'text-amber-600' : 'text-red-600'
                    : 'text-gray-400'
                }`}>
                  {voiceCheck ? `${voiceCheck.score}%` : '—'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-500">Brief</span>
                </div>
                <span className={`text-lg font-semibold ${
                  briefCoverage
                    ? briefCoverage.covered.length === project.key_points?.length ? 'text-green-600' : 'text-amber-600'
                    : 'text-gray-400'
                }`}>
                  {briefCoverage ? `${briefCoverage.covered.length}/${project.key_points?.length || 0}` : '—'}
                </span>
              </div>
            </div>

            {/* Voice Suggestions */}
            {voiceCheck && voiceCheck.suggestions.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Voice suggestions:</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {voiceCheck.suggestions.slice(0, 2).map((s, i) => (
                    <div key={i} className="bg-amber-50 border border-amber-100 rounded-lg p-2 text-xs">
                      <p className="text-amber-800 mb-1">{s.issue}</p>
                      <p className="text-amber-600">
                        <span className="line-through">{s.original}</span>
                        <span className="text-green-600 ml-2">→ {s.suggested}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brief Missing Points */}
            {briefCoverage && briefCoverage.missing.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Missing from brief:</p>
                <div className="space-y-1">
                  {briefCoverage.missing.map((point, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-red-600 bg-red-50 rounded-lg p-2">
                      <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Perspectives & Citations (Consolidated) */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <h3 className="font-medium text-gray-900">Perspectives</h3>
              </div>
              {!canonCheck && (
                <button
                  onClick={() => runAnalysis({ canon: true })}
                  disabled={analyzing || wordCount < 20}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Find experts
                </button>
              )}
            </div>

            {canonCheck ? (
              <div className="space-y-3">
                {/* Matched camps with cite buttons */}
                {canonCheck.matched_camps.map((camp, i) => (
                  <div key={i} className="bg-indigo-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-indigo-900 mb-2">{camp.camp}</p>
                    <div className="space-y-1">
                      {camp.authors.slice(0, 3).map((author, j) => {
                        const isCited = citations.some(c => c.authorName.toLowerCase() === author.toLowerCase())
                        return (
                          <div key={j} className="flex items-center justify-between bg-white rounded px-2 py-1">
                            <span className="text-xs text-gray-700">{author}</span>
                            {isCited ? (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Cited</span>
                            ) : (
                              <button
                                onClick={() => handleAddCitation(author)}
                                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
                              >
                                <Plus className="w-3 h-3" />
                                Cite
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Missing perspectives */}
                {canonCheck.missing_perspectives.length > 0 && (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-amber-700 mb-2">Consider adding:</p>
                    {canonCheck.missing_perspectives.slice(0, 2).map((p, i) => (
                      <p key={i} className="text-xs text-amber-600 mb-1">{p.reason}</p>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => runAnalysis({ canon: true })}
                  disabled={analyzing}
                  className="w-full text-xs text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg transition-colors"
                >
                  {analyzing ? 'Searching...' : 'Search again'}
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Run checks to find thought leaders who support your key points.
              </p>
            )}
          </div>

          {/* Sources Panel */}
          {citations.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <h3 className="font-medium text-gray-900">Sources</h3>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {citations.length}
                </span>
              </div>
              <div className="space-y-2">
                {citations.map((citation) => (
                  <div key={citation.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 group">
                    <div className="flex items-center gap-2">
                      {citation.authorSlug ? (
                        <Link
                          href={`/authors/${citation.authorSlug}`}
                          target="_blank"
                          className="text-sm font-medium text-gray-900 hover:text-emerald-600 flex items-center gap-1"
                        >
                          {citation.authorName}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{citation.authorName}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveCitation(citation.id)}
                      className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
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

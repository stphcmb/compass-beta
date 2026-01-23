'use client'

import { useState, useEffect, useCallback, Suspense, useRef, useMemo } from 'react'
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
  Sparkles,
  Wand2,
  History,
  RotateCcw,
  Edit3,
  X,
  Keyboard,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useToast } from '@/components/Toast'
import type {
  Project,
  ProjectDraft,
  VoiceCheckResult,
  BriefCoverageResult,
  CanonCheckResult,
  Citation,
} from '@/lib/studio/types'

// Word count targets by format
const FORMAT_WORD_TARGETS: Record<string, { min: number; max: number }> = {
  blog: { min: 800, max: 1200 },
  linkedin: { min: 150, max: 300 },
  memo: { min: 300, max: 500 },
  byline: { min: 600, max: 900 },
}

// Workflow stages
type WorkflowStage = 'write' | 'check' | 'cite' | 'export'

function EditorPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const { showToast } = useToast()

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

  // Citations state (persisted to DB)
  const [citations, setCitations] = useState<Citation[]>([])
  const [citationsChanged, setCitationsChanged] = useState(false)

  // Regenerate state
  const [regenerating, setRegenerating] = useState(false)
  const [showRegenerateInput, setShowRegenerateInput] = useState(false)
  const [regenerateFeedback, setRegenerateFeedback] = useState('')

  // Version history state
  const [drafts, setDrafts] = useState<ProjectDraft[]>([])
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [loadingDrafts, setLoadingDrafts] = useState(false)
  const [restoringVersion, setRestoringVersion] = useState<number | null>(null)

  // Edit brief modal state
  const [showEditBrief, setShowEditBrief] = useState(false)
  const [editingKeyPoints, setEditingKeyPoints] = useState<string[]>([])
  const [editingAudience, setEditingAudience] = useState('')
  const [savingBrief, setSavingBrief] = useState(false)

  // UI state
  const [briefExpanded, setBriefExpanded] = useState(false) // Default collapsed
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)

  // Load brief expanded state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('studio-brief-expanded')
    if (savedState !== null) {
      setBriefExpanded(savedState === 'true')
    }
  }, [])

  // Save brief expanded state to localStorage
  const toggleBriefExpanded = () => {
    const newState = !briefExpanded
    setBriefExpanded(newState)
    localStorage.setItem('studio-brief-expanded', String(newState))
  }

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

        // Load citations
        if (data.project.citations && Array.isArray(data.project.citations)) {
          setCitations(data.project.citations)
        }
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

  // Debounced word count calculation
  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length
  }, [content])

  // Fetch version history
  const fetchDrafts = async () => {
    if (!projectId) return
    setLoadingDrafts(true)
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/drafts`)
      if (res.ok) {
        const data = await res.json()
        setDrafts(data.drafts || [])
      }
    } catch (err) {
      console.error('Failed to fetch drafts:', err)
    } finally {
      setLoadingDrafts(false)
    }
  }

  // Restore a specific version
  const restoreVersion = async (version: number) => {
    if (!projectId) return
    setRestoringVersion(version)
    try {
      const draft = drafts.find(d => d.version === version)
      if (!draft) throw new Error('Draft not found')

      // Update content and save as new version
      setContent(draft.content)

      const res = await fetch(`/api/studio/projects/${projectId}?create_version=true&change_source=user_edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_draft: draft.content,
          status: 'editing',
        }),
      })

      if (!res.ok) throw new Error('Failed to restore version')

      const data = await res.json()
      setProject(data.project)
      setHasChanges(false)
      setShowVersionHistory(false)
      showToast(`Restored version ${version}`, 'success')

      // Clear checks since content changed
      setVoiceCheck(null)
      setBriefCoverage(null)
      setCanonCheck(null)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to restore version', 'error')
    } finally {
      setRestoringVersion(null)
    }
  }

  // Open edit brief modal
  const openEditBrief = () => {
    if (project) {
      setEditingKeyPoints(project.key_points || [''])
      setEditingAudience(project.audience || '')
      setShowEditBrief(true)
    }
  }

  // Save brief changes
  const saveBriefChanges = async () => {
    if (!projectId) return
    setSavingBrief(true)
    try {
      const validKeyPoints = editingKeyPoints.filter(p => p.trim())
      const res = await fetch(`/api/studio/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key_points: validKeyPoints,
          audience: editingAudience.trim() || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to update brief')

      const data = await res.json()
      setProject(data.project)
      setShowEditBrief(false)
      showToast('Brief updated', 'success')

      // Clear brief coverage check since brief changed
      setBriefCoverage(null)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update brief', 'error')
    } finally {
      setSavingBrief(false)
    }
  }

  // Save content and citations
  const handleSave = useCallback(async (createVersion = true) => {
    if (!projectId || (!hasChanges && !citationsChanged)) return

    setSaving(true)
    try {
      const url = createVersion
        ? `/api/studio/projects/${projectId}?create_version=true&change_source=user_edit`
        : `/api/studio/projects/${projectId}`

      const body: Record<string, unknown> = {
        status: 'editing',
      }
      if (hasChanges) {
        body.current_draft = content
      }
      if (citationsChanged) {
        body.citations = citations
      }

      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Failed to save')

      const data = await res.json()
      setProject(data.project)
      setHasChanges(false)
      setCitationsChanged(false)
      setLastSaved(new Date())
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }, [projectId, content, hasChanges, citations, citationsChanged, showToast])

  // Auto-save on blur (without creating version)
  const handleBlur = useCallback(async () => {
    if (hasChanges || citationsChanged) {
      setAutoSaving(true)
      await handleSave(false)
      setAutoSaving(false)
    }
  }, [hasChanges, citationsChanged, handleSave])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (hasChanges || citationsChanged) {
          handleSave(true)
        }
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        if (showVersionHistory) setShowVersionHistory(false)
        if (showEditBrief) setShowEditBrief(false)
        if (showRegenerateInput) setShowRegenerateInput(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasChanges, citationsChanged, handleSave, showVersionHistory, showEditBrief, showRegenerateInput])

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

    if (hasChanges || citationsChanged) {
      await handleSave(true)
    }

    await fetch(`/api/studio/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'complete' }),
    })

    await copyContent()
    showToast('Content copied to clipboard and project marked as complete!', 'success')
  }

  // Regenerate content with feedback
  const handleRegenerate = async () => {
    if (!projectId || !project || !regenerateFeedback.trim()) return

    setRegenerating(true)
    try {
      const feedbackParam = encodeURIComponent(regenerateFeedback)
      const res = await fetch(`/api/studio/content/generate?regenerate=true&feedback=${feedbackParam}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          brief: {
            title: project.title || '',
            format: project.format || 'blog',
            audience: project.audience || '',
            key_points: project.key_points || [],
            additional_context: project.additional_context,
            content_domain: project.content_domain || 'ai_discourse',
          },
          voice_profile_id: project.voice_profile_id,
          skip_voice: !project.voice_profile_id,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to regenerate')
      }

      // Fetch updated project
      const projectRes = await fetch(`/api/studio/projects/${projectId}`)
      if (projectRes.ok) {
        const projectData = await projectRes.json()
        setProject(projectData.project)
        setContent(projectData.project.current_draft || '')
        setHasChanges(false)

        // Clear checks since content changed
        setVoiceCheck(null)
        setBriefCoverage(null)
        setCanonCheck(null)
      }

      setShowRegenerateInput(false)
      setRegenerateFeedback('')
      showToast('Content regenerated successfully!', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to regenerate', 'error')
    } finally {
      setRegenerating(false)
    }
  }

  // Apply voice suggestion
  const applySuggestion = (original: string, suggested: string) => {
    const newContent = content.replace(original, suggested)
    if (newContent !== content) {
      setContent(newContent)
      setHasChanges(true)
      showToast('Suggestion applied', 'success')
    } else {
      showToast('Could not find exact text to replace', 'error')
    }
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
      addedAt: new Date().toISOString(),
    }
    setCitations(prev => [...prev, newCitation])
    setCitationsChanged(true)
    showToast(`Added citation from ${authorName}`, 'success')
  }

  const handleRemoveCitation = (id: string) => {
    setCitations(prev => prev.filter(c => c.id !== id))
    setCitationsChanged(true)
  }

  // Word count target
  const wordTarget = project?.format ? FORMAT_WORD_TARGETS[project.format] : null
  const wordCountStatus = wordTarget
    ? wordCount < wordTarget.min
      ? 'below'
      : wordCount > wordTarget.max
        ? 'above'
        : 'on-target'
    : null

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
            <span className={`flex items-center gap-1 ${
              wordCountStatus === 'on-target' ? 'text-green-600' :
              wordCountStatus === 'below' ? 'text-amber-600' :
              wordCountStatus === 'above' ? 'text-red-600' : ''
            }`}>
              {wordCount}{wordTarget && ` / ${wordTarget.min}-${wordTarget.max}`} words
              {wordCountStatus === 'on-target' && <CheckCircle className="w-3.5 h-3.5" />}
            </span>
            {autoSaving ? (
              <span className="flex items-center gap-1 text-violet-600">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(true)}
            disabled={(!hasChanges && !citationsChanged) || saving}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              hasChanges || citationsChanged
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (hasChanges || citationsChanged) ? <Save className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving...' : (hasChanges || citationsChanged) ? 'Save' : 'Saved'}
          </button>

          <button
            onClick={copyContent}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            title="Copy to clipboard"
            aria-label="Copy content to clipboard"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setShowVersionHistory(true)
              fetchDrafts()
            }}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            title="Version history"
            aria-label="View version history"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            aria-label="Export and mark complete"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
        <span className="flex items-center gap-1">
          <Keyboard className="w-3 h-3" />
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">⌘S</kbd> Save
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">Esc</kbd> Close panels
        </span>
      </div>

      {/* Brief Section (Collapsible, at top) */}
      {project.key_points && project.key_points.length > 0 && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl mb-4 overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={toggleBriefExpanded}
              className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
            >
              <FileText className="w-4 h-4 text-violet-600" />
              <span className="font-medium text-gray-900">Your Brief</span>
              <span className="text-xs text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">
                {project.key_points.length} key points
              </span>
              {briefExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                openEditBrief()
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-violet-600 hover:bg-violet-100 rounded transition-colors"
              aria-label="Edit brief"
            >
              <Edit3 className="w-3 h-3" />
              Edit
            </button>
          </div>
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
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PenTool className="w-4 h-4" />
                <span className="font-medium">Draft</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    showMarkdownPreview
                      ? 'text-violet-700 bg-violet-100 hover:bg-violet-200'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                  title={showMarkdownPreview ? 'Hide preview' : 'Show preview'}
                  aria-label={showMarkdownPreview ? 'Hide markdown preview' : 'Show markdown preview'}
                >
                  {showMarkdownPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  Preview
                </button>
                <button
                  onClick={() => setShowRegenerateInput(!showRegenerateInput)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-100 hover:bg-violet-200 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Regenerate
                </button>
              </div>
            </div>

            {/* Regenerate Input */}
            {showRegenerateInput && (
              <div className="border-b border-gray-200 px-4 py-3 bg-violet-50">
                <p className="text-xs text-gray-600 mb-2">What would you like to change?</p>
                <textarea
                  value={regenerateFeedback}
                  onChange={(e) => setRegenerateFeedback(e.target.value)}
                  placeholder="e.g., Make it more conversational, add more examples, shorten the intro..."
                  className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
                  rows={2}
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={handleRegenerate}
                    disabled={regenerating || !regenerateFeedback.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 rounded-lg transition-colors"
                  >
                    {regenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    {regenerating ? 'Regenerating...' : 'Regenerate'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRegenerateInput(false)
                      setRegenerateFeedback('')
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showMarkdownPreview ? (
              <div
                className="w-full flex-1 min-h-[500px] p-6 text-gray-900 leading-relaxed overflow-y-auto prose prose-violet max-w-none"
                style={{ fontSize: '1.05rem' }}
                aria-label="Content preview"
              >
                {content ? (
                  content.split('\n').map((paragraph, i) => {
                    const trimmed = paragraph.trim()
                    if (!trimmed) return <br key={i} />
                    // Simple heading detection
                    if (trimmed.startsWith('# ')) {
                      return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{trimmed.slice(2)}</h1>
                    }
                    if (trimmed.startsWith('## ')) {
                      return <h2 key={i} className="text-xl font-bold mt-3 mb-2">{trimmed.slice(3)}</h2>
                    }
                    if (trimmed.startsWith('### ')) {
                      return <h3 key={i} className="text-lg font-semibold mt-2 mb-1">{trimmed.slice(4)}</h3>
                    }
                    // List items
                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                      return <li key={i} className="ml-4">{trimmed.slice(2)}</li>
                    }
                    // Regular paragraph with basic formatting
                    const formattedText = trimmed
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.+?)\*/g, '<em>$1</em>')
                      .replace(/_(.+?)_/g, '<em>$1</em>')
                    return <p key={i} className="mb-3" dangerouslySetInnerHTML={{ __html: formattedText }} />
                  })
                ) : (
                  <p className="text-gray-400 italic">No content to preview...</p>
                )}
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleBlur}
                placeholder="Start writing your content here..."
                className="w-full flex-1 min-h-[500px] p-6 text-gray-900 leading-relaxed resize-none focus:outline-none"
                style={{ fontSize: '1.05rem' }}
                aria-label="Content editor"
                aria-describedby="word-count-info"
              />
            )}
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
                aria-label="Run all content checks"
              >
                {analyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {analyzing ? 'Analyzing content...' : 'Run Checks'}
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
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Voice suggestions ({voiceCheck.suggestions.length}):
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {voiceCheck.suggestions.map((s, i) => (
                    <div key={i} className="bg-amber-50 border border-amber-100 rounded-lg p-2 text-xs">
                      <p className="text-amber-800 mb-1">{s.issue}</p>
                      <p className="text-amber-600 mb-2">
                        <span className="line-through">{s.original}</span>
                        <span className="text-green-600 ml-2">→ {s.suggested}</span>
                      </p>
                      <button
                        onClick={() => applySuggestion(s.original, s.suggested)}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-violet-700 bg-violet-100 hover:bg-violet-200 rounded transition-colors"
                      >
                        <Wand2 className="w-3 h-3" />
                        Apply
                      </button>
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
                      className="p-1 text-gray-400 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove citation from ${citation.authorName}`}
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

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowVersionHistory(false)}>
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-labelledby="version-history-title"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 id="version-history-title" className="font-semibold text-gray-900 flex items-center gap-2">
                <History className="w-5 h-5 text-violet-500" />
                Version History
              </h2>
              <button
                onClick={() => setShowVersionHistory(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                aria-label="Close version history"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loadingDrafts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
                </div>
              ) : drafts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No version history yet</p>
              ) : (
                <div className="space-y-2">
                  {drafts.map((draft) => (
                    <div
                      key={draft.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        draft.version === project?.current_version
                          ? 'border-violet-300 bg-violet-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">
                          Version {draft.version}
                          {draft.version === project?.current_version && (
                            <span className="ml-2 text-xs text-violet-600 bg-violet-100 px-2 py-0.5 rounded">
                              Current
                            </span>
                          )}
                        </span>
                        {draft.version !== project?.current_version && (
                          <button
                            onClick={() => restoreVersion(draft.version)}
                            disabled={restoringVersion !== null}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-violet-600 hover:bg-violet-100 rounded transition-colors disabled:opacity-50"
                          >
                            {restoringVersion === draft.version ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3 h-3" />
                            )}
                            Restore
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{draft.word_count || 0} words</span>
                        <span className="capitalize">{draft.change_source?.replace('_', ' ') || 'unknown'}</span>
                        <span>{new Date(draft.created_at).toLocaleString()}</span>
                      </div>
                      {draft.change_summary && (
                        <p className="text-xs text-gray-600 mt-1">{draft.change_summary}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Brief Modal */}
      {showEditBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowEditBrief(false)}>
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-labelledby="edit-brief-title"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 id="edit-brief-title" className="font-semibold text-gray-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-violet-500" />
                Edit Brief
              </h2>
              <button
                onClick={() => setShowEditBrief(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                aria-label="Close edit brief"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={editingAudience}
                  onChange={(e) => setEditingAudience(e.target.value)}
                  placeholder="e.g., Tech executives, Fund managers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                />
              </div>

              {/* Key Points */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Points
                </label>
                <div className="space-y-2">
                  {editingKeyPoints.map((point, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const updated = [...editingKeyPoints]
                          updated[i] = e.target.value
                          setEditingKeyPoints(updated)
                        }}
                        placeholder={`Key point ${i + 1}...`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                      />
                      {editingKeyPoints.length > 1 && (
                        <button
                          onClick={() => setEditingKeyPoints(editingKeyPoints.filter((_, idx) => idx !== i))}
                          className="p-2 text-gray-400 hover:text-red-500"
                          aria-label="Remove key point"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setEditingKeyPoints([...editingKeyPoints, ''])}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add key point
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t bg-gray-50">
              <button
                onClick={() => setShowEditBrief(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveBriefChanges}
                disabled={savingBrief}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 rounded-lg transition-colors"
              >
                {savingBrief ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>
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

'use client'

import { useRef, useEffect } from 'react'
import { ResearchAssistantAnalyzeResponse } from '@/lib/research-assistant'
import { getThoughtLeaders } from '@/lib/api/thought-leaders'
import { useToast } from '@/components/Toast'
import { useAuthorPanel } from '@/contexts/AuthorPanelContext'
import { AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react'
import { LoadingPhaseIndicator } from '@/components/research-assistant/LoadingPhaseIndicator'
import { useResearchState } from '@/hooks/useResearchState'
import { useAnalysisActions } from '@/hooks/useAnalysisActions'
import {
  LOADING_PHASES,
  STORAGE_KEYS,
  CONFIG,
  EVENTS,
  buildAuthorMap,
  formatAnalysisAsText,
  escapeRegex,
  generatePrintHTML,
} from '@/components/research-assistant/lib'
import type { ResearchAssistantProps, LoadTextEventDetail, PendingAnalysis } from '@/components/research-assistant/lib'
import {
  AnalyzedTextPreview,
  ResultsToolbar,
  SummarySection,
  EditorialSuggestionsSection,
  ThoughtLeadersSection,
  InputSection,
} from '@/components/research-assistant/components'

export default function ResearchAssistant({ showTitle = false, initialAnalysisId }: ResearchAssistantProps) {
  const { openPanel } = useAuthorPanel()
  const { showToast } = useToast()

  // Centralized state management via useResearchState hook
  const {
    state,
    dispatch,
    setText,
    setResult,
    setLoading,
    setLoadingPhase,
    setError,
    toggleSummaryLike,
    toggleCampLike,
    resetAnalysis,
    loadAnalysis,
  } = useResearchState()

  // Centralized action handlers via useAnalysisActions hook
  const actions = useAnalysisActions({ state, dispatch, showToast })

  const suggestionsRef = useRef<HTMLDivElement>(null)
  const authorsRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Check for pending analysis from home page (via sessionStorage) on mount
  useEffect(() => {
    const runPendingAnalysis = async () => {
      try {
        const pending = sessionStorage.getItem(STORAGE_KEYS.PENDING_ANALYSIS)
        if (pending) {
          const { text: pendingText, autoAnalyze, timestamp } = JSON.parse(pending) as PendingAnalysis
          // Only use if recent (within 10 seconds) to avoid stale data
          if (autoAnalyze && Date.now() - timestamp < CONFIG.PENDING_ANALYSIS_TIMEOUT) {
            sessionStorage.removeItem(STORAGE_KEYS.PENDING_ANALYSIS)
            setText(pendingText)
            setLoading(true)
            setLoadingPhase(0)
            dispatch({ type: 'SET_PENDING_FROM_HOME', payload: true })

            // Start cycling through loading phases
            const phaseTimers: NodeJS.Timeout[] = []
            let currentPhase = 0

            const advancePhase = () => {
              if (currentPhase < LOADING_PHASES.length - 1) {
                currentPhase++
                requestAnimationFrame(() => {
                  setLoadingPhase(currentPhase)
                })
                const nextDuration = LOADING_PHASES[currentPhase].duration
                if (nextDuration > 0) {
                  phaseTimers.push(setTimeout(advancePhase, nextDuration))
                }
              }
            }

            if (LOADING_PHASES[0].duration > 0) {
              phaseTimers.push(setTimeout(advancePhase, LOADING_PHASES[0].duration))
            }

            // Call the API
            try {
              const res = await fetch('/api/brain/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: pendingText }),
              })
              const data = await res.json()

              if (!res.ok) {
                phaseTimers.forEach(timer => clearTimeout(timer))
                setError(data.error || data.message || 'Analysis failed')
                setLoading(false)
                setLoadingPhase(0)
                dispatch({ type: 'SET_PENDING_FROM_HOME', payload: false })
              } else {
                // Save and show results inline
                const analysisId = actions.addToRecentSearches(pendingText, data)
                actions.updateSavedAnalysisCache(pendingText, data)
                phaseTimers.forEach(timer => clearTimeout(timer))

                setLoading(false)
                setLoadingPhase(0)
                setResult(data)
                dispatch({ type: 'SET_SAVED_ONCE', payload: true })
                dispatch({ type: 'SET_PENDING_FROM_HOME', payload: false })

                // Update URL with analysis ID for sharing
                actions.updateUrlWithAnalysisId(analysisId)
              }
            } catch (err) {
              phaseTimers.forEach(timer => clearTimeout(timer))
              setError(err instanceof Error ? err.message : 'Network error')
              setLoading(false)
              setLoadingPhase(0)
              dispatch({ type: 'SET_PENDING_FROM_HOME', payload: false })
            }
            return
          }
          sessionStorage.removeItem(STORAGE_KEYS.PENDING_ANALYSIS)
        }
      } catch (e) {
        console.error('Error checking pending analysis:', e)
      }
      dispatch({ type: 'SET_PENDING_FROM_HOME', payload: false })
    }

    runPendingAnalysis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen for load text events from sidebar/home
  useEffect(() => {
    const handleLoadText = (e: Event) => {
      const ev = e as CustomEvent<LoadTextEventDetail>
      if (ev?.detail?.text) {
        const textToLoad = ev.detail.text

        if (ev.detail.cachedResult && ev.detail.id) {
          // Show results inline
          loadAnalysis(ev.detail.text, ev.detail.cachedResult, ev.detail.id)
          // Update URL with analysis ID for sharing
          actions.updateUrlWithAnalysisId(ev.detail.id)
        } else if (ev.detail.autoAnalyze) {
          // Auto-analyze - set text and trigger analysis
          setText(textToLoad)
          setError(null)
          dispatch({ type: 'RESET_ANALYSIS' })
          setTimeout(() => {
            actions.handleAnalyze(textToLoad)
          }, 50)
        } else {
          // Just load text without analyzing
          setText(textToLoad)
          setError(null)
          dispatch({ type: 'RESET_ANALYSIS' })
        }
      }
    }

    window.addEventListener(EVENTS.LOAD_RESEARCH_ASSISTANT_TEXT, handleLoadText as EventListener)
    return () => window.removeEventListener(EVENTS.LOAD_RESEARCH_ASSISTANT_TEXT, handleLoadText as EventListener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch all authors on mount for linkification
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const authors = await getThoughtLeaders()
        dispatch({ type: 'SET_ALL_AUTHORS', payload: authors.map(a => ({ id: a.id, name: a.name })) })
      } catch (error) {
        console.error('Error fetching authors for linkification:', error)
      }
    }
    fetchAuthors()
  }, [dispatch])

  // Load analysis from URL param (for shareable links)
  useEffect(() => {
    if (!initialAnalysisId) return

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_ANALYSES) || '[]')
      const analysis = saved.find((a: any) => a.id === initialAnalysisId)

      if (analysis && analysis.cachedResult) {
        loadAnalysis(analysis.text || '', analysis.cachedResult, analysis.id)
        dispatch({ type: 'SET_ANALYSIS_NOT_FOUND', payload: false })
      } else {
        // Analysis not found in localStorage (different device or cleared)
        dispatch({ type: 'SET_ANALYSIS_NOT_FOUND', payload: true })
      }
    } catch (error) {
      console.error('Error loading analysis from URL:', error)
      dispatch({ type: 'SET_ANALYSIS_NOT_FOUND', payload: true })
    }
  }, [initialAnalysisId, loadAnalysis, dispatch])

  // Load saved analyses for history dropdown
  useEffect(() => {
    const loadSavedAnalyses = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_ANALYSES) || '[]')
        dispatch({ type: 'SET_SAVED_ANALYSES', payload: saved.slice(0, CONFIG.MAX_HISTORY_DROPDOWN) })
      } catch (error) {
        console.error('Error loading saved analyses:', error)
      }
    }
    loadSavedAnalyses()

    // Listen for new saves
    const handleNewSave = () => loadSavedAnalyses()
    window.addEventListener(EVENTS.RESEARCH_ASSISTANT_SAVED, handleNewSave)
    return () => window.removeEventListener(EVENTS.RESEARCH_ASSISTANT_SAVED, handleNewSave)
  }, [dispatch])

  // Save a helpful insight to history
  const saveHelpfulInsight = (type: 'summary' | 'camp', content: string, campLabel?: string, campIdx?: number) => {
    try {
      const insights = JSON.parse(localStorage.getItem('helpfulInsights') || '[]')

      const newInsight = {
        id: `insight-${Date.now()}`,
        type,
        content,
        campLabel: campLabel || null,
        originalText: state.text.substring(0, 100) + (state.text.length > 100 ? '...' : ''),
        fullText: state.text, // Store full text for restoration
        cachedResult: state.result, // Store full result for restoration
        timestamp: new Date().toISOString()
      }

      // Add to beginning
      insights.unshift(newInsight)

      // Keep only last 50 insights
      const limited = insights.slice(0, 50)
      localStorage.setItem('helpfulInsights', JSON.stringify(limited))

      // Update local state
      if (type === 'summary') {
        toggleSummaryLike()
      } else if (campIdx !== undefined) {
        toggleCampLike(campIdx)
      }

      showToast('Saved to your helpful insights!')

      // Dispatch event for history page to pick up
      window.dispatchEvent(new CustomEvent('helpful-insight-added', { detail: newInsight }))
    } catch (e) {
      console.error('Error saving helpful insight:', e)
      showToast('Failed to save insight', 'error')
    }
  }

  // Remove a helpful insight
  const removeHelpfulInsight = (type: 'summary' | 'camp', campIdx?: number) => {
    if (type === 'summary') {
      toggleSummaryLike()
    } else if (campIdx !== undefined) {
      toggleCampLike(campIdx)
    }
    showToast('Removed from helpful insights')
  }

  const handleCopy = async () => {
    if (!state.result || state.copying) return
    dispatch({ type: 'SET_COPYING', payload: true })
    try {
      const formattedText = formatAnalysisAsText(state.text, state.result)
      await navigator.clipboard.writeText(formattedText)
      showToast('Analysis copied to clipboard')
    } catch (err) {
      console.error('Failed to copy:', err)
      showToast('Failed to copy to clipboard', 'error')
    } finally {
      dispatch({ type: 'SET_COPYING', payload: false })
    }
  }

  const handleExportPDF = () => {
    if (!state.result || state.exporting || !resultsRef.current) return
    dispatch({ type: 'SET_EXPORTING', payload: true })

    try {
      const printWindow = window.open('', '_blank', 'width=800,height=600')
      if (!printWindow) {
        showToast('Please allow popups to export PDF', 'error')
        dispatch({ type: 'SET_EXPORTING', payload: false })
        return
      }

      printWindow.document.write(generatePrintHTML(state.result))
      printWindow.document.close()

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          dispatch({ type: 'SET_EXPORTING', payload: false })
        }, 250)
      }

      // Fallback if onload doesn't fire
      setTimeout(() => {
        if (state.exporting) {
          printWindow.print()
          dispatch({ type: 'SET_EXPORTING', payload: false })
        }
      }, 1000)

    } catch (err) {
      console.error('Failed to export PDF:', err)
      showToast('Failed to generate PDF', 'error')
      dispatch({ type: 'SET_EXPORTING', payload: false })
    }
  }

  const handleShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      dispatch({ type: 'SET_URL_COPIED', payload: true })
      showToast('Link copied!')
      setTimeout(() => dispatch({ type: 'SET_URL_COPIED', payload: false }), 2000)
    } catch (e) {
      showToast('Failed to copy link', 'error')
    }
  }

  // Parse text and linkify author mentions (both bracketed and plain names)
  // Uses extracted buildAuthorMap utility but keeps JSX rendering in component
  const linkifyAuthors = (text: string) => {
    const authorMap = buildAuthorMap(state.allAuthors, state.result?.matchedCamps)

    // Build regex pattern for all author names in the map
    const authorNames = Array.from(authorMap.keys())
    if (authorNames.length === 0) {
      return text
    }

    // Escape special regex characters in author names and sort by length (longest first)
    const escapedNames = authorNames
      .map(name => escapeRegex(name))
      .sort((a, b) => b.length - a.length)

    // Create pattern that matches author names OR bracketed content
    const pattern = `\\[([^\\]]+)\\]|\\b(${escapedNames.join('|')})\\b`
    const regex = new RegExp(pattern, 'g')

    const parts = []
    let lastIndex = 0
    let match
    let linkKey = 0

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }

      // Determine if this is a bracketed match or plain author name
      const bracketedName = match[1]
      const plainName = match[2]
      const authorName = bracketedName || plainName
      const authorId = authorMap.get(authorName)

      // Add the linked author name
      parts.push(
        <button
          key={`author-link-${linkKey++}`}
          onClick={() => authorId && openPanel(authorId)}
          style={{
            color: '#0158AE',
            fontWeight: 'var(--weight-semibold)',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(1, 88, 174, 0.3)',
            textUnderlineOffset: '2px',
            transition: 'all var(--duration-fast) var(--ease-out)',
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
            cursor: authorId ? 'pointer' : 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecorationColor = '#0158AE'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecorationColor = 'rgba(1, 88, 174, 0.3)'
          }}
        >
          {authorName}
        </button>
      )

      lastIndex = regex.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      actions.handleAnalyze()
    }
  }

  // Show loading state while checking for pending analysis from home
  if (state.pendingFromHome === null) {
    return (
      <div style={{
        maxWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <Loader2 className="animate-spin" style={{ width: '32px', height: '32px', color: '#1075DC' }} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '100%' }}>
      {/* Page Title - only show when showTitle is true */}
      {showTitle && (
        <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 'var(--weight-bold)',
            marginBottom: 'var(--space-2)',
            background: 'linear-gradient(135deg, #0033FF 0%, #3D5FFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Research Assistant
          </h1>
          <p style={{ fontSize: 'var(--text-body)', color: '#64748b' }}>
            Analyze your draft against 200+ thought leaders
          </p>
        </div>
      )}

      {/* Analysis Not Found Message - for shared links from different devices */}
      {state.analysisNotFound && !state.result && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-amber-800 mb-1">Analysis not found</h4>
              <p className="text-[13px] text-amber-700">
                This analysis may have been created on a different device. Paste your text below to analyze again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Header - Shows when analysis is complete */}
      {state.result && (
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              resetAnalysis()
              dispatch({ type: 'SET_CURRENT_ANALYSIS_ID', payload: null })
              // Clear the URL param
              const url = new URL(window.location.href)
              url.searchParams.delete('analysis')
              window.history.replaceState({}, '', url.toString())
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-100">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-[13px] font-medium text-green-700">Analysis Complete</span>
          </div>
        </div>
      )}

      {/* Input Section - Two modes: Edit (no result) and View (has result) */}
      {!state.result ? (
        <InputSection
          text={state.text}
          loading={state.loading}
          error={state.error}
          savedAnalyses={state.savedAnalyses}
          pendingFromHome={state.pendingFromHome}
          onTextChange={setText}
          onKeyDown={handleKeyDown}
          onAnalyze={() => actions.handleAnalyze()}
          onLoadSavedAnalysis={actions.loadSavedAnalysis}
        />
      ) : (
        <AnalyzedTextPreview text={state.text} />
      )}

      {/* Loading Progress Indicator - Memoized for smooth performance */}
      {state.loading && (
        <LoadingPhaseIndicator phases={LOADING_PHASES} currentPhase={state.loadingPhase} />
      )}

      {/* Error Display */}
      {state.error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid var(--color-error)',
          borderRadius: 'var(--radius-base)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-3)'
        }}>
          <AlertCircle style={{ width: '20px', height: '20px', color: 'var(--color-error)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{
              fontSize: 'var(--text-body)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-error)',
              marginBottom: 'var(--space-1)'
            }}>
              Analysis Error
            </h3>
            <p style={{
              fontSize: 'var(--text-small)',
              color: 'var(--color-error)',
              margin: 0
            }}>
              {state.error}
            </p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {state.result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Results Toolbar */}
          <ResultsToolbar
            text={state.text}
            authorCount={state.result.matchedCamps.reduce((total, camp) => total + camp.topAuthors.length, 0)}
            scrollRefs={{ summaryRef, suggestionsRef, authorsRef }}
            savedOnce={state.savedOnce}
            saving={state.saving}
            copying={state.copying}
            exporting={state.exporting}
            urlCopied={state.urlCopied}
            onNewAnalysis={actions.startNewAnalysis}
            onCopy={handleCopy}
            onExportPDF={handleExportPDF}
            onShareUrl={handleShareUrl}
            onSave={actions.handleSave}
          />

          {/* PDF Export Container - wraps all exportable content */}
          <div ref={resultsRef}>
          {/* Summary */}
          <SummarySection
            ref={summaryRef}
            summary={state.result.summary}
            isLiked={state.likedSummary}
            onToggleLike={() =>
              state.likedSummary
                ? removeHelpfulInsight('summary')
                : saveHelpfulInsight('summary', state.result!.summary)
            }
          />

          {/* PROMINENT Editorial Suggestions */}
          <EditorialSuggestionsSection
            ref={suggestionsRef}
            editorialSuggestions={state.result.editorialSuggestions}
            linkifyAuthors={linkifyAuthors}
          />

          {/* Thought Leaders */}
          <ThoughtLeadersSection
            ref={authorsRef}
            matchedCamps={state.result.matchedCamps}
            likedCamps={state.likedCamps}
            onToggleCampLike={(idx) => {
              if (state.likedCamps.has(idx)) {
                removeHelpfulInsight('camp', idx)
              } else {
                const camp = state.result!.matchedCamps[idx]
                saveHelpfulInsight('camp', camp.explanation, camp.campLabel, idx)
              }
            }}
            onAuthorClick={openPanel}
          />
          </div>{/* End of PDF Export Container */}
        </div>
      )}
    </div>
  )
}

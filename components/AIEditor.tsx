'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { AIEditorAnalyzeResponse } from '@/lib/ai-editor'
import { getThoughtLeaders } from '@/lib/api/thought-leaders'
import { useToast } from '@/components/Toast'
import { useAuthorPanel } from '@/contexts/AuthorPanelContext'
import { Sparkles, AlertCircle, CheckCircle, Loader2, ThumbsUp, ThumbsDown, Minus, Quote, ExternalLink, ChevronDown, Lightbulb, Users, Bookmark, Copy, FileDown, History, Clock, ArrowLeft, Plus, Share2, Mic } from 'lucide-react'
import VoiceLabControls from '@/components/voice-lab/VoiceLabControls'

// Loading phase messages for progressive feedback
const LOADING_PHASES = [
  { message: 'Analyzing your text...', duration: 2000 },
  { message: 'Finding relevant thought leaders...', duration: 4000 },
  { message: 'Comparing perspectives to your draft...', duration: 5000 },
  { message: 'Generating editorial suggestions...', duration: 0 }, // Final phase, no auto-advance
]

interface AIEditorProps {
  showTitle?: boolean // When true, shows page title (for standalone page)
  initialAnalysisId?: string | null // Analysis ID from URL for shareable links
}

export default function AIEditor({ showTitle = false, initialAnalysisId }: AIEditorProps) {
  const { openPanel } = useAuthorPanel()
  const [text, setText] = useState('')
  const [result, setResult] = useState<AIEditorAnalyzeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedOnce, setSavedOnce] = useState(false)
  const [allAuthors, setAllAuthors] = useState<Array<{ id: string; name: string }>>([])
  const [copying, setCopying] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [likedSummary, setLikedSummary] = useState(false)
  const [likedCamps, setLikedCamps] = useState<Set<number>>(new Set())
  const [savedAnalyses, setSavedAnalyses] = useState<any[]>([])
  const [pendingFromHome, setPendingFromHome] = useState<boolean | null>(null) // null = checking, true/false = resolved
  const [urlCopied, setUrlCopied] = useState(false)
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null)
  const [analysisNotFound, setAnalysisNotFound] = useState(false)
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const { showToast } = useToast()

  const suggestionsRef = useRef<HTMLDivElement>(null)
  const authorsRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Check for pending analysis from home page (via sessionStorage) on mount
  useEffect(() => {
    const runPendingAnalysis = async () => {
      try {
        const pending = sessionStorage.getItem('pendingAnalysis')
        if (pending) {
          const { text: pendingText, autoAnalyze, timestamp } = JSON.parse(pending)
          // Only use if recent (within 10 seconds) to avoid stale data
          if (autoAnalyze && Date.now() - timestamp < 10000) {
            sessionStorage.removeItem('pendingAnalysis')
            setText(pendingText)
            setLoading(true)
            setLoadingPhase(0)
            setPendingFromHome(true)

            // Start cycling through loading phases
            const phaseTimers: NodeJS.Timeout[] = []
            let currentPhase = 0

            const advancePhase = () => {
              if (currentPhase < LOADING_PHASES.length - 1) {
                currentPhase++
                setLoadingPhase(currentPhase)
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
                setError(data.error || data.message || 'Analysis failed')
                phaseTimers.forEach(timer => clearTimeout(timer))
                setLoading(false)
                setLoadingPhase(0)
                setPendingFromHome(false)
              } else {
                // Save and show results inline
                const analysisId = addToRecentSearches(pendingText, data)
                updateSavedAnalysisCache(pendingText, data)
                phaseTimers.forEach(timer => clearTimeout(timer))
                setLoading(false)
                setLoadingPhase(0)
                setResult(data)
                setSavedOnce(true)
                setPendingFromHome(false)
                // Update URL with analysis ID for sharing
                const url = new URL(window.location.href)
                url.searchParams.set('analysis', analysisId)
                window.history.replaceState({}, '', url.toString())
                setCurrentAnalysisId(analysisId)
              }
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Network error')
              phaseTimers.forEach(timer => clearTimeout(timer))
              setLoading(false)
              setLoadingPhase(0)
              setPendingFromHome(false)
            }
            return
          }
          sessionStorage.removeItem('pendingAnalysis')
        }
      } catch (e) {
        console.error('Error checking pending analysis:', e)
      }
      setPendingFromHome(false)
    }

    runPendingAnalysis()
  }, [])

  // Listen for load text events from sidebar/home
  useEffect(() => {
    const handleLoadText = (e: Event) => {
      const ev = e as CustomEvent<{ text: string; cachedResult?: AIEditorAnalyzeResponse; autoAnalyze?: boolean; id?: string }>
      if (ev?.detail?.text) {
        const textToLoad = ev.detail.text

        if (ev.detail.cachedResult && ev.detail.id) {
          // Show results inline
          setText(ev.detail.text)
          setResult(ev.detail.cachedResult)
          setSavedOnce(true)
          setError(null)
          // Update URL with analysis ID for sharing
          const url = new URL(window.location.href)
          url.searchParams.set('analysis', ev.detail.id)
          window.history.replaceState({}, '', url.toString())
          setCurrentAnalysisId(ev.detail.id)
        } else if (ev.detail.autoAnalyze) {
          // Auto-analyze - set text and trigger analysis
          setText(textToLoad)
          setError(null)
          setLikedSummary(false)
          setLikedCamps(new Set())
          setResult(null)
          setSavedOnce(false)
          setTimeout(() => {
            handleAnalyze(textToLoad)
          }, 50)
        } else {
          // Just load text without analyzing
          setText(textToLoad)
          setError(null)
          setLikedSummary(false)
          setLikedCamps(new Set())
          setResult(null)
          setSavedOnce(false)
        }
      }
    }

    window.addEventListener('load-ai-editor-text', handleLoadText as EventListener)
    return () => window.removeEventListener('load-ai-editor-text', handleLoadText as EventListener)
  }, [])

  // Fetch all authors on mount for linkification
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const authors = await getThoughtLeaders()
        setAllAuthors(authors.map(a => ({ id: a.id, name: a.name })))
      } catch (error) {
        console.error('Error fetching authors for linkification:', error)
      }
    }
    fetchAuthors()
  }, [])

  // Load analysis from URL param (for shareable links)
  useEffect(() => {
    if (!initialAnalysisId) return

    try {
      const saved = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
      const analysis = saved.find((a: any) => a.id === initialAnalysisId)

      if (analysis && analysis.cachedResult) {
        setText(analysis.text || '')
        setResult(analysis.cachedResult)
        setCurrentAnalysisId(analysis.id)
        setSavedOnce(true)
        setAnalysisNotFound(false)
      } else {
        // Analysis not found in localStorage (different device or cleared)
        setAnalysisNotFound(true)
      }
    } catch (error) {
      console.error('Error loading analysis from URL:', error)
      setAnalysisNotFound(true)
    }
  }, [initialAnalysisId])

  // Helper to update URL with analysis ID
  const updateUrlWithAnalysisId = (analysisId: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('analysis', analysisId)
    window.history.replaceState({}, '', url.toString())
    setCurrentAnalysisId(analysisId)
  }

  // Load saved analyses for history dropdown
  useEffect(() => {
    const loadSavedAnalyses = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
        setSavedAnalyses(saved.slice(0, 10))
      } catch (error) {
        console.error('Error loading saved analyses:', error)
      }
    }
    loadSavedAnalyses()

    // Listen for new saves
    const handleNewSave = () => loadSavedAnalyses()
    window.addEventListener('ai-editor-saved', handleNewSave)
    return () => window.removeEventListener('ai-editor-saved', handleNewSave)
  }, [])

  // Load a saved analysis - show results inline if cached, auto-analyze if not
  const loadSavedAnalysis = (analysis: any) => {
    if (analysis.cachedResult && analysis.id) {
      // Show results inline
      setText(analysis.text)
      setResult(analysis.cachedResult)
      setSavedOnce(true)
      setError(null)
      updateUrlWithAnalysisId(analysis.id)
    } else {
      // No cache - set text and trigger analysis
      setText(analysis.text)
      setError(null)
      setSavedOnce(true)
      setLikedSummary(false)
      setLikedCamps(new Set())
      setResult(null)
      setTimeout(() => {
        handleAnalyze(analysis.text)
      }, 50)
    }
  }

  // Clear and start a new analysis
  const startNewAnalysis = () => {
    setText('')
    setResult(null)
    setError(null)
    setSavedOnce(false)
    setLikedSummary(false)
    setLikedCamps(new Set())
  }

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Update cached result for existing saved analyses
  const updateSavedAnalysisCache = (searchText: string, analysisResult: AIEditorAnalyzeResponse) => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
      const trimmedText = searchText.trim()

      let updated = false
      const updatedSaved = saved.map((s: any) => {
        if (s.text?.trim() === trimmedText) {
          updated = true
          return { ...s, cachedResult: analysisResult }
        }
        return s
      })

      if (updated) {
        localStorage.setItem('savedAIEditorAnalyses', JSON.stringify(updatedSaved))
        // Refresh the local state
        setSavedAnalyses(updatedSaved.slice(0, 10))
        // Notify sidebar
        window.dispatchEvent(new CustomEvent('ai-editor-saved'))
      }
    } catch (error) {
      console.error('Error updating saved analysis cache:', error)
    }
  }

  const addToRecentSearches = (searchText: string, analysisResult: AIEditorAnalyzeResponse): string => {
    const analysisId = `${Date.now()}`
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')

      // Create preview (first 60 chars)
      const preview = searchText.length > 60 ? searchText.substring(0, 60) + '...' : searchText

      // Remove if already exists
      const filtered = recent.filter((s: any) => s.query !== preview)

      // Add to beginning with cached result
      filtered.unshift({
        id: analysisId,
        query: preview,
        type: 'ai-editor',
        fullText: searchText,
        cachedResult: analysisResult,
        timestamp: new Date().toISOString()
      })

      // Keep only last 20
      const limited = filtered.slice(0, 20)
      localStorage.setItem('recentSearches', JSON.stringify(limited))

      // Also save to savedAIEditorAnalyses for the results page
      const saved = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
      const savedFiltered = saved.filter((s: any) => s.text?.trim() !== searchText.trim())
      savedFiltered.unshift({
        id: analysisId,
        text: searchText.trim(),
        preview,
        cachedResult: analysisResult,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('savedAIEditorAnalyses', JSON.stringify(savedFiltered.slice(0, 20)))
      window.dispatchEvent(new CustomEvent('ai-editor-saved'))
    } catch (error) {
      console.error('Error adding to recent searches:', error)
    }
    return analysisId
  }

  // Check if we have a cached result for given text
  const findCachedResult = (searchText: string): AIEditorAnalyzeResponse | null => {
    const trimmedText = searchText.trim()
    // Check saved analyses
    const cached = savedAnalyses.find(a => a.text?.trim() === trimmedText && a.cachedResult)
    if (cached?.cachedResult) return cached.cachedResult
    // Check recent searches
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      const recentCached = recent.find((s: any) => s.fullText?.trim() === trimmedText && s.cachedResult)
      if (recentCached?.cachedResult) return recentCached.cachedResult
    } catch {}
    return null
  }

  // Unified analyze function - accepts optional text parameter for auto-analyze
  const handleAnalyze = async (textOverride?: string) => {
    const textToAnalyze = textOverride || text

    if (!textToAnalyze.trim()) {
      if (!textOverride) setError('Please enter some text to analyze')
      return
    }

    // Check for cached result first - instant loading!
    const cached = findCachedResult(textToAnalyze)
    if (cached) {
      // Show cached result inline immediately
      setResult(cached)
      setSavedOnce(true)
      return
    }

    setLoading(true)
    setLoadingPhase(0)
    setError(null)
    setResult(null)

    // Start cycling through loading phases
    const phaseTimers: NodeJS.Timeout[] = []
    let currentPhase = 0

    const advancePhase = () => {
      if (currentPhase < LOADING_PHASES.length - 1) {
        currentPhase++
        setLoadingPhase(currentPhase)
        const nextDuration = LOADING_PHASES[currentPhase].duration
        if (nextDuration > 0) {
          phaseTimers.push(setTimeout(advancePhase, nextDuration))
        }
      }
    }

    if (LOADING_PHASES[0].duration > 0) {
      phaseTimers.push(setTimeout(advancePhase, LOADING_PHASES[0].duration))
    }

    try {
      const response = await fetch('/api/brain/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToAnalyze,
          ...(selectedProfileId && { profileId: selectedProfileId }),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || data.message || 'Analysis failed')
        phaseTimers.forEach(timer => clearTimeout(timer))
        setLoading(false)
        setLoadingPhase(0)
      } else {
        // Save and show results inline
        const analysisId = addToRecentSearches(textToAnalyze, data)
        updateSavedAnalysisCache(textToAnalyze, data)
        phaseTimers.forEach(timer => clearTimeout(timer))
        setLoading(false)
        setLoadingPhase(0)
        setResult(data)
        setSavedOnce(true)
        updateUrlWithAnalysisId(analysisId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      phaseTimers.forEach(timer => clearTimeout(timer))
      setLoading(false)
      setLoadingPhase(0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleAnalyze()
    }
  }

  const handleSave = async () => {
    if (!text.trim() || saving) return
    setSaving(true)
    try {
      const saved = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')

      // Create preview from text (first 60 characters)
      const preview = text.trim().substring(0, 60) + (text.trim().length > 60 ? '...' : '')

      // Remove if already exists (to avoid duplicates)
      const filtered = saved.filter((s: any) => s.text !== text.trim())

      // Add to beginning with cached result for instant loading
      filtered.unshift({
        id: `ai-editor-${Date.now()}`,
        text: text.trim(),
        preview,
        cachedResult: result, // Store the analysis result for instant loading
        timestamp: new Date().toISOString()
      })

      // Keep only last 20
      const limited = filtered.slice(0, 20)
      localStorage.setItem('savedAIEditorAnalyses', JSON.stringify(limited))

      setSavedOnce(true)
      showToast('Analysis saved successfully')
      window.dispatchEvent(new CustomEvent('ai-editor-saved', {
        detail: { text: text.trim(), preview, cachedResult: result, timestamp: new Date().toISOString() }
      }))
    } catch (e) {
      console.error('Error saving AI editor analysis:', e)
      showToast('Failed to save analysis', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Save a helpful insight to history
  const saveHelpfulInsight = (type: 'summary' | 'camp', content: string, campLabel?: string, campIdx?: number) => {
    try {
      const insights = JSON.parse(localStorage.getItem('helpfulInsights') || '[]')

      const newInsight = {
        id: `insight-${Date.now()}`,
        type,
        content,
        campLabel: campLabel || null,
        originalText: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        fullText: text, // Store full text for restoration
        cachedResult: result, // Store full result for restoration
        timestamp: new Date().toISOString()
      }

      // Add to beginning
      insights.unshift(newInsight)

      // Keep only last 50 insights
      const limited = insights.slice(0, 50)
      localStorage.setItem('helpfulInsights', JSON.stringify(limited))

      // Update local state
      if (type === 'summary') {
        setLikedSummary(true)
      } else if (campIdx !== undefined) {
        setLikedCamps(prev => new Set([...prev, campIdx]))
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
      setLikedSummary(false)
    } else if (campIdx !== undefined) {
      setLikedCamps(prev => {
        const newSet = new Set(prev)
        newSet.delete(campIdx)
        return newSet
      })
    }
    showToast('Removed from helpful insights')
  }

  const formatAnalysisAsText = () => {
    if (!result) return ''

    const lines: string[] = []

    // Header
    lines.push('═══════════════════════════════════════')
    lines.push('AI EDITOR ANALYSIS')
    lines.push('═══════════════════════════════════════')
    lines.push('')

    // Original text snippet
    const textPreview = text.length > 200 ? text.substring(0, 200) + '...' : text
    lines.push('📝 ANALYZED TEXT:')
    lines.push(textPreview)
    lines.push('')

    // Summary
    lines.push('───────────────────────────────────────')
    lines.push('📊 SUMMARY')
    lines.push('───────────────────────────────────────')
    lines.push(result.summary)
    lines.push('')

    // Editorial Suggestions
    lines.push('───────────────────────────────────────')
    lines.push('💡 EDITORIAL SUGGESTIONS')
    lines.push('───────────────────────────────────────')
    lines.push('')

    lines.push('✓ PERSPECTIVES YOU\'RE USING:')
    result.editorialSuggestions.presentPerspectives.forEach((p) => {
      lines.push(`  • ${p}`)
    })
    lines.push('')

    lines.push('⚠ PERSPECTIVES YOU\'RE MISSING:')
    result.editorialSuggestions.missingPerspectives.forEach((p) => {
      lines.push(`  • ${p}`)
    })
    lines.push('')

    // Thought Leaders
    if (result.matchedCamps.length > 0) {
      lines.push('───────────────────────────────────────')
      lines.push(`👥 RELEVANT THOUGHT LEADERS (${result.matchedCamps.length} perspectives)`)
      lines.push('───────────────────────────────────────')
      lines.push('')

      result.matchedCamps.forEach((camp) => {
        lines.push(`■ ${camp.campLabel}`)
        lines.push(`  ${camp.explanation}`)
        lines.push('')

        camp.topAuthors.forEach((author) => {
          const stanceLabel = author.stance === 'agrees' ? '👍 Agrees' :
            author.stance === 'disagrees' ? '👎 Disagrees' : '↔ Partial'
          lines.push(`  • ${author.name} [${stanceLabel}]`)
          lines.push(`    Position: ${author.position}`)
          if (author.draftConnection) {
            lines.push(`    Connection to draft: ${author.draftConnection}`)
          }
          if (author.quote) {
            lines.push(`    Quote: "${author.quote}"`)
            if (author.sourceUrl) {
              lines.push(`    Source: ${author.sourceUrl}`)
            }
          }
          lines.push('')
        })
      })
    }

    lines.push('───────────────────────────────────────')
    lines.push('Generated by Compass AI Editor')
    lines.push(`Date: ${new Date().toLocaleDateString()}`)
    lines.push('───────────────────────────────────────')

    return lines.join('\n')
  }

  const handleCopy = async () => {
    if (!result || copying) return
    setCopying(true)
    try {
      const formattedText = formatAnalysisAsText()
      await navigator.clipboard.writeText(formattedText)
      showToast('Analysis copied to clipboard')
    } catch (err) {
      console.error('Failed to copy:', err)
      showToast('Failed to copy to clipboard', 'error')
    } finally {
      setCopying(false)
    }
  }

  const handleExportPDF = () => {
    if (!result || exporting || !resultsRef.current) return
    setExporting(true)

    try {
      // Create a new window with just the results content for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600')
      if (!printWindow) {
        showToast('Please allow popups to export PDF', 'error')
        setExporting(false)
        return
      }

      // Get the current date for the header
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      // Build print-friendly HTML
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>AI Editor Analysis - ${date}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 32px;
              padding-bottom: 24px;
              border-bottom: 2px solid #e5e7eb;
            }
            .header h1 {
              font-size: 28px;
              margin: 0 0 8px 0;
              color: #111827;
            }
            .header .date {
              color: #6b7280;
              font-size: 14px;
            }
            .section {
              margin-bottom: 32px;
              page-break-inside: avoid;
            }
            .section h2 {
              font-size: 18px;
              color: #111827;
              margin: 0 0 16px 0;
              padding-bottom: 8px;
              border-bottom: 1px solid #e5e7eb;
            }
            .section h3 {
              font-size: 16px;
              color: #374151;
              margin: 0 0 12px 0;
            }
            .summary-text {
              font-size: 15px;
              color: #374151;
            }
            .suggestions-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 24px;
            }
            .suggestion-box {
              padding: 16px;
              border-radius: 8px;
            }
            .suggestion-box.present {
              background: #f0fdf4;
              border: 1px solid #86efac;
            }
            .suggestion-box.missing {
              background: #fffbeb;
              border: 1px solid #fcd34d;
            }
            .suggestion-box h3 {
              margin: 0 0 12px 0;
            }
            .suggestion-box.present h3 { color: #16a34a; }
            .suggestion-box.missing h3 { color: #d97706; }
            .suggestion-box ul {
              margin: 0;
              padding-left: 20px;
            }
            .suggestion-box li {
              margin-bottom: 8px;
              font-size: 14px;
            }
            .camp {
              margin-bottom: 24px;
              padding: 20px;
              background: #f9fafb;
              border-radius: 8px;
              page-break-inside: avoid;
            }
            .camp h3 {
              margin: 0 0 8px 0;
              font-size: 17px;
            }
            .camp-desc {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 16px;
            }
            .author {
              padding: 16px;
              margin-bottom: 12px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
              background: white;
            }
            .author.agrees { border-left: 4px solid #10b981; }
            .author.disagrees { border-left: 4px solid #ef4444; }
            .author.partial { border-left: 4px solid #f59e0b; }
            .author-name {
              font-weight: 600;
              font-size: 15px;
              margin-bottom: 4px;
            }
            .author-stance {
              display: inline-block;
              font-size: 12px;
              padding: 2px 8px;
              border-radius: 4px;
              margin-bottom: 8px;
            }
            .author.agrees .author-stance { background: #d1fae5; color: #059669; }
            .author.disagrees .author-stance { background: #fee2e2; color: #dc2626; }
            .author.partial .author-stance { background: #fef3c7; color: #d97706; }
            .author-position {
              font-size: 14px;
              margin-bottom: 8px;
            }
            .author-connection {
              font-size: 14px;
              padding: 12px;
              background: #f3f4f6;
              border-radius: 6px;
              margin-bottom: 8px;
            }
            .author-quote {
              font-size: 14px;
              font-style: italic;
              color: #4b5563;
              padding: 12px;
              background: #f9fafb;
              border-left: 3px solid #9ca3af;
              margin: 0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #9ca3af;
              font-size: 12px;
            }
            @media print {
              body { padding: 20px; }
              .camp, .author { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✨ AI Editor Analysis</h1>
            <div class="date">${date}</div>
          </div>

          <div class="section">
            <h2>📊 Summary</h2>
            <p class="summary-text">${result.summary}</p>
          </div>

          <div class="section">
            <h2>💡 Editorial Suggestions</h2>
            <div class="suggestions-grid">
              <div class="suggestion-box present">
                <h3>✓ What You're Using</h3>
                <ul>
                  ${result.editorialSuggestions.presentPerspectives.map(p => `<li>${p}</li>`).join('')}
                </ul>
              </div>
              <div class="suggestion-box missing">
                <h3>⚠ What You're Missing</h3>
                <ul>
                  ${result.editorialSuggestions.missingPerspectives.map(p => `<li>${p}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>

          ${result.matchedCamps.length > 0 ? `
          <div class="section">
            <h2>👥 Relevant Thought Leaders</h2>
            ${result.matchedCamps.map(camp => `
              <div class="camp">
                <h3>${camp.campLabel}</h3>
                <p class="camp-desc">${camp.explanation}</p>
                ${camp.topAuthors.map(author => `
                  <div class="author ${author.stance}">
                    <div class="author-name">${author.name}</div>
                    <span class="author-stance">${
                      author.stance === 'agrees' ? '👍 Agrees' :
                      author.stance === 'disagrees' ? '👎 Disagrees' : '↔ Partial'
                    }</span>
                    <p class="author-position"><strong>Position:</strong> ${author.position}</p>
                    ${author.draftConnection ? `<div class="author-connection"><strong>Connection:</strong> ${author.draftConnection}</div>` : ''}
                    ${author.quote ? `<blockquote class="author-quote">"${author.quote}"</blockquote>` : ''}
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <div class="footer">
            Generated by Compass AI Editor • ${date}
          </div>
        </body>
        </html>
      `)

      printWindow.document.close()

      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          setExporting(false)
        }, 250)
      }

      // Fallback if onload doesn't fire
      setTimeout(() => {
        if (exporting) {
          printWindow.print()
          setExporting(false)
        }
      }, 1000)

    } catch (err) {
      console.error('Failed to export PDF:', err)
      showToast('Failed to generate PDF', 'error')
      setExporting(false)
    }
  }

  const getStanceColor = (stance: 'agrees' | 'disagrees' | 'partial') => {
    switch (stance) {
      case 'agrees': return { bg: 'rgba(16, 185, 129, 0.08)', border: 'var(--color-success)', text: 'var(--color-success)' }
      case 'disagrees': return { bg: 'rgba(239, 68, 68, 0.08)', border: 'var(--color-error)', text: 'var(--color-error)' }
      case 'partial': return { bg: 'rgba(245, 158, 11, 0.08)', border: 'var(--color-warning)', text: 'var(--color-warning)' }
    }
  }

  const getStanceIcon = (stance: 'agrees' | 'disagrees' | 'partial') => {
    switch (stance) {
      case 'agrees': return <ThumbsUp className="w-4 h-4" />
      case 'disagrees': return <ThumbsDown className="w-4 h-4" />
      case 'partial': return <Minus className="w-4 h-4" />
    }
  }

  const getStanceLabel = (stance: 'agrees' | 'disagrees' | 'partial') => {
    switch (stance) {
      case 'agrees': return 'Agrees with you'
      case 'disagrees': return 'Challenges your view'
      case 'partial': return 'Partially aligns'
    }
  }

  // Build author name to ID map from matched camps
  const buildAuthorMap = () => {
    const map = new Map<string, string>()

    // Add all authors from the database for comprehensive linkification
    allAuthors.forEach(author => {
      if (author.id && author.name) {
        map.set(author.name, author.id)
      }
    })

    // Also add authors from matched camps (in case they have different data)
    if (result?.matchedCamps) {
      result.matchedCamps.forEach(camp => {
        camp.topAuthors.forEach(author => {
          if (author.id && author.name) {
            map.set(author.name, author.id)
          }
        })
      })
    }

    return map
  }

  // Parse text and linkify author mentions (both bracketed and plain names)
  const linkifyAuthors = (text: string) => {
    const authorMap = buildAuthorMap()

    // Build regex pattern for all author names in the map
    const authorNames = Array.from(authorMap.keys())
    if (authorNames.length === 0) {
      return text
    }

    // Escape special regex characters in author names and sort by length (longest first)
    const escapedNames = authorNames
      .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
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

  const canAnalyze = text.trim().length > 0 && text.length <= 4000 && !loading

  // Show loading state while checking for pending analysis from home
  if (pendingFromHome === null) {
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
            AI Editor
          </h1>
          <p style={{ fontSize: 'var(--text-body)', color: '#64748b' }}>
            Analyze your draft against 200+ thought leaders
          </p>
        </div>
      )}

      {/* Analysis Not Found Message - for shared links from different devices */}
      {analysisNotFound && !result && (
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
      {result && (
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              setResult(null)
              setText('')
              setError(null)
              setSavedOnce(false)
              setCurrentAnalysisId(null)
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
      {!result ? (
        /* Edit Mode - Welcome state with clean layout matching explore page */
        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100 rounded-xl p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-[17px] font-semibold text-gray-900 mb-2">What's in your draft?</h3>
            <p className="text-[14px] text-gray-600 max-w-md mx-auto">
              Paste your draft to get editorial suggestions.
            </p>
          </div>

          {/* Input Card */}
          <div className="max-w-2xl mx-auto">
            <div
              style={{
                borderRadius: '12px',
                background: 'white',
                border: '1px solid #c7d2fe',
                overflow: 'hidden',
                marginBottom: loading || error ? '24px' : 0
              }}
            >
              <textarea
                id="ai-editor-text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste your draft, thesis, or argument here..."
                disabled={loading}
                style={{
                  width: '100%',
                  height: '140px',
                  padding: '16px',
                  border: 'none',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: '#1e293b',
                  backgroundColor: 'transparent',
                  resize: 'none',
                  outline: 'none',
                  opacity: loading ? 0.5 : 1,
                  fontFamily: 'inherit'
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  backgroundColor: '#f8fafc',
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Voice Profile Selector */}
                  <VoiceLabControls
                    selectedProfileId={selectedProfileId}
                    onProfileChange={setSelectedProfileId}
                    disabled={loading}
                  />
                  <span style={{ color: '#cbd5e1' }}>|</span>
                  <span style={{ fontSize: '12px', color: text.length > 4000 ? '#ef4444' : '#64748b', fontWeight: 500 }}>
                    {text.length > 0 ? `${text.length.toLocaleString()} chars` : 'Up to 4,000 chars'}
                  </span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    <kbd style={{
                      padding: '2px 5px',
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '3px',
                      fontSize: '10px',
                      fontFamily: 'monospace'
                    }}>⌘↵</kbd>
                  </span>
                </div>
                <button
                  onClick={() => handleAnalyze()}
                  disabled={!canAnalyze}
                  className="group"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: !canAnalyze
                      ? '#e2e8f0'
                      : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: !canAnalyze ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: !canAnalyze ? 'none' : '0 2px 8px rgba(79, 70, 229, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    if (canAnalyze) {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (canAnalyze) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(79, 70, 229, 0.3)'
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles style={{ width: '16px', height: '16px' }} />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Analyses - Inside welcome container */}
          {!loading && !error && savedAnalyses.length > 0 && pendingFromHome === false && (
            <div className="mt-6 pt-6 border-t border-indigo-100">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-indigo-200">
                  <History className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-gray-900 m-0">Recent Analyses</h3>
                  <p className="text-[12px] text-gray-500 m-0">Click to view results</p>
                </div>
              </div>

              {/* Analysis Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {savedAnalyses.slice(0, 4).map((analysis) => (
                  <button
                    key={analysis.id}
                    onClick={() => loadSavedAnalysis(analysis)}
                    className="p-4 bg-white rounded-xl border border-indigo-200 text-left hover:border-indigo-400 hover:shadow-md transition-all group"
                  >
                    <div className="text-[13px] text-gray-800 font-medium mb-2 line-clamp-2">
                      {analysis.preview || analysis.text?.substring(0, 80)}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(analysis.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      {analysis.cachedResult && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[10px] font-medium">
                          <CheckCircle className="w-2.5 h-2.5" />
                          Ready
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {savedAnalyses.length > 4 && (
                <div className="text-center mt-3">
                  <Link
                    href="/history"
                    className="text-[12px] text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    +{savedAnalyses.length - 4} more in history →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* View Mode - Analyzed text preview */
        <div
          style={{
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #DCF2FA 0%, #AADAF9 100%)',
            border: '1px solid #48AFF0',
            padding: '20px',
            marginBottom: 'var(--space-6)',
            position: 'relative'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Quote style={{
              width: '24px',
              height: '24px',
              color: '#0158AE',
              flexShrink: 0,
              marginTop: '2px'
            }} />
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.7',
                color: '#162950',
                margin: 0,
                fontStyle: 'italic'
              }}>
                {text.length > 300 ? text.substring(0, 300) + '...' : text}
              </p>
              {text.length > 300 && (
                <button
                  onClick={() => {
                    const el = document.getElementById('full-analyzed-text')
                    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none'
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    color: '#1075DC',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Show full text
                </button>
              )}
              <p
                id="full-analyzed-text"
                style={{
                  display: 'none',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#162950',
                  margin: '12px 0 0 0',
                  padding: '12px',
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderRadius: '8px'
                }}
              >
                {text}
              </p>
            </div>
          </div>
          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #48AFF0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '12px', color: '#0158AE', fontWeight: 500 }}>
              {text.length.toLocaleString()} characters analyzed
            </span>
          </div>
        </div>
      )}

      {/* Loading Progress Indicator */}
      {loading && (
        <div style={{
          backgroundColor: '#DCF2FA',
          border: '1px solid #AADAF9',
          borderRadius: '12px',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {LOADING_PHASES.map((phase, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  opacity: idx <= loadingPhase ? 1 : 0.4,
                  transition: 'opacity 0.3s ease'
                }}
              >
                {idx < loadingPhase ? (
                  <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981' }} />
                ) : idx === loadingPhase ? (
                  <Loader2 style={{ width: '16px', height: '16px', color: '#1075DC' }} className="animate-spin" />
                ) : (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid #AADAF9'
                  }} />
                )}
                <span style={{
                  fontSize: 'var(--text-small)',
                  color: idx <= loadingPhase ? '#162950' : '#64748b',
                  fontWeight: idx === loadingPhase ? 'var(--weight-medium)' : 'var(--weight-normal)'
                }}>
                  {phase.message.replace('...', '')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
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
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Results Toolbar */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              {/* Left: Back button */}
              <button
                onClick={startNewAnalysis}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                  e.currentTarget.style.color = '#374151'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                }}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                New Analysis
              </button>

              {/* Center: Navigation - Jump to section */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px',
                backgroundColor: '#DCF2FA',
                borderRadius: '10px'
              }}>
                <span style={{ fontSize: '11px', color: '#64748b', padding: '0 8px' }}>Jump to:</span>
                <button
                  onClick={() => scrollToSection(summaryRef)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#0158AE',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Summary
                </button>
                <button
                  onClick={() => scrollToSection(suggestionsRef)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#162950',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)'
                    e.currentTarget.style.color = '#0158AE'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#162950'
                  }}
                >
                  Editorial Tips
                </button>
                <button
                  onClick={() => scrollToSection(authorsRef)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#162950',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)'
                    e.currentTarget.style.color = '#0158AE'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#162950'
                  }}
                >
                  {result.matchedCamps.reduce((total, camp) => total + camp.topAuthors.length, 0)} Authors
                </button>
              </div>

              {/* Right: Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleCopy}
                  disabled={copying}
                  title="Copy analysis"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'transparent',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#6b7280',
                    cursor: copying ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!copying) {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.borderColor = '#d1d5db'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                  }}
                >
                  <Copy style={{ width: '16px', height: '16px' }} />
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  title="Export as PDF"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'transparent',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#6b7280',
                    cursor: exporting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!exporting) {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.borderColor = '#d1d5db'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                  }}
                >
                  <FileDown style={{ width: '16px', height: '16px' }} />
                </button>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href)
                      setUrlCopied(true)
                      showToast('Link copied!')
                      setTimeout(() => setUrlCopied(false), 2000)
                    } catch (e) {
                      showToast('Failed to copy link', 'error')
                    }
                  }}
                  title="Copy link to share"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    backgroundColor: urlCopied ? '#dcfce7' : 'transparent',
                    border: urlCopied ? '1px solid #86efac' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: urlCopied ? '#16a34a' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!urlCopied) {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.borderColor = '#d1d5db'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!urlCopied) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }
                  }}
                >
                  <Share2 style={{ width: '16px', height: '16px' }} />
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  title={savedOnce ? 'Saved' : 'Save analysis'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: savedOnce ? '#0158AE' : 'transparent',
                    border: savedOnce ? '1px solid #0158AE' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: savedOnce ? 'white' : '#0158AE',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!saving && !savedOnce) {
                      e.currentTarget.style.backgroundColor = '#DCF2FA'
                      e.currentTarget.style.borderColor = '#48AFF0'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!saving && !savedOnce) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }
                  }}
                >
                  <Bookmark style={{ width: '14px', height: '14px', fill: savedOnce ? 'white' : 'none' }} />
                  {savedOnce ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* PDF Export Container - wraps all exportable content */}
          <div ref={resultsRef}>
          {/* Summary */}
          <div ref={summaryRef} style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: 'var(--card-padding-desktop)',
            boxShadow: '0 2px 12px rgba(22, 41, 80, 0.06)',
            border: '1px solid #AADAF9',
            scrollMarginTop: '96px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-3)'
            }}>
              <h2 style={{
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                color: '#162950'
              }}>
                <CheckCircle style={{ width: '20px', height: '20px', color: '#10b981' }} />
                Summary
              </h2>
              <button
                onClick={() => likedSummary
                  ? removeHelpfulInsight('summary')
                  : saveHelpfulInsight('summary', result.summary)
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: likedSummary ? '1px solid #10b981' : '1px solid #e5e7eb',
                  backgroundColor: likedSummary ? '#d1fae5' : 'white',
                  color: likedSummary ? '#059669' : '#6b7280',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title={likedSummary ? 'Remove from helpful insights' : 'Save as helpful'}
              >
                <ThumbsUp style={{ width: '14px', height: '14px', fill: likedSummary ? '#059669' : 'none' }} />
                {likedSummary ? 'Helpful!' : 'This is helpful'}
              </button>
            </div>
            <p style={{
              color: '#374151',
              lineHeight: '1.75',
              margin: 0,
              fontSize: '15px'
            }}>
              {result.summary}
            </p>
          </div>

          {/* PROMINENT Editorial Suggestions */}
          <div ref={suggestionsRef} style={{ scrollMarginTop: '96px', marginTop: 'var(--space-6)' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #1075DC',
              borderRadius: '12px',
              padding: 'var(--space-8)',
              boxShadow: '0 4px 24px rgba(22, 41, 80, 0.08)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-6)'
              }}>
                <div style={{
                  padding: 'var(--space-3)',
                  background: 'linear-gradient(135deg, #0158AE 0%, #1075DC 100%)',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(1, 88, 174, 0.25)'
                }}>
                  <Lightbulb style={{ width: '28px', height: '28px', color: 'white' }} />
                </div>
                <div>
                  <h2 style={{ marginBottom: '4px', color: '#162950' }}>Editorial Suggestions</h2>
                  <p style={{
                    fontSize: 'var(--text-small)',
                    color: '#64748b',
                    margin: 0
                  }}>
                    Key insights to strengthen your content
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--space-6)'
              }}>
                {/* Present Perspectives */}
                <div style={{
                  backgroundColor: 'var(--color-bone)',
                  borderRadius: 'var(--radius-base)',
                  padding: 'var(--card-padding-desktop)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-success)'
                }}>
                  <h3 style={{
                    fontSize: 'var(--text-h3)',
                    fontWeight: 'var(--weight-semibold)',
                    color: 'var(--color-success)',
                    marginBottom: 'var(--space-3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <CheckCircle style={{ width: '20px', height: '20px' }} />
                    What You're Already Using
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-mid-gray)',
                    fontWeight: 'var(--weight-medium)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    Your content includes these perspectives:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {result.editorialSuggestions.presentPerspectives.map((perspective, idx) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-3)',
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        borderRadius: 'var(--radius-base)',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <span style={{
                          color: 'var(--color-success)',
                          marginTop: '2px',
                          fontSize: '20px',
                          flexShrink: 0
                        }}>✓</span>
                        <span style={{
                          color: 'var(--color-soft-black)',
                          fontSize: 'var(--text-small)',
                          lineHeight: 'var(--leading-relaxed)',
                          fontWeight: 'var(--weight-medium)'
                        }}>
                          {linkifyAuthors(perspective)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Perspectives */}
                <div style={{
                  backgroundColor: 'var(--color-bone)',
                  borderRadius: 'var(--radius-base)',
                  padding: 'var(--card-padding-desktop)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-warning)'
                }}>
                  <h3 style={{
                    fontSize: 'var(--text-h3)',
                    fontWeight: 'var(--weight-semibold)',
                    color: 'var(--color-warning)',
                    marginBottom: 'var(--space-3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <AlertCircle style={{ width: '20px', height: '20px' }} />
                    What You're Missing
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-mid-gray)',
                    fontWeight: 'var(--weight-medium)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    Consider adding these to strengthen your argument:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {result.editorialSuggestions.missingPerspectives.map((perspective, idx) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-3)',
                        backgroundColor: 'rgba(245, 158, 11, 0.08)',
                        borderRadius: 'var(--radius-base)',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        <span style={{
                          color: 'var(--color-warning)',
                          marginTop: '2px',
                          fontSize: '20px',
                          flexShrink: 0
                        }}>!</span>
                        <span style={{
                          color: 'var(--color-soft-black)',
                          fontSize: 'var(--text-small)',
                          lineHeight: 'var(--leading-relaxed)',
                          fontWeight: 'var(--weight-medium)'
                        }}>
                          {linkifyAuthors(perspective)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Thought Leaders */}
          {result.matchedCamps.length > 0 && (
            <div ref={authorsRef} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: 'var(--card-padding-desktop)',
              boxShadow: '0 2px 12px rgba(22, 41, 80, 0.06)',
              border: '1px solid #AADAF9',
              scrollMarginTop: '96px',
              marginTop: 'var(--space-6)'
            }}>
              <h2 style={{
                marginBottom: 'var(--space-2)',
                color: '#162950',
                fontSize: '1.25rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Users style={{ width: '22px', height: '22px', color: '#1075DC' }} />
                Relevant Thought Leaders
                <span style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#64748b',
                  marginLeft: '4px'
                }}>
                  ({result.matchedCamps.length} perspectives)
                </span>
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                marginBottom: 'var(--space-6)',
                lineHeight: '1.5'
              }}>
                See what each thought leader believes and how their ideas specifically support or challenge your draft.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {result.matchedCamps.map((camp, idx) => {
                  const campColors = getStanceColor(camp.topAuthors[0]?.stance || 'partial')
                  return (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #AADAF9',
                        borderRadius: '12px',
                        padding: 'var(--space-5)',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 8px rgba(22, 41, 80, 0.04)',
                        transition: 'all var(--duration-fast) var(--ease-out)'
                      }}
                    >
                      {/* Camp Header */}
                      <div style={{ marginBottom: 'var(--space-4)' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          marginBottom: 'var(--space-2)'
                        }}>
                          <Link
                            href={`/results?q=${encodeURIComponent(camp.campLabel)}`}
                            style={{
                              fontWeight: 600,
                              fontSize: '17px',
                              color: '#162950',
                              textDecoration: 'none',
                              transition: 'color var(--duration-fast) var(--ease-out)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#1075DC'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#162950'
                            }}
                          >
                            {camp.campLabel}
                            <span style={{ fontSize: '14px', opacity: 0.6 }}>→</span>
                          </Link>
                          <button
                            onClick={() => likedCamps.has(idx)
                              ? removeHelpfulInsight('camp', idx)
                              : saveHelpfulInsight('camp', camp.explanation, camp.campLabel, idx)
                            }
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 10px',
                              borderRadius: '14px',
                              border: likedCamps.has(idx) ? '1px solid #10b981' : '1px solid #e5e7eb',
                              backgroundColor: likedCamps.has(idx) ? '#d1fae5' : 'white',
                              color: likedCamps.has(idx) ? '#059669' : '#6b7280',
                              fontSize: '11px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              flexShrink: 0
                            }}
                            title={likedCamps.has(idx) ? 'Remove from helpful insights' : 'Save as helpful'}
                          >
                            <ThumbsUp style={{ width: '12px', height: '12px', fill: likedCamps.has(idx) ? '#059669' : 'none' }} />
                            {likedCamps.has(idx) ? 'Saved' : 'Helpful'}
                          </button>
                        </div>
                        <p style={{
                          fontSize: 'var(--text-small)',
                          color: '#374151',
                          lineHeight: 'var(--leading-relaxed)',
                          margin: 0
                        }}>
                          {camp.explanation}
                        </p>
                      </div>

                      {/* Author Cards */}
                      {camp.topAuthors.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                          {camp.topAuthors.map((author, authorIdx) => {
                            const colors = getStanceColor(author.stance)
                            return (
                              <div
                                key={authorIdx}
                                style={{
                                  border: `1px solid ${colors.border}`,
                                  borderRadius: 'var(--radius-base)',
                                  padding: 'var(--space-4)',
                                  backgroundColor: colors.bg
                                }}
                              >
                                {/* Author Header */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  justifyContent: 'space-between',
                                  marginBottom: 'var(--space-3)'
                                }}>
                                  <div style={{ flex: 1 }}>
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 'var(--space-2)',
                                      marginBottom: 'var(--space-1)'
                                    }}>
                                      {author.id ? (
                                        <button
                                          onClick={() => openPanel(author.id as string)}
                                          style={{
                                            fontWeight: 'var(--weight-semibold)',
                                            fontSize: 'var(--text-body)',
                                            color: '#0158AE',
                                            textDecoration: 'none',
                                            margin: 0,
                                            background: 'none',
                                            border: 'none',
                                            padding: 0,
                                            cursor: 'pointer',
                                            transition: 'color var(--duration-fast) var(--ease-out)'
                                          }}
                                          onMouseEnter={(e) => e.currentTarget.style.color = '#1075DC'}
                                          onMouseLeave={(e) => e.currentTarget.style.color = '#0158AE'}
                                        >
                                          {author.name}
                                        </button>
                                      ) : (
                                        <h4 style={{
                                          fontWeight: 'var(--weight-semibold)',
                                          fontSize: 'var(--text-body)',
                                          color: 'var(--color-soft-black)',
                                          margin: 0
                                        }}>
                                          {author.name}
                                        </h4>
                                      )}
                                      <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-1)',
                                        padding: '2px 8px',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: 'var(--text-caption)',
                                        fontWeight: 'var(--weight-medium)',
                                        border: `1px solid ${colors.border}`,
                                        backgroundColor: colors.bg,
                                        color: colors.text
                                      }}>
                                        {getStanceIcon(author.stance)}
                                        {getStanceLabel(author.stance)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Position */}
                                <div style={{ marginBottom: 'var(--space-3)' }}>
                                  <p style={{
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: '#64748b',
                                    marginBottom: '6px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                  }}>
                                    What they believe
                                  </p>
                                  <p style={{
                                    fontSize: '14px',
                                    color: '#1f2937',
                                    lineHeight: '1.6',
                                    margin: 0
                                  }}>
                                    {author.position}
                                  </p>
                                </div>

                                {/* Draft Connection - How this relates to the user's draft */}
                                {author.draftConnection && (
                                  <div style={{
                                    marginBottom: 'var(--space-3)',
                                    padding: '12px 14px',
                                    backgroundColor: author.stance === 'agrees'
                                      ? 'rgba(16, 185, 129, 0.06)'
                                      : author.stance === 'disagrees'
                                      ? 'rgba(239, 68, 68, 0.06)'
                                      : 'rgba(245, 158, 11, 0.06)',
                                    borderRadius: '8px',
                                    borderLeft: `3px solid ${
                                      author.stance === 'agrees'
                                        ? '#10b981'
                                        : author.stance === 'disagrees'
                                        ? '#ef4444'
                                        : '#f59e0b'
                                    }`
                                  }}>
                                    <p style={{
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      color: author.stance === 'agrees'
                                        ? '#059669'
                                        : author.stance === 'disagrees'
                                        ? '#dc2626'
                                        : '#d97706',
                                      marginBottom: '6px',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.3px'
                                    }}>
                                      {author.stance === 'agrees'
                                        ? '✓ Supports your draft'
                                        : author.stance === 'disagrees'
                                        ? '✗ Challenges your draft'
                                        : '◐ Relates to your draft'}
                                    </p>
                                    <p style={{
                                      fontSize: '14px',
                                      color: '#1f2937',
                                      lineHeight: '1.6',
                                      margin: 0
                                    }}>
                                      {author.draftConnection}
                                    </p>
                                  </div>
                                )}

                                {/* Quote - Clickable if source URL exists */}
                                {author.quote && (
                                  author.sourceUrl ? (
                                    <a
                                      href={author.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={author.sourceUrl}
                                      style={{
                                        display: 'block',
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #AADAF9',
                                        borderRadius: '8px',
                                        padding: 'var(--space-3)',
                                        textDecoration: 'none',
                                        transition: 'all var(--duration-fast) var(--ease-out)',
                                        cursor: 'pointer'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#1075DC'
                                        e.currentTarget.style.backgroundColor = 'rgba(16, 117, 220, 0.05)'
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#AADAF9'
                                        e.currentTarget.style.backgroundColor = '#FFFFFF'
                                      }}
                                    >
                                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        <Quote style={{
                                          width: '16px',
                                          height: '16px',
                                          color: '#1075DC',
                                          flexShrink: 0,
                                          marginTop: '2px'
                                        }} />
                                        <div style={{ flex: 1 }}>
                                          <p style={{
                                            fontSize: 'var(--text-small)',
                                            fontStyle: 'italic',
                                            color: '#162950',
                                            margin: 0,
                                            lineHeight: 'var(--leading-relaxed)'
                                          }}>
                                            "{author.quote}"
                                          </p>
                                          <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-1)',
                                            fontSize: 'var(--text-caption)',
                                            color: '#0158AE',
                                            marginTop: 'var(--space-2)'
                                          }}>
                                            <ExternalLink style={{ width: '12px', height: '12px' }} />
                                            {(() => {
                                              try {
                                                const url = new URL(author.sourceUrl)
                                                // Extract readable source name from domain
                                                const domain = url.hostname.replace('www.', '')
                                                // Map common domains to readable names
                                                const domainNames: Record<string, string> = {
                                                  'nytimes.com': 'New York Times',
                                                  'wsj.com': 'Wall Street Journal',
                                                  'wired.com': 'WIRED',
                                                  'theverge.com': 'The Verge',
                                                  'techcrunch.com': 'TechCrunch',
                                                  'medium.com': 'Medium',
                                                  'substack.com': 'Substack',
                                                  'youtube.com': 'YouTube',
                                                  'twitter.com': 'Twitter',
                                                  'x.com': 'X',
                                                  'linkedin.com': 'LinkedIn',
                                                  'forbes.com': 'Forbes',
                                                  'bloomberg.com': 'Bloomberg',
                                                  'ft.com': 'Financial Times',
                                                  'economist.com': 'The Economist',
                                                  'hbr.org': 'Harvard Business Review',
                                                  'mit.edu': 'MIT',
                                                  'stanford.edu': 'Stanford',
                                                  'arxiv.org': 'arXiv',
                                                  'nature.com': 'Nature',
                                                  'science.org': 'Science',
                                                  'github.com': 'GitHub',
                                                  'openai.com': 'OpenAI',
                                                  'anthropic.com': 'Anthropic',
                                                  'google.com': 'Google',
                                                  'deepmind.com': 'DeepMind',
                                                  'a16z.com': 'a16z',
                                                  'pmarca.substack.com': 'Substack',
                                                  'time.com': 'TIME',
                                                  'washingtonpost.com': 'Washington Post',
                                                  'theguardian.com': 'The Guardian',
                                                  'bbc.com': 'BBC',
                                                  'cnn.com': 'CNN',
                                                  'reuters.com': 'Reuters',
                                                  'apnews.com': 'AP News',
                                                }
                                                const siteName = domainNames[domain] || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
                                                return `Read on ${siteName}`
                                              } catch {
                                                return 'View source'
                                              }
                                            })()}
                                          </span>
                                        </div>
                                      </div>
                                    </a>
                                  ) : (
                                    <div style={{
                                      backgroundColor: '#DCF2FA',
                                      border: '1px solid #AADAF9',
                                      borderRadius: '8px',
                                      padding: 'var(--space-3)'
                                    }}>
                                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        <Quote style={{
                                          width: '16px',
                                          height: '16px',
                                          color: '#48AFF0',
                                          flexShrink: 0,
                                          marginTop: '2px'
                                        }} />
                                        <p style={{
                                          fontSize: 'var(--text-small)',
                                          fontStyle: 'italic',
                                          color: '#162950',
                                          margin: 0,
                                          lineHeight: 'var(--leading-relaxed)'
                                        }}>
                                          "{author.quote}"
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          </div>{/* End of PDF Export Container */}
        </div>
      )}
    </div>
  )
}

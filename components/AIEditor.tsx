'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { AIEditorAnalyzeResponse } from '@/lib/ai-editor'
import { getThoughtLeaders } from '@/lib/api/thought-leaders'
import { useToast } from '@/components/Toast'
import { Sparkles, AlertCircle, CheckCircle, Loader2, ThumbsUp, ThumbsDown, Minus, Quote, ExternalLink, ChevronDown, Lightbulb, Users, Bookmark, Copy, FileDown } from 'lucide-react'

// Loading phase messages for progressive feedback
const LOADING_PHASES = [
  { message: 'Analyzing your text...', duration: 2000 },
  { message: 'Finding relevant thought leaders...', duration: 4000 },
  { message: 'Comparing perspectives to your draft...', duration: 5000 },
  { message: 'Generating editorial suggestions...', duration: 0 }, // Final phase, no auto-advance
]

interface AIEditorProps {
  initialText?: string
}

export default function AIEditor({ initialText = '' }: AIEditorProps) {
  const [text, setText] = useState(initialText)
  const [result, setResult] = useState<AIEditorAnalyzeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedOnce, setSavedOnce] = useState(false)
  const [allAuthors, setAllAuthors] = useState<Array<{ id: string; name: string }>>([])
  const [copying, setCopying] = useState(false)
  const [exporting, setExporting] = useState(false)
  const { showToast } = useToast()

  const suggestionsRef = useRef<HTMLDivElement>(null)
  const authorsRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Update text when initialText prop changes (e.g., from MiniAIEditor)
  useEffect(() => {
    if (initialText) {
      setText(initialText)
      setResult(null)
      setError(null)
      setSavedOnce(false)
    }
  }, [initialText])

  // Listen for load text events from sidebar
  useEffect(() => {
    const handleLoadText = (e: Event) => {
      const ev = e as CustomEvent<{ text: string; cachedResult?: AIEditorAnalyzeResponse }>
      if (ev?.detail?.text) {
        setText(ev.detail.text)
        // If there's a cached result, restore it; otherwise clear
        setResult(ev.detail.cachedResult || null)
        setError(null)
        setSavedOnce(false)
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

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const addToRecentSearches = (searchText: string, analysisResult: AIEditorAnalyzeResponse) => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')

      // Create preview (first 60 chars)
      const preview = searchText.length > 60 ? searchText.substring(0, 60) + '...' : searchText

      // Remove if already exists
      const filtered = recent.filter((s: any) => s.query !== preview)

      // Add to beginning with cached result
      filtered.unshift({
        id: `recent-ai-editor-${Date.now()}`,
        query: preview,
        type: 'ai-editor',
        fullText: searchText,
        cachedResult: analysisResult,
        timestamp: new Date().toISOString()
      })

      // Keep only last 20
      const limited = filtered.slice(0, 20)
      localStorage.setItem('recentSearches', JSON.stringify(limited))
    } catch (error) {
      console.error('Error adding to recent searches:', error)
    }
  }

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze')
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

    // Start the first timer
    if (LOADING_PHASES[0].duration > 0) {
      phaseTimers.push(setTimeout(advancePhase, LOADING_PHASES[0].duration))
    }

    try {
      const response = await fetch('/api/brain/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || data.message || 'Analysis failed')
      } else {
        setResult(data)
        // Add to recent searches with cached result
        addToRecentSearches(text, data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      // Clear all phase timers
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

      // Add to beginning
      filtered.unshift({
        id: `ai-editor-${Date.now()}`,
        text: text.trim(),
        preview,
        timestamp: new Date().toISOString()
      })

      // Keep only last 20
      const limited = filtered.slice(0, 20)
      localStorage.setItem('savedAIEditorAnalyses', JSON.stringify(limited))

      setSavedOnce(true)
      showToast('Analysis saved successfully')
      window.dispatchEvent(new CustomEvent('ai-editor-saved', {
        detail: { text: text.trim(), preview, timestamp: new Date().toISOString() }
      }))
    } catch (e) {
      console.error('Error saving AI editor analysis:', e)
      showToast('Failed to save analysis', 'error')
    } finally {
      setSaving(false)
    }
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
        <Link
          key={`author-link-${linkKey++}`}
          href={authorId ? `/author/${authorId}` : `/authors`}
          style={{
            color: 'var(--color-accent)',
            fontWeight: 'var(--weight-semibold)',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(99, 102, 241, 0.3)',
            textUnderlineOffset: '2px',
            transition: 'all var(--duration-fast) var(--ease-out)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecorationColor = 'var(--color-accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecorationColor = 'rgba(99, 102, 241, 0.3)'
          }}
        >
          {authorName}
        </Link>
      )

      lastIndex = regex.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  return (
    <div style={{ maxWidth: 'var(--width-wide)' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--color-cloud)',
        borderRadius: 'var(--radius-base)',
        padding: 'var(--space-8)',
        marginBottom: 'var(--space-8)',
        border: '1px solid var(--color-light-gray)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div style={{
            padding: 'var(--space-3)',
            backgroundColor: 'var(--color-accent)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ marginBottom: 'var(--space-1)' }}>AI Editor</h1>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-mid-gray)', margin: 0 }}>
              Editorial analysis powered by AI
            </p>
          </div>
        </div>
        <p style={{
          fontSize: 'var(--text-body)',
          color: 'var(--color-charcoal)',
          lineHeight: 'var(--leading-relaxed)',
          margin: 0
        }}>
          Paste your draft or paragraph, and get instant editorial feedback. AI Editor analyzes your text against our collection of thought leaders, identifying which perspectives you're using and which you might be missing.
        </p>
      </div>

      {/* Input Section */}
      <div style={{
        backgroundColor: 'var(--color-cloud)',
        borderRadius: 'var(--radius-base)',
        padding: 'var(--card-padding-desktop)',
        marginBottom: 'var(--space-6)',
        border: '1px solid var(--color-light-gray)'
      }}>
        <label htmlFor="ai-editor-text-input" style={{
          display: 'block',
          fontSize: 'var(--text-small)',
          fontWeight: 'var(--weight-medium)',
          color: 'var(--color-soft-black)',
          marginBottom: 'var(--space-3)'
        }}>
          Your Text
          <span style={{
            fontSize: 'var(--text-caption)',
            fontWeight: 'var(--weight-normal)',
            color: 'var(--color-mid-gray)',
            marginLeft: 'var(--space-2)'
          }}>
            (1-3 paragraphs recommended, max 4,000 characters)
          </span>
        </label>
        <textarea
          id="ai-editor-text-input"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="ai-editor-textarea"
          style={{
            width: '100%',
            height: '192px',
            padding: 'var(--space-4)',
            border: '1px solid var(--color-light-gray)',
            borderRadius: 'var(--radius-base)',
            fontSize: 'var(--text-small)',
            fontFamily: 'ui-monospace, monospace',
            backgroundColor: 'var(--color-bone)',
            color: 'var(--color-soft-black)',
            resize: 'none',
            outline: 'none',
            transition: 'border-color var(--duration-fast) var(--ease-out)'
          }}
          placeholder="Paste your draft here... For example:

Artificial intelligence is transforming how companies approach innovation. AI-first strategies are becoming critical for competitive advantage in the market..."
        />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'var(--space-3)'
        }}>
          <p style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--color-mid-gray)',
            margin: 0
          }}>
            {text.length} / 4,000 characters
            {text.length > 4000 && (
              <span style={{ color: 'var(--color-error)', marginLeft: 'var(--space-2)' }}>
                Text will be truncated
              </span>
            )}
          </p>
          <p style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--color-mid-gray)',
            margin: 0
          }}>
            Press <kbd style={{
              padding: '2px 6px',
              backgroundColor: 'var(--color-pale-gray)',
              border: '1px solid var(--color-light-gray)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-caption)'
            }}>⌘+Enter</kbd> to analyze
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <button
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          style={{
            flex: 1,
            backgroundColor: loading || !text.trim() ? 'var(--color-mid-gray)' : 'var(--color-accent)',
            color: 'white',
            padding: 'var(--space-4) var(--space-6)',
            borderRadius: 'var(--radius-base)',
            fontSize: 'var(--text-body)',
            fontWeight: 'var(--weight-medium)',
            border: 'none',
            cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
            transition: 'all var(--duration-fast) var(--ease-out)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)'
          }}
          onMouseEnter={(e) => {
            if (!loading && text.trim()) {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'
              e.currentTarget.style.boxShadow = 'var(--shadow-base)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && text.trim()) {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)'
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
            }
          }}
          title="Analyze your text to discover which thought leaders agree or disagree with your perspective"
        >
          {loading ? (
            <>
              <Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" />
              {LOADING_PHASES[loadingPhase].message}
            </>
          ) : (
            <>
              <Sparkles style={{ width: '20px', height: '20px' }} />
              Analyze with AI Editor
            </>
          )}
        </button>
      </div>

      {/* Loading Progress Indicator */}
      {loading && (
        <div style={{
          backgroundColor: 'var(--color-cloud)',
          border: '1px solid var(--color-light-gray)',
          borderRadius: 'var(--radius-base)',
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
                  <CheckCircle style={{ width: '16px', height: '16px', color: 'var(--color-success)' }} />
                ) : idx === loadingPhase ? (
                  <Loader2 style={{ width: '16px', height: '16px', color: 'var(--color-accent)' }} className="animate-spin" />
                ) : (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid var(--color-light-gray)'
                  }} />
                )}
                <span style={{
                  fontSize: 'var(--text-small)',
                  color: idx <= loadingPhase ? 'var(--color-soft-black)' : 'var(--color-mid-gray)',
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
          {/* Quick Navigation */}
          <div style={{
            backgroundColor: 'var(--color-cloud)',
            border: '1px solid var(--color-light-gray)',
            borderRadius: 'var(--radius-base)',
            padding: 'var(--space-5)',
            boxShadow: 'var(--shadow-base)'
          }}>
            <h3 style={{
              fontSize: 'var(--text-small)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-soft-black)',
              marginBottom: 'var(--space-3)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <ChevronDown style={{ width: '16px', height: '16px' }} />
              Jump to Section
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <button
                onClick={() => scrollToSection(summaryRef)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  backgroundColor: 'var(--color-bone)',
                  border: '1px solid var(--color-light-gray)',
                  color: 'var(--color-accent)',
                  borderRadius: 'var(--radius-base)',
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--weight-medium)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-out)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent-light)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bone)'
                }}
              >
                <CheckCircle style={{ width: '16px', height: '16px' }} />
                Summary
              </button>
              <button
                onClick={() => scrollToSection(suggestionsRef)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  backgroundColor: 'var(--color-bone)',
                  border: '1px solid var(--color-light-gray)',
                  color: 'var(--color-accent)',
                  borderRadius: 'var(--radius-base)',
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--weight-medium)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-out)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent-light)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bone)'
                }}
              >
                <Lightbulb style={{ width: '16px', height: '16px' }} />
                Editorial Suggestions
              </button>
              <button
                onClick={() => scrollToSection(authorsRef)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  backgroundColor: 'var(--color-bone)',
                  border: '1px solid var(--color-light-gray)',
                  color: 'var(--color-accent)',
                  borderRadius: 'var(--radius-base)',
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--weight-medium)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-out)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent-light)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bone)'
                }}
              >
                <Users style={{ width: '16px', height: '16px' }} />
                Thought Leaders ({result.matchedCamps.length})
              </button>

              {/* Spacer to push action buttons to the right */}
              <div style={{ flex: 1 }} />

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                disabled={copying}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  backgroundColor: 'var(--color-bone)',
                  border: '1px solid var(--color-light-gray)',
                  color: 'var(--color-charcoal)',
                  borderRadius: 'var(--radius-base)',
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--weight-medium)',
                  cursor: copying ? 'not-allowed' : 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-out)'
                }}
                onMouseEnter={(e) => {
                  if (!copying) {
                    e.currentTarget.style.backgroundColor = 'var(--color-pale-gray)'
                    e.currentTarget.style.borderColor = 'var(--color-mid-gray)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copying) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bone)'
                    e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                  }
                }}
                title="Copy analysis as formatted text"
              >
                <Copy style={{ width: '16px', height: '16px' }} />
                {copying ? 'Copying...' : 'Copy'}
              </button>

              {/* PDF Export Button */}
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  backgroundColor: 'var(--color-bone)',
                  border: '1px solid var(--color-light-gray)',
                  color: 'var(--color-charcoal)',
                  borderRadius: 'var(--radius-base)',
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--weight-medium)',
                  cursor: exporting ? 'not-allowed' : 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-out)'
                }}
                onMouseEnter={(e) => {
                  if (!exporting) {
                    e.currentTarget.style.backgroundColor = 'var(--color-pale-gray)'
                    e.currentTarget.style.borderColor = 'var(--color-mid-gray)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!exporting) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bone)'
                    e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                  }
                }}
                title="Download analysis as PDF"
              >
                <FileDown style={{ width: '16px', height: '16px' }} />
                {exporting ? 'Exporting...' : 'PDF'}
              </button>

              {/* Save Analysis Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  backgroundColor: savedOnce ? 'var(--color-success)' : 'var(--color-bone)',
                  border: savedOnce ? '1px solid var(--color-success)' : '1px solid var(--color-light-gray)',
                  color: savedOnce ? 'white' : 'var(--color-accent)',
                  borderRadius: 'var(--radius-base)',
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--weight-medium)',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-out)'
                }}
                onMouseEnter={(e) => {
                  if (!saving && !savedOnce) {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent-light)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving && !savedOnce) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bone)'
                  }
                }}
                title={savedOnce ? 'Analysis saved - find it in your sidebar' : 'Save this analysis to revisit later'}
              >
                <Bookmark style={{ width: '16px', height: '16px' }} />
                {savedOnce ? 'Saved' : saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* PDF Export Container - wraps all exportable content */}
          <div ref={resultsRef}>
          {/* Summary */}
          <div ref={summaryRef} style={{
            backgroundColor: 'var(--color-cloud)',
            borderRadius: 'var(--radius-base)',
            padding: 'var(--card-padding-desktop)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-light-gray)',
            scrollMarginTop: '96px'
          }}>
            <h2 style={{
              marginBottom: 'var(--space-3)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <CheckCircle style={{ width: '20px', height: '20px', color: 'var(--color-success)' }} />
              Summary
            </h2>
            <p style={{
              color: 'var(--color-charcoal)',
              lineHeight: 'var(--leading-relaxed)',
              margin: 0
            }}>
              {result.summary}
            </p>
          </div>

          {/* PROMINENT Editorial Suggestions */}
          <div ref={suggestionsRef} style={{ scrollMarginTop: '96px' }}>
            <div style={{
              backgroundColor: 'var(--color-cloud)',
              border: '2px solid var(--color-accent)',
              borderRadius: 'var(--radius-base)',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-6)'
              }}>
                <div style={{
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--color-accent)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <Lightbulb style={{ width: '28px', height: '28px', color: 'white' }} />
                </div>
                <div>
                  <h2 style={{ marginBottom: '4px' }}>Editorial Suggestions</h2>
                  <p style={{
                    fontSize: 'var(--text-small)',
                    color: 'var(--color-charcoal)',
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
              backgroundColor: 'var(--color-cloud)',
              borderRadius: 'var(--radius-base)',
              padding: 'var(--card-padding-desktop)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-light-gray)',
              scrollMarginTop: '96px'
            }}>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>
                Relevant Thought Leaders ({result.matchedCamps.length} perspectives)
              </h2>
              <p style={{
                fontSize: 'var(--text-small)',
                color: 'var(--color-mid-gray)',
                marginBottom: 'var(--space-6)'
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
                        border: '1px solid var(--color-light-gray)',
                        borderRadius: 'var(--radius-base)',
                        padding: 'var(--space-5)',
                        backgroundColor: 'var(--color-bone)',
                        transition: 'all var(--duration-fast) var(--ease-out)'
                      }}
                    >
                      {/* Camp Header */}
                      <div style={{ marginBottom: 'var(--space-4)' }}>
                        <Link
                          href={`/results?q=${encodeURIComponent(camp.campLabel)}`}
                          style={{
                            fontWeight: 'var(--weight-semibold)',
                            fontSize: 'var(--text-h3)',
                            color: 'var(--color-soft-black)',
                            marginBottom: 'var(--space-2)',
                            display: 'block',
                            textDecoration: 'none',
                            transition: 'color var(--duration-fast) var(--ease-out)',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--color-accent)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--color-soft-black)'
                          }}
                        >
                          {camp.campLabel}
                        </Link>
                        <p style={{
                          fontSize: 'var(--text-small)',
                          color: 'var(--color-charcoal)',
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
                                        <Link
                                          href={`/author/${author.id}`}
                                          style={{
                                            fontWeight: 'var(--weight-semibold)',
                                            fontSize: 'var(--text-body)',
                                            color: 'var(--color-accent)',
                                            textDecoration: 'none',
                                            margin: 0,
                                            transition: 'color var(--duration-fast) var(--ease-out)'
                                          }}
                                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-hover)'}
                                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                                        >
                                          {author.name} →
                                        </Link>
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
                                    fontSize: 'var(--text-small)',
                                    fontWeight: 'var(--weight-medium)',
                                    color: 'var(--color-mid-gray)',
                                    marginBottom: 'var(--space-1)'
                                  }}>
                                    What they believe:
                                  </p>
                                  <p style={{
                                    fontSize: 'var(--text-small)',
                                    color: 'var(--color-soft-black)',
                                    lineHeight: 'var(--leading-relaxed)',
                                    margin: 0
                                  }}>
                                    {author.position}
                                  </p>
                                </div>

                                {/* Draft Connection - How this relates to the user's draft */}
                                {author.draftConnection && (
                                  <div style={{
                                    marginBottom: 'var(--space-3)',
                                    padding: 'var(--space-3)',
                                    backgroundColor: author.stance === 'agrees'
                                      ? 'rgba(16, 185, 129, 0.08)'
                                      : author.stance === 'disagrees'
                                      ? 'rgba(239, 68, 68, 0.08)'
                                      : 'rgba(245, 158, 11, 0.08)',
                                    borderRadius: 'var(--radius-base)',
                                    borderLeft: `3px solid ${
                                      author.stance === 'agrees'
                                        ? 'var(--color-success)'
                                        : author.stance === 'disagrees'
                                        ? 'var(--color-error)'
                                        : 'var(--color-warning)'
                                    }`
                                  }}>
                                    <p style={{
                                      fontSize: 'var(--text-small)',
                                      fontWeight: 'var(--weight-semibold)',
                                      color: author.stance === 'agrees'
                                        ? 'var(--color-success)'
                                        : author.stance === 'disagrees'
                                        ? 'var(--color-error)'
                                        : 'var(--color-warning)',
                                      marginBottom: 'var(--space-1)'
                                    }}>
                                      {author.stance === 'agrees'
                                        ? '✓ How this supports your draft:'
                                        : author.stance === 'disagrees'
                                        ? '✗ How this challenges your draft:'
                                        : '◐ How this relates to your draft:'}
                                    </p>
                                    <p style={{
                                      fontSize: 'var(--text-small)',
                                      color: 'var(--color-soft-black)',
                                      lineHeight: 'var(--leading-relaxed)',
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
                                        backgroundColor: 'var(--color-bone)',
                                        border: '1px solid var(--color-light-gray)',
                                        borderRadius: 'var(--radius-base)',
                                        padding: 'var(--space-3)',
                                        textDecoration: 'none',
                                        transition: 'all var(--duration-fast) var(--ease-out)',
                                        cursor: 'pointer'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-accent)'
                                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)'
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                                        e.currentTarget.style.backgroundColor = 'var(--color-bone)'
                                      }}
                                    >
                                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        <Quote style={{
                                          width: '16px',
                                          height: '16px',
                                          color: 'var(--color-accent)',
                                          flexShrink: 0,
                                          marginTop: '2px'
                                        }} />
                                        <div style={{ flex: 1 }}>
                                          <p style={{
                                            fontSize: 'var(--text-small)',
                                            fontStyle: 'italic',
                                            color: 'var(--color-charcoal)',
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
                                            color: 'var(--color-accent)',
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
                                      backgroundColor: 'var(--color-bone)',
                                      border: '1px solid var(--color-light-gray)',
                                      borderRadius: 'var(--radius-base)',
                                      padding: 'var(--space-3)'
                                    }}>
                                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        <Quote style={{
                                          width: '16px',
                                          height: '16px',
                                          color: 'var(--color-mid-gray)',
                                          flexShrink: 0,
                                          marginTop: '2px'
                                        }} />
                                        <p style={{
                                          fontSize: 'var(--text-small)',
                                          fontStyle: 'italic',
                                          color: 'var(--color-charcoal)',
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

'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AIEditorAnalyzeResponse } from '@/lib/ai-editor'
import { getThoughtLeaders } from '@/lib/api/thought-leaders'
import { useToast } from '@/components/Toast'
import { useAuthorPanel } from '@/contexts/AuthorPanelContext'
import {
  Sparkles, AlertCircle, CheckCircle, ThumbsUp, ThumbsDown, Minus,
  Quote, ExternalLink, Lightbulb, Users, Bookmark, Copy, FileDown,
  ArrowLeft, Plus, Share2, Clock, ChevronDown, ChevronUp
} from 'lucide-react'

interface AIEditorResultsProps {
  text: string
  result: AIEditorAnalyzeResponse
  analysisId: string
  timestamp?: string
}

export default function AIEditorResults({ text, result, analysisId, timestamp }: AIEditorResultsProps) {
  const router = useRouter()
  const { openPanel } = useAuthorPanel()
  const { showToast } = useToast()

  const [allAuthors, setAllAuthors] = useState<Array<{ id: string; name: string }>>([])
  const [copying, setCopying] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [likedSummary, setLikedSummary] = useState(false)
  const [likedCamps, setLikedCamps] = useState<Set<number>>(new Set())
  const [urlCopied, setUrlCopied] = useState(false)
  const [analysisSaved, setAnalysisSaved] = useState(false)
  // Track expanded state for each camp - all open by default
  const [expandedCamps, setExpandedCamps] = useState<Set<number>>(() =>
    new Set(result.matchedCamps.map((_, idx) => idx))
  )

  // Check if this analysis is already saved on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
      const exists = saved.some((s: any) => s.id === analysisId)
      setAnalysisSaved(exists)
    } catch (e) {
      console.error('Error checking saved analyses:', e)
    }
  }, [analysisId])

  const suggestionsRef = useRef<HTMLDivElement>(null)
  const authorsRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

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

  const toggleCampExpanded = (idx: number) => {
    setExpandedCamps(prev => {
      const newSet = new Set(prev)
      if (newSet.has(idx)) {
        newSet.delete(idx)
      } else {
        newSet.add(idx)
      }
      return newSet
    })
  }

  const handleShare = async () => {
    const shareData = {
      title: 'AI Editor Analysis',
      text: result.summary.substring(0, 100) + '...',
      url: window.location.href
    }

    // Use native share if available (mobile, some desktop browsers)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        showToast('Shared successfully!')
      } catch (e) {
        // User cancelled or error - silently ignore cancel
        if ((e as Error).name !== 'AbortError') {
          showToast('Failed to share', 'error')
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        setUrlCopied(true)
        showToast('Link copied to clipboard!')
        setTimeout(() => setUrlCopied(false), 2000)
      } catch (e) {
        showToast('Failed to copy link', 'error')
      }
    }
  }

  const handleSaveAnalysis = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')

      if (analysisSaved) {
        // Remove from saved
        const updated = saved.filter((s: any) => s.id !== analysisId)
        localStorage.setItem('savedAIEditorAnalyses', JSON.stringify(updated))
        setAnalysisSaved(false)
        showToast('Analysis removed from saved')
      } else {
        // Add to saved
        const newSaved = {
          id: analysisId,
          text: text,
          result: result,
          timestamp: timestamp || new Date().toISOString()
        }

        // Add to beginning, limit to 50 analyses
        saved.unshift(newSaved)
        const limited = saved.slice(0, 50)
        localStorage.setItem('savedAIEditorAnalyses', JSON.stringify(limited))
        setAnalysisSaved(true)
        showToast('Analysis saved!')

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('analysis-saved', { detail: newSaved }))
      }
    } catch (e) {
      console.error('Error saving analysis:', e)
      showToast('Failed to save analysis', 'error')
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
        fullText: text,
        cachedResult: result,
        timestamp: new Date().toISOString()
      }

      insights.unshift(newInsight)
      const limited = insights.slice(0, 50)
      localStorage.setItem('helpfulInsights', JSON.stringify(limited))

      if (type === 'summary') {
        setLikedSummary(true)
      } else if (campIdx !== undefined) {
        setLikedCamps(prev => new Set([...prev, campIdx]))
      }

      showToast('Saved to your helpful insights!')
      window.dispatchEvent(new CustomEvent('helpful-insight-added', { detail: newInsight }))
    } catch (e) {
      console.error('Error saving helpful insight:', e)
      showToast('Failed to save insight', 'error')
    }
  }

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
    const lines: string[] = []
    lines.push('AI EDITOR ANALYSIS')
    lines.push('='.repeat(40))
    lines.push('')
    const textPreview = text.length > 200 ? text.substring(0, 200) + '...' : text
    lines.push('ANALYZED TEXT:')
    lines.push(textPreview)
    lines.push('')
    lines.push('SUMMARY')
    lines.push('-'.repeat(40))
    lines.push(result.summary)
    lines.push('')
    lines.push('EDITORIAL SUGGESTIONS')
    lines.push('-'.repeat(40))
    lines.push('')
    lines.push("PERSPECTIVES YOU'RE USING:")
    result.editorialSuggestions.presentPerspectives.forEach((p) => {
      lines.push(`  - ${p}`)
    })
    lines.push('')
    lines.push("PERSPECTIVES YOU'RE MISSING:")
    result.editorialSuggestions.missingPerspectives.forEach((p) => {
      lines.push(`  - ${p}`)
    })
    lines.push('')
    if (result.matchedCamps.length > 0) {
      lines.push(`RELEVANT THOUGHT LEADERS (${result.matchedCamps.length} perspectives)`)
      lines.push('-'.repeat(40))
      lines.push('')
      result.matchedCamps.forEach((camp) => {
        lines.push(`** ${camp.campLabel} **`)
        lines.push(`   ${camp.explanation}`)
        lines.push('')
        camp.topAuthors.forEach((author) => {
          const stanceLabel = author.stance === 'agrees' ? 'Agrees' :
            author.stance === 'disagrees' ? 'Disagrees' : 'Partial'
          lines.push(`   - ${author.name} [${stanceLabel}]`)
          lines.push(`     Position: ${author.position}`)
          if (author.draftConnection) {
            lines.push(`     Connection: ${author.draftConnection}`)
          }
          if (author.quote) {
            lines.push(`     Quote: "${author.quote}"`)
          }
          lines.push('')
        })
      })
    }
    lines.push('-'.repeat(40))
    lines.push('Generated by Compass AI Editor')
    lines.push(`URL: ${window.location.href}`)
    lines.push(`Date: ${new Date().toLocaleDateString()}`)
    return lines.join('\n')
  }

  const handleCopy = async () => {
    if (copying) return
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
    if (exporting || !resultsRef.current) return
    setExporting(true)

    try {
      const printWindow = window.open('', '_blank', 'width=800,height=600')
      if (!printWindow) {
        showToast('Please allow popups to export PDF', 'error')
        setExporting(false)
        return
      }

      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

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
            .header { text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e5e7eb; }
            .header h1 { font-size: 28px; margin: 0 0 8px 0; color: #111827; }
            .header .date { color: #6b7280; font-size: 14px; }
            .section { margin-bottom: 32px; page-break-inside: avoid; }
            .section h2 { font-size: 18px; color: #111827; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
            .summary-text { font-size: 15px; color: #374151; }
            .suggestions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
            .suggestion-box { padding: 16px; border-radius: 8px; }
            .suggestion-box.present { background: #f0fdf4; border: 1px solid #86efac; }
            .suggestion-box.missing { background: #fffbeb; border: 1px solid #fcd34d; }
            .suggestion-box h3 { margin: 0 0 12px 0; }
            .suggestion-box.present h3 { color: #16a34a; }
            .suggestion-box.missing h3 { color: #d97706; }
            .suggestion-box ul { margin: 0; padding-left: 20px; }
            .suggestion-box li { margin-bottom: 8px; font-size: 14px; }
            .camp { margin-bottom: 24px; padding: 20px; background: #f9fafb; border-radius: 8px; page-break-inside: avoid; }
            .camp h3 { margin: 0 0 8px 0; font-size: 17px; }
            .camp-desc { font-size: 14px; color: #6b7280; margin-bottom: 16px; }
            .author { padding: 16px; margin-bottom: 12px; border-radius: 8px; border: 1px solid #e5e7eb; background: white; }
            .author.agrees { border-left: 4px solid #10b981; }
            .author.disagrees { border-left: 4px solid #ef4444; }
            .author.partial { border-left: 4px solid #f59e0b; }
            .author-name { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
            .author-position { font-size: 14px; margin-bottom: 8px; }
            .author-connection { font-size: 14px; padding: 12px; background: #f3f4f6; border-radius: 6px; margin-bottom: 8px; }
            .author-quote { font-size: 14px; font-style: italic; color: #4b5563; padding: 12px; background: #f9fafb; border-left: 3px solid #9ca3af; margin: 0; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
            @media print { body { padding: 20px; } .camp, .author { break-inside: avoid; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AI Editor Analysis</h1>
            <div class="date">${date}</div>
          </div>
          <div class="section">
            <h2>Summary</h2>
            <p class="summary-text">${result.summary}</p>
          </div>
          <div class="section">
            <h2>Editorial Suggestions</h2>
            <div class="suggestions-grid">
              <div class="suggestion-box present">
                <h3>What You're Using</h3>
                <ul>${result.editorialSuggestions.presentPerspectives.map(p => `<li>${p}</li>`).join('')}</ul>
              </div>
              <div class="suggestion-box missing">
                <h3>What You're Missing</h3>
                <ul>${result.editorialSuggestions.missingPerspectives.map(p => `<li>${p}</li>`).join('')}</ul>
              </div>
            </div>
          </div>
          ${result.matchedCamps.length > 0 ? `
          <div class="section">
            <h2>Relevant Thought Leaders</h2>
            ${result.matchedCamps.map(camp => `
              <div class="camp">
                <h3>${camp.campLabel}</h3>
                <p class="camp-desc">${camp.explanation}</p>
                ${camp.topAuthors.map(author => `
                  <div class="author ${author.stance}">
                    <div class="author-name">${author.name}</div>
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
            Generated by Compass AI Editor<br/>
            ${window.location.href}
          </div>
        </body>
        </html>
      `)

      printWindow.document.close()
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          setExporting(false)
        }, 250)
      }
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
      case 'agrees': return { bg: 'rgba(16, 185, 129, 0.08)', border: '#10b981', text: '#059669' }
      case 'disagrees': return { bg: 'rgba(239, 68, 68, 0.08)', border: '#ef4444', text: '#dc2626' }
      case 'partial': return { bg: 'rgba(245, 158, 11, 0.08)', border: '#f59e0b', text: '#d97706' }
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

  // Extract first sentence from text for preview
  const getFirstSentence = (text: string): string => {
    // Match first sentence ending with . ! or ?
    const match = text.match(/^[^.!?]*[.!?]/)
    if (match) {
      return match[0].trim()
    }
    // Fallback: if no sentence ending found, truncate at 80 chars
    return text.length > 80 ? text.substring(0, 80) + '...' : text
  }

  // Build author name to ID map
  const buildAuthorMap = () => {
    const map = new Map<string, string>()
    allAuthors.forEach(author => {
      if (author.id && author.name) {
        map.set(author.name, author.id)
      }
    })
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

  // Parse text and linkify author mentions
  const linkifyAuthors = (text: string) => {
    const authorMap = buildAuthorMap()
    const authorNames = Array.from(authorMap.keys())
    if (authorNames.length === 0) return text

    const escapedNames = authorNames
      .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .sort((a, b) => b.length - a.length)

    const pattern = `\\[([^\\]]+)\\]|\\b(${escapedNames.join('|')})\\b`
    const regex = new RegExp(pattern, 'g')

    const parts = []
    let lastIndex = 0
    let match
    let linkKey = 0

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }

      const bracketedName = match[1]
      const plainName = match[2]
      const authorName = bracketedName || plainName
      const authorId = authorMap.get(authorName)

      parts.push(
        <button
          key={`author-link-${linkKey++}`}
          onClick={() => authorId && openPanel(authorId)}
          style={{
            color: '#0158AE',
            fontWeight: 600,
            textDecoration: 'underline',
            textDecorationColor: 'rgba(1, 88, 174, 0.3)',
            textUnderlineOffset: '2px',
            transition: 'all 0.15s ease',
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
            cursor: authorId ? 'pointer' : 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = '#0158AE'}
          onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'rgba(1, 88, 174, 0.3)'}
        >
          {authorName}
        </button>
      )

      lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  return (
    <div style={{ maxWidth: '100%' }}>
      {/* Page Title */}
      <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 'var(--weight-bold)',
          marginBottom: 'var(--space-2)',
          background: 'linear-gradient(135deg, #162950 0%, #1075DC 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Analysis Results
        </h1>
        {timestamp && (
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <Clock style={{ width: '14px', height: '14px' }} />
            {new Date(timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
      </div>

      {/* Analyzed Text Preview */}
      <div style={{
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #DCF2FA 0%, #AADAF9 100%)',
        border: '1px solid #48AFF0',
        padding: '20px',
        marginBottom: 'var(--space-6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
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
                  const el = document.getElementById('full-analyzed-text-results')
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
              id="full-analyzed-text-results"
              style={{
                display: 'none',
                fontSize: '15px',
                lineHeight: '1.7',
                color: '#162950',
                margin: '12px 0 0 0',
                padding: '16px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                borderRadius: '8px',
                fontStyle: 'italic',
                whiteSpace: 'pre-wrap'
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

      {/* Results Display */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Toolbar */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '10px 16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            {/* Left: New Analysis + Navigation pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                href="/ai-editor"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 12px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#374151',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                New
              </Link>
              <div style={{ width: '1px', height: '20px', backgroundColor: '#e5e7eb' }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '3px',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px'
              }}>
              <button
                onClick={() => scrollToSection(summaryRef)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
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
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Suggestions
              </button>
              <button
                onClick={() => scrollToSection(authorsRef)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Authors
              </button>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleSaveAnalysis}
                title={analysisSaved ? 'Remove from saved' : 'Save this analysis'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  backgroundColor: analysisSaved ? '#0158AE' : 'white',
                  border: analysisSaved ? '1px solid #0158AE' : '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: analysisSaved ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Bookmark style={{ width: '14px', height: '14px', fill: analysisSaved ? 'white' : 'none' }} />
                {analysisSaved ? 'Saved' : 'Save'}
              </button>
              <div style={{ width: '1px', height: '20px', backgroundColor: '#e5e7eb' }} />
              <button
                onClick={handleShare}
                title={urlCopied ? 'Link copied!' : 'Share this analysis'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  backgroundColor: urlCopied ? '#d1fae5' : 'transparent',
                  border: urlCopied ? '1px solid #10b981' : '1px solid #e5e7eb',
                  borderRadius: '6px',
                  color: urlCopied ? '#059669' : '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Share2 style={{ width: '15px', height: '15px' }} />
              </button>
              <button
                onClick={handleCopy}
                disabled={copying}
                title="Copy analysis"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  backgroundColor: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  color: '#6b7280',
                  cursor: copying ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Copy style={{ width: '15px', height: '15px' }} />
              </button>
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                title="Export as PDF"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  backgroundColor: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  color: '#6b7280',
                  cursor: exporting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <FileDown style={{ width: '15px', height: '15px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* PDF Export Container */}
        <div ref={resultsRef}>
          {/* Summary */}
          <div ref={summaryRef} style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(22, 41, 80, 0.06)',
            border: '1px solid #AADAF9',
            scrollMarginTop: '96px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <h2 style={{
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
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

          {/* Editorial Suggestions */}
          <div ref={suggestionsRef} style={{ scrollMarginTop: '96px', marginTop: '24px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #1075DC',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 4px 24px rgba(22, 41, 80, 0.08)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <div style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #0158AE 0%, #1075DC 100%)',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(1, 88, 174, 0.25)'
                }}>
                  <Lightbulb style={{ width: '28px', height: '28px', color: 'white' }} />
                </div>
                <div>
                  <h2 style={{ marginBottom: '4px', color: '#162950' }}>Editorial Suggestions</h2>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                    Key insights to strengthen your content
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
              }}>
                {/* Present Perspectives */}
                <div style={{
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #10b981'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#059669',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle style={{ width: '20px', height: '20px' }} />
                    What You're Already Using
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {result.editorialSuggestions.presentPerspectives.map((perspective, idx) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        borderRadius: '8px',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <span style={{ color: '#059669', fontSize: '18px', flexShrink: 0 }}>✓</span>
                        <span style={{ color: '#1f2937', fontSize: '14px', lineHeight: '1.6', fontWeight: 500 }}>
                          {linkifyAuthors(perspective)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Perspectives */}
                <div style={{
                  backgroundColor: '#fffbeb',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #f59e0b'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#d97706',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertCircle style={{ width: '20px', height: '20px' }} />
                    What You're Missing
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {result.editorialSuggestions.missingPerspectives.map((perspective, idx) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: 'rgba(245, 158, 11, 0.08)',
                        borderRadius: '8px',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        <span style={{ color: '#d97706', fontSize: '18px', flexShrink: 0 }}>!</span>
                        <span style={{ color: '#1f2937', fontSize: '14px', lineHeight: '1.6', fontWeight: 500 }}>
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
              padding: '24px',
              boxShadow: '0 2px 12px rgba(22, 41, 80, 0.06)',
              border: '1px solid #AADAF9',
              scrollMarginTop: '96px',
              marginTop: '24px'
            }}>
              <h2 style={{
                marginBottom: '8px',
                color: '#162950',
                fontSize: '1.25rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Users style={{ width: '22px', height: '22px', color: '#1075DC' }} />
                Relevant Thought Leaders
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b', marginLeft: '4px' }}>
                  ({result.matchedCamps.length} perspectives)
                </span>
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}>
                See what each thought leader believes and how their ideas specifically support or challenge your draft.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {result.matchedCamps.map((camp, idx) => {
                  const isExpanded = expandedCamps.has(idx)
                  return (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #AADAF9',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(22, 41, 80, 0.04)',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Collapsible Header */}
                    <div
                      onClick={() => toggleCampExpanded(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        backgroundColor: isExpanded ? 'transparent' : '#f8fafc',
                        borderBottom: isExpanded ? '1px solid #AADAF9' : 'none',
                        transition: 'background-color 0.1s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <div style={{ flex: 1 }}>
                          <Link
                            href={`/results?q=${encodeURIComponent(camp.campLabel)}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              fontWeight: 600,
                              fontSize: '17px',
                              color: '#0158AE',
                              textDecoration: 'underline',
                              textDecorationColor: 'rgba(1, 88, 174, 0.3)',
                              textUnderlineOffset: '3px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'color 0.1s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#1075DC'
                              e.currentTarget.style.textDecorationColor = '#1075DC'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#0158AE'
                              e.currentTarget.style.textDecorationColor = 'rgba(1, 88, 174, 0.3)'
                            }}
                          >
                            {camp.campLabel}
                            <ExternalLink style={{ width: '14px', height: '14px', opacity: 0.6 }} />
                          </Link>
                          {!isExpanded && (
                            <p style={{
                              fontSize: '13px',
                              color: '#64748b',
                              margin: '4px 0 0 0',
                              lineHeight: '1.4'
                            }}>
                              {camp.topAuthors.length} author{camp.topAuthors.length !== 1 ? 's' : ''} • {getFirstSentence(camp.explanation)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            likedCamps.has(idx)
                              ? removeHelpfulInsight('camp', idx)
                              : saveHelpfulInsight('camp', camp.explanation, camp.campLabel, idx)
                          }}
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
                            flexShrink: 0
                          }}
                        >
                          <ThumbsUp style={{ width: '12px', height: '12px', fill: likedCamps.has(idx) ? '#059669' : 'none' }} />
                          {likedCamps.has(idx) ? 'Saved' : 'Helpful'}
                        </button>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          backgroundColor: '#DCF2FA',
                          color: '#1075DC',
                          transition: 'transform 0.15s ease',
                          transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                        }}>
                          <ChevronDown style={{ width: '18px', height: '18px' }} />
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    <div style={{
                      maxHeight: isExpanded ? '5000px' : '0',
                      opacity: isExpanded ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 0.15s ease, opacity 0.1s ease',
                      padding: isExpanded ? '20px' : '0 20px'
                    }}>
                      <p style={{
                        fontSize: '14px',
                        color: '#374151',
                        lineHeight: '1.6',
                        margin: '0 0 16px 0'
                      }}>
                        {camp.explanation}
                      </p>

                    {/* Author Cards */}
                    {camp.topAuthors.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {camp.topAuthors.map((author, authorIdx) => {
                          const colors = getStanceColor(author.stance)
                          return (
                            <div
                              key={authorIdx}
                              style={{
                                border: `1px solid ${colors.border}`,
                                borderRadius: '8px',
                                padding: '16px',
                                backgroundColor: colors.bg
                              }}
                            >
                              {/* Author Header */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '12px'
                              }}>
                                {author.id ? (
                                  <button
                                    onClick={() => openPanel(author.id as string)}
                                    style={{
                                      fontWeight: 600,
                                      fontSize: '15px',
                                      color: '#0158AE',
                                      background: 'none',
                                      border: 'none',
                                      padding: 0,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {author.name}
                                  </button>
                                ) : (
                                  <span style={{ fontWeight: 600, fontSize: '15px', color: '#1f2937' }}>
                                    {author.name}
                                  </span>
                                )}
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  border: `1px solid ${colors.border}`,
                                  backgroundColor: colors.bg,
                                  color: colors.text
                                }}>
                                  {getStanceIcon(author.stance)}
                                  {getStanceLabel(author.stance)}
                                </span>
                              </div>

                              {/* Position */}
                              <div style={{ marginBottom: '12px' }}>
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

                              {/* Draft Connection */}
                              {author.draftConnection && (
                                <div style={{
                                  marginBottom: '12px',
                                  padding: '12px 14px',
                                  backgroundColor: author.stance === 'agrees'
                                    ? 'rgba(16, 185, 129, 0.06)'
                                    : author.stance === 'disagrees'
                                    ? 'rgba(239, 68, 68, 0.06)'
                                    : 'rgba(245, 158, 11, 0.06)',
                                  borderRadius: '8px',
                                  borderLeft: `3px solid ${colors.border}`
                                }}>
                                  <p style={{
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: colors.text,
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

                              {/* Quote */}
                              {author.quote && (
                                author.sourceUrl ? (
                                  <a
                                    href={author.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'block',
                                      backgroundColor: '#FFFFFF',
                                      border: '1px solid #AADAF9',
                                      borderRadius: '8px',
                                      padding: '12px',
                                      textDecoration: 'none'
                                    }}
                                  >
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <Quote style={{
                                        width: '16px',
                                        height: '16px',
                                        color: '#1075DC',
                                        flexShrink: 0,
                                        marginTop: '2px'
                                      }} />
                                      <div style={{ flex: 1 }}>
                                        <p style={{
                                          fontSize: '14px',
                                          fontStyle: 'italic',
                                          color: '#162950',
                                          margin: 0,
                                          lineHeight: '1.6'
                                        }}>
                                          "{author.quote}"
                                        </p>
                                        <span style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          fontSize: '12px',
                                          color: '#0158AE',
                                          marginTop: '8px'
                                        }}>
                                          <ExternalLink style={{ width: '12px', height: '12px' }} />
                                          View source
                                        </span>
                                      </div>
                                    </div>
                                  </a>
                                ) : (
                                  <div style={{
                                    backgroundColor: '#DCF2FA',
                                    border: '1px solid #AADAF9',
                                    borderRadius: '8px',
                                    padding: '12px'
                                  }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <Quote style={{
                                        width: '16px',
                                        height: '16px',
                                        color: '#48AFF0',
                                        flexShrink: 0,
                                        marginTop: '2px'
                                      }} />
                                      <p style={{
                                        fontSize: '14px',
                                        fontStyle: 'italic',
                                        color: '#162950',
                                        margin: 0,
                                        lineHeight: '1.6'
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
                    </div>{/* End Collapsible Content */}
                  </div>
                )})}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

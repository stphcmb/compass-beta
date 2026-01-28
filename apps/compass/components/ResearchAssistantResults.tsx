'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ResearchAssistantAnalyzeResponse } from '@/lib/research-assistant'
import { getThoughtLeaders } from '@/lib/api/thought-leaders'
import { useToast } from '@/components/Toast'
import { useAuthorPanel } from '@/contexts/AuthorPanelContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  EnhancedAuthorCard,
  AllAuthorsSection,
  useAuthorComparison,
} from '@/components/research-assistant'
import {
  Sparkles,
  AlertCircle,
  CheckCircle,
  ThumbsUp,
  Quote,
  ExternalLink,
  Lightbulb,
  Users,
  Bookmark,
  Copy,
  FileDown,
  Plus,
  Share2,
  Clock,
  ChevronDown,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResearchAssistantResultsProps {
  text: string
  result: ResearchAssistantAnalyzeResponse
  analysisId: string
  timestamp?: string
  highlightSection?: 'summary' | 'camp' | null
  highlightLabel?: string | null
}

export default function ResearchAssistantResults({
  text,
  result,
  analysisId,
  timestamp,
  highlightSection,
  highlightLabel,
}: ResearchAssistantResultsProps) {
  const { openPanel } = useAuthorPanel()
  const { showToast } = useToast()

  // Comparison functionality
  const { comparisonAuthors, toggleAuthorComparison } = useAuthorComparison()

  const [allAuthors, setAllAuthors] = useState<Array<{ id: string; name: string }>>([])
  const [copying, setCopying] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [likedSummary, setLikedSummary] = useState(false)
  const [likedCamps, setLikedCamps] = useState<Set<number>>(new Set())
  const [urlCopied, setUrlCopied] = useState(false)
  const [analysisSaved, setAnalysisSaved] = useState(false)
  // Track expanded state for each camp's nested collapsible
  const [expandedCamps, setExpandedCamps] = useState<Set<number>>(
    () => new Set(result.matchedCamps.map((_, idx) => idx))
  )
  // Track if full analyzed text is expanded
  const [textExpanded, setTextExpanded] = useState(false)

  // Accordion state - default to suggestions and camps expanded
  const [accordionValue, setAccordionValue] = useState<string[]>([
    'suggestions',
    'camps',
  ])

  // Check if this analysis is already saved on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('savedResearchAssistantAnalyses') || '[]'
      )
      const exists = saved.some((s: { id: string }) => s.id === analysisId)
      setAnalysisSaved(exists)
    } catch (e) {
      console.error('Error checking saved analyses:', e)
    }
  }, [analysisId])

  const suggestionsRef = useRef<HTMLButtonElement>(null)
  const authorsRef = useRef<HTMLButtonElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Fetch all authors on mount for linkification
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const authors = await getThoughtLeaders()
        setAllAuthors(authors.map((a) => ({ id: a.id, name: a.name })))
      } catch (error) {
        console.error('Error fetching authors for linkification:', error)
      }
    }
    fetchAuthors()
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Scroll to and highlight the section when navigating from helpful insights
  useEffect(() => {
    if (!highlightSection) return

    const timer = setTimeout(() => {
      if (highlightSection === 'summary' && summaryRef.current) {
        summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        summaryRef.current.style.boxShadow =
          '0 0 0 3px #10b981, 0 4px 24px rgba(16, 185, 129, 0.2)'
        setTimeout(() => {
          if (summaryRef.current) {
            summaryRef.current.style.boxShadow = '0 4px 24px rgba(22, 41, 80, 0.08)'
          }
        }, 2000)
      } else if (highlightSection === 'camp' && highlightLabel) {
        // Find the camp index by label
        const campIdx = result.matchedCamps.findIndex(
          (c) => c.campLabel === highlightLabel
        )
        if (campIdx !== -1) {
          // Ensure camps accordion is expanded
          setAccordionValue((prev) =>
            prev.includes('camps') ? prev : [...prev, 'camps']
          )
          // Ensure this camp is expanded
          setExpandedCamps((prev) => new Set([...prev, campIdx]))
          // Find the camp element by data attribute
          setTimeout(() => {
            const campElement = document.querySelector(
              `[data-camp-label="${highlightLabel}"]`
            )
            if (campElement) {
              campElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
              const el = campElement as HTMLElement
              el.style.boxShadow =
                '0 0 0 3px #10b981, 0 4px 24px rgba(16, 185, 129, 0.2)'
              setTimeout(() => {
                el.style.boxShadow = ''
              }, 2000)
            }
          }, 100)
        }
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [highlightSection, highlightLabel, result.matchedCamps])

  const toggleCampExpanded = (idx: number) => {
    setExpandedCamps((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(idx)) {
        newSet.delete(idx)
      } else {
        newSet.add(idx)
      }
      return newSet
    })
  }

  // Count unique authors across all camps
  const uniqueAuthorCount = useMemo(() => {
    const authorIds = new Set<string>()
    result.matchedCamps.forEach((camp) => {
      camp.topAuthors.forEach((author) => {
        authorIds.add(author.id || author.name)
      })
    })
    return authorIds.size
  }, [result.matchedCamps])

  const handleShare = async () => {
    const shareData = {
      title: 'Research Assistant Analysis',
      text: result.summary.substring(0, 100) + '...',
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        showToast('Shared successfully!')
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          showToast('Failed to share', 'error')
        }
      }
    } else {
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
      const saved = JSON.parse(
        localStorage.getItem('savedResearchAssistantAnalyses') || '[]'
      )

      if (analysisSaved) {
        const updated = saved.filter((s: { id: string }) => s.id !== analysisId)
        localStorage.setItem(
          'savedResearchAssistantAnalyses',
          JSON.stringify(updated)
        )
        setAnalysisSaved(false)
        showToast('Analysis removed from saved')
      } else {
        const newSaved = {
          id: analysisId,
          text: text,
          result: result,
          timestamp: timestamp || new Date().toISOString(),
        }
        saved.unshift(newSaved)
        const limited = saved.slice(0, 50)
        localStorage.setItem(
          'savedResearchAssistantAnalyses',
          JSON.stringify(limited)
        )
        setAnalysisSaved(true)
        showToast('Analysis saved!')
        window.dispatchEvent(new CustomEvent('analysis-saved', { detail: newSaved }))
      }
    } catch (e) {
      console.error('Error saving analysis:', e)
      showToast('Failed to save analysis', 'error')
    }
  }

  const saveHelpfulInsight = (
    type: 'summary' | 'camp',
    content: string,
    campLabel?: string,
    campIdx?: number
  ) => {
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
        analysisId: analysisId,
        timestamp: new Date().toISOString(),
      }

      insights.unshift(newInsight)
      const limited = insights.slice(0, 50)
      localStorage.setItem('helpfulInsights', JSON.stringify(limited))

      if (type === 'summary') {
        setLikedSummary(true)
      } else if (campIdx !== undefined) {
        setLikedCamps((prev) => new Set([...prev, campIdx]))
      }

      showToast('Saved to your helpful insights!')
      window.dispatchEvent(
        new CustomEvent('helpful-insight-added', { detail: newInsight })
      )
    } catch (e) {
      console.error('Error saving helpful insight:', e)
      showToast('Failed to save insight', 'error')
    }
  }

  const removeHelpfulInsight = (type: 'summary' | 'camp', campIdx?: number) => {
    if (type === 'summary') {
      setLikedSummary(false)
    } else if (campIdx !== undefined) {
      setLikedCamps((prev) => {
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
          const stanceLabel =
            author.stance === 'agrees'
              ? 'Agrees'
              : author.stance === 'disagrees'
                ? 'Disagrees'
                : 'Partial'
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
    lines.push('Generated by Compass Research Assistant')
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
        day: 'numeric',
      })

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Research Assistant Analysis - ${date}</title>
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
            <h1>Research Assistant Analysis</h1>
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
                <ul>${result.editorialSuggestions.presentPerspectives.map((p) => `<li>${p}</li>`).join('')}</ul>
              </div>
              <div class="suggestion-box missing">
                <h3>What You're Missing</h3>
                <ul>${result.editorialSuggestions.missingPerspectives.map((p) => `<li>${p}</li>`).join('')}</ul>
              </div>
            </div>
          </div>
          ${
            result.matchedCamps.length > 0
              ? `
          <div class="section">
            <h2>Relevant Thought Leaders</h2>
            ${result.matchedCamps
              .map(
                (camp) => `
              <div class="camp">
                <h3>${camp.campLabel}</h3>
                <p class="camp-desc">${camp.explanation}</p>
                ${camp.topAuthors
                  .map(
                    (author) => `
                  <div class="author ${author.stance}">
                    <div class="author-name">${author.name}</div>
                    <p class="author-position"><strong>Position:</strong> ${author.position}</p>
                    ${author.draftConnection ? `<div class="author-connection"><strong>Connection:</strong> ${author.draftConnection}</div>` : ''}
                    ${author.quote ? `<blockquote class="author-quote">"${author.quote}"</blockquote>` : ''}
                  </div>
                `
                  )
                  .join('')}
              </div>
            `
              )
              .join('')}
          </div>
          `
              : ''
          }
          <div class="footer">
            Generated by Compass Research Assistant<br/>
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
      case 'agrees':
        return { bg: 'rgba(16, 185, 129, 0.08)', border: '#10b981', text: '#059669' }
      case 'disagrees':
        return { bg: 'rgba(239, 68, 68, 0.08)', border: '#ef4444', text: '#dc2626' }
      case 'partial':
        return { bg: 'rgba(245, 158, 11, 0.08)', border: '#f59e0b', text: '#d97706' }
    }
  }

  // Extract first sentence from text for preview
  const getFirstSentence = (text: string): string => {
    const match = text.match(/^[^.!?]*[.!?]/)
    if (match) {
      return match[0].trim()
    }
    return text.length > 80 ? text.substring(0, 80) + '...' : text
  }

  // Build author name to ID map
  const buildAuthorMap = () => {
    const map = new Map<string, string>()
    allAuthors.forEach((author) => {
      if (author.id && author.name) {
        map.set(author.name, author.id)
      }
    })
    if (result?.matchedCamps) {
      result.matchedCamps.forEach((camp) => {
        camp.topAuthors.forEach((author) => {
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
      .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .sort((a, b) => b.length - a.length)

    const pattern = `\\[([^\\]]+)\\]|\\b(${escapedNames.join('|')})\\b`
    const regex = new RegExp(pattern, 'g')

    const parts: (string | React.ReactElement)[] = []
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
          className="text-[#0158AE] font-semibold underline underline-offset-2 decoration-[#0158AE]/30 hover:decoration-[#0158AE] transition-all bg-transparent border-none p-0 cursor-pointer"
          style={{ font: 'inherit' }}
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
    <div className="max-w-full">
      {/* Page Title */}
      <div className="mb-6 text-center">
        <h1
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{
            background: 'linear-gradient(135deg, #162950 0%, #1075DC 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Analysis Results
        </h1>
        {timestamp && (
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {new Date(timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>

      {/* Analyzed Text Preview */}
      <div className="rounded-xl bg-gradient-to-br from-[#DCF2FA] to-[#AADAF9] border border-[#48AFF0] p-5 mb-6">
        <div className="flex items-start gap-3">
          <Quote className="w-6 h-6 text-[#0158AE] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[15px] leading-relaxed text-[#162950] italic whitespace-pre-wrap">
              {textExpanded
                ? text
                : text.length > 300
                  ? text.substring(0, 300) + '...'
                  : text}
            </p>
            {text.length > 300 && (
              <button
                onClick={() => setTextExpanded(!textExpanded)}
                className="mt-2 px-2 py-1 text-xs text-[#1075DC] bg-transparent border-none cursor-pointer underline"
              >
                {textExpanded ? 'Show less' : 'Show full text'}
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#48AFF0] flex items-center justify-between">
          <span className="text-xs text-[#0158AE] font-medium">
            {text.length.toLocaleString()} characters analyzed
          </span>
        </div>
      </div>

      {/* Results Display */}
      <div className="flex flex-col gap-6">
        {/* Toolbar */}
        <div className="bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Left: New Analysis + Navigation pills */}
            <div className="flex items-center gap-3">
              <Link
                href="/research-assistant"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap no-underline"
              >
                <Plus className="w-3.5 h-3.5" />
                New
              </Link>
              <div className="w-px h-5 bg-gray-200" />
              <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 rounded-lg">
                <button
                  onClick={() => scrollToSection(summaryRef)}
                  className="px-3 py-1.5 bg-white border-none rounded-md text-sm font-medium text-[#0158AE] cursor-pointer shadow-sm transition-all"
                >
                  Summary
                </button>
                <button
                  onClick={() => {
                    setAccordionValue((prev) =>
                      prev.includes('suggestions') ? prev : [...prev, 'suggestions']
                    )
                    setTimeout(() => scrollToSection(suggestionsRef), 100)
                  }}
                  className="px-3 py-1.5 bg-transparent border-none rounded-md text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700 transition-all"
                >
                  Suggestions
                </button>
                <button
                  onClick={() => {
                    setAccordionValue((prev) =>
                      prev.includes('camps') ? prev : [...prev, 'camps']
                    )
                    setTimeout(() => scrollToSection(authorsRef), 100)
                  }}
                  className="px-3 py-1.5 bg-transparent border-none rounded-md text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700 transition-all"
                >
                  Authors
                </button>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSaveAnalysis}
                title={analysisSaved ? 'Remove from saved' : 'Save this analysis'}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-all',
                  analysisSaved
                    ? 'bg-[#0158AE] border-[#0158AE] text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                <Bookmark
                  className="w-3.5 h-3.5"
                  fill={analysisSaved ? 'white' : 'none'}
                />
                {analysisSaved ? 'Saved' : 'Save'}
              </button>
              <div className="w-px h-5 bg-gray-200" />
              <button
                onClick={handleShare}
                title={urlCopied ? 'Link copied!' : 'Share this analysis'}
                className={cn(
                  'inline-flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-all',
                  urlCopied
                    ? 'bg-emerald-50 border border-emerald-500 text-emerald-600'
                    : 'bg-transparent border border-gray-200 text-gray-500 hover:bg-gray-50'
                )}
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                disabled={copying}
                title="Copy analysis"
                className="inline-flex items-center justify-center w-8 h-8 bg-transparent border border-gray-200 rounded-md text-gray-500 cursor-pointer hover:bg-gray-50 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                title="Export as PDF"
                className="inline-flex items-center justify-center w-8 h-8 bg-transparent border border-gray-200 rounded-md text-gray-500 cursor-pointer hover:bg-gray-50 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* PDF Export Container */}
        <div ref={resultsRef}>
          {/* Summary - Always Visible */}
          <div
            ref={summaryRef}
            className="bg-white rounded-xl p-6 shadow-sm border border-[#AADAF9] scroll-mt-24"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="m-0 flex items-center gap-2 text-[#162950]">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Summary
              </h2>
              <button
                onClick={() =>
                  likedSummary
                    ? removeHelpfulInsight('summary')
                    : saveHelpfulInsight('summary', result.summary)
                }
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all',
                  likedSummary
                    ? 'border border-emerald-500 bg-emerald-50 text-emerald-600'
                    : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                )}
                title={
                  likedSummary
                    ? 'Remove from helpful insights'
                    : 'Save as helpful'
                }
              >
                <ThumbsUp
                  className="w-3.5 h-3.5"
                  fill={likedSummary ? '#059669' : 'none'}
                />
                {likedSummary ? 'Helpful!' : 'This is helpful'}
              </button>
            </div>
            <p className="text-gray-700 leading-relaxed m-0 text-[15px]">
              {result.summary}
            </p>
          </div>

          {/* Accordion Sections */}
          <Accordion
            type="multiple"
            value={accordionValue}
            onValueChange={setAccordionValue}
            className="mt-6 space-y-4"
          >
            {/* Editorial Suggestions */}
            <AccordionItem
              value="suggestions"
              className="bg-white border-2 border-[#1075DC] rounded-xl overflow-hidden shadow-sm"
            >
              <AccordionTrigger
                ref={suggestionsRef}
                className="px-6 py-4 hover:no-underline scroll-mt-24 [&>svg]:hidden"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2.5 bg-gradient-to-br from-[#0158AE] to-[#1075DC] rounded-lg shadow-md">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="m-0 text-[#162950] text-lg font-semibold">
                      Editorial Suggestions
                    </h2>
                    <p className="text-sm text-gray-500 m-0">
                      Key insights to strengthen your content
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-[#1075DC] shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Present Perspectives */}
                  <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-500">
                    <h3 className="text-base font-semibold text-emerald-600 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      What You're Already Using
                    </h3>
                    <ul className="list-none p-0 m-0 flex flex-col gap-3">
                      {result.editorialSuggestions.presentPerspectives.map(
                        (perspective, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
                          >
                            <span className="text-emerald-600 text-lg flex-shrink-0">
                              ✓
                            </span>
                            <span className="text-gray-800 text-sm leading-relaxed font-medium">
                              {linkifyAuthors(perspective)}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Missing Perspectives */}
                  <div className="bg-amber-50 rounded-lg p-5 border border-amber-500">
                    <h3 className="text-base font-semibold text-amber-600 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      What You're Missing
                    </h3>
                    <ul className="list-none p-0 m-0 flex flex-col gap-3">
                      {result.editorialSuggestions.missingPerspectives.map(
                        (perspective, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20"
                          >
                            <span className="text-amber-600 text-lg flex-shrink-0">
                              !
                            </span>
                            <span className="text-gray-800 text-sm leading-relaxed font-medium">
                              {linkifyAuthors(perspective)}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Ideological Camps */}
            {result.matchedCamps.length > 0 && (
              <AccordionItem
                value="camps"
                className="bg-white border border-[#AADAF9] rounded-xl overflow-hidden shadow-sm"
              >
                <AccordionTrigger
                  ref={authorsRef}
                  className="px-6 py-4 hover:no-underline scroll-mt-24 [&>svg]:hidden"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Users className="w-6 h-6 text-[#1075DC]" />
                    <div className="text-left">
                      <h2 className="m-0 text-[#162950] text-lg font-semibold">
                        Ideological Camps
                      </h2>
                      <p className="text-sm text-gray-500 m-0">
                        {result.matchedCamps.length} perspectives found
                      </p>
                    </div>
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                      Most relevant first
                    </span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#1075DC] shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    See what each thought leader believes and how their ideas
                    specifically support or challenge your draft.
                  </p>
                  <div className="flex flex-col gap-6">
                    {result.matchedCamps.map((camp, idx) => {
                      const isExpanded = expandedCamps.has(idx)
                      return (
                        <div
                          key={idx}
                          data-camp-label={camp.campLabel}
                          className="border border-[#AADAF9] rounded-xl bg-white shadow-sm overflow-hidden transition-shadow duration-300"
                        >
                          {/* Collapsible Header */}
                          <div
                            onClick={() => toggleCampExpanded(idx)}
                            className={cn(
                              'flex items-center justify-between p-4 cursor-pointer transition-colors',
                              isExpanded
                                ? 'bg-transparent border-b border-[#AADAF9]'
                                : 'bg-gray-50'
                            )}
                            role="button"
                            tabIndex={0}
                            aria-expanded={isExpanded}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                toggleCampExpanded(idx)
                              }
                            }}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex-1">
                                <Link
                                  href={`/results?q=${encodeURIComponent(camp.campLabel)}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="font-semibold text-[17px] text-[#0158AE] underline underline-offset-2 decoration-[#0158AE]/30 hover:decoration-[#0158AE] inline-flex items-center gap-1 transition-colors"
                                >
                                  {camp.campLabel}
                                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                                </Link>
                                {!isExpanded && (
                                  <p className="text-sm text-gray-500 mt-1 leading-snug">
                                    {camp.topAuthors.length} author
                                    {camp.topAuthors.length !== 1 ? 's' : ''} •{' '}
                                    {getFirstSentence(camp.explanation)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  likedCamps.has(idx)
                                    ? removeHelpfulInsight('camp', idx)
                                    : saveHelpfulInsight(
                                        'camp',
                                        camp.explanation,
                                        camp.campLabel,
                                        idx
                                      )
                                }}
                                className={cn(
                                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer flex-shrink-0 transition-all',
                                  likedCamps.has(idx)
                                    ? 'border border-emerald-500 bg-emerald-50 text-emerald-600'
                                    : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                                )}
                              >
                                <ThumbsUp
                                  className="w-3 h-3"
                                  fill={likedCamps.has(idx) ? '#059669' : 'none'}
                                />
                                {likedCamps.has(idx) ? 'Saved' : 'Helpful'}
                              </button>
                              <div
                                className={cn(
                                  'flex items-center justify-center w-7 h-7 rounded-md bg-[#DCF2FA] text-[#1075DC] transition-transform duration-150',
                                  isExpanded ? 'rotate-0' : '-rotate-90'
                                )}
                              >
                                <ChevronDown className="w-4.5 h-4.5" />
                              </div>
                            </div>
                          </div>

                          {/* Collapsible Content */}
                          <div
                            className={cn(
                              'overflow-hidden transition-all duration-150',
                              isExpanded
                                ? 'max-h-[5000px] opacity-100 p-5'
                                : 'max-h-0 opacity-0 p-0'
                            )}
                          >
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                              {camp.explanation}
                            </p>

                            {/* Author Cards */}
                            {camp.topAuthors.length > 0 && (
                              <div className="flex flex-col gap-3">
                                {camp.topAuthors.map((author, authorIdx) => (
                                  <EnhancedAuthorCard
                                    key={authorIdx}
                                    author={{
                                      id: author.id,
                                      name: author.name,
                                      position: author.position,
                                      stance: author.stance,
                                      draftConnection: author.draftConnection,
                                      quote: author.quote,
                                      sourceUrl: author.sourceUrl,
                                    }}
                                    showActions={true}
                                    isSaved={
                                      author.id
                                        ? comparisonAuthors.includes(author.id)
                                        : false
                                    }
                                    onSaveForComparison={(id) =>
                                      toggleAuthorComparison(id, author.name)
                                    }
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* All Authors */}
            {result.matchedCamps.length > 0 && (
              <AccordionItem
                value="all-authors"
                className="bg-white border border-[#AADAF9] rounded-xl overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline [&>svg]:hidden">
                  <div className="flex items-center gap-3 flex-1">
                    <BookOpen className="w-6 h-6 text-[#1075DC]" />
                    <div className="text-left">
                      <h2 className="m-0 text-[#162950] text-lg font-semibold">
                        All Key Authors
                      </h2>
                      <p className="text-sm text-gray-500 m-0">
                        {uniqueAuthorCount} unique author
                        {uniqueAuthorCount !== 1 ? 's' : ''} across all camps
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#1075DC] shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                  <AllAuthorsSection
                    matchedCamps={result.matchedCamps}
                    comparisonAuthors={comparisonAuthors}
                    onSaveForComparison={(id) => {
                      // Find author name for better toast message
                      let authorName: string | undefined
                      for (const camp of result.matchedCamps) {
                        const author = camp.topAuthors.find((a) => a.id === id)
                        if (author) {
                          authorName = author.name
                          break
                        }
                      }
                      toggleAuthorComparison(id, authorName)
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </div>
    </div>
  )
}

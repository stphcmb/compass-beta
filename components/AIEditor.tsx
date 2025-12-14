'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { AIEditorAnalyzeResponse } from '@/lib/ai-editor'
import { getThoughtLeaders } from '@/lib/api/thought-leaders'
import { Sparkles, AlertCircle, CheckCircle, Loader2, ThumbsUp, ThumbsDown, Minus, Quote, ExternalLink, ChevronDown, Lightbulb, Users, Bookmark } from 'lucide-react'

export default function AIEditor() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<AIEditorAnalyzeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedOnce, setSavedOnce] = useState(false)
  const [allAuthors, setAllAuthors] = useState<Array<{ id: string; name: string }>>([])

  const suggestionsRef = useRef<HTMLDivElement>(null)
  const authorsRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

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
    setError(null)
    setResult(null)

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
      setLoading(false)
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
      window.dispatchEvent(new CustomEvent('ai-editor-saved', {
        detail: { text: text.trim(), preview, timestamp: new Date().toISOString() }
      }))
    } catch (e) {
      console.error('Error saving AI editor analysis:', e)
    } finally {
      setSaving(false)
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
          Paste your draft or paragraph, and get instant editorial feedback. AI Editor analyzes your text against our canon of thought leaders, identifying which perspectives you're using and which you might be missing.
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
          onClick={handleSave}
          disabled={saving || !text.trim()}
          style={{
            backgroundColor: savedOnce ? 'var(--color-success)' : 'white',
            color: savedOnce ? 'white' : 'var(--color-charcoal)',
            padding: 'var(--space-4) var(--space-6)',
            borderRadius: 'var(--radius-base)',
            fontSize: 'var(--text-body)',
            fontWeight: 'var(--weight-medium)',
            border: savedOnce ? '1px solid var(--color-success)' : '1px solid var(--color-light-gray)',
            cursor: saving || !text.trim() ? 'not-allowed' : 'pointer',
            transition: 'all var(--duration-fast) var(--ease-out)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            flex: '0 0 auto'
          }}
          onMouseEnter={(e) => {
            if (!saving && text.trim() && !savedOnce) {
              e.currentTarget.style.backgroundColor = 'var(--color-pale-gray)'
            }
          }}
          onMouseLeave={(e) => {
            if (!saving && text.trim() && !savedOnce) {
              e.currentTarget.style.backgroundColor = 'white'
            }
          }}
          title={savedOnce ? 'Saved - find it in your sidebar' : 'Save this text to revisit later'}
        >
          <Bookmark style={{ width: '18px', height: '18px' }} />
          {savedOnce ? 'Saved' : saving ? 'Saving...' : 'Save'}
        </button>
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
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles style={{ width: '20px', height: '20px' }} />
              Analyze with AI Editor
            </>
          )}
        </button>
      </div>

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
            </div>
          </div>

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
                These perspectives are most relevant to your content. See what each author believes and how they relate to your argument.
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

                                {/* Quote */}
                                {author.quote && (
                                  <div style={{
                                    backgroundColor: 'var(--color-bone)',
                                    border: '1px solid var(--color-light-gray)',
                                    borderRadius: 'var(--radius-base)',
                                    padding: 'var(--space-3)',
                                    marginBottom: 'var(--space-3)'
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
                                )}

                                {/* Source Link */}
                                {author.sourceUrl && (
                                  <a
                                    href={author.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 'var(--space-1)',
                                      fontSize: 'var(--text-caption)',
                                      color: 'var(--color-accent)',
                                      textDecoration: 'none',
                                      transition: 'color var(--duration-fast) var(--ease-out)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-hover)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                                  >
                                    <ExternalLink style={{ width: '12px', height: '12px' }} />
                                    Read more
                                  </a>
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
        </div>
      )}
    </div>
  )
}

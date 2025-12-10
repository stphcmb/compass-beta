'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { MiniBrainAnalyzeResponse } from '@/lib/mini-brain'
import { Sparkles, AlertCircle, CheckCircle, Loader2, ThumbsUp, ThumbsDown, Minus, Quote, ExternalLink, ChevronDown, Lightbulb, Users } from 'lucide-react'

export default function MiniBrain() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<MiniBrainAnalyzeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const suggestionsRef = useRef<HTMLDivElement>(null)
  const authorsRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
            <h1 style={{ marginBottom: 'var(--space-1)' }}>Mini Brain</h1>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-mid-gray)', margin: 0 }}>
              AI-powered editorial analysis
            </p>
          </div>
        </div>
        <p style={{
          fontSize: 'var(--text-body)',
          color: 'var(--color-charcoal)',
          lineHeight: 'var(--leading-relaxed)',
          margin: 0
        }}>
          Paste your draft or paragraph, and get instant editorial feedback. The Mini Brain analyzes your text against our canon of thought leaders, identifying which perspectives you're using and which you might be missing.
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
        <label htmlFor="mini-brain-text-input" style={{
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
          id="mini-brain-text-input"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="mini-brain-textarea"
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

      {/* Action Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
        style={{
          width: '100%',
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
          marginBottom: 'var(--space-6)',
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
      >
        {loading ? (
          <>
            <Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles style={{ width: '20px', height: '20px' }} />
            Analyze with Mini Brain
          </>
        )}
      </button>

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
          {/* Quick Navigation - Sticky */}
          <div style={{
            backgroundColor: 'var(--color-cloud)',
            border: '1px solid var(--color-light-gray)',
            borderRadius: 'var(--radius-base)',
            padding: 'var(--space-5)',
            position: 'sticky',
            top: 'var(--space-4)',
            zIndex: 'var(--z-sticky)',
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
                          {perspective}
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
                          {perspective}
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
                        <h3 style={{
                          fontWeight: 'var(--weight-semibold)',
                          fontSize: 'var(--text-h3)',
                          color: 'var(--color-soft-black)',
                          marginBottom: 'var(--space-2)'
                        }}>
                          {camp.campLabel}
                        </h3>
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

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Quote, ExternalLink, BookOpen, Sparkles } from 'lucide-react'
import { getAuthorWithDetails } from '@/lib/api/thought-leaders'

interface AuthorProfileProps {
  authorId: string
}

// Domain color mapping with enhanced gradients
const DOMAIN_COLORS: Record<string, { bg: string; text: string; gradient: string; border: string }> = {
  'AI Technical Capabilities': {
    bg: 'rgba(59, 130, 246, 0.08)',
    text: '#2563eb',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
    border: 'rgba(59, 130, 246, 0.2)'
  },
  'AI & Society': {
    bg: 'rgba(168, 85, 247, 0.08)',
    text: '#9333ea',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
    border: 'rgba(168, 85, 247, 0.2)'
  },
  'Enterprise AI Adoption': {
    bg: 'rgba(16, 185, 129, 0.08)',
    text: '#059669',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(52, 211, 153, 0.08) 100%)',
    border: 'rgba(16, 185, 129, 0.2)'
  },
  'AI Governance & Oversight': {
    bg: 'rgba(239, 68, 68, 0.08)',
    text: '#dc2626',
    gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(248, 113, 113, 0.08) 100%)',
    border: 'rgba(239, 68, 68, 0.2)'
  },
  'Future of Work': {
    bg: 'rgba(245, 158, 11, 0.08)',
    text: '#d97706',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(251, 191, 36, 0.08) 100%)',
    border: 'rgba(245, 158, 11, 0.2)'
  },
}

// Get initials from name
function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export default function AuthorProfile({ authorId }: AuthorProfileProps) {
  const router = useRouter()
  const [author, setAuthor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true)
      try {
        const data = await getAuthorWithDetails(authorId)
        if (data) setAuthor(data)
      } catch (error) {
        console.error('Error fetching author:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthor()
  }, [authorId])

  if (loading || !author) {
    return (
      <div style={{
        backgroundColor: 'var(--color-cloud)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-light-gray)',
        padding: 'var(--space-12)',
        marginBottom: 'var(--space-6)',
        textAlign: 'center'
      }}>
        {/* Loading skeleton with subtle animation */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, var(--color-pale-gray) 0%, var(--color-light-gray) 100%)',
          margin: '0 auto var(--space-4)',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
        <div style={{
          width: '180px',
          height: '24px',
          borderRadius: 'var(--radius-base)',
          background: 'var(--color-pale-gray)',
          margin: '0 auto var(--space-2)'
        }} />
        <div style={{
          width: '120px',
          height: '16px',
          borderRadius: 'var(--radius-base)',
          background: 'var(--color-pale-gray)',
          margin: '0 auto'
        }} />
      </div>
    )
  }

  // Get primary domain for theming
  const primaryDomain = author.camps?.[0]?.domain
  const domainTheme = primaryDomain ? DOMAIN_COLORS[primaryDomain] : null

  return (
    <div>
      {/* Hero Header Section */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-6)'
      }}>
        {/* Gradient background with decorative elements */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: domainTheme
            ? `linear-gradient(135deg, ${domainTheme.bg} 0%, var(--color-cloud) 50%, var(--color-bone) 100%)`
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, var(--color-cloud) 50%, var(--color-bone) 100%)',
          zIndex: 0
        }} />

        {/* Decorative accent line at top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: domainTheme
            ? `linear-gradient(90deg, ${domainTheme.text}40 0%, ${domainTheme.text} 50%, ${domainTheme.text}40 100%)`
            : 'linear-gradient(90deg, var(--color-accent)40 0%, var(--color-accent) 50%, var(--color-accent)40 100%)',
          zIndex: 1
        }} />

        {/* Decorative orb */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: 'var(--radius-full)',
          background: domainTheme
            ? `radial-gradient(circle, ${domainTheme.bg} 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          zIndex: 0
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          border: '1px solid var(--color-light-gray)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(8px)',
          padding: 'var(--space-8)'
        }}>
          {/* Back button */}
          <button
            onClick={() => router.back()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-small)',
              color: 'var(--color-mid-gray)',
              backgroundColor: 'white',
              border: '1px solid var(--color-light-gray)',
              borderRadius: 'var(--radius-full)',
              padding: 'var(--space-2) var(--space-4)',
              cursor: 'pointer',
              marginBottom: 'var(--space-6)',
              transition: 'all var(--duration-fast) var(--ease-out)',
              boxShadow: 'var(--shadow-subtle)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-soft-black)'
              e.currentTarget.style.borderColor = 'var(--color-mid-gray)'
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-mid-gray)'
              e.currentTarget.style.borderColor = 'var(--color-light-gray)'
              e.currentTarget.style.boxShadow = 'var(--shadow-subtle)'
            }}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
            Back
          </button>

          {/* Author avatar and info */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-6)' }}>
            {/* Large avatar with initials */}
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: 'var(--radius-full)',
              background: domainTheme
                ? `linear-gradient(135deg, ${domainTheme.text}20 0%, ${domainTheme.text}40 100%)`
                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.4) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: 'var(--shadow-md)',
              border: '3px solid white'
            }}>
              <span style={{
                fontSize: '1.75rem',
                fontWeight: 'var(--weight-bold)',
                color: domainTheme ? domainTheme.text : 'var(--color-accent)',
                letterSpacing: 'var(--tracking-wide)'
              }}>
                {getInitials(author.name)}
              </span>
            </div>

            {/* Author details */}
            <div style={{ flex: 1 }}>
              <h1 style={{
                marginBottom: 'var(--space-1)',
                fontSize: 'var(--text-h1)',
                letterSpacing: 'var(--tracking-tight)'
              }}>
                {author.name}
              </h1>
              <div style={{
                fontSize: 'var(--text-body)',
                color: 'var(--color-mid-gray)',
                marginBottom: 'var(--space-4)'
              }}>
                {author.header_affiliation || author.primary_affiliation || 'Independent'}
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {author.credibility_tier && (
                  <span style={{
                    padding: 'var(--space-1) var(--space-3)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-caption)',
                    fontWeight: 'var(--weight-semibold)',
                    background: domainTheme
                      ? `linear-gradient(135deg, ${domainTheme.text}15 0%, ${domainTheme.text}25 100%)`
                      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.25) 100%)',
                    color: domainTheme ? domainTheme.text : 'var(--color-accent)',
                    border: `1px solid ${domainTheme ? domainTheme.border : 'rgba(99, 102, 241, 0.3)'}`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {author.credibility_tier}
                  </span>
                )}
                {author.author_type && (
                  <span style={{
                    padding: 'var(--space-1) var(--space-3)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-caption)',
                    fontWeight: 'var(--weight-medium)',
                    backgroundColor: 'white',
                    color: 'var(--color-charcoal)',
                    border: '1px solid var(--color-light-gray)'
                  }}>
                    {author.author_type}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Overview/Notes section */}
          {author.notes && (
            <div style={{
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-5)',
              borderTop: '1px solid var(--color-light-gray)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)'
              }}>
                <Sparkles style={{
                  width: '14px',
                  height: '14px',
                  color: domainTheme ? domainTheme.text : 'var(--color-accent)'
                }} />
                <h3 style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--weight-semibold)',
                  color: 'var(--color-mid-gray)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-wide)',
                  margin: 0
                }}>
                  Overview
                </h3>
              </div>
              <p style={{
                fontSize: 'var(--text-body)',
                color: 'var(--color-charcoal)',
                lineHeight: 'var(--leading-loose)',
                margin: 0,
                paddingLeft: 'var(--space-6)'
              }}>
                {author.notes}
              </p>
            </div>
          )}

          {/* Footer link */}
          <div style={{
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--color-light-gray)'
          }}>
            <Link
              href="/authors"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'var(--text-small)',
                color: 'var(--color-accent)',
                fontWeight: 'var(--weight-medium)',
                textDecoration: 'none',
                transition: 'all var(--duration-fast) var(--ease-out)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-hover)'
                e.currentTarget.style.gap = 'var(--space-3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-accent)'
                e.currentTarget.style.gap = 'var(--space-2)'
              }}
            >
              View all authors
              <span style={{ transition: 'transform var(--duration-fast) var(--ease-out)' }}>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Advocacy & Camps Section */}
      {author.camps && author.camps.length > 0 && (
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--space-6)'
        }}>
          {/* Subtle gradient background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, var(--color-cloud) 0%, var(--color-bone) 100%)',
            zIndex: 0
          }} />

          <div style={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(4px)',
            border: '1px solid var(--color-light-gray)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-8)'
          }}>
            {/* Section header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-2)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.25) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen style={{ width: '20px', height: '20px', color: 'var(--color-accent)' }} />
              </div>
              <h2 style={{ margin: 0 }}>What They Advocate For</h2>
            </div>
            <p style={{
              fontSize: 'var(--text-small)',
              color: 'var(--color-mid-gray)',
              marginBottom: 'var(--space-6)',
              paddingLeft: 'calc(40px + var(--space-3))'
            }}>
              {author.name.split(' ')[0]}'s perspectives and positions across different thought leader camps
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {author.camps.map((camp: any, idx: number) => {
                const campDomainColor = DOMAIN_COLORS[camp.domain] || {
                  bg: 'var(--color-pale-gray)',
                  text: 'var(--color-charcoal)',
                  gradient: 'var(--color-pale-gray)',
                  border: 'var(--color-light-gray)'
                }
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all var(--duration-base) var(--ease-out)'
                    }}
                  >
                    {/* Camp card gradient accent */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      background: `linear-gradient(180deg, ${campDomainColor.text} 0%, ${campDomainColor.text}60 100%)`,
                      borderRadius: 'var(--radius-md) 0 0 var(--radius-md)'
                    }} />

                    <div style={{
                      border: `1px solid ${campDomainColor.border}`,
                      borderLeft: 'none',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-5)',
                      paddingLeft: 'var(--space-6)',
                      backgroundColor: 'white',
                      boxShadow: 'var(--shadow-subtle)'
                    }}>
                      <div style={{ marginBottom: 'var(--space-4)' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-3)',
                          marginBottom: 'var(--space-2)',
                          flexWrap: 'wrap'
                        }}>
                          <Link
                            href={`/results?q=${encodeURIComponent(camp.name)}`}
                            style={{
                              fontSize: 'var(--text-h3)',
                              fontWeight: 'var(--weight-semibold)',
                              color: 'var(--color-soft-black)',
                              margin: 0,
                              textDecoration: 'none',
                              transition: 'color var(--duration-fast) var(--ease-out)',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = campDomainColor.text
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'var(--color-soft-black)'
                            }}
                          >
                            {camp.name}
                          </Link>
                          <Link
                            href={`/results?q=${encodeURIComponent(camp.domain)}`}
                            style={{
                              padding: 'var(--space-1) var(--space-3)',
                              borderRadius: 'var(--radius-full)',
                              fontSize: 'var(--text-caption)',
                              fontWeight: 'var(--weight-medium)',
                              background: campDomainColor.gradient,
                              color: campDomainColor.text,
                              textDecoration: 'none',
                              transition: 'all var(--duration-fast) var(--ease-out)',
                              cursor: 'pointer',
                              display: 'inline-block',
                              border: `1px solid ${campDomainColor.border}`
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.02)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)'
                            }}
                          >
                            {camp.domain}
                          </Link>
                        </div>
                        {camp.description && (
                          <p style={{
                            fontSize: 'var(--text-small)',
                            color: 'var(--color-charcoal)',
                            lineHeight: 'var(--leading-relaxed)',
                            margin: 0
                          }}>
                            {camp.description}
                          </p>
                        )}
                      </div>

                      {camp.whyItMatters && (
                        <div style={{
                          background: campDomainColor.gradient,
                          border: `1px solid ${campDomainColor.border}`,
                          borderRadius: 'var(--radius-md)',
                          padding: 'var(--space-4)',
                          marginBottom: 'var(--space-4)'
                        }}>
                          <p style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            fontSize: 'var(--text-caption)',
                            fontWeight: 'var(--weight-semibold)',
                            color: campDomainColor.text,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: 'var(--space-2)'
                          }}>
                            <span style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: campDomainColor.text
                            }} />
                            Their Position
                          </p>
                          <p style={{
                            fontSize: 'var(--text-small)',
                            color: 'var(--color-soft-black)',
                            lineHeight: 'var(--leading-relaxed)',
                            margin: 0
                          }}>
                            {camp.whyItMatters}
                          </p>
                        </div>
                      )}

                      {camp.quote && (
                        <div style={{
                          backgroundColor: 'var(--color-bone)',
                          border: '1px solid var(--color-light-gray)',
                          borderRadius: 'var(--radius-md)',
                          padding: 'var(--space-4)',
                          position: 'relative'
                        }}>
                          {/* Quote decoration */}
                          <Quote style={{
                            position: 'absolute',
                            top: 'var(--space-3)',
                            left: 'var(--space-3)',
                            width: '24px',
                            height: '24px',
                            color: campDomainColor.text,
                            opacity: 0.2
                          }} />
                          <div style={{ paddingLeft: 'var(--space-8)' }}>
                            <p style={{
                              fontSize: 'var(--text-body)',
                              fontStyle: 'italic',
                              color: 'var(--color-charcoal)',
                              lineHeight: 'var(--leading-loose)',
                              margin: 0,
                              marginBottom: 'var(--space-3)'
                            }}>
                              "{camp.quote}"
                            </p>
                            {camp.quoteSourceUrl && (
                              <a
                                href={camp.quoteSourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 'var(--space-2)',
                                  fontSize: 'var(--text-caption)',
                                  color: campDomainColor.text,
                                  textDecoration: 'none',
                                  padding: 'var(--space-1) var(--space-3)',
                                  borderRadius: 'var(--radius-full)',
                                  backgroundColor: campDomainColor.bg,
                                  border: `1px solid ${campDomainColor.border}`,
                                  transition: 'all var(--duration-fast) var(--ease-out)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.boxShadow = 'none'
                                }}
                              >
                                <ExternalLink style={{ width: '12px', height: '12px' }} />
                                View Source
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


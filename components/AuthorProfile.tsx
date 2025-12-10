'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Quote, ExternalLink, BookOpen } from 'lucide-react'
import { getAuthorWithDetails } from '@/lib/api/thought-leaders'

interface AuthorProfileProps {
  authorId: string
}

// Domain color mapping
const DOMAIN_COLORS: Record<string, { bg: string; text: string }> = {
  'AI Technical Capabilities': { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb' },
  'AI & Society': { bg: 'rgba(168, 85, 247, 0.1)', text: '#9333ea' },
  'Enterprise AI Adoption': { bg: 'rgba(16, 185, 129, 0.1)', text: '#059669' },
  'AI Governance & Oversight': { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626' },
  'Future of Work': { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706' },
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
        borderRadius: 'var(--radius-base)',
        border: '1px solid var(--color-light-gray)',
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-6)',
        textAlign: 'center',
        color: 'var(--color-mid-gray)'
      }}>
        Loading author profile...
      </div>
    )
  }

  return (
    <div>
      {/* Header Section */}
      <div style={{
        backgroundColor: 'var(--color-cloud)',
        borderRadius: 'var(--radius-base)',
        border: '1px solid var(--color-light-gray)',
        padding: 'var(--card-padding-desktop)',
        marginBottom: 'var(--space-6)'
      }}>
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontSize: 'var(--text-small)',
            color: 'var(--color-mid-gray)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginBottom: 'var(--space-6)',
            transition: 'color var(--duration-fast) var(--ease-out)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-soft-black)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-mid-gray)'}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Back
        </button>

        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ marginBottom: 'var(--space-2)' }}>{author.name}</h1>
          <div style={{
            fontSize: 'var(--text-body)',
            color: 'var(--color-mid-gray)',
            marginBottom: 'var(--space-3)'
          }}>
            {author.header_affiliation || author.primary_affiliation || 'Independent'}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {author.credibility_tier && (
              <span style={{
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-caption)',
                fontWeight: 'var(--weight-medium)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#2563eb'
              }}>
                {author.credibility_tier}
              </span>
            )}
            {author.author_type && (
              <span style={{
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-caption)',
                fontWeight: 'var(--weight-medium)',
                backgroundColor: 'var(--color-pale-gray)',
                color: 'var(--color-charcoal)'
              }}>
                {author.author_type}
              </span>
            )}
          </div>
        </div>

        {author.notes && (
          <div style={{
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: 'var(--radius-base)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-6)'
          }}>
            <h3 style={{
              fontSize: 'var(--text-caption)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-mid-gray)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              marginBottom: 'var(--space-2)'
            }}>
              Overview
            </h3>
            <p style={{
              fontSize: 'var(--text-small)',
              color: 'var(--color-charcoal)',
              lineHeight: 'var(--leading-relaxed)',
              margin: 0
            }}>
              {author.notes}
            </p>
          </div>
        )}

        <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-light-gray)' }}>
          <Link
            href="/authors"
            style={{
              fontSize: 'var(--text-small)',
              color: 'var(--color-accent)',
              fontWeight: 'var(--weight-medium)',
              textDecoration: 'none',
              transition: 'color var(--duration-fast) var(--ease-out)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
          >
            View all authors →
          </Link>
        </div>
      </div>

      {/* Advocacy & Camps Section */}
      {author.camps && author.camps.length > 0 && (
        <div style={{
          backgroundColor: 'var(--color-cloud)',
          borderRadius: 'var(--radius-base)',
          border: '1px solid var(--color-light-gray)',
          padding: 'var(--card-padding-desktop)',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-5)'
          }}>
            <BookOpen style={{ width: '20px', height: '20px', color: 'var(--color-accent)' }} />
            <h2 style={{ margin: 0 }}>What They Advocate For</h2>
          </div>
          <p style={{
            fontSize: 'var(--text-small)',
            color: 'var(--color-mid-gray)',
            marginBottom: 'var(--space-5)'
          }}>
            {author.name.split(' ')[0]}'s perspectives and positions across different thought leader camps
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {author.camps.map((camp: any, idx: number) => {
              const domainColor = DOMAIN_COLORS[camp.domain] || { bg: 'var(--color-pale-gray)', text: 'var(--color-charcoal)' }
              return (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--color-light-gray)',
                    borderRadius: 'var(--radius-base)',
                    padding: 'var(--space-5)',
                    backgroundColor: 'var(--color-bone)'
                  }}
                >
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      <h3 style={{
                        fontSize: 'var(--text-h3)',
                        fontWeight: 'var(--weight-semibold)',
                        color: 'var(--color-soft-black)',
                        margin: 0
                      }}>
                        {camp.name}
                      </h3>
                      <span style={{
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-caption)',
                        fontWeight: 'var(--weight-medium)',
                        backgroundColor: domainColor.bg,
                        color: domainColor.text
                      }}>
                        {camp.domain}
                      </span>
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
                      backgroundColor: 'rgba(99, 102, 241, 0.05)',
                      border: '1px solid rgba(99, 102, 241, 0.15)',
                      borderRadius: 'var(--radius-base)',
                      padding: 'var(--space-3)',
                      marginBottom: 'var(--space-3)'
                    }}>
                      <p style={{
                        fontSize: 'var(--text-caption)',
                        fontWeight: 'var(--weight-semibold)',
                        color: 'var(--color-mid-gray)',
                        marginBottom: 'var(--space-1)'
                      }}>
                        Their Position:
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
                      backgroundColor: 'var(--color-cloud)',
                      border: '1px solid var(--color-light-gray)',
                      borderRadius: 'var(--radius-base)',
                      padding: 'var(--space-4)'
                    }}>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                        <Quote style={{
                          width: '16px',
                          height: '16px',
                          color: 'var(--color-accent)',
                          flexShrink: 0,
                          marginTop: '2px'
                        }} />
                        <p style={{
                          fontSize: 'var(--text-small)',
                          fontStyle: 'italic',
                          color: 'var(--color-charcoal)',
                          lineHeight: 'var(--leading-relaxed)',
                          margin: 0
                        }}>
                          "{camp.quote}"
                        </p>
                      </div>
                      {camp.quoteSourceUrl && (
                        <a
                          href={camp.quoteSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-1)',
                            fontSize: 'var(--text-caption)',
                            color: 'var(--color-accent)',
                            textDecoration: 'none',
                            transition: 'color var(--duration-fast) var(--ease-out)',
                            marginLeft: 'var(--space-5)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                        >
                          <ExternalLink style={{ width: '12px', height: '12px' }} />
                          Source
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}


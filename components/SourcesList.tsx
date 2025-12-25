'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, FileText, BookOpen, Video, Mic, Newspaper, GraduationCap } from 'lucide-react'
import { getThoughtLeaderById } from '@/lib/api/thought-leaders'

interface SourcesListProps {
  authorId: string
}

interface Source {
  title: string
  type: string
  year: string
  url?: string
}

// Get icon for source type
function getSourceIcon(type: string) {
  const iconStyle = { width: '18px', height: '18px' }
  switch (type?.toLowerCase()) {
    case 'book':
      return <BookOpen style={iconStyle} />
    case 'video':
    case 'ted talk':
    case 'youtube':
      return <Video style={iconStyle} />
    case 'podcast':
    case 'interview':
      return <Mic style={iconStyle} />
    case 'article':
    case 'blog':
    case 'newsletter':
      return <Newspaper style={iconStyle} />
    case 'paper':
    case 'research':
    case 'academic':
      return <GraduationCap style={iconStyle} />
    default:
      return <FileText style={iconStyle} />
  }
}

// Get color for source type
function getSourceTypeColor(type: string): { bg: string; text: string; border: string } {
  switch (type?.toLowerCase()) {
    case 'book':
      return { bg: 'rgba(168, 85, 247, 0.1)', text: '#9333ea', border: 'rgba(168, 85, 247, 0.2)' }
    case 'video':
    case 'ted talk':
    case 'youtube':
      return { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.2)' }
    case 'podcast':
    case 'interview':
      return { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706', border: 'rgba(245, 158, 11, 0.2)' }
    case 'article':
    case 'blog':
    case 'newsletter':
      return { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.2)' }
    case 'paper':
    case 'research':
    case 'academic':
      return { bg: 'rgba(16, 185, 129, 0.1)', text: '#059669', border: 'rgba(16, 185, 129, 0.2)' }
    default:
      return { bg: 'var(--color-pale-gray)', text: 'var(--color-charcoal)', border: 'var(--color-light-gray)' }
  }
}

export default function SourcesList({ authorId }: SourcesListProps) {
  const [sources, setSources] = useState<Source[]>([])
  const [authorName, setAuthorName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuthorSources = async () => {
      setLoading(true)
      try {
        const author = await getThoughtLeaderById(authorId)
        if (author) {
          setAuthorName(author.name)
          setSources(author.sources || [])
        }
      } catch (error) {
        console.error('Error fetching sources:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthorSources()
  }, [authorId])

  if (loading) {
    return (
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--color-cloud)',
        border: '1px solid var(--color-light-gray)',
        padding: 'var(--space-8)'
      }}>
        {/* Loading skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-pale-gray)'
          }} />
          <div style={{
            width: '150px',
            height: '24px',
            borderRadius: 'var(--radius-base)',
            background: 'var(--color-pale-gray)'
          }} />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            height: '72px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-pale-gray)',
            marginBottom: 'var(--space-3)',
            opacity: 1 - (i * 0.2)
          }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 'var(--radius-lg)'
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
          justifyContent: 'space-between',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
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
              <FileText style={{ width: '20px', height: '20px', color: 'var(--color-accent)' }} />
            </div>
            <h2 style={{ margin: 0 }}>Sources & References</h2>
          </div>
          {sources.length > 0 && (
            <span style={{
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-caption)',
              fontWeight: 'var(--weight-semibold)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.2) 100%)',
              color: 'var(--color-accent)',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
              {sources.length} {sources.length === 1 ? 'source' : 'sources'}
            </span>
          )}
        </div>

        {sources.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {sources.map((source, index) => {
              const typeColor = getSourceTypeColor(source.type)
              return (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'white',
                    border: '1px solid var(--color-light-gray)',
                    padding: 'var(--space-4)',
                    transition: 'all var(--duration-fast) var(--ease-out)',
                    cursor: source.url ? 'pointer' : 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = typeColor.border
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                    {/* Icon with colored background */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: typeColor.bg,
                      border: `1px solid ${typeColor.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: typeColor.text
                    }}>
                      {getSourceIcon(source.type)}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 'var(--text-body)',
                        fontWeight: 'var(--weight-medium)',
                        color: 'var(--color-soft-black)',
                        marginBottom: 'var(--space-2)',
                        lineHeight: 'var(--leading-snug)'
                      }}>
                        {source.title}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          padding: 'var(--space-1) var(--space-2)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--text-caption)',
                          fontWeight: 'var(--weight-medium)',
                          backgroundColor: typeColor.bg,
                          color: typeColor.text,
                          border: `1px solid ${typeColor.border}`
                        }}>
                          {source.type}
                        </span>
                        <span style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--color-mid-gray)',
                          fontWeight: 'var(--weight-medium)'
                        }}>
                          {source.year}
                        </span>
                      </div>
                    </div>

                    {/* External link button */}
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          padding: 'var(--space-2) var(--space-4)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--text-small)',
                          fontWeight: 'var(--weight-medium)',
                          color: 'var(--color-accent)',
                          backgroundColor: 'rgba(99, 102, 241, 0.08)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          textDecoration: 'none',
                          transition: 'all var(--duration-fast) var(--ease-out)',
                          flexShrink: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.15)'
                          e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.08)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        Open
                        <ExternalLink style={{ width: '14px', height: '14px' }} />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-6)'
          }}>
            {/* Empty state illustration */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--color-pale-gray) 0%, var(--color-light-gray) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)'
            }}>
              <FileText style={{ width: '32px', height: '32px', color: 'var(--color-mid-gray)' }} />
            </div>
            <div style={{
              fontSize: 'var(--text-body)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--color-charcoal)',
              marginBottom: 'var(--space-2)'
            }}>
              No sources available
            </div>
            <div style={{
              fontSize: 'var(--text-small)',
              color: 'var(--color-mid-gray)'
            }}>
              Sources and references will appear here once added
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

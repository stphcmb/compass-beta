'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Quote, ExternalLink, BookOpen, FileText, Video, Mic, Newspaper, GraduationCap, Star, MessageSquare, Edit3, Check } from 'lucide-react'
import { getAuthorWithDetails } from '@/lib/api/thought-leaders'

interface AuthorDetailPanelProps {
  authorId: string | null
  isOpen: boolean
  onClose: () => void
  embedded?: boolean // When true, renders inline instead of as overlay
}

// Domain colors
const DOMAIN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'AI Technical Capabilities': { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
  'AI & Society': { bg: '#f3e8ff', text: '#7c3aed', border: '#c4b5fd' },
  'Enterprise AI Adoption': { bg: '#d1fae5', text: '#059669', border: '#6ee7b7' },
  'AI Governance & Oversight': { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
  'Future of Work': { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
}

const DEFAULT_COLORS = { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' }

function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function getSourceIcon(type: string) {
  const style = { width: '14px', height: '14px' }
  switch (type?.toLowerCase()) {
    case 'book': return <BookOpen style={style} />
    case 'video': case 'ted talk': case 'youtube': return <Video style={style} />
    case 'podcast': case 'interview': return <Mic style={style} />
    case 'article': case 'blog': case 'newsletter': return <Newspaper style={style} />
    case 'paper': case 'research': case 'academic': return <GraduationCap style={style} />
    default: return <FileText style={style} />
  }
}

export default function AuthorDetailPanel({ authorId, isOpen, onClose, embedded = false }: AuthorDetailPanelProps) {
  const [author, setAuthor] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [authorNote, setAuthorNote] = useState('')
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [noteUpdatedAt, setNoteUpdatedAt] = useState('')

  useEffect(() => {
    if (authorId && isOpen) {
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
    }
  }, [authorId, isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Check if author is in favorites
  useEffect(() => {
    if (author?.name) {
      try {
        const favorites = JSON.parse(localStorage.getItem('favoriteAuthors') || '[]')
        setIsFavorite(favorites.some((f: any) => f.name === author.name))
      } catch {
        setIsFavorite(false)
      }
    }
  }, [author?.name])

  // Load author note (separate from favorites)
  useEffect(() => {
    if (author?.name) {
      try {
        const notes = JSON.parse(localStorage.getItem('authorNotes') || '[]')
        const existingNote = notes.find((n: any) => n.name === author.name)
        if (existingNote) {
          setAuthorNote(existingNote.note)
          setNoteText(existingNote.note)
          setNoteUpdatedAt(existingNote.updatedAt)
        } else {
          setAuthorNote('')
          setNoteText('')
          setNoteUpdatedAt('')
        }
      } catch {
        setAuthorNote('')
        setNoteText('')
        setNoteUpdatedAt('')
      }
    }
  }, [author?.name])

  // Listen for favorite removal events from history page
  useEffect(() => {
    const handleFavoriteRemoved = (e: CustomEvent<{ name: string }>) => {
      if (e.detail.name === author?.name) {
        setIsFavorite(false)
      }
    }
    window.addEventListener('favorite-author-removed', handleFavoriteRemoved as EventListener)
    return () => window.removeEventListener('favorite-author-removed', handleFavoriteRemoved as EventListener)
  }, [author?.name])

  // Listen for note updates from history page
  useEffect(() => {
    const handleNoteUpdated = (e: CustomEvent<{ name: string; note: string }>) => {
      if (e.detail.name === author?.name) {
        setAuthorNote(e.detail.note)
        setNoteText(e.detail.note)
      }
    }
    window.addEventListener('author-note-updated', handleNoteUpdated as EventListener)
    return () => window.removeEventListener('author-note-updated', handleNoteUpdated as EventListener)
  }, [author?.name])

  const saveAuthorNote = () => {
    if (!author?.name) return
    try {
      const notes = JSON.parse(localStorage.getItem('authorNotes') || '[]')
      const existingIndex = notes.findIndex((n: any) => n.name === author.name)
      const now = new Date().toISOString()

      if (noteText.trim()) {
        // Add or update note
        if (existingIndex >= 0) {
          notes[existingIndex] = { ...notes[existingIndex], note: noteText, updatedAt: now }
        } else {
          notes.unshift({
            id: `note-${Date.now()}`,
            name: author.name,
            note: noteText,
            updatedAt: now
          })
        }
      } else if (existingIndex >= 0) {
        // Remove empty note
        notes.splice(existingIndex, 1)
      }

      localStorage.setItem('authorNotes', JSON.stringify(notes))
      setAuthorNote(noteText)
      setNoteUpdatedAt(now)
      setIsEditingNote(false)
      // Dispatch event to sync with history page
      window.dispatchEvent(new CustomEvent('author-note-updated', {
        detail: { name: author.name, note: noteText }
      }))
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  const cancelEditNote = () => {
    setNoteText(authorNote)
    setIsEditingNote(false)
  }

  const toggleFavorite = () => {
    if (!author?.name) return
    try {
      const favorites = JSON.parse(localStorage.getItem('favoriteAuthors') || '[]')
      if (isFavorite) {
        // Remove from favorites
        const filtered = favorites.filter((f: any) => f.name !== author.name)
        localStorage.setItem('favoriteAuthors', JSON.stringify(filtered))
        setIsFavorite(false)
        window.dispatchEvent(new CustomEvent('favorite-author-removed', { detail: { name: author.name } }))
      } else {
        // Add to favorites
        favorites.unshift({
          id: `fav-${Date.now()}`,
          name: author.name,
          addedAt: new Date().toISOString()
        })
        localStorage.setItem('favoriteAuthors', JSON.stringify(favorites))
        setIsFavorite(true)
        window.dispatchEvent(new CustomEvent('favorite-author-added', { detail: { name: author.name } }))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const primaryDomain = author?.camps?.[0]?.domain
  const colors = primaryDomain ? DOMAIN_COLORS[primaryDomain] : DEFAULT_COLORS

  // Embedded mode - render inline
  if (embedded) {
    return (
      <div style={{
        height: '100%',
        backgroundColor: 'var(--color-bone)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                margin: '0 auto 12px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>Loading...</div>
            </div>
          </div>
        ) : author ? (
          <>
            {/* Header - Compact with domain color */}
            <div style={{
              padding: '16px 20px',
              borderBottom: `3px solid ${colors.border}`,
              backgroundColor: colors.bg,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}>
              {/* Avatar */}
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                backgroundColor: 'white',
                border: `3px solid ${colors.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>
                  {getInitials(author.name)}
                </span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 2px 0', color: '#111827' }}>
                  {author.name}
                </h2>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                  {author.header_affiliation || author.primary_affiliation || 'Independent'}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {author.author_type && (
                    <span style={{
                      padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 600,
                      backgroundColor: colors.text, color: 'white', textTransform: 'uppercase'
                    }}>
                      {author.author_type}
                    </span>
                  )}
                  {author.credibility_tier && (
                    <span style={{
                      padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 500,
                      backgroundColor: 'white', color: '#374151', border: '1px solid #e5e7eb'
                    }}>
                      {author.credibility_tier}
                    </span>
                  )}
                </div>
              </div>

              {/* Favorite Button */}
              <button
                onClick={toggleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: isFavorite ? '1px solid #f59e0b' : '1px solid #e5e7eb',
                  backgroundColor: isFavorite ? '#fef3c7' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}
              >
                <Star
                  size={18}
                  style={{
                    color: isFavorite ? '#f59e0b' : '#9ca3af',
                    fill: isFavorite ? '#f59e0b' : 'none'
                  }}
                />
              </button>
            </div>

            {/* Personal Note Section - Always visible */}
            <div style={{
              padding: '12px 20px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: authorNote ? '#fefce8' : '#f9fafb'
            }}>
                {!isEditingNote ? (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: authorNote ? '8px' : 0
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#92400e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        <MessageSquare size={12} />
                        Your Note
                      </div>
                      <button
                        onClick={() => setIsEditingNote(true)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: 'none',
                          background: authorNote ? '#fef3c7' : '#fde68a',
                          color: '#92400e',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {authorNote ? <Edit3 size={12} /> : <MessageSquare size={12} />}
                        {authorNote ? 'Edit' : 'Add note'}
                      </button>
                    </div>
                    {authorNote && (
                      <p style={{
                        fontSize: '13px',
                        color: '#78350f',
                        margin: 0,
                        fontStyle: 'italic',
                        lineHeight: 1.5
                      }}>
                        "{authorNote}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#92400e',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px'
                    }}>
                      <MessageSquare size={12} />
                      Your Note
                    </div>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add your personal note about this author..."
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #fcd34d',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        resize: 'none',
                        minHeight: '70px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#f59e0b'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#fcd34d'
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '8px',
                      marginTop: '8px'
                    }}>
                      <button
                        onClick={cancelEditNote}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          background: 'white',
                          color: '#6b7280',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveAuthorNote}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#f59e0b',
                          color: 'white',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Check size={12} />
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {/* Overview */}
              {author.notes && (
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    Overview
                  </h3>
                  <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6, margin: 0 }}>
                    {author.notes}
                  </p>
                </div>
              )}

              {/* Camps/Advocacy - Main content */}
              {author.camps && author.camps.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                    Positions & Quotes ({author.camps.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {author.camps.map((camp: any, idx: number) => {
                      const campColors = DOMAIN_COLORS[camp.domain] || DEFAULT_COLORS
                      return (
                        <div
                          key={idx}
                          style={{
                            borderRadius: '8px',
                            border: `1px solid ${campColors.border}`,
                            backgroundColor: campColors.bg,
                            overflow: 'hidden'
                          }}
                        >
                          {/* Camp header */}
                          <div style={{ padding: '10px 12px', borderBottom: `1px solid ${campColors.border}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <Link
                                href={`/results?q=${encodeURIComponent(camp.name)}`}
                                style={{
                                  fontSize: '13px', fontWeight: 600, color: campColors.text,
                                  textDecoration: 'none'
                                }}
                              >
                                {camp.name}
                              </Link>
                              <span style={{
                                fontSize: '9px', padding: '1px 6px', borderRadius: '10px',
                                backgroundColor: 'white', color: campColors.text, fontWeight: 500
                              }}>
                                {camp.domain}
                              </span>
                            </div>
                            {camp.description && (
                              <p style={{ fontSize: '11px', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>
                                {camp.description}
                              </p>
                            )}
                          </div>

                          {/* Position + Quote */}
                          <div style={{ padding: '10px 12px', backgroundColor: 'white' }}>
                            {camp.whyItMatters && (
                              <div style={{ marginBottom: camp.quote ? '10px' : 0 }}>
                                <span style={{
                                  fontSize: '9px', fontWeight: 600, color: campColors.text,
                                  textTransform: 'uppercase', letterSpacing: '0.05em'
                                }}>
                                  Position:
                                </span>
                                <p style={{ fontSize: '12px', color: '#374151', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                                  {camp.whyItMatters}
                                </p>
                              </div>
                            )}

                            {camp.quote && (
                              <div style={{
                                backgroundColor: '#f9fafb',
                                borderRadius: '6px',
                                padding: '10px',
                                borderLeft: `3px solid ${campColors.border}`
                              }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <Quote style={{ width: '14px', height: '14px', color: campColors.text, opacity: 0.5, flexShrink: 0, marginTop: '2px' }} />
                                  <div>
                                    <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#4b5563', lineHeight: 1.5, margin: 0 }}>
                                      "{camp.quote}"
                                    </p>
                                    {camp.quoteSourceUrl && (
                                      <a
                                        href={camp.quoteSourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                                          fontSize: '10px', color: campColors.text, textDecoration: 'none',
                                          marginTop: '6px'
                                        }}
                                      >
                                        <ExternalLink style={{ width: '10px', height: '10px' }} />
                                        View source
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Sources - Compact list */}
              {author.sources && author.sources.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Sources ({author.sources.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {author.sources.map((source: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '8px 10px', backgroundColor: '#f9fafb',
                          borderRadius: '6px', border: '1px solid #e5e7eb'
                        }}
                      >
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '6px',
                          backgroundColor: '#e5e7eb', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          color: '#6b7280', flexShrink: 0
                        }}>
                          {getSourceIcon(source.type)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '12px', fontWeight: 500, color: '#374151',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                          }}>
                            {source.title}
                          </div>
                          <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                            {source.type} {source.year && `· ${source.year}`}
                          </div>
                        </div>
                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '10px', color: '#6366f1', textDecoration: 'none',
                              padding: '4px 8px', backgroundColor: '#eef2ff', borderRadius: '4px',
                              fontWeight: 500, flexShrink: 0
                            }}
                          >
                            Open
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No camps message */}
              {(!author.camps || author.camps.length === 0) && !author.notes && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>No detailed information available</div>
                  <div style={{ fontSize: '12px' }}>Check back later for updates</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: '14px' }}>Select an author to view details</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Overlay mode (default) - slide-in panel
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          zIndex: 998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 200ms ease-out'
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '560px',
          maxWidth: '100vw',
          backgroundColor: 'white',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12)',
          zIndex: 999,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                margin: '0 auto 12px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>Loading...</div>
            </div>
          </div>
        ) : author ? (
          <>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: `3px solid ${colors.border}`,
              backgroundColor: colors.bg,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                backgroundColor: 'white',
                border: `3px solid ${colors.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>
                  {getInitials(author.name)}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 2px 0', color: '#111827' }}>
                  {author.name}
                </h2>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                  {author.header_affiliation || author.primary_affiliation || 'Independent'}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {author.author_type && (
                    <span style={{
                      padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 600,
                      backgroundColor: colors.text, color: 'white', textTransform: 'uppercase'
                    }}>
                      {author.author_type}
                    </span>
                  )}
                  {author.credibility_tier && (
                    <span style={{
                      padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 500,
                      backgroundColor: 'white', color: '#374151', border: '1px solid #e5e7eb'
                    }}>
                      {author.credibility_tier}
                    </span>
                  )}
                </div>
              </div>
              {/* Favorite Button */}
              <button
                onClick={toggleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: isFavorite ? '1px solid #f59e0b' : '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: isFavorite ? '#fef3c7' : 'rgba(255,255,255,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}
              >
                <Star
                  size={16}
                  style={{
                    color: isFavorite ? '#f59e0b' : '#6b7280',
                    fill: isFavorite ? '#f59e0b' : 'none'
                  }}
                />
              </button>
              <button
                onClick={onClose}
                style={{
                  width: '28px', height: '28px', borderRadius: '6px',
                  border: 'none', backgroundColor: 'rgba(0,0,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0
                }}
              >
                <X style={{ width: '14px', height: '14px', color: '#374151' }} />
              </button>
            </div>

            {/* Personal Note Section - Always visible */}
            <div style={{
              padding: '12px 20px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: authorNote ? '#fefce8' : '#f9fafb'
            }}>
                {!isEditingNote ? (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: authorNote ? '8px' : 0
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#92400e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        <MessageSquare size={12} />
                        Your Note
                      </div>
                      <button
                        onClick={() => setIsEditingNote(true)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: 'none',
                          background: authorNote ? '#fef3c7' : '#fde68a',
                          color: '#92400e',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {authorNote ? <Edit3 size={12} /> : <MessageSquare size={12} />}
                        {authorNote ? 'Edit' : 'Add note'}
                      </button>
                    </div>
                    {authorNote && (
                      <p style={{
                        fontSize: '13px',
                        color: '#78350f',
                        margin: 0,
                        fontStyle: 'italic',
                        lineHeight: 1.5
                      }}>
                        "{authorNote}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#92400e',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px'
                    }}>
                      <MessageSquare size={12} />
                      Your Note
                    </div>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add your personal note about this author..."
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #fcd34d',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        resize: 'none',
                        minHeight: '70px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#f59e0b'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#fcd34d'
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '8px',
                      marginTop: '8px'
                    }}>
                      <button
                        onClick={cancelEditNote}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          background: 'white',
                          color: '#6b7280',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveAuthorNote}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#f59e0b',
                          color: 'white',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Check size={12} />
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {author.notes && (
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    Overview
                  </h3>
                  <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6, margin: 0 }}>
                    {author.notes}
                  </p>
                </div>
              )}

              {author.camps && author.camps.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                    Positions & Quotes ({author.camps.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {author.camps.map((camp: any, idx: number) => {
                      const campColors = DOMAIN_COLORS[camp.domain] || DEFAULT_COLORS
                      return (
                        <div key={idx} style={{ borderRadius: '8px', border: `1px solid ${campColors.border}`, backgroundColor: campColors.bg, overflow: 'hidden' }}>
                          <div style={{ padding: '10px 12px', borderBottom: `1px solid ${campColors.border}` }}>
                            <Link href={`/results?q=${encodeURIComponent(camp.name)}`} style={{ fontSize: '13px', fontWeight: 600, color: campColors.text, textDecoration: 'none' }}>
                              {camp.name}
                            </Link>
                          </div>
                          <div style={{ padding: '10px 12px', backgroundColor: 'white' }}>
                            {camp.quote && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <Quote style={{ width: '14px', height: '14px', color: campColors.text, opacity: 0.5, flexShrink: 0, marginTop: '2px' }} />
                                <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#4b5563', lineHeight: 1.5, margin: 0 }}>"{camp.quote}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: '14px' }}>Select an author</div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

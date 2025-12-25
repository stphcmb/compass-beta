'use client'

import { useState, useEffect } from 'react'
import { X, Quote, ExternalLink, Users, BookOpen, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react'
import { getDomainColor } from './DiscourseMap'

const STORAGE_KEY = 'howPerspectivesWorkSeenCount'
const MAX_AUTO_SHOWS = 2

// Curated example data - using real perspective and relationships
const EXAMPLE_DATA = {
  domain: 'AI Technical Capabilities',
  perspective: {
    name: 'Scaling Will Deliver',
    blurb: 'More data, more compute, more capability. The path to transformative AI runs through scaling what already works.',
  },
  authors: [
    {
      name: 'Dario Amodei',
      role: 'CEO, Anthropic',
      quote: 'The scaling hypothesis has been remarkably validated. We continue to see improvements that suggest we haven\'t hit fundamental limits.',
      work: 'Anthropic Research',
      workUrl: 'https://www.anthropic.com'
    }
  ],
  // These match PERSPECTIVE_ALLIES in perspective-relationships.ts
  supports: ['Sam Altman', 'Jensen Huang'],
  // These match PERSPECTIVE_OPPOSITES (from "Needs New Approaches")
  challenges: ['Gary Marcus', 'Yann LeCun']
}

interface HowPerspectivesWorkModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HowPerspectivesWorkModal({ isOpen, onClose }: HowPerspectivesWorkModalProps) {
  const colors = getDomainColor(EXAMPLE_DATA.domain)

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '8px',
            background: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#64748b',
            zIndex: 10,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{
          padding: '24px 24px 16px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(to right, #eff6ff, #eef2ff)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <BookOpen size={20} style={{ color: 'var(--color-accent)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              How Perspectives Work
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            The discourse is organized as: <strong>Domain</strong> → <strong>Perspective</strong> → <strong>Authors</strong> → <strong>Works & Quotes</strong>.
            Here's one example to show how it all connects:
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>
          {/* Level 1: Domain */}
          <div style={{ borderLeft: `4px solid ${colors.border.replace('border-', '')}`, paddingLeft: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#6366f1'
              }} />
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6366f1' }}>
                Domain
              </span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                {EXAMPLE_DATA.domain}
              </span>
            </div>

            {/* Level 2: Perspective */}
            <div style={{ marginLeft: '16px', borderLeft: '2px solid #e5e7eb', paddingLeft: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9ca3af' }} />
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' }}>
                  Perspective
                </span>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                  {EXAMPLE_DATA.perspective.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5', margin: 0 }}>
                  {EXAMPLE_DATA.perspective.blurb}
                </p>
              </div>

              {/* Level 3: Authors */}
              <div style={{ marginLeft: '16px', borderLeft: '2px solid #f3f4f6', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Users size={14} style={{ color: '#9ca3af' }} />
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' }}>
                    Authors ({EXAMPLE_DATA.authors.length})
                  </span>
                </div>

                {EXAMPLE_DATA.authors.map((author, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    {/* Author Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#4338ca' }}>
                          {author.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827' }}>{author.name}</div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>{author.role}</div>
                      </div>
                    </div>

                    {/* Quote */}
                    <div style={{
                      marginLeft: '40px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      backgroundColor: '#eff6ff',
                      borderRadius: '6px',
                      padding: '8px',
                      marginBottom: '8px',
                    }}>
                      <Quote size={12} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ fontSize: '12px', color: '#374151', fontStyle: 'italic', lineHeight: '1.5', margin: 0 }}>
                        "{author.quote}"
                      </p>
                    </div>

                    {/* Work */}
                    {author.workUrl && (
                      <a
                        href={author.workUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          marginLeft: '40px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          color: '#4f46e5',
                          textDecoration: 'none',
                        }}
                      >
                        <ExternalLink size={10} />
                        {author.work}
                      </a>
                    )}
                  </div>
                ))}

                {/* Cross-Perspective Authors: Supports & Challenges */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <ThumbsUp size={12} style={{ color: '#16a34a' }} />
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Also Supports
                      </span>
                    </div>
                    <p style={{ fontSize: '10px', color: '#6b7280', marginBottom: '6px' }}>
                      From other perspectives
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {EXAMPLE_DATA.supports.map((name, idx) => (
                        <span key={idx} style={{
                          fontSize: '11px',
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}>
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <ThumbsDown size={12} style={{ color: '#dc2626' }} />
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Challenges
                      </span>
                    </div>
                    <p style={{ fontSize: '10px', color: '#6b7280', marginBottom: '6px' }}>
                      From opposing perspectives
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {EXAMPLE_DATA.challenges.map((name, idx) => (
                        <span key={idx} style={{
                          fontSize: '11px',
                          backgroundColor: '#fee2e2',
                          color: '#991b1b',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}>
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
            }}
          >
            Got it, let me explore!
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook to manage the modal state with auto-show logic
export function useHowPerspectivesWorkModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const seenCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)

    if (seenCount < MAX_AUTO_SHOWS) {
      setIsOpen(true)
      localStorage.setItem(STORAGE_KEY, String(seenCount + 1))
    }

    setHasChecked(true)
  }, [])

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return { isOpen, open, close, hasChecked }
}

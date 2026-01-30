'use client'

import { Quote, ExternalLink } from 'lucide-react'
import { getStanceColor, getStanceIcon, getStanceLabel } from '@/components/research-assistant/lib'
import type { Stance } from '@/components/research-assistant/lib'

/**
 * Author data for the AuthorCard component
 */
export interface AuthorCardAuthor {
  id?: string
  name: string
  position: string
  draftConnection?: string
  stance: Stance
  quote?: string
  sourceUrl?: string
}

export interface AuthorCardProps {
  author: AuthorCardAuthor
  onAuthorClick?: (authorId: string) => void
}

/**
 * Map of common domains to readable source names
 */
const DOMAIN_NAMES: Record<string, string> = {
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

/**
 * Extract readable source name from URL
 */
function getSourceName(url: string): string {
  try {
    const parsedUrl = new URL(url)
    const domain = parsedUrl.hostname.replace('www.', '')
    const siteName = DOMAIN_NAMES[domain] || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
    return `Read on ${siteName}`
  } catch {
    return 'View source'
  }
}

/**
 * Get connection label based on stance
 */
function getConnectionLabel(stance: Stance): string {
  switch (stance) {
    case 'agrees':
      return '+ Supports your draft'
    case 'disagrees':
      return 'x Challenges your draft'
    case 'partial':
      return 'o Relates to your draft'
  }
}

/**
 * Get connection background color based on stance
 */
function getConnectionBgColor(stance: Stance): string {
  switch (stance) {
    case 'agrees':
      return 'rgba(16, 185, 129, 0.06)'
    case 'disagrees':
      return 'rgba(239, 68, 68, 0.06)'
    case 'partial':
      return 'rgba(245, 158, 11, 0.06)'
  }
}

/**
 * Get connection border color based on stance
 */
function getConnectionBorderColor(stance: Stance): string {
  switch (stance) {
    case 'agrees':
      return '#10b981'
    case 'disagrees':
      return '#ef4444'
    case 'partial':
      return '#f59e0b'
  }
}

/**
 * Get connection text color based on stance
 */
function getConnectionTextColor(stance: Stance): string {
  switch (stance) {
    case 'agrees':
      return '#059669'
    case 'disagrees':
      return '#dc2626'
    case 'partial':
      return '#d97706'
  }
}

/**
 * AuthorCard displays an individual thought leader with their stance,
 * position, connection to draft, and quote (if available).
 */
export function AuthorCard({ author, onAuthorClick }: AuthorCardProps) {
  const colors = getStanceColor(author.stance)

  return (
    <div
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
              <button
                onClick={() => onAuthorClick?.(author.id as string)}
                style={{
                  fontWeight: 'var(--weight-semibold)',
                  fontSize: 'var(--text-body)',
                  color: '#0158AE',
                  textDecoration: 'none',
                  margin: 0,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'color var(--duration-fast) var(--ease-out)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#1075DC'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#0158AE'}
              >
                {author.name}
              </button>
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
          marginBottom: 'var(--space-3)',
          padding: '12px 14px',
          backgroundColor: getConnectionBgColor(author.stance),
          borderRadius: '8px',
          borderLeft: `3px solid ${getConnectionBorderColor(author.stance)}`
        }}>
          <p style={{
            fontSize: '12px',
            fontWeight: 600,
            color: getConnectionTextColor(author.stance),
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            {getConnectionLabel(author.stance)}
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
              backgroundColor: '#FFFFFF',
              border: '1px solid #AADAF9',
              borderRadius: '8px',
              padding: 'var(--space-3)',
              textDecoration: 'none',
              transition: 'all var(--duration-fast) var(--ease-out)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1075DC'
              e.currentTarget.style.backgroundColor = 'rgba(16, 117, 220, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#AADAF9'
              e.currentTarget.style.backgroundColor = '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Quote style={{
                width: '16px',
                height: '16px',
                color: '#1075DC',
                flexShrink: 0,
                marginTop: '2px'
              }} />
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: 'var(--text-small)',
                  fontStyle: 'italic',
                  color: '#162950',
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
                  color: '#0158AE',
                  marginTop: 'var(--space-2)'
                }}>
                  <ExternalLink style={{ width: '12px', height: '12px' }} />
                  {getSourceName(author.sourceUrl)}
                </span>
              </div>
            </div>
          </a>
        ) : (
          <div style={{
            backgroundColor: '#DCF2FA',
            border: '1px solid #AADAF9',
            borderRadius: '8px',
            padding: 'var(--space-3)'
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Quote style={{
                width: '16px',
                height: '16px',
                color: '#48AFF0',
                flexShrink: 0,
                marginTop: '2px'
              }} />
              <p style={{
                fontSize: 'var(--text-small)',
                fontStyle: 'italic',
                color: '#162950',
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
}

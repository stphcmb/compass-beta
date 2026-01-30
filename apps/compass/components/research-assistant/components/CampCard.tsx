'use client'

import Link from 'next/link'
import { ThumbsUp } from 'lucide-react'
import { AuthorCard } from './AuthorCard'
import type { AuthorCardAuthor } from './AuthorCard'

/**
 * Camp data for the CampCard component
 */
export interface CampCardCamp {
  campLabel: string
  explanation: string
  topAuthors: AuthorCardAuthor[]
}

export interface CampCardProps {
  camp: CampCardCamp
  campIndex: number
  isLiked: boolean
  onToggleLike: () => void
  onAuthorClick?: (authorId: string) => void
}

/**
 * CampCard displays a thought leader camp/perspective with its explanation
 * and list of authors belonging to that camp.
 */
export function CampCard({
  camp,
  campIndex,
  isLiked,
  onToggleLike,
  onAuthorClick
}: CampCardProps) {
  return (
    <div
      style={{
        border: '1px solid #AADAF9',
        borderRadius: '12px',
        padding: 'var(--space-5)',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(22, 41, 80, 0.04)',
        transition: 'all var(--duration-fast) var(--ease-out)'
      }}
    >
      {/* Camp Header */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-2)'
        }}>
          <Link
            href={`/results?q=${encodeURIComponent(camp.campLabel)}`}
            style={{
              fontWeight: 600,
              fontSize: '17px',
              color: '#162950',
              textDecoration: 'none',
              transition: 'color var(--duration-fast) var(--ease-out)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#1075DC'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#162950'
            }}
          >
            {camp.campLabel}
            <span style={{ fontSize: '14px', opacity: 0.6 }}>-&gt;</span>
          </Link>
          <button
            onClick={onToggleLike}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '14px',
              border: isLiked ? '1px solid #10b981' : '1px solid #e5e7eb',
              backgroundColor: isLiked ? '#d1fae5' : 'white',
              color: isLiked ? '#059669' : '#6b7280',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
            title={isLiked ? 'Remove from helpful insights' : 'Save as helpful'}
          >
            <ThumbsUp style={{ width: '12px', height: '12px', fill: isLiked ? '#059669' : 'none' }} />
            {isLiked ? 'Saved' : 'Helpful'}
          </button>
        </div>
        <p style={{
          fontSize: 'var(--text-small)',
          color: '#374151',
          lineHeight: 'var(--leading-relaxed)',
          margin: 0
        }}>
          {camp.explanation}
        </p>
      </div>

      {/* Author Cards */}
      {camp.topAuthors.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {camp.topAuthors.map((author, authorIdx) => (
            <AuthorCard
              key={authorIdx}
              author={author}
              onAuthorClick={onAuthorClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

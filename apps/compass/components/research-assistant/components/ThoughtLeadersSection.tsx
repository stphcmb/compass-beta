'use client'

import { forwardRef } from 'react'
import { Users } from 'lucide-react'
import { CampCard } from './CampCard'
import type { CampCardCamp } from './CampCard'

export interface ThoughtLeadersSectionProps {
  matchedCamps: CampCardCamp[]
  likedCamps: Set<number>
  onToggleCampLike: (campIndex: number) => void
  onAuthorClick?: (authorId: string) => void
}

/**
 * ThoughtLeadersSection displays the main section containing all matched camps
 * and their associated thought leaders. Uses forwardRef for scroll-to functionality.
 */
export const ThoughtLeadersSection = forwardRef<HTMLDivElement, ThoughtLeadersSectionProps>(
  function ThoughtLeadersSection(
    { matchedCamps, likedCamps, onToggleCampLike, onAuthorClick },
    ref
  ) {
    if (matchedCamps.length === 0) {
      return null
    }

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: 'var(--card-padding-desktop)',
          boxShadow: '0 2px 12px rgba(22, 41, 80, 0.06)',
          border: '1px solid #AADAF9',
          scrollMarginTop: '96px',
          marginTop: 'var(--space-6)'
        }}
      >
        <h2 style={{
          marginBottom: 'var(--space-2)',
          color: '#162950',
          fontSize: '1.25rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Users style={{ width: '22px', height: '22px', color: '#1075DC' }} />
          Relevant Thought Leaders
          <span style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#64748b',
            marginLeft: '4px'
          }}>
            ({matchedCamps.length} perspectives)
          </span>
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          marginBottom: 'var(--space-6)',
          lineHeight: '1.5'
        }}>
          See what each thought leader believes and how their ideas specifically support or challenge your draft.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {matchedCamps.map((camp, idx) => (
            <CampCard
              key={idx}
              camp={camp}
              campIndex={idx}
              isLiked={likedCamps.has(idx)}
              onToggleLike={() => onToggleCampLike(idx)}
              onAuthorClick={onAuthorClick}
            />
          ))}
        </div>
      </div>
    )
  }
)

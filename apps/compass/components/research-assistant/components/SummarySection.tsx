'use client'

import { forwardRef } from 'react'
import { CheckCircle, ThumbsUp } from 'lucide-react'

/**
 * Props for SummarySection component
 */
export interface SummarySectionProps {
  /** Summary text from the analysis result */
  summary: string
  /** Whether the summary has been marked as helpful */
  isLiked: boolean
  /** Handler for toggling the helpful state */
  onToggleLike: () => void
}

/**
 * SummarySection - Displays the analysis summary
 * Includes a "This is helpful" button to save the summary
 * forwardRef to allow parent to scroll to this section
 */
export const SummarySection = forwardRef<HTMLDivElement, SummarySectionProps>(
  function SummarySection({ summary, isLiked, onToggleLike }, ref) {
    return (
      <div
        ref={ref}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: 'var(--card-padding-desktop)',
          boxShadow: '0 2px 12px rgba(22, 41, 80, 0.06)',
          border: '1px solid #AADAF9',
          scrollMarginTop: '96px'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-3)'
        }}>
          <h2 style={{
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            color: '#162950'
          }}>
            <CheckCircle style={{ width: '20px', height: '20px', color: '#10b981' }} />
            Summary
          </h2>
          <button
            onClick={onToggleLike}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '16px',
              border: isLiked ? '1px solid #10b981' : '1px solid #e5e7eb',
              backgroundColor: isLiked ? '#d1fae5' : 'white',
              color: isLiked ? '#059669' : '#6b7280',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title={isLiked ? 'Remove from helpful insights' : 'Save as helpful'}
          >
            <ThumbsUp style={{ width: '14px', height: '14px', fill: isLiked ? '#059669' : 'none' }} />
            {isLiked ? 'Helpful!' : 'This is helpful'}
          </button>
        </div>
        <p style={{
          color: '#374151',
          lineHeight: '1.75',
          margin: 0,
          fontSize: '15px'
        }}>
          {summary}
        </p>
      </div>
    )
  }
)

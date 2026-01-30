'use client'

import { useState } from 'react'
import { Quote } from 'lucide-react'

/**
 * Props for AnalyzedTextPreview component
 */
export interface AnalyzedTextPreviewProps {
  /** The full text that was analyzed */
  text: string
}

/**
 * AnalyzedTextPreview - Displays a preview of the analyzed text input
 * Shows truncated text with expand/collapse functionality
 * Used in the "View Mode" when analysis results are displayed
 */
export function AnalyzedTextPreview({ text }: AnalyzedTextPreviewProps) {
  const [showFullText, setShowFullText] = useState(false)
  const TRUNCATE_LENGTH = 300

  return (
    <div
      style={{
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #DCF2FA 0%, #AADAF9 100%)',
        border: '1px solid #48AFF0',
        padding: '20px',
        marginBottom: 'var(--space-6)',
        position: 'relative'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <Quote style={{
          width: '24px',
          height: '24px',
          color: '#0158AE',
          flexShrink: 0,
          marginTop: '2px'
        }} />
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.7',
            color: '#162950',
            margin: 0,
            fontStyle: 'italic'
          }}>
            {showFullText
              ? text
              : (text.length > TRUNCATE_LENGTH
                  ? text.substring(0, TRUNCATE_LENGTH) + '...'
                  : text
                )
            }
          </p>
          {text.length > TRUNCATE_LENGTH && (
            <button
              onClick={() => setShowFullText(!showFullText)}
              style={{
                marginTop: '8px',
                padding: '4px 8px',
                fontSize: '12px',
                color: '#1075DC',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {showFullText ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #48AFF0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: '12px', color: '#0158AE', fontWeight: 500 }}>
          {text.length.toLocaleString()} characters analyzed
        </span>
      </div>
    </div>
  )
}

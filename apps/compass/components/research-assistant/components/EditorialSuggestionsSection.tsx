'use client'

import { forwardRef, type ReactNode } from 'react'
import { Lightbulb, CheckCircle, AlertCircle } from 'lucide-react'

/**
 * Editorial suggestions from analysis result
 */
export interface EditorialSuggestions {
  presentPerspectives: string[]
  missingPerspectives: string[]
}

/**
 * Props for EditorialSuggestionsSection component
 */
export interface EditorialSuggestionsSectionProps {
  /** Editorial suggestions from the analysis result */
  editorialSuggestions: EditorialSuggestions
  /** Function to linkify author names in text */
  linkifyAuthors: (text: string) => ReactNode
}

/**
 * EditorialSuggestionsSection - Displays editorial suggestions
 * Shows present perspectives (what you're using) and missing perspectives (what you're missing)
 * forwardRef to allow parent to scroll to this section
 */
export const EditorialSuggestionsSection = forwardRef<HTMLDivElement, EditorialSuggestionsSectionProps>(
  function EditorialSuggestionsSection({ editorialSuggestions, linkifyAuthors }, ref) {
    return (
      <div ref={ref} style={{ scrollMarginTop: '96px', marginTop: 'var(--space-6)' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #1075DC',
          borderRadius: '12px',
          padding: 'var(--space-8)',
          boxShadow: '0 4px 24px rgba(22, 41, 80, 0.08)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)'
          }}>
            <div style={{
              padding: 'var(--space-3)',
              background: 'linear-gradient(135deg, #0158AE 0%, #1075DC 100%)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(1, 88, 174, 0.25)'
            }}>
              <Lightbulb style={{ width: '28px', height: '28px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{ marginBottom: '4px', color: '#162950' }}>Editorial Suggestions</h2>
              <p style={{
                fontSize: 'var(--text-small)',
                color: '#64748b',
                margin: 0
              }}>
                Key insights to strengthen your content
              </p>
            </div>
          </div>

          {/* Grid of suggestions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {/* Present Perspectives */}
            <div style={{
              backgroundColor: 'var(--color-bone)',
              borderRadius: 'var(--radius-base)',
              padding: 'var(--card-padding-desktop)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-success)'
            }}>
              <h3 style={{
                fontSize: 'var(--text-h3)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-success)',
                marginBottom: 'var(--space-3)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <CheckCircle style={{ width: '20px', height: '20px' }} />
                What You're Already Using
              </h3>
              <p style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--color-mid-gray)',
                fontWeight: 'var(--weight-medium)',
                marginBottom: 'var(--space-4)'
              }}>
                Your content includes these perspectives:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {editorialSuggestions.presentPerspectives.map((perspective, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <span style={{
                      color: 'var(--color-success)',
                      marginTop: '2px',
                      fontSize: '20px',
                      flexShrink: 0
                    }}>+</span>
                    <span style={{
                      color: 'var(--color-soft-black)',
                      fontSize: 'var(--text-small)',
                      lineHeight: 'var(--leading-relaxed)',
                      fontWeight: 'var(--weight-medium)'
                    }}>
                      {linkifyAuthors(perspective)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Perspectives */}
            <div style={{
              backgroundColor: 'var(--color-bone)',
              borderRadius: 'var(--radius-base)',
              padding: 'var(--card-padding-desktop)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-warning)'
            }}>
              <h3 style={{
                fontSize: 'var(--text-h3)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-warning)',
                marginBottom: 'var(--space-3)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <AlertCircle style={{ width: '20px', height: '20px' }} />
                What You're Missing
              </h3>
              <p style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--color-mid-gray)',
                fontWeight: 'var(--weight-medium)',
                marginBottom: 'var(--space-4)'
              }}>
                Consider adding these to strengthen your argument:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {editorialSuggestions.missingPerspectives.map((perspective, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid rgba(245, 158, 11, 0.2)'
                  }}>
                    <span style={{
                      color: 'var(--color-warning)',
                      marginTop: '2px',
                      fontSize: '20px',
                      flexShrink: 0
                    }}>!</span>
                    <span style={{
                      color: 'var(--color-soft-black)',
                      fontSize: 'var(--text-small)',
                      lineHeight: 'var(--leading-relaxed)',
                      fontWeight: 'var(--weight-medium)'
                    }}>
                      {linkifyAuthors(perspective)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

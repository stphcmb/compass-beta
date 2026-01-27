'use client'

import { Quote, ExternalLink } from 'lucide-react'
import { ReactNode } from 'react'

interface QuoteBoxProps {
  quote: string
  sourceUrl?: string
  sourceTitle?: string
  // Visual variants
  variant?: 'default' | 'highlighted' | 'accent'
  accentColor?: string // For domain-colored left border
  // Size variants
  size?: 'sm' | 'md' | 'lg'
  // Search highlighting
  highlightedQuote?: ReactNode // Pre-highlighted quote text
  // Additional styling
  className?: string
}

/**
 * Consolidated QuoteBox component for consistent quote display across the app.
 * Used in: AuthorCard, SearchResults, AuthorDetailPanel, AIEditorResults
 */
export default function QuoteBox({
  quote,
  sourceUrl,
  sourceTitle,
  variant = 'default',
  accentColor,
  size = 'md',
  highlightedQuote,
  className = ''
}: QuoteBoxProps) {
  // Size-based styles
  const sizes = {
    sm: {
      padding: '10px 12px',
      iconSize: 14,
      fontSize: '13px',
      sourceSize: '11px',
      gap: '8px'
    },
    md: {
      padding: '12px 14px',
      iconSize: 16,
      fontSize: '14px',
      sourceSize: '12px',
      gap: '10px'
    },
    lg: {
      padding: '14px 16px',
      iconSize: 18,
      fontSize: '15px',
      sourceSize: '12px',
      gap: '12px'
    }
  }

  const sizeConfig = sizes[size]

  // Variant-based styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'highlighted':
        return {
          bg: '#eff6ff', // blue-50
          border: '1px solid #bfdbfe', // blue-200
          hoverBg: '#dbeafe', // blue-100
          hoverBorder: '#93c5fd', // blue-300
          iconColor: '#60a5fa', // blue-400
          textColor: '#1e40af' // blue-800
        }
      case 'accent':
        return {
          bg: '#f9fafb', // gray-50
          border: 'none',
          borderLeft: `3px solid ${accentColor || '#9ca3af'}`,
          hoverBg: '#f3f4f6',
          hoverBorder: 'none',
          iconColor: accentColor || '#9ca3af',
          textColor: '#374151'
        }
      default:
        return {
          bg: '#f9fafb', // gray-50
          border: '1px solid #e5e7eb', // gray-200
          hoverBg: '#f3f4f6', // gray-100
          hoverBorder: '#d1d5db', // gray-300
          iconColor: '#9ca3af', // gray-400
          textColor: '#374151' // gray-700
        }
    }
  }

  const variantStyles = getVariantStyles()

  const content = (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: sizeConfig.gap
      }}
    >
      <Quote
        style={{
          width: `${sizeConfig.iconSize}px`,
          height: `${sizeConfig.iconSize}px`,
          color: variantStyles.iconColor,
          flexShrink: 0,
          marginTop: '2px',
          opacity: variant === 'accent' ? 0.6 : 1
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: sizeConfig.fontSize,
            fontStyle: 'italic',
            color: variantStyles.textColor,
            lineHeight: 1.6,
            margin: 0
          }}
        >
          "{highlightedQuote || quote}"
        </p>
        {sourceUrl && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '8px',
              fontSize: sizeConfig.sourceSize,
              color: '#6b7280',
              transition: 'color 0.15s'
            }}
            className="group-hover:text-indigo-600"
          >
            <ExternalLink style={{ width: '12px', height: '12px' }} />
            <span className="group-hover:underline">
              {sourceTitle || getSourceTitle(sourceUrl)}
            </span>
          </span>
        )}
      </div>
    </div>
  )

  const baseStyles: React.CSSProperties = {
    padding: sizeConfig.padding,
    borderRadius: variant === 'accent' ? '6px' : '8px',
    backgroundColor: variantStyles.bg,
    border: variantStyles.border,
    borderLeft: variant === 'accent' ? variantStyles.borderLeft : undefined,
    transition: 'all 0.15s ease'
  }

  // If there's a source URL, wrap in an anchor tag
  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block group ${className}`}
        style={baseStyles}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = variantStyles.hoverBg
          if (variantStyles.hoverBorder) {
            e.currentTarget.style.borderColor = variantStyles.hoverBorder
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = variantStyles.bg
          if (variantStyles.border && variantStyles.border !== 'none') {
            e.currentTarget.style.borderColor = variantStyles.border.replace('1px solid ', '')
          }
        }}
      >
        {content}
      </a>
    )
  }

  // No source URL, render as div
  return (
    <div className={className} style={baseStyles}>
      {content}
    </div>
  )
}

// Helper to extract readable title from URL
function getSourceTitle(url: string): string {
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname
    const segments = path.split('/').filter(Boolean)
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1]
      const cleaned = lastSegment
        .replace(/\.(html?|php|aspx?)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
      if (cleaned.length > 5 && cleaned.length < 80) return cleaned
    }
    return urlObj.hostname.replace(/^www\./, '')
  } catch {
    return 'View source'
  }
}

'use client'

import { Sparkles, X } from 'lucide-react'

export interface AnalysisCardProps {
  inputPreview: string
  cachedResult?: {
    summary?: string
    matchedCamps?: Array<{ campLabel: string }>
    editorialSuggestions?: {
      presentPerspectives?: string[]
      missingPerspectives?: string[]
    }
  }
  timestamp: string
  note?: string
  onClick: () => void
  onDelete: () => void
  viewMode?: 'grid' | 'list'
}

export function AnalysisCard({
  inputPreview,
  cachedResult,
  timestamp,
  note,
  onClick,
  onDelete,
  viewMode = 'grid'
}: AnalysisCardProps) {
  const summary = cachedResult?.summary || ''
  const campCount = cachedResult?.matchedCamps?.length || 0
  const missingCount = cachedResult?.editorialSuggestions?.missingPerspectives?.length || 0

  // List View - Compact row layout
  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 12px',
          borderBottom: '1px solid #f3f4f6',
          background: '#ffffff',
          cursor: 'pointer',
          transition: 'background 0.12s ease-out',
          minHeight: '48px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f0f9ff'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ffffff'
        }}
      >
        {/* Icon */}
        <div style={{
          width: '16px',
          height: '16px',
          marginRight: '12px',
          flexShrink: 0
        }}>
          <Sparkles size={16} style={{ color: '#8b5cf6' }} />
        </div>

        {/* Input preview - flex-1 */}
        <div style={{
          flex: 1,
          fontSize: '14px',
          fontWeight: 500,
          color: '#141414',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0
        }}>
          {inputPreview.trim()}
        </div>

        {/* Summary preview */}
        {summary && (
          <div style={{
            fontSize: '13px',
            color: '#6b7280',
            marginLeft: '12px',
            flexShrink: 0,
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Summary:</span> {summary}
          </div>
        )}

        {/* Camp count badge */}
        {campCount > 0 && (
          <div style={{
            padding: '2px 6px',
            borderRadius: '4px',
            background: '#dbeafe',
            color: '#2563eb',
            fontSize: '11px',
            fontWeight: 600,
            marginLeft: '8px',
            flexShrink: 0
          }}>
            {campCount}c
          </div>
        )}

        {/* Missing count badge */}
        {missingCount > 0 && (
          <div style={{
            padding: '2px 6px',
            borderRadius: '4px',
            background: '#fee2e2',
            color: '#dc2626',
            fontSize: '11px',
            fontWeight: 600,
            marginLeft: '4px',
            flexShrink: 0
          }}>
            {missingCount}m
          </div>
        )}

        {/* Timestamp */}
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          marginLeft: '12px',
          flexShrink: 0,
          width: '80px',
          textAlign: 'right'
        }}>
          {timestamp}
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            padding: '4px',
            marginLeft: '8px',
            borderRadius: '4px',
            border: 'none',
            background: 'transparent',
            color: '#6b7280',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.12s ease-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fee2e2'
            e.currentTarget.style.color = '#dc2626'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#6b7280'
          }}
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  // Grid View - Card layout (default)
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.12s ease-out',
        width: '100%',
        boxSizing: 'border-box'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#8b5cf6'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '5px',
          background: '#f3e8ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={14} style={{ color: '#8b5cf6' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top row: type + timestamp + badges */}
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            <span style={{ fontWeight: 600, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Analysis</span>
            {' · '}{timestamp}
            {campCount > 0 && ` · ${campCount} perspectives`}
          </div>
          {/* Input text */}
          <p style={{
            fontSize: '14px',
            color: '#374151',
            margin: 0,
            marginBottom: '8px',
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {inputPreview.trim()}
          </p>
          {/* Summary preview */}
          {summary && (
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              margin: 0,
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              <span style={{ fontWeight: 600 }}>Summary:</span> {summary}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            padding: '4px',
            borderRadius: '4px',
            border: 'none',
            background: 'transparent',
            color: '#d1d5db',
            cursor: 'pointer',
            flexShrink: 0,
            alignSelf: 'flex-start'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fee2e2'
            e.currentTarget.style.color = '#dc2626'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#d1d5db'
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

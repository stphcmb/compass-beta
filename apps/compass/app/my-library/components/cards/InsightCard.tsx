'use client'

import { ThumbsUp, X } from 'lucide-react'

export interface InsightCardProps {
  content: string
  type: string
  timestamp: string
  originalText?: string
  onClick: () => void
  onDelete: () => void
  viewMode?: 'grid' | 'list'
}

function InsightCard({
  content,
  type,
  timestamp,
  originalText,
  onClick,
  onDelete,
  viewMode = 'grid'
}: InsightCardProps) {
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
          <ThumbsUp size={16} style={{ color: '#059669' }} />
        </div>

        {/* Type label */}
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#059669',
          textTransform: 'uppercase',
          marginRight: '12px',
          flexShrink: 0,
          width: '80px'
        }}>
          {type}
        </div>

        {/* Content - flex-1 */}
        <div style={{
          flex: 1,
          fontSize: '13px',
          fontWeight: 400,
          color: '#374151',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0
        }}>
          {content}
        </div>

        {/* Original text preview */}
        {originalText && (
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            fontStyle: 'italic',
            marginLeft: '12px',
            flexShrink: 0,
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            from &quot;{originalText}&quot;
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
        transition: 'all 0.12s ease-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#10b981'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '5px',
          background: '#d1fae5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ThumbsUp size={14} style={{ color: '#059669' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#059669',
              textTransform: 'uppercase',
              letterSpacing: '0.02em'
            }}>
              {type}
            </span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>·</span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{timestamp}</span>
          </div>
          <p style={{
            fontSize: '13px',
            color: '#374151',
            margin: 0,
            marginBottom: originalText ? '6px' : 0,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {content}
          </p>
          {originalText && (
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: 0,
              fontStyle: 'italic',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              From: &quot;{originalText}&quot;
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

export { InsightCard }
export default InsightCard

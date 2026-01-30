'use client'

import { Search, MessageSquare, X } from 'lucide-react'

export interface SearchCardProps {
  query: string
  timestamp: string
  isSaved: boolean
  note?: string
  onClick: () => void
  onDelete: () => void
  viewMode?: 'grid' | 'list'
}

export function SearchCard({
  query,
  timestamp,
  isSaved,
  note,
  onClick,
  onDelete,
  viewMode = 'grid'
}: SearchCardProps) {
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
          <Search size={16} style={{ color: isSaved ? '#3b82f6' : '#9ca3af' }} />
        </div>

        {/* Query text - flex-1 */}
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
          {query}
        </div>

        {/* Note badge */}
        {note && (
          <div style={{
            padding: '2px 6px',
            borderRadius: '4px',
            background: '#fef3c7',
            color: '#d97706',
            fontSize: '11px',
            fontWeight: 600,
            marginLeft: '8px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <MessageSquare size={10} />
            Note
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

        {/* Saved badge */}
        {isSaved && (
          <div style={{
            padding: '2px 6px',
            borderRadius: '4px',
            background: '#dcfce7',
            color: '#16a34a',
            fontSize: '11px',
            fontWeight: 600,
            marginLeft: '8px',
            flexShrink: 0
          }}>
            Saved
          </div>
        )}

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
            color: '#9ca3af',
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
            e.currentTarget.style.color = '#9ca3af'
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
        border: note ? '1px solid #fde68a' : '1px solid #e5e7eb',
        background: note ? '#fffbeb' : '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.12s ease-out',
        width: '100%',
        boxSizing: 'border-box'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#3b82f6'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = note ? '#fde68a' : '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '5px',
          background: isSaved ? '#dbeafe' : '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Search size={14} style={{ color: isSaved ? '#3b82f6' : '#9ca3af' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4
          }}>
            {query}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            {timestamp}{isSaved && ' · Saved'}
          </div>
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
            flexShrink: 0
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
      {note && (
        <div style={{
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '1px solid #fde68a',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px'
        }}>
          <MessageSquare size={12} style={{ color: '#d97706', marginTop: '2px', flexShrink: 0 }} />
          <p style={{
            fontSize: '12px',
            color: '#92400e',
            margin: 0,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {note}
          </p>
        </div>
      )}
    </div>
  )
}

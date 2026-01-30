'use client'

import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

export interface CollapsibleSectionProps {
  id: string
  title: string
  icon: React.ReactNode
  count: number
  isCollapsed?: boolean
  onToggle: () => void
  onClear: () => void
  color: string
  headerExtra?: React.ReactNode
  children: React.ReactNode
}

export function CollapsibleSection({
  id,
  title,
  icon,
  count,
  isCollapsed,
  onToggle,
  onClear,
  color,
  headerExtra,
  children
}: CollapsibleSectionProps) {
  const contentId = `section-content-${id}`

  // Handle keyboard events for the toggle area (not including headerExtra buttons)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      {/* Header container - split into clickable toggle area and action buttons */}
      <div
        style={{
          padding: '10px 14px',
          borderBottom: isCollapsed ? 'none' : '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'white',
        }}
      >
        {/* Toggle area - clickable and keyboard accessible */}
        <div
          role="button"
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={!isCollapsed}
          aria-controls={contentId}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            flex: 1,
            outline: 'none',
            padding: '2px 4px',
            margin: '-2px -4px',
            borderRadius: '4px',
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 2px #6366f1'
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {icon}
          <span style={{ fontWeight: '600', color: '#374151', fontSize: '13px' }}>{title}</span>
          <span style={{
            padding: '1px 6px',
            borderRadius: '8px',
            background: `${color}15`,
            fontSize: '11px',
            fontWeight: '600',
            color: color
          }}>
            {count}
          </span>
          {isCollapsed ? (
            <ChevronDown size={16} style={{ color: '#6b7280', marginLeft: 'auto' }} aria-hidden="true" />
          ) : (
            <ChevronUp size={16} style={{ color: '#6b7280', marginLeft: 'auto' }} aria-hidden="true" />
          )}
        </div>

        {/* Action buttons - separate from toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
          {headerExtra}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            aria-label={`Clear all ${title}`}
            style={{
              padding: '3px 6px',
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              color: '#6b7280',
              fontSize: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px #6366f1'
              e.currentTarget.style.background = '#fef2f2'
              e.currentTarget.style.color = '#ef4444'
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#6b7280'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fef2f2'
              e.currentTarget.style.color = '#ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <div id={contentId} style={{ padding: '10px 14px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

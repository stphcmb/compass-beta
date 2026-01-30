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
  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      <div
        onClick={onToggle}
        style={{
          padding: '10px 14px',
          borderBottom: isCollapsed ? 'none' : '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#fafafa'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {headerExtra}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            style={{
              padding: '3px 6px',
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              color: '#d1d5db',
              fontSize: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fef2f2'
              e.currentTarget.style.color = '#ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#d1d5db'
            }}
          >
            <Trash2 size={11} />
          </button>
          {isCollapsed ? (
            <ChevronDown size={16} style={{ color: '#9ca3af' }} />
          ) : (
            <ChevronUp size={16} style={{ color: '#9ca3af' }} />
          )}
        </div>
      </div>
      {!isCollapsed && (
        <div style={{ padding: '10px 14px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

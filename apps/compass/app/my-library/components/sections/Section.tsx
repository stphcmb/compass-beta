'use client'

import { Trash2 } from 'lucide-react'

export interface SectionProps {
  title: string
  icon: React.ReactNode
  count: number
  onClear: () => void
  children: React.ReactNode
}

export function Section({
  title,
  icon,
  count,
  onClear,
  children
}: SectionProps) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon}
          <span style={{ fontWeight: '600', color: '#374151', fontSize: '15px' }}>{title}</span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '10px',
            background: '#f3f4f6',
            fontSize: '12px',
            fontWeight: '500',
            color: '#6b7280'
          }}>
            {count}
          </span>
        </div>
        <button
          onClick={onClear}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#6b7280',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
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
          <Trash2 size={12} />
          Clear all
        </button>
      </div>
      <div style={{ padding: '16px 20px' }}>
        {children}
      </div>
    </div>
  )
}

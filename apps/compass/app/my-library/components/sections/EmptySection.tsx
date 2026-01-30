'use client'

export interface EmptySectionProps {
  message: string
  actionLabel?: string
  actionIcon?: React.ReactNode
  onAction?: () => void
}

export function EmptySection({
  message,
  actionLabel,
  actionIcon,
  onAction
}: EmptySectionProps) {
  return (
    <div style={{
      padding: '24px 16px',
      textAlign: 'center',
      borderRadius: '8px',
      background: '#fafafa',
      border: '1px dashed #e5e7eb'
    }}>
      <p style={{
        fontSize: '13px',
        color: '#9ca3af',
        margin: 0,
        lineHeight: 1.5
      }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: '12px',
            padding: '8px 14px',
            borderRadius: '6px',
            border: 'none',
            background: '#f3f4f6',
            color: '#6b7280',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e5e7eb'
            e.currentTarget.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f3f4f6'
            e.currentTarget.style.color = '#6b7280'
          }}
        >
          {actionIcon}
          {actionLabel}
        </button>
      )}
    </div>
  )
}

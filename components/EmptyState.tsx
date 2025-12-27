'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  iconColor?: string
  iconBgFrom?: string
  iconBgTo?: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  size?: 'sm' | 'md' | 'lg'
}

export default function EmptyState({
  icon: Icon,
  iconColor = '#6b7280',
  iconBgFrom = '#f3f4f6',
  iconBgTo = '#e5e7eb',
  title,
  description,
  action,
  size = 'md'
}: EmptyStateProps) {
  const sizes = {
    sm: {
      iconWrapper: 48,
      iconSize: 20,
      title: '14px',
      description: '13px',
      padding: '24px 16px',
      maxWidth: '280px'
    },
    md: {
      iconWrapper: 64,
      iconSize: 28,
      title: '16px',
      description: '14px',
      padding: '40px 24px',
      maxWidth: '320px'
    },
    lg: {
      iconWrapper: 80,
      iconSize: 32,
      title: '20px',
      description: '15px',
      padding: '48px 32px',
      maxWidth: '360px'
    }
  }

  const s = sizes[size]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: s.padding,
        textAlign: 'center',
        height: '100%'
      }}
    >
      <div
        style={{
          width: `${s.iconWrapper}px`,
          height: `${s.iconWrapper}px`,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${iconBgFrom} 0%, ${iconBgTo} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}
      >
        <Icon style={{ width: `${s.iconSize}px`, height: `${s.iconSize}px`, color: iconColor }} />
      </div>
      <h4
        style={{
          fontSize: s.title,
          fontWeight: 600,
          color: 'var(--color-soft-black)',
          marginBottom: '8px'
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: s.description,
          color: 'var(--color-mid-gray)',
          lineHeight: 1.6,
          maxWidth: s.maxWidth,
          marginBottom: action ? '20px' : '0'
        }}
      >
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--color-cobalt-blue)',
            backgroundColor: 'var(--color-pale-gray)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e0e7ff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-pale-gray)'
          }}
        >
          {action.icon && <action.icon style={{ width: '16px', height: '16px' }} />}
          {action.label}
        </button>
      )}
    </div>
  )
}

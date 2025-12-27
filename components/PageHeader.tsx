'use client'

import { ReactNode } from 'react'
import { HelpCircle } from 'lucide-react'

interface PageHeaderProps {
  icon: ReactNode
  title: string
  subtitle?: string
  helpButton?: {
    label: string
    onClick: () => void
  }
  actions?: ReactNode
  // Icon gradient variants using Anduin palette
  iconVariant?: 'navy' | 'blue' | 'green' | 'purple'
}

const iconGradients = {
  navy: 'linear-gradient(135deg, #162950 0%, #1e3a5f 100%)',     // Quantum Navy
  blue: 'linear-gradient(135deg, #0158AE 0%, #1075DC 100%)',     // Cobalt to Velocity Blue
  green: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',    // Keep domain green
  purple: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',   // Keep domain purple
}

const iconShadows = {
  navy: '0 4px 12px rgba(22, 41, 80, 0.3)',
  blue: '0 4px 12px rgba(1, 88, 174, 0.25)',
  green: '0 4px 12px rgba(5, 150, 105, 0.25)',
  purple: '0 4px 12px rgba(124, 58, 237, 0.25)',
}

export default function PageHeader({
  icon,
  title,
  subtitle,
  helpButton,
  actions,
  iconVariant = 'navy'
}: PageHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Icon with gradient background */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: iconGradients[iconVariant],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: iconShadows[iconVariant],
          flexShrink: 0
        }}>
          <div style={{ color: 'white', display: 'flex' }}>
            {icon}
          </div>
        </div>

        {/* Title and subtitle */}
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--color-quantum-navy)',
            margin: 0,
            letterSpacing: '-0.01em',
            lineHeight: 1.2
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontSize: '14px',
              color: 'var(--color-mid-gray)',
              margin: '4px 0 0 0',
              lineHeight: 1.4
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {actions}
        {helpButton && (
          <button
            onClick={helpButton.onClick}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--color-light-gray)',
              background: 'var(--color-air-white)',
              color: 'var(--color-mid-gray)',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 150ms ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-digital-sky)'
              e.currentTarget.style.background = 'var(--color-cloud-blue)'
              e.currentTarget.style.color = 'var(--color-cobalt-blue)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-light-gray)'
              e.currentTarget.style.background = 'var(--color-air-white)'
              e.currentTarget.style.color = 'var(--color-mid-gray)'
            }}
          >
            <HelpCircle size={16} />
            {helpButton.label}
          </button>
        )}
      </div>
    </div>
  )
}

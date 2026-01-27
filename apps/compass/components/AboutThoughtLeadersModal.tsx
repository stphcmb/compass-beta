'use client'

import { useState, useEffect } from 'react'
import { X, Users, Quote, ExternalLink, Filter, ChevronRight, Star } from 'lucide-react'

const STORAGE_KEY = 'aboutThoughtLeadersSeenCount'
const MAX_AUTO_SHOWS = 2

interface AboutThoughtLeadersModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutThoughtLeadersModal({ isOpen, onClose }: AboutThoughtLeadersModalProps) {
  if (!isOpen) return null

  const steps = [
    { icon: Filter, title: 'Filter by domain', color: '#2563eb' },
    { icon: Users, title: 'Click to view full profile', color: '#059669' },
    { icon: Quote, title: 'See positions & quotes', color: '#7c3aed' },
    { icon: ExternalLink, title: 'Access primary sources', color: '#d97706' },
    { icon: Star, title: 'Save to favorites', color: '#f59e0b' }
  ]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '8px',
            background: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#64748b',
            zIndex: 10,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{
          padding: '24px 24px 16px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(to right, #f0fdf4, #ecfdf5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={20} style={{ color: '#059669' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              How Authors Works
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            Explore 200+ thought leaders shaping AI discourse.
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {steps.map((step, idx) => {
              const Icon = step.icon
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: `${step.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} style={{ color: step.color }} />
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#111827',
                  }}>
                    {step.title}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#047857'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#059669'
            }}
          >
            Got it!
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook to manage the modal state with auto-show logic
export function useAboutThoughtLeadersModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const seenCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)

    if (seenCount < MAX_AUTO_SHOWS) {
      setIsOpen(true)
      localStorage.setItem(STORAGE_KEY, String(seenCount + 1))
    }

    setHasChecked(true)
  }, [])

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return { isOpen, open, close, hasChecked }
}

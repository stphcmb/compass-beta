'use client'

import { useState, useEffect } from 'react'
import { X, Search, Compass, Users, Quote, Layers, ChevronRight } from 'lucide-react'

const STORAGE_KEY = 'howPerspectivesWorkSeenCount'
const MAX_AUTO_SHOWS = 2

interface HowPerspectivesWorkModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HowPerspectivesWorkModal({ isOpen, onClose }: HowPerspectivesWorkModalProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'browse'>('search')

  if (!isOpen) return null

  const searchSteps = [
    { icon: Search, title: 'Enter a topic or question', color: '#6366f1' },
    { icon: Layers, title: 'See expanded queries', color: '#8b5cf6' },
    { icon: Compass, title: 'Find matching perspectives', color: '#2563eb' },
    { icon: Users, title: 'Explore aligned authors', color: '#059669' }
  ]

  const browseSteps = [
    { icon: Layers, title: 'Pick a domain (e.g. AI Safety)', color: '#6366f1' },
    { icon: Compass, title: 'Choose a perspective', color: '#8b5cf6' },
    { icon: Users, title: 'See who advocates for it', color: '#059669' },
    { icon: Quote, title: 'Read quotes & sources', color: '#d97706' }
  ]

  const steps = activeTab === 'search' ? searchSteps : browseSteps

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
          background: 'linear-gradient(to right, #eff6ff, #eef2ff)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Compass size={20} style={{ color: 'var(--color-accent)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              How Explore Works
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            Discover perspectives across 200+ thought leaders.
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{ padding: '16px 24px 0', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('search')}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: activeTab === 'search' ? '#6366f1' : '#f3f4f6',
              color: activeTab === 'search' ? 'white' : '#4b5563',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Search size={14} />
            Search Mode
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: activeTab === 'browse' ? '#6366f1' : '#f3f4f6',
              color: activeTab === 'browse' ? 'white' : '#4b5563',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Compass size={14} />
            Browse Mode
          </button>
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
              backgroundColor: 'var(--color-accent)',
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
              e.currentTarget.style.backgroundColor = '#4f46e5'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)'
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
export function useHowPerspectivesWorkModal() {
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

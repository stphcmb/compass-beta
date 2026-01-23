'use client'

import { useState, useEffect } from 'react'
import { X, Search, FileText, Lightbulb, Users, ChevronRight } from 'lucide-react'

const STORAGE_KEY = 'howResearchAssistantWorksSeenCount'
const MAX_AUTO_SHOWS = 2

interface HowResearchAssistantWorksModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HowResearchAssistantWorksModal({ isOpen, onClose }: HowResearchAssistantWorksModalProps) {
  if (!isOpen) return null

  const steps = [
    {
      icon: FileText,
      title: 'Paste your draft',
      color: '#6366f1'
    },
    {
      icon: Search,
      title: 'Find matching perspectives',
      color: '#8b5cf6'
    },
    {
      icon: Lightbulb,
      title: 'See gaps and suggestions',
      color: '#f59e0b'
    },
    {
      icon: Users,
      title: 'Discover supporting experts',
      color: '#10b981'
    }
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
          background: 'linear-gradient(to right, #eef2ff, #faf5ff)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Search size={20} style={{ color: '#6366f1' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              How Research Assistant Works
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            Find supporting experts and perspectives from 200+ thought leaders.
          </p>
        </div>

        {/* Steps */}
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
              backgroundColor: '#6366f1',
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
              e.currentTarget.style.backgroundColor = '#6366f1'
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
export function useHowResearchAssistantWorksModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const seenCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)

    if (seenCount < MAX_AUTO_SHOWS) {
      setIsOpen(true)
      localStorage.setItem(STORAGE_KEY, String(seenCount + 1))
    }
  }, [])

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return { isOpen, open, close }
}

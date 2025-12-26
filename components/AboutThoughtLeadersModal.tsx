'use client'

import { useState, useEffect } from 'react'
import { X, Users, Quote, BookOpen, Filter, ChevronRight } from 'lucide-react'

const STORAGE_KEY = 'aboutThoughtLeadersSeenCount'
const MAX_AUTO_SHOWS = 2

interface AboutThoughtLeadersModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutThoughtLeadersModal({ isOpen, onClose }: AboutThoughtLeadersModalProps) {
  if (!isOpen) return null

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
          maxWidth: '520px',
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
              Meet the Thought Leaders
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            Explore the experts shaping the AI discourse, their positions, and the evidence behind their views.
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>
          {/* Feature 1 */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Filter size={18} style={{ color: '#2563eb' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                Browse by Domain
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                Filter experts by their primary focus area using the color-coded domain buttons. Each domain represents a key area of AI discourse.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#f3e8ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Quote size={18} style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                Positions & Quotes
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                Click any author to see their full profile: the perspectives they advocate for, direct quotes, and links to their original sources.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <BookOpen size={18} style={{ color: '#d97706' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                Primary Sources
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                Each profile includes links to books, articles, interviews, and other works so you can explore their thinking in depth.
              </p>
            </div>
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
            Start Exploring
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

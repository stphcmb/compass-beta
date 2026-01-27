'use client'

import Link from 'next/link'
import { ArrowLeft, Lightbulb, Sparkles } from 'lucide-react'
import Header from '@/components/Header'

export default function ContentHelperPage() {
  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Header sidebarCollapsed={true} />
      <main className="flex-1 mt-16 overflow-y-auto flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-6 text-center">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: '#64748b' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0033FF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Icon */}
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'linear-gradient(135deg, #0033FF 0%, #0028CC 100%)',
              boxShadow: '0 8px 32px rgba(0, 51, 255, 0.3)'
            }}
          >
            <Lightbulb size={48} className="text-white" />
          </div>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-4"
            style={{
              padding: '6px 16px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(109, 40, 217, 0.15) 100%)',
              borderRadius: '100px',
              border: '1px solid rgba(124, 58, 237, 0.3)',
            }}
          >
            <Sparkles size={14} style={{ color: '#7c3aed' }} />
            <span style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#6d28d9',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Now Available
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: '40px',
            fontWeight: '700',
            color: '#0f172a',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            marginBottom: '16px'
          }}>
            Meet Content Studio
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '18px',
            color: '#64748b',
            lineHeight: '1.6',
            marginBottom: '32px',
            maxWidth: '500px',
            margin: '0 auto 32px'
          }}>
            This feature has evolved into <strong>Content Studio</strong> — a unified workflow for creating voice-consistent content from briefs. Studio is now available as a standalone app.
          </p>

          {/* CTA */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.5)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(124, 58, 237, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(124, 58, 237, 0.5)'
            }}
          >
            Back to Home
          </Link>

          {/* Features you can use now */}
          <div style={{ marginTop: '64px' }}>
            <p style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px'
            }}>
              Other Features
            </p>
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                href="/ai-editor"
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#7c3aed'
                  e.currentTarget.style.color = '#7c3aed'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.color = '#0f172a'
                }}
              >
                AI Editor
              </Link>
              <Link
                href="/explore"
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0033FF'
                  e.currentTarget.style.color = '#0033FF'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.color = '#0f172a'
                }}
              >
                Explore Perspectives
              </Link>
              <Link
                href="/authors"
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0033FF'
                  e.currentTarget.style.color = '#0033FF'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.color = '#0f172a'
                }}
              >
                Browse Authors
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

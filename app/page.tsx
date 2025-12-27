'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { Users, Compass, Lightbulb, Edit3, Search, Sparkles, Loader2 } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle analyze - redirect to AI Editor with text
  const handleAnalyze = () => {
    if (!text.trim() || text.length > 4000) return
    setIsSubmitting(true)

    // Store in sessionStorage so AI Editor can pick it up immediately on mount
    sessionStorage.setItem('pendingAnalysis', JSON.stringify({
      text: text.trim(),
      autoAnalyze: true,
      timestamp: Date.now()
    }))

    // Navigate to AI Editor
    router.push('/ai-editor')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleAnalyze()
    }
  }

  const canAnalyze = text.trim().length > 0 && text.length <= 4000 && !isSubmitting

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Header sidebarCollapsed={true} />
      <main
        className="flex-1 mt-16 flex flex-col items-center justify-start overflow-y-auto"
      >
        {/* Hero Section */}
        <div className="w-full relative" style={{
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        }}>
          {/* Gradient orbs - contained */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
              style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-25"
              style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
            />
            <div
              className="absolute top-1/2 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
            />
          </div>

          <div className="max-w-3xl mx-auto text-center relative z-10" style={{ padding: '48px 24px 48px' }}>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mb-4"
              style={{
                padding: 'var(--space-2) var(--space-4)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles size={14} style={{ color: '#a78bfa' }} />
              <span style={{
                fontSize: 'var(--text-caption)',
                fontWeight: 'var(--weight-semibold)',
                color: '#c4b5fd',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                AI-Powered Editorial Analysis
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className="animate-fade-in"
              style={{
                marginBottom: '16px',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: 'var(--tracking-tight)',
                lineHeight: '1.1',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Know what perspectives
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>you're missing</span>
            </h1>

            {/* Subheadline */}
            <p
              className="animate-fade-in-delay mx-auto"
              style={{
                fontSize: '18px',
                color: '#94a3b8',
                lineHeight: '1.5',
                fontWeight: '400',
                maxWidth: '500px',
                marginBottom: '32px'
              }}
            >
              Analyze your writing against 200+ thought leaders shaping AI discourse.
            </p>

            {/* Simple Input Box */}
            <div
              style={{
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                overflow: 'hidden',
                textAlign: 'left'
              }}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste your draft, thesis, or argument here..."
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  height: '140px',
                  padding: '20px',
                  border: 'none',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#1e293b',
                  backgroundColor: 'transparent',
                  resize: 'none',
                  outline: 'none',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: text.length > 4000 ? '#ef4444' : '#64748b' }}>
                    {text.length > 0 ? `${text.length.toLocaleString()} chars` : 'Up to 4,000 chars'}
                  </span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    <kbd style={{
                      padding: '2px 6px',
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}>⌘↵</kbd>
                  </span>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: !canAnalyze
                      ? '#e2e8f0'
                      : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: !canAnalyze ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: !canAnalyze ? 'none' : '0 4px 15px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 style={{ width: '18px', height: '18px' }} className="animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      <Sparkles style={{ width: '18px', height: '18px' }} />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="w-full relative" style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }}>
          <div className="max-w-4xl mx-auto" style={{ padding: '48px 24px' }}>
            {/* Section Header */}
            <div className="text-center mb-8">
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#8b5cf6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                  display: 'block'
                }}
              >
                Simple Process
              </span>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '8px'
              }}>
                How it works
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#64748b'
              }}>
                Three steps to stronger, more informed writing
              </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <HowItWorksStep
                number="1"
                icon={Edit3}
                title="Paste your draft"
                description="Any paragraph, thesis, or argument you're working on"
              />
              <HowItWorksStep
                number="2"
                icon={Search}
                title="Match perspectives"
                description="We compare against 200+ curated thought leaders"
              />
              <HowItWorksStep
                number="3"
                icon={Sparkles}
                title="See the gaps"
                description="Discover what you're using and what you're missing"
              />
            </div>
          </div>
        </div>

        {/* Explore Section */}
        <div className="w-full relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}>
          {/* Gradient accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)' }}
          />

          <div className="max-w-4xl mx-auto text-center relative z-10" style={{ padding: '40px 24px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#a78bfa',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '8px',
                display: 'block'
              }}
            >
              Explore More
            </span>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '24px'
            }}>
              Or browse on your own
            </h2>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <ExploreButton
                href="/explore"
                icon={Compass}
                label="Browse Perspectives"
                description="13 camps across 5 domains"
              />
              <ExploreButton
                href="/authors"
                icon={Users}
                label="Meet the Authors"
                description="200+ thought leaders"
              />
              <ExploreButton
                href="/content-helper"
                icon={Lightbulb}
                label="Find Content Gaps"
                description="Untapped angles"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Sub-components

function HowItWorksStep({
  number,
  icon: Icon,
  title,
  description
}: {
  number: string
  icon: React.ComponentType<{ size?: number | string; className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center group">
      {/* Step number with gradient */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
        }}
      >
        <span className="text-white font-bold" style={{ fontSize: '18px' }}>
          {number}
        </span>
      </div>
      {/* Icon with gradient background */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}
      >
        <Icon size={26} className="text-violet-500" />
      </div>
      <h3
        className="font-semibold mb-2"
        style={{ fontSize: '17px', color: '#0f172a' }}
      >
        {title}
      </h3>
      <p
        className="max-w-[220px]"
        style={{ fontSize: '14px', lineHeight: '1.6', color: '#64748b' }}
      >
        {description}
      </p>
    </div>
  )
}

function ExploreButton({
  href,
  icon: Icon,
  label,
  description
}: {
  href: string
  icon: React.ComponentType<{ size?: number | string; className?: string }>
  label: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 px-5 py-4 transition-all"
      style={{
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
        }}
      >
        <Icon size={22} className="text-violet-300" />
      </div>
      <div className="text-left">
        <div
          className="font-semibold transition-colors"
          style={{ fontSize: '15px', color: '#ffffff' }}
        >
          {label}
        </div>
        <div style={{ fontSize: '13px', color: '#94a3b8' }}>
          {description}
        </div>
      </div>
    </Link>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { Users, Compass, Lightbulb, Edit3, Search, Sparkles, Loader2, Zap, Target, TrendingUp, Shield } from 'lucide-react'

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
          background: 'linear-gradient(135deg, #0a0f1a 0%, #111826 50%, #0f1729 100%)',
        }}>
          {/* Gradient orbs - contained */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-25"
              style={{ background: 'radial-gradient(circle, #0033FF 0%, transparent 70%)' }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
              style={{ background: 'radial-gradient(circle, #0028CC 0%, transparent 70%)' }}
            />
            <div
              className="absolute top-1/2 right-0 w-64 h-64 rounded-full blur-3xl opacity-15"
              style={{ background: 'radial-gradient(circle, #3D5FFF 0%, transparent 70%)' }}
            />
          </div>

          <div className="max-w-3xl mx-auto text-center relative z-10" style={{ padding: '24px 24px 28px' }}>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mb-3"
              style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, rgba(0, 51, 255, 0.15) 0%, rgba(0, 40, 204, 0.15) 100%)',
                borderRadius: '100px',
                border: '1px solid rgba(0, 51, 255, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles size={14} style={{ color: '#3D5FFF' }} />
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#E6EBFF',
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
                marginBottom: '10px',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                lineHeight: '1.1',
                background: 'linear-gradient(135deg, #ffffff 0%, #E6EBFF 50%, #d1d9ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Know what perspectives
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 50%, #93a7fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>you're missing</span>
            </h1>

            {/* Subheadline */}
            <p
              className="animate-fade-in-delay mx-auto"
              style={{
                fontSize: '15px',
                color: '#94a3b8',
                lineHeight: '1.5',
                fontWeight: '400',
                maxWidth: '480px',
                marginBottom: '20px'
              }}
            >
              Match your writing against 200+ AI thought leaders
            </p>

            {/* Simple Input Box */}
            <div
              style={{
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                border: '2px solid rgba(0, 51, 255, 0.3)',
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
                  height: '80px',
                  padding: '14px',
                  border: 'none',
                  fontSize: '15px',
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
                      : 'linear-gradient(135deg, #0033FF 0%, #0028CC 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: !canAnalyze ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: !canAnalyze ? 'none' : '0 4px 20px rgba(0, 51, 255, 0.5)',
                  }}
                  onMouseEnter={(e) => {
                    if (canAnalyze) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 51, 255, 0.6)'
                      e.currentTarget.style.background = 'linear-gradient(135deg, #3D5FFF 0%, #0033FF 100%)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (canAnalyze) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 51, 255, 0.5)'
                      e.currentTarget.style.background = 'linear-gradient(135deg, #0033FF 0%, #0028CC 100%)'
                    }
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
          <div className="max-w-4xl mx-auto" style={{ padding: '24px 24px 28px' }}>
            {/* Section Header */}
            <div className="text-center mb-6">
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#0033FF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '6px',
                  display: 'block'
                }}
              >
                Simple Process
              </span>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#0f172a',
                letterSpacing: '-0.02em',
                marginBottom: '4px'
              }}>
                How it works
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                lineHeight: '1.5'
              }}>
                Three steps to stronger, more informed writing
              </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Key Benefits Section - Compact */}
        <div className="w-full relative" style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          padding: '24px 24px 32px'
        }}>
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-6">
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#0033FF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '6px',
                  display: 'block'
                }}
              >
                Why Compass
              </span>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#0f172a',
                letterSpacing: '-0.02em',
                marginBottom: '4px'
              }}>
                Write with confidence
              </h2>
            </div>

            {/* Compact Benefits - Bullet Points */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px 24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, rgba(0, 51, 255, 0.1) 0%, rgba(0, 40, 204, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#0033FF',
                    marginTop: '2px'
                  }}>
                    <Zap size={14} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>Save hours</strong>
                    <span style={{ fontSize: '14px', color: '#64748b' }}> — AI-powered perspective matching</span>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, rgba(0, 51, 255, 0.1) 0%, rgba(0, 40, 204, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#0033FF',
                    marginTop: '2px'
                  }}>
                    <Shield size={14} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>Avoid blind spots</strong>
                    <span style={{ fontSize: '14px', color: '#64748b' }}> — Never miss counterarguments</span>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, rgba(0, 51, 255, 0.1) 0%, rgba(0, 40, 204, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#0033FF',
                    marginTop: '2px'
                  }}>
                    <Target size={14} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>Find unique angles</strong>
                    <span style={{ fontSize: '14px', color: '#64748b' }}> — Discover fresh perspectives</span>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, rgba(0, 51, 255, 0.1) 0%, rgba(0, 40, 204, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#0033FF',
                    marginTop: '2px'
                  }}>
                    <TrendingUp size={14} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>Strengthen arguments</strong>
                    <span style={{ fontSize: '14px', color: '#64748b' }}> — Build credible positions</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Grid - Visual First */}
        <div className="w-full relative" style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          padding: '28px 24px 36px'
        }}>
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-6">
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#0033FF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '6px',
                  display: 'block'
                }}
              >
                Features
              </span>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#0f172a',
                letterSpacing: '-0.02em',
                marginBottom: '4px'
              }}>
                Everything you need to navigate AI discourse
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                lineHeight: '1.5',
                maxWidth: '540px',
                margin: '0 auto'
              }}>
                From analyzing your writing to tracking emerging perspectives
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <FeatureCard
                icon={Compass}
                title="Explore Perspectives"
                description="See where thought leaders stand on any AI topic"
                href="/explore"
              />
              <FeatureCard
                icon={Users}
                title="200+ Thought Leaders"
                description="Curated voices across academia, industry, policy"
                href="/authors"
              />
              <FeatureCard
                icon={Lightbulb}
                title="Content Opportunities"
                description="Find underexplored angles for original pieces"
                href="/content-helper"
                badge="Coming Soon"
              />
              <FeatureCard
                icon={Search}
                title="Research History"
                description="Never lose track of your past explorations"
                href="/history"
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
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="flex flex-col items-center text-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Step number with gradient */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, #3D5FFF 0%, #0033FF 100%)'
            : 'linear-gradient(135deg, #0033FF 0%, #0028CC 100%)',
          boxShadow: isHovered
            ? '0 6px 20px rgba(0, 51, 255, 0.5)'
            : '0 3px 12px rgba(0, 51, 255, 0.4)',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}
      >
        <span className="text-white font-bold" style={{ fontSize: '16px' }}>
          {number}
        </span>
      </div>
      {/* Icon with gradient background */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, rgba(0, 51, 255, 0.15) 0%, rgba(0, 40, 204, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(0, 51, 255, 0.1) 0%, rgba(0, 40, 204, 0.1) 100%)',
          border: `1px solid ${isHovered ? 'rgba(0, 51, 255, 0.3)' : 'rgba(0, 51, 255, 0.2)'}`,
          transition: 'all 0.3s ease',
          color: isHovered ? '#0033FF' : '#3D5FFF'
        }}
      >
        <Icon size={22} />
      </div>
      <h3
        className="font-semibold mb-1"
        style={{ fontSize: '15px', color: '#0f172a' }}
      >
        {title}
      </h3>
      <p
        className="max-w-[220px]"
        style={{ fontSize: '13px', lineHeight: '1.5', color: '#64748b' }}
      >
        {description}
      </p>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  badge
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string }>
  title: string
  description: string
  href: string
  badge?: string
}) {
  return (
    <Link
      href={href}
      className="group block p-6 rounded-xl transition-all duration-300"
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#0033FF'
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 51, 255, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Badge */}
      {badge && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
          }}
        >
          {badge}
        </div>
      )}

      {/* Icon with gradient background */}
      <div className="mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, #0033FF 0%, #0028CC 100%)',
          }}
        >
          <Icon size={22} className="text-white" />
        </div>
      </div>

      {/* Title */}
      <h3
        className="font-semibold mb-1 transition-colors"
        style={{
          fontSize: '16px',
          color: '#0f172a',
          lineHeight: '1.3'
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '13px',
          color: '#64748b',
          lineHeight: '1.5',
          marginBottom: '12px'
        }}
      >
        {description}
      </p>

      {/* Arrow indicator */}
      <div
        className="inline-flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ fontSize: '13px', fontWeight: '500', color: '#0033FF' }}
      >
        Explore
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  )
}

function CompactBenefit({
  icon: Icon,
  title,
  description
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string }>
  title: string
  description: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px',
        borderRadius: '8px',
        background: 'white',
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#0033FF'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 51, 255, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, rgba(0, 51, 255, 0.1) 0%, rgba(0, 40, 204, 0.1) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: '#0033FF'
      }}>
        <Icon size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#0f172a',
          marginBottom: '2px',
          lineHeight: '1.3'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#64748b',
          lineHeight: '1.4'
        }}>
          {description}
        </p>
      </div>
    </div>
  )
}

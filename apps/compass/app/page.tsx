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

  // Handle analyze - redirect to Research Assistant with text
  const handleAnalyze = () => {
    if (!text.trim() || text.length > 4000) return
    setIsSubmitting(true)

    // Store in sessionStorage so Research Assistant can pick it up immediately on mount
    sessionStorage.setItem('pendingAnalysis', JSON.stringify({
      text: text.trim(),
      autoAnalyze: true,
      timestamp: Date.now()
    }))

    // Navigate to Research Assistant
    router.push('/research-assistant')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleAnalyze()
    }
  }

  const canAnalyze = text.trim().length > 0 && text.length <= 4000 && !isSubmitting

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Header sidebarCollapsed={true} />
      <main
        id="main-content"
        className="flex-1 mt-16 flex flex-col items-center"
      >
        {/* Hero Section */}
        <section aria-labelledby="hero-heading" className="w-full relative" style={{
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

          <div className="max-w-6xl mx-auto text-center relative z-10" style={{ padding: '64px 24px 72px' }}>
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
              id="hero-heading"
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
              <label htmlFor="analysis-input" className="sr-only">
                Enter your draft, thesis, or argument for AI analysis
              </label>
              <textarea
                id="analysis-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste your draft, thesis, or argument here..."
                disabled={isSubmitting}
                aria-describedby="char-count"
                aria-invalid={text.length > 4000}
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
                  <span id="char-count" style={{ fontSize: '12px', color: text.length > 4000 ? '#ef4444' : '#475569' }}>
                    {text.length > 0 ? `${text.length.toLocaleString()} chars` : 'Up to 4,000 chars'}
                  </span>
                  <span style={{ color: '#cbd5e1' }} aria-hidden="true">•</span>
                  <span style={{ fontSize: '12px', color: '#475569' }}>
                    <kbd style={{
                      padding: '2px 6px',
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}>⌘↵</kbd> to submit
                  </span>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  aria-disabled={!canAnalyze}
                  aria-label={
                    !text.trim()
                      ? "Enter text to begin analysis"
                      : text.length > 4000
                        ? "Text exceeds 4,000 character limit"
                        : `Analyze ${text.length} characters of text`
                  }
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
                  onFocus={(e) => {
                    if (canAnalyze && e.currentTarget.matches(':focus-visible')) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 51, 255, 0.6)'
                      e.currentTarget.style.background = 'linear-gradient(135deg, #3D5FFF 0%, #0033FF 100%)'
                    }
                  }}
                  onBlur={(e) => {
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
        </section>

        {/* How It Works Section */}
        <section aria-labelledby="how-works-heading" className="w-full relative" style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }}>
          <div className="max-w-6xl mx-auto" style={{ padding: '56px 24px 64px' }}>
            {/* Section Header */}
            <div className="text-center mb-4">
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
              <h2 id="how-works-heading" style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                fontWeight: '700',
                color: '#0f172a',
                letterSpacing: '-0.02em',
                marginBottom: '8px'
              }}>
                How it works
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#475569',
                lineHeight: '1.5'
              }}>
                Three steps to stronger, more informed writing
              </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <HowItWorksStep
                number="1"
                icon={Edit3}
                title="Paste your draft"
                description="Any paragraph, thesis, or argument you're working on"
                accentColor="#0033FF"
                accentColorLight="#3D5FFF"
              />
              <HowItWorksStep
                number="2"
                icon={Search}
                title="Match perspectives"
                description="We compare against 200+ curated thought leaders"
                accentColor="#1e40af"
                accentColorLight="#3b82f6"
              />
              <HowItWorksStep
                number="3"
                icon={Sparkles}
                title="See the gaps"
                description="Discover what you're using and what you're missing"
                accentColor="#4f46e5"
                accentColorLight="#6366f1"
              />
            </div>
          </div>
        </section>

        {/* Why Compass / Key Benefits Section - HIDDEN FOR NOW, can enable later */}
        {/*
        <div className="w-full relative" style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30"
              style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ background: 'radial-gradient(circle, #0033FF 0%, transparent 70%)' }}
            />
          </div>

          <div className="max-w-6xl mx-auto relative z-10" style={{ padding: '16px 24px 20px' }}>
            <div className="text-center mb-4">
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #0033FF 0%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                  display: 'block'
                }}
              >
                Why Compass
              </span>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0f172a',
                letterSpacing: '-0.02em',
                marginBottom: '0'
              }}>
                Write with confidence
              </h2>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 255, 0.85) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '12px 16px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 12px 24px -8px rgba(0, 51, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
            }}>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}>
                <BenefitItem
                  icon={Zap}
                  title="Save hours"
                  description="AI-powered perspective matching"
                  gradientFrom="#0033FF"
                  gradientTo="#3D5FFF"
                />
                <BenefitItem
                  icon={Shield}
                  title="Avoid blind spots"
                  description="Never miss counterarguments"
                  gradientFrom="#1e40af"
                  gradientTo="#3b82f6"
                />
                <BenefitItem
                  icon={Target}
                  title="Find unique angles"
                  description="Discover fresh perspectives"
                  gradientFrom="#4f46e5"
                  gradientTo="#6366f1"
                />
                <BenefitItem
                  icon={TrendingUp}
                  title="Strengthen arguments"
                  description="Build credible positions"
                  gradientFrom="#2563eb"
                  gradientTo="#60a5fa"
                />
              </ul>
            </div>
          </div>
        </div>
        */}

        {/* Features Grid - Visual First */}
        <section aria-labelledby="features-heading" className="w-full relative overflow-hidden" style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
          padding: '56px 24px 80px'
        }}>
          {/* Decorative gradient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
              style={{ background: 'radial-gradient(circle, #0033FF 0%, transparent 70%)' }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
              style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
            />
            <div
              className="absolute top-1/2 right-0 w-64 h-64 rounded-full blur-3xl opacity-10"
              style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
            />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center mb-5">
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #0033FF 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                  display: 'block'
                }}
              >
                Features
              </span>
              <h2 id="features-heading" style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                fontWeight: '700',
                color: '#0f172a',
                letterSpacing: '-0.02em',
                marginBottom: '8px'
              }}>
                Everything you need to navigate AI discourse
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#475569',
                lineHeight: '1.5',
                maxWidth: '540px',
                margin: '0 auto'
              }}>
                From analyzing your writing to tracking emerging perspectives
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FeatureCard
                icon={Compass}
                title="Browse Topics"
                description="See where thought leaders stand on any AI topic"
                href="/browse"
                gradientFrom="#0033FF"
                gradientTo="#3D5FFF"
              />
              <FeatureCard
                icon={Users}
                title="200+ Thought Leaders"
                description="Curated voices across academia, industry, policy"
                href="/authors"
                gradientFrom="#1e40af"
                gradientTo="#3b82f6"
              />
              <FeatureCard
                icon={Lightbulb}
                title="Content Opportunities"
                description="Find underexplored angles for original pieces"
                href="/content-helper"
                badge="Coming Soon"
                gradientFrom="#4f46e5"
                gradientTo="#6366f1"
              />
              <FeatureCard
                icon={Search}
                title="My Library"
                description="Never lose track of your past explorations"
                href="/my-library"
                gradientFrom="#2563eb"
                gradientTo="#60a5fa"
              />
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}

// Sub-components

function HowItWorksStep({
  number,
  icon: Icon,
  title,
  description,
  accentColor = '#0033FF',
  accentColorLight = '#3D5FFF'
}: {
  number: string
  icon: React.ComponentType<{ size?: number | string; className?: string; style?: React.CSSProperties }>
  title: string
  description: string
  accentColor?: string
  accentColorLight?: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="flex flex-col items-center text-center group relative"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      style={{
        padding: '24px 20px',
        borderRadius: '20px',
        background: isHovered
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 255, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 255, 0.7) 100%)',
        backdropFilter: 'blur(20px)',
        border: isHovered
          ? '1px solid rgba(0, 51, 255, 0.25)'
          : '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: isHovered
          ? '0 20px 40px -12px rgba(0, 51, 255, 0.2), 0 0 0 1px rgba(0, 51, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          : '0 8px 24px -8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none'
      }}
    >
      {/* Decorative gradient glow behind card */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '120px',
          height: '120px',
          background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Step number with gradient */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center mb-4 relative z-10"
        style={{
          background: `linear-gradient(135deg, ${accentColorLight} 0%, ${accentColor} 100%)`,
          boxShadow: isHovered
            ? `0 8px 24px ${accentColor}60, 0 0 0 4px ${accentColor}15`
            : `0 4px 16px ${accentColor}40`,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}
      >
        <span className="text-white font-bold" style={{ fontSize: '17px' }}>
          {number}
        </span>
      </div>

      <h3
        className="font-semibold mb-1 relative z-10"
        style={{ fontSize: '16px', color: '#0f172a' }}
      >
        {title}
      </h3>
      <p
        className="max-w-[220px] relative z-10"
        style={{ fontSize: '13px', lineHeight: '1.6', color: '#64748b' }}
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
  badge,
  gradientFrom = '#0033FF',
  gradientTo = '#6366f1'
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string; style?: React.CSSProperties }>
  title: string
  description: string
  href: string
  badge?: string
  gradientFrom?: string
  gradientTo?: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      className="group block relative overflow-hidden"
      style={{
        padding: '24px',
        borderRadius: '20px',
        background: isHovered
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 255, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 255, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        border: isHovered
          ? `1px solid ${gradientFrom}40`
          : '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: isHovered
          ? `0 24px 48px -12px ${gradientFrom}25, 0 0 0 1px ${gradientFrom}10, inset 0 1px 0 rgba(255, 255, 255, 0.9)`
          : '0 8px 24px -8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative gradient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle, ${gradientFrom}10 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none'
        }}
      />

      {/* Badge */}
      {badge && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '5px 12px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            color: 'white',
            fontSize: '10px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
          }}
        >
          {badge}
        </div>
      )}

      {/* Icon with gradient background and glow */}
      <div className="mb-5 relative z-10">
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isHovered
              ? `0 12px 28px -6px ${gradientFrom}60, 0 0 0 4px ${gradientFrom}10`
              : `0 6px 16px -4px ${gradientFrom}40`,
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          <Icon size={24} style={{ color: 'white' }} />
        </div>
      </div>

      {/* Title */}
      <h3
        className="font-semibold mb-2 relative z-10"
        style={{
          fontSize: '17px',
          color: '#0f172a',
          lineHeight: '1.3'
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="relative z-10"
        style={{
          fontSize: '13px',
          color: '#64748b',
          lineHeight: '1.6',
          marginBottom: '14px'
        }}
      >
        {description}
      </p>

      {/* Arrow indicator */}
      <div
        className="relative z-10"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: '600',
          color: gradientFrom,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
          transition: 'all 0.3s ease'
        }}
      >
        Explore
        <span style={{
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
        }}>→</span>
      </div>
    </Link>
  )
}

function BenefitItem({
  icon: Icon,
  title,
  description,
  gradientFrom,
  gradientTo
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string; style?: React.CSSProperties }>
  title: string
  description: string
  gradientFrom: string
  gradientTo: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 10px',
        borderRadius: '10px',
        background: isHovered
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 255, 0.8) 100%)'
          : 'transparent',
        border: isHovered ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid transparent',
        boxShadow: isHovered ? '0 4px 12px -4px rgba(0, 51, 255, 0.12)' : 'none',
        transition: 'all 0.2s ease',
        cursor: 'default'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '8px',
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 2px 8px -2px ${gradientFrom}50`,
        transition: 'all 0.2s ease'
      }}>
        <Icon size={14} style={{ color: 'white' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>{title}</strong>
        <span style={{ fontSize: '13px', color: '#64748b' }}> — {description}</span>
      </div>
    </li>
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

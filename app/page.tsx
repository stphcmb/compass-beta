'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Header from '@/components/Header'
import { MiniAIEditor } from '@/components/MiniAIEditor'
import { BookOpen, Users, ArrowRight, FileText, Compass, Lightbulb, Edit3, Search, Sparkles } from 'lucide-react'
import { TERMINOLOGY } from '@/lib/constants/terminology'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (e: Event) => {
      const ev = e as CustomEvent<{ isCollapsed: boolean }>
      setSidebarCollapsed(ev.detail.isCollapsed)
    }

    // Check initial state
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState === 'true') {
      setSidebarCollapsed(true)
    }

    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
    return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
  }, [])

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Sidebar />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <main
        className="flex-1 mt-16 flex flex-col items-center justify-start overflow-y-auto transition-all duration-300"
        style={{
          padding: 'var(--space-10)',
          marginLeft: sidebarCollapsed ? '0' : '256px'
        }}
      >
        {/* Hero Section - AI Editor First */}
        <div className="max-w-2xl w-full text-center relative" style={{ marginBottom: 'var(--section-spacing-large)' }}>
          {/* Subtle decorative accent */}
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-60"
          />

          <h1
            className="animate-fade-in"
            style={{
              marginBottom: 'var(--space-4)',
              background: 'linear-gradient(135deg, var(--color-soft-black) 0%, var(--color-charcoal) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Write with the full picture
          </h1>
          <p
            className="animate-fade-in-delay"
            style={{
              fontSize: 'var(--text-h3)',
              color: 'var(--color-charcoal)',
              marginBottom: 'var(--space-8)',
              lineHeight: 'var(--leading-relaxed)',
              fontWeight: 'var(--weight-normal)'
            }}
          >
            See how your writing connects to—or challenges—the authors shaping AI discourse.
          </p>

          {/* Mini AI Editor */}
          <MiniAIEditor className="mb-10" />

          {/* How It Works - Enhanced with icons and connecting line */}
          <div
            className="relative mt-12"
          >
            {/* Connecting line behind steps */}
            <div
              className="absolute top-6 left-[16.67%] right-[16.67%] h-px hidden md:block"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--color-light-gray) 15%, var(--color-light-gray) 85%, transparent)'
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              <HowItWorksStep
                number="1"
                icon={Edit3}
                title="Paste your draft"
                description="Share a paragraph or thesis you're working on"
              />
              <HowItWorksStep
                number="2"
                icon={Search}
                title="We match perspectives"
                description="Find relevant authors from 200+ thought leaders"
              />
              <HowItWorksStep
                number="3"
                icon={Sparkles}
                title="Get editorial insights"
                description="See where you align and what you might be missing"
              />
            </div>
          </div>
        </div>

        {/* Explore More Section */}
        <div className="w-full max-w-4xl" style={{ marginBottom: 'var(--section-spacing-large)' }}>
          {/* Section header with decorative line */}
          <div className="text-center relative" style={{ marginBottom: 'var(--space-10)' }}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-light-gray)]" />
              <span
                className="text-[var(--color-mid-gray)] uppercase tracking-widest"
                style={{ fontSize: 'var(--text-caption)' }}
              >
                Explore
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-light-gray)]" />
            </div>
            <h2 style={{
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-h2)',
              color: 'var(--color-soft-black)'
            }}>
              Explore Perspectives
            </h2>
            <p style={{
              fontSize: 'var(--text-body)',
              color: 'var(--color-mid-gray)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Discover perspectives and authors shaping AI discourse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Explore Perspectives Card */}
            <FeatureCard
              href="/explore"
              icon={Compass}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              title={TERMINOLOGY.searchFull}
              description="Browse the definitive collection of perspectives and positions on AI's future. See who agrees—and who challenges each stance."
              cta="Browse Perspectives"
            />

            {/* Authors Card */}
            <FeatureCard
              href="/authors"
              icon={Users}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
              title="Meet the Authors"
              description="From researchers to policymakers, technologists to ethicists—explore the thinkers defining AI's future."
              cta="Browse Authors"
            />
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="w-full max-w-4xl" style={{ marginBottom: 'var(--section-spacing)' }}>
          {/* Section header with decorative line */}
          <div className="text-center relative" style={{ marginBottom: 'var(--space-8)' }}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-light-gray)]" />
              <span
                className="text-[var(--color-mid-gray)] uppercase tracking-widest"
                style={{ fontSize: 'var(--text-caption)' }}
              >
                Ideas
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-light-gray)]" />
            </div>
            <h2 style={{
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-h2)',
              color: 'var(--color-soft-black)'
            }}>
              {TERMINOLOGY.whiteSpace}
            </h2>
            <p style={{
              fontSize: 'var(--text-body)',
              color: 'var(--color-mid-gray)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Content opportunities waiting to be explored
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OpportunityCard
              topic="AI and creative industries"
              angle="The economic impact on freelance creatives"
            />
            <OpportunityCard
              topic="Enterprise AI adoption"
              angle="Middle management's role in AI transformation"
            />
            <OpportunityCard
              topic="AI safety research"
              angle="Bridging academic research and industry practice"
            />
          </div>

          <div className="text-center mt-8">
            <Link
              href="/content-helper"
              className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:gap-3 transition-all duration-200 group"
              style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--weight-medium)' }}
            >
              Explore more angles
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
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
      {/* Icon container with subtle glow on hover */}
      <div className="relative mb-4">
        <div
          className="w-12 h-12 rounded-xl bg-white border border-[var(--color-light-gray)] flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-[var(--color-accent)] transition-all duration-200"
        >
          <Icon size={22} className="text-[var(--color-accent)]" />
        </div>
        {/* Step number badge */}
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-xs font-semibold shadow-sm"
        >
          {number}
        </span>
      </div>
      <h3
        className="font-semibold text-[var(--color-soft-black)] mb-1.5"
        style={{ fontSize: 'var(--text-body)' }}
      >
        {title}
      </h3>
      <p
        className="text-[var(--color-mid-gray)] max-w-[180px]"
        style={{ fontSize: 'var(--text-small)', lineHeight: '1.5' }}
      >
        {description}
      </p>
    </div>
  )
}

function FeatureCard({
  href,
  icon: Icon,
  iconColor,
  iconBg,
  title,
  description,
  cta
}: {
  href: string
  icon: React.ComponentType<{ size?: number | string; className?: string }>
  iconColor: string
  iconBg: string
  title: string
  description: string
  cta: string
}) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white border border-[var(--color-light-gray)] hover:border-[var(--color-accent)] transition-all group relative overflow-hidden"
      style={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 51, 255, 0.02) 0%, transparent 50%)'
        }}
      />

      <div className="relative">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}>
          <Icon size={24} className={iconColor} />
        </div>
        <h3
          className="font-semibold text-[var(--color-soft-black)] mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-200"
          style={{ fontSize: 'var(--text-h3)' }}
        >
          {title}
        </h3>
        <p
          className="text-[var(--color-charcoal)] mb-4"
          style={{ fontSize: 'var(--text-small)', lineHeight: 'var(--leading-relaxed)' }}
        >
          {description}
        </p>
        <span
          className="inline-flex items-center gap-1.5 text-[var(--color-accent)] group-hover:gap-2.5 transition-all duration-200"
          style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--weight-medium)' }}
        >
          {cta}
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </span>
      </div>
    </Link>
  )
}

function OpportunityCard({
  topic,
  angle
}: {
  topic: string
  angle: string
}) {
  return (
    <Link
      href={`/content-helper?topic=${encodeURIComponent(topic)}&angle=${encodeURIComponent(angle)}`}
      className="block p-4 bg-white border border-[var(--color-light-gray)] hover:border-purple-300 transition-all group relative overflow-hidden"
      style={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.06) 0%, rgba(99, 102, 241, 0.04) 100%)'
        }}
      />

      <div className="relative flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
          <Lightbulb size={16} className="text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-medium text-[var(--color-soft-black)] mb-0.5 group-hover:text-purple-700 transition-colors"
            style={{ fontSize: 'var(--text-small)' }}
          >
            {topic}
          </p>
          <p
            className="text-[var(--color-mid-gray)] line-clamp-2"
            style={{ fontSize: 'var(--text-caption)', lineHeight: '1.4' }}
          >
            {angle}
          </p>
        </div>
        <ArrowRight size={14} className="flex-shrink-0 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-0.5" />
      </div>
    </Link>
  )
}

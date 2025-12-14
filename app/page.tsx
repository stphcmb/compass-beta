'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import SuggestedTopics from '@/components/SuggestedTopics'
import DiscoverByDomain from '@/components/DiscoverByDomain'
import WhiteSpacePanel from '@/components/WhiteSpacePanel'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
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

  const handleTopicSelect = (topic: string) => {
    setSearchQuery(topic)
  }

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
        {/* Hero Section - Clear "Start Here" Anchor */}
        <div className="max-w-3xl w-full text-center" style={{ marginBottom: 'var(--section-spacing)' }}>
          <h1 style={{ marginBottom: 'var(--space-3)' }}>
            Navigate the AI Discourse
          </h1>
          <p style={{
            fontSize: 'var(--text-h3)',
            color: 'var(--color-charcoal)',
            marginBottom: 'var(--space-4)',
            lineHeight: 'var(--leading-relaxed)',
            fontWeight: 'var(--weight-normal)'
          }}>
            Explore thought leaders, schools of thinking, and get editorial feedback
          </p>

          {/* Value Props */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-10)',
            textAlign: 'left'
          }}>
            {/* AI Editor - First */}
            <Link
              href="/ai-editor"
              style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-cloud)',
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-light-gray)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-out)',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-light)'
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-cloud)'
                e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                fontSize: 'var(--text-small)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-soft-black)',
                marginBottom: 'var(--space-2)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)'
              }}>
                AI Editor
              </div>
              <p style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--color-mid-gray)',
                lineHeight: 'var(--leading-normal)',
                margin: 0
              }}>
                Get editorial feedback matched to relevant perspectives
              </p>
            </Link>

            {/* Authors - Second */}
            <Link
              href="/authors"
              style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-cloud)',
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-light-gray)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-out)',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-light)'
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-cloud)'
                e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                fontSize: 'var(--text-small)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-soft-black)',
                marginBottom: 'var(--space-2)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)'
              }}>
                Authors
              </div>
              <p style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--color-mid-gray)',
                lineHeight: 'var(--leading-normal)',
                margin: 0
              }}>
                Browse profiles of influential voices shaping the conversation
              </p>
            </Link>

            {/* Search - Third */}
            <div
              onClick={() => {
                // Scroll to search bar
                const searchBar = document.querySelector('input[type="text"]') as HTMLElement
                searchBar?.focus()
              }}
              style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-cloud)',
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-light-gray)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-out)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-light)'
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-cloud)'
                e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                fontSize: 'var(--text-small)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-soft-black)',
                marginBottom: 'var(--space-2)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)'
              }}>
                Search
              </div>
              <p style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--color-mid-gray)',
                lineHeight: 'var(--leading-normal)',
                margin: 0
              }}>
                Find camps and thought leaders by topic, position, or domain
              </p>
            </div>
          </div>

          <SearchBar initialQuery={searchQuery} onQueryChange={setSearchQuery} />
          <SuggestedTopics onTopicSelect={handleTopicSelect} />
        </div>

        {/* Discovery Section */}
        <div className="w-full max-w-6xl" style={{ marginTop: 'var(--section-spacing-large)' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--space-8)'
          }}>
            <h2 style={{
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-h2)',
              color: 'var(--color-soft-black)'
            }}>
              Discovery & Inspiration
            </h2>
            <p style={{
              fontSize: 'var(--text-body)',
              color: 'var(--color-mid-gray)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Explore curated collections and emerging perspectives
            </p>
          </div>
          <DiscoverByDomain />
          <WhiteSpacePanel />
        </div>
      </main>
    </div>
  )
}


'use client'

import { Suspense, useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import PositioningSnapshot from '@/components/PositioningSnapshot'
import CampAccordion from '@/components/CampAccordion'
import DiscourseMap from '@/components/DiscourseMap'
import BackToTop from '@/components/BackToTop'
import { ExpandedQueries } from '@/components/search-expansion'
import { FeatureHint } from '@/components/FeatureHint'
import ExamplePerspective from '@/components/ExamplePerspective'
import { TERMINOLOGY } from '@/lib/constants/terminology'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

function ExplorePageContent() {
  const searchParams = useSearchParams()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const query = searchParams.get('q') || ''
  const domain = searchParams.get('domain') || undefined
  const domains = searchParams.get('domains')?.split(',') || []
  const camp = searchParams.get('camp') || undefined
  const camps = searchParams.get('camps')?.split(',') || []
  const authors = searchParams.get('authors')?.split(',') || []

  const mainRef = useRef<HTMLElement>(null)
  const campsRef = useRef<HTMLDivElement>(null)
  const [expandedQueries, setExpandedQueries] = useState<any[] | null>(null)
  const [loadingQueries, setLoadingQueries] = useState(false)
  const [loadedCamps, setLoadedCamps] = useState<any[]>([])
  const [scrollToCampId, setScrollToCampId] = useState<string | null>(null)
  const [activeCampId, setActiveCampId] = useState<string | null>(null)
  const [showExample, setShowExample] = useState(true)

  // Handle camps loaded from CampAccordion
  const handleCampsLoaded = useCallback((camps: any[]) => {
    setLoadedCamps(camps)
  }, [])

  // Handle clicking on a perspective in the DiscourseMap
  const handleCampClick = useCallback((campId: string) => {
    setScrollToCampId(campId)
    setActiveCampId(campId)
    // Reset scroll target after a short delay
    setTimeout(() => setScrollToCampId(null), 100)
  }, [])

  // Handle scrolling to camps section from example
  const handleExploreClick = useCallback(() => {
    campsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (e: Event) => {
      const ev = e as CustomEvent<{ isCollapsed: boolean }>
      setSidebarCollapsed(ev.detail.isCollapsed)
    }

    // Check initial state - match Sidebar logic
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    const savedAnalyses = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
    const hasContent = savedSearches.length > 0 || savedAnalyses.length > 0
    const userPreference = localStorage.getItem('sidebarCollapsed')

    if (userPreference !== null) {
      setSidebarCollapsed(userPreference === 'true')
    } else {
      setSidebarCollapsed(!hasContent)
    }

    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
    return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
  }, [])

  // Fetch expanded queries when query changes
  useEffect(() => {
    const fetchExpandedQueries = async () => {
      if (!query || !query.trim()) {
        setExpandedQueries(null)
        return
      }

      setLoadingQueries(true)
      try {
        const params = new URLSearchParams({ query })
        const response = await fetch(`/api/camps?${params}`)
        if (response.ok) {
          const data = await response.json()
          setExpandedQueries(data.expandedQueries || null)
        }
      } catch (error) {
        console.error('Error fetching expanded queries:', error)
      } finally {
        setLoadingQueries(false)
      }
    }

    fetchExpandedQueries()
  }, [query])

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Sidebar />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <main
        ref={mainRef}
        className="flex-1 mt-16 overflow-y-auto transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '0' : '256px' }}
      >
        <div className="max-w-5xl mx-auto p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 style={{ fontSize: 'var(--text-h2)', marginBottom: 'var(--space-2)' }}>
              {TERMINOLOGY.searchFull}
            </h1>
            <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-mid-gray)' }}>
              Browse the definitive collection of {TERMINOLOGY.camps.toLowerCase()} shaping AI discourse
            </p>
          </div>

          {/* Feature Hint */}
          <FeatureHint featureKey="explore" className="mb-6" />

          {/* Search Bar - Prominent styling */}
          <SearchBar initialQuery={query} showEdit={false} />

          {/* Show expanded queries beneath search bar */}
          {query && expandedQueries && expandedQueries.length > 0 && (
            <div className="mb-4">
              <ExpandedQueries queries={expandedQueries} originalQuery={query} />
            </div>
          )}

          <PositioningSnapshot
            query={query}
            domain={domain}
            camp={camp}
          />

          {/* Example Perspective - Teaching component (only show when no query) */}
          {!query && showExample && (
            <div className="mt-6">
              <ExamplePerspective onExploreClick={handleExploreClick} />
            </div>
          )}

          {/* Perspectives Section */}
          <div ref={campsRef} className="mt-6">
            {/* Section Header - Different for search vs browse */}
            {query ? (
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Search Results
                </h2>
                <p className="text-sm text-gray-500">
                  Perspectives matching "{query}"
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-3">
                  Browse All Perspectives
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
            )}

            <CampAccordion
              query={query}
              domain={domain}
              domains={domains}
              camp={camp}
              camps={camps}
              authors={authors}
              onCampsLoaded={handleCampsLoaded}
              scrollToCampId={scrollToCampId}
            />
          </div>
        </div>
        <BackToTop containerRef={mainRef} />
      </main>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bone)' }}>
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  )
}

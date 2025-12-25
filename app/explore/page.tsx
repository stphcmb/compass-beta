'use client'

import { Suspense, useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import CampAccordion from '@/components/CampAccordion'
import BackToTop from '@/components/BackToTop'
import { ExpandedQueries } from '@/components/search-expansion'
import { FeatureHint } from '@/components/FeatureHint'
import { HowPerspectivesWorkModal, useHowPerspectivesWorkModal } from '@/components/HowPerspectivesWorkModal'
import DomainOverview from '@/components/DomainOverview'
import { TERMINOLOGY } from '@/lib/constants/terminology'
import { HelpCircle } from 'lucide-react'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

// Domain panel width constant
const DOMAIN_PANEL_WIDTH = 220

function ExplorePageContent() {
  const searchParams = useSearchParams()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeDomain, setActiveDomain] = useState<string | null>(null)

  const query = searchParams.get('q') || ''
  const domain = activeDomain || searchParams.get('domain') || undefined
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

  // Modal for teaching users how perspectives work
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useHowPerspectivesWorkModal()

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

  // Calculate margins for layout
  const sidebarWidth = sidebarCollapsed ? 0 : 256
  const domainPanelLeft = sidebarWidth
  const mainContentLeft = sidebarWidth + DOMAIN_PANEL_WIDTH

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Sidebar />
      <Header sidebarCollapsed={sidebarCollapsed} />

      {/* Domain Overview Panel - Fixed position between sidebar and main */}
      <aside
        className="fixed top-16 h-[calc(100vh-64px)] border-r border-gray-200 transition-all duration-300 z-10"
        style={{
          left: `${domainPanelLeft}px`,
          width: `${DOMAIN_PANEL_WIDTH}px`,
          backgroundColor: 'white'
        }}
      >
        <DomainOverview
          onDomainFilter={setActiveDomain}
          activeDomain={activeDomain}
        />
      </aside>

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-1 mt-16 overflow-y-auto transition-all duration-300"
        style={{ marginLeft: `${mainContentLeft}px` }}
      >
        <div className="max-w-4xl mx-auto p-6">
          {/* Page Title */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <h1 style={{ fontSize: 'var(--text-h2)', marginBottom: 0 }}>
                {TERMINOLOGY.searchFull}
              </h1>
              <button
                onClick={openModal}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="How perspectives work"
                style={{ marginTop: '2px' }}
              >
                <HelpCircle size={18} className="text-gray-400 hover:text-indigo-500" />
              </button>
            </div>
            <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-mid-gray)', marginTop: 'var(--space-2)' }}>
              Browse the definitive collection of {TERMINOLOGY.camps.toLowerCase()} shaping AI discourse
            </p>
          </div>

          {/* Feature Hint */}
          <FeatureHint featureKey="explore" className="mb-6" />

          {/* Search Bar - Prominent styling */}
          <SearchBar
            initialQuery={query}
            showEdit={false}
            showSaveButton={!!query}
            domain={domain}
            camp={camp}
          />

          {/* Show expanded queries beneath search bar */}
          {query && expandedQueries && expandedQueries.length > 0 && (
            <div className="mb-4">
              <ExpandedQueries queries={expandedQueries} originalQuery={query} />
            </div>
          )}

          {/* Domain Filter Indicator */}
          {activeDomain && !query && (
            <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Filtering by Domain</span>
                  <div className="text-sm font-medium text-gray-900">{activeDomain}</div>
                </div>
                <button
                  onClick={() => setActiveDomain(null)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Clear filter
                </button>
              </div>
            </div>
          )}

          {/* How Perspectives Work Modal */}
          <HowPerspectivesWorkModal isOpen={isModalOpen} onClose={closeModal} />

          {/* Perspectives Section */}
          <div ref={campsRef} className="mt-6">
            {/* Section Header - Different for search vs browse */}
            {query ? (
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Search Results
                  </h2>
                  {loadedCamps.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {loadedCamps.reduce((sum, c) => sum + (c.authorCount || 0), 0)} authors in {loadedCamps.length} perspectives
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-3">
                  {activeDomain ? `${activeDomain} Perspectives` : 'Browse All Perspectives'}
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

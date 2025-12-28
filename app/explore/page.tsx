'use client'

import { Suspense, useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import SearchBar from '@/components/SearchBar'
import CampAccordion from '@/components/CampAccordion'
import BackToTop from '@/components/BackToTop'
import { ExpandedQueries } from '@/components/search-expansion'
import { FeatureHint } from '@/components/FeatureHint'
import { HowPerspectivesWorkModal, useHowPerspectivesWorkModal } from '@/components/HowPerspectivesWorkModal'
import DomainOverview from '@/components/DomainOverview'
import { TERMINOLOGY } from '@/lib/constants/terminology'
import { Layers, Compass } from 'lucide-react'

// Layout constants - match Authors page sidebar
const SIDEBAR_WIDTH = 320

function ExplorePageContent() {
  const searchParams = useSearchParams()
  const [domainPanelCollapsed, setDomainPanelCollapsed] = useState(false)
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
  const sidebarLeft = 0
  const actualSidebarWidth = domainPanelCollapsed ? 0 : SIDEBAR_WIDTH
  const mainContentLeft = actualSidebarWidth

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <Header sidebarCollapsed={true} />

      {/* Domain Panel Expand Button - animated appearance */}
      <button
        onClick={() => setDomainPanelCollapsed(false)}
        className={`fixed top-20 z-20 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 ${
          domainPanelCollapsed
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-2 pointer-events-none'
        }`}
        style={{
          left: '16px',
          transitionDelay: domainPanelCollapsed ? '150ms' : '0ms'
        }}
        title="Expand domain panel"
      >
        <Layers className="w-5 h-5 text-indigo-600" />
      </button>

      {/* Domain Overview Panel - Fixed position sidebar */}
      <aside
        className="fixed top-16 h-[calc(100vh-64px)] border-r border-gray-200 z-10 overflow-hidden"
        style={{
          left: `${sidebarLeft}px`,
          width: domainPanelCollapsed ? '0px' : `${SIDEBAR_WIDTH}px`,
          opacity: domainPanelCollapsed ? 0 : 1,
          backgroundColor: 'var(--color-air-white)',
          transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease-out',
          transitionDelay: domainPanelCollapsed ? '0ms' : '50ms'
        }}
      >
        <div
          className="h-full"
          style={{
            width: `${SIDEBAR_WIDTH}px`,
            transform: domainPanelCollapsed ? 'translateX(-20px)' : 'translateX(0)',
            opacity: domainPanelCollapsed ? 0 : 1,
            transition: 'transform 250ms ease-out, opacity 200ms ease-out',
            transitionDelay: domainPanelCollapsed ? '0ms' : '100ms'
          }}
        >
          <DomainOverview
            onDomainFilter={setActiveDomain}
            activeDomain={activeDomain}
            onToggleCollapse={() => setDomainPanelCollapsed(true)}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-1 mt-16 overflow-y-auto transition-all duration-300"
        style={{ marginLeft: `${mainContentLeft}px` }}
      >
        <div className="max-w-4xl mx-auto" style={{ padding: '20px 24px' }}>
          {/* Page Header */}
          <PageHeader
            icon={<Compass size={24} />}
            iconVariant="blue"
            title={TERMINOLOGY.searchFull}
            subtitle={`Browse the definitive collection of ${TERMINOLOGY.camps.toLowerCase()} shaping AI discourse`}
            helpButton={{
              label: 'How it works',
              onClick: openModal
            }}
          />

          {/* Feature Hint */}
          <FeatureHint featureKey="explore" className="mb-4" />

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
            <div style={{ marginBottom: '12px' }}>
              <ExpandedQueries queries={expandedQueries} originalQuery={query} />
            </div>
          )}

          {/* Domain Filter Indicator */}
          {activeDomain && !query && (
            <div
              className="flex items-center justify-between"
              style={{
                marginBottom: '12px',
                padding: '8px 12px',
                backgroundColor: '#eef2ff',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #c7d2fe'
              }}
            >
              <div>
                <span style={{ fontSize: '9px', color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filtering</span>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-soft-black)' }}>{activeDomain}</div>
              </div>
              <button
                onClick={() => setActiveDomain(null)}
                style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 500 }}
                className="hover:underline"
              >
                Clear
              </button>
            </div>
          )}

          {/* How Perspectives Work Modal */}
          <HowPerspectivesWorkModal isOpen={isModalOpen} onClose={closeModal} />

          {/* Perspectives Section */}
          <div ref={campsRef} style={{ marginTop: '16px' }}>
            {/* Section Header - Different for search vs browse */}
            {query ? (
              <div style={{ marginBottom: '12px' }}>
                <div className="flex items-center gap-2">
                  <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-soft-black)' }}>
                    Results
                  </h2>
                  {loadedCamps.length > 0 && (
                    <span style={{ fontSize: '12px', color: 'var(--color-mid-gray)' }}>
                      {loadedCamps.reduce((sum, c) => sum + (c.authorCount || 0), 0)} authors · {loadedCamps.length} perspectives
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--color-light-gray), transparent)' }} />
                <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-mid-gray)', padding: '0 8px' }}>
                  {activeDomain ? `${activeDomain}` : 'All Perspectives'}
                </span>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--color-light-gray), transparent)' }} />
              </div>
            )}

            <div style={{
              backgroundColor: 'var(--color-air-white)',
              border: '1px solid var(--color-light-gray)',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              padding: '12px 16px'
            }}>
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

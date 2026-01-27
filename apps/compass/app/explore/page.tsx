'use client'

import { Suspense, useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import SearchBar from '@/components/SearchBar'
import CampAccordion from '@/components/CampAccordion'
import SearchResults from '@/components/SearchResults'
import BackToTop from '@/components/BackToTop'
// Note: ExpandedQueries component removed - using "Also searching for" in SearchResults instead
import { FeatureHint } from '@/components/FeatureHint'
import { HowPerspectivesWorkModal, useHowPerspectivesWorkModal } from '@/components/HowPerspectivesWorkModal'
import DomainOverview from '@/components/DomainOverview'
// import DomainSpectrum from '@/components/DomainSpectrum' // Temporarily hidden
import { TERMINOLOGY } from '@/lib/constants/terminology'
import { Compass, Search as SearchIcon, Grid3X3, ArrowLeft } from 'lucide-react'

function ExplorePageContent() {
  const searchParams = useSearchParams()
  const [activeDomain, setActiveDomain] = useState<string | null>(null)

  const query = searchParams.get('q') || ''
  const domainFromUrl = searchParams.get('domain')
  const domain = activeDomain || domainFromUrl || undefined
  // Combine single domain into domains array for filtering
  const domainsFromUrl = searchParams.get('domains')?.split(',') || []
  const domains = domain ? [domain] : domainsFromUrl
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

  // Explicit explore mode - only show perspectives when user clicks to explore
  const [exploreMode, setExploreMode] = useState(false)

  // Modal for teaching users how perspectives work
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useHowPerspectivesWorkModal()

  // Handle camps loaded from CampAccordion
  const handleCampsLoaded = useCallback((camps: any[], expandedQueriesData?: any[] | null) => {
    setLoadedCamps(camps)
    if (expandedQueriesData !== undefined) {
      setExpandedQueries(expandedQueriesData)
    }
  }, [])

  // Handle clicking on a perspective in the DiscourseMap
  const handleCampClick = useCallback((campId: string) => {
    setScrollToCampId(campId)
    setActiveCampId(campId)
    // Reset scroll target after a short delay
    setTimeout(() => setScrollToCampId(null), 100)
  }, [])

  // Save search to recent searches when query changes
  useEffect(() => {
    if (!query || !query.trim()) return

    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      // Remove if already exists
      const filtered = recent.filter((s: any) => s.query !== query)
      // Add to beginning
      filtered.unshift({
        id: `recent-${Date.now()}`,
        query,
        timestamp: new Date().toISOString()
      })
      // Keep only last 20
      const limited = filtered.slice(0, 20)
      localStorage.setItem('recentSearches', JSON.stringify(limited))
    } catch (error) {
      console.error('Error saving recent search:', error)
    }
  }, [query])

  // Reset expanded queries when query is cleared
  useEffect(() => {
    if (!query || !query.trim()) {
      setExpandedQueries(null)
    }
  }, [query])

  // No sidebar - full width layout

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <Header sidebarCollapsed={true} />

      {/* Sidebar hidden in all modes - domain filtering now inline */}

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-1 mt-16 overflow-y-auto"
      >
        <div className="max-w-4xl mx-auto" style={{ padding: '24px' }}>
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

          {/* Framing Question - like Authors page */}
          {!query && !exploreMode && !activeDomain && (
            <div className="text-center mb-6">
              <h3 className="text-[17px] font-semibold text-gray-900 mb-2">How would you like to explore?</h3>
              <p className="text-[14px] text-gray-600">
                Search for specific topics, or browse all perspectives organized by domain.
              </p>
            </div>
          )}

          {/* Feature Hint */}
          <FeatureHint featureKey="explore" className="mb-4" />

          {/* Domain Spectrum - Temporarily hidden */}
          {/* {!query && <DomainSpectrum />} */}

          {/* Search Bar - Show in welcome state and search mode, hide in browse mode */}
          {(query || !exploreMode) && (
            <SearchBar
              initialQuery={query}
              showEdit={false}
              showSaveButton={!!query}
              domain={domain}
              camp={camp}
            />
          )}

          {/* How Perspectives Work Modal */}
          <HowPerspectivesWorkModal isOpen={isModalOpen} onClose={closeModal} />

          {/* Content Section - Search Results vs Explore Mode */}
          <div ref={campsRef} style={{ marginTop: '16px' }}>
            {query ? (
              /* SEARCH MODE: Flat, author-focused results */
              <div>
                {/* Search Mode Header with Back Button */}
                <div className="flex items-center justify-between mb-3">
                  <a
                    href={`/explore${domain ? `?domain=${encodeURIComponent(domain)}` : ''}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Browse All Perspectives</span>
                  </a>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                    <SearchIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-[13px] font-medium text-blue-700">Search Mode</span>
                  </div>
                </div>

                {/* Search Results - Flat author list */}
                <div style={{
                  backgroundColor: 'var(--color-air-white)',
                  border: '1px solid var(--color-light-gray)',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  padding: '16px 20px'
                }}>
                  <SearchResults
                    query={query}
                    domain={domain}
                    onResultsLoaded={handleCampsLoaded}
                  />
                </div>
              </div>
            ) : !exploreMode && !activeDomain ? (
              /* WELCOME STATE: Options to search or browse */
              <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100 rounded-xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  {/* Search Option - Clickable with sample query */}
                  <a
                    href="/explore?q=future+of+work"
                    className="p-4 bg-white rounded-xl border border-blue-200 text-center hover:border-blue-400 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                      <SearchIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-[14px] font-medium text-gray-800 mb-1">Search</div>
                    <div className="text-[12px] text-gray-500 mb-3">Find authors by topic, quote, or name</div>
                    <div className="text-[11px] text-blue-600 font-medium">Try "future of work" →</div>
                  </a>

                  {/* Browse Option - Click to enter explore mode */}
                  <button
                    onClick={() => setExploreMode(true)}
                    className="p-4 bg-white rounded-xl border border-indigo-200 text-center hover:border-indigo-400 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-200 transition-colors">
                      <Grid3X3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-[14px] font-medium text-gray-800 mb-1">Browse Perspectives</div>
                    <div className="text-[12px] text-gray-500 mb-3">Explore all perspectives by domain</div>
                    <div className="text-[11px] text-indigo-600 font-medium">Click to browse →</div>
                  </button>
                </div>
              </div>
            ) : (
              /* EXPLORE MODE: Hierarchical domain/camp discovery */
              <div>
                {/* Explore Mode Header with Back Button */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      setExploreMode(false)
                      setActiveDomain(null)
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
                    <Grid3X3 className="w-4 h-4 text-indigo-600" />
                    <span className="text-[13px] font-medium text-indigo-700">
                      {activeDomain ? activeDomain : 'Browse Mode'}
                    </span>
                  </div>
                </div>

                {/* Core Debates Panel - Inline in browse mode */}
                <div className="mb-6">
                  <DomainOverview
                    onDomainFilter={setActiveDomain}
                    activeDomain={activeDomain}
                    inline={true}
                  />
                </div>

                {/* Domain Filter Indicator */}
                {activeDomain && (
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
                      <span style={{ fontSize: '9px', color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Showing perspectives in</span>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-soft-black)' }}>{activeDomain}</div>
                    </div>
                    <button
                      onClick={() => setActiveDomain(null)}
                      style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 500 }}
                      className="hover:underline"
                    >
                      Show all domains
                    </button>
                  </div>
                )}

                {/* Camp Accordion - Hierarchical view */}
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
            )}
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

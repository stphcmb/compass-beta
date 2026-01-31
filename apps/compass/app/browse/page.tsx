'use client'

import { Suspense, useState, useRef, useEffect, useCallback, lazy } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import SearchBar from '@/components/SearchBar'
import BackToTop from '@/components/BackToTop'
import { FeatureHint } from '@/components/FeatureHint'
import { useHowPerspectivesWorkModal } from '@/components/HowPerspectivesWorkModal'
import { TERMINOLOGY } from '@/lib/constants/terminology'
import { Compass, Search as SearchIcon, Grid3X3, ArrowLeft, Sparkles } from 'lucide-react'

// Code splitting - lazy load heavy components
const CampAccordion = lazy(() => import('@/components/CampAccordion'))
const SearchResults = lazy(() => import('@/components/SearchResults'))
const DomainOverview = lazy(() => import('@/components/DomainOverview'))
const HowPerspectivesWorkModal = lazy(() => import('@/components/HowPerspectivesWorkModal').then(mod => ({ default: mod.HowPerspectivesWorkModal })))

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
  const [loadedCamps, setLoadedCamps] = useState<any[]>([])
  const [scrollToCampId, setScrollToCampId] = useState<string | null>(null)
  const [activeCampId, setActiveCampId] = useState<string | null>(null)

  // Explicit explore mode - only show perspectives when user clicks to explore
  const [exploreMode, setExploreMode] = useState(false)
  const [campsLoading, setCampsLoading] = useState(false)

  // Modal for teaching users how perspectives work
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useHowPerspectivesWorkModal()

  // Fetch camps data once at page level when entering explore mode (deduplicates API calls)
  useEffect(() => {
    if (!exploreMode || loadedCamps.length > 0 || campsLoading) return

    const fetchCamps = async () => {
      setCampsLoading(true)
      try {
        const params = new URLSearchParams()
        if (domain) params.set('domain', domain)

        const response = await fetch(`/api/camps?${params}`)
        if (response.ok) {
          const data = await response.json()
          setLoadedCamps(data.camps || [])
          if (data.expandedQueries) {
            setExpandedQueries(data.expandedQueries)
          }
        }
      } catch (error) {
        console.error('Error fetching camps:', error)
      } finally {
        setCampsLoading(false)
      }
    }

    fetchCamps()
  }, [exploreMode, domain, loadedCamps.length, campsLoading])

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

  // Save search to recent searches when query changes (debounced)
  useEffect(() => {
    if (!query || !query.trim()) return

    // Debounce localStorage write to avoid blocking on rapid typing
    const timeoutId = setTimeout(() => {
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
    }, 500)

    return () => clearTimeout(timeoutId)
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
        <div className="max-w-6xl mx-auto" style={{ padding: '24px' }}>
          {/* Page Header */}
          <PageHeader
            icon={<Compass size={24} />}
            iconVariant="blue"
            title={TERMINOLOGY.search}
            subtitle={`Explore the definitive collection of ${TERMINOLOGY.camps.toLowerCase()} shaping AI discourse`}
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

          {/* Query Expansion Panel - Show when search has expanded queries */}
          {query && expandedQueries && expandedQueries.length > 0 && (
            <div className="mt-3 px-4 py-3 bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-purple-50/70 rounded-xl border border-indigo-100/80">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-semibold text-gray-800">Smart Query Expansion</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide bg-indigo-100 text-indigo-600 rounded">
                      n8n + Gemini
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-2">
                    Your search is automatically expanded to include semantically related concepts, synonyms, and adjacent topics to surface relevant perspectives you might otherwise miss.
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-indigo-600 font-medium mr-1">Expanded to:</span>
                    {expandedQueries.map((eq: any, idx: number) => {
                      const queryText = eq?.query || (typeof eq === 'string' ? eq : '')
                      if (!queryText) return null
                      return (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[11px] bg-white text-gray-700 rounded-full border border-indigo-200 shadow-sm"
                        >
                          {queryText}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* How Perspectives Work Modal - lazy loaded */}
          {isModalOpen && (
            <Suspense fallback={null}>
              <HowPerspectivesWorkModal isOpen={isModalOpen} onClose={closeModal} />
            </Suspense>
          )}

          {/* Content Section - Search Results vs Explore Mode */}
          <div ref={campsRef} style={{ marginTop: '16px' }}>
            {query ? (
              /* SEARCH MODE: Flat, author-focused results */
              <div>
                {/* Back Button */}
                <div className="mb-3">
                  <a
                    href={`/browse${domain ? `?domain=${encodeURIComponent(domain)}` : ''}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Browse All Perspectives</span>
                  </a>
                </div>

                {/* Search Results - Flat author list (lazy loaded) */}
                <div style={{
                  backgroundColor: 'var(--color-air-white)',
                  border: '1px solid var(--color-light-gray)',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  padding: '16px 20px'
                }}>
                  <Suspense fallback={
                    <div className="text-center py-8 text-gray-500">Loading results...</div>
                  }>
                    <SearchResults
                      query={query}
                      domain={domain}
                      onResultsLoaded={handleCampsLoaded}
                    />
                  </Suspense>
                </div>
              </div>
            ) : !exploreMode && !activeDomain ? (
              /* WELCOME STATE: Options to search or browse */
              <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100 rounded-xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {/* Search Option - Clickable with sample query */}
                  <a
                    href="/browse?q=future+of+work"
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

                {/* Core Debates Panel - Inline in browse mode (lazy loaded) */}
                <div className="mb-6">
                  <Suspense fallback={
                    <div className="text-center py-8 text-gray-500">Loading domains...</div>
                  }>
                    <DomainOverview
                      onDomainFilter={setActiveDomain}
                      activeDomain={activeDomain}
                      inline={true}
                      camps={loadedCamps}
                    />
                  </Suspense>
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

                {/* Camp Accordion - Hierarchical view (lazy loaded) */}
                <div style={{
                  backgroundColor: 'var(--color-air-white)',
                  border: '1px solid var(--color-light-gray)',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  padding: '12px 16px'
                }}>
                  <Suspense fallback={
                    <div className="text-center py-8 text-gray-500">Loading perspectives...</div>
                  }>
                    <CampAccordion
                      query={query}
                      domain={domain}
                      domains={domains}
                      camp={camp}
                      camps={camps}
                      authors={authors}
                      onCampsLoaded={handleCampsLoaded}
                      scrollToCampId={scrollToCampId}
                      initialCamps={loadedCamps}
                    />
                  </Suspense>
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

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
import { HelpCircle, Layers, Compass } from 'lucide-react'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

// Layout constants - must match Sidebar.tsx width
const SIDEBAR_WIDTH = 220
const DOMAIN_PANEL_WIDTH = 220

function ExplorePageContent() {
  const searchParams = useSearchParams()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
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
  const sidebarWidth = sidebarCollapsed ? 0 : SIDEBAR_WIDTH
  const domainPanelLeft = sidebarWidth
  const actualDomainPanelWidth = domainPanelCollapsed ? 0 : DOMAIN_PANEL_WIDTH
  const mainContentLeft = sidebarWidth + actualDomainPanelWidth

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Sidebar />
      <Header sidebarCollapsed={sidebarCollapsed} />

      {/* Domain Panel Expand Button - animated appearance */}
      <button
        onClick={() => setDomainPanelCollapsed(false)}
        className={`fixed top-20 z-20 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 ${
          domainPanelCollapsed
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-2 pointer-events-none'
        }`}
        style={{
          left: `${sidebarWidth + 16}px`,
          transitionDelay: domainPanelCollapsed ? '150ms' : '0ms'
        }}
        title="Expand domain panel"
      >
        <Layers className="w-5 h-5 text-indigo-600" />
      </button>

      {/* Domain Overview Panel - Fixed position between sidebar and main */}
      <aside
        className="fixed top-16 h-[calc(100vh-64px)] border-r border-gray-200 z-10 overflow-hidden"
        style={{
          left: `${domainPanelLeft}px`,
          width: domainPanelCollapsed ? '0px' : `${DOMAIN_PANEL_WIDTH}px`,
          opacity: domainPanelCollapsed ? 0 : 1,
          backgroundColor: 'white',
          transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease-out',
          transitionDelay: domainPanelCollapsed ? '0ms' : '50ms'
        }}
      >
        <div
          className="h-full"
          style={{
            width: `${DOMAIN_PANEL_WIDTH}px`,
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
          {/* Page Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
              }}>
                <Compass size={24} style={{ color: 'white' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  {TERMINOLOGY.searchFull}
                </h1>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                  Browse the definitive collection of {TERMINOLOGY.camps.toLowerCase()} shaping AI discourse
                </p>
              </div>
            </div>
            <button
              onClick={openModal}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#6b7280',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <HelpCircle size={16} />
              How it works
            </button>
          </div>

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

'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import PositioningSnapshot from '@/components/PositioningSnapshot'
import CampAccordion from '@/components/CampAccordion'
import BackToTop from '@/components/BackToTop'
import { ExpandedQueries } from '@/components/search-expansion'

function ResultsPageContent() {
  const searchParams = useSearchParams()

  const query = searchParams.get('q') || ''
  const domain = searchParams.get('domain') || undefined
  const domains = searchParams.get('domains')?.split(',') || []
  const camp = searchParams.get('camp') || undefined
  const camps = searchParams.get('camps')?.split(',') || []
  const authors = searchParams.get('authors')?.split(',') || []

  const mainRef = useRef<HTMLElement>(null)
  const [expandedQueries, setExpandedQueries] = useState<any[] | null>(null)
  const [loadingQueries, setLoadingQueries] = useState(false)

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
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <Header sidebarCollapsed={true} />
      <main ref={mainRef} className="flex-1 mt-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto" style={{ padding: '24px' }}>
          <div className="mb-6">
            <SearchBar initialQuery={query} showEdit={true} />
          </div>

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
          <div className="space-y-4 mt-6">
            <CampAccordion
              query={query}
              domain={domain}
              domains={domains}
              camp={camp}
              camps={camps}
              authors={authors}
            />
          </div>
        </div>
        <BackToTop containerRef={mainRef} />
      </main>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-page-bg)' }}>
        <div style={{ color: 'var(--color-mid-gray)' }}>Loading...</div>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  )
}

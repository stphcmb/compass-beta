'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import PositioningSnapshot from '@/components/PositioningSnapshot'
import CampAccordion from '@/components/CampAccordion'
import BackToTop from '@/components/BackToTop'
import { ExpandedQueries } from '@/components/search-expansion'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

function ResultsPageContent() {
  const searchParams = useSearchParams()

  const query = searchParams.get('q') || ''
  const domain = searchParams.get('domain') || undefined
  const domains = searchParams.get('domains')?.split(',') || []
  const camp = searchParams.get('camp') || undefined
  const camps = searchParams.get('camps')?.split(',') || []
  const authors = searchParams.get('authors')?.split(',') || []
  const date = searchParams.get('date') || undefined

  const mainRef = useRef<HTMLElement>(null)
  const [selectedRelevance, setSelectedRelevance] = useState<string | null>(null)
  const [expandedQueries, setExpandedQueries] = useState<any[] | null>(null)
  const [loadingQueries, setLoadingQueries] = useState(false)

  const handleRelevanceClick = (relevance: string) => {
    // Toggle: if clicking same one, deselect; otherwise select new one
    setSelectedRelevance(prev => prev === relevance ? null : relevance)
  }

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
    <div className="h-screen bg-gray-50 flex">
      <Sidebar />
      <Header />
      <main ref={mainRef} className="flex-1 ml-64 mt-16 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
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
            selectedRelevance={selectedRelevance}
            onRelevanceClick={handleRelevanceClick}
          />
          <div className="space-y-4 mt-6">
            <CampAccordion
              query={query}
              domain={domain}
              domains={domains}
              camp={camp}
              camps={camps}
              authors={authors}
              relevanceFilter={selectedRelevance}
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
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  )
}


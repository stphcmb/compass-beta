'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import SearchBar from '@/components/SearchBar'
import PositioningSnapshot from '@/components/PositioningSnapshot'
import CampAccordion from '@/components/CampAccordion'
import BackToTop from '@/components/BackToTop'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

export default function ResultsPage({
  searchParams,
}: {
  searchParams: {
    q?: string
    domain?: string
    domains?: string
    camp?: string
    camps?: string
    authors?: string
    date?: string
  }
}) {
  const query = searchParams.q || ''
  const domain = searchParams.domain
  const domains = searchParams.domains?.split(',') || []
  const camp = searchParams.camp
  const camps = searchParams.camps?.split(',') || []
  const authors = searchParams.authors?.split(',') || []
  const date = searchParams.date

  const mainRef = useRef<HTMLElement>(null)
  const [selectedRelevance, setSelectedRelevance] = useState<string | null>(null)

  const handleRelevanceClick = (relevance: string) => {
    // Toggle: if clicking same one, deselect; otherwise select new one
    setSelectedRelevance(prev => prev === relevance ? null : relevance)
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar />
      <main ref={mainRef} className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          <div className="mb-6">
            <SearchBar initialQuery={query} showEdit={true} />
          </div>
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


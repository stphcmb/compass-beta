'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import SearchBar from '@/components/SearchBar'
import PositioningSnapshot from '@/components/PositioningSnapshot'
import CampAccordion from '@/components/CampAccordion'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

export default function ResultsPage({
  searchParams,
}: {
  searchParams: { q?: string; domain?: string; camp?: string }
}) {
  const query = searchParams.q || ''
  const domain = searchParams.domain
  const camp = searchParams.camp

  const [selectedRelevance, setSelectedRelevance] = useState<string | null>(null)

  const handleRelevanceClick = (relevance: string) => {
    // Toggle: if clicking same one, deselect; otherwise select new one
    setSelectedRelevance(prev => prev === relevance ? null : relevance)
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
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
              camp={camp}
              relevanceFilter={selectedRelevance}
            />
          </div>
        </div>
      </main>
    </div>
  )
}


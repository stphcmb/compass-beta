'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import CampAccordion from '@/components/CampAccordion'

export default function ContentHelperPage({
  searchParams,
}: {
  searchParams: { topic?: string; thesis?: string; angle?: string }
}) {
  const topic = searchParams.topic || ''
  const thesis = searchParams.thesis || ''
  const angle = searchParams.angle || ''

  const [selectedRelevance, setSelectedRelevance] = useState<string | null>(null)

  const handleRelevanceClick = (relevance: string) => {
    setSelectedRelevance(prev => prev === relevance ? null : relevance)
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      <Header sidebarCollapsed={true} />
      <main className="flex-1 mt-16 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>

          {/* Content Angle Header */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 mb-6 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-purple-200 text-purple-800 text-xs font-semibold rounded-full">
                CONTENT HELPER
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-purple-900 mb-3">
              {thesis}
            </h1>
            <p className="text-sm md:text-base text-purple-800 leading-relaxed">
              <span className="font-semibold">Why this is a white space opportunity:</span> {angle}
            </p>
          </div>

          {/* Positioning Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Filter by Positioning</h2>
            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={() => handleRelevanceClick('strong')}
                className={`text-center p-4 rounded transition-all cursor-pointer hover:shadow-md ${
                  selectedRelevance === 'strong'
                    ? 'bg-green-100 ring-2 ring-green-500 shadow-lg'
                    : 'bg-green-50 hover:bg-green-100'
                }`}
              >
                <div className="text-sm font-semibold text-green-700">Strong Alignment</div>
                {selectedRelevance === 'strong' && (
                  <div className="text-xs text-green-600 mt-1">✓ Filtering</div>
                )}
              </button>
              <button
                onClick={() => handleRelevanceClick('partial')}
                className={`text-center p-4 rounded transition-all cursor-pointer hover:shadow-md ${
                  selectedRelevance === 'partial'
                    ? 'bg-yellow-100 ring-2 ring-yellow-500 shadow-lg'
                    : 'bg-yellow-50 hover:bg-yellow-100'
                }`}
              >
                <div className="text-sm font-semibold text-yellow-700">Partial Alignment</div>
                {selectedRelevance === 'partial' && (
                  <div className="text-xs text-yellow-600 mt-1">✓ Filtering</div>
                )}
              </button>
              <button
                onClick={() => handleRelevanceClick('challenges')}
                className={`text-center p-4 rounded transition-all cursor-pointer hover:shadow-md ${
                  selectedRelevance === 'challenges'
                    ? 'bg-red-100 ring-2 ring-red-500 shadow-lg'
                    : 'bg-red-50 hover:bg-red-100'
                }`}
              >
                <div className="text-sm font-semibold text-red-700">Challenge Your View</div>
                {selectedRelevance === 'challenges' && (
                  <div className="text-xs text-red-600 mt-1">✓ Filtering</div>
                )}
              </button>
              <button
                onClick={() => handleRelevanceClick('emerging')}
                className={`text-center p-4 rounded transition-all cursor-pointer hover:shadow-md ${
                  selectedRelevance === 'emerging'
                    ? 'bg-purple-100 ring-2 ring-purple-500 shadow-lg'
                    : 'bg-purple-50 hover:bg-purple-100'
                }`}
              >
                <div className="text-sm font-semibold text-purple-700">Emerging Views</div>
                {selectedRelevance === 'emerging' && (
                  <div className="text-xs text-purple-600 mt-1">✓ Filtering</div>
                )}
              </button>
            </div>
          </div>

          {/* Relevant Positioning & Arguments */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Relevant Positioning & Arguments</h2>
            <p className="text-sm text-gray-600">
              Explore thought leaders whose views align with or challenge this content angle
            </p>
          </div>

          <div className="space-y-4">
            <CampAccordion
              query={topic}
              domain={undefined}
              camp={undefined}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

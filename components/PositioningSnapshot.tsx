'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { getPositioningMetrics, getWhiteSpaceOpportunities } from '@/lib/api/thought-leaders'

interface PositioningSnapshotProps {
  query: string
  domain?: string
  camp?: string
  selectedRelevance?: string | null
  onRelevanceClick?: (relevance: string) => void
}

export default function PositioningSnapshot({ query, domain, camp, selectedRelevance, onRelevanceClick }: PositioningSnapshotProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    stronglyAligned: 0,
    partiallyAligned: 0,
    challenging: 0,
    emerging: 0,
    totalCamps: 0,
    totalAuthors: 0,
    domains: [] as string[]
  })
  const [opportunities, setOpportunities] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [metricsData, opportunitiesData] = await Promise.all([
          getPositioningMetrics(query, domain),
          getWhiteSpaceOpportunities(query, domain)
        ])
        setMetrics(metricsData)
        setOpportunities(opportunitiesData)
      } catch (error) {
        console.error('Error fetching positioning data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, domain])

  const handleDomainClick = (domainName: string) => {
    const domainId = `domain-${domainName.toLowerCase().replace(/\s+/g, '-')}`
    const element = document.getElementById(domainId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSave = async () => {
    try {
      // Save to localStorage
      const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')

      const newSearch = {
        id: `saved-${Date.now()}`,
        query,
        domain,
        camp,
        created_at: new Date().toISOString(),
        filters: {
          ...(domain && { domain }),
          ...(camp && { camp })
        }
      }

      // Check if this search already exists
      const exists = savedSearches.some((s: any) =>
        s.query === query && s.domain === domain && s.camp === camp
      )

      if (!exists) {
        savedSearches.unshift(newSearch)
        localStorage.setItem('savedSearches', JSON.stringify(savedSearches))

        // Dispatch custom event to notify Sidebar
        window.dispatchEvent(new CustomEvent('saved-search-created', {
          detail: newSearch
        }))
      }

      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } catch (error) {
      console.error('Error saving search:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="text-center text-gray-600">Loading positioning snapshot...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[15px] font-semibold mb-1">Who agrees with your thesis?</h2>
          <p className="text-[13px] text-gray-600">Click to filter authors by their stance</p>
        </div>
        <div className="flex items-center gap-3">
          {query && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md text-[12px] text-gray-600">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              &quot;{query}&quot;
            </div>
          )}
          <button
            onClick={handleSave}
            className="text-[13px] text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
          >
            <Bookmark className="w-4 h-4" />
            {isSaved ? 'Saved!' : 'Save Search'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <button
          onClick={() => onRelevanceClick?.('strong')}
          className={`p-4 rounded-lg transition-all cursor-pointer border-2 ${
            selectedRelevance === 'strong'
              ? 'bg-emerald-50 border-emerald-500 shadow-md'
              : 'bg-emerald-50 border-transparent hover:border-emerald-200 hover:shadow-sm'
          }`}
        >
          <div className="text-[32px] font-bold text-emerald-600 leading-none mb-1.5">{metrics.stronglyAligned}</div>
          <div className="text-[13px] font-semibold text-emerald-700 mb-0.5">Agree</div>
          <div className="text-[11px] text-emerald-600 opacity-75">Support your view</div>
        </button>
        <button
          onClick={() => onRelevanceClick?.('partial')}
          className={`p-4 rounded-lg transition-all cursor-pointer border-2 ${
            selectedRelevance === 'partial'
              ? 'bg-amber-50 border-amber-500 shadow-md'
              : 'bg-amber-50 border-transparent hover:border-amber-200 hover:shadow-sm'
          }`}
        >
          <div className="text-[32px] font-bold text-amber-600 leading-none mb-1.5">{metrics.partiallyAligned}</div>
          <div className="text-[13px] font-semibold text-amber-700 mb-0.5">Partially Agree</div>
          <div className="text-[11px] text-amber-600 opacity-75">With some caveats</div>
        </button>
        <button
          onClick={() => onRelevanceClick?.('challenges')}
          className={`p-4 rounded-lg transition-all cursor-pointer border-2 ${
            selectedRelevance === 'challenges'
              ? 'bg-red-50 border-red-500 shadow-md'
              : 'bg-red-50 border-transparent hover:border-red-200 hover:shadow-sm'
          }`}
        >
          <div className="text-[32px] font-bold text-red-600 leading-none mb-1.5">{metrics.challenging}</div>
          <div className="text-[13px] font-semibold text-red-700 mb-0.5">Disagree</div>
          <div className="text-[11px] text-red-600 opacity-75">Challenge your view</div>
        </button>
        <button
          onClick={() => onRelevanceClick?.('emerging')}
          className={`p-4 rounded-lg transition-all cursor-pointer border-2 ${
            selectedRelevance === 'emerging'
              ? 'bg-violet-50 border-violet-500 shadow-md'
              : 'bg-violet-50 border-transparent hover:border-violet-200 hover:shadow-sm'
          }`}
        >
          <div className="text-[32px] font-bold text-violet-600 leading-none mb-1.5">{metrics.emerging}</div>
          <div className="text-[13px] font-semibold text-violet-700 mb-0.5">New Voices</div>
          <div className="text-[11px] text-violet-600 opacity-75">Emerging perspectives</div>
        </button>
      </div>

      {selectedRelevance && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-gray-700">
              Showing <strong className="text-emerald-700">
                {selectedRelevance === 'strong' && `${metrics.stronglyAligned} authors who agree`}
                {selectedRelevance === 'partial' && `${metrics.partiallyAligned} authors who partially agree`}
                {selectedRelevance === 'challenges' && `${metrics.challenging} authors who disagree`}
                {selectedRelevance === 'emerging' && `${metrics.emerging} new voices`}
              </strong> across {metrics.domains.length} {metrics.domains.length === 1 ? 'domain' : 'domains'}:
            </span>
            <button
              onClick={() => onRelevanceClick?.(selectedRelevance)}
              className="text-[12px] text-gray-500 hover:text-gray-800 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              Clear
            </button>
          </div>
          {metrics.domains.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metrics.domains.map((domainName) => (
                <button
                  key={domainName}
                  onClick={() => handleDomainClick(domainName)}
                  className="px-2.5 py-1 bg-white border border-gray-300 rounded-md text-[12px] text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-colors"
                >
                  {domainName}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {opportunities.length > 0 && !selectedRelevance && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-[13px] mb-2 text-blue-900">💡 White Space Opportunities</h3>
          <ul className="text-[13px] text-blue-800 space-y-1">
            {opportunities.map((opp, index) => (
              <li key={index}>• {opp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


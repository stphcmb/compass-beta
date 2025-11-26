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
    totalAuthors: 0
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
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Positioning Snapshot</h2>
        <button 
          onClick={handleSave}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <Bookmark className="w-4 h-4" />
          {isSaved ? 'Saved!' : 'Save Search'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <button
          onClick={() => onRelevanceClick?.('strong')}
          className={`text-center p-4 rounded transition-all cursor-pointer hover:shadow-md ${
            selectedRelevance === 'strong'
              ? 'bg-green-100 ring-2 ring-green-500 shadow-lg'
              : 'bg-green-50 hover:bg-green-100'
          }`}
        >
          <div className="text-2xl font-bold text-green-700">{metrics.stronglyAligned}</div>
          <div className="text-sm text-gray-600">Strong Alignment</div>
          {selectedRelevance === 'strong' && (
            <div className="text-xs text-green-600 mt-1">✓ Filtering</div>
          )}
        </button>
        <button
          onClick={() => onRelevanceClick?.('partial')}
          className={`text-center p-4 rounded transition-all cursor-pointer hover:shadow-md ${
            selectedRelevance === 'partial'
              ? 'bg-yellow-100 ring-2 ring-yellow-500 shadow-lg'
              : 'bg-yellow-50 hover:bg-yellow-100'
          }`}
        >
          <div className="text-2xl font-bold text-yellow-700">{metrics.partiallyAligned}</div>
          <div className="text-sm text-gray-600">Partial Alignment</div>
          {selectedRelevance === 'partial' && (
            <div className="text-xs text-yellow-600 mt-1">✓ Filtering</div>
          )}
        </button>
        <button
          onClick={() => onRelevanceClick?.('challenges')}
          className={`text-center p-4 rounded transition-all cursor-pointer hover:shadow-md ${
            selectedRelevance === 'challenges'
              ? 'bg-red-100 ring-2 ring-red-500 shadow-lg'
              : 'bg-red-50 hover:bg-red-100'
          }`}
        >
          <div className="text-2xl font-bold text-red-700">{metrics.challenging}</div>
          <div className="text-sm text-gray-600">Challenge Your View</div>
          {selectedRelevance === 'challenges' && (
            <div className="text-xs text-red-600 mt-1">✓ Filtering</div>
          )}
        </button>
        <button
          onClick={() => onRelevanceClick?.('emerging')}
          className={`text-center p-4 rounded transition-all cursor-pointer hover:shadow-md ${
            selectedRelevance === 'emerging'
              ? 'bg-purple-100 ring-2 ring-purple-500 shadow-lg'
              : 'bg-purple-50 hover:bg-purple-100'
          }`}
        >
          <div className="text-2xl font-bold text-purple-700">{metrics.emerging}</div>
          <div className="text-sm text-gray-600">Emerging Views</div>
          {selectedRelevance === 'emerging' && (
            <div className="text-xs text-purple-600 mt-1">✓ Filtering</div>
          )}
        </button>
      </div>

      {opportunities.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold text-sm mb-2">💡 White Space Opportunities</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {opportunities.map((opp, index) => (
              <li key={index}>• {opp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


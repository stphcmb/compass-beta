'use client'

import { useState, useEffect } from 'react'
import { Bookmark, Users } from 'lucide-react'
import { getPositioningMetrics } from '@/lib/api/thought-leaders'

interface PositioningSnapshotProps {
  query: string
  domain?: string
  camp?: string
}

export default function PositioningSnapshot({ query, domain, camp }: PositioningSnapshotProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalCamps: 0,
    totalAuthors: 0,
    domains: [] as string[]
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const metricsData = await getPositioningMetrics(query, domain)
        setMetrics({
          totalCamps: metricsData.totalCamps,
          totalAuthors: metricsData.totalAuthors,
          domains: metricsData.domains
        })
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

  // Plain language domain explanations
  const getDomainExplanation = (domainName: string): string => {
    const explanations: Record<string, string> = {
      'AI Technical Capabilities': 'AI capabilities & limitations',
      'AI & Society': 'AI impact on society',
      'Enterprise AI Adoption': 'how companies adopt AI',
      'AI Governance & Oversight': 'AI regulation & governance',
      'Future of Work': 'AI impact on jobs & work'
    }
    return explanations[domainName] || domainName
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
        <div className="text-center text-gray-600">Loading...</div>
      </div>
    )
  }

  // Build domain text for display
  const getDomainText = () => {
    if (metrics.domains.length === 0) return ''
    if (metrics.domains.length === 1) return getDomainExplanation(metrics.domains[0])
    if (metrics.domains.length === 2) {
      return `${getDomainExplanation(metrics.domains[0])} and ${getDomainExplanation(metrics.domains[1])}`
    }
    return `${getDomainExplanation(metrics.domains[0])}, ${getDomainExplanation(metrics.domains[1])}, and ${metrics.domains.length - 2} more`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Author count */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-[24px] font-bold text-gray-900 leading-none">{metrics.totalAuthors}</div>
              <div className="text-[13px] text-gray-500">
                {metrics.totalAuthors === 1 ? 'author' : 'authors'} found
                {metrics.domains.length > 0 && ` in ${getDomainText()}`}
              </div>
            </div>
          </div>
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
    </div>
  )
}

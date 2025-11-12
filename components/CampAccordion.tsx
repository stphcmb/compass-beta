'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import AuthorCard from './AuthorCard'
import { getCampsWithAuthors } from '@/lib/api/thought-leaders'

interface CampAccordionProps {
  query: string
  domain?: string
  camp?: string
  relevanceFilter?: string | null
}

export default function CampAccordion({ query, domain, camp, relevanceFilter }: CampAccordionProps) {
  const [expandedCamp, setExpandedCamp] = useState<string | null>(null)
  const [camps, setCamps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCamps = async () => {
      console.log('🎯 CampAccordion: Fetching camps with query:', query, 'domain:', domain, 'relevanceFilter:', relevanceFilter)
      setLoading(true)
      try {
        const data = await getCampsWithAuthors(query, domain)
        console.log('🎯 CampAccordion: Received camps:', data.length)
        setCamps(data)
      } catch (error) {
        console.error('Error fetching camps:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCamps()
  }, [query, domain, relevanceFilter])

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">
        Loading camps and thought leaders...
      </div>
    )
  }

  if (camps.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
        No camps found. Try adjusting your search or domain filters.
      </div>
    )
  }

  const getDomainBadgeClass = (domain: string) => {
    const classes: Record<string, string> = {
      'Technology': 'bg-blue-100 text-blue-700',
      'Society': 'bg-purple-100 text-purple-700',
      'Business': 'bg-green-100 text-green-700',
      'Workers': 'bg-orange-100 text-orange-700',
      'Policy & Regulation': 'bg-red-100 text-red-700'
    }
    return classes[domain] || 'bg-gray-100 text-gray-700'
  }

  // Filter camps based on relevance
  const filteredCamps = relevanceFilter
    ? camps.filter(camp =>
        camp.authors.some((author: any) =>
          author.relevance?.toLowerCase().includes(relevanceFilter.toLowerCase())
        )
      ).map(camp => ({
        ...camp,
        // Only show authors matching the filter
        authors: camp.authors.filter((author: any) =>
          author.relevance?.toLowerCase().includes(relevanceFilter.toLowerCase())
        ),
        authorCount: camp.authors.filter((author: any) =>
          author.relevance?.toLowerCase().includes(relevanceFilter.toLowerCase())
        ).length
      }))
    : camps

  return (
    <div className="space-y-4">
      {relevanceFilter && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="text-sm text-blue-800">
            Filtering by: <span className="font-semibold capitalize">{relevanceFilter} alignment</span>
          </div>
          <div className="text-xs text-blue-600">
            Showing {filteredCamps.reduce((sum, camp) => sum + camp.authorCount, 0)} authors across {filteredCamps.length} camps
          </div>
        </div>
      )}

      {filteredCamps.map((camp) => {
        const isExpanded = expandedCamp === camp.id
        const hasRelevanceMatch = relevanceFilter && camp.authors.length > 0

        return (
          <div
            key={camp.id}
            className={`bg-white rounded-lg shadow transition-all ${
              hasRelevanceMatch ? 'ring-2 ring-blue-400 ring-offset-2' : ''
            }`}
          >
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
              onClick={() => setExpandedCamp(isExpanded ? null : camp.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <h3 className="font-bold text-lg">{camp.name}</h3>
                  {camp.domain && (
                    <span className={`px-2 py-1 ${getDomainBadgeClass(camp.domain)} text-xs rounded-full`}>
                      {camp.domain}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  {camp.positionSummary}
                </p>
              </div>
              <div className="text-sm text-gray-500">{camp.authorCount} authors</div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                {camp.authors && camp.authors.length > 0 ? (
                  <>
                    {camp.authors.map((author: any) => (
                      <AuthorCard key={author.id} author={author} query={query} />
                    ))}
                    {camp.authors.length > 3 && (
                      <div className="text-center py-2">
                        <button className="text-sm text-gray-600 hover:text-gray-900">
                          Show {camp.authorCount - camp.authors.length} more authors in this camp
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No authors found for this camp
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}


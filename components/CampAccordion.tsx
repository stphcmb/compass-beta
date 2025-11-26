'use client'

import { useState, useEffect } from 'react'
import AuthorCard from './AuthorCard'
import { getCampsWithAuthors } from '@/lib/api/thought-leaders'

interface CampAccordionProps {
  query: string
  domain?: string
  camp?: string
  relevanceFilter?: string | null
}

export default function CampAccordion({ query, domain, camp, relevanceFilter }: CampAccordionProps) {
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
    <div className="space-y-8">
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
        const hasRelevanceMatch = relevanceFilter && camp.authors.length > 0

        return (
          <div
            key={camp.id}
            className={`transition-all ${
              hasRelevanceMatch ? 'ring-2 ring-blue-400 ring-offset-2 rounded-lg' : ''
            }`}
          >
            {/* Camp Header - Always Visible */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                {camp.domain && (
                  <span className={`px-3 py-1 ${getDomainBadgeClass(camp.domain)} text-sm font-semibold rounded-full`}>
                    {camp.domain}
                  </span>
                )}
                <h3 className="font-bold text-2xl text-gray-800">
                  {camp.name}
                </h3>
                <span className="text-sm text-gray-500 ml-auto">
                  {camp.authorCount} {camp.authorCount === 1 ? 'author' : 'authors'}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {camp.positionSummary}
              </p>
            </div>

            {/* Authors Grid - Always Visible */}
            <div className="grid grid-cols-1 gap-4 pb-6 border-b border-gray-200 last:border-b-0">
              {camp.authors && camp.authors.length > 0 ? (
                camp.authors.map((author: any) => (
                  <AuthorCard key={author.id} author={author} query={query} />
                ))
              ) : (
                <div className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                  No authors found for this camp
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}


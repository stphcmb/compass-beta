'use client'

import { useState, useEffect } from 'react'
import AuthorCard from './AuthorCard'
import { getCampsWithAuthors, getAllCampsByDomain } from '@/lib/api/thought-leaders'

interface CampAccordionProps {
  query: string
  domain?: string
  domains?: string[]
  camp?: string
  camps?: string[]
  authors?: string[]
  relevanceFilter?: string | null
}

// Domain icons mapping
const domainIcons: Record<string, JSX.Element> = {
  'AI Technical Capabilities': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4"></path>
      <path d="m6.8 14-3.5 2"></path>
      <path d="m20.7 16-3.5-2"></path>
      <path d="M6.8 10 3.3 8"></path>
      <path d="m20.7 8-3.5 2"></path>
      <path d="m9 22 3-8 3 8"></path>
      <path d="M8 22h8"></path>
      <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.4"></path>
      <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4"></path>
    </svg>
  ),
  'AI Governance & Oversight': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
    </svg>
  ),
  'AI & Society': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
      <path d="M2 12h20"></path>
    </svg>
  ),
  'Enterprise AI Adoption': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
      <path d="M9 22v-4h6v4"></path>
      <path d="M8 6h.01"></path>
      <path d="M16 6h.01"></path>
      <path d="M12 6h.01"></path>
      <path d="M12 10h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 10h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 10h.01"></path>
      <path d="M8 14h.01"></path>
    </svg>
  ),
  'Future of Work': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  )
}

// Domain questions
const domainQuestions: Record<string, string> = {
  'AI Technical Capabilities': 'What\'s technically possible with AI and what are its limits?',
  'AI Governance & Oversight': 'Who should control AI development and how fast should we regulate?',
  'AI & Society': 'What are AI\'s consequences for truth, knowledge, and social cohesion?',
  'Enterprise AI Adoption': 'How should organizations integrate AI into their operations?',
  'Future of Work': 'How will AI affect jobs, skills, and the workforce?'
}

export default function CampAccordion({
  query,
  domain,
  domains = [],
  camp,
  camps: campFilter = [],
  authors: authorFilter = [],
  relevanceFilter
}: CampAccordionProps) {
  const [camps, setCamps] = useState<any[]>([])
  const [allCampsByDomain, setAllCampsByDomain] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [selectedCampPerDomain, setSelectedCampPerDomain] = useState<Record<string, string>>({})
  const [expandedAuthors, setExpandedAuthors] = useState<Record<string, boolean>>({})
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({})

  // Helper function to get relevance badge styling based on filter type
  const getRelevanceBadgeStyles = (filter: string | null) => {
    if (!filter) return ''
    const filterLower = filter.toLowerCase()
    if (filterLower.includes('strong')) return 'bg-emerald-100 text-emerald-700 border-emerald-300'
    if (filterLower.includes('partial')) return 'bg-amber-100 text-amber-700 border-amber-300'
    if (filterLower.includes('challenge')) return 'bg-red-100 text-red-700 border-red-300'
    if (filterLower.includes('emerging')) return 'bg-violet-100 text-violet-700 border-violet-300'
    return 'bg-gray-100 text-gray-700 border-gray-300'
  }

  useEffect(() => {
    const fetchCamps = async () => {
      console.log('🎯 CampAccordion: Fetching camps with query:', query, 'domain:', domain, 'relevanceFilter:', relevanceFilter)
      setLoading(true)
      try {
        // Fetch both: all camps for structure AND camps with authors for filtering
        const [allCamps, filteredCamps] = await Promise.all([
          getAllCampsByDomain(),
          getCampsWithAuthors(query, domain)
        ])

        console.log('🎯 CampAccordion: All camps:', Object.keys(allCamps).length, 'domains')
        console.log('🎯 CampAccordion: Filtered camps:', filteredCamps.length)

        setAllCampsByDomain(allCamps)
        setCamps(filteredCamps)
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

  // Don't show "no camps" message if we have allCampsByDomain - we'll show empty camps
  if (camps.length === 0 && Object.keys(allCampsByDomain).length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-600">
        No camps found. Try adjusting your search or domain filters.
      </div>
    )
  }

  // Filter camps based on all filters
  let filteredCamps = camps

  // Filter by domains (multi-select)
  if (domains.length > 0) {
    filteredCamps = filteredCamps.filter(camp =>
      domains.includes(camp.domain)
    )
  }

  // Filter by camps (multi-select)
  if (campFilter.length > 0) {
    filteredCamps = filteredCamps.filter(camp =>
      campFilter.includes(camp.name)
    )
  }

  // Filter by authors (multi-select) and relevance
  filteredCamps = filteredCamps
    .map(camp => {
      let filteredAuthors = camp.authors

      // Filter by author names
      if (authorFilter.length > 0) {
        filteredAuthors = filteredAuthors.filter((author: any) =>
          authorFilter.includes(author.name)
        )
      }

      // Filter by relevance
      if (relevanceFilter) {
        filteredAuthors = filteredAuthors.filter((author: any) =>
          author.relevance?.toLowerCase().includes(relevanceFilter.toLowerCase())
        )
      }

      return {
        ...camp,
        authors: filteredAuthors,
        authorCount: filteredAuthors.length
      }
    })
    .filter(camp => camp.authors.length > 0) // Only show camps with matching authors

  // Group filtered camps by domain
  const filteredCampsByDomain = filteredCamps.reduce((acc, camp) => {
    if (!acc[camp.domain]) {
      acc[camp.domain] = []
    }
    acc[camp.domain].push(camp)
    return acc
  }, {} as Record<string, any[]>)

  // For each domain that has authors, merge with all camps to show complete slider
  const campsByDomain = Object.keys(filteredCampsByDomain).reduce((acc, domainName) => {
    const allDomainCamps = allCampsByDomain[domainName] || []
    const filteredDomainCamps = filteredCampsByDomain[domainName] || []

    // Create a map of camp IDs to filtered camps for quick lookup
    const filteredCampMap = filteredDomainCamps.reduce((map: Record<string, any>, camp: any) => {
      map[camp.id] = camp
      return map
    }, {} as Record<string, any>)

    // Merge: use filtered camp data if available, otherwise use empty camp from allCampsByDomain
    const mergedCamps = allDomainCamps.map(baseCamp => {
      const filteredCamp = filteredCampMap[baseCamp.id]
      if (filteredCamp) {
        return filteredCamp
      }
      return baseCamp // Empty camp with 0 authors
    })

    acc[domainName] = mergedCamps
    return acc
  }, {} as Record<string, any[]>)

  const handleCampClick = (domainName: string, campId: string) => {
    setSelectedCampPerDomain(prev => ({
      ...prev,
      [domainName]: prev[domainName] === campId ? '' : campId
    }))
  }

  const toggleExpandAuthors = (domainName: string) => {
    setExpandedAuthors(prev => ({
      ...prev,
      [domainName]: !prev[domainName]
    }))
  }

  const toggleExpandDomain = (domainName: string) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domainName]: !prev[domainName]
    }))
  }

  return (
    <div className="space-y-6">
      {Object.entries(campsByDomain).map(([domainName, domainCamps]) => {
        const camps = domainCamps as any[]
        const selectedCamp = selectedCampPerDomain[domainName]
        const isExpanded = expandedAuthors[domainName]
        const isDomainExpanded = expandedDomains[domainName] !== false // Default to expanded

        // Calculate which camps have filtered authors (for badge display)
        const campsWithFilteredAuthors = relevanceFilter
          ? camps.filter((c: any) => c.authorCount > 0)
          : []

        // Get all authors for this domain, filtered by selected camp if any
        let allAuthors = selectedCamp
          ? camps.find(c => c.id === selectedCamp)?.authors || []
          : camps.flatMap(c => c.authors)

        // Smart sorting: Sort by relevance type, then by camp name
        const relevanceOrder: Record<string, number> = {
          'strong': 1,      // Agree first
          'partial': 2,     // Partially Agree second
          'emerging': 3,    // New Voices third
          'challenges': 4   // Disagree last
        }

        allAuthors = allAuthors.sort((a: any, b: any) => {
          // Primary sort: by relevance type
          const aRelevance = a.relevance?.toLowerCase() || ''
          const bRelevance = b.relevance?.toLowerCase() || ''
          const aOrder = relevanceOrder[aRelevance] || 999
          const bOrder = relevanceOrder[bRelevance] || 999

          if (aOrder !== bOrder) {
            return aOrder - bOrder
          }

          // Secondary sort: by author name alphabetically
          return (a.name || '').localeCompare(b.name || '')
        })

        const displayAuthors = isExpanded ? allAuthors : allAuthors.slice(0, 3)
        const hasMore = allAuthors.length > 3

        return (
          <div key={domainName} id={`domain-${domainName.toLowerCase().replace(/\s+/g, '-')}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Domain Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-5 h-5 text-gray-600">{domainIcons[domainName]}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-[15px] font-semibold text-gray-900">{domainName}</h3>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-full">
                        {camps.reduce((sum: number, c: any) => sum + c.authorCount, 0)} authors
                      </span>
                    </div>
                    <button
                      onClick={() => toggleExpandDomain(domainName)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label={isDomainExpanded ? 'Collapse section' : 'Expand section'}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${isDomainExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    {domainQuestions[domainName]}
                  </p>

                  {/* Filtered Camp Badges - only when relevance filter is active */}
                  {relevanceFilter && campsWithFilteredAuthors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Camps with matching authors
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {campsWithFilteredAuthors.map((camp: any) => (
                          <span
                            key={camp.id}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${getRelevanceBadgeStyles(relevanceFilter)}`}
                          >
                            {camp.name} · {camp.authorCount}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Collapsible Content */}
            {isDomainExpanded && (
              <>
                {/* Viewpoint Slider */}
                {camps.length > 0 && (
                  <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="text-[12px] font-medium text-gray-600 mb-3">
                      {domainName === 'AI Technical Capabilities' && 'Where do thinkers stand on AI\'s path forward?'}
                      {domainName === 'AI Governance & Oversight' && 'How much regulation does AI need?'}
                      {domainName === 'AI & Society' && 'How should we approach AI\'s social impact?'}
                      {domainName === 'Enterprise AI Adoption' && 'What should lead: technology or people?'}
                      {domainName === 'Future of Work' && 'Will AI replace or augment workers?'}
                    </div>
                    <div className="flex rounded-lg overflow-hidden bg-gray-200">
                      {camps.map((camp: any, idx: number) => (
                        <button
                          key={camp.id}
                          onClick={() => handleCampClick(domainName, camp.id)}
                          className={`flex-1 flex flex-col items-center justify-center transition-all relative py-3 px-2 ${
                            selectedCamp === camp.id ? 'ring-2 ring-inset ring-gray-900' : ''
                          } ${
                            idx === 0 ? 'bg-gradient-to-b from-pink-200 to-pink-300' :
                            idx === camps.length - 1 ? 'bg-gradient-to-b from-green-200 to-green-300' :
                            'bg-gradient-to-b from-amber-200 to-amber-300'
                          }`}
                          style={{
                            borderRight: idx < camps.length - 1 ? '1px solid rgba(255,255,255,0.5)' : 'none'
                          }}
                        >
                          <span className="text-[12px] font-semibold text-gray-900 text-center leading-tight mb-1">
                            {camp.name}
                          </span>
                          <span className="text-[10px] text-gray-600 leading-snug text-center mb-1">
                            {camp.positionSummary}
                          </span>
                          <span className="text-[10px] text-gray-700 font-medium">
                            {camp.authorCount} {camp.authorCount === 1 ? 'author' : 'authors'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Authors Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3.5">
                    {displayAuthors.map((author: any) => (
                      <AuthorCard key={author.id} author={author} query={query} />
                    ))}
                  </div>

                  {/* Show More Button */}
                  {hasMore && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => toggleExpandAuthors(domainName)}
                        className="px-5 py-2.5 border border-gray-300 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                      >
                        {isExpanded ? 'Show Less' : `Show ${allAuthors.length - 3} More Authors`}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}


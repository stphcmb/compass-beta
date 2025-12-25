'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Users, ThumbsUp, ThumbsDown } from 'lucide-react'
import AuthorCard, { authorQuoteMatchesSearch } from './AuthorCard'
import { TERMINOLOGY, getCampLabel } from '@/lib/constants/terminology'
import { getDomainColor } from './DiscourseMap'

const MAX_AUTHORS_BEFORE_SCROLL = 4
const AUTHORS_SCROLL_HEIGHT = 480 // pixels

// Domain descriptions for onboarding (keys match DOMAIN_MAP in thought-leaders.ts)
const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  'AI Technical Capabilities': 'The technical trajectory of AI—debates on scaling, architectures, and paths to more capable systems.',
  'AI & Society': 'How AI reshapes jobs, creativity, and daily life—perspectives on the human impact of intelligent machines.',
  'Enterprise AI Adoption': 'AI in the enterprise—perspectives on adoption, transformation, and competitive advantage.',
  'AI Governance & Oversight': 'Who controls AI and how—perspectives on regulation, safety standards, and global coordination.',
  'Future of Work': 'How AI changes employment, skills, and the workplace—perspectives on automation and human potential.',
}

// Perspective stance data - natural editorial voice, keys match database labels exactly
const PERSPECTIVE_STANCES: Record<string, { belief: string; themes: string[] }> = {
  // Domain 1: AI Technical Capabilities
  'Scaling Will Deliver': {
    belief: 'More data, more compute, more capability. The path to transformative AI runs through scaling what already works.',
    themes: ['Scale', 'Progress']
  },
  'Needs New Approaches': {
    belief: 'Current architectures have fundamental limits. The next breakthrough requires new paradigms, not just bigger models.',
    themes: ['Innovation', 'Research']
  },
  // Domain 2: AI & Society
  'Safety First': {
    belief: 'Advanced AI could pose existential threats. Safety isn\'t a feature request—it\'s the priority before we scale further.',
    themes: ['Safety', 'Risk']
  },
  'Democratize Fast': {
    belief: 'AI\'s benefits should reach everyone quickly. Broad access and rapid deployment outweigh hypothetical risks.',
    themes: ['Access', 'Speed']
  },
  // Domain 3: Enterprise AI Adoption
  'Co-Evolution': {
    belief: 'Technology and organizations must evolve together. AI transformation requires changing culture, not just tools.',
    themes: ['Culture', 'Change']
  },
  'Technology Leads': {
    belief: 'Deploy the tech first, let organizations adapt. Technical capabilities drive business transformation.',
    themes: ['Tech-First', 'Innovation']
  },
  'Business Whisperers': {
    belief: 'Start with the business problem, not the technology. AI succeeds when it solves real operational pain points.',
    themes: ['Business', 'ROI']
  },
  'Tech Builders': {
    belief: 'Build robust AI infrastructure now. The companies with the best technical foundations will win.',
    themes: ['Infrastructure', 'Engineering']
  },
  // Domain 4: AI Governance & Oversight
  'Adaptive Governance': {
    belief: 'Regulation must evolve with the technology. Rigid rules will either stifle innovation or become obsolete.',
    themes: ['Flexible', 'Evolving']
  },
  'Innovation First': {
    belief: 'Move fast, regulate later. Premature rules will stifle progress and hand leadership to less cautious players.',
    themes: ['Innovation', 'Competition']
  },
  'Regulatory Interventionist': {
    belief: 'Guardrails before growth. Strong oversight must be in place before AI capabilities advance further.',
    themes: ['Policy', 'Oversight']
  },
  // Domain 5: Future of Work
  'Displacement Realist': {
    belief: 'Automation will reshape labor markets dramatically. Many jobs will disappear, and policy must prepare for this shift.',
    themes: ['Labor', 'Disruption']
  },
  'Human–AI Collaboration': {
    belief: 'The future isn\'t humans versus machines—it\'s humans with machines. AI works best when it amplifies what people do.',
    themes: ['Collaboration', 'Augmentation']
  },
}

// Helper to generate a stance blurb from perspective name and domain
function generateStanceBlurb(name: string, domain: string, positionSummary?: string): string {
  // Prefer our editorial content first
  const stanceData = PERSPECTIVE_STANCES[name]
  if (stanceData) {
    return stanceData.belief
  }

  // Fall back to database positionSummary if no editorial content
  if (positionSummary) {
    const cleaned = positionSummary.replace(/^(these authors |they )?(believe |argue |think )?/i, '')
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  }

  return `Perspectives on how ${domain.toLowerCase()} shapes the future of AI.`
}

// Get themes for a perspective
function getThemes(name: string): string[] {
  return PERSPECTIVE_STANCES[name]?.themes || []
}


interface CampAccordionProps {
  query: string
  domain?: string
  domains?: string[]
  camp?: string
  camps?: string[]
  authors?: string[]
  onCampsLoaded?: (camps: any[]) => void
  scrollToCampId?: string | null
}

export default function CampAccordion({
  query,
  domain,
  domains = [],
  camp,
  camps: campFilter = [],
  authors: authorFilter = [],
  onCampsLoaded,
  scrollToCampId
}: CampAccordionProps) {
  const [camps, setCamps] = useState<any[]>([])
  const [expandedQueries, setExpandedQueries] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedCamps, setExpandedCamps] = useState<Record<string, boolean>>({})
  const campRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const fetchCamps = async () => {
      setLoading(true)

      // Check for cached results from sidebar navigation
      const pendingCache = sessionStorage.getItem('pending-search-cache')
      if (pendingCache) {
        try {
          const cached = JSON.parse(pendingCache)
          // Use cache if it's for the current query and less than 5 minutes old
          if (cached.query === query && cached.cachedResult && (Date.now() - cached.timestamp) < 5 * 60 * 1000) {
            const { camps: cachedCamps, expandedQueries: cachedExpandedQueries } = cached.cachedResult
            setCamps(cachedCamps)
            setExpandedQueries(cachedExpandedQueries)

            // Keep collapsed by default for quick scanning
            setExpandedCamps({})
            setLoading(false)

            // Clear the pending cache
            sessionStorage.removeItem('pending-search-cache')
            return
          }
        } catch (e) {
          // Ignore parse errors, fetch fresh
        }
        sessionStorage.removeItem('pending-search-cache')
      }

      try {
        const params = new URLSearchParams({
          ...(query && { query }),
          ...(domain && { domain })
        })

        const response = await fetch(`/api/camps?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch camps')
        }

        const data = await response.json()
        const { camps: fetchedCamps, expandedQueries: expandedQueriesData } = data

        setCamps(fetchedCamps)
        setExpandedQueries(expandedQueriesData)

        // Cache results for saved searches
        if (query) {
          const cacheKey = `search-cache-${query}`
          localStorage.setItem(cacheKey, JSON.stringify({
            camps: fetchedCamps,
            expandedQueries: expandedQueriesData,
            timestamp: Date.now()
          }))
        }

        // Keep all camps collapsed by default for quick scanning
        setExpandedCamps({})

        // Notify parent of loaded camps
        if (onCampsLoaded) {
          onCampsLoaded(fetchedCamps)
        }
      } catch (error) {
        console.error('Error fetching camps:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCamps()
  }, [query, domain, onCampsLoaded])

  // Scroll to specific camp when requested
  useEffect(() => {
    if (scrollToCampId && campRefs.current[scrollToCampId]) {
      const element = campRefs.current[scrollToCampId]
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // Ensure it's expanded
        setExpandedCamps(prev => ({ ...prev, [scrollToCampId]: true }))
      }
    }
  }, [scrollToCampId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-gray-100 rounded w-2/3 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-40 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Filter camps
  let filteredCamps = camps

  if (domains.length > 0) {
    filteredCamps = filteredCamps.filter(camp => domains.includes(camp.domain))
  }

  if (campFilter.length > 0) {
    filteredCamps = filteredCamps.filter(camp => campFilter.includes(camp.name))
  }

  // Filter authors within camps
  filteredCamps = filteredCamps
    .map(camp => {
      let filteredAuthors = camp.authors

      if (authorFilter.length > 0) {
        filteredAuthors = filteredAuthors.filter((author: any) =>
          authorFilter.includes(author.name)
        )
      }

      return {
        ...camp,
        authors: filteredAuthors,
        authorCount: filteredAuthors.length
      }
    })
    .filter(camp => camp.authors.length > 0)

  if (filteredCamps.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-2">
          <Users className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
        <p className="text-gray-500 text-sm">Try adjusting your search terms</p>
      </div>
    )
  }

  const toggleCamp = (campId: string) => {
    setExpandedCamps(prev => ({
      ...prev,
      [campId]: !prev[campId]
    }))
  }

  // Group camps by domain for visual hierarchy
  const campsByDomain: Record<string, any[]> = filteredCamps.reduce((acc, camp) => {
    const domain = camp.domain || 'Other'
    if (!acc[domain]) acc[domain] = []
    acc[domain].push(camp)
    return acc
  }, {} as Record<string, any[]>)

  // Sort domains by total author count
  const sortedDomains = Object.entries(campsByDomain)
    .sort(([, campsA], [, campsB]) => {
      const countA = campsA.reduce((sum: number, c: any) => sum + c.authorCount, 0)
      const countB = campsB.reduce((sum: number, c: any) => sum + c.authorCount, 0)
      return countB - countA
    })
    .map(([domain]) => domain)

  return (
    <div className="space-y-6">
      {sortedDomains.map((domainName) => {
        const domainCamps = campsByDomain[domainName]
        const colors = getDomainColor(domainName)
        const domainAuthorCount = domainCamps.reduce((sum, c) => sum + c.authorCount, 0)

        // Sort camps within domain by author count
        const sortedDomainCamps = [...domainCamps].sort((a, b) => b.authorCount - a.authorCount)

        const domainDescription = DOMAIN_DESCRIPTIONS[domainName] || `Perspectives on ${domainName.toLowerCase()} and its implications for AI.`

        return (
          <div key={domainName} className="scroll-mt-4">
            {/* Domain Header - Compact sticky header */}
            <div
              className={`sticky top-0 z-10 mb-3 py-2 px-3 -mx-3 rounded-lg ${colors.bg}`}
              style={{ backgroundColor: colors.bgSolid || '#f3f4f6' }}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-6 rounded-full ${colors.accent || 'bg-gray-400'}`} />
                <h2 className={`text-base font-bold ${colors.text}`}>
                  {domainName}
                </h2>
                <span className="text-[11px] text-gray-500">
                  {domainCamps.length} perspectives · {domainAuthorCount} authors
                </span>
                <span className="text-[11px] text-gray-500 hidden sm:inline">
                  — {domainDescription}
                </span>
              </div>
            </div>

            {/* Perspectives within Domain */}
            <div className="space-y-2 ml-1 pl-3 border-l-2 border-gray-200">
              {sortedDomainCamps.map((camp) => {
                const isExpanded = expandedCamps[camp.id] === true
                const needsScroll = camp.authors.length > MAX_AUTHORS_BEFORE_SCROLL
                const campColors = getDomainColor(camp.domain)
                const themes = getThemes(camp.name)
                const stanceData = generateStanceBlurb(camp.name, camp.domain, camp.positionSummary)

                // Sort authors: those with matching quotes first, then alphabetically
                const sortedAuthors = [...camp.authors].sort((a: any, b: any) => {
                  const aMatches = authorQuoteMatchesSearch(a, query, expandedQueries || [])
                  const bMatches = authorQuoteMatchesSearch(b, query, expandedQueries || [])

                  if (aMatches && !bMatches) return -1
                  if (!aMatches && bMatches) return 1
                  return (a.name || '').localeCompare(b.name || '')
                })

                return (
                  <div
                    key={camp.id}
                    ref={(el) => { campRefs.current[camp.id] = el }}
                    id={`camp-${camp.id}`}
                    className={`bg-white rounded-xl border overflow-hidden transition-all ${
                      isExpanded ? 'border-gray-300 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Perspective Header - Compact */}
                    <button
                      onClick={() => toggleCamp(camp.id)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Single line: Name + Count + Stance */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-[15px] font-semibold text-gray-900">
                              {camp.name}
                            </h3>
                            <span className="text-[11px] text-gray-400">
                              {camp.authorCount} authors
                            </span>
                            {themes.length > 0 && (
                              <div className="flex items-center gap-1">
                                {themes.map((theme, idx) => (
                                  <span
                                    key={idx}
                                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${campColors.bg} ${campColors.text}`}
                                  >
                                    {theme}
                                  </span>
                                ))}
                              </div>
                            )}
                            <span className="text-[12px] text-gray-500 hidden sm:inline">
                              — {stanceData}
                            </span>
                          </div>
                        </div>

                        {/* Expand/Collapse Icon */}
                        <div className={`flex-shrink-0 p-1 rounded-full transition-colors ${
                          isExpanded ? 'bg-gray-100 text-gray-600' : 'text-gray-400'
                        }`}>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Authors Section - Scrollable with 1 author visible initially */}
                    {isExpanded && (
                      <div className="border-t border-gray-100">
                        {/* Authors List - Scrollable, shows ~1 author height initially */}
                        <div
                          className="p-4 bg-gray-50/50 space-y-3 overflow-y-auto"
                          style={{ maxHeight: '180px' }}
                        >
                          {sortedAuthors.map((author: any, index: number) => {
                            const quoteMatches = authorQuoteMatchesSearch(author, query, expandedQueries || [])
                            const matchingAuthorsCount = sortedAuthors.filter((a: any) =>
                              authorQuoteMatchesSearch(a, query, expandedQueries || [])
                            ).length
                            const showMismatchNote = Boolean(!quoteMatches && query && index >= matchingAuthorsCount)

                            return (
                              <AuthorCard
                                key={author.id}
                                author={author}
                                query={query}
                                expandedQueries={expandedQueries || undefined}
                                showMismatchNote={showMismatchNote}
                              />
                            )
                          })}
                        </div>

                        {/* Cross-Perspective Authors: Top 3 Supports & Challenges - Anchored */}
                        {(camp.challengingAuthors?.length > 0 || camp.supportingAuthors?.length > 0) && (
                          <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50/30">
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
                              {camp.supportingAuthors?.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <ThumbsUp size={11} className="text-green-600 flex-shrink-0" />
                                  <span className="text-gray-500">Also supports:</span>
                                  {camp.supportingAuthors.slice(0, 3).map((author: any) => (
                                    <Link
                                      key={author.id}
                                      href={`/authors/${author.id}`}
                                      className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                                    >
                                      {author.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                              {camp.challengingAuthors?.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <ThumbsDown size={11} className="text-red-600 flex-shrink-0" />
                                  <span className="text-gray-500">Challenges:</span>
                                  {camp.challengingAuthors.slice(0, 3).map((author: any) => (
                                    <Link
                                      key={author.id}
                                      href={`/authors/${author.id}`}
                                      className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition-colors"
                                    >
                                      {author.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

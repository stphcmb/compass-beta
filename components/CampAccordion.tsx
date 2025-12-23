'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Users } from 'lucide-react'
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

// Perspective stance data with full sentences and contrasts
const PERSPECTIVE_STANCES: Record<string, { belief: string; contrast?: string; themes: string[] }> = {
  'Scaling Will Deliver': {
    belief: 'These authors believe that scaling current approaches—bigger models, more data, more compute—will continue to drive AI capabilities forward.',
    contrast: 'Unlike those who see fundamental limits in current architectures, they expect incremental progress to yield transformative results.',
    themes: ['Scale', 'Progress']
  },
  'Needs New Approaches': {
    belief: 'These authors believe that current AI architectures have fundamental limits and that breakthroughs require entirely new paradigms.',
    contrast: 'Unlike scaling optimists, they argue that more compute alone won\'t solve AI\'s core challenges.',
    themes: ['Innovation', 'Research']
  },
  'Cautious Optimism': {
    belief: 'These authors believe AI progress is real and beneficial, but requires careful governance and realistic expectations.',
    contrast: 'Unlike both extreme optimists and doomers, they advocate for measured, evidence-based approaches.',
    themes: ['Balanced', 'Pragmatic']
  },
  'Existential Risk': {
    belief: 'These authors believe advanced AI poses serious, potentially existential risks to humanity that demand urgent attention.',
    contrast: 'Unlike those focused on near-term benefits, they prioritize long-term safety over rapid deployment.',
    themes: ['Safety', 'Risk']
  },
  'Job Displacement': {
    belief: 'These authors believe AI will fundamentally reshape labor markets, displacing many workers and requiring systemic responses.',
    contrast: 'Unlike human-AI collaboration optimists, they see automation as a disruptive force requiring policy intervention.',
    themes: ['Labor', 'Disruption']
  },
  'Human-AI Collaboration': {
    belief: 'These authors believe the future lies in augmentation, not replacement—humans and AI working together to achieve more.',
    contrast: 'Unlike displacement pessimists, they see AI as a tool that amplifies human capability rather than replacing it.',
    themes: ['Collaboration', 'Augmentation']
  },
  'Regulation First': {
    belief: 'These authors believe strong regulatory frameworks must be established before AI capabilities advance further.',
    contrast: 'Unlike innovation-first advocates, they prioritize safety guardrails over speed of development.',
    themes: ['Policy', 'Safety']
  },
  'Innovation First': {
    belief: 'These authors believe excessive regulation will stifle beneficial AI development and cede leadership to less cautious actors.',
    contrast: 'Unlike regulation-first advocates, they argue that premature rules will do more harm than good.',
    themes: ['Innovation', 'Competition']
  },
  'AI-First Transformation': {
    belief: 'These authors believe enterprises must fundamentally restructure around AI to remain competitive.',
    contrast: 'Unlike incremental adopters, they advocate for bold, organization-wide AI integration.',
    themes: ['Enterprise', 'Strategy']
  },
  'Pragmatic Integration': {
    belief: 'These authors believe AI adoption should be measured and focused on proven use cases with clear ROI.',
    contrast: 'Unlike AI-first maximalists, they favor practical, incremental deployment over wholesale transformation.',
    themes: ['Practical', 'ROI']
  },
}

// Helper to generate a stance blurb from perspective name and domain
function generateStanceBlurb(name: string, domain: string, positionSummary?: string): { belief: string; contrast?: string } {
  if (positionSummary) {
    return { belief: `These authors believe ${positionSummary.charAt(0).toLowerCase()}${positionSummary.slice(1)}` }
  }

  const stanceData = PERSPECTIVE_STANCES[name]
  if (stanceData) {
    return { belief: stanceData.belief, contrast: stanceData.contrast }
  }

  return { belief: `These authors share perspectives on ${domain.toLowerCase()} and its implications for AI development.` }
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
    <div className="space-y-10">
      {sortedDomains.map((domainName) => {
        const domainCamps = campsByDomain[domainName]
        const colors = getDomainColor(domainName)
        const domainAuthorCount = domainCamps.reduce((sum, c) => sum + c.authorCount, 0)

        // Sort camps within domain by author count
        const sortedDomainCamps = [...domainCamps].sort((a, b) => b.authorCount - a.authorCount)

        const domainDescription = DOMAIN_DESCRIPTIONS[domainName] || `Perspectives on ${domainName.toLowerCase()} and its implications for AI.`

        return (
          <div key={domainName} className="scroll-mt-4">
            {/* Domain Header - Sticky for context while scrolling */}
            <div
              className={`sticky top-0 z-10 mb-4 py-3 px-4 -mx-4 rounded-lg ${colors.bg}`}
              style={{ backgroundColor: colors.bgSolid || '#f3f4f6' }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-8 rounded-full ${colors.accent || 'bg-gray-400'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className={`text-lg font-bold ${colors.text}`}>
                      {domainName}
                    </h2>
                    <span className="text-xs text-gray-500 font-medium">
                      {domainCamps.length} {domainCamps.length === 1 ? 'perspective' : 'perspectives'} · {domainAuthorCount} authors
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">
                    {domainDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Perspectives within Domain */}
            <div className="space-y-3 ml-1 pl-4 border-l-3 border-gray-200">
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
                    {/* Perspective Header */}
                    <button
                      onClick={() => toggleCamp(camp.id)}
                      className="w-full text-left p-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Perspective Name with Author Count */}
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-[17px] font-semibold text-gray-900">
                              {camp.name}
                            </h3>
                            <span className="text-xs text-gray-400 font-medium">
                              {camp.authorCount} {camp.authorCount === 1 ? 'author' : 'authors'}
                            </span>
                          </div>

                          {/* Belief Statement */}
                          <p className="text-[13px] text-gray-700 leading-relaxed mb-1.5">
                            {stanceData.belief}
                          </p>

                          {/* Contrast Statement - Italicized for distinction */}
                          {stanceData.contrast && (
                            <p className="text-[12px] text-gray-500 leading-relaxed italic mb-2">
                              {stanceData.contrast}
                            </p>
                          )}

                          {/* Theme Chips - Always show for consistency */}
                          <div className="flex items-center gap-1.5 mt-2">
                            {themes.length > 0 ? (
                              <>
                                {themes.map((theme, idx) => (
                                  <span
                                    key={idx}
                                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${campColors.bg} ${campColors.text}`}
                                  >
                                    {theme}
                                  </span>
                                ))}
                              </>
                            ) : (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${campColors.bg} ${campColors.text}`}>
                                {camp.domain.split(' ')[0]}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expand/Collapse Icon */}
                        <div className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${
                          isExpanded ? 'bg-gray-100 text-gray-600' : 'text-gray-400'
                        }`}>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Authors Section */}
                    {isExpanded && (
                      <div className="border-t border-gray-100">
                        {/* Authors List - Scrollable if many authors */}
                        <div
                          className={`p-4 bg-gray-50/50 space-y-3 ${needsScroll ? 'overflow-y-auto' : ''}`}
                          style={needsScroll ? { maxHeight: `${AUTHORS_SCROLL_HEIGHT}px` } : undefined}
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

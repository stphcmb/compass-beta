'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp, Users, ThumbsUp, ThumbsDown, Layers } from 'lucide-react'
import AuthorCard, { authorQuoteMatchesSearch } from './AuthorCard'
import { TERMINOLOGY, getCampLabel } from '@/lib/constants/terminology'
import { getDomainColor } from './DiscourseMap'
import { useAuthorPanel } from '@/contexts/AuthorPanelContext'

const MAX_AUTHORS_BEFORE_SCROLL = 4
const AUTHORS_SCROLL_HEIGHT = 480 // pixels

// Domain descriptions as framing questions (keys match DOMAIN_MAP in thought-leaders.ts)
const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  'AI Technical Capabilities': 'What technical path leads to transformative AI?',
  'AI & Society': 'How should AI reshape daily life and human potential?',
  'Enterprise AI Adoption': 'How should organizations integrate AI for competitive advantage?',
  'AI Governance & Oversight': 'Who should control AI and how should it be regulated?',
  'Future of Work': 'How will AI transform employment, skills, and the workplace?',
}

// Perspective stance data - thought-provoking questions, keys match database labels exactly
const PERSPECTIVE_STANCES: Record<string, { stance: string; themes: string[] }> = {
  // Domain 1: AI Technical Capabilities
  'Scaling Will Deliver': {
    stance: 'What if more data and compute is all we need? The path to transformative AI may run through scaling what already works.',
    themes: ['Scale', 'Progress']
  },
  'Needs New Approaches': {
    stance: 'What if current architectures have fundamental limits? The next breakthrough may require new paradigms, not just bigger models.',
    themes: ['Innovation', 'Research']
  },
  // Domain 2: AI & Society
  'Safety First': {
    stance: 'What if advanced AI poses existential threats? Perhaps safety isn\'t a feature request—it\'s the priority before we scale further.',
    themes: ['Safety', 'Risk']
  },
  'Democratize Fast': {
    stance: 'What if AI\'s benefits should reach everyone quickly? Perhaps broad access and rapid deployment outweigh hypothetical risks.',
    themes: ['Access', 'Speed']
  },
  // Domain 3: Enterprise AI Adoption
  'Co-Evolution': {
    stance: 'What if technology and organizations must evolve together? AI transformation may require changing culture, not just tools.',
    themes: ['Culture', 'Change']
  },
  'Technology Leads': {
    stance: 'What if we deploy the tech first and let organizations adapt? Technical capabilities may drive business transformation.',
    themes: ['Tech-First', 'Innovation']
  },
  'Business Whisperers': {
    stance: 'What if we start with the business problem, not the technology? AI may succeed best when it solves real operational pain points.',
    themes: ['Business', 'ROI']
  },
  'Tech Builders': {
    stance: 'What if robust AI infrastructure is the key? The companies with the best technical foundations may win.',
    themes: ['Infrastructure', 'Engineering']
  },
  // Domain 4: AI Governance & Oversight
  'Adaptive Governance': {
    stance: 'What if regulation must evolve with the technology? Rigid rules may either stifle innovation or become obsolete.',
    themes: ['Flexible', 'Evolving']
  },
  'Innovation First': {
    stance: 'What if we move fast and regulate later? Premature rules may stifle progress and hand leadership to less cautious players.',
    themes: ['Innovation', 'Competition']
  },
  'Regulatory Interventionist': {
    stance: 'What if guardrails must come before growth? Strong oversight may need to be in place before AI capabilities advance further.',
    themes: ['Policy', 'Oversight']
  },
  // Domain 5: Future of Work
  'Displacement Realist': {
    stance: 'What if automation reshapes labor markets dramatically? Many jobs may disappear, and policy must prepare for this shift.',
    themes: ['Labor', 'Disruption']
  },
  'Human–AI Collaboration': {
    stance: 'What if the future isn\'t humans versus machines—but humans with machines? AI may work best when it amplifies what people do.',
    themes: ['Collaboration', 'Augmentation']
  },
}

// Helper to get stance blurb from perspective name
function getStanceBlurb(name: string, domain: string, positionSummary?: string): string {
  const stanceData = PERSPECTIVE_STANCES[name]
  if (stanceData) {
    return stanceData.stance
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
  const { openPanel } = useAuthorPanel()
  const [camps, setCamps] = useState<any[]>([])
  const [expandedQueries, setExpandedQueries] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedCamps, setExpandedCamps] = useState<Record<string, boolean>>({})
  const [collapsedDomains, setCollapsedDomains] = useState<Record<string, boolean>>({})
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
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}
        >
          <Users className="w-7 h-7 text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching perspectives</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-4 leading-relaxed">
          {query
            ? `We couldn't find any perspectives matching "${query}". Try different keywords or browse all perspectives.`
            : domain
              ? `No perspectives found in the "${domain}" domain. Try removing the filter to see all perspectives.`
              : 'No perspectives are currently available. Check back soon for new content.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          {query && (
            <a
              href="/explore"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Browse all perspectives
            </a>
          )}
          {domain && (
            <button
              onClick={() => window.location.href = '/explore'}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>
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
    <div className="space-y-4">
      {sortedDomains.map((domainName) => {
        const domainCamps = campsByDomain[domainName]
        const colors = getDomainColor(domainName)
        const domainAuthorCount = domainCamps.reduce((sum, c) => sum + c.authorCount, 0)

        // Sort camps within domain by author count
        const sortedDomainCamps = [...domainCamps].sort((a, b) => b.authorCount - a.authorCount)

        const domainDescription = DOMAIN_DESCRIPTIONS[domainName] || `Perspectives on ${domainName.toLowerCase()} and its implications for AI.`
        const isDomainCollapsed = collapsedDomains[domainName] === true

        return (
          <div key={domainName} className="scroll-mt-4">
            {/* Domain Header - Light pastel background with dark readable text */}
            <button
              onClick={() => setCollapsedDomains(prev => ({ ...prev, [domainName]: !prev[domainName] }))}
              className="sticky top-0 z-10 mb-1.5 py-2 px-3 -mx-3 rounded-lg w-[calc(100%+24px)] text-left cursor-pointer hover:opacity-95 transition-opacity"
              style={{
                backgroundColor: colors.bgLight || '#f0f0ff',
                borderLeft: `4px solid ${colors.bgSolid || '#6366f1'}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold" style={{ color: colors.textDark || '#1e3a5f' }}>
                  {domainName}
                </h2>
                {/* Stats chips */}
                <span
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium"
                  style={{ backgroundColor: colors.bgSolid, color: 'white' }}
                >
                  <Layers className="w-3 h-3" />
                  {domainCamps.length}
                </span>
                <span
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium"
                  style={{ backgroundColor: colors.bgSolid, color: 'white' }}
                >
                  <Users className="w-3 h-3" />
                  {domainAuthorCount}
                </span>
                {/* Chevron */}
                <div className="ml-auto">
                  {isDomainCollapsed ? (
                    <ChevronDown className="w-4 h-4" style={{ color: colors.textDark || '#1e3a5f' }} />
                  ) : (
                    <ChevronUp className="w-4 h-4" style={{ color: colors.textDark || '#1e3a5f' }} />
                  )}
                </div>
              </div>
              {/* Domain framing question */}
              <p className="text-[13px] mt-1" style={{ color: colors.textDark || '#1e3a5f', opacity: 0.85, lineHeight: '1.5' }}>
                {domainDescription}
              </p>
            </button>

            {/* Perspectives within Domain */}
            {!isDomainCollapsed && (
            <div className="space-y-1.5 ml-1 pl-3 border-l-2 border-gray-200">
              {sortedDomainCamps.map((camp) => {
                const isExpanded = expandedCamps[camp.id] === true
                const needsScroll = camp.authors.length > MAX_AUTHORS_BEFORE_SCROLL
                const campColors = getDomainColor(camp.domain)
                const themes = getThemes(camp.name)
                const stanceBlurb = getStanceBlurb(camp.name, camp.domain, camp.positionSummary)

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
                    {/* Perspective Header - Clean with question framing */}
                    <button
                      onClick={() => toggleCamp(camp.id)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {/* Perspective name */}
                            <h3 className="text-[15px] font-semibold text-gray-900">
                              {camp.name}
                            </h3>
                            {/* Theme chips */}
                            {themes.length > 0 && (
                              <div className="flex items-center gap-1">
                                {themes.map((theme, idx) => (
                                  <span
                                    key={idx}
                                    className={`text-[11px] px-2 py-0.5 rounded font-medium ${campColors.bg} ${campColors.text}`}
                                  >
                                    {theme}
                                  </span>
                                ))}
                              </div>
                            )}
                            {/* Author count chip */}
                            <span
                              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600"
                            >
                              <Users className="w-3 h-3" />
                              {camp.authorCount}
                            </span>
                          </div>
                          {/* Stance blurb - thought-provoking question with em-dash */}
                          <p className="text-[13px] text-gray-500 mt-1" style={{ lineHeight: '1.5' }}>
                            — {stanceBlurb}
                          </p>
                        </div>

                        {/* Expand/Collapse Icon */}
                        <div className={`flex-shrink-0 p-1 rounded transition-colors ${
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
                          className="p-3 bg-gray-50/50 space-y-2 overflow-y-auto"
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
                          <div className="border-t border-gray-100 px-3 py-2 bg-gray-50/30">
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
                              {camp.supportingAuthors?.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <ThumbsUp size={11} className="text-green-600 flex-shrink-0" />
                                  <span className="text-gray-500">Also supports:</span>
                                  {camp.supportingAuthors.slice(0, 3).map((author: any) => (
                                    <button
                                      key={author.id}
                                      onClick={() => openPanel(author.id)}
                                      className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                                    >
                                      {author.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                              {camp.challengingAuthors?.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <ThumbsDown size={11} className="text-red-600 flex-shrink-0" />
                                  <span className="text-gray-500">Challenges:</span>
                                  {camp.challengingAuthors.slice(0, 3).map((author: any) => (
                                    <button
                                      key={author.id}
                                      onClick={() => openPanel(author.id)}
                                      className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition-colors"
                                    >
                                      {author.name}
                                    </button>
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
            )}
          </div>
        )
      })}
    </div>
  )
}

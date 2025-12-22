'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Users, ChevronRight, Tag } from 'lucide-react'
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

// Helper to generate a stance blurb from perspective name and domain
function generateStanceBlurb(name: string, domain: string, positionSummary?: string): string {
  if (positionSummary) return positionSummary

  // Fallback blurbs based on common perspective names
  const blurbs: Record<string, string> = {
    'Scaling Will Deliver': 'Bigger models and more data will keep pushing AI capability forward.',
    'Needs New Approaches': 'Current architectures have fundamental limits; breakthroughs require new paradigms.',
    'Cautious Optimism': 'AI progress is real but requires careful governance and realistic expectations.',
    'Existential Risk': 'Advanced AI poses serious risks to humanity that demand urgent attention.',
    'Job Displacement': 'AI will fundamentally reshape labor markets, displacing many workers.',
    'Human-AI Collaboration': 'The future lies in augmentation, not replacement—humans and AI working together.',
    'Regulation First': 'Strong regulatory frameworks must be established before AI capabilities advance further.',
    'Innovation First': 'Excessive regulation will stifle beneficial AI development and cede leadership to others.',
  }

  return blurbs[name] || `Authors who share this perspective on ${domain.toLowerCase()}.`
}

// Extract key themes from camp data
function extractThemes(camp: any): string[] {
  const themes: string[] = []

  // Try to extract from camp properties
  if (camp.themes && Array.isArray(camp.themes)) {
    return camp.themes.slice(0, 2)
  }

  // Extract from name keywords
  const keywords = camp.name.toLowerCase().split(/\s+/)
  const themeKeywords: Record<string, string> = {
    'scaling': 'Scale',
    'risk': 'Risk',
    'safety': 'Safety',
    'job': 'Jobs',
    'regulation': 'Policy',
    'innovation': 'Innovation',
    'collaboration': 'Collaboration',
    'human': 'Human-Centric',
    'displacement': 'Labor',
    'existential': 'Existential',
    'optimism': 'Optimistic',
    'cautious': 'Measured',
  }

  for (const keyword of keywords) {
    if (themeKeywords[keyword] && themes.length < 2) {
      themes.push(themeKeywords[keyword])
    }
  }

  return themes
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

            // Auto-expand all camps
            const initialExpanded: Record<string, boolean> = {}
            cachedCamps.forEach((camp: any) => {
              initialExpanded[camp.id] = true
            })
            setExpandedCamps(initialExpanded)
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

        // Auto-expand all camps by default
        const initialExpanded: Record<string, boolean> = {}
        fetchedCamps.forEach((camp: any) => {
          initialExpanded[camp.id] = true
        })
        setExpandedCamps(initialExpanded)

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
          <div key={domainName}>
            {/* Domain Header */}
            <div className={`mb-4 pb-3 border-b-2 ${colors.border}`}>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full ${colors.bg} flex-shrink-0`} />
                <h2 className={`text-lg font-bold ${colors.text}`}>
                  {domainName}
                </h2>
                <span className="text-sm text-gray-400">
                  {domainCamps.length} {domainCamps.length === 1 ? 'perspective' : 'perspectives'} · {domainAuthorCount} authors
                </span>
              </div>
              <p className="mt-2 ml-8 text-sm text-gray-600 leading-relaxed">
                {domainDescription}
              </p>
            </div>

            {/* Perspectives within Domain */}
            <div className="space-y-4 ml-3 pl-5 border-l-2 border-gray-100">
              {sortedDomainCamps.map((camp) => {
                const isExpanded = expandedCamps[camp.id] !== false
                const needsScroll = camp.authors.length > MAX_AUTHORS_BEFORE_SCROLL
                const campColors = getDomainColor(camp.domain)
                const themes = extractThemes(camp)
                const stanceBlurb = generateStanceBlurb(camp.name, camp.domain, camp.positionSummary)

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
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md"
                  >
                    {/* Perspective Header */}
                    <button
                      onClick={() => toggleCamp(camp.id)}
                      className="w-full text-left p-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Breadcrumb: Domain > Perspective > Authors (count) */}
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <span className={`${campColors.text} font-medium`}>{camp.domain}</span>
                            <ChevronRight className="w-3 h-3 mx-1 text-gray-300" />
                            <span className="font-medium text-gray-700">{camp.name}</span>
                            <ChevronRight className="w-3 h-3 mx-1 text-gray-300" />
                            <span className="text-gray-500">
                              Authors ({camp.authorCount})
                            </span>
                          </div>

                          {/* Perspective Name */}
                          <h3 className="text-[17px] font-semibold text-gray-900 mb-1">
                            {camp.name}
                          </h3>

                          {/* Stance Blurb */}
                          <p className="text-[13px] text-gray-600 leading-relaxed mb-2">
                            {stanceBlurb}
                          </p>

                          {/* Theme Chips */}
                          {themes.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Tag className="w-3 h-3 text-gray-300" />
                              {themes.map((theme, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
                                >
                                  {theme}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Expand/Collapse Icon */}
                        <div className="flex-shrink-0 p-1 text-gray-400">
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

'use client'

import { useState, useEffect, useMemo, useRef, useDeferredValue, memo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Search, X, Users, PanelLeftClose, Layers } from 'lucide-react'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'
import { useAboutThoughtLeadersModal } from '@/components/AboutThoughtLeadersModal'

// Lazy load heavy components to reduce initial bundle size
// AuthorDetailPanel: ~120KB - only needed when user clicks an author
const AuthorDetailPanel = dynamic(
  () => import('@/components/AuthorDetailPanel'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading author details...</p>
        </div>
      </div>
    ),
  }
)

// AboutThoughtLeadersModal: ~15KB - only shows on first 2 visits
const AboutThoughtLeadersModal = dynamic(
  () => import('@/components/AboutThoughtLeadersModal').then(mod => ({ default: mod.AboutThoughtLeadersModal })),
  { ssr: false }
)

// WelcomeState: ~20KB - only shown when no author selected
const WelcomeState = dynamic(
  () => import('./components/WelcomeState'),
  {
    loading: () => (
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-100 rounded-lg" />
            <div className="h-32 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
    ),
  }
)

// Data fetching moved to Server Component (page.tsx)
import { DOMAINS, getDomainConfig, DOMAIN_LABEL_STYLES } from '@/lib/constants/domains'

// Layout constants - match Explore page sidebar
const SIDEBAR_WIDTH = 320

// Helper to get domain style for components
const getDomainStyle = (domain: string | null) => {
  const config = getDomainConfig(domain)
  return {
    name: config.name,
    short: config.shortName,
    bg: config.bgLight,
    text: config.text,
    border: config.border
  }
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Memoized author list item to prevent unnecessary re-renders
interface AuthorListItemProps {
  author: { id: string; name: string }
  isSelected: boolean
  domainStyle: { bg: string; text: string }
  onClick: () => void
  hoverBg?: string
}

const AuthorListItem = memo(function AuthorListItem({
  author,
  isSelected,
  domainStyle,
  onClick,
  hoverBg = '#f5f5f5'
}: AuthorListItemProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
        padding: '6px 8px 6px 12px', borderRadius: '4px', border: 'none',
        backgroundColor: isSelected ? domainStyle.bg : 'transparent',
        cursor: 'pointer', transition: 'all 60ms ease-out', textAlign: 'left'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = hoverBg
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <span style={{
        width: '6px', height: '6px', borderRadius: '50%',
        backgroundColor: domainStyle.text, flexShrink: 0
      }} />
      <span style={{
        fontSize: '13px', fontWeight: isSelected ? 600 : 400,
        color: isSelected ? domainStyle.text : 'var(--color-soft-black)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }}>
        {author.name}
      </span>
    </button>
  )
})

interface AuthorsClientViewProps {
  authorsWithDomains: Array<{
    author: any
    domains: string[]
    camps: string[]
  }>
}

export default function AuthorsClientView({ authorsWithDomains }: AuthorsClientViewProps) {
  const searchParams = useSearchParams()
  const authorFromUrl = searchParams.get('author')

  // Transform optimized server data into format expected by component
  const authors = authorsWithDomains.map(item => item.author)
  const authorDomainsMap = new Map(
    authorsWithDomains.map(item => [item.author.id, item.domains])
  )
  const authorCampsMap = new Map(
    authorsWithDomains.map(item => [item.author.id, item.camps])
  )

  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  // Defer search filtering to keep input responsive during large list updates
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [domainFilter, setDomainFilter] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // Open by default
  const [groupBy, setGroupBy] = useState<'alphabet' | 'domain' | 'recent' | 'favorites'>('alphabet')
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const domainRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [urlAuthorHandled, setUrlAuthorHandled] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  // Modal for teaching users about thought leaders
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useAboutThoughtLeadersModal()

  // Load favorite authors from localStorage
  const [favoriteAuthorNames, setFavoriteAuthorNames] = useState<string[]>([])
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem('favoriteAuthors')
        if (stored) {
          const favorites = JSON.parse(stored)
          setFavoriteAuthorNames(favorites.map((f: any) => f.name))
        }
      } catch (e) {
        console.error('Error loading favorites:', e)
      }
    }
    loadFavorites()

    // Listen for favorite changes
    const handleFavoriteChange = () => loadFavorites()
    window.addEventListener('favorite-author-added', handleFavoriteChange)
    window.addEventListener('favorite-author-removed', handleFavoriteChange)
    return () => {
      window.removeEventListener('favorite-author-added', handleFavoriteChange)
      window.removeEventListener('favorite-author-removed', handleFavoriteChange)
    }
  }, [])

  // No more data fetching needed - server provides data via props!

  // Handle author from URL query parameter
  useEffect(() => {
    if (authorFromUrl && authors.length > 0 && !urlAuthorHandled) {
      // Find the author by name (case-insensitive)
      const foundAuthor = authors.find(
        a => a.name.toLowerCase() === authorFromUrl.toLowerCase()
      )
      if (foundAuthor) {
        setSelectedAuthorId(foundAuthor.id)
        // Also set the search query to highlight the author in the list
        setSearchQuery(authorFromUrl)
      }
      setUrlAuthorHandled(true)
    }
  }, [authorFromUrl, authors, urlAuthorHandled])

  // Get author's primary domain (first domain in list)
  const getAuthorDomain = (authorId: string) => {
    const domains = authorDomainsMap.get(authorId) || []
    return domains.length > 0 ? domains[0] : null
  }

  // Get ALL domains an author has positions in
  const getAuthorDomains = (authorId: string): string[] => {
    return authorDomainsMap.get(authorId) || []
  }

  // Get author's camp stances
  const getAuthorCamps = (authorId: string): string[] => {
    return authorCampsMap.get(authorId) || []
  }

  // Handle author selection (memoized to prevent unnecessary re-renders)
  const handleAuthorClick = useCallback((authorId: string) => {
    setSelectedAuthorId(authorId)
  }, [])

  // Scroll to letter
  const scrollToLetter = (letter: string) => {
    const ref = letterRefs.current[letter]
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Scroll to domain
  const scrollToDomain = (domain: string) => {
    const ref = domainRefs.current[domain]
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Filter and group authors
  const { authorsByLetter, authorsByDomain, recentAuthors, allFavoriteAuthors, domainCounts, availableLetters, availableDomains, totalFiltered } = useMemo(() => {
    let filtered = authors

    // Apply search filter (using deferred value to keep input responsive)
    if (deferredSearchQuery) {
      const query = deferredSearchQuery.toLowerCase()
      filtered = filtered.filter(author =>
        author.name.toLowerCase().includes(query) ||
        author.header_affiliation?.toLowerCase().includes(query) ||
        author.primary_affiliation?.toLowerCase().includes(query)
      )
    }

    // Apply domain filter
    if (domainFilter) {
      filtered = filtered.filter(author => getAuthorDomain(author.id) === domainFilter)
    }

    // Group by letter (last name)
    const byLetter: Record<string, any[]> = {}
    ALPHABET.forEach(letter => { byLetter[letter] = [] })
    byLetter['#'] = [] // For non-alphabetic

    // Group by domain
    const byDomain: Record<string, any[]> = {}
    const counts: Record<string, number> = {}
    DOMAINS.forEach(d => {
      byDomain[d.name] = []
      counts[d.name] = 0
    })
    byDomain['Other'] = []
    counts['Other'] = 0

    // Sort by last name
    const sorted = [...filtered].sort((a, b) => {
      const aLast = a.name.split(' ').pop() || a.name
      const bLast = b.name.split(' ').pop() || b.name
      return aLast.localeCompare(bLast)
    })

    sorted.forEach(author => {
      // Group by letter
      const lastName = author.name.split(' ').pop() || author.name
      const letter = lastName[0]?.toUpperCase()
      if (letter && ALPHABET.includes(letter)) {
        byLetter[letter].push(author)
      } else {
        byLetter['#'].push(author)
      }

      // Group by domain
      const domain = getAuthorDomain(author.id) || 'Other'
      if (byDomain[domain]) {
        byDomain[domain].push(author)
      } else {
        byDomain['Other'].push(author)
      }
    })

    // Sort by recently added (created_at descending)
    const recent = [...filtered].sort((a, b) => {
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0
      return bDate - aDate
    })

    // Count all authors per domain
    authors.forEach(author => {
      const domain = getAuthorDomain(author.id) || 'Other'
      if (counts[domain] !== undefined) {
        counts[domain]++
      }
    })

    // Get available letters
    const available = ALPHABET.filter(letter => byLetter[letter].length > 0)
    if (byLetter['#'].length > 0) available.push('#')

    // Get available domains (those with authors)
    const availableDoms = DOMAINS.filter(d => byDomain[d.name]?.length > 0)
    if (byDomain['Other']?.length > 0) {
      availableDoms.push({ name: 'Other', shortName: 'Other', text: '#6b7280', bgLight: '#f3f4f6', border: '#d1d5db' } as any)
    }

    // Get all favorite authors from filtered list
    const allFavoriteAuthors = filtered.filter(a => favoriteAuthorNames.includes(a.name))

    return {
      authorsByLetter: byLetter,
      authorsByDomain: byDomain,
      recentAuthors: recent,
      allFavoriteAuthors,
      domainCounts: counts,
      availableLetters: available,
      availableDomains: availableDoms,
      totalFiltered: filtered.length
    }
  }, [authors, deferredSearchQuery, domainFilter, authorDomainsMap, favoriteAuthorNames])

  // Favorite and recent authors for welcome state
  const { favoriteAuthors, totalFavorites, recentAddedAuthors, totalRecent } = useMemo(() => {
    if (authors.length === 0) return { favoriteAuthors: [], totalFavorites: 0, recentAddedAuthors: [], totalRecent: 0 }

    // Get all favorite authors (match by name) - show up to 8 for horizontal scroll
    const allFavorites = authors.filter(a => favoriteAuthorNames.includes(a.name))
    const totalFavorites = allFavorites.length
    const favorites = allFavorites.slice(0, 8)

    // Get recent authors (excluding favorites) - show up to 8 for horizontal scroll
    const allRecent = [...authors]
      .filter(a => !favoriteAuthorNames.includes(a.name))
      .sort((a, b) => {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0
        return bDate - aDate
      })
    const totalRecent = allRecent.length
    const recent = allRecent.slice(0, 8)

    return { favoriteAuthors: favorites, totalFavorites, recentAddedAuthors: recent, totalRecent }
  }, [authors, favoriteAuthorNames])

  // Calculate margins for layout - match Explore page
  const actualSidebarWidth = sidebarCollapsed ? 0 : SIDEBAR_WIDTH
  const mainContentLeft = actualSidebarWidth

  // No loading state needed - server provides data immediately!
  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <Header sidebarCollapsed={true} />

      {/* Sidebar Expand Button - animated appearance (like Explore) */}
      <button
        onClick={() => setSidebarCollapsed(false)}
        className={`fixed top-20 z-20 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 ${
          sidebarCollapsed
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-2 pointer-events-none'
        }`}
        style={{
          left: '16px',
          transitionDelay: sidebarCollapsed ? '150ms' : '0ms'
        }}
        title="Expand author panel"
      >
        <Layers className="w-5 h-5 text-emerald-600" />
      </button>

      {/* Author Directory Sidebar - Fixed position (like Explore) */}
      <aside
        className="fixed top-16 h-[calc(100vh-64px)] border-r border-gray-200 z-10 overflow-hidden"
        style={{
          left: 0,
          width: sidebarCollapsed ? '0px' : `${SIDEBAR_WIDTH}px`,
          opacity: sidebarCollapsed ? 0 : 1,
          backgroundColor: 'var(--color-air-white)',
          transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease-out',
          transitionDelay: sidebarCollapsed ? '0ms' : '50ms'
        }}
      >
        <div
          className="h-full flex flex-col"
          style={{
            width: `${SIDEBAR_WIDTH}px`,
            transform: sidebarCollapsed ? 'translateX(-20px)' : 'translateX(0)',
            opacity: sidebarCollapsed ? 0 : 1,
            transition: 'transform 250ms ease-out, opacity 200ms ease-out',
            transitionDelay: sidebarCollapsed ? '0ms' : '100ms'
          }}
        >
          {/* Sidebar Header - matches DomainOverview styling */}
          <div
            className="flex-shrink-0 border-b border-emerald-100 relative"
            style={{ padding: '24px 16px 16px 22px' }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: 'linear-gradient(90deg, #059669 0%, rgba(5, 150, 105, 0.3) 100%)' }}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h2 className="text-[13px] font-semibold text-gray-900 uppercase tracking-wider">
                  Author Directory
                </h2>
              </div>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Collapse panel"
              >
                <PanelLeftClose className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <p className="text-[12px] text-gray-500 mt-1">
              {totalFiltered} thought leaders
            </p>
          </div>

          {/* Group toggle */}
          <div
            className="flex-shrink-0 border-b border-gray-100"
            style={{ padding: '12px 16px 12px 22px' }}
          >
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--color-pale-gray)',
              borderRadius: '8px',
              padding: '3px',
              gap: '2px'
            }}>
              <button
                onClick={() => setGroupBy('alphabet')}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: groupBy === 'alphabet' ? 'var(--color-air-white)' : 'transparent',
                  color: groupBy === 'alphabet' ? 'var(--color-quantum-navy)' : 'var(--color-mid-gray)',
                  cursor: 'pointer',
                  boxShadow: groupBy === 'alphabet' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 150ms ease'
                }}
              >
                A–Z
              </button>
              <button
                onClick={() => setGroupBy('domain')}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: groupBy === 'domain' ? 'var(--color-air-white)' : 'transparent',
                  color: groupBy === 'domain' ? 'var(--color-quantum-navy)' : 'var(--color-mid-gray)',
                  cursor: 'pointer',
                  boxShadow: groupBy === 'domain' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 150ms ease'
                }}
              >
                Domain
              </button>
              <button
                onClick={() => setGroupBy('recent')}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: groupBy === 'recent' ? 'var(--color-air-white)' : 'transparent',
                  color: groupBy === 'recent' ? 'var(--color-quantum-navy)' : 'var(--color-mid-gray)',
                  cursor: 'pointer',
                  boxShadow: groupBy === 'recent' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 150ms ease'
                }}
              >
                Recent
              </button>
              {favoriteAuthorNames.length > 0 && (
                <button
                  onClick={() => setGroupBy('favorites')}
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: groupBy === 'favorites' ? 'var(--color-air-white)' : 'transparent',
                    color: groupBy === 'favorites' ? '#f59e0b' : 'var(--color-mid-gray)',
                    cursor: 'pointer',
                    boxShadow: groupBy === 'favorites' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  ★ Fav
                </button>
              )}
            </div>
          </div>

          {/* Author list section */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', paddingLeft: '16px' }}>
            {/* Quick-jump sidebar */}
            <div style={{
              width: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              padding: '8px 6px',
              backgroundColor: 'transparent',
              overflowY: 'auto'
            }}>
              {groupBy === 'alphabet' ? (
                // A-Z quick-jump
                ALPHABET.map(letter => {
                  const hasAuthors = availableLetters.includes(letter)
                  return (
                    <button
                      key={letter}
                      onClick={() => hasAuthors && scrollToLetter(letter)}
                      disabled={!hasAuthors}
                      style={{
                        padding: '2px 0',
                        fontSize: '11px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        border: 'none',
                        background: 'none',
                        borderRadius: '3px',
                        cursor: hasAuthors ? 'pointer' : 'default',
                        color: hasAuthors ? 'var(--color-charcoal)' : '#e5e7eb',
                        transition: 'all 100ms ease-out'
                      }}
                      onMouseEnter={(e) => {
                        if (hasAuthors) {
                          e.currentTarget.style.backgroundColor = '#e0e7ff'
                          e.currentTarget.style.color = '#4f46e5'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = hasAuthors ? 'var(--color-charcoal)' : '#e5e7eb'
                      }}
                    >
                      {letter}
                    </button>
                  )
                })
              ) : groupBy === 'domain' ? (
                // Domain quick-jump with subdued dots
                availableDomains.map((domain: any) => (
                  <div
                    key={domain.name}
                    style={{ position: 'relative' }}
                  >
                    <button
                      onClick={() => scrollToDomain(domain.name)}
                      className="domain-dot-btn"
                      style={{
                        padding: '4px 0',
                        fontSize: '10px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        border: 'none',
                        background: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        color: DOMAIN_LABEL_STYLES.subdued.text,
                        transition: 'all 100ms ease-out',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = DOMAIN_LABEL_STYLES.subdued.bg
                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement
                        if (tooltip) tooltip.style.opacity = '1'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement
                        if (tooltip) tooltip.style.opacity = '0'
                      }}
                    >
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: DOMAIN_LABEL_STYLES.subdued.text
                      }} />
                    </button>
                    <div style={{
                      position: 'absolute',
                      left: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      marginLeft: '8px',
                      padding: '4px 8px',
                      backgroundColor: 'var(--color-charcoal)',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      opacity: 0,
                      transition: 'opacity 150ms ease',
                      pointerEvents: 'none',
                      zIndex: 10,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                    }}>
                      {domain.shortName || domain.name}
                    </div>
                  </div>
                ))
              ) : (
                // Recent view - single indicator
                <div style={{
                  padding: '4px 0',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--color-mid-gray)',
                  textAlign: 'center'
                }}>
                  ↓
                </div>
              )}
            </div>

            {/* Author list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 8px 8px' }}>
              {/* Empty state when no authors match */}
              {totalFiltered === 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px 16px',
                  textAlign: 'center',
                  height: '100%'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <Search style={{ width: '24px', height: '24px', color: '#9ca3af' }} />
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-soft-black)', marginBottom: '6px' }}>
                    No authors found
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-mid-gray)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {searchQuery
                      ? `No authors match "${searchQuery}"`
                      : domainFilter
                        ? `No authors in the ${domainFilter} domain`
                        : 'No authors available'}
                  </p>
                  {(searchQuery || domainFilter) && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setDomainFilter(null)
                      }}
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#4f46e5',
                        backgroundColor: '#eef2ff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}

              {totalFiltered > 0 && (groupBy === 'recent' ? (
                // Recent View - sorted by created_at
                <div>
                  <div style={{
                    padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: 'var(--color-mid-gray)',
                    backgroundColor: 'var(--color-pale-gray)', borderRadius: '4px',
                    marginBottom: '4px', position: 'sticky', top: 0, zIndex: 1
                  }}>
                    Recently Added
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    {recentAuthors.map((author: any) => {
                      const domain = getAuthorDomain(author.id)
                      const domainStyle = getDomainStyle(domain)
                      const isSelected = selectedAuthorId === author.id
                      const addedDate = author.created_at ? new Date(author.created_at) : null
                      const isNew = addedDate && (Date.now() - addedDate.getTime()) < 7 * 24 * 60 * 60 * 1000 // 7 days
                      return (
                        <button
                          key={author.id}
                          onClick={() => handleAuthorClick(author.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                            padding: '6px 8px 6px 12px', borderRadius: '4px', border: 'none',
                            backgroundColor: isSelected ? domainStyle.bg : 'transparent',
                            cursor: 'pointer', transition: 'all 60ms ease-out', textAlign: 'left'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = '#f5f5f5'
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          <span style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            backgroundColor: domainStyle.text, flexShrink: 0
                          }} />
                          <span style={{
                            fontSize: '13px', fontWeight: isSelected ? 600 : 400,
                            color: isSelected ? domainStyle.text : 'var(--color-soft-black)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            flex: 1
                          }}>
                            {author.name}
                          </span>
                          {isNew && (
                            <span style={{
                              fontSize: '10px', fontWeight: 600, color: '#059669',
                              backgroundColor: '#d1fae5', padding: '2px 6px', borderRadius: '10px'
                            }}>
                              NEW
                            </span>
                          )}
                          {addedDate && (
                            <span style={{
                              fontSize: '11px', color: 'var(--color-mid-gray)', flexShrink: 0
                            }}>
                              {addedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : groupBy === 'alphabet' ? (
                // A-Z View
                ALPHABET.map(letter => {
                  const letterAuthors = authorsByLetter[letter] || []
                  if (letterAuthors.length === 0) return null
                  return (
                    <div key={letter} ref={el => { letterRefs.current[letter] = el }}>
                      <div style={{
                        padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: 'var(--color-mid-gray)',
                        backgroundColor: 'var(--color-pale-gray)', borderRadius: '4px',
                        marginBottom: '4px', position: 'sticky', top: 0, zIndex: 1
                      }}>
                        {letter}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        {letterAuthors.map((author: any) => {
                          const domain = getAuthorDomain(author.id)
                          const domainStyle = getDomainStyle(domain)
                          const isSelected = selectedAuthorId === author.id
                          return (
                            <button
                              key={author.id}
                              onClick={() => handleAuthorClick(author.id)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                                padding: '6px 8px 6px 12px', borderRadius: '4px', border: 'none',
                                backgroundColor: isSelected ? domainStyle.bg : 'transparent',
                                cursor: 'pointer', transition: 'all 60ms ease-out', textAlign: 'left'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) e.currentTarget.style.backgroundColor = '#f5f5f5'
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                              }}
                            >
                              <span style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                backgroundColor: domainStyle.text, flexShrink: 0
                              }} />
                              <span style={{
                                fontSize: '13px', fontWeight: isSelected ? 600 : 400,
                                color: isSelected ? domainStyle.text : 'var(--color-soft-black)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                              }}>
                                {author.name}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              ) : groupBy === 'favorites' ? (
                // Favorites View
                <div>
                  <div style={{
                    padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: '#f59e0b',
                    backgroundColor: '#fef3c7', borderRadius: '4px',
                    marginBottom: '4px', position: 'sticky', top: 0, zIndex: 1,
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    <span>★</span> Your Favorites ({allFavoriteAuthors.length})
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    {allFavoriteAuthors.length > 0 ? allFavoriteAuthors.map((author: any) => {
                      const domain = getAuthorDomain(author.id)
                      const domainStyle = getDomainStyle(domain)
                      const isSelected = selectedAuthorId === author.id
                      return (
                        <button
                          key={author.id}
                          onClick={() => handleAuthorClick(author.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                            padding: '6px 8px 6px 12px', borderRadius: '4px', border: 'none',
                            backgroundColor: isSelected ? domainStyle.bg : 'transparent',
                            cursor: 'pointer', transition: 'all 60ms ease-out', textAlign: 'left'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = '#fef3c7'
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          <span style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            backgroundColor: domainStyle.text, flexShrink: 0
                          }} />
                          <span style={{
                            fontSize: '13px', fontWeight: isSelected ? 600 : 400,
                            color: isSelected ? domainStyle.text : 'var(--color-soft-black)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            flex: 1
                          }}>
                            {author.name}
                          </span>
                          <span style={{ color: '#f59e0b', fontSize: '12px' }}>★</span>
                        </button>
                      )
                    }) : (
                      <p style={{ fontSize: '13px', color: 'var(--color-mid-gray)', padding: '12px', textAlign: 'center' }}>
                        No favorites yet. Click the star icon on any author to add them.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // Domain View
                <>
                  {DOMAINS.map(domain => {
                    const domainAuthors = authorsByDomain[domain.name] || []
                    if (domainAuthors.length === 0) return null
                    return (
                      <div key={domain.name} ref={el => { domainRefs.current[domain.name] = el }} style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 12px', borderRadius: '6px',
                          backgroundColor: DOMAIN_LABEL_STYLES.subdued.bg, marginBottom: '6px',
                          position: 'sticky', top: 0, zIndex: 1
                        }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                            {domain.name}
                          </span>
                          <span style={{ fontSize: '12px', color: DOMAIN_LABEL_STYLES.subdued.text }}>
                            ({domainAuthors.length})
                          </span>
                        </div>
                        <div>
                          {domainAuthors.map((author: any) => {
                            const isSelected = selectedAuthorId === author.id
                            return (
                              <button
                                key={author.id}
                                onClick={() => handleAuthorClick(author.id)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                                  padding: '6px 8px 6px 12px', borderRadius: '4px', border: 'none',
                                  backgroundColor: isSelected ? DOMAIN_LABEL_STYLES.active.bg : 'transparent',
                                  cursor: 'pointer', transition: 'all 60ms ease-out', textAlign: 'left'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = '#f5f5f5'
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                                }}
                              >
                                <span style={{
                                  fontSize: '13px', fontWeight: isSelected ? 600 : 400,
                                  color: isSelected ? DOMAIN_LABEL_STYLES.active.text : 'var(--color-soft-black)',
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}>
                                  {author.name}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                  {/* Other/uncategorized */}
                  {(authorsByDomain['Other']?.length > 0) && (
                    <div ref={el => { domainRefs.current['Other'] = el }} style={{ marginBottom: '12px' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 12px', borderRadius: '6px',
                        backgroundColor: '#f3f4f6', marginBottom: '6px',
                        position: 'sticky', top: 0, zIndex: 1
                      }}>
                        <span style={{
                          width: '8px', height: '8px', borderRadius: '2px',
                          backgroundColor: '#6b7280'
                        }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Other</span>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          ({authorsByDomain['Other'].length})
                        </span>
                      </div>
                      <div>
                        {authorsByDomain['Other'].map((author: any) => {
                          const isSelected = selectedAuthorId === author.id
                          return (
                            <button
                              key={author.id}
                              onClick={() => handleAuthorClick(author.id)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                                padding: '6px 8px 6px 12px', borderRadius: '4px', border: 'none',
                                backgroundColor: isSelected ? '#f3f4f6' : 'transparent',
                                cursor: 'pointer', transition: 'all 60ms ease-out', textAlign: 'left'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) e.currentTarget.style.backgroundColor = '#f5f5f5'
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                              }}
                            >
                              <span style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                backgroundColor: '#6b7280', flexShrink: 0
                              }} />
                              <span style={{
                                fontSize: '13px', fontWeight: isSelected ? 600 : 400,
                                color: isSelected ? '#6b7280' : 'var(--color-soft-black)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                              }}>
                                {author.name}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - with marginLeft like Explore */}
      <main
        ref={mainRef}
        className="flex-1 mt-16 overflow-y-auto transition-all duration-300"
        style={{ marginLeft: `${mainContentLeft}px` }}
      >
        <div className="max-w-6xl mx-auto" style={{ padding: '24px' }}>
          {/* Page Header - same as Explore */}
          <PageHeader
            icon={<Users size={24} />}
            iconVariant="green"
            title="Thought Leaders"
            subtitle={`${totalFiltered} experts shaping AI discourse`}
            helpButton={{
              label: 'How it works',
              onClick: openModal
            }}
          />

          {/* Subheader - Framing Question */}
          <div className="text-center mb-6">
            <h3 className="text-[17px] font-semibold text-gray-900 mb-2">Who would you like to explore?</h3>
            <p className="text-[14px] text-gray-600">
              Browse by domain, search by name, or discover new perspectives.
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              width: '18px', height: '18px', color: 'var(--color-mid-gray)'
            }} />
            <input
              type="text"
              placeholder="Search by name or affiliation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 48px 14px 48px',
                borderRadius: '12px',
                border: '1px solid var(--color-light-gray)',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 150ms ease, box-shadow 150ms ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-velocity-blue)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'var(--color-pale-gray)', border: 'none', cursor: 'pointer',
                  padding: '6px', borderRadius: '50%', display: 'flex'
                }}
              >
                <X style={{ width: '14px', height: '14px', color: 'var(--color-mid-gray)' }} />
              </button>
            )}
          </div>

          {/* Domain Filter - hidden but functional */}
          <div style={{ display: 'none', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-mid-gray)',
              whiteSpace: 'nowrap'
            }}>
              Filter by domain:
            </span>
            {DOMAINS.map(d => {
              const isActive = domainFilter === d.name
              return (
                <button
                  key={d.name}
                  onClick={() => setDomainFilter(isActive ? null : d.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: isActive ? `2px solid ${DOMAIN_LABEL_STYLES.active.border}` : '1px solid #e5e7eb',
                    backgroundColor: isActive ? DOMAIN_LABEL_STYLES.active.bg : 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? DOMAIN_LABEL_STYLES.active.text : 'var(--color-charcoal)',
                    transition: 'all 150ms ease',
                    boxShadow: isActive ? `0 0 0 3px ${DOMAIN_LABEL_STYLES.active.bg}` : 'none',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = DOMAIN_LABEL_STYLES.subdued.bg
                      e.currentTarget.style.borderColor = DOMAIN_LABEL_STYLES.subdued.border
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'white'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }
                  }}
                >
                  {d.shortName}
                </button>
              )
            })}
            {domainFilter && (
              <button
                onClick={() => setDomainFilter(null)}
                style={{
                  fontSize: '12px',
                  color: 'var(--color-accent)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* Author Detail Panel or Welcome State */}
          <div style={{
            backgroundColor: 'var(--color-air-white)',
            border: '1px solid var(--color-light-gray)',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            minHeight: '400px',
            overflow: 'hidden'
          }}>
            {selectedAuthorId ? (
              <AuthorDetailPanel
                authorId={selectedAuthorId}
                isOpen={true}
                onClose={() => setSelectedAuthorId(null)}
                embedded={true}
              />
            ) : (
              <WelcomeState
                favoriteAuthors={favoriteAuthors}
                totalFavorites={totalFavorites}
                recentAddedAuthors={recentAddedAuthors}
                totalRecent={totalRecent}
                onAuthorClick={handleAuthorClick}
                onShowAllFavorites={() => {
                  setSidebarCollapsed(false)
                  setGroupBy('favorites')
                }}
                onShowAllRecent={() => {
                  setSidebarCollapsed(false)
                  setGroupBy('recent')
                }}
                getAuthorDomains={getAuthorDomains}
                getAuthorCamps={getAuthorCamps}
              />
            )}
          </div>
        </div>

        {/* Onboarding Modal */}
        <AboutThoughtLeadersModal isOpen={isModalOpen} onClose={closeModal} />
      </main>
    </div>
  )
}

// Component is now exported at the top where it's defined

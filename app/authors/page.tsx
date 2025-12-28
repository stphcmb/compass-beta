'use client'

import { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X, Users } from 'lucide-react'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import AuthorDetailPanel from '@/components/AuthorDetailPanel'
import EmptyState from '@/components/EmptyState'
import { AboutThoughtLeadersModal, useAboutThoughtLeadersModal } from '@/components/AboutThoughtLeadersModal'
import { getThoughtLeaders } from '@/lib/api/thought-leaders'
import { getCampsWithAuthors } from '@/lib/api/thought-leaders'
import { DOMAINS, getDomainConfig } from '@/lib/constants/domains'

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

function AuthorIndexPageContent() {
  const searchParams = useSearchParams()
  const authorFromUrl = searchParams.get('author')

  const [authors, setAuthors] = useState<any[]>([])
  const [camps, setCamps] = useState<any[]>([])
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(true) // Open by default
  const [groupBy, setGroupBy] = useState<'alphabet' | 'domain' | 'recent'>('alphabet')
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const domainRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [urlAuthorHandled, setUrlAuthorHandled] = useState(false)

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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [authorsData, result] = await Promise.all([
          getThoughtLeaders(),
          getCampsWithAuthors()
        ])
        setAuthors(authorsData)
        setCamps(result.camps)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle author from URL query parameter
  useEffect(() => {
    if (authorFromUrl && authors.length > 0 && !urlAuthorHandled) {
      // Find the author by name (case-insensitive)
      const foundAuthor = authors.find(
        a => a.name.toLowerCase() === authorFromUrl.toLowerCase()
      )
      if (foundAuthor) {
        setSelectedAuthorId(foundAuthor.id)
        setPanelOpen(true)
        // Also set the search query to highlight the author in the list
        setSearchQuery(authorFromUrl)
      }
      setUrlAuthorHandled(true)
    }
  }, [authorFromUrl, authors, urlAuthorHandled])

  // Get author's primary domain
  const getAuthorDomain = (authorId: string) => {
    const authorCamps = camps.filter(camp =>
      camp.authors?.some((a: any) => a.id === authorId)
    )
    return authorCamps.length > 0 ? authorCamps[0].domain : null
  }

  // Handle author selection - auto-open panel
  const handleAuthorClick = (authorId: string) => {
    setSelectedAuthorId(authorId)
    setPanelOpen(true)
  }

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
  const { authorsByLetter, authorsByDomain, recentAuthors, domainCounts, availableLetters, availableDomains, totalFiltered } = useMemo(() => {
    let filtered = authors

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
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

    return {
      authorsByLetter: byLetter,
      authorsByDomain: byDomain,
      recentAuthors: recent,
      domainCounts: counts,
      availableLetters: available,
      availableDomains: availableDoms,
      totalFiltered: filtered.length
    }
  }, [authors, searchQuery, domainFilter, camps])

  // Favorite and recent authors for welcome state
  const { favoriteAuthors, recentAddedAuthors } = useMemo(() => {
    if (authors.length === 0) return { favoriteAuthors: [], recentAddedAuthors: [] }

    // Get favorite authors (match by name)
    const favorites = authors.filter(a => favoriteAuthorNames.includes(a.name)).slice(0, 3)

    // Get recent authors (excluding favorites)
    const recent = [...authors]
      .filter(a => !favoriteAuthorNames.includes(a.name))
      .sort((a, b) => {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0
        return bDate - aDate
      })
      .slice(0, 3)

    return { favoriteAuthors: favorites, recentAddedAuthors: recent }
  }, [authors, favoriteAuthorNames])

  if (loading) {
    return (
      <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
        <Header sidebarCollapsed={true} />
        <main className="flex-1 mt-16 flex items-center justify-center">
          <div style={{ color: 'var(--color-mid-gray)', fontSize: '14px' }}>Loading authors...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <Header sidebarCollapsed={true} />
      <main
        className="flex-1 mt-16 overflow-hidden"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* Header Section - left panel filters + right panel header */}
        <div style={{ borderBottom: '1px solid var(--color-light-gray)', backgroundColor: 'var(--color-air-white)' }}>
          <div style={{ display: 'flex' }}>
            {/* Left side - Filters in header area */}
            <div style={{
              width: '320px',
              minWidth: '320px',
              padding: '24px 16px 16px 22px',
              borderRight: '1px solid var(--color-light-gray)'
            }}>
              {/* Author count */}
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-soft-black)' }}>
                  {totalFiltered} authors
                </span>
              </div>

              {/* Group toggle */}
              <div style={{
                display: 'flex',
                backgroundColor: 'var(--color-pale-gray)',
                borderRadius: '8px',
                padding: '3px',
                gap: '2px',
                marginBottom: '12px'
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
              </div>

              {/* Domain filter chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {DOMAINS.map(d => {
                  const isActive = domainFilter === d.name
                  return (
                    <button
                      key={d.name}
                      onClick={() => setDomainFilter(isActive ? null : d.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '5px 10px',
                        borderRadius: '14px',
                        border: isActive ? `1.5px solid ${d.text}` : '1px solid var(--color-light-gray)',
                        backgroundColor: isActive ? d.bgLight : 'var(--color-air-white)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: isActive ? d.text : 'var(--color-charcoal)',
                        transition: 'all 100ms ease-out'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = d.bgLight
                          e.currentTarget.style.borderColor = d.border
                          e.currentTarget.style.color = d.text
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'var(--color-air-white)'
                          e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                          e.currentTarget.style.color = 'var(--color-charcoal)'
                        }
                      }}
                    >
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: d.text
                      }} />
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
                      padding: '5px 6px'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Right side - PageHeader and search */}
            <div style={{ flex: 1, padding: '20px 16px' }}>
              <div style={{ maxWidth: '896px', margin: '0 auto' }}>
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

                {/* Search Bar - same style as Explore */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ position: 'relative' }}>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Split panel area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left panel - Author directory */}
          <div style={{
            width: '320px',
            minWidth: '320px',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid var(--color-light-gray)',
            backgroundColor: 'var(--color-air-white)'
          }}>
          {/* Scrollable list with quick-jump sidebar */}
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
                // Domain quick-jump with colored dots
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
                        color: domain.text,
                        transition: 'all 100ms ease-out',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = domain.bgLight
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
                        backgroundColor: domain.text
                      }} />
                    </button>
                    <div style={{
                      position: 'absolute',
                      left: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      marginLeft: '8px',
                      padding: '4px 8px',
                      backgroundColor: domain.text,
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
                          backgroundColor: domain.bgLight, marginBottom: '6px',
                          position: 'sticky', top: 0, zIndex: 1
                        }}>
                          <span style={{
                            width: '8px', height: '8px', borderRadius: '2px',
                            backgroundColor: domain.text
                          }} />
                          <span style={{ fontSize: '13px', fontWeight: 600, color: domain.text }}>
                            {domain.name}
                          </span>
                          <span style={{ fontSize: '12px', color: domain.text, opacity: 0.7 }}>
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
                                  backgroundColor: isSelected ? domain.bgLight : 'transparent',
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
                                  backgroundColor: domain.text, flexShrink: 0
                                }} />
                                <span style={{
                                  fontSize: '13px', fontWeight: isSelected ? 600 : 400,
                                  color: isSelected ? domain.text : 'var(--color-soft-black)',
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

          {/* Right panel - Author detail or welcome state */}
          <div style={{
            flex: 1,
            overflow: 'hidden',
            backgroundColor: 'var(--color-bone)',
            display: 'flex',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '896px',
              height: '100%',
              overflow: 'hidden',
              backgroundColor: 'var(--color-air-white)',
              border: '1px solid var(--color-light-gray)',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
            {selectedAuthorId ? (
              <AuthorDetailPanel
                authorId={selectedAuthorId}
                isOpen={true}
                onClose={() => setSelectedAuthorId(null)}
                embedded={true}
              />
            ) : (
              // Welcome state when no author selected
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px 32px',
                overflow: 'hidden'
              }}>
                {/* Compact header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--color-light-gray)'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Users size={18} style={{ color: '#059669' }} />
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--color-mid-gray)', margin: 0 }}>
                    Select an author from the list to view their positions, quotes, and evidence.
                  </p>
                </div>

                {/* Author sections */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 0 }}>
                  {/* Favorites section */}
                  {favoriteAuthors.length > 0 && (
                    <div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#f59e0b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span>★</span> Your Favorites
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {favoriteAuthors.map((author: any) => {
                          const domain = getAuthorDomain(author.id)
                          const domainStyle = getDomainStyle(domain)
                          return (
                            <button
                              key={author.id}
                              onClick={() => handleAuthorClick(author.id)}
                              style={{
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-light-gray)',
                                backgroundColor: 'var(--color-air-white)',
                                cursor: 'pointer',
                                transition: 'all 100ms ease-out',
                                textAlign: 'left'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = domainStyle.text
                                e.currentTarget.style.backgroundColor = domainStyle.bg
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                                e.currentTarget.style.backgroundColor = 'var(--color-air-white)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-soft-black)' }}>
                                  {author.name}
                                </span>
                              </div>
                              <div style={{
                                fontSize: '10px',
                                color: domainStyle.text,
                                fontWeight: 500,
                                marginBottom: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: domainStyle.text }} />
                                {domainStyle.short}
                              </div>
                              {author.notes && (
                                <div style={{
                                  fontSize: '11px',
                                  color: 'var(--color-mid-gray)',
                                  lineHeight: 1.35,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {author.notes}
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recently Added section */}
                  {recentAddedAuthors.length > 0 && (
                    <div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--color-mid-gray)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '8px'
                      }}>
                        Recently Added
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {recentAddedAuthors.map((author: any) => {
                          const domain = getAuthorDomain(author.id)
                          const domainStyle = getDomainStyle(domain)
                          return (
                            <button
                              key={author.id}
                              onClick={() => handleAuthorClick(author.id)}
                              style={{
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-light-gray)',
                                backgroundColor: 'var(--color-air-white)',
                                cursor: 'pointer',
                                transition: 'all 100ms ease-out',
                                textAlign: 'left'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = domainStyle.text
                                e.currentTarget.style.backgroundColor = domainStyle.bg
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                                e.currentTarget.style.backgroundColor = 'var(--color-air-white)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-soft-black)' }}>
                                  {author.name}
                                </span>
                              </div>
                              <div style={{
                                fontSize: '10px',
                                color: domainStyle.text,
                                fontWeight: 500,
                                marginBottom: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: domainStyle.text }} />
                                {domainStyle.short}
                              </div>
                              {author.notes && (
                                <div style={{
                                  fontSize: '11px',
                                  color: 'var(--color-mid-gray)',
                                  lineHeight: 1.35,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {author.notes}
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Onboarding Modal */}
        <AboutThoughtLeadersModal isOpen={isModalOpen} onClose={closeModal} />
      </main>
    </div>
  )
}

export default function AuthorIndexPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-page-bg)' }}>
        <div style={{ color: 'var(--color-mid-gray)' }}>Loading authors...</div>
      </div>
    }>
      <AuthorIndexPageContent />
    </Suspense>
  )
}

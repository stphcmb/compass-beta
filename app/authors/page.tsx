'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Search } from 'lucide-react'
import Header from '@/components/Header'
import { FeatureHint } from '@/components/FeatureHint'
import { getThoughtLeaders } from '@/lib/api/thought-leaders'
import { getCampsWithAuthors } from '@/lib/api/thought-leaders'
import { TERMINOLOGY } from '@/lib/constants/terminology'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

// Layout constants - must match Sidebar.tsx width
const SIDEBAR_WIDTH = 220

// Domain color mapping
const DOMAIN_COLORS: Record<string, string> = {
  'Technology': 'bg-blue-100 text-blue-700',
  'Society': 'bg-purple-100 text-purple-700',
  'Business': 'bg-green-100 text-green-700',
  'Policy & Regulation': 'bg-red-100 text-red-700',
  'Workers': 'bg-orange-100 text-orange-700',
}

type SortOption = 'alpha' | 'domain' | 'camp'

export default function AuthorIndexPage() {
  const [authors, setAuthors] = useState<any[]>([])
  const [camps, setCamps] = useState<any[]>([])
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('alpha')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (e: Event) => {
      const ev = e as CustomEvent<{ isCollapsed: boolean }>
      setSidebarCollapsed(ev.detail.isCollapsed)
    }

    // Check initial state - match Sidebar logic
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    const savedAnalyses = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
    const hasContent = savedSearches.length > 0 || savedAnalyses.length > 0
    const userPreference = localStorage.getItem('sidebarCollapsed')

    if (userPreference !== null) {
      setSidebarCollapsed(userPreference === 'true')
    } else {
      setSidebarCollapsed(!hasContent)
    }

    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
    return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
  }, [])

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
        if (authorsData.length > 0) {
          setSelectedAuthor(authorsData[0])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get author camps
  const getAuthorCamps = (authorId: string) => {
    return camps
      .filter(camp => camp.authors?.some((a: any) => a.id === authorId))
      .map(camp => ({ name: camp.name, domain: camp.domain }))
  }

  // Get author domain from camps
  const getAuthorDomain = (authorId: string) => {
    const authorCamps = getAuthorCamps(authorId)
    return authorCamps.length > 0 ? authorCamps[0].domain : null
  }

  // Helper to extract last name from full name
  const getLastName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/)
    return parts[parts.length - 1].toLowerCase()
  }

  // Format name as "Last, First"
  const formatNameLastFirst = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/)
    if (parts.length === 1) return fullName
    const lastName = parts[parts.length - 1]
    const firstName = parts.slice(0, -1).join(' ')
    return `${lastName}, ${firstName}`
  }

  // Sort by last name, then first name
  const sortByLastName = (a: any, b: any) => {
    const lastNameA = getLastName(a.name)
    const lastNameB = getLastName(b.name)
    if (lastNameA === lastNameB) {
      return a.name.localeCompare(b.name) // If last names match, sort by full name
    }
    return lastNameA.localeCompare(lastNameB)
  }

  // Filter and sort authors
  const processedAuthors = useMemo(() => {
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

    // Sort authors
    if (sortBy === 'alpha') {
      return filtered.sort(sortByLastName)
    } else if (sortBy === 'domain') {
      return filtered.sort((a, b) => {
        const domainA = getAuthorDomain(a.id) || 'zzz'
        const domainB = getAuthorDomain(b.id) || 'zzz'
        if (domainA === domainB) {
          return sortByLastName(a, b)
        }
        return domainA.localeCompare(domainB)
      })
    } else if (sortBy === 'camp') {
      return filtered.sort((a, b) => {
        const campsA = getAuthorCamps(a.id)
        const campsB = getAuthorCamps(b.id)
        const campNameA = campsA.length > 0 ? campsA[0].name : 'zzz'
        const campNameB = campsB.length > 0 ? campsB[0].name : 'zzz'
        if (campNameA === campNameB) {
          return sortByLastName(a, b)
        }
        return campNameA.localeCompare(campNameB)
      })
    }

    return filtered
  }, [authors, searchQuery, sortBy, camps])

  // Group authors by first letter of last name (for alphabetical view)
  const authorsByLetter = useMemo(() => {
    if (sortBy !== 'alpha') return {}

    const grouped: Record<string, any[]> = {}
    processedAuthors.forEach(author => {
      const lastName = getLastName(author.name)
      const letter = lastName[0].toUpperCase()
      if (!grouped[letter]) {
        grouped[letter] = []
      }
      grouped[letter].push(author)
    })
    return grouped
  }, [processedAuthors, sortBy])

  // Group authors by domain
  const authorsByDomain = useMemo(() => {
    if (sortBy !== 'domain') return {}

    const grouped: Record<string, any[]> = {}
    processedAuthors.forEach(author => {
      const domain = getAuthorDomain(author.id) || 'Unknown'
      if (!grouped[domain]) {
        grouped[domain] = []
      }
      grouped[domain].push(author)
    })
    return grouped
  }, [processedAuthors, sortBy])

  // Group authors by camp
  const authorsByCamp = useMemo(() => {
    if (sortBy !== 'camp') return {}

    const grouped: Record<string, any[]> = {}
    processedAuthors.forEach(author => {
      const authorCamps = getAuthorCamps(author.id)
      if (authorCamps.length === 0) {
        if (!grouped['No Camp']) {
          grouped['No Camp'] = []
        }
        grouped['No Camp'].push(author)
      } else {
        authorCamps.forEach(camp => {
          if (!grouped[camp.name]) {
            grouped[camp.name] = []
          }
          if (!grouped[camp.name].find(a => a.id === author.id)) {
            grouped[camp.name].push(author)
          }
        })
      }
    })
    return grouped
  }, [processedAuthors, sortBy])

  // Get available letters for A-Z navigation (based on last names)
  const availableLetters = useMemo(() => {
    const letters = new Set(authors.map(a => {
      const lastName = getLastName(a.name)
      return lastName[0].toUpperCase()
    }))
    return Array.from(letters).sort()
  }, [authors])

  const sidebarMargin = sidebarCollapsed ? 0 : SIDEBAR_WIDTH

  if (loading) {
    return (
      <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
        <Sidebar />
        <Header sidebarCollapsed={sidebarCollapsed} />
        <main
          className="flex-1 mt-16 flex items-center justify-center transition-all duration-300"
          style={{ marginLeft: `${sidebarMargin}px` }}
        >
          <div className="label" style={{ color: 'var(--color-mid-gray)' }}>Loading authors...</div>
        </main>
      </div>
    )
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Sidebar />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <main
        className="flex-1 mt-16 flex transition-all duration-300"
        style={{ marginLeft: `${sidebarMargin}px` }}
      >
        {/* Left Panel - Author List */}
        <div
          className="w-[360px] border-r flex flex-col overflow-hidden"
          style={{
            backgroundColor: 'var(--color-cloud)',
            borderColor: 'var(--color-light-gray)'
          }}
        >
          {/* Header with accent */}
          <div
            className="sticky top-0 border-b relative"
            style={{
              zIndex: 'var(--z-sticky)',
              backgroundColor: 'var(--color-cloud)',
              borderColor: 'var(--color-light-gray)',
              padding: '12px 16px'
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: 'linear-gradient(90deg, var(--color-accent) 0%, rgba(99, 102, 241, 0.3) 100%)' }}
            />
            {/* Search */}
            <div className="relative">
              <Search
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: 'var(--color-mid-gray)'
                }}
              />
              <input
                type="text"
                placeholder="Search authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none"
                style={{
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'white',
                  border: '1px solid var(--color-light-gray)',
                  fontSize: '14px',
                  color: 'var(--color-soft-black)',
                  transition: 'border-color 120ms ease-out'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                }}
              />
            </div>
          </div>

          {/* Compact Controls */}
          <div
            className="border-b"
            style={{
              padding: '10px 16px',
              backgroundColor: 'var(--color-cloud)',
              borderColor: 'var(--color-light-gray)'
            }}
          >
            {/* Sort and Stats Row */}
            <div className="flex items-center justify-between">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="cursor-pointer outline-none"
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'white',
                  border: '1px solid var(--color-light-gray)',
                  color: 'var(--color-soft-black)',
                  fontSize: '12px',
                  transition: 'border-color 120ms ease-out'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                }}
              >
                <option value="alpha">A-Z</option>
                <option value="domain">By Domain</option>
                <option value="camp">By {TERMINOLOGY.camp}</option>
              </select>
              <span style={{ fontSize: '11px', color: 'var(--color-mid-gray)' }}>
                {processedAuthors.length} authors
              </span>
            </div>

            {/* A-Z Navigation (only for alphabetical view) */}
            {sortBy === 'alpha' && (
              <div
                className="flex flex-wrap"
                style={{ gap: '2px', marginTop: '8px' }}
              >
                {alphabet.map(letter => {
                  const isAvailable = availableLetters.includes(letter)
                  return (
                    <button
                      key={letter}
                      disabled={!isAvailable}
                      onClick={() => {
                        if (isAvailable) {
                          const element = document.getElementById(`letter-${letter}`)
                          element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }}
                      className="flex items-center justify-center"
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '2px',
                        backgroundColor: isAvailable ? 'white' : 'transparent',
                        border: isAvailable ? '1px solid var(--color-light-gray)' : 'none',
                        color: isAvailable ? 'var(--color-soft-black)' : 'var(--color-light-gray)',
                        fontSize: '10px',
                        fontWeight: isAvailable ? 500 : 400,
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        transition: 'all 120ms ease-out'
                      }}
                      onMouseEnter={(e) => {
                        if (isAvailable) {
                          e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)'
                          e.currentTarget.style.borderColor = 'var(--color-accent)'
                          e.currentTarget.style.color = 'var(--color-accent)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isAvailable) {
                          e.currentTarget.style.backgroundColor = 'white'
                          e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                          e.currentTarget.style.color = 'var(--color-soft-black)'
                        }
                      }}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Author List */}
          <div className="flex-1 overflow-y-auto" style={{ padding: '12px' }}>
            {sortBy === 'alpha' && (
              <>
                {Object.keys(authorsByLetter).sort().map(letter => (
                  <div key={letter} id={`letter-${letter}`} style={{ marginBottom: '16px' }}>
                    <div
                      className="flex items-center gap-2"
                      style={{ marginBottom: '8px' }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--color-accent)',
                          width: '20px'
                        }}
                      >
                        {letter}
                      </span>
                      <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-light-gray)' }} />
                    </div>
                    {authorsByLetter[letter].map((author) => (
                      <AuthorCard
                        key={author.id}
                        author={author}
                        camps={getAuthorCamps(author.id)}
                        isSelected={selectedAuthor?.id === author.id}
                        onClick={() => setSelectedAuthor(author)}
                        formatName={formatNameLastFirst}
                      />
                    ))}
                  </div>
                ))}
              </>
            )}

            {sortBy === 'domain' && (
              <>
                {Object.keys(authorsByDomain).sort().map(domain => (
                  <div key={domain} style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--color-charcoal)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        paddingBottom: '6px',
                        marginBottom: '8px',
                        borderBottom: '1px solid var(--color-light-gray)'
                      }}
                    >
                      {domain}
                    </div>
                    {authorsByDomain[domain].map((author) => (
                      <AuthorCard
                        key={author.id}
                        author={author}
                        camps={getAuthorCamps(author.id)}
                        isSelected={selectedAuthor?.id === author.id}
                        onClick={() => setSelectedAuthor(author)}
                        formatName={formatNameLastFirst}
                      />
                    ))}
                  </div>
                ))}
              </>
            )}

            {sortBy === 'camp' && (
              <>
                {Object.keys(authorsByCamp).sort().map(camp => (
                  <div key={camp} style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--color-charcoal)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        paddingBottom: '6px',
                        marginBottom: '8px',
                        borderBottom: '1px solid var(--color-light-gray)'
                      }}
                    >
                      {camp}
                    </div>
                    {authorsByCamp[camp].map((author) => (
                      <AuthorCard
                        key={author.id}
                        author={author}
                        camps={getAuthorCamps(author.id)}
                        isSelected={selectedAuthor?.id === author.id}
                        onClick={() => setSelectedAuthor(author)}
                        formatName={formatNameLastFirst}
                      />
                    ))}
                  </div>
                ))}
              </>
            )}

            {processedAuthors.length === 0 && (
              <div className="text-center" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px', opacity: 0.5 }}>🔍</div>
                <div style={{ fontSize: '13px', color: 'var(--color-mid-gray)' }}>No authors found</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Author Profile */}
        <div
          className="flex-1 overflow-y-auto relative"
          style={{
            backgroundColor: 'var(--color-bone)'
          }}
        >
          {/* Subtle gradient accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '120px',
              background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.03) 0%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />

          <div className="relative z-10" style={{ padding: '24px' }}>
            <FeatureHint featureKey="authors" className="mb-4" />
            {selectedAuthor ? (
              <div>
                {/* Profile Header - Refined */}
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-base)',
                    marginBottom: '16px'
                  }}
                >
                  {/* Card accent line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, var(--color-accent) 0%, rgba(99, 102, 241, 0.3) 100%)',
                      zIndex: 1
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid var(--color-light-gray)',
                      borderRadius: 'var(--radius-base)',
                      padding: '20px'
                    }}
                  >
                    {/* Avatar and name section */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                      {/* Avatar */}
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: 'var(--radius-base)',
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.3) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: 'var(--color-accent)',
                            letterSpacing: '0.02em'
                          }}
                        >
                          {(() => {
                            const parts = selectedAuthor.name.split(' ').filter(Boolean)
                            const first = parts[0]?.[0] || ''
                            const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
                            return (first + last).toUpperCase()
                          })()}
                        </span>
                      </div>

                      {/* Name and affiliation */}
                      <div style={{ flex: 1 }}>
                        <h2 style={{ marginBottom: '2px', fontSize: '18px', fontWeight: 600, color: 'var(--color-soft-black)' }}>
                          {formatNameLastFirst(selectedAuthor.name)}
                        </h2>
                        <div style={{ fontSize: '13px', color: 'var(--color-mid-gray)' }}>
                          {selectedAuthor.header_affiliation || selectedAuthor.primary_affiliation || 'Independent'}
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap" style={{ gap: '6px', marginBottom: '16px' }}>
                      {selectedAuthor.credibility_tier && (
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            color: 'var(--color-accent)',
                            fontSize: '10px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                          }}
                        >
                          {selectedAuthor.credibility_tier}
                        </span>
                      )}

                      {selectedAuthor.author_type && (
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-pale-gray)',
                            color: 'var(--color-charcoal)',
                            fontSize: '10px',
                            fontWeight: 500
                          }}
                        >
                          {selectedAuthor.author_type}
                        </span>
                      )}

                      {getAuthorCamps(selectedAuthor.id).map((camp, idx) => (
                        <span
                          key={idx}
                          className={`${DOMAIN_COLORS[camp.domain] || 'bg-gray-100 text-gray-600'}`}
                          style={{
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '10px',
                            fontWeight: 500
                          }}
                        >
                          {camp.name}
                        </span>
                      ))}

                      {getAuthorCamps(selectedAuthor.id).length === 0 && (
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'transparent',
                            border: '1px dashed var(--color-light-gray)',
                            color: 'var(--color-mid-gray)',
                            fontSize: '10px',
                            fontStyle: 'italic'
                          }}
                        >
                          No {TERMINOLOGY.camp.toLowerCase()} assigned
                        </span>
                      )}
                    </div>

                    {selectedAuthor.notes && (
                      <div
                        style={{
                          backgroundColor: 'var(--color-bone)',
                          border: '1px solid var(--color-light-gray)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '12px',
                          marginBottom: '16px'
                        }}
                      >
                        <div
                          style={{
                            color: 'var(--color-mid-gray)',
                            fontSize: '9px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '6px'
                          }}
                        >
                          Overview
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--color-charcoal)', lineHeight: 1.5 }}>
                          {selectedAuthor.notes}
                        </div>
                      </div>
                    )}

                    <Link
                      href={`/authors/${selectedAuthor.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-accent)',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'all 120ms ease-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-accent)'
                      }}
                    >
                      View full profile
                      <span>→</span>
                    </Link>
                  </div>
                </div>

                {/* Sources Section */}
                <div
                  style={{
                    borderRadius: 'var(--radius-base)',
                    backgroundColor: 'white',
                    border: '1px solid var(--color-light-gray)',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-soft-black)' }}>Sources</h3>
                    {selectedAuthor.sources?.length > 0 && (
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-pale-gray)',
                          color: 'var(--color-charcoal)',
                          fontSize: '10px',
                          fontWeight: 500
                        }}
                      >
                        {selectedAuthor.sources.length}
                      </span>
                    )}
                  </div>

                  {selectedAuthor.sources && selectedAuthor.sources.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedAuthor.sources.map((source: any, index: number) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: 'var(--color-bone)',
                            border: '1px solid var(--color-light-gray)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '12px',
                            transition: 'all 120ms ease-out'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div style={{ marginBottom: '6px', color: 'var(--color-soft-black)', fontSize: '13px', fontWeight: 500 }}>
                                {source.title}
                              </div>
                              <div className="flex" style={{ gap: '8px', alignItems: 'center' }}>
                                <span
                                  style={{
                                    padding: '2px 6px',
                                    borderRadius: '2px',
                                    backgroundColor: 'white',
                                    color: 'var(--color-charcoal)',
                                    fontSize: '10px',
                                    fontWeight: 500
                                  }}
                                >
                                  {source.type}
                                </span>
                                <span style={{ fontSize: '10px', color: 'var(--color-mid-gray)' }}>{source.year}</span>
                              </div>
                            </div>
                            {source.url && (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  marginLeft: '12px',
                                  padding: '4px 10px',
                                  color: 'var(--color-accent)',
                                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                                  borderRadius: 'var(--radius-sm)',
                                  textDecoration: 'none',
                                  fontSize: '10px',
                                  fontWeight: 500,
                                  transition: 'all 120ms ease-out'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.15)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.08)'
                                }}
                              >
                                Open ↗
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center" style={{ padding: '24px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-base)',
                          backgroundColor: 'var(--color-pale-gray)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '18px',
                          opacity: 0.6
                        }}
                      >
                        📚
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-mid-gray)' }}>No sources added yet</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-base)',
                    backgroundColor: 'var(--color-pale-gray)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    fontSize: '24px',
                    opacity: 0.5
                  }}
                >
                  👤
                </div>
                <h3 style={{ marginBottom: '4px', fontSize: '16px', fontWeight: 600 }}>Select an author</h3>
                <div style={{ fontSize: '13px', color: 'var(--color-mid-gray)' }}>Choose from the list on the left</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// Author Card Component - Compact
function AuthorCard({ author, camps, isSelected, onClick, formatName }: {
  author: any
  camps: any[]
  isSelected: boolean
  onClick: () => void
  formatName: (name: string) => string
}) {
  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean)
    const first = parts[0]?.[0] || ''
    const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
    return (first + last).toUpperCase()
  }

  return (
    <div
      onClick={onClick}
      className="cursor-pointer"
      style={{
        position: 'relative',
        padding: '10px',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '4px',
        border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-light-gray)'}`,
        backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.06)' : 'white',
        transition: 'all 120ms ease-out'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'
          e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.03)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--color-light-gray)'
          e.currentTarget.style.backgroundColor = 'white'
        }
      }}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'var(--color-accent)',
            borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)'
          }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        {/* Avatar */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: isSelected
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.35) 100%)'
              : 'var(--color-pale-gray)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 120ms ease-out'
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: isSelected ? 'var(--color-accent)' : 'var(--color-mid-gray)',
              letterSpacing: '0.02em'
            }}
          >
            {getInitials(author.name)}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: isSelected ? 'var(--color-accent)' : 'var(--color-soft-black)',
              marginBottom: '2px',
              transition: 'color 120ms ease-out'
            }}
          >
            {formatName(author.name)}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'var(--color-mid-gray)',
              marginBottom: '6px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {author.header_affiliation || author.primary_affiliation || 'Independent'}
          </div>
          <div className="flex flex-wrap" style={{ gap: '3px' }}>
            {camps.length > 0 ? (
              <>
                {camps.slice(0, 2).map((camp, idx) => (
                  <span
                    key={idx}
                    className={`${DOMAIN_COLORS[camp.domain] || 'bg-gray-100 text-gray-600'}`}
                    style={{
                      padding: '1px 6px',
                      borderRadius: '2px',
                      fontWeight: 500,
                      fontSize: '9px'
                    }}
                  >
                    {camp.name}
                  </span>
                ))}
                {camps.length > 2 && (
                  <span
                    style={{
                      padding: '1px 6px',
                      borderRadius: '2px',
                      backgroundColor: 'var(--color-pale-gray)',
                      color: 'var(--color-charcoal)',
                      fontWeight: 500,
                      fontSize: '9px'
                    }}
                  >
                    +{camps.length - 2}
                  </span>
                )}
              </>
            ) : (
              <span
                style={{
                  padding: '1px 6px',
                  borderRadius: '2px',
                  backgroundColor: 'transparent',
                  border: '1px dashed var(--color-light-gray)',
                  color: 'var(--color-mid-gray)',
                  fontStyle: 'italic',
                  fontSize: '9px'
                }}
              >
                No {TERMINOLOGY.camp.toLowerCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X, Users } from 'lucide-react'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import SearchBar from '@/components/SearchBar'
import AuthorDetailPanel from '@/components/AuthorDetailPanel'
import { AboutThoughtLeadersModal, useAboutThoughtLeadersModal } from '@/components/AboutThoughtLeadersModal'
import { getThoughtLeaders } from '@/lib/api/thought-leaders'
import { getCampsWithAuthors } from '@/lib/api/thought-leaders'

// Domain colors
const DOMAINS = [
  { name: 'AI Technical Capabilities', short: 'Tech', bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
  { name: 'AI & Society', short: 'Society', bg: '#f3e8ff', text: '#7c3aed', border: '#c4b5fd' },
  { name: 'Enterprise AI Adoption', short: 'Enterprise', bg: '#d1fae5', text: '#059669', border: '#6ee7b7' },
  { name: 'AI Governance & Oversight', short: 'Governance', bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
  { name: 'Future of Work', short: 'Work', bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
]

const getDomainStyle = (domain: string | null) => {
  const d = DOMAINS.find(d => d.name === domain)
  return d || { name: 'Other', short: 'Other', bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' }
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
  const [groupBy, setGroupBy] = useState<'alphabet' | 'domain'>('alphabet')
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [urlAuthorHandled, setUrlAuthorHandled] = useState(false)

  // Modal for teaching users about thought leaders
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useAboutThoughtLeadersModal()

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

  // Filter and group authors
  const { authorsByLetter, authorsByDomain, domainCounts, availableLetters, totalFiltered } = useMemo(() => {
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

    return {
      authorsByLetter: byLetter,
      authorsByDomain: byDomain,
      domainCounts: counts,
      availableLetters: available,
      totalFiltered: filtered.length
    }
  }, [authors, searchQuery, domainFilter, camps])

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
        {/* Centered Header Section - matches Explore layout */}
        <div style={{ borderBottom: '1px solid var(--color-light-gray)', backgroundColor: 'var(--color-air-white)' }}>
          <div className="max-w-4xl mx-auto" style={{ padding: '20px 24px' }}>
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
            {/* Filters section */}
            <div style={{ padding: '12px', borderBottom: '1px solid var(--color-light-gray)' }}>
              {/* Group toggle + count */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-mid-gray)', fontWeight: 500 }}>Group:</span>
                  <div style={{
                    display: 'flex',
                    backgroundColor: 'var(--color-pale-gray)',
                    borderRadius: '6px',
                    padding: '2px'
                  }}>
                    <button
                      onClick={() => setGroupBy('alphabet')}
                      style={{
                        padding: '5px 10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: groupBy === 'alphabet' ? 'var(--color-air-white)' : 'transparent',
                        color: groupBy === 'alphabet' ? 'var(--color-quantum-navy)' : 'var(--color-mid-gray)',
                        cursor: 'pointer',
                        boxShadow: groupBy === 'alphabet' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 150ms ease'
                      }}
                    >
                      A–Z
                    </button>
                    <button
                      onClick={() => setGroupBy('domain')}
                      style={{
                        padding: '5px 10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: groupBy === 'domain' ? 'var(--color-air-white)' : 'transparent',
                        color: groupBy === 'domain' ? 'var(--color-quantum-navy)' : 'var(--color-mid-gray)',
                        cursor: 'pointer',
                        boxShadow: groupBy === 'domain' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 150ms ease'
                      }}
                    >
                      Domain
                    </button>
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-mid-gray)' }}>
                  {totalFiltered} authors
                </span>
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
                        backgroundColor: isActive ? d.bg : 'var(--color-air-white)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: isActive ? d.text : 'var(--color-charcoal)',
                        transition: 'all 100ms ease-out'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = d.bg
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
                      {d.short}
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

          {/* Scrollable list with optional alphabet sidebar */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Alphabet quick-jump - only in A-Z mode */}
            {groupBy === 'alphabet' && (
              <div style={{
                width: '26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                padding: '8px 3px',
                backgroundColor: '#f8fafc',
                borderRight: '1px solid var(--color-light-gray)',
                overflowY: 'auto'
              }}>
                {ALPHABET.map(letter => {
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
                })}
              </div>
            )}

            {/* Author list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 8px 16px' }}>
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

              {totalFiltered > 0 && (groupBy === 'alphabet' ? (
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
                      <div key={domain.name} style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 12px', borderRadius: '6px',
                          backgroundColor: domain.bg, marginBottom: '6px',
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
                                  backgroundColor: isSelected ? domain.bg : 'transparent',
                                  cursor: 'pointer', transition: 'all 60ms ease-out', textAlign: 'left'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = domain.bg
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                                }}
                              >
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
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 12px', borderRadius: '6px',
                        backgroundColor: '#f3f4f6', marginBottom: '6px',
                        position: 'sticky', top: 0, zIndex: 1
                      }}>
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
                            >
                              <span style={{
                                fontSize: '13px', fontWeight: isSelected ? 600 : 400,
                                color: 'var(--color-soft-black)',
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
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Users size={32} style={{ color: '#059669' }} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-soft-black)', marginBottom: '10px' }}>
                  Select an Author
                </h2>
                <p style={{ fontSize: '15px', color: 'var(--color-mid-gray)', maxWidth: '320px', lineHeight: 1.6, marginBottom: '24px' }}>
                  Choose an author from the list to see their positions, quotes, and the evidence behind their views.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {DOMAINS.slice(0, 3).map(d => (
                    <span
                      key={d.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: d.bg,
                        fontSize: '12px',
                        color: d.text,
                        fontWeight: 500
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: d.text }} />
                      {d.short}
                    </span>
                  ))}
                  <span style={{ fontSize: '12px', color: 'var(--color-mid-gray)', padding: '5px 0' }}>
                    + more domains
                  </span>
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

'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Search } from 'lucide-react'
import { getThoughtLeaders } from '@/lib/api/thought-leaders'
import { getCampsWithAuthors } from '@/lib/api/thought-leaders'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

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

  if (loading) {
    return (
      <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="label" style={{ color: 'var(--color-mid-gray)' }}>Loading authors...</div>
        </main>
      </div>
    )
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Sidebar />
      <main className="flex-1 ml-64 flex">
        {/* Left Panel - Author List */}
        <div
          className="w-[400px] border-r flex flex-col overflow-hidden"
          style={{
            backgroundColor: 'var(--color-cloud)',
            borderColor: 'var(--color-light-gray)'
          }}
        >
          {/* Sticky Search Bar */}
          <div
            className="sticky top-0 border-b"
            style={{
              zIndex: 'var(--z-sticky)',
              backgroundColor: 'var(--color-cloud)',
              borderColor: 'var(--color-light-gray)',
              padding: 'var(--space-5)'
            }}
          >
            <div className="relative">
              <Search
                style={{
                  position: 'absolute',
                  left: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 'var(--space-5)',
                  height: 'var(--space-5)',
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
                  paddingLeft: 'calc(var(--space-5) + var(--space-6))',
                  paddingRight: 'var(--space-4)',
                  paddingTop: 'var(--space-3)',
                  paddingBottom: 'var(--space-3)',
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: 'white',
                  border: 'var(--border-thin) solid var(--color-light-gray)',
                  fontSize: 'var(--text-body)',
                  color: 'var(--color-soft-black)',
                  transition: 'border-color var(--duration-fast) var(--ease-out)'
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
              padding: 'var(--space-4) var(--space-5)',
              backgroundColor: 'var(--color-cloud)',
              borderColor: 'var(--color-light-gray)'
            }}
          >
            {/* Sort and Stats Row */}
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="label cursor-pointer outline-none"
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: 'white',
                  border: 'var(--border-thin) solid var(--color-light-gray)',
                  color: 'var(--color-soft-black)',
                  transition: 'border-color var(--duration-fast) var(--ease-out)'
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
                <option value="camp">By Camp</option>
              </select>
              <div className="caption" style={{ color: 'var(--color-mid-gray)' }}>
                {processedAuthors.length} {processedAuthors.length === 1 ? 'author' : 'authors'}
              </div>
            </div>

            {/* A-Z Navigation (only for alphabetical view) */}
            {sortBy === 'alpha' && (
              <div
                className="flex flex-wrap"
                style={{
                  gap: 'var(--space-1)'
                }}
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
                      className="flex items-center justify-center caption"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isAvailable ? 'white' : 'transparent',
                        border: isAvailable ? 'var(--border-thin) solid var(--color-light-gray)' : 'none',
                        color: isAvailable ? 'var(--color-soft-black)' : 'var(--color-light-gray)',
                        fontWeight: isAvailable ? 'var(--weight-medium)' : 'var(--weight-normal)',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        transition: 'all var(--duration-fast) var(--ease-out)'
                      }}
                      onMouseEnter={(e) => {
                        if (isAvailable) {
                          e.currentTarget.style.backgroundColor = 'var(--color-accent-light)'
                          e.currentTarget.style.borderColor = 'var(--color-accent)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isAvailable) {
                          e.currentTarget.style.backgroundColor = 'white'
                          e.currentTarget.style.borderColor = 'var(--color-light-gray)'
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
          <div className="flex-1 overflow-y-auto" style={{ padding: 'var(--space-4)' }}>
            {sortBy === 'alpha' && (
              <>
                {Object.keys(authorsByLetter).sort().map(letter => (
                  <div key={letter} id={`letter-${letter}`} style={{ marginBottom: 'var(--space-6)' }}>
                    <div
                      className="border-b"
                      style={{
                        fontSize: 'var(--text-h3)',
                        fontWeight: 'var(--weight-semibold)',
                        color: 'var(--color-accent)',
                        borderWidth: 'var(--border-medium)',
                        borderColor: 'var(--color-light-gray)',
                        paddingBottom: 'var(--space-2)',
                        marginBottom: 'var(--space-3)'
                      }}
                    >
                      {letter}
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
                  <div key={domain} style={{ marginBottom: 'var(--space-6)' }}>
                    <div
                      className="label border-b"
                      style={{
                        color: 'var(--color-charcoal)',
                        fontWeight: 'var(--weight-bold)',
                        borderColor: 'var(--color-light-gray)',
                        paddingBottom: 'var(--space-2)',
                        marginBottom: 'var(--space-3)'
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
                  <div key={camp} style={{ marginBottom: 'var(--space-6)' }}>
                    <div
                      className="label border-b"
                      style={{
                        color: 'var(--color-charcoal)',
                        fontWeight: 'var(--weight-bold)',
                        borderColor: 'var(--color-light-gray)',
                        paddingBottom: 'var(--space-2)',
                        marginBottom: 'var(--space-3)'
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
              <div className="text-center" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-10)' }}>
                <div style={{ fontSize: 'var(--text-h2)', marginBottom: 'var(--space-2)' }}>🔍</div>
                <div className="label" style={{ color: 'var(--color-mid-gray)' }}>No authors found</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Author Profile */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            backgroundColor: 'var(--color-bone)',
            padding: 'var(--space-8)'
          }}
        >
          {selectedAuthor ? (
            <div>
              {/* Profile Header */}
              <div
                className="border"
                style={{
                  backgroundColor: 'var(--color-cloud)',
                  borderColor: 'var(--color-light-gray)',
                  borderRadius: 'var(--radius-base)',
                  padding: 'var(--space-5)',
                  marginBottom: 'var(--space-5)'
                }}
              >
                <h2 style={{ marginBottom: 'var(--space-1)' }}>{formatNameLastFirst(selectedAuthor.name)}</h2>
                <div className="label" style={{ color: 'var(--color-mid-gray)', marginBottom: 'var(--space-3)' }}>
                  {selectedAuthor.header_affiliation || selectedAuthor.primary_affiliation || 'Independent'}
                </div>
                <div className="flex flex-wrap" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                  {/* Credibility Tier - Outlined style for distinction */}
                  {selectedAuthor.credibility_tier && (
                    <span
                      className="caption"
                      style={{
                        padding: 'var(--space-1) var(--space-3)',
                        borderRadius: 'var(--radius-base)',
                        border: 'var(--border-medium) solid var(--color-accent)',
                        backgroundColor: 'white',
                        color: 'var(--color-accent)',
                        fontWeight: 'var(--weight-semibold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {selectedAuthor.credibility_tier}
                    </span>
                  )}

                  {/* Author Type - Subtle gray badge */}
                  {selectedAuthor.author_type && (
                    <span
                      className="caption"
                      style={{
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-pale-gray)',
                        border: 'var(--border-thin) solid var(--color-light-gray)',
                        color: 'var(--color-charcoal)',
                        fontWeight: 'var(--weight-medium)'
                      }}
                    >
                      {selectedAuthor.author_type}
                    </span>
                  )}

                  {/* Domain/Camp Labels - Filled colored badges */}
                  {getAuthorCamps(selectedAuthor.id).map((camp, idx) => (
                    <span
                      key={idx}
                      className={`caption ${DOMAIN_COLORS[camp.domain] || 'bg-gray-100 text-gray-600'}`}
                      style={{
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 'var(--weight-medium)'
                      }}
                    >
                      {camp.name}
                    </span>
                  ))}

                  {/* If no camps, show "No camp assigned" */}
                  {getAuthorCamps(selectedAuthor.id).length === 0 && (
                    <span
                      className="caption"
                      style={{
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-pale-gray)',
                        border: 'var(--border-thin) dashed var(--color-light-gray)',
                        color: 'var(--color-mid-gray)',
                        fontWeight: 'var(--weight-normal)',
                        fontStyle: 'italic'
                      }}
                    >
                      No camp assigned
                    </span>
                  )}
                </div>

                {selectedAuthor.notes && (
                  <div
                    className="bg-blue-50 border border-blue-200 label"
                    style={{
                      borderRadius: 'var(--radius-base)',
                      padding: 'var(--space-3)',
                      color: '#1e40af'
                    }}
                  >
                    {selectedAuthor.notes}
                  </div>
                )}

                <Link
                  href={`/author/${selectedAuthor.id}`}
                  className="inline-block label font-medium hover:underline"
                  style={{
                    marginTop: 'var(--space-4)',
                    color: 'var(--color-accent)'
                  }}
                >
                  View full profile →
                </Link>
              </div>

              {/* Sources Section */}
              <div
                className="border"
                style={{
                  backgroundColor: 'var(--color-cloud)',
                  borderColor: 'var(--color-light-gray)',
                  borderRadius: 'var(--radius-base)',
                  padding: 'var(--space-5)'
                }}
              >
                <h3 style={{ marginBottom: 'var(--space-4)' }}>
                  Sources ({selectedAuthor.sources?.length || 0})
                </h3>

                {selectedAuthor.sources && selectedAuthor.sources.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {selectedAuthor.sources.map((source: any, index: number) => (
                      <div
                        key={index}
                        className="border transition-colors"
                        style={{
                          borderColor: 'var(--color-light-gray)',
                          borderRadius: 'var(--radius-base)',
                          padding: 'var(--space-4)',
                          transition: 'border-color var(--duration-fast) var(--ease-out)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-mid-gray)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                        }}
                      >
                        <div className="flex items-start justify-between" style={{ marginBottom: 'var(--space-2)' }}>
                          <div className="flex-1">
                            <div className="label font-medium" style={{ marginBottom: 'var(--space-1)', color: 'var(--color-soft-black)' }}>
                              {source.title}
                            </div>
                            <div className="flex caption" style={{ gap: 'var(--space-2)', color: 'var(--color-mid-gray)' }}>
                              <span
                                className="bg-gray-100"
                                style={{
                                  padding: 'var(--space-1) var(--space-2)',
                                  borderRadius: 'var(--radius-sm)'
                                }}
                              >
                                {source.type}
                              </span>
                              <span>{source.year}</span>
                            </div>
                          </div>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="caption font-medium bg-blue-50 hover:bg-blue-100"
                              style={{
                                marginLeft: 'var(--space-3)',
                                padding: 'var(--space-2) var(--space-3)',
                                color: 'var(--color-accent)',
                                borderRadius: 'var(--radius-base)'
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
                  <div className="text-center" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
                    <div style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--space-2)' }}>📚</div>
                    <div className="label" style={{ color: 'var(--color-mid-gray)' }}>No sources added yet</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center" style={{ paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-20)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>👤</div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Select an author</h3>
              <div className="label" style={{ color: 'var(--color-mid-gray)' }}>Choose from the list on the left</div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Author Card Component
function AuthorCard({ author, camps, isSelected, onClick, formatName }: {
  author: any
  camps: any[]
  isSelected: boolean
  onClick: () => void
  formatName: (name: string) => string
}) {
  return (
    <div
      onClick={onClick}
      className="border cursor-pointer"
      style={{
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-base)',
        marginBottom: 'var(--space-2)',
        borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-light-gray)',
        backgroundColor: isSelected ? 'var(--color-accent-light)' : 'white',
        transition: 'all var(--duration-fast) var(--ease-out)',
        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--color-accent)'
          e.currentTarget.style.backgroundColor = 'var(--color-accent-light)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--color-light-gray)'
          e.currentTarget.style.backgroundColor = 'white'
        }
      }}
    >
      <div
        className="label font-semibold"
        style={{
          color: 'var(--color-soft-black)',
          marginBottom: 'var(--space-1)'
        }}
      >
        {formatName(author.name)}
      </div>
      <div
        className="caption"
        style={{
          color: 'var(--color-mid-gray)',
          marginBottom: 'var(--space-2)'
        }}
      >
        {author.header_affiliation || author.primary_affiliation || 'Independent'}
      </div>
      <div className="flex flex-wrap" style={{ gap: 'var(--space-1)' }}>
        {camps.length > 0 ? (
          <>
            {camps.slice(0, 2).map((camp, idx) => (
              <span
                key={idx}
                className={`caption ${
                  DOMAIN_COLORS[camp.domain] || 'bg-gray-100 text-gray-600'
                }`}
                style={{
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 'var(--weight-medium)'
                }}
              >
                {camp.name}
              </span>
            ))}
            {camps.length > 2 && (
              <span
                className="caption"
                style={{
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-pale-gray)',
                  color: 'var(--color-charcoal)',
                  fontWeight: 'var(--weight-medium)'
                }}
              >
                +{camps.length - 2}
              </span>
            )}
          </>
        ) : (
          <span
            className="caption"
            style={{
              padding: 'var(--space-1) var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'transparent',
              border: 'var(--border-thin) dashed var(--color-light-gray)',
              color: 'var(--color-mid-gray)',
              fontWeight: 'var(--weight-normal)',
              fontStyle: 'italic'
            }}
          >
            No camp
          </span>
        )}
      </div>
    </div>
  )
}

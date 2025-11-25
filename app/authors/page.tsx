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
        const [authorsData, campsData] = await Promise.all([
          getThoughtLeaders(),
          getCampsWithAuthors()
        ])
        setAuthors(authorsData)
        setCamps(campsData)
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
      return filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'domain') {
      return filtered.sort((a, b) => {
        const domainA = getAuthorDomain(a.id) || 'zzz'
        const domainB = getAuthorDomain(b.id) || 'zzz'
        if (domainA === domainB) {
          return a.name.localeCompare(b.name)
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
          return a.name.localeCompare(b.name)
        }
        return campNameA.localeCompare(campNameB)
      })
    }

    return filtered
  }, [authors, searchQuery, sortBy, camps])

  // Group authors by first letter (for alphabetical view)
  const authorsByLetter = useMemo(() => {
    if (sortBy !== 'alpha') return {}

    const grouped: Record<string, any[]> = {}
    processedAuthors.forEach(author => {
      const letter = author.name[0].toUpperCase()
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

  // Get available letters for A-Z navigation
  const availableLetters = useMemo(() => {
    const letters = new Set(authors.map(a => a.name[0].toUpperCase()))
    return Array.from(letters).sort()
  }, [authors])

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-gray-600">Loading authors...</div>
        </main>
      </div>
    )
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 flex">
        {/* Left Panel - Author List */}
        <div className="w-[400px] bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-gray-200">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or affiliation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Stats */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center mb-4">
              <div className="text-4xl font-bold text-indigo-500">{authors.length}</div>
              <div className="text-sm text-gray-500 mt-1">Authors in Database</div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 mb-4">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="alpha">Alphabetical (A-Z)</option>
                <option value="domain">By Domain</option>
                <option value="camp">By Camp</option>
              </select>
            </div>

            {/* A-Z Navigation (only for alphabetical view) */}
            {sortBy === 'alpha' && (
              <div className="flex flex-wrap gap-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
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
                      className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded transition-colors ${
                        isAvailable
                          ? 'bg-white border border-gray-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-500 cursor-pointer'
                          : 'bg-white border border-gray-200 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Author List */}
          <div className="flex-1 overflow-y-auto p-4">
            {sortBy === 'alpha' && (
              <>
                {Object.keys(authorsByLetter).sort().map(letter => (
                  <div key={letter} id={`letter-${letter}`} className="mb-6">
                    <div className="text-lg font-bold text-indigo-600 pb-2 mb-3 border-b-2 border-gray-200">
                      {letter}
                    </div>
                    {authorsByLetter[letter].map((author) => (
                      <AuthorCard
                        key={author.id}
                        author={author}
                        camps={getAuthorCamps(author.id)}
                        isSelected={selectedAuthor?.id === author.id}
                        onClick={() => setSelectedAuthor(author)}
                      />
                    ))}
                  </div>
                ))}
              </>
            )}

            {sortBy === 'domain' && (
              <>
                {Object.keys(authorsByDomain).sort().map(domain => (
                  <div key={domain} className="mb-6">
                    <div className="text-sm font-bold text-gray-700 pb-2 mb-3 border-b border-gray-200">
                      {domain}
                    </div>
                    {authorsByDomain[domain].map((author) => (
                      <AuthorCard
                        key={author.id}
                        author={author}
                        camps={getAuthorCamps(author.id)}
                        isSelected={selectedAuthor?.id === author.id}
                        onClick={() => setSelectedAuthor(author)}
                      />
                    ))}
                  </div>
                ))}
              </>
            )}

            {sortBy === 'camp' && (
              <>
                {Object.keys(authorsByCamp).sort().map(camp => (
                  <div key={camp} className="mb-6">
                    <div className="text-sm font-bold text-gray-700 pb-2 mb-3 border-b border-gray-200">
                      {camp}
                    </div>
                    {authorsByCamp[camp].map((author) => (
                      <AuthorCard
                        key={author.id}
                        author={author}
                        camps={getAuthorCamps(author.id)}
                        isSelected={selectedAuthor?.id === author.id}
                        onClick={() => setSelectedAuthor(author)}
                      />
                    ))}
                  </div>
                ))}
              </>
            )}

            {processedAuthors.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-sm">No authors found</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Author Profile */}
        <div className="flex-1 bg-gray-50 overflow-y-auto p-8">
          {selectedAuthor ? (
            <div>
              {/* Profile Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 mb-5">
                <h1 className="text-xl font-bold text-gray-900 mb-1">{selectedAuthor.name}</h1>
                <div className="text-sm text-gray-500 mb-3">
                  {selectedAuthor.header_affiliation || selectedAuthor.primary_affiliation || 'Independent'}
                </div>
                <div className="flex gap-2 flex-wrap mb-4">
                  {selectedAuthor.credibility_tier && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                      {selectedAuthor.credibility_tier}
                    </span>
                  )}
                  {selectedAuthor.author_type && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                      {selectedAuthor.author_type}
                    </span>
                  )}
                  {getAuthorCamps(selectedAuthor.id).map((camp, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        DOMAIN_COLORS[camp.domain] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {camp.name}
                    </span>
                  ))}
                </div>

                {selectedAuthor.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                    {selectedAuthor.notes}
                  </div>
                )}

                <Link
                  href={`/author/${selectedAuthor.id}`}
                  className="inline-block mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View full profile →
                </Link>
              </div>

              {/* Sources Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Sources ({selectedAuthor.sources?.length || 0})
                </h2>

                {selectedAuthor.sources && selectedAuthor.sources.length > 0 ? (
                  <div className="space-y-3">
                    {selectedAuthor.sources.map((source: any, index: number) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm mb-1">
                              {source.title}
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span className="px-2 py-0.5 bg-gray-100 rounded">{source.type}</span>
                              <span>{source.year}</span>
                            </div>
                          </div>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-3 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs rounded-md hover:bg-indigo-100 font-medium"
                            >
                              Open ↗
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-sm">No sources added yet</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <div className="text-5xl mb-4">👤</div>
              <div className="text-lg font-medium">Select an author</div>
              <div className="text-sm">Choose from the list on the left</div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Author Card Component
function AuthorCard({ author, camps, isSelected, onClick }: {
  author: any
  camps: any[]
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border mb-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
      }`}
    >
      <div className="font-semibold text-gray-900 text-sm mb-1">{author.name}</div>
      <div className="text-xs text-gray-500 mb-2">
        {author.header_affiliation || author.primary_affiliation || 'Independent'}
      </div>
      <div className="flex gap-1 flex-wrap">
        {camps.slice(0, 2).map((camp, idx) => (
          <span
            key={idx}
            className={`px-2 py-0.5 text-xs rounded font-medium ${
              DOMAIN_COLORS[camp.domain] || 'bg-gray-100 text-gray-600'
            }`}
          >
            {camp.name}
          </span>
        ))}
        {camps.length > 2 && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
            +{camps.length - 2}
          </span>
        )}
      </div>
    </div>
  )
}

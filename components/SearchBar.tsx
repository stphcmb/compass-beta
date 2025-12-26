'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Bookmark, Check, X, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const dateRanges = [
  'Last 12 months',
  'Last 6 months',
  'Last 3 months'
]

interface SearchBarProps {
  initialQuery?: string
  showEdit?: boolean
  onQueryChange?: (query: string) => void
  showSaveButton?: boolean
  domain?: string
  camp?: string
}

export default function SearchBar({ initialQuery = '', showEdit = false, onQueryChange, showSaveButton = false, domain, camp }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [isEditing, setIsEditing] = useState(showEdit)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState('Last 12 months')
  const [isSaved, setIsSaved] = useState(false)

  // Data from database
  const [authors, setAuthors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Author search state
  const [authorSearch, setAuthorSearch] = useState('')
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  // Fetch authors from database
  useEffect(() => {
    const fetchAuthors = async () => {
      if (!supabase) {
        console.warn('Supabase not configured')
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const { data: authorsData } = await supabase
          .from('authors')
          .select('name')
          .order('name')

        if (authorsData) {
          setAuthors(authorsData.map(a => a.name))
        }
      } catch (error) {
        console.error('Error fetching authors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthors()
  }, [])

  // Filter authors based on search
  const filteredAuthors = useMemo(() => {
    if (!authorSearch.trim()) return authors.slice(0, 10) // Show first 10 when no search
    const search = authorSearch.toLowerCase()
    return authors.filter(a => a.toLowerCase().includes(search)).slice(0, 20)
  }, [authors, authorSearch])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (onQueryChange) {
      onQueryChange(value)
    }
  }

  const handleSearch = () => {
    if (query.trim().length === 0 || query.length > 500) return

    const params = new URLSearchParams()
    params.set('q', query.trim())
    if (selectedAuthors.length > 0) params.set('authors', selectedAuthors.join(','))
    if (selectedDateRange !== 'Last 12 months') params.set('date', selectedDateRange)

    router.push(`/explore?${params.toString()}`)
  }

  const toggleAuthorSelection = (author: string) => {
    if (selectedAuthors.includes(author)) {
      setSelectedAuthors(selectedAuthors.filter(a => a !== author))
    } else {
      setSelectedAuthors([...selectedAuthors, author])
    }
  }

  const removeAuthor = (author: string) => {
    setSelectedAuthors(selectedAuthors.filter(a => a !== author))
  }

  const clearAllFilters = () => {
    setSelectedAuthors([])
    setSelectedDateRange('Last 12 months')
    setAuthorSearch('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSave = () => {
    if (!initialQuery) return

    try {
      const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
      const newSearch = {
        id: `saved-${Date.now()}`,
        query: initialQuery,
        domain,
        camp,
        created_at: new Date().toISOString(),
        filters: {
          ...(domain && { domain }),
          ...(camp && { camp })
        }
      }

      const exists = savedSearches.some((s: any) =>
        s.query === initialQuery && s.domain === domain && s.camp === camp
      )

      if (!exists) {
        savedSearches.unshift(newSearch)
        localStorage.setItem('savedSearches', JSON.stringify(savedSearches))
        window.dispatchEvent(new CustomEvent('saved-search-created', { detail: newSearch }))
      }

      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } catch (error) {
      console.error('Error saving search:', error)
    }
  }

  if (showEdit) {
    return (
      <div
        className="flex items-center border border-gray-100"
        style={{
          backgroundColor: 'var(--color-cloud)',
          borderRadius: 'var(--radius-base)',
          padding: 'var(--space-4)',
          gap: 'var(--space-3)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <Search style={{ width: 'var(--space-5)', height: 'var(--space-5)', color: 'var(--color-accent)' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none"
          style={{
            fontSize: 'var(--text-body)',
            backgroundColor: 'transparent'
          }}
          disabled={!isEditing}
        />
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="label hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            Edit
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      className="bg-white border border-[var(--color-light-gray)] hover:border-[var(--color-accent)]/30 transition-colors relative z-20"
      style={{
        borderRadius: 'var(--radius-base)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-4)',
        boxShadow: 'var(--shadow-subtle)'
      }}
    >
      {/* Main Search Input */}
      <div
        className="flex items-center bg-[var(--color-bone)] border border-transparent focus-within:border-[var(--color-accent)] focus-within:bg-white transition-all"
        style={{
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--space-3)'
        }}
      >
        <Search style={{ width: '18px', height: '18px', color: 'var(--color-mid-gray)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search by topic, thesis, or keywords..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
          className="flex-1 outline-none"
          style={{
            fontSize: 'var(--text-body)',
            fontWeight: 'var(--weight-medium)',
            color: 'var(--color-soft-black)',
            backgroundColor: 'transparent'
          }}
        />
      </div>

      <div
        className="flex items-center justify-between"
        style={{ paddingTop: 0 }}
      >
        <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-xs hover:text-[var(--color-accent)] transition-colors"
            style={{
              gap: '4px',
              color: 'var(--color-mid-gray)'
            }}
          >
            <Filter style={{ width: '14px', height: '14px' }} />
            Filters
          </button>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          {showSaveButton && initialQuery && (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors"
              title={isSaved ? 'Saved!' : 'Save this search'}
            >
              {isSaved ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span className="text-xs">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          )}
          <button
            onClick={handleSearch}
            className="text-xs font-semibold text-white transition-all"
            style={{
              backgroundColor: 'var(--color-accent)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)'
            }}
          >
            Search
          </button>
        </div>
      </div>

      {showFilters && (
        <div
          className="border-t border-gray-100"
          style={{
            marginTop: 'var(--space-3)',
            paddingTop: 'var(--space-3)'
          }}
        >
          {/* Header with Clear All */}
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-3)' }}>
            <span className="text-xs font-medium" style={{ color: 'var(--color-charcoal)' }}>
              Filter by Author
            </span>
            {(selectedAuthors.length > 0 || selectedDateRange !== 'Last 12 months') && (
              <button
                onClick={clearAllFilters}
                className="text-xs hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Selected Authors as Chips */}
          {selectedAuthors.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedAuthors.map((author) => (
                <span
                  key={author}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                >
                  <Users className="w-3 h-3" />
                  {author}
                  <button
                    onClick={() => removeAuthor(author)}
                    className="ml-0.5 hover:bg-[var(--color-accent)]/20 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2" style={{ gap: 'var(--space-3)' }}>
            {/* Author Search with Dropdown */}
            <div className="relative">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-charcoal)' }}>
                Search Authors
              </label>
              <div className="relative">
                <Search
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                  style={{ width: '14px', height: '14px' }}
                />
                <input
                  type="text"
                  value={authorSearch}
                  onChange={(e) => {
                    setAuthorSearch(e.target.value)
                    setShowAuthorDropdown(true)
                  }}
                  onFocus={() => setShowAuthorDropdown(true)}
                  placeholder="Type to search..."
                  className="w-full border border-gray-300 hover:border-gray-400 focus:border-[var(--color-accent)] outline-none transition-colors text-xs"
                  style={{
                    padding: '6px 8px 6px 28px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'white'
                  }}
                />
              </div>

              {showAuthorDropdown && !loading && filteredAuthors.length > 0 && (
                <div
                  className="absolute z-50 w-full border border-gray-300 bg-white overflow-auto"
                  style={{
                    marginTop: '4px',
                    borderRadius: 'var(--radius-sm)',
                    maxHeight: '180px',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  {filteredAuthors.map((author) => (
                    <button
                      key={author}
                      onClick={() => {
                        toggleAuthorSelection(author)
                        setAuthorSearch('')
                      }}
                      className={`w-full flex items-center gap-2 text-left text-xs cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedAuthors.includes(author) ? 'bg-[var(--color-accent)]/5' : ''
                      }`}
                      style={{ padding: '8px 10px' }}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          selectedAuthors.includes(author)
                            ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedAuthors.includes(author) && (
                          <Check className="w-2.5 h-2.5 text-white" />
                        )}
                      </div>
                      <span style={{ color: 'var(--color-charcoal)' }}>{author}</span>
                    </button>
                  ))}
                </div>
              )}

              {showAuthorDropdown && !loading && authorSearch && filteredAuthors.length === 0 && (
                <div
                  className="absolute z-50 w-full border border-gray-300 bg-white"
                  style={{
                    marginTop: '4px',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <p className="text-xs text-gray-500 text-center">No authors found</p>
                </div>
              )}
            </div>

            {/* Publication Date */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-charcoal)' }}>
                Publication Date
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full border border-gray-300 hover:border-gray-400 transition-colors text-xs"
                style={{
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'white',
                  color: 'var(--color-charcoal)'
                }}
              >
                {dateRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Click outside to close dropdown */}
          {showAuthorDropdown && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => setShowAuthorDropdown(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}


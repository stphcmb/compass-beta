'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Bookmark, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { TERMINOLOGY } from '@/lib/constants/terminology'

const domains = [
  'Business',
  'Society',
  'Workers',
  'Technology',
  'Policy & Regulation',
  'Other'
]

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
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [selectedCamps, setSelectedCamps] = useState<string[]>([])
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState('Last 12 months')
  const [isSaved, setIsSaved] = useState(false)

  // Data from database
  const [camps, setCamps] = useState<string[]>([])
  const [authors, setAuthors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  // Fetch camps and authors from database
  useEffect(() => {
    const fetchFilters = async () => {
      if (!supabase) {
        console.warn('Supabase not configured')
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        // Fetch camps
        const { data: campsData } = await supabase
          .from('camps')
          .select('label')
          .order('label')

        // Fetch authors
        const { data: authorsData } = await supabase
          .from('authors')
          .select('name')
          .order('name')

        if (campsData) {
          setCamps(campsData.map(c => c.label))
        }

        if (authorsData) {
          setAuthors(authorsData.map(a => a.name))
        }
      } catch (error) {
        console.error('Error fetching filter options:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilters()
  }, [])

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
    if (selectedDomains.length > 0) params.set('domains', selectedDomains.join(','))
    if (selectedCamps.length > 0) params.set('camps', selectedCamps.join(','))
    if (selectedAuthors.length > 0) params.set('authors', selectedAuthors.join(','))
    if (selectedDateRange !== 'Last 12 months') params.set('date', selectedDateRange)

    router.push(`/explore?${params.toString()}`)
  }

  // Helper functions for multi-select
  const toggleSelection = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item))
    } else {
      setSelected([...selected, item])
    }
  }

  const clearAllFilters = () => {
    setSelectedDomains([])
    setSelectedCamps([])
    setSelectedAuthors([])
    setSelectedDateRange('Last 12 months')
  }

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
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
      className="bg-gradient-to-br from-white to-blue-50/30 border-2 border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 transition-colors"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-8)',
        boxShadow: '0 4px 20px rgba(0, 51, 255, 0.08)'
      }}
    >
      {/* Search Prompt Label */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
          Search Perspectives
        </span>
      </div>

      {/* Main Search Input */}
      <div
        className="flex items-center bg-white border border-gray-200 focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent)]/20 transition-all"
        style={{
          gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-5)'
        }}
      >
        <Search style={{ width: 'var(--space-5)', height: 'var(--space-5)', color: 'var(--color-accent)' }} />
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
        className="flex items-center justify-between border-t border-gray-100"
        style={{ paddingTop: 'var(--space-5)' }}
      >
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center label hover:text-gray-900"
            style={{
              gap: 'var(--space-2)',
              color: 'var(--color-charcoal)'
            }}
          >
            <Filter style={{ width: 'var(--space-4)', height: 'var(--space-4)' }} />
            Advanced Filters
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
            className="label font-semibold text-white transition-all"
            style={{
              backgroundColor: 'var(--color-accent)',
              padding: 'var(--space-2) var(--space-6)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
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
            marginTop: 'var(--space-5)',
            paddingTop: 'var(--space-5)'
          }}
        >
          {/* Clear All Filters Button */}
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)' }}>
            <span className="label font-semibold" style={{ color: 'var(--color-charcoal)' }}>
              Filter Options
            </span>
            {(selectedDomains.length > 0 || selectedCamps.length > 0 || selectedAuthors.length > 0 || selectedDateRange !== 'Last 12 months') && (
              <button
                onClick={clearAllFilters}
                className="caption hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                Clear All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
            {/* Domain Dropdown */}
            <div className="relative">
              <label className="block label font-medium" style={{ marginBottom: 'var(--space-2)' }}>
                {TERMINOLOGY.domain} {selectedDomains.length > 0 && `(${selectedDomains.length})`}
              </label>
              <button
                onClick={() => toggleDropdown('domains')}
                className="w-full flex items-center justify-between border border-gray-300 hover:border-gray-400 transition-colors"
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: 'white'
                }}
              >
                <span className="label" style={{ color: 'var(--color-charcoal)' }}>
                  {selectedDomains.length > 0 ? `${selectedDomains.length} selected` : `Select ${TERMINOLOGY.domains.toLowerCase()}`}
                </span>
                <svg
                  className={`transition-transform ${openDropdown === 'domains' ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === 'domains' && (
                <div
                  className="absolute z-10 w-full border border-gray-300 bg-white overflow-auto"
                  style={{
                    marginTop: 'var(--space-1)',
                    borderRadius: 'var(--radius-base)',
                    maxHeight: '240px',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  {domains.map((domain) => (
                    <label
                      key={domain}
                      className="flex items-center cursor-pointer hover:bg-gray-50"
                      style={{ padding: 'var(--space-2) var(--space-3)' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDomains.includes(domain)}
                        onChange={() => toggleSelection(domain, selectedDomains, setSelectedDomains)}
                        className="mr-2"
                        style={{ accentColor: 'var(--color-accent)' }}
                      />
                      <span className="label">{domain}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Camp Dropdown */}
            <div className="relative">
              <label className="block label font-medium" style={{ marginBottom: 'var(--space-2)' }}>
                {TERMINOLOGY.camp} {selectedCamps.length > 0 && `(${selectedCamps.length})`}
              </label>
              <button
                onClick={() => toggleDropdown('camps')}
                disabled={loading}
                className="w-full flex items-center justify-between border border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50"
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: 'white'
                }}
              >
                <span className="label" style={{ color: 'var(--color-charcoal)' }}>
                  {loading ? 'Loading...' : selectedCamps.length > 0 ? `${selectedCamps.length} selected` : `Select ${TERMINOLOGY.camps.toLowerCase()}`}
                </span>
                <svg
                  className={`transition-transform ${openDropdown === 'camps' ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === 'camps' && !loading && camps.length > 0 && (
                <div
                  className="absolute z-10 w-full border border-gray-300 bg-white overflow-auto"
                  style={{
                    marginTop: 'var(--space-1)',
                    borderRadius: 'var(--radius-base)',
                    maxHeight: '240px',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  {camps.map((camp) => (
                    <label
                      key={camp}
                      className="flex items-center cursor-pointer hover:bg-gray-50"
                      style={{ padding: 'var(--space-2) var(--space-3)' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCamps.includes(camp)}
                        onChange={() => toggleSelection(camp, selectedCamps, setSelectedCamps)}
                        className="mr-2"
                        style={{ accentColor: 'var(--color-accent)' }}
                      />
                      <span className="label">{camp}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Author Dropdown */}
            <div className="relative">
              <label className="block label font-medium" style={{ marginBottom: 'var(--space-2)' }}>
                Author Name {selectedAuthors.length > 0 && `(${selectedAuthors.length})`}
              </label>
              <button
                onClick={() => toggleDropdown('authors')}
                disabled={loading}
                className="w-full flex items-center justify-between border border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50"
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: 'white'
                }}
              >
                <span className="label" style={{ color: 'var(--color-charcoal)' }}>
                  {loading ? 'Loading...' : selectedAuthors.length > 0 ? `${selectedAuthors.length} selected` : 'Select authors'}
                </span>
                <svg
                  className={`transition-transform ${openDropdown === 'authors' ? 'rotate-180' : ''}`}
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === 'authors' && !loading && authors.length > 0 && (
                <div
                  className="absolute z-10 w-full border border-gray-300 bg-white overflow-auto"
                  style={{
                    marginTop: 'var(--space-1)',
                    borderRadius: 'var(--radius-base)',
                    maxHeight: '240px',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  {authors.map((author) => (
                    <label
                      key={author}
                      className="flex items-center cursor-pointer hover:bg-gray-50"
                      style={{ padding: 'var(--space-2) var(--space-3)' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAuthors.includes(author)}
                        onChange={() => toggleSelection(author, selectedAuthors, setSelectedAuthors)}
                        className="mr-2"
                        style={{ accentColor: 'var(--color-accent)' }}
                      />
                      <span className="label">{author}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Publication Date Single Select */}
            <div>
              <label className="block label font-medium" style={{ marginBottom: 'var(--space-2)' }}>
                Publication Date
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full border border-gray-300 hover:border-gray-400 transition-colors label"
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-base)',
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
        </div>
      )}
    </div>
  )
}


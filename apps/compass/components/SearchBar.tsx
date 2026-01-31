'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bookmark, Check, X } from 'lucide-react'
import { DOMAINS } from '@/lib/constants/domains'

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
  const [selectedDomain, setSelectedDomain] = useState<string | null>(domain || null)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    if (domain) {
      setSelectedDomain(domain)
    }
  }, [domain])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (onQueryChange) {
      onQueryChange(value)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (selectedDomain) params.set('domain', selectedDomain)

    router.push(`/browse?${params.toString()}`)
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
    <div style={{ marginBottom: '16px' }}>
      {/* Search Input - matches Authors page styling */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Search style={{
          position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
          width: '18px', height: '18px', color: 'var(--color-mid-gray)'
        }} />
        <input
          type="text"
          placeholder="Search by topic, thesis, or keywords..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
          style={{
            width: '100%',
            padding: '14px 140px 14px 48px',
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
        {/* Search button inside input */}
        <div style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {showSaveButton && initialQuery && (
            <button
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                backgroundColor: isSaved ? '#f0fdf4' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: isSaved ? '#059669' : '#6b7280',
                fontSize: '12px',
                fontWeight: 500
              }}
              title={isSaved ? 'Saved!' : 'Save this search'}
            >
              {isSaved ? (
                <Check style={{ width: '14px', height: '14px' }} />
              ) : (
                <Bookmark style={{ width: '14px', height: '14px' }} />
              )}
              {isSaved ? 'Saved' : 'Save'}
            </button>
          )}
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 150ms ease'
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
        {query && (
          <button
            onClick={() => handleQueryChange('')}
            style={{
              position: 'absolute', right: showSaveButton ? '170px' : '100px', top: '50%', transform: 'translateY(-50%)',
              background: 'var(--color-pale-gray)', border: 'none', cursor: 'pointer',
              padding: '6px', borderRadius: '50%', display: 'flex'
            }}
          >
            <X style={{ width: '14px', height: '14px', color: 'var(--color-mid-gray)' }} />
          </button>
        )}
      </div>

      {/* Domain Filter - hidden but functional */}
      <div style={{ display: 'none', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--color-mid-gray)',
          whiteSpace: 'nowrap'
        }}>
          Filter by domain:
        </span>
        {DOMAINS.map(d => {
          const isActive = selectedDomain === d.name
          return (
            <button
              key={d.name}
              onClick={() => setSelectedDomain(isActive ? null : d.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: isActive ? `2px solid ${d.text}` : '1px solid #e5e7eb',
                backgroundColor: isActive ? d.bgLight : 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? d.text : 'var(--color-charcoal)',
                transition: 'all 150ms ease',
                boxShadow: isActive ? `0 0 0 2px ${d.bgLight}` : 'none',
                whiteSpace: 'nowrap'
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
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.color = 'var(--color-charcoal)'
                }
              }}
            >
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: d.text
              }} />
              {d.shortName}
            </button>
          )
        })}
        {selectedDomain && (
          <button
            onClick={() => setSelectedDomain(null)}
            style={{
              fontSize: '12px',
              color: 'var(--color-accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              textDecoration: 'underline'
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

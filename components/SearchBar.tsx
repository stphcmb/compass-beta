'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

const domains = [
  'All Domains',
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
}

export default function SearchBar({ initialQuery = '', showEdit = false, onQueryChange }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [isEditing, setIsEditing] = useState(showEdit)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState('All Domains')
  const [selectedDateRange, setSelectedDateRange] = useState('Last 12 months')
  const [authorName, setAuthorName] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedOnce, setSavedOnce] = useState(false)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

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
    if (selectedDomain !== 'All Domains') params.set('domain', selectedDomain)
    if (authorName) params.set('author', authorName)
    if (selectedDateRange !== 'Last 12 months') params.set('date', selectedDateRange)
    
    router.push(`/results?${params.toString()}`)
  }

  const handleSave = async () => {
    if (query.trim().length === 0 || saving) return
    setSaving(true)
    try {
      const filters = {
        domain: selectedDomain,
        dateRange: selectedDateRange,
        authorName: authorName || undefined,
      }
      if (supabase) {
        await supabase.from('saved_searches').insert({ query: query.trim(), filters })
      }
      setSavedOnce(true)
      window.dispatchEvent(new CustomEvent('saved-search-created', {
        detail: { query: query.trim(), filters, created_at: new Date().toISOString() }
      }))
    } catch (e) {
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (showEdit) {
    return (
      <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3 border border-gray-100">
        <Search className="w-5 h-5 text-blue-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none text-base"
          disabled={!isEditing}
        />
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-5">
        <Search className="w-6 h-6 text-blue-600" />
        <input
          type="text"
          placeholder="Paste your thesis or search by keywords..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
          className="flex-1 text-xl md:text-2xl outline-none placeholder:text-gray-400"
        />
      </div>
      
      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm md:text-base text-gray-700 hover:text-gray-900"
          >
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || query.trim().length === 0}
            className={`px-4 py-2 rounded-lg border transition-colors text-sm md:text-base ${savedOnce ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200'}`}
            title={savedOnce ? 'Saved' : 'Save search'}
          >
            {savedOnce ? 'Saved' : saving ? 'Saving…' : 'Save'}
          </button>
          <button 
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 text-sm md:text-base shadow"
          >
            Search
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 gap-5 text-sm md:text-base">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {domains.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Camp/Position</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>All Camps</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input 
              type="text" 
              placeholder="e.g., Andrew Ng"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {dateRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}


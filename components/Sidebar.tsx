'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Bookmark, Clock, Search as SearchIcon, ChevronRight, Users, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [recentSearches, setRecentSearches] = useState<any[]>([])
  const [savedSearches, setSavedSearches] = useState<any[]>([])
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isResultsPage = pathname === '/results'
  const currentQuery = searchParams.get('q') || ''

  // Simple relative time formatter for timestamps
  const timeAgo = (ts?: string) => {
    if (!ts) return ''
    const diffMs = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  const fetchRecentSearches = () => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      setRecentSearches(recent.slice(0, 10))
    } catch (error) {
      console.error('Error fetching recent searches:', error)
      setRecentSearches([])
    }
  }

  const fetchSavedSearches = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]')
      setSavedSearches(saved)
    } catch (error) {
      console.error('Error fetching saved searches:', error)
      setSavedSearches([])
    }
  }

  const addToRecentSearches = (query: string) => {
    if (!query) return
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')

      // Remove if already exists
      const filtered = recent.filter((s: any) => s.query !== query)

      // Add to beginning
      filtered.unshift({
        id: `recent-${Date.now()}`,
        query,
        timestamp: new Date().toISOString()
      })

      // Keep only last 20
      const limited = filtered.slice(0, 20)
      localStorage.setItem('recentSearches', JSON.stringify(limited))
      setRecentSearches(limited.slice(0, 10))
    } catch (error) {
      console.error('Error adding to recent searches:', error)
    }
  }

  useEffect(() => {
    // Only run data and window-dependent effects after mount
    if (!mounted) return

    // Load from localStorage
    fetchRecentSearches()
    fetchSavedSearches()

    // Listen for new saved search events
    const onSaved = (e: Event) => {
      const ev = e as CustomEvent<{ query: string; filters?: any; created_at?: string }>
      if (ev?.detail?.query) {
        setLastSaved(ev.detail.query)
        fetchSavedSearches() // Refresh from localStorage
      }
    }
    window.addEventListener('saved-search-created', onSaved as EventListener)
    return () => window.removeEventListener('saved-search-created', onSaved as EventListener)
  }, [mounted])

  // Track when user performs a search
  useEffect(() => {
    if (!mounted || !currentQuery) return
    addToRecentSearches(currentQuery)
  }, [currentQuery, mounted])

  const handleSearchClick = (query: string) => {
    router.push(`/results?q=${encodeURIComponent(query)}`)
  }

  const deleteSavedSearch = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]')
      const filtered = saved.filter((s: any) => s.id !== id)
      localStorage.setItem('savedSearches', JSON.stringify(filtered))
      setSavedSearches(filtered)
    } catch (error) {
      console.error('Error deleting saved search:', error)
    }
  }

  if (!mounted) {
    // Avoid hydration mismatches by deferring render until client is ready
    return null
  }

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <Link href="/" className="text-lg font-bold mb-4 block text-indigo-600 hover:text-indigo-800">
        Compass
      </Link>

      {/* Navigation */}
      <nav className="mb-6 space-y-1">
        <Link
          href="/"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <SearchIcon className="w-4 h-4" />
          Search
        </Link>
        <Link
          href="/authors"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/authors' || pathname.startsWith('/author/') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" />
          Author Index
        </Link>
      </nav>

      {isResultsPage && (
        <>
          <button 
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 mb-4 hover:underline"
          >
            ← New Search
          </button>
          {currentQuery && (
            <div className="mb-4 p-3 bg-blue-50 rounded">
              <div className="text-xs text-gray-500 mb-1">Current Search</div>
              <div className="text-sm font-medium">{currentQuery}</div>
            </div>
          )}
        </>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-600">Recent Searches</h3>
          <span className="text-xs text-gray-500">{recentSearches.length}</span>
        </div>
        <div className="space-y-2">
          {recentSearches.length === 0 ? (
            <div className="text-sm text-gray-500">No recent searches</div>
          ) : (
            recentSearches.map((search) => (
              <button
                key={search.id}
                onClick={() => handleSearchClick(search.query)}
                className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <SearchIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800 truncate">
                      {search.query}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{timeAgo(search.timestamp)}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-600">Saved Searches</h3>
          <span className="text-xs text-gray-500">{savedSearches.length}</span>
        </div>
        {lastSaved && (
          <div className="text-xs text-gray-500 mb-2">Last saved: <span className="text-gray-800">{lastSaved}</span></div>
        )}
        <div className="space-y-2">
          {savedSearches.length === 0 ? (
            <div className="text-sm text-gray-500">No saved searches</div>
          ) : (
            savedSearches.map((search) => (
              <div key={search.id} className="relative group">
                <button
                  onClick={() => handleSearchClick(search.query)}
                  className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <Bookmark className="w-4 h-4 text-blue-700 mt-0.5" />
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="text-sm text-gray-800 truncate">
                        {search.query}
                      </div>
                      {search.filters && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.entries(search.filters).map(([key, value]: any, idx: number) => (
                            value && (
                              <span
                                key={idx}
                                className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/70 border border-blue-200 text-blue-800"
                              >
                                {key}: {String(value)}
                              </span>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-blue-700" />
                  </div>
                </button>
                <button
                  onClick={(e) => deleteSavedSearch(e, search.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                  title="Delete saved search"
                >
                  <X className="w-3 h-3 text-red-600" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  )
}


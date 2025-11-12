'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Bookmark, Clock, Search as SearchIcon, ChevronRight } from 'lucide-react'
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

  const fetchRecentSearches = async () => {
    try {
      if (!supabase) return
      const { data } = await supabase
        .from('search_history')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10)
      if (data) setRecentSearches(data)
    } catch (error) {
      console.error('Error fetching recent searches:', error)
    }
  }

  const fetchSavedSearches = async () => {
    try {
      if (!supabase) return
      const { data } = await supabase
        .from('saved_searches')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setSavedSearches(data)
    } catch (error) {
      console.error('Error fetching saved searches:', error)
    }
  }

  useEffect(() => {
    // Only run data and window-dependent effects after mount
    if (!mounted) return

    // If Supabase isn't configured, show engaging placeholders
    if (!supabase) {
      setRecentSearches([
        { id: 'r1', query: 'AI and reskilling workers', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
        { id: 'r2', query: 'Enterprise AI transformation', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
        { id: 'r3', query: 'Agentic workflows in ops', timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
      ])
      setSavedSearches([
        { id: 's1', query: 'Future of knowledge work', filters: { domain: 'Workers', dateRange: 'Last 12 months' } },
        { id: 's2', query: 'Regulatory compliance for proprietary models', filters: { domain: 'Policy & Regulation' } },
      ])
    } else {
      fetchRecentSearches()
      fetchSavedSearches()
    }

    // Listen for new saved search events and optimistically add
    const onSaved = (e: Event) => {
      const ev = e as CustomEvent<{ query: string; filters?: any; created_at?: string }>
      if (ev?.detail?.query) {
        setLastSaved(ev.detail.query)
        setSavedSearches((prev) => [
          { id: `local-${Date.now()}`, query: ev.detail.query, filters: ev.detail.filters, created_at: ev.detail.created_at },
          ...prev,
        ])
      }
      // If connected, also refresh from backend to pick up IDs
      if (supabase) fetchSavedSearches()
    }
    window.addEventListener('saved-search-created', onSaved as EventListener)
    return () => window.removeEventListener('saved-search-created', onSaved as EventListener)
  }, [mounted])

  const handleSearchClick = (query: string) => {
    router.push(`/results?q=${encodeURIComponent(query)}`)
  }

  if (!mounted) {
    // Avoid hydration mismatches by deferring render until client is ready
    return null
  }

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Compass</h2>
      
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
              <button
                key={search.id}
                onClick={() => handleSearchClick(search.query)}
                className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <Bookmark className="w-4 h-4 text-blue-700 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800 truncate">
                      {search.query}
                    </div>
                    {search.filters && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.entries(search.filters).map(([key, value]: any, idx: number) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/70 border border-blue-200 text-blue-800"
                          >
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-700" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  )
}


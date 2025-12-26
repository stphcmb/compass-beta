'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Bookmark, Clock, Search as SearchIcon, ChevronRight, Users, X, Sparkles, PanelLeftClose, PanelLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/Toast'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const [recentSearches, setRecentSearches] = useState<any[]>([])
  const [savedSearches, setSavedSearches] = useState<any[]>([])
  const [savedAIEditorAnalyses, setSavedAIEditorAnalyses] = useState<any[]>([])
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if user has any saved content
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    const savedAnalyses = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
    const hasContent = savedSearches.length > 0 || savedAnalyses.length > 0

    // Load user's explicit preference if set
    const userPreference = localStorage.getItem('sidebarCollapsed')

    if (userPreference !== null) {
      // User has explicitly set a preference - respect it
      setIsCollapsed(userPreference === 'true')
    } else {
      // No explicit preference - collapse by default unless they have saved content
      setIsCollapsed(!hasContent)
    }
  }, [])

  // Broadcast collapse state changes
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('sidebarCollapsed', String(isCollapsed))
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { isCollapsed } }))
  }, [isCollapsed, mounted])

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

  const fetchSavedAIEditorAnalyses = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
      setSavedAIEditorAnalyses(saved.slice(0, 10))
    } catch (error) {
      console.error('Error fetching saved AI editor analyses:', error)
      setSavedAIEditorAnalyses([])
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
    fetchSavedAIEditorAnalyses()

    // Listen for new saved search events
    const onSaved = (e: Event) => {
      const ev = e as CustomEvent<{ query: string; filters?: any; created_at?: string }>
      if (ev?.detail?.query) {
        setLastSaved(ev.detail.query)
        fetchSavedSearches() // Refresh from localStorage
      }
    }

    // Listen for new AI editor saved events
    const onAIEditorSaved = (e: Event) => {
      const ev = e as CustomEvent<{ text: string; preview?: string; timestamp?: string }>
      if (ev?.detail?.text) {
        fetchSavedAIEditorAnalyses() // Refresh from localStorage
      }
    }

    window.addEventListener('saved-search-created', onSaved as EventListener)
    window.addEventListener('ai-editor-saved', onAIEditorSaved as EventListener)
    return () => {
      window.removeEventListener('saved-search-created', onSaved as EventListener)
      window.removeEventListener('ai-editor-saved', onAIEditorSaved as EventListener)
    }
  }, [mounted])

  // Track when user performs a search
  useEffect(() => {
    if (!mounted || !currentQuery) return
    addToRecentSearches(currentQuery)
  }, [currentQuery, mounted])

  const handleSearchClick = (query: string, type?: string, fullText?: string, cachedResult?: any) => {
    if (type === 'ai-editor') {
      // Navigate to AI editor page and load the full text with cached result
      router.push('/ai-editor')
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('load-ai-editor-text', {
          detail: {
            text: fullText || query,
            cachedResult: cachedResult
          }
        }))
      }, 100)
    } else {
      // Regular search - navigate to explore page
      // Store cached result in sessionStorage for immediate use
      if (cachedResult) {
        sessionStorage.setItem('pending-search-cache', JSON.stringify({
          query,
          cachedResult,
          timestamp: Date.now()
        }))
      }
      router.push(`/explore?q=${encodeURIComponent(query)}`)
    }
  }

  const deleteRecentSearch = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      const filtered = recent.filter((s: any) => s.id !== id)
      localStorage.setItem('recentSearches', JSON.stringify(filtered))
      setRecentSearches(filtered.slice(0, 10))
    } catch (error) {
      console.error('Error deleting recent search:', error)
    }
  }

  const clearAllRecentSearches = () => {
    try {
      localStorage.setItem('recentSearches', '[]')
      setRecentSearches([])
    } catch (error) {
      console.error('Error clearing recent searches:', error)
    }
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

  const clearAllSavedSearches = () => {
    try {
      localStorage.setItem('savedSearches', '[]')
      setSavedSearches([])
    } catch (error) {
      console.error('Error clearing saved searches:', error)
    }
  }

  const handleAIEditorAnalysisClick = (text: string) => {
    // Navigate to AI editor page and dispatch event with text to load
    router.push('/ai-editor')
    // Use setTimeout to ensure navigation completes before dispatching event
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('load-ai-editor-text', { detail: { text } }))
    }, 100)
  }

  const deleteSavedAIEditorAnalysis = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      const saved = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
      const filtered = saved.filter((s: any) => s.id !== id)
      localStorage.setItem('savedAIEditorAnalyses', JSON.stringify(filtered))
      setSavedAIEditorAnalyses(filtered.slice(0, 10))
      showToast('Analysis deleted')
    } catch (error) {
      console.error('Error deleting saved AI editor analysis:', error)
      showToast('Failed to delete analysis', 'error')
    }
  }

  const clearAllSavedAIEditorAnalyses = () => {
    try {
      const count = savedAIEditorAnalyses.length
      localStorage.setItem('savedAIEditorAnalyses', '[]')
      setSavedAIEditorAnalyses([])
      showToast(`${count} ${count === 1 ? 'analysis' : 'analyses'} cleared`)
    } catch (error) {
      console.error('Error clearing saved AI editor analyses:', error)
      showToast('Failed to clear analyses', 'error')
    }
  }

  if (!mounted) {
    // Avoid hydration mismatches by deferring render until client is ready
    return null
  }

  return (
    <>
      {/* Collapsed Sidebar - Floating Toggle Button */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed left-4 top-20 z-20 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-all"
          title="Expand sidebar"
        >
          <PanelLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
          isCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ width: '220px' }}
      >
        {/* Header with accent line */}
        <div className="flex-shrink-0 border-b border-blue-100 relative" style={{ padding: '12px' }}>
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: 'linear-gradient(90deg, #3b82f6 0%, rgba(59, 130, 246, 0.3) 100%)' }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Saved
              </h2>
              {(savedSearches.length + savedAIEditorAnalyses.length) > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-medium text-blue-700 bg-blue-100 rounded-full">
                  {savedSearches.length + savedAIEditorAnalyses.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            {savedSearches.length} searches · {savedAIEditorAnalyses.length} analyses
          </p>
        </div>

        {/* Fixed Header Section - only show when on results page */}
        {isResultsPage && currentQuery && (
          <div className="flex-shrink-0 border-b border-blue-200" style={{ padding: '8px 12px', backgroundColor: '#eff6ff' }}>
            <span className="text-[10px] text-blue-700 font-medium">Current: {currentQuery}</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0 sidebar-scroll" style={{ padding: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <>
                <div className="flex items-center justify-between px-1 pt-1">
                  <div className="flex items-center gap-1.5">
                    <SearchIcon className="w-3 h-3 text-blue-600" />
                    <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Searches</span>
                  </div>
                  <button
                    onClick={clearAllSavedSearches}
                    className="text-[9px] text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {savedSearches.slice(0, 5).map((search) => (
                  <div key={search.id} className="relative group">
                    <button
                      onClick={() => handleSearchClick(search.query, 'search', undefined, search.cachedResult)}
                      className="w-full text-left transition-all duration-150"
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.borderColor = '#e5e7eb'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <SearchIcon className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-snug">
                            {search.query}
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-gray-400 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{timeAgo(search.timestamp)}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      </div>
                    </button>
                    <button
                      onClick={(e) => deleteSavedSearch(e, search.id)}
                      className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <X className="w-2.5 h-2.5 text-red-500" />
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* Saved Analyses */}
            {savedAIEditorAnalyses.length > 0 && (
              <>
                <div className="flex items-center justify-between px-1 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Analyses</span>
                  </div>
                  <button
                    onClick={clearAllSavedAIEditorAnalyses}
                    className="text-[9px] text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {savedAIEditorAnalyses.map((analysis) => (
                  <div key={analysis.id} className="relative group">
                    <button
                      onClick={() => handleAIEditorAnalysisClick(analysis.text)}
                      className="w-full text-left transition-all duration-150"
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.borderColor = '#e5e7eb'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-snug">
                            {analysis.preview || analysis.text}
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-gray-400 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{timeAgo(analysis.timestamp)}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      </div>
                    </button>
                    <button
                      onClick={(e) => deleteSavedAIEditorAnalysis(e, analysis.id)}
                      className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <X className="w-2.5 h-2.5 text-red-500" />
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* Empty State */}
            {savedSearches.length === 0 && savedAIEditorAnalyses.length === 0 && (
              <div className="text-center py-8 px-3">
                <Bookmark className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                <p className="text-[10px] text-gray-500">No saved items yet</p>
                <p className="text-[9px] text-gray-400 mt-1">
                  Save searches or analyses to see them here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div
          className="flex-shrink-0 border-t border-gray-200"
          style={{ padding: '8px 12px', backgroundColor: '#f9fafb' }}
        >
          <div className="flex items-center justify-between text-[9px] text-gray-500">
            <span>{savedSearches.length} searches</span>
            <span>{savedAIEditorAnalyses.length} analyses</span>
          </div>
        </div>
      </aside>
  </>
  )
}


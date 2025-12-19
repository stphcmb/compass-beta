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
    // Load collapsed state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState === 'true') {
      setIsCollapsed(true)
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
      // Regular search
      router.push(`/results?q=${encodeURIComponent(query)}`)
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
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
          isCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ width: '256px' }}
      >
        {/* Toggle Button - Inside Sidebar */}
        <div className="absolute right-2 top-20 z-10">
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Fixed Header Section - only show when on results page */}
        {isResultsPage && (
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 mb-3 hover:underline flex items-center gap-1"
          >
            <ChevronRight className="w-3 h-3 rotate-180" />
            New Search
          </button>
          {currentQuery && (
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-xs text-gray-500 mb-1">Current Search</div>
              <div className="text-sm font-medium">{currentQuery}</div>
            </div>
          )}
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4 space-y-8 min-h-0 sidebar-scroll">
        {/* Saved Analyses */}
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-100">
          <div className="flex items-center gap-2" title="Your saved AI Editor analyses - click to reload text and results">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Analyses
            </h3>
            {savedAIEditorAnalyses.length > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-medium text-purple-700 bg-purple-100 rounded-full">
                {savedAIEditorAnalyses.length}
              </span>
            )}
          </div>
          {savedAIEditorAnalyses.length > 0 && (
            <button
              onClick={clearAllSavedAIEditorAnalyses}
              className="text-xs text-gray-500 hover:text-red-600 hover:underline transition-colors"
              title="Clear all saved analyses"
            >
              Clear
            </button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          {savedAIEditorAnalyses.length === 0 ? (
            <div className="text-center py-6 px-3">
              <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500 leading-relaxed">
                No saved analyses yet
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                Use AI Editor to analyze your text
              </p>
            </div>
          ) : (
            savedAIEditorAnalyses.map((analysis) => (
              <div key={analysis.id} className="relative group">
                <button
                  onClick={() => handleAIEditorAnalysisClick(analysis.text)}
                  className="w-full text-left p-2 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-700 mt-0.5" />
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="text-sm text-gray-800 line-clamp-2">
                        {analysis.preview || analysis.text}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{timeAgo(analysis.timestamp)}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-purple-700" />
                  </div>
                </button>
                <button
                  onClick={(e) => deleteSavedAIEditorAnalysis(e, analysis.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                  title="Delete saved analysis"
                >
                  <X className="w-3 h-3 text-red-600" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </aside>
  </>
  )
}


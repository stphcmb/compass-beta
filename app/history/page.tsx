'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  History,
  Search,
  Sparkles,
  Star,
  Clock,
  Trash2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Calendar,
  Filter,
  X,
  MessageSquare,
  Edit3,
  Check,
  Users,
  Compass,
  ThumbsUp,
  RotateCcw
} from 'lucide-react'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import EmptyStateComponent from '@/components/EmptyState'
import { useAuthorPanel } from '@/contexts/AuthorPanelContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

interface SearchItem {
  id: string
  query: string
  timestamp: string
  domain?: string
  camp?: string
  cachedResult?: any
  note?: string
}

interface AnalysisItem {
  id: string
  text: string
  preview?: string
  timestamp: string
  cachedResult?: any
  note?: string
}

interface FavoriteAuthor {
  id: string
  name: string
  addedAt: string
}

interface AuthorNote {
  id: string
  name: string
  note: string
  updatedAt: string
}

interface HelpfulInsight {
  id: string
  type: 'summary' | 'camp'
  content: string
  campLabel?: string
  originalText: string
  fullText?: string
  cachedResult?: any
  analysisId?: string
  timestamp: string
}

interface DeletedItem {
  id: string
  type: 'favorite' | 'note' | 'search' | 'analysis'
  name: string
  data: any
  deletedAt: string
}

type TabType = 'all' | 'searches' | 'analyses' | 'insights' | 'authors'
type TimeFilter = 'all' | 'today' | 'week' | 'month'

export default function HistoryPage() {
  const router = useRouter()
  const { openPanel } = useAuthorPanel()
  const { showToast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [showAboutModal, setShowAboutModal] = useState(false)

  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})
  // Favorite authors filter
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showRecentlyDeleted, setShowRecentlyDeleted] = useState(false)

  // Data states
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([])
  const [savedSearches, setSavedSearches] = useState<SearchItem[]>([])
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisItem[]>([])
  const [favoriteAuthors, setFavoriteAuthors] = useState<FavoriteAuthor[]>([])
  const [authorNotes, setAuthorNotes] = useState<AuthorNote[]>([])
  const [helpfulInsights, setHelpfulInsights] = useState<HelpfulInsight[]>([])
  const [authorDetails, setAuthorDetails] = useState<Record<string, any>>({})
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([])

  useEffect(() => {
    setMounted(true)
    loadAllData()

    // Check for auto-show modal
    const seenCount = parseInt(localStorage.getItem('historyPageSeenCount') || '0', 10)
    if (seenCount < 2) {
      setShowAboutModal(true)
      localStorage.setItem('historyPageSeenCount', String(seenCount + 1))
    }

    // Listen for note updates from Author panel
    const handleNoteUpdated = (e: CustomEvent<{ name: string; note: string }>) => {
      // Reload author notes from localStorage
      try {
        const notes = JSON.parse(localStorage.getItem('authorNotes') || '[]')
        setAuthorNotes(notes)
      } catch {
        setAuthorNotes([])
      }
    }
    window.addEventListener('author-note-updated', handleNoteUpdated as EventListener)

    // Listen for favorite added from Author panel
    const handleFavoriteAdded = () => {
      loadAllData()
    }
    window.addEventListener('favorite-author-added', handleFavoriteAdded)

    // Listen for helpful insights added from AI Editor
    const handleInsightAdded = () => {
      try {
        const insights = JSON.parse(localStorage.getItem('helpfulInsights') || '[]')
        setHelpfulInsights(insights)
      } catch {
        setHelpfulInsights([])
      }
    }
    window.addEventListener('helpful-insight-added', handleInsightAdded)

    // Listen for search note updates from SearchResults
    const handleSearchNoteUpdated = () => {
      try {
        const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
        setRecentSearches(recent)
      } catch {
        setRecentSearches([])
      }
    }
    window.addEventListener('search-note-updated', handleSearchNoteUpdated)

    return () => {
      window.removeEventListener('author-note-updated', handleNoteUpdated as EventListener)
      window.removeEventListener('favorite-author-added', handleFavoriteAdded)
      window.removeEventListener('helpful-insight-added', handleInsightAdded)
      window.removeEventListener('search-note-updated', handleSearchNoteUpdated)
    }
  }, [])

  const loadAllData = () => {
    // Load recent searches
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      setRecentSearches(recent)
    } catch { setRecentSearches([]) }

    // Load saved searches
    try {
      const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]')
      setSavedSearches(saved)
    } catch { setSavedSearches([]) }

    // Load saved analyses
    try {
      const analyses = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
      setSavedAnalyses(analyses)
    } catch { setSavedAnalyses([]) }

    // Load favorite authors
    try {
      const favorites = JSON.parse(localStorage.getItem('favoriteAuthors') || '[]')
      setFavoriteAuthors(favorites)
    } catch { setFavoriteAuthors([]) }

    // Load author notes
    try {
      const notes = JSON.parse(localStorage.getItem('authorNotes') || '[]')
      setAuthorNotes(notes)
    } catch { setAuthorNotes([]) }

    // Load helpful insights
    try {
      const insights = JSON.parse(localStorage.getItem('helpfulInsights') || '[]')
      setHelpfulInsights(insights)
    } catch { setHelpfulInsights([]) }

    // Load recently deleted items (clean up items older than 30 days)
    try {
      const deleted = JSON.parse(localStorage.getItem('recentlyDeletedItems') || '[]')
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
      const validDeleted = deleted.filter((item: DeletedItem) =>
        new Date(item.deletedAt).getTime() > thirtyDaysAgo
      )
      if (validDeleted.length !== deleted.length) {
        localStorage.setItem('recentlyDeletedItems', JSON.stringify(validDeleted))
      }
      setDeletedItems(validDeleted)
    } catch { setDeletedItems([]) }

    // Load author details from database for both favorites and notes
    try {
      const favorites = JSON.parse(localStorage.getItem('favoriteAuthors') || '[]')
      const notes = JSON.parse(localStorage.getItem('authorNotes') || '[]')
      const allNames = [...new Set([
        ...favorites.map((f: FavoriteAuthor) => f.name),
        ...notes.map((n: AuthorNote) => n.name)
      ])]
      if (allNames.length > 0) {
        loadAuthorDetails(allNames)
      }
    } catch {}
  }

  const loadAuthorDetails = async (authorNames: string[]) => {
    if (!supabase || authorNames.length === 0) return
    try {
      const { data } = await supabase
        .from('authors')
        .select('name, affiliation, primary_domain')
        .in('name', authorNames)

      if (data) {
        const details: Record<string, any> = {}
        data.forEach(author => {
          details[author.name] = author
        })
        setAuthorDetails(details)
      }
    } catch (error) {
      console.error('Error loading author details:', error)
    }
  }

  const timeAgo = (ts?: string) => {
    if (!ts) return ''
    const diffMs = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `${weeks}w ago`
    const months = Math.floor(days / 30)
    return `${months}mo ago`
  }

  const formatDate = (ts: string) => {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const filterByTime = <T extends { timestamp?: string; addedAt?: string }>(items: T[]): T[] => {
    if (timeFilter === 'all') return items
    const now = Date.now()
    const cutoff = {
      today: now - 24 * 60 * 60 * 1000,
      week: now - 7 * 24 * 60 * 60 * 1000,
      month: now - 30 * 24 * 60 * 60 * 1000
    }[timeFilter]

    return items.filter(item => {
      const ts = item.timestamp || item.addedAt
      if (!ts) return false
      return new Date(ts).getTime() > cutoff
    })
  }

  const handleSearchClick = (query: string, cachedResult?: any) => {
    if (cachedResult) {
      sessionStorage.setItem('pending-search-cache', JSON.stringify({
        query,
        cachedResult,
        timestamp: Date.now()
      }))
    }
    router.push(`/explore?q=${encodeURIComponent(query)}`)
  }

  const handleAnalysisClick = (id: string, text: string, cachedResult?: any) => {
    if (cachedResult) {
      // Navigate directly to results page
      router.push(`/ai-editor/results/${id}`)
    } else {
      // No cached result - go to editor and load text
      router.push('/ai-editor')
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('load-ai-editor-text', {
          detail: { text, autoAnalyze: true }
        }))
      }, 100)
    }
  }

  const handleAuthorClick = async (name: string) => {
    // Find author ID by name and open the author panel
    if (!supabase) {
      router.push(`/authors?author=${encodeURIComponent(name)}`)
      return
    }

    try {
      const { data } = await supabase
        .from('authors')
        .select('id')
        .eq('name', name)
        .single()

      if (data?.id) {
        openPanel(data.id)
      } else {
        // Fallback to authors page if ID not found
        router.push(`/authors?author=${encodeURIComponent(name)}`)
      }
    } catch {
      router.push(`/authors?author=${encodeURIComponent(name)}`)
    }
  }

  const deleteRecentSearch = (id: string) => {
    const search = recentSearches.find(s => s.id === id)
    if (search) {
      addToRecentlyDeleted({
        id: `deleted-search-${Date.now()}`,
        type: 'search',
        name: search.query,
        data: search,
        deletedAt: new Date().toISOString()
      })
    }
    const filtered = recentSearches.filter(s => s.id !== id)
    localStorage.setItem('recentSearches', JSON.stringify(filtered))
    setRecentSearches(filtered)
  }

  const deleteSavedSearch = (id: string) => {
    const search = savedSearches.find(s => s.id === id)
    if (search) {
      addToRecentlyDeleted({
        id: `deleted-search-${Date.now()}`,
        type: 'search',
        name: search.query,
        data: { ...search, wasSaved: true },
        deletedAt: new Date().toISOString()
      })
    }
    const filtered = savedSearches.filter(s => s.id !== id)
    localStorage.setItem('savedSearches', JSON.stringify(filtered))
    setSavedSearches(filtered)
  }

  const deleteAnalysis = (id: string) => {
    const analysis = savedAnalyses.find(a => a.id === id)
    if (analysis) {
      addToRecentlyDeleted({
        id: `deleted-analysis-${Date.now()}`,
        type: 'analysis',
        name: analysis.preview || analysis.text.slice(0, 50),
        data: analysis,
        deletedAt: new Date().toISOString()
      })
    }
    const filtered = savedAnalyses.filter(a => a.id !== id)
    localStorage.setItem('savedAIEditorAnalyses', JSON.stringify(filtered))
    setSavedAnalyses(filtered)
  }

  // Helper function to add item to recently deleted
  const addToRecentlyDeleted = (item: DeletedItem) => {
    const updated = [item, ...deletedItems]
    localStorage.setItem('recentlyDeletedItems', JSON.stringify(updated))
    setDeletedItems(updated)
  }

  const removeFavoriteAuthor = (name: string) => {
    const removedAuthor = favoriteAuthors.find(a => a.name === name)
    const filtered = favoriteAuthors.filter(a => a.name !== name)
    localStorage.setItem('favoriteAuthors', JSON.stringify(filtered))
    setFavoriteAuthors(filtered)
    // Dispatch event for other components to update
    window.dispatchEvent(new CustomEvent('favorite-author-removed', { detail: { name } }))

    // Move to recently deleted
    if (removedAuthor) {
      addToRecentlyDeleted({
        id: removedAuthor.id,
        type: 'favorite',
        name: removedAuthor.name,
        data: removedAuthor,
        deletedAt: new Date().toISOString()
      })
      showToast(`Removed ${name} from favorites`, 'info')
    }
  }

  // Note update functions
  const updateSavedSearchNote = (id: string, note: string) => {
    const updated = savedSearches.map(s => s.id === id ? { ...s, note } : s)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
    setSavedSearches(updated)
  }

  const updateAnalysisNote = (id: string, note: string) => {
    const updated = savedAnalyses.map(a => a.id === id ? { ...a, note } : a)
    localStorage.setItem('savedAIEditorAnalyses', JSON.stringify(updated))
    setSavedAnalyses(updated)
  }

  const updateRecentSearchNote = (id: string, note: string) => {
    // If adding a note, auto-save the search and move it to saved searches
    if (note && note.trim()) {
      const search = recentSearches.find(s => s.id === id)
      if (search) {
        // Create a new saved search with the note
        const savedSearch = {
          ...search,
          id: `saved-${Date.now()}`, // New ID for saved search
          note: note,
          timestamp: new Date().toISOString() // Update timestamp
        }

        // Add to saved searches (avoid duplicates by query)
        const existingSaved = savedSearches.filter(s => s.query !== search.query)
        const updatedSaved = [savedSearch, ...existingSaved]
        localStorage.setItem('savedSearches', JSON.stringify(updatedSaved))
        setSavedSearches(updatedSaved)

        // Remove from recent searches
        const updatedRecent = recentSearches.filter(s => s.id !== id)
        localStorage.setItem('recentSearches', JSON.stringify(updatedRecent))
        setRecentSearches(updatedRecent)

        showToast('Search saved with note', 'success')
        return
      }
    }

    // If removing note, just update in place
    const updated = recentSearches.map(s => s.id === id ? { ...s, note: note || undefined } : s)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
    setRecentSearches(updated)
  }

  const deleteAuthorNote = (name: string) => {
    const removedNote = authorNotes.find(n => n.name === name)
    const filtered = authorNotes.filter(n => n.name !== name)
    localStorage.setItem('authorNotes', JSON.stringify(filtered))
    setAuthorNotes(filtered)
    // Dispatch event to sync with author panel
    window.dispatchEvent(new CustomEvent('author-note-updated', {
      detail: { name, note: '' }
    }))

    // Move to recently deleted
    if (removedNote) {
      addToRecentlyDeleted({
        id: removedNote.id,
        type: 'note',
        name: removedNote.name,
        data: removedNote,
        deletedAt: new Date().toISOString()
      })
      showToast(`Removed note for ${name}`, 'info')
    }
  }

  // Restore deleted item
  const restoreDeletedItem = (item: DeletedItem) => {
    if (item.type === 'favorite') {
      const current = JSON.parse(localStorage.getItem('favoriteAuthors') || '[]')
      const restored = [item.data, ...current]
      localStorage.setItem('favoriteAuthors', JSON.stringify(restored))
      setFavoriteAuthors(restored)
      window.dispatchEvent(new CustomEvent('favorite-author-added', { detail: item.data }))
    } else if (item.type === 'note') {
      const current = JSON.parse(localStorage.getItem('authorNotes') || '[]')
      const restored = [item.data, ...current]
      localStorage.setItem('authorNotes', JSON.stringify(restored))
      setAuthorNotes(restored)
      window.dispatchEvent(new CustomEvent('author-note-updated', {
        detail: { name: item.name, note: item.data.note }
      }))
    } else if (item.type === 'search') {
      if (item.data.wasSaved) {
        // Restore as saved search
        const { wasSaved, ...searchData } = item.data
        const current = JSON.parse(localStorage.getItem('savedSearches') || '[]')
        const restored = [searchData, ...current]
        localStorage.setItem('savedSearches', JSON.stringify(restored))
        setSavedSearches(restored)
      } else {
        // Restore as recent search
        const current = JSON.parse(localStorage.getItem('recentSearches') || '[]')
        const restored = [item.data, ...current]
        localStorage.setItem('recentSearches', JSON.stringify(restored))
        setRecentSearches(restored)
      }
    } else if (item.type === 'analysis') {
      const current = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
      const restored = [item.data, ...current]
      localStorage.setItem('savedAIEditorAnalyses', JSON.stringify(restored))
      setSavedAnalyses(restored)
    }

    // Remove from deleted items
    const filtered = deletedItems.filter(d => d.id !== item.id)
    localStorage.setItem('recentlyDeletedItems', JSON.stringify(filtered))
    setDeletedItems(filtered)

    const typeLabels: Record<string, string> = {
      favorite: 'favorite author',
      note: 'author note',
      search: item.data?.wasSaved ? 'saved search' : 'recent search',
      analysis: 'analysis'
    }
    showToast(`Restored ${typeLabels[item.type] || item.type}`, 'success')
  }

  // Permanently delete item
  const permanentlyDeleteItem = (id: string) => {
    const filtered = deletedItems.filter(d => d.id !== id)
    localStorage.setItem('recentlyDeletedItems', JSON.stringify(filtered))
    setDeletedItems(filtered)
  }

  // Clear all recently deleted
  const clearAllDeleted = () => {
    localStorage.setItem('recentlyDeletedItems', '[]')
    setDeletedItems([])
  }

  const updateAuthorNote = (name: string, note: string) => {
    const now = new Date().toISOString()
    const existingNote = authorNotes.find(n => n.name === name)

    let updated: AuthorNote[]
    if (existingNote) {
      // Update existing note
      updated = authorNotes.map(n =>
        n.name === name ? { ...n, note, updatedAt: now } : n
      )
    } else {
      // Create new note
      const newNote: AuthorNote = {
        id: `note-${Date.now()}`,
        name,
        note,
        updatedAt: now
      }
      updated = [newNote, ...authorNotes]
    }

    localStorage.setItem('authorNotes', JSON.stringify(updated))
    setAuthorNotes(updated)
    // Dispatch event to sync with author panel
    window.dispatchEvent(new CustomEvent('author-note-updated', {
      detail: { name, note }
    }))
  }

  const clearAllByType = (type: 'recent' | 'saved' | 'analyses' | 'notes' | 'favorites') => {
    switch (type) {
      case 'recent':
        localStorage.setItem('recentSearches', '[]')
        setRecentSearches([])
        break
      case 'saved':
        localStorage.setItem('savedSearches', '[]')
        setSavedSearches([])
        break
      case 'analyses':
        localStorage.setItem('savedAIEditorAnalyses', '[]')
        setSavedAnalyses([])
        break
      case 'notes':
        localStorage.setItem('authorNotes', '[]')
        setAuthorNotes([])
        // Dispatch event to clear notes in author panels
        window.dispatchEvent(new CustomEvent('author-notes-cleared'))
        break
      case 'favorites':
        localStorage.setItem('favoriteAuthors', '[]')
        setFavoriteAuthors([])
        break
    }
  }

  // Combine favorites and notes into a unified authors list
  const getUniqueAuthorsCount = () => {
    const authorNames = new Set([
      ...favoriteAuthors.map(f => f.name),
      ...authorNotes.map(n => n.name)
    ])
    return authorNames.size
  }

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  const filteredRecentSearches = filterByTime(recentSearches)
  const filteredSavedSearches = filterByTime(savedSearches)
  const filteredAnalyses = filterByTime(savedAnalyses)
  const filteredInsights = filterByTime(helpfulInsights)
  const filteredAuthorNotes = filterByTime(authorNotes.map(n => ({ ...n, timestamp: n.updatedAt })))
  const filteredFavorites = filterByTime(favoriteAuthors)

  // Calculate filtered author count
  const getFilteredAuthorsCount = () => {
    const authorNames = new Set([
      ...filteredFavorites.map(f => f.name),
      ...filteredAuthorNotes.map(n => n.name)
    ])
    return authorNames.size
  }

  // Use filtered counts for tabs when filter is applied
  const tabs = [
    { id: 'all' as TabType, label: 'All Activity', count: filteredAnalyses.length + filteredInsights.length + getFilteredAuthorsCount() + filteredRecentSearches.length + filteredSavedSearches.length },
    { id: 'analyses' as TabType, label: 'Analyses', count: filteredAnalyses.length },
    { id: 'insights' as TabType, label: 'Helpful Insights', count: filteredInsights.length },
    { id: 'authors' as TabType, label: 'Authors', count: getFilteredAuthorsCount() },
    { id: 'searches' as TabType, label: 'Searches', count: filteredRecentSearches.length + filteredSavedSearches.length },
  ]

  if (!mounted) return null

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <Header sidebarCollapsed={true} />

      {/* Main Content */}
      <main
        className="flex-1 mt-16 overflow-auto bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/30"
      >
        <div className="max-w-4xl mx-auto" style={{ padding: '24px' }}>
          {/* Page Header - Centered like Explore page */}
          <PageHeader
            icon={<History size={24} />}
            iconVariant="purple"
            title="Your History"
            subtitle="Your research journey, all in one place."
            helpButton={{
              label: 'How it works',
              onClick: () => setShowAboutModal(true)
            }}
          />

          {/* Framing Question */}
          <div className="text-center mb-4">
            <h3 className="text-[17px] font-semibold text-gray-900 mb-2">What have you explored so far?</h3>
          </div>

          {/* Horizontal Navigation Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '16px'
          }}>
            {/* Category Tabs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              overflowX: 'auto',
              paddingBottom: '2px'
            }}>
              {tabs.map(tab => {
                const icons: Record<TabType, React.ReactNode> = {
                  all: <History size={12} />,
                  searches: <Search size={12} />,
                  analyses: <Sparkles size={12} />,
                  insights: <ThumbsUp size={12} />,
                  authors: <Users size={12} />
                }
                const colors: Record<TabType, string> = {
                  all: '#6366f1',
                  searches: '#3b82f6',
                  analyses: '#8b5cf6',
                  insights: '#10b981',
                  authors: '#059669'
                }
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 10px',
                      borderRadius: '16px',
                      border: activeTab === tab.id ? `1.5px solid ${colors[tab.id]}` : '1.5px solid transparent',
                      background: activeTab === tab.id ? `${colors[tab.id]}12` : '#f5f5f5',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.background = '#ebebeb'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.background = '#f5f5f5'
                        e.currentTarget.style.borderColor = 'transparent'
                      }
                    }}
                  >
                    <span style={{ color: activeTab === tab.id ? colors[tab.id] : 'var(--color-mid-gray)' }}>
                      {icons[tab.id]}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: activeTab === tab.id ? 600 : 500,
                      color: activeTab === tab.id ? colors[tab.id] : 'var(--color-charcoal)'
                    }}>
                      {tab.label}
                    </span>
                    <span style={{
                      padding: '0px 5px',
                      borderRadius: '6px',
                      background: activeTab === tab.id ? `${colors[tab.id]}25` : '#e5e7eb',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: activeTab === tab.id ? colors[tab.id] : 'var(--color-mid-gray)'
                    }}>
                      {tab.count}
                    </span>
                  </button>
                )
              })}

              {/* Recently Deleted */}
              <button
                onClick={() => setShowRecentlyDeleted(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '16px',
                  border: '1.5px solid transparent',
                  background: deletedItems.length > 0 ? '#fef2f2' : '#f5f5f5',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = deletedItems.length > 0 ? '#fee2e2' : '#ebebeb'
                  e.currentTarget.style.borderColor = deletedItems.length > 0 ? '#fecaca' : '#d1d5db'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = deletedItems.length > 0 ? '#fef2f2' : '#f5f5f5'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <span style={{ color: deletedItems.length > 0 ? '#ef4444' : 'var(--color-mid-gray)' }}>
                  <Trash2 size={12} />
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: deletedItems.length > 0 ? '#b91c1c' : 'var(--color-charcoal)'
                }}>
                  Deleted
                </span>
                {deletedItems.length > 0 && (
                  <span style={{
                    padding: '0px 5px',
                    borderRadius: '6px',
                    background: '#fecaca',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#dc2626'
                  }}>
                    {deletedItems.length}
                  </span>
                )}
              </button>
            </div>

            {/* Time Filter */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              style={{
                padding: '5px 8px',
                borderRadius: '6px',
                border: '1px solid var(--color-light-gray)',
                background: 'white',
                fontSize: '12px',
                color: 'var(--color-charcoal)',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>

        {/* Content - Single column layout for "All" view */}
        {activeTab === 'all' ? (
          // Only show full empty state when there's truly NO history at all (unfiltered)
          timeFilter === 'all' &&
          recentSearches.length === 0 &&
          savedSearches.length === 0 &&
          savedAnalyses.length === 0 &&
          helpfulInsights.length === 0 &&
          favoriteAuthors.length === 0 &&
          authorNotes.length === 0 ? (
            <EmptyStateComponent
              icon={History}
              iconColor="var(--color-indigo-500)"
              iconBgFrom="var(--color-indigo-50)"
              iconBgTo="var(--color-indigo-100)"
              title="Your research journey starts here"
              description="As you explore perspectives, analyze content, and bookmark authors, your activity will be tracked here."
              action={{
                label: "Explore Perspectives",
                onClick: () => router.push('/explore'),
                icon: Compass
              }}
              size="lg"
            />
          ) : (
          <div className="bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/50 border border-purple-100/50 rounded-xl p-5">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Searches - 2-column layout */}
            {(filteredSavedSearches.length > 0 || filteredRecentSearches.length > 0) && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px'
              }}>
                {/* Saved Searches Column */}
                <CollapsibleSection
                  id="saved-searches"
                  title="Saved"
                  icon={<Star size={14} style={{ color: '#f59e0b' }} />}
                  count={filteredSavedSearches.length}
                  isCollapsed={collapsedSections['saved-searches']}
                  onToggle={() => toggleSection('saved-searches')}
                  onClear={() => clearAllByType('saved')}
                  color="#f59e0b"
                >
                  {filteredSavedSearches.length > 0 ? (
                    <>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        width: '100%',
                        maxHeight: '180px',
                        overflowY: filteredSavedSearches.length > 3 ? 'auto' : 'visible',
                        paddingRight: filteredSavedSearches.length > 3 ? '4px' : '0'
                      }}>
                        {filteredSavedSearches.slice(0, 5).map(s => (
                          <SearchCard
                            key={s.id}
                            query={s.query}
                            timestamp={timeAgo(s.timestamp)}
                            isSaved={true}
                            note={s.note}
                            onClick={() => handleSearchClick(s.query, s.cachedResult)}
                            onDelete={() => deleteSavedSearch(s.id)}
                          />
                        ))}
                      </div>
                      {filteredSavedSearches.length > 5 && (
                        <div style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center', marginTop: '6px' }}>
                          <button
                            onClick={() => setActiveTab('searches')}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#3b82f6',
                              cursor: 'pointer',
                              fontSize: '10px',
                              fontWeight: 500
                            }}
                          >
                            +{filteredSavedSearches.length - 5} more →
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', padding: '12px 0' }}>
                      No saved searches yet
                    </div>
                  )}
                </CollapsibleSection>

                {/* Recent Searches Column */}
                <CollapsibleSection
                  id="recent-searches"
                  title="Recent"
                  icon={<Clock size={14} style={{ color: '#6b7280' }} />}
                  count={filteredRecentSearches.length}
                  isCollapsed={collapsedSections['recent-searches']}
                  onToggle={() => toggleSection('recent-searches')}
                  onClear={() => clearAllByType('recent')}
                  color="#6b7280"
                >
                  {filteredRecentSearches.length > 0 ? (
                    <>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        width: '100%',
                        maxHeight: '180px',
                        overflowY: filteredRecentSearches.length > 3 ? 'auto' : 'visible',
                        paddingRight: filteredRecentSearches.length > 3 ? '4px' : '0'
                      }}>
                        {filteredRecentSearches.slice(0, 5).map(s => (
                          <SearchCard
                            key={s.id}
                            query={s.query}
                            timestamp={timeAgo(s.timestamp)}
                            isSaved={false}
                            note={s.note}
                            onClick={() => handleSearchClick(s.query, s.cachedResult)}
                            onDelete={() => deleteRecentSearch(s.id)}
                          />
                        ))}
                      </div>
                      {filteredRecentSearches.length > 5 && (
                        <div style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center', marginTop: '6px' }}>
                          <button
                            onClick={() => setActiveTab('searches')}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#3b82f6',
                              cursor: 'pointer',
                              fontSize: '10px',
                              fontWeight: 500
                            }}
                          >
                            +{filteredRecentSearches.length - 5} more →
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', padding: '12px 0' }}>
                      No recent searches yet
                    </div>
                  )}
                </CollapsibleSection>
              </div>
            )}

            {/* Empty state when no searches at all */}
            {filteredRecentSearches.length === 0 && filteredSavedSearches.length === 0 && (
              <div style={{
                padding: '24px 16px',
                textAlign: 'center',
                background: '#fafafa',
                borderRadius: '10px',
                border: '1px dashed #e5e7eb'
              }}>
                <Search size={24} style={{ color: '#d1d5db', margin: '0 auto 8px' }} />
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                  {timeFilter !== 'all' ? 'No searches in this time period' : 'Your search history will appear here'}
                </div>
                <button
                  onClick={() => router.push('/explore')}
                  style={{
                    padding: '6px 12px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Start Exploring
                </button>
              </div>
            )}

            {/* AI Analyses - Collapsible (always visible) */}
            <CollapsibleSection
              id="analyses"
              title="AI Analyses"
              icon={<Sparkles size={16} style={{ color: '#8b5cf6' }} />}
              count={filteredAnalyses.length}
              isCollapsed={collapsedSections['analyses']}
              onToggle={() => toggleSection('analyses')}
              onClear={() => clearAllByType('analyses')}
              color="#8b5cf6"
            >
              {filteredAnalyses.length > 0 ? (
                <>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    width: '100%',
                    maxHeight: filteredAnalyses.length > 3 ? '260px' : 'none',
                    overflowY: filteredAnalyses.length > 3 ? 'auto' : 'visible',
                    paddingRight: filteredAnalyses.length > 3 ? '4px' : '0'
                  }}>
                    {filteredAnalyses.map(analysis => (
                      <AnalysisCard
                        key={analysis.id}
                        inputPreview={analysis.preview || analysis.text}
                        cachedResult={analysis.cachedResult}
                        timestamp={timeAgo(analysis.timestamp)}
                        note={analysis.note}
                        onClick={() => handleAnalysisClick(analysis.id, analysis.text, analysis.cachedResult)}
                        onDelete={() => deleteAnalysis(analysis.id)}
                      />
                    ))}
                  </div>
                  {filteredAnalyses.length > 3 && (
                    <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', marginTop: '8px' }}>
                      Scroll to see {filteredAnalyses.length - 3} more
                    </div>
                  )}
                </>
              ) : (
                <EmptySection
                  message={timeFilter !== 'all' ? 'No analyses in this time period' : 'Analyze content in the AI Editor to save analyses here'}
                  actionLabel="Try AI Editor"
                  actionIcon={<Sparkles size={14} />}
                  onAction={() => router.push('/ai-editor')}
                />
              )}
            </CollapsibleSection>

            {/* Helpful Insights - Collapsible (always visible) */}
            <CollapsibleSection
              id="insights"
              title="Helpful Insights"
              icon={<ThumbsUp size={16} style={{ color: '#10b981' }} />}
              count={filteredInsights.length}
              isCollapsed={collapsedSections['insights']}
              onToggle={() => toggleSection('insights')}
              onClear={() => {
                localStorage.setItem('helpfulInsights', '[]')
                setHelpfulInsights([])
              }}
              color="#10b981"
            >
              {filteredInsights.length > 0 ? (
                <>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    maxHeight: filteredInsights.length > 3 ? '260px' : 'none',
                    overflowY: filteredInsights.length > 3 ? 'auto' : 'visible',
                    paddingRight: filteredInsights.length > 3 ? '4px' : '0'
                  }}>
                    {filteredInsights.map((insight: HelpfulInsight) => (
                      <InsightCard
                        key={insight.id}
                        content={insight.content}
                        type={insight.type === 'summary' ? 'Summary' : insight.campLabel || 'Perspective'}
                        timestamp={timeAgo(insight.timestamp)}
                        originalText={insight.originalText}
                        onClick={() => {
                          if (insight.analysisId) {
                            const params = new URLSearchParams()
                            params.set('section', insight.type)
                            if (insight.campLabel) params.set('label', insight.campLabel)
                            router.push(`/ai-editor/results/${insight.analysisId}?${params.toString()}`)
                          } else if (insight.fullText) {
                            router.push('/ai-editor')
                            setTimeout(() => {
                              window.dispatchEvent(new CustomEvent('load-ai-editor-text', {
                                detail: { text: insight.fullText, autoAnalyze: true }
                              }))
                            }, 100)
                          } else {
                            router.push('/ai-editor')
                          }
                        }}
                        onDelete={() => {
                          const filtered = helpfulInsights.filter(i => i.id !== insight.id)
                          localStorage.setItem('helpfulInsights', JSON.stringify(filtered))
                          setHelpfulInsights(filtered)
                        }}
                      />
                    ))}
                  </div>
                  {filteredInsights.length > 3 && (
                    <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', marginTop: '8px' }}>
                      Scroll to see {filteredInsights.length - 3} more
                    </div>
                  )}
                </>
              ) : (
                <EmptySection
                  message={timeFilter !== 'all' ? 'No insights in this time period' : 'Mark summaries or perspectives as helpful in the AI Editor'}
                  actionLabel="Try AI Editor"
                  actionIcon={<ThumbsUp size={14} />}
                  onAction={() => router.push('/ai-editor')}
                />
              )}
            </CollapsibleSection>

            {/* Saved Authors - Collapsible with filter (always visible) */}
            {(() => {
              const authorMap = new Map<string, any>()
              favoriteAuthors.forEach(fav => {
                authorMap.set(fav.name, { name: fav.name, isFavorite: true, addedAt: fav.addedAt })
              })
              authorNotes.forEach(noteItem => {
                const existing = authorMap.get(noteItem.name)
                if (existing) {
                  existing.note = noteItem.note
                  existing.noteUpdatedAt = noteItem.updatedAt
                } else {
                  authorMap.set(noteItem.name, { name: noteItem.name, isFavorite: false, note: noteItem.note, noteUpdatedAt: noteItem.updatedAt })
                }
              })
              let unifiedAuthors = Array.from(authorMap.values())
                .map(a => ({ ...a, timestamp: a.noteUpdatedAt || a.addedAt || '' }))
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

              // Apply time filter
              unifiedAuthors = filterByTime(unifiedAuthors)

              // Apply favorites filter
              if (showFavoritesOnly) {
                unifiedAuthors = unifiedAuthors.filter(a => a.isFavorite)
              }

              const favoritesCount = unifiedAuthors.filter(a => a.isFavorite).length

              return (
                <CollapsibleSection
                  id="authors"
                  title="Saved Authors"
                  icon={<Users size={16} style={{ color: '#059669' }} />}
                  count={unifiedAuthors.length}
                  isCollapsed={collapsedSections['authors']}
                  onToggle={() => toggleSection('authors')}
                  onClear={() => { clearAllByType('favorites'); clearAllByType('notes') }}
                  color="#059669"
                  headerExtra={unifiedAuthors.length > 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowFavoritesOnly(!showFavoritesOnly)
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: showFavoritesOnly ? '#fef3c7' : '#f3f4f6',
                        color: showFavoritesOnly ? '#d97706' : '#6b7280',
                        fontSize: '11px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Star size={12} style={{ fill: showFavoritesOnly ? '#f59e0b' : 'none' }} />
                      {showFavoritesOnly ? 'Showing Favorites' : `Favorites (${favoritesCount})`}
                    </button>
                  ) : undefined}
                >
                  {unifiedAuthors.length === 0 ? (
                    <EmptySection
                      message={showFavoritesOnly ? 'No favorite authors yet' : (timeFilter !== 'all' ? 'No authors saved in this time period' : 'Star authors or add notes from the Authors page')}
                      actionLabel="Discover Authors"
                      actionIcon={<Users size={14} />}
                      onAction={() => router.push('/authors')}
                    />
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '10px'
                    }}>
                      {unifiedAuthors.map(author => {
                        const details = authorDetails[author.name]
                        return (
                          <MiniAuthorCard
                            key={author.name}
                            name={author.name}
                            affiliation={details?.affiliation || details?.primary_domain}
                            isFavorite={author.isFavorite}
                            note={author.note}
                            onClick={() => handleAuthorClick(author.name)}
                          />
                        )
                      })}
                    </div>
                  )}
                </CollapsibleSection>
              )
            })()}
          </div>
          </div>
          )
        ) : (
          // Single category view - full width with back button
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Back to All button */}
            <button
              onClick={() => setActiveTab('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                color: '#6366f1',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                alignSelf: 'flex-start'
              }}
            >
              <ArrowLeft size={16} />
              Back to All Activity
            </button>

          {/* Searches (single view) */}
          {activeTab === 'searches' && (
            <>
              {filteredRecentSearches.length > 0 && (
                <Section title="Recent Searches" icon={<Clock size={16} style={{ color: '#6b7280' }} />} count={filteredRecentSearches.length} onClear={() => clearAllByType('recent')}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filteredRecentSearches.map(s => (
                      <HistoryCard key={s.id} icon={<Search size={16} style={{ color: '#3b82f6' }} />} title={s.query} subtitle={timeAgo(s.timestamp)} note={s.note} onClick={() => handleSearchClick(s.query, s.cachedResult)} onDelete={() => deleteRecentSearch(s.id)} onUpdateNote={(note) => updateRecentSearchNote(s.id, note)} color="#3b82f6" />
                    ))}
                  </div>
                </Section>
              )}
              {filteredSavedSearches.length > 0 && (
                <Section title="Saved Searches" icon={<Search size={16} style={{ color: '#3b82f6' }} />} count={filteredSavedSearches.length} onClear={() => clearAllByType('saved')}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filteredSavedSearches.map(s => (
                      <HistoryCard key={s.id} icon={<Search size={16} style={{ color: '#3b82f6' }} />} title={s.query} subtitle={formatDate(s.timestamp)} meta={s.domain || s.camp} note={s.note} onClick={() => handleSearchClick(s.query, s.cachedResult)} onDelete={() => deleteSavedSearch(s.id)} onUpdateNote={(note) => updateSavedSearchNote(s.id, note)} color="#3b82f6" saved />
                    ))}
                  </div>
                </Section>
              )}
            </>
          )}

          {/* Analyses (single view) */}
          {activeTab === 'analyses' && filteredAnalyses.length > 0 && (
            <Section title="AI Analyses" icon={<Sparkles size={16} style={{ color: '#8b5cf6' }} />} count={filteredAnalyses.length} onClear={() => clearAllByType('analyses')}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredAnalyses.map(a => (
                  <AnalysisCard
                    key={a.id}
                    inputPreview={a.preview || a.text}
                    cachedResult={a.cachedResult}
                    timestamp={formatDate(a.timestamp)}
                    note={a.note}
                    onClick={() => handleAnalysisClick(a.id, a.text, a.cachedResult)}
                    onDelete={() => deleteAnalysis(a.id)}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Helpful Insights Section (single view) */}
          {activeTab === 'insights' && filteredInsights.length > 0 && (
            <Section
              title="Helpful Insights"
              icon={<ThumbsUp size={16} style={{ color: '#10b981' }} />}
              count={filteredInsights.length}
              onClear={() => {
                localStorage.setItem('helpfulInsights', '[]')
                setHelpfulInsights([])
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredInsights.map((insight: HelpfulInsight) => (
                  <div
                    key={insight.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      padding: '14px 16px',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => {
                      if (insight.analysisId) {
                        const params = new URLSearchParams()
                        params.set('section', insight.type)
                        if (insight.campLabel) params.set('label', insight.campLabel)
                        router.push(`/ai-editor/results/${insight.analysisId}?${params.toString()}`)
                      } else if (insight.fullText) {
                        router.push('/ai-editor')
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent('load-ai-editor-text', {
                            detail: { text: insight.fullText, autoAnalyze: true }
                          }))
                        }, 100)
                      } else {
                        router.push('/ai-editor')
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#d1fae5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <ThumbsUp size={16} style={{ color: '#059669' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#059669',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                          }}>
                            {insight.type === 'summary' ? 'Summary' : insight.campLabel || 'Perspective'}
                          </span>
                          <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                            {timeAgo(insight.timestamp)}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '13px',
                          color: '#374151',
                          margin: 0,
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {insight.content}
                        </p>
                        {insight.originalText && (
                          <p style={{
                            fontSize: '11px',
                            color: '#9ca3af',
                            margin: '6px 0 0',
                            fontStyle: 'italic'
                          }}>
                            From: "{insight.originalText}"
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const filtered = helpfulInsights.filter(i => i.id !== insight.id)
                          localStorage.setItem('helpfulInsights', JSON.stringify(filtered))
                          setHelpfulInsights(filtered)
                        }}
                        style={{
                          padding: '4px',
                          borderRadius: '4px',
                          border: 'none',
                          background: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer'
                        }}
                        title="Remove insight"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Combined Authors Section (single view) */}
          {activeTab === 'authors' && (() => {
            // Build unified author list from favorites and notes
            const authorMap = new Map<string, {
              name: string
              isFavorite: boolean
              note?: string
              addedAt?: string
              noteUpdatedAt?: string
            }>()

            // Add favorites
            favoriteAuthors.forEach(fav => {
              authorMap.set(fav.name, {
                name: fav.name,
                isFavorite: true,
                addedAt: fav.addedAt
              })
            })

            // Add/merge notes
            authorNotes.forEach(noteItem => {
              const existing = authorMap.get(noteItem.name)
              if (existing) {
                existing.note = noteItem.note
                existing.noteUpdatedAt = noteItem.updatedAt
              } else {
                authorMap.set(noteItem.name, {
                  name: noteItem.name,
                  isFavorite: false,
                  note: noteItem.note,
                  noteUpdatedAt: noteItem.updatedAt
                })
              }
            })

            // Convert to array and sort by most recent activity
            const unifiedAuthors = Array.from(authorMap.values())
              .map(author => ({
                ...author,
                timestamp: author.noteUpdatedAt || author.addedAt || ''
              }))
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

            // Apply time filter
            const filteredAuthors = filterByTime(unifiedAuthors)

            if (filteredAuthors.length === 0) return null

            return (
              <Section
                title="Saved Authors"
                icon={<Users size={16} style={{ color: '#6366f1' }} />}
                count={filteredAuthors.length}
                onClear={() => {
                  clearAllByType('favorites')
                  clearAllByType('notes')
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '12px'
                }}>
                  {filteredAuthors.map(author => {
                    const details = authorDetails[author.name]
                    return (
                      <UnifiedAuthorCard
                        key={author.name}
                        name={author.name}
                        affiliation={details?.affiliation || details?.primary_domain}
                        isFavorite={author.isFavorite}
                        note={author.note}
                        timestamp={author.timestamp}
                        onClick={() => handleAuthorClick(author.name)}
                        onToggleFavorite={() => {
                          if (author.isFavorite) {
                            removeFavoriteAuthor(author.name)
                          } else {
                            // Add to favorites
                            const newFavorite = {
                              id: `fav-${Date.now()}`,
                              name: author.name,
                              addedAt: new Date().toISOString()
                            }
                            const updated = [newFavorite, ...favoriteAuthors]
                            localStorage.setItem('favoriteAuthors', JSON.stringify(updated))
                            setFavoriteAuthors(updated)
                          }
                        }}
                        onDeleteNote={() => deleteAuthorNote(author.name)}
                        onUpdateNote={(note) => updateAuthorNote(author.name, note)}
                        timeAgo={timeAgo}
                      />
                    )
                  })}
                </div>
              </Section>
            )
          })()}

          {/* Tab-specific Empty States */}
          {activeTab === 'searches' && filteredRecentSearches.length === 0 && filteredSavedSearches.length === 0 && (
            <EmptyStateComponent
              icon={Search}
              iconColor="#3b82f6"
              iconBgFrom="#dbeafe"
              iconBgTo="#bfdbfe"
              title="No saved searches yet"
              description="When you search for topics and save them, they'll appear here for quick access."
              action={{
                label: "Start Exploring",
                onClick: () => router.push('/explore'),
                icon: Compass
              }}
            />
          )}

          {activeTab === 'analyses' && filteredAnalyses.length === 0 && (
            <EmptyStateComponent
              icon={Sparkles}
              iconColor="#8b5cf6"
              iconBgFrom="#f3e8ff"
              iconBgTo="#e9d5ff"
              title="No saved analyses yet"
              description="Use the AI Editor to analyze text and save your analyses here for future reference."
              action={{
                label: "Try AI Editor",
                onClick: () => router.push('/ai-editor'),
                icon: Sparkles
              }}
            />
          )}

          {activeTab === 'insights' && filteredInsights.length === 0 && (
            <EmptyStateComponent
              icon={ThumbsUp}
              iconColor="#10b981"
              iconBgFrom="#d1fae5"
              iconBgTo="#a7f3d0"
              title="No helpful insights yet"
              description="When you find summaries or perspectives helpful in the AI Editor, mark them with a thumbs up to save them here."
              action={{
                label: "Try AI Editor",
                onClick: () => router.push('/ai-editor'),
                icon: Sparkles
              }}
            />
          )}

          {activeTab === 'authors' && getUniqueAuthorsCount() === 0 && (
            <EmptyStateComponent
              icon={Users}
              iconColor="#6366f1"
              iconBgFrom="#e0e7ff"
              iconBgTo="#c7d2fe"
              title="No saved authors yet"
              description="Star your favorite authors or add notes to any author's profile. They'll appear here for quick access."
              action={{
                label: "Discover Authors",
                onClick: () => router.push('/authors'),
                icon: Users
              }}
            />
          )}

        </div>
        )}
        </div>
      </main>

      {/* About Modal */}
      {showAboutModal && (
        <AboutHistoryModal onClose={() => setShowAboutModal(false)} />
      )}

      {/* Recently Deleted Modal */}
      {showRecentlyDeleted && (
        <RecentlyDeletedModal
          items={deletedItems}
          onRestore={restoreDeletedItem}
          onDelete={permanentlyDeleteItem}
          onClearAll={clearAllDeleted}
          onClose={() => setShowRecentlyDeleted(false)}
          timeAgo={timeAgo}
        />
      )}
    </div>
  )
}

// Compact Section Component for 3-column grid
function CompactSection({
  title,
  icon,
  count,
  onClear,
  color,
  children
}: {
  title: string
  icon: React.ReactNode
  count: number
  onClear: () => void
  color: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <span style={{ fontWeight: '600', color: '#374151', fontSize: '13px' }}>{title}</span>
          <span style={{
            padding: '1px 6px',
            borderRadius: '8px',
            background: `${color}15`,
            fontSize: '11px',
            fontWeight: '600',
            color: color
          }}>
            {count}
          </span>
        </div>
        <button
          onClick={onClear}
          style={{
            padding: '4px',
            borderRadius: '4px',
            border: 'none',
            background: 'transparent',
            color: '#d1d5db',
            cursor: 'pointer'
          }}
          title="Clear all"
        >
          <Trash2 size={12} />
        </button>
      </div>
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {children}
      </div>
    </div>
  )
}

// Compact Card Component for grid view
function CompactCard({
  title,
  subtitle,
  onClick,
  onDelete,
  color
}: {
  title: string
  subtitle: string
  onClick: () => void
  onDelete: () => void
  color: string
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '10px 12px',
        borderRadius: '6px',
        border: '1px solid #f3f4f6',
        background: '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.background = 'white'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#f3f4f6'
        e.currentTarget.style.background = '#fafafa'
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 500,
          color: '#374151',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: '2px'
        }}>
          {title}
        </div>
        <div style={{ fontSize: '10px', color: '#9ca3af' }}>
          {subtitle}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        style={{
          padding: '2px',
          borderRadius: '4px',
          border: 'none',
          background: 'transparent',
          color: '#d1d5db',
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <X size={12} />
      </button>
    </div>
  )
}

// Compact Author Card for grid view
function CompactAuthorCard({
  name,
  isFavorite,
  hasNote,
  onClick,
  timeAgo
}: {
  name: string
  isFavorite: boolean
  hasNote: boolean
  onClick: () => void
  timeAgo: string
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '10px 12px',
        borderRadius: '6px',
        border: '1px solid #f3f4f6',
        background: '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#059669'
        e.currentTarget.style.background = 'white'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#f3f4f6'
        e.currentTarget.style.background = '#fafafa'
      }}
    >
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: isFavorite
          ? 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)'
          : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isFavorite ? (
          <Star size={12} style={{ color: '#f59e0b' }} />
        ) : (
          <Users size={12} style={{ color: '#6366f1' }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 500,
          color: '#374151',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '10px', color: '#9ca3af' }}>{timeAgo}</span>
          {isFavorite && (
            <span style={{
              fontSize: '9px',
              padding: '1px 4px',
              borderRadius: '3px',
              background: '#fef3c7',
              color: '#d97706'
            }}>
              ★
            </span>
          )}
          {hasNote && (
            <span style={{
              fontSize: '9px',
              padding: '1px 4px',
              borderRadius: '3px',
              background: '#e0e7ff',
              color: '#4f46e5'
            }}>
              📝
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={14} style={{ color: '#d1d5db', flexShrink: 0 }} />
    </div>
  )
}

// Collapsible Section Component
function CollapsibleSection({
  id,
  title,
  icon,
  count,
  isCollapsed,
  onToggle,
  onClear,
  color,
  headerExtra,
  children
}: {
  id: string
  title: string
  icon: React.ReactNode
  count: number
  isCollapsed?: boolean
  onToggle: () => void
  onClear: () => void
  color: string
  headerExtra?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      <div
        onClick={onToggle}
        style={{
          padding: '10px 14px',
          borderBottom: isCollapsed ? 'none' : '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#fafafa'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <span style={{ fontWeight: '600', color: '#374151', fontSize: '13px' }}>{title}</span>
          <span style={{
            padding: '1px 6px',
            borderRadius: '8px',
            background: `${color}15`,
            fontSize: '11px',
            fontWeight: '600',
            color: color
          }}>
            {count}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {headerExtra}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            style={{
              padding: '3px 6px',
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              color: '#d1d5db',
              fontSize: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fef2f2'
              e.currentTarget.style.color = '#ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#d1d5db'
            }}
          >
            <Trash2 size={11} />
          </button>
          {isCollapsed ? (
            <ChevronDown size={16} style={{ color: '#9ca3af' }} />
          ) : (
            <ChevronUp size={16} style={{ color: '#9ca3af' }} />
          )}
        </div>
      </div>
      {!isCollapsed && (
        <div style={{ padding: '10px 14px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// Empty Section placeholder for when sections have no items
function EmptySection({
  message,
  actionLabel,
  actionIcon,
  onAction
}: {
  message: string
  actionLabel?: string
  actionIcon?: React.ReactNode
  onAction?: () => void
}) {
  return (
    <div style={{
      padding: '24px 16px',
      textAlign: 'center',
      borderRadius: '8px',
      background: '#fafafa',
      border: '1px dashed #e5e7eb'
    }}>
      <p style={{
        fontSize: '13px',
        color: '#9ca3af',
        margin: 0,
        lineHeight: 1.5
      }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: '12px',
            padding: '8px 14px',
            borderRadius: '6px',
            border: 'none',
            background: '#f3f4f6',
            color: '#6b7280',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e5e7eb'
            e.currentTarget.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f3f4f6'
            e.currentTarget.style.color = '#6b7280'
          }}
        >
          {actionIcon}
          {actionLabel}
        </button>
      )}
    </div>
  )
}

// Search Card for All Activity view
function SearchCard({
  query,
  timestamp,
  isSaved,
  note,
  onClick,
  onDelete
}: {
  query: string
  timestamp: string
  isSaved: boolean
  note?: string
  onClick: () => void
  onDelete: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '8px 10px',
        borderRadius: '6px',
        border: note ? '1px solid #fde68a' : '1px solid #f3f4f6',
        background: note ? '#fffbeb' : '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        width: '100%',
        boxSizing: 'border-box'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#3b82f6'
        e.currentTarget.style.background = 'white'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = note ? '#fde68a' : '#f3f4f6'
        e.currentTarget.style.background = note ? '#fffbeb' : '#fafafa'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '5px',
          background: isSaved ? '#dbeafe' : '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Search size={12} style={{ color: isSaved ? '#3b82f6' : '#9ca3af' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#374151',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {query}
          </div>
          <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '1px' }}>
            {timestamp}{isSaved && ' · Saved'}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            padding: '3px',
            borderRadius: '3px',
            border: 'none',
            background: 'transparent',
            color: '#d1d5db',
            cursor: 'pointer',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#d1d5db'
          }}
        >
          <X size={12} />
        </button>
      </div>
      {note && (
        <div style={{
          marginTop: '6px',
          paddingLeft: '34px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '5px'
        }}>
          <MessageSquare size={10} style={{ color: '#d97706', marginTop: '2px', flexShrink: 0 }} />
          <p style={{
            fontSize: '11px',
            color: '#92400e',
            margin: 0,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical'
          }}>
            {note}
          </p>
        </div>
      )}
    </div>
  )
}

// Analysis Card - consistent with InsightCard layout
function AnalysisCard({
  inputPreview,
  cachedResult,
  timestamp,
  note,
  onClick,
  onDelete
}: {
  inputPreview: string
  cachedResult?: {
    summary?: string
    matchedCamps?: Array<{ campLabel: string }>
    editorialSuggestions?: {
      presentPerspectives?: string[]
      missingPerspectives?: string[]
    }
  }
  timestamp: string
  note?: string
  onClick: () => void
  onDelete: () => void
}) {
  const summary = cachedResult?.summary || ''
  const campCount = cachedResult?.matchedCamps?.length || 0
  const missingCount = cachedResult?.editorialSuggestions?.missingPerspectives?.length || 0

  return (
    <div
      onClick={onClick}
      style={{
        padding: '8px 10px',
        borderRadius: '6px',
        border: '1px solid #f3f4f6',
        background: '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        width: '100%',
        boxSizing: 'border-box'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#8b5cf6'
        e.currentTarget.style.background = 'white'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#f3f4f6'
        e.currentTarget.style.background = '#fafafa'
      }}
    >
      <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '5px',
          background: '#f3e8ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={12} style={{ color: '#8b5cf6' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top row: type + timestamp + badges */}
          <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>
            <span style={{ fontWeight: 600, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Analysis</span>
            {' · '}{timestamp}
            {campCount > 0 && ` · ${campCount} perspectives`}
          </div>
          {/* Input text - single line */}
          <p style={{
            fontSize: '12px',
            color: '#374151',
            margin: 0,
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {inputPreview.trim()}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            padding: '3px',
            borderRadius: '3px',
            border: 'none',
            background: 'transparent',
            color: '#d1d5db',
            cursor: 'pointer',
            flexShrink: 0,
            alignSelf: 'flex-start'
          }}
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}

// Insight Card - compact
function InsightCard({
  content,
  type,
  timestamp,
  originalText,
  onClick,
  onDelete
}: {
  content: string
  type: string
  timestamp: string
  originalText?: string
  onClick: () => void
  onDelete: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '8px 10px',
        borderRadius: '6px',
        border: '1px solid #f3f4f6',
        background: '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#10b981'
        e.currentTarget.style.background = 'white'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#f3f4f6'
        e.currentTarget.style.background = '#fafafa'
      }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '5px',
          background: '#d1fae5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ThumbsUp size={12} style={{ color: '#059669' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#059669',
              textTransform: 'uppercase',
              letterSpacing: '0.02em'
            }}>
              {type}
            </span>
            <span style={{ fontSize: '10px', color: '#9ca3af' }}>·</span>
            <span style={{ fontSize: '10px', color: '#9ca3af' }}>{timestamp}</span>
          </div>
          <p style={{
            fontSize: '12px',
            color: '#374151',
            margin: 0,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {content}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            padding: '3px',
            borderRadius: '3px',
            border: 'none',
            background: 'transparent',
            color: '#d1d5db',
            cursor: 'pointer',
            flexShrink: 0,
            alignSelf: 'flex-start'
          }}
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}

// Mini Author Card - shows notes when available
function MiniAuthorCard({
  name,
  affiliation,
  isFavorite,
  note,
  onClick
}: {
  name: string
  affiliation?: string
  isFavorite: boolean
  note?: string
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        background: 'white',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#059669'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(5, 150, 105, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: isFavorite
            ? 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)'
            : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {isFavorite ? (
            <Star size={14} style={{ color: '#f59e0b' }} />
          ) : (
            <Users size={14} style={{ color: '#6366f1' }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#1f2937',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {name}
            </div>
            {isFavorite && (
              <Star size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />
            )}
          </div>
          {affiliation && (
            <div style={{
              fontSize: '11px',
              color: '#9ca3af',
              marginTop: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {affiliation}
            </div>
          )}
          {note && (
            <div style={{
              fontSize: '11px',
              color: '#6b7280',
              marginTop: '6px',
              padding: '6px 8px',
              background: '#f9fafb',
              borderRadius: '4px',
              borderLeft: '2px solid #10b981',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {note}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Expanded Card Component for single-column view with more text
function ExpandedCard({
  icon,
  title,
  subtitle,
  note,
  originalText,
  onClick,
  onDelete,
  color
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  note?: string
  originalText?: string
  onClick: () => void
  onDelete: () => void
  color: string
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '16px',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        background: '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.background = 'white'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.background = '#fafafa'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#1f2937',
            margin: 0,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {title}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '8px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>
              {subtitle}
            </span>
            {note && (
              <span style={{
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#e0e7ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <MessageSquare size={10} />
                Note
              </span>
            )}
          </div>
          {originalText && (
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '8px 0 0',
              fontStyle: 'italic',
              lineHeight: 1.4
            }}>
              From: "{originalText.slice(0, 100)}{originalText.length > 100 ? '...' : ''}"
            </p>
          )}
          {note && (
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '8px 0 0',
              fontStyle: 'italic',
              lineHeight: 1.4,
              padding: '8px',
              background: '#f5f3ff',
              borderRadius: '6px'
            }}>
              "{note}"
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#d1d5db',
            cursor: 'pointer',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#d1d5db'
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// Expanded Author Card for single-column view
function ExpandedAuthorCard({
  name,
  affiliation,
  isFavorite,
  note,
  onClick,
  timeAgo
}: {
  name: string
  affiliation?: string
  isFavorite: boolean
  note?: string
  onClick: () => void
  timeAgo: string
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '16px',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        background: '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#059669'
        e.currentTarget.style.background = 'white'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.background = '#fafafa'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: isFavorite
            ? 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)'
            : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {isFavorite ? (
            <Star size={18} style={{ color: '#f59e0b' }} />
          ) : (
            <Users size={18} style={{ color: '#6366f1' }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#1f2937'
          }}>
            {name}
          </div>
          {affiliation && (
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
              {affiliation}
            </div>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '6px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{timeAgo}</span>
            {isFavorite && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Star size={10} />
                Favorite
              </span>
            )}
            {note && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#e0e7ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <MessageSquare size={10} />
                Note
              </span>
            )}
          </div>
          {note && (
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '10px 0 0',
              fontStyle: 'italic',
              lineHeight: 1.4,
              padding: '8px',
              background: '#f5f3ff',
              borderRadius: '6px'
            }}>
              "{note}"
            </p>
          )}
        </div>
        <ChevronRight size={18} style={{ color: '#d1d5db', flexShrink: 0 }} />
      </div>
    </div>
  )
}

// Section Component
function Section({
  title,
  icon,
  count,
  onClear,
  children
}: {
  title: string
  icon: React.ReactNode
  count: number
  onClear: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon}
          <span style={{ fontWeight: '600', color: '#374151', fontSize: '15px' }}>{title}</span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '10px',
            background: '#f3f4f6',
            fontSize: '12px',
            fontWeight: '500',
            color: '#6b7280'
          }}>
            {count}
          </span>
        </div>
        <button
          onClick={onClear}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#9ca3af',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fef2f2'
            e.currentTarget.style.color = '#ef4444'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#9ca3af'
          }}
        >
          <Trash2 size={12} />
          Clear all
        </button>
      </div>
      <div style={{ padding: '16px 20px' }}>
        {children}
      </div>
    </div>
  )
}

// History Card Component with Note Support
function HistoryCard({
  icon,
  title,
  subtitle,
  meta,
  note,
  onClick,
  onDelete,
  onUpdateNote,
  color,
  saved
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  meta?: string
  note?: string
  onClick: () => void
  onDelete: () => void
  onUpdateNote?: (note: string) => void
  color: string
  saved?: boolean
}) {
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(note || '')

  const handleSaveNote = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onUpdateNote) {
      onUpdateNote(noteText)
    }
    setIsEditingNote(false)
  }

  const handleCancelNote = (e: React.MouseEvent) => {
    e.stopPropagation()
    setNoteText(note || '')
    setIsEditingNote(false)
  }

  return (
    <div
      style={{
        borderRadius: '8px',
        border: '1px solid #f3f4f6',
        background: '#fafafa',
        transition: 'all 0.2s',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.background = 'white'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#f3f4f6'
        e.currentTarget.style.background = '#fafafa'
      }}
    >
      {/* Main row */}
      <div
        onClick={onClick}
        style={{
          padding: '12px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: '500',
            color: '#1f2937',
            fontSize: '13px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {title}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '4px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>
              {subtitle}
            </span>
            {meta && (
              <>
                <span style={{ fontSize: '11px', color: '#d1d5db' }}>•</span>
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: `${color}10`,
                  color: color
                }}>
                  {meta}
                </span>
              </>
            )}
            {saved && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#dcfce7',
                color: '#16a34a'
              }}>
                Saved
              </span>
            )}
            {note && !isEditingNote && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#e0e7ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <MessageSquare size={10} />
                Note
              </span>
            )}
          </div>
        </div>
        {/* Add/Edit Note Button */}
        {onUpdateNote && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsEditingNote(true)
            }}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              background: note ? '#e0e7ff' : 'transparent',
              cursor: 'pointer',
              color: note ? '#4f46e5' : '#9ca3af',
              transition: 'all 0.2s'
            }}
            title={note ? 'Edit note' : 'Add note'}
          >
            {note ? <Edit3 size={14} /> : <MessageSquare size={14} />}
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#d1d5db',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#d1d5db'
          }}
        >
          <X size={14} />
        </button>
        <ChevronRight size={16} style={{ color: '#d1d5db', flexShrink: 0 }} />
      </div>

      {/* Note display (when not editing) */}
      {note && !isEditingNote && (
        <div style={{
          padding: '8px 16px 12px 60px',
          borderTop: '1px solid #f3f4f6'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0,
            fontStyle: 'italic',
            lineHeight: '1.4'
          }}>
            "{note}"
          </p>
        </div>
      )}

      {/* Note editor */}
      {isEditingNote && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #e0e7ff',
            background: '#f5f3ff'
          }}
        >
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your note here..."
            autoFocus
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #c7d2fe',
              fontSize: '13px',
              lineHeight: '1.4',
              resize: 'none',
              minHeight: '60px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#6366f1'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#c7d2fe'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '8px'
          }}>
            <button
              onClick={handleCancelNote}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#6b7280',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: '#6366f1',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Check size={12} />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Favorite Author Card (shows associated note if exists)
function FavoriteAuthorCard({
  name,
  affiliation,
  addedAt,
  note,
  onClick,
  onDelete,
  timeAgo
}: {
  name: string
  affiliation?: string
  addedAt: string
  note?: string
  onClick: () => void
  onDelete: () => void
  timeAgo: (ts: string) => string
}) {
  return (
    <div
      style={{
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        background: 'white',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#f59e0b'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div
        onClick={onClick}
        style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Star size={18} style={{ color: '#f59e0b' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>
            {name}
          </div>
          {affiliation && (
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
              {affiliation}
            </div>
          )}
          <div style={{
            fontSize: '11px',
            color: '#9ca3af',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>Added {timeAgo(addedAt)}</span>
            {note && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#e0e7ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <MessageSquare size={10} />
                Note
              </span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#9ca3af'
          }}
          title="Remove from favorites"
        >
          <X size={16} />
        </button>
      </div>
      {/* Show associated note */}
      {note && (
        <div
          onClick={onClick}
          style={{
            padding: '10px 16px 12px 68px',
            borderTop: '1px solid #f3f4f6',
            background: '#fafafa'
          }}
        >
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0,
            fontStyle: 'italic',
            lineHeight: '1.4'
          }}>
            "{note}"
          </p>
        </div>
      )}
    </div>
  )
}

// Author Note Card
function AuthorNoteCard({
  name,
  affiliation,
  note,
  updatedAt,
  onClick,
  onDelete,
  onUpdateNote,
  timeAgo
}: {
  name: string
  affiliation?: string
  note: string
  updatedAt: string
  onClick: () => void
  onDelete: () => void
  onUpdateNote: (note: string) => void
  timeAgo: (ts: string) => string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [noteText, setNoteText] = useState(note)

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (noteText.trim()) {
      onUpdateNote(noteText)
    } else {
      onDelete()
    }
    setIsEditing(false)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setNoteText(note)
    setIsEditing(false)
  }

  return (
    <div
      style={{
        borderRadius: '10px',
        border: '1px solid #e0e7ff',
        background: 'white',
        overflow: 'hidden',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#6366f1'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e0e7ff'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Header */}
      <div
        onClick={onClick}
        style={{
          padding: '12px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #f3f4f6'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <MessageSquare size={16} style={{ color: '#6366f1' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>
            {name}
          </div>
          {affiliation && (
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
              {affiliation}
            </div>
          )}
        </div>
        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
          {timeAgo(updatedAt)}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: '#e0e7ff',
            cursor: 'pointer',
            color: '#6366f1'
          }}
          title="Edit note"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#9ca3af'
          }}
          title="Delete note"
        >
          <X size={16} />
        </button>
      </div>

      {/* Note content or editor */}
      {!isEditing ? (
        <div
          onClick={onClick}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            background: '#fafafa'
          }}
        >
          <p style={{
            fontSize: '13px',
            color: '#4b5563',
            margin: 0,
            lineHeight: '1.5',
            fontStyle: 'italic'
          }}>
            "{note}"
          </p>
        </div>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '12px 16px',
            background: '#f5f3ff'
          }}
        >
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Your note..."
            autoFocus
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #c7d2fe',
              fontSize: '13px',
              lineHeight: '1.5',
              resize: 'none',
              minHeight: '80px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#6366f1'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#c7d2fe'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '8px'
          }}>
            <button
              onClick={handleCancel}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#6b7280',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: '#6366f1',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Check size={12} />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Unified Author Card (combines favorite + notes)
function UnifiedAuthorCard({
  name,
  affiliation,
  isFavorite,
  note,
  timestamp,
  onClick,
  onToggleFavorite,
  onDeleteNote,
  onUpdateNote,
  timeAgo
}: {
  name: string
  affiliation?: string
  isFavorite: boolean
  note?: string
  timestamp: string
  onClick: () => void
  onToggleFavorite: () => void
  onDeleteNote: () => void
  onUpdateNote: (note: string) => void
  timeAgo: (ts: string) => string
}) {
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(note || '')

  const handleSaveNote = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (noteText.trim()) {
      onUpdateNote(noteText)
    }
    setIsEditingNote(false)
  }

  const handleCancelNote = (e: React.MouseEvent) => {
    e.stopPropagation()
    setNoteText(note || '')
    setIsEditingNote(false)
  }

  return (
    <div
      style={{
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        background: 'white',
        overflow: 'hidden',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#6366f1'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Header */}
      <div
        onClick={onClick}
        style={{
          padding: '14px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: note || isEditingNote ? '1px solid #f3f4f6' : 'none'
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: isFavorite
            ? 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)'
            : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {isFavorite ? (
            <Star size={18} style={{ color: '#f59e0b' }} />
          ) : (
            <Users size={18} style={{ color: '#6366f1' }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>
            {name}
          </div>
          {affiliation && (
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
              {affiliation}
            </div>
          )}
          <div style={{
            fontSize: '11px',
            color: '#9ca3af',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span>{timeAgo(timestamp)}</span>
            {isFavorite && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Star size={10} />
                Favorite
              </span>
            )}
            {note && !isEditingNote && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#e0e7ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <MessageSquare size={10} />
                Note
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: isFavorite ? '#fef3c7' : 'transparent',
            cursor: 'pointer',
            color: isFavorite ? '#f59e0b' : '#9ca3af',
            transition: 'all 0.2s'
          }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={16} style={{ fill: isFavorite ? '#f59e0b' : 'none' }} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsEditingNote(true)
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: note ? '#e0e7ff' : 'transparent',
            cursor: 'pointer',
            color: note ? '#6366f1' : '#9ca3af',
            transition: 'all 0.2s'
          }}
          title={note ? 'Edit note' : 'Add note'}
        >
          {note ? <Edit3 size={14} /> : <MessageSquare size={14} />}
        </button>
        {note && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDeleteNote()
            }}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#9ca3af'
            }}
            title="Delete note"
          >
            <Trash2 size={14} />
          </button>
        )}
        <ChevronRight size={16} style={{ color: '#d1d5db', flexShrink: 0 }} />
      </div>

      {/* Note display (when not editing) */}
      {note && !isEditingNote && (
        <div
          onClick={onClick}
          style={{
            padding: '10px 16px 12px 68px',
            background: '#fafafa',
            cursor: 'pointer'
          }}
        >
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0,
            fontStyle: 'italic',
            lineHeight: '1.4'
          }}>
            "{note}"
          </p>
        </div>
      )}

      {/* Note editor */}
      {isEditingNote && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '12px 16px',
            background: '#f5f3ff'
          }}
        >
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your note about this author..."
            autoFocus
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #c7d2fe',
              fontSize: '13px',
              lineHeight: '1.5',
              resize: 'none',
              minHeight: '80px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#6366f1'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#c7d2fe'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '8px'
          }}>
            <button
              onClick={handleCancelNote}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#6b7280',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: '#6366f1',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Check size={12} />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// About Modal Component
function AboutHistoryModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { icon: Search, title: 'Revisit past searches', color: '#2563eb' },
    { icon: Sparkles, title: 'Reload saved analyses', color: '#7c3aed' },
    { icon: Star, title: 'Access favorite authors', color: '#d97706' },
    { icon: RotateCcw, title: 'Restore deleted items', color: '#059669' }
  ]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '8px',
            background: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#64748b',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          padding: '24px 24px 16px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(to right, #eef2ff, #f5f3ff)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <History size={20} style={{ color: '#6366f1' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              How History Works
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            Your research journey, all in one place.
          </p>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {steps.map((step, idx) => {
              const Icon = step.icon
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: `${step.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} style={{ color: step.color }} />
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#111827',
                  }}>
                    {step.title}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4f46e5'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6366f1'
            }}
          >
            Got it!
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Recently Deleted Modal Component
function RecentlyDeletedModal({
  items,
  onRestore,
  onDelete,
  onClearAll,
  onClose,
  timeAgo
}: {
  items: DeletedItem[]
  onRestore: (item: DeletedItem) => void
  onDelete: (id: string) => void
  onClearAll: () => void
  onClose: () => void
  timeAgo: (ts: string) => string
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '8px',
            background: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#64748b',
            zIndex: 10,
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          padding: '24px 24px 16px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(to right, #fef2f2, #fff7ed)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Trash2 size={20} style={{ color: '#ef4444' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Recently Deleted
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            Items deleted in the last 30 days. Restore them before they're permanently removed.
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#9ca3af' }}>
              <Trash2 size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '14px' }}>No recently deleted items</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map(item => (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #f3f4f6',
                    background: '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: item.type === 'favorite' ? '#fef3c7' : item.type === 'search' ? '#dbeafe' : item.type === 'analysis' ? '#ede9fe' : '#e0e7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {item.type === 'favorite' ? (
                      <Star size={16} style={{ color: '#f59e0b' }} />
                    ) : item.type === 'search' ? (
                      <Search size={16} style={{ color: '#3b82f6' }} />
                    ) : item.type === 'analysis' ? (
                      <Sparkles size={16} style={{ color: '#8b5cf6' }} />
                    ) : (
                      <MessageSquare size={16} style={{ color: '#6366f1' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        textTransform: 'uppercase',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: item.type === 'favorite' ? '#d97706' : item.type === 'search' ? '#2563eb' : item.type === 'analysis' ? '#7c3aed' : '#6366f1'
                      }}>
                        {item.type === 'favorite' ? 'Favorite' : item.type === 'search' ? (item.data?.wasSaved ? 'Saved Search' : 'Recent Search') : item.type === 'analysis' ? 'Analysis' : 'Note'}
                      </span>
                      <span>·</span>
                      <span>Deleted {timeAgo(item.deletedAt)}</span>
                    </div>
                    {item.type === 'note' && item.data?.note && (
                      <div style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        marginTop: '4px',
                        fontStyle: 'italic',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        "{item.data.note}"
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => onRestore(item)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#10b981',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Restore"
                    >
                      <ArrowLeft size={12} />
                      Restore
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#fee2e2',
                        color: '#dc2626',
                        cursor: 'pointer'
                      }}
                      title="Delete permanently"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          gap: '8px'
        }}>
          {items.length > 0 && (
            <button
              onClick={onClearAll}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Delete All Permanently
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

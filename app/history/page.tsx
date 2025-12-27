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
  Calendar,
  Filter,
  X,
  MessageSquare,
  Edit3,
  Check,
  Users,
  Compass,
  ThumbsUp
} from 'lucide-react'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import EmptyStateComponent from '@/components/EmptyState'
import { useAuthorPanel } from '@/contexts/AuthorPanelContext'
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
  timestamp: string
}

type TabType = 'all' | 'searches' | 'analyses' | 'insights' | 'authors'
type TimeFilter = 'all' | 'today' | 'week' | 'month'

export default function HistoryPage() {
  const router = useRouter()
  const { openPanel } = useAuthorPanel()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [showAboutModal, setShowAboutModal] = useState(false)

  // Data states
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([])
  const [savedSearches, setSavedSearches] = useState<SearchItem[]>([])
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisItem[]>([])
  const [favoriteAuthors, setFavoriteAuthors] = useState<FavoriteAuthor[]>([])
  const [authorNotes, setAuthorNotes] = useState<AuthorNote[]>([])
  const [helpfulInsights, setHelpfulInsights] = useState<HelpfulInsight[]>([])
  const [authorDetails, setAuthorDetails] = useState<Record<string, any>>({})

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

    return () => {
      window.removeEventListener('author-note-updated', handleNoteUpdated as EventListener)
      window.removeEventListener('favorite-author-added', handleFavoriteAdded)
      window.removeEventListener('helpful-insight-added', handleInsightAdded)
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

  const handleAnalysisClick = (text: string, cachedResult?: any) => {
    router.push('/ai-editor')
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('load-ai-editor-text', {
        detail: { text, cachedResult }
      }))
    }, 100)
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
    const filtered = recentSearches.filter(s => s.id !== id)
    localStorage.setItem('recentSearches', JSON.stringify(filtered))
    setRecentSearches(filtered)
  }

  const deleteSavedSearch = (id: string) => {
    const filtered = savedSearches.filter(s => s.id !== id)
    localStorage.setItem('savedSearches', JSON.stringify(filtered))
    setSavedSearches(filtered)
  }

  const deleteAnalysis = (id: string) => {
    const filtered = savedAnalyses.filter(a => a.id !== id)
    localStorage.setItem('savedAIEditorAnalyses', JSON.stringify(filtered))
    setSavedAnalyses(filtered)
  }

  const removeFavoriteAuthor = (name: string) => {
    const filtered = favoriteAuthors.filter(a => a.name !== name)
    localStorage.setItem('favoriteAuthors', JSON.stringify(filtered))
    setFavoriteAuthors(filtered)
    // Dispatch event for other components to update
    window.dispatchEvent(new CustomEvent('favorite-author-removed', { detail: { name } }))
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

  const deleteAuthorNote = (name: string) => {
    const filtered = authorNotes.filter(n => n.name !== name)
    localStorage.setItem('authorNotes', JSON.stringify(filtered))
    setAuthorNotes(filtered)
    // Dispatch event to sync with author panel
    window.dispatchEvent(new CustomEvent('author-note-updated', {
      detail: { name, note: '' }
    }))
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

  const tabs = [
    { id: 'all' as TabType, label: 'All Activity', count: recentSearches.length + savedSearches.length + savedAnalyses.length + getUniqueAuthorsCount() + helpfulInsights.length },
    { id: 'searches' as TabType, label: 'Searches', count: savedSearches.length },
    { id: 'analyses' as TabType, label: 'Analyses', count: savedAnalyses.length },
    { id: 'insights' as TabType, label: 'Helpful Insights', count: helpfulInsights.length },
    { id: 'authors' as TabType, label: 'Authors', count: getUniqueAuthorsCount() },
  ]

  const filteredRecentSearches = filterByTime(recentSearches)
  const filteredSavedSearches = filterByTime(savedSearches)
  const filteredAnalyses = filterByTime(savedAnalyses)
  const filteredInsights = filterByTime(helpfulInsights)
  const filteredAuthorNotes = filterByTime(authorNotes.map(n => ({ ...n, timestamp: n.updatedAt })))
  const filteredFavorites = filterByTime(favoriteAuthors)

  if (!mounted) return null

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <Header sidebarCollapsed={true} />
      <main
        className="flex-1 mt-16 overflow-auto"
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '24px',
        }}>
        {/* Page Header */}
        <PageHeader
          icon={<History size={24} />}
          iconVariant="purple"
          title="Your History"
          subtitle="Track your searches, analyses, and saved authors"
          helpButton={{
            label: 'About',
            onClick: () => setShowAboutModal(true)
          }}
        />

        {/* Quick Preview Grid - Shows compact overview of each category */}
        {activeTab === 'all' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* Searches Preview */}
            <button
              onClick={() => setActiveTab('searches')}
              style={{
                padding: '16px',
                background: 'var(--color-air-white)',
                border: '1px solid var(--color-light-gray)',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-digital-sky)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 41, 80, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Search size={16} style={{ color: 'var(--color-velocity-blue)' }} />
                <span style={{ fontWeight: 600, color: 'var(--color-quantum-navy)', fontSize: '14px' }}>Searches</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-quantum-navy)' }}>
                {savedSearches.length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-mid-gray)' }}>
                {savedSearches.length > 0 ? `Latest: ${savedSearches[0]?.query?.substring(0, 20)}...` : 'No saved searches'}
              </div>
            </button>

            {/* Analyses Preview */}
            <button
              onClick={() => setActiveTab('analyses')}
              style={{
                padding: '16px',
                background: 'var(--color-air-white)',
                border: '1px solid var(--color-light-gray)',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-digital-sky)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 41, 80, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} style={{ color: 'var(--color-cobalt-blue)' }} />
                <span style={{ fontWeight: 600, color: 'var(--color-quantum-navy)', fontSize: '14px' }}>Analyses</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-quantum-navy)' }}>
                {savedAnalyses.length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-mid-gray)' }}>
                {savedAnalyses.length > 0 ? `Latest: ${savedAnalyses[0]?.preview?.substring(0, 20)}...` : 'No saved analyses'}
              </div>
            </button>

            {/* Insights Preview */}
            <button
              onClick={() => setActiveTab('insights')}
              style={{
                padding: '16px',
                background: 'var(--color-air-white)',
                border: '1px solid var(--color-light-gray)',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-digital-sky)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 41, 80, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ThumbsUp size={16} style={{ color: '#10b981' }} />
                <span style={{ fontWeight: 600, color: 'var(--color-quantum-navy)', fontSize: '14px' }}>Insights</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-quantum-navy)' }}>
                {helpfulInsights.length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-mid-gray)' }}>
                {helpfulInsights.length > 0 ? `Latest: ${helpfulInsights[0]?.content?.substring(0, 20)}...` : 'No saved insights'}
              </div>
            </button>

            {/* Authors Preview */}
            <button
              onClick={() => setActiveTab('authors')}
              style={{
                padding: '16px',
                background: 'var(--color-air-white)',
                border: '1px solid var(--color-light-gray)',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-digital-sky)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 41, 80, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-light-gray)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Users size={16} style={{ color: '#059669' }} />
                <span style={{ fontWeight: 600, color: 'var(--color-quantum-navy)', fontSize: '14px' }}>Authors</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-quantum-navy)' }}>
                {getUniqueAuthorsCount()}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-mid-gray)' }}>
                {favoriteAuthors.length} favorites, {authorNotes.length} with notes
              </div>
            </button>
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '16px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? '#6366f1' : 'white',
                color: activeTab === tab.id ? 'white' : '#4b5563',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(99, 102, 241, 0.25)' : '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  padding: '2px 6px',
                  borderRadius: '10px',
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}

          {/* Time Filter */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} style={{ color: '#9ca3af' }} />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: 'white',
                fontSize: '13px',
                color: '#4b5563',
                cursor: 'pointer'
              }}
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px' }}>
          {/* Recent Searches Section */}
          {(activeTab === 'all' || activeTab === 'searches') && filteredRecentSearches.length > 0 && (
            <Section
              title="Recent Searches"
              icon={<Clock size={16} style={{ color: '#6b7280' }} />}
              count={filteredRecentSearches.length}
              onClear={() => clearAllByType('recent')}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredRecentSearches.slice(0, activeTab === 'all' ? 5 : undefined).map(search => (
                  <HistoryCard
                    key={search.id}
                    icon={<Search size={16} style={{ color: '#3b82f6' }} />}
                    title={search.query}
                    subtitle={timeAgo(search.timestamp)}
                    onClick={() => handleSearchClick(search.query, search.cachedResult)}
                    onDelete={() => deleteRecentSearch(search.id)}
                    color="#3b82f6"
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Saved Searches Section */}
          {(activeTab === 'all' || activeTab === 'searches') && filteredSavedSearches.length > 0 && (
            <Section
              title="Saved Searches"
              icon={<Search size={16} style={{ color: '#3b82f6' }} />}
              count={filteredSavedSearches.length}
              onClear={() => clearAllByType('saved')}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredSavedSearches.slice(0, activeTab === 'all' ? 5 : undefined).map(search => (
                  <HistoryCard
                    key={search.id}
                    icon={<Search size={16} style={{ color: '#3b82f6' }} />}
                    title={search.query}
                    subtitle={formatDate(search.timestamp)}
                    meta={search.domain || search.camp}
                    note={search.note}
                    onClick={() => handleSearchClick(search.query, search.cachedResult)}
                    onDelete={() => deleteSavedSearch(search.id)}
                    onUpdateNote={(note) => updateSavedSearchNote(search.id, note)}
                    color="#3b82f6"
                    saved
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Saved Analyses Section */}
          {(activeTab === 'all' || activeTab === 'analyses') && filteredAnalyses.length > 0 && (
            <Section
              title="AI Analyses"
              icon={<Sparkles size={16} style={{ color: '#8b5cf6' }} />}
              count={filteredAnalyses.length}
              onClear={() => clearAllByType('analyses')}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredAnalyses.slice(0, activeTab === 'all' ? 5 : undefined).map(analysis => (
                  <HistoryCard
                    key={analysis.id}
                    icon={<Sparkles size={16} style={{ color: '#8b5cf6' }} />}
                    title={analysis.preview || analysis.text.slice(0, 100) + '...'}
                    subtitle={formatDate(analysis.timestamp)}
                    note={analysis.note}
                    onClick={() => handleAnalysisClick(analysis.text, analysis.cachedResult)}
                    onDelete={() => deleteAnalysis(analysis.id)}
                    onUpdateNote={(note) => updateAnalysisNote(analysis.id, note)}
                    color="#8b5cf6"
                    saved
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Helpful Insights Section */}
          {(activeTab === 'all' || activeTab === 'insights') && filteredInsights.length > 0 && (
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
                {filteredInsights.slice(0, activeTab === 'all' ? 5 : undefined).map((insight: HelpfulInsight) => (
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
                      // Restore the cached session in AI Editor
                      if (insight.fullText || insight.cachedResult) {
                        router.push('/ai-editor')
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent('load-ai-editor-text', {
                            detail: {
                              text: insight.fullText || '',
                              cachedResult: insight.cachedResult
                            }
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

          {/* Combined Authors Section (Favorites + Notes) */}
          {(activeTab === 'all' || activeTab === 'authors') && (() => {
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
                  {filteredAuthors.slice(0, activeTab === 'all' ? 6 : undefined).map(author => {
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

          {/* Overall Empty State (All Activity tab with no data) */}
          {activeTab === 'all' &&
           filteredRecentSearches.length === 0 &&
           filteredSavedSearches.length === 0 &&
           filteredAnalyses.length === 0 &&
           filteredInsights.length === 0 &&
           getUniqueAuthorsCount() === 0 && (
            <EmptyStateComponent
              icon={History}
              iconColor="var(--color-indigo-500)"
              iconBgFrom="var(--color-indigo-50)"
              iconBgTo="var(--color-indigo-100)"
              title={timeFilter !== 'all' ? 'No activity in this time period' : 'Your research journey starts here'}
              description={timeFilter !== 'all'
                ? 'Try selecting a different time range to see more activity.'
                : 'As you explore perspectives, save searches, analyze content, and bookmark authors, your activity will be tracked here.'}
              action={timeFilter === 'all' ? {
                label: "Explore Perspectives",
                onClick: () => router.push('/explore'),
                icon: Compass
              } : undefined}
              size="lg"
            />
          )}
        </div>
        </div>
      </main>

      {/* About Modal */}
      {showAboutModal && (
        <AboutHistoryModal onClose={() => setShowAboutModal(false)} />
      )}
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
              Your Research History
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            Track your research journey and pick up where you left off.
          </p>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Search size={18} style={{ color: '#2563eb' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                Search History
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                All your past searches are saved automatically. Revisit any search to continue your research.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#f3e8ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={18} style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                AI Analyses
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                Your saved AI analyses are stored here. Load any past analysis to continue refining your work.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Star size={18} style={{ color: '#d97706' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                Favorite Authors
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                Star authors from the Authors page to quickly access their profiles and track their perspectives.
              </p>
            </div>
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
          >
            Got it
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}


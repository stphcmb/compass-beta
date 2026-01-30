'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookMarked,
  History,
  Search,
  Sparkles,
  Star,
  Clock,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Users,
  Compass,
  ThumbsUp
} from 'lucide-react'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import EmptyStateComponent from '@/components/EmptyState'
import { useAuthorPanel } from '@/contexts/AuthorPanelContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'
import { TERMINOLOGY } from '@/lib/constants/terminology'
import SavedBadge from '@/components/SavedBadge'
import FilterBar, { TimeFilter as FilterBarTimeFilter, TypeFilter } from '@/components/library/FilterBar'
import ViewToggle, { ViewMode as ViewModeType } from '@/components/library/ViewToggle'

// Import centralized hooks and utilities
import { useHistoryData, useHistoryActions, useHistoryUI, useHistoryEvents, useHistoryFilters, timeAgo, formatDate } from './hooks'
import type { TabType, DeletedItem, TimeFilter, HelpfulInsight } from './lib/types'

// Import extracted components
import {
  CollapsibleSection,
  Section,
  EmptySection,
  SearchCard,
  AnalysisCard,
  InsightCard,
  HistoryCard,
  MiniAuthorCard,
  UnifiedAuthorCard,
  AboutHistoryModal,
  RecentlyDeletedModal
} from './components'

export default function HistoryPage() {
  const router = useRouter()
  const { openPanel } = useAuthorPanel()
  const { showToast } = useToast()
  const [mounted, setMounted] = useState(false)

  // Use centralized hooks
  const { data, loading, reloadData } = useHistoryData()
  const actions = useHistoryActions({ data, reloadData, showToast })
  const ui = useHistoryUI()

  // Setup event listeners for cross-component synchronization
  useHistoryEvents({
    onNoteUpdated: reloadData,
    onFavoriteAdded: reloadData,
    onInsightAdded: reloadData,
    onSearchNoteUpdated: reloadData,
  })

  useEffect(() => {
    setMounted(true)

    // Check for auto-show modal
    const seenCount = parseInt(localStorage.getItem('historyPageSeenCount') || '0', 10)
    if (seenCount < 2) {
      ui.openAboutModal()
      localStorage.setItem('historyPageSeenCount', String(seenCount + 1))
    }
  }, [])

  // Apply filters using the hook
  const filteredRecentSearches = useHistoryFilters(data.recentSearches, ui.timeFilter, ui.searchQuery)
  const filteredSavedSearches = useHistoryFilters(data.savedSearches, ui.timeFilter, ui.searchQuery)
  const filteredAnalyses = useHistoryFilters(data.savedAnalyses, ui.timeFilter, ui.searchQuery)
  const filteredInsights = useHistoryFilters(data.helpfulInsights, ui.timeFilter, ui.searchQuery)
  const filteredFavorites = useHistoryFilters(data.favoriteAuthors, ui.timeFilter, ui.searchQuery, ui.favoritesOnly)
  const filteredAuthorNotes = useHistoryFilters(
    data.authorNotes.map(n => ({ ...n, timestamp: n.updatedAt })),
    ui.timeFilter,
    ui.searchQuery
  )

  // Calculate filtered author count
  const getFilteredAuthorsCount = () => {
    const authorNames = new Set([
      ...filteredFavorites.map(f => f.name),
      ...filteredAuthorNotes.map(n => n.name)
    ])
    return authorNames.size
  }

  // Navigation handlers (keep these - not part of CRUD actions)
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
      router.push(`/research-assistant/results/${id}`)
    } else {
      // No cached result - go to editor and load text
      router.push('/research-assistant')
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('load-research-assistant-text', {
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
        <div className="max-w-6xl mx-auto" style={{ padding: '24px 32px' }}>
          {/* Page Header - Centered like Explore page */}
          <PageHeader
            icon={<BookMarked size={24} />}
            iconVariant="purple"
            title={TERMINOLOGY.history}
            subtitle="Organize and revisit your saved searches, analyses, insights, and favorite authors in one place."
            helpButton={{
              label: 'How it works',
              onClick: () => ui.openAboutModal()
            }}
          />

          {/* Framing Question */}
          <div className="text-center mb-6">
            <h3 className="text-[17px] font-semibold text-gray-900 mb-2">What have you explored so far?</h3>
          </div>

          {/* Filter Bar and View Toggle */}
          <div className="mb-6">
            <FilterBar
              searchQuery={ui.searchQuery}
              onSearchChange={ui.setSearchQuery}
              timeFilter={ui.timeFilter}
              onTimeFilterChange={ui.setTimeFilter}
              typeFilter={ui.activeTab}
              onTypeFilterChange={(filter: TypeFilter) => ui.setActiveTab(filter as TabType)}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {ui.activeTab === 'all' ? 'All Items' : tabs.find(t => t.id === ui.activeTab)?.label}
            </div>
            <ViewToggle viewMode={ui.viewMode} onViewModeChange={ui.setViewMode} />
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
                    onClick={() => ui.setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 10px',
                      borderRadius: '16px',
                      border: ui.activeTab ===tab.id ? `1.5px solid ${colors[tab.id]}` : '1.5px solid transparent',
                      background: ui.activeTab ===tab.id ? `${colors[tab.id]}12` : '#f5f5f5',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      if (ui.activeTab !==tab.id) {
                        e.currentTarget.style.background = '#ebebeb'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (ui.activeTab !==tab.id) {
                        e.currentTarget.style.background = '#f5f5f5'
                        e.currentTarget.style.borderColor = 'transparent'
                      }
                    }}
                  >
                    <span style={{ color: ui.activeTab ===tab.id ? colors[tab.id] : 'var(--color-mid-gray)' }}>
                      {icons[tab.id]}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: ui.activeTab ===tab.id ? 600 : 500,
                      color: ui.activeTab ===tab.id ? colors[tab.id] : 'var(--color-charcoal)'
                    }}>
                      {tab.label}
                    </span>
                    <span style={{
                      padding: '0px 5px',
                      borderRadius: '6px',
                      background: ui.activeTab ===tab.id ? `${colors[tab.id]}25` : '#e5e7eb',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: ui.activeTab ===tab.id ? colors[tab.id] : 'var(--color-mid-gray)'
                    }}>
                      {tab.count}
                    </span>
                  </button>
                )
              })}

              {/* Recently Deleted */}
              <button
                onClick={() => ui.openRecentlyDeleted()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '16px',
                  border: '1.5px solid transparent',
                  background: data.deletedItems.length > 0 ? '#fef2f2' : '#f5f5f5',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = data.deletedItems.length > 0 ? '#fee2e2' : '#ebebeb'
                  e.currentTarget.style.borderColor = data.deletedItems.length > 0 ? '#fecaca' : '#d1d5db'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = data.deletedItems.length > 0 ? '#fef2f2' : '#f5f5f5'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <span style={{ color: data.deletedItems.length > 0 ? '#ef4444' : 'var(--color-mid-gray)' }}>
                  <Trash2 size={12} />
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: data.deletedItems.length > 0 ? '#b91c1c' : 'var(--color-charcoal)'
                }}>
                  Deleted
                </span>
                {data.deletedItems.length > 0 && (
                  <span style={{
                    padding: '0px 5px',
                    borderRadius: '6px',
                    background: '#fecaca',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#dc2626'
                  }}>
                    {data.deletedItems.length}
                  </span>
                )}
              </button>
            </div>

            {/* Time Filter */}
            <select
              value={ui.timeFilter}
              onChange={(e) => ui.setTimeFilter(e.target.value as TimeFilter)}
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
        {ui.activeTab ==='all' ? (
          // Only show full empty state when there's truly NO history at all (unfiltered)
          ui.timeFilter === 'all' &&
          data.recentSearches.length === 0 &&
          data.savedSearches.length === 0 &&
          data.savedAnalyses.length === 0 &&
          data.helpfulInsights.length === 0 &&
          data.favoriteAuthors.length === 0 &&
          data.authorNotes.length === 0 ? (
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
            {/* Searches - Combined compact section */}
            {(filteredSavedSearches.length > 0 || filteredRecentSearches.length > 0) && (
              <CollapsibleSection
                id="searches"
                title="Search History"
                icon={<Search size={14} style={{ color: '#3b82f6' }} />}
                count={filteredSavedSearches.length + filteredRecentSearches.length}
                isCollapsed={ui.collapsedSections['searches']}
                onToggle={() => ui.toggleSection('searches')}
                onClear={() => {
                  actions.clearAllByType('saved')
                  actions.clearAllByType('recent')
                }}
                color="#3b82f6"
              >
                <div style={{
                  display: ui.viewMode === 'grid' ? 'grid' : 'flex',
                  gridTemplateColumns: ui.viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : undefined,
                  flexDirection: ui.viewMode === 'list' ? 'column' : undefined,
                  gap: ui.viewMode === 'grid' ? '8px' : '0',
                  width: '100%',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  border: ui.viewMode === 'list' ? '1px solid #e5e7eb' : 'none',
                  borderRadius: ui.viewMode === 'list' ? '8px' : '0',
                  overflow: ui.viewMode === 'list' ? 'hidden auto' : 'visible'
                }}>
                  {/* Show saved searches first (max 3) */}
                  {filteredSavedSearches.slice(0, 3).map(s => (
                    <SearchCard
                      key={s.id}
                      query={s.query}
                      timestamp={timeAgo(s.timestamp)}
                      isSaved={true}
                      note={s.note}
                      onClick={() => handleSearchClick(s.query, s.cachedResult)}
                      onDelete={() => actions.deleteSavedSearch(s.id)}
                      viewMode={ui.viewMode}
                    />
                  ))}
                  {/* Then show recent searches (max 3) */}
                  {filteredRecentSearches.slice(0, 3).map(s => (
                    <SearchCard
                      key={s.id}
                      query={s.query}
                      timestamp={timeAgo(s.timestamp)}
                      isSaved={false}
                      note={s.note}
                      onClick={() => handleSearchClick(s.query, s.cachedResult)}
                      onDelete={() => actions.deleteRecentSearch(s.id)}
                      viewMode={ui.viewMode}
                    />
                  ))}
                </div>
                {(filteredSavedSearches.length + filteredRecentSearches.length > 6) && (
                  <div style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center', marginTop: '8px' }}>
                    <button
                      onClick={() => ui.setActiveTab('searches')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#3b82f6',
                        cursor: 'pointer',
                        fontSize: '10px',
                        fontWeight: 500
                      }}
                    >
                      +{filteredSavedSearches.length + filteredRecentSearches.length - 6} more →
                    </button>
                  </div>
                )}
              </CollapsibleSection>
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
                  {ui.timeFilter !=='all' ? 'No searches in this time period' : 'Your search history will appear here'}
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
              isCollapsed={ui.collapsedSections['analyses']}
              onToggle={() => ui.toggleSection('analyses')}
              onClear={() => actions.clearAllByType('analyses')}
              color="#8b5cf6"
            >
              {filteredAnalyses.length > 0 ? (
                <>
                  <div style={{
                    display: ui.viewMode === 'grid' ? 'grid' : 'flex',
                    gridTemplateColumns: ui.viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : undefined,
                    flexDirection: ui.viewMode === 'list' ? 'column' : undefined,
                    gap: ui.viewMode === 'grid' ? '8px' : '0',
                    width: '100%',
                    maxHeight: ui.viewMode === 'list' && filteredAnalyses.length > 3 ? '260px' : 'none',
                    overflowY: ui.viewMode === 'list' && filteredAnalyses.length > 3 ? 'auto' : 'visible',
                    paddingRight: ui.viewMode === 'list' && filteredAnalyses.length > 3 ? '4px' : '0',
                    border: ui.viewMode === 'list' ? '1px solid #e5e7eb' : 'none',
                    borderRadius: ui.viewMode === 'list' ? '8px' : '0',
                    overflow: ui.viewMode === 'list' ? 'hidden' : 'visible'
                  }}>
                    {filteredAnalyses.map(analysis => (
                      <AnalysisCard
                        key={analysis.id}
                        inputPreview={analysis.preview || analysis.text}
                        cachedResult={analysis.cachedResult}
                        timestamp={timeAgo(analysis.timestamp)}
                        note={analysis.note}
                        onClick={() => handleAnalysisClick(analysis.id, analysis.text, analysis.cachedResult)}
                        onDelete={() => actions.deleteAnalysis(analysis.id)}
                        viewMode={ui.viewMode}
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
                  message={ui.timeFilter !=='all' ? 'No analyses in this time period' : 'Analyze content in the Research Assistant to save analyses here'}
                  actionLabel="Try Research Assistant"
                  actionIcon={<Sparkles size={14} />}
                  onAction={() => router.push('/research-assistant')}
                />
              )}
            </CollapsibleSection>

            {/* Helpful Insights - Collapsible (always visible) */}
            <CollapsibleSection
              id="insights"
              title="Helpful Insights"
              icon={<ThumbsUp size={16} style={{ color: '#10b981' }} />}
              count={filteredInsights.length}
              isCollapsed={ui.collapsedSections['insights']}
              onToggle={() => ui.toggleSection('insights')}
              onClear={() => actions.clearAllByType('insights')}
              color="#10b981"
            >
              {filteredInsights.length > 0 ? (
                <>
                  <div style={{
                    display: ui.viewMode === 'grid' ? 'grid' : 'flex',
                    gridTemplateColumns: ui.viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : undefined,
                    flexDirection: ui.viewMode === 'list' ? 'column' : undefined,
                    gap: ui.viewMode === 'grid' ? '8px' : '0',
                    maxHeight: ui.viewMode === 'list' && filteredInsights.length > 3 ? '260px' : 'none',
                    overflowY: ui.viewMode === 'list' && filteredInsights.length > 3 ? 'auto' : 'visible',
                    paddingRight: ui.viewMode === 'list' && filteredInsights.length > 3 ? '4px' : '0',
                    border: ui.viewMode === 'list' ? '1px solid #e5e7eb' : 'none',
                    borderRadius: ui.viewMode === 'list' ? '8px' : '0',
                    overflow: ui.viewMode === 'list' ? 'hidden' : 'visible'
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
                            router.push(`/research-assistant/results/${insight.analysisId}?${params.toString()}`)
                          } else if (insight.fullText) {
                            router.push('/research-assistant')
                            setTimeout(() => {
                              window.dispatchEvent(new CustomEvent('load-research-assistant-text', {
                                detail: { text: insight.fullText, autoAnalyze: true }
                              }))
                            }, 100)
                          } else {
                            router.push('/research-assistant')
                          }
                        }}
                        onDelete={() => {
                          const filtered = data.helpfulInsights.filter(i => i.id !== insight.id)
                          localStorage.setItem('helpfulInsights', JSON.stringify(filtered))
                          reloadData()
                        }}
                        viewMode={ui.viewMode}
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
                  message={ui.timeFilter !=='all' ? 'No insights in this time period' : 'Mark summaries or perspectives as helpful in the Research Assistant'}
                  actionLabel="Try Research Assistant"
                  actionIcon={<ThumbsUp size={14} />}
                  onAction={() => router.push('/research-assistant')}
                />
              )}
            </CollapsibleSection>

            {/* Saved Authors - Collapsible with filter (always visible) */}
            {(() => {
              const authorMap = new Map<string, any>()
              data.favoriteAuthors.forEach(fav => {
                authorMap.set(fav.name, { name: fav.name, isFavorite: true, addedAt: fav.addedAt })
              })
              data.authorNotes.forEach(noteItem => {
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

              // Note: Time filter already applied via useHistoryFilters for filteredFavorites and filteredAuthorNotes

              // Apply favorites filter
              if (ui.favoritesOnly) {
                unifiedAuthors = unifiedAuthors.filter(a => a.isFavorite)
              }

              const favoritesCount = unifiedAuthors.filter(a => a.isFavorite).length

              return (
                <CollapsibleSection
                  id="authors"
                  title="Saved Authors"
                  icon={<Users size={16} style={{ color: '#059669' }} />}
                  count={unifiedAuthors.length}
                  isCollapsed={ui.collapsedSections['authors']}
                  onToggle={() => ui.toggleSection('authors')}
                  onClear={() => { actions.clearAllByType('favorites'); actions.clearAllByType('notes') }}
                  color="#059669"
                  headerExtra={unifiedAuthors.length > 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        ui.setFavoritesOnly(!ui.favoritesOnly)
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: ui.favoritesOnly ? '#fef3c7' : '#f3f4f6',
                        color: ui.favoritesOnly ? '#d97706' : '#6b7280',
                        fontSize: '11px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Star size={12} style={{ fill: ui.favoritesOnly ? '#f59e0b' : 'none' }} />
                      {ui.favoritesOnly ? 'Showing Favorites' : `Favorites (${favoritesCount})`}
                    </button>
                  ) : undefined}
                >
                  {unifiedAuthors.length === 0 ? (
                    <EmptySection
                      message={ui.favoritesOnly ? 'No favorite authors yet' : (ui.timeFilter !=='all' ? 'No authors saved in this time period' : 'Star authors or add notes from the Authors page')}
                      actionLabel="Discover Authors"
                      actionIcon={<Users size={14} />}
                      onAction={() => router.push('/authors')}
                    />
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: ui.viewMode === 'grid' ? 'repeat(auto-fill, minmax(200px, 1fr))' : '1fr',
                      gap: ui.viewMode === 'grid' ? '10px' : '0',
                      maxHeight: '240px',
                      overflowY: 'auto',
                      border: ui.viewMode === 'list' ? '1px solid #e5e7eb' : 'none',
                      borderRadius: ui.viewMode === 'list' ? '8px' : '0',
                      paddingRight: '4px'
                    }}>
                      {unifiedAuthors.map(author => {
                        const details = data.authorDetails[author.name]
                        return (
                          <MiniAuthorCard
                            key={author.name}
                            name={author.name}
                            affiliation={details?.affiliation || details?.primary_domain}
                            isFavorite={author.isFavorite}
                            note={author.note}
                            onClick={() => handleAuthorClick(author.name)}
                            viewMode={ui.viewMode}
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
              onClick={() => ui.setActiveTab('all')}
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
          {ui.activeTab ==='searches' && (
            <>
              {filteredRecentSearches.length > 0 && (
                <Section title="Recent Searches" icon={<Clock size={16} style={{ color: '#6b7280' }} />} count={filteredRecentSearches.length} onClear={() => actions.clearAllByType('recent')}>
                  <div style={{
                    display: ui.viewMode === 'grid' ? 'grid' : 'flex',
                    gridTemplateColumns: ui.viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : undefined,
                    flexDirection: ui.viewMode === 'list' ? 'column' : undefined,
                    gap: '8px'
                  }}>
                    {filteredRecentSearches.map(s => (
                      <HistoryCard key={s.id} icon={<Search size={16} style={{ color: '#3b82f6' }} />} title={s.query} subtitle={timeAgo(s.timestamp)} note={s.note} onClick={() => handleSearchClick(s.query, s.cachedResult)} onDelete={() => actions.deleteRecentSearch(s.id)} onUpdateNote={(note) => actions.updateSearchNote(s.id, note, false)} color="#3b82f6" />
                    ))}
                  </div>
                </Section>
              )}
              {filteredSavedSearches.length > 0 && (
                <Section title="Saved Searches" icon={<Search size={16} style={{ color: '#3b82f6' }} />} count={filteredSavedSearches.length} onClear={() => actions.clearAllByType('saved')}>
                  <div style={{
                    display: ui.viewMode === 'grid' ? 'grid' : 'flex',
                    gridTemplateColumns: ui.viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : undefined,
                    flexDirection: ui.viewMode === 'list' ? 'column' : undefined,
                    gap: '8px'
                  }}>
                    {filteredSavedSearches.map(s => (
                      <HistoryCard key={s.id} icon={<Search size={16} style={{ color: '#3b82f6' }} />} title={s.query} subtitle={formatDate(s.timestamp)} meta={s.domain || s.camp} note={s.note} onClick={() => handleSearchClick(s.query, s.cachedResult)} onDelete={() => actions.deleteSavedSearch(s.id)} onUpdateNote={(note) => actions.updateSearchNote(s.id, note, true)} color="#3b82f6" saved />
                    ))}
                  </div>
                </Section>
              )}
            </>
          )}

          {/* Analyses (single view) */}
          {ui.activeTab ==='analyses' && filteredAnalyses.length > 0 && (
            <Section title="AI Analyses" icon={<Sparkles size={16} style={{ color: '#8b5cf6' }} />} count={filteredAnalyses.length} onClear={() => actions.clearAllByType('analyses')}>
              <div style={{
                display: ui.viewMode === 'grid' ? 'grid' : 'flex',
                gridTemplateColumns: ui.viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : undefined,
                flexDirection: ui.viewMode === 'list' ? 'column' : undefined,
                gap: '8px'
              }}>
                {filteredAnalyses.map(a => (
                  <AnalysisCard
                    key={a.id}
                    inputPreview={a.preview || a.text}
                    cachedResult={a.cachedResult}
                    timestamp={formatDate(a.timestamp)}
                    note={a.note}
                    onClick={() => handleAnalysisClick(a.id, a.text, a.cachedResult)}
                    onDelete={() => actions.deleteAnalysis(a.id)}
                    viewMode={ui.viewMode}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Helpful Insights Section (single view) */}
          {ui.activeTab ==='insights' && filteredInsights.length > 0 && (
            <Section
              title="Helpful Insights"
              icon={<ThumbsUp size={16} style={{ color: '#10b981' }} />}
              count={filteredInsights.length}
              onClear={() => actions.clearAllByType('insights')}
            >
              <div style={{
                display: ui.viewMode === 'grid' ? 'grid' : 'flex',
                gridTemplateColumns: ui.viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : undefined,
                flexDirection: ui.viewMode === 'list' ? 'column' : undefined,
                gap: '8px'
              }}>
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
                        router.push(`/research-assistant/results/${insight.analysisId}?${params.toString()}`)
                      } else if (insight.fullText) {
                        router.push('/research-assistant')
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent('load-research-assistant-text', {
                            detail: { text: insight.fullText, autoAnalyze: true }
                          }))
                        }, 100)
                      } else {
                        router.push('/research-assistant')
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
                          const filtered = data.helpfulInsights.filter(i => i.id !== insight.id)
                          localStorage.setItem('helpfulInsights', JSON.stringify(filtered))
                          reloadData()
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
          {ui.activeTab ==='authors' && (() => {
            // Build unified author list from favorites and notes
            const authorMap = new Map<string, {
              name: string
              isFavorite: boolean
              note?: string
              addedAt?: string
              noteUpdatedAt?: string
            }>()

            // Add favorites
            data.favoriteAuthors.forEach(fav => {
              authorMap.set(fav.name, {
                name: fav.name,
                isFavorite: true,
                addedAt: fav.addedAt
              })
            })

            // Add/merge notes
            data.authorNotes.forEach(noteItem => {
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

            // Time filter already applied via useHistoryFilters to filteredFavorites and filteredAuthorNotes
            const filteredAuthors = unifiedAuthors

            if (filteredAuthors.length === 0) return null

            return (
              <Section
                title="Saved Authors"
                icon={<Users size={16} style={{ color: '#6366f1' }} />}
                count={filteredAuthors.length}
                onClear={() => {
                  actions.clearAllByType('favorites')
                  actions.clearAllByType('notes')
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: ui.viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
                  gap: ui.viewMode === 'grid' ? '12px' : '8px'
                }}>
                  {filteredAuthors.map(author => {
                    const details = data.authorDetails[author.name]
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
                            actions.removeFavoriteAuthor(author.name)
                          } else {
                            // Add to favorites
                            const newFavorite = {
                              id: `fav-${Date.now()}`,
                              name: author.name,
                              addedAt: new Date().toISOString()
                            }
                            const updated = [newFavorite, ...data.favoriteAuthors]
                            localStorage.setItem('favoriteAuthors', JSON.stringify(updated))
                            reloadData()
                          }
                        }}
                        onDeleteNote={() => actions.deleteAuthorNote(author.name)}
                        onUpdateNote={(note) => actions.updateAuthorNote(author.name, note)}
                        timeAgo={timeAgo}
                      />
                    )
                  })}
                </div>
              </Section>
            )
          })()}

          {/* Tab-specific Empty States */}
          {ui.activeTab ==='searches' && filteredRecentSearches.length === 0 && filteredSavedSearches.length === 0 && (
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

          {ui.activeTab ==='analyses' && filteredAnalyses.length === 0 && (
            <EmptyStateComponent
              icon={Sparkles}
              iconColor="#8b5cf6"
              iconBgFrom="#f3e8ff"
              iconBgTo="#e9d5ff"
              title="No saved analyses yet"
              description="Use the Research Assistant to analyze text and save your analyses here for future reference."
              action={{
                label: "Try Research Assistant",
                onClick: () => router.push('/research-assistant'),
                icon: Sparkles
              }}
            />
          )}

          {ui.activeTab ==='insights' && filteredInsights.length === 0 && (
            <EmptyStateComponent
              icon={ThumbsUp}
              iconColor="#10b981"
              iconBgFrom="#d1fae5"
              iconBgTo="#a7f3d0"
              title="No helpful insights yet"
              description="When you find summaries or perspectives helpful in the Research Assistant, mark them with a thumbs up to save them here."
              action={{
                label: "Try Research Assistant",
                onClick: () => router.push('/research-assistant'),
                icon: Sparkles
              }}
            />
          )}

          {ui.activeTab ==='authors' && getFilteredAuthorsCount() === 0 && (
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
      {ui.showAboutModal && (
        <AboutHistoryModal onClose={() => ui.closeAboutModal()} />
      )}

      {/* Recently Deleted Modal */}
      {ui.showRecentlyDeleted && (
        <RecentlyDeletedModal
          items={data.deletedItems}
          onRestore={actions.restoreItem}
          onDelete={actions.permanentlyDelete}
          onClearAll={actions.clearAllDeleted}
          onClose={() => ui.closeRecentlyDeleted()}
          timeAgo={timeAgo}
        />
      )}
    </div>
  )
}

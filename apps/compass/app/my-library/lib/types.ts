/**
 * Centralized type definitions for My Library (History) feature
 * Single source of truth for all data structures
 */

export interface SearchItem {
  id: string
  query: string
  timestamp: string
  domain?: string
  camp?: string
  cachedResult?: any
  note?: string
}

export interface AnalysisItem {
  id: string
  text: string
  preview?: string
  timestamp: string
  cachedResult?: any
  note?: string
}

export interface FavoriteAuthor {
  id: string
  name: string
  addedAt: string
}

export interface AuthorNote {
  id: string
  name: string
  note: string
  updatedAt: string
}

export interface HelpfulInsight {
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

export interface DeletedItem {
  id: string
  type: 'favorite' | 'note' | 'search' | 'analysis'
  name: string
  data: any
  deletedAt: string
}

export interface HistoryData {
  recentSearches: SearchItem[]
  savedSearches: SearchItem[]
  savedAnalyses: AnalysisItem[]
  favoriteAuthors: FavoriteAuthor[]
  authorNotes: AuthorNote[]
  helpfulInsights: HelpfulInsight[]
  deletedItems: DeletedItem[]
  authorDetails: Record<string, any>
}

export type TabType = 'all' | 'searches' | 'analyses' | 'insights' | 'authors'
export type TimeFilter = 'all' | 'today' | 'week' | 'month'
export type ViewMode = 'compact' | 'expanded'

/**
 * Generic interface for items that can be filtered by time
 */
export interface FilterableItem {
  timestamp?: string
  addedAt?: string
  updatedAt?: string
}

/**
 * Event callbacks for cross-component synchronization
 */
export interface HistoryEventCallbacks {
  onNoteUpdated?: () => void
  onFavoriteAdded?: () => void
  onInsightAdded?: () => void
  onSearchNoteUpdated?: () => void
}

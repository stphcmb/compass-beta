/**
 * Centralized localStorage operations for My Library (History) feature
 * All storage keys and CRUD operations in one place
 */

import type {
  SearchItem,
  AnalysisItem,
  FavoriteAuthor,
  AuthorNote,
  HelpfulInsight,
  DeletedItem,
} from './types'
import { safeJSONParse, generateId } from './utils'

/**
 * Storage keys constants
 */
export const STORAGE_KEYS = {
  RECENT_SEARCHES: 'recentSearches',
  SAVED_SEARCHES: 'savedSearches',
  SAVED_ANALYSES: 'savedAIEditorAnalyses',
  FAVORITE_AUTHORS: 'favoriteAuthors',
  AUTHOR_NOTES: 'authorNotes',
  HELPFUL_INSIGHTS: 'helpfulInsights',
  RECENTLY_DELETED: 'recentlyDeletedItems',
} as const

/**
 * Load item from localStorage with type safety
 */
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  return safeJSONParse(localStorage.getItem(key), fallback)
}

/**
 * Save item to localStorage with type safety
 */
function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * Load all history data from localStorage
 */
export function loadAllHistoryData() {
  const recentSearches = loadFromStorage<SearchItem[]>(STORAGE_KEYS.RECENT_SEARCHES, [])
  const savedSearches = loadFromStorage<SearchItem[]>(STORAGE_KEYS.SAVED_SEARCHES, [])
  const savedAnalyses = loadFromStorage<AnalysisItem[]>(STORAGE_KEYS.SAVED_ANALYSES, [])
  const favoriteAuthors = loadFromStorage<FavoriteAuthor[]>(STORAGE_KEYS.FAVORITE_AUTHORS, [])
  const authorNotes = loadFromStorage<AuthorNote[]>(STORAGE_KEYS.AUTHOR_NOTES, [])
  const helpfulInsights = loadFromStorage<HelpfulInsight[]>(STORAGE_KEYS.HELPFUL_INSIGHTS, [])
  const deletedItems = loadFromStorage<DeletedItem[]>(STORAGE_KEYS.RECENTLY_DELETED, [])

  // Clean up deleted items older than 30 days
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const validDeleted = deletedItems.filter(item =>
    new Date(item.deletedAt).getTime() > thirtyDaysAgo
  )

  if (validDeleted.length !== deletedItems.length) {
    saveToStorage(STORAGE_KEYS.RECENTLY_DELETED, validDeleted)
  }

  return {
    recentSearches,
    savedSearches,
    savedAnalyses,
    favoriteAuthors,
    authorNotes,
    helpfulInsights,
    deletedItems: validDeleted,
  }
}

/**
 * Delete search operations
 */
export function deleteRecentSearch(id: string): { filtered: SearchItem[]; deleted?: SearchItem } {
  const items = loadFromStorage<SearchItem[]>(STORAGE_KEYS.RECENT_SEARCHES, [])
  const search = items.find(s => s.id === id)
  const filtered = items.filter(s => s.id !== id)
  saveToStorage(STORAGE_KEYS.RECENT_SEARCHES, filtered)
  return { filtered, deleted: search }
}

export function deleteSavedSearch(id: string): { filtered: SearchItem[]; deleted?: SearchItem } {
  const items = loadFromStorage<SearchItem[]>(STORAGE_KEYS.SAVED_SEARCHES, [])
  const search = items.find(s => s.id === id)
  const filtered = items.filter(s => s.id !== id)
  saveToStorage(STORAGE_KEYS.SAVED_SEARCHES, filtered)
  return { filtered, deleted: search }
}

export function deleteAnalysis(id: string): { filtered: AnalysisItem[]; deleted?: AnalysisItem } {
  const items = loadFromStorage<AnalysisItem[]>(STORAGE_KEYS.SAVED_ANALYSES, [])
  const analysis = items.find(a => a.id === id)
  const filtered = items.filter(a => a.id !== id)
  saveToStorage(STORAGE_KEYS.SAVED_ANALYSES, filtered)
  return { filtered, deleted: analysis }
}

/**
 * Note operations
 */
export function updateSearchNote(
  id: string,
  note: string,
  isSaved: boolean
): { updated: SearchItem[]; movedToSaved?: SearchItem } {
  const storageKey = isSaved ? STORAGE_KEYS.SAVED_SEARCHES : STORAGE_KEYS.RECENT_SEARCHES

  // If adding note to recent search, auto-save it
  if (!isSaved && note && note.trim()) {
    const recentItems = loadFromStorage<SearchItem[]>(STORAGE_KEYS.RECENT_SEARCHES, [])
    const search = recentItems.find(s => s.id === id)

    if (search) {
      // Create saved search with note
      const savedSearch: SearchItem = {
        ...search,
        id: generateId(),
        note,
        timestamp: new Date().toISOString(),
      }

      // Add to saved searches (avoid duplicates)
      const savedItems = loadFromStorage<SearchItem[]>(STORAGE_KEYS.SAVED_SEARCHES, [])
      const existingSaved = savedItems.filter(s => s.query !== search.query)
      const updatedSaved = [savedSearch, ...existingSaved]
      saveToStorage(STORAGE_KEYS.SAVED_SEARCHES, updatedSaved)

      // Remove from recent
      const updatedRecent = recentItems.filter(s => s.id !== id)
      saveToStorage(STORAGE_KEYS.RECENT_SEARCHES, updatedRecent)

      return { updated: updatedRecent, movedToSaved: savedSearch }
    }
  }

  // Otherwise, just update note in place
  const items = loadFromStorage<SearchItem[]>(storageKey, [])
  const updated = items.map(s => (s.id === id ? { ...s, note: note || undefined } : s))
  saveToStorage(storageKey, updated)
  return { updated }
}

export function updateAnalysisNote(id: string, note: string): AnalysisItem[] {
  const items = loadFromStorage<AnalysisItem[]>(STORAGE_KEYS.SAVED_ANALYSES, [])
  const updated = items.map(a => (a.id === id ? { ...a, note: note || undefined } : a))
  saveToStorage(STORAGE_KEYS.SAVED_ANALYSES, updated)
  return updated
}

export function updateAuthorNote(name: string, note: string): AuthorNote[] {
  const items = loadFromStorage<AuthorNote[]>(STORAGE_KEYS.AUTHOR_NOTES, [])
  const now = new Date().toISOString()
  const existingNote = items.find(n => n.name === name)

  let updated: AuthorNote[]
  if (existingNote) {
    // Update existing
    updated = items.map(n => (n.name === name ? { ...n, note, updatedAt: now } : n))
  } else {
    // Create new
    const newNote: AuthorNote = {
      id: generateId(),
      name,
      note,
      updatedAt: now,
    }
    updated = [newNote, ...items]
  }

  saveToStorage(STORAGE_KEYS.AUTHOR_NOTES, updated)

  // Dispatch event for cross-component sync
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('author-note-updated', {
        detail: { name, note },
      })
    )
  }

  return updated
}

export function deleteAuthorNote(name: string): { filtered: AuthorNote[]; deleted?: AuthorNote } {
  const items = loadFromStorage<AuthorNote[]>(STORAGE_KEYS.AUTHOR_NOTES, [])
  const note = items.find(n => n.name === name)
  const filtered = items.filter(n => n.name !== name)
  saveToStorage(STORAGE_KEYS.AUTHOR_NOTES, filtered)

  // Dispatch event for cross-component sync
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('author-note-updated', {
        detail: { name, note: '' },
      })
    )
  }

  return { filtered, deleted: note }
}

/**
 * Favorite author operations
 */
export function removeFavoriteAuthor(name: string): {
  filtered: FavoriteAuthor[]
  deleted?: FavoriteAuthor
} {
  const items = loadFromStorage<FavoriteAuthor[]>(STORAGE_KEYS.FAVORITE_AUTHORS, [])
  const author = items.find(a => a.name === name)
  const filtered = items.filter(a => a.name !== name)
  saveToStorage(STORAGE_KEYS.FAVORITE_AUTHORS, filtered)

  // Dispatch event for cross-component sync
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('favorite-author-removed', {
        detail: { name },
      })
    )
  }

  return { filtered, deleted: author }
}

/**
 * Recently deleted operations
 */
export function addToRecentlyDeleted(item: DeletedItem): DeletedItem[] {
  const items = loadFromStorage<DeletedItem[]>(STORAGE_KEYS.RECENTLY_DELETED, [])
  const updated = [item, ...items]
  saveToStorage(STORAGE_KEYS.RECENTLY_DELETED, updated)
  return updated
}

export function restoreDeletedItem(item: DeletedItem): void {
  if (item.type === 'favorite') {
    const current = loadFromStorage<FavoriteAuthor[]>(STORAGE_KEYS.FAVORITE_AUTHORS, [])
    const restored = [item.data, ...current]
    saveToStorage(STORAGE_KEYS.FAVORITE_AUTHORS, restored)

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('favorite-author-added', {
          detail: item.data,
        })
      )
    }
  } else if (item.type === 'note') {
    const current = loadFromStorage<AuthorNote[]>(STORAGE_KEYS.AUTHOR_NOTES, [])
    const restored = [item.data, ...current]
    saveToStorage(STORAGE_KEYS.AUTHOR_NOTES, restored)

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('author-note-updated', {
          detail: { name: item.name, note: item.data.note },
        })
      )
    }
  } else if (item.type === 'search') {
    if (item.data.wasSaved) {
      // Restore as saved search
      const { wasSaved, ...searchData } = item.data
      const current = loadFromStorage<SearchItem[]>(STORAGE_KEYS.SAVED_SEARCHES, [])
      const restored = [searchData, ...current]
      saveToStorage(STORAGE_KEYS.SAVED_SEARCHES, restored)
    } else {
      // Restore as recent search
      const current = loadFromStorage<SearchItem[]>(STORAGE_KEYS.RECENT_SEARCHES, [])
      const restored = [item.data, ...current]
      saveToStorage(STORAGE_KEYS.RECENT_SEARCHES, restored)
    }
  } else if (item.type === 'analysis') {
    const current = loadFromStorage<AnalysisItem[]>(STORAGE_KEYS.SAVED_ANALYSES, [])
    const restored = [item.data, ...current]
    saveToStorage(STORAGE_KEYS.SAVED_ANALYSES, restored)
  }

  // Remove from deleted items
  const items = loadFromStorage<DeletedItem[]>(STORAGE_KEYS.RECENTLY_DELETED, [])
  const filtered = items.filter(d => d.id !== item.id)
  saveToStorage(STORAGE_KEYS.RECENTLY_DELETED, filtered)
}

export function permanentlyDeleteItem(id: string): DeletedItem[] {
  const items = loadFromStorage<DeletedItem[]>(STORAGE_KEYS.RECENTLY_DELETED, [])
  const filtered = items.filter(d => d.id !== id)
  saveToStorage(STORAGE_KEYS.RECENTLY_DELETED, filtered)
  return filtered
}

export function clearAllDeleted(): void {
  saveToStorage(STORAGE_KEYS.RECENTLY_DELETED, [])
}

/**
 * Clear operations
 */
export function clearAllByType(
  type: 'recent' | 'saved' | 'analyses' | 'notes' | 'favorites'
): void {
  switch (type) {
    case 'recent':
      saveToStorage(STORAGE_KEYS.RECENT_SEARCHES, [])
      break
    case 'saved':
      saveToStorage(STORAGE_KEYS.SAVED_SEARCHES, [])
      break
    case 'analyses':
      saveToStorage(STORAGE_KEYS.SAVED_ANALYSES, [])
      break
    case 'notes':
      saveToStorage(STORAGE_KEYS.AUTHOR_NOTES, [])
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('author-notes-cleared'))
      }
      break
    case 'favorites':
      saveToStorage(STORAGE_KEYS.FAVORITE_AUTHORS, [])
      break
  }
}

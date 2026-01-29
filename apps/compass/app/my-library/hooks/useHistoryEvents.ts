'use client'

import { useEffect } from 'react'
import type { HistoryEventCallbacks } from '../lib/types'

/**
 * Custom hook for managing global window event listeners
 * Optimization: Centralized event listener management with proper cleanup
 * Expected: Cleaner code, reduced memory leaks
 */
export function useHistoryEvents(callbacks: HistoryEventCallbacks) {
  useEffect(() => {
    const {
      onNoteUpdated,
      onFavoriteAdded,
      onInsightAdded,
      onSearchNoteUpdated,
    } = callbacks

    // Event handler for author note updates
    const handleNoteUpdated = (e: Event) => {
      if (onNoteUpdated) {
        onNoteUpdated()
      }
    }

    // Event handler for favorite author added
    const handleFavoriteAdded = () => {
      if (onFavoriteAdded) {
        onFavoriteAdded()
      }
    }

    // Event handler for helpful insight added
    const handleInsightAdded = () => {
      if (onInsightAdded) {
        onInsightAdded()
      }
    }

    // Event handler for search note updated
    const handleSearchNoteUpdated = () => {
      if (onSearchNoteUpdated) {
        onSearchNoteUpdated()
      }
    }

    // Register event listeners
    if (onNoteUpdated) {
      window.addEventListener('author-note-updated', handleNoteUpdated as EventListener)
    }
    if (onFavoriteAdded) {
      window.addEventListener('favorite-author-added', handleFavoriteAdded)
    }
    if (onInsightAdded) {
      window.addEventListener('helpful-insight-added', handleInsightAdded)
    }
    if (onSearchNoteUpdated) {
      window.addEventListener('search-note-updated', handleSearchNoteUpdated)
    }

    // Cleanup function
    return () => {
      if (onNoteUpdated) {
        window.removeEventListener('author-note-updated', handleNoteUpdated as EventListener)
      }
      if (onFavoriteAdded) {
        window.removeEventListener('favorite-author-added', handleFavoriteAdded)
      }
      if (onInsightAdded) {
        window.removeEventListener('helpful-insight-added', handleInsightAdded)
      }
      if (onSearchNoteUpdated) {
        window.removeEventListener('search-note-updated', handleSearchNoteUpdated)
      }
    }
  }, [callbacks])
}

/**
 * Custom hook for history CRUD operations
 * Consolidates all mutation actions with memoized handlers
 * Optimization: Centralized action logic, proper memoization
 * Expected: Cleaner code, reduced prop drilling
 */

'use client'

import { useCallback } from 'react'
import type { DeletedItem, HistoryData } from '../lib/types'
import { generateId } from '../lib/utils'
import {
  deleteRecentSearch,
  deleteSavedSearch,
  deleteAnalysis,
  updateSearchNote,
  updateAnalysisNote,
  updateAuthorNote,
  deleteAuthorNote,
  removeFavoriteAuthor,
  addToRecentlyDeleted,
  restoreDeletedItem,
  permanentlyDeleteItem,
  clearAllDeleted,
  clearAllByType,
} from '../lib/localStorage'

interface UseHistoryActionsParams {
  data: HistoryData
  reloadData: () => void
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void
}

export function useHistoryActions({ data, reloadData, showToast }: UseHistoryActionsParams) {
  /**
   * Delete actions
   */
  const handleDeleteRecentSearch = useCallback(
    (id: string) => {
      const { deleted } = deleteRecentSearch(id)
      if (deleted) {
        addToRecentlyDeleted({
          id: generateId(),
          type: 'search',
          name: deleted.query,
          data: deleted,
          deletedAt: new Date().toISOString(),
        })
      }
      reloadData()
    },
    [reloadData]
  )

  const handleDeleteSavedSearch = useCallback(
    (id: string) => {
      const { deleted } = deleteSavedSearch(id)
      if (deleted) {
        addToRecentlyDeleted({
          id: generateId(),
          type: 'search',
          name: deleted.query,
          data: { ...deleted, wasSaved: true },
          deletedAt: new Date().toISOString(),
        })
      }
      reloadData()
    },
    [reloadData]
  )

  const handleDeleteAnalysis = useCallback(
    (id: string) => {
      const { deleted } = deleteAnalysis(id)
      if (deleted) {
        addToRecentlyDeleted({
          id: generateId(),
          type: 'analysis',
          name: deleted.preview || deleted.text.slice(0, 50),
          data: deleted,
          deletedAt: new Date().toISOString(),
        })
      }
      reloadData()
    },
    [reloadData]
  )

  const handleRemoveFavoriteAuthor = useCallback(
    (name: string) => {
      const { deleted } = removeFavoriteAuthor(name)
      if (deleted) {
        addToRecentlyDeleted({
          id: deleted.id,
          type: 'favorite',
          name: deleted.name,
          data: deleted,
          deletedAt: new Date().toISOString(),
        })
        showToast?.(`Removed ${name} from favorites`, 'info')
      }
      reloadData()
    },
    [reloadData, showToast]
  )

  const handleDeleteAuthorNote = useCallback(
    (name: string) => {
      const { deleted } = deleteAuthorNote(name)
      if (deleted) {
        addToRecentlyDeleted({
          id: deleted.id,
          type: 'note',
          name: deleted.name,
          data: deleted,
          deletedAt: new Date().toISOString(),
        })
        showToast?.(`Removed note for ${name}`, 'info')
      }
      reloadData()
    },
    [reloadData, showToast]
  )

  /**
   * Note update actions
   */
  const handleUpdateSearchNote = useCallback(
    (id: string, note: string, isSaved: boolean) => {
      const { movedToSaved } = updateSearchNote(id, note, isSaved)
      if (movedToSaved) {
        showToast?.('Search saved with note', 'success')
      }
      reloadData()
    },
    [reloadData, showToast]
  )

  const handleUpdateAnalysisNote = useCallback(
    (id: string, note: string) => {
      updateAnalysisNote(id, note)
      reloadData()
    },
    [reloadData]
  )

  const handleUpdateAuthorNote = useCallback(
    (name: string, note: string) => {
      updateAuthorNote(name, note)
      reloadData()
    },
    [reloadData]
  )

  /**
   * Restore/Delete actions for recently deleted items
   */
  const handleRestoreItem = useCallback(
    (item: DeletedItem) => {
      restoreDeletedItem(item)
      const typeLabels: Record<string, string> = {
        favorite: 'favorite author',
        note: 'author note',
        search: (item.data as any)?.wasSaved ? 'saved search' : 'recent search',
        analysis: 'analysis',
      }
      showToast?.(`Restored ${typeLabels[item.type] || item.type}`, 'success')
      reloadData()
    },
    [reloadData, showToast]
  )

  const handlePermanentlyDelete = useCallback(
    (id: string) => {
      permanentlyDeleteItem(id)
      reloadData()
    },
    [reloadData]
  )

  const handleClearAllDeleted = useCallback(() => {
    clearAllDeleted()
    reloadData()
  }, [reloadData])

  /**
   * Clear all by type
   */
  const handleClearAllByType = useCallback(
    (type: 'recent' | 'saved' | 'analyses' | 'notes' | 'favorites' | 'insights') => {
      clearAllByType(type)
      reloadData()
    },
    [reloadData]
  )

  return {
    // Delete actions
    deleteRecentSearch: handleDeleteRecentSearch,
    deleteSavedSearch: handleDeleteSavedSearch,
    deleteAnalysis: handleDeleteAnalysis,
    removeFavoriteAuthor: handleRemoveFavoriteAuthor,
    deleteAuthorNote: handleDeleteAuthorNote,

    // Note actions
    updateSearchNote: handleUpdateSearchNote,
    updateAnalysisNote: handleUpdateAnalysisNote,
    updateAuthorNote: handleUpdateAuthorNote,

    // Restore/Delete actions
    restoreItem: handleRestoreItem,
    permanentlyDelete: handlePermanentlyDelete,
    clearAllDeleted: handleClearAllDeleted,

    // Clear all
    clearAllByType: handleClearAllByType,
  }
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toast'

const COMPARISON_STORAGE_KEY = 'authorComparison'
const MAX_COMPARISON_AUTHORS = 5

export interface ComparisonListItem {
  id: string
  timestamp: number
  name?: string
}

export interface UseAuthorComparisonReturn {
  comparisonAuthors: string[]
  isAuthorSaved: (authorId: string) => boolean
  toggleAuthorComparison: (authorId: string, authorName?: string) => void
  clearComparison: () => void
  comparisonCount: number
  maxAuthors: number
}

/**
 * Custom hook for managing author comparison list
 * Persists to localStorage and syncs across components via events
 */
export function useAuthorComparison(): UseAuthorComparisonReturn {
  const { showToast } = useToast()
  const [comparisonAuthors, setComparisonAuthors] = useState<string[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved: ComparisonListItem[] = JSON.parse(
        localStorage.getItem(COMPARISON_STORAGE_KEY) || '[]'
      )
      setComparisonAuthors(saved.map((a) => a.id))
    } catch (e) {
      console.error('Error loading comparison list:', e)
      setComparisonAuthors([])
    }
  }, [])

  // Listen for cross-component updates
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved: ComparisonListItem[] = JSON.parse(
          localStorage.getItem(COMPARISON_STORAGE_KEY) || '[]'
        )
        setComparisonAuthors(saved.map((a) => a.id))
      } catch (e) {
        console.error('Error syncing comparison list:', e)
      }
    }

    window.addEventListener('comparison-list-updated', handleUpdate)
    return () => window.removeEventListener('comparison-list-updated', handleUpdate)
  }, [])

  const isAuthorSaved = useCallback(
    (authorId: string) => comparisonAuthors.includes(authorId),
    [comparisonAuthors]
  )

  const toggleAuthorComparison = useCallback(
    (authorId: string, authorName?: string) => {
      try {
        const saved: ComparisonListItem[] = JSON.parse(
          localStorage.getItem(COMPARISON_STORAGE_KEY) || '[]'
        )
        const isAlreadySaved = saved.some((a) => a.id === authorId)

        if (isAlreadySaved) {
          // Remove from comparison
          const updated = saved.filter((a) => a.id !== authorId)
          localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(updated))
          setComparisonAuthors(updated.map((a) => a.id))
          showToast('Removed from comparison')
        } else {
          // Check max limit
          if (saved.length >= MAX_COMPARISON_AUTHORS) {
            showToast(`Maximum ${MAX_COMPARISON_AUTHORS} authors for comparison`, 'info')
            return
          }

          // Add to comparison
          const newItem: ComparisonListItem = {
            id: authorId,
            timestamp: Date.now(),
            name: authorName,
          }
          const updated = [...saved, newItem]
          localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(updated))
          setComparisonAuthors(updated.map((a) => a.id))
          showToast('Added to comparison')
        }

        // Dispatch event for cross-component sync
        window.dispatchEvent(new CustomEvent('comparison-list-updated'))
      } catch (e) {
        console.error('Error toggling comparison:', e)
        showToast('Failed to update comparison list', 'error')
      }
    },
    [showToast]
  )

  const clearComparison = useCallback(() => {
    try {
      localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify([]))
      setComparisonAuthors([])
      showToast('Comparison list cleared')
      window.dispatchEvent(new CustomEvent('comparison-list-updated'))
    } catch (e) {
      console.error('Error clearing comparison:', e)
      showToast('Failed to clear comparison list', 'error')
    }
  }, [showToast])

  return {
    comparisonAuthors,
    isAuthorSaved,
    toggleAuthorComparison,
    clearComparison,
    comparisonCount: comparisonAuthors.length,
    maxAuthors: MAX_COMPARISON_AUTHORS,
  }
}

export default useAuthorComparison

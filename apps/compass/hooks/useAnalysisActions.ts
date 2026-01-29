/**
 * Custom hook for Research Assistant action handlers
 * Consolidates all mutation logic (analyze, save, load, etc.)
 * Optimization: Memoized callbacks, centralized logic
 * Expected: Cleaner code, reduced re-renders
 */

'use client'

import { useCallback, useTransition } from 'react'
import type { ResearchState } from '@/components/research-assistant/lib/types'
import type { ResearchAssistantAnalyzeResponse } from '@/lib/research-assistant'
import { LOADING_PHASES, STORAGE_KEYS, CONFIG } from '@/components/research-assistant/lib/constants'

interface UseAnalysisActionsParams {
  state: ResearchState
  dispatch: React.Dispatch<any>
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void
}

export function useAnalysisActions({ state, dispatch, showToast }: UseAnalysisActionsParams) {
  const [isPending, startTransition] = useTransition()

  /**
   * Add analysis to recent searches and saved analyses
   */
  const addToRecentSearches = useCallback(
    (searchText: string, analysisResult: ResearchAssistantAnalyzeResponse): string => {
      const analysisId = `${Date.now()}`
      try {
        const recent = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES) || '[]')
        const preview =
          searchText.length > CONFIG.PREVIEW_LENGTH
            ? searchText.substring(0, CONFIG.PREVIEW_LENGTH) + '...'
            : searchText

        // Remove if already exists
        const filtered = recent.filter((s: any) => s.query !== preview)

        // Add to beginning with cached result
        filtered.unshift({
          id: analysisId,
          query: preview,
          type: 'research-assistant',
          fullText: searchText,
          cachedResult: analysisResult,
          timestamp: new Date().toISOString(),
        })

        // Keep only last 20
        const limited = filtered.slice(0, CONFIG.MAX_RECENT_SEARCHES)
        localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(limited))

        // Also save to savedResearchAssistantAnalyses
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_ANALYSES) || '[]')
        const savedFiltered = saved.filter((s: any) => s.text?.trim() !== searchText.trim())
        savedFiltered.unshift({
          id: analysisId,
          text: searchText.trim(),
          preview,
          cachedResult: analysisResult,
          timestamp: new Date().toISOString(),
        })
        localStorage.setItem(
          STORAGE_KEYS.SAVED_ANALYSES,
          JSON.stringify(savedFiltered.slice(0, CONFIG.MAX_SAVED_ANALYSES))
        )
        window.dispatchEvent(new CustomEvent('research-assistant-saved'))
      } catch (error) {
        console.error('Error adding to recent searches:', error)
      }
      return analysisId
    },
    []
  )

  /**
   * Update cached result for existing saved analyses
   */
  const updateSavedAnalysisCache = useCallback(
    (searchText: string, analysisResult: ResearchAssistantAnalyzeResponse) => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_ANALYSES) || '[]')
        const trimmedText = searchText.trim()

        let updated = false
        const updatedSaved = saved.map((s: any) => {
          if (s.text?.trim() === trimmedText) {
            updated = true
            return { ...s, cachedResult: analysisResult }
          }
          return s
        })

        if (updated) {
          localStorage.setItem(STORAGE_KEYS.SAVED_ANALYSES, JSON.stringify(updatedSaved))
          dispatch({ type: 'SET_SAVED_ANALYSES', payload: updatedSaved.slice(0, CONFIG.MAX_HISTORY_DROPDOWN) })
          window.dispatchEvent(new CustomEvent('research-assistant-saved'))
        }
      } catch (error) {
        console.error('Error updating saved analysis cache:', error)
      }
    },
    [dispatch]
  )

  /**
   * Find cached result for given text
   */
  const findCachedResult = useCallback(
    (searchText: string): ResearchAssistantAnalyzeResponse | null => {
      const trimmedText = searchText.trim()
      // Check saved analyses
      const cached = state.savedAnalyses.find(
        a => a.text?.trim() === trimmedText && a.cachedResult
      )
      if (cached?.cachedResult) return cached.cachedResult

      // Check recent searches
      try {
        const recent = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES) || '[]')
        const recentCached = recent.find(
          (s: any) => s.fullText?.trim() === trimmedText && s.cachedResult
        )
        if (recentCached?.cachedResult) return recentCached.cachedResult
      } catch {}
      return null
    },
    [state.savedAnalyses]
  )

  /**
   * Update URL with analysis ID for sharing
   */
  const updateUrlWithAnalysisId = useCallback(
    (analysisId: string) => {
      const url = new URL(window.location.href)
      url.searchParams.set('analysis', analysisId)
      window.history.replaceState({}, '', url.toString())
      dispatch({ type: 'SET_CURRENT_ANALYSIS_ID', payload: analysisId })
    },
    [dispatch]
  )

  /**
   * Main analyze function
   */
  const handleAnalyze = useCallback(
    async (textOverride?: string) => {
      const textToAnalyze = textOverride || state.text

      if (!textToAnalyze.trim()) {
        if (!textOverride) dispatch({ type: 'SET_ERROR', payload: 'Please enter some text to analyze' })
        return
      }

      // Check for cached result first
      const cached = findCachedResult(textToAnalyze)
      if (cached) {
        dispatch({ type: 'SET_RESULT', payload: cached })
        dispatch({ type: 'SET_SAVED_ONCE', payload: true })
        return
      }

      // Start loading with transitions
      startTransition(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'SET_LOADING_PHASE', payload: 0 })
        dispatch({ type: 'SET_ERROR', payload: null })
        dispatch({ type: 'SET_RESULT', payload: null })
      })

      // Start cycling through loading phases
      const phaseTimers: NodeJS.Timeout[] = []
      let currentPhase = 0

      const advancePhase = () => {
        if (currentPhase < LOADING_PHASES.length - 1) {
          currentPhase++
          requestAnimationFrame(() => {
            startTransition(() => {
              dispatch({ type: 'SET_LOADING_PHASE', payload: currentPhase })
            })
          })
          const nextDuration = LOADING_PHASES[currentPhase].duration
          if (nextDuration > 0) {
            phaseTimers.push(setTimeout(advancePhase, nextDuration))
          }
        }
      }

      if (LOADING_PHASES[0].duration > 0) {
        phaseTimers.push(setTimeout(advancePhase, LOADING_PHASES[0].duration))
      }

      try {
        const response = await fetch('/api/brain/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToAnalyze }),
        })

        const data = await response.json()

        if (!response.ok) {
          startTransition(() => {
            dispatch({ type: 'SET_ERROR', payload: data.error || data.message || 'Analysis failed' })
            phaseTimers.forEach(timer => clearTimeout(timer))
            dispatch({ type: 'SET_LOADING', payload: false })
            dispatch({ type: 'SET_LOADING_PHASE', payload: 0 })
          })
        } else {
          // Save and show results
          const analysisId = addToRecentSearches(textToAnalyze, data)
          updateSavedAnalysisCache(textToAnalyze, data)
          phaseTimers.forEach(timer => clearTimeout(timer))

          startTransition(() => {
            dispatch({ type: 'SET_LOADING', payload: false })
            dispatch({ type: 'SET_LOADING_PHASE', payload: 0 })
            dispatch({ type: 'SET_RESULT', payload: data })
            dispatch({ type: 'SET_SAVED_ONCE', payload: true })
          })
          updateUrlWithAnalysisId(analysisId)
        }
      } catch (err) {
        startTransition(() => {
          dispatch({
            type: 'SET_ERROR',
            payload: err instanceof Error ? err.message : 'Network error',
          })
          phaseTimers.forEach(timer => clearTimeout(timer))
          dispatch({ type: 'SET_LOADING', payload: false })
          dispatch({ type: 'SET_LOADING_PHASE', payload: 0 })
        })
      }
    },
    [state.text, dispatch, findCachedResult, addToRecentSearches, updateSavedAnalysisCache, updateUrlWithAnalysisId]
  )

  /**
   * Save current analysis
   */
  const handleSave = useCallback(async () => {
    if (!state.text.trim() || state.saving) return
    dispatch({ type: 'SET_SAVING', payload: true })

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_ANALYSES) || '[]')
      const preview =
        state.text.trim().substring(0, CONFIG.PREVIEW_LENGTH) +
        (state.text.trim().length > CONFIG.PREVIEW_LENGTH ? '...' : '')

      // Remove if already exists
      const filtered = saved.filter((s: any) => s.text !== state.text.trim())

      // Add to beginning
      filtered.unshift({
        id: `research-assistant-${Date.now()}`,
        text: state.text.trim(),
        preview,
        cachedResult: state.result,
        timestamp: new Date().toISOString(),
      })

      localStorage.setItem(STORAGE_KEYS.SAVED_ANALYSES, JSON.stringify(filtered))
      dispatch({ type: 'SET_SAVED_ONCE', payload: true })
      showToast?.('Draft saved successfully', 'success')
      window.dispatchEvent(new CustomEvent('research-assistant-saved'))
    } catch (error) {
      console.error('Error saving:', error)
      showToast?.('Failed to save draft', 'error')
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false })
    }
  }, [state.text, state.saving, state.result, dispatch, showToast])

  /**
   * Load a saved analysis
   */
  const loadSavedAnalysis = useCallback(
    (analysis: any) => {
      if (analysis.cachedResult && analysis.id) {
        dispatch({
          type: 'LOAD_ANALYSIS',
          payload: {
            text: analysis.text,
            result: analysis.cachedResult,
            currentAnalysisId: analysis.id,
          },
        })
        updateUrlWithAnalysisId(analysis.id)
      } else {
        // No cache - set text and trigger analysis
        dispatch({ type: 'SET_TEXT', payload: analysis.text })
        dispatch({ type: 'SET_ERROR', payload: null })
        dispatch({ type: 'SET_SAVED_ONCE', payload: true })
        dispatch({ type: 'RESET_ANALYSIS' })
        setTimeout(() => {
          handleAnalyze(analysis.text)
        }, 50)
      }
    },
    [dispatch, handleAnalyze, updateUrlWithAnalysisId]
  )

  /**
   * Start a new analysis
   */
  const startNewAnalysis = useCallback(() => {
    dispatch({ type: 'RESET_ANALYSIS' })
  }, [dispatch])

  return {
    handleAnalyze,
    handleSave,
    loadSavedAnalysis,
    startNewAnalysis,
    addToRecentSearches,
    updateSavedAnalysisCache,
    findCachedResult,
    updateUrlWithAnalysisId,
    isPending,
  }
}

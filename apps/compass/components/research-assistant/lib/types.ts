/**
 * Centralized type definitions for Research Assistant (Check Draft) feature
 * Single source of truth for all data structures
 */

import type { ResearchAssistantAnalyzeResponse } from '@/lib/research-assistant'

/**
 * Stance type for author alignment with draft
 */
export type Stance = 'agrees' | 'disagrees' | 'partial'

/**
 * Color configuration for stance display (CSS variables)
 */
export interface StanceColors {
  bg: string
  border: string
  text: string
}

/**
 * Extended color configuration with Tailwind classes and hex values
 * Used by components that need both Tailwind and inline styles
 */
export interface StanceColorsExtended extends StanceColors {
  bgHex: string
  borderHex: string
  textHex: string
}

/**
 * Loading phase configuration
 */
export interface LoadingPhase {
  message: string
  duration: number // 0 means no auto-advance (final phase)
}

/**
 * Saved analysis item
 */
export interface SavedAnalysis {
  id: string
  text: string
  preview: string
  cachedResult?: ResearchAssistantAnalyzeResponse
  timestamp: string
}

/**
 * Author for linkification
 */
export interface AuthorForLinkification {
  id: string
  name: string
}

/**
 * Main state for Research Assistant
 */
export interface ResearchState {
  // Input and results
  text: string
  result: ResearchAssistantAnalyzeResponse | null

  // Loading states
  loading: boolean
  loadingPhase: number
  error: string | null

  // Save states
  saving: boolean
  savedOnce: boolean

  // UI interaction states
  likedSummary: boolean
  likedCamps: Set<number>

  // Data states
  allAuthors: AuthorForLinkification[]
  savedAnalyses: SavedAnalysis[]

  // Special states
  pendingFromHome: boolean | null // null = checking, true/false = resolved
  urlCopied: boolean
  copying: boolean
  exporting: boolean
  currentAnalysisId: string | null
  analysisNotFound: boolean
}

/**
 * Actions for useReducer
 */
export type ResearchAction =
  | { type: 'SET_TEXT'; payload: string }
  | { type: 'SET_RESULT'; payload: ResearchAssistantAnalyzeResponse | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOADING_PHASE'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_SAVED_ONCE'; payload: boolean }
  | { type: 'TOGGLE_SUMMARY_LIKE' }
  | { type: 'TOGGLE_CAMP_LIKE'; payload: number }
  | { type: 'SET_ALL_AUTHORS'; payload: AuthorForLinkification[] }
  | { type: 'SET_SAVED_ANALYSES'; payload: SavedAnalysis[] }
  | { type: 'SET_PENDING_FROM_HOME'; payload: boolean | null }
  | { type: 'SET_URL_COPIED'; payload: boolean }
  | { type: 'SET_COPYING'; payload: boolean }
  | { type: 'SET_EXPORTING'; payload: boolean }
  | { type: 'SET_CURRENT_ANALYSIS_ID'; payload: string | null }
  | { type: 'SET_ANALYSIS_NOT_FOUND'; payload: boolean }
  | { type: 'RESET_ANALYSIS' }
  | {
      type: 'LOAD_ANALYSIS'
      payload: {
        text: string
        result: ResearchAssistantAnalyzeResponse | null
        currentAnalysisId: string | null
      }
    }

/**
 * Props for ResearchAssistant component
 */
export interface ResearchAssistantProps {
  showTitle?: boolean // When true, shows page title (for standalone page)
  initialAnalysisId?: string | null // Analysis ID from URL for shareable links
}

/**
 * Event detail for loading text
 */
export interface LoadTextEventDetail {
  text: string
  cachedResult?: ResearchAssistantAnalyzeResponse
  autoAnalyze?: boolean
  id?: string
}

/**
 * Pending analysis from home page
 */
export interface PendingAnalysis {
  text: string
  autoAnalyze: boolean
  timestamp: number
}

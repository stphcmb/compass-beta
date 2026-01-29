/**
 * Constants for Research Assistant (Check Draft) feature
 * Centralized configuration values
 */

import type { LoadingPhase } from './types'

/**
 * Loading phase messages for progressive feedback
 * Provides visual feedback during analysis
 */
export const LOADING_PHASES: LoadingPhase[] = [
  { message: 'Analyzing your text...', duration: 2000 },
  { message: 'Finding relevant thought leaders...', duration: 4000 },
  { message: 'Comparing perspectives to your draft...', duration: 5000 },
  { message: 'Generating editorial suggestions...', duration: 0 }, // Final phase, no auto-advance
]

/**
 * localStorage keys
 */
export const STORAGE_KEYS = {
  SAVED_ANALYSES: 'savedResearchAssistantAnalyses',
  RECENT_SEARCHES: 'recentSearches',
  PENDING_ANALYSIS: 'pendingAnalysis',
} as const

/**
 * Configuration constants
 */
export const CONFIG = {
  MAX_SAVED_ANALYSES: 20,
  MAX_RECENT_SEARCHES: 20,
  MAX_HISTORY_DROPDOWN: 10,
  PENDING_ANALYSIS_TIMEOUT: 10000, // 10 seconds
  PREVIEW_LENGTH: 60,
} as const

/**
 * Event names for custom events
 */
export const EVENTS = {
  RESEARCH_ASSISTANT_SAVED: 'research-assistant-saved',
  LOAD_RESEARCH_ASSISTANT_TEXT: 'load-research-assistant-text',
} as const

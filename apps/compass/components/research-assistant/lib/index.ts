/**
 * Research Assistant Library
 * Re-exports all utilities, types, and constants for the Research Assistant feature
 */

// Types
export type {
  Stance,
  StanceColors,
  StanceColorsExtended,
  LoadingPhase,
  SavedAnalysis,
  AuthorForLinkification,
  ResearchState,
  ResearchAction,
  ResearchAssistantProps,
  LoadTextEventDetail,
  PendingAnalysis,
} from './types'

// Constants
export {
  LOADING_PHASES,
  STORAGE_KEYS,
  CONFIG,
  EVENTS,
} from './constants'

// Utility functions
export {
  getStanceColor,
  getStanceColorExtended,
  getStanceIcon,
  getStanceLabel,
  buildAuthorMap,
  formatAnalysisAsText,
  escapeRegex,
} from './utils'

// PDF Export
export { generatePrintHTML } from './pdfExport'

/**
 * Research Assistant Module
 *
 * A focused service that reads user text, looks up relevant camps
 * and authors in the canon, and returns editorial suggestions.
 *
 * Main export: analyzeText() - Entry point for text analysis
 *
 * Note: This module re-exports from lib/ai-editor for backward compatibility.
 * The internal implementation uses the original ai-editor naming.
 */

// Main analyzer function (primary export)
export { analyzeText, validateText } from '../ai-editor/analyzer'

// Types (re-exported with Research Assistant naming)
export type {
  AIEditorAnalyzeRequest as ResearchAssistantAnalyzeRequest,
  AIEditorAnalyzeResponse as ResearchAssistantAnalyzeResponse,
  AIEditorMatchedCamp as ResearchAssistantMatchedCamp,
  AIEditorAuthor as ResearchAssistantAuthor,
  AIEditorEditorialSuggestions as ResearchAssistantEditorialSuggestions,
} from '../ai-editor/types'

// Also export original names for backward compatibility
export type {
  AIEditorAnalyzeRequest,
  AIEditorAnalyzeResponse,
  AIEditorMatchedCamp,
  AIEditorAuthor,
  AIEditorEditorialSuggestions,
} from '../ai-editor/types'

// Editor Memory (preference learning)
export {
  getEditorMemories,
  getEditorMemoriesByType,
  createEditorMemory,
  createEditorMemories,
  updateEditorMemory,
  deleteEditorMemory,
  deleteAllEditorMemories,
  buildEditorContext,
  getEditorContextForUser,
  hasEditorMemories,
  getEditorMemoryStats,
} from '../ai-editor/editor-memory'

export type {
  EditorMemory,
  EditorMemoryType,
  CreateEditorMemoryInput,
  UpdateEditorMemoryInput,
} from '../ai-editor/editor-memory'

// Internal utilities (exported for testing, but not part of public API)
export { extractKeywords } from '../ai-editor/query'

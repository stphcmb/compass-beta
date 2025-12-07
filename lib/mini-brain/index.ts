/**
 * Mini Brain Module
 *
 * A focused service that reads user text, looks up relevant camps
 * and authors in the canon, and returns editorial suggestions.
 *
 * Main export: analyzeText() - Entry point for text analysis
 *
 * See README.md for usage examples and documentation.
 */

// Main analyzer function (primary export)
export { analyzeText, validateText } from './analyzer'

// Types (for consumers of the module)
export type {
  MiniBrainAnalyzeRequest,
  MiniBrainAnalyzeResponse,
  MiniBrainMatchedCamp,
  MiniBrainAuthor,
  MiniBrainEditorialSuggestions,
} from './types'

// Internal utilities (exported for testing, but not part of public API)
export { extractKeywords } from './query'

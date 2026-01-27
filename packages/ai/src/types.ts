/**
 * AI Module - Type Definitions
 *
 * Shared types for AI/LLM functionality across apps.
 */

// ============================================================================
// Gemini API Types
// ============================================================================

/**
 * A single text part in Gemini content
 */
export interface GeminiContentPart {
  text: string;
}

/**
 * Content structure for Gemini API
 */
export interface GeminiContent {
  parts: GeminiContentPart[];
}

/**
 * Request body for Gemini API
 */
export interface GeminiRequest {
  contents: GeminiContent[];
}

/**
 * Single candidate in Gemini response
 */
export interface GeminiCandidate {
  content: {
    parts: Array<{
      text: string;
    }>;
  };
}

/**
 * Response from Gemini API
 */
export interface GeminiResponse {
  candidates: GeminiCandidate[];
}

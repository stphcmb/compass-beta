/**
 * Camp Detection
 * Pure functions for detecting camps in draft content
 */

import type { DetectedCamp } from './types';
import { CAMP_KEYWORDS, getCampName } from '../constants/camp-keywords';
import { THRESHOLDS } from '../constants/thresholds';

/**
 * Extract excerpt around a keyword match
 */
function extractExcerpt(text: string, keyword: string): string {
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(keyword.toLowerCase());

  if (index === -1) return '';

  const words = text.split(/\s+/);
  const textBeforeMatch = text.slice(0, index);
  const wordsBefore = textBeforeMatch.split(/\s+/).length - 1;

  const start = Math.max(0, wordsBefore - THRESHOLDS.EXCERPT_CONTEXT_WORDS);
  const end = Math.min(words.length, wordsBefore + THRESHOLDS.EXCERPT_CONTEXT_WORDS + 1);

  let excerpt = words.slice(start, end).join(' ');

  if (start > 0) excerpt = '...' + excerpt;
  if (end < words.length) excerpt = excerpt + '...';

  if (excerpt.length > THRESHOLDS.MAX_EXCERPT_LENGTH) {
    excerpt = excerpt.slice(0, THRESHOLDS.MAX_EXCERPT_LENGTH) + '...';
  }

  return excerpt;
}

/**
 * Check if a keyword appears in the text
 * Handles multi-word keywords and word boundaries
 */
function keywordMatches(text: string, keyword: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();

  // For multi-word keywords, just check if the phrase exists
  if (keyword.includes(' ') || keyword.includes('-')) {
    return lowerText.includes(lowerKeyword);
  }

  // For single words, use word boundary check
  const regex = new RegExp(`\\b${escapeRegex(lowerKeyword)}\\b`, 'i');
  return regex.test(text);
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Detect camps in draft content
 *
 * @param draft - The draft text to analyze
 * @returns Array of detected camps sorted by confidence (descending)
 */
export function detectCamps(draft: string): DetectedCamp[] {
  if (!draft || draft.trim().length === 0) {
    return [];
  }

  const results: DetectedCamp[] = [];

  for (const [campId, campInfo] of Object.entries(CAMP_KEYWORDS)) {
    const matchedKeywords: string[] = [];
    const excerpts: string[] = [];

    for (const keyword of campInfo.keywords) {
      if (keywordMatches(draft, keyword)) {
        matchedKeywords.push(keyword);

        // Extract excerpt for first few matches
        if (excerpts.length < 3) {
          const excerpt = extractExcerpt(draft, keyword);
          if (excerpt && !excerpts.includes(excerpt)) {
            excerpts.push(excerpt);
          }
        }
      }
    }

    if (matchedKeywords.length >= THRESHOLDS.MIN_KEYWORD_MATCHES) {
      // Calculate confidence based on number of matches
      const confidence = Math.min(
        matchedKeywords.length / THRESHOLDS.HIGH_CONFIDENCE_MATCHES,
        1
      );

      if (confidence >= THRESHOLDS.MIN_CONFIDENCE_THRESHOLD) {
        results.push({
          camp_id: campId,
          camp_name: getCampName(campId),
          confidence,
          matched_keywords: matchedKeywords,
          excerpts
        });
      }
    }
  }

  // Sort by confidence descending
  return results.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Get the dominant camp (highest confidence)
 */
export function getDominantCamp(detected: DetectedCamp[]): DetectedCamp | null {
  if (detected.length === 0) return null;
  return detected[0];
}

/**
 * Check if a specific camp is detected
 */
export function isCampDetected(detected: DetectedCamp[], campId: string): boolean {
  return detected.some(d => d.camp_id === campId);
}

/**
 * Get detection confidence for a specific camp
 */
export function getCampConfidence(detected: DetectedCamp[], campId: string): number {
  const camp = detected.find(d => d.camp_id === campId);
  return camp?.confidence ?? 0;
}

/**
 * User-facing terminology constants
 *
 * These labels are displayed in the UI while the underlying
 * database/API names (camps, domains) remain unchanged.
 */

export const TERMINOLOGY = {
  // Core concepts
  camp: 'Perspective',
  camps: 'Perspectives',
  domain: 'Topic',
  domains: 'Topics',

  // Features
  search: 'Explore',
  searchFull: 'Explore Perspectives',
  aiEditor: 'AI Editor',
  authors: 'Authors',

  // UI labels
  positioningSnapshot: 'Match Summary',
  whiteSpace: 'Unexplored Angles',
  thoughtLeaders: 'Authors',

  // Descriptions
  campDescription: 'A shared viewpoint or school of thought',
  domainDescription: 'A topic area within AI discourse',
} as const

/**
 * Feature hint messages shown on first visit
 */
export const FEATURE_HINTS = {
  'ai-editor': {
    message: 'Paste 1-3 paragraphs to see how your writing connects to existing perspectives.',
    storageKey: 'hasSeenHint_ai-editor',
  },
  'explore': {
    message: 'Perspectives are grouped by position. See who agrees—and who challenges each stance.',
    storageKey: 'hasSeenHint_explore',
  },
  'authors': {
    message: '200+ curated authors. Click any name to see their positions and sources.',
    storageKey: 'hasSeenHint_authors',
  },
} as const

export type FeatureKey = keyof typeof FEATURE_HINTS

/**
 * Helper to get plural/singular form
 */
export function getCampLabel(count: number): string {
  return count === 1 ? TERMINOLOGY.camp : TERMINOLOGY.camps
}

export function getDomainLabel(count: number): string {
  return count === 1 ? TERMINOLOGY.domain : TERMINOLOGY.domains
}

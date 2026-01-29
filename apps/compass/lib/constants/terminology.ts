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

  // Features - Navigation labels (WS1 updates)
  search: 'Browse Topics',
  searchFull: 'Browse Topics',
  researchAssistant: 'Check Draft',
  researchAssistantFull: 'Check Draft',
  authors: 'Authors',
  history: 'My Library',
  historyFull: 'My Library',

  // UI labels
  positioningSnapshot: 'Match Summary',
  whiteSpace: 'Unexplored Angles',
  thoughtLeaders: 'Authors',

  // Descriptions
  campDescription: 'A shared viewpoint or school of thought',
  domainDescription: 'A topic area within AI discourse',
} as const

/**
 * Navigation item configuration
 * Defines the structure for main navigation with visual hierarchy
 */
export interface NavItem {
  href: string
  label: string
  icon: string // Icon name from lucide-react
  description: string
  tooltip: string
  badge?: string
  featured?: boolean
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: 'Home',
    description: 'Dashboard and quick actions',
    tooltip: 'Go to homepage',
    featured: false,
  },
  {
    href: '/check-draft',
    label: 'Check Draft',
    icon: 'Search',
    description: 'Validate your writing',
    tooltip: 'Find supporting experts and perspectives for your draft',
    badge: 'Start here',
    featured: true,
  },
  {
    href: '/browse',
    label: 'Browse Topics',
    icon: 'Compass',
    description: 'Explore perspectives',
    tooltip: 'Browse perspectives and positions on AI discourse',
    featured: false,
  },
  {
    href: '/my-library',
    label: 'My Library',
    icon: 'BookMarked',
    description: 'Saved analyses',
    tooltip: 'View your saved analyses and favorite authors',
    featured: false,
  },
  {
    href: '/authors',
    label: 'Authors',
    icon: 'Users',
    description: 'Browse experts',
    tooltip: 'Browse thought leaders and their viewpoints',
    featured: false,
  },
]

/**
 * Admin navigation item (shown only to admins)
 */
export const ADMIN_NAV_ITEM: NavItem = {
  href: '/admin',
  label: 'Admin',
  icon: 'Shield',
  description: 'Admin dashboard',
  tooltip: 'Admin dashboard',
  featured: false,
}

/**
 * Feature hint messages shown on first visit
 */
export const FEATURE_HINTS = {
  'research-assistant': {
    message: 'Paste 1-3 paragraphs to find supporting experts and perspectives.',
    storageKey: 'hasSeenHint_research-assistant',
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

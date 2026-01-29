/**
 * Shared utility functions for My Library (History) feature
 * Pure functions with no dependencies
 */

import type { TimeFilter, FilterableItem } from './types'

/**
 * Format timestamp as relative time (e.g., "5m ago", "2h ago", "3d ago")
 * @param ts - ISO timestamp string
 * @returns Human-readable relative time string
 */
export function timeAgo(ts?: string): string {
  if (!ts) return ''

  const diffMs = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diffMs / 60000)

  if (mins < 60) return `${mins}m ago`

  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`

  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`

  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

/**
 * Format timestamp as absolute date (e.g., "Jan 15, 2026, 2:30 PM")
 * @param ts - ISO timestamp string
 * @returns Formatted date string
 */
export function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Filter items by time period
 * @param items - Array of items with timestamp properties
 * @param timeFilter - Time period filter
 * @returns Filtered array of items
 */
export function filterByTime<T extends FilterableItem>(
  items: T[],
  timeFilter: TimeFilter
): T[] {
  if (timeFilter === 'all') return items

  const now = Date.now()
  const cutoffs = {
    today: now - 24 * 60 * 60 * 1000,
    week: now - 7 * 24 * 60 * 60 * 1000,
    month: now - 30 * 24 * 60 * 60 * 1000,
  }

  const cutoff = cutoffs[timeFilter]

  return items.filter(item => {
    const timestamp = item.timestamp || item.addedAt || item.updatedAt
    if (!timestamp) return false
    return new Date(timestamp).getTime() > cutoff
  })
}

/**
 * Safe JSON parse with fallback value
 * @param value - JSON string to parse
 * @param fallback - Fallback value if parse fails
 * @returns Parsed value or fallback
 */
export function safeJSONParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

/**
 * Generate a unique ID (simple implementation for client-side)
 * @returns UUID-like string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Check if a timestamp is within the last N days
 * @param timestamp - ISO timestamp string
 * @param days - Number of days to check
 * @returns True if within the period
 */
export function isWithinDays(timestamp: string, days: number): boolean {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return new Date(timestamp).getTime() > cutoff
}

/**
 * Sort items by timestamp (newest first)
 * @param items - Array of items with timestamp properties
 * @returns Sorted array (does not mutate original)
 */
export function sortByTimestamp<T extends FilterableItem>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.timestamp || a.addedAt || a.updatedAt || 0).getTime()
    const bTime = new Date(b.timestamp || b.addedAt || b.updatedAt || 0).getTime()
    return bTime - aTime // Newest first
  })
}

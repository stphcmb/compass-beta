/**
 * Utility functions for Research Assistant (Check Draft) feature
 * Pure functions for stance display, text formatting, and author linkification
 */

import type { ReactNode } from 'react'
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react'
import type { Stance, StanceColors, StanceColorsExtended, AuthorForLinkification } from './types'
import type { ResearchAssistantAnalyzeResponse } from '@/lib/research-assistant'

/**
 * Get color configuration for a stance
 * @param stance - The author's stance (agrees, disagrees, partial)
 * @returns Color configuration with bg, border, and text colors
 */
export function getStanceColor(stance: Stance): StanceColors {
  switch (stance) {
    case 'agrees':
      return {
        bg: 'rgba(16, 185, 129, 0.08)',
        border: 'var(--color-success)',
        text: 'var(--color-success)',
      }
    case 'disagrees':
      return {
        bg: 'rgba(239, 68, 68, 0.08)',
        border: 'var(--color-error)',
        text: 'var(--color-error)',
      }
    case 'partial':
      return {
        bg: 'rgba(245, 158, 11, 0.08)',
        border: 'var(--color-warning)',
        text: 'var(--color-warning)',
      }
  }
}

/**
 * Get extended color configuration for a stance with Tailwind classes and hex values
 * @param stance - The author's stance (agrees, disagrees, partial)
 * @returns Extended color configuration with Tailwind classes and hex values
 */
export function getStanceColorExtended(stance: Stance): StanceColorsExtended {
  switch (stance) {
    case 'agrees':
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-500',
        text: 'text-emerald-600',
        bgHex: 'rgba(16, 185, 129, 0.08)',
        borderHex: '#10b981',
        textHex: '#059669',
      }
    case 'disagrees':
      return {
        bg: 'bg-red-50',
        border: 'border-red-500',
        text: 'text-red-600',
        bgHex: 'rgba(239, 68, 68, 0.08)',
        borderHex: '#ef4444',
        textHex: '#dc2626',
      }
    case 'partial':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-500',
        text: 'text-amber-600',
        bgHex: 'rgba(245, 158, 11, 0.08)',
        borderHex: '#f59e0b',
        textHex: '#d97706',
      }
  }
}

/**
 * Get icon component for a stance
 * @param stance - The author's stance (agrees, disagrees, partial)
 * @returns React element for the appropriate icon
 */
export function getStanceIcon(stance: Stance): ReactNode {
  const iconClass = 'w-4 h-4'
  switch (stance) {
    case 'agrees':
      return <ThumbsUp className={iconClass} />
    case 'disagrees':
      return <ThumbsDown className={iconClass} />
    case 'partial':
      return <Minus className={iconClass} />
  }
}

/**
 * Get human-readable label for a stance
 * @param stance - The author's stance (agrees, disagrees, partial)
 * @returns Human-readable label string
 */
export function getStanceLabel(stance: Stance): string {
  switch (stance) {
    case 'agrees':
      return 'Agrees with you'
    case 'disagrees':
      return 'Challenges your view'
    case 'partial':
      return 'Partially aligns'
  }
}

/**
 * Build a map of author names to their IDs for linkification
 * @param allAuthors - Array of all authors from database
 * @param matchedCamps - Optional matched camps from analysis result
 * @returns Map of author names to their IDs
 */
export function buildAuthorMap(
  allAuthors: AuthorForLinkification[],
  matchedCamps?: ResearchAssistantAnalyzeResponse['matchedCamps']
): Map<string, string> {
  const map = new Map<string, string>()

  // Add all authors from the database for comprehensive linkification
  allAuthors.forEach((author) => {
    if (author.id && author.name) {
      map.set(author.name, author.id)
    }
  })

  // Also add authors from matched camps (in case they have different data)
  if (matchedCamps) {
    matchedCamps.forEach((camp) => {
      camp.topAuthors.forEach((author) => {
        if (author.id && author.name) {
          map.set(author.name, author.id)
        }
      })
    })
  }

  return map
}

/**
 * Format analysis result as plain text for copying/sharing
 * @param text - Original analyzed text
 * @param result - Analysis result from AI
 * @returns Formatted plain text string
 */
export function formatAnalysisAsText(
  text: string,
  result: ResearchAssistantAnalyzeResponse
): string {
  const lines: string[] = []

  // Header
  lines.push('---')
  lines.push('AI EDITOR ANALYSIS')
  lines.push('---')
  lines.push('')

  // Original text snippet
  const textPreview = text.length > 200 ? text.substring(0, 200) + '...' : text
  lines.push('ANALYZED TEXT:')
  lines.push(textPreview)
  lines.push('')

  // Summary
  lines.push('---')
  lines.push('SUMMARY')
  lines.push('---')
  lines.push(result.summary)
  lines.push('')

  // Editorial Suggestions
  lines.push('---')
  lines.push('EDITORIAL SUGGESTIONS')
  lines.push('---')
  lines.push('')

  lines.push("PERSPECTIVES YOU'RE USING:")
  result.editorialSuggestions.presentPerspectives.forEach((p) => {
    lines.push(`  - ${p}`)
  })
  lines.push('')

  lines.push("PERSPECTIVES YOU'RE MISSING:")
  result.editorialSuggestions.missingPerspectives.forEach((p) => {
    lines.push(`  - ${p}`)
  })
  lines.push('')

  // Thought Leaders
  if (result.matchedCamps.length > 0) {
    lines.push('---')
    lines.push(
      `RELEVANT THOUGHT LEADERS (${result.matchedCamps.length} perspectives)`
    )
    lines.push('---')
    lines.push('')

    result.matchedCamps.forEach((camp) => {
      lines.push(`* ${camp.campLabel}`)
      lines.push(`  ${camp.explanation}`)
      lines.push('')

      camp.topAuthors.forEach((author) => {
        const stanceLabel =
          author.stance === 'agrees'
            ? 'Agrees'
            : author.stance === 'disagrees'
              ? 'Disagrees'
              : 'Partial'
        lines.push(`  - ${author.name} [${stanceLabel}]`)
        lines.push(`    Position: ${author.position}`)
        if (author.draftConnection) {
          lines.push(`    Connection to draft: ${author.draftConnection}`)
        }
        if (author.quote) {
          lines.push(`    Quote: "${author.quote}"`)
          if (author.sourceUrl) {
            lines.push(`    Source: ${author.sourceUrl}`)
          }
        }
        lines.push('')
      })
    })
  }

  lines.push('---')
  lines.push('Generated by Compass Research Assistant')
  lines.push(`Date: ${new Date().toLocaleDateString()}`)
  lines.push('---')

  return lines.join('\n')
}

/**
 * Escape special regex characters in a string
 * @param str - String to escape
 * @returns Escaped string safe for use in RegExp
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

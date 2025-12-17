/**
 * Text highlighting utilities for search results
 */

import React from 'react'

/**
 * Extracts search terms from expanded queries
 */
export function extractSearchTerms(expandedQueries: any[], originalQuery: string): string[] {
  const terms = new Set<string>()

  // Add original query terms
  originalQuery.toLowerCase().split(/\s+/).forEach(term => {
    if (term.length > 2) terms.add(term)
  })

  // Add expanded query terms
  expandedQueries?.forEach(eq => {
    const query = eq.query || eq
    if (typeof query === 'string') {
      query.toLowerCase().split(/\s+/).forEach(term => {
        if (term.length > 2) terms.add(term)
      })
    }
  })

  return Array.from(terms)
}

/**
 * Finds which search terms match in a given text
 */
export function findMatchingTerms(text: string, searchTerms: string[]): string[] {
  if (!text) return []
  const textLower = text.toLowerCase()
  return searchTerms.filter(term => textLower.includes(term))
}

/**
 * Highlights matching search terms in text with HTML marks
 */
export function highlightText(text: string, searchTerms: string[]): React.ReactNode {
  if (!text || searchTerms.length === 0) return text

  // Sort terms by length (longest first) to avoid partial matches
  const sortedTerms = [...searchTerms].sort((a, b) => b.length - a.length)

  // Create regex pattern that matches any of the search terms (case-insensitive)
  const pattern = sortedTerms
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special chars
    .join('|')

  if (!pattern) return text

  const regex = new RegExp(`(${pattern})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) => {
    const isMatch = sortedTerms.some(term =>
      part.toLowerCase() === term.toLowerCase()
    )

    if (isMatch) {
      return (
        <mark
          key={i}
          className="bg-yellow-200 text-gray-900 font-medium rounded px-0.5"
        >
          {part}
        </mark>
      )
    }
    return part
  })
}

/**
 * Component for rendering highlighted text
 */
interface HighlightedTextProps {
  text: string
  searchTerms: string[]
  className?: string
}

export function HighlightedText({ text, searchTerms, className = '' }: HighlightedTextProps) {
  const highlighted = highlightText(text, searchTerms)
  return <span className={className}>{highlighted}</span>
}

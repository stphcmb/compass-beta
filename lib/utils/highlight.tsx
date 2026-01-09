/**
 * Text highlighting utilities for search results
 */

import React from 'react'

/**
 * Common stopwords that should not be highlighted in search results
 * These are words that appear frequently but carry little semantic meaning
 */
const STOPWORDS = new Set([
  // Common English stopwords
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one',
  'our', 'out', 'has', 'have', 'had', 'his', 'how', 'its', 'may', 'new', 'now', 'old',
  'see', 'way', 'who', 'did', 'get', 'got', 'let', 'put', 'say', 'she', 'too', 'use',
  'with', 'will', 'that', 'this', 'from', 'they', 'been', 'have', 'were', 'what', 'when',
  'which', 'their', 'there', 'these', 'those', 'would', 'could', 'should', 'about',
  // Common AI-related context words that aren't meaningful to highlight
  'through', 'impact', 'effects', 'concerns', 'analysis', 'assessment', 'development',
  'technology', 'capabilities', 'approaches', 'requirements', 'principles'
])

/**
 * Check if a term is meaningful enough to highlight
 * Filters out stopwords and very short terms
 */
function isMeaningfulTerm(term: string): boolean {
  const termLower = term.toLowerCase()
  // Must be longer than 2 characters
  if (term.length <= 2) return false
  // Must not be a stopword
  if (STOPWORDS.has(termLower)) return false
  // Must contain at least one letter (avoid pure numbers/symbols)
  if (!/[a-z]/i.test(term)) return false
  return true
}

/**
 * Extracts search terms from expanded queries
 */
export function extractSearchTerms(expandedQueries: any[], originalQuery: string): string[] {
  const terms = new Set<string>()

  // Add original query terms (these are always meaningful - user typed them)
  originalQuery.toLowerCase().split(/\s+/).forEach(term => {
    if (term.length > 2) terms.add(term)
  })

  // Add expanded query terms (filter more strictly)
  expandedQueries?.forEach(eq => {
    const query = eq.query || eq
    if (typeof query === 'string') {
      query.toLowerCase().split(/\s+/).forEach(term => {
        // Only add expanded terms if they're meaningful
        if (isMeaningfulTerm(term)) {
          terms.add(term)
        }
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

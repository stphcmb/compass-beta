'use client'

import { ExternalLink, Quote } from 'lucide-react'
import { highlightText, findMatchingTerms, extractSearchTerms } from '@/lib/utils/highlight'
import { useAuthorPanel } from '@/contexts/AuthorPanelContext'

interface AuthorCardProps {
  author: any
  query: string
  expandedQueries?: any[]
  showMismatchNote?: boolean
}

function getInitials(name?: string) {
  if (!name) return 'A'
  const parts = name.split(' ').filter(Boolean)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function getSourceTitle(url: string, sources: any[]): string {
  // Try to find matching source by URL
  if (sources && sources.length > 0) {
    const match = sources.find((s: any) => s.url === url)
    if (match?.title) {
      return match.title
    }
  }

  // Extract readable title from URL
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname
    // Get the last meaningful path segment
    const segments = path.split('/').filter(Boolean)
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1]
      // Clean up the segment (remove file extensions, replace dashes/underscores)
      const cleaned = lastSegment
        .replace(/\.(html?|php|aspx?)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())

      if (cleaned.length > 5 && cleaned.length < 80) {
        return cleaned
      }
    }
    // Fallback to domain name
    return urlObj.hostname.replace(/^www\./, '')
  } catch {
    return 'Source'
  }
}

export default function AuthorCard({ author, query, expandedQueries = [], showMismatchNote = false }: AuthorCardProps) {
  const { openPanel } = useAuthorPanel()
  const name = author?.name || 'Author Name'
  const affiliation = author?.affiliation || ''
  const hasQuote = author?.key_quote && author.key_quote !== 'Quote coming soon'
  const quoteSourceUrl = author?.quote_source_url || author?.sources?.[0]?.url

  // Extract search terms for highlighting
  const searchTerms = query ? extractSearchTerms(expandedQueries, query) : []

  // Check if quote matches search terms
  const quoteMatchedTerms = hasQuote ? findMatchingTerms(author.key_quote, searchTerms) : []
  const quoteRelevant = quoteMatchedTerms.length > 0

  const handleAuthorClick = () => {
    if (author?.id) {
      openPanel(author.id)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2.5 hover:shadow-sm hover:border-gray-300 transition-all">
      {/* Author Header */}
      <div className="flex items-start gap-2 mb-1.5">
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-[11px] font-semibold text-indigo-700">
            {getInitials(name)}
          </span>
        </div>

        {/* Name & Affiliation */}
        <div className="flex-1 min-w-0">
          <button
            onClick={handleAuthorClick}
            className="font-semibold text-[15px] text-gray-900 hover:text-indigo-600 transition-colors text-left"
          >
            {searchTerms.length > 0 ? highlightText(name, searchTerms) : name}
          </button>
          {affiliation && (
            <p className="text-[13px] text-gray-500 leading-snug">
              {searchTerms.length > 0 ? highlightText(affiliation, searchTerms) : affiliation}
            </p>
          )}
        </div>
      </div>

      {/* Position Summary */}
      {author.positionSummary && (
        <p className="text-[13px] text-gray-600 leading-snug mb-1.5 ml-10">
          {searchTerms.length > 0
            ? highlightText(author.positionSummary, searchTerms)
            : author.positionSummary
          }
        </p>
      )}

      {/* Quote with integrated source link */}
      {hasQuote && (
        quoteSourceUrl ? (
          <a
            href={quoteSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`block ml-10 px-2.5 py-1.5 rounded-md cursor-pointer transition-all group ${
              quoteRelevant
                ? 'bg-blue-50 border border-blue-100 hover:bg-blue-100/70 hover:border-blue-200'
                : 'bg-gray-50 border border-gray-100 hover:bg-gray-100/70 hover:border-gray-200'
            }`}
          >
            <div className="flex items-start gap-2">
              <Quote className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-colors ${
                quoteRelevant ? 'text-blue-400 group-hover:text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-700 italic leading-relaxed group-hover:text-gray-800 transition-colors">
                  "{searchTerms.length > 0 ? highlightText(author.key_quote, searchTerms) : author.key_quote}"
                </p>
                {/* Source Link */}
                <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-gray-400 group-hover:text-indigo-600 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate max-w-[220px] group-hover:underline">
                    {getSourceTitle(quoteSourceUrl, author?.sources || [])}
                  </span>
                </span>
              </div>
            </div>
          </a>
        ) : (
          <div className={`ml-10 px-2.5 py-1.5 rounded-md ${
            quoteRelevant ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'
          }`}>
            <div className="flex items-start gap-2">
              <Quote className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                quoteRelevant ? 'text-blue-400' : 'text-gray-400'
              }`} />
              <p className="text-[13px] text-gray-700 italic leading-relaxed">
                "{searchTerms.length > 0 ? highlightText(author.key_quote, searchTerms) : author.key_quote}"
              </p>
            </div>
          </div>
        )
      )}

      {/* Note for non-matching quotes - shown at bottom when applicable */}
      {showMismatchNote && hasQuote && !quoteRelevant && query && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2.5 py-1.5 mt-1.5 ml-10">
          <span className="font-medium">Note:</span> This quote may not directly mention your search terms.
          This author appears because of their expertise and position on this topic.
        </div>
      )}
    </div>
  )
}

// Helper function to check if author's quote matches search terms (for sorting)
export function authorQuoteMatchesSearch(author: any, query: string, expandedQueries: any[] = []): boolean {
  if (!author?.key_quote || author.key_quote === 'Quote coming soon') return false
  const searchTerms = query ? extractSearchTerms(expandedQueries, query) : []
  const matchedTerms = findMatchingTerms(author.key_quote, searchTerms)
  return matchedTerms.length > 0
}

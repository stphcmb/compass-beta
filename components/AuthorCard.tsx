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
  const matchType = author?._matchType || 'credibility' // exact, expanded, credibility

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
    <div className="bg-white border border-gray-200 rounded-xl p-3.5 hover:shadow-md hover:border-gray-300 transition-all">
      {/* Author Header */}
      <div className="flex items-start gap-3 mb-2">
        {/* Avatar - Larger */}
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-[13px] font-semibold text-indigo-700">
            {getInitials(name)}
          </span>
        </div>

        {/* Name & Affiliation */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAuthorClick}
              className="font-semibold text-[16px] text-gray-900 hover:text-indigo-600 transition-colors text-left leading-tight"
            >
              {searchTerms.length > 0 ? highlightText(name, searchTerms) : name}
            </button>
            {query && matchType === 'exact' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700 border border-green-200">
                Direct Match
              </span>
            )}
            {query && matchType === 'expanded' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                Related
              </span>
            )}
          </div>
          {affiliation && (
            <p className="text-[14px] text-gray-500 leading-snug mt-0.5">
              {searchTerms.length > 0 ? highlightText(affiliation, searchTerms) : affiliation}
            </p>
          )}
        </div>
      </div>

      {/* Position Summary */}
      {author.positionSummary && (
        <p className="text-[14px] text-gray-600 leading-snug mb-2">
          {searchTerms.length > 0
            ? highlightText(author.positionSummary, searchTerms)
            : author.positionSummary
          }
        </p>
      )}

      {/* Quote with integrated source link - More prominent */}
      {hasQuote && (
        quoteSourceUrl ? (
          <a
            href={quoteSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`block px-3.5 py-2.5 rounded-lg cursor-pointer transition-all group ${
              quoteRelevant
                ? 'bg-blue-50 border border-blue-200 hover:bg-blue-100/80 hover:border-blue-300'
                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100/80 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Quote className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-colors ${
                quoteRelevant ? 'text-blue-400 group-hover:text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-gray-700 italic leading-relaxed group-hover:text-gray-800 transition-colors">
                  "{searchTerms.length > 0 ? highlightText(author.key_quote, searchTerms) : author.key_quote}"
                </p>
                {/* Source Link */}
                <span className="inline-flex items-center gap-1.5 mt-1.5 text-[12px] text-gray-400 group-hover:text-indigo-600 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="group-hover:underline">
                    {getSourceTitle(quoteSourceUrl, author?.sources || [])}
                  </span>
                </span>
              </div>
            </div>
          </a>
        ) : (
          <div className={`px-3.5 py-2.5 rounded-lg ${
            quoteRelevant ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-start gap-2.5">
              <Quote className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                quoteRelevant ? 'text-blue-400' : 'text-gray-400'
              }`} />
              <p className="text-[14px] text-gray-700 italic leading-relaxed">
                "{searchTerms.length > 0 ? highlightText(author.key_quote, searchTerms) : author.key_quote}"
              </p>
            </div>
          </div>
        )
      )}

      {/* Note for non-matching quotes - shown at bottom when applicable */}
      {showMismatchNote && hasQuote && !quoteRelevant && query && (
        <div className="text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
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

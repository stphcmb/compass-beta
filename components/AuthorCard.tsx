'use client'

import Link from 'next/link'
import { User, ExternalLink, FileText, Tag } from 'lucide-react'
import { highlightText, findMatchingTerms, extractSearchTerms } from '@/lib/utils/highlight'

interface AuthorCardProps {
  author: any
  query: string
  expandedQueries?: any[]
}

function getInitials(name?: string) {
  if (!name) return 'A'
  const parts = name.split(' ').filter(Boolean)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export default function AuthorCard({ author, query, expandedQueries = [] }: AuthorCardProps) {
  const name = author?.name || 'Author Name'
  const affiliation = author?.affiliation || 'Affiliation'
  const credibilityTier = author?.credibilityTier || ''

  // Get the actual source URL for the quote (where the quote appears)
  const quoteSourceUrl = author?.quote_source_url || author?.sources?.[0]?.url
  const hasQuote = author?.key_quote && author.key_quote !== 'Quote coming soon'

  // Extract search terms for highlighting
  const searchTerms = query ? extractSearchTerms(expandedQueries, query) : []

  // Find which terms matched in different fields
  const authorText = `${name} ${affiliation} ${author?.positionSummary || ''}`
  const quoteText = author?.key_quote || ''
  const matchedTerms = findMatchingTerms(authorText, searchTerms)
  const quoteMatchedTerms = findMatchingTerms(quoteText, searchTerms)
  const quoteRelevant = quoteMatchedTerms.length > 0

  // Get agreement badge based on relevance
  const getAgreementBadge = (relevance?: string) => {
    const rel = relevance?.toLowerCase() || ''
    if (rel.includes('strong')) {
      return { label: 'AGREES', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    } else if (rel.includes('partial')) {
      return { label: 'PARTIAL', className: 'bg-amber-50 text-amber-700 border-amber-200' }
    } else if (rel.includes('challenge')) {
      return { label: 'DISAGREES', className: 'bg-red-50 text-red-700 border-red-200' }
    } else if (rel.includes('emerging')) {
      return { label: 'NEW', className: 'bg-violet-50 text-violet-700 border-violet-200' }
    }
    return null
  }

  const agreementBadge = getAgreementBadge(author?.relevance)

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          {/* Author Initials Icon */}
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-semibold text-blue-700">
              {getInitials(name)}
            </span>
          </div>
          <Link href={`/author/${author?.id || '1'}`} className="font-semibold text-[14px] text-gray-900 hover:text-blue-600 transition-colors">
            {searchTerms.length > 0 ? highlightText(name, searchTerms) : name}
          </Link>
        </div>
        {agreementBadge && (
          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${agreementBadge.className} uppercase tracking-wide`}>
            {agreementBadge.label}
          </span>
        )}
      </div>

      {/* Affiliation & Tier */}
      <div className="text-[12px] text-gray-500 mb-3">
        {searchTerms.length > 0 ? highlightText(affiliation, searchTerms) : affiliation}
        {credibilityTier && ` • ${credibilityTier}`}
      </div>

      {/* Matched On Badge - Show which keywords matched */}
      {matchedTerms.length > 0 && query && (
        <div className="mb-3 flex items-start gap-1.5">
          <Tag className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-[11px] text-gray-600">
            <span className="font-medium text-gray-700">Matched on:</span>{' '}
            {matchedTerms.slice(0, 4).map((term, i) => (
              <span key={i}>
                <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                  {term}
                </span>
                {i < Math.min(matchedTerms.length, 4) - 1 && ', '}
              </span>
            ))}
            {matchedTerms.length > 4 && (
              <span className="text-gray-500"> +{matchedTerms.length - 4} more</span>
            )}
          </div>
        </div>
      )}

      {/* Why This Matters - Position Summary - Always show - More prominent */}
      <div className="mb-3 bg-blue-50 border border-blue-100 rounded-md p-3">
        <div className="text-[11px] font-bold text-blue-900 mb-1.5">
          {query ? 'Why this author appears in your search' : 'Why this matters'}
        </div>
        <p className="text-[13px] text-gray-800 leading-relaxed">
          {searchTerms.length > 0
            ? highlightText(author.positionSummary || 'Position summary coming soon', searchTerms)
            : (author.positionSummary || 'Position summary coming soon')
          }
        </p>
      </div>

      {/* Quote */}
      {hasQuote && (
        <>
          {/* Quote relevance notice - only show when searching and quote doesn't match */}
          {query && !quoteRelevant && (
            <div className="mb-2 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
              <span className="font-semibold">Note:</span> This quote may not directly relate to your search terms.
              This author appears because of their expertise and position on this topic.
            </div>
          )}
          <div className={`mb-3 p-2.5 rounded border-l-3 ${quoteRelevant ? 'border-blue-400 bg-blue-50' : 'border-gray-400 bg-gray-100'} transition-all ${quoteSourceUrl ? 'hover:bg-gray-200 cursor-pointer' : ''}`}>
            {quoteSourceUrl ? (
              <a
                href={quoteSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <p className="text-[12px] italic text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                  "{searchTerms.length > 0 ? highlightText(author.key_quote, searchTerms) : author.key_quote}"
                </p>
              </a>
            ) : (
              <p className="text-[12px] italic text-gray-700 leading-relaxed">
                "{searchTerms.length > 0 ? highlightText(author.key_quote, searchTerms) : author.key_quote}"
              </p>
            )}
          </div>
        </>
      )}

      {/* Source Link */}
      {quoteSourceUrl && (
        <a
          href={quoteSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          {author.sources?.[0]?.title || 'View Source'}
        </a>
      )}

      {/* View All Link */}
      {!quoteSourceUrl && (
        <Link
          href={`/author/${author?.id || '1'}`}
          className="text-[11px] text-gray-500 hover:text-gray-900 transition-colors"
        >
          View profile →
        </Link>
      )}
    </div>
  )
}


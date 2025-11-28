'use client'

import Link from 'next/link'
import { User, ExternalLink, FileText } from 'lucide-react'

interface AuthorCardProps {
  author: any
  query: string
}

function getInitials(name?: string) {
  if (!name) return 'A'
  const parts = name.split(' ').filter(Boolean)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export default function AuthorCard({ author, query }: AuthorCardProps) {
  const name = author?.name || 'Author Name'
  const affiliation = author?.affiliation || 'Affiliation'
  const credibilityTier = author?.credibilityTier || ''

  // Get the actual source URL for the quote (where the quote appears)
  const quoteSourceUrl = author?.quote_source_url || author?.sources?.[0]?.url
  const hasQuote = author?.key_quote && author.key_quote !== 'Quote coming soon'

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
            {name}
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
        {affiliation}{credibilityTier && ` • ${credibilityTier}`}
      </div>

      {/* Why This Matters - Position Summary - Always show */}
      <div className="mb-3">
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Why this matters
        </div>
        <p className="text-[13px] text-gray-700 leading-relaxed">
          {author.positionSummary || 'Position summary coming soon'}
        </p>
      </div>

      {/* Quote */}
      {hasQuote && (
        <div className={`mb-3 p-2.5 rounded border-l-3 border-gray-400 transition-all ${quoteSourceUrl ? 'bg-gray-100 hover:bg-gray-200 cursor-pointer' : 'bg-gray-100'}`}>
          {quoteSourceUrl ? (
            <a
              href={quoteSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <p className="text-[12px] italic text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                "{author.key_quote}"
              </p>
            </a>
          ) : (
            <p className="text-[12px] italic text-gray-700 leading-relaxed">
              "{author.key_quote}"
            </p>
          )}
        </div>
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


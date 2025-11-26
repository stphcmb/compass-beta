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

  // Get the actual source URL for the quote (where the quote appears)
  const quoteSourceUrl = author?.quote_source_url || author?.sources?.[0]?.url
  const hasQuote = author?.key_quote && author.key_quote !== 'Quote coming soon'

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
            {getInitials(name)}
          </div>
          <div>
            <Link href={`/author/${author?.id || '1'}`} className="font-bold text-lg hover:text-blue-600 transition-colors">
              {name}
            </Link>
            <div className="text-sm text-gray-600">
              {affiliation}
            </div>
          </div>
        </div>
      </div>

      {/* Quote */}
      {hasQuote && (
        <div className="mb-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500 group">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-semibold text-gray-500">KEY QUOTE</div>
            {quoteSourceUrl && (
              <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
            )}
          </div>
          {quoteSourceUrl ? (
            <a
              href={quoteSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <p className="text-sm italic text-gray-700 group-hover:text-blue-700 transition-colors cursor-pointer">
                "{author.key_quote}"
              </p>
            </a>
          ) : (
            <p className="text-sm italic text-gray-700">
              "{author.key_quote}"
            </p>
          )}
        </div>
      )}

      {/* Citations */}
      {author?.sources && author.sources.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-500 mb-2">
            {author.sources.length} SOURCE{author.sources.length > 1 ? 'S' : ''}
          </div>
          <div className="space-y-2">
            {author.sources.slice(0, 5).map((source: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="flex-1 truncate">{source.title} ({source.type}, {source.year})</span>
                {source.url && (
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-800" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Link
        href={`/author/${author?.id || '1'}`}
        className="text-sm text-blue-600 hover:underline"
      >
        View all sources by {name} →
      </Link>
    </div>
  )
}


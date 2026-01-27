'use client'

import { useState } from 'react'
import { Search, Loader2, ChevronDown, ChevronUp, Plus, User, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface MatchedCamp {
  camp: string
  confidence: number
  authors: Array<{
    name: string
    slug?: string
    quote?: string
    position?: string
  }>
}

interface FindExpertsResult {
  matched_camps: MatchedCamp[]
  summary?: string
}

interface Citation {
  id: string
  authorName: string
  authorSlug?: string
  quote: string
  position?: string
  addedAt: Date
}

interface FindExpertsPanelProps {
  content: string
  citations: Citation[]
  onAddCitation: (citation: Omit<Citation, 'id' | 'addedAt'>) => void
}

export default function FindExpertsPanel({
  content,
  citations,
  onAddCitation,
}: FindExpertsPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState<FindExpertsResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFindExperts = async () => {
    if (!content.trim() || content.length < 50) {
      setError('Please add more content (at least 50 characters) to find relevant experts.')
      return
    }

    setSearching(true)
    setError(null)

    try {
      // Use the existing brain/analyze endpoint which powers Research Assistant
      const res = await fetch('/api/brain/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content.slice(0, 4000), // Limit to API max
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to analyze content')
      }

      const data = await res.json()

      // Transform the response to our format
      const matchedCamps: MatchedCamp[] = (data.matchedCamps || []).map((camp: any) => ({
        camp: camp.camp || camp.label,
        confidence: camp.confidence || 0.8,
        authors: (camp.authors || []).map((author: any) => ({
          name: author.name,
          slug: author.slug,
          quote: author.quote || author.representative_quote,
          position: author.position,
        })),
      }))

      setResult({
        matched_camps: matchedCamps,
        summary: data.editorialSuggestions?.summary,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find experts')
    } finally {
      setSearching(false)
    }
  }

  const isAlreadyCited = (authorName: string) => {
    return citations.some(c => c.authorName.toLowerCase() === authorName.toLowerCase())
  }

  return (
    <div className="border-t border-gray-100 pt-4 mt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-900">Find Experts</span>
        </div>
        <div className="flex items-center gap-2">
          {result && (
            <span className="text-sm text-blue-600">
              {result.matched_camps.reduce((acc, c) => acc + c.authors.length, 0)} found
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-3">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg p-2 mb-3">
              {error}
            </div>
          )}

          {!result ? (
            <div className="text-center py-3">
              <p className="text-xs text-gray-500 mb-3">
                Find thought leaders who support your key points
              </p>
              <button
                onClick={handleFindExperts}
                disabled={searching}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 flex items-center gap-2 mx-auto"
              >
                {searching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Find Supporting Experts
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Summary */}
              {result.summary && (
                <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
                  {result.summary}
                </p>
              )}

              {/* Matched camps with authors */}
              {result.matched_camps.map((camp, campIdx) => (
                <div key={campIdx} className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-800 mb-2">{camp.camp}</p>
                  <div className="space-y-2">
                    {camp.authors.slice(0, 3).map((author, authorIdx) => (
                      <div
                        key={authorIdx}
                        className="bg-white rounded-lg p-2 border border-blue-100"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-gray-400" />
                            {author.slug ? (
                              <Link
                                href={`/authors/${author.slug}`}
                                className="text-sm font-medium text-blue-600 hover:underline"
                                target="_blank"
                              >
                                {author.name}
                              </Link>
                            ) : (
                              <span className="text-sm font-medium text-gray-900">
                                {author.name}
                              </span>
                            )}
                          </div>
                          {isAlreadyCited(author.name) ? (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                              Cited
                            </span>
                          ) : (
                            <button
                              onClick={() => onAddCitation({
                                authorName: author.name,
                                authorSlug: author.slug,
                                quote: author.quote || '',
                                position: author.position,
                              })}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              Cite
                            </button>
                          )}
                        </div>
                        {author.quote && (
                          <p className="text-xs text-gray-600 italic line-clamp-2">
                            "{author.quote}"
                          </p>
                        )}
                      </div>
                    ))}
                    {camp.authors.length > 3 && (
                      <p className="text-xs text-blue-600">
                        +{camp.authors.length - 3} more experts
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Refresh button */}
              <button
                onClick={handleFindExperts}
                disabled={searching}
                className="w-full py-2 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                {searching ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Search className="w-3 h-3" />
                )}
                Search Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

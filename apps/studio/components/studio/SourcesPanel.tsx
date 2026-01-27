'use client'

import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, Trash2, User, Copy, Check } from 'lucide-react'
import Link from 'next/link'

export interface Citation {
  id: string
  authorName: string
  authorSlug?: string
  quote: string
  position?: string
  addedAt: Date
}

interface SourcesPanelProps {
  citations: Citation[]
  onRemoveCitation: (id: string) => void
}

export default function SourcesPanel({
  citations,
  onRemoveCitation,
}: SourcesPanelProps) {
  const [expanded, setExpanded] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyQuote = async (citation: Citation) => {
    const text = `"${citation.quote}" - ${citation.authorName}`
    await navigator.clipboard.writeText(text)
    setCopiedId(citation.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (citations.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span className="font-medium text-gray-900">Sources</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {citations.length}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          {citations.map((citation) => (
            <div
              key={citation.id}
              className="bg-gray-50 rounded-lg p-3 group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  {citation.authorSlug ? (
                    <Link
                      href={`/authors/${citation.authorSlug}`}
                      className="text-sm font-medium text-gray-900 hover:text-emerald-600 transition-colors"
                      target="_blank"
                    >
                      {citation.authorName}
                      <ExternalLink className="w-3 h-3 inline ml-1 text-gray-400" />
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">
                      {citation.authorName}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopyQuote(citation)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    title="Copy quote"
                  >
                    {copiedId === citation.id ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => onRemoveCitation(citation.id)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                    title="Remove citation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {citation.position && (
                <p className="text-xs text-emerald-600 mb-1">{citation.position}</p>
              )}
              {citation.quote && (
                <p className="text-sm text-gray-600 italic">"{citation.quote}"</p>
              )}
            </div>
          ))}

          <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            Click the copy icon to copy a quote with attribution
          </p>
        </div>
      )}
    </div>
  )
}

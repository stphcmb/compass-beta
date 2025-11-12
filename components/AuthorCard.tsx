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
  const type = author?.type || 'Academic/Practitioner'
  const affiliation = author?.affiliation || 'Affiliation'
  const tier = author?.credibility_tier || 'Credibility Tier'

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xs font-semibold">
            {getInitials(name)}
          </div>
          <div>
            <Link href={`/author/${author?.id || '1'}`} className="font-bold text-lg hover:text-blue-600">
              {name}
            </Link>
            <div className="text-sm text-gray-600">
              {affiliation} • {tier}
            </div>
          </div>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
          {type}
        </span>
      </div>

      {/* Why it matters */}
      <div className="mb-3">
        <div className="text-xs font-semibold text-gray-500 mb-1">WHY IT MATTERS</div>
        <p className="text-sm text-gray-700">
          {author?.why_it_matters || 'Directly supports your reskilling argument with specific program models and implementation frameworks'}
        </p>
      </div>

      {/* Quote */}
      <div className="mb-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
        <div className="text-xs font-semibold text-gray-500 mb-1">KEY QUOTE</div>
        <p className="text-sm italic text-gray-700">
          {author?.key_quote || 'Quote coming soon'}
        </p>
      </div>

      {/* Citations */}
      <div className="mb-3">
        <div className="text-xs font-semibold text-gray-500 mb-2">
          {(author?.citations?.length || 3)} CITATIONS
        </div>
        <div className="space-y-2">
          {(author?.citations || [
            { title: 'AI Transformation Playbook', type: 'Blog', year: '2024', url: '#' },
            { title: 'Stanford Lecture Series', type: 'Video', year: '2024', url: '#' },
            { title: 'Workforce Development in AI Era', type: 'Paper', year: '2024', url: '#' },
          ]).slice(0, 5).map((citation: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="flex-1 truncate">{citation.title} ({citation.type}, {citation.year})</span>
              <a href={citation.url || '#'} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 text-blue-600 cursor-pointer" />
              </a>
            </div>
          ))}
        </div>
      </div>

      <Link
        href={`/author/${author?.id || '1'}`}
        className="text-sm text-blue-600 hover:underline"
      >
        View all sources by {name} →
      </Link>
    </div>
  )
}


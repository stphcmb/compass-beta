'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, FileText } from 'lucide-react'
import { getThoughtLeaderById } from '@/lib/api/thought-leaders'

interface SourcesListProps {
  authorId: string
}

interface Source {
  title: string
  type: string
  year: string
  url?: string
}

export default function SourcesList({ authorId }: SourcesListProps) {
  const [sources, setSources] = useState<Source[]>([])
  const [authorName, setAuthorName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuthorSources = async () => {
      setLoading(true)
      try {
        const author = await getThoughtLeaderById(authorId)
        if (author) {
          setAuthorName(author.name)
          setSources(author.sources || [])
        }
      } catch (error) {
        console.error('Error fetching sources:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthorSources()
  }, [authorId])

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500">Loading sources...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        All Sources {sources.length > 0 && `(${sources.length})`}
      </h2>

      {sources.length > 0 ? (
        <div className="space-y-3">
          {sources.map((source, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      {source.title}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {source.type}
                      </span>
                      <span>{source.year}</span>
                    </div>
                  </div>
                </div>

                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-sm rounded-md hover:bg-indigo-100 font-medium ml-4"
                  >
                    Open
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <div className="font-medium mb-1">No sources available</div>
          <div className="text-sm">Sources will appear here once added</div>
        </div>
      )}
    </div>
  )
}


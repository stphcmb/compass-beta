'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getThoughtLeaders, getDomains } from '@/lib/api/thought-leaders'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

// Domain color mapping
const DOMAIN_COLORS: Record<string, string> = {
  'Technology': 'bg-blue-100 text-blue-700',
  'Society': 'bg-purple-100 text-purple-700',
  'Business': 'bg-green-100 text-green-700',
  'Policy & Regulation': 'bg-red-100 text-red-700',
  'Workers': 'bg-orange-100 text-orange-700',
}

export default function AuthorIndexPage() {
  const [authors, setAuthors] = useState<any[]>([])
  const [domains, setDomains] = useState<string[]>([])
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [authorsData, domainsData] = await Promise.all([
          getThoughtLeaders(),
          getDomains()
        ])
        setAuthors(authorsData)
        setDomains(domainsData)
        if (authorsData.length > 0) {
          setSelectedAuthor(authorsData[0])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-gray-600">Loading authors...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 flex">
        {/* Left Panel - Author List */}
        <div className="w-[400px] bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-gray-200">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-4xl font-bold text-indigo-500">{authors.length}</div>
              <div className="text-sm text-gray-500 mt-1">Authors in Database</div>
            </div>
          </div>

          {/* Author List */}
          <div className="flex-1 overflow-y-auto p-4">
            {authors.map((author) => (
              <div
                key={author.id}
                onClick={() => setSelectedAuthor(author)}
                className={`p-4 rounded-lg border mb-2 cursor-pointer transition-all ${
                  selectedAuthor?.id === author.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <div className="font-semibold text-gray-900 text-sm">{author.name}</div>
                <div className="text-xs text-gray-500 mb-2">
                  {author.header_affiliation || author.primary_affiliation || 'Independent'}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {author.credibility_tier && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {author.credibility_tier}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Author Profile */}
        <div className="flex-1 bg-gray-50 overflow-y-auto p-8">
          {selectedAuthor ? (
            <div>
              {/* Profile Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 mb-5">
                <h1 className="text-xl font-bold text-gray-900 mb-1">{selectedAuthor.name}</h1>
                <div className="text-sm text-gray-500 mb-3">
                  {selectedAuthor.header_affiliation || selectedAuthor.primary_affiliation || 'Independent'}
                </div>
                <div className="flex gap-2 flex-wrap mb-4">
                  {selectedAuthor.credibility_tier && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                      {selectedAuthor.credibility_tier}
                    </span>
                  )}
                  {selectedAuthor.author_type && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                      {selectedAuthor.author_type}
                    </span>
                  )}
                </div>

                {selectedAuthor.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                    {selectedAuthor.notes}
                  </div>
                )}

                <Link
                  href={`/author/${selectedAuthor.id}`}
                  className="inline-block mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View full profile →
                </Link>
              </div>

              {/* Sources Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Sources ({selectedAuthor.sources?.length || 0})
                </h2>

                {selectedAuthor.sources && selectedAuthor.sources.length > 0 ? (
                  <div className="space-y-3">
                    {selectedAuthor.sources.map((source: any, index: number) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm mb-1">
                              {source.title}
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span className="px-2 py-0.5 bg-gray-100 rounded">{source.type}</span>
                              <span>{source.year}</span>
                            </div>
                          </div>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-3 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs rounded-md hover:bg-indigo-100 font-medium"
                            >
                              Open ↗
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-sm">No sources added yet</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <div className="text-5xl mb-4">👤</div>
              <div className="text-lg font-medium">Select an author</div>
              <div className="text-sm">Choose from the list on the left</div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

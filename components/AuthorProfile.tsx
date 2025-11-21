'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getThoughtLeaderById } from '@/lib/api/thought-leaders'

interface AuthorProfileProps {
  authorId: string
}

export default function AuthorProfile({ authorId }: AuthorProfileProps) {
  const router = useRouter()
  const [author, setAuthor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true)
      try {
        const data = await getThoughtLeaderById(authorId)
        if (data) setAuthor(data)
      } catch (error) {
        console.error('Error fetching author:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthor()
  }, [authorId])

  if (loading || !author) {
    return (
      <div className="bg-white rounded-lg border p-6 mb-6 text-center text-gray-600">
        Loading author profile...
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{author.name}</h1>
        <div className="text-gray-500 mb-3">
          {author.header_affiliation || author.primary_affiliation || 'Independent'}
        </div>
        <div className="flex gap-2 flex-wrap">
          {author.credibility_tier && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {author.credibility_tier}
            </span>
          )}
          {author.author_type && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              {author.author_type}
            </span>
          )}
        </div>
      </div>

      {author.notes && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</h2>
          <p className="text-gray-700">{author.notes}</p>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <Link
          href="/authors"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          View all authors →
        </Link>
      </div>
    </div>
  )
}


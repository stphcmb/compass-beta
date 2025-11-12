'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
    <div className="bg-white rounded-lg border p-6 mb-6">
      <Button
        onClick={() => router.back()}
        variant="outline"
        className="mb-4"
      >
        ← Back
      </Button>
      
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
        <div className="text-gray-600 mb-2">{author.affiliation}</div>
        <div className="flex gap-2">
          <span className="px-2 py-1 rounded text-xs bg-gray-200">
            {author.credibility_tier}
          </span>
          <span className="px-2 py-1 rounded text-xs bg-gray-200">
            {author.author_type}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Position Summary</h2>
        <p className="text-gray-700">{author.position_summary || 'No position summary available.'}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Camp Affiliations</h2>
        <ul className="space-y-2">
          {/* Will be populated with actual camp data */}
        </ul>
      </div>
    </div>
  )
}


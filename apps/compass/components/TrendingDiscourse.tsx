'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getTaxonomyCamps } from '@/lib/api/thought-leaders'

export default function TrendingDiscourse() {
  const router = useRouter()
  const [trending, setTrending] = useState<Array<{ topic: string; badge?: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        const camps = await getTaxonomyCamps()
        // Convert camps to trending topics, taking first 8
        const topics = camps.slice(0, 8).map((camp, idx) => ({
          topic: camp.name,
          badge: idx < 2 ? (idx === 0 ? 'New' : 'High Volume') : undefined
        }))
        setTrending(topics)
      } catch (error) {
        console.error('Error fetching trending topics:', error)
        // Fallback to static data
        setTrending([
          { topic: 'The rise of multimodal agents', badge: 'New' },
          { topic: 'Regulatory compliance for proprietary models', badge: 'High Volume' },
          { topic: 'AI safety and frontier model evaluations' },
          { topic: 'Enterprise retrieval strategies for LLMs' },
          { topic: 'Agent orchestration patterns' },
          { topic: 'Human-in-the-loop guardrails' },
          { topic: 'Open-source vs proprietary model economics' },
          { topic: 'Synthetic data pipelines' },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingTopics()
  }, [])

  const handleClick = (topic: string) => {
    const params = new URLSearchParams()
    params.set('q', topic)
    router.push(`/results?${params.toString()}`)
  }

  if (loading) {
    return (
      <section className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Trending Discourse</h3>
        <div className="rounded-lg border bg-white p-4 text-center text-gray-600">
          Loading trending topics...
        </div>
      </section>
    )
  }

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Trending Discourse</h3>
      <div className="rounded-lg border bg-white p-4 max-h-56 overflow-y-auto">
        <ul className="space-y-2">
          {trending.map((t, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleClick(t.topic)}
                className="w-full text-left text-sm text-gray-800 hover:text-blue-700 flex items-center justify-between"
              >
                <span>{t.topic}</span>
                {t.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border">{t.badge}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

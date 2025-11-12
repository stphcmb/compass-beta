'use client'

import { useState, useEffect } from 'react'
import { ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SourcesListProps {
  authorId: string
}

export default function SourcesList({ authorId }: SourcesListProps) {
  const [sources, setSources] = useState<any[]>([])

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase not configured')
      return
    }

    const fetchSources = async () => {
      try {
        if (!supabase) return
        const twelveMonthsAgo = new Date()
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

        const { data } = await supabase
          .from('sources')
          .select('*')
          .eq('author_id', authorId)
          .gte('published_date', twelveMonthsAgo.toISOString())
          .order('published_date', { ascending: false })
        
        if (data) setSources(data)
      } catch (error) {
        console.error('Error fetching sources:', error)
      }
    }

    fetchSources()
  }, [authorId])

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">All Sources</h2>
      <div className="space-y-4">
        {sources.map((source) => (
          <div key={source.id} className="border-b pb-4 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold hover:underline flex items-center gap-2"
              >
                {source.title}
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <span className="px-2 py-1 rounded text-xs bg-gray-200">
                {source.type}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              {new Date(source.published_date).toLocaleDateString()}
            </div>
            <p className="text-sm text-gray-700 mb-2">
              {source.summary?.substring(0, 200)}...
            </p>
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
              {source.domain}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}


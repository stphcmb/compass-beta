'use client'

import { useMemo } from 'react'
import { EnhancedAuthorCard, EnhancedAuthorCardAuthor } from './EnhancedAuthorCard'

interface CampAuthor extends EnhancedAuthorCardAuthor {
  id?: string
}

interface Camp {
  campLabel: string
  topAuthors: CampAuthor[]
}

interface AuthorWithCamps extends EnhancedAuthorCardAuthor {
  camps: string[]
}

interface AllAuthorsSectionProps {
  matchedCamps: Camp[]
  comparisonAuthors: string[]
  onSaveForComparison: (authorId: string) => void
}

export function AllAuthorsSection({
  matchedCamps,
  comparisonAuthors,
  onSaveForComparison,
}: AllAuthorsSectionProps) {
  // Aggregate unique authors across all camps
  const uniqueAuthors = useMemo(() => {
    const authorMap = new Map<string, AuthorWithCamps>()

    matchedCamps.forEach((camp) => {
      camp.topAuthors.forEach((author) => {
        // Use author ID if available, otherwise use name as key
        const key = author.id || author.name

        if (!authorMap.has(key)) {
          authorMap.set(key, {
            ...author,
            camps: [camp.campLabel],
          })
        } else {
          const existing = authorMap.get(key)!
          // Only add camp if not already included
          if (!existing.camps.includes(camp.campLabel)) {
            existing.camps.push(camp.campLabel)
          }
        }
      })
    })

    // Sort by: agrees first, then by number of camps (more camps = more relevant)
    return Array.from(authorMap.values()).sort((a, b) => {
      // First sort by stance priority
      const stancePriority = { agrees: 0, partial: 1, disagrees: 2 }
      const stanceDiff = stancePriority[a.stance] - stancePriority[b.stance]
      if (stanceDiff !== 0) return stanceDiff

      // Then by number of camps (more camps = higher relevance)
      return b.camps.length - a.camps.length
    })
  }, [matchedCamps])

  if (uniqueAuthors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No authors found in this analysis.</p>
      </div>
    )
  }

  // Group authors by stance for better organization
  const agreeingAuthors = uniqueAuthors.filter((a) => a.stance === 'agrees')
  const challengingAuthors = uniqueAuthors.filter((a) => a.stance === 'disagrees')
  const partialAuthors = uniqueAuthors.filter((a) => a.stance === 'partial')

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="flex flex-wrap gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-600">
            {agreeingAuthors.length} supporting your view
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-600">
            {challengingAuthors.length} challenging your view
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-gray-600">
            {partialAuthors.length} partially aligned
          </span>
        </div>
      </div>

      {/* Authors Grid */}
      <div className="grid gap-4">
        {uniqueAuthors.map((author, idx) => (
          <EnhancedAuthorCard
            key={author.id || `author-${idx}`}
            author={author}
            showActions={true}
            isSaved={author.id ? comparisonAuthors.includes(author.id) : false}
            onSaveForComparison={onSaveForComparison}
            campLabels={author.camps}
          />
        ))}
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center pt-4 border-t border-gray-100">
        Authors are sorted by relevance: those who support your view appear first,
        followed by those with partial alignment, then those who challenge your view.
        Authors appearing in multiple camps are considered more relevant.
      </p>
    </div>
  )
}

export default AllAuthorsSection

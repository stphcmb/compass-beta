/**
 * Custom hook for author name linkification in Research Assistant
 * Extracts author detection and linking logic
 * Optimization: Standalone concern, memoized regex building
 * Expected: Cleaner code, reusable across components
 */

'use client'

import React, { useCallback, useMemo } from 'react'
import type { ResearchAssistantAnalyzeResponse } from '@/lib/research-assistant'
import type { AuthorForLinkification } from '@/components/research-assistant/lib/types'

interface UseAuthorLinkificationParams {
  allAuthors: AuthorForLinkification[]
  result: ResearchAssistantAnalyzeResponse | null
  openPanel: (authorId: string) => void
}

export function useAuthorLinkification({
  allAuthors,
  result,
  openPanel,
}: UseAuthorLinkificationParams) {
  /**
   * Build author name to ID map from all available sources
   * Memoized to prevent recalculation on every render
   */
  const authorMap = useMemo(() => {
    const map = new Map<string, string>()

    // Add all authors from the database for comprehensive linkification
    allAuthors.forEach(author => {
      if (author.id && author.name) {
        map.set(author.name, author.id)
      }
    })

    // Also add authors from matched camps (in case they have different data)
    if (result?.matchedCamps) {
      result.matchedCamps.forEach(camp => {
        camp.topAuthors.forEach(author => {
          if (author.id && author.name) {
            map.set(author.name, author.id)
          }
        })
      })
    }

    return map
  }, [allAuthors, result])

  /**
   * Parse text and linkify author mentions (both bracketed and plain names)
   * Returns an array of React elements with linked author names
   */
  const linkifyAuthors = useCallback(
    (text: string) => {
      const authorNames = Array.from(authorMap.keys())
      if (authorNames.length === 0) {
        return text
      }

      // Escape special regex characters in author names and sort by length (longest first)
      // This prevents partial name matches (e.g., "John" matching within "John Smith")
      const escapedNames = authorNames
        .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .sort((a, b) => b.length - a.length)

      // Create pattern that matches author names OR bracketed content
      // Pattern: \[([^\]]+)\] matches [bracketed text]
      // Pattern: \b(name1|name2)\b matches whole author names
      const pattern = `\\[([^\\]]+)\\]|\\b(${escapedNames.join('|')})\\b`
      const regex = new RegExp(pattern, 'g')

      const parts: React.ReactNode[] = []
      let lastIndex = 0
      let match
      let linkKey = 0

      while ((match = regex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index))
        }

        // Determine if this is a bracketed match or plain author name
        const bracketedName = match[1]
        const plainName = match[2]
        const authorName = bracketedName || plainName
        const authorId = authorMap.get(authorName)

        // Add the linked author name
        parts.push(
          React.createElement(
            'button',
            {
              key: `author-link-${linkKey++}`,
              onClick: () => authorId && openPanel(authorId),
              style: {
                color: '#0158AE',
                fontWeight: 'var(--weight-semibold)',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(1, 88, 174, 0.3)',
                textUnderlineOffset: '2px',
                transition: 'all var(--duration-fast) var(--ease-out)',
                background: 'none',
                border: 'none',
                padding: 0,
                font: 'inherit',
                cursor: authorId ? 'pointer' : 'default',
              },
              onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.textDecorationColor = '#0158AE'
              },
              onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.textDecorationColor = 'rgba(1, 88, 174, 0.3)'
              },
            },
            authorName
          )
        )

        lastIndex = regex.lastIndex
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex))
      }

      return parts.length > 0 ? parts : text
    },
    [authorMap, openPanel]
  )

  return {
    linkifyAuthors,
    authorMap,
  }
}

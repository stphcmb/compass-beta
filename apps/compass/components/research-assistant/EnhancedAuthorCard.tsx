'use client'

import { useCallback } from 'react'
import {
  Quote,
  ExternalLink,
  User,
  BookmarkPlus,
  BookmarkCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthorPanel } from '@/contexts/AuthorPanelContext'
import { useToast } from '@/components/Toast'
import { cn } from '@/lib/utils'
import {
  getStanceColorExtended,
  getStanceIcon,
  getStanceLabel,
} from '@/components/research-assistant/lib'

export interface EnhancedAuthorCardAuthor {
  id?: string
  name: string
  affiliation?: string
  position: string
  draftConnection?: string
  stance: 'agrees' | 'disagrees' | 'partial'
  quote?: string
  sourceUrl?: string
  sources?: Array<{ title: string; url: string }>
}

interface EnhancedAuthorCardProps {
  author: EnhancedAuthorCardAuthor
  showActions?: boolean
  onSaveForComparison?: (authorId: string) => void
  isSaved?: boolean
  campLabels?: string[]
}

const COMPARISON_STORAGE_KEY = 'authorComparison'
const MAX_COMPARISON_AUTHORS = 5

interface ComparisonListItem {
  id: string
  timestamp: number
  name?: string
}

export function EnhancedAuthorCard({
  author,
  showActions = true,
  onSaveForComparison,
  isSaved = false,
  campLabels,
}: EnhancedAuthorCardProps) {
  const { openPanel } = useAuthorPanel()
  const { showToast } = useToast()

  const getConnectionLabel = (stance: 'agrees' | 'disagrees' | 'partial') => {
    switch (stance) {
      case 'agrees':
        return 'Supports your draft'
      case 'disagrees':
        return 'Challenges your draft'
      case 'partial':
        return 'Relates to your draft'
    }
  }

  const getConnectionIcon = (stance: 'agrees' | 'disagrees' | 'partial') => {
    switch (stance) {
      case 'agrees':
        return '\u2713'
      case 'disagrees':
        return '\u2717'
      case 'partial':
        return '\u25D0'
    }
  }

  const handleViewProfile = useCallback(() => {
    if (author.id) {
      openPanel(author.id)
    }
  }, [author.id, openPanel])

  const handleSaveForComparison = useCallback(() => {
    if (!author.id) {
      showToast('Author profile not available', 'info')
      return
    }

    if (onSaveForComparison) {
      onSaveForComparison(author.id)
    } else {
      // Fallback: handle locally if no parent handler provided
      try {
        const saved: ComparisonListItem[] = JSON.parse(
          localStorage.getItem(COMPARISON_STORAGE_KEY) || '[]'
        )
        const isAlreadySaved = saved.some((a) => a.id === author.id)

        if (isAlreadySaved) {
          const updated = saved.filter((a) => a.id !== author.id)
          localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(updated))
          showToast('Removed from comparison')
        } else {
          if (saved.length >= MAX_COMPARISON_AUTHORS) {
            showToast(`Maximum ${MAX_COMPARISON_AUTHORS} authors for comparison`, 'info')
            return
          }
          const newSaved = [
            ...saved,
            { id: author.id, timestamp: Date.now(), name: author.name },
          ]
          localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(newSaved))
          showToast('Added to comparison')
        }

        window.dispatchEvent(new CustomEvent('comparison-list-updated'))
      } catch (e) {
        console.error('Error managing comparison list:', e)
        showToast('Failed to update comparison list', 'error')
      }
    }
  }, [author.id, author.name, onSaveForComparison, showToast])

  const colors = getStanceColorExtended(author.stance)

  return (
    <div
      className={cn(
        'rounded-lg p-4 transition-shadow duration-150',
        'border-l-4',
        colors.border
      )}
      style={{
        backgroundColor: colors.bgHex,
        borderColor: colors.borderHex,
        borderLeftWidth: '4px',
        borderTopWidth: '1px',
        borderRightWidth: '1px',
        borderBottomWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      {/* Author Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {author.id ? (
            <button
              onClick={handleViewProfile}
              className="font-semibold text-[15px] text-[#0158AE] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0158AE] focus:ring-offset-2 rounded"
              aria-label={`View profile for ${author.name}`}
            >
              {author.name}
            </button>
          ) : (
            <span className="font-semibold text-[15px] text-gray-800">
              {author.name}
            </span>
          )}
          {author.affiliation && (
            <span className="text-xs text-gray-500">({author.affiliation})</span>
          )}
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
              colors.bg,
              colors.text
            )}
            style={{
              border: `1px solid ${colors.borderHex}`,
            }}
          >
            {getStanceIcon(author.stance)}
            {getStanceLabel(author.stance)}
          </span>
        </div>

        {/* Camp Labels (for All Authors section) */}
        {campLabels && campLabels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {campLabels.map((label, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Position */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          What they believe
        </p>
        <p className="text-sm text-gray-800 leading-relaxed">
          {author.position}
        </p>
      </div>

      {/* Draft Connection */}
      {author.draftConnection && (
        <div
          className="mb-3 p-3 rounded-lg"
          style={{
            backgroundColor:
              author.stance === 'agrees'
                ? 'rgba(16, 185, 129, 0.06)'
                : author.stance === 'disagrees'
                  ? 'rgba(239, 68, 68, 0.06)'
                  : 'rgba(245, 158, 11, 0.06)',
            borderLeft: `3px solid ${colors.borderHex}`,
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: colors.textHex }}
          >
            {getConnectionIcon(author.stance)} {getConnectionLabel(author.stance)}
          </p>
          <p className="text-sm text-gray-800 leading-relaxed">
            {author.draftConnection}
          </p>
        </div>
      )}

      {/* Quote */}
      {author.quote && (
        <div className="mb-4">
          {author.sourceUrl ? (
            <a
              href={author.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white border border-[#AADAF9] rounded-lg p-3 hover:border-[#48AFF0] transition-colors"
            >
              <div className="flex gap-2">
                <Quote className="w-4 h-4 text-[#1075DC] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm italic text-[#162950] leading-relaxed">
                    &ldquo;{author.quote}&rdquo;
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-[#0158AE] mt-2">
                    <ExternalLink className="w-3 h-3" />
                    View source
                  </span>
                </div>
              </div>
            </a>
          ) : (
            <div className="bg-[#DCF2FA] border border-[#AADAF9] rounded-lg p-3">
              <div className="flex gap-2">
                <Quote className="w-4 h-4 text-[#48AFF0] flex-shrink-0 mt-0.5" />
                <p className="text-sm italic text-[#162950] leading-relaxed">
                  &ldquo;{author.quote}&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTA Buttons */}
      {showActions && author.id && (
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-200/50">
          <Button
            variant="default"
            size="sm"
            onClick={handleViewProfile}
            className="flex-1 sm:flex-initial bg-[#0158AE] hover:bg-[#1075DC] text-white"
            aria-label={`View full profile for ${author.name}`}
          >
            <User className="w-4 h-4 mr-2" />
            View Full Profile
          </Button>
          <Button
            variant={isSaved ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleSaveForComparison}
            className={cn(
              'flex-1 sm:flex-initial',
              isSaved && 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
            )}
            aria-pressed={isSaved}
            aria-label={
              isSaved
                ? `Remove ${author.name} from comparison`
                : `Save ${author.name} for comparison`
            }
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4 mr-2" />
                Save for Comparison
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default EnhancedAuthorCard

'use client'

import { useState, useEffect, useMemo } from 'react'
import { Users, ChevronDown, ChevronUp, Layers, ArrowUpDown, Sparkles, Search, MessageSquare, X, Check, Edit3 } from 'lucide-react'
import { highlightText, findMatchingTerms, extractSearchTerms } from '@/lib/utils/highlight'
import { useAuthorPanel } from '@/contexts/AuthorPanelContext'
import { DOMAIN_LABEL_STYLES } from '@/lib/constants/domains'
import QuoteBox from './QuoteBox'

/**
 * Match types with priority ranking (lower = higher priority)
 */
type MatchType = 'phrase' | 'multi-word' | 'single-word' | 'semantic' | 'perspective'
const MATCH_PRIORITY: Record<MatchType, number> = {
  'phrase': 0,       // Exact phrase match - highest priority
  'multi-word': 1,   // Multiple words from query match
  'single-word': 2,  // Single word from query matches
  'semantic': 3,     // Semantic expansion match
  'perspective': 4   // In a relevant camp/perspective
}

/**
 * Normalize word for matching - basic stemming
 * Handles common suffixes: -ing, -s, -ed, -ly
 */
function normalizeWord(word: string): string {
  let w = word.toLowerCase()
  // Remove common suffixes for better matching
  if (w.endsWith('ing') && w.length > 5) w = w.slice(0, -3)
  else if (w.endsWith('ed') && w.length > 4) w = w.slice(0, -2)
  else if (w.endsWith('ly') && w.length > 4) w = w.slice(0, -2)
  else if (w.endsWith('s') && w.length > 4 && !w.endsWith('ss')) w = w.slice(0, -1)
  return w
}

/**
 * Check if text contains a word as a whole word (not as substring of another word)
 * Uses word boundary matching to avoid false positives like "labor" in "collaborate"
 */
function textContainsWord(text: string, word: string): boolean {
  const wordLower = word.toLowerCase()
  const normalizedWord = normalizeWord(word)
  const textLower = text.toLowerCase()

  // Split text into actual words (handles punctuation)
  const textWords = textLower.split(/[\s,.:;!?"'()\[\]{}]+/).filter(w => w.length > 0)

  return textWords.some(tw => {
    // Clean the text word of any remaining punctuation
    const cleanTw = tw.replace(/[^a-z]/g, '')
    if (!cleanTw) return false

    const normalizedTw = normalizeWord(cleanTw)

    // Exact match (case-insensitive)
    if (cleanTw === wordLower) return true

    // Stemmed exact match
    if (normalizedTw === normalizedWord) return true

    // Word starts with search term (e.g., "labor" matches "laborer")
    // But only if the search term is at least 4 chars to avoid false positives
    if (wordLower.length >= 4 && cleanTw.startsWith(wordLower)) return true

    // Normalized stem match - search term starts with text word's stem
    // (e.g., searching "laboring" should match "labor")
    if (normalizedWord.length >= 4 && normalizedWord.startsWith(normalizedTw) && normalizedTw.length >= 4) return true

    return false
  })
}

/**
 * Determines why an author matched the search
 * Returns match type for grouping (no verbose "contains" labels)
 * Always returns a reason (perspective-based as fallback) since backend already filtered for relevance
 */
function getMatchReason(
  author: any,
  originalQuery: string,
  expandedQueries: any[],
  campName?: string
): { type: 'direct' | 'semantic' | 'perspective'; matchType: MatchType; priority: number } {
  const searchableText = [
    author.name || '',
    author.header_affiliation || author.affiliation || '',
    author.key_quote || ''
  ].join(' ').toLowerCase()

  const queryLower = originalQuery.toLowerCase().trim()

  // 1. Check for exact phrase match - the FULL query phrase must appear
  if (queryLower.length > 3 && searchableText.includes(queryLower)) {
    return {
      type: 'direct',
      matchType: 'phrase',
      priority: MATCH_PRIORITY['phrase']
    }
  }

  // 2. Check if multiple original query words match (without requiring phrase)
  const originalWords = queryLower.split(/\s+/).filter(w => w.length > 2)
  const matchedOriginal = originalWords.filter(word => textContainsWord(searchableText, word))

  if (matchedOriginal.length > 1) {
    return {
      type: 'direct',
      matchType: 'multi-word',
      priority: MATCH_PRIORITY['multi-word']
    }
  }

  if (matchedOriginal.length === 1) {
    return {
      type: 'direct',
      matchType: 'single-word',
      priority: MATCH_PRIORITY['single-word']
    }
  }

  // 3. Check semantic expansion matches
  for (const eq of expandedQueries || []) {
    const expandedText = (eq.query || eq).toLowerCase()
    const expandedWords = expandedText.split(/\s+/).filter((w: string) => w.length > 3)
    const matchedExpanded = expandedWords.filter((word: string) => textContainsWord(searchableText, word))
    if (matchedExpanded.length >= 1) {
      return {
        type: 'semantic',
        matchType: 'semantic',
        priority: MATCH_PRIORITY['semantic']
      }
    }
  }

  // 4. Fallback: Author is in a relevant perspective (camp)
  return {
    type: 'perspective',
    matchType: 'perspective',
    priority: MATCH_PRIORITY['perspective']
  }
}

interface SearchResultsProps {
  query: string
  domain?: string
  onResultsLoaded?: (camps: any[], expandedQueries: any[] | null) => void
}

type SortOption = 'relevance' | 'name-asc' | 'name-desc' | 'domain'

function getInitials(name?: string) {
  if (!name) return 'A'
  const parts = name.split(' ').filter(Boolean)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function getSourceTitle(url: string, sources: any[]): string {
  if (sources && sources.length > 0) {
    const match = sources.find((s: any) => s.url === url)
    if (match?.title) return match.title
  }
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname
    const segments = path.split('/').filter(Boolean)
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1]
      const cleaned = lastSegment
        .replace(/\.(html?|php|aspx?)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
      if (cleaned.length > 5 && cleaned.length < 80) return cleaned
    }
    return urlObj.hostname.replace(/^www\./, '')
  } catch {
    return 'Source'
  }
}

// Single-column author card with prominent quote highlighting
function SearchResultCard({
  author,
  query,
  expandedQueries = [],
  campName,
  domainName
}: {
  author: any
  query: string
  expandedQueries?: any[]
  campName?: string
  domainName?: string
}) {
  const { openPanel } = useAuthorPanel()
  const name = author?.name || 'Author Name'
  const affiliation = author?.header_affiliation || author?.affiliation || author?.primary_affiliation || ''
  const authorType = author?.authorType || author?.author_type || ''
  const hasQuote = author?.key_quote && author.key_quote !== 'Quote coming soon'
  const quoteSourceUrl = author?.quote_source_url || author?.sources?.[0]?.url

  const searchTerms = query ? extractSearchTerms(expandedQueries, query) : []
  const quoteMatchedTerms = hasQuote ? findMatchingTerms(author.key_quote, searchTerms) : []
  const quoteRelevant = quoteMatchedTerms.length > 0

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening panel if clicking on a link
    if ((e.target as HTMLElement).closest('a')) return
    if (author?.id) openPanel(author.id)
  }

  // Format affiliation like Authors page: "UVA · Economist"
  const formattedAffiliation = [affiliation, authorType].filter(Boolean).join(' · ')

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer relative"
    >
      {/* Domain Label - top right, subdued consistent styling */}
      {domainName && (
        <span
          className="absolute top-3 right-3 text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: DOMAIN_LABEL_STYLES.subdued.bg,
            color: DOMAIN_LABEL_STYLES.subdued.text,
          }}
        >
          {domainName}
        </span>
      )}

      {/* Author Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-[13px] font-semibold text-indigo-700">
            {getInitials(name)}
          </span>
        </div>

        {/* Name & Affiliation */}
        <div className="flex-1 min-w-0 pr-16">
          <div className="font-semibold text-[15px] text-gray-900 leading-tight">
            {searchTerms.length > 0 ? highlightText(name, searchTerms) : name}
          </div>
          {formattedAffiliation && (
            <p className="text-[13px] text-gray-500 mt-0.5 leading-snug">
              {searchTerms.length > 0 ? highlightText(formattedAffiliation, searchTerms) : formattedAffiliation}
            </p>
          )}
        </div>
      </div>

      {/* Quote - prominent with highlighting */}
      {hasQuote && (
        <QuoteBox
          quote={author.key_quote}
          sourceUrl={quoteSourceUrl}
          sourceTitle={quoteSourceUrl ? getSourceTitle(quoteSourceUrl, author?.sources || []) : undefined}
          variant={quoteRelevant ? 'highlighted' : 'default'}
          size="md"
          highlightedQuote={searchTerms.length > 0 ? highlightText(author.key_quote, searchTerms) : undefined}
        />
      )}

    </div>
  )
}

type ExpansionMeta = {
  method: 'ai' | 'local' | 'none'
  description: string
}

export default function SearchResults({ query, domain, onResultsLoaded }: SearchResultsProps) {
  const [camps, setCamps] = useState<any[]>([])
  const [expandedQueries, setExpandedQueries] = useState<any[] | null>(null)
  const [expansionMeta, setExpansionMeta] = useState<ExpansionMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('relevance')

  // Note state for search
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [savedNote, setSavedNote] = useState<string | null>(null)

  const INITIAL_SHOW_COUNT = 10

  // Load existing note for this search query
  useEffect(() => {
    if (!query) return
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      const existing = recent.find((s: any) => s.query === query)
      if (existing?.note) {
        setSavedNote(existing.note)
        setNoteText(existing.note)
      } else {
        setSavedNote(null)
        setNoteText('')
      }
    } catch {
      setSavedNote(null)
      setNoteText('')
    }
  }, [query])

  // Save note to localStorage
  const saveNote = () => {
    if (!query) return
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      const updated = recent.map((s: any) =>
        s.query === query ? { ...s, note: noteText.trim() || undefined } : s
      )
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      setSavedNote(noteText.trim() || null)
      setIsEditingNote(false)
      // Dispatch event for history page to update
      window.dispatchEvent(new CustomEvent('search-note-updated', {
        detail: { query, note: noteText.trim() }
      }))
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  const cancelNote = () => {
    setNoteText(savedNote || '')
    setIsEditingNote(false)
  }

  const removeNote = () => {
    if (!query) return
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      const updated = recent.map((s: any) => {
        if (s.query === query) {
          const { note, ...rest } = s
          return rest
        }
        return s
      })
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      setSavedNote(null)
      setNoteText('')
      setIsEditingNote(false)
      window.dispatchEvent(new CustomEvent('search-note-updated', {
        detail: { query, note: '' }
      }))
    } catch (error) {
      console.error('Error removing note:', error)
    }
  }

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setCamps([])
        setLoading(false)
        return
      }

      setLoading(true)

      // Check for cached results
      const pendingCache = sessionStorage.getItem('pending-search-cache')
      if (pendingCache) {
        try {
          const cached = JSON.parse(pendingCache)
          if (cached.query === query && cached.cachedResult && (Date.now() - cached.timestamp) < 5 * 60 * 1000) {
            const { camps: cachedCamps, expandedQueries: cachedExpandedQueries } = cached.cachedResult
            setCamps(cachedCamps)
            setExpandedQueries(cachedExpandedQueries)
            setLoading(false)
            sessionStorage.removeItem('pending-search-cache')
            if (onResultsLoaded) onResultsLoaded(cachedCamps, cachedExpandedQueries)
            return
          }
        } catch (e) {
          // Ignore parse errors
        }
        sessionStorage.removeItem('pending-search-cache')
      }

      try {
        const params = new URLSearchParams({ query, ...(domain && { domain }) })
        const response = await fetch(`/api/camps?${params}`)
        if (!response.ok) throw new Error('Failed to fetch')

        const data = await response.json()
        setCamps(data.camps)
        setExpandedQueries(data.expandedQueries)
        setExpansionMeta(data.expansionMeta || null)

        // Cache results
        const cacheKey = `search-cache-${query}`
        localStorage.setItem(cacheKey, JSON.stringify({
          camps: data.camps,
          expandedQueries: data.expandedQueries,
          timestamp: Date.now()
        }))

        if (onResultsLoaded) onResultsLoaded(data.camps, data.expandedQueries)
      } catch (error) {
        console.error('Error fetching results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, domain, onResultsLoaded])

  // Flatten authors from all camps with camp/domain info
  const flattenedAuthors = useMemo(() => camps.flatMap(camp =>
    (camp.authors || []).map((author: any) => ({
      ...author,
      campName: camp.name,
      domainName: camp.domain
    }))
  ), [camps])

  // Sort based on selected option
  const sortedAuthors = useMemo(() => {
    return [...flattenedAuthors].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '')
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '')
        case 'domain':
          const domainCompare = (a.domainName || '').localeCompare(b.domainName || '')
          if (domainCompare !== 0) return domainCompare
          return (a.name || '').localeCompare(b.name || '')
        case 'relevance':
        default:
          // Sort by match priority (phrase > multi-word > single-word > semantic > perspective)
          const aMatch = getMatchReason(a, query, expandedQueries || [], a.campName)
          const bMatch = getMatchReason(b, query, expandedQueries || [], b.campName)

          // Sort by priority (lower = better)
          if (aMatch.priority !== bMatch.priority) {
            return aMatch.priority - bMatch.priority
          }

          // Within same priority, alphabetical
          return (a.name || '').localeCompare(b.name || '')
      }
    })
  }, [flattenedAuthors, sortBy, query, expandedQueries])

  // Deduplicate authors (all are relevant since backend already filtered)
  const uniqueAuthors = useMemo(() => {
    const seenIds = new Set<string>()
    return sortedAuthors.filter(author => {
      if (seenIds.has(author.id)) return false
      seenIds.add(author.id)
      return true
    })
  }, [sortedAuthors])

  // Group authors by match type for sectioned display
  // IMPORTANT: This must be before any early returns to maintain hooks order
  const groupedAuthors = useMemo(() => {
    const direct: typeof uniqueAuthors = []
    const semantic: typeof uniqueAuthors = []
    const perspective: typeof uniqueAuthors = []

    uniqueAuthors.forEach(author => {
      const matchInfo = getMatchReason(author, query, expandedQueries || [], author.campName)
      if (matchInfo.type === 'direct') {
        direct.push(author)
      } else if (matchInfo.type === 'semantic') {
        semantic.push(author)
      } else {
        perspective.push(author)
      }
    })

    return { direct, semantic, perspective }
  }, [uniqueAuthors, query, expandedQueries])

  const displayedAuthors = showAll ? uniqueAuthors : uniqueAuthors.slice(0, INITIAL_SHOW_COUNT)
  const hasMore = uniqueAuthors.length > INITIAL_SHOW_COUNT

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-32" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (uniqueAuthors.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}
        >
          <Users className="w-7 h-7 text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching authors</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-4 leading-relaxed">
          We couldn't find any authors matching "{query}". Try different keywords or browse all perspectives.
        </p>
        <a
          href="/explore"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          Browse all perspectives
        </a>
      </div>
    )
  }

  return (
    <div>
      {/* Results Header with Sort, Filter, and Note */}
      <div className="mb-5 space-y-3">
        {/* Top row: count, note button, and sort */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-gray-900">
              {uniqueAuthors.length} {uniqueAuthors.length === 1 ? 'result' : 'results'}
            </span>
            <span className="text-[13px] text-gray-500">
              from {camps.length} {camps.length === 1 ? 'perspective' : 'perspectives'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Note Button - compact */}
            {!isEditingNote && (
              <button
                onClick={() => setIsEditingNote(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                  savedNote
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                    : 'text-gray-500 hover:text-amber-600 hover:bg-amber-50 border border-gray-200 hover:border-amber-200'
                }`}
                title={savedNote ? 'Edit note' : 'Add note'}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {savedNote ? 'Note' : 'Add Note'}
              </button>
            )}

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-[13px] text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="name-asc">Sort: A → Z</option>
                <option value="name-desc">Sort: Z → A</option>
              </select>
              <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Note Editing Panel - shown when editing */}
        {isEditingNote && (
          <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span className="text-[12px] font-medium text-amber-700">Your note</span>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="What insights did you find? What should you remember about this search?"
              className="w-full p-2 text-[13px] text-gray-700 bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
              rows={2}
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              {savedNote && (
                <button
                  onClick={removeNote}
                  className="px-2 py-1 text-[12px] text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Remove
                </button>
              )}
              <button
                onClick={cancelNote}
                className="px-3 py-1.5 text-[12px] text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Cancel
              </button>
              <button
                onClick={saveNote}
                className="px-3 py-1.5 text-[12px] font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Save
              </button>
            </div>
          </div>
        )}

        {/* Saved Note Display - shown when not editing */}
        {!isEditingNote && savedNote && (
          <div
            onClick={() => setIsEditingNote(true)}
            className="bg-amber-50/50 border border-amber-100 rounded-lg px-3 py-2 cursor-pointer hover:border-amber-200 transition-colors group"
          >
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-[13px] text-gray-700 leading-relaxed flex-1">{savedNote}</p>
              <Edit3 className="w-3 h-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
            </div>
          </div>
        )}

      </div>

      {/* Results organized by sections */}
      <div className="space-y-4">
        {/* Section 1: Direct Matches - always show container */}
        <div className={`bg-gradient-to-b ${groupedAuthors.direct.length > 0 ? 'from-emerald-50 to-emerald-50/30' : 'from-gray-50 to-gray-50/30'} border ${groupedAuthors.direct.length > 0 ? 'border-emerald-200' : 'border-gray-200'} rounded-lg p-3`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-7 h-7 rounded-md ${groupedAuthors.direct.length > 0 ? 'bg-emerald-500' : 'bg-gray-300'} flex items-center justify-center`}>
              <Search className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 className="text-[14px] font-semibold text-gray-900">
              Direct Matches <span className="font-normal text-gray-500">(quotes mentioning "{query}")</span>
            </h3>
            <span className={`ml-auto text-[12px] font-semibold ${groupedAuthors.direct.length > 0 ? 'text-emerald-700 bg-emerald-100' : 'text-gray-500 bg-gray-200'} px-2 py-0.5 rounded-full`}>
              {groupedAuthors.direct.length}
            </span>
          </div>
          {groupedAuthors.direct.length === 0 ? (
            <p className="text-[12px] text-gray-500 pl-9">No exact matches. See related results below.</p>
          ) : (
            <div className="space-y-2 mt-2">
              {groupedAuthors.direct.map((author) => (
                <SearchResultCard
                  key={author.id}
                  author={author}
                  query={query}
                  expandedQueries={expandedQueries || []}
                  campName={author.campName}
                  domainName={author.domainName}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Related Topics (Semantic) */}
        {groupedAuthors.semantic.length > 0 && (
          <div className="bg-gradient-to-b from-blue-50 to-indigo-50/30 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-[14px] font-semibold text-gray-900">
                Related Topics <span className="font-normal text-gray-500">(semantically related concepts)</span>
              </h3>
              <span className="ml-auto text-[12px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {groupedAuthors.semantic.length}
              </span>
            </div>
            {/* Search Expansion panel - shows method and expanded queries */}
            {expandedQueries && expandedQueries.length > 0 && (
              <div className={`mb-2 rounded-md px-3 py-2 border ${
                expansionMeta?.method === 'ai'
                  ? 'bg-gradient-to-r from-indigo-100 via-blue-100 to-purple-100 border-indigo-200'
                  : 'bg-gradient-to-r from-slate-100 via-gray-100 to-slate-100 border-gray-200'
              }`}>
                <div className="flex items-start gap-1.5">
                  <Sparkles className={`w-3 h-3 mt-0.5 ${expansionMeta?.method === 'ai' ? 'text-indigo-600' : 'text-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                        expansionMeta?.method === 'ai' ? 'text-indigo-700' : 'text-gray-600'
                      }`}>
                        {expansionMeta?.method === 'ai' ? 'AI-Expanded' : 'Smart Search'}:
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        expansionMeta?.method === 'ai'
                          ? 'bg-indigo-200/50 text-indigo-600'
                          : 'bg-gray-200/50 text-gray-500'
                      }`}>
                        {expansionMeta?.description || 'Pattern matching'}
                      </span>
                    </div>
                    <p className={`text-[12px] mt-1 ${expansionMeta?.method === 'ai' ? 'text-indigo-800' : 'text-gray-700'}`}>
                      {expandedQueries.map((eq, i) => (
                        <span key={i}>
                          {i > 0 && <span className="mx-1 text-gray-400">•</span>}
                          <span className="font-medium">{eq.query || eq}</span>
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {groupedAuthors.semantic.map((author) => (
                <SearchResultCard
                  key={author.id}
                  author={author}
                  query={query}
                  expandedQueries={expandedQueries || []}
                  campName={author.campName}
                  domainName={author.domainName}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Related Perspectives */}
        {groupedAuthors.perspective.length > 0 && (
          <div className="bg-gradient-to-b from-gray-50 to-slate-50/30 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-md bg-gray-500 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-[14px] font-semibold text-gray-900">
                Related Perspectives <span className="font-normal text-gray-500">(aligned position summaries)</span>
              </h3>
              <span className="ml-auto text-[12px] font-semibold text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full">
                {groupedAuthors.perspective.length}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 italic pl-9 mb-2">
              Based on AI-analyzed camp themes related to "{query}"
            </p>
            <div className="space-y-2">
              {groupedAuthors.perspective.map((author) => (
                <SearchResultCard
                  key={author.id}
                  author={author}
                  query={query}
                  expandedQueries={expandedQueries || []}
                  campName={author.campName}
                  domainName={author.domainName}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Show More Button */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 flex items-center justify-center gap-2 transition-colors"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show fewer results
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show all {uniqueAuthors.length} results
            </>
          )}
        </button>
      )}
    </div>
  )
}

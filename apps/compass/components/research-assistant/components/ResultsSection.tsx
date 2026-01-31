'use client'

import { useCallback, type ReactNode, type RefObject } from 'react'
import { AnalyzedTextPreview } from './AnalyzedTextPreview'
import { ResultsToolbar } from './ResultsToolbar'
import type { ScrollRefs } from './ResultsToolbar'
import { SummarySection } from './SummarySection'
import { EditorialSuggestionsSection } from './EditorialSuggestionsSection'
import type { EditorialSuggestions } from './EditorialSuggestionsSection'
import { ThoughtLeadersSection } from './ThoughtLeadersSection'
import type { CampCardCamp } from './CampCard'

/**
 * Props for the ResultsSection component
 * This component wraps all result-related components for lazy loading
 */
export interface ResultsSectionProps {
  /** The analyzed text */
  text: string
  /** Analysis result data */
  result: {
    summary: string
    editorialSuggestions: EditorialSuggestions
    matchedCamps: CampCardCamp[]
  }
  /** Whether the summary has been liked */
  likedSummary: boolean
  /** Set of liked camp indices */
  likedCamps: Set<number>
  /** Whether analysis has been saved */
  savedOnce: boolean
  /** Whether save is in progress */
  saving: boolean
  /** Whether copy is in progress */
  copying: boolean
  /** Whether export is in progress */
  exporting: boolean
  /** Whether URL has been copied */
  urlCopied: boolean
  /** Ref for the results container (used for PDF export) */
  resultsRef: RefObject<HTMLDivElement | null>
  /** Refs for scrolling to sections */
  scrollRefs: ScrollRefs
  /** Function to linkify author names in text */
  linkifyAuthors: (text: string) => ReactNode
  /** Handler for starting a new analysis */
  onNewAnalysis: () => void
  /** Handler for copying analysis */
  onCopy: () => void
  /** Handler for exporting to PDF */
  onExportPDF: () => void
  /** Handler for sharing URL */
  onShareUrl: () => void
  /** Handler for saving analysis */
  onSave: () => void
  /** Handler for toggling summary like */
  onToggleSummaryLike: () => void
  /** Handler for toggling camp like */
  onToggleCampLike: (campIndex: number) => void
  /** Handler for clicking an author */
  onAuthorClick: (authorId: string) => void
}

/**
 * ResultsSection - Wrapper component for all analysis results
 *
 * This component is designed to be lazy-loaded via dynamic() import
 * since it's only needed after analysis completes. It bundles:
 * - AnalyzedTextPreview (text that was analyzed)
 * - ResultsToolbar (action buttons and navigation)
 * - SummarySection (analysis summary)
 * - EditorialSuggestionsSection (present/missing perspectives)
 * - ThoughtLeadersSection (matched camps and authors)
 *
 * Estimated bundle savings: 50-80 KB by deferring these components
 */
export function ResultsSection({
  text,
  result,
  likedSummary,
  likedCamps,
  savedOnce,
  saving,
  copying,
  exporting,
  urlCopied,
  resultsRef,
  scrollRefs,
  linkifyAuthors,
  onNewAnalysis,
  onCopy,
  onExportPDF,
  onShareUrl,
  onSave,
  onToggleSummaryLike,
  onToggleCampLike,
  onAuthorClick,
}: ResultsSectionProps): React.ReactElement {
  const authorCount = result.matchedCamps.reduce(
    (total, camp) => total + camp.topAuthors.length,
    0
  )

  // Callback ref to sync with parent's resultsRef
  const setResultsRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (resultsRef && 'current' in resultsRef) {
        (resultsRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    },
    [resultsRef]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Analyzed Text Preview */}
      <AnalyzedTextPreview text={text} />

      {/* Results Toolbar */}
      <ResultsToolbar
        text={text}
        authorCount={authorCount}
        scrollRefs={scrollRefs}
        savedOnce={savedOnce}
        saving={saving}
        copying={copying}
        exporting={exporting}
        urlCopied={urlCopied}
        onNewAnalysis={onNewAnalysis}
        onCopy={onCopy}
        onExportPDF={onExportPDF}
        onShareUrl={onShareUrl}
        onSave={onSave}
      />

      {/* PDF Export Container - wraps all exportable content */}
      <div ref={setResultsRef}>
        {/* Summary */}
        <SummarySection
          ref={scrollRefs.summaryRef}
          summary={result.summary}
          isLiked={likedSummary}
          onToggleLike={onToggleSummaryLike}
        />

        {/* Editorial Suggestions */}
        <EditorialSuggestionsSection
          ref={scrollRefs.suggestionsRef}
          editorialSuggestions={result.editorialSuggestions}
          linkifyAuthors={linkifyAuthors}
        />

        {/* Thought Leaders */}
        <ThoughtLeadersSection
          ref={scrollRefs.authorsRef}
          matchedCamps={result.matchedCamps}
          likedCamps={likedCamps}
          onToggleCampLike={onToggleCampLike}
          onAuthorClick={onAuthorClick}
        />
      </div>
    </div>
  )
}

export default ResultsSection

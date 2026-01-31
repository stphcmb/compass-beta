'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Database,
  ExternalLink,
  Zap,
  XCircle,
  Search,
  Play,
  Loader2,
  FileSearch,
  GitCompare
} from 'lucide-react'

import { CurationQueueData, CurationResult } from '../types'

interface CurationQueueDashboardProps {
  data: CurationQueueData
  onRefresh?: () => void
}

export default function CurationQueueDashboard({ data, onRefresh }: CurationQueueDashboardProps) {
  const [runningChecks, setRunningChecks] = useState<Set<string>>(new Set())
  const [results, setResults] = useState<Map<string, CurationResult>>(new Map())
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set())
  const [enrichingDates, setEnrichingDates] = useState<Set<string>>(new Set())
  // Batch processing state
  const [selectedAuthors, setSelectedAuthors] = useState<Set<string>>(new Set())
  const [batchRunning, setBatchRunning] = useState(false)
  const [enrichAllRunning, setEnrichAllRunning] = useState(false)
  // Human-in-the-loop review state (simplified to yes/no)
  const [reviews, setReviews] = useState<Map<string, {
    approved: boolean | null
    reviewedAt: string | null
  }>>(new Map())

  const runCurationCheck = async (authorId: string, checkType: 'full' | 'sources' | 'position' = 'full') => {
    setRunningChecks(prev => new Set(prev).add(authorId))

    try {
      const response = await fetch('/api/admin/curation/check-author', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId, checkType })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Check failed')
      }

      const result: CurationResult = await response.json()
      setResults(prev => new Map(prev).set(authorId, result))
      setExpandedResults(prev => new Set(prev).add(authorId))
    } catch (err) {
      console.error('Curation check failed:', err)
      alert(`Check failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setRunningChecks(prev => {
        const next = new Set(prev)
        next.delete(authorId)
        return next
      })
    }
  }

  const enrichSourceDates = async (authorId: string) => {
    setEnrichingDates(prev => new Set(prev).add(authorId))

    try {
      const response = await fetch('/api/admin/curation/enrich-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Enrichment failed')
      }

      const result = await response.json()
      alert(`Enriched ${result.enrichedCount} of ${result.totalSources} sources with better dates.\n\n${result.message}`)

      // Refresh queue to show updated dates
      onRefresh?.()
    } catch (err) {
      console.error('Date enrichment failed:', err)
      alert(`Failed to enrich dates: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setEnrichingDates(prev => {
        const next = new Set(prev)
        next.delete(authorId)
        return next
      })
    }
  }

  const enrichAllDates = async () => {
    const confirmed = confirm('This will enrich dates for ALL authors with sources. This may take up to 5 minutes. Continue?')
    if (!confirmed) return

    setEnrichAllRunning(true)

    try {
      const response = await fetch('/api/admin/curation/enrich-all-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Batch enrichment failed')
      }

      const result = await response.json()

      const successCount = result.processedAuthors || 0
      const failedCount = result.failedAuthors || 0
      const totalEnriched = result.enrichedSources || 0

      alert(`Batch Date Enrichment Complete\n\n` +
            `Processed: ${successCount} authors\n` +
            `Failed: ${failedCount} authors\n` +
            `Total sources enriched: ${totalEnriched}\n\n` +
            `${result.topEnriched?.length > 0 ? `Top enriched authors:\n${result.topEnriched.map((a: any) => `  ${a.name}: ${a.enrichedCount}/${a.totalSources}`).join('\n')}` : ''}`)

      // Refresh queue to show updated dates
      onRefresh?.()
    } catch (err) {
      console.error('Batch date enrichment failed:', err)
      alert(`Failed to enrich all dates: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setEnrichAllRunning(false)
    }
  }

  const toggleResultExpanded = (authorId: string) => {
    setExpandedResults(prev => {
      const next = new Set(prev)
      if (next.has(authorId)) {
        next.delete(authorId)
      } else {
        next.add(authorId)
      }
      return next
    })
  }

  // Batch processing functions
  const toggleAuthorSelection = (authorId: string) => {
    setSelectedAuthors(prev => {
      const next = new Set(prev)
      if (next.has(authorId)) {
        next.delete(authorId)
      } else {
        next.add(authorId)
      }
      return next
    })
  }

  const selectAll = () => {
    const allIds = data?.queue.slice(0, 30).map(a => a.id) || []
    setSelectedAuthors(new Set(allIds))
  }

  const clearSelection = () => {
    setSelectedAuthors(new Set())
  }

  const runBatchCheck = async () => {
    if (selectedAuthors.size === 0) {
      alert('Please select at least one author')
      return
    }

    setBatchRunning(true)

    try {
      const response = await fetch('/api/admin/curation/batch-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorIds: Array.from(selectedAuthors) })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Batch check failed')
      }

      const batchResult = await response.json()

      // Update results for each author
      const newResults = new Map(results)
      batchResult.results.forEach((authorResult: any) => {
        if (authorResult.success) {
          newResults.set(authorResult.authorId, {
            authorId: authorResult.authorId,
            authorName: authorResult.authorName,
            success: true,
            checkType: 'batch',
            result: {
              positionVerification: authorResult.result,
              sourceDiscovery: undefined // Batch check only runs position verification
            }
          })
          // Auto-expand results
          setExpandedResults(prev => new Set(prev).add(authorResult.authorId))
        }
      })
      setResults(newResults)

      // Show summary
      alert(`Batch check complete!\n\nSuccessful: ${batchResult.summary.successful}\nFailed: ${batchResult.summary.failed}\nDrift detected: ${batchResult.summary.driftDetected}\nNeeds review: ${batchResult.summary.needsReview}\nVerified: ${batchResult.summary.verified}`)
    } catch (err) {
      console.error('Batch check failed:', err)
      alert(`Batch check failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setBatchRunning(false)
    }
  }

  // Human-in-the-loop review functions (simplified)
  const submitReview = (authorId: string, approved: boolean) => {
    setReviews(prev => {
      const next = new Map(prev)
      next.set(authorId, {
        approved,
        reviewedAt: new Date().toISOString()
      })
      return next
    })

    // If approved, auto-run source discovery
    if (approved) {
      runCurationCheck(authorId, 'sources')
    }
  }

  const getReview = (authorId: string) => {
    return reviews.get(authorId) || { approved: null, reviewedAt: null }
  }

  const canProceedToSourceDiscovery = (authorId: string) => {
    const review = getReview(authorId)
    return review.approved === true
  }

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'critical': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' }
      case 'medium': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Queue Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Curation Queue</h2>
              <p className="text-sm text-gray-500">Authors prioritized for source discovery and position verification</p>
            </div>
          </div>
          {onRefresh && (
            <button onClick={onRefresh} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          )}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-700">{data.summary.critical}</div>
            <div className="text-xs text-red-600">Critical</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-700">{data.summary.high}</div>
            <div className="text-xs text-orange-600">High Priority</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-2xl font-bold text-amber-700">{data.summary.medium}</div>
            <div className="text-xs text-amber-600">Medium</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-700">{data.summary.neverChecked}</div>
            <div className="text-xs text-gray-600">Never Checked</div>
          </div>
        </div>

        {/* What these checks do */}
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            What the agents do
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-indigo-800">
            <div className="flex items-start gap-2">
              <FileSearch className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Source Discovery:</strong> Finds new papers, blog posts, talks, and interviews from the author that we don't have yet.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <GitCompare className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Position Verification:</strong> Checks if our summary of their views still matches their recent content, detecting any shifts.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">Priority Queue (Top 50)</h3>
              <p className="text-sm text-gray-500">Select authors for batch processing (runs position verification in parallel)</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedAuthors.size > 0 && (
                <>
                  <span className="text-sm text-gray-600">{selectedAuthors.size} selected</span>
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    Clear
                  </button>
                  <button
                    onClick={runBatchCheck}
                    disabled={batchRunning}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {batchRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                    Batch Check ({selectedAuthors.size})
                  </button>
                </>
              )}
              {selectedAuthors.size === 0 && (
                <>
                  <button
                    onClick={enrichAllDates}
                    disabled={enrichAllRunning}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-600 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Enrich dates for ALL authors using AI to extract dates from URLs, ArXiv IDs, conference info"
                  >
                    {enrichAllRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}
                    Fix All Dates
                  </button>
                  <button
                    onClick={selectAll}
                    className="px-3 py-1.5 text-sm text-indigo-600 rounded-lg hover:bg-indigo-50"
                  >
                    Select All
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {data.queue.slice(0, 30).map((author) => {
            const style = getUrgencyStyle(author.urgency)
            const isRunning = runningChecks.has(author.id)
            const result = results.get(author.id)
            const isExpanded = expandedResults.has(author.id)

            return (
              <div key={author.id} className="hover:bg-gray-50">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Checkbox for batch selection */}
                    <div className="flex items-start pt-1">
                      <input
                        type="checkbox"
                        checked={selectedAuthors.has(author.id)}
                        onChange={() => toggleAuthorSelection(author.id)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/authors/${author.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                          {author.name}
                        </Link>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
                          {author.urgency.toUpperCase()}
                        </span>
                        {!author.hasPositionSummary && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                            No Summary
                          </span>
                        )}
                      </div>

                      {author.affiliation && (
                        <div className="text-sm text-gray-500 mb-1">{author.affiliation}</div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
                        <span className={`flex items-center gap-1 ${author.sourceCount === 0 ? 'text-red-600 font-medium' : ''}`}>
                          <BookOpen className="w-3 h-3" />
                          {author.sourceCount} sources
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {author.mostRecentSourceDate || 'No dates'}
                          {author.daysSinceLastSource && (
                            <span className={author.daysSinceLastSource > 365 ? 'text-red-600' : ''}>
                              ({author.daysSinceLastSource}d ago)
                            </span>
                          )}
                        </span>
                        {author.camps.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Database className="w-3 h-3" />
                            {author.camps.slice(0, 2).join(', ')}{author.camps.length > 2 ? ` +${author.camps.length - 2}` : ''}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {author.priorityReasons.map((reason, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => enrichSourceDates(author.id)}
                        disabled={enrichingDates.has(author.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Enrich source dates using AI to extract dates from URLs, ArXiv IDs, conference info"
                      >
                        {enrichingDates.has(author.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}
                        Fix Dates
                      </button>
                      {!results.has(author.id) ? (
                        <button
                          onClick={() => runCurationCheck(author.id, 'position')}
                          disabled={isRunning}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Start curation: verify position first, then review before source discovery"
                        >
                          {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                          Start Check
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs text-emerald-700 bg-emerald-50 rounded-lg">
                          Check in progress
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Results display */}
                  {result && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleResultExpanded(author.id)}
                        className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        View Results
                        {result.result.sourceDiscovery?.discoveredSources?.length ? (
                          <span className="px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded">
                            {result.result.sourceDiscovery.discoveredSources.length} new sources
                          </span>
                        ) : null}
                        {result.result.positionVerification?.analysis?.shiftDetected && (
                          <span className="px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">
                            Position shift detected
                          </span>
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 space-y-3">
                          {/* Position Verification Results - shown first since it runs first */}
                          {result.result.positionVerification && (
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                <GitCompare className="w-4 h-4" />
                                Step 1: Position Verification
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  result.result.positionVerification.status === 'verified'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : result.result.positionVerification.status === 'drift_detected'
                                    ? 'bg-red-100 text-red-700'
                                    : result.result.positionVerification.status === 'needs_review'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {result.result.positionVerification.status.replace(/_/g, ' ')}
                                </span>
                              </h4>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-4">
                                  <span className={`flex items-center gap-1 ${
                                    result.result.positionVerification.analysis.aligned
                                      ? 'text-emerald-700'
                                      : 'text-red-700'
                                  }`}>
                                    {result.result.positionVerification.analysis.aligned
                                      ? <CheckCircle className="w-4 h-4" />
                                      : <XCircle className="w-4 h-4" />}
                                    {result.result.positionVerification.analysis.aligned ? 'Aligned' : 'Not Aligned'}
                                  </span>
                                  {result.result.positionVerification.analysis.shiftDetected && (
                                    <span className="flex items-center gap-1 text-amber-700">
                                      <AlertTriangle className="w-4 h-4" />
                                      Shift: {result.result.positionVerification.analysis.shiftSeverity}
                                    </span>
                                  )}
                                  <span className="text-gray-500">
                                    Confidence: {result.result.positionVerification.analysis.confidence}
                                  </span>
                                </div>

                                <p className="text-purple-800">{result.result.positionVerification.analysis.reasoning}</p>

                                {result.result.positionVerification.analysis.shiftSummary && (
                                  <div className="p-2 bg-amber-50 rounded border border-amber-200">
                                    <strong className="text-amber-800">Shift Detected:</strong>
                                    <p className="text-amber-700">{result.result.positionVerification.analysis.shiftSummary}</p>
                                  </div>
                                )}

                                {result.result.positionVerification.analysis.newTopics?.length > 0 && (
                                  <div>
                                    <strong className="text-purple-800">New Topics:</strong>
                                    <span className="ml-2 text-purple-700">
                                      {result.result.positionVerification.analysis.newTopics.join(', ')}
                                    </span>
                                  </div>
                                )}

                                {result.result.positionVerification.analysis.suggestedUpdate && (
                                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                                    <strong className="text-emerald-800">Suggested Update:</strong>
                                    <p className="text-emerald-700">{result.result.positionVerification.analysis.suggestedUpdate}</p>
                                  </div>
                                )}
                              </div>

                              {/* Human-in-the-loop Review Panel */}
                              {(() => {
                                const review = getReview(author.id)
                                const isReviewed = review.reviewedAt !== null

                                return (
                                  <div className="mt-4 pt-4 border-t border-purple-200">
                                    <h5 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                      <Users className="w-4 h-4" />
                                      Admin Review Required
                                      {isReviewed && (
                                        <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                                          Reviewed
                                        </span>
                                      )}
                                    </h5>

                                    {!isReviewed ? (
                                      <div className="space-y-3">
                                        <p className="text-sm text-gray-700">
                                          Should we proceed with source discovery for this author?
                                        </p>
                                        <div className="flex gap-3">
                                          <button
                                            onClick={() => submitReview(author.id, true)}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                                          >
                                            <CheckCircle className="w-4 h-4 inline-block mr-2" />
                                            Yes, Find Sources
                                          </button>
                                          <button
                                            onClick={() => submitReview(author.id, false)}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                          >
                                            <XCircle className="w-4 h-4 inline-block mr-2" />
                                            No, Skip for Now
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                          {review.approved ? (
                                            <>
                                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                                              <span className="font-medium text-emerald-700">Approved for source discovery</span>
                                            </>
                                          ) : (
                                            <>
                                              <XCircle className="w-4 h-4 text-gray-600" />
                                              <span className="font-medium text-gray-700">Skipped</span>
                                            </>
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          Reviewed: {new Date(review.reviewedAt!).toLocaleString()}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )
                              })()}
                            </div>
                          )}

                          {/* Source Discovery - shown after review is submitted */}
                          {result.result.positionVerification && canProceedToSourceDiscovery(author.id) && (
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                              <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                                <FileSearch className="w-4 h-4" />
                                Step 2: Source Discovery
                              </h4>

                              {!result.result.sourceDiscovery ? (
                                <div className="space-y-3">
                                  <p className="text-sm text-indigo-800">
                                    Review submitted. You can now search for new sources for this author.
                                  </p>
                                  <button
                                    onClick={() => runCurationCheck(author.id, 'sources')}
                                    disabled={runningChecks.has(author.id)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                  >
                                    {runningChecks.has(author.id) ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <FileSearch className="w-4 h-4" />
                                    )}
                                    Run Source Discovery
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    result.result.sourceDiscovery.status === 'new_content_found'
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : result.result.sourceDiscovery.status === 'error'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {result.result.sourceDiscovery.status.replace(/_/g, ' ')}
                                  </span>
                                  <p className="text-sm text-indigo-800 mb-3 mt-2">{result.result.sourceDiscovery.searchSummary}</p>

                                  {result.result.sourceDiscovery.discoveredSources?.length > 0 && (
                                    <div className="space-y-2">
                                      {result.result.sourceDiscovery.discoveredSources.map((src, idx) => (
                                        <div key={idx} className="p-3 bg-white rounded border border-indigo-100">
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                              <div className="font-medium text-gray-900 text-sm">{src.title}</div>
                                              <div className="text-xs text-gray-500 mt-1">
                                                <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded mr-2">{src.type}</span>
                                                {src.date && <span className="mr-2">{src.date}</span>}
                                                <span className={`px-1.5 py-0.5 rounded ${
                                                  src.relevance === 'high' ? 'bg-emerald-100 text-emerald-700' :
                                                  src.relevance === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                  'bg-gray-100 text-gray-600'
                                                }`}>
                                                  {src.relevance} relevance
                                                </span>
                                              </div>
                                              <p className="text-xs text-gray-600 mt-1">{src.summary}</p>
                                            </div>
                                            {src.url && src.url !== 'unknown' && (
                                              <a href={src.url} target="_blank" rel="noopener noreferrer"
                                                 className="text-blue-600 hover:text-blue-800">
                                                <ExternalLink className="w-4 h-4" />
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}

                          {/* Pending review message - when position verification done but not reviewed */}
                          {result.result.positionVerification && !canProceedToSourceDiscovery(author.id) && !result.result.sourceDiscovery && (
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Complete the review above to unlock source discovery</span>
                              </div>
                            </div>
                          )}

                          {/* Legacy: Source Discovery Results if run directly without position verification */}
                          {result.result.sourceDiscovery && !result.result.positionVerification && (
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                              <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                                <FileSearch className="w-4 h-4" />
                                Source Discovery
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  result.result.sourceDiscovery.status === 'new_content_found'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : result.result.sourceDiscovery.status === 'error'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {result.result.sourceDiscovery.status.replace(/_/g, ' ')}
                                </span>
                              </h4>
                              <p className="text-sm text-indigo-800 mb-3">{result.result.sourceDiscovery.searchSummary}</p>

                              {result.result.sourceDiscovery.discoveredSources?.length > 0 && (
                                <div className="space-y-2">
                                  {result.result.sourceDiscovery.discoveredSources.map((src, idx) => (
                                    <div key={idx} className="p-3 bg-white rounded border border-indigo-100">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-900 text-sm">{src.title}</div>
                                          <div className="text-xs text-gray-500 mt-1">
                                            <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded mr-2">{src.type}</span>
                                            {src.date && <span className="mr-2">{src.date}</span>}
                                            <span className={`px-1.5 py-0.5 rounded ${
                                              src.relevance === 'high' ? 'bg-emerald-100 text-emerald-700' :
                                              src.relevance === 'medium' ? 'bg-amber-100 text-amber-700' :
                                              'bg-gray-100 text-gray-600'
                                            }`}>
                                              {src.relevance} relevance
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-600 mt-1">{src.summary}</p>
                                        </div>
                                        {src.url && src.url !== 'unknown' && (
                                          <a href={src.url} target="_blank" rel="noopener noreferrer"
                                             className="text-blue-600 hover:text-blue-800">
                                            <ExternalLink className="w-4 h-4" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-700 mb-2">Estimated Cost</h4>
        <p className="text-sm text-gray-600">
          Using Gemini 1.5 Pro: ~$0.03-0.05 per full check (source discovery + position verification).
          Running all {data.summary.critical + data.summary.high} critical/high priority authors: ~${((data.summary.critical + data.summary.high) * 0.04).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

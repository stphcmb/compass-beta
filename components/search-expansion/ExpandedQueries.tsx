'use client'

interface ExpandedQuery {
  query: string
  role: 'core' | 'context' | 'adjacent'
  priority: number
}

interface ExpandedQueriesProps {
  queries: ExpandedQuery[] | null
  originalQuery: string
}

export default function ExpandedQueries({ queries, originalQuery }: ExpandedQueriesProps) {
  if (!queries || queries.length === 0) {
    return null
  }

  // Group queries by role (with fallback for unrecognized roles)
  const coreQueries = queries.filter(q => q.role === 'core')
  const contextQueries = queries.filter(q => q.role === 'context')
  const adjacentQueries = queries.filter(q => q.role === 'adjacent')
  const otherQueries = queries.filter(q => !['core', 'context', 'adjacent'].includes(q.role))

  const roleColors = {
    core: 'bg-blue-50 text-blue-700 border-blue-200',
    context: 'bg-purple-50 text-purple-700 border-purple-200',
    adjacent: 'bg-green-50 text-green-700 border-green-200'
  }

  const roleLabels = {
    core: 'Core',
    context: 'Context',
    adjacent: 'Related'
  }

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div className="text-xs text-gray-500">
            Expanded into {queries.length} related {queries.length === 1 ? 'term' : 'terms'}
          </div>
        </div>
        {coreQueries.length > 0 && (
          <div className="text-[10px] text-gray-400">
            Powered by n8n + Gemini
          </div>
        )}
      </div>

      <div className="space-y-2">
        {/* Core Queries */}
        {coreQueries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {coreQueries.map((q, idx) => (
              <div
                key={`core-${idx}`}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs ${roleColors.core}`}
              >
                <span className="font-medium text-[10px] uppercase opacity-60">{roleLabels.core}</span>
                <span>{q.query}</span>
              </div>
            ))}
          </div>
        )}

        {/* Context Queries */}
        {contextQueries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {contextQueries.map((q, idx) => (
              <div
                key={`context-${idx}`}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs ${roleColors.context}`}
              >
                <span className="font-medium text-[10px] uppercase opacity-60">{roleLabels.context}</span>
                <span>{q.query}</span>
              </div>
            ))}
          </div>
        )}

        {/* Adjacent Queries */}
        {adjacentQueries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {adjacentQueries.map((q, idx) => (
              <div
                key={`adjacent-${idx}`}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs ${roleColors.adjacent}`}
              >
                <span className="font-medium text-[10px] uppercase opacity-60">{roleLabels.adjacent}</span>
                <span>{q.query}</span>
              </div>
            ))}
          </div>
        )}

        {/* Other/Unrecognized Queries */}
        {otherQueries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {otherQueries.map((q, idx) => (
              <div
                key={`other-${idx}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs bg-gray-50 text-gray-700 border-gray-200"
              >
                <span className="font-medium text-[10px] uppercase opacity-60">{q.role || 'Other'}</span>
                <span>{q.query}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

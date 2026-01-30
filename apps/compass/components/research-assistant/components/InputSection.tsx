'use client'

import Link from 'next/link'
import { Sparkles, Loader2, CheckCircle, History, Clock } from 'lucide-react'
import type { SavedAnalysis } from '@/components/research-assistant/lib'

export interface InputSectionProps {
  text: string
  loading: boolean
  error: string | null
  savedAnalyses: SavedAnalysis[]
  pendingFromHome: boolean | null
  onTextChange: (text: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onAnalyze: () => void
  onLoadSavedAnalysis: (analysis: SavedAnalysis) => void
}

/**
 * InputSection displays the welcome state with the text input form
 * and recent analyses grid. Used when no result is available.
 */
export function InputSection({
  text,
  loading,
  error,
  savedAnalyses,
  pendingFromHome,
  onTextChange,
  onKeyDown,
  onAnalyze,
  onLoadSavedAnalysis
}: InputSectionProps) {
  const canAnalyze = text.trim().length > 0 && text.length <= 4000 && !loading

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100 rounded-xl p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-indigo-600" />
        </div>
        <h3 className="text-[17px] font-semibold text-gray-900 mb-2">What's in your draft?</h3>
        <p className="text-[14px] text-gray-600 max-w-md mx-auto">
          Paste your draft to get editorial suggestions.
        </p>
      </div>

      {/* Input Card */}
      <div className="max-w-2xl mx-auto">
        <div
          style={{
            borderRadius: '12px',
            background: 'white',
            border: '1px solid #c7d2fe',
            overflow: 'hidden',
            marginBottom: loading || error ? '24px' : 0
          }}
        >
          <textarea
            id="research-assistant-text-input"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Paste your draft, thesis, or argument here..."
            disabled={loading}
            style={{
              width: '100%',
              height: '140px',
              padding: '16px',
              border: 'none',
              fontSize: '14px',
              lineHeight: '1.7',
              color: '#1e293b',
              backgroundColor: 'transparent',
              resize: 'none',
              outline: 'none',
              opacity: loading ? 0.5 : 1,
              fontFamily: 'inherit'
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: text.length > 4000 ? '#ef4444' : '#64748b', fontWeight: 500 }}>
                {text.length > 0 ? `${text.length.toLocaleString()} chars` : 'Up to 4,000 chars'}
              </span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                <kbd style={{
                  padding: '2px 5px',
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontFamily: 'monospace'
                }}>Cmd+Enter</kbd>
              </span>
            </div>
            <button
              onClick={onAnalyze}
              disabled={!canAnalyze}
              className="group"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: !canAnalyze
                  ? '#e2e8f0'
                  : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: !canAnalyze ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: !canAnalyze ? 'none' : '0 2px 8px rgba(79, 70, 229, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (canAnalyze) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (canAnalyze) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(79, 70, 229, 0.3)'
                }
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles style={{ width: '16px', height: '16px' }} />
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Analyses - Inside welcome container */}
      {!loading && !error && savedAnalyses.length > 0 && pendingFromHome === false && (
        <div className="mt-6 pt-6 border-t border-indigo-100">
          {/* Section Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-indigo-200">
              <History className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-gray-900 m-0">Recent Analyses</h3>
              <p className="text-[12px] text-gray-500 m-0">Click to view results</p>
            </div>
          </div>

          {/* Analysis Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {savedAnalyses.slice(0, 4).map((analysis) => (
              <button
                key={analysis.id}
                onClick={() => onLoadSavedAnalysis(analysis)}
                className="p-4 bg-white rounded-xl border border-indigo-200 text-left hover:border-indigo-400 hover:shadow-md transition-all group"
              >
                <div className="text-[13px] text-gray-800 font-medium mb-2 line-clamp-2">
                  {analysis.preview || analysis.text?.substring(0, 80)}
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(analysis.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  {analysis.cachedResult && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[10px] font-medium">
                      <CheckCircle className="w-2.5 h-2.5" />
                      Ready
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {savedAnalyses.length > 4 && (
            <div className="text-center mt-3">
              <Link
                href="/my-library"
                className="text-[12px] text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                +{savedAnalyses.length - 4} more in library
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, ArrowRight, AlertCircle, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AIEditorAnalyzeResponse } from '@/lib/ai-editor/types'
import { TERMINOLOGY } from '@/lib/constants/terminology'

const MAX_CHARS = 500
const MIN_CHARS = 10

interface MiniAIEditorProps {
  className?: string
}

export function MiniAIEditor({ className = '' }: MiniAIEditorProps) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AIEditorAnalyzeResponse | null>(null)

  const charCount = text.length
  const canAnalyze = charCount >= MIN_CHARS && charCount <= MAX_CHARS

  const handleAnalyze = async () => {
    if (!canAnalyze || isLoading) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/brain/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.')
      }

      const data: AIEditorAnalyzeResponse = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canAnalyze) {
      e.preventDefault()
      handleAnalyze()
    }
  }

  const handleFullAnalysis = () => {
    // Store text in sessionStorage so full editor can pick it up
    sessionStorage.setItem('miniEditorText', text)
    router.push('/ai-editor')
  }

  // Get first matched perspective and author for preview
  const firstCamp = result?.matchedCamps?.[0]
  const firstAuthor = firstCamp?.topAuthors?.[0]

  return (
    <div className={`w-full ${className}`}>
      {/* Input Area */}
      <div
        className="relative bg-white border border-[var(--color-light-gray)] overflow-hidden transition-all duration-200 hover:border-[var(--color-accent)]/30 focus-within:border-[var(--color-accent)] focus-within:shadow-sm"
        style={{
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setResult(null) // Clear result when text changes
            setError(null)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste your draft or thesis here..."
          disabled={isLoading}
          className="w-full px-4 py-4 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[var(--color-mid-gray)]/60"
          style={{
            height: '130px',
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--leading-relaxed)',
            fontFamily: 'var(--font-sans)',
          }}
        />

        {/* Footer with char count and button */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[var(--color-bone)] to-[var(--color-cloud)] border-t border-[var(--color-pale-gray)]">
          <span
            className={`text-xs ${
              charCount > MAX_CHARS
                ? 'text-red-500'
                : 'text-[var(--color-mid-gray)]'
            }`}
          >
            {charCount}/{MAX_CHARS}
          </span>

          <Button
            onClick={handleAnalyze}
            disabled={!canAnalyze || isLoading}
            className="gap-2"
            size="sm"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Analyze
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Keyboard hint */}
      <p
        className="mt-2 text-center text-[var(--color-mid-gray)]"
        style={{ fontSize: 'var(--text-caption)' }}
      >
        Press <kbd className="px-1.5 py-0.5 bg-[var(--color-cloud)] rounded text-xs">Cmd+Enter</kbd> to analyze
      </p>

      {/* Error State */}
      {error && (
        <div
          className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700"
          style={{ borderRadius: 'var(--radius-base)' }}
        >
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm">{error}</p>
            <button
              onClick={handleAnalyze}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Result Preview */}
      {result && firstCamp && (
        <div
          className="mt-4 p-5 bg-white border border-[var(--color-light-gray)] animate-fade-in"
          style={{
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Matched Perspective */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              <p
                className="text-[var(--color-mid-gray)] uppercase tracking-widest"
                style={{ fontSize: 'var(--text-caption)' }}
              >
                Matched {TERMINOLOGY.camp}
              </p>
            </div>
            <p
              className="font-semibold text-[var(--color-soft-black)]"
              style={{ fontSize: 'var(--text-h3)' }}
            >
              {firstCamp.campLabel}
            </p>
            <p
              className="mt-1.5 text-[var(--color-charcoal)]"
              style={{ fontSize: 'var(--text-small)', lineHeight: '1.5' }}
            >
              {firstCamp.explanation}
            </p>
          </div>

          {/* Top Author */}
          {firstAuthor && (
            <div className="pt-4 border-t border-[var(--color-pale-gray)]">
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center"
                >
                  <User size={16} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium text-[var(--color-soft-black)]"
                    style={{ fontSize: 'var(--text-small)' }}
                  >
                    {firstAuthor.name}
                  </p>
                  <p
                    className="text-[var(--color-charcoal)] line-clamp-2"
                    style={{ fontSize: 'var(--text-caption)', lineHeight: '1.4' }}
                  >
                    {firstAuthor.draftConnection}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium ${
                    firstAuthor.stance === 'agrees'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : firstAuthor.stance === 'disagrees'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {firstAuthor.stance === 'agrees'
                    ? 'Agrees'
                    : firstAuthor.stance === 'disagrees'
                    ? 'Challenges'
                    : 'Partial'}
                </span>
              </div>
            </div>
          )}

          {/* CTA to full analysis */}
          <button
            onClick={handleFullAnalysis}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent-hover)] transition-all hover:gap-3 group"
            style={{
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-small)',
              transition: 'all var(--duration-fast) var(--ease-out)',
            }}
          >
            See full analysis
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  )
}

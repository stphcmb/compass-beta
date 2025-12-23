'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight } from 'lucide-react'

const MAX_CHARS = 4000
const MIN_CHARS = 1

interface MiniAIEditorProps {
  className?: string
}

export function MiniAIEditor({ className = '' }: MiniAIEditorProps) {
  const router = useRouter()
  const [text, setText] = useState('')

  const charCount = text.length
  const canAnalyze = charCount >= MIN_CHARS && charCount <= MAX_CHARS

  const handleAnalyze = () => {
    if (!canAnalyze) return

    // Store text in sessionStorage and redirect to AI Editor
    sessionStorage.setItem('miniEditorText', text)
    router.push('/ai-editor')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canAnalyze) {
      e.preventDefault()
      handleAnalyze()
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Input Area - Glass morphism style */}
      <div
        className="relative overflow-hidden transition-all duration-300"
        style={{
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          border: '2px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <textarea
          id="mini-ai-editor-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your draft, thesis, or argument here..."
          className="w-full px-5 py-5 resize-none focus:outline-none placeholder:text-slate-400"
          style={{
            height: '140px',
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#1e293b',
            backgroundColor: 'transparent',
          }}
        />

        {/* Footer with char count and button */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '12px', color: charCount > MAX_CHARS ? '#ef4444' : '#64748b' }}>
              {charCount > 0 ? `${charCount.toLocaleString()} chars` : 'Up to 4,000 chars'}
            </span>
            <span className="hidden sm:inline" style={{ color: '#cbd5e1' }}>•</span>
            <span className="hidden sm:inline" style={{ fontSize: '12px', color: '#64748b' }}>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono">⌘↵</kbd>
            </span>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="group"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: !canAnalyze
                ? '#e2e8f0'
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: !canAnalyze ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: !canAnalyze
                ? 'none'
                : '0 4px 15px rgba(99, 102, 241, 0.4)',
            }}
            onMouseEnter={(e) => {
              if (canAnalyze) {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.5), 0 0 0 3px rgba(139, 92, 246, 0.2)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              if (canAnalyze) {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.4)'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            <Sparkles size={18} />
            Analyze
            <ArrowRight size={16} className="opacity-70" />
          </button>
        </div>
      </div>
    </div>
  )
}

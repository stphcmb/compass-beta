'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import AIEditorResults from '@/components/AIEditorResults'
import BackToTop from '@/components/BackToTop'
import { AlertCircle, ArrowLeft, Plus } from 'lucide-react'

interface SavedAnalysis {
  id: string
  text: string
  preview: string
  cachedResult: any
  timestamp: string
}

export default function AIEditorResultsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  // Load analysis from localStorage
  useEffect(() => {
    if (!id) return

    try {
      const savedAnalyses = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
      const found = savedAnalyses.find((a: SavedAnalysis) => a.id === id)

      if (found && found.cachedResult) {
        setAnalysis(found)
      } else {
        // Also check recent searches
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]')
        const recentFound = recentSearches.find((s: any) => s.id === id)

        if (recentFound && recentFound.cachedResult) {
          setAnalysis({
            id: recentFound.id,
            text: recentFound.fullText || recentFound.query,
            preview: recentFound.query,
            cachedResult: recentFound.cachedResult,
            timestamp: recentFound.timestamp
          })
        } else {
          setNotFound(true)
        }
      }
    } catch (e) {
      console.error('Error loading analysis:', e)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Header sidebarCollapsed={true} />
      <main
        ref={mainRef}
        className="flex-1 mt-16 overflow-y-auto"
      >
        <div className="w-full relative" style={{
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '100%'
        }}>
          {/* Gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
              style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-25"
              style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
            />
          </div>

          <div className="max-w-3xl mx-auto relative z-10" style={{ padding: '48px 24px' }}>
            {loading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px'
              }}>
                <div className="animate-spin" style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid #AADAF9',
                  borderTopColor: '#1075DC',
                  borderRadius: '50%'
                }} />
              </div>
            ) : notFound ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '48px 32px',
                textAlign: 'center',
                boxShadow: '0 4px 24px rgba(22, 41, 80, 0.08)'
              }}>
                <AlertCircle style={{
                  width: '48px',
                  height: '48px',
                  color: '#f59e0b',
                  margin: '0 auto 16px'
                }} />
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#162950',
                  marginBottom: '8px'
                }}>
                  Analysis Not Found
                </h2>
                <p style={{
                  color: '#64748b',
                  marginBottom: '24px',
                  fontSize: '15px'
                }}>
                  This analysis may have been deleted or doesn't exist in your browser.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <Link
                    href="/ai-editor"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      backgroundColor: '#0158AE',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'background-color 0.15s'
                    }}
                  >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    New Analysis
                  </Link>
                  <Link
                    href="/history"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      backgroundColor: 'transparent',
                      border: '1px solid #AADAF9',
                      color: '#162950',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    View History
                  </Link>
                </div>
              </div>
            ) : analysis ? (
              <AIEditorResults
                text={analysis.text}
                result={analysis.cachedResult}
                analysisId={analysis.id}
                timestamp={analysis.timestamp}
              />
            ) : null}
          </div>
        </div>
        <BackToTop containerRef={mainRef} />
      </main>
    </div>
  )
}

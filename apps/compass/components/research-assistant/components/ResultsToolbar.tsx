'use client'

import Link from 'next/link'
import { ArrowLeft, Copy, FileDown, Share2, Bookmark, Sparkles } from 'lucide-react'

/**
 * Ref targets for section scrolling
 */
export interface ScrollRefs {
  summaryRef: React.RefObject<HTMLDivElement | null>
  suggestionsRef: React.RefObject<HTMLDivElement | null>
  authorsRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Props for ResultsToolbar component
 */
export interface ResultsToolbarProps {
  /** Original text being analyzed - used to build "Start Drafting" link */
  text: string
  /** Total number of authors across all camps */
  authorCount: number
  /** Refs for scrolling to sections */
  scrollRefs: ScrollRefs
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
}

/**
 * ResultsToolbar - Toolbar for analysis results
 * Contains navigation links, section jump buttons, and action buttons (copy, export, share, save)
 */
export function ResultsToolbar({
  text,
  authorCount,
  scrollRefs,
  savedOnce,
  saving,
  copying,
  exporting,
  urlCopied,
  onNewAnalysis,
  onCopy,
  onExportPDF,
  onShareUrl,
  onSave
}: ResultsToolbarProps) {
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Left: Back button */}
        <button
          onClick={onNewAnalysis}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
            e.currentTarget.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#6b7280'
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          New Analysis
        </button>

        {/* Center: Navigation - Jump to section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px',
          backgroundColor: '#DCF2FA',
          borderRadius: '10px'
        }}>
          <span style={{ fontSize: '11px', color: '#64748b', padding: '0 8px' }}>Jump to:</span>
          <button
            onClick={() => scrollToSection(scrollRefs.summaryRef)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#0158AE',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.15s ease'
            }}
          >
            Summary
          </button>
          <button
            onClick={() => scrollToSection(scrollRefs.suggestionsRef)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#162950',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)'
              e.currentTarget.style.color = '#0158AE'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#162950'
            }}
          >
            Editorial Tips
          </button>
          <button
            onClick={() => scrollToSection(scrollRefs.authorsRef)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#162950',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)'
              e.currentTarget.style.color = '#0158AE'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#162950'
            }}
          >
            {authorCount} Authors
          </button>
        </div>

        {/* Right: Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onCopy}
            disabled={copying}
            title="Copy analysis"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              backgroundColor: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#6b7280',
              cursor: copying ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!copying) {
                e.currentTarget.style.backgroundColor = '#f9fafb'
                e.currentTarget.style.borderColor = '#d1d5db'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <Copy style={{ width: '16px', height: '16px' }} />
          </button>
          <button
            onClick={onExportPDF}
            disabled={exporting}
            title="Export as PDF"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              backgroundColor: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#6b7280',
              cursor: exporting ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!exporting) {
                e.currentTarget.style.backgroundColor = '#f9fafb'
                e.currentTarget.style.borderColor = '#d1d5db'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <FileDown style={{ width: '16px', height: '16px' }} />
          </button>
          <button
            onClick={onShareUrl}
            title="Copy link to share"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              backgroundColor: urlCopied ? '#dcfce7' : 'transparent',
              border: urlCopied ? '1px solid #86efac' : '1px solid #e5e7eb',
              borderRadius: '8px',
              color: urlCopied ? '#16a34a' : '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!urlCopied) {
                e.currentTarget.style.backgroundColor = '#f9fafb'
                e.currentTarget.style.borderColor = '#d1d5db'
              }
            }}
            onMouseLeave={(e) => {
              if (!urlCopied) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }
            }}
          >
            <Share2 style={{ width: '16px', height: '16px' }} />
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            title={savedOnce ? 'Saved' : 'Save analysis'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: savedOnce ? '#0158AE' : 'transparent',
              border: savedOnce ? '1px solid #0158AE' : '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              color: savedOnce ? 'white' : '#0158AE',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!saving && !savedOnce) {
                e.currentTarget.style.backgroundColor = '#DCF2FA'
                e.currentTarget.style.borderColor = '#48AFF0'
              }
            }}
            onMouseLeave={(e) => {
              if (!saving && !savedOnce) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }
            }}
          >
            <Bookmark style={{ width: '14px', height: '14px', fill: savedOnce ? 'white' : 'none' }} />
            {savedOnce ? 'Saved' : 'Save'}
          </button>
          <Link
            href={`/studio/builder?thesis=${encodeURIComponent(text.substring(0, 200))}`}
            title="Start drafting content based on this analysis"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.35)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(124, 58, 237, 0.25)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <Sparkles style={{ width: '14px', height: '14px' }} />
            Start Drafting
          </Link>
        </div>
      </div>
    </div>
  )
}

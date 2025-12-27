'use client'

import { useRef } from 'react'
import Header from '@/components/Header'
import AIEditor from '@/components/AIEditor'
import BackToTop from '@/components/BackToTop'

export default function AIEditorPage() {
  const mainRef = useRef<HTMLElement>(null)

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Header sidebarCollapsed={true} />
      <main
        ref={mainRef}
        className="flex-1 mt-16 overflow-y-auto"
      >
        {/* Hero-style background for consistency */}
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
            <AIEditor showTitle={true} />
          </div>
        </div>
        <BackToTop containerRef={mainRef} />
      </main>
    </div>
  )
}

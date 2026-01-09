'use client'

import { useRef } from 'react'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import AIEditor from '@/components/AIEditor'
import BackToTop from '@/components/BackToTop'
import { Sparkles } from 'lucide-react'

export default function AIEditorPage() {
  const mainRef = useRef<HTMLElement>(null)

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <Header sidebarCollapsed={true} />
      <main
        ref={mainRef}
        className="flex-1 mt-16 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-indigo-50/30"
      >
        <div className="max-w-4xl mx-auto" style={{ padding: '24px' }}>
          {/* Page Header */}
          <PageHeader
            icon={<Sparkles size={24} />}
            iconVariant="navy"
            title="AI Editor"
            subtitle="Analyze your content to discover aligned perspectives and thought leaders"
          />

          {/* AI Editor Component */}
          <AIEditor showTitle={false} />
        </div>
        <BackToTop containerRef={mainRef} />
      </main>
    </div>
  )
}

'use client'

import { useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import AIEditor from '@/components/AIEditor'
import BackToTop from '@/components/BackToTop'
import { HowAIEditorWorksModal, useHowAIEditorWorksModal } from '@/components/HowAIEditorWorksModal'
import { Sparkles } from 'lucide-react'

function AIEditorPageContent() {
  const mainRef = useRef<HTMLElement>(null)
  const searchParams = useSearchParams()
  const analysisId = searchParams.get('analysis')
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useHowAIEditorWorksModal()

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
            subtitle="Refine your writing with AI-powered insights from 200+ thought leaders."
            helpButton={{
              label: 'How it works',
              onClick: openModal
            }}
          />

          {/* How it works Modal */}
          <HowAIEditorWorksModal isOpen={isModalOpen} onClose={closeModal} />

          {/* AI Editor Component */}
          <AIEditor showTitle={false} initialAnalysisId={analysisId} />
        </div>
        <BackToTop containerRef={mainRef} />
      </main>
    </div>
  )
}

export default function AIEditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-page-bg)' }}>
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <AIEditorPageContent />
    </Suspense>
  )
}

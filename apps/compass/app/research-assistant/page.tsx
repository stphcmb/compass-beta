'use client'

import { useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import ResearchAssistant from '@/components/ResearchAssistant'
import BackToTop from '@/components/BackToTop'
import { HowResearchAssistantWorksModal, useHowResearchAssistantWorksModal } from '@/components/HowResearchAssistantWorksModal'
import { Search } from 'lucide-react'

function ResearchAssistantPageContent() {
  const mainRef = useRef<HTMLElement>(null)
  const searchParams = useSearchParams()
  const analysisId = searchParams.get('analysis')
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useHowResearchAssistantWorksModal()

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
            icon={<Search size={24} />}
            iconVariant="navy"
            title="AI Editor"
            subtitle="Find supporting experts and perspectives from 200+ thought leaders."
            helpButton={{
              label: 'How it works',
              onClick: openModal
            }}
          />

          {/* How it works Modal */}
          <HowResearchAssistantWorksModal isOpen={isModalOpen} onClose={closeModal} />

          {/* AI Editor Component */}
          <ResearchAssistant showTitle={false} initialAnalysisId={analysisId} />
        </div>
        <BackToTop containerRef={mainRef} />
      </main>
    </div>
  )
}

export default function ResearchAssistantPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-page-bg)' }}>
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <ResearchAssistantPageContent />
    </Suspense>
  )
}

'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import BackToTop from '@/components/BackToTop'
import { useHowResearchAssistantWorksModal } from '@/components/HowResearchAssistantWorksModal'
import { Search } from 'lucide-react'
import { TERMINOLOGY } from '@/lib/constants/terminology'

// Lazy load heavy components for better performance
const ResearchAssistant = dynamic(
  () => import('@/components/ResearchAssistant'),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading research assistant...</div>
      </div>
    ),
    ssr: false, // This component has client-side only features
  }
)

const HowResearchAssistantWorksModal = dynamic(
  () =>
    import('@/components/HowResearchAssistantWorksModal').then(
      (mod) => mod.HowResearchAssistantWorksModal
    ),
  { ssr: false }
)

interface ResearchAssistantClientProps {
  initialAnalysisId: string | null
}

export default function ResearchAssistantClient({
  initialAnalysisId,
}: ResearchAssistantClientProps) {
  const mainRef = useRef<HTMLElement>(null)
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
            title={TERMINOLOGY.researchAssistant}
            subtitle="Validate your writing against 200+ thought leaders. Find supporting experts and discover gaps."
            helpButton={{
              label: 'How it works',
              onClick: openModal,
            }}
          />

          {/* How it works Modal */}
          {isModalOpen && (
            <HowResearchAssistantWorksModal isOpen={isModalOpen} onClose={closeModal} />
          )}

          {/* AI Editor Component - Lazy loaded */}
          <ResearchAssistant showTitle={false} initialAnalysisId={initialAnalysisId} />
        </div>
        <BackToTop containerRef={mainRef} />
      </main>
    </div>
  )
}

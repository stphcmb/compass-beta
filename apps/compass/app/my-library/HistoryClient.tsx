'use client'

import dynamic from 'next/dynamic'

/**
 * Lazy load the massive history page implementation
 * This allows the initial page shell to load fast while
 * the heavy component bundles are loaded in the background
 */
const HistoryPageContent = dynamic(() => import('./HistoryPageContent'), {
  loading: () => (
    <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" />
        <p className="mt-4 text-gray-600">Loading your library...</p>
      </div>
    </div>
  ),
  ssr: false, // This component is client-side heavy, skip SSR
})

export default function HistoryClient() {
  return <HistoryPageContent />
}

'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

/**
 * Lazy load the massive history page implementation
 * This allows the initial page shell to load fast while
 * the heavy component bundles are loaded in the background
 */
const HistoryPageContent = dynamic(() => import('./HistoryPageContent'), {
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-gray-600">Loading your library...</p>
      </div>
    </div>
  ),
  ssr: false, // This component is client-side heavy, skip SSR
})

export default function HistoryClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoryPageContent />
    </Suspense>
  )
}

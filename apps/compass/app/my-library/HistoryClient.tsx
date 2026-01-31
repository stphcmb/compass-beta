'use client'

import dynamic from 'next/dynamic'
import { BookOpen } from 'lucide-react'

/**
 * Loading skeleton that matches the library layout
 * Shows immediately on server and client for seamless loading
 */
function LibraryLoadingSkeleton() {
  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      {/* Header placeholder */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50" />

      <main className="flex-1 mt-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Library</h1>
                <p className="text-sm text-gray-500">Your saved analyses and research history</p>
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4 animate-pulse">
            {/* Search/filter bar */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
              <div className="h-10 w-32 bg-gray-200 rounded-lg" />
            </div>

            {/* History items */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-100 rounded" />
                    <div className="flex gap-2 mt-3">
                      <div className="h-6 w-16 bg-gray-100 rounded-full" />
                      <div className="h-6 w-20 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

/**
 * Lazy load the massive history page implementation
 * This allows the initial page shell to load fast while
 * the heavy component bundles are loaded in the background
 *
 * NOTE: ssr: true (default) so the loading skeleton renders on server
 * This eliminates the blank screen flash during initial load
 */
const HistoryPageContent = dynamic(() => import('./HistoryPageContent'), {
  loading: () => <LibraryLoadingSkeleton />,
  // Removed ssr: false to allow server-side loading skeleton
})

export default function HistoryClient() {
  return <HistoryPageContent />
}

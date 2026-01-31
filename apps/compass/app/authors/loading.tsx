import { Users } from 'lucide-react'

/**
 * Loading skeleton for authors page
 * Shown during navigation/refresh while Server Component fetches data
 * Matches the actual page layout to prevent layout shift
 */
export default function Loading() {
  const SIDEBAR_WIDTH = 320

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg, #f9fafb)' }}>
      {/* Header placeholder - matches actual header position */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Sidebar skeleton */}
      <aside
        className="fixed top-16 h-[calc(100vh-64px)] border-r border-gray-200 overflow-hidden"
        style={{
          left: 0,
          width: `${SIDEBAR_WIDTH}px`,
          backgroundColor: 'var(--color-air-white, #ffffff)'
        }}
      >
        <div className="p-4 space-y-4 animate-pulse">
          {/* Sidebar header */}
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-300" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-5 w-8 bg-gray-200 rounded-full ml-auto" />
          </div>

          {/* Search box */}
          <div className="h-9 bg-gray-100 rounded-lg border border-gray-200" />

          {/* Filter dropdown */}
          <div className="h-9 bg-gray-100 rounded-lg border border-gray-200" />

          {/* Author list skeleton */}
          <div className="space-y-1 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded">
                <div className="h-4 bg-gray-200 rounded" style={{ width: `${60 + (i % 3) * 20}%` }} />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="flex-1 mt-16 overflow-y-auto" style={{ marginLeft: `${SIDEBAR_WIDTH}px` }}>
        <div className="h-full bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center animate-pulse">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
            <div className="h-6 w-48 bg-gray-200 rounded mx-auto" />
            <div className="h-4 w-64 bg-gray-100 rounded mx-auto" />
          </div>
        </div>
      </main>
    </div>
  )
}

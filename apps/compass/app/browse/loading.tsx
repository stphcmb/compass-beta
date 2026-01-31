import { Compass } from 'lucide-react'

/**
 * Loading skeleton for browse/explore page
 * Shows immediately from server before any JS loads
 */
export default function BrowseLoading() {
  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--color-page-bg, #f9fafb)' }}>
      {/* Header placeholder */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 mt-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Page header */}
          <div className="mb-8 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Compass className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="h-8 w-64 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-96 bg-gray-100 rounded" />
          </div>

          {/* Search bar skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-14 bg-white border border-gray-200 rounded-xl shadow-sm" />
          </div>

          {/* Domain overview skeleton - grid of domain cards */}
          <div className="animate-pulse">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="h-6 w-16 bg-gray-100 rounded-full" />
                    <div className="h-6 w-20 bg-gray-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

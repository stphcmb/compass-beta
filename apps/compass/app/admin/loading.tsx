import { Shield } from 'lucide-react'

/**
 * Instant loading state for admin page
 * This is rendered by Next.js on the server before any client JS loads,
 * eliminating the blank screen flash during navigation and initial load.
 */
export default function AdminLoading() {
  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg, #f9fafb)' }}>
      {/* Header placeholder */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50" />

      <main className="flex-1 mt-16 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Monitor canon health and take action on issues</p>
              </div>
            </div>
          </div>

          {/* Tab bar skeleton */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-36 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-36 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Dashboard skeleton */}
          <div className="space-y-6 animate-pulse">
            {/* Health Score Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-48 bg-gray-200 rounded" />
                  <div className="h-4 w-80 bg-gray-200 rounded" />
                  <div className="flex gap-4">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-20 bg-gray-100 rounded-lg" />
                <div className="h-20 bg-gray-100 rounded-lg" />
              </div>
            </div>

            {/* Insights Grid */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-40 bg-gray-100 rounded-lg" />
                <div className="h-40 bg-gray-100 rounded-lg" />
                <div className="h-40 bg-gray-100 rounded-lg" />
                <div className="h-40 bg-gray-100 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

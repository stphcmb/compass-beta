export default function Loading() {
  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <div className="flex-1 mt-16 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="max-w-6xl mx-auto" style={{ padding: '24px' }}>
          {/* Header skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded"></div>
          </div>

          {/* Input area skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 animate-pulse">
            <div className="h-32 bg-gray-100 rounded mb-4"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="h-24 bg-white rounded-lg border border-gray-200 animate-pulse"></div>
            <div className="h-24 bg-white rounded-lg border border-gray-200 animate-pulse"></div>
            <div className="h-24 bg-white rounded-lg border border-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

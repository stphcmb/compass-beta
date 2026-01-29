/**
 * Loading skeleton for authors page
 * Shown during navigation/refresh while Server Component fetches data
 */
export default function Loading() {
  const SIDEBAR_WIDTH = 320

  return (
    <div className="h-screen flex bg-[var(--color-page-bg)]">
      {/* Sidebar skeleton */}
      <aside
        className="fixed top-16 h-[calc(100vh-64px)] border-r border-gray-200"
        style={{
          left: 0,
          width: `${SIDEBAR_WIDTH}px`,
          backgroundColor: 'var(--color-air-white)'
        }}
      >
        <div className="p-6 space-y-4">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 bg-gray-200 rounded animate-pulse" />
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="flex-1 mt-16 overflow-y-auto" style={{ marginLeft: `${SIDEBAR_WIDTH}px` }}>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-96 bg-gray-100 border border-gray-200 rounded-lg animate-pulse" />
        </div>
      </main>
    </div>
  )
}

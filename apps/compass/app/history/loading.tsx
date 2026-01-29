/**
 * Loading UI for history/library page
 * Shows while page is being generated
 */
export default function Loading() {
  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-page-bg)' }}
    >
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-gray-600 font-medium">Loading your library...</p>
      </div>
    </div>
  )
}

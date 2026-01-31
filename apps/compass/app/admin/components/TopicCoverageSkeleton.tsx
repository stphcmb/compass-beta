/**
 * Skeleton loading component for the Topic Coverage Dashboard tab.
 * Provides visual feedback while topic coverage data is being fetched.
 */
export function TopicCoverageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Coverage Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gray-200" />
            <div>
              <div className="h-6 w-52 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-80 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="h-8 w-20 bg-gray-100 rounded-lg" />
        </div>

        {/* Coverage distribution bar */}
        <div className="mb-4">
          <div className="h-4 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Fast-Moving Topics Alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-orange-200" />
          <div className="h-5 w-64 bg-orange-200 rounded" />
        </div>
        <div className="h-4 w-96 bg-orange-100 rounded mb-4" />

        {/* Fast-moving topic cards */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-40 bg-gray-200 rounded" />
                  <div className="h-5 w-16 bg-orange-100 rounded-full" />
                  <div className="w-3 h-3 rounded bg-orange-200" />
                </div>
                <div className="h-4 w-72 bg-gray-200 rounded mb-2" />
                <div className="h-16 bg-orange-50 rounded-lg border border-orange-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Needing Attention */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gray-200" />
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
          </div>
        </div>

        {/* Topic list items */}
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-44 bg-gray-200 rounded" />
                    <div className="h-5 w-16 bg-gray-100 rounded-full" />
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                  <div className="h-12 bg-gray-50 rounded border border-gray-200" />
                </div>
                <div className="text-right">
                  <div className="h-8 w-8 bg-gray-100 rounded" />
                  <div className="h-3 w-8 bg-gray-100 rounded mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Experience Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-blue-200" />
          <div className="h-5 w-64 bg-blue-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-blue-100 rounded" />
          <div className="h-4 w-full bg-blue-100 rounded" />
          <div className="h-4 w-3/4 bg-blue-100 rounded" />
          <div className="h-4 w-full bg-blue-100 rounded" />
        </div>
      </div>
    </div>
  )
}

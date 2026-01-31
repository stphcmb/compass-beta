/**
 * Skeleton loading component for the Curation Queue Dashboard tab.
 * Provides visual feedback while curation queue data is being fetched.
 */
export function CurationQueueSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Queue Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gray-200" />
            <div>
              <div className="h-6 w-36 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-80 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="h-8 w-20 bg-gray-100 rounded-lg" />
        </div>

        {/* Summary stats - 4 column grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="h-8 w-8 bg-red-200 rounded mb-1" />
            <div className="h-3 w-12 bg-red-200 rounded" />
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="h-8 w-8 bg-orange-200 rounded mb-1" />
            <div className="h-3 w-20 bg-orange-200 rounded" />
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="h-8 w-8 bg-amber-200 rounded mb-1" />
            <div className="h-3 w-14 bg-amber-200 rounded" />
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="h-8 w-8 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
        </div>

        {/* What agents do info box */}
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded bg-indigo-200" />
            <div className="h-5 w-36 bg-indigo-200 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded bg-indigo-100 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-full bg-indigo-100 rounded" />
                <div className="h-4 w-3/4 bg-indigo-100 rounded" />
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded bg-indigo-100 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-full bg-indigo-100 rounded" />
                <div className="h-4 w-3/4 bg-indigo-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="h-5 w-40 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-80 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 bg-gray-100 rounded-lg" />
              <div className="h-8 w-20 bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Queue items */}
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className="p-4">
              <div className="flex items-start justify-between gap-4">
                {/* Checkbox placeholder */}
                <div className="flex items-start pt-1">
                  <div className="w-4 h-4 rounded border border-gray-300 bg-gray-50" />
                </div>

                {/* Author info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 w-36 bg-gray-200 rounded" />
                    <div className="h-5 w-16 bg-gray-100 rounded-full" />
                  </div>

                  <div className="h-4 w-48 bg-gray-100 rounded mb-2" />

                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <div className="h-5 w-24 bg-gray-100 rounded" />
                    <div className="h-5 w-28 bg-gray-100 rounded" />
                    <div className="h-5 w-20 bg-gray-100 rounded" />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <div className="h-8 w-20 bg-gray-100 rounded-lg" />
                  <div className="h-8 w-24 bg-indigo-100 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

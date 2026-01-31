/**
 * Skeleton loading component for the Canon Health Dashboard tab.
 * Provides visual feedback while health metrics are being fetched.
 */
export function CanonHealthSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Health Score Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            {/* Grade Circle */}
            <div className="w-24 h-24 rounded-full bg-gray-200" />

            {/* Summary */}
            <div className="space-y-3">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-80 bg-gray-200 rounded" />
              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Refresh button placeholder */}
          <div className="h-8 w-20 bg-gray-100 rounded-lg" />
        </div>

        {/* Canon Source Timeline */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-6 w-24 bg-gray-200 rounded" />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-6 w-24 bg-gray-200 rounded" />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="h-3 w-28 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-36 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Priority Actions Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gray-200" />
            <div className="h-6 w-36 bg-gray-200 rounded" />
            <div className="h-5 w-16 bg-gray-100 rounded-full" />
          </div>
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>

        {/* Action items */}
        <div className="px-4 pb-4 space-y-3">
          <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-gray-200 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-48 bg-gray-200 rounded" />
                  <div className="h-5 w-16 bg-gray-100 rounded-full" />
                </div>
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-gray-200 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-52 bg-gray-200 rounded" />
                  <div className="h-5 w-12 bg-gray-100 rounded-full" />
                </div>
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights Section - 2x2 Grid */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gray-200" />
            <div className="h-6 w-28 bg-gray-200 rounded" />
          </div>
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>

        <div className="px-4 pb-4 grid grid-cols-2 gap-4">
          {/* Source Freshness */}
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded bg-gray-200" />
              <div className="h-5 w-32 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-8 bg-gray-200 rounded" />
              </div>
              <div className="h-2 bg-gray-100 rounded-full" />
            </div>
            <div className="h-16 bg-gray-50 rounded-lg" />
          </div>

          {/* Author Coverage */}
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded bg-gray-200" />
              <div className="h-5 w-32 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-8 bg-gray-200 rounded" />
              </div>
              <div className="h-2 bg-gray-100 rounded-full" />
            </div>
            <div className="h-16 bg-gray-50 rounded-lg" />
          </div>

          {/* Domain Health */}
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded bg-gray-200" />
              <div className="h-5 w-28 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-16 bg-gray-50 rounded-lg" />
          </div>

          {/* Data Quality */}
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded bg-gray-200" />
              <div className="h-5 w-24 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-4 w-8 bg-gray-200 rounded" />
              </div>
              <div className="h-2 bg-gray-100 rounded-full" />
            </div>
            <div className="h-16 bg-gray-50 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Domain Breakdown Section (collapsed by default) */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gray-200" />
            <div className="h-6 w-36 bg-gray-200 rounded" />
          </div>
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Authors Needing Updates Section (collapsed by default) */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gray-200" />
            <div className="h-6 w-44 bg-gray-200 rounded" />
            <div className="h-4 w-12 bg-gray-100 rounded" />
          </div>
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Camps Needing Attention Section (collapsed by default) */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gray-200" />
            <div className="h-6 w-44 bg-gray-200 rounded" />
            <div className="h-4 w-12 bg-gray-100 rounded" />
          </div>
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}

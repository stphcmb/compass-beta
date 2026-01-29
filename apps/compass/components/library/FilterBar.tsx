import { Search, Filter, X, Calendar, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

export type TimeFilter = 'all' | 'today' | 'week' | 'month'
export type TypeFilter = 'all' | 'searches' | 'analyses' | 'insights' | 'authors'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  timeFilter: TimeFilter
  onTimeFilterChange: (filter: TimeFilter) => void
  typeFilter: TypeFilter
  onTypeFilterChange: (filter: TypeFilter) => void
  resultCount?: number
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  timeFilter,
  onTimeFilterChange,
  typeFilter,
  onTypeFilterChange,
  resultCount,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false)

  const timeFilterOptions: { value: TimeFilter; label: string }[] = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ]

  const typeFilterOptions: { value: TypeFilter; label: string }[] = [
    { value: 'all', label: 'All Items' },
    { value: 'searches', label: 'Searches' },
    { value: 'analyses', label: 'Analyses' },
    { value: 'insights', label: 'Insights' },
    { value: 'authors', label: 'Authors' },
  ]

  const hasActiveFilters = timeFilter !== 'all' || typeFilter !== 'all' || searchQuery !== ''

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg font-medium transition-colors ${
            hasActiveFilters
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {[timeFilter !== 'all', typeFilter !== 'all', searchQuery !== ''].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          {/* Time Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Time Period
            </label>
            <div className="flex flex-wrap gap-2">
              {timeFilterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onTimeFilterChange(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    timeFilter === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4" />
              Content Type
            </label>
            <div className="flex flex-wrap gap-2">
              {typeFilterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onTypeFilterChange(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                onSearchChange('')
                onTimeFilterChange('all')
                onTypeFilterChange('all')
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Result Count */}
      {resultCount !== undefined && (
        <div className="text-sm text-gray-600">
          {resultCount} {resultCount === 1 ? 'item' : 'items'} found
        </div>
      )}
    </div>
  )
}

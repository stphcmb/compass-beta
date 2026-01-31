'use client'

import { useState, lazy, Suspense, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Shield,
  Activity,
  MessageSquare,
  Search,
  Users
} from 'lucide-react'
import Header from '@/components/Header'
import { AdminMetrics } from './data'
import {
  CanonHealthSkeleton,
  TopicCoverageSkeleton,
  CurationQueueSkeleton
} from './components/skeletons'

// Lazy load dashboard components for code splitting
const CanonHealthDashboard = lazy(() => import('./components/CanonHealthDashboard'))
const TopicCoverageDashboard = lazy(() => import('./components/TopicCoverageDashboard'))
const CurationQueueDashboard = lazy(() => import('./components/CurationQueueDashboard'))

interface AdminPageClientProps {
  initialMetrics: AdminMetrics
  initialTab?: string
}

export function AdminPageClient({ initialMetrics, initialTab = 'canon-health' }: AdminPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize tab from prop (set by server), then sync with URL
  const [activeTab, setActiveTab] = useState(initialTab)

  // Sync tab with URL changes (for browser back/forward)
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams, activeTab])

  // Local state for refreshed data
  const [metrics, setMetrics] = useState(initialMetrics)

  // Tab change handler - updates URL for deep linking
  const changeTab = (newTab: string) => {
    setActiveTab(newTab)
    router.push(`/admin?tab=${newTab}`, { scroll: false })
  }

  // Refresh handler for individual dashboards
  const handleRefresh = useCallback(async (endpoint: string) => {
    try {
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error('Refresh failed')
      const data = await res.json()

      if (endpoint.includes('canon-health')) {
        setMetrics(prev => ({ ...prev, canonHealth: data }))
      } else if (endpoint.includes('topic-coverage')) {
        setMetrics(prev => ({ ...prev, topicCoverage: data }))
      } else if (endpoint.includes('curation')) {
        setMetrics(prev => ({ ...prev, curationQueue: data }))
      }
    } catch (error) {
      console.error('Refresh failed:', error)
    }
  }, [])

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <Header sidebarCollapsed={true} />

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

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => changeTab('canon-health')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'canon-health'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Activity className="w-4 h-4 inline-block mr-2" />
              Canon Health
            </button>
            <button
              onClick={() => changeTab('topic-coverage')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'topic-coverage'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline-block mr-2" />
              Topic Coverage
            </button>
            <button
              onClick={() => changeTab('curation-queue')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'curation-queue'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Search className="w-4 h-4 inline-block mr-2" />
              Curation Queue
            </button>
            <button
              onClick={() => changeTab('usage')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'usage'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Usage (Coming Soon)
            </button>
          </div>

          {/* Tab Content with Lazy Loading */}
          {activeTab === 'canon-health' && (
            <Suspense fallback={<CanonHealthSkeleton />}>
              <CanonHealthDashboard
                data={metrics.canonHealth}
                onRefresh={() => handleRefresh('/api/admin/canon-health')}
              />
            </Suspense>
          )}

          {activeTab === 'topic-coverage' && (
            <Suspense fallback={<TopicCoverageSkeleton />}>
              <TopicCoverageDashboard
                data={metrics.topicCoverage}
                onRefresh={() => handleRefresh('/api/admin/topic-coverage')}
              />
            </Suspense>
          )}

          {activeTab === 'curation-queue' && (
            <Suspense fallback={<CurationQueueSkeleton />}>
              <CurationQueueDashboard
                data={metrics.curationQueue}
                onRefresh={() => handleRefresh('/api/admin/curation/queue')}
              />
            </Suspense>
          )}

          {activeTab === 'usage' && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Analytics</h3>
              <p className="text-gray-500">Coming soon. Track API usage, search queries, and user activity.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

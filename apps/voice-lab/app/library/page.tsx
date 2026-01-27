'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import VoiceProfileCard from '@/components/voice-lab/VoiceProfileCard'
import { Library, Plus, Loader2, Filter, Mic, Sparkles, RefreshCw } from 'lucide-react'
import type { VoiceProfile, VoiceTrainingStatus } from '@/lib/voice-lab/types'

type StatusFilter = VoiceTrainingStatus | 'all'

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ready', label: 'Ready' },
  { value: 'processing', label: 'Processing' },
  { value: 'needs_update', label: 'Needs Update' },
]

export default function VoiceLibraryPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<VoiceProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [loadingExamples, setLoadingExamples] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [statusCounts, setStatusCounts] = useState<Record<StatusFilter, number>>({
    all: 0,
    ready: 0,
    processing: 0,
    needs_update: 0,
  })

  // Fetch profiles function
  const fetchProfiles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.set('status', statusFilter)
      }

      const res = await fetch(`/api/voice-lab/profiles?${params.toString()}`)
      if (!res.ok) {
        throw new Error('Failed to fetch profiles')
      }

      const data = await res.json()
      setProfiles(data.profiles || [])

      // Calculate counts
      if (statusFilter === 'all') {
        const counts: Record<StatusFilter, number> = {
          all: data.profiles.length,
          ready: 0,
          processing: 0,
          needs_update: 0,
        }
        data.profiles.forEach((p: VoiceProfile) => {
          const status = p.training_status as VoiceTrainingStatus
          if (status in counts) {
            counts[status]++
          }
        })
        setStatusCounts(counts)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profiles')
    } finally {
      setLoading(false)
    }
  }

  // Fetch profiles on mount and filter change
  useEffect(() => {
    fetchProfiles()
  }, [statusFilter])

  // Load example profiles
  const handleLoadExamples = async (force = false) => {
    setLoadingExamples(true)
    setError(null)
    setSuccessMessage(null)
    try {
      const url = force
        ? '/api/voice-lab/seed-examples?force=true'
        : '/api/voice-lab/seed-examples'

      const res = await fetch(url, {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load examples')
      }

      // Show success message
      if (data.skipped) {
        setSuccessMessage('Examples exist. Click ↻ to refresh.')
      } else {
        const count = data.profiles?.length || 5
        const insights = data.profiles?.reduce((sum: number, p: { insightsExtracted?: number }) => sum + (p.insightsExtracted || 0), 0) || 0
        setSuccessMessage(`Created ${count} profiles with ${insights} insights!`)
      }

      // Refresh the profiles list
      await fetchProfiles()

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load examples')
    } finally {
      setLoadingExamples(false)
    }
  }

  const handleApplyVoice = (profileId: string) => {
    // Navigate to voice-lab workflow page with profile pre-selected
    router.push(`/voice-lab?profile=${profileId}`)
  }

  // Filter profiles based on status
  const filteredProfiles = statusFilter === 'all'
    ? profiles
    : profiles.filter((p) => p.training_status === statusFilter)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container max-w-5xl mx-auto px-4 py-8">
        <PageHeader
          icon={<Library className="w-6 h-6" />}
          title="Voice Library"
          subtitle="Browse and manage your voice profiles"
          iconVariant="purple"
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleLoadExamples(false)}
                disabled={loadingExamples}
                className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                title="Load example voice profiles"
              >
                {loadingExamples ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {loadingExamples ? 'Loading...' : 'Load Examples'}
              </button>
              <button
                onClick={() => handleLoadExamples(true)}
                disabled={loadingExamples}
                className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                title="Delete and recreate example profiles with latest samples"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <Link
                href="/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Profile
              </Link>
            </div>
          }
        />

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white rounded-lg border border-gray-200 p-1 w-fit overflow-x-auto max-w-full">
          {STATUS_TABS.map((tab) => {
            const count = statusCounts[tab.value]
            const isActive = statusFilter === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                  ${isActive
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`ml-1.5 text-xs ${isActive ? 'text-violet-500' : 'text-gray-400'}`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
            <span className="ml-2 text-gray-500">Loading profiles...</span>
          </div>
        )}

        {/* Success message */}
        {successMessage && !loading && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mb-4">
            {successMessage}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredProfiles.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-violet-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {statusFilter === 'all'
                ? 'No voice profiles yet'
                : `No ${statusFilter.replace('_', ' ')} profiles`}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {statusFilter === 'all'
                ? 'Create your first voice profile to capture your unique writing style and apply it to your content.'
                : 'No profiles match this filter. Try selecting a different status.'}
            </p>
            {statusFilter === 'all' && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleLoadExamples(false)}
                  disabled={loadingExamples}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {loadingExamples ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {loadingExamples ? 'Loading...' : 'Load Examples'}
                </button>
                <Link
                  href="/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Profile
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Profile list */}
        {!loading && !error && filteredProfiles.length > 0 && (
          <div className="space-y-3">
            {filteredProfiles.map((profile) => (
              <VoiceProfileCard
                key={profile.id}
                profile={profile}
                onApplyVoice={handleApplyVoice}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

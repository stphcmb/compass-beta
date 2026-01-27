'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import SampleCard from '@/components/voice-lab/SampleCard'
import InsightCard, { groupInsightsByType } from '@/components/voice-lab/InsightCard'
import LabelEditor from '@/components/voice-lab/LabelEditor'
import AddSampleModal from '@/components/voice-lab/AddSampleModal'
import {
  Mic,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  FileText,
  Lightbulb,
  RefreshCw,
  ArrowRight,
  Trash2,
  Edit2,
  Check,
  X,
  Plus,
  BookOpen,
} from 'lucide-react'
import type {
  VoiceProfile,
  VoiceSample,
  VoiceInsight,
  VoiceTrainingStatus,
  VoiceSampleCategory,
  CategoryStats,
} from '@/lib/voice-lab/types'

type TabType = 'samples' | 'insights'

const statusConfig: Record<VoiceTrainingStatus, { label: string; color: string; bgColor: string }> = {
  ready: { label: 'Ready', color: 'text-green-700', bgColor: 'bg-green-100' },
  processing: { label: 'Processing', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  needs_update: { label: 'Needs Update', color: 'text-blue-700', bgColor: 'bg-blue-100' },
}

export default function ProfileDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  // Profile state
  const [profile, setProfile] = useState<VoiceProfile | null>(null)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Samples state
  const [samples, setSamples] = useState<VoiceSample[]>([])
  const [sampleInsightCounts, setSampleInsightCounts] = useState<Record<string, number>>({})
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])

  // Insights state
  const [insights, setInsights] = useState<VoiceInsight[]>([])

  // Labels state
  const [allLabels, setAllLabels] = useState<string[]>([])

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('samples')
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [showAddSampleModal, setShowAddSampleModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isStyleGuideExpanded, setIsStyleGuideExpanded] = useState(true)

  // Fetch profile data by slug
  const fetchProfile = useCallback(async () => {
    try {
      // Fetch by slug (API supports both slug and ID)
      const res = await fetch(`/api/voice-lab/profiles/by-slug/${slug}`)
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Profile not found')
        }
        throw new Error('Failed to fetch profile')
      }
      const data = await res.json()
      setProfile(data.profile)
      setProfileId(data.profile.id)
      setEditedName(data.profile.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    }
  }, [slug])

  // Fetch samples (requires profileId)
  const fetchSamples = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/voice-lab/profiles/${id}/samples`)
      if (res.ok) {
        const data = await res.json()
        setSamples(data.samples || [])

        // Calculate category stats
        const stats: Record<string, number> = {}
        data.samples?.forEach((sample: VoiceSample) => {
          const cat = sample.category || 'uncategorized'
          stats[cat] = (stats[cat] || 0) + 1
        })
        setCategoryStats(
          Object.entries(stats).map(([category, count]) => ({
            category: category as VoiceSampleCategory | 'uncategorized',
            count,
          }))
        )
      }
    } catch (err) {
      console.error('Failed to fetch samples:', err)
    }
  }, [])

  // Fetch insights (requires profileId)
  const fetchInsights = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/voice-lab/profiles/${id}/insights`)
      if (res.ok) {
        const data = await res.json()
        setInsights(data.insights || [])
      }
    } catch (err) {
      console.error('Failed to fetch insights:', err)
    }
  }, [])

  // Fetch all labels for autocomplete
  const fetchLabels = useCallback(async () => {
    try {
      const res = await fetch('/api/voice-lab/profiles')
      if (res.ok) {
        const data = await res.json()
        const labels = new Set<string>()
        data.profiles?.forEach((p: VoiceProfile) => {
          p.labels?.forEach((l: string) => labels.add(l))
        })
        setAllLabels(Array.from(labels))
      }
    } catch (err) {
      console.error('Failed to fetch labels:', err)
    }
  }, [])

  // Initial fetch - load profile first, then samples/insights
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      // First fetch the profile to get the ID
      try {
        const res = await fetch(`/api/voice-lab/profiles/by-slug/${slug}`)
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Profile not found')
          }
          throw new Error('Failed to fetch profile')
        }
        const data = await res.json()
        setProfile(data.profile)
        setProfileId(data.profile.id)
        setEditedName(data.profile.name)

        // Then fetch samples, insights, and labels in parallel
        await Promise.all([
          fetchSamples(data.profile.id),
          fetchInsights(data.profile.id),
          fetchLabels(),
        ])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [slug, fetchSamples, fetchInsights, fetchLabels])

  // Handle name update
  const handleSaveName = async () => {
    if (!profile || !editedName.trim()) return

    try {
      const res = await fetch(`/api/voice-lab/profiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editedName.trim() }),
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
        setIsEditingName(false)
      }
    } catch (err) {
      console.error('Failed to update name:', err)
    }
  }

  // Handle labels update
  const handleLabelsChange = async (newLabels: string[]) => {
    if (!profile) return

    try {
      const res = await fetch(`/api/voice-lab/profiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labels: newLabels }),
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
        // Refresh all labels
        fetchLabels()
      }
    } catch (err) {
      console.error('Failed to update labels:', err)
    }
  }

  // Handle delete profile
  const handleDeleteProfile = async () => {
    if (!confirm('Are you sure you want to delete this profile? This cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/voice-lab/profiles/${profileId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.push('/library')
      }
    } catch (err) {
      console.error('Failed to delete profile:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle regenerate style guide
  const handleRegenerateGuide = async () => {
    if (!profile) return

    setIsRegenerating(true)
    try {
      const res = await fetch(`/api/voice-lab/profiles/${profileId}/synthesize`, {
        method: 'POST',
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
      }
    } catch (err) {
      console.error('Failed to regenerate guide:', err)
    } finally {
      setIsRegenerating(false)
    }
  }

  // Handle add sample
  const handleAddSample = async (newSamples: { content: string; category?: VoiceSampleCategory; notes?: string }[]) => {
    const res = await fetch(`/api/voice-lab/profiles/${profileId}/samples`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        samples: newSamples.map((s) => ({
          content: s.content,
          category: s.category,
          notes: s.notes,
        })),
        autoResynthesize: false,
      }),
    })

    if (!res.ok) {
      throw new Error('Failed to add sample')
    }

    // Refresh data
    if (profileId) {
      await Promise.all([
        fetchSamples(profileId),
        fetchInsights(profileId),
      ])
      // Also refresh profile
      const res = await fetch(`/api/voice-lab/profiles/${profileId}`)
      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
      }
    }
  }

  // Handle delete sample
  const handleDeleteSample = async (sampleId: string) => {
    if (!profileId || !confirm('Delete this sample? Related insights may be affected.')) {
      return
    }

    try {
      const res = await fetch(`/api/voice-lab/profiles/${profileId}/samples/${sampleId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await Promise.all([
          fetchSamples(profileId),
          fetchInsights(profileId),
        ])
      }
    } catch (err) {
      console.error('Failed to delete sample:', err)
    }
  }

  // Handle category change
  const handleCategoryChange = async (sampleId: string, category: VoiceSampleCategory | null) => {
    if (!profileId) return
    try {
      const res = await fetch(`/api/voice-lab/profiles/${profileId}/samples/${sampleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      })

      if (res.ok) {
        fetchSamples(profileId)
      }
    } catch (err) {
      console.error('Failed to update sample category:', err)
    }
  }

  // Apply voice
  const handleApplyVoice = () => {
    router.push(`/voice-lab?profile=${profileId}`)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
            <span className="ml-2 text-gray-500">Loading profile...</span>
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error || 'Profile not found'}
          </div>
          <Link
            href="/library"
            className="mt-4 inline-flex items-center gap-1 text-violet-600 hover:text-violet-700"
          >
            Back to Library
          </Link>
        </main>
      </div>
    )
  }

  const status = statusConfig[profile.training_status] || statusConfig.ready
  const groupedInsights = groupInsightsByType(insights)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/voice-lab" className="hover:text-violet-600">
            Voice Lab
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/library" className="hover:text-violet-600">
            Library
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">
            {profile.name}
          </span>
        </nav>

        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
              <Mic className="w-6 h-6 text-violet-600" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Name */}
              <div className="flex items-center gap-2 mb-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-xl font-semibold text-gray-900 border border-violet-300 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false)
                        setEditedName(profile.name)
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {profile.name}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Status and stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${status.bgColor} ${status.color}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {status.label}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {profile.sample_count} samples
                </span>
                <span className="flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" />
                  {profile.insight_count} patterns
                </span>
              </div>

              {/* Description */}
              {profile.description && (
                <p className="text-sm text-gray-600 mb-3">
                  {profile.description}
                </p>
              )}

              {/* Labels */}
              <LabelEditor
                labels={profile.labels || []}
                allLabels={allLabels}
                onChange={handleLabelsChange}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-end">
              <button
                onClick={handleDeleteProfile}
                disabled={isDeleting}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRegenerateGuide}
                disabled={isRegenerating || profile.sample_count === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isRegenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Regenerate Guide
              </button>
              <button
                onClick={handleApplyVoice}
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors flex items-center gap-2"
              >
                Apply Voice
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Style Guide Preview */}
        {profile.style_guide && (
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <button
              onClick={() => setIsStyleGuideExpanded(!isStyleGuideExpanded)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-xl"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-600" />
                <span className="font-medium text-gray-900">Style Guide</span>
                <span className="text-xs text-gray-500">
                  v{profile.style_guide_version || 1}
                </span>
              </div>
              {isStyleGuideExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {isStyleGuideExpanded && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="mt-3 prose prose-sm prose-gray max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-600 font-sans bg-gray-50 p-4 rounded-lg">
                    {profile.style_guide}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left panel - Samples/Insights tabs */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex items-center gap-1 mb-4 bg-white rounded-lg border border-gray-200 p-1 w-fit">
              <button
                onClick={() => setActiveTab('samples')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'samples'
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Samples ({samples.length})
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'insights'
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Voice Patterns ({insights.length})
              </button>
            </div>

            {/* Samples tab content */}
            {activeTab === 'samples' && (
              <div className="space-y-3">
                {samples.map((sample) => (
                  <SampleCard
                    key={sample.id}
                    sample={sample}
                    insightCount={sampleInsightCounts[sample.id] || 0}
                    onDelete={handleDeleteSample}
                    onCategoryChange={handleCategoryChange}
                  />
                ))}

                {samples.length === 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 mb-4">No samples yet</p>
                  </div>
                )}

                <button
                  onClick={() => setShowAddSampleModal(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-violet-300 hover:text-violet-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Sample
                </button>
              </div>
            )}

            {/* Voice Patterns tab content */}
            {activeTab === 'insights' && (
              <div className="space-y-6">
                {/* Pattern type labels - user-friendly */}
                {([
                  { type: 'tone' as const, label: 'How It Sounds', description: 'Voice and attitude patterns' },
                  { type: 'vocabulary' as const, label: 'Word Choices', description: 'Language and terminology' },
                  { type: 'structure' as const, label: 'How It Flows', description: 'Organization and structure' },
                  { type: 'rhetoric' as const, label: 'Persuasion Style', description: 'How it convinces readers' },
                  { type: 'principle' as const, label: 'Writing Rules', description: 'Dos and don\'ts' },
                ]).map(({ type, label, description }) => {
                  const typeInsights = groupedInsights[type]
                  if (typeInsights.length === 0) return null

                  return (
                    <div key={type}>
                      <div className="mb-2">
                        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                        <p className="text-xs text-gray-500">{description}</p>
                      </div>
                      <div className="space-y-2">
                        {typeInsights.map((insight) => (
                          <InsightCard key={insight.id} insight={insight} />
                        ))}
                      </div>
                    </div>
                  )
                })}

                {insights.length === 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <Lightbulb className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No voice patterns captured yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add writing samples to extract patterns
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right panel - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">By Category</h3>
              </div>
              <div className="p-4">
                {categoryStats.length > 0 ? (
                  <ul className="space-y-2">
                    {categoryStats.map((stat) => (
                      <li
                        key={stat.category}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-600 capitalize">
                          {stat.category === 'uncategorized' ? 'Uncategorized' : stat.category}
                        </span>
                        <span className="text-gray-900 font-medium">{stat.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">No samples to categorize</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Sample Modal */}
      <AddSampleModal
        isOpen={showAddSampleModal}
        onClose={() => setShowAddSampleModal(false)}
        onSubmit={handleAddSample}
      />
    </div>
  )
}

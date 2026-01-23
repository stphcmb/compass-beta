'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Mic,
  Loader2,
  Sparkles,
  ChevronDown,
  Plus,
  Trash2,
  ArrowRight,
} from 'lucide-react'
import type { VoiceProfile } from '@/lib/voice-lab'
import type { ContentFormat, ContentDomain } from '@/lib/studio/types'

const FORMAT_OPTIONS: { value: ContentFormat; label: string; description: string }[] = [
  { value: 'blog', label: 'Blog Post', description: '800-1200 words, structured with sections' },
  { value: 'linkedin', label: 'LinkedIn Post', description: '150-300 words, conversational' },
  { value: 'memo', label: 'Internal Memo', description: '300-500 words, bullet-focused' },
  { value: 'byline', label: 'Byline / Op-Ed', description: '600-900 words, thought leadership' },
]

const DOMAIN_OPTIONS: { value: ContentDomain; label: string; description: string }[] = [
  { value: 'ai_discourse', label: 'AI Discourse', description: 'Thought leadership about AI landscape' },
  { value: 'anduin_product', label: 'Anduin Product', description: 'Solution-focused content about Anduin' },
  { value: 'hybrid', label: 'Hybrid', description: 'Blends AI discourse with Anduin product' },
]

export default function ContentBuilderPage() {
  const router = useRouter()

  // Form state
  const [title, setTitle] = useState('')
  const [format, setFormat] = useState<ContentFormat>('blog')
  const [audience, setAudience] = useState('')
  const [keyPoints, setKeyPoints] = useState<string[]>([''])
  const [additionalContext, setAdditionalContext] = useState('')
  const [contentDomain, setContentDomain] = useState<ContentDomain>('ai_discourse')
  const [voiceProfileId, setVoiceProfileId] = useState<string>('')

  // Voice profiles
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(true)

  // Generation state
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load voice profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/api/voice-lab/profiles')
        if (res.ok) {
          const data = await res.json()
          setVoiceProfiles(data.profiles || [])
          // Auto-select first profile if available
          if (data.profiles?.length > 0) {
            setVoiceProfileId(data.profiles[0].id)
          }
        }
      } catch (error) {
        console.error('Failed to fetch profiles:', error)
      } finally {
        setLoadingProfiles(false)
      }
    }
    fetchProfiles()
  }, [])

  // Key points management
  const addKeyPoint = () => {
    setKeyPoints([...keyPoints, ''])
  }

  const removeKeyPoint = (index: number) => {
    if (keyPoints.length > 1) {
      setKeyPoints(keyPoints.filter((_, i) => i !== index))
    }
  }

  const updateKeyPoint = (index: number, value: string) => {
    const updated = [...keyPoints]
    updated[index] = value
    setKeyPoints(updated)
  }

  // Generate content
  const handleGenerate = async () => {
    // Validate
    if (!title.trim()) {
      setError('Please enter a topic/title')
      return
    }
    if (!voiceProfileId) {
      setError('Please select a voice profile')
      return
    }
    const validKeyPoints = keyPoints.filter(p => p.trim())
    if (validKeyPoints.length === 0) {
      setError('Please add at least one key point')
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/studio/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief: {
            title: title.trim(),
            format,
            audience: audience.trim() || 'General audience',
            key_points: validKeyPoints,
            additional_context: additionalContext.trim() || undefined,
            content_domain: contentDomain,
          },
          voice_profile_id: voiceProfileId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content')
      }

      // Navigate to editor with the new project
      router.push(`/studio/editor?project=${data.project_id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Generation failed')
      setGenerating(false)
    }
  }

  const selectedProfile = voiceProfiles.find(p => p.id === voiceProfileId)

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Content Builder</h1>
            <p className="text-sm text-gray-500">Create voice-constrained content from a brief</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topic */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              What are you writing about? *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Why AI agents need compliance guardrails in private markets"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-lg"
            />
          </div>

          {/* Format & Audience */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Content Format *
                </label>
                <div className="relative">
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as ContentFormat)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none appearance-none bg-white"
                  >
                    {FORMAT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {FORMAT_OPTIONS.find(f => f.value === format)?.description}
                </p>
              </div>

              {/* Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g., Tech executives, Fund managers"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Key Points */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Key Points to Cover *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              What are the main arguments or ideas you want to include?
            </p>
            <div className="space-y-3">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updateKeyPoint(index, e.target.value)}
                    placeholder={`Key point ${index + 1}...`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                  />
                  {keyPoints.length > 1 && (
                    <button
                      onClick={() => removeKeyPoint(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addKeyPoint}
                className="flex items-center gap-2 px-3 py-2 text-sm text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add another point
              </button>
            </div>
          </div>

          {/* Content Domain */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Content Domain
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DOMAIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setContentDomain(opt.value)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all
                    ${contentDomain === opt.value
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="block font-medium text-gray-900">{opt.label}</span>
                  <span className="block text-xs text-gray-500 mt-1">{opt.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Context */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Additional Context (Optional)
            </label>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any other context, examples, or specific requirements..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none h-24"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Voice Profile */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Voice Profile *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              The writing style to apply
            </p>

            {loadingProfiles ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
              </div>
            ) : voiceProfiles.length === 0 ? (
              <div className="text-center py-6">
                <Mic className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">No voice profiles yet</p>
                <a
                  href="/voice-lab"
                  target="_blank"
                  className="text-sm text-violet-600 hover:text-violet-700"
                >
                  Create one in Voice Lab →
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                {voiceProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => setVoiceProfileId(profile.id)}
                    className={`
                      w-full p-3 rounded-lg border-2 text-left transition-all
                      ${voiceProfileId === profile.id
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${voiceProfileId === profile.id ? 'bg-violet-200' : 'bg-gray-100'}
                      `}>
                        <Mic className={`w-4 h-4 ${voiceProfileId === profile.id ? 'text-violet-600' : 'text-gray-500'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{profile.name}</p>
                        {profile.description && (
                          <p className="text-xs text-gray-500 truncate">{profile.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating || !title.trim() || !voiceProfileId}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Content
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <p className="mt-3 text-xs text-gray-500 text-center">
              Content will open in the editor for review
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

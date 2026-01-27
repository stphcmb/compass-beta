'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import {
  PenTool,
  Sparkles,
  FileText,
  Check,
  Loader2,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Copy,
  Trash2,
  Plus,
  ArrowRight,
  Wand2,
  Eye,
  Zap,
} from 'lucide-react'
import type { VoiceProfile } from '@/lib/voice-lab'

type Step = 'input' | 'analyzing' | 'analysis' | 'generating' | 'profile' | 'revise'

interface StyleAnalysis {
  tone: string[]
  patterns: string[]
  vocabulary: string[]
  suggestions: string[]
}

export default function VoiceLabPage() {
  // Workflow state
  const [currentStep, setCurrentStep] = useState<Step>('input')

  // Sample input state
  const [samples, setSamples] = useState<string[]>([''])
  const [profileName, setProfileName] = useState('')

  // Analysis state
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)

  // Generated profile state
  const [generatedProfile, setGeneratedProfile] = useState<VoiceProfile | null>(null)
  const [styleGuide, setStyleGuide] = useState<string>('')
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  // Revision state
  const [draftText, setDraftText] = useState('')
  const [revisedText, setRevisedText] = useState('')
  const [revising, setRevising] = useState(false)
  const [reviseError, setReviseError] = useState<string | null>(null)

  // Existing profiles
  const [existingProfiles, setExistingProfiles] = useState<VoiceProfile[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(true)

  // Copy state
  const [copied, setCopied] = useState(false)

  // Load existing profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/api/voice-lab/profiles')
        if (res.ok) {
          const data = await res.json()
          setExistingProfiles(data.profiles || [])
        }
      } catch (error) {
        console.error('Failed to fetch profiles:', error)
      } finally {
        setLoadingProfiles(false)
      }
    }
    fetchProfiles()
  }, [])

  // Add a sample input
  const addSample = () => {
    setSamples([...samples, ''])
  }

  // Remove a sample input
  const removeSample = (index: number) => {
    if (samples.length > 1) {
      setSamples(samples.filter((_, i) => i !== index))
    }
  }

  // Update a sample
  const updateSample = (index: number, value: string) => {
    const newSamples = [...samples]
    newSamples[index] = value
    setSamples(newSamples)
  }

  // Step 1: Analyze writing samples
  const handleAnalyze = async () => {
    const validSamples = samples.filter((s) => s.trim().length > 0)
    if (validSamples.length === 0) {
      setAnalyzeError('Please add at least one writing sample')
      return
    }

    setAnalyzing(true)
    setAnalyzeError(null)
    setCurrentStep('analyzing')

    try {
      const res = await fetch('/api/voice-lab/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samples: validSamples }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze samples')
      }

      setAnalysis(data)
      setCurrentStep('analysis')
    } catch (error) {
      setAnalyzeError(error instanceof Error ? error.message : 'Analysis failed')
      setCurrentStep('input')
    } finally {
      setAnalyzing(false)
    }
  }

  // Step 2 (optional): Generate full profile from analysis
  const handleGenerateProfile = async () => {
    const validSamples = samples.filter((s) => s.trim().length > 0)
    if (!profileName.trim()) {
      setGenerateError('Please enter a name for your voice profile')
      return
    }

    setGenerating(true)
    setGenerateError(null)
    setCurrentStep('generating')

    try {
      const res = await fetch('/api/voice-lab/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          samples: validSamples,
          name: profileName.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate profile')
      }

      setStyleGuide(data.styleGuide)
      setGeneratedProfile(data.profile || null)
      setCurrentStep('profile')

      // Refresh profiles list
      const profilesRes = await fetch('/api/voice-lab/profiles')
      if (profilesRes.ok) {
        const profilesData = await profilesRes.json()
        setExistingProfiles(profilesData.profiles || [])
      }
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : 'Generation failed')
      setCurrentStep('analysis')
    } finally {
      setGenerating(false)
    }
  }

  // Revise draft with profile
  const handleRevise = async () => {
    if (!draftText.trim()) {
      setReviseError('Please enter a draft to revise')
      return
    }
    if (!generatedProfile?.id && !styleGuide) {
      setReviseError('No profile available')
      return
    }

    setRevising(true)
    setReviseError(null)
    setRevisedText('')

    try {
      const res = await fetch('/api/voice-lab/revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft: draftText.trim(),
          profileId: generatedProfile?.id,
          styleGuide: styleGuide,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to revise draft')
      }

      setRevisedText(data.revisedText)
    } catch (error) {
      setReviseError(error instanceof Error ? error.message : 'Revision failed')
    } finally {
      setRevising(false)
    }
  }

  // Use an existing profile
  const useExistingProfile = (profile: VoiceProfile) => {
    setGeneratedProfile(profile)
    setStyleGuide(profile.style_guide || '')
    setProfileName(profile.name)
    setCurrentStep('profile')
  }

  // Copy revised text
  const copyRevised = async () => {
    await navigator.clipboard.writeText(revisedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Reset workflow
  const resetWorkflow = () => {
    setCurrentStep('input')
    setSamples([''])
    setProfileName('')
    setAnalysis(null)
    setGeneratedProfile(null)
    setStyleGuide('')
    setDraftText('')
    setRevisedText('')
    setAnalyzeError(null)
    setGenerateError(null)
  }

  // Go back to analysis from profile creation
  const backToAnalysis = () => {
    setCurrentStep('analysis')
    setGenerateError(null)
  }

  // Calculate total sample characters
  const totalChars = samples.reduce((sum, s) => sum + s.length, 0)

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Header sidebarCollapsed={true} />
      <main className="flex-1 mt-16 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm mb-6 transition-colors text-gray-500 hover:text-violet-600"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Page Header */}
          <PageHeader
            icon={<PenTool size={24} />}
            title="Voice Lab"
            subtitle="Analyze and capture writing styles"
            iconVariant="purple"
          />
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <StepIndicator
            step={1}
            label="Analyze Sample"
            active={currentStep === 'input' || currentStep === 'analyzing' || currentStep === 'analysis'}
            completed={['profile', 'revise'].includes(currentStep)}
          />
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <StepIndicator
            step={2}
            label="Apply Voice"
            active={currentStep === 'generating' || currentStep === 'profile' || currentStep === 'revise'}
            completed={!!revisedText}
          />
        </div>

        {/* Step 1: Input Samples */}
        {currentStep === 'input' && (
          <div className="space-y-6">
            {/* Existing Profiles Section */}
            {existingProfiles.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Use Existing Profile
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {existingProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => useExistingProfile(profile)}
                      className="text-left p-4 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-violet-200 transition-colors">
                          <PenTool className="w-4 h-4 text-violet-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{profile.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {profile.description || 'No description'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 text-center">Or analyze a new writing sample below</p>
                </div>
              </div>
            )}

            {/* Analyze New Sample */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Analyze Writing Sample
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Paste writing samples to analyze their style patterns. You can then optionally save it as a voice profile.
              </p>

              {/* Samples */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Writing Samples ({samples.length})
                </label>
                {samples.map((sample, index) => (
                  <div key={index} className="relative">
                    <textarea
                      value={sample}
                      onChange={(e) => updateSample(index, e.target.value)}
                      placeholder={`Paste writing sample ${index + 1}...`}
                      className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <span className="text-xs text-gray-400">{sample.length} chars</span>
                      {samples.length > 1 && (
                        <button
                          onClick={() => removeSample(index)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={addSample}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add another sample
                </button>
              </div>

              {/* Error */}
              {analyzeError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {analyzeError}
                </div>
              )}

              {/* Analyze Button */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Total: {totalChars.toLocaleString()} characters
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={totalChars === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Analyze Style
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analyzing State */}
        {currentStep === 'analyzing' && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Analyzing Writing Style
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Detecting tone, patterns, vocabulary, and rhetorical strategies...
            </p>
          </div>
        )}

        {/* Step 1b: Analysis Results */}
        {currentStep === 'analysis' && analysis && (
          <div className="space-y-6">
            {/* Analysis Results Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Style Analysis</h2>
                    <p className="text-sm text-gray-500">Here's what we detected in your writing</p>
                  </div>
                </div>
                <button
                  onClick={resetWorkflow}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Start Over
                </button>
              </div>

              {/* Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tone */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Tone
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.tone.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vocabulary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Vocabulary
                  </h3>
                  <ul className="space-y-1">
                    {analysis.vocabulary.map((v, i) => (
                      <li key={i} className="text-sm text-gray-600">• {v}</li>
                    ))}
                  </ul>
                </div>

                {/* Patterns */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-500" />
                    Patterns
                  </h3>
                  <ul className="space-y-1">
                    {analysis.patterns.map((p, i) => (
                      <li key={i} className="text-sm text-gray-600">• {p}</li>
                    ))}
                  </ul>
                </div>

                {/* Suggestions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-green-500" />
                    Suggestions
                  </h3>
                  <ul className="space-y-1">
                    {analysis.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600">• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Create Profile Option */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-6">
              <h3 className="font-medium text-gray-900 mb-2">Want to save this as a voice profile?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a comprehensive style guide that you can apply to future writing.
              </p>

              {/* Profile Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g., CEO Memo, Technical Doc, Blog Voice..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none bg-white"
                />
              </div>

              {/* Error */}
              {generateError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {generateError}
                </div>
              )}

              <button
                onClick={handleGenerateProfile}
                disabled={!profileName.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Generate Voice Profile
              </button>
            </div>
          </div>
        )}

        {/* Generating State */}
        {currentStep === 'generating' && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Generating Voice Profile
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Creating a comprehensive style guide from your analysis...
            </p>
          </div>
        )}

        {/* Step 2: Profile Generated */}
        {currentStep === 'profile' && (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {profileName || generatedProfile?.name}
                    </h2>
                    <p className="text-sm text-gray-500">Voice profile ready</p>
                  </div>
                </div>
                <button
                  onClick={resetWorkflow}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Start Over
                </button>
              </div>

              {/* Style Guide Preview */}
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {styleGuide.substring(0, 2000)}
                  {styleGuide.length > 2000 && '...'}
                </pre>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {styleGuide.length.toLocaleString()} characters in style guide
              </p>
            </div>

            {/* Continue to Revision */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Ready to apply this voice?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Paste a draft and get a revised version in this writing style.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep('revise')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
                >
                  Apply to Draft
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2b: Revise Draft */}
        {currentStep === 'revise' && (
          <div className="space-y-6">
            {/* Active Profile Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm">
                <PenTool className="w-4 h-4" />
                <span className="font-medium">{profileName || generatedProfile?.name}</span>
              </div>
              <button
                onClick={() => setCurrentStep('profile')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Change Profile
              </button>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Draft */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <h3 className="font-medium text-gray-900">Your Draft</h3>
                </div>
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Paste the draft you want to revise in this voice..."
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
                />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {draftText.length.toLocaleString()} characters
                  </span>
                  <button
                    onClick={handleRevise}
                    disabled={!draftText.trim() || revising}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {revising ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Revising...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Revise Draft
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Revised Output */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-500" />
                    <h3 className="font-medium text-gray-900">Revised Version</h3>
                  </div>
                  {revisedText && (
                    <button
                      onClick={copyRevised}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>

                {reviseError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4">
                    {reviseError}
                  </div>
                )}

                {revising ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Applying voice profile...</p>
                    </div>
                  </div>
                ) : revisedText ? (
                  <div className="h-64 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                        {revisedText}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-400">
                      Revised draft will appear here
                    </p>
                  </div>
                )}

                {revisedText && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {revisedText.length.toLocaleString()} characters
                    </span>
                    <button
                      onClick={handleRevise}
                      disabled={revising}
                      className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Regenerate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  )
}

// Step indicator component
function StepIndicator({
  step,
  label,
  active,
  completed,
}: {
  step: number
  label: string
  active: boolean
  completed: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-colors
          ${completed ? 'bg-violet-600 text-white' : active ? 'bg-violet-100 text-violet-600 ring-2 ring-violet-600' : 'bg-gray-100 text-gray-400'}
        `}
      >
        {completed ? <Check className="w-4 h-4" /> : step}
      </div>
      <span className={`text-sm ${active ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  )
}

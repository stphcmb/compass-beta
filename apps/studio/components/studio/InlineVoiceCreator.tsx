'use client'

import { useState } from 'react'
import {
  Plus,
  X,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'

interface InlineVoiceCreatorProps {
  onProfileCreated: (profile: { id: string; name: string }) => void
  onCancel: () => void
}

export default function InlineVoiceCreator({
  onProfileCreated,
  onCancel,
}: InlineVoiceCreatorProps) {
  const [name, setName] = useState('')
  const [samples, setSamples] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please enter a name for your voice profile')
      return
    }
    if (!samples.trim()) {
      setError('Please paste at least one writing sample')
      return
    }

    setCreating(true)
    setError(null)

    try {
      // First, analyze the samples to generate a style guide
      const analyzeRes = await fetch('/api/voice-lab/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          samples: [samples.trim()],
        }),
      })

      if (!analyzeRes.ok) {
        throw new Error('Failed to analyze writing samples')
      }

      const { style_guide } = await analyzeRes.json()

      // Then create the profile
      const createRes = await fetch('/api/voice-lab/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: 'Created from Studio',
          style_guide,
          source_samples: [samples.trim()],
          is_active: false,
        }),
      })

      if (!createRes.ok) {
        throw new Error('Failed to create voice profile')
      }

      const { profile } = await createRes.json()
      onProfileCreated({ id: profile.id, name: profile.name })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile')
      setCreating(false)
    }
  }

  return (
    <div className="border-2 border-violet-300 bg-violet-50/50 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-200 flex items-center justify-center">
            <Plus className="w-4 h-4 text-violet-600" />
          </div>
          <span className="font-medium text-gray-900">Quick Create Voice</span>
        </div>
        <button
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Name field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Profile Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Professional Analyst"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-sm"
        />
      </div>

      {/* Samples field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Writing Sample
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Paste 200-500 words of your writing to capture your style
        </p>
        <textarea
          value={samples}
          onChange={(e) => setSamples(e.target.value)}
          placeholder="Paste your writing here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-sm resize-none h-32"
        />
        <p className="text-xs text-gray-400 mt-1">
          {samples.trim().split(/\s+/).filter(Boolean).length} words
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          Advanced options
        </button>
        <button
          onClick={handleCreate}
          disabled={creating || !name.trim() || !samples.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {creating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Create Profile
            </>
          )}
        </button>
      </div>

      {/* Advanced options */}
      {showAdvanced && (
        <div className="pt-2 border-t border-violet-200">
          <a
            href="/voice-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700"
          >
            <ExternalLink className="w-4 h-4" />
            Open full Voice Lab for advanced settings
          </a>
        </div>
      )}
    </div>
  )
}

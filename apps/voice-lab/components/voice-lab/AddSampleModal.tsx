'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, AlertCircle } from 'lucide-react'
import type { VoiceSampleCategory } from '@/lib/voice-lab/types'

interface AddSampleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (samples: { content: string; category?: VoiceSampleCategory; notes?: string }[]) => Promise<void>
}

const CATEGORIES: { value: VoiceSampleCategory | ''; label: string }[] = [
  { value: '', label: 'No category' },
  { value: 'case-study', label: 'Case Study' },
  { value: 'blog', label: 'Blog Post' },
  { value: 'email', label: 'Email' },
  { value: 'social', label: 'Social Media' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Other' },
]

const MIN_CHARS = 50

export default function AddSampleModal({
  isOpen,
  onClose,
  onSubmit,
}: AddSampleModalProps) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<VoiceSampleCategory | ''>('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const charCount = content.length
  const isValid = charCount >= MIN_CHARS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValid) {
      setError(`Sample must be at least ${MIN_CHARS} characters`)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit([{
        content: content.trim(),
        category: category || undefined,
        notes: notes.trim() || undefined,
      }])
      // Reset form
      setContent('')
      setCategory('')
      setNotes('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add sample')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setContent('')
      setCategory('')
      setNotes('')
      setError(null)
      onClose()
    }
  }

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSubmitting])

  if (!isOpen) return null

  // TODO: Add focus trap with library like focus-trap-react

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-sample-modal-title"
        className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="add-sample-modal-title" className="text-lg font-semibold text-gray-900">Add Writing Sample</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Content textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Writing Sample
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your writing sample here... (at least 50 characters)"
              rows={8}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none disabled:bg-gray-50 disabled:text-gray-500"
            />
            <div className="flex justify-between mt-1 text-xs">
              <span className={charCount < MIN_CHARS ? 'text-red-500' : 'text-gray-600'}>
                {charCount} characters
                {charCount < MIN_CHARS && ` (need ${MIN_CHARS - charCount} more)`}
              </span>
              <span className="text-gray-500">
                ~{Math.round(content.split(/\s+/).filter(w => w).length)} words
              </span>
            </div>
          </div>

          {/* Category select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as VoiceSampleCategory | '')}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., From Q3 newsletter"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !isValid}
            className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Sample'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

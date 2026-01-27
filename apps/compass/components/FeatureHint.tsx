'use client'

import { useState, useEffect } from 'react'
import { Info, X } from 'lucide-react'
import { FEATURE_HINTS, type FeatureKey } from '@/lib/constants/terminology'

interface FeatureHintProps {
  featureKey: FeatureKey
  className?: string
}

export function FeatureHint({ featureKey, className = '' }: FeatureHintProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const hint = FEATURE_HINTS[featureKey]

  useEffect(() => {
    setIsClient(true)
    if (!hint) return
    const hasSeenHint = localStorage.getItem(hint.storageKey)
    if (!hasSeenHint) {
      setIsVisible(true)
    }
  }, [hint])

  const handleDismiss = () => {
    localStorage.setItem(hint.storageKey, 'true')
    setIsVisible(false)
  }

  // Don't render during SSR, if not visible, or if hint doesn't exist
  if (!isClient || !isVisible || !hint) {
    return null
  }

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded bg-[var(--color-pale-gray)] border border-[var(--color-light-gray)] ${className}`}
      style={{
        borderRadius: 'var(--radius-base)',
      }}
    >
      <Info
        size={18}
        className="text-[var(--color-accent)] flex-shrink-0 mt-0.5"
      />
      <p
        className="flex-1 text-[var(--color-charcoal)]"
        style={{
          fontSize: 'var(--text-small)',
          lineHeight: 'var(--leading-relaxed)',
        }}
      >
        {hint.message}
      </p>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded hover:bg-[var(--color-light-gray)] transition-colors"
        style={{
          borderRadius: 'var(--radius-sm)',
          transition: 'background-color var(--duration-fast) var(--ease-out)',
        }}
        aria-label="Dismiss hint"
      >
        <X size={16} className="text-[var(--color-mid-gray)]" />
      </button>
    </div>
  )
}

/**
 * Reset all feature hints (useful for testing)
 */
export function resetFeatureHints() {
  Object.values(FEATURE_HINTS).forEach((hint) => {
    localStorage.removeItem(hint.storageKey)
  })
}

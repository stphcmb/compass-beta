'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Mic, Plus, Check, Loader2 } from 'lucide-react'
import type { VoiceProfile } from '@/lib/voice-lab'

interface VoiceLabControlsProps {
  /** Currently selected profile ID (or null for none) */
  selectedProfileId: string | null
  /** Callback when profile selection changes */
  onProfileChange: (profileId: string | null) => void
  /** Whether to show the "generate profile" checkbox */
  showGenerateOption?: boolean
  /** Whether the generate checkbox is checked */
  generateProfile?: boolean
  /** Callback when generate checkbox changes */
  onGenerateChange?: (generate: boolean) => void
  /** Whether controls are disabled (e.g., during analysis) */
  disabled?: boolean
}

export default function VoiceLabControls({
  selectedProfileId,
  onProfileChange,
  showGenerateOption = false,
  generateProfile = false,
  onGenerateChange,
  disabled = false,
}: VoiceLabControlsProps) {
  const [profiles, setProfiles] = useState<VoiceProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Fetch profiles on mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/api/voice-lab/profiles')
        if (res.ok) {
          const data = await res.json()
          setProfiles(data.profiles || [])
        }
      } catch (error) {
        console.error('Failed to fetch voice profiles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  // Find selected profile
  const selectedProfile = profiles.find(p => p.id === selectedProfileId)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('.voice-lab-dropdown')) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownOpen])

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Profile Dropdown */}
      <div className="relative voice-lab-dropdown">
        <button
          type="button"
          onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
          disabled={disabled || loading}
          className={`
            flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border
            ${disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 cursor-pointer'
            }
            transition-colors
          `}
        >
          <Mic className="w-4 h-4" />
          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : selectedProfile ? (
            <span className="max-w-[150px] truncate">{selectedProfile.name}</span>
          ) : (
            <span className="text-gray-500">No voice applied</span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && !disabled && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
            {/* None option */}
            <button
              type="button"
              onClick={() => {
                onProfileChange(null)
                setDropdownOpen(false)
              }}
              className={`
                w-full px-3 py-2 text-left text-sm flex items-center gap-2
                ${!selectedProfileId ? 'bg-violet-50 text-violet-700' : 'hover:bg-gray-50 text-gray-700'}
              `}
            >
              {!selectedProfileId && <Check className="w-4 h-4" />}
              <span className={!selectedProfileId ? '' : 'ml-6'}>No voice applied</span>
            </button>

            {profiles.length > 0 && (
              <>
                <div className="border-t border-gray-100 my-1" />
                <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Your Profiles
                </div>
              </>
            )}

            {/* Profile options */}
            {profiles.map(profile => (
              <button
                key={profile.id}
                type="button"
                onClick={() => {
                  onProfileChange(profile.id)
                  setDropdownOpen(false)
                }}
                className={`
                  w-full px-3 py-2 text-left text-sm flex items-center gap-2
                  ${selectedProfileId === profile.id ? 'bg-violet-50 text-violet-700' : 'hover:bg-gray-50 text-gray-700'}
                `}
              >
                {selectedProfileId === profile.id && <Check className="w-4 h-4" />}
                <span className={selectedProfileId === profile.id ? '' : 'ml-6'}>
                  {profile.name}
                </span>
              </button>
            ))}

            {profiles.length === 0 && !loading && (
              <div className="px-3 py-2 text-sm text-gray-500 italic">
                No voice profiles yet
              </div>
            )}

            {/* Create new profile link */}
            <div className="border-t border-gray-100 my-1" />
            <a
              href="/voice-lab"
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 text-violet-600"
            >
              <Plus className="w-4 h-4" />
              <span>Create new profile</span>
            </a>
          </div>
        )}
      </div>

      {/* Generate Profile Checkbox (optional) */}
      {showGenerateOption && (
        <label className={`
          flex items-center gap-2 text-sm cursor-pointer
          ${disabled ? 'text-gray-400' : 'text-gray-600 hover:text-gray-800'}
        `}>
          <input
            type="checkbox"
            checked={generateProfile}
            onChange={(e) => onGenerateChange?.(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 disabled:opacity-50"
          />
          <span>Generate voice profile from this draft</span>
        </label>
      )}
    </div>
  )
}

/**
 * Compact version of VoiceLabControls for inline use
 */
export function VoiceLabControlsCompact({
  selectedProfileId,
  onProfileChange,
  disabled = false,
}: Omit<VoiceLabControlsProps, 'showGenerateOption' | 'generateProfile' | 'onGenerateChange'>) {
  const [profiles, setProfiles] = useState<VoiceProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/api/voice-lab/profiles')
        if (res.ok) {
          const data = await res.json()
          setProfiles(data.profiles || [])
        }
      } catch (error) {
        console.error('Failed to fetch voice profiles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading voices...</span>
      </div>
    )
  }

  if (profiles.length === 0) {
    return null // Don't show anything if no profiles
  }

  return (
    <select
      value={selectedProfileId || ''}
      onChange={(e) => onProfileChange(e.target.value || null)}
      disabled={disabled}
      className={`
        text-sm px-2 py-1 rounded border
        ${disabled
          ? 'bg-gray-100 text-gray-400 border-gray-200'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
        }
      `}
    >
      <option value="">No voice</option>
      {profiles.map(profile => (
        <option key={profile.id} value={profile.id}>
          {profile.name}
        </option>
      ))}
    </select>
  )
}

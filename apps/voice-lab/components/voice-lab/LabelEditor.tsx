'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Plus, Check } from 'lucide-react'

interface LabelEditorProps {
  labels: string[]
  allLabels: string[] // For autocomplete suggestions
  onChange: (labels: string[]) => void
  disabled?: boolean
}

export default function LabelEditor({
  labels,
  allLabels,
  onChange,
  disabled = false,
}: LabelEditorProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter suggestions based on input
  const suggestions = allLabels.filter(
    (label) =>
      label.toLowerCase().includes(inputValue.toLowerCase()) &&
      !labels.includes(label)
  )

  // Focus input when adding
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
        if (!inputValue.trim()) {
          setIsAdding(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [inputValue])

  const handleAddLabel = (label: string) => {
    const trimmed = label.trim().toLowerCase()
    if (trimmed && !labels.includes(trimmed)) {
      onChange([...labels, trimmed])
    }
    setInputValue('')
    setIsAdding(false)
    setShowSuggestions(false)
  }

  const handleRemoveLabel = (label: string) => {
    onChange(labels.filter((l) => l !== label))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddLabel(inputValue)
    } else if (e.key === 'Escape') {
      setInputValue('')
      setIsAdding(false)
      setShowSuggestions(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5" ref={containerRef}>
      {/* Existing labels */}
      {labels.map((label) => (
        <span
          key={label}
          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 group"
        >
          {label}
          {!disabled && (
            <button
              onClick={() => handleRemoveLabel(label)}
              aria-label={`Remove ${label} label`}
              className="opacity-50 hover:opacity-100 -mr-0.5"
            >
              <X aria-hidden="true" className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}

      {/* Add label button/input */}
      {!disabled && (
        isAdding ? (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="Add label..."
              className="text-xs px-2 py-0.5 rounded-full border border-gray-300 focus:border-violet-400 focus:ring-1 focus:ring-violet-400 outline-none w-24"
            />

            {/* Suggestions dropdown */}
            {showSuggestions && (inputValue.trim() || suggestions.length > 0) && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1 max-h-40 overflow-y-auto">
                {/* Create new option */}
                {inputValue.trim() && !allLabels.includes(inputValue.trim().toLowerCase()) && (
                  <button
                    onClick={() => handleAddLabel(inputValue)}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 flex items-center gap-2 text-violet-600"
                  >
                    <Plus className="w-3 h-3" />
                    Create "{inputValue.trim()}"
                  </button>
                )}

                {/* Existing suggestions */}
                {suggestions.slice(0, 5).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleAddLabel(suggestion)}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Check className="w-3 h-3 text-gray-500" />
                    {suggestion}
                  </button>
                ))}

                {suggestions.length === 0 && !inputValue.trim() && (
                  <div className="px-3 py-1.5 text-xs text-gray-500">
                    No suggestions
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-dashed border-gray-300 text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        )
      )}
    </div>
  )
}

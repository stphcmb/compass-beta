/**
 * Custom hook for managing UI-only state
 * Consolidates all view-related state
 * Optimization: Separates UI state from data state
 * Expected: Reduced re-renders, cleaner state management
 */

'use client'

import { useState, useCallback } from 'react'
import type { TabType, TimeFilter, ViewMode } from '../lib/types'

export function useHistoryUI() {
  // Tab and filter state
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('expanded')

  // Collapsed sections (map of section ID to collapsed state)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  // Modal states
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showRecentlyDeleted, setShowRecentlyDeleted] = useState(false)

  // Memoized toggle functions
  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }, [])

  const openAboutModal = useCallback(() => setShowAboutModal(true), [])
  const closeAboutModal = useCallback(() => setShowAboutModal(false), [])

  const openRecentlyDeleted = useCallback(() => setShowRecentlyDeleted(true), [])
  const closeRecentlyDeleted = useCallback(() => setShowRecentlyDeleted(false), [])

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => (prev === 'compact' ? 'expanded' : 'compact'))
  }, [])

  return {
    // Tab and filter state
    activeTab,
    setActiveTab,
    timeFilter,
    setTimeFilter,
    searchQuery,
    setSearchQuery,
    favoritesOnly,
    setFavoritesOnly,

    // View mode
    viewMode,
    setViewMode,
    toggleViewMode,

    // Collapsed sections
    collapsedSections,
    toggleSection,

    // Modals
    showAboutModal,
    openAboutModal,
    closeAboutModal,
    showRecentlyDeleted,
    openRecentlyDeleted,
    closeRecentlyDeleted,
  }
}

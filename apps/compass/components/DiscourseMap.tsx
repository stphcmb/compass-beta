'use client'

import { useState, useEffect, useRef } from 'react'
import { Users, ChevronRight, Map } from 'lucide-react'

// Domain color mapping for visual distinction
// bgSolid = solid accent color, bgLight = light pastel bg, textDark = dark readable text
const DOMAIN_COLORS: Record<string, { bg: string; border: string; text: string; light: string; bgSolid: string; bgLight: string; textDark: string; accent: string }> = {
  'AI Technical Capabilities': { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700', light: 'bg-blue-50', bgSolid: '#3b82f6', bgLight: '#dbeafe', textDark: '#1e40af', accent: 'bg-blue-500' },
  'AI & Society': { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-700', light: 'bg-emerald-50', bgSolid: '#10b981', bgLight: '#d1fae5', textDark: '#065f46', accent: 'bg-emerald-500' },
  'Enterprise AI Adoption': { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-700', light: 'bg-amber-50', bgSolid: '#f59e0b', bgLight: '#fef3c7', textDark: '#92400e', accent: 'bg-amber-500' },
  'Future of Work': { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-700', light: 'bg-orange-50', bgSolid: '#f97316', bgLight: '#ffedd5', textDark: '#9a3412', accent: 'bg-orange-500' },
  'AI Governance & Oversight': { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700', light: 'bg-purple-50', bgSolid: '#8b5cf6', bgLight: '#f3e8ff', textDark: '#5b21b6', accent: 'bg-purple-500' },
  'Technology': { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700', light: 'bg-blue-50', bgSolid: '#3b82f6', bgLight: '#dbeafe', textDark: '#1e40af', accent: 'bg-blue-500' },
  'Society': { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-700', light: 'bg-emerald-50', bgSolid: '#10b981', bgLight: '#d1fae5', textDark: '#065f46', accent: 'bg-emerald-500' },
  'Business': { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-700', light: 'bg-amber-50', bgSolid: '#f59e0b', bgLight: '#fef3c7', textDark: '#92400e', accent: 'bg-amber-500' },
  'Workers': { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-700', light: 'bg-orange-50', bgSolid: '#f97316', bgLight: '#ffedd5', textDark: '#9a3412', accent: 'bg-orange-500' },
  'Policy & Regulation': { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700', light: 'bg-purple-50', bgSolid: '#8b5cf6', bgLight: '#f3e8ff', textDark: '#5b21b6', accent: 'bg-purple-500' },
  'Philosophy': { bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-700', light: 'bg-indigo-50', bgSolid: '#6366f1', bgLight: '#e0e7ff', textDark: '#3730a3', accent: 'bg-indigo-500' },
  'Other': { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', light: 'bg-gray-50', bgSolid: '#6b7280', bgLight: '#f3f4f6', textDark: '#374151', accent: 'bg-gray-500' },
}

// Fallback color for unknown domains
const DEFAULT_COLOR = { bg: 'bg-slate-100', border: 'border-slate-400', text: 'text-slate-700', light: 'bg-slate-50', bgSolid: '#64748b', bgLight: '#f1f5f9', textDark: '#334155', accent: 'bg-slate-500' }

export function getDomainColor(domain: string) {
  return DOMAIN_COLORS[domain] || DEFAULT_COLOR
}

interface Camp {
  id: string
  name: string
  domain: string
  authorCount: number
  description?: string
  positionSummary?: string
}

interface DiscourseMapProps {
  camps: Camp[]
  activeCampId?: string
  onCampClick: (campId: string) => void
  loading?: boolean
}

export default function DiscourseMap({ camps, activeCampId, onCampClick, loading }: DiscourseMapProps) {
  const [isSticky, setIsSticky] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  // Calculate total authors for percentage
  const totalAuthors = camps.reduce((sum, camp) => sum + camp.authorCount, 0)

  // Group camps by domain for the grid view
  const campsByDomain = camps.reduce((acc, camp) => {
    const domain = camp.domain || 'Other'
    if (!acc[domain]) acc[domain] = []
    acc[domain].push(camp)
    return acc
  }, {} as Record<string, Camp[]>)

  // Sort domains by total author count
  const sortedDomains = Object.entries(campsByDomain)
    .sort((a, b) => {
      const countA = a[1].reduce((sum, c) => sum + c.authorCount, 0)
      const countB = b[1].reduce((sum, c) => sum + c.authorCount, 0)
      return countB - countA
    })
    .map(([domain]) => domain)

  // Handle sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect()
        setIsSticky(rect.bottom < 0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) {
    return (
      <div className="mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (camps.length === 0) return null

  return (
    <>
      {/* Main Discourse Map Grid */}
      <div ref={mapRef} className="mb-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Map className="w-5 h-5 text-[var(--color-accent)]" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-charcoal)]">
            AI Discourse Map
          </h2>
          <span className="text-xs text-[var(--color-mid-gray)]">
            {camps.length} perspectives · {totalAuthors} authors
          </span>
        </div>

        {/* Grid by Domain */}
        <div className="space-y-4">
          {sortedDomains.map((domain) => {
            const domainCamps = campsByDomain[domain]
            const colors = getDomainColor(domain)
            const domainAuthorCount = domainCamps.reduce((sum, c) => sum + c.authorCount, 0)

            return (
              <div key={domain}>
                {/* Domain Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                  <span className={`text-xs font-medium uppercase tracking-wide ${colors.text}`}>
                    {domain}
                  </span>
                  <span className="text-xs text-[var(--color-mid-gray)]">
                    {domainAuthorCount} authors
                  </span>
                </div>

                {/* Perspective Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {domainCamps.sort((a, b) => b.authorCount - a.authorCount).map((camp) => {
                    const isActive = activeCampId === camp.id
                    const percentage = totalAuthors > 0 ? (camp.authorCount / totalAuthors) * 100 : 0

                    return (
                      <button
                        key={camp.id}
                        onClick={() => onCampClick(camp.id)}
                        className={`relative text-left p-3 rounded-lg border-l-4 transition-all group ${colors.border} ${
                          isActive
                            ? `${colors.light} ring-2 ring-offset-1 ring-${colors.bg.replace('bg-', '')}`
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        style={{
                          boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-subtle)',
                        }}
                      >
                        {/* Perspective Name */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="text-sm font-medium text-[var(--color-soft-black)] line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
                            {camp.name}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                        </div>

                        {/* Author Count Bar */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors.bg} transition-all duration-500`}
                              style={{ width: `${Math.max(percentage, 5)}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[var(--color-mid-gray)]">
                            <Users className="w-3 h-3" />
                            <span className="font-medium">{camp.authorCount}</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      {isSticky && (
        <div
          ref={stickyRef}
          className="fixed top-16 left-0 right-0 z-20 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm"
          style={{ marginLeft: 'var(--sidebar-width, 256px)' }}
        >
          <div className="max-w-5xl mx-auto px-6 py-2">
            <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
              <span className="text-xs text-[var(--color-mid-gray)] mr-2 flex-shrink-0">Jump to:</span>
              {camps.map((camp) => {
                const colors = getDomainColor(camp.domain)
                const isActive = activeCampId === camp.id

                return (
                  <button
                    key={camp.id}
                    onClick={() => onCampClick(camp.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? `${colors.light} ${colors.text} ring-1 ring-current`
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
                    <span className="max-w-[120px] truncate">{camp.name}</span>
                    <span className="text-[10px] opacity-60">{camp.authorCount}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

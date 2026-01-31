'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, Layers, X, PanelLeftClose } from 'lucide-react'
import { DOMAINS, getDomainConfig } from '@/lib/constants/domains'

interface DomainData {
  name: string
  perspectives: string[]
  authorCount: number
}

interface DomainOverviewProps {
  onDomainFilter?: (domain: string | null) => void
  activeDomain?: string | null
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  inline?: boolean  // When true, displays as inline grid in main content
  camps?: any[]     // Optional: pass camps data to avoid duplicate fetch
}

export default function DomainOverview({ onDomainFilter, activeDomain, isCollapsed = false, onToggleCollapse, inline = false, camps: propCamps }: DomainOverviewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [domainData, setDomainData] = useState<Record<string, DomainData>>({})
  const [loading, setLoading] = useState(true)
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const [totalAuthors, setTotalAuthors] = useState(0)
  const [totalPerspectives, setTotalPerspectives] = useState(0)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Process camps data (either from props or fetched)
  const processCamps = useCallback((camps: any[]) => {
    const grouped: Record<string, DomainData> = {}
    let authors = 0
    let perspectives = 0

    camps.forEach((camp: any) => {
      const domain = camp.domain || 'Other'
      if (!grouped[domain]) {
        grouped[domain] = { name: domain, perspectives: [], authorCount: 0 }
      }
      grouped[domain].perspectives.push(camp.name)
      grouped[domain].authorCount += camp.authorCount || camp.authors?.length || 0
      authors += camp.authorCount || camp.authors?.length || 0
      perspectives++
    })

    setDomainData(grouped)
    setTotalAuthors(authors)
    setTotalPerspectives(perspectives)
    setLoading(false)
  }, [])

  // Use props camps if provided, otherwise fetch
  useEffect(() => {
    if (propCamps && propCamps.length > 0) {
      processCamps(propCamps)
      return
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/api/camps')
        if (response.ok) {
          const data = await response.json()
          processCamps(data.camps || [])
        }
      } catch (error) {
        console.error('Error fetching domain data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [propCamps, processCamps])

  const handleDomainClick = (domainName: string) => {
    if (onDomainFilter) {
      if (activeDomain === domainName) {
        onDomainFilter(null)
      } else {
        onDomainFilter(domainName)
      }
    } else {
      const params = new URLSearchParams(searchParams.toString())
      if (params.get('domain') === domainName) {
        params.delete('domain')
      } else {
        params.set('domain', domainName)
      }
      router.push(`/browse?${params.toString()}`)
    }
  }

  const handleMouseEnter = (domainName: string, event: React.MouseEvent<HTMLDivElement>) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    const rect = event.currentTarget.getBoundingClientRect()
    // Show tooltip immediately
    setHoveredDomain(domainName)
    setTooltipPosition({
      top: rect.top,
      left: rect.right + 8
    })
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    // Small delay before hiding to allow mouse to move to tooltip
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredDomain(null)
      setTooltipPosition(null)
    }, 100)
  }

  const clearFilter = () => {
    onDomainFilter?.(null)
  }

  if (loading) {
    if (inline) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="h-4 w-32 rounded animate-pulse bg-gray-200 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 rounded-lg animate-pulse bg-gray-100" />
            ))}
          </div>
        </div>
      )
    }
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="border-b border-gray-200" style={{ padding: '24px 16px 16px 22px' }}>
          <div className="h-4 w-20 rounded animate-pulse bg-gray-200" />
        </div>
        <div className="flex-1 space-y-1.5" style={{ padding: '16px 16px 16px 22px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  // INLINE MODE: Grid layout for main content area
  if (inline) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h2 className="text-[14px] font-semibold text-gray-900">
              The Core Debates
            </h2>
          </div>
          <p className="text-[12px] text-gray-500 mt-1">
            Five domains shaping AI discourse — click to explore and filter perspectives
          </p>
        </div>

        {/* Domain Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DOMAINS.map((domain) => {
              const data = domainData[domain.name] || { perspectives: [], authorCount: 0 }
              const colors = getDomainConfig(domain.name)
              const isActive = activeDomain === domain.name
              const tensionParts = domain.keyTension.split(' vs. ')
              const leftLabel = tensionParts[0] || ''
              const rightLabel = tensionParts[1] || ''

              return (
                <button
                  key={domain.name}
                  onClick={() => handleDomainClick(domain.name)}
                  aria-expanded={isActive}
                  aria-controls={isActive ? `domain-details-${domain.name}` : undefined}
                  className="text-left transition-all duration-300 group"
                  style={{
                    padding: isActive ? '20px 24px' : '12px 14px',
                    borderRadius: '12px',
                    border: `1px solid ${isActive ? colors.bgSolid : '#e5e7eb'}`,
                    backgroundColor: isActive ? colors.bgLight : 'white',
                    boxShadow: isActive ? '0 4px 16px rgba(0,0,0,0.1)' : 'none',
                    gridColumn: isActive ? '1 / -1' : 'span 1'
                  }}
                >
                  {/* Domain Header */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span style={{ fontSize: isActive ? '18px' : '16px' }}>{domain.icon}</span>
                    <span
                      className="font-semibold flex-1 group-hover:text-indigo-700 transition-colors"
                      style={{
                        fontSize: isActive ? '15px' : '13px',
                        color: isActive ? colors.text : '#1f2937'
                      }}
                    >
                      {domain.shortName}
                    </span>
                    <ChevronRight
                      className="transition-transform"
                      style={{
                        width: '14px',
                        height: '14px',
                        color: isActive ? colors.bgSolid : '#9ca3af',
                        transform: isActive ? 'rotate(90deg)' : 'none'
                      }}
                    />
                  </div>

                  {/* Core Question */}
                  <p
                    className="leading-snug"
                    style={{
                      fontSize: isActive ? '13px' : '11px',
                      color: isActive ? colors.text : '#6b7280'
                    }}
                  >
                    {domain.coreQuestion}
                  </p>

                  {/* Expanded Details - Only when active (horizontal layout for full-width) */}
                  {isActive && (
                    <div
                      id={`domain-details-${domain.name}`}
                      role="region"
                      aria-label={`${domain.shortName} details`}
                      style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: `1px solid ${colors.bgSolid}30`
                      }}
                    >
                      {/* Two-column layout for wider viewport, single column on mobile */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        {/* Left column: Description */}
                        <div>
                          <p style={{
                            fontSize: '13px',
                            lineHeight: '1.6',
                            color: '#374151',
                            margin: 0
                          }}>
                            {domain.description}
                          </p>
                        </div>

                        {/* Right column: You'll Find + Debate */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {/* You'll Find */}
                          <div style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            border: `1px solid ${colors.bgSolid}30`
                          }}>
                            <div style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: colors.text,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              marginBottom: '4px'
                            }}>
                              You'll Find
                            </div>
                            <p style={{
                              fontSize: '11px',
                              lineHeight: '1.5',
                              color: '#4b5563',
                              margin: 0
                            }}>
                              {domain.youWillFind}
                            </p>
                          </div>

                          {/* The Debate Spectrum */}
                          <div>
                            <div style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: '#6b7280',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              marginBottom: '6px'
                            }}>
                              The Debate
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}>
                              <span style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                color: colors.text,
                                whiteSpace: 'nowrap'
                              }}>
                                {leftLabel}
                              </span>
                              <div style={{
                                flex: 1,
                                height: '6px',
                                borderRadius: '3px',
                                background: `linear-gradient(90deg, ${colors.bgSolid} 0%, #fbbf24 50%, #9ca3af 100%)`
                              }} />
                              <span style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                color: '#6b7280',
                                whiteSpace: 'nowrap'
                              }}>
                                {rightLabel}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats row - full width */}
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t" style={{ borderColor: `${colors.bgSolid}30` }}>
                        <span style={{ fontSize: '12px', color: colors.text, fontWeight: 600 }}>
                          {data.perspectives.length} perspectives
                        </span>
                        <span style={{ fontSize: '12px', color: colors.text, fontWeight: 600 }}>
                          {data.authorCount} authors
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Compact Stats - Only when not active */}
                  {!isActive && (
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                        {data.perspectives.length} perspectives
                      </span>
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                        {data.authorCount} authors
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // SIDEBAR MODE: Vertical list for fixed sidebar
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with collapse toggle */}
      <div
        className="flex-shrink-0 border-b border-indigo-100 relative"
        style={{ padding: '24px 16px 16px 22px' }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, #6366f1 0%, rgba(99, 102, 241, 0.3) 100%)' }}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h2 className="text-[13px] font-semibold text-gray-900 uppercase tracking-wider">
              The Core Debates
            </h2>
          </div>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Collapse panel"
            >
              <PanelLeftClose className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
        <p className="text-[12px] text-gray-500 mt-1">
          Five domains shaping AI discourse
        </p>
      </div>

      {/* Active Filter Indicator */}
      {activeDomain && (
        <div
          className="flex items-center justify-between border-b border-indigo-200"
          style={{
            padding: '10px 16px 10px 22px',
            backgroundColor: '#eef2ff'
          }}
        >
          <span className="text-[12px] text-indigo-700 font-medium">
            Filtering: {DOMAINS.find(d => d.name === activeDomain)?.shortName}
          </span>
          <button
            onClick={clearFilter}
            className="hover:bg-indigo-100 rounded transition-colors p-1"
          >
            <X className="w-3.5 h-3.5 text-indigo-600" />
          </button>
        </div>
      )}

      {/* Domain List - Scrollable */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '16px 16px 16px 22px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {DOMAINS.map((domain) => {
          const data = domainData[domain.name] || { perspectives: [], authorCount: 0 }
          const colors = getDomainConfig(domain.name)
          const isActive = activeDomain === domain.name
          const isFiltered = activeDomain && activeDomain !== domain.name
          const isHovered = hoveredDomain === domain.name

          return (
            <div
              key={domain.name}
              className="relative"
              onMouseEnter={(e) => handleMouseEnter(domain.name, e)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleDomainClick(domain.name)}
                className="w-full text-left transition-all duration-200"
                style={{
                  padding: isHovered ? '12px' : '10px',
                  borderRadius: '8px',
                  borderLeft: `3px solid ${isActive ? colors.bgSolid : isHovered ? colors.bgSolid : 'transparent'}`,
                  border: `1px solid ${isActive ? colors.bgSolid : isHovered ? colors.bgSolid : '#e5e7eb'}`,
                  backgroundColor: isActive ? colors.bgLight : isHovered ? colors.bgLight : 'white',
                  boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.1)' : isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                {/* Domain Header */}
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: '15px' }}>{domain.icon}</span>
                  <span
                    className="font-semibold flex-1"
                    style={{
                      fontSize: '14px',
                      color: isActive || isHovered ? colors.text : '#1f2937'
                    }}
                  >
                    {domain.shortName}
                  </span>
                  <ChevronRight
                    className="transition-transform"
                    style={{
                      width: '14px',
                      height: '14px',
                      color: isActive || isHovered ? colors.bgSolid : '#9ca3af',
                      transform: isHovered ? 'translateX(2px)' : 'none'
                    }}
                  />
                </div>

                {/* Core Question - Always visible */}
                <p
                  className="leading-snug"
                  style={{
                    fontSize: '12px',
                    color: isActive || isHovered ? colors.text : '#6b7280',
                    marginTop: '4px'
                  }}
                >
                  {domain.coreQuestion}
                </p>

                {/* Expanded content - visible when active or hovered */}
                {(isActive || isHovered) && (
                  <div style={{
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: `1px solid ${colors.bgSolid}30`
                  }}>
                    {/* Description */}
                    <p style={{
                      fontSize: '12px',
                      lineHeight: '1.5',
                      color: '#374151',
                      marginBottom: '10px'
                    }}>
                      {domain.description}
                    </p>

                    {/* You'll find */}
                    <div style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: `${colors.bgLight}80`,
                      marginBottom: '10px'
                    }}>
                      <div style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: colors.text,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '4px'
                      }}>
                        You'll find
                      </div>
                      <p style={{
                        fontSize: '11px',
                        lineHeight: '1.5',
                        color: '#4b5563',
                        margin: 0
                      }}>
                        {domain.youWillFind}
                      </p>
                    </div>

                    {/* Spectrum visualization */}
                    {(() => {
                      const tensionParts = domain.keyTension.split(' vs. ')
                      const leftLabel = tensionParts[0] || ''
                      const rightLabel = tensionParts[1] || ''
                      return (
                        <div>
                          <div style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '6px'
                          }}>
                            The Debate
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              color: colors.text,
                              whiteSpace: 'nowrap'
                            }}>
                              {leftLabel}
                            </span>
                            <div style={{
                              flex: 1,
                              height: '5px',
                              borderRadius: '3px',
                              background: `linear-gradient(90deg, ${colors.bgSolid} 0%, #fbbf24 50%, #9ca3af 100%)`
                            }} />
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              color: '#6b7280',
                              whiteSpace: 'nowrap'
                            }}>
                              {rightLabel}
                            </span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </button>
            </div>
          )
        })}
        </div>
      </div>


      {/* Tooltip animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

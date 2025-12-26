'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, Users, Layers, X, PanelLeftClose, PanelLeft } from 'lucide-react'
import { getDomainColor } from './DiscourseMap'

// Domain metadata with context for new users
interface DomainInfo {
  name: string
  shortName: string
  icon: string
  coreQuestion: string
  keyTension: string
}

const DOMAIN_INFO: DomainInfo[] = [
  {
    name: 'AI Technical Capabilities',
    shortName: 'Technical',
    icon: '🔬',
    coreQuestion: 'How should AI systems be built?',
    keyTension: 'Scaling vs. New Approaches'
  },
  {
    name: 'AI & Society',
    shortName: 'Society',
    icon: '🌍',
    coreQuestion: 'How should AI be deployed?',
    keyTension: 'Safety First vs. Democratize Fast'
  },
  {
    name: 'Enterprise AI Adoption',
    shortName: 'Enterprise',
    icon: '🏢',
    coreQuestion: 'How should orgs integrate AI?',
    keyTension: 'Business-led vs. Tech-led'
  },
  {
    name: 'AI Governance & Oversight',
    shortName: 'Governance',
    icon: '⚖️',
    coreQuestion: 'How should AI be regulated?',
    keyTension: 'Regulate vs. Innovate'
  },
  {
    name: 'Future of Work',
    shortName: 'Work',
    icon: '💼',
    coreQuestion: 'How will AI change jobs?',
    keyTension: 'Displacement vs. Collaboration'
  }
]

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
}

export default function DomainOverview({ onDomainFilter, activeDomain, isCollapsed = false, onToggleCollapse }: DomainOverviewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [domainData, setDomainData] = useState<Record<string, DomainData>>({})
  const [loading, setLoading] = useState(true)
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null)
  const [totalAuthors, setTotalAuthors] = useState(0)
  const [totalPerspectives, setTotalPerspectives] = useState(0)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch domain/camp data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/camps')
        if (response.ok) {
          const data = await response.json()
          const camps = data.camps || []

          // Group by domain
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
        }
      } catch (error) {
        console.error('Error fetching domain data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
      router.push(`/explore?${params.toString()}`)
    }
  }

  const handleMouseEnter = (domainName: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredDomain(domainName)
    }, 200)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setHoveredDomain(null)
  }

  const clearFilter = () => {
    onDomainFilter?.(null)
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-3 border-b border-gray-200">
          <div className="h-4 w-20 rounded animate-pulse bg-gray-200" />
        </div>
        <div className="flex-1 p-2 space-y-1.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with collapse toggle */}
      <div
        className="flex-shrink-0 border-b border-indigo-100 relative"
        style={{ padding: '12px' }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, #6366f1 0%, rgba(99, 102, 241, 0.3) 100%)' }}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Domains
            </h2>
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-medium text-indigo-700 bg-indigo-100 rounded-full">
              {DOMAIN_INFO.length}
            </span>
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
        <p className="text-[10px] text-gray-500 mt-1">
          {totalPerspectives} perspectives · {totalAuthors} authors
        </p>
      </div>

      {/* Active Filter Indicator */}
      {activeDomain && (
        <div
          className="flex items-center justify-between border-b border-indigo-200"
          style={{
            padding: '8px 12px',
            backgroundColor: '#eef2ff'
          }}
        >
          <span className="text-[10px] text-indigo-700 font-medium">
            Filtering: {DOMAIN_INFO.find(d => d.name === activeDomain)?.shortName}
          </span>
          <button
            onClick={clearFilter}
            className="hover:bg-indigo-100 rounded transition-colors p-1"
          >
            <X className="w-3 h-3 text-indigo-600" />
          </button>
        </div>
      )}

      {/* Domain List - Scrollable */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {DOMAIN_INFO.map((domain) => {
          const data = domainData[domain.name] || { perspectives: [], authorCount: 0 }
          const colors = getDomainColor(domain.name)
          const isActive = activeDomain === domain.name
          const isFiltered = activeDomain && activeDomain !== domain.name
          const isHovered = hoveredDomain === domain.name

          return (
            <div
              key={domain.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(domain.name)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleDomainClick(domain.name)}
                className="w-full text-left transition-all duration-150"
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  borderLeft: `3px solid ${isActive ? colors.bgSolid : 'transparent'}`,
                  border: `1px solid ${isActive ? colors.bgSolid : isHovered ? '#d1d5db' : '#e5e7eb'}`,
                  backgroundColor: isActive ? colors.bgLight : isHovered ? '#f9fafb' : 'white',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                {/* Domain Header */}
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: '14px' }}>{domain.icon}</span>
                  <span
                    className="font-semibold flex-1"
                    style={{
                      fontSize: '12px',
                      color: isActive ? colors.textDark : '#1f2937'
                    }}
                  >
                    {domain.shortName}
                  </span>
                  <ChevronRight
                    className="transition-transform"
                    style={{
                      width: '12px',
                      height: '12px',
                      color: isActive ? colors.bgSolid : '#9ca3af',
                      transform: isHovered ? 'translateX(2px)' : 'none'
                    }}
                  />
                </div>

                {/* Core Question */}
                <p
                  className="leading-snug"
                  style={{
                    fontSize: '10px',
                    color: isActive ? colors.textDark : '#6b7280',
                    marginTop: '4px',
                    marginBottom: '6px'
                  }}
                >
                  {domain.coreQuestion}
                </p>

                {/* Stats Row */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center gap-1"
                    style={{
                      fontSize: '9px',
                      color: '#9ca3af'
                    }}
                  >
                    <Layers style={{ width: '10px', height: '10px' }} />
                    <span>{data.perspectives.length}</span>
                  </div>
                  <div
                    className="flex items-center gap-1 font-medium"
                    style={{
                      fontSize: '9px',
                      color: colors.bgSolid
                    }}
                  >
                    <Users style={{ width: '10px', height: '10px' }} />
                    <span>{data.authorCount}</span>
                  </div>
                </div>
              </button>

              {/* Hover Tooltip - Positioned to the right */}
              {isHovered && !isActive && (
                <div
                  className="absolute left-full top-0 ml-2 z-50"
                  style={{
                    width: '220px',
                    padding: '10px',
                    borderRadius: 'var(--radius-base)',
                    backgroundColor: 'white',
                    border: '1px solid var(--color-light-gray)',
                    boxShadow: 'var(--shadow-md)',
                    animation: 'fadeIn 0.15s ease-out'
                  }}
                >
                  {/* Tooltip Header */}
                  <div
                    className="flex items-center gap-2 pb-2 mb-2"
                    style={{ borderBottom: `1px solid ${colors.bgSolid}` }}
                  >
                    <span style={{ fontSize: '14px' }}>{domain.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-soft-black)' }}>
                      {domain.name}
                    </span>
                  </div>

                  {/* Key Tension */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-mid-gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                      Key Tension
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: `${colors.bgSolid}10`,
                        color: colors.bgSolid
                      }}
                    >
                      {domain.keyTension}
                    </div>
                  </div>

                  {/* Perspectives List */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-mid-gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                      Perspectives
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {data.perspectives.map((p) => (
                        <div
                          key={p}
                          className="flex items-center gap-1.5"
                          style={{ fontSize: '10px', color: 'var(--color-charcoal)' }}
                        >
                          <span
                            className="flex-shrink-0"
                            style={{ width: '4px', height: '4px', borderRadius: '1px', backgroundColor: colors.bgSolid }}
                          />
                          <span className="truncate">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div
                    className="flex items-center gap-1"
                    style={{
                      fontSize: '9px',
                      fontWeight: 500,
                      paddingTop: '6px',
                      color: colors.bgSolid,
                      borderTop: '1px solid var(--color-light-gray)'
                    }}
                  >
                    Click to filter
                    <ChevronRight style={{ width: '10px', height: '10px' }} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
        </div>
      </div>

      {/* Footer Stats - Minimal */}
      <div
        className="flex-shrink-0 border-t border-gray-200"
        style={{ padding: '8px 12px', backgroundColor: '#f9fafb' }}
      >
        <div className="flex items-center justify-between text-[9px] text-gray-500">
          <span>{totalAuthors} authors</span>
          <span>{totalPerspectives} perspectives</span>
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

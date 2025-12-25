'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, Users, Layers, X } from 'lucide-react'
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
}

export default function DomainOverview({ onDomainFilter, activeDomain }: DomainOverviewProps) {
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
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex-1 p-3 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
          AI Discourse Domains
        </h2>
        <p className="text-[10px] text-gray-500 mt-1">
          {DOMAIN_INFO.length} domains · {totalPerspectives} perspectives
        </p>
      </div>

      {/* Active Filter Indicator */}
      {activeDomain && (
        <div className="px-3 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
          <span className="text-xs text-indigo-700 font-medium truncate">
            Filtering: {DOMAIN_INFO.find(d => d.name === activeDomain)?.shortName}
          </span>
          <button
            onClick={clearFilter}
            className="p-1 hover:bg-indigo-100 rounded transition-colors"
          >
            <X className="w-3 h-3 text-indigo-600" />
          </button>
        </div>
      )}

      {/* Domain List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
                  padding: '12px',
                  borderRadius: '10px',
                  border: `2px solid ${isActive ? colors.bgSolid : isHovered ? colors.bgSolid : 'var(--color-light-gray)'}`,
                  backgroundColor: isActive ? colors.bgSolid : 'white',
                  opacity: isFiltered ? 0.5 : 1,
                  transform: isHovered && !isActive ? 'translateX(2px)' : 'none',
                  boxShadow: isActive ? 'var(--shadow-md)' : isHovered ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {/* Domain Header */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{domain.icon}</span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: isActive ? 'white' : 'var(--color-soft-black)' }}
                  >
                    {domain.shortName}
                  </span>
                  <ChevronRight
                    className="w-3.5 h-3.5 ml-auto transition-transform"
                    style={{
                      color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--color-mid-gray)',
                      transform: isHovered ? 'translateX(2px)' : 'none'
                    }}
                  />
                </div>

                {/* Core Question */}
                <p
                  className="text-[11px] leading-tight mb-2"
                  style={{ color: isActive ? 'rgba(255,255,255,0.85)' : 'var(--color-mid-gray)' }}
                >
                  {domain.coreQuestion}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center gap-1 text-[10px]"
                    style={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--color-mid-gray)' }}
                  >
                    <Layers className="w-3 h-3" />
                    <span>{data.perspectives.length}</span>
                  </div>
                  <div
                    className="flex items-center gap-1 text-[10px] font-medium"
                    style={{ color: isActive ? 'white' : colors.bgSolid }}
                  >
                    <Users className="w-3 h-3" />
                    <span>{data.authorCount}</span>
                  </div>
                </div>
              </button>

              {/* Hover Tooltip - Positioned to the right */}
              {isHovered && !isActive && (
                <div
                  className="absolute left-full top-0 ml-3 z-50"
                  style={{
                    width: '240px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    border: '1px solid var(--color-light-gray)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    animation: 'fadeIn 0.15s ease-out'
                  }}
                >
                  {/* Tooltip Header */}
                  <div
                    className="flex items-center gap-2 pb-2 mb-2"
                    style={{ borderBottom: `2px solid ${colors.bgSolid}` }}
                  >
                    <span className="text-lg">{domain.icon}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {domain.name}
                    </span>
                  </div>

                  {/* Key Tension */}
                  <div className="mb-3">
                    <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Key Tension
                    </div>
                    <div
                      className="text-xs font-medium px-2 py-1.5 rounded"
                      style={{ backgroundColor: `${colors.bgSolid}15`, color: colors.bgSolid }}
                    >
                      {domain.keyTension}
                    </div>
                  </div>

                  {/* Perspectives List */}
                  <div className="mb-2">
                    <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Perspectives
                    </div>
                    <div className="space-y-1">
                      {data.perspectives.map((p, idx) => (
                        <div
                          key={p}
                          className="text-[11px] text-gray-700 flex items-center gap-1.5"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: colors.bgSolid }}
                          />
                          <span className="truncate">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div
                    className="text-[10px] font-medium pt-2 flex items-center gap-1"
                    style={{ color: colors.bgSolid, borderTop: '1px solid var(--color-light-gray)' }}
                  >
                    Click to filter
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-gray-200 flex-shrink-0 bg-gray-50">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>{totalAuthors} thought leaders</span>
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

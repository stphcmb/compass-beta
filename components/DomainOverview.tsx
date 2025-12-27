'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, Layers, X, PanelLeftClose } from 'lucide-react'
import { getDomainColor } from './DiscourseMap'

// Domain metadata with context for new users
interface DomainInfo {
  name: string
  shortName: string
  icon: string
  coreQuestion: string
  keyTension: string
  description: string
  youWillFind: string
}

const DOMAIN_INFO: DomainInfo[] = [
  {
    name: 'AI Technical Capabilities',
    shortName: 'Technical',
    icon: '🔬',
    coreQuestion: 'How should AI systems be built?',
    keyTension: 'Scaling vs. New Approaches',
    description: 'The foundational debate about AI\'s trajectory. Some experts believe current architectures just need more data and compute to reach transformative intelligence. Others argue we\'re hitting fundamental limits and need entirely new approaches.',
    youWillFind: 'Research scientists, ML engineers, and technical leaders debating whether scaling laws will continue or if breakthroughs require new paradigms.'
  },
  {
    name: 'AI & Society',
    shortName: 'Society',
    icon: '🌍',
    coreQuestion: 'How should AI be deployed?',
    keyTension: 'Safety First vs. Democratize Fast',
    description: 'The tension between caution and access. Safety advocates worry about existential risks and want to slow deployment until we understand AI better. Democratizers argue that broad access empowers people and that delay concentrates power.',
    youWillFind: 'Ethicists, public intellectuals, and policy thinkers wrestling with how AI should reshape daily life and human potential.'
  },
  {
    name: 'Enterprise AI Adoption',
    shortName: 'Enterprise',
    icon: '🏢',
    coreQuestion: 'How should orgs integrate AI?',
    keyTension: 'Business-led vs. Tech-led',
    description: 'The practical challenge of making AI work in organizations. Should transformation start with business problems and ROI? Or should you build robust technical infrastructure first and let capabilities drive strategy?',
    youWillFind: 'CTOs, consultants, and transformation leaders sharing what actually works when deploying AI at scale.'
  },
  {
    name: 'AI Governance & Oversight',
    shortName: 'Governance',
    icon: '⚖️',
    coreQuestion: 'How should AI be regulated?',
    keyTension: 'Regulate vs. Innovate',
    description: 'The policy battleground. Interventionists want guardrails before capabilities advance further. Innovation advocates worry premature rules will stifle progress and hand leadership to less cautious nations.',
    youWillFind: 'Policymakers, legal scholars, and tech leaders debating who should control AI and what rules should apply.'
  },
  {
    name: 'Future of Work',
    shortName: 'Work',
    icon: '💼',
    coreQuestion: 'How will AI change jobs?',
    keyTension: 'Displacement vs. Collaboration',
    description: 'The question that affects everyone. Will AI automate jobs away, requiring massive policy responses? Or will humans and AI collaborate, with machines amplifying what people do rather than replacing them?',
    youWillFind: 'Economists, HR leaders, and futurists examining how AI will transform employment, skills, and the workplace.'
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
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
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
            padding: '8px 12px',
            backgroundColor: '#eef2ff'
          }}
        >
          <span className="text-[12px] text-indigo-700 font-medium">
            Filtering: {DOMAIN_INFO.find(d => d.name === activeDomain)?.shortName}
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
                      color: isActive || isHovered ? colors.textDark : '#1f2937'
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
                    color: isActive || isHovered ? colors.textDark : '#6b7280',
                    marginTop: '4px',
                    marginBottom: isHovered ? '8px' : '0'
                  }}
                >
                  {domain.coreQuestion}
                </p>

                {/* Expanded content on hover */}
                {isHovered && (
                  <div style={{
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: `1px solid ${colors.bgSolid}40`
                  }}>
                    {/* Description */}
                    <p style={{
                      fontSize: '13px',
                      lineHeight: '1.5',
                      color: '#374151',
                      marginBottom: '10px'
                    }}>
                      {domain.description}
                    </p>

                    {/* You'll find */}
                    <div style={{
                      padding: '10px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      marginBottom: '10px'
                    }}>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: colors.textDark,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '4px'
                      }}>
                        You'll find
                      </div>
                      <p style={{
                        fontSize: '12px',
                        lineHeight: '1.5',
                        color: '#4b5563',
                        margin: 0
                      }}>
                        {domain.youWillFind}
                      </p>
                    </div>

                    {/* Central debate badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#6b7280',
                        textTransform: 'uppercase'
                      }}>
                        Debate:
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '10px',
                          backgroundColor: colors.bgSolid,
                          color: 'white'
                        }}
                      >
                        {domain.keyTension}
                      </span>
                    </div>
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

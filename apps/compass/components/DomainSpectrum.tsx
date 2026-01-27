'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Users } from 'lucide-react'
import { useAuthorPanel } from '@/contexts/AuthorPanelContext'
import { supabase } from '@/lib/supabase'

interface Author {
  id: string
  name: string
  relevance: 'strong' | 'partial' | 'challenges'
}

interface Camp {
  id: string
  label: string
  authors: Author[]
}

interface DomainData {
  id: number
  code: string
  name: string
  camps: Camp[]
}

// Domain display config
const DOMAIN_CONFIG: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  'AI Progress': { icon: '🔬', color: '#1d4ed8', bg: '#dbeafe', border: '#93c5fd' },
  'Society & Ethics': { icon: '🌍', color: '#7c3aed', bg: '#f3e8ff', border: '#c4b5fd' },
  'Enterprise': { icon: '🏢', color: '#059669', bg: '#d1fae5', border: '#6ee7b7' },
  'Governance': { icon: '⚖️', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
  'Future of Work': { icon: '💼', color: '#d97706', bg: '#fef3c7', border: '#fcd34d' },
}

export default function DomainSpectrum() {
  const { openPanel } = useAuthorPanel()
  const [domains, setDomains] = useState<DomainData[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedDomain, setExpandedDomain] = useState<number | null>(null)

  useEffect(() => {
    fetchDomainData()
  }, [])

  async function fetchDomainData() {
    if (!supabase) return

    try {
      // Fetch all domains
      const { data: domainsData } = await supabase
        .from('camp_domains')
        .select('*')
        .order('id')

      if (!domainsData) return

      // Fetch all camps with their authors
      const { data: campsData } = await supabase
        .from('camps')
        .select(`
          id,
          label,
          domain_id,
          camp_authors (
            relevance,
            authors (id, name)
          )
        `)

      if (!campsData) return

      // Group camps by domain
      const domainMap = new Map<number, DomainData>()

      for (const domain of domainsData) {
        domainMap.set(domain.id, {
          id: domain.id,
          code: domain.code,
          name: domain.name,
          camps: []
        })
      }

      for (const camp of campsData) {
        const domainData = domainMap.get(camp.domain_id)
        if (!domainData) continue

        const authors: Author[] = (camp.camp_authors || [])
          .filter((ca: any) => ca.authors)
          .map((ca: any) => ({
            id: ca.authors.id,
            name: ca.authors.name,
            relevance: ca.relevance || 'partial'
          }))

        domainData.camps.push({
          id: camp.id,
          label: camp.label,
          authors
        })
      }

      setDomains(Array.from(domainMap.values()))
    } catch (error) {
      console.error('Error fetching domain data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase()
  }

  const toggleDomain = (domainId: number) => {
    setExpandedDomain(expandedDomain === domainId ? null : domainId)
  }

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '13px'
      }}>
        Loading domains...
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px'
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#6b7280'
        }}>
          Explore by Domain
        </span>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
      </div>

      {/* Domain Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '10px'
      }}>
        {domains.map(domain => {
          const config = DOMAIN_CONFIG[domain.name] || {
            icon: '📊',
            color: '#6b7280',
            bg: '#f3f4f6',
            border: '#d1d5db'
          }
          const isExpanded = expandedDomain === domain.id
          const totalAuthors = domain.camps.reduce((sum, c) => sum + c.authors.length, 0)

          return (
            <div key={domain.id}>
              {/* Collapsed Card */}
              <button
                onClick={() => toggleDomain(domain.id)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: `1px solid ${isExpanded ? config.color : config.border}`,
                  backgroundColor: isExpanded ? config.bg : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{config.icon}</span>
                    <div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: config.color
                      }}>
                        {domain.name}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Users size={10} />
                        {totalAuthors} authors · {domain.camps.length} camps
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} style={{ color: config.color }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: '#9ca3af' }} />
                  )}
                </div>
              </button>

              {/* Expanded Spectrum View */}
              {isExpanded && domain.camps.length >= 2 && (
                <div style={{
                  marginTop: '8px',
                  padding: '16px',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  border: `1px solid ${config.border}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  {/* Spectrum */}
                  <div style={{ position: 'relative' }}>
                    {/* Camp Labels */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#059669',
                        maxWidth: '45%'
                      }}>
                        {domain.camps[0]?.label}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#dc2626',
                        textAlign: 'right',
                        maxWidth: '45%'
                      }}>
                        {domain.camps[1]?.label}
                      </div>
                    </div>

                    {/* Spectrum Bar */}
                    <div style={{
                      height: '4px',
                      borderRadius: '2px',
                      background: 'linear-gradient(90deg, #10b981 0%, #fbbf24 50%, #ef4444 100%)',
                      marginBottom: '16px'
                    }} />

                    {/* Authors on Spectrum */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}>
                      {/* Left camp authors (believes) */}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '9px',
                          fontWeight: 600,
                          color: '#059669',
                          textTransform: 'uppercase',
                          marginBottom: '8px'
                        }}>
                          Advocates
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {domain.camps[0]?.authors
                            .filter(a => a.relevance !== 'challenges')
                            .slice(0, 6)
                            .map(author => (
                              <button
                                key={author.id}
                                onClick={() => openPanel(author.id)}
                                title={author.name}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  border: author.relevance === 'strong'
                                    ? '2px solid #10b981'
                                    : '1px solid #d1d5db',
                                  backgroundColor: author.relevance === 'strong'
                                    ? '#d1fae5'
                                    : '#f9fafb',
                                  fontSize: '9px',
                                  fontWeight: 600,
                                  color: author.relevance === 'strong' ? '#059669' : '#6b7280',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {getInitials(author.name)}
                              </button>
                            ))}
                          {domain.camps[0]?.authors.filter(a => a.relevance !== 'challenges').length > 6 && (
                            <span style={{
                              fontSize: '10px',
                              color: '#9ca3af',
                              alignSelf: 'center',
                              marginLeft: '4px'
                            }}>
                              +{domain.camps[0].authors.filter(a => a.relevance !== 'challenges').length - 6}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Divider */}
                      <div style={{
                        width: '1px',
                        backgroundColor: '#e5e7eb',
                        margin: '0 8px'
                      }} />

                      {/* Right camp authors (believes) */}
                      <div style={{ flex: 1, textAlign: 'right' }}>
                        <div style={{
                          fontSize: '9px',
                          fontWeight: 600,
                          color: '#dc2626',
                          textTransform: 'uppercase',
                          marginBottom: '8px'
                        }}>
                          Advocates
                        </div>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '4px',
                          justifyContent: 'flex-end'
                        }}>
                          {domain.camps[1]?.authors
                            .filter(a => a.relevance !== 'challenges')
                            .slice(0, 6)
                            .map(author => (
                              <button
                                key={author.id}
                                onClick={() => openPanel(author.id)}
                                title={author.name}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  border: author.relevance === 'strong'
                                    ? '2px solid #ef4444'
                                    : '1px solid #d1d5db',
                                  backgroundColor: author.relevance === 'strong'
                                    ? '#fee2e2'
                                    : '#f9fafb',
                                  fontSize: '9px',
                                  fontWeight: 600,
                                  color: author.relevance === 'strong' ? '#dc2626' : '#6b7280',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {getInitials(author.name)}
                              </button>
                            ))}
                          {domain.camps[1]?.authors.filter(a => a.relevance !== 'challenges').length > 6 && (
                            <span style={{
                              fontSize: '10px',
                              color: '#9ca3af',
                              alignSelf: 'center',
                              marginRight: '4px'
                            }}>
                              +{domain.camps[1].authors.filter(a => a.relevance !== 'challenges').length - 6}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '16px',
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid #f3f4f6'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          border: '2px solid #10b981',
                          backgroundColor: '#d1fae5'
                        }} />
                        <span style={{ fontSize: '10px', color: '#6b7280' }}>Strong</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          border: '1px solid #d1d5db',
                          backgroundColor: '#f9fafb'
                        }} />
                        <span style={{ fontSize: '10px', color: '#6b7280' }}>Partial</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

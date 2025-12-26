'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Search, X, ChevronDown, ChevronRight } from 'lucide-react'
import Header from '@/components/Header'
import AuthorDetailPanel from '@/components/AuthorDetailPanel'
import { getThoughtLeaders } from '@/lib/api/thought-leaders'
import { getCampsWithAuthors } from '@/lib/api/thought-leaders'

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

const SIDEBAR_WIDTH = 220

// Domain colors
const DOMAINS = [
  { name: 'AI Technical Capabilities', short: 'Tech', bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
  { name: 'AI & Society', short: 'Society', bg: '#f3e8ff', text: '#7c3aed', border: '#c4b5fd' },
  { name: 'Enterprise AI Adoption', short: 'Enterprise', bg: '#d1fae5', text: '#059669', border: '#6ee7b7' },
  { name: 'AI Governance & Oversight', short: 'Governance', bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
  { name: 'Future of Work', short: 'Work', bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
]

const getDomainStyle = (domain: string | null) => {
  const d = DOMAINS.find(d => d.name === domain)
  return d || { name: 'Other', short: 'Other', bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' }
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function AuthorIndexPage() {
  const [authors, setAuthors] = useState<any[]>([])
  const [camps, setCamps] = useState<any[]>([])
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [panelOpen, setPanelOpen] = useState(true) // Open by default
  const [groupBy, setGroupBy] = useState<'alphabet' | 'domain'>('alphabet')
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Auto-select first author when data loads
  useEffect(() => {
    if (authors.length > 0 && !selectedAuthorId) {
      // Sort by last name and pick first
      const sorted = [...authors].sort((a, b) => {
        const aLast = a.name.split(' ').pop() || a.name
        const bLast = b.name.split(' ').pop() || b.name
        return aLast.localeCompare(bLast)
      })
      setSelectedAuthorId(sorted[0]?.id || null)
    }
  }, [authors, selectedAuthorId])

  // Listen for sidebar toggle
  useEffect(() => {
    const handleSidebarToggle = (e: Event) => {
      const ev = e as CustomEvent<{ isCollapsed: boolean }>
      setSidebarCollapsed(ev.detail.isCollapsed)
    }
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    const savedAnalyses = JSON.parse(localStorage.getItem('savedAIEditorAnalyses') || '[]')
    const hasContent = savedSearches.length > 0 || savedAnalyses.length > 0
    const userPreference = localStorage.getItem('sidebarCollapsed')
    if (userPreference !== null) {
      setSidebarCollapsed(userPreference === 'true')
    } else {
      setSidebarCollapsed(!hasContent)
    }
    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
    return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
  }, [])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [authorsData, result] = await Promise.all([
          getThoughtLeaders(),
          getCampsWithAuthors()
        ])
        setAuthors(authorsData)
        setCamps(result.camps)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Get author's primary domain
  const getAuthorDomain = (authorId: string) => {
    const authorCamps = camps.filter(camp =>
      camp.authors?.some((a: any) => a.id === authorId)
    )
    return authorCamps.length > 0 ? authorCamps[0].domain : null
  }

  // Handle author selection - auto-open panel
  const handleAuthorClick = (authorId: string) => {
    setSelectedAuthorId(authorId)
    setPanelOpen(true)
  }

  // Scroll to letter
  const scrollToLetter = (letter: string) => {
    const ref = letterRefs.current[letter]
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Filter and group authors
  const { authorsByLetter, authorsByDomain, domainCounts, availableLetters, totalFiltered } = useMemo(() => {
    let filtered = authors

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(author =>
        author.name.toLowerCase().includes(query) ||
        author.header_affiliation?.toLowerCase().includes(query) ||
        author.primary_affiliation?.toLowerCase().includes(query)
      )
    }

    // Apply domain filter
    if (domainFilter) {
      filtered = filtered.filter(author => getAuthorDomain(author.id) === domainFilter)
    }

    // Group by letter (last name)
    const byLetter: Record<string, any[]> = {}
    ALPHABET.forEach(letter => { byLetter[letter] = [] })
    byLetter['#'] = [] // For non-alphabetic

    // Group by domain
    const byDomain: Record<string, any[]> = {}
    const counts: Record<string, number> = {}
    DOMAINS.forEach(d => {
      byDomain[d.name] = []
      counts[d.name] = 0
    })
    byDomain['Other'] = []
    counts['Other'] = 0

    // Sort by last name
    const sorted = [...filtered].sort((a, b) => {
      const aLast = a.name.split(' ').pop() || a.name
      const bLast = b.name.split(' ').pop() || b.name
      return aLast.localeCompare(bLast)
    })

    sorted.forEach(author => {
      // Group by letter
      const lastName = author.name.split(' ').pop() || author.name
      const letter = lastName[0]?.toUpperCase()
      if (letter && ALPHABET.includes(letter)) {
        byLetter[letter].push(author)
      } else {
        byLetter['#'].push(author)
      }

      // Group by domain
      const domain = getAuthorDomain(author.id) || 'Other'
      if (byDomain[domain]) {
        byDomain[domain].push(author)
      } else {
        byDomain['Other'].push(author)
      }
    })

    // Count all authors per domain
    authors.forEach(author => {
      const domain = getAuthorDomain(author.id) || 'Other'
      if (counts[domain] !== undefined) {
        counts[domain]++
      }
    })

    // Get available letters
    const available = ALPHABET.filter(letter => byLetter[letter].length > 0)
    if (byLetter['#'].length > 0) available.push('#')

    return {
      authorsByLetter: byLetter,
      authorsByDomain: byDomain,
      domainCounts: counts,
      availableLetters: available,
      totalFiltered: filtered.length
    }
  }, [authors, searchQuery, domainFilter, camps])

  const sidebarMargin = sidebarCollapsed ? 0 : SIDEBAR_WIDTH

  if (loading) {
    return (
      <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
        <Sidebar />
        <Header sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 mt-16 flex items-center justify-center transition-all duration-300"
          style={{ marginLeft: `${sidebarMargin}px` }}>
          <div style={{ color: 'var(--color-mid-gray)', fontSize: '14px' }}>Loading authors...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'var(--color-bone)' }}>
      <Sidebar />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <main
        className="flex-1 mt-16 overflow-hidden transition-all duration-300"
        style={{ marginLeft: `${sidebarMargin}px`, display: 'flex' }}
      >
        {/* Left panel - Author list */}
        <div style={{
          width: '320px',
          minWidth: '320px',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--color-light-gray)',
          backgroundColor: 'white'
        }}>
          {/* Header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-light-gray)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
              <h1 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Thought Leaders</h1>
              <span style={{ fontSize: '11px', color: 'var(--color-mid-gray)' }}>
                {totalFiltered}
              </span>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <Search style={{
                position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                width: '13px', height: '13px', color: 'var(--color-mid-gray)'
              }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '5px 8px 5px 28px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-light-gray)', fontSize: '12px', outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0
                  }}
                >
                  <X style={{ width: '11px', height: '11px', color: 'var(--color-mid-gray)' }} />
                </button>
              )}
            </div>

            {/* Domain filters - compact */}
            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
              {DOMAINS.map(d => {
                const isActive = domainFilter === d.name
                return (
                  <button
                    key={d.name}
                    onClick={() => setDomainFilter(isActive ? null : d.name)}
                    title={d.name}
                    style={{
                      width: '18px', height: '18px', borderRadius: '4px',
                      border: isActive ? `2px solid ${d.text}` : '1px solid var(--color-light-gray)',
                      backgroundColor: isActive ? d.bg : 'white',
                      cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '2px',
                      backgroundColor: d.text
                    }} />
                  </button>
                )
              })}
              {domainFilter && (
                <button
                  onClick={() => setDomainFilter(null)}
                  style={{
                    padding: '2px 6px', borderRadius: '4px', fontSize: '10px',
                    border: '1px solid var(--color-light-gray)',
                    backgroundColor: '#f3f4f6', cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Scrollable list with alphabet sidebar */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Alphabet quick-jump */}
            <div style={{
              width: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '4px 2px', backgroundColor: '#fafafa', borderRight: '1px solid var(--color-light-gray)'
            }}>
              {ALPHABET.map(letter => {
                const hasAuthors = availableLetters.includes(letter)
                return (
                  <button
                    key={letter}
                    onClick={() => hasAuthors && scrollToLetter(letter)}
                    disabled={!hasAuthors}
                    style={{
                      padding: '0', fontSize: '8px', fontWeight: 600, lineHeight: '12px',
                      border: 'none', background: 'none', cursor: hasAuthors ? 'pointer' : 'default',
                      color: hasAuthors ? 'var(--color-charcoal)' : '#e5e7eb'
                    }}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>

            {/* Author list - single column */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {ALPHABET.map(letter => {
                const letterAuthors = authorsByLetter[letter] || []
                if (letterAuthors.length === 0) return null
                return (
                  <div key={letter} ref={el => { letterRefs.current[letter] = el }}>
                    {/* Letter header */}
                    <div style={{
                      padding: '4px 6px', fontSize: '10px', fontWeight: 700, color: 'var(--color-mid-gray)',
                      backgroundColor: 'var(--color-pale-gray)', borderRadius: '3px',
                      marginBottom: '2px', position: 'sticky', top: 0, zIndex: 1
                    }}>
                      {letter}
                    </div>
                    {/* Authors - single column */}
                    <div style={{ marginBottom: '6px' }}>
                      {letterAuthors.map((author: any) => {
                        const domain = getAuthorDomain(author.id)
                        const domainStyle = getDomainStyle(domain)
                        const isSelected = selectedAuthorId === author.id
                        return (
                          <button
                            key={author.id}
                            onClick={() => handleAuthorClick(author.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px', width: '100%',
                              padding: '5px 6px', borderRadius: '4px',
                              border: 'none',
                              backgroundColor: isSelected ? domainStyle.bg : 'transparent',
                              cursor: 'pointer', transition: 'all 60ms ease-out', textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) e.currentTarget.style.backgroundColor = '#f5f5f5'
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            {/* Domain dot */}
                            <span style={{
                              width: '6px', height: '6px', borderRadius: '50%',
                              backgroundColor: domainStyle.text, flexShrink: 0
                            }} />
                            {/* Name */}
                            <span style={{
                              fontSize: '12px', fontWeight: isSelected ? 600 : 400,
                              color: isSelected ? domainStyle.text : 'var(--color-soft-black)',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>
                              {author.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right panel - Author detail (always visible) */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <AuthorDetailPanel
            authorId={selectedAuthorId}
            isOpen={true}
            onClose={() => {}}
            embedded={true}
          />
        </div>
      </main>
    </div>
  )
}

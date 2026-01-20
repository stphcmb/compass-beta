import { NextResponse, NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

// Domain ID to name mapping
const DOMAIN_MAP: Record<number, string> = {
  1: 'AI Technical Capabilities',
  2: 'AI & Society',
  3: 'Enterprise AI Adoption',
  4: 'AI Governance & Oversight',
  5: 'Future of Work'
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    const now = new Date()

    // Fetch all authors
    const { data: authors, error: authorsError} = await supabase
      .from('authors')
      .select('id, name, header_affiliation, primary_affiliation, sources')

    if (authorsError) {
      console.error('Error fetching authors:', authorsError)
      throw authorsError
    }

    // Fetch all camps with their domain
    const { data: camps, error: campsError } = await supabase
      .from('camps')
      .select(`
        id,
        label,
        domain_id,
        camp_authors (
          author_id
        )
      `)

    if (campsError) {
      console.error('Error fetching camps:', campsError)
      throw campsError
    }

    // Fetch all sources with published_date
    const { data: sources, error: sourcesError } = await supabase
      .from('sources')
      .select('id, author_id, published_date, title, url')

    // Sources table might not exist or be empty - handle gracefully
    const allSources = sources || []

    // Calculate source date range (oldest to newest) - using timestamps to avoid TypeScript narrowing issues
    let oldestTimestamp = Infinity
    let newestTimestamp = 0
    let sourcesFromTable = allSources.length
    let sourcesFromAuthors = 0

    allSources.forEach(source => {
      if (source.published_date) {
        const pubDate = new Date(source.published_date)
        const timestamp = pubDate.getTime()
        if (!isNaN(timestamp)) {
          if (timestamp < oldestTimestamp) {
            oldestTimestamp = timestamp
          }
          if (timestamp > newestTimestamp) {
            newestTimestamp = timestamp
          }
        }
      }
    })

    // Calculate coverage by age
    const coverageByAge = {
      current: 0,    // < 90 days
      moderate: 0,   // 90-180 days
      stale: 0,      // > 180 days
      noDate: 0      // No published_date
    }

    // NEW: Track source quality metrics
    let sourcesWithSpecificDates = 0
    let sourcesWithYearOnly = 0
    let genericSources = 0

    allSources.forEach(source => {
      // Check date quality
      if (!source.published_date) {
        coverageByAge.noDate++
      } else {
        const pubDate = String(source.published_date)
        if (pubDate.match(/^\d{4}-01-01$/)) {
          sourcesWithYearOnly++
        } else if (pubDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          sourcesWithSpecificDates++
        }

        const publishedDate = new Date(source.published_date)
        const daysSince = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24))

        if (daysSince < 90) {
          coverageByAge.current++
        } else if (daysSince < 180) {
          coverageByAge.moderate++
        } else {
          coverageByAge.stale++
        }
      }

      // Check for generic sources (from sources table)
      const title = String(source.title || '')
      const url = String(source.url || '')
      const isGeneric =
        title.toLowerCase().includes('channel') ||
        title.toLowerCase().includes('homepage') ||
        title.toLowerCase().includes('website') ||
        title.toLowerCase().includes('profile') ||
        url.includes('youtube.com/@') ||
        url.includes('youtube.com/channel/') ||
        url.match(/^https?:\/\/[^\/]+\/?$/)
      if (isGeneric) {
        genericSources++
      }
    })

    // Build author sources map from sources table
    const authorSourcesMap = new Map<string, { sources: typeof allSources, mostRecent: Date | null }>()

    allSources.forEach(source => {
      if (!source.author_id) return

      const existing = authorSourcesMap.get(source.author_id) || { sources: [], mostRecent: null }
      existing.sources.push(source)

      if (source.published_date) {
        const pubDate = new Date(source.published_date)
        if (!existing.mostRecent || pubDate > existing.mostRecent) {
          existing.mostRecent = pubDate
        }
      }

      authorSourcesMap.set(source.author_id, existing)
    })

    // Also check author.sources JSON field (legacy/inline sources)
    authors?.forEach(author => {
      if (author.sources && Array.isArray(author.sources)) {
        const existing = authorSourcesMap.get(author.id) || { sources: [], mostRecent: null }
        sourcesFromAuthors += author.sources.length

        author.sources.forEach((src: any) => {
          // Sources might have date in different formats: published_date, date, year
          let pubDate = src.published_date || src.date || src.publishedDate
          // Handle year-only format (e.g., "2024" or 2024)
          if (!pubDate && src.year) {
            pubDate = `${src.year}-01-01` // Assume Jan 1 if only year provided
          }
          if (pubDate) {
            const date = new Date(pubDate)
            if (!isNaN(date.getTime())) {
              // Check date quality
              const pubDateStr = String(pubDate)
              if (pubDateStr.match(/^\d{4}-01-01$/)) {
                sourcesWithYearOnly++
              } else if (pubDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                sourcesWithSpecificDates++
              }

              if (!existing.mostRecent || date > existing.mostRecent) {
                existing.mostRecent = date
              }
              // Update global date range from author sources too
              const dateTimestamp = date.getTime()
              if (dateTimestamp < oldestTimestamp) {
                oldestTimestamp = dateTimestamp
              }
              if (dateTimestamp > newestTimestamp) {
                newestTimestamp = dateTimestamp
              }
              // Add to coverage count if not already from sources table
              const daysSince = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
              if (daysSince < 90) coverageByAge.current++
              else if (daysSince < 180) coverageByAge.moderate++
              else coverageByAge.stale++
            }
          }

          // Check for generic sources
          const title = String(src.title || '')
          const url = String(src.url || '')
          const isGeneric =
            title.toLowerCase().includes('channel') ||
            title.toLowerCase().includes('homepage') ||
            title.toLowerCase().includes('website') ||
            title.toLowerCase().includes('profile') ||
            url.includes('youtube.com/@') ||
            url.includes('youtube.com/channel/') ||
            url.match(/^https?:\/\/[^\/]+\/?$/)
          if (isGeneric) {
            genericSources++
          }
        })

        // Merge source counts
        existing.sources = [...existing.sources, ...author.sources]
        authorSourcesMap.set(author.id, existing)
      }
    })

    // Count authors with/without sources
    let authorsWithSources = 0
    let authorsWithoutSources = 0

    authors?.forEach(author => {
      const authorData = authorSourcesMap.get(author.id)
      if (authorData && authorData.sources.length > 0) {
        authorsWithSources++
      } else {
        authorsWithoutSources++
      }
    })

    // Calculate stalest authors
    const authorStaleness = (authors || []).map(author => {
      const authorData = authorSourcesMap.get(author.id)
      const sourceCount = authorData?.sources.length || 0
      const mostRecentDate = authorData?.mostRecent
      const daysSinceUpdate = mostRecentDate
        ? Math.floor((now.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24))
        : null

      return {
        id: author.id,
        name: author.name,
        affiliation: author.header_affiliation || author.primary_affiliation,
        sourceCount,
        mostRecentDate: mostRecentDate?.toISOString().split('T')[0] || null,
        daysSinceUpdate
      }
    })
    .sort((a, b) => {
      // Authors without sources first, then by oldest
      if (a.daysSinceUpdate === null && b.daysSinceUpdate === null) return 0
      if (a.daysSinceUpdate === null) return -1
      if (b.daysSinceUpdate === null) return 1
      return b.daysSinceUpdate - a.daysSinceUpdate
    })
    .slice(0, 15)

    // Calculate camp staleness
    const campStaleness = (camps || []).map(camp => {
      const campAuthorIds = camp.camp_authors?.map((ca: any) => ca.author_id) || []

      let totalSources = 0
      let mostRecentTimestamp = 0

      for (const authorId of campAuthorIds) {
        const authorData = authorSourcesMap.get(authorId)
        if (authorData) {
          totalSources += authorData.sources.length
          if (authorData.mostRecent) {
            const timestamp = authorData.mostRecent.getTime()
            if (timestamp > mostRecentTimestamp) {
              mostRecentTimestamp = timestamp
            }
          }
        }
      }

      const hasMostRecent = mostRecentTimestamp > 0
      const daysSinceUpdate = hasMostRecent
        ? Math.floor((now.getTime() - mostRecentTimestamp) / (1000 * 60 * 60 * 24))
        : null

      return {
        id: camp.id,
        name: camp.label,
        domain: DOMAIN_MAP[camp.domain_id] || 'Unknown',
        authorCount: campAuthorIds.length,
        sourceCount: totalSources,
        mostRecentDate: hasMostRecent ? new Date(mostRecentTimestamp).toISOString().split('T')[0] : null,
        daysSinceUpdate
      }
    })
    .sort((a, b) => {
      // Camps without sources first, then by oldest
      if (a.daysSinceUpdate === null && b.daysSinceUpdate === null) {
        return b.authorCount - a.authorCount // More authors = more important to fix
      }
      if (a.daysSinceUpdate === null) return -1
      if (b.daysSinceUpdate === null) return 1
      return b.daysSinceUpdate - a.daysSinceUpdate
    })
    .slice(0, 10)

    // Calculate domain breakdown
    const domainStats = new Map<string, {
      campCount: number
      authorIds: Set<string>
      sourceCount: number
      totalDays: number
      sourcesWithDate: number
    }>()

    // Initialize domains
    Object.values(DOMAIN_MAP).forEach(domain => {
      domainStats.set(domain, {
        campCount: 0,
        authorIds: new Set(),
        sourceCount: 0,
        totalDays: 0,
        sourcesWithDate: 0
      })
    })

    // Aggregate camp data by domain
    camps?.forEach(camp => {
      const domain = DOMAIN_MAP[camp.domain_id] || 'Unknown'
      const stats = domainStats.get(domain) || {
        campCount: 0,
        authorIds: new Set(),
        sourceCount: 0,
        totalDays: 0,
        sourcesWithDate: 0
      }

      stats.campCount++

      camp.camp_authors?.forEach((ca: any) => {
        stats.authorIds.add(ca.author_id)
        const authorData = authorSourcesMap.get(ca.author_id)
        if (authorData) {
          stats.sourceCount += authorData.sources.length
          if (authorData.mostRecent) {
            const days = Math.floor((now.getTime() - authorData.mostRecent.getTime()) / (1000 * 60 * 60 * 24))
            stats.totalDays += days
            stats.sourcesWithDate++
          }
        }
      })

      domainStats.set(domain, stats)
    })

    const domainBreakdown = Array.from(domainStats.entries())
      .map(([domain, stats]) => ({
        domain,
        campCount: stats.campCount,
        authorCount: stats.authorIds.size,
        sourceCount: stats.sourceCount,
        avgDaysSinceUpdate: stats.sourcesWithDate > 0
          ? Math.round(stats.totalDays / stats.sourcesWithDate)
          : null
      }))
      .filter(d => d.campCount > 0)
      .sort((a, b) => (b.avgDaysSinceUpdate || 999) - (a.avgDaysSinceUpdate || 999))

    // Calculate days since newest source - derive dates from timestamps
    const hasOldestDate = oldestTimestamp !== Infinity
    const hasNewestDate = newestTimestamp > 0
    const daysSinceNewest = hasNewestDate
      ? Math.floor((now.getTime() - newestTimestamp) / (1000 * 60 * 60 * 24))
      : null

    const totalSourcesCount = allSources.length + (authors?.reduce((sum, a) => sum + (a.sources?.length || 0), 0) || 0)

    const response = {
      totalAuthors: authors?.length || 0,
      totalCamps: camps?.length || 0,
      totalSources: totalSourcesCount,
      authorsWithSources,
      authorsWithoutSources,
      coverageByAge,
      // Source quality metrics
      sourceQuality: {
        specificDates: sourcesWithSpecificDates,
        yearOnly: sourcesWithYearOnly,
        noDate: coverageByAge.noDate,
        generic: genericSources,
        dateQualityPercent: totalSourcesCount > 0
          ? ((sourcesWithSpecificDates / totalSourcesCount) * 100).toFixed(1) + '%'
          : 'N/A'
      },
      // Source date range - the key transparency metric
      sourceDateRange: {
        oldestDate: hasOldestDate ? new Date(oldestTimestamp).toISOString().split('T')[0] : null,
        newestDate: hasNewestDate ? new Date(newestTimestamp).toISOString().split('T')[0] : null,
        daysSinceNewest,
        sourcesFromTable,
        sourcesFromAuthors,
      },
      stalestCamps: campStaleness,
      stalestAuthors: authorStaleness,
      domainBreakdown
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in canon-health API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch canon health metrics' },
      { status: 500 }
    )
  }
}

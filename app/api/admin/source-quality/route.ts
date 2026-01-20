import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    // Fetch all authors with sources
    const { data: authors, error } = await supabase
      .from('authors')
      .select('id, name, sources')

    if (error) throw error

    let totalSources = 0
    let sourcesWithSpecificDates = 0
    let sourcesWithYearOnly = 0
    let sourcesWithoutDate = 0
    let genericSources = 0

    const authorStats = (authors || []).map(author => {
      const sources = author.sources || []

      let specificDates = 0
      let yearOnly = 0
      let noDate = 0
      let generic = 0

      sources.forEach((source: any) => {
        totalSources++

        // Check date quality
        const pubDate = String(source.published_date || source.date || '')
        if (pubDate) {
          // Check if it's a specific date (YYYY-MM-DD) or just year (YYYY or YYYY-01-01)
          if (pubDate.match(/^\d{4}-01-01$/)) {
            yearOnly++
            sourcesWithYearOnly++
          } else if (pubDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            specificDates++
            sourcesWithSpecificDates++
          } else {
            noDate++
            sourcesWithoutDate++
          }
        } else {
          noDate++
          sourcesWithoutDate++
        }

        // Check for generic sources (no specific content)
        const title = source.title || ''
        const url = source.url || ''
        const isGeneric =
          title.toLowerCase().includes('channel') ||
          title.toLowerCase().includes('homepage') ||
          title.toLowerCase().includes('website') ||
          title.toLowerCase().includes('profile') ||
          url.includes('youtube.com/@') ||
          url.includes('youtube.com/channel/') ||
          url.match(/^https?:\/\/[^\/]+\/?$/)

        if (isGeneric) {
          generic++
          genericSources++
        }
      })

      return {
        id: author.id,
        name: author.name,
        totalSources: sources.length,
        specificDates,
        yearOnly,
        noDate,
        generic,
        dateQuality: sources.length > 0
          ? (specificDates / sources.length * 100).toFixed(0) + '%'
          : 'N/A'
      }
    })

    // Sort by worst date quality
    const authorsNeedingWork = authorStats
      .filter(a => a.totalSources > 0 && a.specificDates < a.totalSources)
      .sort((a, b) => {
        const aSpecific = a.totalSources > 0 ? a.specificDates / a.totalSources : 0
        const bSpecific = b.totalSources > 0 ? b.specificDates / b.totalSources : 0
        return aSpecific - bSpecific
      })
      .slice(0, 20)

    // Authors with generic sources
    const authorsWithGeneric = authorStats
      .filter(a => a.generic > 0)
      .sort((a, b) => b.generic - a.generic)
      .slice(0, 20)

    const response = {
      summary: {
        totalSources,
        specificDates: sourcesWithSpecificDates,
        yearOnly: sourcesWithYearOnly,
        noDate: sourcesWithoutDate,
        generic: genericSources,
        dateQuality: totalSources > 0
          ? ((sourcesWithSpecificDates / totalSources) * 100).toFixed(1) + '%'
          : 'N/A'
      },
      authorsNeedingWork,
      authorsWithGeneric
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in source-quality API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch source quality metrics' },
      { status: 500 }
    )
  }
}

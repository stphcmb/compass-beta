import { supabase } from '@/lib/supabase'
import type { ThoughtLeader, TaxonomyCamp, AuthorCampMapping } from '@/lib/database-types'

/**
 * Fetch all thought leaders (authors)
 */
export async function getThoughtLeaders(): Promise<ThoughtLeader[]> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching thought leaders:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getThoughtLeaders:', error)
    return []
  }
}

/**
 * Fetch a single thought leader by ID
 */
export async function getThoughtLeaderById(id: string): Promise<ThoughtLeader | null> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching thought leader:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getThoughtLeaderById:', error)
    return null
  }
}

/**
 * Fetch all taxonomy camps
 */
export async function getTaxonomyCamps(): Promise<TaxonomyCamp[]> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('camps')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching taxonomy camps:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getTaxonomyCamps:', error)
    return []
  }
}

/**
 * Fetch camps with their associated authors
 */
export async function getCampsWithAuthors(query?: string, domain?: string) {
  if (!supabase) {
    console.warn('Supabase not configured')
    return []
  }

  try {
    console.log('🔍 getCampsWithAuthors called with:', { query, domain })

    // Build the query with new structure: camps → dimensions → domains
    let campsQuery = supabase
      .from('camps')
      .select(`
        *,
        dimensions (
          name,
          domains (
            name
          )
        ),
        camp_authors (
          author_id,
          relevance,
          authors (
            id,
            name,
            affiliation,
            position_summary,
            credibility_tier,
            author_type
          )
        )
      `)

    const { data, error } = await campsQuery

    if (error) {
      console.error('Error fetching camps with authors:', error)
      return []
    }

    console.log('  Fetched camps from DB:', data?.length || 0)

    // Transform the data to match expected format
    let camps = (data || []).map((camp: any) => ({
      id: camp.id,
      name: camp.name,
      positionSummary: camp.description,
      domain: camp.dimensions?.domains?.name || 'Unknown',
      dimension: camp.dimensions?.name, // Add dimension info
      authorCount: camp.camp_authors?.length || 0,
      authors: camp.camp_authors?.map((mapping: any) => ({
        id: mapping.authors?.id,
        name: mapping.authors?.name,
        affiliation: mapping.authors?.affiliation,
        positionSummary: mapping.authors?.position_summary,
        credibilityTier: mapping.authors?.credibility_tier,
        authorType: mapping.authors?.author_type,
        relevance: mapping.relevance
      })) || []
    }))

    // Add domain filter if provided
    if (domain) {
      console.log('  Filtering by domain:', domain)
      camps = camps.filter((camp: any) => camp.domain === domain)
    }

    // Apply query filter if provided
    if (query && query.trim()) {
      const queryLower = query.toLowerCase().trim()
      console.log('  Applying query filter:', queryLower)

      // Split query into individual words for better matching
      const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2) // Filter out words < 3 chars

      camps = camps.filter((camp: any) => {
        const campText = `${camp.name} ${camp.positionSummary}`.toLowerCase()

        // Check if camp text contains any of the query words
        const campMatches = queryWords.some(word => campText.includes(word))

        // Check if any author matches
        const authorMatches = camp.authors.some((author: any) => {
          const authorText = `${author.name || ''} ${author.affiliation || ''} ${author.positionSummary || ''}`.toLowerCase()
          return queryWords.some(word => authorText.includes(word))
        })

        return campMatches || authorMatches
      })

      console.log('  Camps after filtering:', camps.length)
    }

    console.log('✅ Returning camps:', camps.length)
    return camps
  } catch (error) {
    console.error('Error in getCampsWithAuthors:', error)
    return []
  }
}

/**
 * Fetch authors for a specific camp
 */
export async function getAuthorsByCamp(campId: string): Promise<ThoughtLeader[]> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('camp_authors')
      .select(`
        authors (
          id,
          name,
          affiliation,
          position_summary,
          credibility_tier,
          author_type
        )
      `)
      .eq('camp_id', campId)

    if (error) {
      console.error('Error fetching authors by camp:', error)
      return []
    }

    return data?.map((item: any) => item.authors).filter(Boolean) || []
  } catch (error) {
    console.error('Error in getAuthorsByCamp:', error)
    return []
  }
}

/**
 * Search thought leaders by query
 */
export async function searchThoughtLeaders(query: string): Promise<ThoughtLeader[]> {
  if (!supabase || !query) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .or(`name.ilike.%${query}%,position_summary.ilike.%${query}%,affiliation.ilike.%${query}%`)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error searching thought leaders:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in searchThoughtLeaders:', error)
    return []
  }
}

/**
 * Get camps by domain
 */
export async function getCampsByDomain(domain: string): Promise<TaxonomyCamp[]> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('camps')
      .select(`
        *,
        dimensions (
          name,
          domains!inner (
            name
          )
        )
      `)

    if (error) {
      console.error('Error fetching camps by domain:', error)
      return []
    }

    // Filter by domain name
    const filtered = data?.filter((camp: any) =>
      camp.dimensions?.domains?.name === domain
    ) || []

    return filtered
  } catch (error) {
    console.error('Error in getCampsByDomain:', error)
    return []
  }
}

/**
 * Get all unique domains
 */
export async function getDomains(): Promise<string[]> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('domains')
      .select('name')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching domains:', error)
      return []
    }

    return data?.map((d: any) => d.name) || []
  } catch (error) {
    console.error('Error in getDomains:', error)
    return []
  }
}

/**
 * Get domain statistics
 */
export async function getDomainStats(): Promise<Record<string, { campsCount: number; authorsCount: number }>> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return {}
  }

  try {
    const { data, error } = await supabase
      .from('camps')
      .select(`
        *,
        dimensions (
          domains (
            name
          )
        ),
        camp_authors (count)
      `)

    if (error) {
      console.error('Error fetching domain stats:', error)
      return {}
    }

    const stats: Record<string, { campsCount: number; authorsCount: number }> = {}

    data?.forEach((camp: any) => {
      const domain = camp.dimensions?.domains?.name
      if (!domain) return

      if (!stats[domain]) {
        stats[domain] = { campsCount: 0, authorsCount: 0 }
      }

      stats[domain].campsCount++
      stats[domain].authorsCount += camp.camp_authors?.[0]?.count || 0
    })

    return stats
  } catch (error) {
    console.error('Error in getDomainStats:', error)
    return {}
  }
}

/**
 * Get positioning metrics for a query/domain
 */
export async function getPositioningMetrics(query?: string, domain?: string) {
  if (!supabase) {
    console.warn('Supabase not configured')
    return {
      stronglyAligned: 0,
      partiallyAligned: 0,
      challenging: 0,
      emerging: 0,
      totalCamps: 0,
      totalAuthors: 0
    }
  }

  try {
    const camps = await getCampsWithAuthors(query, domain)

    const metrics = {
      stronglyAligned: 0,
      partiallyAligned: 0,
      challenging: 0,
      emerging: 0,
      totalCamps: camps.length,
      totalAuthors: 0
    }

    // Count authors and their relevance relationships
    const authorIds = new Set()

    camps.forEach((camp: any) => {
      camp.authors?.forEach((author: any) => {
        // Count unique authors
        if (author.id) {
          authorIds.add(author.id)
        }

        // Categorize by relevance
        const relevanceLower = (author.relevance || '').toLowerCase()

        if (relevanceLower.includes('strong')) {
          metrics.stronglyAligned++
        } else if (relevanceLower.includes('partial')) {
          metrics.partiallyAligned++
        } else if (relevanceLower.includes('challenge')) {
          metrics.challenging++
        } else if (relevanceLower.includes('emerging')) {
          metrics.emerging++
        }
      })
    })

    metrics.totalAuthors = authorIds.size

    return metrics
  } catch (error) {
    console.error('Error in getPositioningMetrics:', error)
    return {
      stronglyAligned: 0,
      partiallyAligned: 0,
      challenging: 0,
      emerging: 0,
      totalCamps: 0,
      totalAuthors: 0
    }
  }
}

/**
 * Analyze white space opportunities
 */
export async function getWhiteSpaceOpportunities(query?: string, domain?: string): Promise<string[]> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return []
  }

  try {
    const camps = await getCampsWithAuthors(query, domain)
    const opportunities: string[] = []

    // Analyze camp distribution
    const domains = new Set(camps.map((c: any) => c.domain).filter(Boolean))
    if (domains.size < 3) {
      opportunities.push(`Limited domain coverage - only ${domains.size} domain(s) represented`)
    }

    // Check for small camps (potential emerging views)
    const smallCamps = camps.filter((c: any) => c.authorCount < 3)
    if (smallCamps.length > 0) {
      opportunities.push(`${smallCamps.length} emerging camp(s) with few voices - opportunity for new perspectives`)
    }

    // Check for dominant camps
    const largeCamps = camps.filter((c: any) => c.authorCount > 10)
    if (largeCamps.length > 0) {
      opportunities.push(`${largeCamps.length} dominant camp(s) - consider alternative viewpoints`)
    }

    return opportunities
  } catch (error) {
    console.error('Error in getWhiteSpaceOpportunities:', error)
    return []
  }
}

// Helper function to determine relevance color
function getRelevanceColor(relevance?: string): string {
  if (!relevance) return 'gray'

  const relevanceLower = relevance.toLowerCase()
  if (relevanceLower.includes('strong') || relevanceLower.includes('alignment')) return 'green'
  if (relevanceLower.includes('challenge') || relevanceLower.includes('opposite')) return 'red'
  if (relevanceLower.includes('emerging') || relevanceLower.includes('new')) return 'purple'
  if (relevanceLower.includes('moderate') || relevanceLower.includes('partial')) return 'yellow'

  return 'gray'
}

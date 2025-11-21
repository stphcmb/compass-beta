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

// Map domain_id to domain name
const DOMAIN_MAP: Record<number, string> = {
  1: 'Technology',
  2: 'Society',
  3: 'Business',
  4: 'Policy & Regulation',
  5: 'Workers'
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

    // Query camps with camp_authors and authors (using domain_id directly)
    const { data, error } = await supabase
      .from('camps')
      .select(`
        *,
        camp_authors (
          author_id,
          relevance,
          authors (
            id,
            name,
            header_affiliation,
            primary_affiliation,
            credibility_tier,
            author_type,
            notes,
            sources
          )
        )
      `)

    if (error) {
      console.error('Error fetching camps with authors:', error)
      return []
    }

    console.log('  Fetched camps from DB:', data?.length || 0)

    // Transform the data to match expected format
    let camps = (data || []).map((camp: any) => ({
      id: camp.id,
      name: camp.label || camp.name,
      positionSummary: camp.description,
      domain: DOMAIN_MAP[camp.domain_id] || 'Unknown',
      code: camp.code,
      authorCount: camp.camp_authors?.length || 0,
      authors: camp.camp_authors?.map((mapping: any) => ({
        id: mapping.authors?.id,
        name: mapping.authors?.name,
        affiliation: mapping.authors?.header_affiliation || mapping.authors?.primary_affiliation,
        positionSummary: mapping.authors?.notes,
        credibilityTier: mapping.authors?.credibility_tier,
        authorType: mapping.authors?.author_type,
        relevance: mapping.relevance,
        sources: mapping.authors?.sources || []
      })).filter((a: any) => a.id) || []
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

      // Semantic query expansion - map common phrases to relevant keywords
      const expandedTerms = expandQuerySemantics(queryLower)
      console.log('  Expanded terms:', expandedTerms)

      // Split query into individual words and add expanded terms
      const queryWords = [
        ...queryLower.split(/\s+/).filter(word => word.length > 2),
        ...expandedTerms
      ]

      camps = camps.filter((camp: any) => {
        const campText = `${camp.name} ${camp.positionSummary} ${camp.code || ''}`.toLowerCase()

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
    // Find domain_id from domain name
    const domainId = Object.entries(DOMAIN_MAP).find(([_, name]) => name === domain)?.[0]

    if (!domainId) {
      console.warn('Unknown domain:', domain)
      return []
    }

    const { data, error } = await supabase
      .from('camps')
      .select('*')
      .eq('domain_id', parseInt(domainId))

    if (error) {
      console.error('Error fetching camps by domain:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getCampsByDomain:', error)
    return []
  }
}

/**
 * Get all unique domains
 */
export async function getDomains(): Promise<string[]> {
  // Return domains from the static map (ordered by domain_id)
  return Object.values(DOMAIN_MAP)
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
        camp_authors (count)
      `)

    if (error) {
      console.error('Error fetching domain stats:', error)
      return {}
    }

    const stats: Record<string, { campsCount: number; authorsCount: number }> = {}

    data?.forEach((camp: any) => {
      const domain = DOMAIN_MAP[camp.domain_id]
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

/**
 * Semantic query expansion - maps common phrases/concepts to relevant keywords
 * This helps users find results even when their query doesn't exactly match camp names
 */
function expandQuerySemantics(query: string): string[] {
  const expansions: string[] = []
  const q = query.toLowerCase()

  // AI skepticism / criticism patterns
  if (q.includes('bubble') || q.includes('hype') || q.includes('overhyped') || q.includes('overrated')) {
    expansions.push('realist', 'skeptic', 'grounding', 'limitation', 'critical')
  }

  // AI optimism patterns
  if (q.includes('optimis') || q.includes('bull') || q.includes('promising') || q.includes('potential')) {
    expansions.push('utopian', 'maximalist', 'scaling', 'optimist', 'progress')
  }

  // Safety and risk patterns
  if (q.includes('danger') || q.includes('risk') || q.includes('threat') || q.includes('doom') || q.includes('existential')) {
    expansions.push('safety', 'risk', 'ethical', 'steward', 'alignment', 'regulation')
  }

  // Scaling debate
  if (q.includes('scale') || q.includes('bigger') || q.includes('larger') || q.includes('more data') || q.includes('more compute')) {
    expansions.push('scaling', 'maximalist', 'grounding', 'realist')
  }

  // Jobs and work
  if (q.includes('job') || q.includes('work') || q.includes('employ') || q.includes('replace') || q.includes('automat')) {
    expansions.push('displacement', 'collaboration', 'worker', 'human')
  }

  // Regulation patterns
  if (q.includes('regulat') || q.includes('govern') || q.includes('law') || q.includes('policy') || q.includes('control')) {
    expansions.push('regulation', 'governance', 'interventionist', 'adaptive', 'innovation')
  }

  // Open source patterns
  if (q.includes('open') || q.includes('democratiz') || q.includes('access')) {
    expansions.push('open', 'builder', 'hugging')
  }

  // Enterprise/business patterns
  if (q.includes('enterprise') || q.includes('business') || q.includes('company') || q.includes('adopt')) {
    expansions.push('adoption', 'evolution', 'business', 'builder', 'tech')
  }

  // Ethics patterns
  if (q.includes('ethic') || q.includes('bias') || q.includes('fair') || q.includes('discriminat')) {
    expansions.push('ethical', 'steward', 'justice', 'fairness')
  }

  // AGI patterns
  if (q.includes('agi') || q.includes('general intelligence') || q.includes('superintelligen')) {
    expansions.push('scaling', 'maximalist', 'safety', 'alignment')
  }

  return expansions
}

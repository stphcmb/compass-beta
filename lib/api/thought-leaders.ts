import { supabase } from '@/lib/supabase'
import type { ThoughtLeader, TaxonomyCamp, AuthorCampMapping } from '@/lib/database-types'
import { expandQuery, extractSearchTerms } from '@/lib/search-expansion'

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

// Map domain_id to display names (updated to V2 naming)
const DOMAIN_MAP: Record<number, string> = {
  1: 'AI Technical Capabilities',
  2: 'AI & Society',
  3: 'Enterprise AI Adoption',
  4: 'AI Governance & Oversight',
  5: 'Future of Work'
}

/**
 * Fetch camps with their associated authors
 * Returns both camps and expanded queries (if query expansion was used)
 */
export async function getCampsWithAuthors(query?: string, domain?: string): Promise<{ camps: any[], expandedQueries: any[] | null }> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return { camps: [], expandedQueries: null }
  }

  try {
    console.log('🔍 getCampsWithAuthors called with:', { query, domain })

    // Query camps with camp_authors and authors
    const { data, error } = await supabase
      .from('camps')
      .select(`
        *,
        camp_authors (
          author_id,
          relevance,
          key_quote,
          quote_source_url,
          why_it_matters,
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
      console.error('Error fetching camp_authors:', error)
      return { camps: [], expandedQueries: null }
    }

    console.log('  Fetched camps from DB:', data?.length || 0)

    // Transform the data to match expected format
    let camps = (data || []).map((camp: any) => ({
      id: camp.id,
      name: camp.label,
      positionSummary: camp.description,
      domain: DOMAIN_MAP[camp.domain_id] || 'Unknown',
      code: camp.code,
      authorCount: camp.camp_authors?.length || 0,
      authors: camp.camp_authors?.map((mapping: any) => ({
        id: mapping.authors?.id,
        name: mapping.authors?.name,
        affiliation: mapping.authors?.header_affiliation || mapping.authors?.primary_affiliation,
        positionSummary: mapping.why_it_matters || mapping.authors?.notes,
        credibilityTier: mapping.authors?.credibility_tier,
        authorType: mapping.authors?.author_type,
        relevance: mapping.relevance,
        sources: mapping.authors?.sources || [],
        key_quote: mapping.key_quote,
        quote_source_url: mapping.quote_source_url
      })).filter((a: any) => a.id) || []
    }))

    // Add domain filter if provided
    if (domain) {
      console.log('  Filtering by domain:', domain)
      camps = camps.filter((camp: any) => camp.domain === domain)
    }

    // Apply query filter if provided
    let expandedQueriesResult: any[] | null = null
    if (query && query.trim()) {
      const queryLower = query.toLowerCase().trim()
      console.log('  Applying query filter:', queryLower)

      let queryWords: string[] = []
      let queryPhrases: string[] = []

      // Try n8n query expansion first
      const expandedQueries = await expandQuery(queryLower)

      // Store for return value
      if (expandedQueries && expandedQueries.length > 0) {
        expandedQueriesResult = expandedQueries
      }

      if (expandedQueries && expandedQueries.length > 0) {
        // Use n8n expanded queries
        console.log('  Using n8n expanded queries:', expandedQueries.map(eq => eq.query))
        const n8nTerms = extractSearchTerms(expandedQueries)
        queryWords = n8nTerms

        // Add the original query terms as well
        queryWords.push(...queryLower.split(/\s+/).filter(word => word.length > 2))

        // Extract phrases from expanded queries
        expandedQueries.forEach(eq => {
          const phrases = extractPhrases(eq.query.toLowerCase())
          queryPhrases.push(...phrases)
        })

        // Also include original query phrases
        queryPhrases.push(...extractPhrases(queryLower))

      } else {
        // Fallback to local semantic expansion
        console.log('  Falling back to local query expansion')
        const expandedTerms = expandQuerySemantics(queryLower)
        console.log('  Expanded terms:', expandedTerms)

        // Create expanded queries for UI display (semantic fallback)
        if (expandedTerms.length > 0) {
          expandedQueriesResult = expandedTerms.map((term, idx) => ({
            query: term,
            role: 'context' as const,
            priority: 10 - idx
          }))
        }

        // Split query into individual words and add expanded terms
        queryWords = [
          ...queryLower.split(/\s+/).filter(word => word.length > 2),
          ...expandedTerms
        ]

        // Also check for multi-word phrases (for queries like "AI is a bubble")
        queryPhrases = extractPhrases(queryLower)
      }

      console.log('  Query words:', queryWords.slice(0, 10), queryWords.length > 10 ? `... (${queryWords.length} total)` : '')
      console.log('  Query phrases:', queryPhrases.slice(0, 5), queryPhrases.length > 5 ? `... (${queryPhrases.length} total)` : '')

      camps = camps.filter((camp: any) => {
        const campText = `${camp.name} ${camp.positionSummary} ${camp.code || ''}`.toLowerCase()

        // Check if camp text contains any of the query words or phrases
        const campMatches = queryWords.some(word => campText.includes(word)) ||
          queryPhrases.some(phrase => campText.includes(phrase))

        // Check if any author matches (including sources and notes)
        const authorMatches = camp.authors.some((author: any) => {
          // Build searchable text from author data including sources
          let authorText = `${author.name || ''} ${author.affiliation || ''} ${author.positionSummary || ''}`.toLowerCase()

          // Add source titles to searchable text
          if (author.sources && Array.isArray(author.sources)) {
            const sourceTitles = author.sources.map((s: any) => s.title || '').join(' ')
            authorText += ' ' + sourceTitles.toLowerCase()
          }

          // Check for word matches or phrase matches
          return queryWords.some(word => authorText.includes(word)) ||
            queryPhrases.some(phrase => authorText.includes(phrase))
        })

        return campMatches || authorMatches
      })

      console.log('  Camps after filtering:', camps.length)
    }

    console.log('✅ Returning camps:', camps.length)
    return { camps, expandedQueries: expandedQueriesResult }
  } catch (error) {
    console.error('Error in getCampsWithAuthors:', error)
    return { camps: [], expandedQueries: null }
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
    // Find domain_id from display name
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
 * Get all camps for all domains (for showing complete slider even with empty camps)
 */
export async function getAllCampsByDomain(): Promise<Record<string, any[]>> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return {}
  }

  try {
    const { data, error } = await supabase
      .from('camps')
      .select('*')
      .order('domain_id', { ascending: true })

    if (error) {
      console.error('Error fetching all camps:', error)
      return {}
    }

    // Group camps by domain
    const campsByDomain: Record<string, any[]> = {}

    data?.forEach((camp: any) => {
      const domain = DOMAIN_MAP[camp.domain_id]
      if (domain) {
        if (!campsByDomain[domain]) {
          campsByDomain[domain] = []
        }
        campsByDomain[domain].push({
          id: camp.id,
          name: camp.label,
          positionSummary: camp.description,
          domain,
          code: camp.code,
          authorCount: 0, // Will be filled by getCampsWithAuthors
          authors: []
        })
      }
    })

    return campsByDomain
  } catch (error) {
    console.error('Error in getAllCampsByDomain:', error)
    return {}
  }
}

/**
 * Get all unique domains
 */
export async function getDomains(): Promise<string[]> {
  // Return display domain names
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
      totalAuthors: 0,
      domains: []
    }
  }

  try {
    const result = await getCampsWithAuthors(query, domain)
    const camps = result.camps

    // Get unique domains
    const uniqueDomains = Array.from(new Set(camps.map((c: any) => c.domain).filter(Boolean)))

    // Track unique authors per positioning category
    const authorSets = {
      stronglyAligned: new Set<number>(),
      partiallyAligned: new Set<number>(),
      challenging: new Set<number>(),
      emerging: new Set<number>()
    }
    const allAuthorIds = new Set<number>()

    camps.forEach((camp: any) => {
      camp.authors?.forEach((author: any) => {
        // Count unique authors overall
        if (author.id) {
          allAuthorIds.add(author.id)
        }

        // Categorize by relevance - track unique authors per category
        const relevanceLower = (author.relevance || '').toLowerCase()

        if (relevanceLower.includes('strong')) {
          authorSets.stronglyAligned.add(author.id)
        } else if (relevanceLower.includes('partial')) {
          authorSets.partiallyAligned.add(author.id)
        } else if (relevanceLower.includes('challenge')) {
          authorSets.challenging.add(author.id)
        } else if (relevanceLower.includes('emerging')) {
          authorSets.emerging.add(author.id)
        }
      })
    })

    const metrics = {
      stronglyAligned: authorSets.stronglyAligned.size,
      partiallyAligned: authorSets.partiallyAligned.size,
      challenging: authorSets.challenging.size,
      emerging: authorSets.emerging.size,
      totalCamps: camps.length,
      totalAuthors: allAuthorIds.size,
      domains: uniqueDomains
    }

    return metrics
  } catch (error) {
    console.error('Error in getPositioningMetrics:', error)
    return {
      stronglyAligned: 0,
      partiallyAligned: 0,
      challenging: 0,
      emerging: 0,
      totalCamps: 0,
      totalAuthors: 0,
      domains: []
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
    const result = await getCampsWithAuthors(query, domain)
    const camps = result.camps
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
    expansions.push('realist', 'skeptic', 'grounding', 'limitation', 'critical', 'bubble')
  }
  if (q.includes('not a bubble') || q.includes('not hype')) {
    expansions.push('maximalist', 'optimist', 'progress', 'potential')
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

/**
 * Extract meaningful phrases from a query for phrase matching
 * This helps match multi-word queries like "AI is a bubble" or "AI will replace workers"
 */
function extractPhrases(query: string): string[] {
  const phrases: string[] = []

  // Return the full query as a phrase if it's longer than 3 words
  const words = query.trim().split(/\s+/)
  if (words.length >= 3) {
    phrases.push(query)
  }

  // Extract common meaningful phrases (3-6 words)
  for (let i = 0; i < words.length - 2; i++) {
    const phrase3 = words.slice(i, i + 3).join(' ')
    const phrase4 = words.slice(i, i + 4).join(' ')
    const phrase5 = words.slice(i, i + 5).join(' ')

    if (phrase3.length > 8) phrases.push(phrase3)
    if (i < words.length - 3 && phrase4.length > 10) phrases.push(phrase4)
    if (i < words.length - 4 && phrase5.length > 12) phrases.push(phrase5)
  }

  return phrases
}

import { supabase } from '@/lib/supabase'
import type { ThoughtLeader, TaxonomyCamp, AuthorCampMapping } from '@/lib/database-types'
import { expandSearchTermsWithQueries, extractPhrases } from '@/lib/search-expansion'
import {
  detectQueryIntent,
  calculateCampRelevance,
  filterByQuality,
  QUALITY_THRESHOLDS
} from '@/lib/search/editorial-system'
import {
  getOpposingPerspectives,
  getAlliedPerspectives
} from '@/lib/constants/perspective-relationships'

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
 * Fetch comprehensive author details including camps, quotes, and sources
 */
export async function getAuthorWithDetails(id: string): Promise<any | null> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return null
  }

  try {
    // Fetch author basic data
    const { data: author, error: authorError } = await supabase
      .from('authors')
      .select('*')
      .eq('id', id)
      .single()

    if (authorError || !author) {
      console.error('Error fetching author:', authorError)
      return null
    }

    // Fetch camps this author belongs to with their quotes
    const { data: campMappings, error: campsError } = await supabase
      .from('camp_authors')
      .select(`
        relevance,
        key_quote,
        quote_source_url,
        why_it_matters,
        citation_status,
        citation_last_checked,
        camps (
          id,
          label,
          description,
          domain_id
        )
      `)
      .eq('author_id', id)

    if (campsError) {
      console.error('Error fetching author camps:', campsError)
    }

    // Format camps with quotes
    const camps = (campMappings || []).map((mapping: any) => ({
      id: mapping.camps?.id,
      name: mapping.camps?.label,
      description: mapping.camps?.description,
      domain: DOMAIN_MAP[mapping.camps?.domain_id] || 'Unknown',
      relevance: mapping.relevance,
      quote: mapping.key_quote,
      quoteSourceUrl: mapping.quote_source_url,
      whyItMatters: mapping.why_it_matters,
      citationStatus: mapping.citation_status,
      citationLastChecked: mapping.citation_last_checked,
    })).filter((c: any) => c.id)

    return {
      ...author,
      camps,
    }
  } catch (error) {
    console.error('Error in getAuthorWithDetails:', error)
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
 * Calculate relevancy score for an author based on search query
 * Returns both score and match type information
 */
function calculateAuthorRelevancy(author: any, query: string, queryTerms: string[]): { score: number, matchType: 'exact' | 'expanded' | 'credibility', matchedTerms: string[] } {
  const searchableText = [
    author.name || '',
    author.affiliation || '',
    author.positionSummary || '',
    author.key_quote || ''
  ].join(' ').toLowerCase()

  if (!query || queryTerms.length === 0) {
    // No query - use credibility tier (lower tier = higher score)
    const tierMap: Record<string, number> = {
      'Pioneer': 1,
      'Established': 2,
      'Emerging': 3,
      'Critic': 4
    }
    const tier = tierMap[author.credibilityTier] || 5
    return {
      score: 100 - tier * 10,
      matchType: 'credibility',
      matchedTerms: []
    }
  }

  let score = 0
  const matchedTerms: string[] = []

  // Check for exact phrase match first
  if (searchableText.includes(query.toLowerCase())) {
    score += 30
    matchedTerms.push(query)
  }

  // Extract original query terms (not expanded)
  const originalTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2)
  const originalMatches = originalTerms.filter(term =>
    searchableText.includes(term.toLowerCase())
  )

  // Check for query term matches
  queryTerms.forEach(term => {
    if (searchableText.includes(term.toLowerCase())) {
      score += 20
      if (!matchedTerms.includes(term)) {
        matchedTerms.push(term)
      }
    }
  })

  // Credibility tier bonus (tier 1 = +15, tier 2 = +10, tier 3 = +5)
  const tierMap: Record<string, number> = {
    'Pioneer': 1,
    'Established': 2,
    'Emerging': 3,
    'Critic': 4
  }
  const tier = tierMap[author.credibilityTier] || 5
  score += Math.max(0, (6 - tier) * 5)

  // Determine match type based on what matched
  let matchType: 'exact' | 'expanded' | 'credibility'
  if (originalMatches.length > 0 || searchableText.includes(query.toLowerCase())) {
    matchType = 'exact'
  } else if (matchedTerms.length > 0) {
    matchType = 'expanded'
  } else {
    matchType = 'credibility'
  }

  return { score, matchType, matchedTerms }
}

/**
 * Enrich camps with cross-perspective author data
 * For each camp, adds:
 * - challengingAuthors: Top 3 authors from opposing perspectives (ranked by query relevancy)
 * - supportingAuthors: Top 3 authors from allied perspectives (ranked by query relevancy)
 */
function enrichWithCrossPerspectiveAuthors(camps: any[], query?: string, queryTerms: string[] = []): any[] {
  // Build a map of perspective name -> camp data (including authors)
  const campsByName: Record<string, any> = {}
  camps.forEach(camp => {
    campsByName[camp.name] = camp
  })

  return camps.map(camp => {
    // Get opposing perspectives
    const opposingNames = getOpposingPerspectives(camp.name)
    const challengingAuthors: any[] = []

    opposingNames.forEach(opposingName => {
      const opposingCamp = campsByName[opposingName]
      if (opposingCamp?.authors) {
        // Get authors from opposing perspective with relevancy scores
        const authorsWithScores = opposingCamp.authors.map((author: any) => {
          const relevancy = calculateAuthorRelevancy(author, query || '', queryTerms)
          return {
            ...author,
            _relevancyScore: relevancy.score,
            _matchType: relevancy.matchType,
            perspective: opposingName
          }
        })

        challengingAuthors.push(...authorsWithScores)
      }
    })

    // Sort by relevancy and take top 3
    const topChallengers = challengingAuthors
      .sort((a, b) => b._relevancyScore - a._relevancyScore)
      .slice(0, 3)
      .map(({ id, name, perspective }) => ({ id, name, perspective }))

    // Get allied perspectives for supporting authors
    const alliedNames = getAlliedPerspectives(camp.name)
    const supportingAuthors: any[] = []

    alliedNames.forEach(alliedName => {
      const alliedCamp = campsByName[alliedName]
      if (alliedCamp?.authors) {
        // Get authors from allied perspective with relevancy scores
        const authorsWithScores = alliedCamp.authors.map((author: any) => {
          const relevancy = calculateAuthorRelevancy(author, query || '', queryTerms)
          return {
            ...author,
            _relevancyScore: relevancy.score,
            _matchType: relevancy.matchType,
            perspective: alliedName
          }
        })

        supportingAuthors.push(...authorsWithScores)
      }
    })

    // Sort by relevancy and take top 3
    const topSupporters = supportingAuthors
      .sort((a, b) => b._relevancyScore - a._relevancyScore)
      .slice(0, 3)
      .map(({ id, name, perspective }) => ({ id, name, perspective }))

    return {
      ...camp,
      challengingAuthors: topChallengers,
      supportingAuthors: topSupporters
    }
  })
}

/**
 * Fetch camps with their associated authors
 * Returns camps, expanded queries, and expansion metadata
 */
export async function getCampsWithAuthors(query?: string, domain?: string): Promise<{
  camps: any[]
  expandedQueries: any[] | null
  expansionMeta?: { method: 'ai' | 'local' | 'none', description: string }
}> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return { camps: [], expandedQueries: null }
  }

  try {
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
      camps = camps.filter((camp: any) => camp.domain === domain)
    }

    // Apply query filter if provided
    let expandedQueriesResult: any[] | null = null
    let expansionMetaResult: { method: 'ai' | 'local' | 'none', description: string } | undefined = undefined
    if (query && query.trim()) {
      const queryLower = query.toLowerCase().trim()

      // Detect query intent using editorial system
      const intent = detectQueryIntent(queryLower)

      // Use shared expansion logic (n8n + semantic fallback)
      const { terms: queryWords, expandedQueries, expansionMeta } = await expandSearchTermsWithQueries(queryLower)
      expandedQueriesResult = expandedQueries
      expansionMetaResult = expansionMeta

      // Score all camps using editorial system
      const scoredCamps = camps.map(camp => {
        const relevance = calculateCampRelevance(camp, queryLower, queryWords, intent)
        return {
          camp,
          relevance
        }
      })

      // Filter by quality threshold (only high-relevance camps)
      const filteredScored = scoredCamps
        .filter(item => item.relevance.score >= QUALITY_THRESHOLDS.HIGH_RELEVANCE)
        .sort((a, b) => b.relevance.score - a.relevance.score)

      // Store relevance scores in camps for later use
      camps = filteredScored.map(item => ({
        ...item.camp,
        _relevanceScore: item.relevance.score,
        _stance: item.relevance.stance,
        _matchReasons: item.relevance.matchReasons
      }))
    }

    // Enrich camps with cross-perspective author data (pass query for relevancy ranking)
    const queryTerms = query ? query.toLowerCase().split(/\s+/).filter(t => t.length > 2) : []
    const enrichedCamps = enrichWithCrossPerspectiveAuthors(camps, query, queryTerms)

    // Filter and rank authors within each camp by relevance to query
    const MAX_AUTHORS_PER_CAMP = 8
    const campsWithFilteredAuthors = enrichedCamps.map(camp => {
      if (!query || !camp.authors || camp.authors.length === 0) {
        return camp
      }

      // Calculate relevance score for each author
      const authorsWithScores = camp.authors.map((author: any) => {
        const relevancy = calculateAuthorRelevancy(author, query, queryTerms)
        return {
          ...author,
          _relevancyScore: relevancy.score,
          _matchType: relevancy.matchType,
          _matchedTerms: relevancy.matchedTerms
        }
      })

      // Sort by relevance (high to low) and take top authors
      // Only include authors with score > 0 OR limit to MAX_AUTHORS_PER_CAMP
      const sortedAuthors = authorsWithScores
        .sort((a: any, b: any) => b._relevancyScore - a._relevancyScore)
        .slice(0, MAX_AUTHORS_PER_CAMP)

      // Filter to only authors with positive relevance or credibility-based ranking
      const filteredAuthors = sortedAuthors.filter((a: any) => a._relevancyScore > 0)

      return {
        ...camp,
        authors: filteredAuthors.length > 0 ? filteredAuthors : sortedAuthors.slice(0, 3), // Always show at least 3
        authorCount: filteredAuthors.length > 0 ? filteredAuthors.length : sortedAuthors.slice(0, 3).length
      }
    })

    return {
      camps: campsWithFilteredAuthors,
      expandedQueries: expandedQueriesResult,
      expansionMeta: expansionMetaResult
    }
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
export async function getPositioningMetrics(query?: string, domain?: string, relevanceFilter?: string | null) {
  if (!supabase) {
    console.warn('Supabase not configured')
    return {
      stronglyAligned: 0,
      partiallyAligned: 0,
      challenging: 0,
      emerging: 0,
      totalCamps: 0,
      totalAuthors: 0,
      domains: [],
      filteredDomains: [],
      topCamps: {
        stronglyAligned: [],
        partiallyAligned: [],
        challenging: [],
        emerging: []
      }
    }
  }

  try {
    const result = await getCampsWithAuthors(query, domain)
    const camps = result.camps

    // Get unique domains (all camps)
    const uniqueDomains = Array.from(new Set(camps.map((c: any) => c.domain).filter(Boolean)))

    // Track unique authors per positioning category
    const authorSets = {
      stronglyAligned: new Set<number>(),
      partiallyAligned: new Set<number>(),
      challenging: new Set<number>(),
      emerging: new Set<number>()
    }
    const allAuthorIds = new Set<number>()

    // Track domains and camps for filtered results
    const filteredDomains = new Set<string>()
    const campsByRelevance: Record<string, any[]> = {
      stronglyAligned: [],
      partiallyAligned: [],
      challenging: [],
      emerging: []
    }

    camps.forEach((camp: any) => {
      // Use semantic stance from editorial system instead of author.relevance
      // _stance indicates how the camp relates to the user's search query
      const stance = camp._stance || 'neutral'

      // Determine which category this camp belongs to based on semantic stance
      let categoryKey: 'stronglyAligned' | 'partiallyAligned' | 'challenging' | 'emerging'

      if (stance === 'supports') {
        categoryKey = 'stronglyAligned'
      } else if (stance === 'challenges') {
        categoryKey = 'challenging'
      } else if (stance === 'neutral') {
        // Neutral camps represent emerging or alternative perspectives
        categoryKey = 'emerging'
      } else {
        // Fallback for camps without stance info
        categoryKey = 'emerging'
      }

      // Add all authors from this camp to the appropriate category
      camp.authors?.forEach((author: any) => {
        // Count unique authors overall
        if (author.id) {
          allAuthorIds.add(author.id)
        }

        // Add author to the category determined by camp stance
        authorSets[categoryKey].add(author.id)
      })

      // Track this camp in the appropriate category
      campsByRelevance[categoryKey].push(camp)
    })

    // Calculate filtered domains based on relevance filter
    if (relevanceFilter) {
      const filterKey = relevanceFilter === 'strong' ? 'stronglyAligned' :
                       relevanceFilter === 'partial' ? 'partiallyAligned' :
                       relevanceFilter === 'challenges' ? 'challenging' : 'emerging'

      campsByRelevance[filterKey].forEach((camp: any) => {
        if (camp.domain) {
          filteredDomains.add(camp.domain)
        }
      })
    }

    // Get top camps for each category (for summary generation)
    // Use descriptions instead of names for better clarity
    const topCamps = {
      stronglyAligned: campsByRelevance.stronglyAligned.slice(0, 2).map((c: any) => ({
        name: c.name,
        description: c.positionSummary || c.name
      })),
      partiallyAligned: campsByRelevance.partiallyAligned.slice(0, 2).map((c: any) => ({
        name: c.name,
        description: c.positionSummary || c.name
      })),
      challenging: campsByRelevance.challenging.slice(0, 2).map((c: any) => ({
        name: c.name,
        description: c.positionSummary || c.name
      })),
      emerging: campsByRelevance.emerging.slice(0, 2).map((c: any) => ({
        name: c.name,
        description: c.positionSummary || c.name
      }))
    }

    const metrics = {
      stronglyAligned: authorSets.stronglyAligned.size,
      partiallyAligned: authorSets.partiallyAligned.size,
      challenging: authorSets.challenging.size,
      emerging: authorSets.emerging.size,
      totalCamps: camps.length,
      totalAuthors: allAuthorIds.size,
      domains: uniqueDomains,
      filteredDomains: Array.from(filteredDomains),
      topCamps
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
      domains: [],
      filteredDomains: [],
      topCamps: {
        stronglyAligned: [],
        partiallyAligned: [],
        challenging: [],
        emerging: []
      }
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

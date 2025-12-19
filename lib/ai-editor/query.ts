/**
 * Mini Brain Module - Query and Keyword Extraction
 *
 * Handles extracting keywords from user text and querying
 * the database for matching camps and authors.
 */

import { supabase } from '../supabase'
import { ExtractedKeywords, CampWithAuthors } from './types'

/**
 * Extract keywords from text using simple heuristics
 *
 * This is a fast, local extraction method that:
 * - Filters out common stop words
 * - Extracts multi-word phrases
 * - Returns meaningful terms for database search
 *
 * @param text - User's text to analyze
 * @returns Extracted keywords and phrases
 */
export function extractKeywords(text: string): ExtractedKeywords {
  // Common stop words to filter out
  const stopWords = new Set([
    'the',
    'is',
    'at',
    'which',
    'on',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'with',
    'to',
    'for',
    'of',
    'as',
    'by',
    'that',
    'this',
    'it',
    'from',
    'be',
    'are',
    'was',
    'were',
    'been',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'should',
    'could',
    'can',
    'may',
    'might',
  ])

  // Extract single words (3+ characters, not stop words)
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ''))
    .filter((w) => w.length >= 3 && !stopWords.has(w))
    .filter((w, i, arr) => arr.indexOf(w) === i) // unique

  // Extract 2-3 word phrases
  const sentences = text.split(/[.!?]+/)
  const phrases: string[] = []

  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().toLowerCase().split(/\s+/)

    // Extract 2-word phrases
    for (let i = 0; i < sentenceWords.length - 1; i++) {
      const phrase = `${sentenceWords[i]} ${sentenceWords[i + 1]}`
      if (phrase.length >= 8) {
        // Avoid very short phrases
        phrases.push(phrase.replace(/[^a-z0-9\s]/g, '').trim())
      }
    }

    // Extract 3-word phrases
    for (let i = 0; i < sentenceWords.length - 2; i++) {
      const phrase = `${sentenceWords[i]} ${sentenceWords[i + 1]} ${sentenceWords[i + 2]}`
      if (phrase.length >= 12) {
        phrases.push(phrase.replace(/[^a-z0-9\s]/g, '').trim())
      }
    }
  }

  // Remove duplicates and filter out phrases that are just stop words
  const uniquePhrases = Array.from(new Set(phrases)).filter((phrase) => {
    const phraseWords = phrase.split(/\s+/)
    return phraseWords.some((w) => !stopWords.has(w))
  })

  return {
    words,
    phrases: uniquePhrases,
    allTerms: [...words, ...uniquePhrases],
  }
}

/**
 * Query database for camps matching the given keywords
 *
 * Uses hybrid search across:
 * - Camp name, description, position_summary
 * - Author names and affiliations
 * - Prioritizes exact matches and multi-word phrase matches
 *
 * @param keywords - Extracted keywords to search for
 * @param limit - Maximum number of camps to return (default: 20)
 * @returns Array of camps with their authors
 */
export async function queryCampsByKeywords(
  keywords: ExtractedKeywords,
  limit: number = 20
): Promise<CampWithAuthors[]> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized')
  }

  try {
    // For AI Editor, skip external N8N expansion to reduce latency
    // The local keyword extraction is sufficient since Gemini does semantic matching
    // This saves 2-5 seconds of unnecessary API calls
    const searchTerms = [
      ...keywords.phrases.slice(0, 5), // Original phrases (high priority)
      ...keywords.words.slice(0, 15),  // Original words
    ]

    // Remove duplicates
    const uniqueSearchTerms = Array.from(new Set(searchTerms))

    if (uniqueSearchTerms.length === 0) {
      return []
    }

    // Query camps with authors including their quotes
    // We'll search across camp fields and author fields
    const { data: camps, error } = await supabase
      .from('camps')
      .select(
        `
        id,
        label,
        description,
        code,
        domain_id,
        camp_authors (
          relevance,
          key_quote,
          quote_source_url,
          authors (
            id,
            name,
            header_affiliation,
            primary_affiliation,
            notes,
            key_quote,
            quote_source_url
          )
        )
      `
      )
      .limit(100) // Get more than we need for filtering

    if (error) {
      console.error('Error querying camps:', error)
      throw new Error(`Database query failed: ${error.message}`)
    }

    if (!camps || camps.length === 0) {
      return []
    }

    // Domain name mapping (from the existing codebase)
    const domainMap: Record<number, string> = {
      1: 'AI Technical Capabilities',
      2: 'AI & Society',
      3: 'Enterprise AI Adoption',
      4: 'AI Governance & Oversight',
      5: 'Future of Work',
    }

    // Transform and score camps based on keyword matches
    const scoredCamps = camps.map((camp) => {
      let score = 0
      const searchableText = [
        camp.label,
        camp.description,
        camp.code || '',
      ].join(' ').toLowerCase()

      // Score based on phrase matches (higher weight)
      for (const phrase of keywords.phrases) {
        if (searchableText.includes(phrase)) {
          score += 10
        }
      }

      // Score based on word matches
      for (const word of keywords.words) {
        if (searchableText.includes(word)) {
          score += 3
        }
      }

      // Also check author names and affiliations
      // Keep camp_authors data for quote extraction
      const campAuthorsData = Array.isArray(camp.camp_authors)
        ? camp.camp_authors.filter((ca: any) => ca.authors)
        : []
      const authors = campAuthorsData.map((ca: any) => ({
        ...ca.authors,
        // Prefer camp-specific quote, fall back to author-level quote
        key_quote: ca.key_quote || ca.authors.key_quote,
        quote_source_url: ca.quote_source_url || ca.authors.quote_source_url,
      }))

      for (const author of authors) {
        const authorText = [
          author.name,
          author.header_affiliation || author.primary_affiliation || '',
        ].join(' ').toLowerCase()

        // Check against all search terms
        for (const term of uniqueSearchTerms) {
          if (authorText.includes(term)) {
            score += 2
          }
        }
      }

      return {
        camp,
        score,
        authors,
      }
    })

    // Filter to camps with score > 0 and sort by score
    const matchedCamps = scoredCamps
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    // Transform to CampWithAuthors format
    return matchedCamps.map((item) => ({
      id: item.camp.id,
      name: item.camp.label,
      description: item.camp.description,
      position_summary: undefined,
      domain: domainMap[item.camp.domain_id as number] || 'Unknown',
      authors: item.authors.map((author: any) => ({
        id: author.id,
        name: author.name,
        affiliation: author.header_affiliation || author.primary_affiliation || undefined,
        position_summary: author.notes || undefined,
        relevance: undefined,
        key_quote: author.key_quote || undefined,
        quote_source_url: author.quote_source_url || undefined,
      })),
    }))
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to query camps: ${error.message}`)
    }
    throw new Error('Failed to query camps: Unknown error')
  }
}

/**
 * Get specific camps and authors by IDs
 *
 * Used to fetch full details for camps identified by Gemini analysis
 *
 * @param campIds - Array of camp IDs to fetch
 * @returns Array of camps with their authors
 */
export async function getCampsByIds(
  campIds: string[]
): Promise<CampWithAuthors[]> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized')
  }

  if (campIds.length === 0) {
    return []
  }

  try {
    const { data: camps, error } = await supabase
      .from('camps')
      .select(
        `
        id,
        label,
        description,
        code,
        domain_id,
        camp_authors (
          relevance,
          key_quote,
          quote_source_url,
          authors (
            id,
            name,
            header_affiliation,
            primary_affiliation,
            notes,
            key_quote,
            quote_source_url
          )
        )
      `
      )
      .in('id', campIds)

    if (error) {
      throw new Error(`Database query failed: ${error.message}`)
    }

    if (!camps) {
      return []
    }

    const domainMap: Record<number, string> = {
      1: 'AI Technical Capabilities',
      2: 'AI & Society',
      3: 'Enterprise AI Adoption',
      4: 'AI Governance & Oversight',
      5: 'Future of Work',
    }

    return camps.map((camp) => {
      const campAuthorsData = Array.isArray(camp.camp_authors)
        ? camp.camp_authors.filter((ca: any) => ca.authors)
        : []
      const authors = campAuthorsData.map((ca: any) => ({
        ...ca.authors,
        // Prefer camp-specific quote, fall back to author-level quote
        key_quote: ca.key_quote || ca.authors.key_quote,
        quote_source_url: ca.quote_source_url || ca.authors.quote_source_url,
      }))

      return {
        id: camp.id,
        name: camp.label,
        description: camp.description,
        position_summary: undefined,
        domain: domainMap[camp.domain_id as number] || 'Unknown',
        authors: authors.map((author: any) => ({
          id: author.id,
          name: author.name,
          affiliation: author.header_affiliation || author.primary_affiliation || undefined,
          position_summary: author.notes || undefined,
          key_quote: author.key_quote || undefined,
          quote_source_url: author.quote_source_url || undefined,
        })),
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch camps: ${error.message}`)
    }
    throw new Error('Failed to fetch camps: Unknown error')
  }
}

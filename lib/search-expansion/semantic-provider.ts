/**
 * Semantic Query Expansion Provider
 *
 * Local semantic expansion that maps common phrases/concepts to relevant keywords.
 * This is a fallback when n8n expansion is unavailable.
 *
 * Based on the original expandQuerySemantics from lib/api/thought-leaders.ts
 */

/**
 * Semantic query expansion - maps common phrases/concepts to relevant keywords
 * This helps users find results even when their query doesn't exactly match camp names
 *
 * @param query - The search query to expand
 * @returns Array of semantically related terms
 */
export function expandQuerySemantics(query: string): string[] {
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
 *
 * @param query - The search query
 * @returns Array of phrases extracted from the query
 */
export function extractPhrases(query: string): string[] {
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

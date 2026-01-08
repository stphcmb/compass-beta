/**
 * Editorial Search System
 *
 * Provides semantic query understanding and editorial curation of search results.
 * This system DOES NOT use the author-to-camp relevance field - that's only for
 * maintaining author-camp alignment.
 *
 * Instead, this system:
 * 1. Understands user query intent (skeptical vs optimistic, technical vs societal)
 * 2. Scores camps based on relevance to the query
 * 3. Determines semantic stance (supports vs challenges query intent)
 * 4. Filters out low-quality/tangential matches
 */

// ============================================================================
// TYPES
// ============================================================================

export type QueryIntent = {
  sentiment: 'skeptical' | 'optimistic' | 'neutral' | 'questioning'
  topic: 'hype' | 'capabilities' | 'safety' | 'work' | 'adoption' | 'ethics' | 'governance' | 'general'
  focus: 'technical' | 'societal' | 'business' | 'policy' | 'general'
}

export type CampRelevanceScore = {
  campId: string
  campName: string
  score: number
  matchReasons: string[]
  stance: 'supports' | 'challenges' | 'neutral'
}

// ============================================================================
// EDITORIAL MAPPINGS
// ============================================================================

/**
 * Editorial mappings for common query patterns
 * These override automatic scoring for known queries
 */
export const EDITORIAL_QUERY_MAPPINGS: Record<string, {
  intent: QueryIntent
  shouldMatch: string[]  // Camp name patterns that should appear
  shouldNotMatch: string[]  // Camp name patterns to exclude
  stanceMap: {
    supports: string[]  // Camps that support this query's viewpoint
    challenges: string[]  // Camps that challenge this query's viewpoint
  }
}> = {
  // AI Bubble / Hype queries
  'bubble|hype|overhyped|overrated|inflated': {
    intent: {
      sentiment: 'skeptical',
      topic: 'hype',
      focus: 'technical'
    },
    shouldMatch: [
      'skeptic', 'realist', 'grounding', 'limitation', 'critical', 'bubble'
    ],
    shouldNotMatch: [
      'safety', 'democratiz', 'enterprise', 'adoption', 'worker', 'governance'
    ],
    stanceMap: {
      supports: ['skeptic', 'realist', 'grounding', 'limitation', 'critical'],
      challenges: ['maximalist', 'optimist', 'scaling', 'progress', 'potential']
    }
  },

  // Job displacement queries
  'replace.*worker|job.*loss|automat.*job|unemploy|displace': {
    intent: {
      sentiment: 'skeptical',
      topic: 'work',
      focus: 'societal'
    },
    shouldMatch: [
      'worker', 'job', 'displacement', 'labor', 'employment', 'human'
    ],
    shouldNotMatch: [
      'technical', 'capability', 'model', 'training', 'enterprise'
    ],
    stanceMap: {
      supports: ['displacement', 'replacement', 'automation', 'threat'],
      challenges: ['collaboration', 'augment', 'complement', 'human']
    }
  },

  // Scaling laws queries
  'scaling.*law|more.*compute|bigger.*model|parameter': {
    intent: {
      sentiment: 'questioning',
      topic: 'capabilities',
      focus: 'technical'
    },
    shouldMatch: [
      'scaling', 'capability', 'limitation', 'architecture', 'training'
    ],
    shouldNotMatch: [
      'safety', 'ethics', 'worker', 'governance', 'business'
    ],
    stanceMap: {
      supports: ['scaling', 'maximalist', 'progress'],
      challenges: ['limitation', 'grounding', 'paradigm']
    }
  },

  // AI Safety queries
  'safe|risk|danger|threat|alignment|existential': {
    intent: {
      sentiment: 'skeptical',
      topic: 'safety',
      focus: 'technical'
    },
    shouldMatch: [
      'safety', 'risk', 'alignment', 'steward', 'caution', 'responsible'
    ],
    shouldNotMatch: [
      'democratiz', 'open', 'worker', 'job', 'enterprise'
    ],
    stanceMap: {
      supports: ['safety', 'caution', 'steward', 'responsible', 'regulation'],
      challenges: ['progress', 'open', 'accelerate', 'democratiz']
    }
  },

  // Enterprise adoption queries
  'enterprise|business.*adopt|company.*ai|corporate': {
    intent: {
      sentiment: 'neutral',
      topic: 'adoption',
      focus: 'business'
    },
    shouldMatch: [
      'enterprise', 'business', 'adoption', 'strategy', 'implementation'
    ],
    shouldNotMatch: [
      'technical', 'model', 'worker', 'safety', 'existential'
    ],
    stanceMap: {
      supports: ['builder', 'pragmatic', 'evolution'],
      challenges: ['conservative', 'cautious', 'slow']
    }
  },

  // AGI / superintelligence queries
  'agi|artificial general intelligence|superintelligen|sentien': {
    intent: {
      sentiment: 'questioning',
      topic: 'capabilities',
      focus: 'technical'
    },
    shouldMatch: [
      'agi', 'capability', 'limitation', 'scaling', 'intelligence'
    ],
    shouldNotMatch: [
      'worker', 'enterprise', 'business', 'adoption'
    ],
    stanceMap: {
      supports: ['maximalist', 'scaling', 'progress', 'agi'],
      challenges: ['limitation', 'grounding', 'skeptic', 'paradigm']
    }
  },

  // Open source / democratization queries (avoid matching "opens up", "opened", etc.)
  'open\\s+(source|ai|model|weight)|democratiz|\\baccess\\b|transparen': {
    intent: {
      sentiment: 'optimistic',
      topic: 'governance',
      focus: 'policy'
    },
    shouldMatch: [
      'open', 'democratiz', 'access', 'transparent', 'builder'
    ],
    shouldNotMatch: [
      'worker', 'job', 'technical', 'capability'
    ],
    stanceMap: {
      supports: ['open', 'democratiz', 'access', 'builder'],
      challenges: ['safety', 'regulation', 'control', 'cautious']
    }
  },

  // Vibe coding / AI-assisted development queries
  'vibe.*cod|ai.*cod|copilot|cursor|code.*assist|developer.*tool|programming.*ai|replit|codeium': {
    intent: {
      sentiment: 'optimistic',
      topic: 'work',
      focus: 'technical'
    },
    shouldMatch: [
      'collaboration', 'democratiz', 'builder', 'tool', 'developer', 'human', 'augment'
    ],
    shouldNotMatch: [
      'governance', 'regulation', 'policy', 'existential', 'ethics'
    ],
    stanceMap: {
      supports: ['collaboration', 'augment', 'builder', 'democratiz', 'tool'],
      challenges: ['displacement', 'replacement', 'automat', 'threat']
    }
  },

  // Multi-agent / Agentic AI queries
  'agent|agentic|multi-agent|autonomous.*ai|crewai|autogen|langchain|llamaindex|babyagi|rag|orchestrat': {
    intent: {
      sentiment: 'optimistic',
      topic: 'capabilities',
      focus: 'technical'
    },
    shouldMatch: [
      'builder', 'scaling', 'collaboration', 'framework', 'tool', 'democratiz'
    ],
    shouldNotMatch: [
      'regulation', 'governance', 'policy', 'ethics', 'displacement'
    ],
    stanceMap: {
      supports: ['builder', 'scaling', 'progress', 'democratiz'],
      challenges: ['safety', 'cautio', 'regulation', 'limit']
    }
  },

  // AI infrastructure queries
  'infrastructure|gpu|cloud.*ai|deploy|modal|replicate|hugging.*face|together.*ai|serverless': {
    intent: {
      sentiment: 'neutral',
      topic: 'capabilities',
      focus: 'technical'
    },
    shouldMatch: [
      'builder', 'scaling', 'democratiz', 'infrastructure', 'deployment'
    ],
    shouldNotMatch: [
      'worker', 'job', 'governance', 'ethics', 'policy'
    ],
    stanceMap: {
      supports: ['builder', 'scaling', 'democratiz', 'open'],
      challenges: ['centraliz', 'monopol', 'control']
    }
  },

  // AI workforce impact (broader pattern)
  'ai.*will|will.*ai|replace.*work|future.*work|workforce|automat.*job|ai.*take': {
    intent: {
      sentiment: 'questioning',
      topic: 'work',
      focus: 'societal'
    },
    shouldMatch: [
      'displacement', 'collaboration', 'worker', 'human', 'job', 'augment'
    ],
    shouldNotMatch: [
      'technical', 'model', 'training', 'architecture', 'enterprise'
    ],
    stanceMap: {
      supports: ['displacement', 'realist', 'threat', 'automat'],
      challenges: ['collaboration', 'augment', 'human', 'complement']
    }
  },

  // AI skepticism / Snake oil queries
  'snake.*oil|scam|fake.*ai|mislead|exaggerat|doesn.*work|ai.*hype|limitation': {
    intent: {
      sentiment: 'skeptical',
      topic: 'hype',
      focus: 'technical'
    },
    shouldMatch: [
      'skeptic', 'realist', 'grounding', 'limitation', 'critical'
    ],
    shouldNotMatch: [
      'enterprise', 'adoption', 'worker', 'governance', 'safety'
    ],
    stanceMap: {
      supports: ['skeptic', 'realist', 'critical', 'grounding', 'limitation'],
      challenges: ['maximalist', 'optimist', 'scaling', 'progress']
    }
  }
}

// ============================================================================
// QUERY INTENT DETECTION
// ============================================================================

/**
 * Detect the intent of a user's search query
 */
export function detectQueryIntent(query: string): QueryIntent {
  const queryLower = query.toLowerCase()

  // Check editorial mappings first
  for (const [pattern, mapping] of Object.entries(EDITORIAL_QUERY_MAPPINGS)) {
    const regex = new RegExp(pattern, 'i')
    if (regex.test(queryLower)) {
      return mapping.intent
    }
  }

  // Fallback: Generic intent detection
  let sentiment: QueryIntent['sentiment'] = 'neutral'
  let topic: QueryIntent['topic'] = 'general'
  let focus: QueryIntent['focus'] = 'general'

  // Detect sentiment
  if (/not|no|false|myth|wrong|bubble|hype|overrated|skeptic/.test(queryLower)) {
    sentiment = 'skeptical'
  } else if (/will|should|can|promise|potential|opportunit/.test(queryLower)) {
    sentiment = 'optimistic'
  } else if (/\?|how|what|why|when/.test(queryLower)) {
    sentiment = 'questioning'
  }

  // Detect topic
  if (/bubble|hype|overhyp|overrat|snake.*oil|scam/.test(queryLower)) {
    topic = 'hype'
  } else if (/capabilit|limitation|can.*do|performance|agent|agentic|infrastructure|gpu|deploy/.test(queryLower)) {
    topic = 'capabilities'
  } else if (/safe|risk|danger|alignment|threat/.test(queryLower)) {
    topic = 'safety'
  } else if (/job|work|worker|employ|labor|workforce|replace|displace|vibe|coding|developer/.test(queryLower)) {
    topic = 'work'
  } else if (/enterprise|business|company|corporate|adopt/.test(queryLower)) {
    topic = 'adoption'
  } else if (/ethic|bias|fair|discriminat/.test(queryLower)) {
    topic = 'ethics'
  } else if (/regulat|govern|policy|law|control/.test(queryLower)) {
    topic = 'governance'
  }

  // Detect focus
  if (/model|training|architecture|parameter|compute|agent|infrastructure|gpu|deploy|coding|developer|tool/.test(queryLower)) {
    focus = 'technical'
  } else if (/society|people|human|social|culture|workforce|worker/.test(queryLower)) {
    focus = 'societal'
  } else if (/business|enterprise|company|market|revenue/.test(queryLower)) {
    focus = 'business'
  } else if (/policy|regulat|govern|law/.test(queryLower)) {
    focus = 'policy'
  }

  return { sentiment, topic, focus }
}

// ============================================================================
// CAMP RELEVANCE SCORING
// ============================================================================

/**
 * Calculate how relevant a camp is to the user's query
 * This is DIFFERENT from the author-to-camp relevance field in the database
 */
export function calculateCampRelevance(
  camp: any,
  query: string,
  expandedTerms: string[],
  intent: QueryIntent
): CampRelevanceScore {
  let score = 0
  const matchReasons: string[] = []
  const queryLower = query.toLowerCase()
  const campNameLower = (camp.name || '').toLowerCase()
  const campDescLower = (camp.positionSummary || camp.description || '').toLowerCase()

  // === EXACT MATCHES (High value) ===

  // Exact query in camp name: +50
  if (campNameLower.includes(queryLower)) {
    score += 50
    matchReasons.push('Query appears in camp name')
  }

  // Exact query in camp description: +30
  if (campDescLower.includes(queryLower)) {
    score += 30
    matchReasons.push('Query appears in camp description')
  }

  // === EXPANDED TERMS (Medium value) ===

  expandedTerms.forEach(term => {
    const termLower = term.toLowerCase()

    // Term in camp name: +10
    if (campNameLower.includes(termLower)) {
      score += 10
      matchReasons.push(`Related term "${term}" in name`)
    }

    // Term in camp description: +5
    if (campDescLower.includes(termLower)) {
      score += 5
      matchReasons.push(`Related term "${term}" in description`)
    }
  })

  // === EDITORIAL MAPPINGS (Override score) ===

  // Check if query matches any editorial pattern
  for (const [pattern, mapping] of Object.entries(EDITORIAL_QUERY_MAPPINGS)) {
    const regex = new RegExp(pattern, 'i')
    if (regex.test(queryLower)) {
      // Check if camp should be excluded
      const shouldExclude = mapping.shouldNotMatch.some(excludePattern =>
        new RegExp(excludePattern, 'i').test(campNameLower)
      )

      if (shouldExclude) {
        score = 0  // Exclude this camp
        matchReasons.push('Editorially excluded as not relevant')
        break
      }

      // Check if camp should be included
      const shouldInclude = mapping.shouldMatch.some(includePattern =>
        new RegExp(includePattern, 'i').test(campNameLower)
      )

      if (shouldInclude) {
        score += 25  // Editorial boost
        matchReasons.push('Editorially curated as highly relevant')
      }

      break
    }
  }

  // === DOMAIN RELEVANCE (Intent-based) ===

  const domain = camp.domain || ''

  if (intent.focus === 'technical' && domain.includes('Technical')) {
    score += 10
    matchReasons.push('Domain matches technical focus')
  } else if (intent.focus === 'societal' && domain.includes('Society')) {
    score += 10
    matchReasons.push('Domain matches societal focus')
  } else if (intent.focus === 'business' && domain.includes('Enterprise')) {
    score += 10
    matchReasons.push('Domain matches business focus')
  } else if (intent.focus === 'policy' && domain.includes('Governance')) {
    score += 10
    matchReasons.push('Domain matches policy focus')
  }

  // === DETERMINE STANCE ===

  const stance = determineStance(camp, query, intent)

  return {
    campId: camp.id,
    campName: camp.name,
    score,
    matchReasons,
    stance
  }
}

// ============================================================================
// SEMANTIC STANCE DETECTION
// ============================================================================

/**
 * Determine if a camp supports, challenges, or is neutral to the query intent
 */
export function determineStance(
  camp: any,
  query: string,
  intent: QueryIntent
): 'supports' | 'challenges' | 'neutral' {
  const queryLower = query.toLowerCase()
  const campNameLower = (camp.name || '').toLowerCase()

  // Check editorial mappings first
  for (const [pattern, mapping] of Object.entries(EDITORIAL_QUERY_MAPPINGS)) {
    const regex = new RegExp(pattern, 'i')
    if (regex.test(queryLower)) {
      // Check if camp supports the query viewpoint
      const supports = mapping.stanceMap.supports.some(supportPattern =>
        new RegExp(supportPattern, 'i').test(campNameLower)
      )
      if (supports) return 'supports'

      // Check if camp challenges the query viewpoint
      const challenges = mapping.stanceMap.challenges.some(challengePattern =>
        new RegExp(challengePattern, 'i').test(campNameLower)
      )
      if (challenges) return 'challenges'

      break
    }
  }

  // Fallback: Generic stance detection based on intent
  if (intent.sentiment === 'skeptical') {
    // Skeptical queries are supported by cautious/critical camps
    if (/skeptic|realist|cautio|critical|limit|ground/.test(campNameLower)) {
      return 'supports'
    }
    if (/optimist|maximalist|progress|potential/.test(campNameLower)) {
      return 'challenges'
    }
  } else if (intent.sentiment === 'optimistic') {
    // Optimistic queries are supported by progressive camps
    if (/optimist|maximalist|progress|potential|promis/.test(campNameLower)) {
      return 'supports'
    }
    if (/skeptic|realist|cautio|critical|limit/.test(campNameLower)) {
      return 'challenges'
    }
  }

  return 'neutral'
}

// ============================================================================
// QUALITY FILTERING
// ============================================================================

/**
 * Quality thresholds for filtering results
 */
export const QUALITY_THRESHOLDS = {
  HIGH_RELEVANCE: 20,    // Primary results - score >= 20
  MEDIUM_RELEVANCE: 12,  // Related results - show with indicator
  LOW_RELEVANCE: 8       // Filter out anything below this
}

/**
 * Filter camps by quality threshold
 */
export function filterByQuality(
  scoredCamps: CampRelevanceScore[],
  threshold: number = QUALITY_THRESHOLDS.HIGH_RELEVANCE
): CampRelevanceScore[] {
  return scoredCamps
    .filter(camp => camp.score >= threshold)
    .sort((a, b) => b.score - a.score)
}

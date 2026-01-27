/**
 * Curation Agents - Source Discovery & Position Verification
 *
 * Two types of staleness:
 * 1. Source Staleness: Do we have their recent work?
 * 2. Position Staleness: Do our position summaries (camp_authors.why_it_matters) still hold?
 *
 * Note: Each author has at least one position summary per camp they belong to.
 * Position summaries describe "why they believe/challenge certain things" for each intellectual camp.
 */

import { callGemini } from '@/lib/ai-editor/gemini'

export interface DiscoveredSource {
  title: string
  url: string
  date: string | null
  type: 'Paper' | 'Blog' | 'Video' | 'Podcast' | 'Interview' | 'Tweet' | 'Book' | 'Talk' | 'Other'
  summary: string
  relevance: 'high' | 'medium' | 'low'
}

export interface SourceDiscoveryResult {
  authorId: string
  authorName: string
  existingSourceCount: number
  newestExistingDate: string | null
  discoveredSources: DiscoveredSource[]
  searchSummary: string
  status: 'new_content_found' | 'up_to_date' | 'error'
}

export interface EnrichedSourceDate {
  originalTitle: string
  originalDate: string | null
  enrichedDate: string | null // YYYY-MM-DD or YYYY-MM or YYYY
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
  source: string // Where the date was found (e.g., "URL metadata", "ArXiv", "Known conference date")
}

export interface PositionAnalysis {
  aligned: boolean
  shiftDetected: boolean
  shiftSeverity: 'none' | 'minor' | 'moderate' | 'significant'
  shiftSummary: string | null
  newTopics: string[]
  suggestedUpdate: string | null
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
}

export interface PositionVerificationResult {
  authorId: string
  authorName: string
  currentSummary: string
  analysis: PositionAnalysis
  status: 'verified' | 'needs_review' | 'drift_detected' | 'error'
}

/**
 * Enrich source dates using web knowledge
 *
 * Takes sources with poor/missing date information and attempts to find
 * accurate publication dates from various signals (URLs, paper titles, conferences, etc.)
 */
export async function enrichSourceDates(
  sources: Array<{ title: string; url?: string; year?: string; date?: string }>,
  authorName: string
): Promise<EnrichedSourceDate[]> {
  console.log(`[enrichSourceDates] Processing ${sources.length} sources for ${authorName}`)

  const prompt = `You are a research assistant helping to find accurate publication dates for academic and professional content.

AUTHOR: ${authorName}

SOURCES TO DATE (find publication dates for these):
${sources.map((s, idx) => `
${idx + 1}. Title: "${s.title}"
   URL: ${s.url || 'unknown'}
   Current date info: ${s.date || s.year || 'none'}
`).join('\n')}

TASK: For each source, determine the most accurate publication date you can find.

USE THESE SIGNALS:
- ArXiv URLs contain dates: arxiv.org/abs/2301.12345 → January 2023
- Conference papers: Check known conference dates (NeurIPS, ICML, ICLR, etc.)
- Blog post URLs often have dates: /2023/05/article-name/
- YouTube URLs: Can extract upload dates from video IDs sometimes
- Paper venues: "Presented at NeurIPS 2023" → December 2023
- Books: Publication year usually in title or description

CONFIDENCE LEVELS:
- high: Date found in URL, arXiv ID, or explicit mention
- medium: Inferred from conference/venue
- low: Best guess from context

Return ONLY valid JSON array:
[
  {
    "originalTitle": "exact title",
    "originalDate": "what we had before or null",
    "enrichedDate": "YYYY-MM-DD or YYYY-MM or YYYY or null if can't determine",
    "confidence": "high|medium|low",
    "reasoning": "Brief • Max 10 words",
    "source": "Where found: ArXiv URL, Conference date, URL path, etc."
  }
]

Be systematic. Check URLs carefully for date patterns. If you can't find a date, set enrichedDate to null.`

  try {
    console.log(`[enrichSourceDates] Calling Gemini Pro...`)
    const response = await callGemini(prompt, 'pro') // Use Pro model for better reasoning
    console.log(`[enrichSourceDates] Received response (${response.length} chars)`)

    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error('[enrichSourceDates] ❌ No JSON array found in response')
      console.error('Raw response preview:', response.substring(0, 500))
      return []
    }

    const enrichedDates: EnrichedSourceDate[] = JSON.parse(jsonMatch[0])
    console.log(`[enrichSourceDates] ✅ Parsed ${enrichedDates.length} enriched dates`)
    if (enrichedDates.length > 0) {
      console.log('Sample result:', JSON.stringify(enrichedDates[0], null, 2))
    }
    return enrichedDates
  } catch (error) {
    console.error('[enrichSourceDates] ❌ Error:', error)
    if (error instanceof Error) {
      console.error('[enrichSourceDates] Error stack:', error.stack)
    }
    return []
  }
}

/**
 * Discover new sources for an author using Gemini
 *
 * This agent searches for recent publications, talks, and content
 * from the author that we may not have in our canon.
 */
export async function discoverSources(
  authorId: string,
  authorName: string,
  affiliation: string | null,
  existingSources: Array<{ title: string; url: string; year?: string }>,
  lookbackMonths: number = 24 // Extended to 24 months to work within Gemini's knowledge cutoff
): Promise<SourceDiscoveryResult> {
  const existingTitles = existingSources.map(s => s.title.toLowerCase())
  const existingUrls = new Set(existingSources.map(s => s.url))

  // Find newest existing source date
  const years = existingSources
    .map(s => s.year)
    .filter(Boolean)
    .map(y => parseInt(y as string))
    .filter(y => !isNaN(y))
  const newestYear = years.length > 0 ? Math.max(...years) : null

  // Calculate explicit date range for search
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 0-indexed
  const searchStartDate = new Date(now)
  searchStartDate.setMonth(now.getMonth() - lookbackMonths)
  const searchStartYear = searchStartDate.getFullYear()
  const searchStartMonth = searchStartDate.getMonth() + 1

  const prompt = `Find AI/tech content from ${authorName}${affiliation ? ` (${affiliation})` : ''}.

NOTE: Your training data ends ~Aug 2024. Focus on 2023-2024 content you actually know about.

EXISTING SOURCES (do NOT include):
${existingSources.slice(0, 10).map(s => `- "${s.title}" (${s.year || 'unknown'})`).join('\n')}
${existingSources.length > 10 ? `... and ${existingSources.length - 10} more` : ''}

Find from 2023-2024: papers, blog posts, videos, podcasts, interviews, tweets, talks, conference presentations.

EXAMPLES of what to include:
- ArXiv papers
- Conference talks (NeurIPS, ICML, etc)
- Major podcast appearances (Lex Fridman, etc)
- Twitter/X threads with significant engagement
- Blog posts on their personal site or Medium
- YouTube videos or talks

CRITICAL: Only include sources from your training data. If you're unsure, include it anyway - better to find potential sources than miss real ones.

Return ONLY valid JSON:
{
  "searchSummary": "If empty: 'No sources in training data. Check: Twitter/X, YouTube, arXiv, personal blog, recent podcasts'",
  "discoveredSources": [
    {
      "title": "Exact title",
      "url": "URL or 'unknown'",
      "date": "YYYY-MM-DD or YYYY-MM or YYYY or null",
      "type": "Paper|Blog|Video|Podcast|Interview|Tweet|Book|Talk|Other",
      "summary": "1 sentence max",
      "relevance": "high|medium|low"
    }
  ]
}

Be generous - include sources even if slightly uncertain. Better to suggest than miss.`

  try {
    const response = await callGemini(prompt, 'flash') // Use flash model - cheaper & faster

    // Parse response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return {
        authorId,
        authorName,
        existingSourceCount: existingSources.length,
        newestExistingDate: newestYear ? `${newestYear}-01-01` : null,
        discoveredSources: [],
        searchSummary: 'Failed to parse response',
        status: 'error'
      }
    }

    const result = JSON.parse(jsonMatch[0])

    // Filter out sources we already have (by URL or similar title)
    const newSources = (result.discoveredSources || []).filter((source: DiscoveredSource) => {
      if (source.url && source.url !== 'unknown' && existingUrls.has(source.url)) {
        return false
      }
      // Check if title is too similar to existing
      const lowerTitle = source.title.toLowerCase()
      return !existingTitles.some(existing =>
        existing.includes(lowerTitle) || lowerTitle.includes(existing)
      )
    })

    // If no sources found, provide manual search guidance
    const finalSearchSummary = newSources.length === 0 && result.searchSummary === 'Search completed'
      ? `LLM training data may not have recent content. Manual search recommended: Twitter/X (@${authorName.split(' ').join('').toLowerCase()}), YouTube, arXiv, personal blog`
      : result.searchSummary || 'Search completed'

    return {
      authorId,
      authorName,
      existingSourceCount: existingSources.length,
      newestExistingDate: newestYear ? `${newestYear}-01-01` : null,
      discoveredSources: newSources,
      searchSummary: finalSearchSummary,
      status: newSources.length > 0 ? 'new_content_found' : 'up_to_date'
    }
  } catch (error) {
    console.error('Source discovery error:', error)
    return {
      authorId,
      authorName,
      existingSourceCount: existingSources.length,
      newestExistingDate: newestYear ? `${newestYear}-01-01` : null,
      discoveredSources: [],
      searchSummary: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    }
  }
}

/**
 * Verify if an author's position summaries are still accurate
 *
 * This agent compares our stored understanding of an author's stances
 * (from camp_authors.why_it_matters) against their recent content to detect shifts.
 *
 * Each author has at least one position summary per camp they belong to,
 * describing why they believe/challenge certain things.
 */
export async function verifyPosition(
  authorId: string,
  authorName: string,
  currentPositionSummaries: string, // Combined from all camp assignments: "[Camp] why_it_matters"
  recentSources: Array<{ title: string; year?: string; summary?: string }>,
  campAssignments: Array<{ campName: string; campDescription: string }>
): Promise<PositionVerificationResult> {

  if (!currentPositionSummaries || currentPositionSummaries.trim() === '') {
    return {
      authorId,
      authorName,
      currentSummary: '',
      analysis: {
        aligned: false,
        shiftDetected: false,
        shiftSeverity: 'none',
        shiftSummary: 'No position summaries exist to verify',
        newTopics: [],
        suggestedUpdate: null,
        confidence: 'low',
        reasoning: 'Cannot verify position without existing summaries in camp assignments'
      },
      status: 'needs_review'
    }
  }

  // Calculate source recency to determine confidence
  const now = new Date()
  const currentYear = now.getFullYear()

  const sourceYears = recentSources
    .map(s => s.year ? parseInt(s.year) : null)
    .filter((y): y is number => y !== null && !isNaN(y))

  const mostRecentSourceYear = sourceYears.length > 0 ? Math.max(...sourceYears) : null
  const yearsSinceLastSource = mostRecentSourceYear ? currentYear - mostRecentSourceYear : null

  // If sources are too old, return low confidence immediately
  if (!mostRecentSourceYear || yearsSinceLastSource === null || yearsSinceLastSource > 3) {
    return {
      authorId,
      authorName,
      currentSummary: currentPositionSummaries,
      analysis: {
        aligned: false,
        shiftDetected: false,
        shiftSeverity: 'none',
        shiftSummary: null,
        newTopics: [],
        suggestedUpdate: null,
        confidence: 'low',
        reasoning: `Most recent source: ${mostRecentSourceYear} (${yearsSinceLastSource}y ago) • Need 2024+ sources`
      },
      status: 'needs_review'
    }
  }

  const prompt = `Verify if our understanding of ${authorName}'s positions are still accurate.

CRITICAL: You must be honest about confidence. If sources are old (>2 years), set confidence to LOW.

OUR POSITION SUMMARIES (from camp assignments):
${currentPositionSummaries}

CAMPS:
${campAssignments.map(c => `- ${c.campName}: ${c.campDescription}`).join('\n')}

SOURCES AVAILABLE (most recent: ${mostRecentSourceYear}, ${yearsSinceLastSource} years ago):
${recentSources.slice(0, 15).map(s =>
  `- "${s.title}" (${s.year || 'unknown'})${s.summary ? `: ${s.summary}` : ''}`
).join('\n')}

Check:
1. Are our position summaries still accurate based on these sources?
2. Any shift in emphasis, intensity, or direction for any camp?
3. New topics they now focus on?
4. Any contradictions to our summaries?

CONFIDENCE RULES (MUST FOLLOW):
- If most recent source is >2 years old: confidence = "low" (we don't know their current views)
- If sources lack detail/summaries: confidence = "low" (insufficient info)
- Only set confidence = "high" if you have recent, detailed sources that clearly confirm/contradict positions

Return ONLY valid JSON:
{
  "aligned": true/false,
  "shiftDetected": true/false,
  "shiftSeverity": "none|minor|moderate|significant",
  "shiftSummary": "What changed (null if no shift)",
  "newTopics": ["Topic1", "Topic2"],
  "suggestedUpdate": "Updated position summaries if needed (null if accurate)",
  "confidence": "high|medium|low",
  "reasoning": "Max 2 bullet points • Use • separator • Focus on actionable facts • Example: Sources from 2024 • Positions consistent with scaling"
}

aligned = summaries are fundamentally accurate. shiftDetected = notable change. Only flag moderate/significant shifts for meaningful changes.`

  try {
    const response = await callGemini(prompt, 'flash') // Use flash model - cheaper & faster

    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return {
        authorId,
        authorName,
        currentSummary: currentPositionSummaries,
        analysis: {
          aligned: true,
          shiftDetected: false,
          shiftSeverity: 'none',
          shiftSummary: null,
          newTopics: [],
          suggestedUpdate: null,
          confidence: 'low',
          reasoning: 'Failed to parse response'
        },
        status: 'error'
      }
    }

    const analysis: PositionAnalysis = JSON.parse(jsonMatch[0])

    // Override confidence if LLM is being overconfident with old sources
    if (yearsSinceLastSource && yearsSinceLastSource >= 2 && analysis.confidence === 'high') {
      analysis.confidence = 'medium'
      analysis.reasoning = `${analysis.reasoning} • Sources ${yearsSinceLastSource}y old (downgraded confidence)`
    }

    if (yearsSinceLastSource && yearsSinceLastSource >= 3 && analysis.confidence !== 'low') {
      analysis.confidence = 'low'
      analysis.reasoning = `${analysis.reasoning} • Sources ${yearsSinceLastSource}y old (need recent data)`
    }

    // Determine status based on analysis
    let status: PositionVerificationResult['status'] = 'verified'
    if (analysis.shiftDetected && (analysis.shiftSeverity === 'significant' || analysis.shiftSeverity === 'moderate')) {
      status = 'drift_detected'
    } else if (!analysis.aligned || analysis.confidence === 'low') {
      status = 'needs_review'
    }

    return {
      authorId,
      authorName,
      currentSummary: currentPositionSummaries,
      analysis,
      status
    }
  } catch (error) {
    console.error('Position verification error:', error)
    return {
      authorId,
      authorName,
      currentSummary: currentPositionSummaries,
      analysis: {
        aligned: true,
        shiftDetected: false,
        shiftSeverity: 'none',
        shiftSummary: null,
        newTopics: [],
        suggestedUpdate: null,
        confidence: 'low',
        reasoning: error instanceof Error ? error.message : 'Unknown error'
      },
      status: 'error'
    }
  }
}

/**
 * Full curation check - runs position verification FIRST, then source discovery
 *
 * Order rationale:
 * 1. Position Verification: "Are our position summaries still accurate?"
 *    - Uses existing sources to check if summaries (from camp_authors.why_it_matters) need updating
 *    - Admin should know if positions have drifted before adding new content
 *
 * 2. Source Discovery: "What new content should we add?"
 *    - Finds new publications to expand coverage
 *    - Done after position check so admin has full context
 */
export async function fullCurationCheck(
  authorId: string,
  authorName: string,
  affiliation: string | null,
  currentPositionSummaries: string, // Combined from all camp assignments
  existingSources: Array<{ title: string; url: string; year?: string; summary?: string }>,
  campAssignments: Array<{ campName: string; campDescription: string }>
): Promise<{
  positionVerification: PositionVerificationResult
  sourceDiscovery: SourceDiscoveryResult
}> {
  // Step 1: Verify position first - are our position summaries still accurate?
  const positionVerification = await verifyPosition(
    authorId,
    authorName,
    currentPositionSummaries,
    existingSources,
    campAssignments
  )

  // Step 2: Discover new sources - what new content should we add?
  const sourceDiscovery = await discoverSources(
    authorId,
    authorName,
    affiliation,
    existingSources
  )

  return {
    positionVerification,  // Listed first since it runs first
    sourceDiscovery
  }
}

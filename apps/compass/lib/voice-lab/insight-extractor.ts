/**
 * Voice Lab - Insight Extractor
 *
 * AI module that extracts deep voice insights from writing samples.
 * Uses adaptive model selection: Gemini Pro for longer samples (500+ words),
 * Gemini Flash for shorter samples.
 *
 * Produces Alin-quality insights including:
 * - Named rhetorical techniques and frameworks (AIDA, PAS, etc.)
 * - Emotional journeys and document arcs
 * - Contrast pairs and coined vocabulary
 * - Extended metaphors with their mappings
 * - Specific anti-patterns to avoid
 *
 * Each sample yields 10-15 insights across categories:
 * - tone: voice characteristics, emotional register, reader relationship
 * - vocabulary: word choice patterns, coined terms, contrast pairs
 * - structure: sentence patterns, document arc, section rhythm
 * - rhetoric: persuasion techniques, frameworks, metaphors
 * - principle: core writing rules, anti-patterns, transformations
 */

import { callGemini } from '@/lib/ai-editor/gemini'
import { ExtractedInsight, VoiceInsightType } from './types'

/**
 * Result from extracting insights from a sample
 */
export interface ExtractionResult {
  insights: ExtractedInsight[]
  qualityScore: number
  wordCount: number
  /** Detected content format (LinkedIn, blog, email, etc.) */
  detectedFormat?: string
  /** Detected writing framework if any (AIDA, PAS, etc.) */
  detectedFramework?: string
}

/**
 * Extract deep voice insights from a writing sample
 *
 * Uses adaptive model selection (Pro for 500+ words) to analyze
 * samples and extract rich, actionable observations including:
 * - Named rhetorical techniques
 * - Emotional journeys
 * - Contrast pairs and coined vocabulary
 * - Extended metaphors
 * - Anti-patterns to avoid
 *
 * @param sampleContent - The raw writing sample to analyze
 * @returns Extracted insights with confidence scores and format detection
 */
export async function extractInsightsFromSample(
  sampleContent: string
): Promise<ExtractionResult> {
  const wordCount = sampleContent.trim().split(/\s+/).filter(w => w.length > 0).length

  // Validate minimum content
  if (wordCount < 50) {
    return {
      insights: [],
      qualityScore: 0.3,
      wordCount,
    }
  }

  // Adaptive model selection: Pro for longer samples, Flash for shorter
  const useProModel = wordCount >= 500

  const prompt = `You are an expert B2B writing analyst specializing in thought leadership content. Analyze the following writing sample and extract deep, specific insights about the writer's voice and style.

## WRITING SAMPLE TO ANALYZE:

${sampleContent}

---

## CONTEXT DETECTION (include in response):

First, detect key context about this content:
- **Content Format**: What type of content is this? (LinkedIn post, newsletter, blog article, email, whitepaper, case study, product copy, tweet thread, etc.)
- **Writing Framework**: Does it follow a recognizable structure? (AIDA, PAS, BAB, HVCTA, SLA, 3-1-3, Hot Take, or custom)
- **Funnel Position**: TOFU (awareness), MOFU (consideration), or BOFU (decision)?

## EXTRACTION TASK:

Extract 10-15 deep voice insights. Each insight should be:
- Specific enough to replicate (not vague platitudes)
- Grounded in evidence from the sample
- Named where possible (e.g., "The sobering pivot" technique, not just "uses transitions")

## CATEGORIES (aim for 2-3 insights per category):

### 1. TONE (voice characteristics)
Extract insights about:
- Position on formality spectrum (casual ↔ corporate) - where exactly?
- Reader relationship: peer, mentor, advisor, provocateur, or coach?
- **Emotional journey/texture**: Does the piece move through emotions? (e.g., "confrontation → fear → possibility → agency")
- Confidence markers: hedging vs. declarative language
- What the tone explicitly AVOIDS (anti-patterns)

Example insight: "Creates an emotional arc from discomfort ('This is hard to hear') through fear ('The threat is real') to empowerment ('You can choose')"

### 2. VOCABULARY (word choice patterns)
Extract insights about:
- **Coined or adapted terms** with their meanings (e.g., "zombify" = becoming obsolete through passivity)
- **Contrast pairs** used (e.g., "dead/alive", "threat/opportunity", "passive/builder")
- Domain-specific jargon and how it's deployed
- Action verb patterns (commanding, inviting, neutral?)
- Technical credibility signals
- Words/phrases explicitly avoided

Example insight: "Uses 'zombification' as a coined term meaning the gradual process of becoming irrelevant through failure to adapt"

### 3. STRUCTURE (document and sentence patterns)
Extract insights about:
- **Document arc**: Step-by-step flow (e.g., "Acknowledgment → Disruption → Deepening → Turn → Offer → Uncertainty → Consequences → Choice")
- Hook pattern (if social/email): type and technique
- Section/paragraph rhythm and length variation
- Sentence-level patterns: length variation, punctuation quirks, voice (active/passive)
- White space philosophy (dense vs. airy)
- Opening and closing patterns

Example insight: "Follows an 8-part arc: Acknowledgment of status quo → Disruption with challenging claim → Deepening the stakes → The turn (offering a choice) → The offer (path forward) → Embracing uncertainty → Consequences of inaction → Final empowering choice"

### 4. RHETORIC (persuasion techniques)
Extract insights about:
- **Named B2B frameworks** used: AIDA, PAS (Problem-Agitate-Solution), BAB (Before-After-Bridge), HVCTA (Hook-Value-CTA), SLA (Story-Lesson-Application), Hot Take
- **Extended metaphors** with their mappings (e.g., "Zombies = people who become obsolete; Unicorns = rare adaptive talent")
- Persuasion techniques: binary framing with third option, rhetorical questions, social proof, urgency creation
- How FOMO or urgency is created (if at all)
- Thought leadership positioning: challenges assumptions? offers frameworks?
- **Name the technique** if it's distinctive (e.g., "The sobering pivot", "The empowering reframe")

Example insight: "Uses 'Binary framing with a third option' - presents two apparent choices, then reveals a hidden third path that reframes the entire problem"

### 5. PRINCIPLE (core writing rules)
Extract insights about:
- Core rules the author consistently follows
- What they ALWAYS do / NEVER do
- **Weak → Strong transformation patterns** (what generic writing would look like vs. what this author does)
- Authenticity markers: personal anecdotes, admissions of uncertainty, contrarian stances
- What makes this voice distinctive from typical corporate/marketing writing

Example insight: "NEVER uses passive corporate hedging ('It could be argued that...'). ALWAYS makes direct claims with first-person ownership ('I believe...', 'Here's what I've seen...')"

## CONFIDENCE SCORING:

Assign each insight a confidence score from 0.4 to 0.9:
- 0.4-0.5: Pattern appears once, might be situational
- 0.6-0.7: Pattern appears multiple times, likely intentional
- 0.8-0.9: Strong, consistent pattern throughout the sample

## QUALITY ASSESSMENT:

Assess the overall quality of this sample for training purposes (0.0-1.0):
- 0.3-0.4: Poor sample (too short, unclear, or inconsistent style)
- 0.5-0.6: Adequate sample with some patterns visible
- 0.7-0.8: Good sample with clear, consistent patterns
- 0.9-1.0: Excellent sample with rich, distinctive voice and multiple techniques

## RESPONSE FORMAT:

Return ONLY valid JSON (no markdown, no extra text):

{
  "qualityScore": 0.85,
  "detectedFormat": "LinkedIn post",
  "detectedFramework": "Hot Take with PAS elements",
  "insights": [
    {
      "type": "tone",
      "content": "Creates an emotional journey from confrontation ('This is uncomfortable') through fear ('The stakes are real') to agency ('You have the power to choose')",
      "examples": ["This is hard to hear", "The threat isn't hypothetical", "But you get to decide"],
      "confidence": 0.85
    },
    {
      "type": "vocabulary",
      "content": "Coins the term 'zombification' to describe the gradual process of becoming irrelevant through passive acceptance of change",
      "examples": ["zombify", "zombification", "the walking dead of industry"],
      "confidence": 0.9
    },
    {
      "type": "structure",
      "content": "Follows an 8-part document arc: Acknowledgment → Disruption → Deepening → Turn → Offer → Uncertainty → Consequences → Choice",
      "examples": ["Look, I get it...", "But here's what's changing...", "So what does this mean?"],
      "confidence": 0.8
    },
    {
      "type": "rhetoric",
      "content": "Uses 'Binary framing with a third option' - presents two apparent paths (adapt or die), then reveals the real choice is about mindset",
      "examples": ["You can resist or accept", "But there's a third path", "The real question isn't whether but how"],
      "confidence": 0.75
    },
    {
      "type": "principle",
      "content": "ALWAYS ends with reader empowerment and agency, NEVER with doom or passive acceptance. The closing move is always 'You get to choose'",
      "examples": ["The choice is yours", "You decide what comes next", "This is your moment"],
      "confidence": 0.85
    }
  ]
}`

  try {
    // Adaptive model selection: Pro for deeper analysis on longer samples
    const modelType = useProModel ? 'pro' : 'flash'
    console.log(`Extracting insights with ${modelType} model (${wordCount} words)`)

    const response = await callGemini(prompt, modelType, false)

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No JSON found in insight extraction response')
      return {
        insights: [],
        qualityScore: 0.5,
        wordCount,
      }
    }

    const result = JSON.parse(jsonMatch[0])

    // Validate and clean insights
    const validTypes: VoiceInsightType[] = ['tone', 'vocabulary', 'structure', 'rhetoric', 'principle']
    const insights: ExtractedInsight[] = (result.insights || [])
      .filter((insight: Record<string, unknown>) => {
        return (
          typeof insight.type === 'string' &&
          validTypes.includes(insight.type as VoiceInsightType) &&
          typeof insight.content === 'string' &&
          insight.content.length > 0
        )
      })
      .map((insight: Record<string, unknown>) => ({
        type: insight.type as VoiceInsightType,
        content: String(insight.content).trim(),
        examples: Array.isArray(insight.examples)
          ? insight.examples.filter((e: unknown) => typeof e === 'string').slice(0, 5)
          : [],
        confidence: Math.max(0.4, Math.min(0.9, Number(insight.confidence) || 0.5)),
      }))

    const qualityScore = Math.max(0.3, Math.min(1.0, Number(result.qualityScore) || 0.5))

    // Extract optional format detection
    const detectedFormat = typeof result.detectedFormat === 'string' ? result.detectedFormat : undefined
    const detectedFramework = typeof result.detectedFramework === 'string' ? result.detectedFramework : undefined

    return {
      insights,
      qualityScore,
      wordCount,
      detectedFormat,
      detectedFramework,
    }
  } catch (error) {
    console.error('Failed to extract insights from sample:', error)
    return {
      insights: [],
      qualityScore: 0.4,
      wordCount,
    }
  }
}

/**
 * Extract insights from multiple samples in batch
 *
 * Processes samples in parallel for efficiency.
 *
 * @param samples - Array of sample content strings
 * @returns Array of extraction results
 */
export async function extractInsightsFromSamples(
  samples: string[]
): Promise<ExtractionResult[]> {
  if (samples.length === 0) {
    return []
  }

  // Process samples in parallel (limit concurrency to avoid rate limits)
  const batchSize = 3
  const results: ExtractionResult[] = []

  for (let i = 0; i < samples.length; i += batchSize) {
    const batch = samples.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map((content) => extractInsightsFromSample(content))
    )
    results.push(...batchResults)
  }

  return results
}

/**
 * Assess sample quality without extracting full insights
 *
 * Quick quality check for determining if a sample is worth processing.
 * Considers length, stylistic richness, and voice distinctiveness.
 *
 * @param sampleContent - The raw writing sample
 * @returns Quality score from 0.0 to 1.0
 */
export async function assessSampleQuality(
  sampleContent: string
): Promise<number> {
  const wordCount = sampleContent.trim().split(/\s+/).filter(w => w.length > 0).length

  // Quick heuristics for obviously poor samples
  if (wordCount < 50) return 0.3
  if (wordCount < 100) return 0.4

  // For longer samples, do a quality assessment
  const prompt = `Rate this writing sample's quality for training a B2B voice profile (0.0-1.0).

Consider:
- Length and depth (longer samples can reveal more patterns)
- Stylistic consistency and distinctiveness
- Presence of rhetorical techniques (PAS, AIDA, metaphors, etc.)
- Emotional texture and voice personality
- Vocabulary richness and any coined terms
- Structural patterns visible

Sample (first 800 chars):
${sampleContent.substring(0, 800)}

Scoring guide:
- 0.3-0.4: Too short, generic, or unclear voice
- 0.5-0.6: Adequate but not distinctive
- 0.7-0.8: Good sample with clear patterns and distinctive voice
- 0.9-1.0: Excellent - rich, consistent, multiple techniques visible

Return ONLY a single number between 0.0 and 1.0.`

  try {
    const response = await callGemini(prompt, 'flash', true)
    const score = parseFloat(response.trim())
    if (!isNaN(score) && score >= 0 && score <= 1) {
      return Math.round(score * 100) / 100
    }
  } catch (error) {
    console.error('Failed to assess sample quality:', error)
  }

  // Default quality based on word count - longer samples get higher base scores
  if (wordCount > 1000) return 0.75
  if (wordCount > 500) return 0.65
  return wordCount > 200 ? 0.55 : 0.5
}

/**
 * Normalize an insight for comparison and merging
 *
 * Reduces an insight to its essential meaning to detect duplicates
 * or similar insights across samples.
 *
 * @param content - The insight content
 * @returns Normalized string for comparison
 */
export function normalizeInsightContent(content: string): string {
  return content
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Check if two insights are similar enough to merge
 *
 * Uses simple string similarity to detect when insights
 * from different samples are describing the same pattern.
 *
 * @param content1 - First insight content
 * @param content2 - Second insight content
 * @returns True if insights should be merged
 */
export function areInsightsSimilar(content1: string, content2: string): boolean {
  const norm1 = normalizeInsightContent(content1)
  const norm2 = normalizeInsightContent(content2)

  // Exact match after normalization
  if (norm1 === norm2) return true

  // Check for high word overlap (Jaccard similarity)
  const words1 = new Set(norm1.split(' ').filter(w => w.length > 3))
  const words2 = new Set(norm2.split(' ').filter(w => w.length > 3))

  const intersection = new Set([...words1].filter(w => words2.has(w)))
  const union = new Set([...words1, ...words2])

  const similarity = union.size > 0 ? intersection.size / union.size : 0

  // Threshold for considering insights similar
  return similarity > 0.6
}

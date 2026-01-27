/**
 * Voice Lab - Style Synthesizer
 *
 * AI module that synthesizes comprehensive, Alin-quality style guides
 * from accumulated voice insights. Uses Gemini Pro for sophisticated
 * guide generation.
 *
 * Produces 10-section style guides including:
 * - Named rhetorical techniques with usage guidance
 * - Emotional journeys and document arcs
 * - Contrast pairs and coined vocabulary with meanings
 * - Specific anti-patterns ("What It Is NOT")
 * - Concrete Generic → This Style transformations
 * - Application guide with "Best For" and "Use With Caution"
 *
 * The synthesizer:
 * - Weights insights by confidence * sample_count
 * - Extracts named techniques from rhetoric insights
 * - Identifies emotional journeys from tone insights
 * - Creates actionable, replicable writing guidance
 */

import { callGemini } from '@/lib/ai-editor/gemini'
import { VoiceInsight, VoiceInsightType } from './types'
import { getInsightsForSynthesis } from './insight-store'

/**
 * Result from synthesizing a style guide
 */
export interface SynthesisResult {
  styleGuide: string
  insightsUsed: number
  coverageByType: Record<VoiceInsightType, number>
}

/**
 * Synthesize a style guide from accumulated insights
 *
 * Generates a comprehensive, 9-section markdown style guide
 * weighted by insight confidence and sample count.
 *
 * @param voiceProfileId - The profile to synthesize from
 * @param profileName - Name for the style guide header
 * @returns The generated style guide and synthesis metadata
 */
export async function synthesizeStyleGuide(
  voiceProfileId: string,
  profileName: string
): Promise<SynthesisResult> {
  // Get insights organized by type
  const insightsByType = await getInsightsForSynthesis(voiceProfileId)

  // Count total insights
  const insightsUsed =
    insightsByType.tone.length +
    insightsByType.vocabulary.length +
    insightsByType.structure.length +
    insightsByType.rhetoric.length +
    insightsByType.principle.length

  // If no insights, return empty guide
  if (insightsUsed === 0) {
    return {
      styleGuide: `# ${profileName}\n\nNo voice insights have been captured yet. Add writing samples to train this profile.`,
      insightsUsed: 0,
      coverageByType: {
        tone: 0,
        vocabulary: 0,
        structure: 0,
        rhetoric: 0,
        principle: 0,
      },
    }
  }

  // Build insight context for the AI
  const insightContext = buildInsightContext(insightsByType)

  // Generate the style guide with the enhanced 10-section format
  const prompt = `You are an expert B2B writing coach creating a comprehensive, professional-grade style guide. You have analyzed multiple writing samples and extracted deep patterns and insights.

## ACCUMULATED VOICE INSIGHTS:

${insightContext}

---

## YOUR TASK:

Create a detailed, Alin-quality style guide in markdown format called "${profileName}". This guide should enable any writer to accurately replicate this distinctive writing voice.

The guide must be:
- Specific enough to be immediately actionable (no vague platitudes)
- Named where appropriate (give techniques memorable names like "The sobering pivot")
- Rich with examples from the insights provided
- Honest about what this style is NOT (anti-patterns are as important as patterns)

Weight your guidance based on:
- Insights with higher confidence scores (0.7+) are more reliable
- Insights with higher sample counts have been validated across multiple samples

---

## REQUIRED 10-SECTION FORMAT:

# ${profileName}

## 1. Core Philosophy
Write 2-3 sentences capturing the soul of this voice:
- What is this style's fundamental purpose?
- What makes it distinctive from typical corporate/marketing writing?
- What belief or stance underlies every piece?

## 2. Tone Profile

### Primary Characteristics
- 4-6 bullet points describing the voice characteristics
- Be specific: "Speaks as a peer who's been through it" not just "friendly"
- Include where it falls on spectrums: formality, authority, warmth

### Emotional Texture
- Describe the emotional journey this style creates
- Format: "Moves from X → Y → Z" (e.g., "confrontation → fear → possibility → agency")
- What feelings does the reader experience?

### What It Is NOT (5 Anti-Patterns)
List exactly 5 things this style explicitly avoids:
- Be specific (e.g., "Never uses passive corporate hedging like 'It could be argued that...'")
- These should be actionable don'ts

## 3. Rhetorical Strategies

For each major technique identified, create a subsection:

### [Technique Name]
- **What it is**: Brief description
- **When to use**: Specific contexts
- **Example**: Quote from the insights

Include techniques like:
- Extended metaphors (with their mappings: X = Y)
- Binary framing patterns
- Persuasion structures (PAS, AIDA, etc.)
- Signature moves (e.g., "The sobering pivot", "The empowering reframe")

## 4. Document Architecture

### Document Arc
Describe the typical flow from opening to close:
- Step 1: [Name] - What happens
- Step 2: [Name] - What happens
- ...continue for each major beat

### Section Structure
- How do sections typically open?
- What happens in the middle?
- How do sections close?

## 5. Sentence-Level Style

### Characteristics
- Sentence length patterns (variation, rhythm)
- Punctuation habits (em dashes, ellipses, etc.)
- Voice preferences (active vs. passive, first vs. third person)
- Paragraph length and white space philosophy

### Avoid
- 3-5 specific sentence-level anti-patterns

## 6. Vocabulary Patterns

### Coined/Adapted Terms
If the style creates or adapts terms, list them with meanings:
- **[Term]**: [Meaning and how to use it]

### Contrast Pairs
List recurring X/Y contrasts used:
- dead/alive
- threat/opportunity
- passive/builder
(Only include if identified in insights)

### Preferred Language
- Action verbs favored
- Technical vs. accessible balance
- Domain-specific terms and how they're deployed

### Avoid
- Words and phrases that don't fit this style
- Why they break the voice

## 7. Transformations

Provide 4-6 specific before/after examples:

| Generic | ${profileName} Style |
|---------|---------------------|
| [Weak corporate version] | [Strong version using this style's techniques] |

Use example quotes from the insights as the "after" versions. Create realistic "before" versions that show what typical corporate writing would look like.

## 8. Application Guide

### Best For
- 4-6 specific contexts where this style excels
- Content types (LinkedIn posts, thought leadership, etc.)
- Audience situations
- Goals it serves well

### Use With Caution
- 3-5 contexts where this style might need modification
- Why it could backfire in these situations
- What to dial back

## 9. Quick Reference Checklist

Create a scannable checklist a writer can use before publishing:

**Before publishing, verify:**
- [ ] [Specific check from the style]
- [ ] [Another specific check]
- [ ] [Continue for 6-8 items]

## 10. The Voice in One Sentence

End with a single, memorable sentence that captures the essence:
> "[A sentence that a writer could remember and use as a north star]"

---

CRITICAL GUIDELINES:
- Every section must add specific, actionable value
- Use the example quotes provided in insights liberally
- Name techniques where they're distinctive (but don't force names on generic patterns)
- The "What It Is NOT" sections are crucial - anti-patterns define a style as much as patterns
- Transformations must be specific and realistic, not strawmen
- Weight confident insights (0.7+) heavily in your guidance
- Format as clean, professional markdown

Return ONLY the markdown style guide, nothing else.`

  try {
    // Use Gemini Pro for sophisticated synthesis
    const styleGuide = await callGemini(prompt, 'pro', false)

    // Clean up the response
    let cleanedGuide = styleGuide.trim()

    // Ensure it starts with a header
    if (!cleanedGuide.startsWith('#')) {
      cleanedGuide = `# ${profileName}\n\n${cleanedGuide}`
    }

    return {
      styleGuide: cleanedGuide,
      insightsUsed,
      coverageByType: {
        tone: insightsByType.tone.length,
        vocabulary: insightsByType.vocabulary.length,
        structure: insightsByType.structure.length,
        rhetoric: insightsByType.rhetoric.length,
        principle: insightsByType.principle.length,
      },
    }
  } catch (error) {
    console.error('Failed to synthesize style guide:', error)
    throw error
  }
}

/**
 * Build the insight context string for the AI prompt
 *
 * Formats insights with their confidence, examples, and metadata for the AI to use.
 * Provides rich context including emotional journeys, contrast pairs, coined terms, etc.
 */
function buildInsightContext(
  insightsByType: Record<VoiceInsightType, VoiceInsight[]>
): string {
  const sections: string[] = []

  // Helper to format a single insight with full metadata
  const formatInsight = (insight: VoiceInsight): string => {
    const confidenceLabel = insight.confidence >= 0.8 ? 'HIGH' : insight.confidence >= 0.6 ? 'MEDIUM' : 'LOW'
    let formatted = `- [${confidenceLabel} confidence: ${insight.confidence}, Validated in ${insight.sample_count} sample(s)]`
    formatted += `\n  **Insight**: ${insight.content}`

    // Add examples if present
    if (insight.examples && insight.examples.length > 0) {
      const examples = insight.examples
        .slice(0, 5)
        .map((e) => `"${e}"`)
        .join('\n    - ')
      formatted += `\n  **Examples**:\n    - ${examples}`
    }

    // Add any relevant metadata
    if (insight.metadata && Object.keys(insight.metadata).length > 0) {
      const meta = insight.metadata as Record<string, unknown>
      if (meta.subtype) {
        formatted += `\n  **Subtype**: ${meta.subtype}`
      }
      if (meta.emotional_journey) {
        formatted += `\n  **Emotional Journey**: ${meta.emotional_journey}`
      }
      if (meta.metaphor_mapping) {
        formatted += `\n  **Metaphor Mapping**: ${meta.metaphor_mapping}`
      }
      if (meta.contrast_pairs) {
        formatted += `\n  **Contrast Pairs**: ${meta.contrast_pairs}`
      }
      if (meta.coined_meaning) {
        formatted += `\n  **Coined Term Meaning**: ${meta.coined_meaning}`
      }
    }

    return formatted
  }

  // Tone insights - voice characteristics, emotional register, reader relationship
  if (insightsByType.tone.length > 0) {
    sections.push(`### TONE INSIGHTS
**What to look for**: Voice characteristics, emotional register, reader relationship, emotional journeys, formality level, anti-patterns

${insightsByType.tone.map(formatInsight).join('\n\n')}`)
  }

  // Vocabulary insights - word choice, coined terms, contrast pairs
  if (insightsByType.vocabulary.length > 0) {
    sections.push(`### VOCABULARY INSIGHTS
**What to look for**: Word choice patterns, coined/adapted terms with meanings, contrast pairs (X/Y), domain jargon, action verbs, avoided words

${insightsByType.vocabulary.map(formatInsight).join('\n\n')}`)
  }

  // Structure insights - document arc, sentence patterns, rhythm
  if (insightsByType.structure.length > 0) {
    sections.push(`### STRUCTURE INSIGHTS
**What to look for**: Document arc (step-by-step flow), section structure, sentence patterns, paragraph rhythm, white space philosophy, opening/closing patterns

${insightsByType.structure.map(formatInsight).join('\n\n')}`)
  }

  // Rhetoric insights - named techniques, frameworks, metaphors
  if (insightsByType.rhetoric.length > 0) {
    sections.push(`### RHETORIC INSIGHTS
**What to look for**: Named techniques (give them names!), B2B frameworks (PAS, AIDA, etc.), extended metaphors with mappings, persuasion patterns, binary framing

${insightsByType.rhetoric.map(formatInsight).join('\n\n')}`)
  }

  // Principle insights - core rules, transformations, always/never
  if (insightsByType.principle.length > 0) {
    sections.push(`### PRINCIPLE INSIGHTS
**What to look for**: Core rules (ALWAYS/NEVER), weak→strong transformations, authenticity markers, what makes this distinctive, anti-patterns

${insightsByType.principle.map(formatInsight).join('\n\n')}`)
  }

  // Add a synthesis guidance section
  sections.push(`### SYNTHESIS GUIDANCE
When creating the style guide:
1. Name distinctive techniques (e.g., "The sobering pivot", "The empowering close")
2. Identify emotional journeys explicitly (X → Y → Z format)
3. Extract contrast pairs if vocabulary insights mention them
4. Create specific Generic → This Style transformations using real examples
5. Be explicit about anti-patterns - what this style is NOT is as important as what it IS
6. Weight HIGH confidence insights more heavily`)

  return sections.join('\n\n---\n\n')
}

/**
 * Quick synthesis for preview (lighter-weight)
 *
 * Generates a shorter summary version of the style guide
 * for preview purposes before full synthesis. Captures the
 * essence including emotional texture and key techniques.
 *
 * @param voiceProfileId - The profile to synthesize from
 * @param profileName - Name for the preview
 * @returns A condensed style summary with distinctive elements
 */
export async function synthesizeStylePreview(
  voiceProfileId: string,
  profileName: string
): Promise<string> {
  const insightsByType = await getInsightsForSynthesis(voiceProfileId)

  // Get top insights from each type, prioritizing high-confidence
  const topInsights = [
    ...insightsByType.tone.slice(0, 3),
    ...insightsByType.vocabulary.slice(0, 3),
    ...insightsByType.structure.slice(0, 2),
    ...insightsByType.rhetoric.slice(0, 3),
    ...insightsByType.principle.slice(0, 3),
  ]

  if (topInsights.length === 0) {
    return 'No insights extracted yet. Add writing samples to train this profile.'
  }

  const prompt = `Based on these voice insights for "${profileName}", write a compelling 4-5 sentence preview that captures:
1. The core philosophy/stance of this voice
2. The emotional texture or journey it creates
3. One or two signature techniques
4. What makes it distinctive from typical corporate writing

INSIGHTS:
${topInsights.map((i) => `- [${i.insight_type}] ${i.content}`).join('\n')}

Be specific, not generic. Name techniques if they're distinctive. Return only the preview paragraph.`

  try {
    const preview = await callGemini(prompt, 'flash', true)
    return preview.trim()
  } catch (error) {
    console.error('Failed to synthesize preview:', error)
    return 'Unable to generate preview. Try again later.'
  }
}

/**
 * Compare two style guide versions
 *
 * Generates a summary of changes between versions.
 *
 * @param oldGuide - Previous style guide content
 * @param newGuide - New style guide content
 * @returns Summary of key changes
 */
export async function compareStyleGuideVersions(
  oldGuide: string,
  newGuide: string
): Promise<string> {
  const prompt = `Compare these two versions of a style guide and summarize the key changes in 3-5 bullet points.

## PREVIOUS VERSION:
${oldGuide.substring(0, 3000)}

## NEW VERSION:
${newGuide.substring(0, 3000)}

Focus on substantive changes in:
- Core principles
- Tone adjustments
- New patterns or removed patterns
- Vocabulary changes

Return only the bullet points, no introduction.`

  try {
    const comparison = await callGemini(prompt, 'flash', true)
    return comparison.trim()
  } catch (error) {
    console.error('Failed to compare style guide versions:', error)
    return 'Unable to compare versions.'
  }
}

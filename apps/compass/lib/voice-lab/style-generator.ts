/**
 * Voice Lab - Style Generator
 *
 * AI agent that analyzes writing samples and generates comprehensive
 * style guides as natural language markdown.
 *
 * Uses Gemini Pro for advanced analysis of writing patterns.
 */

import { callGemini } from '@/lib/ai-editor/gemini'

/**
 * Generate a comprehensive style guide from writing samples
 *
 * The AI analyzes the samples and produces a markdown style guide covering:
 * 1. Core philosophy and purpose
 * 2. Key principles
 * 3. Document architecture patterns
 * 4. Tone calibration
 * 5. Rhetorical strategies
 * 6. Sentence-level style
 * 7. Vocabulary patterns
 * 8. Transformations (before/after examples)
 * 9. Application guide
 *
 * @param samples - Array of writing samples to analyze
 * @param name - Name for the style (used in the guide header)
 * @returns Generated style guide as markdown
 */
export async function generateStyleGuide(
  samples: string[],
  name: string
): Promise<string> {
  if (!samples || samples.length === 0) {
    throw new Error('At least one writing sample is required')
  }

  // Combine samples with clear separators
  const combinedSamples = samples
    .map((sample, i) => `--- SAMPLE ${i + 1} ---\n${sample}`)
    .join('\n\n')

  const prompt = `You are an expert writing coach and style analyst. Your task is to analyze the following writing samples and create a comprehensive style guide that captures the unique voice, patterns, and techniques used.

## WRITING SAMPLES TO ANALYZE:

${combinedSamples}

---

## YOUR TASK:

Create a detailed, actionable style guide in markdown format called "${name}". This guide should enable any writer to accurately replicate this writing style.

Structure your style guide with these sections:

## 1. What It Is
- 2-3 sentences capturing the core philosophy and purpose of this style
- What makes it distinctive?
- What belief or contract with the reader does it embody?

## 2. Core Principles
- 5-7 key rules that define this style
- Each principle should have a clear "weak vs strong" example transformation
- What does this style always do? What does it never do?

## 3. Document Architecture
- How are documents/pieces typically structured?
- What's the narrative arc?
- How do sections flow?
- What patterns appear in openings, middles, and closings?

## 4. Tone Calibration
### What It Sounds Like
- Key characteristics with descriptions
- What emotional journey does the reader experience?

### What It Is NOT
- Common mistakes to avoid
- What this style explicitly rejects

## 5. Rhetorical Strategies
- Specific techniques used (e.g., extended metaphors, binary framing, rhetorical questions)
- How and when to deploy each strategy
- Examples from the samples

## 6. Sentence-Level Style
### Characteristics
- Sentence structure patterns
- Punctuation habits
- Voice (active/passive, first/third person)

### Avoid
- Patterns that contradict this style
- Why they fail

## 7. Vocabulary Patterns
### Preferred
- Types of words and phrases favored
- Action language patterns
- Any coined or adapted terms

### Avoid
- Words and phrases that don't fit
- Why they don't work

## 8. Transformations
- 4-6 before/after examples showing:
  - Generic/weak version
  - This style's version
- These should be practical, memorable transformations

## 9. Application Guide
### Best Used For
- Contexts where this style excels
- Why it works in those contexts

### Not Recommended For
- Contexts to avoid
- Why it doesn't fit

---

IMPORTANT:
- Be specific and actionable, not vague
- Use real examples from the samples where possible
- The guide should be immediately usable by another writer
- Format as clean, readable markdown
- Be thorough but not padded - every section should add value

Return ONLY the markdown style guide, nothing else.`

  // Use Gemini Pro for more sophisticated analysis
  const styleGuide = await callGemini(prompt, 'pro', false)

  // Clean up the response - ensure it starts with a header
  let cleanedGuide = styleGuide.trim()

  // If it doesn't start with a markdown header, add one
  if (!cleanedGuide.startsWith('#')) {
    cleanedGuide = `# ${name}\n\n${cleanedGuide}`
  }

  return cleanedGuide
}

/**
 * Analyze a draft and extract style characteristics
 *
 * This is a lighter-weight analysis that extracts key patterns
 * from a single piece of writing, useful for quick profile generation.
 *
 * @param text - The text to analyze
 * @returns Summary of style characteristics
 */
export async function analyzeWritingStyle(text: string): Promise<{
  tone: string[]
  patterns: string[]
  vocabulary: string[]
  suggestions: string[]
}> {
  if (!text || text.trim().length < 50) {
    throw new Error('Text must be at least 50 characters')
  }

  const prompt = `Analyze the following writing sample and extract key style characteristics.

TEXT:
${text}

---

Return a JSON object with these arrays:
1. "tone" - 3-5 words describing the tone (e.g., "direct", "urgent", "warm")
2. "patterns" - 3-5 notable structural or rhetorical patterns (e.g., "Uses short sentences for emphasis")
3. "vocabulary" - 3-5 vocabulary preferences or patterns (e.g., "Favors action verbs")
4. "suggestions" - 2-3 suggestions for what would strengthen writing in this style

Return ONLY valid JSON, no other text.`

  const response = await callGemini(prompt, 'flash', true)

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const result = JSON.parse(jsonMatch[0])

    return {
      tone: result.tone || [],
      patterns: result.patterns || [],
      vocabulary: result.vocabulary || [],
      suggestions: result.suggestions || [],
    }
  } catch (error) {
    console.error('Failed to parse style analysis:', error)
    return {
      tone: [],
      patterns: [],
      vocabulary: [],
      suggestions: [],
    }
  }
}

/**
 * Build the voice profile context string to inject into prompts
 *
 * This transforms a style guide into context that gets injected
 * into the AI Editor prompt when a profile is selected.
 *
 * @param styleGuide - The markdown style guide
 * @param profileName - Name of the voice profile
 * @returns Formatted context string for prompt injection
 */
export function buildVoiceProfileContext(
  styleGuide: string,
  profileName: string
): string {
  if (!styleGuide || styleGuide.trim().length === 0) {
    return ''
  }

  return `
---
## VOICE PROFILE: "${profileName}"

${styleGuide}

---
APPLY THIS VOICE PROFILE TO YOUR EDITORIAL FEEDBACK:
- Evaluate the draft against the principles and patterns in this style guide
- Point out where the draft aligns with or diverges from this voice
- Suggest specific improvements that would bring the writing closer to this style
- Use the vocabulary and transformation patterns from the guide in your suggestions
---

`
}

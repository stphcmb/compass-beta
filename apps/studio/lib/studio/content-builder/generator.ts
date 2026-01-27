/**
 * Content Builder - Generator
 *
 * Voice-constrained content generation from briefs.
 * Uses Gemini Pro for high-quality content generation.
 */

import { callGemini } from '@compass/ai'
import { getVoiceProfile } from '@/lib/voice-lab-client'
import { BriefInput, ContentFormat, ContentDomain } from '../types'

/**
 * Format-specific guidelines for content generation
 */
const FORMAT_GUIDELINES: Record<ContentFormat, string> = {
  blog: `Structure as a blog post:
- Compelling headline that promises value
- Opening hook that draws readers in (2-3 sentences)
- Clear thesis statement
- 3-5 main sections with subheadings
- Supporting evidence or examples in each section
- Strong conclusion with call to action
- Target length: 800-1200 words`,

  linkedin: `Structure as a LinkedIn post:
- Hook in the first line (this shows in preview)
- Short, punchy paragraphs (1-3 sentences each)
- Use line breaks for readability
- Include a personal angle or insight
- End with engagement prompt or question
- Target length: 150-300 words`,

  memo: `Structure as an internal memo:
- Clear subject line
- Brief context (1-2 sentences)
- Key points in bullet format
- Implications or recommended actions
- Keep it concise and actionable
- Target length: 300-500 words`,

  byline: `Structure as a thought leadership byline/op-ed:
- Strong opening that establishes credibility
- Clear argument with supporting points
- Address potential counterarguments
- Expert perspective throughout
- Memorable closing that reinforces main thesis
- Target length: 600-900 words`,
}

/**
 * Domain-specific instructions for content generation
 */
const DOMAIN_INSTRUCTIONS: Record<ContentDomain, string> = {
  ai_discourse: `This is AI thought leadership content:
- Ground arguments in industry trends and developments
- Reference AI capabilities, limitations, and implications
- Consider ethical and societal dimensions
- Balance technical accuracy with accessibility
- Position ideas within broader AI discourse`,

  anduin_product: `This is Anduin product-focused content:
- Highlight specific product capabilities and benefits
- Connect features to customer outcomes
- Use concrete examples and use cases
- Maintain authoritative but approachable tone
- Focus on value proposition and differentiation`,

  hybrid: `This blends AI discourse with Anduin product focus:
- Connect broader AI trends to specific product capabilities
- Show how product addresses industry challenges
- Balance thought leadership with practical application
- Position Anduin within the AI landscape
- Make abstract concepts concrete through product examples`,
}

/**
 * Default style guide for when no voice profile is selected
 */
const DEFAULT_STYLE_GUIDE = `# Default Professional Style

## Voice Characteristics
- Clear, direct communication
- Professional but approachable tone
- Active voice preferred
- Confident assertions backed by reasoning

## Sentence Structure
- Vary sentence length for rhythm
- Lead with the main point
- Use transitions to connect ideas

## Word Choice
- Prefer concrete over abstract words
- Avoid jargon unless audience-appropriate
- Be specific and precise

## Overall Tone
- Authoritative but not condescending
- Engaging but not casual
- Thoughtful and well-reasoned`

/**
 * Generate voice-constrained content from a brief
 */
export async function generateContent(
  brief: BriefInput,
  voiceProfileId?: string | null
): Promise<{
  content: string
  wordCount: number
  voiceMatch: { score: number; notes: string[] }
}> {
  let styleGuide: string

  if (voiceProfileId) {
    // Fetch the voice profile
    const voiceProfile = await getVoiceProfile(voiceProfileId)
    if (!voiceProfile) {
      throw new Error('Voice profile not found')
    }

    if (!voiceProfile.style_guide) {
      throw new Error('Voice profile has no style guide')
    }
    styleGuide = voiceProfile.style_guide
  } else {
    // Use default style when no profile specified
    styleGuide = DEFAULT_STYLE_GUIDE
  }

  // Build the generation prompt
  const keyPointsList = brief.key_points
    .map((p, i) => `${i + 1}. ${p}`)
    .join('\n')

  const prompt = `You are an expert content writer. Generate high-quality content based on the following brief, strictly adhering to the voice profile provided.

## TASK
Generate a ${brief.format} for ${brief.audience}.

## TOPIC
${brief.title}

## KEY POINTS TO COVER
${keyPointsList}

${brief.additional_context ? `## ADDITIONAL CONTEXT\n${brief.additional_context}\n` : ''}

## VOICE PROFILE
${styleGuide}

## CONTENT DOMAIN
${DOMAIN_INSTRUCTIONS[brief.content_domain]}

## FORMAT GUIDELINES
${FORMAT_GUIDELINES[brief.format]}

## CRITICAL INSTRUCTIONS
1. VOICE FIRST: Every sentence must sound like it was written by someone with this voice profile. Prioritize voice consistency over everything else.
2. COVER ALL POINTS: Address every key point from the brief, but integrate them naturally.
3. NATURAL FLOW: The content should read smoothly, not like a checklist.
4. NO META-COMMENTARY: Don't explain what you're doing. Just write the content.
5. BE SPECIFIC: Use concrete examples, specific language. Avoid vague generalities.

## OUTPUT
Write the full ${brief.format}. Return ONLY the content itself - no preamble, no "Here's your blog post:", no explanations. Just the finished piece.`

  // Generate the content
  const content = await callGemini(prompt, 'pro', false)

  // Clean up the content
  const cleanedContent = content.trim()

  // Calculate word count
  const wordCount = cleanedContent.split(/\s+/).filter(Boolean).length

  // Quick voice match assessment
  const voiceMatch = await assessVoiceMatch(cleanedContent, styleGuide)

  return {
    content: cleanedContent,
    wordCount,
    voiceMatch,
  }
}

/**
 * Quick assessment of how well content matches a voice profile
 */
async function assessVoiceMatch(
  content: string,
  styleGuide: string
): Promise<{ score: number; notes: string[] }> {
  // Use flash model for quick assessment
  const prompt = `You are evaluating how well a piece of writing matches a voice profile.

## VOICE PROFILE
${styleGuide.substring(0, 3000)}${styleGuide.length > 3000 ? '...' : ''}

## CONTENT TO EVALUATE
${content.substring(0, 2000)}${content.length > 2000 ? '...' : ''}

## TASK
Rate how well the content matches the voice profile on a scale of 0-100 and provide 2-3 brief notes about alignment or deviation.

Return ONLY valid JSON in this format:
{
  "score": 85,
  "notes": [
    "Strong use of direct, action-oriented language",
    "Could use more rhetorical questions as specified in profile",
    "Good adherence to sentence structure patterns"
  ]
}`

  try {
    const response = await callGemini(prompt, 'flash', false)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { score: 75, notes: ['Voice assessment unavailable'] }
    }
    const result = JSON.parse(jsonMatch[0])
    return {
      score: result.score || 75,
      notes: result.notes || [],
    }
  } catch (error) {
    console.error('Voice match assessment failed:', error)
    return { score: 75, notes: ['Voice assessment unavailable'] }
  }
}

/**
 * Regenerate content with specific feedback
 */
export async function regenerateContent(
  currentContent: string,
  feedback: string,
  brief: BriefInput,
  voiceProfileId?: string | null
): Promise<{
  content: string
  wordCount: number
  voiceMatch: { score: number; notes: string[] }
}> {
  let styleGuide: string

  if (voiceProfileId) {
    const voiceProfile = await getVoiceProfile(voiceProfileId)
    if (!voiceProfile || !voiceProfile.style_guide) {
      throw new Error('Voice profile not found or has no style guide')
    }
    styleGuide = voiceProfile.style_guide
  } else {
    styleGuide = DEFAULT_STYLE_GUIDE
  }

  const prompt = `You are revising content based on specific feedback. Maintain the voice profile while addressing the feedback.

## CURRENT CONTENT
${currentContent}

## FEEDBACK TO ADDRESS
${feedback}

## ORIGINAL BRIEF
Topic: ${brief.title}
Format: ${brief.format}
Audience: ${brief.audience}
Key Points: ${brief.key_points.join(', ')}

## VOICE PROFILE
${styleGuide}

## TASK
Revise the content to address the feedback while:
1. Maintaining strict adherence to the voice profile
2. Keeping the same format and approximate length
3. Preserving what's working well

Return ONLY the revised content - no explanations or meta-commentary.`

  const content = await callGemini(prompt, 'pro', false)
  const cleanedContent = content.trim()
  const wordCount = cleanedContent.split(/\s+/).filter(Boolean).length
  const voiceMatch = await assessVoiceMatch(cleanedContent, styleGuide)

  return {
    content: cleanedContent,
    wordCount,
    voiceMatch,
  }
}

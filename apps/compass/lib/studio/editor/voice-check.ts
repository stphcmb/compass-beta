/**
 * Studio Editor - Voice Check
 *
 * Analyzes content against a voice profile and provides
 * specific suggestions for improving voice consistency.
 */

import { callGemini } from '@/lib/ai-editor/gemini'
import { getVoiceProfile } from '@/lib/voice-lab'
import { VoiceCheckResult, VoiceSuggestion } from '../types'

/**
 * Check content against a voice profile
 *
 * @param content - The draft content to analyze
 * @param voiceProfileId - ID of the voice profile to check against
 * @returns Voice check result with score and suggestions
 */
export async function checkVoice(
  content: string,
  voiceProfileId: string
): Promise<VoiceCheckResult> {
  const voiceProfile = await getVoiceProfile(voiceProfileId)
  if (!voiceProfile) {
    throw new Error('Voice profile not found')
  }

  if (!voiceProfile.style_guide) {
    throw new Error('Voice profile has no style guide')
  }

  const prompt = `You are an expert editor analyzing whether a piece of writing matches a specific voice profile.

## VOICE PROFILE
${voiceProfile.style_guide}

## DRAFT TO ANALYZE
${content}

## TASK
Analyze how well this draft matches the voice profile. Identify specific deviations and provide actionable suggestions.

For each deviation:
1. Identify the exact location (e.g., "Paragraph 2, sentence 3" or quote the specific phrase)
2. Explain what's wrong (what voice characteristic is violated)
3. Show the original text
4. Provide a specific suggested revision

Return ONLY valid JSON in this format:
{
  "score": 85,
  "suggestions": [
    {
      "location": "Paragraph 2, sentence 1",
      "issue": "Uses passive voice, but profile calls for direct, active constructions",
      "original": "The decision was made by the team",
      "suggested": "The team made the decision"
    },
    {
      "location": "Opening paragraph",
      "issue": "Too cautious - profile emphasizes confident, declarative statements",
      "original": "It might be worth considering that AI could potentially...",
      "suggested": "AI will transform..."
    }
  ]
}

SCORING GUIDE:
- 90-100: Excellent match, minor tweaks only
- 75-89: Good match, a few adjustments needed
- 60-74: Fair match, notable deviations to address
- 40-59: Weak match, significant revision needed
- 0-39: Poor match, major voice misalignment

Provide 3-7 suggestions, focusing on the most impactful improvements.`

  try {
    const response = await callGemini(prompt, 'pro', false)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const result = JSON.parse(jsonMatch[0])

    const suggestions: VoiceSuggestion[] = (result.suggestions || []).map((s: {
      location?: string
      issue?: string
      original?: string
      suggested?: string
    }) => ({
      location: s.location || 'Unknown',
      issue: s.issue || 'Voice deviation detected',
      original: s.original || '',
      suggested: s.suggested || '',
    }))

    return {
      score: Math.min(100, Math.max(0, result.score || 75)),
      suggestions,
      checked_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Voice check failed:', error)
    return {
      score: 0,
      suggestions: [],
      checked_at: new Date().toISOString(),
    }
  }
}

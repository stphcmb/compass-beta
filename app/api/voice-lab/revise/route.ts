/**
 * Voice Lab - Revise Draft API
 *
 * POST /api/voice-lab/revise
 * Takes a draft and applies a voice profile to rewrite it in that style
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { callGemini } from '@/lib/ai-editor/gemini'
import { getVoiceProfile } from '@/lib/voice-lab'

interface ReviseRequest {
  draft: string
  profileId?: string
  styleGuide?: string
}

interface ReviseResponse {
  revisedText: string
}

interface ErrorResponse {
  error: string
  message?: string
}

/**
 * POST /api/voice-lab/revise
 * Revise a draft using a voice profile's style guide
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ReviseResponse | ErrorResponse>> {
  try {
    // Auth is optional for now
    try {
      await auth()
    } catch {
      // Continue without auth
    }

    const body: ReviseRequest = await request.json()

    // Validate input
    if (!body.draft || body.draft.trim().length === 0) {
      return NextResponse.json(
        { error: 'Draft text is required' },
        { status: 400 }
      )
    }

    // Get style guide - either from profileId or directly provided
    let styleGuide = body.styleGuide

    if (body.profileId && !styleGuide) {
      const profile = await getVoiceProfile(body.profileId)
      if (!profile) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        )
      }
      styleGuide = profile.style_guide || ''
    }

    if (!styleGuide || styleGuide.trim().length === 0) {
      return NextResponse.json(
        { error: 'No style guide available. Please provide a profileId or styleGuide.' },
        { status: 400 }
      )
    }

    // Truncate draft if too long
    const maxDraftLength = 6000
    const truncatedDraft =
      body.draft.length > maxDraftLength
        ? body.draft.substring(0, maxDraftLength) + '...'
        : body.draft

    // Build the revision prompt
    const prompt = `You are an expert writing coach. Your task is to revise the following draft to match a specific writing style.

## STYLE GUIDE TO APPLY:

${styleGuide}

---

## ORIGINAL DRAFT TO REVISE:

${truncatedDraft}

---

## YOUR TASK:

Rewrite the draft above to match the voice, tone, and style described in the style guide.

Key instructions:
1. Preserve the CORE MESSAGE and main points of the original draft
2. Transform the STYLE to match the guide's:
   - Tone and voice characteristics
   - Sentence structure patterns
   - Vocabulary preferences
   - Rhetorical strategies
   - Document architecture (if applicable)
3. Apply specific techniques from the style guide
4. Make it sound natural, not forced
5. Keep approximately the same length (can be slightly shorter or longer)

Return ONLY the revised text, nothing else. No explanations, no preamble, no "Here's the revised version:" - just the revised draft itself.`

    // Call Gemini to revise
    const revisedText = await callGemini(prompt, 'pro', false)

    return NextResponse.json({ revisedText: revisedText.trim() })
  } catch (error) {
    console.error('Voice Lab revise error:', error)
    return NextResponse.json(
      {
        error: 'Failed to revise draft',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

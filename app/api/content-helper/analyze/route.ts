/**
 * Content Helper - Analyze API
 *
 * POST /api/content-helper/analyze
 * Analyzes draft content against an editorial profile
 */

import { NextResponse } from 'next/server';
import { analyzeContent } from '@/features/content-helper/lib/analyze';
import { fetchProfile, profileExists } from '@/features/content-helper/adapters/profile-adapter';
import type { AnalyzeRequest, AnalyzeResponse } from '@/features/content-helper/lib/types';

// Feature flag check (will be properly implemented)
const isFeatureEnabled = () => {
  return process.env.NEXT_PUBLIC_FF_CONTENT_HELPER === 'true' ||
    process.env.NODE_ENV === 'development';
};

export async function POST(request: Request) {
  // Check feature flag
  if (!isFeatureEnabled()) {
    return NextResponse.json(
      { success: false, error: 'Content Helper is not enabled' },
      { status: 403 }
    );
  }

  try {
    const body: AnalyzeRequest = await request.json();

    // Validate request
    if (!body.draft || typeof body.draft !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid draft content' },
        { status: 400 }
      );
    }

    if (!body.profileId || typeof body.profileId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid profileId' },
        { status: 400 }
      );
    }

    // Check if profile exists
    if (!profileExists(body.profileId)) {
      return NextResponse.json(
        { success: false, error: `Profile not found: ${body.profileId}` },
        { status: 404 }
      );
    }

    // Validate draft length
    if (body.draft.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: 'Draft must be at least 50 characters' },
        { status: 400 }
      );
    }

    // Fetch profile and run analysis
    const profile = await fetchProfile(body.profileId);
    const result = analyzeContent(body.draft, profile);

    const response: AnalyzeResponse = {
      success: true,
      result
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Content Helper] Analysis error:', error);

    const message = error instanceof Error ? error.message : 'Analysis failed';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// Reject other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}

/**
 * Content Helper - Health Check API
 *
 * GET /api/content-helper/health
 * Returns health status of the Content Helper feature
 */

import { NextResponse } from 'next/server';
import { getAvailableProfiles } from '@/features/content-helper/adapters/profile-adapter';

export async function GET() {
  const isEnabled = process.env.NEXT_PUBLIC_FF_CONTENT_HELPER === 'true' ||
    process.env.NODE_ENV === 'development';

  return NextResponse.json({
    status: 'ok',
    enabled: isEnabled,
    profiles: getAvailableProfiles(),
    timestamp: new Date().toISOString()
  });
}

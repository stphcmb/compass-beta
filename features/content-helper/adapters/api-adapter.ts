/**
 * API Adapter
 * Handles API calls for content analysis
 *
 * This adapter wraps fetch calls and can be swapped
 * for different implementations (e.g., direct function calls in SSR)
 */

import type { AnalysisResult, AnalyzeRequest, AnalyzeResponse } from '../lib/types';

const API_BASE = '/api/content-helper';

/**
 * Custom error for API failures
 */
export class ContentHelperAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ContentHelperAPIError';
  }
}

/**
 * Analyze draft content via API
 *
 * @param draft - The draft text to analyze
 * @param profileId - The profile ID to analyze against
 * @returns Analysis result
 */
export async function analyzeViaAPI(
  draft: string,
  profileId: string
): Promise<AnalysisResult> {
  const request: AnalyzeRequest = { draft, profileId };

  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ContentHelperAPIError(
      errorData.error || `API error: ${response.status}`,
      response.status,
      errorData.code
    );
  }

  const data: AnalyzeResponse = await response.json();

  if (!data.success || !data.result) {
    throw new ContentHelperAPIError(
      data.error || 'Analysis failed',
      undefined,
      'ANALYSIS_FAILED'
    );
  }

  return data.result;
}

/**
 * Check if Content Helper API is available
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

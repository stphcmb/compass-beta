'use client';

/**
 * useContentAnalysis Hook
 * Main hook for performing content analysis
 */

import { useState, useCallback, useRef } from 'react';
import type { AnalysisResult, EditorialProfile } from '../lib/types';
import { analyzeContent } from '../lib/analyze';
import { fetchProfile } from '../adapters/profile-adapter';

export interface UseContentAnalysisOptions {
  /** Profile ID to analyze against */
  profileId: string;
  /** Callback when analysis completes */
  onAnalysisComplete?: (result: AnalysisResult) => void;
  /** Callback when error occurs */
  onError?: (error: Error) => void;
  /** Minimum characters before analysis is allowed */
  minCharacters?: number;
}

export interface UseContentAnalysisReturn {
  /** Current analysis result */
  result: AnalysisResult | null;
  /** Whether analysis is in progress */
  loading: boolean;
  /** Current error if any */
  error: Error | null;
  /** Loaded profile */
  profile: EditorialProfile | null;
  /** Trigger analysis on draft content */
  analyze: (draft: string) => Promise<AnalysisResult | null>;
  /** Reset analysis state */
  reset: () => void;
  /** Whether the draft meets minimum requirements */
  canAnalyze: (draft: string) => boolean;
}

/**
 * Hook for performing content analysis
 *
 * @example
 * ```tsx
 * const { result, loading, analyze } = useContentAnalysis({
 *   profileId: 'alin',
 *   onError: (e) => console.error(e)
 * });
 *
 * const handleAnalyze = () => {
 *   analyze(draftContent);
 * };
 * ```
 */
export function useContentAnalysis({
  profileId,
  onAnalysisComplete,
  onError,
  minCharacters = 50
}: UseContentAnalysisOptions): UseContentAnalysisReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<EditorialProfile | null>(null);

  // Track if component is mounted to avoid state updates after unmount
  const mountedRef = useRef(true);

  // Cache profile to avoid refetching
  const profileRef = useRef<EditorialProfile | null>(null);

  const analyze = useCallback(async (draft: string): Promise<AnalysisResult | null> => {
    if (!draft || draft.trim().length < minCharacters) {
      const err = new Error(`Draft must be at least ${minCharacters} characters`);
      setError(err);
      onError?.(err);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch profile if not cached
      let currentProfile = profileRef.current;
      if (!currentProfile || currentProfile.user_id !== profileId) {
        currentProfile = await fetchProfile(profileId);
        profileRef.current = currentProfile;
        if (mountedRef.current) {
          setProfile(currentProfile);
        }
      }

      // Run analysis (pure function, runs synchronously)
      const analysisResult = analyzeContent(draft, currentProfile);

      if (mountedRef.current) {
        setResult(analysisResult);
        onAnalysisComplete?.(analysisResult);
      }

      return analysisResult;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Analysis failed');
      if (mountedRef.current) {
        setError(err);
      }
      onError?.(err);
      return null;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [profileId, minCharacters, onAnalysisComplete, onError]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  const canAnalyze = useCallback((draft: string): boolean => {
    return draft.trim().length >= minCharacters;
  }, [minCharacters]);

  // Cleanup on unmount
  // Note: Using ref instead of useEffect cleanup to handle async operations
  if (typeof window !== 'undefined') {
    // Only run cleanup logic in browser
    mountedRef.current = true;
  }

  return {
    result,
    loading,
    error,
    profile,
    analyze,
    reset,
    canAnalyze
  };
}

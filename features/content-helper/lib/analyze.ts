/**
 * Content Analysis Engine
 * Main analysis function that orchestrates all sub-analyses
 */

import type {
  AnalysisResult,
  EditorialProfile,
  DetectedCamp,
  MirrorReport,
  SkewReport,
  SignalReport,
  ThemeMatch
} from './types';
import { detectCamps, getCampConfidence } from './camp-detection';
import { calculateBrake } from './brake-logic';
import { THRESHOLDS } from '../constants/thresholds';

/**
 * Main analysis function
 *
 * @param draft - The draft text to analyze
 * @param profile - User's editorial profile
 * @returns Complete analysis result
 */
export function analyzeContent(
  draft: string,
  profile: EditorialProfile
): AnalysisResult {
  const detectedCamps = detectCamps(draft);
  const brake = calculateBrake(detectedCamps, profile, draft);
  const mirror = extractMirror(draft, profile);
  const skew = calculateSkew(detectedCamps, profile);
  const alignmentScore = calculateAlignment(detectedCamps, profile, mirror);

  // Signal strength is Phase 2 - return placeholder for now
  const signalStrength: SignalReport = {
    overall: 'unknown',
    by_camp: {},
    warnings: ['Signal strength analysis not yet available']
  };

  return {
    alignmentScore,
    brake,
    mirror,
    skew,
    signalStrength,
    detectedCamps,
    analyzedAt: new Date().toISOString()
  };
}

/**
 * Extract mirror report comparing stated themes vs actual content
 */
function extractMirror(draft: string, profile: EditorialProfile): MirrorReport {
  const lowerDraft = draft.toLowerCase();
  const statedThemes: { name: string; weight: number }[] = [];
  const actualThemes: ThemeMatch[] = [];
  const gaps: string[] = [];
  const surprises: string[] = [];

  // Analyze stated themes from profile
  for (const [themeName, keywords] of Object.entries(profile.theme_keywords)) {
    // Stated themes get weight from associated camp positions
    const weight = getThemeWeight(themeName, profile);
    statedThemes.push({ name: formatThemeName(themeName), weight });

    // Check actual mentions
    let mentions = 0;
    const excerpts: string[] = [];

    for (const keyword of keywords) {
      const regex = new RegExp(escapeRegex(keyword), 'gi');
      const matches = lowerDraft.match(regex);
      if (matches) {
        mentions += matches.length;
        // Could extract excerpts here if needed
      }
    }

    if (mentions > 0) {
      actualThemes.push({
        name: formatThemeName(themeName),
        mentions,
        excerpts
      });
    } else {
      // Theme is stated but not found
      gaps.push(formatThemeName(themeName));
    }
  }

  // Could detect "surprises" (themes in draft not in profile)
  // This would require a broader keyword analysis - Phase 2

  return {
    stated_themes: statedThemes,
    actual_themes: actualThemes,
    gaps,
    surprises
  };
}

/**
 * Calculate skew report
 */
function calculateSkew(
  detected: DetectedCamp[],
  profile: EditorialProfile
): SkewReport {
  const overrepresented: SkewReport['overrepresented'] = [];
  const underrepresented: SkewReport['underrepresented'] = [];
  const missing: string[] = [];

  // Normalize profile weights
  const totalProfileWeight = profile.camp_positions.reduce((sum, p) => sum + p.weight, 0);

  // Normalize detected confidence
  const totalDetectedConfidence = detected.reduce((sum, d) => sum + d.confidence, 0);

  for (const position of profile.camp_positions) {
    if (position.stance !== 'advocate' && position.stance !== 'partial') continue;

    const expected = totalProfileWeight > 0
      ? position.weight / totalProfileWeight
      : 0;

    const detectedCamp = detected.find(d => d.camp_id === position.camp_id);
    const actual = detectedCamp && totalDetectedConfidence > 0
      ? detectedCamp.confidence / totalDetectedConfidence
      : 0;

    const campName = detectedCamp?.camp_name ?? position.camp_id;

    if (actual === 0) {
      missing.push(campName);
    } else if (actual / expected > THRESHOLDS.SKEW_OVER_THRESHOLD) {
      overrepresented.push({
        camp_id: position.camp_id,
        camp_name: campName,
        expected,
        actual
      });
    } else if (actual / expected < THRESHOLDS.SKEW_UNDER_THRESHOLD) {
      underrepresented.push({
        camp_id: position.camp_id,
        camp_name: campName,
        expected,
        actual
      });
    }
  }

  return { overrepresented, underrepresented, missing };
}

/**
 * Calculate overall alignment score (0-100)
 */
function calculateAlignment(
  detected: DetectedCamp[],
  profile: EditorialProfile,
  mirror: MirrorReport
): number {
  if (detected.length === 0 && mirror.stated_themes.length === 0) {
    return 50; // Neutral score when no signal
  }

  let score = 100;

  // Camp alignment component
  const advocatedCampIds = profile.camp_positions
    .filter(p => p.stance === 'advocate' || p.stance === 'partial')
    .map(p => p.camp_id);

  const totalCampWeight = profile.camp_positions.reduce((sum, p) => sum + p.weight, 0);

  for (const camp of detected) {
    if (advocatedCampIds.includes(camp.camp_id)) {
      // Reward: advocated camp detected
      const position = profile.camp_positions.find(p => p.camp_id === camp.camp_id);
      const weightRatio = position ? position.weight / totalCampWeight : 0.1;
      // Small boost for aligned camps
      score += camp.confidence * weightRatio * 10;
    } else {
      // Penalty: off-profile camp detected
      score -= camp.confidence * THRESHOLDS.OFF_PROFILE_CAMP_PENALTY * 100;
    }
  }

  // Theme alignment component
  if (mirror.stated_themes.length > 0) {
    const themeMatchRatio = mirror.actual_themes.length / mirror.stated_themes.length;
    const themeFactor = themeMatchRatio * THRESHOLDS.ALIGNMENT_THEME_MATCH_WEIGHT * 100;

    // Blend with current score
    score = score * THRESHOLDS.ALIGNMENT_CAMP_MATCH_WEIGHT + themeFactor;
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Get weight for a theme based on associated camp positions
 */
function getThemeWeight(themeName: string, profile: EditorialProfile): number {
  // Default weight if can't determine from camps
  return 3;
}

/**
 * Format theme name for display
 */
function formatThemeName(themeName: string): string {
  return themeName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Escape regex special characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

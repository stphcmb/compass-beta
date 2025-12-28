/**
 * Brake Logic
 * Pure functions for calculating editorial brake triggers
 */

import type { BrakeReport, DetectedCamp, EditorialProfile } from './types';
import { getCampName } from '../constants/camp-keywords';
import { THRESHOLDS } from '../constants/thresholds';

/**
 * Check if a camp is in the user's advocated positions
 */
function isAdvocatedCamp(profile: EditorialProfile, campId: string): boolean {
  return profile.camp_positions.some(
    p => p.camp_id === campId && (p.stance === 'advocate' || p.stance === 'partial')
  );
}

/**
 * Get all advocated camp IDs from profile
 */
function getAdvocatedCampIds(profile: EditorialProfile): string[] {
  return profile.camp_positions
    .filter(p => p.stance === 'advocate' || p.stance === 'partial')
    .map(p => p.camp_id);
}

/**
 * Check which themes from profile are mentioned in draft
 */
function findMentionedThemes(draft: string, profile: EditorialProfile): string[] {
  const mentioned: string[] = [];
  const lowerDraft = draft.toLowerCase();

  for (const [themeName, keywords] of Object.entries(profile.theme_keywords)) {
    const hasMatch = keywords.some(kw => lowerDraft.includes(kw.toLowerCase()));
    if (hasMatch) {
      mentioned.push(themeName);
    }
  }

  return mentioned;
}

/**
 * Calculate brake report
 *
 * Triggers brake when:
 * 1. Dominant camp is not in user's positions (warning)
 * 2. Too many of user's core themes are missing (stop)
 *
 * @param detected - Camps detected in the draft
 * @param profile - User's editorial profile
 * @param draft - The draft text
 * @returns BrakeReport or null if no brake triggered
 */
export function calculateBrake(
  detected: DetectedCamp[],
  profile: EditorialProfile,
  draft: string
): BrakeReport | null {
  // Need minimum camps in profile to trigger brake
  if (profile.camp_positions.length < THRESHOLDS.MIN_PROFILE_CAMPS_FOR_BRAKE) {
    return null;
  }

  const advocatedCampIds = getAdvocatedCampIds(profile);

  // Check 1: Dominant camp not in profile
  if (detected.length > 0) {
    const topCamp = detected[0];

    if (
      topCamp.confidence >= THRESHOLDS.BRAKE_DOMINANT_CAMP_CONFIDENCE &&
      !isAdvocatedCamp(profile, topCamp.camp_id)
    ) {
      return {
        triggered: true,
        severity: 'warning',
        reason: `Heavy lean toward "${topCamp.camp_name}" which isn't in your stated positions. Consider whether this reflects your intended narrative.`,
        dominant_camps: [topCamp.camp_id],
        missing_themes: []
      };
    }
  }

  // Check 2: Critical themes missing
  const themeNames = Object.keys(profile.theme_keywords);
  if (themeNames.length > 0) {
    const mentionedThemes = findMentionedThemes(draft, profile);
    const missingThemes = themeNames.filter(t => !mentionedThemes.includes(t));

    const missingRatio = missingThemes.length / themeNames.length;

    if (missingRatio >= THRESHOLDS.BRAKE_MISSING_THEMES_RATIO) {
      return {
        triggered: true,
        severity: 'stop',
        reason: `Missing ${missingThemes.length} of your ${themeNames.length} core themes. This draft may not represent your stated point of view.`,
        dominant_camps: [],
        missing_themes: missingThemes.map(formatThemeName)
      };
    }
  }

  // Check 3: Advocated camps completely absent while off-profile camps dominate
  if (detected.length > 0 && advocatedCampIds.length > 0) {
    const detectedCampIds = detected.map(d => d.camp_id);
    const advocatedInDraft = advocatedCampIds.filter(id => detectedCampIds.includes(id));

    // All detected camps are off-profile
    if (advocatedInDraft.length === 0) {
      const offProfileCamps = detected
        .filter(d => !isAdvocatedCamp(profile, d.camp_id))
        .slice(0, 3);

      if (offProfileCamps.length >= 2) {
        return {
          triggered: true,
          severity: 'warning',
          reason: `Draft focuses on camps outside your stated positions (${offProfileCamps.map(c => c.camp_name).join(', ')}). None of your advocated perspectives appear.`,
          dominant_camps: offProfileCamps.map(c => c.camp_id),
          missing_themes: []
        };
      }
    }
  }

  return null;
}

/**
 * Format theme name for display (snake_case → Title Case)
 */
function formatThemeName(themeName: string): string {
  return themeName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get brake severity level
 */
export function getBrakeSeverityLevel(brake: BrakeReport | null): 'none' | 'warning' | 'stop' {
  if (!brake || !brake.triggered) return 'none';
  return brake.severity;
}

/**
 * Check if content should be held (stop-level brake)
 */
export function shouldHoldContent(brake: BrakeReport | null): boolean {
  return brake?.triggered === true && brake.severity === 'stop';
}

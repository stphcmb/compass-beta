/**
 * Feature Flags
 *
 * Centralized feature flag management.
 * Flags are controlled via environment variables.
 */

export const FEATURES = {
  /**
   * Content Helper (Editorial Analysis Mode)
   * Toggle for the content analysis feature
   *
   * Environment variable: NEXT_PUBLIC_FF_CONTENT_HELPER
   */
  CONTENT_HELPER: process.env.NEXT_PUBLIC_FF_CONTENT_HELPER === 'true',

  /**
   * ICP Studio (Integrated Content Platform)
   * Toggle for the new Studio workflow: Brief → Generate → Validate → Edit → Export
   * Part of Compass v1 / ICP rollout
   *
   * Environment variable: NEXT_PUBLIC_FF_ICP_STUDIO
   */
  ICP_STUDIO: process.env.NEXT_PUBLIC_FF_ICP_STUDIO === 'true',
} as const;

/**
 * Check if a feature is enabled
 *
 * @param feature - Feature key from FEATURES
 * @returns boolean indicating if feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature];
}

/**
 * Check if we're in development mode
 * Some features are auto-enabled in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if Content Helper should be available
 * Enabled by flag OR in development mode
 */
export function isContentHelperEnabled(): boolean {
  return FEATURES.CONTENT_HELPER || isDevelopment();
}

/**
 * Check if ICP Studio should be available
 * Enabled only by explicit flag (not auto-enabled in dev)
 * This allows controlled rollout in Phase 3
 */
export function isICPStudioEnabled(): boolean {
  return FEATURES.ICP_STUDIO;
}

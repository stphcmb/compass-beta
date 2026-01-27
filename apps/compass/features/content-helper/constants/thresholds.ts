/**
 * Content Helper Thresholds
 * Configurable thresholds for analysis calculations
 */

export const THRESHOLDS = {
  /**
   * Camp Detection
   */
  // Minimum keyword matches needed for camp detection
  MIN_KEYWORD_MATCHES: 1,

  // Keyword matches needed for high confidence (1.0)
  HIGH_CONFIDENCE_MATCHES: 3,

  // Minimum confidence to include in results
  MIN_CONFIDENCE_THRESHOLD: 0.3,

  /**
   * Brake Triggers
   */
  // Confidence threshold for triggering dominant camp warning
  BRAKE_DOMINANT_CAMP_CONFIDENCE: 0.7,

  // Percentage of missing themes to trigger stop (e.g., 0.6 = 60% missing)
  BRAKE_MISSING_THEMES_RATIO: 0.6,

  // Minimum camps in profile before brake can trigger
  MIN_PROFILE_CAMPS_FOR_BRAKE: 2,

  /**
   * Alignment Score
   */
  // Weight factors for alignment calculation
  ALIGNMENT_CAMP_MATCH_WEIGHT: 0.6,
  ALIGNMENT_THEME_MATCH_WEIGHT: 0.4,

  // Penalty for off-profile camp mentions
  OFF_PROFILE_CAMP_PENALTY: 0.15,

  /**
   * Skew Calculation
   */
  // Threshold for considering a camp overrepresented (ratio vs expected)
  SKEW_OVER_THRESHOLD: 1.5,

  // Threshold for considering a camp underrepresented
  SKEW_UNDER_THRESHOLD: 0.5,

  /**
   * Signal Strength
   */
  // Author count thresholds for signal strength
  SIGNAL_STRONG_MIN_AUTHORS: 8,
  SIGNAL_MODERATE_MIN_AUTHORS: 4,
  // Below moderate = thin

  /**
   * Text Processing
   */
  // Maximum excerpt length to store
  MAX_EXCERPT_LENGTH: 200,

  // Words around keyword to capture as excerpt
  EXCERPT_CONTEXT_WORDS: 10,
} as const;

export type ThresholdKey = keyof typeof THRESHOLDS;

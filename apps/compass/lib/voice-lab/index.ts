/**
 * Voice Lab Module
 *
 * Build a library of voice profiles - writing styles stored as
 * natural language markdown style guides.
 *
 * Two independent actions (both optional):
 * - CREATE profile: Capture a writing style from samples
 * - APPLY profile: Get feedback in a specific style
 *
 * Now with continuous training support:
 * - Add samples over time to improve profile accuracy
 * - Extract insights from each sample
 * - Synthesize style guide from accumulated insights
 *
 * Main exports:
 * - Profile store functions (CRUD)
 * - Sample store functions (CRUD)
 * - Insight store functions (CRUD + merge)
 * - Style generator (AI analysis)
 * - Insight extractor (AI extraction)
 * - Style synthesizer (AI synthesis)
 * - Context builder (for prompt injection)
 */

// Types
export type {
  VoiceProfile,
  VoiceTrainingStatus,
  CreateVoiceProfileInput,
  UpdateVoiceProfileInput,
  GenerateStyleGuideRequest,
  GenerateStyleGuideResponse,
  CreateProfileRequest,
  UpdateProfileRequest,
  ListProfilesResponse,
  ProfileResponse,
  ErrorResponse,
  // Voice Sample types
  VoiceSample,
  VoiceSampleSourceType,
  VoiceSampleCategory,
  CreateVoiceSampleInput,
  UpdateVoiceSampleInput,
  // Voice Insight types
  VoiceInsight,
  VoiceInsightType,
  CreateVoiceInsightInput,
  ExtractedInsight,
  // Training API types
  AddSamplesRequest,
  AddSamplesResponse,
  ListSamplesResponse,
  ListInsightsResponse,
  SynthesizeResponse,
  // Library types
  VoiceProfileFilters,
  CategoryStats,
  VoiceProfileWithStats,
} from './types'

// Profile Store (CRUD operations)
export {
  getVoiceProfiles,
  getVoiceProfile,
  getVoiceProfileBySlug,
  getActiveVoiceProfile,
  getVoiceProfileForUser,
  createVoiceProfile,
  updateVoiceProfile,
  setActiveVoiceProfile,
  deactivateAllVoiceProfiles,
  deleteVoiceProfile,
  deleteVoiceProfileForUser,
  getStyleGuideById,
  hasVoiceProfiles,
  getVoiceProfileCount,
  // Training status operations
  updateTrainingStatus,
  updateProfileCounts,
  incrementStyleGuideVersion,
  markProfileNeedsUpdate,
  // Label operations
  getVoiceProfilesFiltered,
  getProfileLabels,
  addLabelsToProfile,
  removeLabelFromProfile,
  getProfileCountsByStatus,
} from './profile-store'

// Sample Store (CRUD operations)
export {
  getVoiceSamples,
  getVoiceSample,
  getUnprocessedSamples,
  getSampleCount,
  getTotalWordCount,
  createVoiceSample,
  createVoiceSamples,
  markSampleProcessed,
  updateSampleQuality,
  deleteVoiceSample,
  deleteVoiceSampleForUser,
  deleteAllSamplesForProfile,
  getSampleStats,
  // Category operations
  updateVoiceSample,
  getSamplesByCategory,
  getCategoryStats,
  getInsightCountForSample,
} from './sample-store'

// Insight Store (CRUD + merge operations)
export {
  getVoiceInsights,
  getVoiceInsightsByType,
  getInsightsForSample,
  getInsightCount,
  getInsightCountsByType,
  getTopInsights,
  createVoiceInsight,
  updateVoiceInsight,
  deleteVoiceInsight,
  deleteInsightsForSample,
  deleteAllInsightsForProfile,
  mergeInsights,
  recalculateInsightConfidence,
  getInsightStats,
  getInsightsForSynthesis,
} from './insight-store'

// Style Generator (AI analysis - legacy)
export {
  generateStyleGuide,
  analyzeWritingStyle,
  buildVoiceProfileContext,
} from './style-generator'

// Insight Extractor (AI extraction)
export {
  extractInsightsFromSample,
  extractInsightsFromSamples,
  assessSampleQuality,
  normalizeInsightContent,
  areInsightsSimilar,
} from './insight-extractor'
export type { ExtractionResult } from './insight-extractor'

// Style Synthesizer (AI synthesis from insights)
export {
  synthesizeStyleGuide,
  synthesizeStylePreview,
  compareStyleGuideVersions,
} from './style-synthesizer'
export type { SynthesisResult } from './style-synthesizer'

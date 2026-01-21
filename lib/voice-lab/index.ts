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
 * Main exports:
 * - Profile store functions (CRUD)
 * - Style generator (AI analysis)
 * - Context builder (for prompt injection)
 */

// Types
export type {
  VoiceProfile,
  CreateVoiceProfileInput,
  UpdateVoiceProfileInput,
  GenerateStyleGuideRequest,
  GenerateStyleGuideResponse,
  CreateProfileRequest,
  UpdateProfileRequest,
  ListProfilesResponse,
  ProfileResponse,
  ErrorResponse,
} from './types'

// Profile Store (CRUD operations)
export {
  getVoiceProfiles,
  getVoiceProfile,
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
} from './profile-store'

// Style Generator (AI analysis)
export {
  generateStyleGuide,
  analyzeWritingStyle,
  buildVoiceProfileContext,
} from './style-generator'

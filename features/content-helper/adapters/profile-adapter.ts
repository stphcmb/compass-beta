/**
 * Profile Adapter
 * Handles fetching and caching of editorial profiles
 *
 * For Phase 1 MVP, profiles are hardcoded.
 * Phase 2+ will fetch from database.
 */

import type { EditorialProfile } from '../lib/types';

/**
 * Hardcoded profiles for MVP
 * Based on Alin's manifesto analysis
 */
const PROFILES: Record<string, EditorialProfile> = {
  alin: {
    id: 'profile-alin-001',
    user_id: 'alin',
    display_name: 'Alin',
    manifesto_raw: `
      AI breaks down barriers to knowledge - "Breaking the Fourth Wall"
      AI's greatest value comes from augmenting workers, not replacing them
      Business transformation requires investing in people and processes
      Prefer "AI-native" over "AI-first" - people matter
      Workers should master AI to safeguard and accelerate careers
      Agentic AI allows every worker to become a manager of digital teams
    `,
    camp_positions: [
      // Primary positions (advocate)
      {
        camp_id: 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', // Human-AI Collaboration
        stance: 'advocate',
        weight: 5
      },
      {
        camp_id: 'f19021ab-a8db-4363-adec-c2228dad6298', // Co-Evolution
        stance: 'advocate',
        weight: 5
      },
      {
        camp_id: 'fe9464df-b778-44c9-9593-7fb3294fa6c3', // Business Whisperers
        stance: 'advocate',
        weight: 4
      },
      {
        camp_id: 'ee10cf4f-025a-47fc-be20-33d6756ec5cd', // Adaptive Governance
        stance: 'advocate',
        weight: 4
      },
      // Secondary positions (partial)
      {
        camp_id: '7f64838f-59a6-4c87-8373-a023b9f448cc', // Safety First
        stance: 'partial',
        weight: 3
      },
      {
        camp_id: '76f0d8c5-c9a8-4a26-ae7e-18f787000e18', // Displacement Realist
        stance: 'partial',
        weight: 3
      }
    ],
    theme_keywords: {
      augmentation_over_replacement: [
        'augment', 'augmentation', 'augmenting',
        'ironman suit', 'iron man',
        'empower', 'empowerment',
        'unlock potential', 'unlock human',
        'enhance', 'enhancement'
      ],
      people_and_processes: [
        'people', 'processes', 'people and processes',
        'transformation', 'organizational',
        'adapt', 'adaptation',
        'ai-native', 'ai native',
        'culture', 'cultural'
      ],
      agentic_workforce: [
        'agentic', 'agents', 'ai agents',
        'digital team', 'digital workforce',
        'manager of ai', 'managing ai',
        'autonomous', 'automation with oversight'
      ],
      breaking_fourth_wall: [
        'fourth wall', 'breaking the fourth wall',
        'gatekeepers', 'knowledge gatekeepers',
        'barriers', 'democratize knowledge',
        'enlightenment', 'new era'
      ],
      societal_risk: [
        'sycophantic', 'mental illness',
        'net negative', 'negative impact',
        'safeguards', 'guardrails',
        'social isolation', 'echo chambers',
        'responsible', 'ethical concerns'
      ]
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Development/testing profile
  dev: {
    id: 'profile-dev-001',
    user_id: 'dev',
    display_name: 'Development',
    camp_positions: [
      {
        camp_id: 'c5dcb027-cd27-4c91-adb4-aca780d15199', // Scaling Will Deliver
        stance: 'advocate',
        weight: 5
      },
      {
        camp_id: 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', // Human-AI Collaboration
        stance: 'advocate',
        weight: 4
      }
    ],
    theme_keywords: {
      test_theme: ['test', 'example', 'demo', 'sample'],
      scaling_theme: ['scaling', 'scale', 'compute', 'parameters']
    }
  }
};

/**
 * Profile cache for runtime
 */
const profileCache = new Map<string, EditorialProfile>();

/**
 * Fetch editorial profile by user ID
 *
 * @param profileId - User ID or profile ID
 * @returns Editorial profile
 * @throws Error if profile not found
 */
export async function fetchProfile(profileId: string): Promise<EditorialProfile> {
  // Check cache first
  if (profileCache.has(profileId)) {
    return profileCache.get(profileId)!;
  }

  // For MVP, use hardcoded profiles
  const profile = PROFILES[profileId];

  if (!profile) {
    throw new Error(`Editorial profile not found: ${profileId}`);
  }

  // Cache for future use
  profileCache.set(profileId, profile);

  return profile;
}

/**
 * Get all available profile IDs
 */
export function getAvailableProfiles(): string[] {
  return Object.keys(PROFILES);
}

/**
 * Check if a profile exists
 */
export function profileExists(profileId: string): boolean {
  return profileId in PROFILES;
}

/**
 * Clear profile cache (for testing)
 */
export function clearProfileCache(): void {
  profileCache.clear();
}

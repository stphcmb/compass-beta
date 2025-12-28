/**
 * Camp Keywords Mapping
 * Maps each camp to keywords for content detection
 *
 * Keywords are derived from:
 * 1. Camp descriptions
 * 2. Key author quotes
 * 3. Common terminology in the discourse
 */

import type { CampKeywordMap, CampInfo } from '../lib/types';

export const CAMP_KEYWORDS: CampKeywordMap = {
  // ============================================
  // Domain: AI Technical Capabilities
  // ============================================

  'c5dcb027-cd27-4c91-adb4-aca780d15199': {
    id: 'c5dcb027-cd27-4c91-adb4-aca780d15199',
    name: 'Scaling Will Deliver',
    domain: 'AI Technical Capabilities',
    keywords: [
      'scaling', 'scale', 'scaling laws', 'compute', 'parameters',
      'emergent', 'emergence', 'capabilities', 'frontier models',
      'gpt-5', 'gpt5', 'bigger models', 'more compute', 'more data',
      'training data', 'model size', 'transformer', 'attention',
      'foundation models', 'large language models', 'llm',
      'chinchilla', 'scaling hypothesis', 'bitter lesson',
      'agi', 'artificial general intelligence', 'superintelligence'
    ]
  },

  '207582eb-7b32-4951-9863-32fcf05944a1': {
    id: '207582eb-7b32-4951-9863-32fcf05944a1',
    name: 'Needs New Approaches',
    domain: 'AI Technical Capabilities',
    keywords: [
      'new approaches', 'novel architectures', 'beyond transformers',
      'world models', 'embodied', 'grounded', 'physical reality',
      'causal', 'reasoning', 'symbolic', 'neuro-symbolic',
      'limitations', 'plateau', 'diminishing returns',
      'understanding', 'comprehension', 'true intelligence',
      'consciousness', 'sentience', 'common sense',
      'yann lecun', 'world model', 'physics', 'reality modeling'
    ]
  },

  // ============================================
  // Domain: AI & Society
  // ============================================

  '7f64838f-59a6-4c87-8373-a023b9f448cc': {
    id: '7f64838f-59a6-4c87-8373-a023b9f448cc',
    name: 'Safety First',
    domain: 'AI & Society',
    keywords: [
      'safety', 'alignment', 'aligned', 'existential risk', 'x-risk',
      'pause', 'moratorium', 'slow down', 'catastrophic',
      'control problem', 'value alignment', 'corrigible',
      'interpretability', 'explainability', 'oversight',
      'guardrails', 'responsible ai', 'ethical ai',
      'ai safety', 'extinction', 'doom', 'dangerous',
      'rogue ai', 'misalignment', 'deceptive', 'deception'
    ]
  },

  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b': {
    id: 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b',
    name: 'Democratize Fast',
    domain: 'AI & Society',
    keywords: [
      'democratize', 'open source', 'open-source', 'opensource',
      'access', 'accessible', 'inclusive', 'inclusion',
      'empower', 'empowerment', 'unlock', 'enable',
      'innovation', 'accelerate', 'move fast', 'ship',
      'builders', 'hackers', 'developers', 'community',
      'decentralized', 'distributed', 'permissionless',
      'llama', 'mistral', 'hugging face', 'open weights'
    ]
  },

  // ============================================
  // Domain: Enterprise AI Adoption
  // ============================================

  '7e9a2196-71e7-423a-889c-6902bc678eac': {
    id: '7e9a2196-71e7-423a-889c-6902bc678eac',
    name: 'Technology Leads',
    domain: 'Enterprise AI Adoption',
    keywords: [
      'technology first', 'tech-led', 'automation',
      'efficiency', 'productivity', 'cost reduction',
      'replace', 'replacement', 'automate', 'automated',
      'roi', 'return on investment', 'bottom line',
      'digital transformation', 'modernization',
      'legacy systems', 'infrastructure', 'implementation',
      'deployment', 'rollout', 'enterprise software'
    ]
  },

  'f19021ab-a8db-4363-adec-c2228dad6298': {
    id: 'f19021ab-a8db-4363-adec-c2228dad6298',
    name: 'Co-Evolution',
    domain: 'Enterprise AI Adoption',
    keywords: [
      'co-evolution', 'coevolution', 'adaptive', 'iterative',
      'people and processes', 'organizational change',
      'change management', 'culture', 'cultural shift',
      'learning organization', 'continuous improvement',
      'human-centered', 'people-first', 'workforce',
      'upskilling', 'reskilling', 'training', 'education',
      'ai-native', 'transformation', 'evolve together'
    ]
  },

  'fe9464df-b778-44c9-9593-7fb3294fa6c3': {
    id: 'fe9464df-b778-44c9-9593-7fb3294fa6c3',
    name: 'Business Whisperers',
    domain: 'Enterprise AI Adoption',
    keywords: [
      'business whisperer', 'translator', 'bridge',
      'business context', 'domain expertise', 'industry knowledge',
      'use case', 'business problem', 'strategic',
      'executive', 'c-suite', 'leadership', 'stakeholder',
      'communication', 'narrative', 'storytelling',
      'consulting', 'advisory', 'guidance', 'coach'
    ]
  },

  'a076a4ce-f14c-47b5-ad01-c8c60135a494': {
    id: 'a076a4ce-f14c-47b5-ad01-c8c60135a494',
    name: 'Tech Builders',
    domain: 'Enterprise AI Adoption',
    keywords: [
      'builders', 'build', 'engineering', 'engineers',
      'technical', 'implementation', 'architecture',
      'infrastructure', 'platform', 'stack', 'tools',
      'code', 'coding', 'programming', 'development',
      'mlops', 'devops', 'pipeline', 'deployment',
      'scalable', 'robust', 'production', 'system design'
    ]
  },

  // ============================================
  // Domain: AI Governance & Oversight
  // ============================================

  '331b2b02-7f8d-4751-b583-16255a6feb50': {
    id: '331b2b02-7f8d-4751-b583-16255a6feb50',
    name: 'Innovation First',
    domain: 'AI Governance & Oversight',
    keywords: [
      'innovation', 'innovate', 'progress', 'advancement',
      'deregulate', 'deregulation', 'light touch',
      'permissionless', 'freedom', 'liberty',
      'competition', 'competitive', 'market',
      'entrepreneur', 'startup', 'venture',
      'regulatory capture', 'bureaucracy', 'red tape',
      'stifle', 'burden', 'overregulation'
    ]
  },

  'e8792297-e745-4c9f-a91d-4f87dd05cea2': {
    id: 'e8792297-e745-4c9f-a91d-4f87dd05cea2',
    name: 'Regulatory Interventionist',
    domain: 'AI Governance & Oversight',
    keywords: [
      'regulation', 'regulate', 'regulatory', 'legislation',
      'law', 'legal', 'policy', 'government',
      'oversight', 'accountability', 'compliance',
      'enforce', 'enforcement', 'mandate', 'require',
      'eu ai act', 'ai act', 'congress', 'parliament',
      'ban', 'prohibit', 'restrict', 'restriction',
      'audit', 'certification', 'licensing'
    ]
  },

  'ee10cf4f-025a-47fc-be20-33d6756ec5cd': {
    id: 'ee10cf4f-025a-47fc-be20-33d6756ec5cd',
    name: 'Adaptive Governance',
    domain: 'AI Governance & Oversight',
    keywords: [
      'adaptive', 'adaptive governance', 'flexible',
      'principles-based', 'outcome-based', 'risk-based',
      'proportionate', 'balanced', 'nuanced',
      'multi-stakeholder', 'collaboration', 'consensus',
      'sandbox', 'experimentation', 'pilot',
      'iterative', 'evolving', 'dynamic',
      'soft law', 'standards', 'best practices', 'guidelines'
    ]
  },

  // ============================================
  // Domain: Future of Work
  // ============================================

  '76f0d8c5-c9a8-4a26-ae7e-18f787000e18': {
    id: '76f0d8c5-c9a8-4a26-ae7e-18f787000e18',
    name: 'Displacement Realist',
    domain: 'Future of Work',
    keywords: [
      'displacement', 'displaced', 'job loss', 'unemployment',
      'automation', 'automate', 'replace', 'replacement',
      'obsolete', 'redundant', 'eliminated',
      'white collar', 'knowledge work', 'cognitive',
      'universal basic income', 'ubi', 'safety net',
      'inequality', 'wealth gap', 'concentration',
      'zombie jobs', 'disruption', 'structural change'
    ]
  },

  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371': {
    id: 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371',
    name: 'Human–AI Collaboration',
    domain: 'Future of Work',
    keywords: [
      'collaboration', 'collaborative', 'augment', 'augmentation',
      'human-ai', 'human-machine', 'centaur', 'cyborg',
      'copilot', 'co-pilot', 'assistant', 'aide',
      'enhance', 'enhancement', 'amplify', 'empower',
      'ironman suit', 'exoskeleton', 'tool', 'leverage',
      'partnership', 'teamwork', 'synergy',
      'hybrid', 'complementary', 'together'
    ]
  }
};

/**
 * Get camp info by ID
 */
export function getCampById(campId: string): CampInfo | undefined {
  return CAMP_KEYWORDS[campId];
}

/**
 * Get camp name by ID
 */
export function getCampName(campId: string): string {
  return CAMP_KEYWORDS[campId]?.name ?? 'Unknown Camp';
}

/**
 * Get all camps for a domain
 */
export function getCampsByDomain(domain: string): CampInfo[] {
  return Object.values(CAMP_KEYWORDS).filter(camp => camp.domain === domain);
}

/**
 * Get all camp IDs
 */
export function getAllCampIds(): string[] {
  return Object.keys(CAMP_KEYWORDS);
}

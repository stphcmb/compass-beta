/**
 * Content Helper - Type Definitions
 * All TypeScript interfaces for the editorial analysis feature
 */

// ============================================
// Editorial Profile Types
// ============================================

export type CampStance = 'advocate' | 'skeptic' | 'neutral' | 'partial';

export interface CampPosition {
  camp_id: string;
  stance: CampStance;
  weight: number; // 1-5, higher = more important to user
}

export interface ThemeKeywords {
  [themeName: string]: string[];
}

export interface EditorialProfile {
  id: string;
  user_id: string;
  display_name: string;
  manifesto_raw?: string;
  camp_positions: CampPosition[];
  theme_keywords: ThemeKeywords;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// Analysis Result Types
// ============================================

export interface DetectedCamp {
  camp_id: string;
  camp_name: string;
  confidence: number; // 0-1
  matched_keywords: string[];
  excerpts?: string[];
}

export interface BrakeReport {
  triggered: boolean;
  severity: 'warning' | 'stop';
  reason: string;
  dominant_camps: string[];
  missing_themes: string[];
}

export interface ThemeMatch {
  name: string;
  mentions: number;
  excerpts: string[];
}

export interface MirrorReport {
  stated_themes: { name: string; weight: number }[];
  actual_themes: ThemeMatch[];
  gaps: string[];      // Themes you claim but don't write about
  surprises: string[]; // Themes you write about but don't claim
}

export interface CampSkew {
  camp_id: string;
  camp_name: string;
  expected: number; // Based on profile weight
  actual: number;   // Based on detection
}

export interface SkewReport {
  overrepresented: CampSkew[];
  underrepresented: CampSkew[];
  missing: string[]; // Camp names with 0 coverage
}

export interface CampSignal {
  author_count: number;
  strength: 'strong' | 'moderate' | 'thin';
}

export interface SignalReport {
  overall: 'strong' | 'moderate' | 'thin' | 'unknown';
  by_camp: { [camp_id: string]: CampSignal };
  warnings: string[];
}

export interface AnalysisResult {
  alignmentScore: number | null; // 0-100, null if unable to calculate
  brake: BrakeReport | null;
  mirror: MirrorReport;
  skew: SkewReport;
  signalStrength: SignalReport;
  detectedCamps: DetectedCamp[];
  analyzedAt: string; // ISO timestamp
}

// ============================================
// API Types
// ============================================

export interface AnalyzeRequest {
  draft: string;
  profileId: string;
}

export interface AnalyzeResponse {
  success: boolean;
  result?: AnalysisResult;
  error?: string;
}

// ============================================
// Camp Reference Types
// ============================================

export interface CampInfo {
  id: string;
  name: string;
  domain: string;
  keywords: string[];
}

export interface CampKeywordMap {
  [campId: string]: CampInfo;
}

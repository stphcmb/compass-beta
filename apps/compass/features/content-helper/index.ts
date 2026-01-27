/**
 * Content Helper - Public API
 *
 * This is the ONLY entry point for using Content Helper.
 * All internal modules are accessed through this file.
 */

// ============================================
// Components
// ============================================
export { AnalysisPanel } from './components/AnalysisPanel';
export { AlignmentScore } from './components/AlignmentScore';
export { BrakeCard } from './components/BrakeCard';
export { MirrorChart } from './components/MirrorChart';
export { SkewIndicator } from './components/SkewIndicator';

// ============================================
// Hooks
// ============================================
export { useContentAnalysis } from './hooks/useContentAnalysis';
export type { UseContentAnalysisOptions, UseContentAnalysisReturn } from './hooks/useContentAnalysis';

// ============================================
// Types (for TypeScript consumers)
// ============================================
export type {
  AnalysisResult,
  EditorialProfile,
  BrakeReport,
  MirrorReport,
  SkewReport,
  SignalReport,
  DetectedCamp,
  CampPosition,
  CampStance,
  ThemeKeywords,
  AnalyzeRequest,
  AnalyzeResponse
} from './lib/types';

// ============================================
// DO NOT EXPORT:
// - Internal lib functions (analyze, camp-detection, brake-logic)
// - Adapters
// - Constants
// - Internal component props
// ============================================

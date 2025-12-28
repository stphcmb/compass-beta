// Core analysis
export { analyzeContent } from './analyze';

// Camp detection
export { detectCamps, getDominantCamp, isCampDetected, getCampConfidence } from './camp-detection';

// Brake logic
export { calculateBrake, getBrakeSeverityLevel, shouldHoldContent } from './brake-logic';

// Types
export type {
  EditorialProfile,
  CampPosition,
  CampStance,
  ThemeKeywords,
  AnalysisResult,
  DetectedCamp,
  BrakeReport,
  MirrorReport,
  SkewReport,
  SignalReport,
  AnalyzeRequest,
  AnalyzeResponse
} from './types';

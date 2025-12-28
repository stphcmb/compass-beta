'use client';

/**
 * AnalysisPanel Component
 * Main panel that displays all analysis results
 */

import React, { useState } from 'react';
import type { AnalysisResult, EditorialProfile } from '../lib/types';
import { AlignmentScore } from './AlignmentScore';
import { BrakeCard } from './BrakeCard';
import { MirrorChart } from './MirrorChart';
import { SkewIndicator } from './SkewIndicator';
import { getCampName } from '../constants/camp-keywords';
import styles from './ContentHelper.module.css';

interface AnalysisPanelProps {
  /** Analysis result to display */
  result: AnalysisResult | null;
  /** Profile being analyzed against */
  profile: EditorialProfile | null;
  /** Whether analysis is in progress */
  loading?: boolean;
  /** Error if any */
  error?: Error | null;
  /** Callback when panel is closed */
  onClose?: () => void;
}

export function AnalysisPanel({
  result,
  profile,
  loading = false,
  error = null,
  onClose
}: AnalysisPanelProps) {
  const [brakeDismissed, setBrakeDismissed] = useState(false);

  // Reset brake dismissed state when result changes
  React.useEffect(() => {
    setBrakeDismissed(false);
  }, [result?.analyzedAt]);

  if (loading) {
    return (
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Content Analysis</h2>
          {onClose && (
            <button className={styles.panelClose} onClick={onClose}>×</button>
          )}
        </div>
        <div className={styles.panelLoading}>
          <div className={styles.spinner} />
          <span>Analyzing content...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Content Analysis</h2>
          {onClose && (
            <button className={styles.panelClose} onClick={onClose}>×</button>
          )}
        </div>
        <div className={styles.panelError}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error.message}</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Content Analysis</h2>
          {onClose && (
            <button className={styles.panelClose} onClick={onClose}>×</button>
          )}
        </div>
        <div className={styles.panelEmpty}>
          <p>Enter content and click Analyze to see results</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Content Analysis</h2>
        {profile && (
          <span className={styles.panelProfile}>
            Profile: {profile.display_name}
          </span>
        )}
        {onClose && (
          <button className={styles.panelClose} onClick={onClose}>×</button>
        )}
      </div>

      <div className={styles.panelContent}>
        {/* Alignment Score - Always shown */}
        <AlignmentScore score={result.alignmentScore} />

        {/* Brake - Shown if triggered and not dismissed */}
        {result.brake?.triggered && !brakeDismissed && (
          <BrakeCard
            severity={result.brake.severity}
            reason={result.brake.reason}
            dominantCamps={result.brake.dominant_camps.map(getCampName)}
            missingThemes={result.brake.missing_themes}
            onDismiss={() => setBrakeDismissed(true)}
          />
        )}

        {/* Mirror - Stated vs Actual */}
        <MirrorChart mirror={result.mirror} />

        {/* Skew - Camp balance */}
        <SkewIndicator skew={result.skew} />

        {/* Detected Camps - Collapsible detail */}
        {result.detectedCamps.length > 0 && (
          <details className={styles.detectedCamps}>
            <summary className={styles.detectedCampsSummary}>
              <span className={styles.sectionIcon}>🔍</span>
              Detected Camps ({result.detectedCamps.length})
            </summary>
            <div className={styles.detectedCampsList}>
              {result.detectedCamps.map((camp, i) => (
                <div key={i} className={styles.detectedCamp}>
                  <div className={styles.detectedCampHeader}>
                    <span className={styles.detectedCampName}>{camp.camp_name}</span>
                    <span className={styles.detectedCampConfidence}>
                      {Math.round(camp.confidence * 100)}%
                    </span>
                  </div>
                  <div className={styles.detectedCampKeywords}>
                    {camp.matched_keywords.slice(0, 5).map((kw, j) => (
                      <span key={j} className={styles.keyword}>{kw}</span>
                    ))}
                    {camp.matched_keywords.length > 5 && (
                      <span className={styles.keywordMore}>
                        +{camp.matched_keywords.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Timestamp */}
        <div className={styles.panelFooter}>
          Analyzed at {new Date(result.analyzedAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

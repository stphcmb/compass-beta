'use client';

/**
 * BrakeCard Component
 * Displays brake warnings when content needs review
 */

import React from 'react';
import styles from './ContentHelper.module.css';

interface BrakeCardProps {
  /** Severity level of the brake */
  severity: 'warning' | 'stop';
  /** Reason for the brake */
  reason: string;
  /** Camps that are dominating the content */
  dominantCamps?: string[];
  /** Themes missing from the content */
  missingThemes?: string[];
  /** Callback when user dismisses the brake */
  onDismiss?: () => void;
}

export function BrakeCard({
  severity,
  reason,
  dominantCamps = [],
  missingThemes = [],
  onDismiss
}: BrakeCardProps) {
  const icon = severity === 'stop' ? '🛑' : '⚠️';
  const title = severity === 'stop' ? 'Hold' : 'Caution';

  return (
    <div className={styles.brakeCard} data-severity={severity}>
      <div className={styles.brakeHeader}>
        <span className={styles.brakeIcon}>{icon}</span>
        <span className={styles.brakeTitle}>{title}</span>
        {onDismiss && (
          <button
            className={styles.brakeDismiss}
            onClick={onDismiss}
            aria-label="Dismiss warning"
          >
            ×
          </button>
        )}
      </div>

      <p className={styles.brakeReason}>{reason}</p>

      {dominantCamps.length > 0 && (
        <div className={styles.brakeDetail}>
          <span className={styles.brakeDetailLabel}>Dominant camps:</span>
          <span className={styles.brakeDetailValue}>
            {dominantCamps.join(', ')}
          </span>
        </div>
      )}

      {missingThemes.length > 0 && (
        <div className={styles.brakeDetail}>
          <span className={styles.brakeDetailLabel}>Missing themes:</span>
          <ul className={styles.brakeThemeList}>
            {missingThemes.map((theme, i) => (
              <li key={i}>{theme}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

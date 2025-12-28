'use client';

/**
 * SkewIndicator Component
 * Displays camp balance/skew analysis
 */

import React from 'react';
import type { SkewReport } from '../lib/types';
import styles from './ContentHelper.module.css';

interface SkewIndicatorProps {
  /** Skew report data */
  skew: SkewReport;
}

export function SkewIndicator({ skew }: SkewIndicatorProps) {
  const { overrepresented, underrepresented, missing } = skew;

  const hasSkew = overrepresented.length > 0 ||
    underrepresented.length > 0 ||
    missing.length > 0;

  if (!hasSkew) {
    return (
      <div className={styles.skewIndicator}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>⚖️</span>
          <span className={styles.sectionTitle}>Skew</span>
        </div>
        <p className={styles.skewBalanced}>
          ✓ Content is well-balanced across your stated positions
        </p>
      </div>
    );
  }

  return (
    <div className={styles.skewIndicator}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>⚖️</span>
        <span className={styles.sectionTitle}>Skew</span>
      </div>

      {overrepresented.length > 0 && (
        <div className={styles.skewSection}>
          <div className={styles.skewLabel} data-type="over">
            Over-represented:
          </div>
          <div className={styles.skewCamps}>
            {overrepresented.map((camp, i) => (
              <span key={i} className={styles.skewCamp} data-type="over">
                {camp.camp_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {underrepresented.length > 0 && (
        <div className={styles.skewSection}>
          <div className={styles.skewLabel} data-type="under">
            Under-represented:
          </div>
          <div className={styles.skewCamps}>
            {underrepresented.map((camp, i) => (
              <span key={i} className={styles.skewCamp} data-type="under">
                {camp.camp_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div className={styles.skewSection}>
          <div className={styles.skewLabel} data-type="missing">
            Missing entirely:
          </div>
          <div className={styles.skewCamps}>
            {missing.map((camp, i) => (
              <span key={i} className={styles.skewCamp} data-type="missing">
                {camp}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

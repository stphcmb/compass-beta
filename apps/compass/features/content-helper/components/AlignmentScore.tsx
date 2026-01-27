'use client';

/**
 * AlignmentScore Component
 * Displays the overall alignment score with visual indicator
 */

import React from 'react';
import styles from './ContentHelper.module.css';

interface AlignmentScoreProps {
  /** Score from 0-100, or null if unable to calculate */
  score: number | null;
  /** Optional label override */
  label?: string;
}

/**
 * Get score level for styling
 */
function getScoreLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

/**
 * Get description based on score
 */
function getScoreDescription(score: number): string {
  if (score >= 80) return 'Strong alignment with your stated positions';
  if (score >= 60) return 'Good alignment, minor gaps detected';
  if (score >= 40) return 'Moderate alignment, consider reviewing balance';
  if (score >= 20) return 'Weak alignment with stated positions';
  return 'Significant misalignment detected';
}

export function AlignmentScore({ score, label = 'Alignment Score' }: AlignmentScoreProps) {
  if (score === null) {
    return (
      <div className={styles.alignmentScore} data-level="unknown">
        <div className={styles.alignmentHeader}>
          <span className={styles.alignmentIcon}>🎯</span>
          <span className={styles.alignmentLabel}>{label}</span>
        </div>
        <div className={styles.alignmentValue}>—</div>
        <div className={styles.alignmentBar}>
          <div className={styles.alignmentBarFill} style={{ width: '0%' }} />
        </div>
        <div className={styles.alignmentDescription}>Unable to calculate</div>
      </div>
    );
  }

  const level = getScoreLevel(score);
  const description = getScoreDescription(score);

  return (
    <div className={styles.alignmentScore} data-level={level}>
      <div className={styles.alignmentHeader}>
        <span className={styles.alignmentIcon}>🎯</span>
        <span className={styles.alignmentLabel}>{label}</span>
      </div>
      <div className={styles.alignmentValue}>{score}/100</div>
      <div className={styles.alignmentBar}>
        <div
          className={styles.alignmentBarFill}
          style={{ width: `${score}%` }}
          data-level={level}
        />
      </div>
      <div className={styles.alignmentDescription}>{description}</div>
    </div>
  );
}

'use client';

/**
 * MirrorChart Component
 * Displays comparison between stated themes and actual content
 */

import React from 'react';
import type { MirrorReport } from '../lib/types';
import styles from './ContentHelper.module.css';

interface MirrorChartProps {
  /** Mirror report data */
  mirror: MirrorReport;
}

export function MirrorChart({ mirror }: MirrorChartProps) {
  const { stated_themes, actual_themes, gaps } = mirror;

  if (stated_themes.length === 0) {
    return (
      <div className={styles.mirrorChart}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>🪞</span>
          <span className={styles.sectionTitle}>Mirror</span>
        </div>
        <p className={styles.emptyState}>No themes configured in profile</p>
      </div>
    );
  }

  return (
    <div className={styles.mirrorChart}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>🪞</span>
        <span className={styles.sectionTitle}>Mirror</span>
      </div>

      <div className={styles.mirrorColumns}>
        <div className={styles.mirrorColumn}>
          <div className={styles.mirrorColumnHeader}>You SAY</div>
          {stated_themes.map((theme, i) => {
            const found = actual_themes.find(a => a.name === theme.name);
            return (
              <div
                key={i}
                className={styles.mirrorItem}
                data-found={!!found}
              >
                <span className={styles.mirrorCheck}>
                  {found ? '✓' : '○'}
                </span>
                <span>{theme.name}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.mirrorColumn}>
          <div className={styles.mirrorColumnHeader}>You WRITE</div>
          {actual_themes.length > 0 ? (
            actual_themes.map((theme, i) => (
              <div key={i} className={styles.mirrorItem} data-found={true}>
                <span className={styles.mirrorMentions}>
                  {theme.mentions}×
                </span>
                <span>{theme.name}</span>
              </div>
            ))
          ) : (
            <div className={styles.mirrorItem} data-found={false}>
              <span className={styles.mirrorEmpty}>[none detected]</span>
            </div>
          )}
        </div>
      </div>

      {gaps.length > 0 && (
        <div className={styles.mirrorGaps}>
          <span className={styles.mirrorGapsLabel}>Gaps:</span>
          <span className={styles.mirrorGapsValue}>{gaps.join(', ')}</span>
        </div>
      )}
    </div>
  );
}

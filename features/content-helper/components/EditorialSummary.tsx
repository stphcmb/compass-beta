'use client';

/**
 * EditorialSummary Component
 *
 * Displays human-readable editorial feedback translated from
 * the technical analysis results. This is the primary output
 * that users should see and act on.
 */

import React from 'react';
import type { AnalysisResult } from '../lib/types';
import { generateEditorialSummary, type EditorialInsight } from '../lib/editorial-summary';
import styles from './ContentHelper.module.css';

interface EditorialSummaryProps {
  result: AnalysisResult;
}

function InsightIcon({ type }: { type: EditorialInsight['type'] }) {
  switch (type) {
    case 'strength':
      return <span style={{ color: '#059669' }}>✓</span>;
    case 'gap':
      return <span style={{ color: '#d97706' }}>○</span>;
    case 'suggestion':
      return <span style={{ color: '#6366f1' }}>→</span>;
  }
}

export function EditorialSummary({ result }: EditorialSummaryProps) {
  const summary = generateEditorialSummary(result);

  // Determine headline style based on score
  const scoreColor = result.alignmentScore === null
    ? '#6b7280'
    : result.alignmentScore >= 70
      ? '#059669'
      : result.alignmentScore >= 50
        ? '#d97706'
        : '#dc2626';

  return (
    <div className={styles.editorialSummary}>
      {/* Headline */}
      <div
        style={{
          padding: '16px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '8px',
          marginBottom: '16px',
          borderLeft: `4px solid ${scoreColor}`
        }}
      >
        <h3 style={{
          margin: 0,
          fontSize: '15px',
          fontWeight: 600,
          color: '#111827',
          lineHeight: 1.4
        }}>
          {summary.headline}
        </h3>
      </div>

      {/* Insights */}
      {summary.insights.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '10px'
          }}>
            What we found
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {summary.insights.map((insight, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '10px 12px',
                  background: insight.type === 'strength' ? '#f0fdf4' : insight.type === 'gap' ? '#fffbeb' : '#eef2ff',
                  borderRadius: '6px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: '#374151'
                }}
              >
                <span style={{ flexShrink: 0, fontSize: '14px' }}>
                  <InsightIcon type={insight.type} />
                </span>
                <span>{insight.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      {summary.actionItems.length > 0 && (
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '10px'
          }}>
            To strengthen your draft
          </div>
          <div style={{
            padding: '12px',
            background: '#fafafa',
            borderRadius: '6px',
            border: '1px solid #e5e7eb'
          }}>
            <ol style={{
              margin: 0,
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {summary.actionItems.map((item, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: '#374151'
                  }}
                >
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Empty state */}
      {summary.insights.length === 0 && summary.actionItems.length === 0 && (
        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
          Your content looks good. No specific adjustments suggested.
        </p>
      )}
    </div>
  );
}

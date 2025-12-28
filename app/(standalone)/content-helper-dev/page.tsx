'use client';

/**
 * Content Helper - Development Page
 *
 * Standalone page for testing Content Helper in isolation
 * Access at: /content-helper-dev
 */

import React, { useState } from 'react';
import { AnalysisPanel, useContentAnalysis } from '@/features/content-helper';
import styles from '@/features/content-helper/components/ContentHelper.module.css';

// Sample drafts for testing
const SAMPLE_DRAFTS = {
  balanced: `
AI is transforming how businesses operate, but the key to success lies in augmenting human capabilities rather than replacing workers entirely. Organizations that invest in their people and processes alongside AI technology will see the best outcomes.

The rise of agentic AI opens new possibilities for workers to manage digital teams, becoming more productive than ever before. However, we must also acknowledge the societal risks - from potential job displacement to the need for proper safeguards against misuse.

An AI-native approach, rather than an AI-first mindset, recognizes that transformation requires cultural adaptation. Business leaders need guidance to navigate this transition effectively.
  `,
  scalingHeavy: `
The future of AI is clear: scaling will deliver AGI. As we build bigger models with more parameters and more compute, we're seeing emergent capabilities that were previously impossible. GPT-5 and future frontier models will continue this trend.

Foundation models are getting more powerful every year. The bitter lesson from AI research is that scale beats clever algorithms. We need to focus on transformer architectures and massive training data.

The path to superintelligence is through scaling laws. Companies investing in compute infrastructure today will dominate tomorrow's AI landscape.
  `,
  safetyFocused: `
We need to pause AI development until we can ensure alignment. The existential risk from uncontrolled AI is too great to ignore. Without proper oversight and guardrails, we risk catastrophic outcomes.

AI safety research must be prioritized over capabilities research. The control problem remains unsolved, and deploying increasingly powerful systems without solutions is reckless.

Regulation is essential. The government must step in to enforce safety standards and prevent a race to the bottom. We cannot let innovation outpace our ability to ensure responsible AI development.
  `
};

export default function ContentHelperDevPage() {
  const [draft, setDraft] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('alin');

  const {
    result,
    loading,
    error,
    profile,
    analyze,
    reset,
    canAnalyze
  } = useContentAnalysis({
    profileId: selectedProfile,
    onError: (e) => console.error('Analysis error:', e)
  });

  const handleAnalyze = () => {
    if (canAnalyze(draft)) {
      analyze(draft);
    }
  };

  const loadSample = (key: keyof typeof SAMPLE_DRAFTS) => {
    setDraft(SAMPLE_DRAFTS[key].trim());
    reset();
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>
          Content Helper - Development
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Isolated testing environment for editorial analysis
        </p>
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: '#fef3c7',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#92400e'
        }}>
          This page is for development only and not linked from the main app.
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '32px', alignItems: 'start' }}>
        {/* Left: Draft input */}
        <div>
          {/* Profile selector */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              Profile
            </label>
            <select
              value={selectedProfile}
              onChange={(e) => {
                setSelectedProfile(e.target.value);
                reset();
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                minWidth: '200px'
              }}
            >
              <option value="alin">Alin</option>
              <option value="dev">Development (Test)</option>
            </select>
          </div>

          {/* Sample drafts */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              Load Sample
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => loadSample('balanced')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Balanced
              </button>
              <button
                onClick={() => loadSample('scalingHeavy')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Scaling Heavy
              </button>
              <button
                onClick={() => loadSample('safetyFocused')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Safety Focused
              </button>
            </div>
          </div>

          {/* Draft textarea */}
          <div className={styles.draftInput}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              Draft Content
            </label>
            <textarea
              className={styles.draftTextarea}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Paste or type your draft content here..."
              style={{ minHeight: '300px' }}
            />
            <div className={styles.draftActions}>
              <span className={styles.draftCharCount}>
                {draft.length} characters
                {draft.length < 50 && draft.length > 0 && (
                  <span style={{ color: '#dc2626' }}> (min 50)</span>
                )}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={reset}
                  disabled={!result && !error}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    fontSize: '14px',
                    cursor: result || error ? 'pointer' : 'not-allowed',
                    opacity: result || error ? 1 : 0.5
                  }}
                >
                  Reset
                </button>
                <button
                  className={styles.analyzeButton}
                  onClick={handleAnalyze}
                  disabled={!canAnalyze(draft) || loading}
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Analysis panel */}
        <div style={{ position: 'sticky', top: '32px' }}>
          <AnalysisPanel
            result={result}
            profile={profile}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      {/* Debug info */}
      {profile && (
        <details style={{ marginTop: '32px' }}>
          <summary style={{ cursor: 'pointer', color: '#6b7280', fontSize: '14px' }}>
            Debug: Profile Data
          </summary>
          <pre style={{
            marginTop: '8px',
            padding: '16px',
            background: '#1f2937',
            color: '#e5e7eb',
            borderRadius: '8px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {JSON.stringify(profile, null, 2)}
          </pre>
        </details>
      )}

      {result && (
        <details style={{ marginTop: '16px' }}>
          <summary style={{ cursor: 'pointer', color: '#6b7280', fontSize: '14px' }}>
            Debug: Analysis Result
          </summary>
          <pre style={{
            marginTop: '8px',
            padding: '16px',
            background: '#1f2937',
            color: '#e5e7eb',
            borderRadius: '8px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

'use client';

/**
 * Content Helper - Development Page
 *
 * Standalone page for testing Content Helper in isolation
 * Access at: /content-helper-dev
 *
 * Layout inspired by AI Editor - single column, full-width results
 */

import React, { useState } from 'react';
import { AnalysisPanel, useContentAnalysis } from '@/features/content-helper';
import { EditorialSummary } from '@/features/content-helper/components/EditorialSummary';
import { AlignmentScore } from '@/features/content-helper/components/AlignmentScore';
import { Sparkles, Loader2, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '8px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '10px'
            }}>
              <Sparkles style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                Content Helper
              </h1>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                Editorial analysis for balanced writing
              </p>
            </div>
          </div>
          <div style={{
            marginTop: '12px',
            padding: '8px 12px',
            background: '#fef3c7',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#92400e'
          }}>
            Development page - not linked from main app
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Input Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          marginBottom: result ? '32px' : '24px'
        }}>
          {/* Profile & Sample Selector */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                Profile:
              </label>
              <select
                value={selectedProfile}
                onChange={(e) => {
                  setSelectedProfile(e.target.value);
                  reset();
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '13px',
                  backgroundColor: 'white'
                }}
              >
                <option value="alin">Alin</option>
                <option value="dev">Development (Test)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Load sample:</span>
              {(['balanced', 'scalingHeavy', 'safetyFocused'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => loadSample(key)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    background: 'white',
                    fontSize: '12px',
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.color = '#6366f1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.color = '#374151';
                  }}
                >
                  {key === 'scalingHeavy' ? 'Scaling' : key === 'safetyFocused' ? 'Safety' : 'Balanced'}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your draft content here to analyze its editorial balance..."
            disabled={loading}
            style={{
              width: '100%',
              minHeight: '180px',
              padding: '20px',
              border: 'none',
              fontSize: '15px',
              lineHeight: '1.7',
              color: '#111827',
              backgroundColor: 'transparent',
              resize: 'vertical',
              outline: 'none',
              opacity: loading ? 0.6 : 1
            }}
          />

          {/* Footer */}
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid #f3f4f6',
            backgroundColor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontSize: '12px',
                color: draft.length < 50 && draft.length > 0 ? '#dc2626' : '#6b7280'
              }}>
                {draft.length} characters
                {draft.length > 0 && draft.length < 50 && ' (min 50)'}
              </span>
              <span style={{ color: '#d1d5db' }}>•</span>
              <kbd style={{
                padding: '2px 6px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#6b7280'
              }}>⌘↵</kbd>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {result && (
                <button
                  onClick={reset}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw style={{ width: '16px', height: '16px' }} />
                  Reset
                </button>
              )}
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze(draft) || loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: !canAnalyze(draft) || loading
                    ? '#e5e7eb'
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: !canAnalyze(draft) || loading ? 'not-allowed' : 'pointer',
                  boxShadow: !canAnalyze(draft) || loading ? 'none' : '0 2px 8px rgba(99, 102, 241, 0.3)'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles style={{ width: '16px', height: '16px' }} />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            backgroundColor: '#eef2ff',
            border: '1px solid #c7d2fe',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Loader2 style={{ width: '20px', height: '20px', color: '#6366f1' }} className="animate-spin" />
              <span style={{ fontSize: '14px', color: '#4338ca', fontWeight: '500' }}>
                Analyzing your content for editorial balance...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626', margin: '0 0 4px 0' }}>
                Analysis Error
              </h3>
              <p style={{ fontSize: '13px', color: '#b91c1c', margin: 0 }}>
                {error.message}
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Alignment Score Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              padding: '24px'
            }}>
              <AlignmentScore score={result.alignmentScore} />
            </div>

            {/* Editorial Summary - PRIMARY OUTPUT */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px solid #6366f1',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.12)',
              padding: '28px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  padding: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '10px'
                }}>
                  <CheckCircle style={{ width: '22px', height: '22px', color: 'white' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    Editorial Feedback
                  </h2>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                    Clear, actionable insights for your draft
                  </p>
                </div>
              </div>

              <EditorialSummary result={result} />
            </div>

            {/* Technical Details - Collapsible */}
            <details style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <summary style={{
                padding: '16px 20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                userSelect: 'none',
                listStyle: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ transition: 'transform 0.2s' }}>▶</span>
                Technical Details (for developers)
              </summary>
              <div style={{
                padding: '0 20px 20px',
                borderTop: '1px solid #f3f4f6'
              }}>
                {/* Mirror Chart */}
                {result.mirror && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                      Mirror: Stated vs Actual Themes
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>
                          You Say
                        </div>
                        {result.mirror.stated_themes.map((theme, i) => (
                          <div key={i} style={{ fontSize: '13px', color: '#374151', marginBottom: '4px' }}>
                            {theme.name}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>
                          You Write
                        </div>
                        {result.mirror.actual_themes.map((theme, i) => (
                          <div key={i} style={{ fontSize: '13px', color: '#374151', marginBottom: '4px' }}>
                            {theme.name} ({theme.mentions}×)
                          </div>
                        ))}
                      </div>
                    </div>
                    {result.mirror.gaps.length > 0 && (
                      <div style={{ marginTop: '12px', fontSize: '12px', color: '#d97706' }}>
                        Gaps: {result.mirror.gaps.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {/* Detected Camps */}
                {result.detectedCamps.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                      Detected Camps ({result.detectedCamps.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {result.detectedCamps.map((camp, i) => (
                        <div key={i} style={{
                          padding: '10px 12px',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '500', color: '#111827' }}>{camp.camp_name}</span>
                            <span style={{ color: '#6b7280' }}>{Math.round(camp.confidence * 100)}%</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                            {camp.matched_keywords.slice(0, 5).join(', ')}
                            {camp.matched_keywords.length > 5 && ` +${camp.matched_keywords.length - 5} more`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skew Report */}
                {(result.skew.overrepresented.length > 0 || result.skew.underrepresented.length > 0 || result.skew.missing.length > 0) && (
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                      Skew Analysis
                    </h4>
                    {result.skew.overrepresented.length > 0 && (
                      <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                        <span style={{ color: '#dc2626', fontWeight: '500' }}>Over-represented:</span>{' '}
                        <span style={{ color: '#6b7280' }}>{result.skew.overrepresented.map(c => c.camp_name).join(', ')}</span>
                      </div>
                    )}
                    {result.skew.underrepresented.length > 0 && (
                      <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                        <span style={{ color: '#d97706', fontWeight: '500' }}>Under-represented:</span>{' '}
                        <span style={{ color: '#6b7280' }}>{result.skew.underrepresented.map(c => c.camp_name).join(', ')}</span>
                      </div>
                    )}
                    {result.skew.missing.length > 0 && (
                      <div style={{ fontSize: '12px' }}>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Missing:</span>{' '}
                        <span style={{ color: '#9ca3af' }}>{result.skew.missing.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </details>

            {/* Debug Data */}
            {profile && (
              <details style={{
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <summary style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#9ca3af',
                  userSelect: 'none'
                }}>
                  Debug: Raw Data
                </summary>
                <div style={{ padding: '0 16px 16px' }}>
                  <pre style={{
                    fontSize: '11px',
                    color: '#e5e7eb',
                    overflow: 'auto',
                    margin: 0
                  }}>
                    {JSON.stringify({ profile, result }, null, 2)}
                  </pre>
                </div>
              </details>
            )}

            {/* Timestamp */}
            <div style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              Analyzed at {new Date(result.analyzedAt).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

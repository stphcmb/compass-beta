# Content Helper

Editorial analysis feature that compares draft content against a user's stated point of view (manifesto), surfacing alignment gaps, narrative skew, and citation strength.

## Status

**Phase 1 (MVP)** - Foundation complete

## Quick Start

### Development

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Visit the standalone dev page:
   ```
   http://localhost:3000/content-helper-dev
   ```

3. Use the sample drafts or paste your own content to test.

### Feature Flag

The feature is controlled by the `NEXT_PUBLIC_FF_CONTENT_HELPER` environment variable:

```bash
# Enable in production
NEXT_PUBLIC_FF_CONTENT_HELPER=true

# Disable (default)
NEXT_PUBLIC_FF_CONTENT_HELPER=false
```

In development mode, the feature is always enabled.

## Architecture

```
features/content-helper/
├── index.ts              # Public API (only entry point)
├── components/           # Dumb UI components
│   ├── AnalysisPanel.tsx
│   ├── AlignmentScore.tsx
│   ├── BrakeCard.tsx
│   ├── MirrorChart.tsx
│   └── SkewIndicator.tsx
├── hooks/                # React hooks
│   └── useContentAnalysis.ts
├── lib/                  # Pure functions (no React)
│   ├── types.ts
│   ├── analyze.ts
│   ├── camp-detection.ts
│   └── brake-logic.ts
├── adapters/             # External API boundaries
│   ├── profile-adapter.ts
│   └── api-adapter.ts
└── constants/            # Static configuration
    ├── camp-keywords.ts
    └── thresholds.ts
```

## Usage

### Basic Usage

```tsx
import { AnalysisPanel, useContentAnalysis } from '@/features/content-helper';

function MyComponent() {
  const { result, loading, analyze } = useContentAnalysis({
    profileId: 'alin'
  });

  return (
    <div>
      <button onClick={() => analyze(draftContent)}>
        Analyze
      </button>
      <AnalysisPanel result={result} loading={loading} />
    </div>
  );
}
```

### API Endpoint

```bash
POST /api/content-helper/analyze
Content-Type: application/json

{
  "draft": "Your draft content here...",
  "profileId": "alin"
}
```

Response:
```json
{
  "success": true,
  "result": {
    "alignmentScore": 72,
    "brake": null,
    "mirror": {...},
    "skew": {...},
    "signalStrength": {...},
    "detectedCamps": [...],
    "analyzedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Analysis Features

### Alignment Score (0-100)
Overall alignment with the user's stated positions.

### Brake
Triggered when content is too one-sided or missing critical themes:
- **Warning**: Heavy lean toward camps outside stated positions
- **Stop**: Missing majority of core themes

### Mirror
Comparison of stated themes vs actual content:
- What you SAY (from profile)
- What you WRITE (detected in draft)
- Gaps (stated but not written)

### Skew
Camp balance analysis:
- Over-represented camps
- Under-represented camps
- Missing camps

### Signal Strength (Phase 2)
Citation strength based on author database coverage.

## Profiles

### Alin (Default)
Based on Alin's manifesto with positions on:
- Human-AI Collaboration (advocate)
- Co-Evolution (advocate)
- Business Whisperers (advocate)
- Adaptive Governance (advocate)
- Safety First (partial)
- Displacement Realist (partial)

Themes:
- Augmentation over replacement
- People and processes
- Agentic workforce
- Breaking the fourth wall
- Societal risk awareness

### Dev (Testing)
Simplified profile for development testing.

## Rollback

To disable the feature instantly:

1. Set `NEXT_PUBLIC_FF_CONTENT_HELPER=false` in Vercel
2. Redeploy (or wait for automatic redeploy)

No code changes required.

## Files Modified Outside Feature

- `app/api/content-helper/` - API routes
- `app/(standalone)/content-helper-dev/` - Dev page
- `lib/feature-flags.ts` - Feature flag utilities

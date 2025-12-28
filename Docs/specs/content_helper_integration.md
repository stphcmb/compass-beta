# Content Helper - Modular Integration Plan

## Architecture Philosophy

**Principle**: Build as a "plugin" that the app imports, not code that lives inside the app.

```
┌─────────────────────────────────────────────────────────┐
│                     Compass App                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Existing Components                  │  │
│  │  (Authors, Explore, Camps, etc.)                  │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                              │
│                    [Feature Flag]                       │
│                          │                              │
│  ┌───────────────────────▼───────────────────────────┐  │
│  │           Content Helper Module                   │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────┐   │  │
│  │  │   UI    │  │  Logic  │  │  Data Adapter   │   │  │
│  │  │ (dumb)  │  │ (pure)  │  │ (isolated)      │   │  │
│  │  └─────────┘  └─────────┘  └─────────────────┘   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Folder Structure

```
/features/
  /content-helper/
    ├── index.ts                    # Public API - ONLY export from here
    ├── README.md                   # Module documentation
    │
    ├── /components/                # Dumb UI components (no business logic)
    │   ├── AnalysisPanel.tsx       # Main slide-over panel
    │   ├── AlignmentScore.tsx      # Score display widget
    │   ├── BrakeCard.tsx           # Warning card
    │   ├── MirrorChart.tsx         # Stated vs actual comparison
    │   ├── SkewIndicator.tsx       # Camp balance visualization
    │   ├── SignalBadge.tsx         # Signal strength indicator
    │   └── DraftInput.tsx          # Text area for draft content
    │
    ├── /hooks/                     # React hooks (stateful logic)
    │   ├── useContentAnalysis.ts   # Main analysis hook
    │   └── useAnalysisHistory.ts   # Optional: past analyses
    │
    ├── /lib/                       # Pure functions (no React, no side effects)
    │   ├── analyze.ts              # Core analysis engine
    │   ├── camp-detection.ts       # Camp keyword matching
    │   ├── brake-logic.ts          # Brake calculation
    │   ├── skew-calculator.ts      # Skew report generation
    │   └── types.ts                # All TypeScript interfaces
    │
    ├── /adapters/                  # External world boundaries
    │   ├── api-adapter.ts          # Wraps fetch calls to /api routes
    │   ├── profile-adapter.ts      # Fetches editorial profiles
    │   └── camp-adapter.ts         # Fetches camp data from existing API
    │
    ├── /constants/                 # Static configuration
    │   ├── camp-keywords.ts        # Keyword mappings per camp
    │   └── thresholds.ts           # Brake/skew thresholds
    │
    └── /__tests__/                 # Co-located tests
        ├── analyze.test.ts
        ├── brake-logic.test.ts
        └── AnalysisPanel.test.tsx

/app/
  /(standalone)/                    # Isolated testing routes (no layout inheritance)
    /content-helper-dev/
      page.tsx                      # Standalone test page
      layout.tsx                    # Minimal layout (no app shell)

  /api/
    /content-helper/                # Isolated API namespace
      /analyze/
        route.ts
      /profiles/
        route.ts
```

---

## 2. Component Boundaries

### Layer 1: Dumb UI Components
**Rule**: Zero business logic. Only props in, events out.

```typescript
// features/content-helper/components/BrakeCard.tsx
interface BrakeCardProps {
  severity: 'warning' | 'stop';
  reason: string;
  dominantCamps: string[];
  missingThemes: string[];
  onDismiss?: () => void;
}

export function BrakeCard({ severity, reason, dominantCamps, missingThemes, onDismiss }: BrakeCardProps) {
  // ONLY rendering logic here
  // NO: fetching, state management, business calculations
  return (
    <div className={styles.card} data-severity={severity}>
      <span className={styles.icon}>{severity === 'stop' ? '🛑' : '⚠️'}</span>
      <p>{reason}</p>
      {onDismiss && <button onClick={onDismiss}>Dismiss</button>}
    </div>
  );
}
```

### Layer 2: Hooks (Stateful Logic)
**Rule**: Manage state, call adapters, return data + actions.

```typescript
// features/content-helper/hooks/useContentAnalysis.ts
import { useState, useCallback } from 'react';
import { analyzeContent } from '../lib/analyze';
import { fetchProfile } from '../adapters/profile-adapter';
import type { AnalysisResult, EditorialProfile } from '../lib/types';

interface UseContentAnalysisOptions {
  profileId: string;
  onError?: (error: Error) => void;
}

export function useContentAnalysis({ profileId, onError }: UseContentAnalysisOptions) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<EditorialProfile | null>(null);

  const analyze = useCallback(async (draft: string) => {
    setLoading(true);
    try {
      const prof = profile ?? await fetchProfile(profileId);
      if (!profile) setProfile(prof);

      const analysis = analyzeContent(draft, prof);
      setResult(analysis);
      return analysis;
    } catch (e) {
      onError?.(e as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [profileId, profile, onError]);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, loading, profile, analyze, reset };
}
```

### Layer 3: Pure Functions (Lib)
**Rule**: No React, no fetch, no side effects. Input → Output.

```typescript
// features/content-helper/lib/analyze.ts
import { detectCamps } from './camp-detection';
import { calculateBrake } from './brake-logic';
import { calculateSkew } from './skew-calculator';
import type { AnalysisResult, EditorialProfile } from './types';

// Pure function - easy to test, easy to mock
export function analyzeContent(draft: string, profile: EditorialProfile): AnalysisResult {
  const detectedCamps = detectCamps(draft);
  const brake = calculateBrake(detectedCamps, profile, draft);
  const skew = calculateSkew(detectedCamps, profile);
  const alignmentScore = calculateAlignment(detectedCamps, profile);

  return {
    alignmentScore,
    brake,
    mirror: extractMirror(draft, profile),
    skew,
    signalStrength: { overall: 'moderate', by_camp: {}, warnings: [] }, // Phase 2
  };
}
```

### Layer 4: Adapters (External Boundaries)
**Rule**: Only place that knows about external APIs/DB.

```typescript
// features/content-helper/adapters/profile-adapter.ts
import type { EditorialProfile } from '../lib/types';

const PROFILE_CACHE = new Map<string, EditorialProfile>();

export async function fetchProfile(profileId: string): Promise<EditorialProfile> {
  // Check cache first
  if (PROFILE_CACHE.has(profileId)) {
    return PROFILE_CACHE.get(profileId)!;
  }

  const res = await fetch(`/api/content-helper/profiles/${profileId}`);
  if (!res.ok) throw new Error(`Profile not found: ${profileId}`);

  const profile = await res.json();
  PROFILE_CACHE.set(profileId, profile);
  return profile;
}

// For testing - allow cache clearing
export function clearProfileCache() {
  PROFILE_CACHE.clear();
}
```

---

## 3. Public API (Single Entry Point)

```typescript
// features/content-helper/index.ts

// Components - for use in pages
export { AnalysisPanel } from './components/AnalysisPanel';
export { ContentHelperProvider } from './components/ContentHelperProvider';

// Hooks - for custom integrations
export { useContentAnalysis } from './hooks/useContentAnalysis';

// Types - for TypeScript consumers
export type {
  AnalysisResult,
  BrakeReport,
  SkewReport,
  EditorialProfile
} from './lib/types';

// DO NOT export:
// - Internal components (BrakeCard, etc.)
// - Lib functions directly
// - Adapters
// - Constants
```

---

## 4. Isolation Testing Setup

### Standalone Dev Page

```typescript
// app/(standalone)/content-helper-dev/page.tsx
import { AnalysisPanel, ContentHelperProvider } from '@/features/content-helper';

// Mock profile for development
const MOCK_PROFILE = {
  user_id: 'dev',
  display_name: 'Development',
  camp_positions: [
    { camp_id: 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', stance: 'advocate', weight: 5 },
  ],
  theme_keywords: {
    test_theme: ['test', 'example', 'demo'],
  },
};

export default function ContentHelperDevPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Content Helper - Dev Mode</h1>
      <p className="text-gray-500 mb-8">Isolated testing environment</p>

      <ContentHelperProvider profile={MOCK_PROFILE}>
        <AnalysisPanel />
      </ContentHelperProvider>
    </div>
  );
}
```

### Minimal Layout (No App Shell)

```typescript
// app/(standalone)/content-helper-dev/layout.tsx
export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  // NO: Navigation, sidebars, global providers from main app
  return (
    <html>
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
```

---

## 5. Feature Flag & Instant Rollback

### Environment-Based Flag

```typescript
// lib/feature-flags.ts
export const FEATURES = {
  CONTENT_HELPER: process.env.NEXT_PUBLIC_FF_CONTENT_HELPER === 'true',
} as const;
```

### Conditional Rendering

```typescript
// components/SomeExistingPage.tsx
import { FEATURES } from '@/lib/feature-flags';

export function ExistingPage() {
  return (
    <div>
      {/* Existing content unchanged */}

      {FEATURES.CONTENT_HELPER && (
        <Suspense fallback={null}>
          <ContentHelperButton />
        </Suspense>
      )}
    </div>
  );
}

// Lazy load to prevent bundle impact when disabled
const ContentHelperButton = lazy(() =>
  import('@/features/content-helper').then(m => ({ default: m.AnalysisPanel }))
);
```

### Vercel Environment Config

```bash
# .env.local (development)
NEXT_PUBLIC_FF_CONTENT_HELPER=true

# Vercel Dashboard → Settings → Environment Variables
# Production: NEXT_PUBLIC_FF_CONTENT_HELPER=false (initially)
# Preview: NEXT_PUBLIC_FF_CONTENT_HELPER=true (for testing)
```

### Instant Rollback

1. **Toggle off**: Set `NEXT_PUBLIC_FF_CONTENT_HELPER=false` in Vercel
2. **Redeploy**: Automatic on env change, or trigger manually
3. **Zero code change**: No PR needed for rollback

---

## 6. Coupling Risks & Mitigations

### Risk 1: State Leakage
| Risk | Impact | Mitigation |
|------|--------|------------|
| Content Helper state pollutes global state | App-wide bugs | Use isolated Context provider, never use app-level stores |

```typescript
// BAD - pollutes global state
import { useAppStore } from '@/store';  // ❌

// GOOD - isolated state
import { useContentAnalysis } from '../hooks/useContentAnalysis';  // ✅
```

### Risk 2: Style Conflicts
| Risk | Impact | Mitigation |
|------|--------|------------|
| CSS classes clash with existing styles | Visual bugs elsewhere | Use CSS Modules with unique prefix, or scoped Tailwind classes |

```typescript
// features/content-helper/components/AnalysisPanel.module.css
.ch-panel { /* ch- prefix for Content Helper */ }
.ch-score { }
.ch-brake { }

// Or with Tailwind - use data attributes for scoping
<div data-content-helper className="[&[data-content-helper]]:bg-white">
```

### Risk 3: Routing Side Effects
| Risk | Impact | Mitigation |
|------|--------|------------|
| Component triggers navigation | Unexpected redirects | Never use router inside feature; emit events for parent to handle |

```typescript
// BAD - feature controls routing
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/somewhere');  // ❌

// GOOD - emit event, let parent decide
interface AnalysisPanelProps {
  onNavigateRequest?: (path: string) => void;  // ✅
}
```

### Risk 4: Data Writes to Production
| Risk | Impact | Mitigation |
|------|--------|------------|
| Accidental writes corrupt production data | Data loss | Separate API namespace, explicit write permissions |

```typescript
// API route with explicit guards
// app/api/content-helper/analyze/route.ts

export async function POST(req: Request) {
  // Guard 1: Feature flag check
  if (!FEATURES.CONTENT_HELPER) {
    return Response.json({ error: 'Feature disabled' }, { status: 403 });
  }

  // Guard 2: Read-only for Phase 1
  // NO database writes in this endpoint
  const analysis = analyzeContent(draft, profile);

  return Response.json(analysis);
}
```

### Risk 5: Bundle Size Impact
| Risk | Impact | Mitigation |
|------|--------|------------|
| Feature bloats main bundle | Slower initial load | Lazy loading with dynamic import |

```typescript
// Lazy load entire feature
const ContentHelper = dynamic(
  () => import('@/features/content-helper').then(m => m.AnalysisPanel),
  {
    loading: () => null,
    ssr: false  // Client-only to reduce SSR bundle
  }
);
```

### Risk 6: API Route Conflicts
| Risk | Impact | Mitigation |
|------|--------|------------|
| New routes shadow existing ones | Broken endpoints | Use dedicated namespace `/api/content-helper/*` |

```
/api/
  /authors/          # Existing - untouched
  /camps/            # Existing - untouched
  /content-helper/   # New - isolated namespace
    /analyze/
    /profiles/
```

---

## 7. Testing Strategy

### Unit Tests (Pure Functions)

```typescript
// features/content-helper/__tests__/brake-logic.test.ts
import { calculateBrake } from '../lib/brake-logic';

describe('calculateBrake', () => {
  const mockProfile = {
    camp_positions: [
      { camp_id: 'camp-1', stance: 'advocate', weight: 5 },
    ],
    theme_keywords: {
      theme_a: ['keyword1', 'keyword2'],
    },
  };

  it('triggers warning when dominant camp not in profile', () => {
    const detected = [{ camp_id: 'camp-unknown', confidence: 0.9 }];
    const result = calculateBrake(detected, mockProfile, 'test text');

    expect(result?.triggered).toBe(true);
    expect(result?.severity).toBe('warning');
  });

  it('returns null when camps align with profile', () => {
    const detected = [{ camp_id: 'camp-1', confidence: 0.9 }];
    const result = calculateBrake(detected, mockProfile, 'keyword1 keyword2');

    expect(result).toBeNull();
  });
});
```

### Component Tests (Dumb UI)

```typescript
// features/content-helper/__tests__/BrakeCard.test.tsx
import { render, screen } from '@testing-library/react';
import { BrakeCard } from '../components/BrakeCard';

describe('BrakeCard', () => {
  it('renders warning severity correctly', () => {
    render(<BrakeCard severity="warning" reason="Test reason" />);

    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText('Test reason')).toBeInTheDocument();
  });
});
```

### Integration Tests (Isolated Page)

```typescript
// e2e/content-helper.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test.describe('Content Helper (isolated)', () => {
  test('analyzes draft and shows results', async ({ page }) => {
    await page.goto('/content-helper-dev');

    await page.fill('[data-testid="draft-input"]', 'AI scaling will solve everything');
    await page.click('[data-testid="analyze-button"]');

    await expect(page.locator('[data-testid="alignment-score"]')).toBeVisible();
  });
});
```

---

## 8. Rollout Plan

| Stage | Environment | Flag | Database |
|-------|-------------|------|----------|
| 1. Dev | Local | `true` | Mock data only |
| 2. Preview | Vercel Preview | `true` | Read-only prod replica |
| 3. Staging | Vercel Preview (staging branch) | `true` | Staging DB with real profile |
| 4. Canary | Production | `true` for allowlist | Production (read-only) |
| 5. GA | Production | `true` | Production |

### Rollback Triggers

- Any unhandled exception in Content Helper code
- >5% increase in page load time
- User reports of visual bugs outside Content Helper
- Any unexpected database writes

---

## 9. Implementation Order

```
Week 1: Foundation
├── Create /features/content-helper/ folder structure
├── Implement types.ts with all interfaces
├── Build pure lib functions (analyze, brake-logic)
├── Write unit tests for lib functions
└── Create standalone dev page

Week 2: UI Components
├── Build dumb components (BrakeCard, AlignmentScore, etc.)
├── Create AnalysisPanel composite component
├── Add component tests
├── Style with CSS Modules (ch- prefix)
└── Test in isolation at /content-helper-dev

Week 3: Integration
├── Create /api/content-helper/analyze endpoint
├── Build adapters for API calls
├── Create useContentAnalysis hook
├── Add feature flag infrastructure
└── Integration test full flow

Week 4: Soft Launch
├── Add lazy-loaded entry point to one existing page
├── Deploy to Preview with flag on
├── Internal testing
├── Fix issues, refine
└── Prepare for canary rollout
```

---

## 10. Checklist Before Integration

- [ ] All tests passing in isolation
- [ ] No imports from outside `/features/content-helper/` except React and types
- [ ] Feature flag working (toggle off = zero impact)
- [ ] Lazy loading confirmed (check bundle analyzer)
- [ ] CSS scoped (no global class names)
- [ ] No router usage inside feature
- [ ] No writes to production database
- [ ] Standalone dev page works end-to-end
- [ ] Error boundaries in place
- [ ] Rollback tested (flag off, redeploy, verify)

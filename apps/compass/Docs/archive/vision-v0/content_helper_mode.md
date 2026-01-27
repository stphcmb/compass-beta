# Editorial Analysis Mode - MVP Implementation Plan

## Overview

An on-demand editorial intelligence layer that compares user content drafts against their stated point of view (manifesto), surfacing alignment gaps, narrative skew, and citation strength.

### Core Outputs

| Output | Purpose |
|--------|---------|
| **Brake** | "This is too one-sided / off-narrative, don't ship yet." |
| **Mirror** | "Here's what we actually talk about vs what we say." |
| **Skew Warning** | "You're heavily leaning on X camps, totally ignoring Y that you claim to care about." |
| **Signal Strength** | "Our canon is thin here; treat this as directional, not authoritative." |

---

## 1. Database Architecture

### New Tables

```sql
-- User editorial profiles (manifestos)
CREATE TABLE editorial_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,  -- e.g., 'alin', 'internal'
  display_name TEXT NOT NULL,
  manifesto_raw TEXT,  -- Original markdown/text

  -- Structured position mapping
  camp_positions JSONB NOT NULL DEFAULT '[]',
  -- Format: [{ camp_id, stance: 'advocate'|'skeptic'|'neutral', weight: 1-5 }]

  -- Theme keywords for text matching
  theme_keywords JSONB NOT NULL DEFAULT '{}',
  -- Format: { "theme_name": ["keyword1", "keyword2"] }

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Draft analysis sessions
CREATE TABLE draft_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES editorial_profiles(id),
  draft_title TEXT,
  draft_content TEXT NOT NULL,

  -- Analysis results
  detected_camps JSONB,      -- [{ camp_id, confidence: 0-1, excerpts: [] }]
  alignment_score NUMERIC,   -- 0-100 overall alignment with manifesto
  skew_report JSONB,         -- { overrepresented: [], underrepresented: [], missing: [] }
  signal_strength JSONB,     -- { overall: 'strong'|'moderate'|'thin', by_camp: {} }
  brake_triggered BOOLEAN,   -- True if one-sidedness threshold exceeded
  mirror_data JSONB,         -- { stated_themes: [], actual_themes: [], gaps: [] }

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Alin's Manifesto → Structured Data

Based on Alin's manifesto, here's how it maps to camps:

```json
{
  "user_id": "alin",
  "display_name": "Alin",
  "camp_positions": [
    { "camp_id": "d8d3cec4-f8ce-49b1-9a43-bb0d952db371", "stance": "advocate", "weight": 5 },
    { "camp_id": "f19021ab-a8db-4363-adec-c2228dad6298", "stance": "advocate", "weight": 5 },
    { "camp_id": "fe9464df-b778-44c9-9593-7fb3294fa6c3", "stance": "advocate", "weight": 4 },
    { "camp_id": "7f64838f-59a6-4c87-8373-a023b9f448cc", "stance": "partial", "weight": 3 },
    { "camp_id": "76f0d8c5-c9a8-4a26-ae7e-18f787000e18", "stance": "partial", "weight": 3 },
    { "camp_id": "ee10cf4f-025a-47fc-be20-33d6756ec5cd", "stance": "advocate", "weight": 4 }
  ],
  "theme_keywords": {
    "augmentation_over_replacement": ["augment", "ironman suit", "empower", "unlock potential"],
    "people_and_processes": ["people", "processes", "transformation", "adapt", "AI-native"],
    "agentic_workforce": ["agentic", "agents", "digital team", "manager of AI"],
    "breaking_fourth_wall": ["fourth wall", "gatekeepers", "barriers", "enlightenment"],
    "societal_risk": ["sycophantic", "mental illness", "net negative", "safeguards"]
  }
}
```

#### Camp Position Reference

| Camp ID | Camp Name | Alin's Stance | Weight |
|---------|-----------|---------------|--------|
| `d8d3cec4-f8ce-49b1-9a43-bb0d952db371` | Human-AI Collaboration | Advocate | 5 |
| `f19021ab-a8db-4363-adec-c2228dad6298` | Co-Evolution | Advocate | 5 |
| `fe9464df-b778-44c9-9593-7fb3294fa6c3` | Business Whisperers | Advocate | 4 |
| `ee10cf4f-025a-47fc-be20-33d6756ec5cd` | Adaptive Governance | Advocate | 4 |
| `7f64838f-59a6-4c87-8373-a023b9f448cc` | Safety First | Partial | 3 |
| `76f0d8c5-c9a8-4a26-ae7e-18f787000e18` | Displacement Realist | Partial | 3 |

---

## 2. UI/UX Design

### Entry Point: Analysis Toggle

Location: Top-right of any content creation/editing view (or as a floating action button)

```
┌─────────────────────────────────────────────────┐
│ [Draft Editor]                    [👁 Analyze ▼] │
│                                                 │
│ Your draft content here...                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Analysis Panel (Slide-over or Modal)

```
┌─────────────────────────────────────────────────┐
│ Editorial Analysis               Profile: Alin  │
├─────────────────────────────────────────────────┤
│                                                 │
│ 🎯 ALIGNMENT SCORE: 72/100                      │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░                           │
│                                                 │
├─────────────────────────────────────────────────┤
│ ⚠️  BRAKE                                       │
│ ─────────────────────────────────────────────── │
│ Heavy lean toward "Scaling Will Deliver"        │
│ without acknowledging your stated concerns      │
│ about societal risk. Consider balance.          │
│                                                 │
├─────────────────────────────────────────────────┤
│ 🪞 MIRROR                                       │
│ ─────────────────────────────────────────────── │
│ You SAY:              You WRITE ABOUT:          │
│ • Augmentation ✓      • Augmentation (3×)       │
│ • Societal risk       • [missing]               │
│ • Agentic workforce   • Agents (1×)             │
│                                                 │
├─────────────────────────────────────────────────┤
│ ⚖️  SKEW                                        │
│ ─────────────────────────────────────────────── │
│ Over: Technology Leads, Scaling Will Deliver    │
│ Under: Safety First, Displacement Realist       │
│                                                 │
├─────────────────────────────────────────────────┤
│ 📊 SIGNAL STRENGTH                              │
│ ─────────────────────────────────────────────── │
│ Canon depth: MODERATE                           │
│ • Human-AI Collab: 12 authors cited ✓           │
│ • Adaptive Governance: 3 authors (thin)         │
│                                                 │
│ "Treat governance claims as directional."       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Interaction Flow

1. **Paste/Write Draft** → User enters content
2. **Click "Analyze"** → Sends to analysis engine
3. **View Results** → Panel slides in with 4-section report
4. **Iterate** → User revises, re-analyzes until satisfied
5. **Ship** → Brake clears, content approved

---

## 3. Analysis Engine Architecture

### Core Types

```typescript
interface AnalysisResult {
  alignmentScore: number;          // 0-100
  brake: BrakeReport | null;
  mirror: MirrorReport;
  skew: SkewReport;
  signalStrength: SignalReport;
}

interface BrakeReport {
  triggered: boolean;
  severity: 'warning' | 'stop';
  reason: string;
  dominant_camps: string[];
  missing_themes: string[];
}

interface MirrorReport {
  stated_themes: { name: string; weight: number }[];
  actual_themes: { name: string; mentions: number; excerpts: string[] }[];
  gaps: string[];           // Themes you claim but don't write about
  surprises: string[];      // Themes you write about but don't claim
}

interface SkewReport {
  overrepresented: { camp: string; expected: number; actual: number }[];
  underrepresented: { camp: string; expected: number; actual: number }[];
  missing: string[];        // Camps with 0 coverage
}

interface SignalReport {
  overall: 'strong' | 'moderate' | 'thin';
  by_camp: { [camp_id: string]: { author_count: number; strength: string } };
  warnings: string[];       // "Treat X claims as directional"
}
```

### Detection Pipeline

```
Draft Text
    │
    ▼
┌─────────────────┐
│ 1. Camp Detection│ → Keyword matching + semantic similarity
│    (per paragraph)│   against camp descriptions/quotes
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ 2. Theme Extraction│ → Match against profile's theme_keywords
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ 3. Skew Calculation│ → Compare detected vs expected (from profile)
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ 4. Signal Lookup │ → Count authors per detected camp in DB
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ 5. Brake Logic  │ → If skew > threshold OR missing critical themes
└─────────────────┘
    │
    ▼
  AnalysisResult
```

---

## 4. MVP Scope & Phasing

### Phase 1: Foundation (MVP)
- [ ] Create `editorial_profiles` table
- [ ] Seed Alin's profile with camp mappings
- [ ] Build basic keyword-based camp detection
- [ ] Create analysis API endpoint (`/api/analyze-draft`)
- [ ] Build minimal analysis panel UI (alignment score + brake only)

### Phase 2: Full Analysis
- [ ] Add Mirror report (stated vs actual themes)
- [ ] Add Skew report with camp breakdown
- [ ] Signal strength calculation from author counts
- [ ] Store analysis history in `draft_analyses`

### Phase 3: Enhancement
- [ ] Multiple user profiles
- [ ] Semantic analysis (embeddings) for better camp detection
- [ ] Suggestion engine ("Add a quote from X camp")
- [ ] Integration with content publishing workflow

---

## 5. Risks & Fallbacks

| Risk | Impact | Fallback |
|------|--------|----------|
| **Keyword matching too crude** | False positives/negatives in camp detection | Start with high-confidence keywords only; show "low confidence" badge; Phase 3 adds embeddings |
| **Manifesto-to-camp mapping is subjective** | Brake triggers inappropriately | Make thresholds configurable per profile; "snooze" option for false positives |
| **Signal strength misleading** | User thinks thin = wrong | Clear copy: "Thin ≠ invalid, just less corroborated in our database" |
| **Analysis feels prescriptive** | User rejects tool | Frame as "reflection" not "judgment"; never block publishing |
| **Performance with large drafts** | Slow analysis | Chunk processing; show progress indicator; cache camp keyword indices |
| **Profile drift over time** | Manifesto outdates | Quarterly profile review prompt; version history on profiles |

### Graceful Degradation

```typescript
// If analysis fails, return partial results
function analyzeWithFallback(draft: string, profile: EditorialProfile): AnalysisResult {
  try {
    return fullAnalysis(draft, profile);
  } catch (e) {
    // Return what we can
    return {
      alignmentScore: null,  // Shows "Unable to calculate"
      brake: null,           // No brake = don't block
      mirror: partialMirror(draft, profile),  // Just theme extraction
      skew: null,
      signalStrength: { overall: 'unknown', by_camp: {}, warnings: ['Full analysis unavailable'] }
    };
  }
}
```

---

## 6. Technical Implementation

### Camp Detection (MVP Approach)

For each camp, maintain a keyword set derived from:
1. Camp description
2. Camp `why_it_matters` text from camp_authors
3. Key author quotes

```typescript
const CAMP_KEYWORDS: Record<string, string[]> = {
  'c5dcb027-cd27-4c91-adb4-aca780d15199': [  // Scaling Will Deliver
    'scaling', 'scale', 'compute', 'parameters', 'emergent', 'GPT-5',
    'frontier', 'capabilities', 'bigger models'
  ],
  '7f64838f-59a6-4c87-8373-a023b9f448cc': [  // Safety First
    'alignment', 'existential', 'x-risk', 'pause', 'safety', 'oversight',
    'catastrophic', 'control problem'
  ],
  // ... etc
};

function detectCamps(text: string): DetectedCamp[] {
  const words = text.toLowerCase().split(/\s+/);
  const results: DetectedCamp[] = [];

  for (const [campId, keywords] of Object.entries(CAMP_KEYWORDS)) {
    const matches = keywords.filter(kw => text.toLowerCase().includes(kw));
    if (matches.length > 0) {
      results.push({
        camp_id: campId,
        confidence: Math.min(matches.length / 3, 1),  // 3+ matches = high confidence
        matched_keywords: matches
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}
```

### Brake Logic

```typescript
function calculateBrake(
  detected: DetectedCamp[],
  profile: EditorialProfile,
  text: string
): BrakeReport | null {
  const advocatedCamps = profile.camp_positions
    .filter(p => p.stance === 'advocate')
    .map(p => p.camp_id);

  const detectedIds = detected.map(d => d.camp_id);

  // Check 1: Is there a dominant camp not in user's advocacy list?
  const topCamp = detected[0];
  if (topCamp && topCamp.confidence > 0.7 && !advocatedCamps.includes(topCamp.camp_id)) {
    return {
      triggered: true,
      severity: 'warning',
      reason: `Heavy lean toward "${getCampName(topCamp.camp_id)}" which isn't in your stated positions`,
      dominant_camps: [topCamp.camp_id],
      missing_themes: []
    };
  }

  // Check 2: Are critical themes completely missing?
  const criticalThemes = Object.keys(profile.theme_keywords);
  const mentionedThemes = criticalThemes.filter(theme =>
    profile.theme_keywords[theme].some(kw => text.toLowerCase().includes(kw))
  );

  const missingCritical = criticalThemes.filter(t => !mentionedThemes.includes(t));
  if (missingCritical.length > criticalThemes.length * 0.6) {
    return {
      triggered: true,
      severity: 'stop',
      reason: `Missing ${missingCritical.length} of your ${criticalThemes.length} core themes`,
      dominant_camps: [],
      missing_themes: missingCritical
    };
  }

  return null;
}
```

---

## 7. File Structure

```
/lib/
  /editorial/
    analyze.ts          # Core analysis engine
    camp-keywords.ts    # Camp keyword mappings
    types.ts            # TypeScript interfaces

/app/api/
  /analyze-draft/
    route.ts            # POST endpoint for analysis

/components/
  /editorial/
    AnalysisPanel.tsx   # Slide-over results panel
    BrakeCard.tsx       # Brake warning display
    MirrorChart.tsx     # Stated vs actual visualization
    SkewIndicator.tsx   # Camp balance display
    SignalBadge.tsx     # Signal strength indicator

/Docs/data/seed/
  editorial_profiles.sql  # Alin's profile seed data
```

---

## 8. Open Questions

1. **Where does the editor live?** Is this a new page in Compass, or integration with an external tool (Notion, Google Docs)?
2. **Profile management UI?** Should users be able to edit their manifesto/camp positions, or is this admin-only?
3. **History tracking?** Should we store all draft analyses for longitudinal insight?
4. **LLM integration?** For Phase 3, should we use Claude API for semantic analysis instead of keywords?

---

## 9. Success Metrics

- **Adoption**: % of drafts that go through analysis before shipping
- **Iteration rate**: Average re-analyses per draft (shows tool is useful for refinement)
- **Brake accuracy**: False positive rate on brake triggers (survey users)
- **Time to ship**: Does analysis speed up or slow down publishing?

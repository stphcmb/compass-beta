# Preference-Learning Content Generation Loop

## Overview

Add a feedback-driven content generation system to the AI Editor that learns from user approvals and generates increasingly personalized content. Users act as "editorial reviewers" - as they approve outputs, the system learns their preferences and produces more aligned content.

**The Goal: Reducing Friction Over Time**

Each interaction should teach the system something, so that:
- Draft 1: User provides everything, AI suggests broadly
- Draft 5: System knows their style, suggests more precisely
- Draft 20: System anticipates their needs, minimal input required

---

## What We Need to Learn About Users

### 1. Writing Style & Tone

| Dimension | Examples | How to Learn |
|-----------|----------|--------------|
| Formality | Academic vs conversational | Analyze their submitted drafts |
| Technical depth | Jargon-heavy vs accessible | Compare vocabulary to audience level |
| Voice | Authoritative, questioning, provocative | Pattern detection in their writing |
| Structure | Long-form essays vs punchy threads | Observe output preferences |

### 2. Topical Focus & Expertise

| Dimension | Examples | How to Learn |
|-----------|----------|--------------|
| Primary domains | AI governance, technical safety, ethics | Track topics in submitted drafts |
| Depth of knowledge | Expert vs learning | Vocabulary sophistication analysis |
| Recurring themes | "I always write about X" | Frequency analysis over time |

### 3. Stances & Perspectives

| Dimension | Examples | How to Learn |
|-----------|----------|--------------|
| Camp alignments | Pro-regulation, techno-optimist | Feedback on camp suggestions |
| Author affinities | "I cite Yoshua Bengio often" | Track helpful author feedback |
| Contrarian vs consensus | Challenge mainstream or align | Observe which perspectives they adopt |

### 4. Organizational Context

| Dimension | Examples | How to Learn |
|-----------|----------|--------------|
| Brand voice | "We're bold and direct" | User uploads style guide |
| Forbidden topics | "Never mention competitor X" | Explicit rules input |
| Required elements | "Always include data points" | Learn from edits they make |
| Audience | B2B executives, general public | User specifies or we infer |

### 5. Workflow Preferences

| Dimension | Examples | How to Learn |
|-----------|----------|--------------|
| Iteration style | Quick drafts vs polished first attempts | Track revision patterns |
| Feedback acceptance | Takes all suggestions vs selective | Monitor accept/reject ratio |
| Length preferences | 500 words vs 2000 words | Track output lengths |

---

## Input Mechanisms Required

### A. Passive Learning (from behavior)

```
1. DRAFT ANALYSIS
   - User submits text → We analyze:
     • Vocabulary level (technical score 1-10)
     • Sentence complexity
     • Tone markers (formal/casual/provocative)
     • Topics mentioned
   - Store as "writing_style_samples"

2. FEEDBACK TRACKING
   - 👍/👎 on camps/authors → preference signals
   - Which suggestions they copy → what resonates
   - Which they ignore → what doesn't fit

3. EDIT TRACKING (powerful!)
   - AI suggests: "Consider mentioning AI safety concerns"
   - User edits it to: "Consider the alignment problem specifically"
   - System learns: User prefers technical precision over general framing
```

### B. Active Input (from user)

```
1. ONBOARDING (optional, ~2 min)
   - "What do you primarily write?" [LinkedIn posts, blog articles, reports]
   - "Describe your audience" [Technical peers, general public, executives]
   - "How would you describe your voice?" [Direct, nuanced, provocative]

2. STYLE GUIDE UPLOAD
   - Upload PDF/doc of company content guidelines
   - System extracts: tone rules, forbidden words, required disclaimers

3. EXAMPLE CONTENT
   - "Paste 2-3 pieces you've written that represent your style"
   - System analyzes and builds style profile

4. EXPLICIT PREFERENCES
   - Settings page: "I prefer [technical/accessible] explanations"
   - "Default perspective: [balanced/contrarian/consensus-building]"
```

### C. Contextual Input (per session)

```
For each new draft:
- "What's the goal?" [Inform, persuade, provoke discussion]
- "Who's the audience?" [Use saved audiences or specify new]
- "What length?" [Thread, short post, long article]
- "Any specific angle?" [Free text]

Over time, these become defaults:
- "Same as usual" (one click)
- System pre-fills based on patterns
```

---

## The Learning Loop

```
┌─────────────────────────────────────────────────────────────┐
│                     USER SUBMITS DRAFT                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ANALYZE DRAFT                                               │
│  • Extract tone markers                                      │
│  • Identify topics                                           │
│  • Detect vocabulary level                                   │
│  • Compare to previous samples                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  GENERATE SUGGESTIONS (personalized)                         │
│  • Use learned style preferences                             │
│  • Prioritize aligned camps/authors                          │
│  • Apply content guidelines                                  │
│  • Match tone to user's patterns                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  USER INTERACTS WITH RESULTS                                 │
│  • 👍/👎 on suggestions                                      │
│  • Copies some text                                          │
│  • Ignores other parts                                       │
│  • Edits AI suggestions before using                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  UPDATE PREFERENCES                                          │
│  • Adjust camp/author scores                                 │
│  • Refine style profile                                      │
│  • Learn from edits (what they changed)                      │
│  • Increase confidence in preferences                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    NEXT DRAFT IS EASIER
```

---

## MVP Implementation (Revised for Speed)

### Design Philosophy: The Editor's Memory

Think of this as building a **senior editor's institutional memory**. A great editor:
- Remembers your voice after reading a few pieces
- Knows which sources you trust and cite
- Understands your blind spots and gently challenges them
- Gets better with every draft they review

**Key Insight:** With only 1-2 main users, skip all onboarding/dashboard UI. Focus on:
1. **Narrative Memory** - Persistent context that accumulates learnings
2. **Sample Writing Import** - One-off analysis of existing work (CRITICAL)
3. **Style Guidelines** - Rules the editor always applies (CRITICAL)
4. **Fast Loop** - draft → AI feedback → revised draft → AI feedback → publish

---

### MVP Checklist (Prioritized for Loop Velocity)

#### Sprint 1: Foundation + Sample Import (CRITICAL PATH)

- [ ] **Database migration** - Create `editor_memory` table (simplified schema)
- [ ] **Sample writing import script** - One-off script to analyze 3-5 writing samples
- [ ] **Style guidelines table** - Store explicit rules ("always cite data", "avoid jargon")
- [ ] **Narrative memory injection** - Modify `gemini.ts` to include learned context

```sql
-- Simplified schema focused on narrative memory
CREATE TABLE editor_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  memory_type TEXT NOT NULL,  -- 'voice'|'stance'|'guideline'|'sample_insight'
  content TEXT NOT NULL,       -- Natural language memory
  source TEXT,                 -- Where this was learned from
  confidence DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Examples of what goes in editor_memory:
-- ('voice', 'Writes in a formal but accessible tone, avoids jargon, uses "we" not "I"', 'sample_analysis')
-- ('stance', 'Generally supports AI regulation but skeptical of self-regulation', 'feedback_pattern')
-- ('guideline', 'Always include data citations for claims', 'user_input')
-- ('sample_insight', 'Frequently cites Yoshua Bengio and Stuart Russell', 'sample_analysis')
```

#### Sprint 2: Feedback Loop (In-Session Learning)

- [ ] **Inline feedback capture** - Simple 👍/👎 on suggestions (no modal/stance)
- [ ] **Session memory** - Track what user accepts/rejects within session
- [ ] **Iterative refinement API** - `/api/brain/refine` endpoint
- [ ] **Memory consolidation** - After session, extract learnings to `editor_memory`

```
LOOP FLOW:
┌────────────────────────────────────────────────────────────────┐
│  User submits draft                                            │
│       ↓                                                        │
│  AI analyzes (with editor_memory context)                      │
│       ↓                                                        │
│  User sees suggestions, clicks 👍/👎 inline                    │
│       ↓                                                        │
│  User revises draft                                            │
│       ↓                                                        │
│  "Refine again" → AI re-analyzes (with session context)        │
│       ↓                                                        │
│  Repeat until satisfied                                        │
│       ↓                                                        │
│  On session end: consolidate learnings → editor_memory         │
└────────────────────────────────────────────────────────────────┘
```

#### Sprint 3: Style Guidelines + Evaluation

- [ ] **Style guidelines input** - Simple textarea/file upload in settings
- [ ] **Guidelines parsing** - Extract rules from uploaded doc or text
- [ ] **"Check My Content" mode** - Evaluate draft against learned preferences
- [ ] **Editor report** - "Here's what your editor would say about this draft"

---

### One-Off Setup Scripts (Run Once Per User)

Since we have 1-2 main users, create scripts rather than UI:

```typescript
// scripts/import-writing-samples.ts
// Run: npx ts-node scripts/import-writing-samples.ts --user=user_xxx

// Analyzes 3-5 writing samples and populates editor_memory with:
// - Voice patterns (tone, formality, sentence structure)
// - Frequently cited authors
// - Recurring topics and stances
// - Vocabulary preferences
```

```typescript
// scripts/import-style-guide.ts
// Run: npx ts-node scripts/import-style-guide.ts --user=user_xxx --file=style-guide.md

// Parses style guide and creates guideline memories:
// - "Always use 'we' not 'I'"
// - "Cite data for all claims"
// - "Avoid mentioning competitors by name"
```

---

### Narrative Memory Format

Instead of structured JSON preferences, use **natural language memories** that inject directly into prompts:

```typescript
// In gemini.ts
function buildEditorContext(memories: EditorMemory[]): string {
  const voiceMemories = memories.filter(m => m.memory_type === 'voice')
  const stanceMemories = memories.filter(m => m.memory_type === 'stance')
  const guidelines = memories.filter(m => m.memory_type === 'guideline')

  return `
## EDITOR'S MEMORY (You are a senior editor who knows this writer well)

### Their Voice
${voiceMemories.map(m => `- ${m.content}`).join('\n')}

### Their Stances & Perspectives
${stanceMemories.map(m => `- ${m.content}`).join('\n')}

### Editorial Guidelines (Always Apply)
${guidelines.map(m => `- ${m.content}`).join('\n')}

Use this knowledge to give feedback like a trusted editor who has worked with this writer for years.
---
`
}
```

---

### MVP Files to Create

| File | Purpose | Sprint |
|------|---------|--------|
| `supabase/migrations/xxx_editor_memory.sql` | Database schema for narrative memory | 1 |
| `scripts/import-writing-samples.ts` | One-off: analyze user's existing writing | 1 |
| `scripts/import-style-guide.ts` | One-off: parse style guidelines | 1 |
| `lib/ai-editor/editor-memory.ts` | Fetch & build editor context for prompts | 1 |
| `app/api/memory/route.ts` | CRUD for editor memories | 1 |
| `components/ai-editor/InlineFeedback.tsx` | Simple 👍/👎 on suggestions | 2 |
| `app/api/brain/refine/route.ts` | Iterative refinement within session | 2 |
| `lib/ai-editor/session-memory.ts` | Track accepts/rejects within session | 2 |
| `app/api/brain/evaluate/route.ts` | "Check My Content" evaluation | 3 |
| `lib/ai-editor/evaluation.ts` | Evaluation logic against learned prefs | 3 |

### MVP Files to Modify

| File | Changes | Sprint |
|------|---------|--------|
| `lib/ai-editor/gemini.ts` | Inject editor memory context into prompts | 1 |
| `app/api/brain/analyze/route.ts` | Fetch user's editor memory before analysis | 1 |
| `components/AIEditorResults.tsx` | Add InlineFeedback to camp/author cards | 2 |
| `components/AIEditor.tsx` | Add "Refine Again" button, track session | 2 |

---

### Deferred (Not MVP)

- ~~Onboarding flow~~ → Use import scripts
- ~~Preference dashboard UI~~ → Just use database directly
- ~~Complex feedback modals~~ → Simple inline 👍/👎
- ~~Sync from localStorage~~ → Fresh start with new system
- ~~Per-analysis preference recalculation~~ → Consolidate at session end

---

## Original Implementation Checklist (Reference Only)

<details>
<summary>Click to expand original phased plan</summary>

### Phase 0: Input Collection Foundation (MUST DO FIRST)

Before building preference learning, we need input mechanisms:

- [ ] **FeedbackButton component** - 👍/👎 on camps/authors in results
- [ ] **Integrate into AIEditor.tsx** - Add buttons to each camp and author card
- [ ] **Feedback storage** - Save to `user_feedback` table
- [ ] **Draft analysis service** - Extract style signals from submitted text
- [ ] **Writing profile storage** - Save analyzed patterns to `user_writing_profile`

### Phase 1: MVP - Feedback Collection & Basic Personalization

- [ ] **Database Schema** - Create migration for all preference tables
- [ ] **Preference Logic** - Create `/lib/ai-editor/preferences.ts`
- [ ] **API: Preferences CRUD** - Create `/api/preferences/route.ts`
- [ ] **API: Sync** - Create `/api/preferences/sync/route.ts`
- [ ] **API: Feedback** - Create `/api/feedback/route.ts`
- [ ] **Component: PreferencesDashboard** - Create `/components/PreferencesDashboard.tsx`
- [ ] **Modify gemini.ts** - Add preference context injection
- [ ] **Modify analyze/route.ts** - Fetch and pass user preferences
- [ ] **Modify history/page.tsx** - Add PreferencesDashboard section

### Phase 1.5: "Check My Content" Feature (MVP)

- [ ] **Evaluation Logic** - Create `/lib/ai-editor/evaluation.ts`
- [ ] **API: Evaluate** - Create `/api/brain/evaluate/route.ts`
- [ ] **Component: ContentEvaluator** - Create `/components/ai-editor/ContentEvaluator.tsx`
- [ ] **Component: EvaluationResults** - Create `/components/ai-editor/EvaluationResults.tsx`

### Phase 2: Enhanced Input Collection

- [ ] **Onboarding flow** - Quick preference questionnaire for new users
- [ ] **Style guide upload** - Parse and store company content rules
- [ ] **Edit tracking** - Learn from how users modify AI suggestions
- [ ] **Example content analysis** - Analyze uploaded writing samples

### Phase 3: Continuous Generation Loop (Future)

- [ ] **API: Generate Similar** - Create `/api/brain/generate-similar/route.ts`
- [ ] **Component: GenerateMorePanel** - Create UI for variation selection
- [ ] **Iterative Refinement** - Deepen/Broaden/Simplify/Challenge options

### Phase 4: Auto-Refinement (Future)

- [ ] **API: Refine Draft** - Create `/api/brain/refine-draft/route.ts`
- [ ] **Auto-suggestions UI** - Incorporate missing perspectives automatically

</details>

---

## Database Schema (Supabase)

```sql
-- =====================================================
-- CORE FEEDBACK & PREFERENCES
-- =====================================================

-- Feedback Events (the raw input data)
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  analysis_id TEXT NOT NULL,
  feedback_type TEXT NOT NULL,             -- 'summary'|'camp'|'author'
  target_id TEXT,                          -- camp_id or author_id
  target_name TEXT,
  rating TEXT NOT NULL,                    -- 'helpful'|'not_helpful'
  stance TEXT,                             -- 'agree'|'disagree'|'learn_more' (optional)
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (clerk_user_id, analysis_id, feedback_type, target_id)
);

-- Calculated Preference Profile (derived from feedback)
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  preferred_camps JSONB DEFAULT '{}',      -- {"camp-id": score 0-100}
  preferred_authors JSONB DEFAULT '{}',    -- {"author-id": score 0-100}
  preferred_domains JSONB DEFAULT '{}',    -- {"AI & Society": score}
  total_feedback_items INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- WRITING STYLE PROFILE (learned from drafts)
-- =====================================================

-- User's learned writing profile
CREATE TABLE user_writing_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,

  -- Tone & Style (learned from draft analysis)
  formality_score DECIMAL(3,2),            -- 0.0 (casual) to 1.0 (formal)
  technical_depth DECIMAL(3,2),            -- 0.0 (accessible) to 1.0 (expert)
  avg_sentence_length DECIMAL(5,2),
  vocabulary_level TEXT,                   -- 'general'|'professional'|'academic'

  -- Content patterns
  primary_topics JSONB DEFAULT '[]',       -- ["AI governance", "ethics"]
  writing_samples_analyzed INTEGER DEFAULT 0,

  -- Explicit preferences (from onboarding or settings)
  preferred_tone TEXT,                     -- 'direct'|'nuanced'|'provocative'
  default_audience TEXT,
  default_content_type TEXT,               -- 'linkedin'|'blog'|'report'

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- ORGANIZATIONAL CONTEXT
-- =====================================================

-- Company/org content guidelines
CREATE TABLE content_guidelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  name TEXT NOT NULL,                      -- "Acme Corp Brand Voice"

  -- Rules
  tone_description TEXT,
  forbidden_words JSONB DEFAULT '[]',
  required_elements JSONB DEFAULT '[]',    -- ["data citation", "disclaimer"]
  example_content TEXT,

  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TOPIC-SPECIFIC STANCES
-- =====================================================

-- Per-topic stance learning
CREATE TABLE user_stances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  topic TEXT NOT NULL,                     -- "AI regulation"
  stance TEXT,                             -- 'supportive'|'critical'|'nuanced'
  aligned_camps JSONB DEFAULT '[]',
  aligned_authors JSONB DEFAULT '[]',
  confidence DECIMAL(3,2),                 -- How sure we are (based on # of signals)

  UNIQUE(clerk_user_id, topic)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_feedback_clerk ON user_feedback(clerk_user_id);
CREATE INDEX idx_feedback_type ON user_feedback(feedback_type);
CREATE INDEX idx_prefs_clerk ON user_preferences(clerk_user_id);
CREATE INDEX idx_writing_clerk ON user_writing_profile(clerk_user_id);
CREATE INDEX idx_guidelines_clerk ON content_guidelines(clerk_user_id);
CREATE INDEX idx_stances_clerk ON user_stances(clerk_user_id);
```

---

## API Endpoints

### Feedback & Preferences

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/feedback` | POST | Submit 👍/👎 feedback, triggers preference recalculation |
| `/api/preferences` | GET/PUT | Fetch/update user preference profile |
| `/api/preferences/sync` | POST | Migrate localStorage `helpfulInsights` to DB |

### Writing Profile

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/profile/writing` | GET/PUT | Fetch/update writing style profile |
| `/api/profile/analyze-sample` | POST | Analyze a writing sample to update profile |
| `/api/profile/onboarding` | POST | Save onboarding questionnaire responses |

### Content Guidelines

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/guidelines` | GET/POST/PUT/DELETE | CRUD for content guidelines |
| `/api/guidelines/parse` | POST | Parse uploaded style guide document |

### Content Evaluation

```typescript
POST /api/brain/evaluate
{
  content: string,
  evaluationMode: 'alignment' | 'coverage' | 'comprehensive'
}

Response:
{
  overallScore: number,           // 0-100 alignment with preferences
  alignmentScore: number,         // How well it matches preferred perspectives
  coverageScore: number,          // How comprehensively it covers topics
  styleMatch: number,             // How well it matches their writing style
  strengths: string[],            // What aligns well
  weaknesses: string[],           // What doesn't align
  missingPerspectives: [{         // Perspectives user typically includes
    camp: string,
    reason: string,
    importance: 'high' | 'medium' | 'low'
  }],
  authorRecommendations: [{       // Authors to cite based on history
    author: string,
    reason: string,
    quote?: string
  }],
  styleNotes: string[]            // Notes on tone/style alignment
}
```

---

## Files to Create

### Phase 0: Input Collection Foundation

| File | Purpose |
|------|---------|
| `/components/ai-editor/FeedbackButton.tsx` | Reusable 👍/👎 feedback UI |
| `/lib/ai-editor/style-analyzer.ts` | Analyze draft text for style signals |
| `/app/api/feedback/route.ts` | Submit feedback endpoint |

### Phase 1: Preferences

| File | Purpose |
|------|---------|
| `/app/api/preferences/route.ts` | Preferences CRUD |
| `/app/api/preferences/sync/route.ts` | localStorage migration |
| `/lib/ai-editor/preferences.ts` | Preference calculation logic |
| `/components/PreferencesDashboard.tsx` | Preference visualization |

### Phase 1.5: Content Evaluation

| File | Purpose |
|------|---------|
| `/app/api/brain/evaluate/route.ts` | Content evaluation endpoint |
| `/lib/ai-editor/evaluation.ts` | Evaluation logic and prompts |
| `/components/ai-editor/ContentEvaluator.tsx` | Evaluation UI |
| `/components/ai-editor/EvaluationResults.tsx` | Results display |

### Phase 2: Enhanced Input

| File | Purpose |
|------|---------|
| `/app/api/profile/writing/route.ts` | Writing profile CRUD |
| `/app/api/profile/analyze-sample/route.ts` | Analyze writing samples |
| `/app/api/guidelines/route.ts` | Content guidelines CRUD |
| `/components/onboarding/PreferenceOnboarding.tsx` | Onboarding questionnaire |
| `/components/settings/ContentGuidelinesEditor.tsx` | Guidelines management UI |

---

## Files to Modify

| File | Changes |
|------|---------|
| `/components/AIEditor.tsx` | Add FeedbackButton to camp/author results |
| `/components/AIEditorResults.tsx` | Add FeedbackButton to results display |
| `/lib/ai-editor/gemini.ts` | Add preference context injection |
| `/lib/ai-editor/analyzer.ts` | Add draft style analysis |
| `/app/api/brain/analyze/route.ts` | Fetch and pass user preferences |
| `/app/history/page.tsx` | Add PreferencesDashboard section |

---

## UI Components

### 1. Feedback Buttons (Phase 0 - Critical)

```
Current UI:
┌─────────────────────────────────────┐
│ Camp: AI Safety Advocates           │
│ [💾 Save]                           │  ← Only saves, no preference signal
└─────────────────────────────────────┘

New UI:
┌─────────────────────────────────────┐
│ Camp: AI Safety Advocates           │
│ [👍 Helpful] [👎 Not relevant]      │  ← Clear preference signal
│                                     │
│ Optional follow-up (on 👍):         │
│ ○ I agree with this view            │
│ ○ I disagree but it's useful        │
│ ○ I want to learn more              │
└─────────────────────────────────────┘
```

### 2. Preference Dashboard (Phase 1)

- Display "Your top camps" and "Favorite authors" derived from feedback
- Show preference scores as visual bars
- Show writing style summary (formality, technical depth)
- Allow manual preference adjustments

### 3. Onboarding Flow (Phase 2)

```
Step 1: "What do you primarily write?"
  [ ] LinkedIn posts
  [ ] Blog articles
  [ ] Reports/whitepapers
  [ ] Academic papers
  [ ] Other: ________

Step 2: "Describe your typical audience"
  [ ] Technical peers (engineers, researchers)
  [ ] Business executives
  [ ] General public
  [ ] Policy makers
  [ ] Other: ________

Step 3: "How would you describe your writing voice?"
  [ ] Direct and assertive
  [ ] Nuanced and balanced
  [ ] Provocative and challenging
  [ ] Educational and accessible

Step 4 (optional): "Paste an example of your writing"
  [                                    ]
  [     Textarea for sample content    ]
  [                                    ]
```

### 4. Content Evaluator UI (Phase 1.5)

- Textarea to paste content for evaluation
- Evaluation mode selector (alignment/coverage/comprehensive)
- Results dashboard with:
  - Score meters (overall, alignment, coverage, style match)
  - Strengths list (green checkmarks)
  - Weaknesses list (amber alerts)
  - Missing perspectives user typically includes
  - Author recommendations based on preference history
  - Style notes (tone alignment feedback)

---

## Code Integration Points

### Draft Analysis (in analyzer.ts)

```typescript
// When user submits draft, also analyze their writing style
export async function analyzeTextWithStyleLearning(
  text: string,
  userId?: string
): Promise<AnalysisResult> {
  // Existing analysis
  const analysisResult = await analyzeText(text)

  // NEW: Extract style signals for learning
  if (userId) {
    const styleSignals = extractStyleSignals(text)
    await updateWritingProfile(userId, styleSignals)
  }

  return analysisResult
}

function extractStyleSignals(text: string): StyleSignals {
  return {
    wordCount: countWords(text),
    avgSentenceLength: calculateAvgSentenceLength(text),
    vocabularyLevel: assessVocabularyLevel(text),
    formalityMarkers: detectFormalityMarkers(text),
    technicalTerms: extractTechnicalTerms(text),
    topics: extractTopics(text)
  }
}
```

### Preference Context Injection (in gemini.ts)

```typescript
// Add before existing prompt when user has sufficient data
function buildPreferenceContext(profile: UserProfile): string {
  if (profile.totalFeedbackItems < 5) {
    return '' // Not enough data yet
  }

  return `
USER PREFERENCES (personalize results):
- Preferred perspectives: ${profile.topCamps.join(', ')}
- Trusted authors: ${profile.topAuthors.join(', ')}
- Writing style: ${profile.writingStyle.vocabularyLevel}, ${profile.writingStyle.formality}
- Typical topics: ${profile.primaryTopics.join(', ')}

Prioritize these when relevant, but maintain diverse perspectives.
Apply their preferred tone and technical depth to explanations.
---
`
}
```

### Feedback Handler

```typescript
// POST /api/feedback
export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return unauthorized()

  const { analysisId, feedbackType, targetId, targetName, rating, stance } = await req.json()

  // 1. Store the feedback event
  await supabase.from('user_feedback').upsert({
    clerk_user_id: userId,
    analysis_id: analysisId,
    feedback_type: feedbackType,
    target_id: targetId,
    target_name: targetName,
    rating,
    stance
  })

  // 2. Recalculate preference scores
  await recalculatePreferences(userId)

  // 3. Update stance if topic can be inferred
  if (feedbackType === 'camp' && stance) {
    await updateUserStance(userId, targetId, stance)
  }

  return Response.json({ success: true })
}
```

---

## Key Design Decisions

1. **Authentication required** - All preference features require Clerk login (no anonymous fallback)
2. **Implicit learning first** - Learn from behavior before asking explicit questions
3. **Feedback is the foundation** - 👍/👎 buttons are the primary input mechanism
4. **Gradual personalization** - Only inject preferences after 5+ feedback items
5. **Style learning from drafts** - Analyze every submitted text to learn writing patterns
6. **Preferences enhance, don't replace** - Always maintain diverse perspectives
7. **Organizational context optional** - Style guides are a power feature, not required
8. **Progressive disclosure** - Start simple, reveal advanced features over time

---

## MVP Input Features (Prioritized)

### Must Have (Phase 0 + 1)

1. **Feedback buttons** (👍/👎) on camps/authors in results
2. **Feedback storage** in database
3. **Preference calculation** from feedback signals
4. **Basic preference injection** into prompts

### Should Have (Phase 1.5 + 2)

5. **Draft style analysis** - extract signals from submitted text
6. **Writing profile storage** - persist style patterns
7. **Onboarding flow** - quick preference questionnaire
8. **Content evaluation** - "Check My Content" feature

### Nice to Have (Phase 3+)

9. **Style guide upload** - parse company content rules
10. **Edit tracking** - learn from how they modify suggestions
11. **Audience profiles** - save and reuse target audiences
12. **Example content analysis** - analyze their best work

---

## Verification Plan

1. **Feedback Flow:** Click 👍 on a camp → verify `user_feedback` row created
2. **Preference Calculation:** After 5+ feedbacks → verify `user_preferences` scores updated
3. **Style Analysis:** Submit draft → verify `user_writing_profile` updated
4. **Personalization:** Analyze text → verify preferred camps/authors appear in prompt
5. **UI State:** Verify FeedbackButton state persists across page reloads
6. **Migration:** Test localStorage sync endpoint with existing `helpfulInsights` data
7. **Evaluation:** Test "Check My Content" returns scores based on learned preferences

---

## Existing Codebase Context

### Current Feedback Mechanism (localStorage only)

```typescript
interface HelpfulInsight {
  id: string
  type: 'summary' | 'camp'
  content: string
  campLabel?: string
  originalText: string
  fullText?: string
  cachedResult?: any
  analysisId?: string
  timestamp: string
}
```

**Problem:** This only tracks "saves" - no positive/negative signal, no stance, no server sync.

### Key Files Reference

- `/components/AIEditor.tsx` - Main editor component with current like system
- `/components/AIEditorResults.tsx` - Results display component
- `/lib/ai-editor/gemini.ts` - LLM integration
- `/lib/ai-editor/analyzer.ts` - Analysis orchestration
- `/lib/ai-editor/types.ts` - TypeScript interfaces
- `/app/api/brain/analyze/route.ts` - Current analysis API
- `/app/history/page.tsx` - History tracking page
- `/lib/supabase.ts` - Supabase client setup

---

## User Stories & Behaviors

### Target Persona

**Content Creator** - AI policy writer, tech blogger, thought leader who regularly writes about AI topics and wants to ensure their content is well-researched and includes diverse perspectives.

---

### Stage 1: First-Time User (Cold Start)

**User Story:**
> "As a new user, I want to quickly get value from the tool without setup, so I can decide if it's worth using regularly."

**Behavior Flow:**

```
1. USER ARRIVES
   └─ Has a draft about "AI regulation in the EU"
   └─ Pastes into AI Editor
   └─ Clicks "Analyze"

2. SEES RESULTS
   ┌─────────────────────────────────────────────────────────┐
   │ Summary: Your draft discusses AI governance...          │
   │                                                         │
   │ Relevant Perspectives:                                  │
   │ ┌─────────────────────────────────────────────────────┐ │
   │ │ 🏛️ AI Governance Advocates                          │ │
   │ │ "Your emphasis on precautionary regulation aligns   │ │
   │ │ with this camp..."                                  │ │
   │ │                                                     │ │
   │ │ [👍 Helpful]  [👎 Not relevant]                     │ │
   │ └─────────────────────────────────────────────────────┘ │
   │                                                         │
   │ ┌─────────────────────────────────────────────────────┐ │
   │ │ 👤 Yoshua Bengio                                    │ │
   │ │ "Agrees - has called for international AI treaty"  │ │
   │ │ Quote: "We need binding agreements..."              │ │
   │ │                                                     │ │
   │ │ [👍 Helpful]  [👎 Not relevant]                     │ │
   │ └─────────────────────────────────────────────────────┘ │
   └─────────────────────────────────────────────────────────┘

3. USER PROVIDES FEEDBACK
   └─ Clicks 👍 on "AI Governance Advocates"
   └─ Clicks 👍 on "Yoshua Bengio"
   └─ Clicks 👎 on "Techno-Optimists" (not their angle)

4. OPTIONAL: STANCE CLARIFICATION (appears on 👍)
   ┌─────────────────────────────────────────────────────────┐
   │ Why is this helpful?                                    │
   │ ○ I agree with this perspective                         │
   │ ○ I disagree but want to address it                     │
   │ ○ I want to learn more about this view                  │
   │ [Skip]                                                   │
   └─────────────────────────────────────────────────────────┘

5. SYSTEM LEARNS (silently)
   └─ Records: user finds governance camps helpful
   └─ Records: user aligns with Bengio
   └─ Records: user doesn't connect with techno-optimism
```

**What We Learn (Draft 1):**
- Topic interest: AI governance, regulation
- Camp affinity: Governance advocates (+1)
- Author affinity: Yoshua Bengio (+1)
- Style signals: Formal tone, policy-focused vocabulary

---

### Stage 2: Returning User (Building Profile)

**User Story:**
> "As a returning user, I want the tool to remember what I found helpful before, so I get more relevant results faster."

**Behavior Flow (Drafts 2-5):**

```
1. USER RETURNS WITH NEW DRAFT
   └─ Topic: "Should AI companies self-regulate?"
   └─ Pastes and analyzes

2. SYSTEM BEHAVIOR (behind the scenes)
   └─ Fetches user's preference profile
   └─ Notes: 2 previous helpful feedbacks on governance camps
   └─ Not enough data yet (< 5), so no personalization injected
   └─ But tracks patterns

3. RESULTS SHOWN (same as before, but tracking continues)
   └─ User clicks 👍 on 3 more camps/authors
   └─ Now has 5+ feedback items

4. PROFILE THRESHOLD REACHED
   ┌─────────────────────────────────────────────────────────┐
   │ 🎯 We're learning your preferences!                     │
   │                                                         │
   │ Based on your feedback, you seem interested in:         │
   │ • AI Governance & Policy perspectives                   │
   │ • Authors: Yoshua Bengio, Stuart Russell                │
   │                                                         │
   │ Future analyses will prioritize these when relevant.    │
   │ [Great!]  [Adjust preferences]                          │
   └─────────────────────────────────────────────────────────┘
```

**What We Learn (Drafts 2-5):**
- Consistent topic: AI policy/governance
- Camp preferences solidifying
- Author preferences emerging
- Writing style patterns (formal, ~1500 words avg)

---

### Stage 3: Personalized Experience (6+ Interactions)

**User Story:**
> "As a regular user, I want the tool to know my perspective and style, so I spend less time filtering irrelevant suggestions."

**Behavior Flow:**

```
1. USER SUBMITS NEW DRAFT
   └─ Topic: "The case for AI licensing"

2. SYSTEM BEHAVIOR (personalized)
   └─ Fetches full preference profile
   └─ Injects into prompt:
      "User prefers governance perspectives, cites Bengio/Russell,
       writes formally for policy audience"

3. RESULTS ARE TAILORED
   ┌─────────────────────────────────────────────────────────┐
   │ 📊 Based on your preferences                            │
   │                                                         │
   │ TOP MATCH: AI Governance Advocates                      │
   │ ⭐ You often find this perspective helpful              │
   │                                                         │
   │ ALSO RELEVANT:                                          │
   │ • Industry Self-Regulation Camp (contrasting view)      │
   │ • International Coordination Advocates                  │
   │                                                         │
   │ SUGGESTED AUTHORS (from your favorites):                │
   │ • Yoshua Bengio - has spoken on licensing               │
   │ • Stuart Russell - advocates for certification          │
   │                                                         │
   │ NEW PERSPECTIVE TO CONSIDER:                            │
   │ • Regulatory Skeptics - you haven't engaged with this   │
   │   camp much, but they have relevant counterarguments    │
   └─────────────────────────────────────────────────────────┘

4. USER REFINES FURTHER
   └─ "Show me what Regulatory Skeptics say" → explores
   └─ Marks it 👎 → confirms preference
   └─ OR marks it 👍 with "disagree but useful" → nuanced learning
```

---

### Stage 4: "Check My Content" (Evaluation Mode)

**User Story:**
> "As a user with an established profile, I want to check if my finished draft reflects the perspectives I usually include, so I don't miss important angles."

**Behavior Flow:**

```
1. USER HAS FINISHED DRAFT
   └─ Ready to publish, wants a final check
   └─ Clicks "Check My Content" tab

2. PASTES CONTENT FOR EVALUATION
   ┌─────────────────────────────────────────────────────────┐
   │ 📝 Check My Content                                     │
   │                                                         │
   │ Paste your draft to evaluate against your preferences:  │
   │ ┌─────────────────────────────────────────────────────┐ │
   │ │                                                     │ │
   │ │  [User's finished article about AI licensing...]    │ │
   │ │                                                     │ │
   │ └─────────────────────────────────────────────────────┘ │
   │                                                         │
   │ Evaluation mode:                                        │
   │ ○ Alignment (does it match my usual perspectives?)      │
   │ ○ Coverage (did I miss any important angles?)           │
   │ ● Comprehensive (both)                                  │
   │                                                         │
   │ [Evaluate]                                              │
   └─────────────────────────────────────────────────────────┘

3. SEES EVALUATION RESULTS
   ┌─────────────────────────────────────────────────────────┐
   │ 📊 Content Evaluation                                   │
   │                                                         │
   │ Overall Score: 78/100                                   │
   │ ████████████████████░░░░░                               │
   │                                                         │
   │ ✅ STRENGTHS                                            │
   │ • Strong alignment with AI Governance perspective       │
   │ • Cites Stuart Russell (one of your preferred authors)  │
   │ • Formal tone matches your typical style                │
   │                                                         │
   │ ⚠️ MISSING PERSPECTIVES                                 │
   │ • You usually address industry counterarguments         │
   │   → Consider: What would OpenAI/Anthropic say?          │
   │ • Yoshua Bengio has relevant recent quotes on this      │
   │   → "AI licensing should be international..." [Copy]    │
   │                                                         │
   │ 💡 SUGGESTIONS                                          │
   │ • Add a paragraph addressing self-regulation arguments  │
   │ • Your drafts usually include data points - this has    │
   │   none. Consider adding statistics on AI incidents.     │
   └─────────────────────────────────────────────────────────┘

4. USER ACTS ON FEEDBACK
   └─ Copies suggested quote
   └─ Adds missing perspective paragraph
   └─ Re-evaluates → Score: 91/100
```

---

### Stage 5: Organizational User (With Style Guide)

**User Story:**
> "As a content team member, I want to upload our company's style guide, so the tool checks my drafts against both my preferences AND our brand guidelines."

**Behavior Flow:**

```
1. USER GOES TO SETTINGS
   └─ Sees "Content Guidelines" section
   └─ Clicks "Add Style Guide"

2. UPLOADS STYLE GUIDE
   ┌─────────────────────────────────────────────────────────┐
   │ 📋 Add Content Guidelines                               │
   │                                                         │
   │ Name: Acme Corp Brand Voice                             │
   │                                                         │
   │ Upload style guide: [acme-style-guide.pdf] ✓            │
   │                                                         │
   │ Or describe your guidelines:                            │
   │ ┌─────────────────────────────────────────────────────┐ │
   │ │ - Always use "we" not "I"                           │ │
   │ │ - Avoid jargon, write for general audience          │ │
   │ │ - Never mention competitor names                     │ │
   │ │ - Include data citations for all claims              │ │
   │ └─────────────────────────────────────────────────────┘ │
   │                                                         │
   │ [x] Use as default for all evaluations                  │
   │                                                         │
   │ [Save Guidelines]                                       │
   └─────────────────────────────────────────────────────────┘

3. FUTURE EVALUATIONS INCLUDE GUIDELINES
   ┌─────────────────────────────────────────────────────────┐
   │ 📊 Content Evaluation                                   │
   │                                                         │
   │ Overall Score: 72/100                                   │
   │                                                         │
   │ ⚠️ STYLE GUIDE ISSUES                                   │
   │ • Uses "I think" 3 times → Should use "we believe"      │
   │ • Mentions "Google DeepMind" → Avoid competitor names   │
   │ • No data citations found → Required by guidelines      │
   │                                                         │
   │ ✅ PREFERENCE ALIGNMENT                                 │
   │ • Good coverage of governance perspectives              │
   │ • Includes preferred author citations                   │
   └─────────────────────────────────────────────────────────┘
```

---

### Behavior Patterns to Encourage

| Behavior | How We Encourage It | Benefit |
|----------|---------------------|---------|
| **Give feedback on results** | Make 👍/👎 buttons prominent, one-click | Builds preference profile |
| **Return regularly** | Show "Profile strength: 40%" progress | Develops personalization |
| **Use "Check My Content"** | Prompt after analysis: "Ready to check your final draft?" | Validates the loop works |
| **Add stance nuance** | Optional follow-up on 👍 (agree/disagree/learn) | Richer preference data |
| **Upload style guide** | Surface in settings, show value prop | Organizational stickiness |

---

### Anti-Patterns to Avoid

| Anti-Pattern | Why It's Bad | How We Prevent It |
|--------------|--------------|-------------------|
| **Over-personalization** | Echo chamber, misses important views | Always show "New perspective to consider" |
| **Too much setup friction** | Users abandon before value | Start with zero config, learn implicitly |
| **Annoying feedback prompts** | Users stop engaging | One-click feedback, optional stance |
| **Stale preferences** | User interests evolve | Recency-weighted scoring, decay old signals |
| **Invisible learning** | Users don't trust it | Show "Based on your preferences" labels |

---

### User Journey Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  DRAFT 1          DRAFTS 2-5         DRAFT 6+           EVALUATION      │
│  ────────         ──────────         ────────           ──────────      │
│                                                                         │
│  Cold start       Building           Personalized       "Check My       │
│  No prefs         profile            results            Content"        │
│                                                                         │
│  ↓                ↓                  ↓                  ↓               │
│                                                                         │
│  Show all         Track all          Prioritize         Score against   │
│  perspectives     feedback           preferred camps    learned prefs   │
│                                                                         │
│  ↓                ↓                  ↓                  ↓               │
│                                                                         │
│  Collect first    Show "profile      Label "Based on    Show gaps &     │
│  feedback         building" hint     your prefs"        suggestions     │
│                                                                         │
│  ↓                ↓                  ↓                  ↓               │
│                                                                         │
│  VALUE:           VALUE:             VALUE:             VALUE:          │
│  Discovery        Emerging           Less filtering,    Quality         │
│                   relevance          faster results     assurance       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

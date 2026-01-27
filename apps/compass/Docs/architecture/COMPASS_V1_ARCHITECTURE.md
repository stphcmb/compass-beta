# Compass v1 (ICP) Architecture

*Integrated Content Platform — Consolidated Product & Technical Architecture*

---

## Naming Convention

| Name | What It Refers To | Status |
|------|-------------------|--------|
| **Compass Beta** | Current production app (AI Editor, Canon Explorer, Voice Lab MVP) | Live |
| **Compass v1 / ICP** | Integrated Content Platform (this document) | Planning |

**ICP = Integrated Content Platform** — the evolution of Compass Beta into a unified content creation workflow.

---

## Executive Summary

Compass v1 (ICP) is an internal content platform for Anduin's marketing team. It transforms briefs into polished, voice-consistent, intellectually-grounded content.

**The One Thing:** Create thought leadership content at ease — fast, consistent, authentic.

**Scope:** Brief → Generate → Validate → Edit

**Out of Scope (v1):** Publish, Repurpose, Launch Center

---

## Part 1: Vision & Positioning

### The Problem

Creating good content requires solving multiple sub-problems:
- **Ideation** — What angle to take
- **Generation** — Producing the draft
- **Grounding** — Ensuring intellectual credibility
- **Voice** — Sounding like the intended author
- **Polish** — Final editing for clarity

Today, these are solved with disconnected tools (ChatGPT, Google Docs, manual review). Context is lost between steps. Quality is inconsistent. Speed suffers.

### The Solution

One unified flow where:
1. User provides a brief
2. System generates a voice-constrained draft
3. User validates and refines with AI assistance
4. Content exports ready to publish

### Why Compass Wins

| Capability | Generic LLM | Compass |
|------------|-------------|---------|
| Generate content | ✅ Generic output | ✅ Voice-constrained from start |
| Validate positioning | ⚠️ Hallucinated citations | ✅ 239 verified thought leaders |
| Remember voice | ❌ Stateless | ✅ Persistent voice profiles |
| Track consistency | ❌ No memory | ✅ Project history |
| Understand Anduin context | ❌ Generic | ✅ Domain-aware |

---

## Part 2: User Personas

### Persona 1: The Executive

**Who:** Alin (CEO) and leadership team

**Behavior:**
- Has 30 minutes between meetings
- Strong opinions, rough bullet points
- Wants authentic output that sounds like them
- Won't iterate 10 times — needs quality on first pass

**Job to Be Done:**
> "Turn my rough ideas into something I'd be proud to publish under my name."

**Success Metric:** Draft requires <20% editing before publish

---

### Persona 2: The Content Strategist

**Who:** Marketing team members producing content at volume

**Behavior:**
- Creates 5-10 pieces per week
- Needs consistency across outputs
- Bridges internal knowledge with market positioning
- Reviews and refines more than executives

**Job to Be Done:**
> "Help me produce fast, consistent, high-quality content that bridges what we know with what the market needs to hear."

**Success Metric:** 3x content output without quality drop

---

## Part 3: Content Domains

Compass serves two content domains with different validation needs:

| Domain | Description | Validation Source | Examples |
|--------|-------------|-------------------|----------|
| **AI Discourse** | Thought leadership about AI landscape | Canon (239 authors) | AI trends, industry perspectives, future of work |
| **Anduin Product** | Solution-focused content about Anduin | Product knowledge base (future) | Product launches, case studies, feature explanations |
| **Hybrid** | Blends both | Both sources | "How Anduin uses AI agents for compliance" |

**Day 1 Reality:**
- AI Discourse validation: ✅ Ready (Canon exists)
- Product validation: ⚠️ Manual review (knowledge base needed)

---

## Part 4: Core User Flow

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌────────┐    ┌─────────┐
│  BRIEF  │───►│ GENERATE │───►│ VALIDATE │───►│  EDIT  │───►│ EXPORT  │
└─────────┘    └──────────┘    └──────────┘    └────────┘    └─────────┘
     │              │               │              │              │
     ▼              ▼               ▼              ▼              ▼
  Topic, key     First draft    Voice check    Polish with    Copy/download
  points,        with voice     Canon check    AI assistance  Mark complete
  format,        applied        (optional)
  audience                      Brief coverage
     │              │               │              │
     └──────────────┴───────────────┴──────────────┘
                           │
                  ┌────────▼────────┐
                  │   VOICE LAB     │
                  │ (constraint     │
                  │  layer)         │
                  └─────────────────┘
```

### Flow Details

| Phase | Module | User Action | System Action |
|-------|--------|-------------|---------------|
| **Brief** | Content Builder | Fills form: topic, key points, format, audience, domain | Creates Project record |
| **Generate** | Content Builder | Clicks "Generate" | Produces voice-constrained draft, saves to Project |
| **Validate** | AI Editor | Reviews intelligence panel | Runs voice check, brief coverage; canon check on demand |
| **Edit** | AI Editor | Accepts/rejects suggestions, edits text | Updates Project with each save |
| **Export** | AI Editor | Clicks "Export" | Copies to clipboard, marks Project complete |

---

## Part 5: Module Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              COMPASS v1                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         PROJECTS                                     │   │
│  │           (Persistence layer — tracks content from brief to export)  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│      ┌───────────┬────────────────┼────────────────┬───────────┐          │
│      ▼           ▼                ▼                ▼           ▼          │
│  ┌───────┐  ┌─────────┐    ┌──────────┐    ┌──────────┐  ┌─────────┐     │
│  │ BRIEF │  │GENERATE │    │ VALIDATE │    │   EDIT   │  │ EXPORT  │     │
│  │       │  │         │    │          │    │          │  │         │     │
│  │Content│  │ Content │    │AI Editor │    │AI Editor │  │AI Editor│     │
│  │Builder│  │ Builder │    │          │    │          │  │         │     │
│  └───────┘  └─────────┘    └────┬─────┘    └──────────┘  └─────────┘     │
│                                 │                                         │
│                    ┌────────────┼────────────┐                           │
│                    ▼            ▼            ▼                           │
│              ┌──────────┐ ┌──────────┐ ┌──────────┐                      │
│              │  VOICE   │ │  CANON   │ │  BRIEF   │                      │
│              │  CHECK   │ │  CHECK   │ │ COVERAGE │                      │
│              │          │ │(optional)│ │          │                      │
│              └──────────┘ └──────────┘ └──────────┘                      │
│                    │            │                                         │
│                    ▼            ▼                                         │
│              ┌──────────┐ ┌──────────┐                                   │
│              │VOICE LAB │ │  CANON   │                                   │
│              │(profiles)│ │(authors) │                                   │
│              └──────────┘ └──────────┘                                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Module 1: Content Builder

**Purpose:** Brief intake + voice-constrained generation

**Responsibilities:**
- Capture structured brief (topic, key points, format, audience, domain)
- Let user select voice profile
- Generate first draft with voice constraints applied
- Create/update Project record

**UI:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CONTENT BUILDER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  What are you writing?              Voice                                  │
│  ┌────────────────────────┐         ┌────────────────────────┐            │
│  │ Blog post           ▼ │         │ CEO Voice           ▼ │            │
│  └────────────────────────┘         └────────────────────────┘            │
│                                                                             │
│  Topic                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Why AI agents need compliance guardrails in private markets          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Key points                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ • Agents are automating workflows but lack audit trails              │  │
│  │ • Compliance isn't optional in regulated industries                  │  │
│  │ • Anduin's approach: guardrails built into the agent layer           │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Content domain                     Audience                                │
│  ○ AI discourse                     ┌────────────────────────┐            │
│  ● Anduin product                   │ Tech executives     ▼ │            │
│  ○ Hybrid                           └────────────────────────┘            │
│                                                                             │
│                                              [Save Draft]  [Generate →]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**API:**
```
POST /api/studio/content/generate
{
  projectId?: string,           // Optional: update existing project
  brief: {
    title: string,
    format: 'blog' | 'linkedin' | 'memo' | 'byline',
    audience: string,
    keyPoints: string[],
    additionalContext?: string,
    contentDomain: 'ai_discourse' | 'anduin_product' | 'hybrid'
  },
  voiceProfileId: string
}

Response:
{
  projectId: string,
  version: number,              // Draft version created
  draft: { content: string, wordCount: number },
  voiceMatch: { score: number, notes: string[] }
}
```

**Dependencies:**
- Voice Lab (fetches voice profile)
- Projects (creates/updates record)

---

### Module 2: AI Editor

**Purpose:** Validation + refinement + polish

**Responsibilities:**
- Load project context (brief, draft, voice)
- Run automatic checks (voice, brief coverage)
- Run optional checks (canon validation)
- Provide AI-assisted editing suggestions
- Save progress to Project
- Export final content

**UI:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Project: Why AI agents need compliance...        Voice: CEO Voice         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ EDITOR ────────────────────────────┐ ┌─ INTELLIGENCE PANEL ──────────┐ │
│  │                                      │ │                               │ │
│  │  The promise of AI agents is         │ │ ┌─ VOICE CHECK ────────────┐ │ │
│  │  compelling: software that doesn't   │ │ │ Match: 85%               │ │ │
│  │  just respond to commands but takes  │ │ │ ████████████░░░          │ │ │
│  │  initiative...                       │ │ │                          │ │ │
│  │                                      │ │ │ ⚠ Para 3: "might want"   │ │ │
│  │  But here's what most vendors won't  │ │ │   → "must recognize"     │ │ │
│  │  tell you: in regulated industries   │ │ │   [Apply]                │ │ │
│  │  like private markets, an agent      │ │ └──────────────────────────┘ │ │
│  │  without guardrails isn't an         │ │                               │ │
│  │  innovation—it's a liability.        │ │ ┌─ BRIEF COVERAGE ────────┐  │ │
│  │                                      │ │ │ ✓ 3 of 3 points covered │  │ │
│  │                                      │ │ └─────────────────────────┘  │ │
│  │                                      │ │                               │ │
│  │                                      │ │ ┌─ POSITIONING ───────────┐  │ │
│  │                                      │ │ │ [Run Canon Check]       │  │ │
│  │                                      │ │ │ Validate against AI     │  │ │
│  │                                      │ │ │ thought leaders         │  │ │
│  │                                      │ │ └─────────────────────────┘  │ │
│  └──────────────────────────────────────┘ └───────────────────────────────┘ │
│                                                                             │
│  [← Back to Builder]         [Save]         [Export →]                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Three Validation Modes:**

| Mode | Trigger | What It Does | Day 1? |
|------|---------|--------------|--------|
| **Voice Check** | Automatic | Compares draft to voice profile, flags deviations | ✅ Yes |
| **Brief Coverage** | Automatic | Checks if key points from brief are addressed | ✅ Yes |
| **Canon Check** | User clicks button | Matches against 239 thought leaders | ✅ Yes (existing) |

**API:**
```
POST /api/studio/editor/analyze
{
  projectId: string,
  content: string,
  checks: {
    voice: boolean,        // default: true
    canon: boolean,        // default: false (opt-in)
    briefCoverage: boolean // default: true
  }
}

Response:
{
  voiceCheck?: {
    score: number,
    suggestions: [{ location, issue, original, suggested }],
    checkedAt: string      // ISO timestamp
  },
  canonCheck?: {
    matchedCamps: [{ camp, relevance, authors }],
    missingPerspectives: [{ camp, reason, suggestedParagraph }],
    checkedAt: string
  },
  briefCoverage?: {
    covered: string[],
    missing: string[],
    checkedAt: string
  }
}
```

**Dependencies:**
- Voice Lab (fetches voice profile)
- Canon (camp/author matching)
- Projects (reads/writes project state)

---

### Module 3: Voice Lab

**Purpose:** Constraint layer — capture and deploy writing styles

**Status:** ✅ MVP exists

**Responsibilities:**
- Analyze writing samples → extract style patterns
- Generate and store voice profiles
- Provide profiles to Content Builder and AI Editor
- Apply voice transformation to drafts (revision mode)

**Current Implementation:**
- `/app/voice-lab/page.tsx` — Main UI
- `/lib/voice-lab/profile-store.ts` — Supabase CRUD
- `/lib/voice-lab/style-generator.ts` — Gemini analysis
- `/api/voice-lab/analyze`, `/generate`, `/profiles`, `/revise`

**Integration:**
- Content Builder: Fetches profile for generation constraints
- AI Editor: Fetches profile for voice checking

---

### Module 4: Canon Explorer

**Purpose:** Optional validation against verified thought leaders

**Status:** ✅ Complete (239 authors, 17 camps)

**Responsibilities:**
- Store curated author positions and quotes
- Match user content against camps
- Surface relevant authors and citations
- Provide intellectual grounding for AI discourse content

**Current Implementation:**
- `/app/explore/page.tsx` — Browse/search UI
- `/lib/api/thought-leaders.ts` — Query logic
- Tables: `domains`, `dimensions`, `camps`, `camp_authors`, `authors`, `sources`

**Integration:**
- AI Editor: Called on-demand for canon validation

---

### Module 5: Projects

**Purpose:** Persistence layer — tracks content from brief to export

**Responsibilities:**
- Create project when user starts a brief
- Store brief, draft versions, voice profile reference
- Track project status
- Enable resume/history

**Data Model:**
```sql
-- Main projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,

  -- Brief
  title TEXT,
  format TEXT,                    -- 'blog', 'linkedin', 'memo', 'byline'
  audience TEXT,
  key_points JSONB,               -- ["point 1", "point 2"]
  additional_context TEXT,        -- Optional extra context
  content_domain TEXT,            -- 'ai_discourse', 'anduin_product', 'hybrid'

  -- Voice
  voice_profile_id UUID REFERENCES voice_profiles(id),

  -- Current draft (always latest version)
  current_draft TEXT,
  current_version INTEGER DEFAULT 0,
  word_count INTEGER,

  -- Validation results (JSONB for flexibility)
  last_voice_check JSONB,         -- { score, suggestions[], checked_at }
  last_canon_check JSONB,         -- { camps[], authors[], checked_at }
  last_brief_coverage JSONB,      -- { covered[], missing[], checked_at }

  -- Status
  status TEXT DEFAULT 'brief',    -- 'brief', 'draft', 'editing', 'complete'

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_projects_user ON projects(clerk_user_id);
CREATE INDEX idx_projects_status ON projects(status);

-- Draft history table (tracks all versions)
CREATE TABLE project_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER,

  -- What triggered this version
  change_source TEXT,             -- 'generated', 'user_edit', 'regenerated', 'ai_suggestion'
  change_summary TEXT,            -- Optional: "Applied voice check suggestions"

  -- Snapshot of validation at this version
  voice_check_snapshot JSONB,
  canon_check_snapshot JSONB,

  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(project_id, version)
);

CREATE INDEX idx_project_drafts_project ON project_drafts(project_id);
CREATE INDEX idx_project_drafts_version ON project_drafts(project_id, version DESC);
```

**UI (Project List):**
```
┌─────────────────────────────────────────┐
│  My Projects                   [+ New]  │
├─────────────────────────────────────────┤
│                                         │
│  📝 AI Agents in Private Markets        │
│     Blog · CEO Voice · Editing          │
│     Last edited 2 hours ago             │
│                                         │
│  ✓  Q1 Product Update                   │
│     Memo · Brand Voice · Complete       │
│     Last edited yesterday               │
│                                         │
└─────────────────────────────────────────┘
```

---

## Part 6: Data Model Overview

### Entity Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA MODEL                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  USER DATA (Per Clerk user)                                                 │
│  ─────────────────────────                                                  │
│                                                                             │
│  ┌──────────────┐         ┌──────────────┐                                 │
│  │   PROJECTS   │────────►│VOICE_PROFILES│                                 │
│  │              │         │              │                                 │
│  │ • brief      │         │ • name       │                                 │
│  │ • draft      │         │ • style_guide│                                 │
│  │ • status     │         │ • samples    │                                 │
│  └──────────────┘         └──────────────┘                                 │
│                                                                             │
│  CANON DATA (Shared, curated)                                              │
│  ────────────────────────────                                               │
│                                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │ DOMAINS  │───►│DIMENSIONS│───►│  CAMPS   │───►│ AUTHORS  │             │
│  │   (6)    │    │   (8)    │    │   (17)   │    │  (239)   │             │
│  └──────────┘    └──────────┘    └────┬─────┘    └────┬─────┘             │
│                                       │               │                    │
│                                       └───────┬───────┘                    │
│                                               ▼                            │
│                                        ┌──────────┐                        │
│                                        │  CAMP_   │                        │
│                                        │ AUTHORS  │                        │
│                                        │ (M:N)    │                        │
│                                        └──────────┘                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tables Summary

| Table | Purpose | Status |
|-------|---------|--------|
| `projects` | Content from brief to export | 🆕 To create |
| `project_drafts` | Version history for each project | 🆕 To create |
| `voice_profiles` | Writing style profiles | ✅ Exists |
| `editor_memory` | User context for AI | ✅ Exists |
| `domains` | Top-level topic areas | ✅ Exists |
| `dimensions` | Subdivisions within domains | ✅ Exists |
| `camps` | Intellectual positions | ✅ Exists |
| `authors` | Thought leaders (239) | ✅ Exists |
| `camp_authors` | Author-camp relationships | ✅ Exists |
| `sources` | Author publications | ✅ Exists |

### Draft Versioning Behavior

Versions are created automatically at key moments:

| Event | Version Created? | `change_source` |
|-------|------------------|-----------------|
| Initial generation | ✅ Yes (v1) | `generated` |
| User clicks "Save" | ✅ Yes | `user_edit` |
| User clicks "Regenerate" | ✅ Yes | `regenerated` |
| User applies AI suggestion | ✅ Yes | `ai_suggestion` |
| Auto-save (30s inactivity) | Optional | `user_edit` |
| Every keystroke | ❌ No | — |

**Viewing history:** Query `project_drafts` ordered by `version DESC` to see full audit trail.

**Reverting:** Load a previous version's content and save as new version (creates new entry, preserves history).

---

## Part 7: Integration Flow

All ICP routes and APIs are namespaced under `/studio` to avoid conflicts with Compass Beta.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ICP INTEGRATION FLOW (/studio/*)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  USER OPENS /studio/builder                                                 │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────┐                                                          │
│  │   Fill       │  GET /api/voice-lab/profiles                             │
│  │   Brief      │◄────────────────────────  Load voice profiles for picker │
│  └──────────────┘                            (reuses existing Voice Lab)   │
│         │                                                                   │
│         │ User clicks "Generate"                                            │
│         ▼                                                                   │
│  ┌──────────────┐                                                          │
│  │   Generate   │  POST /api/studio/content/generate                       │
│  │              │────────────────────────►  Creates Project                │
│  │              │                           Generates draft with voice      │
│  │              │                           Saves v1 to project_drafts     │
│  │              │◄────────────────────────  Returns projectId + draft      │
│  └──────────────┘                                                          │
│         │                                                                   │
│         │ User clicks "Open in Editor"                                      │
│         │ Navigation: /studio/editor?project={id}                          │
│         ▼                                                                   │
│  ┌──────────────┐                                                          │
│  │   Editor     │  GET /api/studio/projects/{id}                           │
│  │   Loads      │◄────────────────────────  Load project context           │
│  └──────────────┘                                                          │
│         │                                                                   │
│         │ Editor runs automatic checks                                      │
│         ▼                                                                   │
│  ┌──────────────┐                                                          │
│  │   Validate   │  POST /api/studio/editor/analyze                         │
│  │   (auto)     │────────────────────────►  Voice check + brief coverage   │
│  └──────────────┘                                                          │
│         │                                                                   │
│         │ User clicks "Run Canon Check" (optional)                         │
│         ▼                                                                   │
│  ┌──────────────┐                                                          │
│  │   Validate   │  POST /api/studio/editor/analyze (canon: true)           │
│  │   (canon)    │────────────────────────►  Match camps + authors          │
│  └──────────────┘                            (reuses existing Canon logic) │
│         │                                                                   │
│         │ User edits content                                                │
│         ▼                                                                   │
│  ┌──────────────┐                                                          │
│  │   Save       │  PUT /api/studio/projects/{id}                           │
│  │              │────────────────────────►  Update draft, create version   │
│  └──────────────┘                           in project_drafts              │
│         │                                                                   │
│         │ User clicks "Export"                                              │
│         ▼                                                                   │
│  ┌──────────────┐                                                          │
│  │   Export     │  PUT /api/studio/projects/{id}                           │
│  │              │────────────────────────►  Mark status: 'complete'        │
│  │              │  Copy to clipboard / download                            │
│  └──────────────┘                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Note:** Compass Beta (`/ai-editor`, `/voice-lab`, `/explore`) continues working unchanged throughout rollout.

---

## Part 8: What Exists vs. What to Build

### Existing Assets

| Asset | Location | Status | Reuse? |
|-------|----------|--------|--------|
| Voice Lab UI | `/app/voice-lab/page.tsx` | ✅ MVP | Yes — as voice management |
| Voice Lab API | `/api/voice-lab/*` | ✅ Working | Yes |
| Voice profiles table | `voice_profiles` | ✅ In DB | Yes |
| AI Editor UI | `/app/ai-editor/page.tsx` | ✅ Working | Enhance |
| AI Editor API | `/api/brain/analyze` | ✅ Working | Enhance |
| Canon Explorer | `/app/explore/page.tsx` | ✅ Complete | Yes — for canon check |
| Canon data | 239 authors, 17 camps | ✅ Populated | Yes |
| Editor memory | `editor_memory` table | ✅ In DB | Yes |

### To Build

| Component | Phase | Location | Dependencies |
|-----------|-------|----------|--------------|
| `projects` table | 0 | `/Docs/migrations/active/` | None |
| `project_drafts` table | 0 | `/Docs/migrations/active/` | projects |
| `user_content_defaults` table | 0 | `/Docs/migrations/active/` | None |
| Feature flag config | 0 | `/lib/feature-flags.ts` | None |
| Projects API | 1 | `/app/api/studio/projects/` | DB tables |
| Content Generate API | 1 | `/app/api/studio/content/` | Voice Lab |
| Editor Analyze API | 1 | `/app/api/studio/editor/` | Voice Lab, Canon |
| Content Builder UI | 2 | `/app/studio/builder/` | APIs |
| Project List UI | 2 | `/app/studio/projects/` | APIs |
| Enhanced Editor UI | 2 | `/app/studio/editor/` | APIs |
| Nav link (gated) | 3 | `/components/Header.tsx` | Feature flag |

### To Deprecate

| Asset | Reason | Action |
|-------|--------|--------|
| Content Helper page | Absorbed into AI Editor | Archive spec, delete placeholder |
| localStorage analysis storage | Replaced by Projects | Remove after migration |

---

## Part 9: File Structure

### New Files to Create

All ICP files are namespaced under `/studio` to avoid conflicts with Compass Beta.

```
/app/studio                           # Hidden ICP routes
  /builder
    page.tsx                          # Content Builder UI
    components/
      BriefForm.tsx                   # Brief input form
      DraftPreview.tsx                # Generated draft display
      FormatSelector.tsx              # Format picker (blog/linkedin/memo)
      VoicePicker.tsx                 # Voice profile dropdown
  /projects
    page.tsx                          # Project list
    components/
      ProjectCard.tsx                 # Project list item
      ProjectFilters.tsx              # Status/date filters
  /editor
    page.tsx                          # Enhanced AI Editor
    components/
      IntelligencePanel.tsx           # Right panel with all checks
      VoiceCheckPanel.tsx             # Voice suggestions
      BriefCoveragePanel.tsx          # Coverage indicator
      CanonCheckPanel.tsx             # Positioning results
      DraftHistoryPanel.tsx           # Version history viewer

/lib/studio                           # ICP business logic
  /content-builder
    generator.ts                      # Voice-constrained generation
    prompts.ts                        # Prompt templates
  /editor
    voice-check.ts                    # Voice consistency analysis
    brief-coverage.ts                 # Key point matching
  /projects
    store.ts                          # Project CRUD operations
    defaults.ts                       # User defaults resolution

/app/api/studio                       # ICP API endpoints
  /projects
    route.ts                          # GET (list), POST (create)
    [id]
      route.ts                        # GET, PUT, DELETE
      drafts/
        route.ts                      # GET (list versions)
        [version]/route.ts            # GET (specific version)
  /content
    generate/route.ts                 # POST (brief → draft)
  /editor
    analyze/route.ts                  # POST (voice + brief + canon checks)

/Docs/migrations/active               # Database migrations
  NNNN_create_projects_table.sql
  NNNN_create_project_drafts_table.sql
  NNNN_create_user_content_defaults_table.sql
```

### Files to Modify (Phase 3 only)

These changes are gated by `FF_ICP_STUDIO` feature flag:

| File | Changes | When |
|------|---------|------|
| `/components/Header.tsx` | Add "Studio (Beta)" nav item | Phase 3 |
| `/lib/feature-flags.ts` | Add FF_ICP_STUDIO flag | Phase 0 |

### Files NOT Modified

These Compass Beta files remain untouched:

| File | Reason |
|------|--------|
| `/app/ai-editor/page.tsx` | Keep working as-is for Beta |
| `/app/api/brain/analyze/route.ts` | Don't risk breaking existing analysis |
| `/app/voice-lab/*` | ICP reads from Voice Lab, doesn't modify |
| `/app/explore/*` | Canon Explorer unchanged |

---

## Part 10: Implementation Plan

### Rollout Strategy: Shadow Build

**Principle:** Additive changes only — never break Compass Beta.

| Layer | Strategy |
|-------|----------|
| **Database** | Add new tables, don't modify existing |
| **APIs** | New endpoints under `/api/studio/*`, don't change existing |
| **UI** | Hidden routes at `/studio/*` until ready |
| **Rollout** | Feature flag (`FF_ICP_STUDIO`) controls visibility |

This allows full ICP development while Compass Beta remains stable.

---

### Phase 0: Database Foundation (Days 1-2)

**Risk Level:** ✅ None — just adding empty tables

**Goal:** Create persistence layer for ICP

```
Day 1:
- [ ] Create `projects` table migration
- [ ] Create `project_drafts` table migration
- [ ] Run migrations in production (additive, no impact)

Day 2:
- [ ] Create `user_content_defaults` table migration
- [ ] Add feature flag config (FF_ICP_STUDIO = false)
```

**Exit Criteria:** New tables exist, Compass Beta unchanged

**What exists after Phase 0:**
- Empty `projects`, `project_drafts`, `user_content_defaults` tables
- Feature flag ready but disabled
- Compass Beta working exactly as before

---

### Phase 1: Backend APIs (Days 3-7)

**Risk Level:** ✅ None — new endpoints that nothing calls yet

**Goal:** Complete backend for ICP flow

```
Day 3-4: Projects API
- [ ] POST /api/studio/projects — Create project
- [ ] GET /api/studio/projects — List user's projects
- [ ] GET /api/studio/projects/[id] — Get single project
- [ ] PUT /api/studio/projects/[id] — Update project (creates draft version)
- [ ] DELETE /api/studio/projects/[id] — Delete project
- [ ] GET /api/studio/projects/[id]/drafts — List draft versions
- [ ] GET /api/studio/projects/[id]/drafts/[version] — Get specific version

Day 5-6: Content Generation API
- [ ] POST /api/studio/content/generate — Brief → draft with voice
- [ ] Wire to existing Voice Lab profiles (read-only)
- [ ] Implement voice-constrained generation prompts

Day 7: Analysis API
- [ ] POST /api/studio/editor/analyze — Voice check + brief coverage
- [ ] Reuse existing canon check logic from /api/brain/analyze
- [ ] Return unified analysis response
```

**Namespacing:** All new APIs under `/api/studio/*` prevents collisions with existing endpoints.

**Exit Criteria:** Full API coverage, testable via curl/Postman

**What exists after Phase 1:**
- Complete ICP backend
- Can test full flow via API calls
- Compass Beta still unchanged

---

### Phase 2: Hidden UI (Days 8-14)

**Risk Level:** ✅ Low — pages exist but aren't linked anywhere

**Goal:** Build complete ICP frontend at hidden routes

```
Day 8-10: Content Builder
- [ ] /studio/builder/page.tsx — Brief form + voice picker
- [ ] /studio/builder/components/BriefForm.tsx
- [ ] /studio/builder/components/DraftPreview.tsx
- [ ] Wire to /api/studio/content/generate
- [ ] "Open in Editor" button → /studio/editor?project={id}

Day 11-12: Project Management
- [ ] /studio/projects/page.tsx — Project list
- [ ] /studio/projects/components/ProjectCard.tsx
- [ ] Filter by status (draft, editing, complete)
- [ ] "New Project" → /studio/builder

Day 13-14: Enhanced Editor
- [ ] /studio/editor/page.tsx — AI Editor with Intelligence Panel
- [ ] /studio/editor/components/IntelligencePanel.tsx
- [ ] /studio/editor/components/VoiceCheckPanel.tsx
- [ ] /studio/editor/components/BriefCoveragePanel.tsx
- [ ] /studio/editor/components/DraftHistoryPanel.tsx
- [ ] Wire to /api/studio/editor/analyze
- [ ] Auto-save with version creation
```

**Access:** Direct URL only (e.g., `https://app.../studio/builder`). No navigation links.

**Exit Criteria:** Complete ICP flow accessible via direct URLs

**What exists after Phase 2:**
- Full ICP experience at `/studio/*`
- Internal testing possible
- Compass Beta completely unchanged

---

### Phase 3: Feature Flag Rollout (Days 15-18)

**Risk Level:** ⚠️ Controlled — gradual exposure

**Goal:** Controlled rollout to users

```
Day 15: Gated Navigation
- [ ] Add "Studio (Beta)" item to Header navigation
- [ ] Gate with FF_ICP_STUDIO feature flag
- [ ] Enable flag for 1-2 test users only

Day 16-17: User Testing
- [ ] Real workflow testing with test users
- [ ] Collect feedback on Builder → Editor flow
- [ ] Fix critical issues found
- [ ] Verify draft versioning works correctly

Day 18: Wider Rollout
- [ ] Enable FF_ICP_STUDIO for all internal users
- [ ] Monitor for errors/issues
- [ ] Keep Beta flows available as fallback
```

**Exit Criteria:** All users have access to Studio, no critical issues

---

### Phase 4: Polish & Migration (Days 19-21)

**Risk Level:** ⚠️ Low — optional migration steps

**Goal:** Complete transition and cleanup

```
Day 19-20: Polish
- [ ] Add onboarding hints for first-time Studio users
- [ ] Improve error messages and edge cases
- [ ] Performance optimization if needed
- [ ] Add "Studio" as default landing (optional)

Day 21: Documentation & Cleanup
- [ ] Update user documentation
- [ ] Archive Content Helper page (if still exists)
- [ ] Plan deprecation timeline for old AI Editor flow
- [ ] Document migration path for any localStorage data
```

**Exit Criteria:** ICP is primary workflow, documentation complete

---

### Rollout Summary

| Phase | Days | Risk | Changes to Production |
|-------|------|------|----------------------|
| **0: Database** | 1-2 | ✅ None | Add empty tables |
| **1: Backend** | 3-7 | ✅ None | Add `/api/studio/*` (uncalled) |
| **2: Hidden UI** | 8-14 | ✅ Low | Add `/studio/*` (unlinked) |
| **3: Flag Rollout** | 15-18 | ⚠️ Controlled | Nav link via feature flag |
| **4: Polish** | 19-21 | ⚠️ Low | Optional migration |

**Total:** ~3 weeks for full rollout with minimal risk

**Rollback Plan:** At any phase, disable `FF_ICP_STUDIO` to hide Studio. Compass Beta remains fully functional throughout.

---

## Part 11: Future Considerations

### Deferred to v2

| Feature | Reason for Deferral |
|---------|---------------------|
| **Product knowledge validation** | Requires building Anduin knowledge base |
| **Editorial integrity checks** | Requires manifesto/profile setup (from Content Helper) |
| **Launch Center integration** | Focus on content creation first |
| **Team collaboration** | Single-user focus for v1 |
| **Content repurposing** | After core flow is solid |

### Architecture Supports Future

The modular design allows:
- New validation sources (product KB, competitor analysis)
- New output formats (same brief → multiple formats)
- Team features (shared projects, approval workflows)
- Launch Center (projects export to launch pipeline)

---

## Part 12: Success Metrics

### User Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Time from brief to first draft | <5 minutes | Track generation API latency |
| Draft editing time | <50% of current | User feedback |
| Voice match score | >80% average | Track from voice check |
| Projects completed per week | 5+ per active user | Query projects table |

### System Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Generation success rate | >95% | API error tracking |
| Voice check accuracy | User-validated | Feedback on suggestions |
| Canon check relevance | User-validated | Feedback on matches |

---

## Appendix A: Prompt Templates

### Generation Prompt

```
## TASK
Generate a ${format} for ${audience}.

## TOPIC
${title}

## KEY POINTS TO COVER
${keyPoints.map(p => `- ${p}`).join('\n')}

## VOICE PROFILE
${voiceProfile.style_guide}

## CONTENT DOMAIN
${domainInstructions[contentDomain]}

## FORMAT GUIDELINES
${formatGuidelines[format]}

## OUTPUT
Write the full ${format}. No meta-commentary. Just the content.
```

### Voice Check Prompt

```
## TASK
Compare this draft against the voice profile. Identify deviations.

## VOICE PROFILE
${voiceProfile.style_guide}

## DRAFT
${draft}

## OUTPUT FORMAT
Return JSON:
{
  "score": 0-100,
  "suggestions": [
    {
      "location": "Paragraph X, sentence Y",
      "issue": "Description of deviation",
      "original": "Original text",
      "suggested": "Suggested revision"
    }
  ]
}
```

---

## Appendix B: API Reference

### Studio Projects (NEW - ICP)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/studio/projects` | GET | List user's projects |
| `/api/studio/projects` | POST | Create new project |
| `/api/studio/projects/[id]` | GET | Get single project |
| `/api/studio/projects/[id]` | PUT | Update project (creates draft version) |
| `/api/studio/projects/[id]` | DELETE | Delete project |
| `/api/studio/projects/[id]/drafts` | GET | List all draft versions |
| `/api/studio/projects/[id]/drafts/[version]` | GET | Get specific draft version |

### Studio Content (NEW - ICP)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/studio/content/generate` | POST | Generate draft from brief with voice |

### Studio Editor (NEW - ICP)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/studio/editor/analyze` | POST | Run voice check + brief coverage + canon |

### Voice Lab (existing)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/voice-lab/profiles` | GET/POST | List/create profiles |
| `/api/voice-lab/analyze` | POST | Analyze writing samples |
| `/api/voice-lab/generate` | POST | Generate full profile |
| `/api/voice-lab/revise` | POST | Apply profile to draft |

---

---

*Document Version: 1.0*
*Last Updated: 2026-01-22*
*Status: Approved Architecture*
*ADR Reference: [ADR 0008 — ICP: Integrated Content Platform](../adr/0008-icp-integrated-content-platform.md)*

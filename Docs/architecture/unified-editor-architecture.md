# Unified Editor Architecture

## The Problem: Two Disconnected Editors

**Current State:**
- **Research Assistant** (`/research-assistant`) - Quick research/analysis tool
- **Studio Editor** (`/studio/editor`) - Content production workflow

They share the same positioning engine but serve different intents with **no connection between them**.

```
User Journey Today (Fragmented):

Path A: Research Mode
┌─────────────┐     ┌──────────────┐
│  Home Page  │ ──→ │  Research Assistant   │ ──→ Dead End
│  (paste)    │     │  (analysis)  │     (no next step)
└─────────────┘     └──────────────┘

Path B: Production Mode
┌─────────────┐     ┌─────────────┐     ┌────────────────┐
│   Studio    │ ──→ │   Builder   │ ──→ │ Studio Editor  │ ──→ Export
│   (home)    │     │   (brief)   │     │ (draft+checks) │
└─────────────┘     └─────────────┘     └────────────────┘

Problem: Path A and Path B never meet.
```

---

## Jobs To Be Done Analysis

### User Jobs (by phase):

| Phase | Job | Current Tool | Pain Point |
|-------|-----|--------------|------------|
| **Explore** | "What are experts saying about X?" | Research Assistant | Dead end after analysis |
| **Research** | "Who should I cite?" | Research Assistant | Can't bring into a project |
| **Plan** | "Create a brief for my content" | Builder | No connection to research |
| **Draft** | "Generate content in my voice" | Builder | One-shot generation |
| **Refine** | "Improve this section" | Missing | Can only regenerate all |
| **Validate** | "Does this match my voice/brief?" | Studio Editor | Suggestions aren't actionable |
| **Enrich** | "Add expert perspectives" | Missing | No citation workflow |
| **Export** | "Get polished final content" | Studio Editor | Works fine |

### The Gap:
**Research → Production transition is broken.** Users do research in Research Assistant, then start fresh in Studio with no context carried over.

---

## Proposed Architecture: Connected Workspaces

Instead of merging into one tool (which loses focus), **connect them with clear handoffs**.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPASS CONTENT PLATFORM                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────┐          ┌──────────────────────────────┐    │
│  │   RESEARCH HUB       │          │   PRODUCTION HUB             │    │
│  │   (Research Assistant)        │          │   (Studio)                   │    │
│  │                      │          │                              │    │
│  │  • Quick analysis    │   ──→    │  • Brief creation            │    │
│  │  • Explore camps     │  "Start  │  • Draft generation          │    │
│  │  • Find experts      │ Project" │  • Version history           │    │
│  │  • No commitment     │          │  • Section editing           │    │
│  │                      │          │  • Voice validation          │    │
│  │                      │   ←──    │                              │    │
│  │                      │ "Quick   │                              │    │
│  │                      │ Research"│                              │    │
│  └──────────────────────┘          └──────────────────────────────┘    │
│           │                                      │                      │
│           │         SHARED SERVICES              │                      │
│           │    ┌─────────────────────────┐       │                      │
│           └───→│  Analysis Engine        │←──────┘                      │
│                │  • Camp matching        │                              │
│                │  • Author lookup        │                              │
│                │  • LLM analysis         │                              │
│                │  • Voice checking       │                              │
│                └─────────────────────────┘                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Keep Both Tools, Add Bridges

**Why not merge?**
- Research Assistant serves "I'm just exploring" users (no project commitment)
- Studio serves "I'm creating something specific" users (structured workflow)
- Merging would confuse both user types

**Add bridges instead:**
- Research Assistant → "Start Project" button with analysis context
- Studio → "Quick Research" panel that invokes Research Assistant inline

### 2. Shared Component Library

Extract common UI into reusable components:

```
/components/analysis/
├── CampMatchCard.tsx       # Display matched camp + authors
├── AuthorCitationCard.tsx  # Author with quote + add citation
├── CheckResultPanel.tsx    # Expandable check result (voice/brief/canon)
├── PerspectiveGaps.tsx     # Missing perspectives display
└── SuggestionCard.tsx      # Actionable suggestion with apply/dismiss
```

Both editors import from shared library - no duplication.

### 3. Studio Gets "Research Panel" (Not Full Research Assistant)

Instead of rebuilding Research Assistant in Studio, add a **lightweight research panel**:

```
┌─────────────────────────────────────────────────────────────────┐
│  STUDIO EDITOR                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │  Content Editor         │  │  Intelligence Panel         │  │
│  │                         │  │                             │  │
│  │  [Your draft here...]   │  │  📊 Health Score           │  │
│  │                         │  │  ├─ Voice: 85%             │  │
│  │                         │  │  └─ Brief: 4/5             │  │
│  │                         │  │                             │  │
│  │                         │  │  🔬 Quick Research          │  │
│  │                         │  │  └─ [Find Experts] button  │  │
│  │                         │  │     Opens Research Assistant panel  │  │
│  │                         │  │     ↓                      │  │
│  │                         │  │  ┌─────────────────────┐   │  │
│  │                         │  │  │ Inline Results      │   │  │
│  │                         │  │  │ • Matched camps     │   │  │
│  │                         │  │  │ • Suggested experts │   │  │
│  │                         │  │  │ [+ Add Citation]    │   │  │
│  │                         │  │  └─────────────────────┘   │  │
│  │                         │  │                             │  │
│  │                         │  │  📚 Sources (citations)     │  │
│  └─────────────────────────┘  └─────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

The "Find Experts" button runs the same analysis engine but shows results **inline** without leaving Studio.

### 4. Research Assistant Gets "Create Project" Action

After analysis, users can create a Studio project with context:

```
┌─────────────────────────────────────────────────────────────┐
│  AI EDITOR RESULTS                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Analysis of your text...                                   │
│  • Matched camps: [AI Optimists], [Enterprise Tech]         │
│  • Missing: [AI Safety], [Regulatory]                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  💡 Ready to create content?                        │    │
│  │                                                     │    │
│  │  [Create Studio Project]                            │    │
│  │                                                     │    │
│  │  Your research will be included:                    │    │
│  │  • Matched perspectives as suggested citations      │    │
│  │  • Missing camps as brief prompts                   │    │
│  │  • Analyzed text as starting draft                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## User Flow: Connected Journey

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        CONNECTED USER JOURNEY                            │
└──────────────────────────────────────────────────────────────────────────┘

EXPLORATION (Research Assistant)
┌─────────────┐     ┌──────────────────────────────────────┐
│ "What are   │     │ Research Assistant                            │
│  experts    │ ──→ │ • See matched camps                  │
│  saying?"   │     │ • Discover experts                   │
└─────────────┘     │ • Identify gaps                      │
                    │                                      │
                    │  [Create Project with Context] ──────┼───┐
                    └──────────────────────────────────────┘   │
                                                               │
                                                               ▼
PRODUCTION (Studio)
┌──────────────────────────────────────────────────────────────┐
│ Studio Builder                                               │
│ • Pre-filled brief from research                             │
│ • Suggested experts to cite                                  │
│ • Gap analysis as key points                                 │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ Studio Editor                                                │
│                                                              │
│ [Draft Content]              [Intelligence Panel]            │
│                              • Voice check                   │
│                              • Brief coverage                │
│ Section 1 [Improve]          • [Find Experts] ←── Quick      │
│ ---                          • Sources panel     Research    │
│ Section 2 [Improve]                                          │
│ ---                                                          │
│ Section 3 [Improve]          [v2 ▼ History]                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
            [Export Polished Content]
```

---

## Implementation Priority

### Phase 1: Connect the Bridges (High Impact, Low Effort)

1. **Research Assistant → Studio handoff**
   - Add "Create Project" button to Research Assistant results
   - Pass analysis context (matched camps, suggested experts, text)
   - Builder pre-populates with research context

2. **Shared components extraction**
   - Extract `CampMatchCard`, `AuthorCard` to shared lib
   - Both editors use same components

### Phase 2: Studio Intelligence Panel (Medium Effort)

3. **Quick Research in Studio**
   - Add "Find Experts" button to Intelligence Panel
   - Runs analysis on current draft
   - Shows results inline (not full Research Assistant)
   - "Add Citation" action to Sources panel

4. **Sources Panel**
   - Sidebar panel for managing citations
   - Add from research results
   - Shows: Author, quote, source link

### Phase 3: Enhanced Editing (As Planned)

5. **Version History UI**
6. **Section-Level Editing**
7. **Actionable Suggestions**

---

## Files to Create/Modify

### New Shared Components
```
/components/analysis/
├── CampMatchCard.tsx        # Reusable camp display
├── AuthorCitationCard.tsx   # Author with add-citation action
├── CheckResultPanel.tsx     # Expandable check result
└── index.ts                 # Exports
```

### Research Assistant Changes
```
/app/research-assistant/page.tsx
  + "Create Project" button in results
  + Handoff to Studio Builder with context
```

### Studio Builder Changes
```
/app/studio/builder/page.tsx
  + Accept research context from Research Assistant
  + Pre-fill brief with gap analysis
  + Show suggested citations
```

### Studio Editor Changes
```
/app/studio/editor/page.tsx
  + Quick Research button
  + Inline research results panel
  + Sources panel for citations

/components/studio/
├── QuickResearchPanel.tsx   # Inline Research Assistant results
├── SourcesPanel.tsx         # Citation management
├── VersionHistoryPanel.tsx  # Version list + restore
└── SectionEditor.tsx        # Per-section editing
```

---

## Summary

| Approach | Pros | Cons |
|----------|------|------|
| **Merge into one tool** | Single destination | Loses focus, confusing UX |
| **Keep separate** | Clear purposes | Disconnected workflows |
| **Connect with bridges** ✅ | Best of both, clear flow | Requires bridge work |

**Recommendation**: Connect with bridges + shared components.

- Research Assistant stays lightweight for exploration
- Studio stays focused on production
- Bridges enable seamless research → production flow
- Shared components eliminate duplication
- Each tool can evolve independently

This is more scalable and maintains clear user mental models.

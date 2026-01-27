# User Flows and Bridges: A Deep Analysis

## Core Insight

Users don't follow a single linear path. They have **different starting points** and **different needs**:

| Starting Point | User Mindset | Primary Need |
|----------------|--------------|--------------|
| Blank slate | "I'm exploring a topic" | Inspiration, angles |
| Has key points | "I know what I want to say" | Structure, generation |
| Has rough draft | "I need to polish this" | Validation, refinement |
| Has polished draft | "I need more credibility" | Expert backing, citations |

Each requires a different entry point and flow. **Bridges should meet users where they are.**

---

## Four User Personas & Their Journeys

### Persona 1: The Explorer
**Mindset**: "I'm curious about a topic but don't have an angle yet"

**Current Journey (Broken)**:
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ Explore     │ ──→ │ Research Assistant    │ ──→ │ Dead End    │
│ or Home     │     │ (analysis)   │     │ (now what?) │
└─────────────┘     └──────────────┘     └─────────────┘
```

**Desired Journey**:
```
┌─────────────┐     ┌──────────────┐     ┌─────────────────────┐
│ Explore     │ ──→ │ Research Assistant    │ ──→ │ "I found my angle!" │
│ topic       │     │ See camps,   │     │                     │
│             │     │ authors,     │     │ [Save Research]     │
│             │     │ perspectives │     │ [Start Project] ────┼──→ Builder
└─────────────┘     └──────────────┘     └─────────────────────┘      (with context)
```

**Bridge Needed**: Research → Project Creation
- **Trigger**: User finds interesting perspectives in Research Assistant
- **Action**: "Start Project from Research"
- **Context Passed**:
  - Matched camps as potential angles
  - Key authors as suggested citations
  - Original text as draft seed or brief inspiration

---

### Persona 2: The Structured Creator
**Mindset**: "I know my key points, help me create content"

**Current Journey (Works, but isolated)**:
```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ Studio      │ ──→ │ Builder      │ ──→ │ Editor       │
│ Home        │     │ (brief +     │     │ (draft +     │
│             │     │  key points) │     │  checks)     │
└─────────────┘     └──────────────┘     └──────────────┘
```

**Pain Point**: What if their key points are missing important perspectives? They don't know what they don't know.

**Desired Journey**:
```
┌─────────────┐     ┌──────────────────────────────────┐     ┌──────────────┐
│ Studio      │ ──→ │ Builder                          │ ──→ │ Editor       │
│ Home        │     │ (brief + key points)             │     │              │
│             │     │                                  │     │              │
│             │     │ [Preview Landscape] ─────────────┼──→  │ Research Assistant    │
│             │     │ "See what experts say about      │ ←─┼─ (inline)     │
│             │     │  your topic before generating"   │     │              │
└─────────────┘     └──────────────────────────────────┘     └──────────────┘
```

**Bridge Needed**: Key Points → Landscape Preview
- **Trigger**: User enters key points in Builder
- **Action**: "Preview Expert Landscape" (optional)
- **Value**: See if key points align with or challenge existing camps
- **Context Passed**: Key points become the analysis input

---

### Persona 3: The Polisher
**Mindset**: "I have a draft, I need to validate and refine it"

**Current Journey (Works)**:
```
┌──────────────┐     ┌────────────────────────────────┐
│ Studio       │ ──→ │ Editor                         │
│ Editor       │     │ • Run voice check              │
│              │     │ • Run brief check              │
│              │     │ • Run canon check              │
│              │     │ • See suggestions (read-only)  │
└──────────────┘     └────────────────────────────────┘
```

**Pain Point**: Suggestions exist but aren't actionable. User has to manually apply them.

**Desired Journey**:
```
┌──────────────┐     ┌────────────────────────────────────────────────────┐
│ Studio       │ ──→ │ Editor                                             │
│ Editor       │     │                                                    │
│              │     │ Voice Check Results:                               │
│              │     │ ┌──────────────────────────────────────────────┐   │
│              │     │ │ "This sentence doesn't match your voice"     │   │
│              │     │ │ Original: "We need to leverage synergies..." │   │
│              │     │ │ Suggested: "We should combine our efforts.." │   │
│              │     │ │ [Apply] [Dismiss] [Edit]                     │   │
│              │     │ └──────────────────────────────────────────────┘   │
│              │     │                                                    │
│              │     │ → Auto-saves as new version when applied          │
└──────────────┘     └────────────────────────────────────────────────────┘
```

**Bridge Needed**: Suggestion → Application
- **Trigger**: User runs checks, sees suggestions
- **Action**: One-click apply suggestion
- **Value**: Reduces friction from "I see what to fix" to "It's fixed"
- **Note**: This isn't a page bridge, it's a **workflow bridge** within the editor

---

### Persona 4: The Credibility Seeker
**Mindset**: "My draft is good but needs expert backing"

**Current Journey (Doesn't exist)**:
```
┌──────────────┐     ┌────────────────┐     ┌─────────────┐
│ Have draft   │ ──→ │ ??? Where do   │ ──→ │ Manual      │
│ in Studio    │     │ I find experts │     │ copy-paste  │
│              │     │ to cite?       │     │ citations   │
└──────────────┘     └────────────────┘     └─────────────┘
```

**Desired Journey**:
```
┌──────────────────────────────────────────────────────────────────────────┐
│ Studio Editor                                                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Draft Content]                    [Intelligence Panel]                 │
│                                                                          │
│  "AI agents are transforming       📚 Sources (0)                        │
│   how we work..."                  No citations yet.                     │
│                                                                          │
│                                    [Find Supporting Experts]             │
│                                           │                              │
│                                           ▼                              │
│                                    ┌─────────────────────┐               │
│                                    │ Based on your draft:│               │
│                                    │                     │               │
│                                    │ Andrew Ng           │               │
│                                    │ "AI is the new      │               │
│                                    │  electricity..."    │               │
│                                    │ [+ Add Citation]    │               │
│                                    │                     │               │
│                                    │ Fei-Fei Li          │               │
│                                    │ "Human-centered AI  │               │
│                                    │  is essential..."   │               │
│                                    │ [+ Add Citation]    │               │
│                                    └─────────────────────┘               │
│                                                                          │
│                                    📚 Sources (2)                        │
│                                    • Andrew Ng - "AI is the new..."     │
│                                    • Fei-Fei Li - "Human-centered..."   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Bridge Needed**: Draft → Expert Discovery → Citation
- **Trigger**: User clicks "Find Supporting Experts" in Studio Editor
- **Action**: Analyzes draft, suggests relevant thought leaders with quotes
- **Value**: "My draft now has credible backing without leaving my workspace"
- **Key**: Results appear **inline**, not in a separate page

---

## The Bridge Matrix

| From | To | Trigger | User Says | Bridge Type |
|------|-----|---------|-----------|-------------|
| Research Assistant | Studio Builder | Found interesting angle | "I want to write about this" | Page handoff |
| Studio Builder | Research Assistant (inline) | Entered key points | "What are experts saying?" | Modal/panel |
| Studio Editor | Expert search (inline) | Draft exists, needs backing | "Who supports my points?" | Panel |
| Studio Editor | Suggestion | Check found issues | "Fix this for me" | Action button |
| Author page | Studio project | Browsing experts | "I want to cite this person" | Context menu |
| Explore page | Research Assistant | Found interesting topic | "Analyze this topic" | Link with context |

---

## Key Design Principles

### 1. Meet Users Where They Are
Don't force users into a single workflow. Provide entry points at each stage:
- **Exploring?** → Research Assistant, Explore page
- **Creating?** → Studio Builder
- **Refining?** → Studio Editor
- **Enriching?** → Find Experts (inline)

### 2. Inline Over Navigation
When possible, bring the tool to the user, not the user to the tool:
- ❌ "Go to Research Assistant to find experts"
- ✅ "Find experts" panel opens inline in Studio Editor

### 3. Preserve Context Across Bridges
When users cross a bridge, carry their context:
- Research → Project: Include matched camps, suggested authors
- Key points → Analysis: Pre-fill with their key points
- Draft → Expert search: Analyze their actual draft content

### 4. Make Actions, Not Just Information
Every insight should have a clear next action:
- Camp matched → [Add to brief] or [Cite author]
- Voice issue found → [Apply fix] or [Dismiss]
- Expert found → [Add citation] or [View profile]

---

## Revised Architecture with Bridges

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            COMPASS PLATFORM                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ENTRY POINTS (Where users start)                                           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  [Home]           [Explore]          [Studio]          [Authors]     │  │
│  │  Quick analyze    Browse topics      Create content    Browse experts │  │
│  │       │               │                   │                 │         │  │
│  └───────┼───────────────┼───────────────────┼─────────────────┼─────────┘  │
│          │               │                   │                 │            │
│          ▼               ▼                   ▼                 ▼            │
│  ┌───────────────┐ ┌──────────────┐ ┌───────────────┐ ┌───────────────────┐ │
│  │  Research Assistant    │ │  Topic View  │ │ Studio Builder│ │  Author Profile   │ │
│  │               │ │              │ │               │ │                   │ │
│  │ Paste text,   │ │ See camps,   │ │ Define brief, │ │ See positions,    │ │
│  │ get analysis  │ │ key authors  │ │ key points,   │ │ quotes, works     │ │
│  │               │ │              │ │ voice profile │ │                   │ │
│  │ ┌───────────┐ │ │ ┌──────────┐ │ │ ┌───────────┐ │ │ ┌───────────────┐ │ │
│  │ │[Start     │ │ │ │[Analyze  │ │ │ │[Preview   │ │ │ │[Add to Project│ │ │
│  │ │ Project]  │◀┼─┼─┤ Topic]   │ │ │ │ Landscape]│ │ │ │ Sources]      │ │ │
│  │ └───────────┘ │ │ └──────────┘ │ │ └───────────┘ │ │ └───────────────┘ │ │
│  └───────┬───────┘ └──────────────┘ └───────┬───────┘ └─────────┬─────────┘ │
│          │                                  │                   │           │
│          │         BRIDGE: Research context │                   │           │
│          └──────────────────────────────────┼───────────────────┘           │
│                                             │                               │
│                                             ▼                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        STUDIO EDITOR                                │    │
│  │                      (Central Workspace)                            │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │                                                                     │    │
│  │  ┌─────────────────────────┐    ┌────────────────────────────────┐ │    │
│  │  │  Content Pane           │    │  Intelligence Pane             │ │    │
│  │  │                         │    │                                │ │    │
│  │  │  [Section 1]            │    │  Health: Voice 85%, Brief 4/5  │ │    │
│  │  │  Your draft text...     │    │                                │ │    │
│  │  │              [Improve]  │    │  Suggestions (3)               │ │    │
│  │  │  ---                    │    │  ┌────────────────────────┐    │ │    │
│  │  │  [Section 2]            │    │  │ [Apply] [Dismiss]      │    │ │    │
│  │  │  More content...        │    │  └────────────────────────┘    │ │    │
│  │  │              [Improve]  │    │                                │ │    │
│  │  │                         │    │  [Find Supporting Experts]     │ │    │
│  │  │                         │    │         │                      │ │    │
│  │  │                         │    │         ▼ (inline panel)       │ │    │
│  │  │                         │    │  ┌────────────────────────┐    │ │    │
│  │  │                         │    │  │ Andrew Ng [+ Cite]     │    │ │    │
│  │  │                         │    │  │ "AI is the new..."     │    │ │    │
│  │  │                         │    │  └────────────────────────┘    │ │    │
│  │  │                         │    │                                │ │    │
│  │  │                         │    │  Sources (2)                   │ │    │
│  │  │                         │    │  • Andrew Ng                   │ │    │
│  │  │                         │    │  • Fei-Fei Li                  │ │    │
│  │  │                         │    │                                │ │    │
│  │  │                         │    │  [v3 ▼ History]                │ │    │
│  │  └─────────────────────────┘    └────────────────────────────────┘ │    │
│  │                                                                     │    │
│  │  [Save] [Export]                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Priority (Revised)

### Phase 1: Credibility Bridge (Highest Value) ✅ COMPLETED
**Why first**: Most users already have drafts. Getting expert backing is immediate value.

1. ✅ "Find Supporting Experts" in Studio Editor - `components/studio/FindExpertsPanel.tsx`
2. ✅ Inline results panel (uses Research Assistant analysis engine via `/api/brain/analyze`)
3. ✅ "Add Citation" action → Sources panel
4. ✅ Sources panel display - `components/studio/SourcesPanel.tsx`

### Phase 2: Actionable Suggestions
**Why second**: Reduces friction for existing workflow.

1. Apply/Dismiss buttons on suggestions
2. Auto-save as version when applied
3. Preview before applying

### Phase 3: Research → Project Bridge
**Why third**: Connects exploration to production.

1. "Start Project" button in Research Assistant results
2. Context handoff to Builder
3. Pre-fill suggested citations

### Phase 4: Section Editing + History
**Why fourth**: Polish features for power users.

1. Section markers and per-section improvement
2. Version history panel
3. Restore/compare versions

---

## Summary

The bridges aren't just navigation links—they're **workflow transitions** that respect where users are in their journey:

| User State | Bridge | Destination |
|------------|--------|-------------|
| Exploring, found angle | "Start Project" | Builder with research context |
| Creating, wants validation | "Preview Landscape" | Inline Research Assistant |
| Editing, needs credibility | "Find Experts" | Inline expert search |
| Validating, sees issues | "Apply" | Direct content update |

**Key principle**: Every bridge should feel like a natural next step, not a detour.

# Studio User Flow Redesign Plan

## Problem Statement
Users entering Studio face decision friction:
1. Must visit Voice Lab separately to create voice profiles before using Studio
2. Projects page shows existing content but doesn't guide new users
3. Multiple entry points (Projects, Builder, Editor) create confusion
4. No clear "just start creating" path

## Current Flow (Problematic)
```
Voice Lab (separate) → Studio Projects → Builder → Editor → Export
       ↑                     ↑
       |                     |
       +-- Must create profile first (blocking)
                             |
                             +-- Shows list, not action-oriented
```

## Proposed Solution: "Start Creating" Flow

### Core Principle
**One entry point, smart defaults, inline everything.**

When a user clicks "Studio" in nav, they should immediately be able to start creating content without any prerequisites or decisions.

### New Flow
```
Studio Entry Point
       ↓
   ┌───────────────────────────────────────┐
   │         Welcome / Dashboard           │
   │  ┌─────────────────────────────────┐  │
   │  │   🎯 Start New Content          │  │  ← Primary CTA
   │  │   (Big, prominent button)       │  │
   │  └─────────────────────────────────┘  │
   │                                       │
   │  Recent Projects (compact list)       │
   │  ├─ Project A → Continue Editing     │
   │  ├─ Project B → Review Draft         │
   │  └─ Project C → Generate Draft       │
   └───────────────────────────────────────┘
       ↓ (Click "Start New Content")
   ┌───────────────────────────────────────┐
   │         Builder (Unified)             │
   │                                       │
   │  Step 1: Brief                        │
   │  - Title, Format, Audience, Points    │
   │                                       │
   │  Step 2: Voice (Inline!)              │
   │  ┌─────────────────────────────────┐  │
   │  │ Select existing profile    [▼]  │  │
   │  │ ─── or ───                      │  │
   │  │ [+ Create New Voice Profile]    │  │  ← Inline creation
   │  │    (Expand inline form)         │  │
   │  │ ─── or ───                      │  │
   │  │ [Skip - Use Default Style]      │  │  ← Zero friction option
   │  └─────────────────────────────────┘  │
   │                                       │
   │  [Generate Draft →]                   │
   └───────────────────────────────────────┘
       ↓
   ┌───────────────────────────────────────┐
   │         Editor                        │
   │  - Edit content                       │
   │  - Voice check sidebar                │
   │  - Canon check                        │
   │  - Export options                     │
   └───────────────────────────────────────┘
```

### Implementation Phases

#### Phase 1: Unified Entry Point (Quick Win)
**Goal:** Replace Projects page as default landing with a dashboard-style view

Changes:
1. **`/studio` route** → New dashboard component
   - Hero section with "Start New Content" CTA
   - Recent projects list (reuse existing list UI)
   - Quick stats (drafts in progress, completed this week)

2. **`/studio/projects`** → Keep as full project management
   - Link from dashboard: "View all projects →"

Files to create/modify:
- `app/studio/page.tsx` (new - dashboard)
- `app/studio/projects/page.tsx` (minor - add back link)

#### Phase 2: Inline Voice Profile Creation (Core Feature)
**Goal:** Users can create voice profiles without leaving Builder

Changes:
1. **Builder voice selection** → Add inline creation option
   - Dropdown with existing profiles
   - "Create new..." option expands inline form
   - Simplified profile creation (name + paste samples)
   - Full profile editing still in Voice Lab

2. **Minimal profile creation form:**
   - Profile name (required)
   - Paste 2-3 writing samples (textarea)
   - [Quick Create] → AI generates style guide
   - OR [Advanced] → Opens full Voice Lab in new tab

Files to create/modify:
- `app/studio/builder/page.tsx` (add inline voice creation)
- `components/studio/InlineVoiceCreator.tsx` (new component)
- `app/api/studio/voice/quick-create/route.ts` (new API - creates profile from samples)

#### Phase 3: Smart Defaults & Zero-Friction Path
**Goal:** Users can generate content with zero configuration

Changes:
1. **"Skip voice profile" option** → Use neutral professional style
2. **Remember last used settings** → Pre-fill format, audience, domain
3. **Template starters** → "LinkedIn thought piece", "Blog explainer", etc.

Files to create/modify:
- `lib/studio/defaults.ts` (user preference management)
- `app/studio/builder/page.tsx` (add templates, remember settings)

#### Phase 4: Voice Lab Integration (Cleanup)
**Goal:** Voice Lab becomes "advanced voice management", not required

Changes:
1. **Voice Lab** → Rename to "Voice Profiles" in nav (clearer)
2. **Add link from Studio** → "Manage all voice profiles →"
3. **Remove from main nav** → Access from Studio or Settings
4. **Bidirectional sync** → Profiles created in Studio appear in Voice Lab

Files to modify:
- `components/Header.tsx` (simplify nav)
- `app/voice-lab/page.tsx` (add "back to Studio" link)

### Navigation Structure (After)

```
Header Nav:
[Home] [Studio] [AI Editor] [Explore] [Authors] [History]
                  ↓
              Dashboard
              ├── Start New Content → Builder
              ├── Recent Projects
              └── Manage Voice Profiles → Voice Lab
```

### Success Metrics
1. **Time to first draft** < 2 minutes for returning users
2. **Zero prerequisite actions** - can start immediately
3. **No dead ends** - every screen has clear next action
4. **Single mental model** - "Studio is where I create content"

### Out of Scope (Future)
- Template marketplace
- Team collaboration
- Content calendar
- Publishing integrations

## Recommended Implementation Order

| Priority | Phase | Effort | Impact |
|----------|-------|--------|--------|
| 1 | Phase 1: Dashboard | Low | High |
| 2 | Phase 3: Smart Defaults | Low | Medium |
| 3 | Phase 2: Inline Voice | Medium | High |
| 4 | Phase 4: Nav Cleanup | Low | Low |

**Start with Phase 1** - it provides immediate UX improvement with minimal code changes.

## File Changes Summary

### New Files
- `app/studio/page.tsx` - Dashboard entry point
- `components/studio/InlineVoiceCreator.tsx` - Inline voice profile creation
- `app/api/studio/voice/quick-create/route.ts` - Quick profile creation API

### Modified Files
- `app/studio/projects/page.tsx` - Add "back to dashboard" link
- `app/studio/builder/page.tsx` - Inline voice selection, templates, defaults
- `components/Header.tsx` - Update Studio link to /studio (not /studio/projects)
- `lib/studio/defaults.ts` - User preference storage

## Questions for User
None - plan is ready for approval to begin implementation.

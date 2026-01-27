# Onboarding & UI Improvement Plan

## Problem Statement

New users lack understanding of:
1. **The conceptual framework** - How domains, perspectives, and authors relate
2. **The landscape overview** - What 5 domains and 13 perspectives exist
3. **Why it matters** - The value of understanding AI discourse structure
4. **Where to start** - Clear entry points based on user intent

---

## Proposed Solution: Multi-Layer Approach

### Phase 1: Perspectives Directory (Priority: HIGH)

**New Section on Explore Page** - Add a visual "Landscape Overview" at the top of Explore before the search/accordion.

```
┌─────────────────────────────────────────────────────────────┐
│  THE AI DISCOURSE LANDSCAPE                                 │
│  5 domains · 13 perspectives · 200+ thought leaders         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ TECHNICAL   │ │ AI &        │ │ ENTERPRISE  │           │
│  │ CAPABILITIES│ │ SOCIETY     │ │ ADOPTION    │           │
│  │             │ │             │ │             │           │
│  │ • Scaling   │ │ • Safety    │ │ • Co-Evol   │           │
│  │ • New       │ │ • Democra-  │ │ • Tech Lead │           │
│  │   Approaches│ │   tize Fast │ │ • Business  │           │
│  │             │ │             │ │ • Builders  │           │
│  │  2 camps    │ │  2 camps    │ │  4 camps    │           │
│  │  45 authors │ │  38 authors │ │  52 authors │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐                           │
│  │ GOVERNANCE  │ │ FUTURE OF   │                           │
│  │ & OVERSIGHT │ │ WORK        │                           │
│  │             │ │             │                           │
│  │ • Regulator │ │ • Displace- │                           │
│  │ • Innovate  │ │   ment      │                           │
│  │ • Adaptive  │ │ • Human-AI  │                           │
│  │             │ │   Collab    │                           │
│  │  3 camps    │ │  2 camps    │                           │
│  └─────────────┘ └─────────────┘                           │
│                                                             │
│  [Click any domain to filter] [View relationship map →]    │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Create `DomainOverview` component
- Grid of 5 domain cards with perspective chips inside
- Click domain → filters accordion below
- Counts pulled from real data
- Subtle animations on hover

---

### Phase 2: Enhanced Homepage Context (Priority: HIGH)

**Replace or enhance the "How It Works" section** with a more visual explanation:

```
┌─────────────────────────────────────────────────────────────┐
│  UNDERSTAND THE AI DISCOURSE                                │
│                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │    5    │ →  │   13    │ →  │  200+   │ →  │  Your   │  │
│  │ Domains │    │Perspect-│    │ Authors │    │ Writing │  │
│  │         │    │  ives   │    │         │    │         │  │
│  │Technical│    │ Scaling │    │ Dario   │    │ "AI will│  │
│  │Society  │    │ Safety  │    │ Amodei  │    │  change │  │
│  │Enterprise    │ etc...  │    │ etc...  │    │  ..."   │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│                                                             │
│  We've mapped the major positions in AI discourse so you   │
│  can see which perspectives you're drawing from—and which  │
│  you might be missing.                                      │
│                                                             │
│  [Explore the Landscape →]  [Start Analyzing →]            │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Visual pipeline showing Domain → Perspective → Author → Your Writing
- Brief explanation of the curation
- Two clear CTAs: explore vs. analyze

---

### Phase 3: Perspective Relationship Visualization (Priority: MEDIUM)

**Add a "Relationship Map" view** accessible from Explore:

```
┌─────────────────────────────────────────────────────────────┐
│  PERSPECTIVE RELATIONSHIPS                    [Grid] [Map]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         ┌──────────────┐                                    │
│         │   Scaling    │                                    │
│         │ Will Deliver │←───────┐                          │
│         └──────────────┘        │ challenges               │
│               ↑                 │                          │
│               │ supports        │                          │
│               ↓                 ↓                          │
│    ┌──────────────┐     ┌──────────────┐                   │
│    │  Democratize │     │    Needs     │                   │
│    │     Fast     │     │ New Approach │                   │
│    └──────────────┘     └──────────────┘                   │
│                                                             │
│  ─── supports (aligned)    ─ ─ challenges (tension)        │
│                                                             │
│  Click any perspective to see authors and positions        │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Toggle between "Grid view" (current accordion) and "Map view"
- Simple node-link diagram (not full network graph)
- Uses existing `PERSPECTIVE_OPPOSITES` and `PERSPECTIVE_ALLIES` data
- Click node → shows perspective detail panel

---

### Phase 4: Improved First-Time Guidance (Priority: MEDIUM)

**Replace auto-show modal with inline progressive disclosure:**

1. **Explore page first visit:**
   - Show "Landscape Overview" expanded by default
   - Highlight with subtle pulse: "Start here to understand the landscape"
   - Collapse after user interacts

2. **Contextual tooltips:**
   - Info icons next to key terms (Domain, Perspective, etc.)
   - Hover/click to see definition
   - "Learn more" links to detailed explanation

3. **Empty state guidance:**
   - When no search active: "Pick a domain above or search for a topic"
   - When results shown: "Showing X perspectives matching your query"

---

### Phase 5: Quick Reference Card (Priority: LOW)

**Persistent help accessible from any page:**

```
┌─────────────────────────────────────┐
│  QUICK REFERENCE              [×]   │
├─────────────────────────────────────┤
│                                     │
│  DOMAIN                             │
│  A broad topic area (5 total)       │
│  Example: "AI & Society"            │
│                                     │
│  PERSPECTIVE                        │
│  A specific position within a       │
│  domain (13 total)                  │
│  Example: "Safety First"            │
│                                     │
│  AUTHORS                            │
│  Thought leaders who hold or        │
│  represent a perspective (200+)     │
│  Example: Dario Amodei              │
│                                     │
│  SUPPORTS / CHALLENGES              │
│  How perspectives relate across     │
│  domains—allies and tensions        │
│                                     │
│  [Full guide →]                     │
└─────────────────────────────────────┘
```

**Implementation:**
- Floating help button (?) in bottom-right
- Opens slide-out panel
- Persists user's "don't show again" preference

---

## Implementation Order

| Phase | Component | Effort | Impact |
|-------|-----------|--------|--------|
| 1 | Domain Overview on Explore | Medium | High |
| 2 | Homepage Context Section | Low | High |
| 3 | Relationship Map Toggle | High | Medium |
| 4 | Progressive Disclosure | Low | Medium |
| 5 | Quick Reference Card | Low | Low |

**Recommended Start:** Phase 1 + Phase 2 together (highest impact, reasonable effort)

---

## Design Principles

1. **Show, don't tell** - Visual hierarchy over text explanations
2. **Progressive disclosure** - Simple overview first, details on demand
3. **Multiple entry points** - Support different user intents (browse vs. analyze)
4. **Consistent visual language** - Domain colors, perspective chips, author cards
5. **Maintain existing aesthetic** - Swiss Editorial × Japanese Minimalism

---

## Files to Create/Modify

### New Components:
- `components/DomainOverview.tsx` - Visual domain grid
- `components/PerspectiveMap.tsx` - Relationship visualization (Phase 3)
- `components/QuickReference.tsx` - Help panel (Phase 5)

### Modified Files:
- `app/explore/page.tsx` - Add DomainOverview at top
- `app/page.tsx` - Enhance "How It Works" section
- `components/HowPerspectivesWorkModal.tsx` - Simplify, make supplementary
- `lib/constants/terminology.ts` - Add domain/perspective descriptions

---

## Success Metrics

After implementation, new users should be able to:
1. Understand the 5 domains within 10 seconds of landing on Explore
2. Navigate to a specific perspective within 3 clicks
3. Explain what "perspective" means without reading documentation
4. Discover perspective relationships through visual exploration

---

## Questions Before Implementation

1. Should the Domain Overview replace the current explore header, or sit above it?
2. Is the Relationship Map (Phase 3) a priority, or can it wait for v2?
3. Should domains be clickable from the homepage hero section?
4. Any preference on animation style (subtle fade vs. more dynamic)?

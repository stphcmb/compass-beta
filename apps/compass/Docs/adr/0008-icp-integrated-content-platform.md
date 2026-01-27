# ADR 0008 – Compass v1: Integrated Content Platform (ICP)

## Status

**Accepted**

## Context

Compass Beta launched with several independent modules:
- **AI Editor** — Analyze content against canon of thought leaders
- **Canon Explorer** — Browse/search 239 curated authors across 17 camps
- **Voice Lab** — Capture and apply writing styles (MVP)
- **Content Helper** — Editorial integrity checking (spec only, not built)

These modules were designed independently, leading to:
1. **Fragmented user experience** — Users hop between disconnected tools
2. **No unified workflow** — No clear path from "I have an idea" to "I have content"
3. **Overlapping data models** — Multiple "learning" systems that don't integrate
4. **Context loss** — No persistence of work-in-progress across sessions

Additionally, three separate vision documents were pulling the product in different directions:
- `COMPASS_V1_VISION.md` — Focused on canon/positioning validation
- `compass-modular-architecture.md` — Focused on Voice Lab integration
- `PREFERENCE_LEARNING_PLAN.md` — Focused on feedback-driven personalization

### The Business Need

Anduin's marketing team needs to produce thought leadership content:
- **Fast** — Executives have limited time
- **Consistent** — Brand voice must be maintained
- **Credible** — Content should be intellectually grounded
- **At scale** — Multiple pieces per week

The current Beta doesn't provide a unified content creation workflow.

## Decision

Evolve Compass Beta into **Compass v1 (ICP)** — the Integrated Content Platform.

### Core Principles

1. **One workflow, not many tools** — Brief → Generate → Validate → Edit
2. **Projects as persistence** — Every piece of content is tracked from idea to export
3. **Voice as constraint layer** — Applied during generation, not transformed after
4. **Validation as optional** — Canon check is available but doesn't block flow
5. **Modules stay independent** — But integrate through shared Projects

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      COMPASS v1 (ICP)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      PROJECTS                            │   │
│  │        (Persistence layer — tracks all content)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│      ┌───────────┬──────────┼──────────┬───────────┐          │
│      ▼           ▼          ▼          ▼           ▼          │
│  ┌───────┐  ┌────────┐  ┌────────┐  ┌──────┐  ┌────────┐     │
│  │ BRIEF │  │GENERATE│  │VALIDATE│  │ EDIT │  │ EXPORT │     │
│  └───────┘  └────────┘  └────────┘  └──────┘  └────────┘     │
│      │          │           │          │                       │
│      │    Content Builder   │     AI Editor                    │
│      │                      │                                  │
│      └──────────────────────┼──────────────────────────────   │
│                             │                                  │
│                    ┌────────▼────────┐                        │
│                    │   VOICE LAB     │                        │
│                    │ (constraint)    │                        │
│                    └─────────────────┘                        │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

### New Module: Content Builder

Handles Brief → Generate:
- Structured brief input (topic, key points, format, audience)
- Voice profile selection
- Voice-constrained generation
- Creates/updates Project record

### Enhanced Module: AI Editor

Handles Validate → Edit → Export:
- Receives project context from Content Builder
- Voice consistency checking (automatic)
- Brief coverage checking (automatic)
- Canon validation (optional, on-demand)
- Saves progress to Project

### Deprecated: Content Helper

The editorial integrity features (manifesto, brake, mirror, skew) are:
- Absorbed into AI Editor as future "Editorial Integrity Check"
- Deferred to v2
- Separate page removed

### Data Model Change

New `projects` table replaces scattered localStorage:
- Tracks content from brief to export
- Links to voice profile
- Stores draft versions
- Enables "My Projects" list

## Consequences

### Positive

- ✅ **Unified workflow** — Clear path from idea to content
- ✅ **Persistent state** — Work survives sessions, devices
- ✅ **Voice consistency** — Applied from generation, not bolted on
- ✅ **Flexible validation** — Canon check available but optional
- ✅ **Clear mental model** — Users understand the flow
- ✅ **Foundation for future** — Projects enable team features, Launch Center

### Negative / Tradeoffs

- ⚠️ **Migration effort** — Need to build Content Builder, enhance AI Editor
- ⚠️ **Deferred features** — Editorial integrity pushed to v2
- ⚠️ **Product validation incomplete** — Anduin-specific content can't be validated against canon

### Mitigation

- **Migration**: Phased 4-week implementation plan
- **Deferred features**: Documented in architecture doc for v2 planning
- **Product validation**: Mark as "manual review" for v1; build knowledge base for v2

## Alternatives Considered

### Alternative A: Keep modules separate, add navigation

Just improve navigation between AI Editor, Voice Lab, etc.

**Rejected because:**
- Doesn't solve context loss between tools
- Users still have to mentally integrate the workflow
- No persistence or project tracking

### Alternative B: Build full Launch Center first

Start with publish/distribute, work backwards.

**Rejected because:**
- Content creation is the bottleneck, not distribution
- Need content before you can launch content
- Higher complexity, longer timeline

### Alternative C: Rebuild from scratch

Throw away Beta, start fresh with ICP architecture.

**Rejected because:**
- Voice Lab MVP works well
- Canon/Explorer is solid
- AI Editor analysis logic is reusable
- Would delay launch significantly

## Implementation Notes

See `/Docs/architecture/COMPASS_V1_ARCHITECTURE.md` for:
- Detailed module specifications
- API designs
- Database schema
- File structure
- 4-week implementation phases

## Related Decisions

- ADR 0007: Mini Brain Architecture (AI Editor foundation)
- ADR 0006: Search Expansion Module (Canon query logic)
- ADR 0002: Taxonomy 3-Tier Structure (Canon data model)

## Date

- When decided: 2026-01-22
- When documented: 2026-01-22

## References

- `/Docs/architecture/COMPASS_V1_ARCHITECTURE.md` — Full technical specification
- `/Docs/archive/vision-v0/` — Archived vision documents that informed this decision

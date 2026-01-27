# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for the Compass project.

## What are ADRs?

ADRs document significant architectural and design decisions made during the project's development. They provide context for why certain choices were made, what alternatives were considered, and what the consequences of each decision are.

## Purpose

ADRs serve as:
- **Institutional memory**: Preserve reasoning for future team members (or future you)
- **Onboarding documentation**: Help new contributors understand the system
- **Decision audit trail**: Track when and why architectural changes occurred
- **Context for refactoring**: Understand constraints before changing architecture

## When to Create an ADR

Create an ADR when making decisions about:
- Database structure and schema design
- Framework or technology choices
- Core architectural patterns
- Data modeling strategies
- API design approaches
- Deployment and hosting strategies
- Major algorithmic or UX decisions

**Don't create ADRs for**:
- Minor implementation details
- Temporary workarounds
- Individual feature implementations (use specs/ instead)
- Bug fixes

## ADR Lifecycle

### Statuses

Each ADR has a status:

- **Proposed**: Decision is under consideration
- **Accepted**: Decision has been made and implemented
- **Superseded**: Decision has been replaced by another ADR (reference the new ADR)
- **Deprecated**: Decision is no longer relevant but kept for historical context

### Process

1. **Propose**: Create new ADR with "Proposed" status
2. **Discuss**: Review with team/stakeholders if applicable
3. **Decide**: Update status to "Accepted" or archive
4. **Implement**: Build according to decision
5. **Evolve**: Mark as "Superseded" if replaced later

## ADR Template

When creating a new ADR, use this structure:

```markdown
# ADR NNNN – Short Decision Title

## Status
Proposed | Accepted | Superseded | Deprecated

## Context
- What problem are we solving?
- What constraints matter? (performance, simplicity, cost, etc.)
- What is the current situation?

## Decision
- What did we decide to do?
- How will it be implemented?

## Consequences
### Positive
- ✅ What benefits does this bring?

### Negative / Tradeoffs
- ⚠️ What are the downsides?
- ⚠️ What are we giving up?

### Mitigation
- How do we address the negatives?

## Alternatives Considered
- Alternative A – why rejected
- Alternative B – why rejected
- ...

## Implementation Notes
- Technical details
- Code examples
- Configuration

## Related Decisions
- Link to related ADRs
- Link to related specs

## Date
When decided: YYYY-MM-DD
When documented: YYYY-MM-DD

## References
- Links to docs, discussions, external resources
```

## Naming Convention

ADRs are numbered sequentially and use kebab-case titles:

```
NNNN-short-decision-title.md
```

Examples:
- `0001-use-supabase.md`
- `0002-taxonomy-3-tier-structure.md`
- `0003-use-nextjs-vercel.md`

## Product Naming Convention

| Name | What It Refers To | Status |
|------|-------------------|--------|
| **Compass Beta** | Current production (AI Editor, Canon Explorer, Voice Lab MVP) | Live |
| **Compass v1 / ICP** | Integrated Content Platform (unified content workflow) | Planning |

---

## Current ADRs

### Compass Beta (Current)

| # | Title | Status | Date |
|---|-------|--------|------|
| 0001 | [Use Supabase](./0001-use-supabase.md) | Accepted | 2024-11 |
| 0002 | [Taxonomy 3-Tier Structure](./0002-taxonomy-3-tier-structure.md) | Accepted | 2024-11 |
| 0003 | [Use Next.js + Vercel](./0003-use-nextjs-vercel.md) | Accepted | 2024-10 |
| 0004 | [Author Deduplication Strategy](./0004-author-deduplication-strategy.md) | Accepted | 2024-12-02 |
| 0005 | [Design System Standards](./0005-design-system-standards.md) | Accepted | 2024-12-02 |
| 0006 | [Search Expansion Module](./0006-search-expansion-module.md) | Accepted | 2024-12-03 |
| 0007 | [Mini Brain Architecture](./0007-mini-brain-architecture.md) | Accepted | 2024-12-10 |

### Compass v1 / ICP (Planned)

| # | Title | Status | Date |
|---|-------|--------|------|
| 0008 | [ICP: Integrated Content Platform](./0008-icp-integrated-content-platform.md) | Accepted | 2026-01-22 |
| 0009 | [Platform Architecture (Monorepo Separation)](./0009-platform-architecture.md) | Accepted | 2026-01-26 |

## How to Reference ADRs

When referencing ADRs in code or documentation:

```typescript
// Implements deduplication strategy from ADR 0004
const authorMap = new Map()
```

```markdown
See ADR 0002 for why we use 3-tier taxonomy structure.
```

## ADR Index by Topic

### Database & Schema
- ADR 0001: Use Supabase
- ADR 0002: Taxonomy 3-Tier Structure

### Frontend & Deployment
- ADR 0003: Use Next.js + Vercel
- ADR 0005: Design System Standards

### Features & Modules
- ADR 0004: Author Deduplication Strategy
- ADR 0006: Search Expansion Module
- ADR 0007: Mini Brain Architecture (AI Editor)

### Product Architecture
- ADR 0008: ICP — Integrated Content Platform (Compass v1)
- ADR 0009: Platform Architecture (Monorepo Separation)

---

**Note**: This is a living index. Update it when adding new ADRs.

**Last Updated:** 2026-01-26

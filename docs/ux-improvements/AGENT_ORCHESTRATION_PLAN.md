# Agent Orchestration Plan - UX Improvements

**Created**: 2026-01-28
**Orchestrator**: delivery-lead (agentId: aae1aa7)
**Status**: Ready for delegation
**Based on**: UX Audit by ui-ux-reviewer (agentId: a4adbf3)

## Executive Summary

This document outlines the tactical execution plan for implementing UX improvements across the Compass platform. The plan organizes work into **6 parallel workstreams** with **specific agent assignments**, **clear dependencies**, and **sequential handoffs** to ensure quality and coordination.

## Audit Findings Overview

### Critical Issues (P0)
1. **Broken "Draft-First" workflow mental model**
   - "AI Editor" label conflicts with actual functionality (it's a validator, not a creator)
   - Users expect to write in AI Editor, but it's actually a checking tool
   - Research Assistant is the actual "start with draft" entry point

2. **Navigation discoverability**
   - All nav items look identical (no visual hierarchy)
   - No indication of what features do until clicked
   - Missing breadcrumbs and context

3. **Author browsing disconnected**
   - Global Author Panel feels tacked-on
   - No relationship to user's current workflow
   - Missing "save for later" or "compare" actions

### Major Improvements (P1)
4. Research Assistant results hierarchy (summary → camps → authors)
5. Explore page identity crisis (search vs browse mode)
6. History → My Library rebranding and organization

### Quick Wins (P2)
7. Recently viewed authors
8. Saved items badges
9. Keyboard shortcuts

---

## Workstream Architecture

```
Phase 1: Foundation (Parallel)
├── WS1: Navigation & Information Architecture
└── WS2: Research Assistant Results Page

Phase 2: Core Features (Sequential after Phase 1)
├── WS3: Explore Page Redesign
└── WS4: My Library Transformation

Phase 3: Enhancements (Parallel)
└── WS5: Quick Wins & Polish

Phase 4: Quality Gates (Sequential)
└── WS6: Testing & Validation
```

---

## Workstream 1: Navigation & Information Architecture

**Phase**: 1 (Foundation)
**Priority**: P0 - Critical
**Dependencies**: None (can start immediately)
**Estimated Duration**: 2-3 hours

### Objectives
- Fix broken "AI Editor" mental model
- Improve navigation discoverability
- Establish clear visual hierarchy
- Add breadcrumbs and context indicators

### Agent Assignments

#### 1.1 Navigation Architecture
**Agent**: `navigation-architect`
**Task**: Restructure global navigation and Header.tsx

**Deliverables**:
- Revised navigation structure with clear visual hierarchy
- Updated labels (AI Editor → "Check Draft")
- Icon + badge + description pattern
- Breadcrumb component specification
- Context indicators for active routes

**Files to Modify**:
- `/apps/compass/components/Header.tsx`
- `/apps/compass/components/Navigation.tsx` (if separate)
- `/apps/compass/components/Breadcrumbs.tsx` (new)

#### 1.2 Messaging & Copy
**Agent**: `ux-writer`
**Task**: Revise copy and establish terminology consistency

**Deliverables**:
- Terminology glossary
- Updated microcopy for all nav items
- Revised page titles and descriptions
- Create `/apps/compass/lib/constants/terminology.ts`

**Files to Create/Modify**:
- `/apps/compass/lib/constants/terminology.ts` (new)
- All page.tsx files (update titles)
- Empty state components (improve copy)

---

## Workstream 2: Research Assistant Results Page

**Phase**: 1 (Foundation)
**Priority**: P0 - Critical
**Dependencies**: None (can start immediately)
**Estimated Duration**: 3-4 hours

### Objectives
- Fix information hierarchy (summary → camps → authors)
- Implement progressive disclosure with collapsible sections
- Add clear action CTAs for next steps
- Improve author browsing connection

### Agent Assignments

#### 2.1 Results Page Design
**Agent**: `ux-designer`
**Task**: Design improved results layout with progressive disclosure

**Deliverables**:
- Wireframes for new results hierarchy
- Collapsible section specifications
- Action button placement and copy
- Author card integration design

#### 2.2 Implementation
**Agent**: `frontend-form-builder`
**Task**: Implement new results page structure

**Files to Modify**:
- `/apps/compass/app/research-assistant/results/[id]/page.tsx`
- `/apps/compass/components/research-assistant/ResultsSection.tsx` (new)
- `/apps/compass/components/research-assistant/AuthorCard.tsx` (enhance)

---

## Workstream 3: Explore Page Redesign

**Phase**: 2 (Core Features)
**Priority**: P1 - Major
**Dependencies**: WS1 (Navigation) must complete first
**Estimated Duration**: 2-3 hours

### Objectives
- Resolve identity crisis: clearly separate search vs browse modes
- Surface domain filtering (currently buried)
- Add mode toggle (Search | Browse)
- Improve empty states

### Agent Assignments

#### 3.1 Page Redesign
**Agent**: `ux-designer`
**Task**: Design two distinct modes with clear mode switching

**Deliverables**:
- Mode toggle UI specification
- Search mode layout
- Browse mode layout
- Domain filter prominence

#### 3.2 Implementation
**Agent**: `frontend-coder`
**Task**: Implement mode toggle and redesigned layouts

**Files to Modify**:
- `/apps/compass/app/explore/page.tsx`
- `/apps/compass/components/explore/ModeToggle.tsx` (new)
- `/apps/compass/components/explore/SearchMode.tsx` (new)
- `/apps/compass/components/explore/BrowseMode.tsx` (new)

---

## Workstream 4: My Library Transformation

**Phase**: 2 (Core Features)
**Priority**: P1 - Major
**Dependencies**: WS1 (Navigation) must complete first
**Estimated Duration**: 2-3 hours

### Objectives
- Rebrand "History" to "My Library"
- Add organization features (filters, sorting, collections)
- Improve visual design (grid vs list toggle)
- Add saved items badges throughout app

### Agent Assignments

#### 4.1 Library Page Design
**Agent**: `ux-designer`
**Task**: Design new My Library page with organization features

**Deliverables**:
- Page layout with filters/sorting
- Collection management UI
- Grid and list view specifications
- Saved item badge design

#### 4.2 Implementation
**Agent**: `frontend-coder`
**Task**: Implement My Library page and saved badges

**Files to Modify/Create**:
- `/apps/compass/app/my-library/page.tsx` (renamed from /history)
- `/apps/compass/components/library/FilterBar.tsx` (new)
- `/apps/compass/components/library/CollectionManager.tsx` (new)
- `/apps/compass/components/SavedBadge.tsx` (new, reusable)

---

## Workstream 5: Quick Wins & Polish

**Phase**: 3 (Enhancements)
**Priority**: P2 - Nice-to-have
**Dependencies**: None (can run in parallel with WS2-4)
**Estimated Duration**: 2-3 hours

### Agent Assignments

#### 5.1 Quick Feature Additions
**Agent**: `frontend-coder`
**Task**: Implement recently viewed and keyboard shortcuts

**Parallel Tasks**:
- Recently Viewed Authors (localStorage tracking)
- Keyboard Shortcuts (Cmd+K, Cmd+E, Cmd+L, Esc)

**Files to Create**:
- `/apps/compass/lib/hooks/useRecentlyViewed.ts` (new)
- `/apps/compass/lib/hooks/useKeyboardShortcuts.ts` (new)
- `/apps/compass/components/KeyboardShortcutsModal.tsx` (new)

#### 5.2 Visual Polish
**Agent**: `ui-designer`
**Task**: Refine visual design and add micro-interactions

**Deliverables**:
- Transition and animation specifications
- Hover/focus state refinements
- Loading skeleton designs
- Empty state illustrations

---

## Workstream 6: Testing & Validation

**Phase**: 4 (Quality Gates)
**Priority**: P0 - Critical
**Dependencies**: All implementation workstreams (WS1-5) must complete
**Estimated Duration**: 2-3 hours

### Agent Assignments (Sequential)

#### 6.1 Automated Testing
**Agent**: `qa-automation-tester`
**Task**: Write and execute automated tests

**Deliverables**:
- Playwright E2E tests for primary workflows
- Visual regression tests
- Performance tests (Lighthouse CI)

**Files to Create**:
- `/apps/compass/tests/e2e/navigation.spec.ts`
- `/apps/compass/tests/e2e/research-assistant.spec.ts`
- `/apps/compass/tests/e2e/explore.spec.ts`
- `/apps/compass/tests/e2e/my-library.spec.ts`

#### 6.2 Accessibility Audit
**Agent**: `accessibility-auditor`
**Task**: Verify WCAG AA compliance

**Handoff**: Receives test results from 6.1

**Deliverables**:
- Accessibility audit report
- Axe DevTools scan results
- Keyboard navigation verification
- Screen reader compatibility check

**Success Criteria**:
- Zero critical accessibility violations
- All interactive elements keyboard accessible
- Color contrast meets WCAG AA (4.5:1)

#### 6.3 Code Review & Final Validation
**Agent**: `code-reviewer`
**Task**: Final code quality check and security review

**Handoff**: Receives test and accessibility reports from 6.1 and 6.2

**Review Checklist**:
- [ ] Build passes: `pnpm build`
- [ ] Lint clean: `pnpm lint`
- [ ] TypeScript errors: 0
- [ ] Security rules followed (auth, RLS, validation)
- [ ] No secrets committed
- [ ] Responsive design implemented
- [ ] Accessibility standards met
- [ ] Documentation updated

---

## Execution Phases

### Phase 1: Foundation (Parallel - Start Immediately)
**Duration**: 2-3 hours | **Workstreams**: WS1, WS2

These workstreams run in parallel:
- **WS1**: Navigation architecture and messaging
- **WS2**: Research Assistant results page redesign

### Phase 2: Core Features (Sequential)
**Duration**: 4-6 hours | **Workstreams**: WS3, WS4
**Blockers**: Wait for WS1 completion

Once navigation is complete:
- **WS3**: Explore page redesign
- **WS4**: My Library transformation

### Phase 3: Enhancements (Parallel)
**Duration**: 2-3 hours | **Workstreams**: WS5
**Blockers**: None

Quick wins can run anytime:
- **WS5**: Recently viewed, keyboard shortcuts, visual polish

### Phase 4: Quality Gates (Sequential)
**Duration**: 2-3 hours | **Workstreams**: WS6
**Blockers**: All implementation (WS1-5) must complete

Quality gates run sequentially:
1. **6.1**: Automated testing
2. **6.2**: Accessibility audit
3. **6.3**: Code review

---

## Dependencies Map

```
WS1 (Navigation) ──┬──> WS3 (Explore)
                   └──> WS4 (Library)

WS2 (Results) ─────────> No blockers

WS5 (Quick Wins) ──────> No blockers

All (WS1-5) ───────────> WS6 (Quality Gates)
```

**Critical Path**: WS1 → WS3/WS4 → WS6

---

## Success Metrics

### User Experience Goals
- [ ] Primary workflow friction reduced
- [ ] Navigation clarity improved
- [ ] Author browsing connected to user context
- [ ] Search vs Browse modes clearly differentiated

### Technical Goals
- [ ] Zero TypeScript errors
- [ ] Zero lint errors
- [ ] Build passes successfully
- [ ] WCAG AA compliance
- [ ] Lighthouse Performance > 90

---

## Agent Communication Protocol

### Status Updates
Each agent provides status updates at key milestones:
- **Started**: "Beginning work on [workstream]"
- **Blocked**: "Blocked on [dependency]"
- **Review Ready**: "Deliverables ready for review"
- **Complete**: "Workstream complete, handoff to [next agent]"

### Handoff Protocol
When an agent completes work:
1. Document what was completed
2. List files modified/created
3. Specify integration points for next agent
4. Tag next agent with "@[agent-name]"

---

## Next Steps

### Immediate Actions
1. **Delivery Lead** confirms user approval to begin delegation
2. **Delivery Lead** spawns agents for WS1 and WS2 (foundation phase)
3. Agents begin work in parallel

### Delegation Sequence
```bash
# Phase 1 (Parallel)
1. Task(navigation-architect) -> WS1.1
2. Task(ux-writer) -> WS1.2
3. Task(ux-designer) -> WS2.1
4. Task(frontend-form-builder) -> WS2.2

# Phase 2 (After WS1 complete)
5. Task(ux-designer) -> WS3.1
6. Task(frontend-coder) -> WS3.2
7. Task(ux-designer) -> WS4.1
8. Task(frontend-coder) -> WS4.2

# Phase 3 (Anytime, parallel)
9. Task(frontend-coder) -> WS5.1
10. Task(ui-designer) -> WS5.2

# Phase 4 (Sequential after all implementation)
11. Task(qa-automation-tester) -> WS6.1
12. Task(accessibility-auditor) -> WS6.2
13. Task(code-reviewer) -> WS6.3
```

---

## Documentation References

- Project conventions: `/.claude/CLAUDE.md`
- Frontend rules: `/.claude/rules/frontend.md`
- Security requirements: `/.claude/rules/security.md`
- Coordination plan: `/docs/ux-improvements/COORDINATION_PLAN.md`

---

**Plan Status**: ✅ Ready for Execution
**Awaiting**: User approval to begin agent delegation
**Recommended Start**: Workstream 1 + Workstream 2

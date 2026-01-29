# UX Improvements - Quick Reference

**Status**: Ready for execution
**Created**: 2026-01-28
**Last Updated**: 2026-01-28

## 📋 Documentation Index

1. **[COORDINATION_PLAN.md](./COORDINATION_PLAN.md)**
   - High-level strategy by delivery-lead
   - Phase structure and objectives
   - Agent responsibilities
   - Communication protocols

2. **[AGENT_ORCHESTRATION_PLAN.md](./AGENT_ORCHESTRATION_PLAN.md)** ⭐ PRIMARY
   - Detailed tactical execution plan by delivery-lead
   - 6 workstreams with specific agent assignments
   - Dependencies and handoff protocols
   - Code examples and file paths

3. **[UX_AUDIT_BRIEF.md](./UX_AUDIT_BRIEF.md)**
   - Audit scope and focus areas
   - Screens to review
   - Prioritization criteria

4. **[UX_AUDIT_FINDINGS.md](./UX_AUDIT_FINDINGS.md)** (TODO: extract from ui-ux-reviewer output)
   - Comprehensive audit results
   - Prioritized issues (P0/P1/P2)
   - Specific recommendations

---

## 🎯 Critical Issues (P0)

| Issue | Impact | Workstream | Agent |
|-------|--------|------------|-------|
| Broken "AI Editor" label | Users confused about functionality | WS1 | navigation-architect + ux-writer |
| Navigation hierarchy flat | Can't tell what features do | WS1 | navigation-architect |
| Results page hierarchy | Information overload | WS2 | ux-designer + frontend-form-builder |
| Author browsing disconnected | Users lose context | WS2 | frontend-form-builder |

---

## 🚀 Execution Plan at a Glance

### Phase 1: Foundation (Start Immediately)
**Duration**: 2-3 hours | **Parallel Execution**

```
WS1: Navigation            WS2: Results Page
├─ navigation-architect    ├─ ux-designer
└─ ux-writer               └─ frontend-form-builder
```

**Deliverables**:
- ✅ Revised Header.tsx with clear hierarchy
- ✅ New terminology (AI Editor → Check Draft)
- ✅ Improved results page with collapsible sections
- ✅ Author cards with action CTAs

### Phase 2: Core Features (After Phase 1)
**Duration**: 4-6 hours | **Parallel Execution**

```
WS3: Explore Page          WS4: My Library
├─ ux-designer             ├─ ux-designer
└─ frontend-coder          └─ frontend-coder
```

**Deliverables**:
- ✅ Search/Browse mode toggle
- ✅ Domain filtering prominence
- ✅ My Library organization features
- ✅ Saved badges across app

### Phase 3: Enhancements (Anytime)
**Duration**: 2-3 hours | **Parallel Execution**

```
WS5: Quick Wins
├─ frontend-coder (features)
└─ ui-designer (polish)
```

**Deliverables**:
- ✅ Recently viewed authors
- ✅ Keyboard shortcuts
- ✅ Visual polish & micro-interactions

### Phase 4: Quality Gates (After All Implementation)
**Duration**: 2-3 hours | **Sequential Execution**

```
WS6: Testing & Validation
├─ qa-automation-tester (E2E tests)
├─ accessibility-auditor (WCAG AA)
└─ code-reviewer (final approval)
```

---

## 📂 Key Files to Modify

### Navigation (WS1)
- `/apps/compass/components/Header.tsx` - Main nav component
- `/apps/compass/components/Breadcrumbs.tsx` - NEW: Breadcrumb nav
- `/apps/compass/lib/constants/terminology.ts` - NEW: Glossary

### Research Assistant (WS2)
- `/apps/compass/app/research-assistant/results/[id]/page.tsx` - Results layout
- `/apps/compass/components/research-assistant/ResultsSection.tsx` - NEW: Sections
- `/apps/compass/components/research-assistant/AuthorCard.tsx` - Enhanced cards

### Explore Page (WS3)
- `/apps/compass/app/explore/page.tsx` - Main page
- `/apps/compass/components/explore/ModeToggle.tsx` - NEW: Search/Browse toggle
- `/apps/compass/components/explore/SearchMode.tsx` - NEW: Search mode
- `/apps/compass/components/explore/BrowseMode.tsx` - NEW: Browse mode

### My Library (WS4)
- `/apps/compass/app/my-library/page.tsx` - Renamed from /history
- `/apps/compass/components/library/FilterBar.tsx` - NEW: Filters
- `/apps/compass/components/library/CollectionManager.tsx` - NEW: Collections
- `/apps/compass/components/SavedBadge.tsx` - NEW: Reusable badge

### Quick Wins (WS5)
- `/apps/compass/lib/hooks/useRecentlyViewed.ts` - NEW: Recent tracking
- `/apps/compass/lib/hooks/useKeyboardShortcuts.ts` - NEW: Shortcuts
- `/apps/compass/components/KeyboardShortcutsModal.tsx` - NEW: Help modal
- `/apps/compass/components/GlobalAuthorPanel.tsx` - Add recently viewed

### Testing (WS6)
- `/apps/compass/tests/e2e/*.spec.ts` - NEW: E2E tests

---

## 🔄 Dependencies

```
WS1 (Navigation) ──┬──> WS3 (Explore)
                   └──> WS4 (Library)

WS2 (Results) ─────────> No blockers

WS5 (Quick Wins) ──────> No blockers

All (WS1-5) ───────────> WS6 (Quality Gates)
```

**Critical Path**: WS1 → WS3/WS4 → WS6

---

## ✅ Success Criteria

### Must Have (P0)
- [ ] Navigation labels accurate and descriptive
- [ ] Results page has clear hierarchy
- [ ] All pages have proper breadcrumbs
- [ ] Author browsing integrated with workflow
- [ ] Zero TypeScript errors
- [ ] Zero accessibility violations (critical)

### Should Have (P1)
- [ ] Explore page modes clearly differentiated
- [ ] My Library has organization features
- [ ] Saved badges visible throughout app
- [ ] WCAG AA compliance (100%)

### Nice to Have (P2)
- [ ] Recently viewed authors
- [ ] Keyboard shortcuts
- [ ] Smooth animations and transitions
- [ ] Empty state illustrations

---

## 🚦 Go/No-Go Checklist

Before starting:
- [x] Audit complete
- [x] Plan documented
- [x] Workstreams defined
- [x] Agents assigned
- [ ] User approval received ← **CURRENT BLOCKER**

Before Phase 2:
- [ ] WS1 complete (navigation)
- [ ] WS2 complete (results)
- [ ] No blocking issues

Before final deployment:
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Code review approved
- [ ] Build succeeds
- [ ] User acceptance

---

## 📞 Agent Contact

| Agent | Specialization | Workstreams |
|-------|----------------|-------------|
| navigation-architect | Nav structure & IA | WS1.1 |
| ux-writer | Copy & messaging | WS1.2 |
| ux-designer | Interaction design | WS2.1, WS3.1, WS4.1 |
| frontend-form-builder | Complex UI/forms | WS2.2 |
| frontend-coder | General implementation | WS3.2, WS4.2, WS5.1 |
| ui-designer | Visual design & polish | WS5.2 |
| qa-automation-tester | E2E testing | WS6.1 |
| accessibility-auditor | WCAG compliance | WS6.2 |
| code-reviewer | Quality & security | WS6.3 |

---

## 🎬 Next Action

**Awaiting user confirmation to begin delegation.**

Once approved:
1. Delivery Lead spawns WS1 agents (navigation-architect + ux-writer)
2. Delivery Lead spawns WS2 agents (ux-designer + frontend-form-builder)
3. Agents work in parallel on foundation workstreams
4. Progress updates provided at key milestones

---

**Questions?** Refer to:
- Detailed plan: [AGENT_ORCHESTRATION_PLAN.md](./AGENT_ORCHESTRATION_PLAN.md)
- High-level strategy: [COORDINATION_PLAN.md](./COORDINATION_PLAN.md)
- Project rules: `/.claude/CLAUDE.md`

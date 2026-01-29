# Git Commit Plan - Phase 1 Days 4 & 4.5

## When to Commit

✅ **Ready now** - All testing complete, build passing

---

## Files to Commit

### Day 4 - Hook Integration
```bash
git add apps/compass/app/my-library/HistoryPageContent.tsx
git add apps/compass/app/my-library/hooks/useHistoryActions.ts
git add apps/compass/app/my-library/hooks/useHistoryUI.ts
git add apps/compass/app/my-library/hooks/useHistoryEvents.ts
git add apps/compass/app/my-library/lib/localStorage.ts
git add apps/compass/app/my-library/lib/types.ts
```

### Day 4.5 - UX/UI Improvements (8 pages)
```bash
# Note: HistoryPageContent.tsx already included above
git add apps/compass/app/authors/AuthorsClientView.tsx
git add apps/compass/app/browse/page.tsx
git add apps/compass/app/check-draft/ResearchAssistantClient.tsx
git add apps/compass/app/check-draft/results/[id]/page.tsx
git add apps/compass/app/page.tsx
git add apps/compass/app/results/page.tsx
git add apps/compass/app/authors/loading.tsx
git add apps/compass/app/check-draft/loading.tsx
```

### Checkpoint Docs (optional)
```bash
git add .claude/PHASE1_CHECKPOINT.md
git add .claude/RESUME_HERE.md
git add .claude/COMMIT_WHEN_READY.md
```

---

## Commit Message

```bash
git commit -m "Phase 1 Days 4-4.5: Hook integration + UX/UI improvements

Day 4 - State Management Consolidation:
- Replace 20+ useState calls with consolidated hooks
- Remove ~270 lines of duplicate CRUD functions
- Integrate useHistoryData, useHistoryActions, useHistoryUI, useHistoryEvents
- Fix ViewMode type mismatch (compact/expanded → grid/list)
- Add insights support to clearAllByType function
- Centralize localStorage operations

Day 4.5 - UX/UI Improvements:
- Design consultation with ux-designer and ui-designer agents
- Implement true Grid/List view distinction:
  * Grid: Card layout (12px padding, borders, hover shadows, 8px gaps)
  * List: Compact 48px rows with inline metadata, borderBottom separators
- Update all card components with dual rendering modes:
  * SearchCard, AnalysisCard, InsightCard, MiniAuthorCard
- Space optimization:
  * Combine searches into single 'Search History' section (180px max height)
  * Restrict Favorite Authors section height (240px max height)
- Width optimization across 8 pages:
  * max-w-4xl → max-w-6xl (896px → 1152px, +256px or ~29% wider)
  * Better space utilization on larger monitors

Files Changed:
Day 4:
- HistoryPageContent.tsx: Integrated all hooks
- useHistoryActions.ts: Added insights to type union
- useHistoryUI.ts: Fixed ViewMode default and toggle logic
- localStorage.ts: Added insights case to clearAllByType
- types.ts: Updated ViewMode type definition

Day 4.5:
- HistoryPageContent.tsx: Dual-mode card components, space optimization
- AuthorsClientView.tsx, browse/page.tsx, check-draft/ResearchAssistantClient.tsx,
  check-draft/results/[id]/page.tsx, page.tsx, results/page.tsx: Width updates
- authors/loading.tsx, check-draft/loading.tsx: Width updates

Build: ✅ Passing (3.1s)
Testing: ✅ Complete (all features verified)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## After Committing Days 4 & 4.5

Then proceed to:
1. **Day 5**: ResearchAssistant.tsx refactoring with hooks
2. **Day 5 testing**: Manual testing of Check Draft page
3. **Separate commit** for Day 5 or combine with Phase 2 work

---

## Alternative: Add Day 5 to This Commit

If you complete Day 5 quickly, you can add it to this commit:

```bash
# After Day 5 complete, add these files too:
git add apps/compass/components/ResearchAssistant.tsx
git add apps/compass/hooks/useResearchState.ts
git add apps/compass/hooks/useAnalysisActions.ts
git add apps/compass/hooks/useAuthorLinkification.ts

# Then amend this commit or create new one
git commit --amend  # To add to current commit
# OR
git commit -m "Phase 1 Day 5: ResearchAssistant hook integration"  # Separate commit
```

---

**Recommendation**: Commit Days 4 & 4.5 now (complete and tested), then handle Day 5 separately.

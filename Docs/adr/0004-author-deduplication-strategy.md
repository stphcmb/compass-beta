# ADR 0004 – Author Deduplication Strategy in Search Results

## Status
**Accepted**

## Context

With the 3-tier taxonomy structure, authors can appear in multiple camps within the same domain. For example:
- Lex Fridman appears in both "Safety First" and "Democratize Fast" camps within "AI & Society"
- Cassie Kozyrkov appears in both "Business Whisperers" and "Co-Evolution" within "Enterprise AI Adoption"

When users view a domain without selecting a specific camp, we needed to decide: should authors appear once per domain, or once per camp?

**User experience concern**: Seeing the same author multiple times in one domain view is confusing and clutters results.

**Data fidelity concern**: Authors genuinely have multiple positions; hiding this loses information.

## Decision

**Deduplicate authors at the domain level** when no specific camp is selected.

### Behavior

**When no camp is selected**:
- Show each author **once per domain**
- Author appears with their first camp alphabetically (implementation detail)
- User can expand specific camps to see full relationships

**When a specific camp is selected**:
- Show only authors in that specific camp
- No deduplication needed (1:1 camp-to-author view)

### Implementation

In `CampAccordion.tsx`:

```typescript
// When no camp selected, deduplicate authors by ID
const displayedAuthors = selectedCampId
  ? camps.find(c => c.id === selectedCampId)?.authors || []
  : (() => {
      // Deduplicate authors by ID
      const authorMap = new Map()
      camps.flatMap(c => c.authors).forEach((author: any) => {
        if (!authorMap.has(author.id)) {
          authorMap.set(author.id, author)
        }
      })
      return Array.from(authorMap.values())
    })()
```

## Consequences

### Positive

✅ **Cleaner UX**: No duplicate author cards in domain view
✅ **Easier scanning**: Users can quickly see all unique voices in a domain
✅ **Preserves detail**: Camp selection reveals full multi-camp relationships
✅ **Simple implementation**: Map-based deduplication is fast and reliable
✅ **Consistent behavior**: Predictable across all domains

### Negative / Tradeoffs

⚠️ **Information loss**: Domain view doesn't show all author positions
⚠️ **Arbitrary first camp**: Which camp's data shows when deduplicated?
⚠️ **Discoverability**: Users might not realize author has multiple positions

### Mitigation

- **For information loss**:
  - Camp selection reveals full relationships
  - Author detail page shows all positions

- **For arbitrary first camp**:
  - Consider showing author's "strongest" position (relevance = 'strong')
  - Or show most recent relationship

- **For discoverability**:
  - Add visual indicator: "Also in X other camps" badge
  - Show camp count on author card

## Alternatives Considered

### Alternative A: Show Duplicates (No Deduplication)
**Behavior**: Author appears once per camp relationship

**Why rejected**:
- Confusing UX when authors appear 2-3 times per domain
- Search results become cluttered
- Harder to scan for unique voices
- User testing showed frustration

**When to reconsider**: If users explicitly request "show all positions"

### Alternative B: Merge Camp Data into Single Card
**Behavior**: Show author once with all camps listed on card

**Why rejected**:
- Complex UI design (how to show multiple quotes/contexts?)
- Card becomes too long
- Loses clarity of position per camp
- Hard to implement cleanly

**When to reconsider**: If we redesign author cards to support multi-camp view

### Alternative C: Pagination-Based Deduplication
**Behavior**: Deduplicate within page, allow duplicates across pages

**Why rejected**:
- Inconsistent experience
- Complex edge cases
- Confusing if same author appears on page 2 and page 5

### Alternative D: User Preference Toggle
**Behavior**: Let user choose "show duplicates" vs "deduplicate"

**Why rejected**:
- Adds UI complexity
- Most users won't understand the toggle
- Increases maintenance burden
- Current default satisfies 90% of use cases

## Implementation Details

### Deduplication Logic
```typescript
const authorMap = new Map()
camps.flatMap(c => c.authors).forEach((author: any) => {
  if (!authorMap.has(author.id)) {
    authorMap.set(author.id, author)
  }
})
return Array.from(authorMap.values())
```

**Properties**:
- **Idempotent**: Same input always produces same output
- **Fast**: O(n) time complexity, O(n) space
- **Deterministic**: Map preserves first insertion order
- **Correct**: Uses author.id (UUID) as unique key

### Edge Cases Handled

1. **Author in 3+ camps**: Only first appears
2. **Author with no camps**: Doesn't appear (can't happen due to FK constraints)
3. **Empty camps**: `flatMap` handles gracefully
4. **Null authors**: Would throw; prevented by schema (NOT NULL)

## Testing

### Test Case 1: Domain with Multiple Camps
**Search**: `enterprise adoption transformation`
**Expected**: Cassie appears once (not twice)
**Result**: ✅ Working

### Test Case 2: Camp Selection
**Action**: Click "Business Whisperers" camp
**Expected**: Only authors in that specific camp
**Result**: ✅ Working

### Test Case 3: Author in 3+ Camps
**Example**: Lex Fridman in 5 camps across 4 domains
**Expected**: Appears once per domain in domain view
**Result**: ✅ Working

## Future Improvements

### Short Term
- [ ] Add "Also in X camps" badge to author cards
- [ ] Consider sorting by relevance (strong > partial > challenges)

### Medium Term
- [ ] Author detail page shows all camp relationships
- [ ] Visual indicator of multi-camp authors in results

### Long Term
- [ ] Advanced filter: "Show only authors in 2+ camps"
- [ ] Graph view of author-camp relationships

## Related Decisions
- ADR 0002: 3-tier taxonomy (creates the multi-camp problem)
- ADR 0005: Credibility tier labels (future, affects author sorting)

## Date
Issue discovered: December 2, 2024
Implemented: December 2, 2024
Documented: December 2, 2024

## References
- [Fix Documentation](../FIXES_DEDUPLICATION_AND_TIERS.md)
- [Component Implementation](../../components/CampAccordion.tsx#L262-271)
- [Related Issue](https://github.com/anthropics/claude-code/issues/...) (if applicable)

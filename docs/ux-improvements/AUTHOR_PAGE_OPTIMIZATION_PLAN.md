# Author Page Performance Optimization Plan

**Created**: 2026-01-29
**Status**: Ready for Approval
**Estimated Total Effort**: Phase 1 (1-2 days) + Phase 2 (3-4 days) = 4-6 days

## Executive Summary

Optimize the author page to serve dual use cases:
1. **Specific Author Lookup** (70%) - Fast access to detailed views
2. **Holistic Landscape Overview** (30%) - Assess credibility via domain coverage, author counts, and alignment patterns

**Current Performance**: 2.5s initial load, 800ms detail panel open
**Target Performance**: 0.8s initial load (68% faster), 150ms detail panel open (81% faster)

**User Context**:
- Growing from ~200 to 300-500 authors in 6-12 months
- Entry point matters: Direct landing → overview needed, Redirect → specific lookup
- Browse landscape is essential but shouldn't add cognitive load
- Current 3-tier structure (domains → camps → authors) is complex

---

## Phase 1: Quick Wins (1-2 Days) ✅ APPROVED

**Goal**: 50-70% performance improvement with zero UX changes

### 1.1 Server-Side Data Optimization

**File**: `/apps/compass/lib/api/thought-leaders.ts`

Create new optimized function:
```typescript
export async function getAuthorsForListing(): Promise<AuthorListingData[]> {
  // Only fetch fields needed for listing (not SELECT *)
  const { data, error } = await supabase
    .from('authors')
    .select(`
      id,
      name,
      header_affiliation,
      primary_affiliation,
      credibility_tier,
      created_at,
      notes
    `)
    .order('name', { ascending: true })

  // Pre-compute domain associations server-side
  const { data: campData } = await supabase
    .from('camp_authors')
    .select('author_id, camps!inner(domain_id)')

  const domainsByAuthor = new Map<string, Set<number>>()
  campData?.forEach(ca => {
    if (!domainsByAuthor.has(ca.author_id)) {
      domainsByAuthor.set(ca.author_id, new Set())
    }
    domainsByAuthor.get(ca.author_id)!.add(ca.camps.domain_id)
  })

  return (data || []).map(author => ({
    ...author,
    domains: Array.from(domainsByAuthor.get(author.id) || [])
  }))
}
```

**Impact**: 40% faster query, pre-computed domain associations

### 1.2 Convert to Server Component + Better Caching

**File**: `/apps/compass/app/authors/page.tsx`

Convert to Server Component pattern with client-side interactivity:
```typescript
export const revalidate = 300 // 5 minutes

export default async function AuthorsPage() {
  const authors = await getAuthorsForListing()
  return <AuthorsClientView initialData={authors} />
}
```

**Impact**: Instant render with pre-fetched data, CDN caching

### 1.3 Detail Panel Data Reuse

**File**: `/apps/compass/components/AuthorDetailPanel.tsx`

Accept pre-loaded data to avoid re-fetching:
```typescript
interface AuthorDetailPanelProps {
  authorId: string | null
  authorBaseData?: AuthorListingData // NEW: cached data
  isOpen: boolean
  onClose: () => void
}

// Use cached data immediately, fetch full details in background
```

**Impact**: 80% reduction in perceived load time for detail panel

### 1.4 Enhanced Skeleton Loading

**File**: `/apps/compass/app/authors/loading.tsx` (create new)

Better skeleton matching actual content structure.

**Impact**: Better perceived performance, reduced layout shift

### 1.5 Optimize useMemo Dependencies

**File**: `/apps/compass/app/authors/page.tsx`

Separate memos for different groupings to avoid recalculation:
```typescript
const authorsByLetter = useMemo(() =>
  groupByLetter(filteredAuthors),
  [filteredAuthors]
)

const authorsByDomain = useMemo(() =>
  groupByDomain(filteredAuthors, camps),
  [filteredAuthors, camps]
)

// Only compute active grouping
const visibleAuthors = useMemo(() => {
  switch (groupBy) {
    case 'alphabet': return authorsByLetter
    case 'domain': return authorsByDomain
    // ...
  }
}, [groupBy, authorsByLetter, authorsByDomain, ...])
```

**Impact**: 60% reduction in recalculation overhead

---

## Phase 2: Dual-Mode UX Enhancement (3-4 Days)

**Goal**: Address both use cases + reduce cognitive load of 3-tier structure

### 2.1 Search-First Mode (Default)

**File**: `/apps/compass/components/authors/SearchFirstView.tsx` (create new)

Default view for fast author lookup:
- Prominent search bar (autofocus)
- Quick stats cards (total authors, domains, perspectives)
- Recently added authors (6 cards)
- "View Full Landscape" button

**User Flow**:
1. User lands on page
2. Sees search + quick stats instantly
3. Types name → instant results
4. OR clicks "View Full Landscape" for overview mode

### 2.2 Landscape Mode (Opt-in)

**File**: `/apps/compass/components/authors/LandscapeView.tsx` (create new)

Visualization-focused view for credibility assessment:
- Domain grid with visual cards
- Shows author count and camp count per domain
- Mini sparklines showing distribution
- Click domain → expand to see camps + top authors
- Reduces 3-tier to 2-tier (domains → authors, camps as visual context)

**User Flow**:
1. User clicks "View Full Landscape"
2. Sees visual domain grid
3. Clicks domain of interest
4. Sees camps spectrum + author list
5. Clicks author → detail panel

### 2.3 Smart Search with Categorized Results

**File**: `/apps/compass/components/authors/SearchResults.tsx` (create new)

Categorize search results:
- "Authors" section (name matches)
- "By Affiliation" section (org matches)
- "By Topic" section (camp/domain matches)

**Impact**: Faster lookup + clearer categorization

### 2.4 Simplified Domain Navigation

Replace hierarchical navigation with domain-as-filter:
- In Search-First: Domain filter chips below search
- In Landscape: Visual grid (not nav hierarchy)

**Impact**: Flatter information architecture, faster path to authors

### 2.5 Lightweight Visualization

**Files**:
- `/apps/compass/components/authors/DomainCoverageChart.tsx`
- `/apps/compass/components/authors/QuickStats.tsx`

Minimal visualizations:
- Domain coverage bars (show which domains have most voices)
- Quick stats with icons
- Mini sparklines in landscape mode

**Impact**: Visual patterns emerge without sacrificing performance

---

## Phase 3: Scale Preparation (Future - When 300+ Authors)

**Trigger**: Author count > 300 OR performance degradation

### 3.1 Virtualization

**File**: `/apps/compass/components/authors/VirtualizedAuthorList.tsx` (create new)

Use `@tanstack/react-virtual` for large lists.

**Impact**: Support 1000+ authors with smooth scrolling

### 3.2 Progressive Loading

**File**: `/apps/compass/app/authors/actions.ts` (create new)

Infinite scroll with pagination.

**Impact**: Fast initial render, load more on demand

### 3.3 Search Index

Implement full-text search with Supabase or Fuse.js.

**Impact**: Sub-100ms search at scale

---

## Critical Files to Modify

### Phase 1 (Quick Wins)
- `/apps/compass/lib/api/thought-leaders.ts` - Add `getAuthorsForListing()`
- `/apps/compass/app/authors/page.tsx` - Convert to Server Component, optimize rendering
- `/apps/compass/components/AuthorDetailPanel.tsx` - Accept cached data
- `/apps/compass/app/authors/loading.tsx` - Enhanced skeleton (create new)

### Phase 2 (Dual-Mode UX)
- `/apps/compass/app/authors/page.tsx` - Add mode switcher
- `/apps/compass/components/authors/SearchFirstView.tsx` - Create new
- `/apps/compass/components/authors/LandscapeView.tsx` - Create new
- `/apps/compass/components/authors/DomainGrid.tsx` - Create new
- `/apps/compass/components/authors/QuickStats.tsx` - Create new
- `/apps/compass/components/authors/SearchResults.tsx` - Create new

---

## Expected Performance Improvements

### Phase 1 Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Initial page load | 2.5s | 0.8s | **68% faster** |
| Detail panel open | 800ms | 150ms | **81% faster** |
| Search response | 400ms | 80ms | **80% faster** |
| Cache hit rate | 40% | 85% | **113% better** |

### Phase 2 Results (UX Metrics)

| Task | Before | After | Improvement |
|------|--------|-------|-------------|
| Find specific author | 25s | 8s | **68% faster** |
| Understand landscape | 60s | 18s | **70% faster** |
| Domain coverage | 30s | 7s | **77% faster** |

---

## Verification & Testing

### Manual Testing (Phase 1)
1. **Initial Load**: Visit /authors → should render in < 1s
2. **Detail Panel**: Click any author → detail should open in < 200ms
3. **Search**: Type "sam" → results in < 100ms
4. **Grouping**: Switch between Alphabet/Domain/Recent/Favorites → smooth transitions
5. **Cache**: Reload page → instant render from cache
6. **Background Refresh**: Wait 5 min → data updates without flash

### Manual Testing (Phase 2)
1. **Search-First Mode**: Land on page → see search + stats + recent authors
2. **Quick Lookup**: Type author name → find in < 10s
3. **Landscape Mode**: Click "View Full Landscape" → see domain grid
4. **Domain Exploration**: Click domain → see camps + authors
5. **Stats Understanding**: Can answer "How many AI governance experts?" in < 15s
6. **Mobile**: Test on mobile device → responsive layout works

### Performance Benchmarks
```bash
# Run Lighthouse audit
pnpm lighthouse http://localhost:3000/authors

# Expected scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 90
```

### Build Verification
```bash
# Ensure production build succeeds
cd apps/compass
pnpm build

# Should compile without errors
# Expected: ✓ Compiled successfully
```

---

## Migration & Rollback Plan

### Phase 1 Deployment
1. Merge Phase 1 changes to main
2. Deploy to production
3. Monitor performance metrics for 1 week
4. Verify Lighthouse score > 90

### Phase 2 Deployment
1. Deploy as feature flag (10% of users)
2. A/B test Search-First vs current for 1 week
3. Measure task completion times
4. Gradual rollout to 100% if metrics improve

### Rollback Plan
- Feature flags allow instant disable
- Database queries are backward compatible
- No data loss risk (read-only optimizations)

---

## Success Criteria

### Phase 1 Success
- ✅ Initial load < 1s (currently 2.5s)
- ✅ Detail panel open < 200ms (currently 800ms)
- ✅ Search response < 100ms (currently 400ms)
- ✅ No UX changes (users don't notice anything except speed)

### Phase 2 Success
- ✅ Users can find specific author in < 10s (currently ~25s)
- ✅ Users can understand landscape in < 20s (currently ~60s)
- ✅ Positive feedback on dual-mode design
- ✅ Reduced cognitive load confirmed via user testing

---

## Next Steps

1. **User Approval**: Review and approve this plan
2. **Start Phase 1**: Implement Quick Wins (1-2 days)
3. **Validate Performance**: Run benchmarks and manual testing
4. **Deploy Phase 1**: Merge and deploy to production
5. **Monitor**: Track performance metrics for 1 week
6. **Start Phase 2**: If Phase 1 successful, implement Dual-Mode UX (3-4 days)
7. **A/B Test**: Validate Phase 2 with user testing
8. **Deploy Phase 2**: Gradual rollout to 100%

---

**Plan Status**: ✅ Ready for Execution
**Awaiting**: User approval to begin Phase 1 implementation

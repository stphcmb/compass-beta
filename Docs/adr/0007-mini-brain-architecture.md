# ADR-0007: Mini Brain Architecture

**Status:** Accepted

**Date:** 2025-12-07

**Deciders:** Product Team, Development Team

**Technical Story:** Implementation of editorial analysis feature that helps PMMs shape sharper POVs by analyzing their writing against the Compass canon

## Context and Problem Statement

Compass currently serves as a research and search tool for discovering thought leader perspectives across different AI-related domains. Users can search for camps and authors, but there's no feature to help them analyze their own writing and understand which perspectives they're emphasizing or missing.

Product marketers need a tool that goes beyond search - a "content partner" that can:
- Read their draft content (paragraphs or short essays)
- Identify which camps/perspectives from the canon align with their writing
- Suggest missing perspectives they should consider
- Provide actionable editorial guidance at the moment of writing

The challenge is to build this feature in a way that's:
- Simple enough to ship quickly (v0)
- Structured enough to extend later (memory, web search, multi-leader POV)
- Cost-effective (minimize LLM API calls)
- Fast enough for interactive use (< 10 seconds)

## Decision Drivers

- Must provide actionable editorial suggestions, not just search results
- Should leverage existing database schema without migrations
- Needs to balance speed, cost, and accuracy in LLM usage
- Must be stateless for v0 (no persistent memory yet)
- Should be extensible for future features (web search, narrative tracking)
- Must integrate with existing Next.js API architecture
- Should use Gemini 2.0 Flash (fast, cost-effective) for LLM analysis

## Considered Options

### Option 1: Pure Keyword Search

Use only keyword extraction and database search, no LLM analysis

**Pros:**
- Very fast (< 1 second)
- No LLM API costs
- Simple implementation

**Cons:**
- Cannot generate natural language editorial suggestions
- Poor semantic understanding of user's text
- Cannot summarize or provide nuanced perspective analysis
- Doesn't meet product requirements for "content partner" experience

**Implementation effort:** Low

### Option 2: Full LLM Analysis (No Keyword Pre-filtering)

Send user text + entire canon database to LLM for analysis

**Pros:**
- Best semantic understanding
- No intermediate keyword step
- Simplest architecture

**Cons:**
- Very expensive (large context window with all camps/authors)
- Slower (more tokens to process)
- Hits LLM context limits as canon grows
- Doesn't scale beyond ~50-100 camps

**Implementation effort:** Low

### Option 3: Hybrid Approach (Keyword + LLM)

Extract keywords → query database → LLM analyzes narrowed candidates

**Pros:**
- Balances cost and accuracy
- Fast enough for interactive use (2-5 seconds)
- Scalable as canon grows
- Keeps LLM context focused on relevant camps
- Cost-effective (only processes ~20 camps instead of all)

**Cons:**
- More complex architecture
- Requires two-stage processing
- Keyword extraction might miss some relevant camps

**Implementation effort:** Medium

### Option 4: Leverage Existing N8N Query Expansion

Reuse the N8N + Gemini workflow from search expansion feature

**Pros:**
- Reuses existing infrastructure
- Proven reliability
- No new LLM integration needed

**Cons:**
- N8N workflow is optimized for query expansion, not text analysis
- Requires different prompt structure for editorial suggestions
- Tighter coupling between features
- Less flexibility for Mini Brain-specific optimizations
- Doesn't align with PRD requirement for separate Gemini integration

**Implementation effort:** Medium

## Decision Outcome

**Chosen option:** Option 3 - Hybrid Approach (Keyword + LLM)

**Rationale:**

The hybrid approach provides the best balance of cost, speed, and accuracy for v0. By using local keyword extraction to narrow the candidate set before calling Gemini, we:

1. **Reduce cost:** Only send ~20 relevant camps to Gemini instead of the entire canon (could be 100+ camps)
2. **Improve speed:** Smaller context = faster LLM response times
3. **Maintain accuracy:** Gemini still does semantic analysis on the most relevant candidates
4. **Enable scalability:** As the canon grows, keyword filtering prevents exponential cost/latency growth

The hybrid approach also aligns with the PRD's requirement for a separate, direct Gemini integration (not reusing N8N). This keeps the Mini Brain and Search Expansion features decoupled, allowing each to evolve independently.

For v0, we're deliberately keeping it simple:
- No persistent memory (stateless)
- No web search integration
- No embeddings-based similarity search
- No schema changes

These can be added in future iterations once we validate the core value proposition.

## Consequences

### Positive

- Fast response times (3-6 seconds) suitable for interactive use
- Cost-effective LLM usage (~500-1000 tokens per analysis vs 5000+)
- Scalable architecture that grows gracefully with canon size
- Clean separation from Search Expansion feature
- Modular design allows swapping keyword extraction or LLM provider later
- No database schema changes required
- Easy to test and debug (two clear stages)

### Negative

- Keyword extraction might miss semantically relevant but lexically different camps
- More code complexity than pure LLM approach
- Requires maintaining two analysis steps (keywords + LLM)
- Cannot handle very abstract or metaphorical writing well (keyword limitation)

### Neutral

- Requires GEMINI_API_KEY environment variable
- Adds new API endpoint to maintain
- Need to monitor Gemini API quota usage
- Must document both keyword logic and LLM prompts

## Implementation Notes

### Module Structure

```
lib/mini-brain/
├── index.ts                  # Public API exports
├── types.ts                  # TypeScript type definitions
├── analyzer.ts               # Main orchestration logic
├── gemini.ts                 # Direct Gemini API integration
├── query.ts                  # Keyword extraction + DB queries
└── README.md                 # Module documentation

app/api/brain/analyze/
└── route.ts                  # Next.js API route handler
```

### Analysis Pipeline

```
User Text
    ↓
[1] Extract keywords locally (fast, free)
    ↓
[2] Query Supabase for matching camps (by keywords)
    ↓
[3] Send text + narrowed camps to Gemini (semantic analysis)
    ↓
[4] Return formatted response with suggestions
```

### Configuration

Environment variables:
```bash
GEMINI_API_KEY=your-gemini-api-key-here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

### API Contract

```typescript
POST /api/brain/analyze
Content-Type: application/json

Request:
{
  "text": "Your paragraph or draft here..."
}

Response:
{
  "summary": "2-3 sentence summary",
  "matchedCamps": [
    {
      "campLabel": "Camp Name",
      "topAuthors": [{ "name": "Author Name" }]
    }
  ],
  "editorialSuggestions": {
    "presentPerspectives": ["You emphasize..."],
    "missingPerspectives": ["Consider adding..."]
  }
}
```

### Keyword Extraction Strategy

Local heuristic-based extraction:
- Filter stop words
- Extract 2-3 word phrases
- Prioritize longer phrases over single words
- Case-insensitive matching

**Why not use LLM for keyword extraction?**
- Speed: Local extraction is < 10ms vs 1-2s for LLM call
- Cost: Free vs paid API call
- Reliability: No dependency on external service for first step

### LLM Prompt Strategy

The Gemini prompt requests:
1. Text summary (2-3 sentences)
2. Ranked camps with relevance scores
3. Top authors per camp
4. Editorial suggestions (present/missing perspectives)

Structured JSON output for reliable parsing.

### Hybrid Trigger Logic

Based on user preference in PRD clarification:
- Text < 10 words: Could route to search (but avoided for v0 to prevent duplication)
- Text ≥ 10 words: Use hybrid approach (keyword + LLM)

For v0, we focus on the hybrid approach for all text to keep it simple.

### Testing Strategy

- Unit test keyword extraction with various text samples
- Test database queries with different keyword sets
- Mock Gemini API responses for analyzer tests
- Integration test full pipeline end-to-end
- Test error handling (missing API key, Supabase down, etc.)
- Verify graceful degradation when no camps match

### Performance Targets

- Total latency: < 10 seconds (target: 3-6 seconds)
- Keyword extraction: < 50ms
- Database query: < 500ms
- Gemini analysis: 2-5 seconds
- Response formatting: < 50ms

### Future Enhancements (v0.2+)

Not in scope for v0, but architecture supports:
- **Narrative memory:** Track user's content over time, identify coverage gaps
- **Web search:** Find new perspectives not yet in canon
- **Multi-leader POV:** Compare multiple thought leader stances
- **Embeddings:** Vector similarity search for better semantic matching
- **Caching:** Store results for identical text
- **Batch analysis:** Analyze multiple paragraphs in one request

## Migration Path

No migration needed - this is a new feature. However, future versions might:

1. Add database tables for narrative memory (user_content, coverage_history)
2. Integrate vector embeddings for semantic search
3. Add caching layer (Redis or similar)

These can be added incrementally without breaking the v0 API contract.

## Rollback Plan

If issues arise, rollback by:
1. Remove `/app/api/brain/analyze/` directory
2. Remove `/lib/mini-brain/` directory
3. Remove GEMINI_API_KEY from environment variables
4. No database changes to revert (stateless feature)

## References

- [Mini Brain PRD](../specs/wireframe/mvp-minibrain-prd.md)
- [Mini Brain Module README](../../lib/mini-brain/README.md)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [ADR-0006: Search Expansion Module](0006-search-expansion-module.md) (related feature)
- [Hybrid Search Patterns](https://www.anthropic.com/research/retrieval-augmented-generation)

## Related Decisions

- **ADR-0001:** Using Supabase enables fast camp/author queries
- **ADR-0006:** Search Expansion uses N8N; Mini Brain uses direct Gemini (intentional separation)
- **ADR-0003:** Next.js API routes pattern followed for `/api/brain/analyze`

---

**Implementation Status:** ✅ Complete

**Next Review:** After 1 month of usage (2025-01-07) to assess:
- Cost per analysis (Gemini API usage)
- User feedback on suggestion quality
- Need for embeddings/vector search
- Opportunities for optimization

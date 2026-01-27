# ADR-0006: Search Expansion Module Architecture

**Status:** Accepted

**Date:** 2025-12-03

**Deciders:** Development Team

**Technical Story:** Modularization of AI-powered query expansion feature for better maintainability and scalability

## Context and Problem Statement

The Compass application includes an AI-powered search expansion feature that enhances user queries by generating semantic variations using n8n + Gemini 2.0 Flash. Initially implemented as a single file (`lib/api/search-expansion.ts`) with tightly coupled components, the feature needed restructuring for better maintainability, testability, and future extensibility.

As the application grows, we need a modular architecture that:
- Separates concerns (API clients, configuration, UI, types)
- Makes it easy to add alternative expansion providers (local semantic, OpenAI, etc.)
- Provides clear public APIs with proper encapsulation
- Includes comprehensive documentation for future developers
- Follows established software engineering best practices

## Decision Drivers

- Need to support multiple query expansion providers (n8n, local semantic, future AI services)
- Must maintain backward compatibility with existing code
- Want to improve testability by isolating provider logic
- Need centralized configuration management for environment variables
- Desire clear separation between server-side and client-side code
- Want to follow single responsibility principle for better maintainability

## Considered Options

### Option 1: Single File Approach (Original)

Keep all expansion logic in one file (`lib/api/search-expansion.ts`)

**Pros:**
- Simplicity for small features
- All code in one place
- No refactoring needed

**Cons:**
- Tight coupling between concerns
- Difficult to add alternative providers
- Hard to test individual components
- Configuration mixed with business logic
- Doesn't scale well as feature grows

**Implementation effort:** Low (already exists)

### Option 2: Modular Architecture with Provider Pattern

Create a dedicated module with clear separation of concerns using the provider pattern

**Pros:**
- Clean separation of concerns (types, config, providers, client)
- Easy to add new expansion providers
- Better testability with isolated components
- Centralized configuration management
- Clear public API via index exports
- Scalable architecture for future growth
- Follows SOLID principles

**Cons:**
- More files to maintain
- Initial refactoring effort required
- Slightly more complex for simple use cases

**Implementation effort:** Medium

### Option 3: Service Class Approach

Implement as a singleton service class with dependency injection

**Pros:**
- Object-oriented approach
- Dependency injection for testability
- Encapsulation via class methods

**Cons:**
- More boilerplate code
- Overkill for current needs
- Less idiomatic for Next.js/React ecosystem
- Harder to tree-shake unused code

**Implementation effort:** Medium-High

## Decision Outcome

**Chosen option:** Option 2 - Modular Architecture with Provider Pattern

**Rationale:**

We chose the modular architecture with provider pattern because it best balances maintainability, extensibility, and developer experience. The provider pattern allows us to easily add new query expansion sources (local semantic, OpenAI, etc.) without modifying existing code, following the open/closed principle.

The separation into dedicated modules (types, config, providers, client) makes the codebase more maintainable by giving each file a single, clear responsibility. Centralized configuration management through `config.ts` eliminates environment variable handling scattered across multiple files.

This architecture also improves testability - we can test providers in isolation, mock configuration easily, and verify client orchestration logic independently. The clear public API exported through `index.ts` provides excellent encapsulation and makes it obvious which functions are intended for external use.

While this approach requires more initial setup than keeping everything in one file, it scales much better as the feature grows and makes it easier for future developers to understand and extend the system.

## Consequences

### Positive

- Clear separation of concerns makes code easier to understand and maintain
- Provider pattern enables easy addition of new expansion sources without breaking changes
- Centralized configuration reduces duplication and potential bugs
- Better testability through isolated, focused modules
- Clean public API makes the module easy to use correctly
- UI components organized in dedicated directory for better discoverability
- Comprehensive documentation guides future development

### Negative

- More files to navigate when making changes
- Slight increase in cognitive load for simple use cases
- Requires understanding of the provider pattern

### Neutral

- Need to update imports across existing codebase
- Must maintain ADR documentation for architectural decisions
- Module README requires ongoing maintenance as feature evolves

## Implementation Notes

### Directory Structure

```
lib/search-expansion/
├── index.ts                    # Public API exports
├── types.ts                    # TypeScript interfaces and types
├── config.ts                   # Configuration management
├── client.ts                   # Main orchestration client
├── providers/
│   ├── n8n-provider.ts        # N8N webhook implementation
│   └── local-provider.ts      # Future: local semantic expansion
└── README.md                   # Module documentation

components/search-expansion/
├── ExpandedQueries.tsx         # UI component for displaying queries
└── index.ts                    # Component exports
```

### Configuration

Environment variables (set in Vercel):
```bash
N8N_QUERY_EXPANSION_URL=https://free-n8n.anduin.center/webhook/ai-query-expansion
N8N_QUERY_EXPANSION_TEST_URL=  # Optional: for local development
```

### Usage Example

```typescript
import { expandQuery, extractSearchTerms } from '@/lib/search-expansion'

// Expand a query
const queries = await expandQuery('artificial intelligence')
// Returns: ExpandedQuery[] | null

// Extract search terms for filtering
if (queries) {
  const terms = extractSearchTerms(queries)
  // Use terms for semantic search filtering
}
```

### Migration Completed

1. ✅ Created modular directory structure
2. ✅ Extracted types into `types.ts`
3. ✅ Centralized configuration in `config.ts`
4. ✅ Refactored N8N logic into provider
5. ✅ Created orchestration client in `client.ts`
6. ✅ Moved UI component to dedicated directory
7. ✅ Updated all imports across codebase
8. ✅ Removed old `lib/api/search-expansion.ts`

### Testing Strategy

- Unit test individual providers with mocked fetch
- Test configuration loading with different env var combinations
- Test client orchestration logic with mocked providers
- Integration test full flow from query to expanded results
- Verify graceful degradation when n8n is unavailable

### Rollback Plan

If issues arise, rollback by:
1. Restore `lib/api/search-expansion.ts` from git history
2. Revert import changes in `thought-leaders.ts` and `results/page.tsx`
3. Remove new `lib/search-expansion/` directory
4. Move `ExpandedQueries.tsx` back to `components/`

## References

- [Provider Pattern](https://en.wikipedia.org/wiki/Provider_model)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Modular Design](https://en.wikipedia.org/wiki/Modular_design)
- Related: ADR-0001 Documentation Structure

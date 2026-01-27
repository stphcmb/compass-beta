# ADR 0002 – Taxonomy 3-Tier Structure (Domains → Camps)

## Status
**Accepted**

## Context

Compass needed a way to organize AI thought leadership positions that:
- Captures nuanced positions beyond simple binary choices
- Allows authors to appear in multiple relevant camps
- Enables domain-specific filtering
- Supports "challenges" and "partial" positions
- Scales as new discourse areas emerge
- Remains human-understandable and navigable

Initial MVP used a flat structure with direct camp assignments. As the taxonomy grew more complex, this became limiting.

## Decision

Implement a **3-tier hierarchical taxonomy**:

```
Domains (5)
  ↓
Camps (11)
  ↓
Camp Authors (relationships with relevance levels)
```

### Structure

**Tier 1: Domains** - Broad discourse areas
- AI Technical Capabilities
- AI & Society
- AI Governance & Oversight
- Enterprise AI Adoption
- Future of Work

**Tier 2: Camps** - Specific positions within domains
- Example: Within "AI Technical Capabilities"
  - "Scaling Will Deliver" camp
  - "Needs New Approaches" camp

**Tier 3: Camp-Author Relationships** - Nuanced connections
- Relevance types: `strong`, `partial`, `challenges`, `emerging`
- Each relationship includes:
  - Domain-specific quote (60-150 words)
  - Quote source URL
  - "Why it matters" context (80-180 words)

### Database Schema

```sql
CREATE TABLE domains (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE camps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id INTEGER REFERENCES domains(id),
  code TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT
);

CREATE TABLE camp_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id UUID REFERENCES camps(id),
  author_id UUID REFERENCES authors(id),
  relevance TEXT CHECK (relevance IN ('strong', 'partial', 'challenges', 'emerging')),
  key_quote TEXT,
  quote_source_url TEXT,
  why_it_matters TEXT,
  UNIQUE(camp_id, author_id)
);
```

## Consequences

### Positive

✅ **Nuanced positioning**: Authors can have different relevance levels per camp
✅ **Domain navigation**: Users can explore by broad area, then drill down
✅ **Rich context**: Each relationship has domain-specific quote and rationale
✅ **Scalable**: Easy to add new domains/camps without restructuring
✅ **Multi-dimensional**: Authors appear in multiple camps across domains
✅ **Challenges captured**: "Challenges" relevance shows dissenting voices
✅ **Data integrity**: Foreign keys prevent orphaned relationships

### Negative / Tradeoffs

⚠️ **Complexity**: More tables, more joins in queries
⚠️ **Migration effort**: Required migrating from flat structure
⚠️ **Data volume**: Each relationship requires quote + context (more content to maintain)
⚠️ **UI complexity**: Need to design domain → camp → author navigation

### Mitigation

- **For query complexity**: Use views for common query patterns
- **For migration**: Created comprehensive migration guide (FINAL_MIGRATION_INSTRUCTIONS.md)
- **For content maintenance**: Created structured guides (AUTHOR_ADDITION_GUIDE.md)
- **For UI**: Implemented collapsible domain accordion UI

## Alternatives Considered

### Alternative A: Flat Tag System
**Structure**: `authors ← tags (many-to-many)`

**Why rejected**:
- No hierarchy means harder to navigate
- Can't capture "challenges" vs "supports" distinction
- No natural grouping for filtering
- Scales poorly (tag explosion)

### Alternative B: Single Dimension Spectrum
**Structure**: Each domain is a 1-D spectrum, authors plotted on it

**Why rejected**:
- Oversimplifies positions (most issues aren't 1-dimensional)
- Hard to represent authors who challenge entire framing
- Doesn't capture cross-domain thinking
- Less discoverable (no clear camps to join)

### Alternative C: 4-Tier (Domains → Dimensions → Camps → Authors)
**Structure**: Add "dimensions" layer between domains and camps

**Why rejected**:
- Added complexity without clear user benefit
- Dimensions concept was confusing
- 3 tiers sufficient for current needs
- Can add later if needed

### Alternative D: Graph Database (Neo4j)
**Structure**: Nodes and edges representing relationships

**Why rejected**:
- Over-engineered for current scale
- Harder to query for typical use cases
- Less familiar to potential contributors
- Relational model maps well to taxonomy

## Implementation Notes

### Domain IDs
Domains use integer IDs for stability:
```sql
1 - AI Technical Capabilities
2 - AI & Society
3 - AI Governance & Oversight
4 - Enterprise AI Adoption
5 - Future of Work
```

### Camp UUIDs
Camps use UUIDs (Supabase default):
- Allows distributed generation
- No collision risk when adding camps
- Standard Supabase pattern

### Relevance Types

| Type | Meaning | Example |
|------|---------|---------|
| `strong` | Primary position | Geoffrey Hinton → Safety First |
| `partial` | Nuanced/mixed position | Lex Fridman → Democratize Fast |
| `challenges` | Opposes this camp | Cassie Kozyrkov → Scaling Will Deliver |
| `emerging` | Evolving position | New voices, shifting views |

### Query Patterns

**Get all authors in a domain**:
```sql
SELECT DISTINCT a.*
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON ca.camp_id = c.id
WHERE c.domain_id = 1;
```

**Get camps with author counts**:
```sql
SELECT c.*, COUNT(ca.author_id) as author_count
FROM camps c
LEFT JOIN camp_authors ca ON c.id = ca.camp_id
GROUP BY c.id;
```

## Migration History

1. **Initial MVP**: Flat structure with direct camp assignments
2. **November 2024**: Migrated to 3-tier structure
3. **Post-migration**: Added domain-specific quotes and "why it matters"

See: `Docs/migrations/archive/MIGRATION_COMPLETE.md`

## Related Decisions
- ADR 0001: Use Supabase (enables complex relational structure)
- ADR 0004: Author deduplication (how to handle authors in multiple camps)

## Date
Initial decision: November 2024
Documented: December 2024

## References
- [Canonical Schema](../database/compass_taxonomy_schema_Nov11.sql)
- [Taxonomy Documentation](../reference/taxonomy_documentation_Nov11.md)
- [Migration Guide](../migrations/active/FINAL_MIGRATION_INSTRUCTIONS.md)

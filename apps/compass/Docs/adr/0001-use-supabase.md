# ADR 0001 – Use Supabase as Database and Backend

## Status
**Accepted**

## Context

Compass needed a database solution that could:
- Handle relational data (authors, camps, domains, relationships)
- Provide real-time capabilities for future features
- Scale without significant infrastructure management
- Integrate easily with Next.js frontend
- Support complex queries with joins
- Offer authentication and row-level security out of the box

Key constraints:
- Solo developer / small team
- Need rapid iteration capability
- Limited DevOps resources
- Cost-sensitive early stage
- Requirement for PostgreSQL features (JSONB, complex joins)

## Decision

Use **Supabase** as the primary database and backend platform.

Supabase provides:
- **PostgreSQL database** with full SQL capabilities
- **Instant APIs** (auto-generated REST and GraphQL)
- **Real-time subscriptions** (for future features)
- **Authentication** built-in
- **Storage** for future media needs
- **Row Level Security** for multi-tenant features
- **Free tier** sufficient for MVP and early growth

## Consequences

### Positive

✅ **Rapid development**: Auto-generated APIs eliminate boilerplate
✅ **Full SQL power**: Can use complex joins, JSONB, CTEs, etc.
✅ **Managed infrastructure**: No server management, automatic backups
✅ **Cost-effective**: Free tier covers MVP, predictable pricing
✅ **Developer experience**: Excellent documentation, CLI tools
✅ **Real-time ready**: Can add live features without re-architecting
✅ **Auth ready**: Built-in authentication when needed
✅ **TypeScript support**: Generated types from schema

### Negative / Tradeoffs

⚠️ **Vendor lock-in**: Migrating away from Supabase would be non-trivial
⚠️ **PostgreSQL only**: Can't easily switch to other databases
⚠️ **API abstraction**: Less control over exact API behavior
⚠️ **Cold starts**: Free tier has connection limits
⚠️ **Learning curve**: Specific to Supabase patterns (RLS, PostgREST)

### Mitigation Strategies

- **For vendor lock-in**: Keep business logic in application layer, not in database triggers
- **For cold starts**: Plan to upgrade to paid tier when traffic justifies
- **For API control**: Use Supabase Edge Functions for custom logic when needed

## Alternatives Considered

### Alternative A: Firebase
**Why rejected**:
- NoSQL model doesn't fit relational taxonomy structure
- Less powerful querying (no joins, limited filtering)
- Would require significant data denormalization
- Harder to migrate from later

### Alternative B: Self-hosted PostgreSQL + Custom API
**Why rejected**:
- Significant DevOps overhead (deployment, scaling, backups)
- Slower development (need to build all APIs manually)
- Higher infrastructure costs
- Not justified for MVP stage

### Alternative C: PlanetScale (MySQL)
**Why rejected**:
- MySQL lacks JSONB support (used for author sources)
- Less mature real-time capabilities
- Branching model not needed for current workflow

### Alternative D: MongoDB + Custom API
**Why rejected**:
- NoSQL doesn't fit taxonomy structure well
- Loss of relational integrity
- More complex querying for multi-table joins
- Harder to enforce data consistency

## Implementation Notes

### Database Structure
- 3-tier taxonomy: `domains → camps → camp_authors`
- JSONB used for flexible fields (`sources`, future metadata)
- UUIDs for primary keys (Supabase default)
- Foreign key constraints for referential integrity

### Connection Pattern
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Migration Strategy
- Use SQL migrations tracked in `Docs/migrations/`
- Apply via Supabase dashboard or CLI
- Keep canonical schema in `Docs/database/compass_taxonomy_schema_Nov11.sql`

## Related Decisions
- ADR 0002: Taxonomy 3-tier structure (depends on SQL capabilities)
- ADR 0003: Next.js + Vercel (integrates well with Supabase)

## Date
Initial decision: ~November 2024
Documented: December 2024

## References
- [Supabase Documentation](https://supabase.com/docs)
- [Compass Database Schema](../database/compass_taxonomy_schema_Nov11.sql)
- [Supabase Setup Guide](../setup/supabase_setup.md)

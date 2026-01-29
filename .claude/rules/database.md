# Database Rules - Compass Platform

## Supabase Client

Always import from shared package:
```typescript
import { supabase } from '@compass/database'
```

**Never** create new Supabase clients in app code.

## Migrations

**Location**: `/apps/compass/Docs/migrations/active/`

**Naming**: `YYYY-MM-DD_description.sql`

**Template**:
```sql
-- =====================================================
-- PURPOSE: Add voice_profiles table for Voice Lab
-- REASON: Voice Lab needs to store user voice profiles
-- BACKWARD COMPATIBLE: Yes (new table, no breaking changes)
-- OWNER: Voice Lab
-- =====================================================

BEGIN;

CREATE TABLE voice_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  profile_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies (REQUIRED)
ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profiles"
  ON voice_profiles
  FOR SELECT
  USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can create own profiles"
  ON voice_profiles
  FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can update own profiles"
  ON voice_profiles
  FOR UPDATE
  USING (auth.uid()::TEXT = user_id);

COMMIT;

-- Verification (REQUIRED)
SELECT * FROM voice_profiles LIMIT 1;
```

**Workflow**:
1. Create migration file in `/apps/compass/Docs/migrations/active/`
2. Test locally: `psql $DATABASE_URL < migration.sql`
3. Verify schema: `psql $DATABASE_URL -c "\d+ table_name"`
4. Apply to production via Supabase dashboard
5. Move to `migrations/archive/` after applied

## Row Level Security (RLS)

**All tables must have RLS enabled** (CRITICAL):

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

**Common patterns**:

```sql
-- Users can only see their own data
CREATE POLICY "Users view own data"
  ON table_name
  FOR SELECT
  USING (auth.uid()::TEXT = user_id);

-- Users can only modify their own data
CREATE POLICY "Users update own data"
  ON table_name
  FOR UPDATE
  USING (auth.uid()::TEXT = user_id);

-- Public read, authenticated write
CREATE POLICY "Public read access"
  ON table_name
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated write access"
  ON table_name
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

## Query Patterns

**Prefer joins over multiple queries** (avoid N+1):
```typescript
// ❌ Bad: Multiple queries (N+1)
const authors = await supabase.from('authors').select()
for (const author of authors.data) {
  const camps = await supabase
    .from('camp_authors')
    .select('*, camps(*)')
    .eq('author_id', author.id)
}

// ✅ Good: Single query with join
const { data } = await supabase
  .from('authors')
  .select(`
    *,
    camp_authors (
      camps (
        id,
        name
      )
    )
  `)
```

**Select specific columns** (avoid over-fetching):
```typescript
// ❌ Bad: Over-fetching
const authors = await supabase.from('authors').select('*')

// ✅ Good: Only what you need
const { data } = await supabase
  .from('authors')
  .select('id, name, credibility_tier')
```

**Handle errors properly**:
```typescript
const { data, error } = await supabase
  .from('authors')
  .select()
  .eq('id', authorId)
  .single()

if (error) {
  console.error('Database error:', error)
  throw new Error('Failed to fetch author')
}

return data
```

**Use transactions for multiple operations**:
```typescript
// For multiple related inserts/updates, use RPC or handle atomicity
const { data, error } = await supabase.rpc('create_author_with_camps', {
  author_data: { name: 'John Doe' },
  camp_ids: [1, 2, 3]
})
```

## Schema Ownership

| App | Owned Tables |
|-----|-------------|
| Compass | `authors`, `camps`, `domains`, `quotes`, `user_analyses` |
| Voice Lab | `voice_profiles`, `voice_samples` |
| Studio | `projects`, `drafts`, `generated_content` |

**Rules**:
- ✅ Only the owning app modifies table schema (DDL operations)
- ✅ Other apps can read (with RLS policies)
- ❌ Other apps cannot modify schema (coordinate with owning app first)
- ✅ All tables must have RLS policies

## TypeScript Types

Generate types after schema changes:

```bash
# Via Supabase CLI (if installed)
supabase gen types typescript --project-id YOUR_PROJECT_ID > packages/database/src/types.ts

# Or manually via Supabase dashboard
# Settings > API > Generate Types
```

Import and use types:
```typescript
import type { Database } from '@compass/database/types'

type Author = Database['public']['Tables']['authors']['Row']
type AuthorInsert = Database['public']['Tables']['authors']['Insert']
type AuthorUpdate = Database['public']['Tables']['authors']['Update']
```

## Indexes

Add indexes for frequently queried columns:
```sql
-- Add index for user_id lookups
CREATE INDEX idx_user_analyses_user_id ON user_analyses(user_id);

-- Add composite index for multi-column queries
CREATE INDEX idx_authors_tier_created ON authors(credibility_tier, created_at DESC);
```

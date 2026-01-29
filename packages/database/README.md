# @compass/database

> Supabase client and database utilities for the Compass platform

## Purpose

Provides a centralized Supabase client instance and database type definitions shared across all Compass applications. Ensures consistent database access patterns and type safety throughout the monorepo.

## Installation

This package is internal to the Compass monorepo and is imported via workspace protocol.

```json
{
  "dependencies": {
    "@compass/database": "workspace:*"
  }
}
```

## Usage

### Basic Queries

```typescript
import { supabase } from '@compass/database'

// Select data
export async function getAuthors() {
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Insert data
export async function createAuthor(name: string) {
  const { data, error } = await supabase
    .from('authors')
    .insert({ name })
    .select()
    .single()

  if (error) throw error
  return data
}

// Update data
export async function updateAuthor(id: string, updates: Partial<Author>) {
  const { data, error } = await supabase
    .from('authors')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete data
export async function deleteAuthor(id: string) {
  const { error } = await supabase
    .from('authors')
    .delete()
    .eq('id', id)

  if (error) throw error
}
```

### Using TypeScript Types

```typescript
import { supabase } from '@compass/database'
import type { Database } from '@compass/database'

// Table row types
type Author = Database['public']['Tables']['authors']['Row']
type AuthorInsert = Database['public']['Tables']['authors']['Insert']
type AuthorUpdate = Database['public']['Tables']['authors']['Update']

// Type-safe queries
export async function createAuthor(data: AuthorInsert): Promise<Author> {
  const { data: author, error } = await supabase
    .from('authors')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return author
}
```

### Joins and Relations

```typescript
import { supabase } from '@compass/database'

// Query with nested relations
export async function getAuthorWithCamps(authorId: string) {
  const { data, error } = await supabase
    .from('authors')
    .select(`
      id,
      name,
      credibility_tier,
      camp_authors (
        camps (
          id,
          name,
          description
        )
      )
    `)
    .eq('id', authorId)
    .single()

  if (error) throw error
  return data
}
```

### Using Admin Client

For operations that bypass Row Level Security (RLS) policies:

```typescript
import { supabaseAdmin } from '@compass/database'

// Admin operations (use with caution!)
export async function adminDeleteUser(userId: string) {
  const { error } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', userId)

  if (error) throw error
}
```

**Warning:** The admin client bypasses RLS. Only use in server-side code with proper authorization checks.

### URL Validation

Utility function to validate Supabase URLs:

```typescript
import { isValidUrl } from '@compass/database'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL

if (!isValidUrl(url)) {
  throw new Error('Invalid Supabase URL')
}
```

### In Server Actions

```typescript
'use server'

import { currentUser } from '@clerk/nextjs/server'
import { supabase } from '@compass/database'

export async function createAnalysis(text: string) {
  // Always check authentication first
  const user = await currentUser()
  if (!user) return { error: 'Unauthorized' }

  // Perform database operation
  const { data, error } = await supabase
    .from('user_analyses')
    .insert({
      user_id: user.id,
      text,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    return { error: 'Failed to create analysis' }
  }

  return { success: true, data }
}
```

## API Reference

### Supabase Client

- `supabase` - Main Supabase client instance (or `null` if not configured)
  - Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Respects Row Level Security (RLS) policies
  - Safe for client-side and server-side use

### Admin Client

- `supabaseAdmin` - Admin Supabase client (bypasses RLS)
  - Uses `SUPABASE_SERVICE_ROLE_KEY`
  - Only available server-side
  - Bypasses RLS policies - use with caution

### Utilities

- `isValidUrl(url: string): boolean` - Validate Supabase URL format
  - Checks for valid HTTP/HTTPS protocol
  - Rejects placeholder values
  - Returns `false` for empty or invalid URLs

### Types

- `Database` - Complete database schema types
  - Generated from Supabase schema
  - Includes all tables, views, functions, and enums
  - Use `Database['public']['Tables'][tableName]['Row']` for row types

## Dependencies

- **@supabase/supabase-js** - Official Supabase JavaScript client

## Development

### Environment Variables

Required in `.env.local`:

```bash
# Public (client-side safe)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-only (for admin client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Generating Types

After database schema changes, regenerate types:

```bash
# Via Supabase CLI (recommended)
supabase gen types typescript --project-id YOUR_PROJECT_ID > packages/database/src/types.ts

# Or download from Supabase Dashboard
# Settings > API > Generate Types
```

### Database Migrations

Migrations live in `/apps/compass/Docs/migrations/` and are owned by specific apps:

- **Compass**: `authors`, `camps`, `domains`, `quotes`, `user_analyses`
- **Voice Lab**: `voice_profiles`, `voice_samples`
- **Studio**: `projects`, `drafts`, `generated_content`

Only the owning app should modify table schemas.

### Query Best Practices

1. **Select specific columns** instead of `*` when possible
2. **Use joins** instead of multiple queries (avoid N+1)
3. **Add indexes** for frequently queried columns
4. **Enable RLS** on all tables (security requirement)
5. **Handle errors** properly (always check `error` response)
6. **Use `.single()`** when expecting one result
7. **Use `.maybeSingle()`** when result might not exist

```typescript
// Good: Specific columns, single query with join
const { data } = await supabase
  .from('authors')
  .select('id, name, camp_authors(camps(name))')
  .eq('id', authorId)
  .single()

// Bad: Over-fetching, multiple queries
const { data: authors } = await supabase.from('authors').select('*')
for (const author of authors) {
  const { data: camps } = await supabase
    .from('camp_authors')
    .select('*')
    .eq('author_id', author.id)
}
```

## Security

### Row Level Security (RLS)

All tables must have RLS enabled. Example policies:

```sql
-- Enable RLS
ALTER TABLE user_analyses ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users view own data"
  ON user_analyses FOR SELECT
  USING (auth.uid()::TEXT = user_id);

-- Users can only insert their own data
CREATE POLICY "Users create own data"
  ON user_analyses FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);
```

### Client Safety

The main `supabase` client is safe for both client and server use because:
- Uses anonymous key (not service role)
- Respects RLS policies
- Cannot bypass security rules

The `supabaseAdmin` client should only be used server-side with proper authorization.

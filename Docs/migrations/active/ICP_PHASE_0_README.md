# ICP Phase 0: Database Migrations

**Compass v1 (ICP) - Integrated Content Platform**

These migrations create the persistence layer for the ICP workflow: Brief → Generate → Validate → Edit → Export.

---

## Migration Files

Run these in order in your **Supabase SQL Editor**:

| Order | File | Creates |
|-------|------|---------|
| 1 | `001_create_projects_table.sql` | `projects` table |
| 2 | `002_create_project_drafts_table.sql` | `project_drafts` table |
| 3 | `003_create_user_content_defaults_table.sql` | `user_content_defaults` table |

---

## Quick Start

### Step 1: Run Migrations

Open Supabase SQL Editor and run each file in order:

```bash
# Copy contents of each file and execute:
1. 001_create_projects_table.sql
2. 002_create_project_drafts_table.sql
3. 003_create_user_content_defaults_table.sql
```

### Step 2: Verify Tables Exist

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('projects', 'project_drafts', 'user_content_defaults');
```

Expected output: 3 rows

### Step 3: Feature Flag (Already Done)

The `FF_ICP_STUDIO` feature flag has been added to `/lib/feature-flags.ts`.

To enable (Phase 3):
```bash
# In your .env.local or Vercel environment
NEXT_PUBLIC_FF_ICP_STUDIO=true
```

---

## Table Details

### `projects`

Main table tracking content from brief to export.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `clerk_user_id` | TEXT | User ownership |
| `title` | TEXT | Content title |
| `format` | TEXT | blog, linkedin, memo, byline |
| `audience` | TEXT | Target audience |
| `key_points` | JSONB | Array of key points |
| `content_domain` | TEXT | ai_discourse, anduin_product, hybrid |
| `voice_profile_id` | UUID | FK to voice_profiles |
| `current_draft` | TEXT | Latest draft content |
| `current_version` | INTEGER | Draft version number |
| `status` | TEXT | brief, draft, editing, complete |
| `last_voice_check` | JSONB | Voice validation results |
| `last_canon_check` | JSONB | Canon validation results |
| `last_brief_coverage` | JSONB | Brief coverage results |

### `project_drafts`

Version history for each project.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `project_id` | UUID | FK to projects (CASCADE delete) |
| `version` | INTEGER | Version number |
| `content` | TEXT | Draft content |
| `change_source` | TEXT | generated, user_edit, regenerated, ai_suggestion |
| `change_summary` | TEXT | Description of changes |
| `voice_check_snapshot` | JSONB | Voice check at this version |
| `canon_check_snapshot` | JSONB | Canon check at this version |

### `user_content_defaults`

User preferences for Content Builder defaults.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `clerk_user_id` | TEXT | User (UNIQUE) |
| `default_format` | TEXT | Default content format |
| `default_audience` | TEXT | Default target audience |
| `default_content_domain` | TEXT | Default content domain |
| `default_voice_profile_id` | UUID | FK to voice_profiles |
| `preferences` | JSONB | Extensible preferences |

---

## Security

All tables have Row Level Security (RLS) enabled. Users can only access their own data.

---

## Rollback

If needed, drop the tables in reverse order:

```sql
DROP TABLE IF EXISTS user_content_defaults CASCADE;
DROP TABLE IF EXISTS project_drafts CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
```

---

## Next Steps

After running these migrations:
- **Phase 1**: Build backend APIs (`/api/studio/*`)
- **Phase 2**: Build hidden UI (`/studio/*`)
- **Phase 3**: Enable feature flag for rollout

See: `/Docs/architecture/COMPASS_V1_ARCHITECTURE.md` for full implementation plan.

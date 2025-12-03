# Compass · Project Guide for Cursor and AI Coding Assistants

This document tells AI coding assistants (Cursor, Claude Code, ChatGPT, Copilot, etc.) how to behave inside this repository.

The goal is:
- One clear source of truth for schema and migrations
- Predictable documentation structure as the app grows
- Safe, reversible changes over time

---

## 1. High-Level Rules

When operating in this repo, **always follow these principles**:

1. **Canonical over convenient**
   - Only one file or script is the current source of truth for any concept (schema, migration, enrichment).
   - Old or superseded files may exist but live in `archive/` and must not be edited or used as active references.

2. **Never silently rewrite history**
   - Do not modify archived SQL or completion records except to fix obvious typos.
   - New changes must be expressed as new migrations, new ADRs, or new docs, not edits to old decisions.

3. **Human-readable first**
   - When generating or editing docs, prefer clarity and structure: headings, tables, short sections.
   - Explain *why* if you introduce architectural changes (in an ADR).

4. **Keep the docs in sync with the code**
   - If you update schema or migrations, update the relevant reference docs.
   - If you change architecture or major behavior, create or update an ADR.

---

## 2. Directory Map (What Lives Where)

### 2.1 `/Docs` Overview

The `/Docs` directory is structured as:

```text
Docs/
├── README.md                 # Master documentation index
├── CURSOR_PROJECT_GUIDE.md   # ← You are here
├── DOCUMENTATION_AUDIT_REPORT.md  # Audit & cleanup report
│
├── adr/                      # Architecture Decision Records
│   ├── README.md
│   ├── 0001-use-supabase.md
│   ├── 0002-taxonomy-3-tier-structure.md
│   ├── 0003-use-nextjs-vercel.md
│   └── 0004-author-deduplication-strategy.md
│
├── specs/                    # Product & technical specifications
│   ├── mvp_prd.md
│   ├── cursor_rules_mvp.md
│   └── wireframe/
│
├── database/                 # Schema & DB-level SQL
│   ├── compass_taxonomy_schema_Nov11.sql  # ✅ CANONICAL
│   ├── PRODUCTION_SETUP.sql
│   ├── CHECK_SCHEMA.sql
│   └── schema.sql (archived - DO NOT USE)
│
├── migrations/               # DB migrations (active + archive)
│   ├── active/
│   │   ├── FINAL_MIGRATION_INSTRUCTIONS.md  # ✅ CANONICAL
│   │   └── UPDATE_LABELS_FINAL.sql          # ✅ CANONICAL
│   └── archive/
│       ├── MIGRATION_GUIDE.md (superseded)
│       ├── MIGRATION_GUIDE_V2.md (superseded)
│       ├── MIGRATION_COMPLETE.md (historical)
│       └── update_taxonomy_v2*.sql (superseded)
│
├── data/
│   ├── seed/                 # Seed scripts
│   │   ├── seed_from_mvp_database.sql
│   │   ├── 03_seed_authors_and_relationships.sql
│   │   └── ...
│   │
│   ├── enrichment/           # Data enrichment scripts
│   │   ├── ENRICH_ALL_WHY_IT_MATTERS_FINAL.sql  # ✅ CANONICAL
│   │   ├── ENRICH_ALL_REMAINING_QUOTES.sql
│   │   └── ...
│   │
│   └── completed/            # Completion records
│       ├── CASSIE_KOZYRKOV_COMPLETE.md
│       ├── FIXES_DEDUPLICATION_AND_TIERS.md
│       ├── mvp_database_32.md
│       ├── QUOTE_ENRICHMENT_COMPLETE.md
│       ├── TIER1_AUTHORS_SUMMARY.md
│       ├── TIER1_CAMP_MAPPINGS.md
│       ├── TIER1_EXECUTION_CHECKLIST.md
│       ├── WHY_IT_MATTERS_COMPLETE.md
│       └── ...
│
├── reference/                # Conceptual reference docs
│   ├── taxonomy_documentation_Nov11.md
│   ├── AUTHOR_ADDITION_GUIDE.md
│   ├── AUTHOR_ADDITION_LOG.md
│   └── AUTHOR_ADDITION_TEMPLATE.md
│
├── setup/                    # Setup & deployment instructions
│   ├── supabase_setup.md
│   └── prompt.txt
│
└── archive/                  # Deprecated / obsolete docs
    ├── 01_drop_old_tables.sql
    ├── ADDING_KEY_QUOTES.md
    └── ...
```

### 2.2 Mental Model for Navigation

When you search for something, use this mental map:

| What you need | Where to look |
|--------------|---------------|
| What the system is supposed to do | `specs/` |
| What the DB currently looks like | `database/compass_taxonomy_schema_Nov11.sql` |
| How the DB changes over time | `migrations/active/` |
| How the data is seeded/enriched | `data/seed/`, `data/enrichment/` |
| Conceptual overviews, templates | `reference/` |
| Why a decision was made | `adr/` |
| How to set up environments | `setup/` |
| Historical or superseded material | `archive/`, `migrations/archive/` |

---

## 3. Canonical Files (Source of Truth)

### 3.1 Database Schema

**Canonical**: `Docs/database/compass_taxonomy_schema_Nov11.sql`

**Historical / Superseded**: `Docs/database/schema.sql` (DO NOT USE - old MVP schema)

If there is any conflict between files, `compass_taxonomy_schema_Nov11.sql` wins.

### 3.2 Migrations

**Canonical migration guide**: `Docs/migrations/active/FINAL_MIGRATION_INSTRUCTIONS.md`

**Canonical labels update**: `Docs/migrations/active/UPDATE_LABELS_FINAL.sql`

**Superseded versions** (DO NOT USE):
- `Docs/migrations/archive/MIGRATION_GUIDE.md`
- `Docs/migrations/archive/MIGRATION_GUIDE_V2.md`
- `Docs/migrations/archive/update_taxonomy_v2.sql`
- `Docs/migrations/archive/update_taxonomy_v2_CORRECT.sql`
- `Docs/migrations/archive/update_taxonomy_v2_simple.sql`

### 3.3 Enrichment Scripts

**Canonical "Why It Matters" enrichment**: `Docs/data/enrichment/ENRICH_ALL_WHY_IT_MATTERS_FINAL.sql`

**Historical placeholder** (DO NOT USE): `Docs/archive/ENRICH_ALL_WHY_IT_MATTERS.sql`

### 3.4 Reference Documentation

**Taxonomy documentation**: `Docs/reference/taxonomy_documentation_Nov11.md`

**Author addition process**: `Docs/reference/AUTHOR_ADDITION_GUIDE.md`

**Tier 1 authors** (completed work - historical reference):
- `Docs/data/completed/TIER1_AUTHORS_SUMMARY.md`
- `Docs/data/completed/TIER1_CAMP_MAPPINGS.md`
- `Docs/data/completed/TIER1_EXECUTION_CHECKLIST.md`

---

## 4. How to Generate New Work

### 4.1 New DB Migrations

When schema changes are needed:

1. **Start from the canonical schema**:
   - Read `Docs/database/compass_taxonomy_schema_Nov11.sql`
   - Propose changes as **new migration files**, do NOT edit the canonical schema directly

2. **Place new migration under**:
   ```
   Docs/migrations/active/
   ```

3. **Use clear, timestamp-like naming**:
   ```
   2024-12-02_add_new_dimension_table.sql
   2024-12-02_update_author_relevance_enum.sql
   ```

4. **Comment your migrations**:
   At the top of the file, explain:
   - What is changing
   - Why it is needed
   - Whether this is backward compatible

5. **Do NOT reuse or overwrite any file ending with `_FINAL.sql`**

### 4.2 Updating the Schema File

**Only after a schema change is accepted and applied in production**:

- Human or supervising agent may update `compass_taxonomy_schema_Nov11.sql` or create a new canonical schema file (e.g. `compass_taxonomy_schema_2024-12-15.sql`)
- If a new canonical schema file is created, this guide must be updated to point to the new one
- Cursor should **NOT** silently rename or replace canonical schema files without explicit instruction

### 4.3 Seed and Enrichment Logic

If you generate new seed or enrichment logic:

1. **Place new seed scripts under**:
   ```
   Docs/data/seed/
   ```

2. **Place new enrichment scripts under**:
   ```
   Docs/data/enrichment/
   ```

3. **If a script supersedes an existing one**:
   - Add a brief comment at the top of the new script:
     ```sql
     -- Supersedes: <old_file.sql> (reason: <short reason>)
     ```
   - Suggest moving the old script to `Docs/archive/` in a separate human-reviewed step

---

## 5. ADRs (Architecture Decision Records)

### 5.1 When to Create an ADR

**Cursor should propose an ADR when**:
- Changing the database structure in a non-trivial way
- Introducing a new core dependency or service
- Significantly changing the taxonomy, camp logic, or relevance model
- Changing how the AI agents interact with the database
- Making UX decisions that affect data model

**Don't create ADRs for**:
- Minor bug fixes
- Individual feature implementations (use `specs/` instead)
- Temporary workarounds

### 5.2 Location

ADRs live in:
```
Docs/adr/
  ├── README.md
  ├── 0001-use-supabase.md
  ├── 0002-taxonomy-3-tier-structure.md
  ├── 0003-use-nextjs-vercel.md
  ├── 0004-author-deduplication-strategy.md
  └── ...
```

If `Docs/adr/` does not exist, suggest creating it instead of burying rationale in random notes.

### 5.3 ADR Template

When generating a new ADR, follow this skeleton:

```markdown
# ADR NNNN – <Short Decision Title>

## Status
Proposed | Accepted | Superseded | Deprecated

## Context
- What problem are we solving?
- What constraints matter? (performance, simplicity, migration cost, etc.)

## Decision
- What did we decide to do?

## Consequences
### Positive
- ✅ ...

### Negative / Tradeoffs
- ⚠️ ...

### Mitigation
- How do we address the negatives?

## Alternatives Considered
- Alternative A – why rejected
- Alternative B – why rejected

## Implementation Notes
- Technical details
- Code examples

## Related Decisions
- Link to related ADRs

## Date
When decided: YYYY-MM-DD
When documented: YYYY-MM-DD

## References
- Links to docs, discussions, external resources
```

### 5.4 Naming Convention

Use sequential numbering with kebab-case:
```
NNNN-short-decision-title.md
```

Examples:
- `0001-use-supabase.md`
- `0002-taxonomy-3-tier-structure.md`
- `0005-implement-quote-source-urls.md`

---

## 6. Specs, Reference Docs, and Modules

### 6.1 Specs

Product and technical specs go into:
```
Docs/specs/
```

Examples:
- `Docs/specs/mvp_prd.md`
- `Docs/specs/cursor_rules_mvp.md`
- `Docs/specs/wireframe/compass-implementation-spec-v2.md`

**When adding major new features** (e.g. Discovery & Inspiration, AI search expansion):
1. Create or update a spec under `Docs/specs/`
2. Include:
   - Problem statement
   - User flows
   - Data needs
   - API endpoints or n8n workflows

### 6.2 Reference

Conceptual and reusable docs go into:
```
Docs/reference/
```

Examples:
- `TIER1_AUTHORS_SUMMARY.md`
- `TIER1_CAMP_MAPPINGS.md`
- `AUTHOR_ADDITION_GUIDE.md`
- `taxonomy_documentation_Nov11.md`

**Cursor should NOT treat reference docs as operational scripts**. They are explanatory.

### 6.3 Future Module-Level Docs (Forward-Looking)

As Compass grows, modules will likely emerge:
- Search and AI query expansion
- Author / source management
- Camps and relevance
- Discovery & Inspiration pages

For each major module, it is recommended to eventually have:
```
Docs/modules/<module_name>/
  ├── README.md
  ├── prd.md
  ├── api.md
  ├── schema.md (if module-specific)
  └── notes.md
```

**Cursor can propose this structure but should not assume it exists yet.**

---

## 7. Archive Handling Rules

The `Docs/archive/` directory and any `/archive/` subfolder under other directories are **read-only historical context**.

**Cursor should**:
- Use them only to understand how things evolved
- Never base new designs on archived scripts if an active canonical file exists
- Never modify archived files except for trivial formatting or clear typo fixes

**When a file is clearly superseded**:
- Suggest moving the old file into `archive/`, not deleting it
- Maintain institutional memory for rollback capability

---

## 8. Naming Conventions

### 8.1 Files

**Canonical/Final versions**: Use `_FINAL` suffix or clear date stamps
```
UPDATE_LABELS_FINAL.sql
compass_taxonomy_schema_Nov11.sql
ENRICH_ALL_WHY_IT_MATTERS_FINAL.sql
```

**Completion records**: Use `_COMPLETE` suffix
```
QUOTE_ENRICHMENT_COMPLETE.md
WHY_IT_MATTERS_COMPLETE.md
MIGRATION_COMPLETE.md
```

**Versioned iterations**: Use `_v1`, `_v2`, etc.
```
update_taxonomy_v2.sql
migration_guide_v2.md
```

### 8.2 Migrations

**Active migrations**: Place in `migrations/active/`

**Completed migrations**: Move to `migrations/archive/`

**New migrations**: Use timestamp format
```
YYYY-MM-DD_description.sql

Examples:
2024-12-02_add_author_initials.sql
2024-12-15_add_quote_source_urls.sql
```

### 8.3 ADRs

**Format**: `NNNN-short-title.md`
```
0001-use-supabase.md
0002-taxonomy-3-tier-structure.md
```

**Status markers**: Proposed | Accepted | Superseded | Deprecated

---

## 9. How to Behave When There Is Conflict

If documentation and code disagree:

### 1. Prefer the canonical markers
- Files with `_FINAL` or clearly labeled "current production schema" win over older variants

### 2. Prefer canonical directories
- `Docs/database/` and `Docs/migrations/active/` win over `Docs/archive/`

### 3. Call it out
When generating output, briefly note:
```
⚠️ There is a conflict between X and Y; this solution assumes X as canonical.
```

**Cursor should not silently choose a random source.**

---

## 10. Common Workflows

### 10.1 Adding a New Author

1. Read `Docs/reference/AUTHOR_ADDITION_GUIDE.md`
2. Create SQL file in `Docs/data/seed/`
3. Include: profile, 3+ sources, 2-5 camp relationships
4. Execute and verify
5. Update `Docs/AUTHOR_ADDITION_LOG.md`

### 10.2 Creating a Database Migration

1. Start from canonical schema: `Docs/database/compass_taxonomy_schema_Nov11.sql`
2. Create new file: `Docs/migrations/active/YYYY-MM-DD_description.sql`
3. Add header comment explaining what/why/backward-compatibility
4. Test locally
5. After production: move to `Docs/migrations/archive/`

### 10.3 Making an Architectural Decision

1. Create new ADR: `Docs/adr/NNNN-decision-title.md`
2. Use ADR template
3. Include: Status, Context, Decision, Consequences, Alternatives
4. Update status when decision is accepted/superseded
5. Update `Docs/adr/README.md` index

### 10.4 Enriching Data

1. Place scripts in `Docs/data/enrichment/`
2. Use `_FINAL` suffix for canonical version
3. Document completion in `Docs/data/completed/`
4. Archive superseded versions

---

## 11. Quality Standards

### 11.1 SQL Files

**Must include**:
- Header comment explaining purpose
- Transaction wrappers (BEGIN/COMMIT) when appropriate
- Verification queries at the end

**Example**:
```sql
-- =====================================================
-- PURPOSE: Add author initials column
-- REASON: Needed for compact author display in UI
-- BACKWARD COMPATIBLE: Yes (nullable column)
-- =====================================================

BEGIN;

ALTER TABLE authors
ADD COLUMN initials TEXT;

-- Populate from existing names
UPDATE authors
SET initials = ...

COMMIT;

-- Verification
SELECT name, initials FROM authors LIMIT 10;
```

### 11.2 Markdown Docs

**Must include**:
- Clear headings (H1, H2, H3)
- Table of contents for docs >200 lines
- Code examples in fenced blocks with language tags
- Links to related docs

### 11.3 ADRs

**Must include**:
- Status marker
- Context explaining the problem
- Clear decision statement
- Consequences (positive and negative)
- Alternatives considered
- Date

---

## 12. Testing and Verification

### 12.1 After Adding Authors

```bash
# Verify author was added with all requirements
node --env-file=.env.local -e "
import('dotenv/config').then(() => {
  import('pg').then(async (pkg) => {
    const { default: pg } = pkg;
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const result = await pool.query(\`
      SELECT
        a.name,
        a.credibility_tier,
        jsonb_array_length(a.sources) as source_count,
        COUNT(ca.id) as camp_count
      FROM authors a
      LEFT JOIN camp_authors ca ON a.id = ca.author_id
      WHERE a.name = '[Author Name]'
      GROUP BY a.id
    \`);
    console.log(result.rows);
    await pool.end();
  });
});
"
```

### 12.2 After Schema Changes

```bash
# Verify schema matches canonical
psql $DATABASE_URL -c "\d+ authors"
```

### 12.3 After Migrations

```bash
# Run verification queries from migration file
```

---

## 13. Project Status Tracking

### Current Status

**Completed**:
- ✅ MVP database schema (32 authors, 5 domains, 11 camps)
- ✅ Taxonomy migration to 3-tier structure
- ✅ Quote enrichment (domain-specific quotes)
- ✅ "Why it matters" enrichment
- ✅ Author sources requirement (3+ per author)
- ✅ Tier 1 author expansion (Lex Fridman, Cassie Kozyrkov)
- ✅ Deduplication fix
- ✅ Credibility tier labels

**In Progress**:
- 🔄 Tier 1 author additions (7 remaining)
- 🔄 Documentation restructuring

### Where to Track Status

- **Overall project status**: `Docs/README.md`
- **Author additions**: `Docs/AUTHOR_ADDITION_LOG.md`
- **Completion records**: `Docs/data/completed/`
- **Migration history**: `Docs/migrations/archive/`

---

## 14. Quick Reference

### File Paths Cheat Sheet

| Purpose | Canonical File |
|---------|----------------|
| Database schema | `Docs/database/compass_taxonomy_schema_Nov11.sql` |
| Migration guide | `Docs/migrations/active/FINAL_MIGRATION_INSTRUCTIONS.md` |
| Label updates | `Docs/migrations/active/UPDATE_LABELS_FINAL.sql` |
| Why It Matters | `Docs/data/enrichment/ENRICH_ALL_WHY_IT_MATTERS_FINAL.sql` |
| Taxonomy docs | `Docs/reference/taxonomy_documentation_Nov11.md` |
| Author guide | `Docs/reference/AUTHOR_ADDITION_GUIDE.md` |
| ADR index | `Docs/adr/README.md` |

### Command Cheat Sheet

```bash
# Start dev server
npm run dev

# Check database schema
psql $DATABASE_URL -c "\d+ authors"

# Verify author
node --env-file=.env.local scripts/check_authors.mjs

# Run migration
psql $DATABASE_URL < Docs/migrations/active/2024-12-02_migration.sql
```

---

## 15. For AI Agents: Special Instructions

### When Proposing Changes

**Always**:
- State which canonical file you're basing work on
- Explain why the change is needed
- Suggest where the new file should go
- Include verification steps

**Never**:
- Modify archived files
- Overwrite `_FINAL` files without explicit approval
- Delete files (suggest archiving instead)
- Skip header comments in SQL files

### When Uncertain

If you're not sure which file is canonical or whether to create an ADR:

**Ask explicitly**:
```
⚠️ I found two versions of this migration:
- Docs/migrations/active/UPDATE_LABELS_FINAL.sql
- Docs/migrations/archive/update_taxonomy_v2.sql

Which should I base the new change on?
```

**Don't guess** or silently pick one.

---

## 16. Maintenance Schedule

### Regular Tasks

- [ ] After each migration: move to `migrations/archive/`
- [ ] After schema changes: update canonical schema
- [ ] After major decisions: create ADR
- [ ] After author additions: update `AUTHOR_ADDITION_LOG.md`
- [ ] Quarterly: review and consolidate `archive/`

---

## Summary

**Key principles**:
1. **Canonical over convenient** - One source of truth
2. **Never rewrite history** - New migrations, not edits
3. **Human-readable first** - Clear docs with context
4. **Keep docs in sync** - Update refs when changing code
5. **Archive don't delete** - Preserve institutional memory

**When in doubt**:
- Check `Docs/README.md` for directory map
- Check `Docs/adr/` for architectural context
- Check canonical files (marked with `_FINAL` or date stamps)
- Ask explicitly rather than guessing

---

**Last Updated**: 2024-12-02
**Version**: 1.0
**Maintained by**: Compass team


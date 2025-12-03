# Compass Documentation

**Last Updated**: 2024-12-02
**Purpose**: Central documentation hub for the Compass AI Thought Leadership platform

---

## 📂 Directory Structure

```
Docs/
├── README.md                 # ← You are here
├── CURSOR_PROJECT_GUIDE.md   # AI agent instructions
├── DOCUMENTATION_AUDIT_REPORT.md  # Audit & cleanup report
│
├── adr/                      # Architecture Decision Records
│   ├── 0001-use-supabase.md
│   ├── 0002-taxonomy-3-tier-structure.md
│   └── 0003-use-nextjs-vercel.md
│
├── specs/                    # Product & technical specifications
│   ├── mvp_prd.md
│   ├── cursor_rules_mvp.md
│   ├── COMPASS_DESIGN_SYSTEM.md  # Complete design system
│   └── wireframe/
│
├── database/                 # Database schema & environment setup
│   ├── compass_taxonomy_schema_Nov11.sql  # ✅ CANONICAL SCHEMA
│   ├── PRODUCTION_SETUP.sql
│   └── CHECK_SCHEMA.sql
│
├── migrations/               # Database migrations
│   ├── active/               # Current/active migrations
│   │   ├── FINAL_MIGRATION_INSTRUCTIONS.md
│   │   └── UPDATE_LABELS_FINAL.sql
│   └── archive/              # Completed/superseded migrations
│
├── data/                     # Data management
│   ├── seed/                 # Seed scripts
│   ├── enrichment/           # Data enrichment scripts
│   └── completed/            # Completion records & tracking
│
├── reference/                # Reference documentation
│   ├── taxonomy_documentation_Nov11.md
│   ├── AUTHOR_ADDITION_GUIDE.md
│   ├── AUTHOR_ADDITION_LOG.md
│   └── AUTHOR_ADDITION_TEMPLATE.md
│
├── setup/                    # Setup & deployment guides
│   ├── supabase_setup.md
│   └── prompt.txt
│
└── archive/                  # Deprecated/obsolete documentation
```

---

## 🎯 Quick Navigation

### I want to...

**Understand the product**
→ Start with [`specs/mvp_prd.md`](./specs/mvp_prd.md)

**Understand the database**
→ Read [`database/compass_taxonomy_schema_Nov11.sql`](./database/compass_taxonomy_schema_Nov11.sql)
→ See taxonomy docs: [`reference/taxonomy_documentation_Nov11.md`](./reference/taxonomy_documentation_Nov11.md)

**Run migrations**
→ Follow [`migrations/active/FINAL_MIGRATION_INSTRUCTIONS.md`](./migrations/active/FINAL_MIGRATION_INSTRUCTIONS.md)

**Add new authors**
→ Use [`reference/AUTHOR_ADDITION_GUIDE.md`](./reference/AUTHOR_ADDITION_GUIDE.md)

**Understand past architectural decisions**
→ Browse [`adr/`](./adr/)

**Set up the development environment**
→ See [`setup/supabase_setup.md`](./setup/supabase_setup.md)

**Seed the database**
→ Start with [`data/seed/seed_from_mvp_database.sql`](./data/seed/seed_from_mvp_database.sql)

---

## 📋 Canonical Files (Source of Truth)

These files are the **authoritative** sources. When in doubt, these win:

| What | Canonical File | Location |
|------|---------------|----------|
| **Database Schema** | `compass_taxonomy_schema_Nov11.sql` | [`database/`](./database/) |
| **Migration Guide** | `FINAL_MIGRATION_INSTRUCTIONS.md` | [`migrations/active/`](./migrations/active/) |
| **Label Updates** | `UPDATE_LABELS_FINAL.sql` | [`migrations/active/`](./migrations/active/) |
| **Why It Matters Enrichment** | `ENRICH_ALL_WHY_IT_MATTERS_FINAL.sql` | [`data/enrichment/`](./data/enrichment/) |
| **Taxonomy Documentation** | `taxonomy_documentation_Nov11.md` | [`reference/`](./reference/) |
| **Author Addition Process** | `AUTHOR_ADDITION_GUIDE.md` | [`reference/`](./reference/) |

---

## 🔧 Naming Conventions

### Files
- **Canonical/Final versions**: Use `_FINAL` suffix or clear date stamps
  - Example: `UPDATE_LABELS_FINAL.sql`, `compass_taxonomy_schema_Nov11.sql`
- **Completion records**: Use `_COMPLETE` suffix
  - Example: `QUOTE_ENRICHMENT_COMPLETE.md`
- **Versioned iterations**: Use `_v1`, `_v2`, etc.
  - Example: `update_taxonomy_v2.sql`

### Migrations
- **Active migrations**: Place in `migrations/active/`
- **Completed migrations**: Move to `migrations/archive/`
- **New migrations**: Use timestamp format: `YYYY-MM-DD_description.sql`
  - Example: `2024-12-02_add_author_initials.sql`

### ADRs
- **Format**: `NNNN-short-title.md`
  - Example: `0001-use-supabase.md`
- **Status markers**: Proposed | Accepted | Superseded

---

## 📚 Documentation Principles

### 1. Canonical Over Convenient
- Only **one file** is the source of truth for any concept
- Old/superseded files live in `archive/` and are read-only

### 2. Never Rewrite History
- Don't modify archived files (except typos)
- Express changes as **new migrations** or **new ADRs**

### 3. Human-Readable First
- Use clear headings, tables, short sections
- Explain **why**, not just what

### 4. Keep Docs in Sync with Code
- Update docs when you change schema/migrations
- Create ADRs for architectural changes

### 5. Archive Don't Delete
- Move superseded files to `archive/` for rollback capability
- Maintain institutional memory

---

## 🚀 Common Workflows

### Adding a New Author
1. Read [`reference/AUTHOR_ADDITION_GUIDE.md`](./reference/AUTHOR_ADDITION_GUIDE.md)
2. Create SQL file in `data/seed/`
3. Include: profile, 3+ sources, 2-5 camp relationships
4. Execute and verify
5. Update [`AUTHOR_ADDITION_LOG.md`](./AUTHOR_ADDITION_LOG.md)

### Creating a Database Migration
1. Start from canonical schema: `database/compass_taxonomy_schema_Nov11.sql`
2. Create new file: `migrations/active/YYYY-MM-DD_description.sql`
3. Add header comment explaining what/why/backward-compatibility
4. Test locally
5. After production: move to `migrations/archive/`

### Making an Architectural Decision
1. Create new ADR: `adr/NNNN-decision-title.md`
2. Use ADR template (see CURSOR_PROJECT_GUIDE.md)
3. Include: Status, Context, Decision, Consequences, Alternatives
4. Update status when decision is accepted/superseded

### Enriching Data
1. Place scripts in `data/enrichment/`
2. Use `_FINAL` suffix for canonical version
3. Document completion in `data/completed/`
4. Archive superseded versions

---

## 🤖 AI Agent Instructions

AI coding assistants (Cursor, Claude Code, Copilot) should read:

**[`CURSOR_PROJECT_GUIDE.md`](./CURSOR_PROJECT_GUIDE.md)**

This file contains:
- How to handle migrations
- What files are canonical
- When to create ADRs
- Naming conventions
- Archive handling rules

---

## 📊 Project Status Tracking

### Completed Major Work
- ✅ MVP database schema (32 authors, 5 domains, 11 camps)
- ✅ Taxonomy migration to 3-tier structure (domains → camps)
- ✅ Quote enrichment (domain-specific quotes for all authors)
- ✅ "Why it matters" enrichment (all camp relationships)
- ✅ Author sources requirement (3+ per author)
- ✅ Tier 1 author expansion (Lex Fridman, Cassie Kozyrkov added)
- ✅ Deduplication fix (authors appear once per domain)
- ✅ Credibility tier labels (Major Voice, Seminal Thinker, Thought Leader)

### Current Work
- 🔄 Tier 1 author additions (7 remaining)
- 🔄 Documentation restructuring

### Completion Records
See [`data/completed/`](./data/completed/) for detailed completion documentation.

---

## 🔍 Finding What You Need

### By Task
- **Product planning** → `specs/`
- **Database work** → `database/`, `migrations/`
- **Data work** → `data/seed/`, `data/enrichment/`
- **Understanding concepts** → `reference/`
- **Setup/deployment** → `setup/`
- **Historical context** → `archive/`

### By File Type
- **SQL scripts** → `database/`, `migrations/`, `data/`
- **Markdown docs** → All directories
- **Wireframes** → `specs/wireframe/`
- **CSV data** → `data/seed/`

---

## 🛠️ Maintenance

### Regular Tasks
- [ ] After each migration: move to `migrations/archive/`
- [ ] After schema changes: update canonical schema
- [ ] After major decisions: create ADR
- [ ] After author additions: update `AUTHOR_ADDITION_LOG.md`
- [ ] Quarterly: review and consolidate `archive/`

### Quality Standards
- All SQL files must have header comments
- All ADRs must follow template
- All new authors must have 3+ sources
- All migrations must be reversible or documented

---

## 📞 Questions?

- For product questions → See `specs/mvp_prd.md`
- For database questions → See `database/compass_taxonomy_schema_Nov11.sql`
- For process questions → See `CURSOR_PROJECT_GUIDE.md`
- For historical context → Browse `archive/` and `data/completed/`

---

## 🔄 Version History

| Date | Change | By |
|------|--------|-----|
| 2024-12-02 | Restructured documentation, added ADRs, created guide | Documentation audit |
| 2024-11-21 | Completed quote and "why it matters" enrichment | - |
| 2024-11-11 | Migrated to 3-tier taxonomy structure | - |

---

**Note**: This is a living document. Update it as the project evolves.

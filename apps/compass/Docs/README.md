# Documentation Index

Complete guide to all documentation in the Compass project.

## Start Here

New to the project? Read these in order:

1. **[COMPASS_V1_ARCHITECTURE.md](architecture/COMPASS_V1_ARCHITECTURE.md)** - **Product vision & technical architecture** ⭐
2. **[README.md](../README.md)** - Project overview, quick start, and navigation
3. **[Documentation Quick Reference](reference/DOCUMENTATION_QUICK_REFERENCE.md)** - Common tasks cheat sheet

## Documentation by Purpose

### I want to understand the project

- [README.md](../README.md) - Project overview and getting started
- [specs/mvp_prd.md](specs/mvp_prd.md) - Product requirements
- [database/schema.sql](database/schema.sql) - Database structure

### I want to make an architectural decision

- [adr/README.md](adr/README.md) - ADR process and index
- [adr/template.md](adr/template.md) - Template for new ADRs
- [adr/0001-documentation-structure.md](adr/0001-documentation-structure.md) - Example ADR

### I want to set up or deploy the project

- [README.md#getting-started](../README.md#getting-started) - Local setup
- [setup/](setup/) - Deployment guides
- [setup/SUPABASE_INTEGRATION.md](setup/SUPABASE_INTEGRATION.md) - Supabase integration
- [database/PRODUCTION_SETUP.sql](database/PRODUCTION_SETUP.sql) - Production database setup

### I want to work with the database

- [database/schema.sql](database/schema.sql) - Current schema
- [migrations/](migrations/) - Migration history
- [data/seed/](data/seed/) - Seed data scripts

### I want to understand a specific module

- [reference/EXAMPLE_MODULE_README.md](reference/EXAMPLE_MODULE_README.md) - Example of module docs
- [reference/MODULE_README_TEMPLATE.md](reference/MODULE_README_TEMPLATE.md) - Template for creating module docs
- *(Module READMEs to be created as modules grow)*

### I want to contribute or maintain docs

- [reference/DOCUMENTATION_GOVERNANCE.md](reference/DOCUMENTATION_GOVERNANCE.md) - Full governance guide
- [reference/DOCUMENTATION_QUICK_REFERENCE.md](reference/DOCUMENTATION_QUICK_REFERENCE.md) - Quick reference cheat sheet
- [adr/README.md](adr/README.md) - How to create ADRs

## Documentation by Type

### Core Project Docs

| Document | Purpose | Owner |
|----------|---------|-------|
| [README.md](../README.md) | Project overview and navigation | Project Lead |
| [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) | This file - complete doc index | Project Lead |

### Architecture Decision Records

| ADR | Title | Status |
|-----|-------|--------|
| [0001](adr/0001-use-supabase.md) | Use Supabase for Backend | Accepted |
| [0002](adr/0002-taxonomy-3-tier-structure.md) | 3-Tier Taxonomy Structure | Accepted |
| [0003](adr/0003-use-nextjs-vercel.md) | Use Next.js and Vercel | Accepted |
| [0004](adr/0004-author-deduplication-strategy.md) | Author Deduplication Strategy | Accepted |
| [0005](adr/0005-design-system-standards.md) | Design System Standards | Accepted |
| [0006](adr/0006-search-expansion-module.md) | Search Expansion Module | Accepted |
| [0007](adr/0007-mini-brain-architecture.md) | Mini Brain Architecture | Accepted |

### Architecture (Source of Truth)

| Document | Purpose |
|----------|---------|
| [COMPASS_V1_ARCHITECTURE.md](architecture/COMPASS_V1_ARCHITECTURE.md) | **Complete product & technical architecture** ⭐ |

### Specifications

| Document | Purpose |
|----------|---------|
| [mvp_prd.md](specs/mvp_prd.md) | Original MVP product requirements (historical) |
| [PREFERENCE_LEARNING_PLAN.md](specs/PREFERENCE_LEARNING_PLAN.md) | Future feature: preference learning (v2) |
| [cursor_rules_mvp.md](specs/cursor_rules_mvp.md) | AI assistant coding guidelines |

### Database Documentation

| Document | Purpose |
|----------|---------|
| [schema.sql](database/schema.sql) | Current database schema |
| [PRODUCTION_SETUP.sql](database/PRODUCTION_SETUP.sql) | Production setup scripts |

### Setup & Integration

| Document | Purpose |
|----------|---------|
| [SUPABASE_INTEGRATION.md](setup/SUPABASE_INTEGRATION.md) | Supabase integration guide |

### Reference & Guides

| Document | Purpose |
|----------|---------|
| [DOCUMENTATION_GOVERNANCE.md](reference/DOCUMENTATION_GOVERNANCE.md) | How we manage documentation |
| [DOCUMENTATION_QUICK_REFERENCE.md](reference/DOCUMENTATION_QUICK_REFERENCE.md) | Common tasks cheat sheet |
| [MODULE_README_TEMPLATE.md](reference/MODULE_README_TEMPLATE.md) | Template for module docs |
| [EXAMPLE_MODULE_README.md](reference/EXAMPLE_MODULE_README.md) | Example module documentation |

## Directory Structure

```
compass/
├── README.md                                    # Project overview ⭐ START HERE
│
├── Docs/                                        # Project documentation
│   ├── README.md                               # This file - doc navigation
│   │
│   ├── architecture/                            # Product & technical architecture
│   │   └── COMPASS_V1_ARCHITECTURE.md          # ⭐ SOURCE OF TRUTH
│   │
│   ├── adr/                                    # Architecture Decision Records
│   │   ├── README.md                          # ADR process and index
│   │   ├── template.md                        # Template for new ADRs
│   │   ├── 0001-use-supabase.md              # Use Supabase
│   │   ├── 0002-taxonomy-3-tier-structure.md # Taxonomy structure
│   │   ├── 0003-use-nextjs-vercel.md         # Next.js & Vercel
│   │   ├── 0004-author-deduplication.md      # Author dedup
│   │   ├── 0005-design-system-standards.md   # Design system
│   │   └── 0006-search-expansion-module.md   # Search expansion
│   │
│   ├── specs/                                  # Product & technical specs
│   │   ├── mvp_prd.md                         # MVP requirements
│   │   └── cursor_rules_mvp.md                # AI assistant guidelines
│   │
│   ├── database/                               # Database documentation
│   │   ├── schema.sql                         # Current schema (canonical)
│   │   └── PRODUCTION_SETUP.sql               # Production setup
│   │
│   ├── migrations/                             # Database migrations
│   │   ├── active/                            # Pending migrations
│   │   └── archive/                           # Completed migrations
│   │
│   ├── data/                                   # Seed & enrichment data
│   │   ├── seed/                              # Initial data
│   │   ├── enrichment/                        # Content enrichment
│   │   └── completed/                         # Completion records
│   │
│   ├── setup/                                  # Setup & deployment guides
│   │   └── SUPABASE_INTEGRATION.md            # Supabase setup guide
│   │
│   ├── reference/                              # Conceptual guides
│   │   ├── DOCUMENTATION_GOVERNANCE.md        # Doc management guide
│   │   ├── DOCUMENTATION_QUICK_REFERENCE.md   # Cheat sheet
│   │   ├── MODULE_README_TEMPLATE.md          # Module doc template
│   │   └── EXAMPLE_MODULE_README.md           # Example module docs
│   │
│   └── archive/                                # Obsolete documentation
│
├── components/                                  # React components
│   ├── search-expansion/                       # Search expansion UI
│   │   └── README.md                          # (To be created)
│   └── README.md                               # (To be created)
│
├── lib/                                         # Utilities and helpers
│   ├── search-expansion/                       # Search expansion module
│   │   └── README.md                          # Module documentation
│   ├── mini-brain/                             # Mini Brain editorial analysis
│   │   └── README.md                          # Module documentation
│   └── README.md                               # (To be created)
│
├── app/                                         # Next.js app
│   └── README.md                               # (To be created)
│
└── scripts/                                     # Admin scripts
    └── README.md                               # (To be created)
```

## Common Tasks

### Creating Documentation

| Task | Template to Use | Where to Put It |
|------|----------------|-----------------|
| New architectural decision | [adr/template.md](adr/template.md) | `/Docs/adr/NNNN-title.md` |
| New module documentation | [MODULE_README_TEMPLATE.md](reference/MODULE_README_TEMPLATE.md) | `module-dir/README.md` |
| New setup guide | (No template) | `/Docs/setup/` |
| New migration | (Document in SQL file) | `/Docs/migrations/active/` |

### Finding Documentation

| What You Need | Where to Look |
|---------------|---------------|
| Getting started | [README.md](../README.md) |
| Why we made a decision | [adr/](adr/) directory |
| Database schema | [database/schema.sql](database/schema.sql) |
| How to use a module | Module's README.md |
| How to deploy | [setup/](setup/) |
| Governance rules | [DOCUMENTATION_GOVERNANCE.md](reference/DOCUMENTATION_GOVERNANCE.md) |
| Quick cheat sheet | [DOCUMENTATION_QUICK_REFERENCE.md](reference/DOCUMENTATION_QUICK_REFERENCE.md) |

### Updating Documentation

| When You... | You Should... |
|-------------|---------------|
| Change module's public API | Update module's README.md |
| Make architectural decision | Create new ADR |
| Change database schema | Update schema.sql + create migration |
| Add major feature | Update root README.md |
| Find outdated doc | Update or archive it |

## Best Practices

### The Documentation Hierarchy

1. **[README.md](../README.md)** - Start here, provides overview and navigation
2. **Module READMEs** - Details for specific parts of the codebase
3. **[ADRs](adr/)** - Context for why things are the way they are
4. **[Reference docs](reference/)** - Deep dives and conceptual guides

### Key Principles

1. **Single Source of Truth** - Each concept has one canonical location
2. **Link, Don't Duplicate** - Reference the canonical source instead of copying
3. **Document Decisions** - Use ADRs to capture architectural choices
4. **Keep Docs Near Code** - Version documentation with the code it describes
5. **Archive, Don't Delete** - Preserve history by archiving obsolete docs

### Working with AI Assistants

When asking AI coding assistants for help:

- **Point to canonical docs**: "Follow the pattern in /components/README.md"
- **Reference ADRs**: "Consider ADR-0001 for the documentation structure"
- **Request doc updates**: "Update the module README to reflect this change"
- **Ask for ADRs**: "Draft an ADR comparing these three approaches"

## Maintenance Schedule

### Every PR
- Update docs affected by code changes
- Create ADRs for architectural decisions

### Monthly
- Review new documentation for clarity
- Check that recent features are documented

### Quarterly
- Full documentation audit
- Archive obsolete documentation
- Update this index

## Getting Help

### Questions about documentation?

1. Check [Documentation Quick Reference](reference/DOCUMENTATION_QUICK_REFERENCE.md)
2. Read [Documentation Governance](reference/DOCUMENTATION_GOVERNANCE.md)
3. Look at [Example Module README](reference/EXAMPLE_MODULE_README.md)
4. Review existing [ADRs](adr/) for examples

### Still stuck?

- Create a GitHub discussion
- Ask in team chat
- Create an issue with the `documentation` label

## Contributing to Documentation

See [Documentation Governance Guide](reference/DOCUMENTATION_GOVERNANCE.md) for:
- When to create documentation
- How to structure documentation
- Review process
- Style guidelines

## Version History

| Date | Change |
|------|--------|
| 2026-01-22 | Added architecture folder; archived outdated vision docs |
| 2025-12-02 | Initial documentation structure established |

---

**Last Updated:** 2026-01-22

**Maintained by:** Project Team

**Questions?** See [Documentation Governance](reference/DOCUMENTATION_GOVERNANCE.md) or create a GitHub discussion.

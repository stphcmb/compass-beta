# Documentation Index

Complete guide to all documentation in the Compass project.

## Start Here

New to the project? Read these in order:

1. **[README.md](README.md)** - Project overview, quick start, and navigation
2. **[ADR-0001: Documentation Structure](adr/0001-documentation-structure.md)** - How we organize docs
3. **[Documentation Quick Reference](Docs/reference/DOCUMENTATION_QUICK_REFERENCE.md)** - Common tasks cheat sheet

## Documentation by Purpose

### I want to understand the project

- [README.md](README.md) - Project overview and getting started
- [Docs/specs/mvp_prd.md](Docs/specs/mvp_prd.md) - Product requirements
- [Docs/database/schema.sql](Docs/database/schema.sql) - Database structure

### I want to make an architectural decision

- [adr/README.md](adr/README.md) - ADR process and index
- [adr/template.md](adr/template.md) - Template for new ADRs
- [adr/0001-documentation-structure.md](adr/0001-documentation-structure.md) - Example ADR

### I want to set up or deploy the project

- [README.md#getting-started](README.md#getting-started) - Local setup
- [Docs/setup/](Docs/setup/) - Deployment guides
- [Docs/database/PRODUCTION_SETUP.sql](Docs/database/PRODUCTION_SETUP.sql) - Production database setup

### I want to work with the database

- [Docs/database/schema.sql](Docs/database/schema.sql) - Current schema
- [Docs/migrations/](Docs/migrations/) - Migration history
- [Docs/data/seed/](Docs/data/seed/) - Seed data scripts

### I want to understand a specific module

- [Docs/reference/EXAMPLE_MODULE_README.md](Docs/reference/EXAMPLE_MODULE_README.md) - Example of module docs
- [Docs/reference/MODULE_README_TEMPLATE.md](Docs/reference/MODULE_README_TEMPLATE.md) - Template for creating module docs
- *(Module READMEs to be created as modules grow)*

### I want to contribute or maintain docs

- [Docs/reference/DOCUMENTATION_GOVERNANCE.md](Docs/reference/DOCUMENTATION_GOVERNANCE.md) - Full governance guide
- [Docs/reference/DOCUMENTATION_QUICK_REFERENCE.md](Docs/reference/DOCUMENTATION_QUICK_REFERENCE.md) - Quick reference cheat sheet
- [adr/README.md](adr/README.md) - How to create ADRs

## Documentation by Type

### Core Project Docs

| Document | Purpose | Owner |
|----------|---------|-------|
| [README.md](README.md) | Project overview and navigation | Project Lead |
| [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) | This file - complete doc index | Project Lead |

### Architecture Decision Records

| ADR | Title | Status |
|-----|-------|--------|
| [0001](adr/0001-documentation-structure.md) | Documentation Structure and Management | Accepted |

### Specifications

| Document | Purpose |
|----------|---------|
| [mvp_prd.md](Docs/specs/mvp_prd.md) | MVP product requirements |
| [cursor_rules_mvp.md](Docs/specs/cursor_rules_mvp.md) | AI assistant coding guidelines |

### Database Documentation

| Document | Purpose |
|----------|---------|
| [schema.sql](Docs/database/schema.sql) | Current database schema |
| [PRODUCTION_SETUP.sql](Docs/database/PRODUCTION_SETUP.sql) | Production setup scripts |

### Reference & Guides

| Document | Purpose |
|----------|---------|
| [DOCUMENTATION_GOVERNANCE.md](Docs/reference/DOCUMENTATION_GOVERNANCE.md) | How we manage documentation |
| [DOCUMENTATION_QUICK_REFERENCE.md](Docs/reference/DOCUMENTATION_QUICK_REFERENCE.md) | Common tasks cheat sheet |
| [MODULE_README_TEMPLATE.md](Docs/reference/MODULE_README_TEMPLATE.md) | Template for module docs |
| [EXAMPLE_MODULE_README.md](Docs/reference/EXAMPLE_MODULE_README.md) | Example module documentation |

## Directory Structure

```
compass/
├── README.md                                    # Project overview ⭐ START HERE
├── DOCUMENTATION_INDEX.md                       # This file
│
├── adr/                                         # Architecture Decision Records
│   ├── README.md                               # ADR process and index
│   ├── template.md                             # Template for new ADRs
│   └── 0001-documentation-structure.md         # Example ADR
│
├── Docs/                                        # Project documentation
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
│   ├── reference/                              # Conceptual guides
│   │   ├── DOCUMENTATION_GOVERNANCE.md        # Doc management guide
│   │   ├── DOCUMENTATION_QUICK_REFERENCE.md   # Cheat sheet
│   │   ├── MODULE_README_TEMPLATE.md          # Module doc template
│   │   └── EXAMPLE_MODULE_README.md           # Example module docs
│   │
│   ├── setup/                                  # Setup & deployment guides
│   └── archive/                                # Obsolete documentation
│
├── components/                                  # React components
│   └── README.md                               # (To be created)
│
├── lib/                                         # Utilities and helpers
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
| New architectural decision | [adr/template.md](adr/template.md) | `/adr/NNNN-title.md` |
| New module documentation | [MODULE_README_TEMPLATE.md](Docs/reference/MODULE_README_TEMPLATE.md) | `module-dir/README.md` |
| New setup guide | (No template) | `/Docs/setup/` |
| New migration | (Document in SQL file) | `/Docs/migrations/active/` |

### Finding Documentation

| What You Need | Where to Look |
|---------------|---------------|
| Getting started | [README.md](README.md) |
| Why we made a decision | [adr/](adr/) directory |
| Database schema | [Docs/database/schema.sql](Docs/database/schema.sql) |
| How to use a module | Module's README.md |
| How to deploy | [Docs/setup/](Docs/setup/) |
| Governance rules | [DOCUMENTATION_GOVERNANCE.md](Docs/reference/DOCUMENTATION_GOVERNANCE.md) |
| Quick cheat sheet | [DOCUMENTATION_QUICK_REFERENCE.md](Docs/reference/DOCUMENTATION_QUICK_REFERENCE.md) |

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

1. **README.md** - Start here, provides overview and navigation
2. **Module READMEs** - Details for specific parts of the codebase
3. **ADRs** - Context for why things are the way they are
4. **Reference docs** - Deep dives and conceptual guides

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

1. Check [Documentation Quick Reference](Docs/reference/DOCUMENTATION_QUICK_REFERENCE.md)
2. Read [Documentation Governance](Docs/reference/DOCUMENTATION_GOVERNANCE.md)
3. Look at [Example Module README](Docs/reference/EXAMPLE_MODULE_README.md)
4. Review existing ADRs for examples

### Still stuck?

- Create a GitHub discussion
- Ask in team chat
- Create an issue with the `documentation` label

## Contributing to Documentation

See [Documentation Governance Guide](Docs/reference/DOCUMENTATION_GOVERNANCE.md) for:
- When to create documentation
- How to structure documentation
- Review process
- Style guidelines

## Version History

| Date | Change |
|------|--------|
| 2025-12-02 | Initial documentation structure established |

---

**Last Updated:** 2025-12-02

**Maintained by:** Project Team

**Questions?** See [Documentation Governance](Docs/reference/DOCUMENTATION_GOVERNANCE.md) or create a GitHub discussion.

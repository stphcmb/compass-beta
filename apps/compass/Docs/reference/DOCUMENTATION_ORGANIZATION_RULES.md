# Documentation Organization Rules

**Purpose**: Enforce best practices for documentation structure in the Compass project

**Last Updated**: 2025-12-03

---

## Core Principles

### 1. No Loose Files in Docs Root

**Rule**: The `Docs/` root directory should ONLY contain `README.md` and subdirectories.

**Why**:
- Prevents documentation sprawl
- Makes navigation predictable
- Easier for AI agents to locate canonical sources
- Scales better as project grows

**What Belongs at Root**:
- ✅ `Docs/README.md` - Master documentation index (ONLY file allowed)

**What Does NOT Belong at Root**:
- ❌ Any other `.md` files
- ❌ SQL files
- ❌ Data files
- ❌ Configuration files

### 2. Every Document Must Be Categorized

**Rule**: Every documentation file must live in an appropriate subdirectory.

**Standard Categories**:

```
Docs/
├── README.md                    # ONLY file at root - master index
│
├── adr/                         # Architecture Decision Records
│   └── NNNN-decision-name.md
│
├── specs/                       # Product & technical specifications
│   └── feature-specs.md
│
├── reference/                   # Reference guides & governance
│   ├── CURSOR_PROJECT_GUIDE.md
│   ├── DESIGN_SYSTEM_COMPLETE.md
│   ├── DOCUMENTATION_AUDIT_COMPLETE.md
│   └── taxonomy_documentation.md
│
├── database/                    # Database schemas & setup
│   └── schema.sql
│
├── migrations/                  # Database migrations
│   ├── active/
│   └── archive/
│
├── data/                        # Data operations
│   ├── seed/
│   ├── enrichment/
│   └── completed/
│
├── setup/                       # Setup & deployment guides
│   └── SUPABASE_INTEGRATION.md
│
└── archive/                     # Obsolete/deprecated docs
    └── old-files.md
```

### 3. Placement Decision Tree

When creating or organizing a document, ask:

**Is this an architectural decision?**
→ Yes: `adr/NNNN-decision.md`

**Is this a product/feature specification?**
→ Yes: `specs/feature-name.md`

**Is this about database structure?**
→ Yes: `database/` (schema) or `migrations/` (changes)

**Is this about data operations?**
→ Yes: `data/seed/`, `data/enrichment/`, or `data/completed/`

**Is this a reference guide or governance doc?**
→ Yes: `reference/`

**Is this about setup/deployment?**
→ Yes: `setup/`

**Is this obsolete/deprecated?**
→ Yes: `archive/`

**None of the above?**
→ Consider if it's needed, or ask for guidance

---

## Specific Document Placements

### Project Governance & Guides

**Location**: `reference/`

Examples:
- `CURSOR_PROJECT_GUIDE.md` - AI agent instructions
- `DOCUMENTATION_GOVERNANCE.md` - Doc management rules
- `DOCUMENTATION_ORGANIZATION_RULES.md` - This file
- `MODULE_README_TEMPLATE.md` - Templates

### Completion Records

**Location**: Depends on type

- **Data operations** (quotes, enrichment, migrations): `data/completed/`
  - Example: `QUOTE_ENRICHMENT_COMPLETE.md`

- **Project/governance operations** (design system, audits): `reference/`
  - Example: `DESIGN_SYSTEM_COMPLETE.md`
  - Example: `DOCUMENTATION_AUDIT_COMPLETE.md`

### Integration Guides

**Location**: `setup/`

Examples:
- `SUPABASE_INTEGRATION.md`
- `N8N_INTEGRATION.md`
- `VERCEL_DEPLOYMENT.md`

---

## Rules for AI Agents (Cursor, Claude Code)

### When Creating New Documentation

**ALWAYS**:
1. Choose the appropriate subdirectory from the standard categories
2. Never place files directly in `Docs/` root (except README.md)
3. Update `Docs/README.md` to reference the new document
4. Use clear, descriptive filenames in SCREAMING_SNAKE_CASE or kebab-case

**NEVER**:
1. Create files in `Docs/` root
2. Create new top-level directories without discussing structure first
3. Mix document types in the same directory
4. Leave orphaned files that aren't referenced in any index

### When Unsure of Placement

If you're uncertain where a document belongs:

1. **Ask explicitly**:
   ```
   ⚠️ I'm not sure where to place this document:
   - [Document name]: [Brief description]

   Should this go in:
   A) reference/ (reference guide)
   B) specs/ (product spec)
   C) setup/ (setup guide)
   D) Other: [suggest alternative]
   ```

2. **Default to `reference/`** if it's general documentation

3. **Update this file** if a new category is needed

---

## Enforcement Checklist

### Before Committing Documentation

- [ ] No loose `.md` files in `Docs/` root (except README.md)
- [ ] Document is in appropriate subdirectory
- [ ] Document is referenced in `Docs/README.md` if it's a major document
- [ ] Filename follows naming conventions
- [ ] Document has clear header with purpose/last updated

### During PR Review

Reviewer should verify:
- [ ] All new docs are properly categorized
- [ ] No files added to `Docs/` root
- [ ] `Docs/README.md` updated if needed
- [ ] Links from other docs are correct

### Quarterly Audit

- [ ] Verify no loose files in `Docs/` root
- [ ] Check for documents in wrong categories
- [ ] Update this file if patterns have emerged
- [ ] Archive obsolete documents

---

## Examples

### ✅ CORRECT

```
# Creating a new integration guide
Docs/setup/STRIPE_INTEGRATION.md

# Creating a completion record for data work
Docs/data/completed/TIER2_AUTHORS_COMPLETE.md

# Creating a completion record for project work
Docs/reference/MODULE_SYSTEM_COMPLETE.md

# Creating an ADR
Docs/adr/0007-use-stripe-for-payments.md
```

### ❌ INCORRECT

```
# Don't put files in root
Docs/STRIPE_INTEGRATION.md

# Don't mix categories
Docs/adr/TIER2_AUTHORS_COMPLETE.md

# Don't create random directories
Docs/random-folder/doc.md
```

---

## Migration Strategy

If you find existing files violating these rules:

1. **Identify the correct location** using the decision tree above
2. **Move the file** to the appropriate subdirectory
3. **Update all references** to the file in other documentation
4. **Update `Docs/README.md`** to reflect the new location
5. **Document the move** in your commit message

Example:
```bash
git mv Docs/LOOSE_FILE.md Docs/reference/LOOSE_FILE.md
# Update references in other files
git commit -m "docs: move LOOSE_FILE.md to reference/ for proper organization"
```

---

## Exceptions

The only exception to these rules is `Docs/README.md`, which must remain at the root as the master entry point.

**No other exceptions are allowed without explicit discussion and documentation.**

---

## Version History

| Date | Change |
|------|--------|
| 2025-12-03 | Initial creation - establish "no loose files in Docs root" rule |

---

**Status**: ✅ Active Policy

**Enforced by**: All contributors, AI agents, PR reviewers

**Questions?** See [Documentation Governance](DOCUMENTATION_GOVERNANCE.md) or ask in team chat.

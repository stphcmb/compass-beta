# Documentation Quick Reference

A cheat sheet for working with Compass documentation.

## Where Does This Go?

| What you're documenting | Where it goes | Example |
|------------------------|---------------|---------|
| Project overview | `/README.md` | Quick start, tech stack |
| Architecture decision | `/adr/NNNN-title.md` | State management choice |
| Database schema | `/Docs/database/schema.sql` | Table definitions |
| Database migration | `/Docs/migrations/active/` → `/archive/` | ALTER TABLE scripts |
| Product requirements | `/Docs/specs/` | MVP PRD |
| Setup instructions | `/Docs/setup/` | Deployment guide |
| Component library | `/components/README.md` | Component API docs |
| Utility functions | `/lib/README.md` | Helper function docs |
| App structure | `/app/README.md` | Routing guide |
| Conceptual guides | `/Docs/reference/` | This file |

## Quick Actions

### Creating an ADR

```bash
# 1. Copy template
cp adr/template.md adr/0002-my-decision.md

# 2. Edit the file:
# - Fill in context, options, decision
# - Set status to "Proposed"
# - Add date and deciders

# 3. Get feedback, then set status to "Accepted"
```

### Creating a Module README

```bash
# 1. Copy template
cp Docs/reference/MODULE_README_TEMPLATE.md components/README.md

# 2. Remove irrelevant sections
# 3. Fill in module-specific information
# 4. Remove template instructions
```

### Moving a Doc to Archive

```bash
# Create archive directory if needed
mkdir -p Docs/archive

# Move old doc
git mv Docs/old-doc.md Docs/archive/old-doc.md

# Add note in commit message about why archived
git commit -m "Archive old-doc.md - superseded by new-doc.md"
```

## Common Patterns

### Linking to Other Docs

```markdown
# Absolute path from repo root (preferred for cross-directory links)
[Schema](Docs/database/schema.sql)

# Relative path (good for nearby files)
[Other ADR](../adr/0001-doc-structure.md)

# Specific line in code
See `components/SearchBar.tsx:42` for implementation
```

### Referencing ADRs

```markdown
# In code comments
// Using Redis for caching (see ADR-0003)

# In other documentation
For rationale, see [ADR-0003: Caching Strategy](../../adr/0003-caching.md)

# In commit messages
Implement Redis caching per ADR-0003
```

### Documenting Breaking Changes

```markdown
# In ADR
## Migration Notes

Breaking change: The `search()` function now returns a Promise.

**Before:**
\`\`\`typescript
const results = search(query)
\`\`\`

**After:**
\`\`\`typescript
const results = await search(query)
\`\`\`

# In module README
## Migration Guide

### Migrating from v1 to v2

1. Update all `search()` calls to use `await`
2. ...
```

## Decision Trees

### "Do I need an ADR?"

```
Does this change affect architecture?
├─ Yes → Does it impact multiple modules?
│  ├─ Yes → CREATE ADR
│  └─ No → Document in module README
└─ No → Just update relevant docs
```

### "Is my doc up to date?"

```
Does the doc describe current code?
├─ Yes → Keep it
└─ No → Is it still useful historically?
   ├─ Yes → Archive it
   └─ No → Delete it (rare)
```

## PR Documentation Checklist

When submitting a PR:

- [ ] Code changes include corresponding doc updates
- [ ] New features have module README entries
- [ ] Architectural changes have ADRs
- [ ] Breaking changes are documented
- [ ] Examples are tested and work
- [ ] Links are valid
- [ ] Database changes include migration docs

## Monthly Documentation Tasks

### As a Developer

- [ ] Update your module's README if its API changed
- [ ] Create ADR if you made an architectural decision
- [ ] Fix any broken links you encounter

### As a Team (Monthly Review)

- [ ] Check that new features are documented
- [ ] Review recent ADRs for clarity
- [ ] Archive obsolete docs

### As a Team (Quarterly Audit)

- [ ] Full documentation review
- [ ] Link health check
- [ ] Update root README if needed
- [ ] Review and update governance guide

## Useful Commands

### Find Broken Links

```bash
# Find all markdown files
find . -name "*.md" -not -path "*/node_modules/*"

# Check for common broken link patterns
grep -r "](/" --include="*.md" .
```

### List All ADRs

```bash
ls -1 adr/*.md | grep -E "^adr/[0-9]"
```

### Find Docs Not Updated Recently

```bash
# Docs not updated in 90 days
find Docs -name "*.md" -mtime +90
```

### Generate ADR Index

```bash
# List all ADRs with titles
grep "^# ADR-" adr/*.md
```

## Common Mistakes to Avoid

### ❌ Don't: Duplicate Information

```markdown
# Bad: Copying schema to multiple locations
# In README.md
Tables: authors, camps, sources...

# In setup guide
Tables: authors, camps, sources...

# In migration doc
Tables: authors, camps, sources...
```

### ✅ Do: Link to Single Source

```markdown
# Good: Reference canonical location
# In README.md
See [schema.sql](Docs/database/schema.sql) for table definitions

# In setup guide
Database schema is defined in [schema.sql](../database/schema.sql)
```

### ❌ Don't: Modify Accepted ADRs

```markdown
# Bad: Changing the decision in ADR-0001
Decision: Use Redux (changed from Context API)
```

### ✅ Do: Create New ADR to Supersede

```markdown
# Good: ADR-0005
**Status:** Accepted (Supersedes ADR-0001)

We're migrating from Context API to Redux because...

# Good: ADR-0001
**Status:** Superseded by ADR-0005
```

### ❌ Don't: Leave Stale Docs in Main Locations

```markdown
# Bad: Keeping old setup guide alongside new one
Docs/
├── setup-old.md
└── setup-new.md
```

### ✅ Do: Archive Old Docs

```markdown
# Good: Clear canonical location
Docs/
├── setup/
│   └── deployment.md
└── archive/
    └── old-setup.md
```

## Template Snippets

### ADR Header

```markdown
# ADR-NNNN: [Title]

**Status:** Proposed

**Date:** 2025-12-02

**Deciders:** [Names]

**Technical Story:** [Optional: Link to issue]
```

### Module README Header

```markdown
# [Module Name]

[One-sentence description]

## Purpose

[What this module does and why it exists]

## Key Exports

### ComponentName

**Location:** `path/to/file.tsx`

**Purpose:** [Brief description]
```

### Migration Note

```markdown
## Migration from [Old Approach]

### Breaking Changes

- [Change 1]: How to update
- [Change 2]: How to update

### Step-by-Step

1. Update imports: `old/path` → `new/path`
2. Update API calls: `oldMethod()` → `newMethod()`
3. Test thoroughly
```

## Getting Help

| Question | Where to Look |
|----------|---------------|
| "Where should this doc go?" | [Documentation Governance](DOCUMENTATION_GOVERNANCE.md#common-scenarios) |
| "How do I write an ADR?" | [ADR README](../../adr/README.md) |
| "What's the module README format?" | [Module Template](MODULE_README_TEMPLATE.md) |
| "What are the doc principles?" | [ADR-0001](../../adr/0001-documentation-structure.md) |

## Key Files to Bookmark

1. `/README.md` - Start here
2. `/adr/README.md` - ADR process
3. `/adr/template.md` - Copy this for new ADRs
4. `/Docs/reference/DOCUMENTATION_GOVERNANCE.md` - Full governance guide
5. `/Docs/reference/MODULE_README_TEMPLATE.md` - Copy this for new modules

---

**Last Updated:** 2025-12-02

**Related:**
- [Documentation Governance](DOCUMENTATION_GOVERNANCE.md) - Full guide
- [ADR-0001: Documentation Structure](../../adr/0001-documentation-structure.md) - Rationale

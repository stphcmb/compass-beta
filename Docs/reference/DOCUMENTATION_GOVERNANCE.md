# Documentation Governance Guide

This guide establishes the principles and processes for managing documentation in the Compass project.

## Core Principles

### 1. Single Source of Truth

Each concept, feature, or architectural decision should have exactly one canonical documentation location.

**Examples:**
- Database schema: `/Docs/database/schema.sql` (not scattered across multiple files)
- Architecture decisions: `/adr/NNNN-title.md` (one ADR per decision)
- Component usage: Module's `README.md` (not duplicated in project README)

**When you need to reference information:**
- ✅ Link to the canonical source
- ❌ Copy/paste content to multiple locations

### 2. Documentation Lives with Code

Documentation should be versioned alongside the code it describes.

**Why:** This ensures that checking out a specific commit gives you the correct documentation for that version of the code.

**Where to put documentation:**
- In the repository (not in external wikis)
- Close to the code it describes (module READMEs in module directories)
- In version control (so it has history)

### 3. Progressive Disclosure

Structure documentation in layers, from broad to specific:

1. **Root README.md**: Project overview and navigation
2. **Module READMEs**: Specific module/feature documentation
3. **ADRs**: Architectural context and decision rationale
4. **Code comments**: Implementation details (only when code isn't self-documenting)

### 4. Living Documentation

Documentation should evolve with the codebase.

**Process:**
- Update docs in the same PR that changes the code
- Archive outdated docs rather than deleting them
- Review documentation quarterly for accuracy

### 5. Decision Preservation

Never modify historical decisions. Create new ADRs that supersede old ones.

**Why:** Understanding the evolution of architectural decisions is valuable context for future decisions.

## Documentation Types and Ownership

### Root README.md

**Purpose:** Project overview, quick start, navigation hub

**Owner:** Project lead or core team

**Update frequency:** When major features are added or project direction changes

**Review required:** Yes, for major changes

### Architecture Decision Records (`/adr`)

**Purpose:** Document significant architectural decisions

**Owner:** Decision makers (usually senior developers or architects)

**Update frequency:** When architectural decisions are made

**Review required:** Yes, before status changes to "Accepted"

**Lifecycle:**
1. Create new ADR with status "Proposed"
2. Discuss with team
3. Update status to "Accepted" once consensus is reached
4. Never modify the decision itself after acceptance
5. If decision needs changing, create new ADR that supersedes it

### Specifications (`/Docs/specs`)

**Purpose:** Product requirements, technical specifications

**Owner:** Product team, technical leads

**Update frequency:** When requirements change

**Review required:** Yes, for significant changes

### Database Documentation (`/Docs/database`)

**Purpose:** Schema definitions, database setup guides

**Owner:** Backend developers

**Update frequency:** When schema changes

**Review required:** Yes, schema changes should be reviewed

### Migration Documentation (`/Docs/migrations`)

**Purpose:** Database migration scripts and history

**Owner:** Backend developers

**Structure:**
- `/active/`: Migrations to be applied
- `/archive/`: Completed migrations (read-only)

**Process:**
1. Create migration in `/active/`
2. Test locally
3. Apply to production
4. Move to `/archive/` with completion date
5. Never modify archived migrations

### Module READMEs

**Purpose:** Document how to use and maintain specific modules

**Owner:** Developers working in that module

**Update frequency:** When module's public API changes

**Review required:** For significant changes

**Creation trigger:** Create when:
- Module has 5+ files
- Module has a public API used by other parts of the codebase
- Module has complex patterns that need explanation

## Update Workflows

### For Code Changes

When submitting a PR that changes documented behavior:

```
1. Update code
2. Update relevant documentation (module README, etc.)
3. Create/update ADR if architectural pattern changes
4. Submit PR with both code and doc changes
5. Reviewer checks both code and documentation
```

### For Architecture Changes

When making a significant architectural decision:

```
1. Create new ADR using template.md
2. Set status to "Proposed"
3. Fill in all sections (context, options, decision)
4. Share with team for discussion
5. Update ADR based on feedback
6. Once consensus reached, update status to "Accepted"
7. Implement the decision
8. Add implementation notes to ADR if needed
```

### For Documentation Refactoring

When reorganizing documentation:

```
1. Create ADR explaining the reorganization
2. Move files to new locations
3. Update all links pointing to moved files
4. Add redirects or notes in old locations if needed
5. Update root README.md navigation if needed
```

## Review Process

### Documentation PR Checklist

Before merging a PR, verify:

- [ ] Code changes are accompanied by documentation updates
- [ ] Links to other docs are still valid
- [ ] Examples are accurate and tested
- [ ] ADRs are created for architectural changes
- [ ] Module README updated if public API changed
- [ ] Migration docs updated if schema changed

### Quarterly Documentation Audit

Every quarter, review documentation for:

1. **Accuracy**: Does documentation match current code?
2. **Completeness**: Are new features documented?
3. **Obsolescence**: Can any docs be archived?
4. **Clarity**: Can any docs be improved?
5. **Links**: Are all links still valid?

**Process:**
1. Create GitHub issue: "Q[N] YYYY Documentation Audit"
2. Assign sections to team members
3. Create PRs to fix issues found
4. Close issue when complete

## Documentation Standards

### Writing Style

- **Be concise**: Prefer short sentences and paragraphs
- **Be specific**: Include examples and code snippets
- **Be accurate**: Keep docs in sync with code
- **Be helpful**: Write for someone unfamiliar with the code

### Formatting

- Use Markdown for all documentation
- Use code blocks with language tags: \`\`\`typescript
- Use relative links for internal docs: `[Link](../other/doc.md)`
- Use headings hierarchically (don't skip levels)

### Code Examples

- Include complete, working examples
- Test examples to ensure they work
- Show both good and bad patterns where helpful
- Include comments explaining non-obvious parts

### File Naming

- Use kebab-case: `my-document.md`
- Be descriptive: `authentication-setup.md` not `auth.md`
- Use consistent prefixes in directories: `ADR-NNNN-title.md`

## Common Scenarios

### "I'm adding a new feature. What docs do I update?"

1. **Always**: Update module README if the module's public API changes
2. **If architectural**: Create an ADR
3. **If user-facing**: Update root README if it's a major feature
4. **If database-related**: Update schema docs and create migration

### "I found outdated documentation. What do I do?"

1. **Minor fix**: Just update it in a PR
2. **Major overhaul needed**: Create an issue to track it
3. **Obsolete entirely**: Move to appropriate archive directory

### "Should I create an ADR for this?"

Ask yourself:
- Does this decision affect multiple parts of the codebase?
- Will future developers wonder "why did they do it this way?"
- Are there multiple valid options with trade-offs?
- Does this change an existing architectural pattern?

If yes to any of these, create an ADR.

### "Where should this documentation go?"

Use this decision tree:

```
Is it a project overview or navigation?
  → Root README.md

Is it an architectural decision?
  → /adr/NNNN-title.md

Is it about database schema or migrations?
  → /Docs/database/ or /Docs/migrations/

Is it about a specific module/feature?
  → Module's README.md

Is it a how-to guide or reference?
  → /Docs/reference/

Is it about setup or deployment?
  → /Docs/setup/

Is it a product requirement?
  → /Docs/specs/
```

## AI Coding Assistant Guidelines

When working with AI coding assistants (Cursor, Claude Code, etc.):

### 1. Point to Canonical Sources

When asking AI to work on something:
- Reference the specific documentation file
- Link to relevant ADRs
- Indicate which schema file is canonical

**Example:**
```
"Update the search feature following the patterns in
/components/README.md and considering ADR-0005-search-strategy.md"
```

### 2. Request Documentation Updates

Always ask AI assistants to update documentation alongside code:

**Example:**
```
"Add this feature AND update the component README to reflect
the new API"
```

### 3. Ask for ADRs When Appropriate

For architectural decisions, ask the AI to draft an ADR:

**Example:**
```
"Propose three options for implementing real-time updates,
then draft an ADR with your recommendation"
```

## Maintenance Schedule

### Continuous (With Every PR)
- Update docs affected by code changes
- Create ADRs for architectural decisions
- Fix broken links

### Monthly
- Review new ADRs for clarity
- Check that recent features are documented

### Quarterly
- Full documentation audit
- Archive obsolete documentation
- Update root README if needed
- Review and update this governance guide

## Metrics

Track these metrics to assess documentation health:

- **Coverage**: % of modules with READMEs
- **Freshness**: Average age of documentation updates
- **ADR rate**: ADRs created per month (should be 1-3)
- **Link health**: % of internal links that work

## Getting Help

If you're unsure about documentation:

1. Check this governance guide
2. Look at existing examples (good ADRs, module READMEs)
3. Ask in team chat or create a GitHub discussion
4. Reference [ADR-0001: Documentation Structure](../../adr/0001-documentation-structure.md)

## Evolution of This Guide

This guide itself should evolve:

- **Small updates**: Update directly via PR
- **Significant changes**: Create an ADR first
- **Review**: Update this guide during quarterly documentation audits

---

**Last Updated:** 2025-12-02

**Owner:** Project Team

**Related:**
- [ADR-0001: Documentation Structure](../../adr/0001-documentation-structure.md)
- [Module README Template](MODULE_README_TEMPLATE.md)
- [ADR Template](../../adr/template.md)

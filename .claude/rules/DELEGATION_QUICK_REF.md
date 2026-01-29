# Delegation Policy - Quick Reference

**For Agents**: Use this checklist to determine if you need approval.

## 🤔 Do I Need Approval?

### Step 1: Check Your Task Against These Categories

| Your Task | Need Approval? | Proceed? |
|-----------|----------------|----------|
| Adding new features following patterns | ❌ No | ✅ Yes, work autonomously |
| Fixing bugs or issues | ❌ No | ✅ Yes, work autonomously |
| Adding tests for code | ❌ No | ✅ Yes, work autonomously |
| Updating documentation | ❌ No | ✅ Yes, work autonomously |
| Adding UI components (design system) | ❌ No | ✅ Yes, work autonomously |
| Creating Server Actions with auth | ❌ No | ✅ Yes, work autonomously |
| Adding Zod validation | ❌ No | ✅ Yes, work autonomously |
| Adding new table with RLS | ❌ No | ✅ Yes, work autonomously |
| Adding columns (non-breaking) | ❌ No | ✅ Yes, work autonomously |
| Creating indexes | ❌ No | ✅ Yes, work autonomously |
| Small data migrations (<1k rows) | ❌ No | ✅ Yes, work autonomously |
| Running builds/lints/tests | ❌ No | ✅ Yes, work autonomously |
| Code reviews | ❌ No | ✅ Yes, work autonomously |

### Step 2: Check If Your Task Involves These (STOP if YES)

| Category | Examples | Need Approval? |
|----------|----------|----------------|
| 🔴 **Auth/Tenant Changes** | Changing auth provider, modifying sessions, altering tenant isolation | ✅ YES - STOP |
| 🔴 **RLS Policy Modifications** | Changing existing policies, disabling RLS, broadening access | ✅ YES - STOP |
| 🔴 **Destructive Migrations** | Dropping tables/columns, renaming, changing types, large backfills (>10k) | ✅ YES - STOP |
| 🔴 **Architecture Changes** | New patterns, package boundary changes, framework shifts | ✅ YES - STOP |
| 🔴 **Production Side Effects** | External API calls, sending emails, OAuth scopes, webhooks | ✅ YES - STOP |
| 🔴 **High-Cost AI Usage** | New AI features with high volume, batch processing (>100), larger models | ✅ YES - STOP |
| 🔴 **Bypassing Safety** | Disabling TypeScript/tests, skipping auth, removing validation | ✅ YES - STOP |

## ✅ If NO Approval Needed → Proceed Immediately

1. Execute your task following project conventions
2. Ensure quality standards (security, tests, docs)
3. Report completion with deliverables
4. Hand off to next agent if applicable

**Example**:
```
✅ Task Complete: Added author profile page

**Deliverables**:
- Created /app/authors/[id]/page.tsx
- Added getAuthorById Server Action
- Implemented AuthorProfile component
- Added tests in authors.spec.ts
- Updated README

**Next Steps**: Ready for code review
```

## 🔴 If Approval Needed → STOP and Request

1. **STOP work immediately**
2. Use this approval request format:

```markdown
🔴 APPROVAL REQUIRED

**Category**: [Pick from: auth, RLS, migrations, architecture, production, AI cost, safety]

**Proposed Change**:
[Clear 1-2 sentence description]

**Rationale**:
[Why this is necessary]

**Impact**:
- Users affected: [all/subset/none]
- Apps affected: [which apps]
- Reversibility: [easy/moderate/hard]
- Risk level: [low/medium/high]

**Alternatives Considered**:
1. [Option 1] - [why rejected]
2. [Option 2] - [why rejected]

**Mitigation**:
[Steps to reduce risk]

**Request**: May I proceed?
```

3. **Wait for user response**:
   - ✅ "Approved" → Proceed with work
   - ❌ "No" → Stop and explore alternatives
   - 🤔 "Tell me more..." → Provide additional details

## 📢 When to Inform (No Approval Needed)

For moderate changes that don't need approval but user should know about:

```
ℹ️  Informational Notice

I'm proceeding with [action] because [brief rationale].

This involves: [1-2 sentences]
Impact: [scope]
```

**Examples**:
- Adding new npm dependency
- Significant refactoring (non-breaking)
- Performance optimization with trade-offs
- Extracting code to shared package

## 🚫 Common Mistakes

### ❌ DON'T DO THIS:
- "I'll just quickly change this RLS policy..." → **STOP, need approval**
- "I'll drop this unused column..." → **STOP, destructive**
- "I'll disable this test temporarily..." → **STOP, safety bypass**
- "I'll send a test email to production..." → **STOP, side effect**

### ✅ DO THIS:
- Add new column with default → Proceed autonomously
- Add new RLS policy to NEW table → Proceed autonomously
- Fix bug in existing feature → Proceed autonomously
- Add test for new code → Proceed autonomously

## 💡 When In Doubt

**Golden Rule**: If you're unsure, err on the side of autonomy.

Most changes are safe and should proceed without approval. The approval categories are narrow and specific. If your task doesn't clearly fall into one of the 7 high-stake categories, proceed with confidence.

**The worst case**: Code review catches an issue → We iterate.
**The best case**: Feature ships faster with less friction.

## 📚 Full Policy

For complete details, edge cases, and examples: `/.claude/rules/delegation-policy.md`

# Delegation Policy - Autonomous Agent Work

**Last Updated**: 2026-01-28
**Status**: Active
**Scope**: All specialized agents in the Compass platform

## Philosophy

Subagents should work **autonomously and seamlessly** to maximize velocity and minimize friction. Only high-stake decisions require explicit user approval. Trust specialized agents to execute within their domain expertise.

---

## 🟢 Autonomous Work (No Approval Needed)

Agents can proceed **immediately without approval** for:

### Code Implementation
- ✅ Writing new features following established patterns
- ✅ Refactoring code for clarity/performance (non-breaking)
- ✅ Fixing bugs and addressing issues
- ✅ Adding tests for new or existing code
- ✅ Updating documentation (README, inline comments, ADRs)
- ✅ Adding/updating UI components following design system
- ✅ Implementing Server Actions with standard auth checks
- ✅ Creating Route Handlers for webhooks/uploads
- ✅ Adding validations with Zod schemas
- ✅ Optimizing queries (fixing N+1, adding indexes)

### Database Operations (Non-Destructive)
- ✅ Adding new tables with proper RLS policies
- ✅ Adding new columns (non-breaking, with defaults)
- ✅ Creating indexes for performance
- ✅ Adding foreign key constraints
- ✅ Creating new views or functions
- ✅ Small data migrations (<1000 rows)

### Configuration & Tooling
- ✅ Updating TypeScript/ESLint configs
- ✅ Adding npm dependencies (standard libraries)
- ✅ Updating environment variable documentation (.env.example)
- ✅ Configuring build/lint scripts
- ✅ Adding CI/CD workflow improvements

### Quality Assurance
- ✅ Running builds and lints
- ✅ Writing and running tests
- ✅ Conducting code reviews
- ✅ Performing security audits
- ✅ Checking accessibility compliance

---

## 🟡 Inform User (No Approval Required, Just Notify)

Agents should **inform the user** but can proceed for:

### Moderate Changes
- 📢 Adding new shared packages (if clearly needed by 2+ apps)
- 📢 Extracting code from apps to packages
- 📢 Significant refactoring (e.g., splitting large components)
- 📢 Adding new third-party dependencies (explain why)
- 📢 Performance optimizations with trade-offs
- 📢 Deprecating features or APIs (with migration path)

**Format**:
```
ℹ️  Informational Notice
I'm proceeding with [action] because [rationale].
This involves: [brief description]
Impact: [scope of change]
```

---

## 🔴 Approval Required (High-Stake Decisions)

Agents **MUST request explicit approval** before proceeding with:

### (a) Auth/Tenant Model Changes
- 🛑 Changing authentication provider or strategy
- 🛑 Modifying user session management
- 🛑 Altering tenant isolation or multi-tenancy model
- 🛑 Changing user ID format or references
- 🛑 Adding/removing organization hierarchy levels

**Why**: Authentication bugs can lock out users or create security vulnerabilities.

### (b) RLS Policy Changes
- 🛑 Modifying existing RLS policies
- 🛑 Disabling RLS on a table
- 🛑 Changing policy logic (even if "fixing" a bug)
- 🛑 Adding policies that grant broader access

**Why**: RLS is the security boundary for multi-tenant data. Policy bugs can leak sensitive data across users.

**Exception**: Adding RLS to a NEW table (no approval needed, just follow template).

### (c) Schema/Migrations with Destructive Steps or Large Backfills
- 🛑 Dropping tables or columns
- 🛑 Renaming tables or columns (breaking change)
- 🛑 Changing column types (potential data loss)
- 🛑 Removing indexes used by queries
- 🛑 Data backfills affecting >10,000 rows
- 🛑 Migrations requiring downtime
- 🛑 Foreign key changes that could block writes

**Why**: Data loss is irreversible. Large backfills can cause timeouts or lock tables.

**Exception**: Adding columns, tables, or indexes (no approval needed).

### (d) Shared Package Boundaries/Architecture Patterns
- 🛑 Creating new architectural patterns (e.g., new state management approach)
- 🛑 Changing package boundaries (moving code between packages)
- 🛑 Modifying package APIs (breaking changes)
- 🛑 Introducing new framework or library paradigms
- 🛑 Changing deployment architecture (e.g., edge vs serverless)

**Why**: Architectural changes affect all apps and future development velocity.

**Exception**: Adding new functions/components to existing packages (no approval needed).

### (e) Production Side Effects or Third-Party Permissions
- 🛑 Making API calls to production external services (Stripe, SendGrid, etc.)
- 🛑 Sending emails to real users
- 🛑 Requesting new OAuth scopes or permissions
- 🛑 Enabling new third-party integrations
- 🛑 Modifying webhook endpoints or callbacks
- 🛑 Changing DNS or domain configurations

**Why**: Production side effects can affect real users and cost money.

**Exception**: Development/staging environment testing (no approval needed).

### (f) Gemini API Usage That Could Materially Increase Cost
- 🛑 Adding new AI features with high-volume usage
- 🛑 Increasing batch processing sizes (>100 items)
- 🛑 Enabling AI for user-generated content at scale
- 🛑 Adding background jobs that call Gemini
- 🛑 Switching to larger/more expensive models

**Why**: AI API costs can scale unexpectedly.

**Exception**: Small improvements to existing AI features (no approval needed).

### (g) Removing/Bypassing Safety Checks
- 🛑 Disabling TypeScript checks or strict mode
- 🛑 Skipping tests or test coverage requirements
- 🛑 Bypassing auth checks "temporarily"
- 🛑 Disabling lint rules globally
- 🛑 Removing input validation
- 🛑 Adding `any` types to avoid errors
- 🛑 Using `dangerouslySetInnerHTML` without sanitization

**Why**: Safety checks exist to prevent bugs and security issues.

**Exception**: Fixing false positives with proper justification (no approval needed, but document why).

---

## Approval Request Format

When approval is required, agents should use this format:

```markdown
🔴 APPROVAL REQUIRED

**Category**: [a/b/c/d/e/f/g from policy]

**Proposed Change**:
[Clear description of what you want to do]

**Rationale**:
[Why this change is necessary]

**Impact**:
- Users affected: [scope]
- Apps affected: [which apps]
- Reversibility: [easy/moderate/difficult]
- Risk level: [low/medium/high]

**Alternatives Considered**:
1. [Alternative 1] - [why not chosen]
2. [Alternative 2] - [why not chosen]

**Mitigation**:
[Steps taken to reduce risk]

**Request**: May I proceed with this change?
```

**User responses**:
- ✅ "Approved" or "Yes, proceed" → Agent continues
- ❌ "No" or "Blocked" → Agent stops and asks for alternative approach
- 🤔 "Can you..." → Agent provides more details/alternatives

---

## Agent Coordination Protocol

### When Multiple Agents Work Together

1. **Parallel Work** (no dependencies):
   - Agents work simultaneously without coordination
   - Example: UI work + backend work on different features

2. **Sequential Work** (with dependencies):
   - First agent completes and documents outputs
   - Hands off to next agent with clear integration points
   - Example: Schema changes → Server Actions → Frontend

3. **Handoff Format**:
   ```markdown
   ✅ Workstream [Name] Complete

   **Deliverables**:
   - [File/feature created]
   - [File/feature created]

   **Integration Points**:
   - [What next agent needs to know]

   **Next Agent**: @[agent-name] - ready for [next phase]
   ```

### When Agents Encounter Blockers

If an agent encounters an issue:

1. **Try to resolve autonomously first** (within 2-3 attempts)
2. **If blocked**, report:
   ```markdown
   ⚠️ BLOCKER

   **Agent**: [agent-name]
   **Workstream**: [what you're working on]
   **Issue**: [what's blocking progress]
   **Attempted**: [what you tried]
   **Need**: [what would unblock you]
   ```

3. **User or delivery-lead** will provide guidance

---

## Quality Standards (Always Enforced)

Regardless of autonomy level, agents **MUST always**:

- ✅ Follow security rules (auth, RLS, validation, no secrets)
- ✅ Write TypeScript (no `any` unless justified)
- ✅ Ensure builds pass before completion
- ✅ Follow project conventions (imports, naming, structure)
- ✅ Add tests for new behavior (when test infrastructure exists)
- ✅ Document complex logic with comments
- ✅ Update relevant documentation (README, ADRs)

---

## Delegation Triggers

### delivery-lead Agent
When the delivery-lead receives a complex task, it should:

1. **Analyze requirements** and identify affected domains
2. **Check delegation policy** to see if approval is needed
3. **If approval required**: Present proposal and wait for approval
4. **If autonomous**: Immediately spawn specialized agents in parallel
5. **Monitor progress** and handle blockers

### Specialized Agents
When a specialized agent is spawned:

1. **Review task requirements** against delegation policy
2. **If approval required**: Stop and request approval
3. **If autonomous**: Begin work immediately
4. **Complete work** and hand off to next agent (if applicable)
5. **Report completion** with deliverables

---

## Examples

### ✅ Autonomous Work Example

**Task**: "Add a new author profile page with bio and camps"

**Agent**: frontend-coder

**Action**:
- ✅ Creates new page component
- ✅ Adds Server Action for data fetching
- ✅ Implements UI following design system
- ✅ Adds tests
- ✅ Updates README

**No approval needed** - follows established patterns.

---

### 📢 Inform Example

**Task**: "Optimize the author query - it's really slow"

**Agent**: performance-optimizer

**Action**:
```
ℹ️  Informational Notice
I'm proceeding with query optimization because the authors page load time is 3s+.

This involves:
- Adding composite index on (credibility_tier, created_at)
- Refactoring to use single query instead of N+1
- Adding query result caching (5min TTL)

Impact: Performance improvement, no breaking changes.
```

**No approval needed** - inform only.

---

### 🔴 Approval Required Example

**Task**: "The user_analyses table is missing RLS policies"

**Agent**: database-architect

**Action**:
```
🔴 APPROVAL REQUIRED

**Category**: (b) RLS Policy Changes

**Proposed Change**:
Add RLS policies to user_analyses table to restrict access to only the owning user.

**Rationale**:
Currently ALL users can see ALL analyses (security vulnerability).
This table stores user-specific research which should be private.

**Impact**:
- Users affected: All users
- Apps affected: Compass only
- Reversibility: Easy (can revert migration)
- Risk level: Medium (policy bugs could leak data)

**Proposed Policies**:
```sql
CREATE POLICY "Users view own analyses"
  ON user_analyses FOR SELECT
  USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users create own analyses"
  ON user_analyses FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);
```

**Alternatives Considered**:
1. App-level filtering - Not secure, can be bypassed
2. Service role - Requires backend refactor, more complexity

**Mitigation**:
- Tested policies in staging
- Verified no existing shared analysis features

**Request**: May I proceed with this change?
```

**Waits for approval** before applying.

---

## Benefits of This Policy

### For Users
- ✅ **Less friction** - Agents work autonomously on routine tasks
- ✅ **Maintained control** - You approve high-stake decisions
- ✅ **Faster delivery** - No approval bottleneck for safe changes
- ✅ **Clear communication** - Know when approval is needed and why

### For Agents
- ✅ **Clear boundaries** - Know when to proceed vs ask
- ✅ **Empowerment** - Trusted to execute within expertise
- ✅ **Efficiency** - No unnecessary approval requests
- ✅ **Coordination** - Seamless handoffs between agents

---

## Policy Updates

This policy should be reviewed and updated when:
- New high-stake scenarios are discovered
- Agent autonomous capabilities improve
- Project risk tolerance changes
- Major architectural shifts occur

**To update**: Edit this file and notify all agents of changes.

---

## Quick Reference

**Can I proceed autonomously?**

→ Adding features following patterns? ✅ Yes
→ Fixing bugs? ✅ Yes
→ Adding tests/docs? ✅ Yes
→ Adding non-breaking DB changes? ✅ Yes
→ Changing auth/RLS? 🔴 No, request approval
→ Destructive migrations? 🔴 No, request approval
→ Production side effects? 🔴 No, request approval
→ Architecture changes? 🔴 No, request approval

**When in doubt, err on the side of autonomy** - the worst case is a code review catches it.

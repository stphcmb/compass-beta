# Compass Platform

> AI-powered content intelligence platform (monorepo with 3 Next.js apps + 6 shared packages)

## Quick Start

**Apps**: `compass/` (:3000), `voice-lab/` (:3001), `studio/` (:3002)
**Packages**: `@compass/{ui,database,auth,ai,utils,config}`
**Stack**: Next.js 15, React 19, Supabase, Clerk, Gemini AI, Vercel

**Key Locations**:
- Frontend: `/apps/{app}/app/**/*.tsx`
- Server Actions: `/apps/{app}/app/**/actions.ts`
- API Routes: `/apps/{app}/app/api/**/route.ts` (webhooks only)
- DB migrations: `/apps/compass/Docs/database/`

## Commands

```bash
# Dev
pnpm dev                    # All apps
pnpm dev:compass            # Specific app
pnpm --filter @compass/app dev

# Build & Lint
pnpm build                  # All
pnpm --filter @compass/app build
pnpm lint

# Database (from apps/compass/)
pnpm seed
psql $DATABASE_URL < Docs/migrations/active/YYYY-MM-DD_migration.sql
```

## 🔒 Security Rules (NON-NEGOTIABLE)

| Rule | Requirement |
|------|-------------|
| **Secrets** | Never commit/log. Use `.env.local` + env vars only |
| **Auth** | All mutations must verify user with `currentUser()` |
| **RLS** | All tables must have Row Level Security enabled |
| **Validation** | All inputs validated with Zod schemas |

```typescript
// ✅ Security pattern for Server Actions
'use server'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'

const schema = z.object({ name: z.string().min(1) })

export async function createItem(input: unknown) {
  const user = await currentUser()
  if (!user) return { error: 'Unauthorized' }

  const data = schema.parse(input)
  // ... proceed
}
```

## Development Rules

- Small PRs (focused, reviewable changes)
- Tests required for behavior changes (Vitest + Playwright, future)
- Update docs when workflows change

## 🤖 Agent Autonomy & Delegation

**Subagents work autonomously** - they execute tasks without approval unless high-stake decisions are involved.

### ✅ Agents Proceed Autonomously For:
- Writing features following established patterns
- Fixing bugs, adding tests, updating documentation
- Adding UI components, Server Actions, Route Handlers
- Non-destructive database changes (new tables/columns with RLS)
- Code reviews, security audits, accessibility checks

### 🔴 Agents MUST Request Approval For:
1. **Auth/tenant model changes** - modifying authentication or multi-tenancy
2. **RLS policy changes** - modifying existing policies (NEW policies are OK)
3. **Destructive migrations** - dropping tables/columns, large backfills (>10k rows)
4. **Architecture changes** - new patterns, package boundaries, framework shifts
5. **Production side effects** - external API calls, emails, third-party permissions
6. **High-cost AI usage** - new features with significant Gemini API usage
7. **Bypassing safety checks** - disabling TypeScript, tests, auth, or validation

**Full policy**: `/.claude/rules/delegation-policy.md`

## 🎯 Agent Routing & Workflows

### Available Agents

**🚀 Orchestration**
- **delivery-lead** - Complex features, multi-domain tasks, project coordination
- **product-manager** - Feature prioritization, requirements analysis, strategic decisions

**💻 Implementation**
- **frontend-coder** - UI components, forms, client interactions, performance optimization
- **backend-api-architect** - Server Actions, API routes, webhooks, backend logic
- **database-architect** - Schema design, migrations, RLS policies, query optimization
- **ai-feature-architect** - AI features, prompt engineering, cost optimization

**🎨 Design & UX**
- **ui-designer** - Visual design, component libraries, design systems
- **ux-designer** - User flows, information architecture, usability evaluation
- **ui-ux-reviewer** - Visual quality review, accessibility audit, CSS quality

**🔍 Quality & Debugging**
- **code-reviewer** - Security audit, code quality, best practices enforcement
- **performance-optimizer** - Code optimization, algorithm efficiency, N+1 fixes
- **debug-specialist** - Error investigation, systematic debugging, root cause analysis
- **qa-automation-tester** - Test creation, UAT validation, regression testing

**📚 Research**
- **web-research-specialist** - Technical research, claim verification, authoritative sources

### Trigger Phrases → Agent Routing

**"Build/Create/Add [feature]"** → `delivery-lead` (analyzes → delegates)

**"Fix bug/error"** → `debug-specialist` → then implementation agent

**"Optimize/slow/performance"** → `performance-optimizer`

**"Review/audit/check quality"** → `code-reviewer`

**"Database/schema/migration/RLS"** → `database-architect`

**"API/endpoint/webhook/server action"** → `backend-api-architect`

**"UI/component/form/page"** → `frontend-coder`

**"Design/visual/UX/user flow"** → `ui-designer` or `ux-designer`

**"Test/QA/verify functionality"** → `qa-automation-tester`

**"AI feature/prompt/Gemini/cost"** → `ai-feature-architect`

**"Research/verify/find sources"** → `web-research-specialist`

**"Prioritize/roadmap/requirements"** → `product-manager`

### Multi-Agent Workflow Patterns

**Pattern 1: New Full-Stack Feature**
```
User: "Add user profile management with bio and avatar"

Flow:
1. delivery-lead → analyzes requirements, checks delegation policy
2. Spawns in sequence:
   - database-architect → schema + RLS (autonomous)
   - backend-api-architect → Server Actions (autonomous)
   - frontend-coder → UI components (autonomous)
3. Spawns for QA:
   - qa-automation-tester → test coverage (autonomous)
   - code-reviewer → final review (autonomous)
```

**Pattern 2: Bug Investigation & Fix**
```
User: "Getting 'relation does not exist' error on authors page"

Flow:
1. debug-specialist → systematic investigation
   - Identifies root cause with evidence
   - Proposes fix
2. Delegates to appropriate agent:
   - database-architect (if schema issue)
   - backend-api-architect (if query issue)
   - frontend-coder (if client issue)
3. qa-automation-tester → regression tests
```

**Pattern 3: Performance Issue**
```
User: "Authors page loading slowly"

Flow:
1. performance-optimizer → identifies bottleneck
   - Finds N+1 query issue
2. Refactors with database-architect consultation
3. code-reviewer → validates changes
4. qa-automation-tester → performance benchmarks
```

**Pattern 4: New AI Feature**
```
User: "Add AI-powered content summarization"

Flow:
1. delivery-lead → high-stake decision (AI cost category)
2. Requests approval with cost estimate
3. After approval, spawns:
   - ai-feature-architect → architecture design
   - backend-api-architect → Server Action integration
   - frontend-coder → UI with loading/error states
4. QA flow as usual
```

**Pattern 5: Design System Component**
```
User: "Create a new date picker component"

Flow:
1. ui-designer → visual design + accessibility spec
2. frontend-coder → implementation
3. ui-ux-reviewer → accessibility audit
4. qa-automation-tester → interaction tests
```

**Pattern 6: Database Schema Change**
```
User: "Add new table for user preferences"

Flow:
1. database-architect → schema design + RLS
   - Creates migration (autonomous if new table)
   - Tests RLS policies
2. backend-api-architect → Server Actions for CRUD
3. frontend-coder → UI for managing preferences
```

**Pattern 7: Production Issue Investigation**
```
User: "500 errors in production for new feature"

Flow:
1. debug-specialist → investigates logs, code, config
2. Identifies issue → routes to fix agent
3. code-reviewer → validates fix doesn't introduce issues
4. qa-automation-tester → regression tests
5. delivery-lead → coordinates deployment
```

## 💬 Available Skills (Quick Commands)

Run skills using `/skill-name` in chat:

- **/debug** - Launch debug investigation workflow
- **/optimize** - Launch performance optimization workflow
- **/review** - Launch code review workflow
- **/design** - Launch design consultation workflow
- **/product-manager** - Launch product strategy discussion
- **/doc-coauthoring** - Structured workflow for co-authoring docs, specs, proposals

Skills provide pre-configured agent workflows for common scenarios.

## Conventions

**Naming**: Components `PascalCase.tsx`, hooks `useCamelCase.ts`, utilities `.ts`
**API**: Server Actions for mutations, Route Handlers only for webhooks/uploads
**Errors**: Return `{ error: string }` from Server Actions, `NextResponse` from routes

**Imports** (order):
```typescript
import { useState } from 'react'              // 1. React
import { useRouter } from 'next/navigation'   // 2. Next.js
import { Loader2 } from 'lucide-react'        // 3. Third-party
import { Button } from '@compass/ui'          // 4. @compass/*
import { Header } from '@/components/Header'  // 5. @/ aliases
import { utils } from './utils'               // 6. Relative
```

**Detailed conventions**: See `/.claude/rules/{frontend,api,database,security}.md`

## Before Saying "Done"

**Build**: `pnpm --filter @compass/app build` + lint pass
**Security**: No secrets committed, auth verified, inputs validated, RLS enabled
**Manual**: Test happy path + edge cases, verify responsive design
**Docs**: Update if workflows changed

## Monorepo Rules

**Work in `/apps/`**: App-specific features, UI, routes
**Work in `/packages/`**: Shared code used by 2+ apps
**Rule**: Start in apps, extract to packages when needed

**Dependencies**:
- ✅ Apps → packages (use `workspace:*`)
- ✅ Packages → packages
- ❌ Apps → apps (forbidden)

**DB Ownership** (only owner modifies schema):
- Compass: `authors`, `camps`, `domains`, `quotes`, `user_analyses`
- Voice Lab: `voice_profiles`, `voice_samples`
- Studio: `projects`, `drafts`, `generated_content`

**Deployment**: Separate Vercel deployment per app, single dashboard
**Env vars**: Shared at project level, app-specific per deployment

## Learn More

**Detailed rules**: `/.claude/rules/{frontend,api,database,security,deployment,delegation-policy}.md`
**App-specific**: `/.claude/apps/{compass,voice-lab,studio}.md`
**Platform docs**: `/docs/architecture/`, `/docs/adr/`, `/docs/deployment/`
**Compass details**: `/apps/compass/Docs/` (database, migrations, specs, ADRs)

---

**Last Updated**: 2026-01-28 | **Version**: 1.0
**Note**: Replaces `/apps/compass/Docs/reference/CURSOR_PROJECT_GUIDE.md` as primary AI guidance

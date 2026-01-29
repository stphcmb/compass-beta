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

**Approval format**: Agents use structured format with rationale, impact, alternatives, and mitigation.

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

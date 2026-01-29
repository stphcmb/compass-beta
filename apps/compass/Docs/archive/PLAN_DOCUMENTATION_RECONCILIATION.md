# Plan: Reconcile CURSOR_PROJECT_GUIDE with Monorepo Architecture

## Identified Conflicts

Based on exploration, here are the key conflicts between the existing CURSOR_PROJECT_GUIDE.md and the current monorepo structure:

### 1. Documentation Location
- **CURSOR_PROJECT_GUIDE assumes**: `/Docs` at root level
- **Current reality**: `/apps/compass/Docs` - documentation lives within Compass app
- **Conflict**: Guide references paths like `Docs/database/` but reality is `apps/compass/Docs/database/`

### 2. Project Scope
- **CURSOR_PROJECT_GUIDE assumes**: Single Next.js application
- **Current reality**: 3 separate Next.js apps (Compass, Voice Lab, Studio) + 6 shared packages
- **Conflict**: No guidance on multi-app development or shared package management

### 3. Build Commands
- **CURSOR_PROJECT_GUIDE uses**: `npm run dev`, `npm run build`
- **Current reality**: `pnpm dev:compass`, `pnpm dev:voice-lab`, `pnpm dev:studio`, `pnpm build`
- **Conflict**: Command examples are outdated

### 4. Scripts Location
- **CURSOR_PROJECT_GUIDE assumes**: Scripts at root or references without path prefix
- **Current reality**: Scripts in `apps/compass/scripts/`
- **Conflict**: Script execution paths incorrect

### 5. Missing Monorepo Concepts
- **CURSOR_PROJECT_GUIDE doesn't cover**:
  - pnpm workspace structure
  - Shared packages (@compass/ui, @compass/database, etc.)
  - Per-app vs shared documentation
  - Cross-app dependencies
  - Vercel deployment configuration for monorepos

### 6. Voice Lab & Studio Documentation
- **Current state**: Neither Voice Lab nor Studio have documentation directories
- **Question**: Should they follow the same documentation structure as Compass?

### 7. ADR 0009 exists!
- **Discovery**: There's already an ADR-0009 (platform-architecture.md) created Jan 27, 2026
- **Need to check**: Does this ADR address the monorepo structure?

## Analysis Phase

### What needs investigation:
1. Read ADR-0009 to see if it already addresses monorepo documentation strategy
2. Determine if documentation should be centralized or per-app
3. Check if there are any workspace-level documentation needs

## Recommended Approaches (To be evaluated)

### Option A: Centralized Documentation (Root Level)
**Structure:**
```
compass/
├── docs/                          # Platform-wide documentation
│   ├── platform/                  # Monorepo architecture, shared packages
│   ├── apps/
│   │   ├── compass/              # Compass-specific docs
│   │   ├── voice-lab/            # Voice Lab docs
│   │   └── studio/               # Studio docs
│   └── shared/                    # Shared package documentation
├── apps/compass/Docs/            # Move content here -> /docs/apps/compass/
└── CLAUDE.md or .cursorrules     # Root-level AI assistant guide
```

**Pros:**
- Single source of truth for all platform documentation
- Easier to find documentation
- Better for platform-wide ADRs and architecture decisions

**Cons:**
- Apps become less self-contained
- Harder to extract apps into separate repos later
- More complex navigation

### Option B: Per-App Documentation (Current Enhanced)
**Structure:**
```
compass/
├── README.md                      # Platform overview (keep current)
├── CLAUDE.md                      # Root-level guide for monorepo
├── apps/
│   ├── compass/
│   │   ├── Docs/                 # Keep comprehensive docs here
│   │   └── CURSOR_PROJECT_GUIDE.md  # Update to reference monorepo
│   ├── voice-lab/
│   │   └── Docs/                 # Create minimal docs
│   └── studio/
│       └── Docs/                 # Create minimal docs
└── packages/
    └── */README.md               # Each package has its own README
```

**Pros:**
- Apps remain self-contained
- Easier to extract apps into separate repos
- Clear ownership boundaries

**Cons:**
- Platform-wide documentation scattered
- Harder to maintain consistency across apps
- ADRs that affect multiple apps need careful placement

### Option C: Hybrid Approach (Recommended)
**Structure:**
```
compass/
├── README.md                      # Platform overview (current)
├── .claude/                       # NEW: AI assistant guidance
│   ├── CLAUDE.md                 # Main guide with platform overview
│   ├── rules/
│   │   ├── frontend.md           # Next.js, React, Tailwind conventions
│   │   ├── api.md                # API patterns (Server Actions, Route Handlers)
│   │   ├── database.md           # Supabase, migrations, RLS policies
│   │   ├── security.md           # Clerk auth, secrets management
│   │   ├── shared-packages.md    # @compass/* package guidelines
│   │   └── deployment.md         # Vercel monorepo deployment
│   └── apps/
│       ├── compass.md            # Compass-specific guidance
│       ├── voice-lab.md          # Voice Lab-specific guidance
│       └── studio.md             # Studio-specific guidance
├── docs/                          # NEW: Platform-level docs only
│   ├── architecture/             # Platform architecture, monorepo decisions
│   ├── adr/                      # Platform-wide ADRs
│   │   └── 0009-platform-architecture.md (move from compass)
│   ├── deployment/               # Vercel, CI/CD for all apps
│   └── shared-packages.md        # Guide to @compass/* packages
├── apps/
│   ├── compass/
│   │   ├── Docs/                 # Keep app-specific docs (database, data, etc.)
│   │   └── README.md             # Links to both root and local docs
│   ├── voice-lab/
│   │   ├── docs/                 # NEW: App-specific features/API
│   │   └── README.md
│   └── studio/
│       ├── docs/                 # NEW: App-specific features/API
│       └── README.md
└── packages/
    └── */README.md               # Each package documents its API
```

**Pros:**
- Clear separation: platform concerns at root, app concerns in apps
- Apps can still be extracted with their docs
- Shared packages are documented where they live
- Platform-wide decisions visible at root

**Cons:**
- Need to determine what's "platform" vs "app" level
- Some duplication possible

## Key Finding: ADR-0009 Analysis

ADR-0009 (Platform Architecture) was created on 2026-01-26 and is **Accepted**. It documents:
- The monorepo architecture decision
- Three separate apps (compass, voice-lab, studio)
- Shared packages structure (@compass/*)
- Database table ownership
- Cross-app communication patterns

**However, ADR-0009 does NOT address:**
- Documentation strategy for the monorepo
- Where ADRs should live (platform vs app-level)
- How to organize documentation across apps
- AI assistant guidance files (claude.md, .cursorrules)

## Recommended Solution: Hybrid Documentation Strategy

After analyzing ADR-0009 and the current structure, I recommend **Option C (Hybrid)** with these specific decisions:

### Documentation Placement Rules

| Type | Location | Rationale |
|------|----------|-----------|
| **Platform Architecture** | `/docs/architecture/` | Affects all apps |
| **Platform-wide ADRs** | `/docs/adr/` | Cross-cutting decisions |
| **Monorepo Guide** | `/CLAUDE.md` or `/.cursorrules` | Root-level AI assistant guide |
| **Shared Package Docs** | `/packages/*/README.md` | Co-located with code |
| **App-specific ADRs** | `/apps/{app}/Docs/adr/` | App-scoped decisions |
| **App Features** | `/apps/{app}/Docs/` | Database, data, specs, etc. |
| **Deployment** | `/docs/deployment/` | Vercel, CI/CD configs |

### Specific Changes Required

#### 1. Create Root-Level CLAUDE.md
**Purpose**: Guide AI assistants on monorepo navigation and conventions

**Content:**
- Monorepo structure overview
- When to work in apps/ vs packages/
- Build and development commands (pnpm workspace commands)
- Documentation navigation guide
- Reference to app-specific guides

#### 2. Move Platform-Wide ADRs to Root
**From**: `/apps/compass/Docs/adr/0009-platform-architecture.md`
**To**: `/docs/adr/0009-platform-architecture.md`

**Rationale**: ADR-0009 affects all apps, not just Compass

#### 3. Update CURSOR_PROJECT_GUIDE.md
**Location**: Keep at `/apps/compass/Docs/reference/CURSOR_PROJECT_GUIDE.md`
**Changes**:
- Add section acknowledging monorepo structure
- Update all path references from `/Docs/` to `/apps/compass/Docs/`
- Update commands from `npm` to `pnpm --filter @compass/app`
- Add link to root-level CLAUDE.md
- Update scripts paths to `/apps/compass/scripts/`

#### 4. Create Minimal Documentation for Voice Lab & Studio
**Structure for each:**
```
apps/{voice-lab,studio}/
├── README.md              # App overview, local dev, features
└── docs/
    ├── api/              # API endpoints (if public)
    └── features/         # Feature documentation
```

#### 5. Create Platform Documentation
**New directory**: `/docs/`
```
docs/
├── README.md                     # Documentation index
├── architecture/
│   └── monorepo-guide.md        # How the monorepo is organized
├── adr/
│   └── 0009-platform-architecture.md (moved from compass)
├── deployment/
│   ├── vercel.md                # Deploying to Vercel
│   └── environment-variables.md # Shared env vars
└── shared-packages.md            # Guide to @compass/* packages
```

### Migration Checklist

#### Phase 1: .claude/ Structure
- [ ] Create `/.claude/` directory
- [ ] Create `/.claude/CLAUDE.md` with platform overview and golden rules
- [ ] Create `/.claude/rules/` subdirectory
- [ ] Create `/.claude/rules/frontend.md`
- [ ] Create `/.claude/rules/api.md`
- [ ] Create `/.claude/rules/database.md`
- [ ] Create `/.claude/rules/security.md`
- [ ] Create `/.claude/rules/shared-packages.md`
- [ ] Create `/.claude/rules/deployment.md`
- [ ] Create `/.claude/apps/` subdirectory
- [ ] Create `/.claude/apps/compass.md`
- [ ] Create `/.claude/apps/voice-lab.md`
- [ ] Create `/.claude/apps/studio.md`

#### Phase 2: /docs/ Structure
- [ ] Create `/docs/` directory structure
- [ ] Create `/docs/README.md` (documentation index)
- [ ] Create `/docs/architecture/monorepo-guide.md`
- [ ] Create `/docs/deployment/vercel.md`
- [ ] Create `/docs/deployment/environment-variables.md`
- [ ] Create `/docs/shared-packages.md`

#### Phase 3: Move Platform-Wide ADRs
- [ ] Create `/docs/adr/` directory
- [ ] Move ADR-0009 from compass to root `/docs/adr/`
- [ ] Update ADR-0009 link in compass ADR index

#### Phase 4: Update Existing Docs
- [ ] Update CURSOR_PROJECT_GUIDE.md with monorepo references
- [ ] Update CURSOR_PROJECT_GUIDE.md to reference `.claude/` docs
- [ ] Update root README.md to reference new documentation structure

#### Phase 5: Create App READMEs
- [ ] Create README.md for Voice Lab
- [ ] Create README.md for Studio

### Key Principles for Documentation Strategy

1. **Platform-level concerns at root**: Architecture, deployment, shared packages
2. **App-level concerns in apps**: Features, database schema, app-specific decisions
3. **Code-adjacent documentation**: Package READMEs live with packages
4. **Single source of truth**: No duplication between root and app docs
5. **Clear navigation**: Each doc should link to related docs across boundaries

## Critical Files to Modify

1. `/CLAUDE.md` (create new)
2. `/docs/README.md` (create new)
3. `/docs/adr/0009-platform-architecture.md` (move from compass)
4. `/apps/compass/Docs/reference/CURSOR_PROJECT_GUIDE.md` (update paths/commands)
5. `/apps/compass/Docs/adr/README.md` (update ADR index)
6. `/apps/voice-lab/README.md` (create new)
7. `/apps/studio/README.md` (create new)
8. `/docs/shared-packages.md` (create new)
9. Root `/README.md` (add documentation section)

## User Decisions (Confirmed)

✅ **Documentation Strategy**: Hybrid approach - Platform docs at /docs/, app docs in apps/
✅ **AI Assistant Guide**: Create .claude/ directory with CLAUDE.md + rules files
✅ **ADR-0009 Location**: Move to /docs/adr/ (affects all apps)
✅ **Platform Architecture**: Platform with modular apps (not mega app, separate apps)
✅ **API Pattern**: Server Actions for internal, Route Handlers for webhooks/external only
✅ **Testing Strategy**: Add to checklist now, implement later (recommend Vitest + Playwright)
✅ **Deployment**: Separate Vercel deployments per app, single dashboard
✅ **Shared Packages**: Rules live in package READMEs

## Implementation Plan

### Phase 1: Create Root Documentation Structure
1. Create `/docs/` directory
2. Create `/docs/README.md` - Documentation index
3. Create `/docs/architecture/monorepo-guide.md` - How the monorepo works
4. Create `/docs/deployment/` directory with Vercel and environment guides
5. Create `/docs/shared-packages.md` - Guide to @compass/* packages

### Phase 2: Create .claude/ Directory Structure
Create comprehensive AI assistant guidance at `/.claude/`:

**`.claude/CLAUDE.md`** (Main platform guide):
- Project overview (Goal, Primary users, Success criteria)
- Architecture map (Frontend, Backend/API, DB, Auth locations)
- Golden commands (Dev, Build, Test, Lint, Typecheck, DB migrate, Seed)
- Engineering rules (Security, PR size, Testing, Documentation)
- Code conventions (Naming, Error handling, API patterns)
- Verification checklist (Build, Tests, Manual smoke tests)
- Monorepo navigation (When to work in apps/ vs packages/)
- Cross-app dependencies (How apps share @compass/* packages)
- Deployment strategy (Separate Vercel deployments per app)
- Environment variables (Shared vs app-specific)
- Database ownership (Which app owns which tables)

**`.claude/rules/frontend.md`**:
- Next.js 15 App Router conventions
- React 19 patterns (use client, use server)
- Component naming (PascalCase, co-locate with styles)
- Hook naming (use* prefix)
- File naming (.tsx for components, .ts for utils)
- Tailwind conventions (utility-first, custom colors)
- Import conventions (@/ for app, @compass/* for packages)

**`.claude/rules/api.md`**:
- **Server Actions** for app-internal operations (create/update/delete, form submits)
- **Route Handlers** (`app/api/**/route.ts`) only for:
  - Webhooks (Clerk, Stripe, etc.)
  - File upload/download
  - Public API endpoints (if needed)
  - Scheduled/cron-triggered endpoints
  - External callbacks
- Error handling patterns (throw vs return Response)
- Input validation (Zod schemas)
- Response formats (JSON, streaming)

**`.claude/rules/database.md`**:
- Supabase setup and client usage
- Migration workflow (create, test, apply, verify)
- RLS policy patterns
- Query patterns (prefer server-side queries)
- Schema ownership per app
- Avoiding N+1 queries

**`.claude/rules/security.md`**:
- Clerk authentication setup
- Never commit secrets (.env.local in .gitignore)
- Never log sensitive data (tokens, passwords, PII)
- RLS policies required for all tables
- Server-side validation for all mutations
- CORS configuration for public APIs

**`.claude/rules/shared-packages.md`**:
- How to create new @compass/* packages
- Versioning strategy (workspace:*)
- Package boundaries (what goes in each package)
- Circular dependency prevention
- Build order and dependencies

**`.claude/rules/deployment.md`**:
- Vercel monorepo configuration (separate deployments per app)
- Build commands per app
- Environment variables setup (production, preview, development)
- Deployment workflow (preview on PR, production on merge)
- Database migrations in production

**`.claude/apps/compass.md`**:
- Compass-specific features (Research Assistant, Explore, Authors, etc.)
- Database schema ownership (authors, camps, domains, quotes)
- Compass-specific routes and layouts
- Link to `/apps/compass/Docs/` for detailed docs

**`.claude/apps/voice-lab.md`**:
- Voice Lab-specific features
- Voice profiling workflow
- Link to Voice Lab docs

**`.claude/apps/studio.md`**:
- Studio-specific features
- Content generation workflow
- Link to Studio docs

### Phase 3: Move Platform-Wide ADR
1. Create `/docs/adr/` directory
2. Move `/apps/compass/Docs/adr/0009-platform-architecture.md` to `/docs/adr/0009-platform-architecture.md`
3. Update `/apps/compass/Docs/adr/README.md` to:
   - Note that platform-wide ADRs live at `/docs/adr/`
   - Link to ADR-0009 in new location
   - Keep app-specific ADRs in compass/Docs/adr/

### Phase 4: Update CURSOR_PROJECT_GUIDE.md
Update `/apps/compass/Docs/reference/CURSOR_PROJECT_GUIDE.md`:
- Add monorepo context section at top
- Change all `/Docs/` references to `/apps/compass/Docs/`
- Update commands: `npm run dev` → `pnpm --filter @compass/app dev`
- Update script paths to include `apps/compass/` prefix
- Add link to root `/CLAUDE.md` for monorepo guidance
- Note that platform-wide docs live at root `/docs/`

### Phase 5: Create App READMEs
**Voice Lab (`/apps/voice-lab/README.md`)**:
- Overview of Voice Lab features
- Local development instructions
- API documentation (if public endpoints)
- Link to platform docs at root

**Studio (`/apps/studio/README.md`)**:
- Overview of Studio features
- Local development instructions
- Brief and content generation guide
- Link to platform docs at root

### Phase 6: Update Root README
Update `/README.md`:
- Add "Documentation" section
- Link to `/docs/` for platform documentation
- Link to app-specific READMEs
- Link to `/CLAUDE.md` for AI assistant guidance

## Files to Create

### .claude/ Structure
1. `/.claude/CLAUDE.md` - Main AI assistant guide with platform overview
2. `/.claude/rules/frontend.md` - Next.js, React, Tailwind conventions
3. `/.claude/rules/api.md` - Server Actions, Route Handlers, error handling
4. `/.claude/rules/database.md` - Supabase, migrations, RLS
5. `/.claude/rules/security.md` - Clerk auth, secrets, security policies
6. `/.claude/rules/shared-packages.md` - @compass/* package guidelines
7. `/.claude/rules/deployment.md` - Vercel monorepo deployment
8. `/.claude/apps/compass.md` - Compass-specific guidance
9. `/.claude/apps/voice-lab.md` - Voice Lab-specific guidance
10. `/.claude/apps/studio.md` - Studio-specific guidance

### /docs/ Structure
11. `/docs/README.md` - Documentation index
12. `/docs/architecture/monorepo-guide.md` - Monorepo structure guide
13. `/docs/deployment/vercel.md` - Vercel deployment guide
14. `/docs/deployment/environment-variables.md` - Shared env vars
15. `/docs/shared-packages.md` - @compass/* packages guide

### App READMEs
16. `/apps/voice-lab/README.md` - Voice Lab documentation
17. `/apps/studio/README.md` - Studio documentation

## Files to Modify

1. `/apps/compass/Docs/reference/CURSOR_PROJECT_GUIDE.md` - Update paths and commands
2. `/apps/compass/Docs/adr/README.md` - Update ADR index
3. `/README.md` - Add documentation section

## Files to Move

1. Move `/apps/compass/Docs/adr/0009-platform-architecture.md` → `/docs/adr/0009-platform-architecture.md`

## Detailed Content Specifications

### .claude/CLAUDE.md Template

```markdown
# Compass Platform

## Project Overview

### Goal
- **Build**: AI-powered content intelligence platform helping writers discover diverse perspectives
- **Primary users**: Content creators, researchers, journalists, thought leaders
- **Success**: Users can analyze their writing, discover missing perspectives, and create more balanced content

### Architecture Map (2 minutes to grok)

**Monorepo Structure**:
- **Apps** (`/apps/*`): 3 independent Next.js applications
  - `compass/` - Main perspective analysis tool (port 3000)
  - `voice-lab/` - Voice profiling and analysis (port 3001)
  - `studio/` - AI content generation assistant (port 3002)
- **Packages** (`/packages/*`): 6 shared packages
  - `@compass/ui` - Shared React components
  - `@compass/database` - Supabase client and types
  - `@compass/auth` - Clerk authentication utilities
  - `@compass/ai` - AI/LLM utilities (Google Gemini)
  - `@compass/utils` - Common utilities
  - `@compass/config` - Shared configs (TypeScript, ESLint, Tailwind)

**Key Locations**:
- Frontend: `/apps/{app}/app/**/*.tsx` (Next.js App Router)
- Server Actions: `/apps/{app}/app/**/**/actions.ts` or inline in page/layout files
- Route Handlers: `/apps/{app}/app/api/***/route.ts` (webhooks, file ops only)
- Components: `/apps/{app}/components/**/*.tsx` or `/packages/ui/src/**/*.tsx`
- DB: `/apps/compass/Docs/database/` (migrations live here)
- Auth: Clerk configuration in `/apps/{app}/middleware.ts` and route protection
- Background jobs: n8n workflows (external, not in repo)

### Golden Commands (Claude must use these)

**Development**:
```bash
# Run all apps in parallel
pnpm dev

# Run specific app only
pnpm dev:compass    # Compass on :3000
pnpm dev:voice-lab  # Voice Lab on :3001
pnpm dev:studio     # Studio on :3002

# Run app with filter
pnpm --filter @compass/app dev
```

**Build & Lint**:
```bash
# Build all apps and packages
pnpm build

# Build specific app
pnpm --filter @compass/app build

# Lint all
pnpm lint

# Lint specific app
pnpm --filter @compass/app lint
```

**Testing** (to be implemented):
```bash
# Run all tests (future)
pnpm test

# Run tests for specific app (future)
pnpm --filter @compass/app test

# Type checking
pnpm --filter @compass/app typecheck  # or tsc --noEmit
```

**Database** (Compass app):
```bash
# Run migrations (from compass app directory)
cd apps/compass
psql $DATABASE_URL < Docs/migrations/active/YYYY-MM-DD_migration.sql

# Seed database
pnpm seed

# Verify migration
pnpm db:verify
```

### Engineering Rules (non-negotiable)

#### 🔒 Security Rules (CRITICAL - NEVER COMPROMISE)

1. **No secrets/keys committed or logged** ⚠️
   - All secrets in `.env.local` (gitignored)
   - Never log tokens, passwords, API keys, or PII
   - Never commit `.env.local` or any file containing secrets
   - Use environment variables for all sensitive data
   - **Violation = immediate security incident**

2. **Authentication required for all mutations** ⚠️
   - Every Server Action must verify user authentication
   - Every Route Handler (except webhooks) must verify auth
   - Use Clerk's `currentUser()` or `auth()` helpers
   - **No unauthenticated writes to database**

3. **Row Level Security (RLS) on all tables** ⚠️
   - All Supabase tables must have RLS enabled
   - Users can only access their own data (unless intentionally public)
   - Test RLS policies before deploying
   - **No table without RLS policies**

4. **Input validation on all user input** ⚠️
   - Use Zod schemas for all Server Actions
   - Validate all Route Handler inputs
   - Sanitize any user input displayed in UI
   - **Never trust client-side input**

#### Development Rules

5. **Prefer small PR-sized changes; avoid rewrites**
   - Keep changes focused and reviewable
   - Break large features into incremental PRs
   - Don't refactor unnecessarily

6. **Always add/adjust tests when changing behavior** (future)
   - Unit tests for business logic
   - Integration tests for API routes
   - E2E tests for critical user flows
   - Currently no tests - will implement later

7. **Update docs when changing workflows**
   - Update `.claude/` rules if conventions change
   - Update app-specific docs in `/apps/{app}/Docs/`
   - Create ADRs for architectural decisions

### Code Conventions

**Naming**:
- Components: `PascalCase` (e.g., `ResearchAssistant.tsx`)
- Hooks: `use` prefix + `camelCase` (e.g., `useAnalyzeText.ts`)
- Files: `.tsx` for components (JSX), `.ts` for utilities
- Server Actions: `actions.ts` or inline in server components
- Route Handlers: `route.ts` in `/app/api/` directory

**Error Handling**:
- Server Actions: Throw errors or return `{ error: string }` object
- Route Handlers: Return `Response` with appropriate status codes
- Client Components: Use try/catch, display user-friendly messages
- Log errors to console (will add error tracking later)

**API Patterns**:
- **Use Server Actions for**: Create/update/delete operations, form submissions, app-internal mutations
- **Use Route Handlers ONLY for**: Webhooks, file upload/download, public APIs, external callbacks
- Input validation: Use Zod schemas
- Response format: Return typed objects from Server Actions, JSON from Route Handlers

**Import Conventions**:
```typescript
// App-internal imports (same app)
import { Button } from '@/components/ui/button'
import { analyzeText } from '@/lib/actions'

// Shared package imports
import { supabase } from '@compass/database'
import { getCurrentUser } from '@compass/auth'

// Relative imports (same directory or nearby)
import { formatDate } from './utils'
```

### Verification Checklist (before saying "done")

- [ ] **Build passes**: `pnpm --filter @compass/app build` (or relevant app)
- [ ] **No TypeScript errors**: Check in editor or run `tsc --noEmit`
- [ ] **Tests pass** (future): `pnpm --filter @compass/app test`
- [ ] **Lint passes**: `pnpm --filter @compass/app lint`
- [ ] **Manual smoke test**:
  1. Start dev server: `pnpm dev:{app}`
  2. Navigate to changed pages/features
  3. Test happy path and edge cases
  4. Verify data persistence (if DB changes)
  5. Check responsive design (mobile/desktop)

### Monorepo Navigation

**When to work in `/apps/`**:
- Adding features to specific apps (Compass, Voice Lab, Studio)
- App-specific UI components
- App-specific API routes
- App-specific configurations

**When to work in `/packages/`**:
- Shared UI components used across multiple apps
- Shared database utilities
- Shared authentication logic
- Shared utilities and helpers

**Decision rule**: If >1 app needs it, consider moving to `/packages/`. Start in `/apps/` first.

### Cross-App Dependencies

**How apps use shared packages**:
```json
// apps/compass/package.json
{
  "dependencies": {
    "@compass/database": "workspace:*",
    "@compass/auth": "workspace:*",
    "@compass/ui": "workspace:*"
  }
}
```

**Important**:
- Apps can depend on packages
- Packages can depend on other packages
- **Apps CANNOT depend on other apps** (strict boundary)
- Use `workspace:*` for package versions

### Deployment Strategy

**Vercel Configuration**:
- Each app has separate deployment
- Single Vercel dashboard manages all
- Separate domains (or subdomains):
  - `compass.app` → Compass
  - `voicelab.compass.app` → Voice Lab
  - `studio.compass.app` → Studio

**Build Settings** (per app):
```
Root Directory: apps/compass (or voice-lab, studio)
Build Command: cd ../.. && pnpm build --filter @compass/app
Output Directory: .next
```

**Environment Variables**:
- Shared across all apps: `DATABASE_URL`, `CLERK_SECRET_KEY`
- App-specific: Set per deployment in Vercel dashboard

### Database Ownership

**Compass App** owns:
- `authors` table
- `camps` table
- `domains` table
- `quotes` table
- `user_analyses` table

**Voice Lab** owns:
- `voice_profiles` table
- `voice_samples` table

**Studio** owns:
- `projects` table
- `drafts` table
- `generated_content` table

**Rule**: Only the owning app should modify table schema. Other apps read-only.

## Where to Find More

- **Platform architecture**: `/docs/architecture/monorepo-guide.md`
- **Deployment details**: `/docs/deployment/vercel.md`
- **Shared packages guide**: `/docs/shared-packages.md`
- **Compass-specific rules**: `/.claude/apps/compass.md`
- **Detailed Compass docs**: `/apps/compass/Docs/`
- **Code conventions**: See `/.claude/rules/` directory
```

### Testing Recommendation

Based on your current Next.js 15 + React 19 + TypeScript stack, here's the recommended testing approach:

**Recommended Stack**:
```json
{
  "devDependencies": {
    "vitest": "^1.x",           // Fast unit test runner
    "happy-dom": "^12.x",       // Lightweight DOM for testing
    "@testing-library/react": "^14.x",
    "@testing-library/user-event": "^14.x",
    "@playwright/test": "^1.x"  // E2E testing
  }
}
```

**Why this stack?**:
1. **Vitest** - Faster than Jest, better TypeScript support, Vite-compatible
2. **Testing Library** - Industry standard for React testing
3. **Playwright** - Better than Cypress for Next.js, built-in test isolation

**What to test**:
- **Unit tests** (Vitest + Testing Library):
  - Utility functions (`/lib/utils/`)
  - React hooks (`/hooks/`)
  - Server Actions (with mocked Supabase)
  - Shared package functions

- **E2E tests** (Playwright):
  - Critical user flows (sign in → analyze text → view results)
  - Multi-step workflows
  - Cross-page navigation
  - Form submissions

**Don't test**:
- UI components in isolation (visual testing better done with Storybook or manually)
- Third-party library internals
- Simple getters/setters

**Test Philosophy**:
- Test behavior, not implementation
- Prefer integration tests over unit tests
- Write tests for bugs before fixing them
- Keep test coverage practical (aim for 60-70% on critical paths)

### .claude/rules/frontend.md Content

```markdown
# Frontend Rules - Compass Platform

## Next.js 15 Conventions

- Use App Router (`/app` directory)
- Server Components by default
- Use `'use client'` directive only when needed (interactivity, hooks, browser APIs)
- Co-locate route files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Use route groups `(group-name)` for organization without affecting URL

## React 19 Patterns

- Prefer Server Components for data fetching
- Use Server Actions for mutations (no API routes needed)
- Use `useActionState` for form state management
- Use `useOptimistic` for optimistic UI updates
- Avoid `useEffect` for data fetching (use Server Components instead)

## Component Structure

**File naming**:
- Components: `PascalCase.tsx` (e.g., `ResearchAssistant.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Hooks: `useCamelCase.ts` (e.g., `useAnalyzeText.ts`)

**Component organization**:
```
app/research-assistant/
├── page.tsx              # Route component (Server Component)
├── layout.tsx            # Layout (if needed)
├── loading.tsx           # Loading UI
├── error.tsx             # Error boundary
└── components/           # Route-specific components
    ├── AnalysisForm.tsx
    └── ResultsDisplay.tsx
```

**Shared components**:
```
components/
├── ui/                   # Shadcn components
├── Header.tsx            # Global header
└── Footer.tsx            # Global footer
```

## Styling Conventions

- Use Tailwind utility classes (no custom CSS unless necessary)
- Use CSS variables for colors (defined in `globals.css`)
- Responsive design: mobile-first (`sm:`, `md:`, `lg:` breakpoints)
- Use `className` not `style` prop (unless dynamic values)
- Group utilities: layout → spacing → typography → colors

**Example**:
```tsx
<div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 text-blue-900">
  <Icon className="w-5 h-5" />
  <span className="text-sm font-medium">Message</span>
</div>
```

## Import Conventions

**Order** (top to bottom):
1. React imports
2. Third-party libraries
3. @compass/* packages
4. @/ app imports
5. Relative imports

**Example**:
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { Button } from '@compass/ui'
import { analyzeText } from '@compass/ai'

import { Header } from '@/components/Header'
import { formatDate } from '@/lib/utils'

import { ResultsDisplay } from './components/ResultsDisplay'
```

## State Management

- **Server state**: Use Server Components (no state needed)
- **Form state**: Use `useActionState` or controlled inputs
- **UI state**: Use `useState` for local state only
- **Global state**: Context API (avoid unless necessary)
- **URL state**: Use `searchParams` for filters/pagination

## Performance

- Use `loading.tsx` for loading states
- Use `<Suspense>` for code splitting
- Use `next/image` for images (automatic optimization)
- Lazy load heavy components with `dynamic()`
- Avoid client-side data fetching (use Server Components)

## Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Color contrast meets WCAG AA standards
- Test with screen reader
```

### .claude/rules/api.md Content

```markdown
# API Rules - Compass Platform

## Server Actions (Preferred)

**When to use**:
- Form submissions
- Create/update/delete operations
- App-internal mutations
- Any operation triggered by user interaction

**Where to define**:
```typescript
// Option 1: Inline in Server Component
// app/research-assistant/page.tsx
async function analyzeText(formData: FormData) {
  'use server'

  const text = formData.get('text')
  // ... perform analysis
}

// Option 2: Separate file
// app/research-assistant/actions.ts
'use server'

export async function analyzeText(text: string) {
  // ... perform analysis
}
```

**Error handling**:
```typescript
'use server'

export async function createAuthor(data: AuthorInput) {
  try {
    // Validate input
    const validated = authorSchema.parse(data)

    // Perform operation
    const author = await supabase
      .from('authors')
      .insert(validated)
      .select()
      .single()

    if (!author) {
      return { error: 'Failed to create author' }
    }

    revalidatePath('/authors')
    return { success: true, data: author }
  } catch (error) {
    console.error('Create author failed:', error)
    return { error: 'An error occurred' }
  }
}
```

**Usage in client**:
```tsx
'use client'

import { createAuthor } from './actions'
import { useActionState } from 'react'

export function CreateAuthorForm() {
  const [state, action, isPending] = useActionState(createAuthor, null)

  return (
    <form action={action}>
      <input name="name" required />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Author'}
      </button>
    </form>
  )
}
```

## Route Handlers (Limited Use)

**ONLY use for**:
- Webhooks (Clerk, Stripe, external services)
- File upload/download
- Public API endpoints
- Scheduled/cron-triggered operations
- External callbacks that need specific URLs

**File location**:
```
app/api/
├── webhooks/
│   ├── clerk/route.ts
│   └── stripe/route.ts
├── upload/route.ts
└── public/
    └── authors/route.ts
```

**Pattern**:
```typescript
// app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    // Verify webhook signature
    // Process webhook

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 400 }
    )
  }
}
```

## Input Validation

Always use Zod for input validation:

```typescript
import { z } from 'zod'

const authorSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
  tier: z.enum(['tier1', 'tier2', 'tier3'])
})

export async function createAuthor(input: unknown) {
  'use server'

  // Validate
  const data = authorSchema.parse(input) // Throws if invalid

  // Proceed with validated data
}
```

## Response Formats

**Server Actions** return objects:
```typescript
type ActionResult =
  | { success: true; data: Author }
  | { error: string }
```

**Route Handlers** return `Response`:
```typescript
return NextResponse.json(
  { data: authors },
  { status: 200 }
)
```

## Authentication

All Server Actions and Route Handlers must check auth:

```typescript
'use server'

import { currentUser } from '@clerk/nextjs/server'

export async function protectedAction() {
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Proceed
}
```

## Database Queries

- Always use Supabase client from `@compass/database`
- Use RLS policies for security
- Prefer single queries over multiple (join when possible)
- Use `.single()` when expecting one result
- Use `.select('*')` sparingly (select specific columns)

```typescript
'use server'

import { supabase } from '@compass/database'

export async function getAuthorWithCamps(authorId: string) {
  const { data, error } = await supabase
    .from('authors')
    .select(`
      id,
      name,
      camp_authors (
        camps (
          id,
          name
        )
      )
    `)
    .eq('id', authorId)
    .single()

  if (error) throw error
  return data
}
```
```

### .claude/rules/database.md Content

```markdown
# Database Rules - Compass Platform

## Supabase Client

Always import from shared package:
```typescript
import { supabase } from '@compass/database'
```

**Never** create new Supabase clients in app code.

## Migrations

**Location**: `/apps/compass/Docs/migrations/active/`

**Naming**: `YYYY-MM-DD_description.sql`

**Template**:
```sql
-- =====================================================
-- PURPOSE: Add voice_profiles table for Voice Lab
-- REASON: Voice Lab needs to store user voice profiles
-- BACKWARD COMPATIBLE: Yes (new table, no breaking changes)
-- =====================================================

BEGIN;

CREATE TABLE voice_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  profile_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profiles"
  ON voice_profiles
  FOR SELECT
  USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can create own profiles"
  ON voice_profiles
  FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);

COMMIT;

-- Verification
SELECT * FROM voice_profiles LIMIT 1;
```

**Workflow**:
1. Create migration file
2. Test locally: `psql $DATABASE_URL < migration.sql`
3. Verify schema: `psql $DATABASE_URL -c "\d+ table_name"`
4. Apply to production via Supabase dashboard
5. Move to `migrations/archive/` after applied

## Row Level Security (RLS)

**All tables must have RLS enabled**:

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

**Common patterns**:

```sql
-- Users can only see their own data
CREATE POLICY "Users view own data"
  ON table_name
  FOR SELECT
  USING (auth.uid()::TEXT = user_id);

-- Users can only modify their own data
CREATE POLICY "Users update own data"
  ON table_name
  FOR UPDATE
  USING (auth.uid()::TEXT = user_id);

-- Public read, authenticated write
CREATE POLICY "Public read access"
  ON table_name
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated write access"
  ON table_name
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

## Query Patterns

**Prefer joins over multiple queries**:
```typescript
// ❌ Bad: Multiple queries (N+1)
const authors = await supabase.from('authors').select()
for (const author of authors) {
  const camps = await supabase
    .from('camp_authors')
    .select('*, camps(*)')
    .eq('author_id', author.id)
}

// ✅ Good: Single query with join
const authors = await supabase
  .from('authors')
  .select(`
    *,
    camp_authors (
      camps (
        id,
        name
      )
    )
  `)
```

**Select specific columns**:
```typescript
// ❌ Bad: Over-fetching
const authors = await supabase.from('authors').select('*')

// ✅ Good: Only what you need
const authors = await supabase
  .from('authors')
  .select('id, name, credibility_tier')
```

**Handle errors properly**:
```typescript
const { data, error } = await supabase
  .from('authors')
  .select()
  .eq('id', authorId)
  .single()

if (error) {
  console.error('Database error:', error)
  throw new Error('Failed to fetch author')
}

return data
```

## Schema Ownership

| App | Owned Tables |
|-----|-------------|
| Compass | `authors`, `camps`, `domains`, `quotes`, `user_analyses` |
| Voice Lab | `voice_profiles`, `voice_samples` |
| Studio | `projects`, `drafts`, `generated_content` |

**Rule**: Only the owning app modifies table schema. Other apps can read (with RLS).

## TypeScript Types

Generate types after schema changes:

```bash
# From Supabase CLI (if installed)
supabase gen types typescript --project-id YOUR_PROJECT_ID > packages/database/src/types.ts

# Or manually via Supabase dashboard
# Settings > API > Generate Types
```

Import types:
```typescript
import type { Database } from '@compass/database/types'

type Author = Database['public']['Tables']['authors']['Row']
type AuthorInsert = Database['public']['Tables']['authors']['Insert']
```
```

These detailed specifications will help guide the implementation. The plan is now comprehensive with:

1. ✅ `.claude/` directory structure
2. ✅ All template sections (Goal, Architecture, Commands, Rules, Conventions, Checklist)
3. ✅ Monorepo-specific sections
4. ✅ Testing recommendations (Vitest + Playwright)
5. ✅ Detailed content for each rules file
6. ✅ Server Actions vs Route Handlers pattern
7. ✅ Deployment strategy

**Ready for your review!** Let me know if you want me to adjust anything in the plan before we start implementation.

## Verification Steps

After implementation:
1. Verify all documentation links work (no 404s)
2. Test .claude/CLAUDE.md guidance by navigating monorepo structure
3. Ensure no broken references to old ADR-0009 path
4. Confirm each app's README links to both local and platform docs
5. Check that pnpm commands in guides are correct
6. Verify shared packages documentation is accurate
7. Test that Claude can follow the golden commands
8. Verify architecture map accurately reflects current structure

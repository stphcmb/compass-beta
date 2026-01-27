# ADR 0009 – Compass Platform Architecture (Monorepo Separation)

## Status
Accepted

## Context

Compass has grown to include three distinct product areas:
- **Compass Core**: Research Assistant, Explore, Authors, History
- **Voice Lab**: Voice profile training and style synthesis
- **Studio**: Content generation and editing

These areas have different:
- User flows and entry points
- Development velocity requirements
- Potential for independent scaling
- Mental models for developers

Running everything in a single Next.js app creates coupling that slows development and makes the codebase harder to reason about.

## Decision

### Summary Table

| Decision | Choice |
|----------|--------|
| Deployment | **Separate apps** (3 Next.js projects) |
| Domains | **Subdomains**: compass.app, voice.compass.app, studio.compass.app |
| Entry point | **Independent apps** - each works standalone |
| Database | **Shared Supabase** - one instance, table ownership per app |
| Business model | **One product** - separation for code cleanliness |

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        COMPASS PLATFORM                           │
│                                                                   │
│   compass.app            voice.compass.app      studio.compass.app│
│  ┌─────────────┐       ┌─────────────────┐     ┌──────────────┐  │
│  │   Compass   │       │      Voice      │     │    Studio    │  │
│  │  (Next.js)  │       │    (Next.js)    │     │   (Next.js)  │  │
│  │             │       │                 │     │              │  │
│  │  Research   │       │  Profile CRUD   │     │  Content     │  │
│  │  Explore    │       │  Training       │     │  Generation  │  │
│  │  Authors    │       │  Synthesis      │     │  Editing     │  │
│  └─────────────┘       └────────┬────────┘     └──────┬───────┘  │
│         │                       │                      │          │
│         │                       │    HTTP/SDK          │          │
│         │                       │◄─────────────────────┤          │
│         │                       │                      │          │
│         └───────────┬───────────┴──────────────────────┘          │
│                     ▼                                             │
│           ┌───────────────────────────────────────────┐           │
│           │              SHARED LAYER                 │           │
│           │  ┌─────────┐ ┌──────────┐ ┌───────────┐  │           │
│           │  │  Clerk  │ │ Supabase │ │  Gemini   │  │           │
│           │  │  (Auth) │ │   (DB)   │ │   (AI)    │  │           │
│           │  └─────────┘ └──────────┘ └───────────┘  │           │
│           └───────────────────────────────────────────┘           │
└──────────────────────────────────────────────────────────────────┘
```

### Repository Structure

Use a **monorepo** with pnpm workspaces for shared code and coordinated deployments.

```
compass-platform/
├── package.json                 # Workspace root
├── pnpm-workspace.yaml
├── turbo.json                   # Turborepo config
│
├── apps/
│   ├── compass/                 # compass.app
│   ├── voice/                   # voice.compass.app
│   └── studio/                  # studio.compass.app
│
├── packages/
│   ├── shared-ui/               # Shared React components
│   ├── shared-auth/             # Clerk helpers
│   ├── shared-db/               # Supabase client & types
│   ├── voice-sdk/               # SDK for Voice API
│   └── studio-sdk/              # SDK for Studio API (if needed)
│
└── database/
    ├── migrations/              # Shared migrations
    └── seed/
```

### Database Table Ownership

| Owner | Tables |
|-------|--------|
| Compass | `thought_leaders`, `camps`, `domains`, `user_searches`, `saved_analyses` |
| Voice | `voice_profiles`, `voice_samples`, `voice_insights` |
| Studio | `projects`, `project_drafts`, `user_content_defaults` |
| Shared | `users` (Clerk synced), `user_preferences` |

### Cross-App Communication

Studio needs Voice profiles. Use HTTP SDK for clean boundaries:

```typescript
// packages/voice-sdk/src/client.ts
export function createVoiceLabClient(baseUrl: string): VoiceLabSDK {
  return {
    getProfile: (id) => fetchJson(`/api/profiles/${id}`),
    getProfileBySlug: (slug) => fetchJson(`/api/profiles/by-slug/${slug}`),
    listProfiles: (userId) => fetchJson(`/api/profiles?userId=${userId}`),
    getStyleGuide: async (profileId) => {
      const profile = await fetchJson(`/api/profiles/${profileId}`)
      return profile?.style_guide ?? null
    },
  }
}
```

### Authentication: Shared Clerk

One Clerk application for all three apps with cookie domain set to `.compass.app` (note the leading dot). User signs in on any app, authenticated everywhere.

## Consequences

### Positive
- ✅ Clear separation of concerns
- ✅ Independent deployment and scaling
- ✅ Faster development - teams can work in parallel
- ✅ Cleaner codebase - each app is focused
- ✅ Better developer experience - smaller mental model per app

### Negative / Tradeoffs
- ⚠️ More complex local development (3 dev servers)
- ⚠️ Need to maintain shared packages
- ⚠️ Cross-app features require coordination
- ⚠️ Initial migration effort

### Mitigation
- Turborepo handles multi-app development
- Shared packages reduce duplication
- SDK pattern creates clean boundaries
- Parallel operation approach prevents production disruption

## Safe Migration Strategy

**Key principle: COPY, don't move. Original Compass stays running throughout.**

### Parallel Operation Approach

```
PHASE 1: Build new apps alongside existing Compass ✅ COMPLETED (2026-01-27)
┌─────────────────────────────────────────────────────────────┐
│  EXISTING (keep running)     │    NEW (build in parallel)   │
│  ─────────────────────────   │    ─────────────────────────  │
│  compass/ (current repo)     │    compass-platform/         │
│  └── app/voice/              │    ├── apps/compass/         │
│  └── app/studio/             │    ├── apps/voice-lab/       │
│  └── everything else         │    └── apps/studio/          │
└─────────────────────────────────────────────────────────────┘

PHASE 2: Test new apps at staging subdomains
- staging-voice.compass.app
- staging-studio.compass.app

PHASE 3: Gradual cutover
- Point voice.compass.app → new Voice app
- Point studio.compass.app → new Studio app
- Keep compass.app → existing (unchanged)

PHASE 4: Final cleanup (only after verified stable)
- Remove voice/studio from original Compass
- Point compass.app → new apps/compass
```

### Phase 1 Implementation Details (Completed 2026-01-27)

**Actual structure implemented:**
```
compass/
├── pnpm-workspace.yaml
├── package.json (root)
├── apps/
│   ├── compass/          # Main app on port 3000
│   ├── voice-lab/        # Standalone Voice Lab on port 3001
│   └── studio/           # Standalone Studio on port 3002
└── packages/
    ├── ui/               # Toast, PageHeader, Button, Input, Accordion
    ├── database/         # Supabase client + admin + types
    ├── auth/             # Clerk middleware
    ├── ai/               # Gemini client
    ├── config/           # Tailwind preset, tsconfig base
    └── utils/            # cn(), feature flags
```

**Key differences from plan:**
- Used `voice-lab` directory name instead of `voice` for clarity
- Shared packages use `@compass/*` naming convention
- Canon check stubbed in Studio (full integration requires Compass data)
- Voice Lab client in Studio uses direct database access (can convert to HTTP SDK later)

## Alternatives Considered

### Alternative A: Keep everything in one repo
- **Rejected**: Creates coupling, slows development, harder to reason about

### Alternative B: Completely separate repos (no monorepo)
- **Rejected**: Harder to share code, more coordination overhead

### Alternative C: Micro-frontends in single deployment
- **Rejected**: Adds complexity without the benefits of true separation

## Implementation Notes

### Local Development
Run 3 dev servers:
```bash
pnpm dev:compass      # localhost:3000
pnpm dev:voice        # localhost:3001
pnpm dev:studio       # localhost:3002
```

Or use Turborepo:
```bash
pnpm dev  # Runs all apps
```

### Environment Variables
Each app needs its own `.env.local`, but many values are shared:
- `CLERK_*` - Same across all apps
- `SUPABASE_*` - Same across all apps
- `GEMINI_*` - Same across all apps
- `VOICE_LAB_URL` - Only needed by Studio

### CORS Configuration
Voice API needs to allow requests from Studio:
```typescript
// apps/voice/next.config.js
async headers() {
  return [{
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'https://studio.compass.app' },
      { key: 'Access-Control-Allow-Credentials', value: 'true' },
    ],
  }]
}
```

## Related Decisions
- ADR 0008: ICP — Integrated Content Platform

## Date
When decided: 2026-01-26
When documented: 2026-01-26

## References
- Turborepo documentation: https://turbo.build/repo
- Vercel monorepo support: https://vercel.com/docs/monorepos
- pnpm workspaces: https://pnpm.io/workspaces

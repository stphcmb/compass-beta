# Compass Platform

A monorepo containing three standalone applications built on a shared foundation.

## Architecture

```
compass/
├── apps/
│   ├── compass/          # Main Compass app (Research, Explore, Authors)
│   ├── voice-lab/        # Voice Lab (voice profile training)
│   └── studio/           # Studio (content generation)
└── packages/
    ├── ui/               # Shared UI components
    ├── database/         # Supabase client
    ├── auth/             # Clerk middleware
    ├── ai/               # Gemini client
    ├── config/           # Shared configs
    └── utils/            # Utilities
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
pnpm install
```

### Development

Run individual apps:

```bash
# Compass on port 3000
pnpm dev:compass

# Voice Lab on port 3001
pnpm dev:voice-lab

# Studio on port 3002
pnpm dev:studio
```

Run all apps:

```bash
pnpm dev
```

### Building

```bash
pnpm build
```

## Environment Variables

Create `.env.local` in each app directory with:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Gemini AI
GEMINI_API_KEY=...
```

## Apps

### Compass (port 3000)

Core research assistant functionality:
- Research Assistant
- Explore perspectives
- Authors directory
- Search history

### Voice Lab (port 3001)

Voice profile training and style synthesis:
- Create voice profiles from writing samples
- Extract writing style insights
- Generate style guides
- Revise drafts to match voices

### Studio (port 3002)

Voice-constrained content generation:
- Create projects from briefs
- Generate content with voice profiles
- Edit with real-time analysis
- Voice and brief coverage checks

## Shared Packages

| Package | Description |
|---------|-------------|
| `@compass/ui` | Toast, PageHeader, Button, Input, Accordion |
| `@compass/database` | Supabase client, admin client, types |
| `@compass/auth` | Clerk middleware configuration |
| `@compass/ai` | Gemini API client |
| `@compass/utils` | cn(), feature flags |
| `@compass/config` | Tailwind preset, tsconfig base |

## Documentation

- [ADR 0009: Platform Architecture](/apps/compass/Docs/adr/0009-platform-architecture.md)

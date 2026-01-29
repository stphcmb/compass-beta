# Compass (Main App)

> AI-powered content intelligence platform for thought leadership analysis and canon navigation

## Overview

**Compass** is the flagship application that helps content creators, researchers, and thought leaders:
- **Analyze their writing** against 200+ curated AI thought leaders
- **Discover missing perspectives** and blind spots in their arguments
- **Explore the AI discourse landscape** through a curated taxonomy
- **Find content opportunities** by identifying underexplored topics

**URL**: `compass.app` (port 3000 in dev)
**Package**: `@compass/app`
**Target users**: Content creators, researchers, editorial teams, thought leaders

## Key Features

### 1. Research Assistant (Primary Feature)
**Route**: `/research-assistant`

AI-powered content analysis that matches user text against 200+ thought leaders:
- Paste draft text (up to 4,000 chars)
- Get instant analysis of which perspectives you're using/missing
- See matching authors with relevance scores
- View supporting quotes and sources
- "Draft This" CTA to Studio for content creation

**Implementation**: Server Component with streaming, Gemini 2.5 Flash, results saved to `user_analyses`

### 2. Mini Brain (Personal Knowledge Assistant)
**Route**: `/ai-editor`

Editorial analysis tool for content refinement:
- Upload or paste content for analysis
- Get editorial feedback and suggestions
- Memory-enabled: learns user preferences over time
- Context-aware suggestions based on past interactions

**Implementation**: Gemini 2.5 Flash with grounding, stores memories in `user_memories` table

### 3. Explore Perspectives
**Route**: `/explore`

Interactive visualization of the AI discourse landscape:
- Browse by domains (Business, Society, Workers, Technology, Policy)
- Filter by camps (positions/viewpoints)
- Discover thought leaders and their stances
- Navigate the 3-tier taxonomy: domains → dimensions → camps

### 4. Authors Directory
**Route**: `/authors`

Browse and search the curated database of 200+ thought leaders with filtering and profiles.

### 5. Content Helper (Beta)
**Route**: `/content-helper`

Find underexplored content opportunities and discover unique angles for original content.

### 6. History
**Route**: `/history`

Track past research and analyses

## Routes Overview

### Public Routes
- `/` - Landing page with quick analyze
- `/explore` - Explore perspectives
- `/authors` - Authors directory
- `/sign-in`, `/sign-up` - Authentication (Clerk)

### Authenticated Routes
- `/research-assistant` - Main analysis tool
- `/research-assistant/results/[id]` - Analysis results
- `/ai-editor` - Mini Brain editorial analysis
- `/ai-editor/results/[id]` - Editorial feedback
- `/content-helper` - Content opportunities (beta)
- `/history` - Past analyses

### Admin Routes
- `/admin` - Admin dashboard for canon curation

## Database Ownership

Compass **owns and modifies** these tables:

| Table | Purpose |
|-------|---------|
| `authors` | Thought leaders database |
| `camps` | Positions/viewpoints in AI discourse |
| `domains` | Top-level taxonomy categories |
| `camp_authors` | Many-to-many: author-camp relationships |
| `sources` | Author sources (papers, blogs, etc.) |
| `quotes` | Key quotes from thought leaders |
| `user_analyses` | Saved Research Assistant results |
| `user_memories` | Mini Brain user preferences/context |

**Schema location**: `/apps/compass/Docs/database/schema.sql`

## Tech Stack Specifics

### AI/LLM
- **Gemini 2.5 Flash** (upgraded from 2.0 Flash)
- Streaming responses for real-time analysis
- Grounding for Mini Brain factual accuracy
- Context window: ~1M tokens

### Authentication
- **Clerk** for user management
- Email/social auth
- User metadata stored in Clerk

### Database
- **Supabase** (PostgreSQL)
- Row Level Security (RLS) enabled on user-specific tables
- Full-text search indexes on `quotes`, `sources`

### UI Components
- Shared components from `@compass/ui` package
- Tailwind CSS with custom design system
- Lucide icons
- Responsive mobile-first design

## Directory Structure

```
apps/compass/
├── app/
│   ├── (auth)/              # Auth-protected routes
│   ├── api/                 # API routes (webhooks only)
│   ├── research-assistant/  # Main analysis feature
│   ├── explore/             # Browse perspectives
│   ├── authors/             # Author directory
│   └── history/             # User history
├── components/
│   ├── ui/                  # Shadcn components
│   ├── Header.tsx
│   └── ...
├── lib/
│   └── utils.ts
├── Docs/                    # Comprehensive documentation
│   ├── database/           # Schema, migrations
│   ├── adr/                # Architecture decisions
│   ├── specs/              # Product specs
│   └── reference/          # Reference docs
├── scripts/                # Database scripts
│   ├── seed.ts
│   └── verify-migration.ts
└── public/
```

## Common Tasks

### 1. Add New Thought Leader
**Process**: See `/apps/compass/Docs/reference/EXTERNAL_AGENT_AUTHOR_GUIDE.md`

**Quick steps**:
1. Create author record in `authors` table
2. Add 3+ sources to `sources` table
3. Extract 5+ key quotes to `quotes` table
4. Map to relevant camps in `camp_authors`
5. Verify camp assignments have ≥3 quotes per camp

**Admin tool**: `/admin` page for bulk curation

### 2. Add New Camp/Position
**Location**: `/apps/compass/Docs/processes/NEW_AUTHOR_CAMP_ASSIGNMENT_PROCESS.md`

**Steps**:
1. Create migration in `/apps/compass/Docs/migrations/active/`
2. Add camp to `camps` table
3. Map to parent domain
4. Associate relevant authors via `camp_authors`

### 3. Update Analysis Algorithm
**Files**:
- `/apps/compass/app/research-assistant/page.tsx` - UI
- `/apps/compass/app/api/brain/analyze/route.ts` - Analysis API
- `/apps/compass/lib/ai/` - AI utilities

### 4. Modify Explore UI
**Files**:
- `/apps/compass/app/explore/page.tsx`
- `/apps/compass/components/explore/` - Explore-specific components

### 5. Database Migrations
**Location**: `/apps/compass/Docs/migrations/active/`

**Process**:
1. Create migration file: `YYYY-MM-DD_description.sql`
2. Test locally: `psql $DATABASE_URL < migration.sql`
3. Apply to production via Supabase Dashboard
4. Move to `migrations/archive/` after applied

## API Routes

Compass uses **Route Handlers** (not Server Actions) for:

| Route | Purpose |
|-------|---------|
| `/api/brain/analyze` | Mini Brain analysis |
| `/api/content-helper/analyze` | Content opportunities |
| `/api/citations/check` | Citation validation |
| `/api/camps` | Camp data for Explore |
| `/api/admin/*` | Admin curation tools |

**Why Route Handlers?** These endpoints need to support streaming responses or are called from external sources.

## Integration Points

### From Compass → Studio
**"Draft This" flow**:
1. User completes Research Assistant analysis
2. Clicks "Draft This" on analysis results
3. Redirects to Studio Builder: `/studio/builder?thesis=[user_text]`
4. Studio pre-fills content brief with thesis

### From Compass → Voice Lab
**Voice profile creation**:
1. User creates voice profile in Voice Lab
2. Returns to Compass (breadcrumb navigation)
3. Voice profiles available in Studio for content generation

## Performance Considerations

### Analysis Speed
- Typical analysis: 3-5 seconds
- Uses streaming for real-time updates
- Parallel author matching with Promise.all()

### Database Queries
- Full-text search indexes on `quotes.text`
- Composite indexes on `camp_authors(camp_id, author_id)`
- Query optimization for Explore page (eager loading)

### Caching Strategy
- No caching on analysis results (always fresh)
- Static generation for `/explore` page structure
- Revalidate on-demand when camps/authors change

## Security Notes

### RLS Policies
- `user_analyses`: Users can only see their own analyses
- `user_memories`: Users can only access their own memories
- `authors`, `camps`, `quotes`: Public read access

### API Authentication
- All mutation endpoints require Clerk authentication
- Use `currentUser()` to verify user identity
- Never expose API keys in client code

## Development Commands

```bash
# From repo root
pnpm dev:compass               # Start Compass only
pnpm --filter @compass/app build
pnpm --filter @compass/app lint

# From apps/compass/
pnpm seed                      # Seed database
pnpm db:verify                 # Verify migration
pnpm db:analyze                # Analyze data gaps
```

## Environment Variables

```bash
# apps/compass/.env.local
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
GEMINI_API_KEY=...
```

## Key Components

**Header** (`components/Header.tsx`):
- Global navigation
- User menu (Clerk)
- Responsive mobile menu

**Research Assistant** (`app/research-assistant/page.tsx`):
- Main text analysis feature
- Uses Gemini API for analysis
- Saves results to `user_analyses` table

**Explore** (`app/explore/page.tsx`):
- Browse camps and domains
- Filter and search
- View related authors

## API Integration

**Gemini AI**:
```typescript
import { analyzeText } from '@compass/ai'

const result = await analyzeText(userInput)
```

**Supabase**:
```typescript
import { supabase } from '@compass/database'

const { data } = await supabase
  .from('authors')
  .select('*')
  .eq('credibility_tier', 'tier1')
```

## Documentation Resources

### Platform-wide
- `/.claude/CLAUDE.md` - Main AI guidance
- `/.claude/rules/` - Development rules (frontend, api, database, security, deployment)

### App-specific
- `/apps/compass/Docs/README.md` - Documentation index
- `/apps/compass/Docs/architecture/COMPASS_V1_ARCHITECTURE.md` - Complete architecture
- `/apps/compass/Docs/adr/` - Architecture Decision Records
- `/apps/compass/Docs/reference/` - Reference guides
- `/apps/compass/Docs/database/` - Schema and migrations

## Future Features (Roadmap)

- **Preference Learning**: Learn user's analytical preferences over time
- **Citation Agent**: Automatic source citation suggestions
- **Content Helper v2**: Enhanced opportunity detection with trend analysis
- **Collaborative Features**: Team analysis and shared canon libraries

---

**Last Updated**: 2026-01-28
**Port**: 3000
**Package**: `@compass/app`

# Compass

A content taxonomy and discovery platform for exploring AI discourse across different philosophical and technical perspectives.

## Quick Navigation

- [Getting Started](#getting-started)
- [Documentation](#documentation-structure)
- [Architecture Decisions (ADRs)](#architecture-decision-records)
- [Development](#development)
- [Project Structure](#project-structure)

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For detailed setup instructions, see `/Docs/setup/`.

## Documentation Structure

We follow a hierarchical documentation approach that scales with the project:

### Core Documentation (`/Docs`)

- **`/Docs/specs/`** - Product requirements and technical specifications
  - `mvp_prd.md` - Original MVP product requirements
  - `cursor_rules_mvp.md` - AI assistant coding guidelines

- **`/Docs/database/`** - Database schema and SQL reference
  - `schema.sql` - Current canonical database schema
  - `PRODUCTION_SETUP.sql` - Production database setup

- **`/Docs/migrations/`** - Database migration history
  - `/active/` - Pending migrations to apply
  - `/archive/` - Completed migrations (read-only)

- **`/Docs/data/`** - Seed data and enrichment scripts
  - `/seed/` - Initial data population scripts
  - `/enrichment/` - Content enrichment processes
  - `/completed/` - Completion records for enrichment tasks

- **`/Docs/reference/`** - Conceptual guides and architecture docs

- **`/Docs/setup/`** - Deployment and configuration guides

### Architecture Decision Records (`/adr`)

We use ADRs to document significant architectural decisions. Each ADR captures:
- Context and problem statement
- Considered options
- Decision and rationale
- Consequences

See `/adr/README.md` for the ADR process. Notable ADRs:
- [ADR-0001: Documentation Structure](adr/0001-documentation-structure.md)

### Module Documentation

As the codebase grows, major modules maintain their own READMEs:

- `/components/README.md` - Component library guide (to be created)
- `/lib/README.md` - Shared utilities documentation (to be created)
- `/app/README.md` - Next.js routing and pages guide (to be created)
- `/scripts/README.md` - Admin scripts and tools (to be created)

**Module README Template:**
Each module README should include:
1. Purpose and scope
2. Key exports/components
3. Usage examples
4. Testing approach
5. Related ADRs

## Architecture Decision Records

We maintain architectural decisions using the ADR format. To propose a new ADR:

1. Copy `/adr/template.md` to `/adr/NNNN-title.md` (use next number)
2. Fill in the context, decision, and consequences
3. Submit for review
4. Once accepted, mark status as "Accepted"

ADRs are never deleted. Superseded decisions are marked as "Superseded by ADR-XXXX".

## Project Structure

```
app/
  page.tsx                 # Home screen
  results/page.tsx         # Results screen
  author/[id]/page.tsx     # Author detail page
  layout.tsx               # Root layout
  globals.css              # Global styles

components/
  Sidebar.tsx              # Left sidebar with recent/saved searches
  SearchBar.tsx            # Main search input
  SearchFilters.tsx        # Advanced filters panel
  PositioningSnapshot.tsx  # Metrics display
  WhiteSpaceOpportunities.tsx # Opportunities panel
  CampAccordion.tsx        # Expandable camp sections
  AuthorCard.tsx           # Author card component
  AuthorProfile.tsx        # Author detail header
  SourcesList.tsx          # Sources list for author
  ui/                      # shadcn-ui components

lib/
  supabase.ts              # Supabase client
  utils.ts                 # Utility functions
```

## Core Features

- **Search & Discovery**: Full-text search across authors and perspectives
- **Camp Taxonomy**: Organize authors by philosophical camps (e.g., AI Safety, Accelerationism)
- **Author Profiles**: Detailed author pages with quotes, sources, and camp affiliations
- **Domain Navigation**: Browse content across different domains (Ethics, Governance, etc.)
- **Positioning Intelligence**: Analyze thought leadership positions in AI discourse

## Database

This project uses Supabase (PostgreSQL) with the following key tables:
- `authors` - AI thought leaders and their profiles
- `camps` - Schools of thought in AI discourse
- `camp_authors` - Many-to-many author-camp relationships
- `quotes` - Domain-specific author quotes
- `sources` - Author publications and references
- `saved_searches` & `search_history` - User search features

For detailed schema, see `/Docs/database/schema.sql`.
For setup instructions, see `/Docs/setup/`.

## Development

### Common Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript type checking
```

### Development Workflow

1. **Check ADRs**: Before making architectural changes, review existing ADRs in `/adr/`
2. **Update Docs**: Keep module READMEs in sync with code changes
3. **Document Decisions**: Create new ADRs for significant architectural choices
4. **Follow Structure**: Maintain the documentation structure outlined above

### Database Migrations

For database changes:
1. Create migration in `/Docs/migrations/active/`
2. Test migration locally
3. Document in migration file
4. After applying, move to `/Docs/migrations/archive/`

## Documentation Principles

Our documentation follows these core principles:

1. **Single Source of Truth**: Each concept has one canonical location
2. **Decision Tracking**: Architectural changes captured in ADRs
3. **Module Ownership**: Each module documents its own API and usage
4. **Living Documentation**: Docs evolve with code; outdated docs archived
5. **Progressive Disclosure**: Start with README, drill into specifics

See [ADR-0001: Documentation Structure](adr/0001-documentation-structure.md) for full rationale.

## Contributing

1. Review existing ADRs in `/adr/` to understand architectural decisions
2. Check module-specific READMEs for component/feature guidelines
3. Follow the documentation structure outlined in this README
4. Create new ADRs for significant architectural changes
5. Keep documentation in sync with code changes

## License

[Your License Here]

## Support

For questions or issues, please check:
- `/Docs/reference/` for conceptual guides
- `/adr/` for architectural decisions
- Module READMEs for specific component documentation


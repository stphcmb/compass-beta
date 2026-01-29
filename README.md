# Compass Platform

> AI-powered content intelligence platform - A monorepo with 3 Next.js applications and 6 shared packages

## Quick Overview

**Compass Platform** is a suite of AI-powered tools for content creation, voice profiling, and research assistance.

### Applications

| App | Description | Port | URL |
|-----|-------------|------|-----|
| **Compass** | Main content intelligence app | 3000 | http://localhost:3000 |
| **Voice Lab** | Voice profile analysis and insights | 3001 | http://localhost:3001 |
| **Studio** | AI content editor and generator | 3002 | http://localhost:3002 |

### Shared Packages

| Package | Purpose |
|---------|---------|
| `@compass/ui` | Shared React components (buttons, cards, forms) |
| `@compass/database` | Supabase client and types |
| `@compass/auth` | Clerk authentication utilities |
| `@compass/ai` | Google Gemini AI integration |
| `@compass/utils` | Common utilities (formatting, validation) |
| `@compass/config` | Shared configurations (TypeScript, ESLint, Tailwind) |

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **AI**: Google Gemini 2.5 Flash
- **Package Manager**: pnpm (workspaces)
- **Deployment**: Vercel (separate deployments per app)
- **Testing**: Playwright (E2E, visual regression, accessibility)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL (via Supabase)

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/compass.git
cd compass

# Install dependencies
pnpm install

# Set up environment variables
cp apps/compass/.env.example apps/compass/.env.local
cp apps/voice-lab/.env.example apps/voice-lab/.env.local
cp apps/studio/.env.example apps/studio/.env.local

# Add your API keys to .env.local files
```

### Development

```bash
# Run all apps
pnpm dev

# Run specific app
pnpm dev:compass      # Compass app on :3000
pnpm dev:voice-lab    # Voice Lab on :3001
pnpm dev:studio       # Studio on :3002

# Or use filter syntax
pnpm --filter @compass/app dev
pnpm --filter @compass/voice-lab dev
pnpm --filter @compass/studio dev
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter @compass/voice-lab build

# Lint all
pnpm lint
```

## Testing

Compass Platform uses **Playwright** for comprehensive end-to-end, visual regression, and accessibility testing.

### Voice Lab Tests

Voice Lab has a complete test suite including:

- **Visual Regression**: Detects unintended UI changes (header bugs, layout issues)
- **Accessibility**: WCAG 2.1 AA compliance validation
- **Responsive**: Multi-breakpoint testing (mobile, tablet, desktop)
- **E2E**: User flow and interaction testing

```bash
# Run all Voice Lab tests
pnpm --filter @compass/voice-lab test

# Run specific test suites
pnpm --filter @compass/voice-lab test:visual      # Visual regression only
pnpm --filter @compass/voice-lab test:a11y        # Accessibility only
pnpm --filter @compass/voice-lab test:responsive  # Responsive design only

# Interactive mode
pnpm --filter @compass/voice-lab test:ui

# View test report
pnpm --filter @compass/voice-lab test:report

# Update screenshots (after intentional UI changes)
pnpm --filter @compass/voice-lab test:update-snapshots
```

**Learn more**:
- [Voice Lab Test Documentation](apps/voice-lab/tests/README.md)
- [CI Integration Guide](apps/voice-lab/tests/CI_INTEGRATION.md)
- [Test Results Documentation](apps/voice-lab/tests/TEST_RESULTS.md)

### Testing Philosophy

- **Test user behavior, not implementation**: Focus on what users see and do
- **Prevent regressions**: Visual regression tests catch unintended changes
- **Ensure accessibility**: All pages meet WCAG AA standards
- **Validate responsiveness**: Test across all device sizes
- **Run in CI/CD**: Automated testing on every pull request

### Future Testing

- Compass app tests (planned)
- Studio app tests (planned)
- Cross-browser testing (Firefox, Safari)
- Performance testing
- API integration tests

## Project Structure

```
compass/
├── apps/
│   ├── compass/          # Main Compass app
│   ├── voice-lab/        # Voice Lab app (with tests)
│   └── studio/           # Studio app
├── packages/
│   ├── ui/               # Shared UI components
│   ├── database/         # Supabase client
│   ├── auth/             # Clerk utilities
│   ├── ai/               # Gemini AI integration
│   ├── utils/            # Common utilities
│   └── config/           # Shared configs
├── docs/                 # Platform documentation
├── .claude/              # AI assistant instructions
│   ├── CLAUDE.md         # Main project guide
│   ├── rules/            # Development rules
│   └── apps/             # App-specific guides
└── .github/
    └── workflows/        # CI/CD workflows
```

## Development Workflow

### Making Changes

1. **Work in apps/** for app-specific features
2. **Work in packages/** for shared code used by 2+ apps
3. **Follow security rules** (see `.claude/rules/security.md`)
4. **Update tests** when changing UI or behavior
5. **Run tests locally** before committing

### Monorepo Rules

- ✅ Apps can import from packages (`@compass/*`)
- ✅ Packages can import from other packages
- ❌ Apps cannot import from other apps
- ❌ Packages cannot import from apps

### Database Ownership

| App | Owned Tables |
|-----|-------------|
| Compass | `authors`, `camps`, `domains`, `quotes`, `user_analyses` |
| Voice Lab | `voice_profiles`, `voice_samples` |
| Studio | `projects`, `drafts`, `generated_content` |

**Rule**: Only the owning app can modify table schema. Coordinate for cross-app access.

## Deployment

Each app has a **separate Vercel deployment** managed from a single dashboard.

- **Compass**: `compass.app`
- **Voice Lab**: `voicelab.compass.app`
- **Studio**: `studio.compass.app`

### Deploy from CLI

```bash
# Deploy specific app to Vercel
cd apps/voice-lab
vercel

# Deploy to production
vercel --prod
```

### Continuous Deployment

- **Pull requests** → Preview deployments (automatic)
- **Merge to main** → Production deployments (automatic)
- **Tests run** → On every PR (GitHub Actions)

## Security

### Critical Rules (Non-Negotiable)

1. **No secrets committed**: All secrets in `.env.local` (gitignored)
2. **Authentication required**: All mutations must verify user
3. **RLS enabled**: All database tables have Row Level Security
4. **Input validation**: All user input validated with Zod

**Learn more**: [Security Rules](.claude/rules/security.md)

## Documentation

### For Developers

- **[CLAUDE.md](.claude/CLAUDE.md)**: Primary AI assistant guide
- **[API Rules](.claude/rules/api.md)**: Server Actions and Route Handlers
- **[Frontend Rules](.claude/rules/frontend.md)**: React and Next.js conventions
- **[Database Rules](.claude/rules/database.md)**: Supabase and migrations
- **[Security Rules](.claude/rules/security.md)**: Critical security requirements
- **[Deployment](.claude/rules/deployment.md)**: Vercel deployment guide

### For Testing

- **[Voice Lab Tests](apps/voice-lab/tests/README.md)**: Complete testing guide
- **[CI Integration](apps/voice-lab/tests/CI_INTEGRATION.md)**: GitHub Actions setup
- **[Test Results](apps/voice-lab/tests/TEST_RESULTS.md)**: What tests validate

### App-Specific

- **[Compass Guide](.claude/apps/compass.md)**: Compass app details
- **[Voice Lab Guide](.claude/apps/voice-lab.md)**: Voice Lab app details
- **[Studio Guide](.claude/apps/studio.md)**: Studio app details

## Contributing

### Before Committing

- [ ] Build passes: `pnpm --filter @compass/app build`
- [ ] Lint passes: `pnpm lint`
- [ ] Tests pass: `pnpm test` (if applicable)
- [ ] No secrets committed
- [ ] Security rules followed
- [ ] Documentation updated (if workflows changed)

### Pull Request Checklist

- [ ] Small, focused changes (easy to review)
- [ ] Tests added/updated for behavior changes
- [ ] Visual regression tests updated (if UI changed)
- [ ] Environment variables documented (if new)
- [ ] Database migrations created (if schema changed)
- [ ] CI checks passing

## Commands Reference

```bash
# Development
pnpm dev                           # Run all apps
pnpm dev:compass                   # Run Compass only
pnpm --filter @compass/app dev     # Run specific app

# Building
pnpm build                         # Build all
pnpm --filter @compass/app build   # Build specific app

# Testing
pnpm test                          # Run all tests
pnpm --filter @compass/voice-lab test           # Run Voice Lab tests
pnpm --filter @compass/voice-lab test:visual    # Visual regression only
pnpm --filter @compass/voice-lab test:a11y      # Accessibility only
pnpm --filter @compass/voice-lab test:ui        # Interactive mode

# Linting
pnpm lint                          # Lint all
pnpm --filter @compass/app lint    # Lint specific app

# Database (from apps/compass/)
pnpm seed                          # Seed database
psql $DATABASE_URL < migration.sql # Run migration

# Package management
pnpm add <package>                 # Add to root
pnpm add <package> -w              # Add to workspace root
pnpm --filter @compass/app add <package>  # Add to specific app
```

## Environment Variables

### Required for All Apps

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://postgres:...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Gemini AI
GEMINI_API_KEY=AIza...
```

### App-Specific

```env
# Compass
NEXT_PUBLIC_APP_NAME=Compass
NEXT_PUBLIC_APP_URL=https://compass.app

# Voice Lab
NEXT_PUBLIC_APP_NAME=Voice Lab
NEXT_PUBLIC_APP_URL=https://voicelab.compass.app

# Studio
NEXT_PUBLIC_APP_NAME=Studio
NEXT_PUBLIC_APP_URL=https://studio.compass.app
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### pnpm Install Fails

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Fails

```bash
# Check TypeScript errors
pnpm --filter @compass/app tsc --noEmit

# Check for missing environment variables
cat apps/voice-lab/.env.local
```

### Tests Fail

```bash
# Run tests in headed mode to see browser
pnpm --filter @compass/voice-lab test:headed

# View test report
pnpm --filter @compass/voice-lab test:report

# Update screenshots (if UI intentionally changed)
pnpm --filter @compass/voice-lab test:update-snapshots
```

## Support

- **Documentation**: [.claude/](.claude/)
- **Issues**: [GitHub Issues](https://github.com/your-org/compass/issues)
- **Architecture Decisions**: [docs/adr/](docs/adr/)

## License

Proprietary - All rights reserved

---

**Last Updated**: 2026-01-28 | **Version**: 1.0.0

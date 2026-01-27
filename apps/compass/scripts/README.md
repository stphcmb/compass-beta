# Scripts

This directory contains utility scripts for database management, seeding, and maintenance.

## Directory Structure

```
scripts/
├── README.md                    # This file
├── seed.ts                      # Basic seed data
├── seed-client.ts               # Client-side seeding
├── seed-supabase.ts             # Supabase-specific seeding
├── seed-new-taxonomy.ts         # New taxonomy seeding
├── test-db.ts                   # Database connection testing
├── activate-citation-agent.ts   # Run citation verification
├── citation-summary.ts          # Get citation status summary
├── run-citation-fixes.ts        # Fix broken citation URLs
├── fix_broken_citations.sql     # SQL for citation URL fixes
├── validate_authors_pre_commit.mjs  # Pre-commit validation
├── install_git_hooks.sh         # Install git hooks
├── git-hooks/                   # Git hook scripts
└── archive/                     # Retired one-off scripts
    ├── authors/                 # Author data scripts
    ├── quotes/                  # Quote management scripts
    ├── analysis/                # Data analysis scripts
    └── migrations/              # One-time migrations
```

## Active Scripts

### Database Seeding

```bash
# Basic seed data (5 authors, 5 camps)
npm run seed

# Comprehensive MVP data (recommended)
npm run seed:mvp
```

### Citation Verification

```bash
# Check all citation URLs and update status
npx tsx scripts/activate-citation-agent.ts

# View citation health summary
npx tsx scripts/citation-summary.ts

# Fix broken URLs (run after updating fix_broken_citations.sql)
npx tsx scripts/run-citation-fixes.ts
```

### Database Testing

```bash
# Test database connection
npx tsx scripts/test-db.ts
```

### Git Hooks

```bash
# Install pre-commit hooks for author validation
./scripts/install_git_hooks.sh
```

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For write operations
DATABASE_URL=postgresql://...                      # For direct DB access
```

## Archive

The `archive/` directory contains one-off scripts that were used for specific data migrations or fixes. They are kept for reference but should not need to be run again.

- **authors/**: Scripts for adding/updating author data
- **quotes/**: Scripts for managing quotes and sources
- **analysis/**: Data analysis and inspection scripts
- **migrations/**: One-time database migrations

## Adding New Scripts

1. **Utility scripts** that will be reused → add to main `scripts/` folder
2. **One-off scripts** for specific tasks → run them, then move to `archive/`
3. Update this README when adding new utility scripts

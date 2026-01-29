# Deployment - Compass Platform

## Vercel Monorepo Configuration

Each app has a **separate deployment** on Vercel, managed from a **single dashboard**.

**Deployments**:
- `compass.app` → Compass (main app)
- `voicelab.compass.app` → Voice Lab
- `studio.compass.app` → Studio

## Per-App Vercel Configuration

**vercel.json per app** (e.g., `apps/compass/vercel.json`):
```json
{
  "buildCommand": "cd ../.. && pnpm build --filter @compass/app",
  "devCommand": "cd ../.. && pnpm dev --filter @compass/app",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**Or configure in Vercel Dashboard**:
```
Project Settings > General:
  Root Directory: apps/compass
  Build Command: cd ../.. && pnpm build --filter @compass/app
  Output Directory: .next
  Install Command: pnpm install
```

## Environment Variables

### Shared Variables (Platform Level)

Set these at the Vercel project level (shared by all apps):
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
GEMINI_API_KEY=...
```

### App-Specific Variables

Set per deployment in Vercel:
```
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

## Deployment Workflow

### Preview Deployments

- Automatically created for every PR
- Each app gets its own preview URL
- Environment: `preview`
- Database: Uses production database (be careful!)

### Production Deployments

- Triggered on merge to `main` branch
- Each app deployed separately
- Environment: `production`

### Deployment Steps

1. **Create PR** → Preview deployments created
2. **Review changes** → Test on preview URLs
3. **Merge to main** → Production deployments triggered
4. **Verify** → Check production apps

## Database Migrations

**IMPORTANT**: Database migrations are NOT automatic.

**Before deploying code that requires schema changes**:

1. **Create migration** in `/apps/compass/Docs/migrations/active/`
2. **Test locally**:
   ```bash
   psql $DATABASE_URL < migration.sql
   ```
3. **Apply to production** via Supabase dashboard:
   - Go to Supabase Dashboard > SQL Editor
   - Run migration SQL
   - Verify with `\d+ table_name`
4. **Then deploy app** to Vercel
5. **Move migration** to `archive/` after applied

**Never deploy breaking schema changes without coordinating with all apps.**

## Build Performance

### Turborepo (future optimization)

Consider adding Turborepo for faster builds:
```bash
pnpm add turbo -D -w
```

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**"]
    }
  }
}
```

### Vercel Build Cache

Vercel automatically caches:
- `node_modules/` (if lockfile unchanged)
- `.next/cache/` (Next.js build cache)

## Monitoring & Logs

### View Logs

```bash
# Via Vercel CLI
vercel logs [deployment-url]

# Or in Vercel Dashboard
Project > Deployments > [deployment] > Logs
```

### Error Tracking (future)

Consider adding Sentry:
```bash
pnpm add @sentry/nextjs
```

## Rollback

If deployment fails:

1. **Via Vercel Dashboard**:
   - Go to Deployments
   - Find previous working deployment
   - Click "Promote to Production"

2. **Via Git**:
   ```bash
   git revert [commit-hash]
   git push origin main
   ```

## Performance Optimization

### Edge Runtime

For API routes that need low latency:
```typescript
// app/api/fast/route.ts
export const runtime = 'edge'

export async function GET() {
  return Response.json({ data: 'fast' })
}
```

### Incremental Static Regeneration (ISR)

For pages with dynamic data that doesn't change often:
```typescript
// app/authors/[id]/page.tsx
export const revalidate = 3600 // 1 hour

export default async function AuthorPage({ params }) {
  const author = await getAuthor(params.id)
  return <div>{author.name}</div>
}
```

## Domains & DNS

**Main domain**: `compass.app`
**Subdomains**: `voicelab.compass.app`, `studio.compass.app`

**DNS Configuration** (in domain registrar):
```
A     compass.app              76.76.21.21
CNAME voicelab.compass.app     cname.vercel-dns.com
CNAME studio.compass.app       cname.vercel-dns.com
```

**In Vercel Dashboard**:
- Add domains to each project
- Vercel handles SSL certificates automatically

## Deployment Checklist

Before deploying:
- [ ] Build passes locally: `pnpm build`
- [ ] No TypeScript errors
- [ ] Lint passes: `pnpm lint`
- [ ] Environment variables configured in Vercel
- [ ] Database migrations applied (if needed)
- [ ] RLS policies verified
- [ ] Test on preview deployment
- [ ] Check for breaking changes

After deploying:
- [ ] Verify production URL loads
- [ ] Test critical user flows
- [ ] Check error logs in Vercel
- [ ] Monitor database performance (Supabase dashboard)

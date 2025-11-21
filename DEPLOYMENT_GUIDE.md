# Compass Production Deployment Guide

## Step 1: Set Up Supabase Database

### Go to Supabase SQL Editor
1. Visit: https://supabase.com/dashboard/project/qbobesjpzawlffbgytve/sql/new
2. You'll run 3 SQL files in order

### A. Create Tables (Schema)
Copy and paste the entire contents of `Docs/compass_taxonomy_schema_Nov11.sql` into the SQL editor and click **Run**.

This creates:
- domains table (6 domains: Society & Ethics, Enterprise Transformation, etc.)
- dimensions table (organizing structure within domains)
- camps table (thought leader camps/perspectives)
- authors table
- camp_authors table (relationships)
- sources, topics, and other supporting tables

### B. Seed Authors and Relationships
Copy and paste the entire contents of `Docs/03_seed_authors_and_relationships.sql` into the SQL editor and click **Run**.

This adds:
- 32 thought leaders (Emily Bender, Sam Altman, Ethan Mollick, etc.)
- Relationships between authors and camps
- Position summaries and relevance scores

## Step 2: Configure Environment Variables in Vercel

Your app needs these environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL=https://qbobesjpzawlffbgytve.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFib2Jlc2pwemF3bGZmYmd5dHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MjQ0OTYsImV4cCI6MjA3NzUwMDQ5Nn0.uvI0sLPN6GwdDNg5ZV5I0JO41CwSajH0oNZlPFsbAck
```

**Important**: Make sure to select "Production", "Preview", and "Development" for each variable.

## Step 3: Deploy to Vercel

### Option A: Redeploy from Vercel Dashboard
1. Go to your Vercel project deployments
2. Click the "..." menu on the latest deployment
3. Click "Redeploy"

### Option B: Push to GitHub (Automatic Deployment)
```bash
git add .
git commit -m "Add production database setup"
git push
```

Vercel will automatically detect the push and deploy.

## Step 4: Verify Deployment

Once deployed, visit your production URL and check:

1. **Home page** loads without errors
2. **Search functionality** works
3. **Author profiles** display correctly (/author/[id])
4. **Results page** shows camps and thought leaders

## Troubleshooting

### Build fails with TypeScript errors
✅ Already fixed! We updated:
- `tsconfig.json` target to ES2018
- `Docs/mvp_wireframes.tsx` type annotations

### No data shows up
- Check that you ran both SQL files in Supabase
- Verify environment variables are set in Vercel
- Check Supabase logs for any errors

### Database connection errors
- Confirm your Supabase project is not paused
- Check that the anon key matches your project

## What's Included in the Seed Data

**6 Domains:**
- Society & Ethics
- Enterprise Transformation
- Future of Work
- AI Progress (Technical Frontier)
- Governance & Oversight
- Other

**14 Camps** across domains including:
- Ethical Stewards (Emily Bender, Timnit Gebru)
- Pragmatic Optimists (Sam Altman, Demis Hassabis)
- Responsible Adoption Advocates (Ethan Mollick, Andrew Ng)
- And 11 more...

**32 Thought Leaders** with affiliations, credibility tiers, and detailed positions

## Next Steps

After deployment:
1. Test all major features
2. Monitor for any errors in Vercel logs
3. Check Supabase usage/analytics
4. Consider enabling Row Level Security (RLS) for production security

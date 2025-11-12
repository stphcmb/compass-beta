# Migration Guide: New Taxonomy Structure

This guide will help you migrate from the old taxonomy to the new standardized structure.

## New Taxonomy Overview

### 6 Domains:
1. **Society & Ethics** (3 camps)
2. **Enterprise Transformation** (6 camps across 3 dimensions)
3. **Future of Work** (2 camps)
4. **AI Progress (Technical Frontier)** (2 camps)
5. **Governance & Oversight** (3 camps)
6. **Other** (1 camp)

**Total: 17 camps, 37 authors**

### Key Changes:
- Renamed "Technology" → "AI Progress (Technical Frontier)"
- Renamed "Business" → "Enterprise Transformation" with 3 explicit dimensions:
  - Adoption Philosophy (Tech-First, Co-Evolution)
  - Measurement Approach (Proof Seekers, Learning Architects)
  - Translation Capability (Tech Builders, Business Whisperers)
- Renamed "Workers" → "Future of Work"
- Renamed "Policy & Regulation" → "Governance & Oversight"
- Added new dimension structure with `domains`, `dimensions`, `camps` hierarchy

## Migration Steps

### Step 1: Backup Current Data (Optional)
If you want to keep a backup:
```bash
npm run db:analyze > backup_$(date +%Y%m%d).txt
```

### Step 2: Run SQL Files in Supabase Dashboard

**Go to:** Supabase Dashboard → SQL Editor

Run these files **in order**:

#### A. Drop Old Tables
```sql
-- Copy and paste contents from:
Docs/01_drop_old_tables.sql
```

#### B. Create New Schema
```sql
-- Copy and paste contents from:
Docs/compass_taxonomy_schema_Nov11.sql
```

#### C. Seed Authors and Relationships
```sql
-- Copy and paste contents from:
Docs/03_seed_authors_and_relationships.sql
```

### Step 3: Update Frontend Code

The frontend code needs minor updates to work with the new structure:

#### Update API to use new table structure:
- `domains` table (new)
- `dimensions` table (new)
- `camps` table (updated with `dimension_id`)
- `authors` table (same structure)
- `camp_authors` table (same structure)

### Step 4: Verify Migration

Run verification:
```bash
npm run db:test
```

Expected output:
```
✅ Domains: 6
✅ Dimensions: 9
✅ Camps: 17
✅ Authors: 37
✅ Camp-Author relationships: 60+
```

### Step 5: Test Frontend

Start dev server and test:
```bash
npm run dev
```

Visit: http://localhost:3000

Test these searches:
- "safety" → Should show Ethical Stewards, Regulatory Interventionists
- "enterprise" or "business" → Should show Enterprise Transformation camps
- "work" → Should show Future of Work camps
- "scaling" → Should show Scaling Maximalists

## New Domain Mapping

### Old → New:
- `Business` → `Enterprise Transformation`
- `Technology` → `AI Progress (Technical Frontier)`
- `Workers` → `Future of Work`
- `Policy & Regulation` → `Governance & Oversight`
- `Society` → `Society & Ethics`

### Camp Changes:

**Removed:**
- Automation Pessimists (merged into Displacement Realists)
- Implementation Practitioners (merged into Co-Evolution)
- Optimistic Transformationalists (merged into Human-AI Collaboration)
- Technology Optimists (distributed to relevant camps)
- Regulatory Advocates (merged into Regulatory Interventionists)
- Capabilities Realist with Safety Focus (split into relevant camps)

**Added:**
- Proof Seekers (Enterprise Transformation)
- Learning Architects (Enterprise Transformation)
- Tech Builders (Enterprise Transformation)
- Business Whisperers (Enterprise Transformation)
- Various (Other domain)

**Renamed:**
- Platform/Ecosystem → Co-Evolution (broader scope)
- Tech-First → Tech-First (kept but refined)

## Troubleshooting

### Issue: "relation does not exist"
**Solution:** Make sure you ran the schema file (Step 2B) before seeding

### Issue: "duplicate key violation"
**Solution:** Data already exists. Run `01_drop_old_tables.sql` first

### Issue: Frontend shows no results
**Solution:**
1. Check browser console for errors
2. Verify API is using correct table names
3. Restart dev server: `npm run dev`

### Issue: Authors not showing in camps
**Solution:** Check `camp_authors` table has data:
```sql
SELECT COUNT(*) FROM camp_authors;
```

## Rollback (if needed)

If you need to revert:
1. Drop new tables (run `01_drop_old_tables.sql`)
2. Run original `Docs/schema.sql`
3. Run original seed: `npm run seed`

## Next Steps

After successful migration:
1. Update any documentation referencing old domain names
2. Update URL parameters if they reference old domains
3. Consider updating analytics/tracking with new taxonomy
4. Train team on new terminology

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard
2. Run `npm run db:analyze` to see current state
3. Check browser console for frontend errors

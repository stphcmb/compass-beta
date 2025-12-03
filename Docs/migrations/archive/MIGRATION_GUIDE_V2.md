# STATUS: DEPRECATED - Superseded by FINAL_MIGRATION_INSTRUCTIONS.md

This migration guide is kept for historical reference only. Please refer to `migrations/active/FINAL_MIGRATION_INSTRUCTIONS.md` for the current migration procedures.

---

# Migration Guide: Compass V2 Taxonomy Update

## Quick Start

### 1. Run the Database Migration

Copy and paste this entire script into your **Supabase SQL Editor**:

```sql
-- Add 'label' column to camps table
ALTER TABLE camps ADD COLUMN IF NOT EXISTS label TEXT;

-- Update camps with new intuitive labels
UPDATE camps SET label = 'Needs New Approaches' WHERE name = 'Grounding Realists';
UPDATE camps SET label = 'Scaling Will Deliver' WHERE name = 'Scaling Maximalists';
UPDATE camps SET label = 'Safety First' WHERE name = 'Ethical Stewards';
UPDATE camps SET label = 'Iterate Responsibly' WHERE name = 'Tech Realists';
UPDATE camps SET label = 'Democratize Fast' WHERE name = 'Tech Utopians';
UPDATE camps SET label = 'Regulate Now' WHERE name = 'Regulatory Interventionists';
UPDATE camps SET label = 'Evolve Together' WHERE name = 'Adaptive Governance';
UPDATE camps SET label = 'Let Industry Lead' WHERE name = 'Innovation-First';
UPDATE camps SET label = 'Jobs Will Disappear' WHERE name = 'Displacement Realists';
UPDATE camps SET label = 'Humans + AI Together' WHERE name = 'Human-AI Collaboration';
UPDATE camps SET label = 'Technology Leads' WHERE name = 'Tech-First';
UPDATE camps SET label = 'Evolve Together' WHERE name = 'Co-Evolution';
UPDATE camps SET label = 'Measure After' WHERE name = 'Proof Seekers';
UPDATE camps SET label = 'Measure As You Go' WHERE name = 'Learning Architects';
UPDATE camps SET label = 'Build It, They''ll Come' WHERE name = 'Tech Builders';
UPDATE camps SET label = 'Translation Is Key' WHERE name = 'Business Whisperers';

-- Fallback for unmapped camps
UPDATE camps SET label = name WHERE label IS NULL OR label = '';

-- Verify
SELECT id, name, label FROM camps ORDER BY name;
```

### 2. Verify the Migration

After running the script, you should see output like:

| name | label |
|------|-------|
| Adaptive Governance | Evolve Together |
| Co-Evolution | Evolve Together |
| Ethical Stewards | Safety First |
| Grounding Realists | Needs New Approaches |
| Scaling Maximalists | Scaling Will Deliver |
| Tech-First | Technology Leads |
| ... | ... |

### 3. Test the Application

```bash
npm run dev
```

Visit: http://localhost:3000/results?q=safety+alignment

You should see:
- ✅ New camp names in the sliders (e.g., "Safety First" instead of "Ethical Stewards")
- ✅ New domain names (e.g., "AI Technical Capabilities" instead of "Technology")
- ✅ New agreement labels ("Agree", "Partially Agree", "Disagree", "New Voices")

## What Changed

### Database Schema
- **Added**: `camps.label` column (TEXT)
- **Preserved**: `camps.name` column (original names)
- **No changes** to relationships or other tables

### Application Code
- Updated `DOMAIN_MAP` with new domain names
- Components now use `camp.label || camp.name` for display
- Agreement terminology changed from "alignment" to "agree/disagree"

### Visual Design
- Cleaner information hierarchy
- Domain-based grouping with horizontal sliders
- 3-column author grid
- Refined typography and spacing

## Troubleshooting

### "Column label does not exist"
**Solution**: Run the ALTER TABLE statement first:
```sql
ALTER TABLE camps ADD COLUMN IF NOT EXISTS label TEXT;
```

### "UPDATE didn't match any rows"
**Problem**: Camp names in your database might be different.

**Solution**: Check what camps exist:
```sql
SELECT id, name FROM camps ORDER BY name;
```

Then update the migration script to match your actual camp names.

### Labels not showing in UI
**Problem**: The API might be caching results.

**Solution**:
1. Hard refresh the browser (Cmd+Shift+R or Ctrl+Shift+R)
2. Restart the dev server
3. Check browser console for errors

### Old names still showing
**Problem**: API code fallback to `name` when `label` is NULL.

**Solution**: Make sure the fallback UPDATE ran:
```sql
UPDATE camps SET label = name WHERE label IS NULL OR label = '';
```

## Rollback (if needed)

If you need to revert the changes:

```sql
-- Option 1: Remove the label column entirely
ALTER TABLE camps DROP COLUMN IF EXISTS label;

-- Option 2: Just clear the labels (keep column)
UPDATE camps SET label = NULL;
```

The app will fall back to using the `name` field.

## Next Steps

After successful migration:
1. ✅ Test all search queries
2. ✅ Test agreement filters
3. ✅ Test camp slider interactions
4. ✅ Verify author cards display correctly
5. ✅ Test on mobile/tablet layouts
6. 🚀 Deploy to production

## Support

If you encounter issues:
1. Check `Docs/IMPLEMENTATION_NOTES_V2.md` for detailed changes
2. Review the full SQL script in `Docs/update_taxonomy_v2_simple.sql`
3. Check the browser console for JavaScript errors
4. Verify Supabase connection in `.env.local`

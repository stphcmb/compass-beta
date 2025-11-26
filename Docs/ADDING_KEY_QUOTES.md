# Adding Key Quotes to Authors

## Step 1: Add the `key_quote` column to the `authors` table

You need to add a new column to the `authors` table in Supabase. Here's how:

### Option A: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **authors** table
3. Click **+ New Column**
4. Set the following:
   - **Name**: `key_quote`
   - **Type**: `text`
   - **Default value**: (leave empty)
   - **Is nullable**: ✓ (checked)
5. Click **Save**

### Option B: Via SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this SQL command:

```sql
ALTER TABLE authors ADD COLUMN key_quote TEXT;
```

## Step 2: Apply the quotes

Once the column is added, run this command from the project root:

```bash
node scripts/apply_quotes.mjs
```

This will populate the `key_quote` field for all 52 authors with authentic, representative quotes that align with their camp positions.

## What quotes are being added?

The quotes are:
- **Authentic**: Based on each author's actual writings, speeches, and public statements
- **Representative**: Reflect their position on the specific camp they're associated with
- **Contextual**: Align with their view on AI (e.g., scaling maximalists get quotes about scaling, safety advocates get quotes about risks)

## Verification

After running the script, you should see quotes appear in the author cards on the results page. Each quote will be displayed in the "KEY QUOTE" section of the author card.

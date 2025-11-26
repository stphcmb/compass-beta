# Adding Quote Source URLs

## Step 1: Add the `quote_source_url` column

You need to add a new column to store the URL where each quote actually appears.

### Via Supabase SQL Editor:

Go to your Supabase dashboard → SQL Editor and run:

```sql
ALTER TABLE authors ADD COLUMN quote_source_url TEXT;
```

## Step 2: Apply the quote source URLs

Once the column is added, run:

```bash
node scripts/add_quote_sources.mjs
```

This will link each quote to its actual source where that specific quote appears.

## What this fixes:

Instead of linking to just the first available source, each quote will now link to:
- Sam Altman's "The Intelligence Age" essay (where his AGI quote appears)
- Dario Amodei's "Machines of Loving Grace" (where his quote appears)
- Marc Andreessen's "Techno-Optimist Manifesto" (where his quote appears)
- Gary Marcus's Substack articles (where his skepticism appears)
- And so on for all 52 authors...

Each quote will link directly to the article, paper, book, or interview where that specific quote was said!

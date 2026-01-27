# Archived Scripts

This directory contains one-off scripts that were used for data migration and enrichment tasks. These scripts have completed their purpose and are archived for reference.

## Data Enrichment Scripts (Jan 2025)

### Quote Source Enrichment
- **fix-quote-sources.ts** - Sequential version for enriching quote sources with metadata
- **fix-quote-sources-parallel.ts** - Parallel version (20x faster) for enriching 238 quote sources
- **fix-remaining-quotes.ts** - Fixed remaining 13 quote sources after initial run
- **fix-quote-source-urls.ts** - URL normalization for quote sources
- **match-quotes-to-sources.ts** - Matched quotes to existing sources

**Result**: 238 authors enriched with complete source metadata (title, type, date, summary)

### Date Enrichment
- **pilot-enrich-dates.ts** - Initial pilot test for date enrichment
- **enrich-dates-parallel.ts** - Parallel processing of 820 sources across 239 authors using Gemini AI
- **apply-date-enrichment.ts** - Applied 347 high/medium confidence dates to database

**Result**: Improved from 46.9% to 53.1% of sources with specific publication dates (YYYY-MM-DD format)

### Source Analysis
- **find-specific-content.ts** - Found specific content patterns in sources
- **apply-source-replacements.ts** - Applied bulk source replacements

### Shell Wrappers
- **run-quote-fix.sh** - Environment wrapper for quote fixing
- **run-remaining-quotes.sh** - Environment wrapper for remaining quotes
- **run-date-enrichment.sh** - Environment wrapper for date enrichment
- **run-apply-dates.sh** - Environment wrapper for applying dates

These shell scripts handled `.env.local` loading with the pattern:
```bash
#!/bin/bash
set -a
source .env.local
set +a
npx tsx scripts/[script-name].ts
```

## Ongoing Utility Scripts

The following scripts remain in the main `scripts/` directory for ongoing use:
- **audit-source-dates.ts** - Audit source date quality
- **audit-source-quality.ts** - Comprehensive source quality analysis
- **analyze-generic-sources.ts** - Identify and categorize generic sources

## Historical Context

These scripts were part of a major data quality improvement initiative in January 2025 that:
1. Enriched 238 quote sources with proper metadata
2. Enhanced 820 sources with specific publication dates
3. Identified 178 generic sources for potential improvement
4. Improved overall source quality from 46.9% to 53.1% specific dates

All processing used Gemini 2.5 Pro/Flash for AI-powered metadata extraction and date inference.

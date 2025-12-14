# Author Data Management Scripts

This directory contains scripts for managing, validating, and enriching author data in the Compass database.

## 🚨 CRITICAL: Pre-Commit Validation

**ALWAYS run validation before committing new author data:**

```bash
node scripts/validate_authors_pre_commit.mjs
```

This script checks:
- ✅ All authors have camp relationships
- ✅ All camp relationships have quotes
- ✅ All authors have at least 3 sources
- ✅ No duplicate sources (same URL)

**Exit codes:**
- `0` = Validation passed (safe to commit)
- `1` = Validation failed (DO NOT COMMIT)

---

## 📋 Available Scripts

### 1. **find_missing_quotes.mjs** ⭐ CRITICAL

Identifies authors missing quotes for their camp relationships.

**Usage:**
```bash
node scripts/find_missing_quotes.mjs
```

**Output:**
- Lists all authors with missing quotes
- Shows which camp each quote is missing for
- Provides camp-author IDs for easy SQL updates
- Summary statistics

**When to run:**
- ✅ Before committing new authors
- ✅ After bulk author imports
- ✅ During quarterly data audits
- ✅ When you see blank quotes in the UI

---

### 2. **apply_missing_quotes.mjs**

Applies quotes from a SQL file to the database.

**Usage:**
```bash
node scripts/apply_missing_quotes.mjs
```

**Requirements:**
- SQL file must exist at: `Docs/data/enrichment/ADD_MISSING_QUOTES_2025.sql`
- Uses service role key (bypasses RLS)
- Includes progress tracking

**What it does:**
- Parses SQL UPDATE statements
- Applies each quote to camp_authors table
- Reports success/failure for each update
- Provides summary statistics

---

### 3. **find_duplicate_sources.mjs** ⭐ IMPORTANT

Identifies authors with duplicate source URLs.

**Usage:**
```bash
node scripts/find_duplicate_sources.mjs
```

**Output:**
- Lists all authors with duplicate sources
- Shows exact URL duplicates
- Identifies similar titles (possible duplicates)
- Displays all sources for review
- Provides author IDs for SQL updates

**When to run:**
- ✅ Before committing source updates
- ✅ During quarterly data audits
- ✅ After bulk source imports
- ✅ When adding 4+ sources to an author

---

### 4. **apply_duplicate_source_fixes.mjs**

Applies duplicate source fixes from a SQL file to the database.

**Usage:**
```bash
node scripts/apply_duplicate_source_fixes.mjs
```

**Requirements:**
- SQL file must exist at: `Docs/data/enrichment/FIX_DUPLICATE_SOURCES_2025.sql`
- Uses service role key (bypasses RLS)
- Includes progress tracking

**What it does:**
- Parses SQL UPDATE statements
- Replaces duplicate sources with unique ones
- Reports success/failure for each update
- Provides summary statistics

---

### 5. **validate_authors_pre_commit.mjs** ⭐ REQUIRED

Comprehensive validation for author data quality.

**Usage:**
```bash
node scripts/validate_authors_pre_commit.mjs
```

**Checks:**
1. Authors without camp relationships
2. Camp relationships missing quotes
3. Authors with < 3 sources (warning only)
4. Duplicate sources (same URL)

**Integration:**
Add to git pre-commit hook:
```bash
# In .git/hooks/pre-commit
#!/bin/bash
node scripts/validate_authors_pre_commit.mjs
```

---

## 🔄 Typical Workflow

### **Adding New Authors**

```bash
# 1. Create SQL file with author data
# Follow: Docs/reference/AUTHOR_DATA_ADMINISTRATION.md

# 2. Apply SQL to database
# (Run in Supabase SQL editor or via psql)

# 3. Check for missing data
node scripts/find_missing_quotes.mjs

# 4. If quotes are missing:
# - Create SQL file with quotes (see Docs/data/enrichment/)
# - Apply quotes using apply_missing_quotes.mjs

# 5. Validate everything
node scripts/validate_authors_pre_commit.mjs

# 6. If validation passes, commit
git add .
git commit -m "Add new authors: [names]"
```

### **Bulk Quote Enrichment**

```bash
# 1. Find gaps
node scripts/find_missing_quotes.mjs > quote_gaps.txt

# 2. Research and create SQL file
# See: Docs/data/enrichment/ADD_MISSING_QUOTES_2025.sql as template

# 3. Apply quotes
node scripts/apply_missing_quotes.mjs

# 4. Verify
node scripts/find_missing_quotes.mjs
# Should show: "Total missing quotes: 0"

# 5. Validate and commit
node scripts/validate_authors_pre_commit.mjs
git commit -m "Add missing quotes for [X] authors"
```

### **De-duplicating Sources**

```bash
# 1. Find duplicates
node scripts/find_duplicate_sources.mjs > duplicate_sources.txt

# 2. Review duplicates and research replacements
# For each author with duplicates:
# - Keep the first occurrence (index 0)
# - Find credible, unique replacement sources
# - Add to SQL file: Docs/data/enrichment/FIX_DUPLICATE_SOURCES_2025.sql

# 3. Apply fixes
node scripts/apply_duplicate_source_fixes.mjs

# 4. Verify no duplicates remain
node scripts/find_duplicate_sources.mjs
# Should show: "Authors with duplicate sources: 0"

# 5. Validate and commit
node scripts/validate_authors_pre_commit.mjs
git commit -m "De-duplicate sources for [X] authors"
```

---

## 📖 Related Documentation

- **`Docs/reference/AUTHOR_DATA_ADMINISTRATION.md`** - Complete guide for adding authors
- **`Docs/reference/UPDATING_EXISTING_AUTHORS.md`** - Guide for updating existing authors
- **`Docs/data/enrichment/ADD_MISSING_QUOTES_2025.sql`** - Example quote enrichment SQL

---

## 🔧 Script Details

### Environment Requirements

All scripts require:
- `.env.local` with Supabase credentials
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for read operations)
- `SUPABASE_SERVICE_ROLE_KEY` (for write operations)

### Dependencies

```json
{
  "@supabase/supabase-js": "^2.x",
  "dotenv": "^16.x"
}
```

### Error Handling

**Common errors:**

1. **"supabaseUrl is required"**
   - Check `.env.local` exists
   - Verify environment variables are set

2. **"No record found for ID"**
   - Camp-author relationship doesn't exist
   - Check IDs from find_missing_quotes.mjs

3. **"Permission denied"**
   - Use service role key for updates
   - Anon key only has read permissions

---

## 🎯 Quality Standards

### Quotes Must:
- ✅ Be 60-150 words
- ✅ Be actual words from the author (not paraphrased)
- ✅ Reflect stance on THAT specific camp/domain
- ✅ Have verifiable source URL
- ✅ Be unique per camp (not copy-pasted)

### Sources Must:
- ✅ Be unique (NO duplicate URLs)
- ✅ Be credible and verifiable
- ✅ Represent diverse content types (Blog, Book, Paper, etc.)
- ✅ Be from reputable publications/platforms

### Authors Must:
- ✅ Have 1-5 camp relationships
- ✅ Have minimum 3 sources (maximum 5 recommended)
- ✅ Have NO duplicate source URLs
- ✅ Have complete profile (name, affiliation, notes, tier, type)

---

## 🚀 Automation

### GitHub Actions (Future)

```yaml
# .github/workflows/validate-authors.yml
name: Validate Author Data
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: node scripts/validate_authors_pre_commit.mjs
```

### Pre-commit Hook

```bash
# Install pre-commit hook
cp scripts/git-hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

---

## 📊 Statistics

Run anytime to see current data status:

```bash
# Total authors and quote coverage
node scripts/find_missing_quotes.mjs | tail -10

# Full validation status
node scripts/validate_authors_pre_commit.mjs
```

---

## ⚠️ Important Notes

1. **Never commit authors without quotes** - Creates UI gaps
2. **Never commit duplicate sources** - Degrades data quality
3. **Always validate before push** - Prevents bad data in production
4. **Use service role key carefully** - Bypasses all RLS policies
5. **Test SQL in Supabase first** - Before running apply scripts
6. **Keep quotes domain-specific** - Generic quotes hurt quality
7. **Limit sources to 3-5 per author** - Quality over quantity

---

## 🆘 Troubleshooting

**Q: Validation failing but I just added quotes?**
- Wait 10-30 seconds for database replication
- Run find_missing_quotes.mjs to verify
- Check Supabase dashboard for applied changes

**Q: How do I find good quotes?**
- Check author's books, papers, blog posts
- Look for domain-specific statements
- Use actual published content, not interviews
- Verify quote source URL works

**Q: Can I add authors without quotes temporarily?**
- **NO** - This creates incomplete UI experiences
- Collect quotes BEFORE adding author
- If no quotes exist, don't add that camp relationship

---

**Last Updated:** 2025-12-13
**Maintainer:** See AUTHOR_DATA_ADMINISTRATION.md

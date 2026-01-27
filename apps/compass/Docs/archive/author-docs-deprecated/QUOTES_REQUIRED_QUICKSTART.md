# 🚨 QUOTES REQUIRED: Quick Start Guide

**Version:** 1.0
**Last Updated:** 2025-12-13
**Purpose:** Ensure all future authors have quotes from day one

---

## ⚡ TL;DR

**Every author MUST have a quote for EACH camp they belong to.**

- ❌ **No quotes = No commit**
- ✅ **Run validation before committing**: `node scripts/validate_authors_pre_commit.mjs`
- 📖 **Full guide**: `Docs/reference/AUTHOR_DATA_ADMINISTRATION.md`

---

## 🎯 The Rule

```
IF author maps to a camp
THEN camp_authors MUST have:
  ✓ key_quote (60-150 words, actual author words)
  ✓ quote_source_url (verifiable link)
```

**No exceptions. No "add it later". No placeholders.**

---

## ✅ Checklist for New Authors

Before committing ANY new author:

- [ ] **1. Author has basic info** (name, affiliation, notes, tier, type)
- [ ] **2. Author has ≥3 sources** in JSONB array
- [ ] **3. Author mapped to 1-5 camps** (based on expertise)
- [ ] **4. EVERY camp has key_quote** (actual words from author)
- [ ] **5. EVERY camp has quote_source_url** (working link)
- [ ] **6. Quotes are camp-specific** (different per camp)
- [ ] **7. Run validation**: `node scripts/find_missing_quotes.mjs`
- [ ] **8. Verify 0 missing quotes**
- [ ] **9. Run pre-commit check**: `node scripts/validate_authors_pre_commit.mjs`
- [ ] **10. All validation passes** ✅

**If ANY checkbox is unchecked → DO NOT COMMIT**

---

## 🛠️ Tools

### **1. Find Missing Quotes**
```bash
node scripts/find_missing_quotes.mjs
```
Shows exactly which authors/camps need quotes.

### **2. Validate Before Commit**
```bash
node scripts/validate_authors_pre_commit.mjs
```
Returns exit code 0 (pass) or 1 (fail).

### **3. Install Git Hook (Automated)**
```bash
bash scripts/install_git_hooks.sh
```
Automatically validates on every commit.

---

## 📝 Example: Adding New Author

### **Step 1: Prepare Author Data**

```sql
BEGIN;

-- Insert author
INSERT INTO authors (
  name,
  primary_affiliation,
  header_affiliation,
  notes,
  credibility_tier,
  author_type,
  sources
) VALUES (
  'Jane Doe',
  'Stanford University, HAI',
  'Stanford',
  'Leading AI ethics researcher focusing on fairness and accountability.',
  'Thought Leader',
  'researcher',
  '[
    {"url": "https://stanford.edu/~jane", "type": "Research", "year": "2024", "title": "AI Ethics Lab"},
    {"url": "https://amazon.com/fairness-book", "type": "Book", "year": "2023", "title": "Fair AI"},
    {"url": "https://podcast.com/jane", "type": "Podcast", "year": "2024", "title": "Ethics Pod"}
  ]'::jsonb
) RETURNING id;
-- Note the ID: abc123...

COMMIT;
```

### **Step 2: Add Camp Relationships WITH QUOTES**

```sql
BEGIN;

-- Map to AI & Society → Safety First
INSERT INTO camp_authors (
  camp_id,
  author_id,
  relevance,
  key_quote,
  quote_source_url,
  why_it_matters
) VALUES (
  '7f64838f-59a6-4c87-8373-a023b9f448cc', -- Safety First camp ID
  'abc123...', -- Jane's author ID from step 1
  'strong',
  'AI systems must be designed with fairness and accountability from the ground up, not bolted on as an afterthought. We need rigorous testing for bias and real consequences for harmful deployments.',
  'https://stanford.edu/~jane/fairness-paper',
  'Jane has pioneered frameworks for AI accountability that are now industry standard...'
);

-- Repeat for each camp Jane belongs to
-- EACH with its own unique quote

COMMIT;
```

### **Step 3: Validate**

```bash
# Check for missing quotes
node scripts/find_missing_quotes.mjs

# Expected: "Total missing quotes: 0"

# Run full validation
node scripts/validate_authors_pre_commit.mjs

# Expected: "✅ VALIDATION PASSED"
```

### **Step 4: Commit**

```bash
git add .
git commit -m "Add Jane Doe to AI & Society camp"
```

---

## 🚫 Common Mistakes

### ❌ **Mistake 1: Adding Author Without Quotes**
```sql
-- DON'T DO THIS
INSERT INTO camp_authors (camp_id, author_id, relevance)
VALUES ('camp-id', 'author-id', 'strong');
-- Missing: key_quote, quote_source_url
```

### ❌ **Mistake 2: Planning to "Add Quotes Later"**
**This creates UI gaps immediately.** Don't do it.

### ❌ **Mistake 3: Using Same Quote for Multiple Camps**
```sql
-- DON'T DO THIS
-- Camp 1: "AI is transformative..."
-- Camp 2: "AI is transformative..." ← Same quote!
```
Each camp needs domain-specific content.

### ❌ **Mistake 4: Paraphrasing Instead of Actual Quotes**
```sql
-- DON'T: "She believes AI needs regulation"
-- DO: "We need robust governance frameworks..."
```

---

## ✅ Where Quotes Appear

Quotes show up in:

1. **Mini Brain Results**
   - Each author card shows their quote
   - Users see what author actually said

2. **Author Index Page**
   - Author cards display key quotes
   - Helps users understand perspectives

3. **Search Results**
   - Quotes provide context
   - Improve relevance and trust

**Missing quotes = Broken user experience**

---

## 🔧 Quote Quality Standards

### **Good Quote**
- ✅ 60-150 words
- ✅ Actual author words (use quotes from books, papers, talks)
- ✅ Reflects stance on THIS specific camp/domain
- ✅ Source URL works and goes to actual quote
- ✅ Clear, compelling, representative

### **Bad Quote**
- ❌ Too short (<60 words) or too long (>150 words)
- ❌ Paraphrased or summarized
- ❌ Generic ("AI is important")
- ❌ Broken or missing source URL
- ❌ Not specific to the camp

---

## 📚 Finding Good Quotes

### **Best Sources (in order)**
1. **Books** - Most authoritative
2. **Academic Papers** - Technical depth
3. **Blog Posts** - Recent thinking
4. **Podcasts/Interviews** - Conversational
5. **Twitter** - Only for active voices

### **Search Strategy**
```
1. Go to author's website/publications
2. Search for keywords related to camp
   - Safety First? Search "safety", "accountability", "risk"
   - Tech-First? Search "automation", "infrastructure", "speed"
3. Find direct quotes (use Ctrl+F for quote marks)
4. Copy exact wording + save URL
5. Verify quote is 60-150 words
```

---

## 🆘 Can't Find a Quote?

**Option 1:** Don't add that author to that camp
- If they haven't publicly stated a position, they don't belong in that camp

**Option 2:** Do more research
- Check Google Scholar, podcasts, interviews
- Look for recent talks or presentations

**Option 3:** Ask for help
- See `AUTHOR_DATA_ADMINISTRATION.md`
- Review examples in `Docs/data/enrichment/ADD_MISSING_QUOTES_2025.sql`

**DON'T:** Add author without quote hoping to find one later

---

## 📊 Automated Enforcement

### **Git Pre-Commit Hook**

Install once:
```bash
bash scripts/install_git_hooks.sh
```

Now every commit automatically runs:
```bash
node scripts/validate_authors_pre_commit.mjs
```

**Blocks commits if:**
- Authors missing camp relationships
- Camp relationships missing quotes
- Authors with <3 sources (warning only)

**To bypass (NOT RECOMMENDED):**
```bash
git commit --no-verify
```

---

## 📖 Full Documentation

- **Complete Guide**: `Docs/reference/AUTHOR_DATA_ADMINISTRATION.md`
- **Update Guide**: `Docs/reference/UPDATING_EXISTING_AUTHORS.md`
- **Scripts README**: `scripts/README_AUTHOR_SCRIPTS.md`
- **Example Quotes**: `Docs/data/enrichment/ADD_MISSING_QUOTES_2025.sql`

---

## 🎓 Why This Matters

### **User Experience**
- Quotes make authors real and credible
- Users can evaluate perspectives directly
- Trust in the platform increases

### **Data Quality**
- Enforces completeness from day one
- Prevents technical debt
- Maintains professional standards

### **Developer Experience**
- Clear expectations
- Automated validation
- Less cleanup work later

---

**Remember:** Better to have 1 author with complete data than 10 authors missing quotes.

**Quality > Quantity**

---

**Questions?** See `AUTHOR_DATA_ADMINISTRATION.md` or run:
```bash
node scripts/find_missing_quotes.mjs --help
```

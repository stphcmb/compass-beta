# Source Date Enrichment - Pilot Test Guide

This guide walks you through testing the date enrichment agent on 10 authors before running a full batch.

---

## Overview

**Goal:** Verify that the `enrichSourceDates` agent can accurately find publication dates for sources that currently only have year information.

**Success Criteria:** ≥90% of enriched dates are accurate when manually verified.

---

## Step 1: Run the Audit

First, analyze the current state of source dates:

```bash
npx tsx scripts/audit-source-dates.ts
```

**What it does:**
- Scans all sources in the database
- Identifies which have specific dates vs. year-only
- Exports `source-date-audit.json` with full details

**Expected output:**
```
=== SOURCE DATE AUDIT ===
Total sources: 1,847
  ✅ Specific dates: 234 (12.7%)
  ⚠️  Year only: 1,542 (83.5%)
  ❌ Missing: 71 (3.8%)

🔧 NEEDS ENRICHMENT: 1,613
```

---

## Step 2: Run the Pilot Enrichment

Test enrichment on 10 carefully selected authors:

```bash
npx tsx scripts/pilot-enrich-dates.ts
```

**What it does:**
- Selects 10 authors (top 5 by need + 5 random)
- Calls `enrichSourceDates` agent for each
- Uses Gemini Pro to extract dates from URLs, ArXiv IDs, etc.
- Exports `pilot-enrichment-results.json`

**Expected runtime:** 2-3 minutes (includes rate limiting)

**Expected output:**
```
=== PILOT DATE ENRICHMENT ===

📋 PILOT AUTHORS:
  1. Sam Altman (12 sources)
  2. Dario Amodei (8 sources)
  3. Yann LeCun (15 sources)
  ...

[1/10] Sam Altman
  1. ✅ 2024-10-15 (high)
     Date found in URL path
  2. ✅ 2024-03-22 (high)
     ArXiv ID parsed
  ...

=== PILOT SUMMARY ===
Total processed: 87
  ✅ Successfully enriched: 76 (87.4%)
  ❌ Failed to enrich: 11 (12.6%)

Confidence breakdown:
  🟢 High: 58 (66.7%)
  🟡 Medium: 18 (20.7%)
  🔴 Low: 11 (12.6%)

📊 QUALITY METRICS:
  High confidence rate: 66.7%
  Good enough rate (high + medium): 87.4%
```

---

## Step 3: Manual Verification

Open `pilot-enrichment-results.json` and verify a sample of results:

### What to Check

For each enriched source, verify:
1. **Is the date accurate?** Check the URL or Google the source
2. **Is the confidence appropriate?** High = exact date, Medium = inferred, Low = guess
3. **Does the reasoning make sense?** "Date found in URL path" should have date in URL

### Example Verification

```json
{
  "authorName": "Sam Altman",
  "sourceTitle": "Interview on AI Safety",
  "originalDate": "2024",
  "enrichedDate": "2024-10-15",
  "confidence": "high",
  "reasoning": "Date found in URL path",
  "source": "URL path",
  "url": "https://example.com/2024/10/15/interview"
}
```

**Verify:** Check URL → Does it really have `/2024/10/15/`? ✅ Yes → **Accurate**

### Quick Verification Template

Create a spreadsheet or text file:

| Author | Source Title | Enriched Date | Confidence | Verified? | Notes |
|--------|--------------|---------------|------------|-----------|-------|
| Sam Altman | Interview | 2024-10-15 | high | ✅ | URL confirms |
| Dario Amodei | Essay | 2024-10-11 | high | ✅ | Matches blog |
| ... | ... | ... | ... | ... | ... |

**Target:** Manually verify at least 20-30 sources

---

## Step 4: Calculate Accuracy

After manual verification:

1. Count **accurate** enrichments (date matches reality)
2. Count **inaccurate** enrichments (date is wrong)
3. Calculate: `accuracy = accurate / (accurate + inaccurate)`

**Decision Matrix:**

| Accuracy | Decision |
|----------|----------|
| ≥95% | ✅ Excellent - Proceed with full batch immediately |
| 90-94% | ✅ Good - Proceed with full batch, expect some manual cleanup |
| 80-89% | ⚠️ Acceptable - Proceed but plan for more manual review |
| 70-79% | ⚠️ Marginal - Investigate failures before full batch |
| <70% | ❌ Too low - Do NOT proceed, fix enrichment logic first |

---

## Step 5: Decide Next Steps

### If Accuracy ≥90%: Proceed to Full Batch

You're ready for full enrichment:

```bash
# Create the full batch script (to be built next)
npx tsx scripts/enrich-all-source-dates.ts
```

This will:
- Process all ~200 authors
- Take 2-4 hours (with rate limiting)
- Cost ~$10-20 in Gemini Pro API calls
- Generate SQL update script

### If Accuracy 70-89%: Investigate First

Common failure patterns to check:

1. **Conference papers without dates in URL**
   - Solution: Enhance prompt with conference date database

2. **Blog posts on Medium/Substack without date in URL**
   - Solution: Add fallback to check HTML metadata

3. **YouTube videos**
   - Solution: Extract upload date from video page (requires web scraping)

4. **Paywalled articles**
   - Solution: Try Internet Archive / Google Scholar for metadata

### If Accuracy <70%: Stop and Debug

Don't proceed. Issues could be:

1. **Model not following instructions** - Review prompt in `lib/curation/agents.ts:73-111`
2. **Rate limiting causing poor outputs** - Increase delay between calls
3. **Training data cutoff** - Model can't "see" 2024+ content

---

## Step 6: Document Results

Create a summary document with:

```markdown
# Pilot Enrichment Results - [Date]

## Overview
- Authors tested: 10
- Sources processed: 87
- Manual verification sample: 25

## Accuracy
- Verified accurate: 23/25 (92%)
- High confidence: 18/25 (72%)
- Medium confidence: 5/25 (20%)
- Low confidence: 2/25 (8%)

## Common Success Patterns
1. ArXiv URLs → 100% accurate (date in URL structure)
2. Blog posts with date in path → 95% accurate
3. Conference papers → 85% accurate (inferred from venue)

## Common Failure Patterns
1. YouTube videos without date → 0% success
2. Medium posts without date → 30% success
3. Paywalled WSJ articles → Unable to verify

## Recommendation
✅ Proceed with full batch
- Expected accuracy: ~90%
- Expect ~150 sources to need manual review
- Budget 8 hours for manual cleanup
```

---

## Troubleshooting

### "Cannot find audit file"

You need to run the audit first:
```bash
npx tsx scripts/audit-source-dates.ts
```

### "Gemini API error (404)"

The model name has been updated. The scripts use the correct `gemini-2.5-pro` model.

### "Rate limit exceeded"

The script includes 2-second delays between authors. If you still hit limits:
- Reduce batch size (modify script to use fewer than 10 authors)
- Increase delay in script (change `2000` to `5000` milliseconds)

### "Out of memory"

Processing too many sources at once. The pilot script limits to 10 authors which should be safe.

---

## Cost Estimate

**Pilot (10 authors, ~80-100 sources):**
- Gemini Pro API calls: 10 × $0.05 = **$0.50**
- Manual verification time: 1 hour

**Full Batch (200 authors, ~1,600 sources):**
- Gemini Pro API calls: 200 × $0.05 = **$10**
- Manual verification time: 8 hours (for low-confidence only)

---

## Next Steps After Pilot

1. ✅ **Pilot accuracy ≥90%** → Create full batch enrichment script
2. ⚠️ **Pilot accuracy 70-89%** → Improve enrichment logic, re-run pilot
3. ❌ **Pilot accuracy <70%** → Debug thoroughly, consider alternative approaches

---

## Questions?

If you run into issues:
1. Check logs in console output
2. Review `pilot-enrichment-results.json` for patterns
3. Examine specific failures to understand root cause
4. Adjust the enrichment agent prompt if needed

The enrichment agent code is in: `lib/curation/agents.ts:67-138`

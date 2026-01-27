# Tier 1 Authors SQL - Execution Checklist

## Pre-Execution Validation

### 1. Database Schema Check
Run this query to verify tables exist:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('authors', 'camp_authors', 'camps');
```

Expected result: 3 rows (authors, camp_authors, camps)

### 2. Camp UUID Validation
Verify all camp UUIDs exist in your camps table:
```sql
SELECT id, name FROM camps WHERE id IN (
  'c5dcb027-cd27-4c91-adb4-aca780d15199', -- Scaling Will Deliver
  '207582eb-7b32-4951-9863-32fcf05944a1', -- Needs New Approaches
  'fe19ae2d-99f2-4c30-a596-c9cd92bff41b', -- Democratize Fast
  '7f64838f-59a6-4c87-8373-a023b9f448cc', -- Safety First
  '7e9a2196-87f8-4831-8e7f-b69f39fc4eb9', -- Tech Leads
  'f19021ab-a8db-4363-adec-c2228dad6298', -- Co-Evolution
  'fe9464df-b778-44c9-9593-7fb3294fa6c3', -- Business Whisperers
  'a076a4ce-f45e-4c50-a1a4-e4c74a5fe7bd', -- Tech Builders
  '331b2b02-fc85-454e-8c2d-e71d16faff0c', -- Innovation First
  'e8792297-e745-4c9f-a91d-4f87dd05cea2', -- Regulatory Interventionist
  'ee10cf4f-025a-47fc-be20-33d6756ec5cd', -- Adaptive Governance
  '76f0d8c5-c9a8-4a26-ae7e-18f787000e18', -- Displacement Realist
  'd8d3cec4-f8ce-49b1-9a43-bb0d952db371'  -- Human-AI Collaboration
);
```

Expected result: 13 rows with camp names matching comments in SQL file

### 3. Check for Duplicate Authors
Verify these authors don't already exist:
```sql
SELECT name FROM authors WHERE name IN (
  'Cassie Kozyrkov',
  'Lex Fridman',
  'Stuart Russell',
  'Eliezer Yudkowsky',
  'Demis Hassabis',
  'Mustafa Suleyman',
  'Kai-Fu Lee',
  'Jaron Lanier',
  'Tristan Harris'
);
```

Expected result: 0 rows (none should exist yet)

---

## Execution Steps

### Step 1: Open Transaction
```sql
BEGIN;
```

### Step 2: Execute SQL File
Load and run the entire ADD_TIER1_AUTHORS.sql file

### Step 3: Verification Queries

**Count new authors:**
```sql
SELECT COUNT(*) FROM authors
WHERE name IN (
  'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
  'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
  'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
);
```
Expected: 9

**Count new camp relationships:**
```sql
SELECT COUNT(*) FROM camp_authors ca
JOIN authors a ON ca.author_id = a.id
WHERE a.name IN (
  'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
  'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
  'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
);
```
Expected: 41

**Verify credibility tier:**
```sql
SELECT name, credibility_tier FROM authors
WHERE name IN (
  'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
  'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
  'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
);
```
Expected: All should have credibility_tier = 'tier_1'

**Verify all have quotes:**
```sql
SELECT a.name, COUNT(ca.id) as camp_count
FROM authors a
LEFT JOIN camp_authors ca ON a.id = ca.author_id
WHERE a.name IN (
  'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
  'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
  'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
)
GROUP BY a.name
ORDER BY a.name;
```
Expected:
- Cassie Kozyrkov: 4
- Lex Fridman: 5
- Stuart Russell: 4
- Eliezer Yudkowsky: 3
- Demis Hassabis: 5
- Mustafa Suleyman: 5
- Kai-Fu Lee: 5
- Jaron Lanier: 5
- Tristan Harris: 5

**Verify all quotes have sources:**
```sql
SELECT COUNT(*) FROM camp_authors ca
JOIN authors a ON ca.author_id = a.id
WHERE a.name IN (
  'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
  'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
  'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
)
AND (
  ca.key_quote IS NULL
  OR ca.quote_source_url IS NULL
  OR ca.why_it_matters IS NULL
);
```
Expected: 0 (all fields should be populated)

### Step 4: Commit or Rollback

If all verification queries pass:
```sql
COMMIT;
```

If any verification fails:
```sql
ROLLBACK;
```

---

## Post-Execution Validation

### 1. Sample Individual Author
```sql
SELECT
  a.name,
  a.primary_affiliation,
  a.credibility_tier,
  a.author_type,
  c.name as camp_name,
  ca.relevance,
  LEFT(ca.key_quote, 100) as quote_preview,
  ca.quote_source_url
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON ca.camp_id = c.id
WHERE a.name = 'Demis Hassabis'
ORDER BY c.name;
```

Expected: 5 rows showing all Demis Hassabis camp relationships

### 2. Check Coverage by Domain
```sql
SELECT
  c.domain,
  COUNT(DISTINCT ca.author_id) as author_count,
  COUNT(ca.id) as relationship_count
FROM camps c
JOIN camp_authors ca ON c.id = ca.camp_id
JOIN authors a ON ca.author_id = a.id
WHERE a.name IN (
  'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
  'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
  'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
)
GROUP BY c.domain
ORDER BY relationship_count DESC;
```

Expected distribution:
- AI & Society: ~13 relationships
- AI Governance: ~11 relationships
- AI Technical: ~7 relationships
- Future of Work: ~8 relationships
- Enterprise: ~6 relationships

### 3. Check Relevance Distribution
```sql
SELECT
  ca.relevance,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM camp_authors ca
JOIN authors a ON ca.author_id = a.id
WHERE a.name IN (
  'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
  'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
  'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
)
GROUP BY ca.relevance
ORDER BY count DESC;
```

Expected:
- strong: 28 (68%)
- partial: 9 (22%)
- challenges: 4 (10%)

---

## Troubleshooting

### Issue: RETURNING id not supported
Some databases don't support RETURNING clause. Fix:
1. Remove `) RETURNING id;` from INSERT INTO authors
2. Replace with `) RETURNING id;` → `);`
3. Get author_id separately:
```sql
SET @author_id = LAST_INSERT_ID();
```
4. Replace `FROM authors WHERE name = 'X'` with just `@author_id`

### Issue: UUID type not supported
If your database uses string for IDs:
- No changes needed, UUIDs will be cast to strings

### Issue: Single quote escaping
SQL file uses `''` for escaping single quotes (SQL standard)
If your database uses backslash escaping, run:
```bash
sed "s/''/\\\\'/g" ADD_TIER1_AUTHORS.sql > ADD_TIER1_AUTHORS_escaped.sql
```

### Issue: Transaction timeout
If transaction times out during execution:
1. Split into smaller batches (3 authors at a time)
2. Or increase transaction timeout:
```sql
SET SESSION max_execution_time = 300000; -- 5 minutes
```

---

## Success Criteria

✅ **Must Pass:**
1. All 9 authors inserted with credibility_tier = 'tier_1'
2. All 41 camp_author relationships created
3. No NULL values in key_quote, quote_source_url, or why_it_matters
4. All camp UUIDs match existing camps
5. All author names unique (no duplicates)

✅ **Quality Checks:**
6. Quotes are 60-150 words
7. Why_it_matters are 80-180 words
8. Quote sources are valid URLs
9. Relevance values are 'strong', 'partial', or 'challenges'
10. Author types match: researcher/executive/practitioner/advocate

---

## Rollback Plan

If issues are discovered after commit:
```sql
-- Remove camp relationships
DELETE FROM camp_authors ca
USING authors a
WHERE ca.author_id = a.id
AND a.name IN (
  'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
  'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
  'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
);

-- Remove authors
DELETE FROM authors
WHERE name IN (
  'Cassie Kozyrkov', 'Lex Fridman', 'Stuart Russell',
  'Eliezer Yudkowsky', 'Demis Hassabis', 'Mustafa Suleyman',
  'Kai-Fu Lee', 'Jaron Lanier', 'Tristan Harris'
);
```

---

## Next Steps After Successful Execution

1. **Update Frontend Cache:** Refresh any cached author lists
2. **Test Search:** Verify new authors appear in author search
3. **Test Filtering:** Verify camp filters include new authors
4. **Check Display:** Verify author bios and quotes render correctly
5. **Monitor Performance:** Check query performance with 9 new authors + 41 relationships

---

## Documentation Updates Needed

After successful execution:
1. Update author count in system documentation
2. Update tier 1 author list in any readme files
3. Note execution date and user who ran the script
4. Archive this SQL file with timestamp

---

## Maintenance Notes

**Quote Source URLs:**
- Periodically check that URLs are still live (some may move or break)
- Book URLs should remain stable (publisher permalinks)
- YouTube/podcast URLs are stable
- Social media links may change if accounts are renamed
- News article URLs should use archive.org backups if they break

**Author Affiliations:**
- Affiliations may change over time
- Update primary_affiliation field if authors switch roles
- Demis Hassabis: DeepMind CEO (stable)
- Mustafa Suleyman: Microsoft AI CEO (as of 2024)
- Kai-Fu Lee: Sinovation CEO (stable)
- Others: Relatively stable positions

**Credibility Tier:**
- Tier 1 is for top ~10 most influential voices
- Maintain selectivity - don't inflate tier 1 to include too many authors
- Review tier assignments annually

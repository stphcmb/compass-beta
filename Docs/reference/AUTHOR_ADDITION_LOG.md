# Author Addition Log

## Purpose
Track all author additions to maintain data provenance and enable audit trails.

---

## 2024-12-02: Initial Tier 1 Expansion

### Authors Added/Updated
1. **Lex Fridman** (MIT, Podcast Host) - ✅ COMPLETE
   - Camps: 5 (Scaling, Safety, Democratize, Governance, Work)
   - All with domain-specific quotes and why_it_matters
   - Sources: 4 (Podcast, YouTube, Research, Papers)
   - Status: Live in database

2. **Cassie Kozyrkov** (Former Google, Kozyr) - ✅ COMPLETE
   - Updated to Tier 1: "Major Voice" (was "Thought Leader")
   - Camps: 4 (Technical-Scaling challenges, Enterprise-Business Whisperers, Enterprise-Co-Evolution, Work-Collaboration)
   - All with domain-specific quotes and why_it_matters
   - Sources: 3 (HBR Article, Company, Course)
   - Status: Live in database

### Authors Already in Database
- **Stuart Russell** (UC Berkeley) - Already existed

### Remaining Tier 1 Authors (Approved, Ready to Add)
SQL files prepared in `/Docs/data/seed/tier1_remaining/`:

2. **Eliezer Yudkowsky** (MIRI) - 3 camps
   - File: `add_eliezer.sql`
   - Camps: Needs New Approaches, Safety First, Regulatory Interventionist

3. **Demis Hassabis** (Google DeepMind) - 5 camps
   - File: `add_demis.sql`
   - Camps: Scaling, Safety, Adaptive Governance, Tech Builders, Human-AI Collab

4. **Mustafa Suleyman** (Microsoft AI) - 5 camps
   - File: `add_mustafa.sql`
   - Camps: Scaling (partial), Safety, Regulatory, Co-Evolution, Displacement

5. **Kai-Fu Lee** (Sinovation Ventures) - 5 camps
   - File: `add_kai_fu.sql`
   - Camps: Scaling, Democratize (partial), Innovation First, Tech Leads, Displacement

6. **Jaron Lanier** (Microsoft Research) - 5 camps
   - File: `add_jaron.sql`
   - Camps: Needs New, Safety (different angle), Democratize (challenges), Regulatory, Collab (partial)

7. **Tristan Harris** (Center for Humane Tech) - 5 camps
   - File: `add_tristan.sql`
   - Camps: Safety, Democratize (challenges), Regulatory, Adaptive (challenges), Displacement

### How to Add Remaining Authors

Each can be added independently:

```bash
# Add one at a time
node --env-file=.env.local -e "
import('dotenv/config').then(() => {
  import('pg').then(async (pkg) => {
    const { default: pg } = pkg;
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const fs = await import('fs');
    const sql = fs.readFileSync('Docs/data/seed/tier1_remaining/add_[author].sql', 'utf8');
    await pool.query(sql);
    console.log('✅ [Author] added');
    await pool.end();
  });
});
"

# Or add all at once
cat Docs/data/seed/tier1_remaining/*.sql | psql $DATABASE_URL
```

### Total Impact
- **Before**: 32 authors, 91 relationships
- **After Lex**: 33 authors, 96 relationships
- **After All Tier 1**: 39 authors, ~132 relationships (+45%)

---

## Future Additions

### Tier 2 Candidates (12 authors from original list)
When ready to expand further:
- Andrew McAfee (MIT)
- Joy Buolamwini (Algorithmic Justice League)
- Arvind Narayanan (Princeton)
- Daniel Dennett (Philosopher)
- Paul Christiano (ARC)
- Melanie Mitchell (Santa Fe Institute)
- Nathan Labenz (Cognitive Revolution)
- Emad Mostaque (Stability AI)
- Jack Clark (Anthropic)
- Helen Toner (Georgetown CSET)
- Connor Leahy (Conjecture)
- Rumman Chowdhury (Humane Intelligence)

### Process for Future Additions
1. Use `/Docs/AUTHOR_ADDITION_TEMPLATE.md` as guide
2. Create SQL file in appropriate directory
3. Test locally first
4. Add to this log
5. Commit with message: "Add [N] authors: [names]"

---

## Quality Standards

Every author addition must include:
- ✅ Proper affiliation and credentials
- ✅ Credibility tier assignment
- ✅ **3+ sources** (JSONB array: url, type, year, title) - REQUIRED!
- ✅ 2-5 camp relationships
- ✅ Domain-specific quotes (60-150 words each)
- ✅ Quote source URLs (should match author sources when possible)
- ✅ "Why it matters" context (80-180 words each)
- ✅ Testing in search results before commit

### Source Requirements (NEW - MANDATORY)
Each author MUST have at least 3 sources in JSONB format:
```json
[
  {"url": "...", "type": "Book|Paper|Podcast|etc", "year": "2024", "title": "..."},
  {"url": "...", "type": "...", "year": "...", "title": "..."},
  {"url": "...", "type": "...", "year": "...", "title": "..."}
]
```

**See `/Docs/AUTHOR_ADDITION_GUIDE.md` for complete details on source requirements.**

---

## Maintenance Notes

- **Schema**: Authors table uses `notes` field (not `bio`)
- **No social media fields**: x_handle, linkedin_url don't exist in current schema
- **UUID format**: All camp IDs must use proper UUID format
- **Transaction safety**: Wrap multi-author adds in BEGIN/COMMIT
- **Verification**: Always test search results after adding

---

## Related Documents
- `/Docs/AUTHOR_ADDITION_TEMPLATE.md` - Step-by-step guide
- `/scripts/get_camp_ids.mjs` - Get camp UUIDs for mapping
- `/scripts/check_authors_schema.mjs` - Verify table schema

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

## 2026-01-07: Major Expansion - 20 New Authors

### Authors Added
Added 20 new high-credibility authors with diverse/emerging/contrarian viewpoints:

**AI Technical Capabilities - Scaling Will Deliver:**
1. **Noam Brown** (OpenAI) - Major Voice, Researcher
2. **Jason Wei** (OpenAI) - Major Voice, Researcher
3. **Jared Kaplan** (Anthropic) - Seminal Thinker, Researcher

**AI Technical Capabilities - Needs New Approaches:**
4. **Melanie Mitchell** (Santa Fe Institute) - Major Voice, Academic
5. **Michael I. Jordan** (UC Berkeley) - Seminal Thinker, Academic

**AI & Society - Democratize Fast:**
6. **Arthur Mensch** (Mistral AI) - Major Voice, Industry Leader
7. **Chris Lattner** (Modular AI) - Major Voice, Industry Leader
8. **Sara Hooker** (Cohere) - Major Voice, Researcher
9. **George Hotz** (comma.ai/tinygrad) - Major Voice, Industry Leader
10. **Guillaume Lample** (Mistral AI) - Major Voice, Researcher

**AI & Society - Safety First:**
11. **Neel Nanda** (Google DeepMind) - Major Voice, Researcher
12. **Evan Hubinger** (Anthropic) - Major Voice, Researcher

**AI Governance - Adaptive Governance:**
13. **Helen Toner** (Georgetown CSET) - Major Voice, Policy Expert
14. **Matt Clifford** (Entrepreneur First/UK Gov) - Major Voice, Policy Expert

**AI Governance - Innovation First:**
15. **Alexandr Wang** (Scale AI) - Major Voice, Industry Leader

**Future of Work - Displacement Realist:**
16. **Martin Ford** (Author/Futurist) - Major Voice, Public Intellectual
17. **Kai-Fu Lee** (Sinovation Ventures) - Seminal Thinker, Industry Leader
18. **Mary L. Gray** (Microsoft Research) - Major Voice, Academic

**Future of Work - Human-AI Collaboration:**
19. **Jaime Teevan** (Microsoft) - Major Voice, Industry Leader
20. **Dwarkesh Patel** (Dwarkesh Podcast) - Major Voice, Public Intellectual

### Challenge Relationships Added
- Melanie Mitchell → challenges "Scaling Will Deliver"
- Michael I. Jordan → challenges "Scaling Will Deliver"
- Evan Hubinger → challenges "Democratize Fast"
- Martin Ford → challenges "Human-AI Collaboration"

### SQL Script Location
`/scripts/add_20_authors.sql`

### Total Impact
- **Before**: ~121 authors
- **After**: 141 authors, 24 new camp relationships

---

## Future Additions

### Remaining Candidates
- Andrew McAfee (MIT)
- Joy Buolamwini (Algorithmic Justice League)
- Arvind Narayanan (Princeton)
- Daniel Dennett (Philosopher)
- Paul Christiano (ARC)
- Nathan Labenz (Cognitive Revolution)
- Emad Mostaque (Stability AI)
- Jack Clark (Anthropic)
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

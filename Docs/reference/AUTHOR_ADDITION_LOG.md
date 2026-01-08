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

## 2026-01-08: Trending AI Technical Capabilities - 15 New Authors

### Authors Added
Added 15 new authors focused on trending/emerging AI technical topics:

**AI Infrastructure & Systems:**
1. **Matei Zaharia** (Databricks) - Pioneer, Industry Leader - Compound AI systems
2. **Edo Liberty** (Pinecone) - Field Leader, Industry Leader - Vector databases & RAG
3. **Tri Dao** (Together AI) - Field Leader, Researcher - FlashAttention

**Scaling Research (Transformers/Architecture):**
4. **Quoc Le** (Google DeepMind) - Pioneer, Researcher - Transformer co-inventor
5. **Barret Zoph** (Google DeepMind) - Field Leader, Researcher - NAS, Gemini, PaLM
6. **Sholto Douglas** (Google DeepMind) - Domain Expert, Researcher - Chinchilla/scaling laws
7. **Yi Tay** (Reka AI) - Field Leader, Researcher - UL2, Flan, multimodal

**Open Source AI:**
8. **Thomas Wolf** (Hugging Face) - Field Leader, Industry Leader - Transformers library
9. **Hugo Touvron** (Meta AI) - Field Leader, Researcher - Llama lead author
10. **Jason Phang** (EleutherAI) - Domain Expert, Researcher - Pythia, GPT-NeoX

**Data-Centric AI & Alternative Approaches:**
11. **Chris Ré** (Stanford/Together AI) - Field Leader, Academic - Data-centric AI, Snorkel, Mamba

**AI Safety (Technical):**
12. **Jacob Steinhardt** (UC Berkeley) - Field Leader, Academic - ML Safety

**AI Reasoning & Code:**
13. **Kanjun Qiu** (Imbue) - Domain Expert, Industry Leader - Reasoning systems

**Education & Investment:**
14. **Sebastian Raschka** (Lightning AI) - Domain Expert, Researcher - LLM education
15. **Sarah Catanzaro** (Amplify Partners) - Domain Expert, Investor - AI infrastructure investing

### Camp Relationships Added
- Matei Zaharia → Tech Builders (strong), Co-Evolution (partial)
- Quoc Le → Scaling Will Deliver (strong)
- Barret Zoph → Scaling Will Deliver (strong)
- Tri Dao → Tech Builders (strong), Democratize Fast (partial)
- Chris Ré → Needs New Approaches (strong)
- Jacob Steinhardt → Safety First (strong)
- Edo Liberty → Tech Builders (strong)
- Thomas Wolf → Democratize Fast (strong)
- Sholto Douglas → Scaling Will Deliver (strong)
- Yi Tay → Tech Builders (strong)
- Kanjun Qiu → Human-AI Collaboration (strong)
- Sebastian Raschka → Tech Builders (partial)
- Jason Phang → Democratize Fast (strong)
- Sarah Catanzaro → Innovation First (strong)
- Hugo Touvron → Democratize Fast (strong)

### SQL Script Location
`/scripts/add_trending_ai_authors.sql`

### Total Impact
- **Before**: ~200 authors
- **After**: ~215 authors, 17 new camp relationships

---

## 2026-01-07: Emerging Topics Expansion - 17 New Authors

### Focus Areas
Added authors covering emerging AI topics not previously well-represented:
- **Vibe Coding / AI Dev Tools** - The new paradigm of AI-assisted programming
- **Multi-Agent Systems** - Framework creators shaping how AI agents collaborate
- **AI Infrastructure** - Leaders building the compute and deployment layer
- **Open Source AI** - Champions of democratized AI research
- **AI Economics/Skepticism** - Voices providing critical analysis of AI claims

### Authors Added

**Vibe Coding / AI Dev Tools:**
1. **Amjad Masad** (Replit) - Major Voice, Industry Leader - Coined "vibe coding"
2. **Michael Truell** (Cursor) - Major Voice, Industry Leader - AI-native code editor
3. **Swyx** (Latent Space) - Major Voice, Public Intellectual - Coined "AI Engineer"
4. **Varun Mohan** (Codeium) - Thought Leader, Industry Leader - Enterprise AI coding

**Multi-Agent Systems:**
5. **Jerry Liu** (LlamaIndex) - Major Voice, Industry Leader - RAG pioneer
6. **Joao Moura** (CrewAI) - Emerging Voice, Industry Leader - Multi-agent frameworks
7. **Yohei Nakajima** (Untapped Capital) - Major Voice, Investor - Created BabyAGI

**AI Infrastructure:**
8. **Erik Bernhardsson** (Modal) - Major Voice, Industry Leader - Serverless ML
9. **Ben Firshman** (Replicate) - Major Voice, Industry Leader - Model deployment
10. **Vipul Ved Prakash** (Together AI) - Major Voice, Industry Leader - Open AI infra
11. **Clem Delangue** (Hugging Face) - Major Voice, Industry Leader - TIME 100 AI

**Open Source AI / Research:**
12. **Stella Biderman** (EleutherAI) - Major Voice, Researcher - Open-source AI pioneer
13. **Tri Dao** (Princeton/Together AI) - Major Voice, Researcher - FlashAttention creator
14. **Nathan Lambert** (AI2) - Major Voice, Researcher - RLHF expert

**AI Economics / Critical Analysis:**
15. **Gary Sheng** (Civitas) - Emerging Voice, Public Intellectual - AI skeptic
16. **Sayash Kapoor** (Princeton) - Emerging Voice, Academic - AI Snake Oil co-author
17. **Nathan Labenz** (Cognitive Revolution) - Major Voice, Public Intellectual - Deep AI interviews

### Camp Assignments Summary
| Camp | New Authors |
|------|-------------|
| Democratize Fast | 7 (Amjad, Swyx, Ben, Vipul, Clem, Stella, Andrej*) |
| Human-AI Collaboration | 6 (Amjad, Michael, Swyx, Joao, Varun, Nathan L.) |
| Tech Builders | 5 (Michael, Yohei, Jerry, Erik, Varun) |
| Scaling Will Deliver | 2 (Tri, Nathan L.) |
| Safety First | 2 (Clem, Nathan Lambert) |
| Needs New Approaches | 2 (Sayash, Gary) |

*Note: Andrej Karpathy, Arvind Narayanan, Harrison Chase already existed in database

### SQL Script Location
`/scripts/add_emerging_topics_authors.sql`

### Total Impact
- **Before**: 141 authors, 244 camp relationships
- **After**: 158 authors, 267 camp relationships
- Net addition: 17 authors, 23 camp relationships

---

## 2026-01-08: Major Expansion to 200 Authors

### Focus Areas
Comprehensive expansion covering all major AI viewpoints:
- **AI Safety Researchers** - Technical alignment experts
- **Enterprise/Consulting** - Business AI practitioners
- **Policy & Governance** - Legal and regulatory experts
- **International Voices** - Global AI leaders
- **Emerging Researchers** - Next-generation thinkers
- **Creative AI** - Artists exploring AI ethics
- **Robotics & Embodiment** - Physical AI systems

### Authors Added (42 new)

**Enterprise & Business:**
- Thomas Davenport, Ethan Mollick, Azeem Azhar, Andrew McAfee
- Ajay Agrawal, Avi Goldfarb, Chip Huyen, Cassie Kozyrkov

**AI Safety & Alignment:**
- Jan Leike, Paul Christiano, Connor Leahy, Chris Olah
- Robert Miles, Max Tegmark

**Policy & Governance:**
- Alondra Nelson, Amba Kak, Woodrow Hartzog, Margot Kaminski
- Bruce Schneier, Marietje Schaake

**AI Ethics & Society:**
- Joy Buolamwini, Meredith Broussard, Ruha Benjamin
- Kate Crawford, Safiya Noble, Rumman Chowdhury

**Startups & Industry:**
- Aravind Srinivas, David Luan, Noam Shazeer, Emad Mostaque
- Mira Murati, Kevin Scott, Lisa Su, Douwe Kiela

**Research & Academia:**
- Yejin Choi, Percy Liang, Oriol Vinyals, John Schulman
- Pushmeet Kohli, Daphne Koller, Chelsea Finn, Sergey Levine
- David Silver, Josh Tenenbaum, Daniela Rus, Pieter Abbeel
- Been Kim, Rediet Abebe

**International:**
- Francesca Rossi, Ricardo Baeza-Yates, Ying Lu, Jianfeng Gao

**Creative & Media:**
- Holly Herndon, Mat Dryhurst, Yannic Kilcher

### Schema Updates
- Added `view_evolution_notes` column to `camp_authors` table
- Documents when authors change their positions over time
- Examples: Geoffrey Hinton (safety pivot), Ilya Sutskever (SSI founding)

### Database Statistics
| Metric | Before | After |
|--------|--------|-------|
| Authors | 158 | 200 |
| Camp Relationships | 267 | 306 |
| Avg camps/author | 1.69 | 1.53 |

### Camp Distribution (Final)
| Camp | Authors |
|------|---------|
| Safety First | 41 |
| Democratize Fast | 29 |
| Human-AI Collaboration | 25 |
| Needs New Approaches | 25 |
| Scaling Will Deliver | 25 |
| Business Whisperers | 24 |
| Tech Builders | 21 |
| Regulatory Interventionist | 21 |
| Technology Leads | 21 |
| Co-Evolution | 20 |
| Adaptive Governance | 19 |
| Innovation First | 19 |
| Displacement Realist | 16 |

---

## 2026-01-08: Author-Level Quote Fix

### Issue Identified
121 authors were missing `key_quote` and `quote_source_url` at the author level (on the `authors` table). While camp-level quotes were complete, author-level quotes were empty.

### Fix Applied
Created and ran `scripts/fix_missing_author_quotes.mjs` to add representative quotes for all 121 authors.

### Authors Updated
All 121 authors including:
- Ajay Agrawal, Alexandr Wang, Alondra Nelson, Amjad Masad
- François Chollet, Harrison Chase, Jan Leike, Mira Murati
- Ted Chiang, Tri Dao, Yohei Nakajima, and 110 others

### Database Statistics After Fix
| Metric | Value |
|--------|-------|
| Total authors | 200 |
| Authors with key_quote | 200 (100%) |
| Authors with quote_source_url | 200 (100%) |
| Camp relationships | 315 |
| Camp relationships with key_quote | 315 (100%) |
| Camp relationships with why_it_matters | 315 (100%) |

### Documentation Updated
- Updated `AUTHOR_DATABASE_GUIDE.md` to clarify two-level quote requirements
- Added verification commands to pre-commit checklist
- Added reference to fix script for future maintenance

---

## Future Additions

### Remaining Candidates
- Andrew McAfee (MIT)
- Joy Buolamwini (Algorithmic Justice League)
- Daniel Dennett (Philosopher)
- Paul Christiano (ARC)
- Emad Mostaque (Stability AI)
- Jack Clark (Anthropic)
- Connor Leahy (Conjecture)
- Rumman Chowdhury (Humane Intelligence)

### Process for Future Additions
1. Use `/Docs/reference/AUTHOR_DATABASE_GUIDE.md` as guide (consolidated)
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

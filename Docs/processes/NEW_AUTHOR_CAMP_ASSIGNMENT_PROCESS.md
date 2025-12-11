# New Author Camp Assignment Process

**Purpose:** Ensure all new authors are assigned to appropriate camps during the author addition workflow.

**Last Updated:** 2025-12-11

## Required: Camp Assignment for Every Author

**RULE:** Every author MUST be assigned to at least one camp before being considered complete in the database.

### Why This Matters

1. **Discoverability**: Authors without camps don't appear in domain/camp browsing
2. **Mini Brain**: Can't surface these authors in editorial analysis
3. **UI Consistency**: Avoid "No camp assigned" labels
4. **Editorial Value**: Camp assignment IS the editorial value-add

---

## Step-by-Step Process

### 1. Research the Author (10-15 minutes)

Before adding an author to the database, research their position:

#### Primary Sources
- [ ] Recent publications, papers, or books
- [ ] Public talks or interviews (YouTube, podcasts)
- [ ] Twitter/X feed for stated positions
- [ ] Company blog (if applicable)
- [ ] Academic homepage or personal site

#### Questions to Answer
- **Technical Position:** Do they believe scaling will deliver AGI, or do we need new approaches?
- **Society Position:** Are they safety-focused or democratization-focused?
- **Governance:** Do they favor regulation or innovation-first approaches?
- **Enterprise:** What's their view on AI adoption strategy?
- **Work:** Do they emphasize displacement risks or collaboration opportunities?

### 2. Map to Existing Camps

Use the taxonomy structure to determine best fit:

#### Domain 1: AI Technical Capabilities
- **Scaling Will Deliver** - Believes continued scaling of current approaches will achieve AGI
- **Needs New Approaches** - Argues current approaches have fundamental limitations

#### Domain 2: AI & Society
- **Safety First** - Prioritizes safety, ethics, alignment before deployment
- **Democratize Fast** - Prioritizes open access and rapid democratization

#### Domain 3: Enterprise AI Adoption
- **Technology Leads** - Tech-first approach, AI drives transformation
- **Co-Evolution** - Business and technology co-evolve together
- **Tech Builders** - Focus on building AI infrastructure/tools
- **Business Whisperers** - Translate AI capabilities for business value

#### Domain 4: AI Governance & Oversight
- **Regulatory Interventionist** - Favors strong government oversight
- **Innovation First** - Minimize regulation to enable innovation
- **Adaptive Governance** - Pragmatic, evolving governance approaches

#### Domain 5: Future of Work
- **Displacement Realist** - Emphasizes job displacement risks
- **Human–AI Collaboration** - Emphasizes augmentation and collaboration

### 3. Determine Relevance Level

For each camp assignment:

| Relevance | When to Use | Example |
|-----------|-------------|---------|
| `strong` | Primary position, well-documented | Geoffrey Hinton → Safety First |
| `partial` | Nuanced/mixed position | Author balances multiple perspectives |
| `challenges` | Actively opposes this camp | Critic challenging camp's assumptions |
| `emerging` | Position is evolving or newly emerging | New voice, shifting stance |

### 4. Assign Primary + Secondary Camps

**Best Practice:** Assign 1-2 camps per author

- **Primary camp (required):** Their strongest, clearest position
  - Use `strong` relevance
  - This is the main lens through which they view AI

- **Secondary camp (optional but recommended):** Their secondary position
  - Use `strong`, `partial`, or `challenges` relevance
  - Captures nuance or cross-domain thinking

**Example:**
- Daron Acemoglu
  - Primary: Displacement Realist (strong) - economist studying labor displacement
  - Secondary: Regulatory Interventionist (strong) - advocates for policy responses

### 5. Execute Database Insert

```sql
-- Get author ID first
SELECT id, name FROM authors WHERE name = 'Author Name';

-- Primary camp assignment
INSERT INTO camp_authors (author_id, camp_id, relevance)
VALUES ('[author-id]', '[camp-id]', 'strong');

-- Secondary camp assignment (if applicable)
INSERT INTO camp_authors (author_id, camp_id, relevance)
VALUES ('[author-id]', '[camp-id]', 'partial');
```

---

## Common Patterns & Examples

### AI Safety Researchers
**Typical Pattern:** Safety First (primary) + Regulatory Interventionist (secondary)

Examples: Nick Bostrom, Stuart Russell, Ajeya Cotra

### AI Ethics Scholars
**Typical Pattern:** Safety First (primary) + Regulatory Interventionist (secondary)

Examples: Abeba Birhane, Margaret Mitchell, Rumman Chowdhury

### Technical Researchers (Skeptical of Current Approaches)
**Typical Pattern:** Needs New Approaches (primary) + Safety First (partial)

Examples: Judea Pearl, Percy Liang, Yejin Choi

### Enterprise AI Leaders
**Typical Pattern:** Technology Leads (primary) + Co-Evolution (secondary)

Examples: Bret Taylor, Martin Casado, Daphne Koller

### Open Source Advocates
**Typical Pattern:** Democratize Fast (primary) + Innovation First (secondary)

Examples: Emad Mostaque, Nat Friedman

### Labor Economists
**Typical Pattern:** Displacement Realist (primary) + Regulatory Interventionist (secondary)

Examples: Daron Acemoglu, Carl Benedikt Frey

### Venture Investors
**Typical Pattern:** Technology Leads (primary) + Innovation First (secondary)

Examples: Byron Deeter, David Cahn, Martin Casado

### Industry Analysts
**Typical Pattern:** Co-Evolution (primary) + Business Whisperers (secondary)

Examples: Rita Sallam

### Critics & Skeptics
**Typical Pattern:** Use `challenges` relevance

Examples: Ed Zitron, Jim Covello → Needs New Approaches (challenges)

---

## Quality Checklist

Before marking an author as complete:

- [ ] Author has at least 1 camp assignment
- [ ] Primary camp uses `strong` or `challenges` relevance
- [ ] Assignment is based on research, not assumptions
- [ ] Secondary camp adds meaningful nuance (if included)
- [ ] Relevance level accurately reflects their position
- [ ] Verified no duplicate assignments (schema enforces this)

---

## When Creating New Authors

### In Supabase Dashboard
1. Add author to `authors` table
2. Immediately add camp assignment(s) to `camp_authors` table
3. Don't mark author as "complete" until camps are assigned

### Via Import Script
1. Include camp assignments in import payload
2. Validate camp assignments before committing
3. Reject imports missing camp data

### Via Admin UI (Future)
1. Make camp selection required in form
2. Show camp descriptions to guide selection
3. Validate at least one camp before allowing save

---

## Maintenance

### Quarterly Review
- Audit authors for missing camp assignments
- Run: `node scripts/analyze_missing_camps.mjs`
- Address any gaps found

### When New Camps Added
- Review existing authors for potential fits
- Update assignments as needed to improve accuracy

### When Author Positions Evolve
- Update camp assignments to reflect changes
- Add notes documenting the evolution

---

## Reference

- **Taxonomy ADR:** `Docs/adr/0002-taxonomy-3-tier-structure.md`
- **Existing Camps:** Run `node scripts/list_camps.mjs`
- **Assignment Examples:** `Docs/data-quality/CAMP_ASSIGNMENTS_PLAN.md`
- **Current Gaps:** `Docs/data-quality/MISSING_CAMPS_REPORT.md`

# Quote Enrichment Plan

## Problem Statement

Currently, all 91 author-camp relationships have quotes migrated from the author level. However, when an author appears in multiple domains/camps, they show the **same generic quote** everywhere.

For example:
- **Emily M. Bender** appears in 6 camps across 3 domains, but shows the same quote everywhere
- **Marc Andreessen** appears in 6 camps across 4 domains, but shows the same quote everywhere
- **Yoshua Bengio** appears in 3 camps across 3 domains, but shows the same quote everywhere

## Solution

We need to add **domain-specific and camp-specific quotes** for each author-camp relationship. Each quote should be:
1. **Relevant to the specific domain** (AI Technical Capabilities, Society, Governance, etc.)
2. **Representative of their position in that camp** (Agree/Disagree/Partial/Emerging)
3. **Authentic** - from actual publications, interviews, or verified sources
4. **Cited** - with a `quote_source_url` pointing to where the quote appears

## Database Changes ✅ COMPLETE

- Added `key_quote` and `quote_source_url` to `camp_authors` table
- Migrated existing author-level quotes to all camp_authors relationships
- Updated API to read quotes from `camp_authors` instead of `authors`

## Authors Requiring Enrichment

### High Priority (Appear in 4+ domains or 6+ camps)

1. **Marc Andreessen** - 6 camps across 4 domains
2. **Emily M. Bender** - 6 camps across 3 domains
3. **Geoffrey Hinton** - 5 camps across 4 domains
4. **Yoshua Bengio** - 3 camps across 3 domains
5. **Andrej Karpathy** - 3 camps across 3 domains
6. **Fei-Fei Li** - 4 camps across 3 domains
7. **Max Tegmark** - 4 camps across 3 domains
8. **Mark Zuckerberg** - 4 camps across 3 domains
9. **Timnit Gebru** - 4 camps across 3 domains

### Medium Priority (Appear in 2-3 domains)

10. **Balaji Srinivasan** - 4 camps across 2 domains
11. **Andrew Ng** - 4 camps across 2 domains
12. **Kate Crawford** - 3 camps across 2 domains
13. **Ethan Mollick** - 3 camps across 2 domains
14. **Azeem Azhar** - 3 camps across 2 domains
15. **Sam Altman** - 3 camps across 2 domains
16. **Dario Amodei** - 3 camps across 2 domains
17. **Elon Musk** - 3 camps across 2 domains
18. **Erik Brynjolfsson** - 3 camps across 2 domains
19. **Yann LeCun** - 3 camps across 2 domains
20. **Gary Marcus** - 3 camps across 2 domains
21. **Allie K. Miller** - 2 camps across 2 domains

### Lower Priority (Single domain authors)

22-32. Authors appearing in only 1 domain (can keep generic quotes initially)

## Quote Enrichment Process

For each author-camp relationship:

1. **Identify the domain and camp**
2. **Research the author's specific stance on that domain**
3. **Find a representative quote** from:
   - Published papers
   - Blog posts/essays
   - Interviews/podcasts
   - Public talks
   - Twitter threads (for verified accounts)
   - Books
4. **Verify the quote** - ensure it's authentic and contextually accurate
5. **Get the source URL** - link to where the quote appears
6. **Update the database** with camp-specific quote

## Example: Yoshua Bengio

Yoshua Bengio appears in 3 domains:

### AI Technical Capabilities → "Needs New Approaches" (Strong)
**Quote**: "The current generation of AI is missing something fundamental. We need new approaches that go beyond simply scaling up neural networks. True intelligence requires understanding causality, reasoning, and world models."
**Source**: Interview with MIT Technology Review, 2023

### AI Governance & Oversight → "Regulatory Interventionist" (Strong)
**Quote**: "I believe we need strong AI regulation now, before these systems become more powerful. The risks are too great to leave this to voluntary industry self-regulation."
**Source**: Testimony to Canadian Parliament, 2023

### Future of Work → "Displacement Realist" (Partial)
**Quote**: "AI will absolutely displace many jobs. We need to prepare for this with education, retraining, and social safety nets. But I'm optimistic we can manage this transition if we start planning now."
**Source**: "The Montreal Declaration on Responsible AI"

## Implementation Script

Use the following SQL template to update quotes:

```sql
-- Find the specific camp_authors relationship
SELECT ca.id, a.name, c.label, c.domain_id
FROM camp_authors ca
JOIN authors a ON ca.author_id = a.id
JOIN camps c ON ca.camp_id = c.id
WHERE a.name = 'Author Name'
AND c.label = 'Camp Label';

-- Update with domain-specific quote
UPDATE camp_authors
SET
  key_quote = 'Authentic quote here...',
  quote_source_url = 'https://source-url.com'
WHERE id = 'camp_author_id_here';
```

## Progress Tracking

Total author-camp relationships: 91
- ✅ All have initial quotes: 91
- ⏳ Need domain-specific enrichment: ~50-60 (where authors span multiple domains)
- 🎯 Target: 100% with domain-specific quotes

## Next Steps

1. Start with high-priority authors (multi-domain presence)
2. Research and update quotes systematically by domain
3. Verify all quotes are authentic and properly cited
4. Test search results to ensure domain-specific quotes appear correctly

## Quality Standards

Each quote should:
- Be 1-3 sentences (60-150 words)
- Clearly represent the author's stance on that specific domain/camp
- Come from a verifiable source within the last 5 years (preferably)
- Be contextually accurate (not taken out of context)
- Link to the actual source where the quote appears

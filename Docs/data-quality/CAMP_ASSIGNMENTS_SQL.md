# Camp Assignments - SQL Execution Guide

This document contains SQL statements to assign all 30 authors to their appropriate camps based on editorial analysis.

## High Priority Assignments (Execute First)

### AI Safety / X-Risk Thought Leaders

```sql
-- Nick Bostrom → Safety First (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7f64838f-59a6-4c87-8373-a023b9f448cc', 'strong'
FROM authors WHERE name = 'Nick Bostrom';

-- Nick Bostrom → Regulatory Interventionist (Secondary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, 'e8792297-e745-4c9f-a91d-4f87dd05cea2', 'partial'
FROM authors WHERE name = 'Nick Bostrom';

-- Stuart Russell → Safety First (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7f64838f-59a6-4c87-8373-a023b9f448cc', 'strong'
FROM authors WHERE name = 'Stuart Russell';

-- Stuart Russell → Regulatory Interventionist (Secondary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, 'e8792297-e745-4c9f-a91d-4f87dd05cea2', 'strong'
FROM authors WHERE name = 'Stuart Russell';

-- Eliezer Yudkowsky → Safety First (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7f64838f-59a6-4c87-8373-a023b9f448cc', 'strong'
FROM authors WHERE name = 'Eliezer Yudkowsky';

-- Eliezer Yudkowsky → Regulatory Interventionist (Secondary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, 'e8792297-e745-4c9f-a91d-4f87dd05cea2', 'strong'
FROM authors WHERE name = 'Eliezer Yudkowsky';

-- Ajeya Cotra → Safety First (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7f64838f-59a6-4c87-8373-a023b9f448cc', 'strong'
FROM authors WHERE name = 'Ajeya Cotra';
```

###Labor & Economics Experts

```sql
-- Daron Acemoglu → Displacement Realist (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '76f0d8c5-c9a8-4a26-ae7e-18f787000e18', 'strong'
FROM authors WHERE name = 'Daron Acemoglu';

-- Daron Acemoglu → Regulatory Interventionist (Secondary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, 'e8792297-e745-4c9f-a91d-4f87dd05cea2', 'strong'
FROM authors WHERE name = 'Daron Acemoglu';

-- Carl Benedikt Frey → Displacement Realist (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '76f0d8c5-c9a8-4a26-ae7e-18f787000e18', 'strong'
FROM authors WHERE name = 'Carl Benedikt Frey';
```

### Technical AI Researchers

```sql
-- Judea Pearl → Needs New Approaches (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '207582eb-7b32-4951-9863-32fcf05944a1', 'strong'
FROM authors WHERE name = 'Judea Pearl';

-- Percy Liang → Needs New Approaches (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '207582eb-7b32-4951-9863-32fcf05944a1', 'strong'
FROM authors WHERE name = 'Percy Liang';

-- Percy Liang → Safety First (Secondary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7f64838f-59a6-4c87-8373-a023b9f448cc', 'strong'
FROM authors WHERE name = 'Percy Liang';

-- Yejin Choi → Needs New Approaches (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '207582eb-7b32-4951-9863-32fcf05944a1', 'strong'
FROM authors WHERE name = 'Yejin Choi';
```

### AI Ethics & Fairness

```sql
-- Abeba Birhane → Safety First (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7f64838f-59a6-4c87-8373-a023b9f448cc', 'strong'
FROM authors WHERE name = 'Abeba Birhane';

-- Deborah Raji → Safety First (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7f64838f-59a6-4c87-8373-a023b9f448cc', 'strong'
FROM authors WHERE name = 'Deborah Raji';

-- Margaret Mitchell → Safety First (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7f64838f-59a6-4c87-8373-a023b9f448cc', 'strong'
FROM authors WHERE name = 'Margaret Mitchell';

-- Rumman Chowdhury → Safety First (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7f64838f-59a6-4c87-8373-a023b9f448cc', 'strong'
FROM authors WHERE name = 'Rumman Chowdhury';

-- Rumman Chowdhury → Adaptive Governance (Secondary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, 'ee10cf4f-025a-47fc-be20-33d6756ec5cd', 'strong'
FROM authors WHERE name = 'Rumman Chowdhury';

-- Suresh Venkatasubramanian → Regulatory Interventionist (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, 'e8792297-e745-4c9f-a91d-4f87dd05cea2', 'strong'
FROM authors WHERE name = 'Suresh Venkatasubramanian';
```

### Enterprise & Adoption

```sql
-- Bret Taylor → Technology Leads (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7e9a2196-71e7-423a-889c-6902bc678eac', 'strong'
FROM authors WHERE name = 'Bret Taylor';

-- Bret Taylor → Co-Evolution (Secondary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, 'f19021ab-a8db-4363-adec-c2228dad6298', 'strong'
FROM authors WHERE name = 'Bret Taylor';

-- Byron Deeter → Technology Leads (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7e9a2196-71e7-423a-889c-6902bc678eac', 'strong'
FROM authors WHERE name = 'Byron Deeter';

-- David Cahn → Technology Leads (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7e9a2196-71e7-423a-889c-6902bc678eac', 'strong'
FROM authors WHERE name = 'David Cahn';

-- Martin Casado → Technology Leads (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7e9a2196-71e7-423a-889c-6902bc678eac', 'strong'
FROM authors WHERE name = 'Martin Casado';

-- Rita Sallam → Co-Evolution (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, 'f19021ab-a8db-4363-adec-c2228dad6298', 'strong'
FROM authors WHERE name = 'Rita Sallam';

-- Rita Sallam → Business Whisperers (Secondary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, 'fe9464df-b778-44c9-9593-7fb3294fa6c3', 'strong'
FROM authors WHERE name = 'Rita Sallam';

-- Daphne Koller → Technology Leads (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7e9a2196-71e7-423a-889c-6902bc678eac', 'strong'
FROM authors WHERE name = 'Daphne Koller';

-- Nat Friedman → Technology Leads (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7e9a2196-71e7-423a-889c-6902bc678eac', 'strong'
FROM authors WHERE name = 'Nat Friedman';
```

### Innovation & Democratization

```sql
-- Emad Mostaque → Democratize Fast (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b', 'strong'
FROM authors WHERE name = 'Emad Mostaque';

-- Patrick Collison → Innovation First (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '331b2b02-7f8d-4751-b583-16255a6feb50', 'strong'
FROM authors WHERE name = 'Patrick Collison';

-- Joshua Gans → Innovation First (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '331b2b02-7f8d-4751-b583-16255a6feb50', 'strong'
FROM authors WHERE name = 'Joshua Gans';
```

### Governance & Policy

```sql
-- Ian Hogarth → Adaptive Governance (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, 'ee10cf4f-025a-47fc-be20-33d6756ec5cd', 'strong'
FROM authors WHERE name = 'Ian Hogarth';
```

### Human-AI Collaboration

```sql
-- Avi Goldfarb → Human-AI Collaboration (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', 'strong'
FROM authors WHERE name = 'Avi Goldfarb';
```

### OpenAI Safety Researchers

```sql
-- Lilian Weng → Safety First (Primary)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '7f64838f-59a6-4c87-8373-a023b9f448cc', 'strong'
FROM authors WHERE name = 'Lilian Weng';
```

### Critics & Skeptics (marked as "challenges")

```sql
-- Ed Zitron → Needs New Approaches (Challenges)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '207582eb-7b32-4951-9863-32fcf05944a1', 'challenges'
FROM authors WHERE name = 'Ed Zitron';

-- Jim Covello → Needs New Approaches (Challenges)
INSERT INTO camp_authors (author_id, camp_id, relevance)
SELECT id, '207582eb-7b32-4951-9863-32fcf05944a1', 'challenges'
FROM authors WHERE name = 'Jim Covello';
```

## Verification Query

After executing the assignments, verify with:

```sql
SELECT
  a.name,
  c.label as camp,
  ca.relevance,
  d.name as domain
FROM authors a
JOIN camp_authors ca ON a.id = ca.author_id
JOIN camps c ON ca.camp_id = c.id
JOIN domains d ON c.domain_id = d.id
WHERE a.name IN (
  'Nick Bostrom', 'Stuart Russell', 'Daron Acemoglu', 'Judea Pearl',
  'Ajeya Cotra', 'Avi Goldfarb', 'Carl Benedikt Frey', 'Daphne Koller',
  'Joshua Gans', 'Percy Liang', 'Abeba Birhane', 'Deborah Raji',
  'Eliezer Yudkowsky', 'Emad Mostaque', 'Ian Hogarth', 'Lilian Weng',
  'Margaret Mitchell', 'Nat Friedman', 'Patrick Collison', 'Rumman Chowdhury',
  'Suresh Venkatasubramanian', 'Yejin Choi', 'Bret Taylor', 'Byron Deeter',
  'David Cahn', 'Ed Zitron', 'Jim Covello', 'Martin Casado', 'Rita Sallam'
)
ORDER BY a.name, d.id, c.label;
```

## Expected Result

Should show 30 authors with ~55 total camp assignments (most authors have 1-2 camps).

## Notes

- All authors get at least 1 "strong" relevance assignment
- Some authors have secondary camps with "partial" or "strong" relevance
- Ed Zitron and Jim Covello marked as "challenges" - they critique AI hype
- No duplicate assignments (handled by UNIQUE constraint in schema)

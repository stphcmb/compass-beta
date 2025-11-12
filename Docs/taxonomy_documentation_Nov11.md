# Compass Taxonomy Schema - Structure & Usage

## Overview
This schema standardizes the relationship between domains, dimensions, and camps using a three-table hierarchy that accommodates both simple and multi-dimensional domains.

## Schema Structure

### 1. **Domains Table**
The top-level organization of AI discourse topics.

**Domains:**
- Society & Ethics
- Enterprise Transformation
- Future of Work
- AI Progress (Technical Frontier)
- Governance & Oversight
- Other

### 2. **Dimensions Table**
Sub-categories within domains. Most domains have a single implicit dimension (stored as NULL), but Enterprise Transformation has 3 explicit dimensions.

**Dimension Types:**
- **Implicit (NULL)**: Society & Ethics, Future of Work, AI Progress, Governance & Oversight, Other
- **Explicit**: Enterprise Transformation has:
  - Adoption Philosophy
  - Measurement Approach
  - Translation Capability

### 3. **Camps Table**
Specific thought leader positions within each dimension.

## Complete Camp Distribution

### Society & Ethics (3 camps)
- Ethical Stewards
- Tech Realists
- Tech Utopians

### Enterprise Transformation (6 camps across 3 dimensions)
**Adoption Philosophy:**
- Tech-First
- Co-Evolution

**Measurement Approach:**
- Proof Seekers
- Learning Architects

**Translation Capability:**
- Tech Builders
- Business Whisperers

### Future of Work (2 camps)
- Human-AI Collaboration
- Displacement Realists

### AI Progress - Technical Frontier (2 camps)
- Scaling Maximalists
- Grounding Realists

### Governance & Oversight (3 camps)
- Regulatory Interventionists
- Innovation-First
- Adaptive Governance

### Other (1 camp)
- Various

## Usage Examples

### Query 1: Get all camps for a specific domain
```sql
-- For simple domains (like Society & Ethics)
SELECT 
  c.name AS camp_name,
  c.description
FROM camps c
JOIN dimensions dim ON c.dimension_id = dim.id
JOIN domains dom ON dim.domain_id = dom.id
WHERE dom.name = 'Society & Ethics'
ORDER BY c.camp_order;
```

### Query 2: Get all camps for Enterprise Transformation by dimension
```sql
SELECT 
  dim.name AS dimension_name,
  c.name AS camp_name,
  c.description
FROM camps c
JOIN dimensions dim ON c.dimension_id = dim.id
JOIN domains dom ON dim.domain_id = dom.id
WHERE dom.name = 'Enterprise Transformation'
ORDER BY dim.dimension_order, c.camp_order;
```

### Query 3: Use the taxonomy_hierarchy view
```sql
-- Get complete hierarchy for all domains
SELECT * FROM taxonomy_hierarchy;

-- Get hierarchy for one domain
SELECT * FROM taxonomy_hierarchy 
WHERE domain_name = 'Enterprise Transformation';
```

### Query 4: Get domain summary with camp counts
```sql
SELECT * FROM domain_summary;
```

### Query 5: Find which dimension a specific camp belongs to
```sql
SELECT 
  dom.name AS domain,
  dim.name AS dimension,
  c.name AS camp
FROM camps c
JOIN dimensions dim ON c.dimension_id = dim.id
JOIN domains dom ON dim.domain_id = dom.id
WHERE c.name = 'Co-Evolution';
```

## Design Decisions

### Why three tables instead of two?

**✅ Benefits:**
1. **Handles multi-dimensional domains elegantly**: Enterprise Transformation naturally has 3 dimensions without forcing all domains into this structure
2. **Future-proof**: Easy to add dimensions to other domains if needed
3. **Clean queries**: Can filter by dimension when needed, ignore when not
4. **Maintains hierarchy**: Domain → Dimension → Camp is clear and logical

### Why allow NULL dimensions?

Most domains have a single implicit dimension. Using NULL instead of creating dummy dimension names keeps the data clean and makes it clear when a domain is single-dimensional vs. multi-dimensional.

### How to handle author positioning?

When storing author positions, reference the `camp_id` directly:

```sql
CREATE TABLE author_positions (
  author_id UUID REFERENCES authors(id),
  camp_id UUID REFERENCES camps(id),
  confidence_score NUMERIC(3,2),
  PRIMARY KEY (author_id, camp_id)
);
```

This automatically maintains the domain/dimension relationship through the foreign keys.

## Integration Notes

### For the MVP:
- Use the `taxonomy_hierarchy` view for displaying the complete taxonomy
- Use `camps_by_domain` for simpler flat queries
- Reference `camp_id` directly when storing author positions

### For UI Display:
**Simple domains (Society & Ethics):**
```
Society & Ethics
├─ Ethical Stewards
├─ Tech Realists
└─ Tech Utopians
```

**Multi-dimensional domains (Enterprise Transformation):**
```
Enterprise Transformation
├─ Adoption Philosophy
│  ├─ Tech-First
│  └─ Co-Evolution
├─ Measurement Approach
│  ├─ Proof Seekers
│  └─ Learning Architects
└─ Translation Capability
   ├─ Tech Builders
   └─ Business Whisperers
```

## Validation Queries

Run these to verify the schema is correct:

```sql
-- Should return 6 domains
SELECT COUNT(*) FROM domains;

-- Should return 9 dimensions (6 simple + 3 for Enterprise Transformation)
SELECT COUNT(*) FROM dimensions;

-- Should return 18 total camps
SELECT COUNT(*) FROM camps;

-- Verify Enterprise Transformation has 3 dimensions
SELECT COUNT(*) FROM dimensions dim
JOIN domains dom ON dim.domain_id = dom.id
WHERE dom.name = 'Enterprise Transformation';

-- Verify Society & Ethics has exactly 3 camps
SELECT COUNT(*) FROM camps c
JOIN dimensions dim ON c.dimension_id = dim.id
JOIN domains dom ON dim.domain_id = dom.id
WHERE dom.name = 'Society & Ethics';
```

## Next Steps

1. ✅ Run `compass_taxonomy_schema.sql` in your Supabase database
2. ✅ Verify with validation queries above
3. Update your existing schema.sql to reference these tables
4. Update any existing author_positions or author_camps tables to use `camp_id` as the foreign key
5. Test queries with the provided views

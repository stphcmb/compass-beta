# Compass - Product Requirements Document

**Version:** 1.0 | **Date:** December 7, 2025 | **Status:** As-Built Documentation

---

## Executive Summary

**Compass** is a positioning intelligence platform that helps executives, researchers, and thought leaders understand their alignment within AI discourse. It provides a curated database of 200+ AI thought leaders organized by philosophical camps across 5 domains, with intelligent search and positioning metrics.

**Core Value:** Validate your AI thesis against established thought leaders, discover intellectual allies/challengers, and identify white space opportunities.

**Target Users:** Executives, researchers, thought leaders, strategists in AI space.

---

## Product Overview

### What Problem Does It Solve?

Users struggle to:
- Validate their AI positioning against established voices
- Discover who shares or challenges their perspective
- Navigate fragmented AI discourse across domains
- Identify underrepresented perspectives (white space)

### Solution

Curated search platform with:
- 3-tier taxonomy: Domains → Camps → Authors
- AI-powered query expansion (n8n + Gemini 2.0 Flash)
- Positioning metrics (strongly aligned, partially aligned, challenging, emerging)
- Multi-dimensional filtering
- White space opportunity detection

---

## Core Features

### 1. Search & Discovery

**Natural Language Search**
- 1-500 character input for thesis or keywords
- Full-text search across author names, affiliations, sources, camp descriptions

**AI Query Expansion**
- Primary: n8n webhook + Gemini 2.0 Flash (5s timeout)
- Fallback: Local semantic expansion (hardcoded mappings)
- Visual feedback showing expanded queries with role labels

**Search Algorithm Flow**
```
User Query → Validation → Query Expansion (AI/Semantic)
→ Phrase Extraction → Database Matching → Results Grouping
```

### 2. Advanced Filtering

- **Domain Filter**: 5 domains (Technical, Governance, Society, Enterprise, Future of Work)
- **Camp Filter**: Philosophical schools of thought within domains
- **Author Filter**: Search by author name/affiliation
- **Publication Date**: Last 12/6/3 months
- **Relevance Filter**: Filter by alignment type (via badge clicks)

### 3. Positioning Intelligence

**Positioning Snapshot Widget**
- Counts authors by relevance: Strongly Aligned (green), Partially Aligned (yellow), Challenging (red), Emerging (purple)
- Interactive badges filter results
- "Save This Search" functionality

**White Space Detection**
- Limited domain coverage alerts
- Emerging camps with few voices
- Dominant vs. alternative viewpoint imbalances

### 4. Results Organization

**Camp Accordion Structure**
- Hierarchy: Domain → Camp → Authors
- Expandable/collapsible sections
- Author count badges

**Author Cards**
- Name, affiliation, credibility tier
- Relevance badge (color-coded alignment)
- "Why It Matters" summary
- Recent sources (up to 3)
- Key quote placeholder (coming soon)

**Author Detail Pages** (`/author/[id]`)
- Full profile with all affiliations
- Camp memberships across domains
- Complete source list (filtered by date)

### 5. Search Management

- **Search History**: Last 10 searches, stored in database
- **Saved Searches**: Saves query + all filters, accessible in sidebar
- **Sidebar Navigation**: Quick access to recent/saved searches

---

## Data Model

### Core Tables

**domains** → **camps** → **camp_authors** ← **authors** ← **sources**

```sql
-- 5 domains (Technical, Governance, Society, Enterprise, Future of Work)
domains: id, name, description, icon, sort_order

-- Philosophical schools of thought
camps: id, label, description, code, domain_id

-- Many-to-many relationship with positioning data
camp_authors: id, author_id, camp_id, relevance, why_it_matters, key_quote, quote_source_url

-- Thought leaders (~200)
authors: id, name, header_affiliation, primary_affiliation, credibility_tier, author_type, sources (JSONB)

-- Publications
sources: id, author_id, title, url, type, published_date, domain

-- User features
saved_searches: id, query, filters (JSONB), created_at
search_history: id, query, timestamp
```

**Relevance Values**: `strongly_aligned`, `partially_aligned`, `challenging`, `emerging`

**Credibility Tiers**: Seminal Thinker, Thought Leader, Emerging Voice, Practitioner

**Source Types**: Paper, Blog, Video, Podcast, Book, Tweet Thread, Other

---

## Technical Architecture

### Stack

**Frontend**
- Next.js 14 (App Router), TypeScript
- shadcn-ui (Radix UI), Tailwind CSS
- Lucide React icons

**Backend**
- Supabase (PostgreSQL)
- Next.js API routes
- n8n webhooks for query expansion

**Hosting**
- Vercel (production)

### Key Routes

- `/` - Home page with search + discovery
- `/results` - Search results with positioning metrics
- `/author/[id]` - Author profile page
- `/api/camps` - Search API endpoint

### Data Flow

```
Client (SearchBar)
  ↓
GET /api/camps?query={query}&domain={domain}
  ↓
Server: Query Expansion (n8n → semantic fallback)
  ↓
Server: Database Query (thought-leaders.ts)
  ↓
Server: Filter & Match (camps, authors, sources)
  ↓
JSON Response: { camps, expandedQueries, metadata }
  ↓
Client: Render results + positioning metrics
```

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
N8N_QUERY_EXPANSION_URL=https://n8n-webhook-url
N8N_QUERY_EXPANSION_TEST_URL=http://localhost:5678/webhook-test (testing)
```

**Security**: Webhook URLs are server-only, never exposed to browser.

---

## Design System

### Colors

```css
--bone: #f5f5f0         /* Background */
--charcoal: #2d2d2d     /* Text */
--accent: #3b82f6       /* Primary action */
--emerald: #10b981      /* Strongly Aligned */
--amber: #f59e0b        /* Partially Aligned */
--red: #ef4444          /* Challenging */
--violet: #a855f7       /* Emerging */
```

### Typography

- System font stack (SF Pro, Segoe UI)
- H1: 2.5rem, H2: 2rem, H3: 1.5rem, Body: 1rem
- 8px base spacing unit

### Responsive

- Mobile: < 640px (sidebar collapses, cards stack)
- Tablet: 640-1024px
- Desktop: > 1024px

---

## User Journeys

### First-Time Discovery
1. Land on home → Click suggested topic ("AI Safety")
2. View results → See positioning snapshot (15 aligned, 8 challenging)
3. Click "Challenging" badge → Filter to counter-arguments
4. Expand camp → Read author cards
5. Click author → View full profile + sources
6. Save search → Bookmark for later

### Returning Research
1. Click saved search from sidebar → Restore query + filters
2. Modify date filter → Last 3 months only
3. Review positioning shift → Note new emerging voices
4. Explore new authors → Read recent publications
5. Update saved search → Overwrite with new filters

---

## Key Metrics

**Engagement**
- Weekly Active Searchers (north star)
- Searches per user per session (target: 3+)
- Author profiles viewed per session
- Saved search adoption rate (target: 20%+)

**Search Quality**
- Zero-result searches (target: < 10%)
- n8n expansion success rate (target: 90%+)
- Average results per query (target: 10-30)

**Retention**
- D7 retention rate (target: 40%+)
- Returning user rate (7-day, 30-day)

---

## Future Roadmap

### Near-Term
- Key quotes display (framework exists, marked "coming soon")
- Author deduplication (currently manual)
- Search export (PDF, CSV)
- Enhanced white space detection

### Mid-Term
- Personalized positioning (user profiles, position tracking)
- Collaborative research (team workspaces, shared searches)
- Advanced analytics (trend detection, citation networks)

### Long-Term
- Real-time discourse tracking (daily source updates, alerts)
- Visual discourse maps (2D positioning, network graphs)
- AI research assistant (natural language queries, synthesis)
- Expanded coverage (new domains beyond AI)

---

## Competitive Positioning

**vs. Google Scholar**: Curated thought leaders vs. all papers, positioning intelligence vs. citations

**vs. Twitter/X**: Structured camps vs. algorithmic feeds, credibility signals vs. social metrics

**vs. Substack**: Cross-author comparison vs. siloed writers, thesis validation vs. single perspectives

**Unique Value**: Only platform organizing thought leaders by philosophical schools of thought with alignment metrics.

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| n8n downtime | Degraded query expansion | Semantic fallback implemented |
| Manual curation doesn't scale | Growth bottleneck | Build semi-automated ingestion |
| Narrow use case | Limited TAM | Expand to adjacent domains |
| Content quality vs. quantity | Curation overhead | Community contributions, AI assistance |

---

## Success Criteria

**Product-Market Fit**
- 40%+ weekly retention
- 3+ searches per active user per week
- 20%+ saved search adoption
- 60%+ "very disappointed" score (Sean Ellis test)

**Launch Targets (Month 1)**
- 500+ total users
- 30%+ D7 retention
- 1,000+ author profiles viewed
- 50+ saved searches created

---

## Appendix

### Sample Camps by Domain

**AI Technical Capabilities**: Scaling Maximalists, Scaling Realists, AGI Optimists, Alternative Architectures Advocates

**AI Governance & Oversight**: AI Safety Advocates, Regulation Advocates, Regulation Skeptics, Policy Pragmatists

**AI & Society**: Algorithmic Fairness Researchers, AI Bias Critics, Democratic AI Advocates

**Enterprise AI Adoption**: AI ROI Optimists, Adoption Pragmatists, Implementation Skeptics

**Future of Work**: Job Displacement Alarmists, Human-AI Collaboration Optimists, Reskilling Advocates

### Semantic Expansion Patterns

- AI Safety → safety, risk, alignment, regulation, control
- Scaling → scaling, maximalist, realist, compute
- Jobs → displacement, worker, collaboration, augmentation
- Ethics → ethics, bias, fairness, responsibility
- AGI → AGI, superintelligence, artificial general intelligence

---

**Document Control**: v1.0 (2025-12-07) | Maintained by Product Team | Review: Quarterly

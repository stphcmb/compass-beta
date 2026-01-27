# Citation Verification Agent

> **Status**: Planning
> **Created**: 2026-01-07
> **Author**: Compass Team

## Overview

The Citation Agent is an automated system to verify existing links in the Supabase database, ensuring quote sources are valid, accessible, and accurately attributed. It detects broken links, paywalled content, and potential AI hallucinations, then finds replacement sources when needed.

## Problem Statement

Compass stores quotes from thought leaders with source URLs. Over time:
- Links break (404s, domain changes)
- Content moves behind paywalls
- Quotes may not actually appear at the cited URL
- Some quotes may be AI-generated hallucinations

Users need confidence that citations are accurate and accessible.

## Goals

1. **Verify** existing citation URLs work and contain the quoted text
2. **Detect** broken links, paywalls, and hallucinated quotes
3. **Find** replacement sources for broken citations
4. **Display** citation status to users with appropriate messaging
5. **Automate** with periodic checks + manual trigger capability

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CITATION AGENT SYSTEM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────────┐     ┌─────────────────────────┐  │
│  │   TRIGGERS   │     │   ORCHESTRATOR   │     │    VERIFICATION CORE    │  │
│  │              │     │                  │     │                         │  │
│  │ • Manual API │────▶│  n8n Workflow    │────▶│  1. Link Checker        │  │
│  │ • Cron Job   │     │  (Coordinator)   │     │  2. Content Fetcher     │  │
│  │ • Webhook    │     │                  │     │  3. Quote Verifier (AI) │  │
│  └──────────────┘     └──────────────────┘     │  4. Paywall Detector    │  │
│                                │               └─────────────────────────┘  │
│                                │                            │               │
│                                ▼                            ▼               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         SUPABASE DATABASE                             │  │
│  │                                                                        │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────┐  │  │
│  │  │ citation_checks │  │ camp_authors    │  │ citation_replacements│  │  │
│  │  │ (NEW TABLE)     │  │ (status field)  │  │ (NEW TABLE)          │  │  │
│  │  └─────────────────┘  └─────────────────┘  └──────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                │                                            │
│                                ▼                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         RECOVERY AGENT                                │  │
│  │                                                                        │  │
│  │  • Web Search (find replacement sources)                              │  │
│  │  • AI Ranking (evaluate source quality)                               │  │
│  │  • Human Review Queue (flagged for approval)                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                │                                            │
│                                ▼                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         NEXT.JS FRONTEND                              │  │
│  │                                                                        │  │
│  │  • Citation status badges on quotes                                   │  │
│  │  • Admin dashboard for verification reports                           │  │
│  │  • Manual trigger button                                              │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Orchestration** | n8n (existing) | Already configured, supports cron + webhooks |
| **Web Scraping** | Apify or Playwright | Handles JS-rendered pages, paywall detection |
| **Quote Verification** | Claude API | Semantic matching, hallucination detection |
| **Database** | Supabase (existing) | Add new tables for verification logs |
| **Scheduling** | n8n Cron + Supabase Edge Functions | Periodic checks |
| **UI** | Next.js (existing) | Status badges, admin dashboard |

---

## Database Schema Extensions

### New Tables

```sql
-- ============================================================================
-- NEW TABLE: Citation verification logs
-- ============================================================================
CREATE TABLE citation_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Reference to the citation being checked
  camp_author_id UUID REFERENCES camp_authors(id) ON DELETE CASCADE,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  url TEXT NOT NULL,

  -- Check results
  status TEXT NOT NULL CHECK (status IN (
    'valid',           -- URL works, quote verified
    'broken',          -- 404/unreachable
    'paywall',         -- Content behind paywall
    'quote_not_found', -- URL works but quote not on page
    'hallucination',   -- Quote appears fabricated
    'pending',         -- Awaiting check
    'error'            -- Check failed (timeout, etc)
  )),

  -- Metadata
  http_status INTEGER,
  response_time_ms INTEGER,
  quote_match_score FLOAT,        -- 0-1 semantic similarity
  page_title TEXT,
  page_snippet TEXT,              -- Relevant excerpt from page
  error_message TEXT,

  -- AI analysis
  ai_assessment TEXT,             -- Claude's analysis
  confidence_score FLOAT,         -- 0-1 confidence in assessment

  checked_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- NEW TABLE: Replacement links for broken citations
-- ============================================================================
CREATE TABLE citation_replacements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  citation_check_id UUID REFERENCES citation_checks(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  replacement_url TEXT NOT NULL,

  -- Quality indicators
  source_quality TEXT CHECK (source_quality IN ('high', 'medium', 'low')),
  source_type TEXT,               -- 'official', 'archive', 'mirror', 'alternative'
  domain_authority FLOAT,         -- Optional: domain ranking

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',     -- Awaiting review
    'approved',    -- Human approved
    'rejected',    -- Human rejected
    'auto_applied' -- Auto-applied (high confidence)
  )),

  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_citation_checks_status ON citation_checks(status);
CREATE INDEX idx_citation_checks_camp_author ON citation_checks(camp_author_id);
CREATE INDEX idx_citation_checks_checked_at ON citation_checks(checked_at);
CREATE INDEX idx_citation_replacements_status ON citation_replacements(status);
```

### Schema Modifications

```sql
-- ============================================================================
-- ADD status column to camp_authors for UI display
-- ============================================================================
ALTER TABLE camp_authors ADD COLUMN IF NOT EXISTS
  citation_status TEXT DEFAULT 'unchecked' CHECK (citation_status IN (
    'unchecked',
    'valid',
    'broken',
    'paywall',
    'unverified',
    'checking'
  ));

ALTER TABLE camp_authors ADD COLUMN IF NOT EXISTS
  last_checked_at TIMESTAMPTZ;
```

---

## Current Data Model Reference

Citations exist in these locations:

| Table | Field | Description |
|-------|-------|-------------|
| `camp_authors` | `quote_source_url` | URL for the key quote |
| `camp_authors` | `key_quote` | The actual quote text to verify |
| `sources` | `url` | Author source URLs |
| `sources` | `title`, `summary` | Source metadata |

---

## Implementation Phases

### Phase 1: Core Verification Engine

**Scope**: Build link checking and basic verification

**Tasks**:
1. Create database tables (`citation_checks`, `citation_replacements`)
2. Add `citation_status` column to `camp_authors`
3. Create n8n workflow: `Compass: Citation Verification Agent`
   - Trigger: Webhook (manual) + Cron (weekly)
   - Fetch all `camp_authors` with `quote_source_url`
   - HTTP request to check each URL status
   - Store results in `citation_checks`
   - Update `camp_authors.citation_status`

**Link Status Mapping**:
```
HTTP 200      → proceed to quote verification
HTTP 404/410  → mark as 'broken'
HTTP 403/401  → mark as 'paywall' (with additional checks)
HTTP 5xx      → mark as 'error', retry later
Timeout       → mark as 'error'
```

**Deliverables**:
- [ ] Database migrations
- [ ] n8n workflow for link checking
- [ ] Basic logging and error handling

---

### Phase 2: Quote Verification with AI

**Scope**: Verify quotes actually appear on the page

**Tasks**:

1. **Content Fetching**:
   - Integrate Apify's Web Scraper or Universal Scraper actor
   - Handle JavaScript-rendered content
   - Extract main article text (strip navigation, ads, etc.)

2. **Quote Verification via Claude**:
   ```
   System: You are a citation verification assistant.

   User: Given this webpage content and the claimed quote, determine:
   1. Does this quote appear on the page (exact or paraphrased)?
   2. Is this quote correctly attributed to the claimed author?
   3. Confidence score (0-1)
   4. If not found, is this likely AI hallucination?

   Webpage content: {scraped_content}
   Claimed quote: "{key_quote}"
   Claimed author: {author_name}
   ```

3. **Paywall Detection**:
   - Check for paywall indicators:
     - Login forms
     - "Subscribe" CTAs
     - Truncated content (< 500 chars when expecting article)
   - Maintain list of known paywall domains
   - Content length heuristics

**Deliverables**:
- [ ] Apify integration in n8n
- [ ] Claude API integration for quote verification
- [ ] Paywall detection logic
- [ ] Quote match scoring algorithm

---

### Phase 3: Recovery Agent

**Scope**: Find replacement links for broken citations

**Tasks**:

1. **Search Strategy**:
   - Primary: Google Custom Search API or Bing Search API
   - Query template: `"{author name}" "{partial quote}" site:trusted-domains`
   - Fallback: Wayback Machine / Internet Archive API
   - Alternative: Search author's official website/blog

2. **Source Quality Ranking**:
   ```
   Priority order:
   1. Official author sites (personal blog, university page)
   2. Major publications (NYT, WSJ, academic journals)
   3. Video transcripts (YouTube, podcasts)
   4. Archive.org snapshots
   5. Secondary sources (news aggregators, quote databases)
   ```

3. **AI Quality Assessment**:
   - Use Claude to evaluate replacement candidates
   - Score based on: relevance, authority, freshness
   - Flag low-confidence replacements for human review

4. **Human Review Queue**:
   - Admin interface to approve/reject suggestions
   - Batch approval for high-confidence matches
   - Notes field for rejection reasons

**Deliverables**:
- [ ] Search API integration
- [ ] Wayback Machine fallback
- [ ] AI ranking system
- [ ] Review queue data model

---

### Phase 4: Frontend Integration

**Scope**: Display citation status to users

**Tasks**:

1. **Status Badges on Quotes**:
   ```tsx
   // components/CitationBadge.tsx
   interface CitationBadgeProps {
     status: 'valid' | 'broken' | 'paywall' | 'unverified' | 'checking';
     lastChecked?: Date;
     replacementUrl?: string;
   }

   export function CitationBadge({ status, lastChecked, replacementUrl }: CitationBadgeProps) {
     const badges = {
       valid: { color: 'green', icon: '✓', text: 'Verified' },
       broken: { color: 'red', icon: '⚠', text: 'Source unavailable' },
       paywall: { color: 'yellow', icon: '🔒', text: 'Paywalled' },
       unverified: { color: 'gray', icon: '?', text: 'Unverified' },
       checking: { color: 'blue', icon: '↻', text: 'Checking...' },
     };

     // ... render badge with tooltip
   }
   ```

2. **Tooltip Details**:
   - Last checked date
   - Link to alternative source (if available)
   - "Report issue" button
   - Verification history

3. **Admin Dashboard** (`/admin/citations`):
   - Verification run history with timestamps
   - Statistics chart (% valid, broken, paywall, unchecked)
   - Pending replacements queue
   - Manual trigger button
   - Filter by status, author, date range

4. **User-Facing Messaging**:
   ```
   Broken: "Original source unavailable. We're working on finding an alternative."
   Paywall: "This source may require a subscription to access."
   Unverified: "This citation hasn't been verified yet."
   ```

**Deliverables**:
- [ ] CitationBadge component
- [ ] Tooltip with details
- [ ] Admin dashboard page
- [ ] API endpoints for citation data

---

## n8n Workflow Structure

### Main Verification Workflow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    Citation Verification Workflow                           │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌──────────────┐    ┌─────────────────────────────────┐   │
│  │ Trigger │───▶│ Supabase:    │───▶│ Loop: For each citation         │   │
│  │(Cron/   │    │ Fetch all    │    │                                 │   │
│  │ Webhook)│    │ camp_authors │    │  ┌─────────────────────────┐   │   │
│  └─────────┘    │ with URLs    │    │  │ HTTP Request: Check URL │   │   │
│                 └──────────────┘    │  └───────────┬─────────────┘   │   │
│                                      │              │                 │   │
│                                      │              ▼                 │   │
│                                      │  ┌─────────────────────────┐   │   │
│                                      │  │ IF: Status 200          │   │   │
│                                      │  │  → Apify: Scrape page   │   │   │
│                                      │  │  → Claude: Verify quote │   │   │
│                                      │  │ ELSE IF: 404            │   │   │
│                                      │  │  → Mark broken          │   │   │
│                                      │  │  → Trigger recovery     │   │   │
│                                      │  │ ELSE IF: 403            │   │   │
│                                      │  │  → Check for paywall    │   │   │
│                                      │  └───────────┬─────────────┘   │   │
│                                      │              │                 │   │
│                                      │              ▼                 │   │
│                                      │  ┌─────────────────────────┐   │   │
│                                      │  │ Supabase: Save results  │   │   │
│                                      │  │ Update citation_status  │   │   │
│                                      │  └─────────────────────────┘   │   │
│                                      └─────────────────────────────────┘   │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

### Recovery Sub-Workflow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    Citation Recovery Workflow                               │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌──────────────────┐    ┌─────────────────────────┐   │
│  │ Triggered   │───▶│ Build search     │───▶│ Google/Bing Search API  │   │
│  │ by main     │    │ query from       │    │ + Wayback Machine       │   │
│  │ workflow    │    │ author + quote   │    │                         │   │
│  └─────────────┘    └──────────────────┘    └───────────┬─────────────┘   │
│                                                          │                 │
│                                                          ▼                 │
│                                              ┌─────────────────────────┐   │
│                                              │ Claude: Rank candidates │   │
│                                              │ by quality & relevance  │   │
│                                              └───────────┬─────────────┘   │
│                                                          │                 │
│                                                          ▼                 │
│                                              ┌─────────────────────────┐   │
│                                              │ Supabase: Store in      │   │
│                                              │ citation_replacements   │   │
│                                              │ (status: pending)       │   │
│                                              └─────────────────────────┘   │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Next.js API Routes

```typescript
// app/api/citations/verify/route.ts
POST /api/citations/verify
Body: { campAuthorId?: string }  // Optional: verify single citation
Response: { runId: string, status: 'started' }

// app/api/citations/status/route.ts
GET /api/citations/status
Response: {
  summary: { valid: 85, broken: 5, paywall: 8, unchecked: 12 },
  lastRun: '2026-01-07T10:30:00Z',
  nextScheduledRun: '2026-01-14T10:30:00Z'
}

// app/api/citations/[id]/route.ts
GET /api/citations/:campAuthorId
Response: {
  currentStatus: 'valid',
  lastChecked: '2026-01-07T10:30:00Z',
  history: [
    { checkedAt: '...', status: 'valid', quoteMatchScore: 0.95 },
    { checkedAt: '...', status: 'broken', httpStatus: 404 }
  ],
  replacement: { url: '...', status: 'approved' } | null
}

// app/api/citations/replacements/route.ts
GET /api/citations/replacements?status=pending
Response: {
  items: [
    {
      id: 'uuid',
      originalUrl: '...',
      replacementUrl: '...',
      authorName: 'Sam Altman',
      quote: '...',
      sourceQuality: 'high',
      createdAt: '...'
    }
  ],
  total: 5
}

PATCH /api/citations/replacements/:id
Body: { status: 'approved' | 'rejected', notes?: string }
Response: { success: true }
```

---

## Cost Estimates

| Component | Cost Model | Monthly Estimate (500 citations) |
|-----------|------------|----------------------------------|
| **n8n** | Self-hosted (existing) | $0 |
| **Apify** | ~$0.005/page | $2.50 |
| **Claude API** | ~$0.02/verification | $10.00 |
| **Search API** | ~$0.005/query | $2.50 (recovery only) |
| **Supabase** | Existing plan | $0 (minimal storage) |
| **Total** | | **~$15/month** |

---

## Open Questions

1. **Verification Frequency**:
   - Weekly full scan?
   - Daily for recently broken links?
   - On-demand only?

2. **Auto-Replace Threshold**:
   - Should high-confidence replacements auto-apply?
   - Or always require human review?

3. **Paywall Handling**:
   - Attempt archive.org for paywalled content?
   - Just mark as paywalled and move on?

4. **Quote Matching Sensitivity**:
   - Exact match only?
   - Allow paraphrasing (semantic similarity > 0.8)?

5. **User Notification**:
   - Email admins when broken links detected?
   - Slack notification via existing integration?

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Citation verification coverage | 100% of quotes with URLs |
| Valid citation rate | > 90% |
| Mean time to detect broken link | < 7 days |
| Mean time to find replacement | < 48 hours |
| False positive rate (hallucination detection) | < 5% |

---

## References

- [Apify Web Scraper Documentation](https://apify.com/apify/web-scraper)
- [Claude API Documentation](https://docs.anthropic.com/)
- [Wayback Machine API](https://archive.org/help/wayback_api.php)
- [Google Custom Search API](https://developers.google.com/custom-search/v1/overview)

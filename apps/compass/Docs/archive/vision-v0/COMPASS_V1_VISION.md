# Compass v1 Vision
*An Honest Assessment and Path Forward*

---

## Part 1: Critical Review — Compass vs. Free-form LLM Query

### The Core Tension

Compass bets on **curated structure** over **dynamic discovery**. This is a genuine strategic choice with real tradeoffs.

---

### Where Compass Has a Genuine Advantage

**1. Attribution Integrity**
- LLMs hallucinate citations constantly. Compass guarantees every author/source is real and verified.
- For executives who'll be quoted publicly, this is non-negotiable.

**2. Consistent Intellectual Framework**
- The camp taxonomy provides a stable mental model for positioning discussions
- Teams can have shared vocabulary ("we're aligned with AI Safety Fundamentalism but differentiated from Techno-Utopians")

**3. Comparative Analysis**
- "Where does my content sit in the landscape?" is hard for LLMs to answer reliably
- Compass's structured output (matched camps, missing perspectives) is genuinely useful

---

### The Hard Questions / Shortcomings

**1. Staleness Problem (Critical)**

The 200-author canon is a snapshot. AI discourse moves weekly:
- New voices emerge (who captured Ilya Sutskever's new "Safe Superintelligence" company positioning?)
- Existing authors shift camps (Yann LeCun's increasingly aggressive anti-doomer stance)
- New debates form entirely (AI agents, inference scaling, reasoning models)

**User could ask Perplexity/ChatGPT:** "What are the latest perspectives on AI agent safety from the past month?" and get fresher, broader coverage.

**Impact:** HIGH — Users may get outdated analysis on fast-moving topics
**Current state:** No freshness indicators, no way to know if canon is stale

---

**2. The Taxonomy Trap (Significant)**

8-10 camps is a simplification. Real intellectual positions are:
- Nuanced (someone can be pro-open-source AND pro-regulation)
- Context-dependent (different stance on consumer AI vs. frontier models)
- Evolving (camps merge, split, redefine)

**Risk:** Users fit their content into your boxes rather than discovering their authentic position.

**Impact:** MEDIUM — May lead to reductive analysis, but camps are still useful as rough guides
**Current state:** Fixed camp assignments, no nuance indicators

---

**3. Discovery vs. Validation Gap (Significant)**

Compass excels at **validation** ("does my content align with recognized thought leaders?")
But executives also need **discovery** ("what's the emerging perspective I should know about?")

An LLM with web search can surface: "Three papers published this week argue X, which challenges the mainstream Y position you're taking."

**Impact:** HIGH — Missing a key value proposition for staying current
**Current state:** No discovery mechanism, purely retrospective analysis

---

**4. The Depth Illusion (Moderate)**

Having 200 curated authors sounds authoritative, but:
- Major thinkers have published hundreds of pieces with evolving views
- A "source" entry with a 2023 publication date may not represent their current thinking
- LLMs can read and synthesize entire bodies of work dynamically

**Impact:** MEDIUM — Canon may misrepresent authors' current positions
**Current state:** Sources have dates but no staleness warnings

---

**5. The Cold Start Problem (Moderate)**

New users see a search box and camps they don't understand. The AI Editor helps, but:
- Why would someone paste content here vs. ChatGPT?
- What's the hook before they've internalized the camp taxonomy?
- No compelling "aha moment" on first use

**Impact:** MEDIUM — Affects adoption and retention
**Current state:** Tutorial exists but value prop not immediately clear

---

**6. The "So What?" Problem (Moderate)**

Current output: "Your content aligns with Human-AI Collaboration and echoes views from Reid Hoffman."

User thinks: "Cool. So... what should I do?"

Analysis without prescription is intellectual entertainment, not a tool.

**Impact:** MEDIUM — Reduces actionability and perceived value
**Current state:** Descriptive output, no prescriptive actions

---

**7. No Memory / Drift Awareness (Foundational Gap)**

Each analysis is stateless. Compass doesn't know:
- What you wrote last month
- Whether your positioning is shifting
- If you're contradicting yourself
- How your content portfolio is skewed over time

**Impact:** HIGH — This is where Compass could genuinely beat LLMs
**Current state:** Content Helper designed but underdeveloped

---

**8. Canon Transparency Gap (Trust Issue)**

Users don't know:
- How comprehensive the canon is for their topic
- When sources were last updated
- Where the canon has blind spots

**Impact:** MEDIUM — Affects trust in analysis quality
**Current state:** No coverage indicators or freshness warnings

---

### The Fundamental Value Prop Question

**Why Compass over "type a query into Claude/ChatGPT"?**

Current answer (implicit): *Curated expertise + structured analysis + named sources*

That's necessary but not sufficient. The real differentiator should be:

> **"Compass is your positioning operating system—it remembers everything you've published, tracks your narrative consistency, validates against verified thought leaders, and ensures you never accidentally echo the wrong camp or contradict yourself."**

This requires capabilities Compass doesn't fully have yet.

---

## Part 2: Problems Ranked by Impact and Effort

| # | Problem | Impact | Effort | Priority Score |
|---|---------|--------|--------|----------------|
| 1 | No Memory / Drift Awareness | HIGH | MEDIUM | **P0** |
| 2 | Staleness Problem | HIGH | MEDIUM | **P0** |
| 3 | Discovery vs Validation Gap | HIGH | HIGH | **P1** |
| 4 | Canon Transparency Gap | MEDIUM | LOW | **P1** |
| 5 | "So What?" Problem | MEDIUM | MEDIUM | **P1** |
| 6 | Cold Start Problem | MEDIUM | MEDIUM | **P2** |
| 7 | Taxonomy Trap | MEDIUM | HIGH | **P2** |
| 8 | Depth Illusion | MEDIUM | HIGH | **P3** |

---

## Part 3: Phased Roadmap

### Phase 0: Quick Wins (1-2 weeks)
*Low effort, meaningful impact — ship immediately*

#### QW-1: Canon Freshness Indicators
**Problem addressed:** Staleness Problem, Canon Transparency Gap
**Effort:** 2-3 days

Show users when the canon might be outdated:

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ CANON COVERAGE NOTE                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ For "AI Agents" topics:                                         │
│ ├── Authors covering this: 8 of 200                            │
│ ├── Most recent source: 4 months ago                           │
│ └── Coverage strength: MODERATE                                │
│                                                                 │
│ This is a fast-moving topic. Our canon may not reflect the     │
│ latest developments. Treat analysis as directional.            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Query source dates for matched camps/authors
- Calculate coverage metrics (author count, recency)
- Add warning component to AI Editor results
- No new data needed — just surface existing metadata

---

#### QW-2: Persist Analysis History
**Problem addressed:** No Memory / Drift Awareness (foundation)
**Effort:** 2-3 days

Save every analysis to enable future memory features:

```sql
CREATE TABLE content_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  content_hash TEXT NOT NULL,        -- SHA256 for dedup
  content_snippet TEXT,              -- First 200 chars
  full_result JSONB NOT NULL,        -- Complete AIEditorAnalyzeResponse
  matched_camp_ids UUID[],           -- For querying
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analyses_user ON content_analyses(user_id);
CREATE INDEX idx_analyses_created ON content_analyses(created_at DESC);
```

**Implementation:**
- Add save call after successful analysis
- Hash content to detect re-analysis
- Store full result as JSONB for flexibility
- No UI changes yet — just data capture

---

#### QW-3: Basic History View
**Problem addressed:** No Memory (user-facing)
**Effort:** 2-3 days

Simple list of past analyses in the History page:

```
┌─────────────────────────────────────────────────────────────────┐
│ YOUR ANALYSIS HISTORY                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Today                                                           │
│ ├── "AI will transform how we work..." (2 camps matched)       │
│ │   └── Human-AI Collaboration, Business Transformation        │
│ │                                                               │
│ Yesterday                                                       │
│ ├── "The risks of autonomous agents..." (3 camps matched)      │
│ │   └── AI Safety, Regulatory Proponents, Cautious Optimism   │
│ │                                                               │
│ Jan 5                                                           │
│ ├── "Open source AI democratizes..." (2 camps matched)         │
│                                                                 │
│ [Load more]                                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation:**
- New component in History page
- Fetch from content_analyses table
- Click to view full past analysis
- Group by date, show snippet + camps

---

#### QW-4: "Compared to Your Average" Indicator
**Problem addressed:** No Memory, Cold Start (shows unique value)
**Effort:** 2-3 days (after QW-2/3)

When user has 3+ past analyses, show comparison:

```
┌─────────────────────────────────────────────────────────────────┐
│ 📊 COMPARED TO YOUR RECENT CONTENT                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ This piece matches camps you DON'T usually echo:                │
│ └── AI Safety (appears in 1 of your last 8 pieces)             │
│                                                                 │
│ This piece DOESN'T match camps you usually echo:                │
│ └── Business Transformation (appears in 6 of last 8)           │
│                                                                 │
│ [View your positioning history]                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Query user's historical camp frequency
- Compare current analysis camps to historical average
- Surface notable differences (new camps, missing usual camps)
- This is the "aha moment" that shows Compass's unique value

---

### Phase 1: Core Differentiation (2-3 weeks)
*Medium effort, high impact — builds the moat*

#### 1.1: Drift Detection
**Problem addressed:** No Memory / Drift Awareness
**Effort:** 5-7 days

Track positioning shifts over time:

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ POSITIONING SHIFT DETECTED                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Your recent content is shifting:                                │
│                                                                 │
│ EMERGING PATTERN (last 30 days):                                │
│ ├── More emphasis on: AI Safety, Regulation                     │
│ ├── Less emphasis on: Tech Optimism, Open Source               │
│                                                                 │
│ 3 months ago, your typical piece matched:                       │
│   Tech Optimism (70%) + Business Transformation (60%)          │
│                                                                 │
│ Your recent pieces match:                                       │
│   AI Safety (55%) + Regulatory (45%)                           │
│                                                                 │
│ Is this shift intentional?                                      │
│ [Yes, update my profile] [No, show me how to rebalance]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Calculate rolling camp frequency (30/60/90 day windows)
- Detect significant shifts (>20% change in camp frequency)
- Surface as alert in analysis results
- Let user acknowledge or investigate

---

#### 1.2: Actionable Suggestions (The "So What?" Fix)
**Problem addressed:** "So What?" Problem
**Effort:** 4-5 days

For each "missing perspective," provide copy-ready text:

```
┌─────────────────────────────────────────────────────────────────┐
│ MISSING: Worker Displacement Concerns                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Your draft discusses AI productivity without addressing         │
│ workforce impact.                                               │
│                                                                 │
│ SUGGESTED ADDITION:                                             │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ "While these productivity gains are significant, they       │ │
│ │ require thoughtful workforce transition. As Daron Acemoglu  │ │
│ │ argues, the question isn't whether AI creates value, but    │ │
│ │ whether that value is broadly shared."                      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Source: Acemoglu, "The Turing Trap" (2021)                     │
│                                                                 │
│ [Copy to clipboard] [See alternatives] [Skip]                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Update Gemini prompt to generate insertable paragraphs
- Include real quotes from canon (already have key_quote field)
- Provide 2-3 alternative framings
- Add copy button with source attribution

---

#### 1.3: Challenge Mode
**Problem addressed:** Validation vs Discovery, "So What?"
**Effort:** 3-4 days

Don't just validate — stress-test:

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎯 CHALLENGE MODE: How Critics Might Respond                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Your draft claims: "AI agents will handle routine decisions"   │
│                                                                 │
│ POTENTIAL PUSHBACK:                                             │
│                                                                 │
│ From AI Safety camp:                                            │
│ └── "Delegating decisions to agents without robust oversight   │
│      creates accountability gaps" — Stuart Russell             │
│                                                                 │
│ From Labor Advocates:                                           │
│ └── "Routine decisions' is a slippery slope — what's routine   │
│      today becomes essential tomorrow" — MIT Work of Future    │
│                                                                 │
│ PREEMPTIVE RESPONSES YOU COULD ADD:                            │
│ ├── Acknowledge the oversight concern: "With appropriate..."   │
│ └── Define scope clearly: "By routine, I specifically mean..." │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Identify camps NOT matched in user's content
- Generate counterarguments from those perspectives
- Use canon quotes for grounding
- Suggest preemptive responses

---

### Phase 2: Discovery Layer (3-4 weeks)
*Higher effort, addresses fundamental gap*

#### 2.1: Hybrid Canon — Curated + Live
**Problem addressed:** Staleness, Discovery vs Validation
**Effort:** 8-10 days

When canon is thin, supplement with live web search:

```
┌─────────────────────────────────────────────────────────────────┐
│ ANALYSIS RESULTS                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ FROM COMPASS CANON (verified):                                  │
│ ├── Human-AI Collaboration — Reid Hoffman, etc.                │
│ └── Business Transformation — 4 authors                        │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ DISCOVERED (web search, not yet curated):                       │
│ ├── ⚠️ New perspective from Anthropic blog (Dec 2024)          │
│ │   └── "Constitutional AI for agent safety"                   │
│ │   └── Not in our canon — may be relevant                     │
│ │                                                               │
│ ├── ⚠️ Recent paper from Stanford HAI (Jan 2025)               │
│ │   └── "Agent coordination failure modes"                     │
│ │   └── Not vetted — treat with caution                        │
│ │                                                               │
│ [Suggest adding to canon] [Ignore]                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Detect when matched camps have low coverage / old sources
- Trigger web search for topic + recent timeframe
- Clearly label discovered vs curated content
- Create pipeline to promote discoveries to canon review

**Critical principle:** Never silently mix discovered content with curated. Always visually distinct.

---

#### 2.2: Competitive Intelligence Mode
**Problem addressed:** Discovery, Differentiation
**Effort:** 5-6 days

Analyze competitor content:

```
┌─────────────────────────────────────────────────────────────────┐
│ COMPETITIVE ANALYSIS                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Paste competitor content to compare positioning:                │
│ [                                                    ]          │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ THEIR POSITIONING:                                              │
│ ├── Heavy emphasis: Tech Optimism, Scaling Benefits            │
│ └── Ignores: Worker Impact, Safety Concerns                    │
│                                                                 │
│ YOUR POSITIONING (from your history):                           │
│ ├── Heavy emphasis: Human-AI Collaboration, Transformation     │
│ └── Moderate: Safety, Regulation                               │
│                                                                 │
│ DIFFERENTIATION OPPORTUNITIES:                                  │
│ ├── They ignore worker impact — you could own this space       │
│ ├── They're pure optimists — your balanced view stands out     │
│ └── White space: Neither of you addresses policy implications  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Phase 3: Deep Personalization (4-5 weeks)
*Higher effort, higher retention*

#### 3.1: Manifesto / Editorial Profile Completion
**Problem addressed:** No Memory, Walking the Talk
**Effort:** 6-8 days

Complete the Content Helper vision — let users define their stated positions:

```
┌─────────────────────────────────────────────────────────────────┐
│ YOUR EDITORIAL PROFILE                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ CORE BELIEFS (what you say you stand for):                      │
│ ├── "AI should augment workers, not replace them"              │
│ ├── "Transformation requires process change, not just tech"    │
│ └── "We need pragmatic regulation, not fear-based policy"      │
│                                                                 │
│ CAMPS YOU ALIGN WITH:                                           │
│ ├── Human-AI Collaboration (strong)                            │
│ ├── Adaptive Governance (moderate)                             │
│ └── Business Transformation (strong)                           │
│                                                                 │
│ TOPICS YOU AVOID:                                               │
│ ├── AGI timeline predictions                                   │
│ └── Specific company criticisms                                │
│                                                                 │
│ [Edit profile]                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

#### 3.2: Walking the Talk Metrics
**Problem addressed:** No Memory, Drift
**Effort:** 5-6 days

Compare stated beliefs vs actual content:

```
┌─────────────────────────────────────────────────────────────────┐
│ 🪞 MIRROR: Stated vs Actual (Last 90 Days)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ YOU SAY:                          YOU WRITE ABOUT:              │
│ ├── Worker augmentation ✓         ├── Augmentation (8 pieces)  │
│ ├── Process transformation ✓      ├── Transformation (6 pieces)│
│ ├── Pragmatic regulation          ├── Regulation (1 piece) ⚠️  │
│ └── Societal awareness            └── Society (0 pieces) ❌    │
│                                                                 │
│ GAP ALERT:                                                      │
│ You claim to care about societal impact but haven't written    │
│ about it in 90 days. Your audience may perceive this gap.      │
│                                                                 │
│ SUGGESTION:                                                     │
│ Your next piece could address "responsible AI deployment"       │
│ to strengthen credibility on societal themes.                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

#### 3.3: Claim Tracking / Contradiction Detection
**Problem addressed:** No Memory, Consistency
**Effort:** 6-8 days

Extract and track specific claims:

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚡ POTENTIAL CONTRADICTION                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ This draft says:                                                │
│ "AGI is likely within the decade and we should prepare now."   │
│                                                                 │
│ But your February 2025 post said:                               │
│ "AGI timeline predictions are unreliable and distract from     │
│ near-term deployment challenges."                               │
│                                                                 │
│ These may conflict. Options:                                    │
│ ├── [Acknowledge evolution] "My thinking has evolved..."       │
│ ├── [Clarify distinction] "These are different contexts..."    │
│ ├── [Revise draft] Remove the timeline claim                   │
│ └── [Ignore] I'm aware, proceeding intentionally               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Phase 4: Taxonomy Evolution (5-6 weeks)
*Highest effort, addresses structural limitation*

#### 4.1: Tension-Based Positioning
**Problem addressed:** Taxonomy Trap
**Effort:** 10-12 days

Replace rigid camps with fluid positioning on key tensions:

```
Core tensions:
├── Capability vs Safety
├── Augmentation vs Automation
├── Open vs Closed
├── Optimism vs Caution
├── Market vs Regulation

Each author and piece of content gets positioned on these spectrums
rather than assigned to discrete camps.

Camps become "archetypes" — useful shortcuts, not prisons.
```

**Why this is Phase 4, not Phase 0:**
- Requires significant data model changes
- Current camps are "good enough" for MVP value
- Memory and freshness are more urgent gaps
- Can be done incrementally (add tensions alongside camps first)

---

## Part 4: Success Metrics

### Phase 0 Success (Quick Wins)
| Metric | Target |
|--------|--------|
| Users who see freshness warnings | 100% (on relevant queries) |
| Analyses saved to history | >90% |
| Users viewing history | >30% of active users |
| Users returning after seeing "compared to average" | Track lift |

### Phase 1 Success (Core Differentiation)
| Metric | Target |
|--------|--------|
| Users who copy a suggestion | >25% |
| Users who acknowledge drift alerts | >50% |
| Users who engage with Challenge Mode | >40% |
| NPS improvement | +10 points |

### Phase 2 Success (Discovery)
| Metric | Target |
|--------|--------|
| Discoveries surfaced per thin-coverage query | 2-3 |
| Discoveries promoted to canon review | Track volume |
| User satisfaction on fresh topics | Parity with curated |

### Phase 3 Success (Personalization)
| Metric | Target |
|--------|--------|
| Users with editorial profiles | >50% of active |
| Walking the Talk engagement | >60% view monthly |
| Contradictions caught pre-publish | Track and grow |

---

## Part 5: The Moat

When someone asks "why not just use ChatGPT?":

| Capability | Generic LLM | Compass v1 |
|------------|-------------|------------|
| Analyze positioning | ✅ Generic | ✅ Canon-grounded |
| Fresh perspectives | ✅ Web search | ⚠️ Hybrid (curated + live) |
| **Historical memory** | ❌ Stateless | ✅ Full history |
| **Drift detection** | ❌ No memory | ✅ Tracks over time |
| **Contradiction catching** | ❌ No memory | ✅ Claims tracked |
| **Portfolio analytics** | ❌ Can't aggregate | ✅ Dashboard |
| **Stated vs actual** | ❌ No profile | ✅ Manifesto comparison |
| Attribution integrity | ⚠️ Hallucinations | ✅ Verified canon |

**The moat isn't the analysis. It's the memory.**

A single analysis is replicable by any LLM. A system that remembers your entire positioning history, tracks drift, catches contradictions, and holds you accountable to your stated beliefs — that's not something you can prompt your way into.

---

## Part 6: Open Questions

1. **Auth gating:** Should history/memory features require sign-in, or anonymous with localStorage?
2. **Canon update process:** How do we operationally keep the canon fresh? Automated? Manual review?
3. **Discovery trust:** How do we present live-searched content without undermining trust in curated canon?
4. **Multi-org:** Is this single-company or multi-tenant? Affects editorial profiles significantly.
5. **Pricing:** Do memory features warrant premium tier?

---

## Part 7: Canon Freshness Implementation Plan

The staleness problem requires a multi-layered approach. We need to:
1. Surface what we already know about our own staleness (zero cost)
2. Monitor high-priority authors efficiently (low cost)
3. React to user signals about gaps (zero cost)
4. Periodically audit and refresh (low cost)

### The Karpathy Problem

Authors like Andrej Karpathy exemplify several distinct challenges:

| Challenge | Description | Detection Difficulty |
|-----------|-------------|---------------------|
| **Source Staleness** | We have his 2023 posts but not 2024/2025 videos | Easy — compare dates |
| **Topic Drift** | He's shifted from "Tesla AI" → "AI education" → "LLM internals" | Medium — requires content analysis |
| **Position Evolution** | His views on scaling, open-source may have shifted | Hard — requires understanding |
| **Format Diversity** | Blog, YouTube, Twitter, podcasts | Medium — multiple sources to monitor |

Checking "has Karpathy published something new?" is different from "is our understanding of Karpathy's positions current?"

---

### Data Model for Freshness Tracking

```sql
-- Extend authors table for freshness tracking
ALTER TABLE authors ADD COLUMN last_source_check TIMESTAMPTZ;      -- When we last looked for new content
ALTER TABLE authors ADD COLUMN last_position_verified TIMESTAMPTZ; -- When human verified positions accurate
ALTER TABLE authors ADD COLUMN staleness_reports INTEGER DEFAULT 0; -- User report count
ALTER TABLE authors ADD COLUMN check_priority TEXT DEFAULT 'normal'; -- 'high' for tier 1 authors

-- Track what topics we've verified each author covers
CREATE TABLE author_topic_coverage (
  author_id UUID REFERENCES authors(id),
  topic_keyword TEXT NOT NULL,           -- 'ai_agents', 'scaling', 'safety', etc.
  coverage_confidence TEXT DEFAULT 'verified', -- 'verified', 'inferred', 'stale'
  last_verified TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (author_id, topic_keyword)
);

-- Curation queue for human review
CREATE TABLE curation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES authors(id),
  queue_type TEXT NOT NULL,              -- 'new_content', 'position_drift', 'topic_gap', 'user_report'
  priority INTEGER DEFAULT 5,            -- 1=urgent, 10=low
  detected_urls TEXT[],                  -- URLs found that need review
  detected_summary TEXT,                 -- What changed / what was found
  status TEXT DEFAULT 'pending',         -- 'pending', 'in_progress', 'resolved', 'dismissed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  resolution_notes TEXT
);

-- User staleness reports
CREATE TABLE staleness_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  author_id UUID REFERENCES authors(id),
  camp_id UUID REFERENCES camps(id),
  analysis_id UUID,                      -- Which analysis prompted this
  report_type TEXT,                      -- 'outdated_source', 'wrong_position', 'missing_topic'
  user_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log analysis topics for gap detection
CREATE TABLE analysis_topic_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID,
  extracted_topics TEXT[],               -- Topics detected in user's content
  matched_camp_ids UUID[],
  coverage_score NUMERIC,                -- How well our canon covered this
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Option A: Surface Existing Metadata (Zero Cost)

**Goal:** Show users what we know about our own staleness without any new fetching.

```sql
-- Query for coverage metrics (runs per analysis)
SELECT
  c.name as camp_name,
  COUNT(DISTINCT ca.author_id) as author_count,
  COUNT(DISTINCT s.id) as source_count,
  MAX(s.published_date) as most_recent_source,
  CURRENT_DATE - MAX(s.published_date) as days_since_update
FROM camps c
JOIN camp_authors ca ON c.id = ca.camp_id
LEFT JOIN sources s ON ca.author_id = s.author_id
WHERE c.id = ANY($matched_camp_ids)
GROUP BY c.id, c.name;
```

**Display logic:**
- < 90 days: "Current" (green)
- 90-180 days: "Moderate" (yellow)
- > 180 days: "Stale — treat as directional" (orange)
- < 5 authors: "Thin coverage" (warning)

**Cost: One SQL query per analysis. Zero tokens. Zero API calls.**

---

### Option B: Passive Monitoring via External Services (Zero Token Cost)

For high-priority authors (~30), set up free external monitoring:

| Service | What It Monitors | Setup Time | Ongoing Effort |
|---------|------------------|------------|----------------|
| Google Scholar Alerts | Papers, citations | 1 hr | Weekly email scan |
| YouTube Subscriptions | Video content | 30 min | Weekly check |
| RSS (Feedly/Inoreader) | Blogs, Substacks | 1 hr | Weekly check |
| Substack (free tier) | Newsletter authors | 30 min | Auto-delivered |

**Workflow:**
1. Curator receives weekly digest of new content from monitored authors
2. If relevant, curator adds to curation queue
3. ~30 minutes/week curator time

**Cost: Zero API/token cost. ~2 hours one-time setup. ~30 min/week maintenance.**

---

### Option C: User Feedback Loop (Zero Cost)

Add "Report outdated" button to author cards and camp sections:

```
┌─────────────────────────────────────────────────────────────────┐
│ Report Outdated Information                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ What seems outdated about this author/camp?                     │
│                                                                 │
│ ○ Sources are old (author has published newer content)         │
│ ○ Position has changed (author's views have shifted)           │
│ ○ Missing topic (author now talks about topics we don't show)  │
│ ○ Other: [                                            ]        │
│                                                                 │
│ [Submit Report]                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**When reports accumulate:**
- 3+ reports on same author → Auto-add to curation queue with priority bump
- Surface in admin dashboard for human review

**Cost: Zero. Leverages user knowledge.**

---

### Option D: Automated Weekly Content Check (Low Cost)

For high-priority authors, run weekly job to find new content:

```typescript
// Pseudocode for weekly content check
async function weeklyContentCheck() {
  // Get high-priority authors not checked in 7+ days
  const authors = await db.authors
    .where('check_priority', 'high')
    .where('last_source_check', '<', sevenDaysAgo())
    .select();

  for (const author of authors) {
    // Use Perplexity API (~$0.005 per query)
    const results = await perplexity.search(
      `What has ${author.name} published about AI in the last 3 months?
       Include blog posts, videos, interviews, papers.
       Return URLs and brief descriptions.`
    );

    if (results.hasNewContent) {
      await db.curation_queue.insert({
        author_id: author.id,
        queue_type: 'new_content',
        detected_urls: results.urls,
        detected_summary: results.summary,
        priority: 3,
      });
    }

    await db.authors.update(author.id, {
      last_source_check: new Date()
    });
  }
}
```

**Deployment:** Vercel Cron, GitHub Action, or n8n workflow

**Cost estimate:**
- 30 high-priority authors × $0.005 = **$0.15/week**
- **$0.60/month** for automated monitoring

---

### Option E: Topic Gap Detection (Zero Ongoing Cost)

Analyze what users are querying vs. what we cover well:

```sql
-- Find high-demand, low-coverage topics
SELECT
  topic,
  COUNT(*) as query_count,
  AVG(coverage_score) as avg_coverage
FROM analysis_topic_log
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY topic
HAVING AVG(coverage_score) < 0.5
ORDER BY COUNT(*) DESC
LIMIT 10;
```

**Output:** "Users are asking about 'AI agents' (47 queries) but our coverage score is only 0.3"

**Action:** Add topic gaps to curation queue for targeted research

**Cost: Zero — uses data we're already collecting.**

---

### Option F: Quarterly Position Drift Detection (Low Cost)

For authors with new content detected, check if their positions have shifted:

```typescript
async function quarterlyPositionAudit() {
  // Get authors with new content but old position verification
  const authors = await db.authors
    .where('check_priority', 'high')
    .where('last_position_verified', '<', sixMonthsAgo())
    .select();

  for (const author of authors) {
    const recentContent = await getRecentContentForAuthor(author.id);
    if (recentContent.length === 0) continue;

    // Use LLM to compare stored position vs recent content
    const driftAnalysis = await gemini.analyze(`
      Current recorded position: "${author.position_summary}"

      Recent content from this author:
      ${recentContent.join('\n\n')}

      Has this author's position significantly shifted?
      Return: { significantDrift: boolean, summary: string }
    `);

    if (driftAnalysis.significantDrift) {
      await db.curation_queue.insert({
        author_id: author.id,
        queue_type: 'position_drift',
        detected_summary: driftAnalysis.summary,
        priority: 2,
      });
    }
  }
}
```

**Cost estimate:**
- ~30 authors × quarterly = 120 checks/year
- ~$0.01 per check = **$1.20/year**

---

### Curation Dashboard (Admin UI)

```
┌─────────────────────────────────────────────────────────────────┐
│ CURATION QUEUE                                    [Admin Only]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Filter: [All ▼] [Pending ▼]              Sort: [Priority ▼]    │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🔴 HIGH PRIORITY                                            │ │
│ │                                                             │ │
│ │ Andrej Karpathy — New Content Detected                      │ │
│ │ └── 3 new YouTube videos since last check                   │ │
│ │ └── Topics: "LLM from scratch", "Tokenization deep dive"    │ │
│ │ └── [Add Sources] [Update Topics] [Dismiss]                 │ │
│ │                                                             │ │
│ │ Yann LeCun — User Reports (3 reports)                       │ │
│ │ └── Users say: "His position on open source has hardened"   │ │
│ │ └── Last verified: 8 months ago                             │ │
│ │ └── [Review Position] [Dismiss]                             │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🟡 NORMAL PRIORITY                                          │ │
│ │                                                             │ │
│ │ Topic Gap: "AI Agents"                                      │ │
│ │ └── 47 user queries in past 30 days                         │ │
│ │ └── Current coverage: 3 authors, 5 sources                  │ │
│ │ └── [Research Topic] [Add Authors]                          │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation Timeline

```
WEEK 1: Foundation
├── Day 1-2: Data model changes (new tables, columns)
├── Day 3-4: Coverage metrics query + UI component
└── Day 5: "Report outdated" button + staleness_reports table

WEEK 2: Manual Monitoring Setup
├── Day 1: Tag high-priority authors (UPDATE authors SET check_priority...)
├── Day 2-3: Set up Google Scholar alerts for top 30 authors
├── Day 3-4: Set up RSS feeds, YouTube subscriptions
└── Day 5: Document curator workflow

WEEK 3: Curation Dashboard
├── Day 1-2: Curation queue API endpoints
├── Day 3-4: Admin dashboard UI
└── Day 5: Add source / update position workflows

WEEK 4: Automation
├── Day 1-2: Weekly content check job (Perplexity integration)
├── Day 3: Cron setup (Vercel/GitHub Actions/n8n)
├── Day 4: Topic logging in analysis pipeline
└── Day 5: Topic gap detection query + dashboard

WEEK 5: Intelligence
├── Day 1-3: Position drift detection job
├── Day 4: Quarterly audit job setup
└── Day 5: Testing, refinement, documentation
```

---

### Cost Summary

| Component | Setup Cost | Ongoing Cost |
|-----------|------------|--------------|
| Surface existing metadata | Dev time | **$0** |
| User feedback loop | Dev time | **$0** |
| Manual alerts (Scholar, RSS) | 2 hrs setup | **$0** (30 min/week curator) |
| Weekly content check | Dev time | **$0.60/month** |
| Topic gap detection | Dev time | **$0** |
| Position drift detection | Dev time | **$0.10/month** |
| **TOTAL** | ~5 weeks dev | **<$1/month** + 2 hrs/month curator |

---

### The Karpathy Answer

For an author like Karpathy specifically:

| Week | What Happens |
|------|--------------|
| Week 1 | His coverage metrics show in analysis results ("Last source: 8 months ago") |
| Week 2 | He's tagged high-priority; Google Scholar alert + YouTube subscription set up |
| Week 3 | When curator sees his new video in feed, they add it via curation dashboard |
| Week 4 | Automated job detects his recent content, adds to queue if curator missed it |
| Week 5 | Quarterly audit checks if his position summary still matches his recent content |

**Result:** Users see honest staleness indicators immediately (Week 1), and the canon gets updated through low-effort curation (Weeks 2+). No massive token spend, no complex infrastructure.

---

## Part 8: Open Questions

1. **Auth gating:** Should history/memory features require sign-in, or anonymous with localStorage?
2. **Canon update process:** Addressed in Part 7 — combination of passive monitoring + user feedback + automated checks
3. **Discovery trust:** How do we present live-searched content without undermining trust in curated canon?
4. **Multi-org:** Is this single-company or multi-tenant? Affects editorial profiles significantly.
5. **Pricing:** Do memory features warrant premium tier?
6. **Curator capacity:** Who does the 2 hrs/month curation work? Dedicated role or shared?

---

*Document version: 1.1*
*Last updated: January 2025*
*Status: Vision / Planning*

# Compass Phase 2 - Product Requirements Document
*The Narrative Brain for AI-Native Companies*

---

## Product One-Liner

> **Compass is the narrative brain for AI-native companies.**
> It keeps a living map of what our company believes, what each leader stands for, and what the world is saying — then helps every piece of content line up with that map and exposes the gaps we're blind to.

---

## The Problem: Why Generic LLMs Aren't Enough

Leaders already use ChatGPT/Gemini to draft and polish content. These tools:

**What they do well:**
- Give decent structure, tone, and basic "pro vs con" arguments
- Can sound smart with the right prompt and uploaded PDFs

**What they fundamentally cannot do:**
- Work against a defined, inspectable canon of thinkers, positions, and company beliefs
- Track consistency over time across multiple posts, memos, decks, and speakers
- Quantify narrative gaps (which camps/voices are over- or under-represented)
- Respect company-level guardrails (what we can/should say as a brand)

**The result:** Leaders publish content that is polished but:
- Inconsistent with strategy
- Blind to important stakeholders
- Impossible to audit or improve systematically

---

## Compass: Core Delta vs "LLM + PDFs"

Compass is not "a better prompt for ChatGPT." Its differentiation is **structural**:

### 1. Canon-Aware, Not Vibe-Aware
Maintains an explicit knowledge graph of:
- **External thinkers and camps** — the intellectual landscape
- **Internal leaders and their stances** — each executive's POV
- **Company narrative pillars** — what we stand for as a brand

Every critique is grounded in named views, not generic "you could add another perspective."

### 2. Quantified Coverage and Gaps
For each piece of content, Compass calculates:
- Which camps/positions are present
- Which are missing
- How skewed the piece is towards particular worldviews

**Outputs metrics** (coverage, balance, alignment), not just prose feedback.

### 3. Longitudinal Memory Across All Content
Tracks everything the company publishes (blogs, memos, decks).

Surfaces patterns:
- "We over-index on Tech/Business, under-index on Workers/Policy."
- "This leader consistently ignores their own stated principles about X."

A plain LLM session has no such cross-document awareness.

### 4. Multi-Leader, Multi-Canon Aware
Each leader has:
- A **personal POV map** — their specific stances and beliefs
- A set of **trusted sources** — voices they draw from
- **Stylistic and ethical guardrails** — what they will/won't say

Compass tailors critique and suggestions per leader while enforcing company-wide narrative consistency.

### 5. Explainable and Auditable
Every suggestion can be traced to:
- Specific authors
- Specific positions
- Specific internal docs

Leaders and comms can see **why** the AI is saying what it's saying — critical for trust and governance.

---

## Design Principles

### Radical Honesty
Compass doesn't bluff. If the knowledge base is thin on a topic, we say so. If our coverage is stale, we flag it. Credibility comes from acknowledging limitations, not hiding them.

### Grounded, Not Generic
Every insight traces back to named sources. No "some people think..." — instead: "Timnit Gebru argues X, while Andrew Ng counters with Y."

### Company-First, Then World
Start with what *we* believe, then show how it relates to the external landscape. Not the other way around.

---

## Who It's For (Primary Personas)

### Founders / CEOs / Strategy Leads
**Goal:** Align external narratives (letters, keynotes, blogs) with long-term company POV and market reality.

**Pain:** Content sounds good but drifts from strategy; can't tell if they're missing important stakeholders.

**Compass job:** "Before this CEO letter goes out, show me where I'm blind or dangerously one-sided."

---

### Functional Leaders (COO, CPO, Head of AI, etc.)
**Goal:** Write memos and content that respect worker impact, governance, and transformation themes they've already committed to.

**Pain:** Hard to stay consistent with their own stated positions across many pieces; easy to accidentally contradict themselves.

**Compass job:** "Am I walking my talk? Does this memo match what I said I believe about X?"

---

### PMM / Comms
**Goal:** Orchestrate a consistent "company voice" across multiple leaders, campaigns, and formats.

**Pain:** Each leader sounds different; no way to audit narrative consistency across the quarter.

**Compass job:** "What did we actually say this quarter vs. what we said we'd stand for? Where are the gaps?"

---

## Jobs to Be Done

### Job 1: High-Stakes Content Validation
**Situation:** CEO letter, keynote, flagship blog, board memo about to go out.

**Stakes:** Reputational risk, strategic clarity, investor narrative.

**Job:** "Before this goes out, show me where I'm blind or dangerously one-sided."

**Success looks like:**
- User pastes draft content
- Gets instant visibility into: which camps they're echoing, which they're ignoring, which might attack them
- Identifies specific blind spots with evidence
- Makes targeted revisions before publishing

---

### Job 2: Quarterly Narrative Review
**Situation:** PMM/Comms reviewing all major content produced in a quarter.

**Stakes:** Brand consistency, narrative drift, missed opportunities.

**Job:** "What did we actually say this quarter vs. what we said we'd stand for?"

**Success looks like:**
- Upload or link multiple pieces of content
- See aggregate positioning: which camps dominated, which were absent
- Compare against stated positioning (e.g., "We're the pragmatic optimist")
- Identify drift, inconsistencies, or missed whitespace

---

### Job 3: Strategic POV Development
**Situation:** Defining a company stance on "AI in private markets", "agentic workflows", etc.

**Stakes:** Differentiation, category ownership, thought leadership credibility.

**Job:** "Show me the landscape of arguments so we can choose our position deliberately."

**Success looks like:**
- Enter a topic/domain (not their own content)
- See a comprehensive map of existing positions
- Identify underserved positions or contradictions to exploit
- Draft a positioning statement informed by the landscape

---

## The Three Canons (Data Architecture)

Compass maintains three interconnected knowledge layers:

### 1. External Canon (The World)
**What it contains:**
- Thought leaders, researchers, practitioners
- Their positions organized into camps
- Sources: papers, blogs, speeches, podcasts
- Credibility tiers and domain expertise

**Purpose:** Map the intellectual landscape we're operating in.

### 2. Company Canon (The Brand)
**What it contains:**
- Company narrative pillars ("We believe AI should augment, not replace")
- Brand guardrails (topics to embrace, avoid, handle carefully)
- Target positioning (which camps we align with, which we challenge)

**Purpose:** Define what *we* stand for as an organization.

### 3. Leader Canons (The Individuals)
**What it contains:**
- Each leader's personal POV map
- Their trusted sources and influences
- Stylistic preferences and ethical boundaries
- Historical content and positions taken

**Purpose:** Personalize guidance while maintaining brand coherence.

---

## Feature Specifications

### Feature 1: Content Helper (Job 1)

#### 1.1 Content Input
**New content input modes:**
- **Paste mode:** Large text area for pasting draft content (up to 10,000 characters)
- **URL mode:** Paste a Google Doc, Notion, or public URL to analyze
- **File mode:** Upload .docx, .pdf, or .txt (future consideration)

**Content metadata:**
- Content type selector: CEO Letter, Blog Post, Keynote, Board Memo, Social Post, Other
- Audience selector: Investors, Customers, Industry, Internal, Public
- Stakes level: High, Medium, Low (affects analysis depth)
- **Leader selector:** Which leader is this content for? (loads their personal canon)

#### 1.2 Blind Spot Analysis
**Primary output widget:** "Where You Might Be Blind"
- Shows camps/positions the content does NOT engage with
- Ranks by relevance to the content's topic
- Each blind spot includes:
  - Camp name and core position
  - Why this might matter (potential attack vector)
  - Representative quote from a prominent voice
  - Risk level: Critical / Worth Considering / Minor

**Secondary output:** "Camps You're Echoing"
- Shows which positions the content aligns with
- Flags if over-indexing on any single camp
- Warns if echoing positions from low-credibility sources

#### 1.3 Risk Assessment
**Potential criticism preview:**
- Simulates how different camps might respond
- Shows specific phrases that could trigger pushback
- Suggests neutral alternatives for polarizing language

**Balance meter:**
- Visual indicator showing content's position on key debates
- Highlights when content is one-sided without acknowledgment

#### 1.4 Leader-Specific Guidance
**Personal canon alignment:**
- Compare content against this leader's stated positions
- Flag contradictions: "You've previously said X, but this content implies Y"
- Suggest language that matches their established voice

**Trusted source integration:**
- Highlight when content aligns with leader's trusted sources
- Suggest citations from their preferred authors
- Flag when content echoes sources they typically avoid

#### 1.5 Company Guardrail Check
**Brand alignment:**
- Check content against company narrative pillars
- Flag potential violations of brand guardrails
- Suggest adjustments to align with company positioning

#### 1.6 Recommended Revisions
**Actionable suggestions:**
- Specific sentences to add for balance
- Phrases to soften or strengthen
- Missing perspectives to acknowledge
- "Consider adding" with example language
- **Traceable:** Each suggestion links to specific authors/positions

#### 1.7 Knowledge Base Transparency
**Coverage disclosure** (shown with every analysis):
- For each relevant domain/camp, show:
  - Number of authors we track
  - Last curation date
  - Coverage strength: Strong / Adequate / Thin / Weak
- Example: "Worker Impact: 3 authors, last updated 9 months ago — coverage is thin"
- If analysis touches weak areas, prominent warning: "Our knowledge base is limited here. Take these insights with caution."

---

### Feature 2: Narrative Tracker (Job 2)

#### 2.1 Content Collection
**Content sources:**
- Manual paste/upload of multiple pieces
- Integration with CMS (future: HubSpot, WordPress, Notion)
- Date range selector for "Q1 2024" style analysis

**Content tagging:**
- Auto-detect content type
- Manual override available
- **Track author/owner within organization** — which leader produced this?

#### 2.2 Aggregate Analysis Dashboard
**Positioning distribution:**
- Pie/bar chart of camps represented across all content
- Trend over time (by month or quarter)
- Comparison to previous period

**Consistency score:**
- Numeric score (0-100) for narrative consistency
- Breakdown by: Camp alignment, Domain coverage, Tone
- Flags specific pieces that deviate from majority position

#### 2.3 Camp Frequency Analysis
**Camp appearance tracking:**
- For each camp: count of content pieces where it appears
- Frequency trend: increasing, stable, declining
- Breakdown by content type (blogs vs keynotes vs memos)
- **View by:** individual leader or whole company

**Visualization:**
- Heatmap of camps × time periods
- Stacked bar showing camp mix per quarter
- Highlight dominant camps vs. neglected camps

**Pattern surfacing:**
- "We over-index on Tech/Business, under-index on Workers/Policy"
- "Q3 shifted heavily toward AI Safety messaging"
- "CEO content is 80% optimist camps; CTO content is 60% cautionary"

#### 2.4 Influence Diversity Analysis
**Author echo tracking:**
- Which external authors/voices are repeatedly cited or echoed
- Which authors we never engage with
- Influence concentration score: are we drawing from 3 voices or 30?

**Dangerous narrowing alerts:**
- "80% of your AI safety references come from 2 authors"
- "You haven't engaged with any Worker Impact voices in 6 months"
- "Your technology perspectives are exclusively from Silicon Valley sources"

**Recommended diversification:**
- Suggest underutilized authors by credibility and relevance
- "Consider engaging with [Author] who offers [alternative perspective]"

#### 2.5 Walking the Talk Metrics

##### Position Encoding
**Company positions:**
- Define core company stances: "We believe AI should augment, not replace, workers"
- Tag each position with domain and camps it aligns with
- Store as structured data for comparison

**Leader-specific positions:**
- Individual executives can have distinct positioning
- CEO might be more bullish, CTO more cautious
- Track each leader's content against their stated positions

##### Stated vs. Actual Comparison
**Gap analysis:**
- Compare encoded positions against actual content
- Generate "Walking the Talk" score (0-100)
- Specific gaps: "You state X but your content mostly says Y"

**Drift detection:**
- Track position consistency over time
- Alert when content starts contradicting stated positions
- Show which pieces are the outliers

**Per-leader breakdown:**
- "This leader consistently ignores their own stated principles about worker impact"
- "CEO alignment: 85%. CTO alignment: 62%."

**Alignment report:**
- Per-position breakdown: how well each stance is represented
- Recommendations: "Your 'AI augments workers' position appeared in only 2 of 15 pieces"

#### 2.6 Gap Analysis
**Missed opportunities:**
- Topics you planned to cover but didn't
- Camps you intended to address but ignored
- Emerging topics you haven't weighed in on

#### 2.7 Quarterly Report Export
**Exportable summary:**
- PDF or Google Doc format
- Key metrics and visualizations
- Camp frequency charts
- Influence diversity analysis
- Walking the Talk scores (company-wide and per-leader)
- Specific recommendations for next quarter
- Shareable with leadership

---

### Feature 3: Landscape Explorer (Job 3)

#### 3.1 Topic-Based Entry
**Topic input:**
- Natural language topic: "AI in private markets"
- Optional domain filter
- Optional "existing players" to focus on

**Topic expansion:**
- System suggests related topics
- Shows topic hierarchy (broader/narrower)
- Identifies overlapping debates

#### 3.2 Position Landscape Map
**Visual landscape:**
- 2D map showing camps/positions
- Axes configurable (e.g., optimist/pessimist, technical/business)
- Cluster density indicates crowded positions
- Whitespace visually obvious

**Position cards:**
- Each position shows:
  - Core thesis
  - Key proponents (with credibility)
  - Strength indicators (how established/contested)
  - Representative quotes

#### 3.3 Position Opportunity Analysis
**Whitespace opportunities:**
- Explicitly underserved positions
- Contradictions no one has reconciled
- Emerging positions with few voices
- Counter-intuitive stances no one is taking

**Risk assessment per position:**
- Who you'd be challenging
- How defensible the position is
- Required expertise/credibility to claim it

#### 3.4 Position Builder
**Draft positioning statement:**
- Template: "Unlike [existing positions], we believe [thesis] because [evidence]."
- System suggests language based on landscape
- Preview how this position relates to others
- Identify potential allies and critics

#### 3.5 Coverage Transparency
**Knowledge base health for this topic:**
- Total authors covering this topic
- Recency of sources
- Domain distribution
- Credibility tier distribution

**Gaps in our canon:**
- "We have strong coverage of Business implications but thin coverage of Policy perspectives"
- "Most sources are 6+ months old — landscape may have shifted"
- "No Tier 1 authors in our database for this specific topic"

---

## Cross-Cutting Feature: Knowledge Base Health

### Canon Critique Dashboard
Compass should critique its own knowledge base honestly.

#### Coverage Metrics (Always Visible)
**By Domain:**
| Domain | Authors | Sources | Last Updated | Health |
|--------|---------|---------|--------------|--------|
| Business | 12 | 45 | 2 weeks ago | Strong |
| Worker Impact | 3 | 8 | 9 months ago | Weak |
| Technology | 18 | 72 | 1 month ago | Strong |
| Policy | 5 | 12 | 4 months ago | Thin |

**By Camp:**
- Author count per camp
- Source recency per camp
- Flag camps with < 3 authors or > 6 month staleness

#### Contextual Warnings
**In Content Helper:**
- When analysis touches weak areas, show: "⚠️ Limited coverage: Worker Impact has only 3 tracked authors"
- Don't hide limitations — surface them prominently

**In Landscape Explorer:**
- Show coverage health alongside the landscape map
- "This map reflects 8 authors. Major voices may be missing."

**In Narrative Tracker:**
- When comparing against camps with thin coverage, note: "Comparison limited by our coverage of [camp]"

#### Improvement Suggestions
**Canon gaps:**
- "Consider adding authors covering Policy & Regulation"
- "Worker Impact sources are stale — suggest refreshing"
- "No voices from [geography/perspective] — potential blind spot"

---

## Cross-Cutting Feature: Discovery Layer

### Web Search for Thin Coverage
When the canon is thin, Compass can search the web for additional perspectives — but with clear boundaries.

#### How It Works
**Triggered when:**
- User queries a topic where coverage is Thin or Weak
- Analysis would benefit from perspectives not in our canon
- User explicitly requests "expand search"

**What it does:**
- Searches for additional authors and positions relevant to the query
- Clearly labels results as "Discovered (not in canon)" vs. "From Compass canon"
- Shows discovered content with lower confidence / more caveats

#### Critical Principle: Feed the Pipeline, Don't Mutate Ground Truth
**Discovered content is NOT treated as canonical:**
- Never silently mixed with curated canon
- Always visually distinct (different styling, explicit labels)
- Cannot be cited with same confidence as canonical sources

**Curation pipeline:**
- Discovered authors/sources flagged for potential curation
- Admin review queue: "These voices appeared in user searches — consider adding"
- User can upvote: "This was useful, add to canon"
- Curators decide what enters the canon with full vetting

#### User Experience
**When coverage is thin:**
```
⚠️ Our coverage of "AI governance in healthcare" is thin (2 authors, 5 sources).

[Expand with web search] — We'll find additional perspectives, clearly marked as uncurated.
```

**Search results display:**
```
FROM COMPASS CANON (vetted)
├── Author A — Position X
├── Author B — Position Y

DISCOVERED (not yet curated)
├── Author C — Position Z  [Source: web search]
│   ⚠️ Not vetted. May not meet our credibility standards.
├── Author D — Position W  [Source: web search]
│   ⚠️ Not vetted. May not meet our credibility standards.

[Suggest adding Author C to canon] [Suggest adding Author D to canon]
```

#### Why This Matters
- Maintains trust: users know what's curated vs. found
- Enables growth: thin areas get discovered, then curated
- Prevents hallucination: we admit gaps rather than filling them with unvetted content
- Creates feedback loop: user searches reveal where canon needs expansion

---

## UI/UX Changes from MVP

### Navigation Update
**Primary navigation** shifts from search to modes:
- **Content Helper** (Job 1) - new default
- **Review Narrative** (Job 2)
- **Explore Landscape** (Job 3)
- **Search** (legacy MVP functionality, secondary)
- **Knowledge Base Health** (meta view of coverage)

### Home Screen Redesign
**Three-card layout:**
Each card represents a job-to-be-done with:
- Compelling headline
- 1-sentence description
- Primary action button
- Recent activity in that mode

**Knowledge base health indicator:**
- Small status bar showing overall coverage health
- Click to expand into full Canon Critique dashboard

### Results Evolution
**From:** List of camps and authors matching a query
**To:** Actionable intelligence tailored to the user's goal, with honest disclosure of limitations

---

## Technical Requirements

### The Knowledge Graph
Compass requires a structured knowledge graph with three layers:

**External Canon:**
- Authors, camps, sources, topics
- Relationships: author → camp, source → topic, camp ↔ camp (allies/opponents)
- Metadata: credibility tiers, recency, domain tags

**Company Canon:**
- Narrative pillars, brand guardrails, target positioning
- Relationship to external camps (align, challenge, avoid)

**Leader Canons:**
- Per-leader: POV statements, trusted sources, stylistic preferences
- Content history linked to leader
- Position evolution over time

### New Data Requirements
- Store user's content pieces (encrypted at rest)
- Track content metadata (type, date, audience, **leader**)
- User accounts required for Job 2 (content history)
- Batch analysis endpoints for multiple content pieces
- **Company/leader position definitions** (structured stance data)
- **Content-to-author echo tracking** (which external voices appear in user content)
- **Knowledge base metadata** (last updated timestamps, coverage scores)

### New Processing Capabilities
- Content-to-camp matching (reverse of current: camp-to-query)
- Sentiment/tone analysis of user content
- Gap detection algorithms
- Aggregation and trending over time
- **Author mention/echo detection in user content**
- **Position-to-content alignment scoring**
- **Coverage health calculation per domain/camp**
- **Multi-leader content comparison**

### Integration Considerations
- Google Docs API for URL import
- Future: CMS integrations (HubSpot, WordPress)
- Export to PDF/Google Docs

---

## Phasing Recommendation

### Phase 2a: Content Helper (Job 1)
- Highest immediate value
- Validates core hypothesis
- No user accounts needed
- Builds on existing camp/author data
- **Include knowledge base transparency from day 1**
- Basic company canon (narrative pillars)

### Phase 2b: Landscape Explorer (Job 3)
- Enhances existing search
- Adds visualization layer
- Position builder is novel value-add
- Coverage transparency included

### Phase 2c: Narrative Tracker (Job 2)
- Requires user accounts
- Needs content storage
- Higher complexity, but high retention value
- **Camp frequency analysis**
- **Influence diversity tracking**
- **Walking the Talk metrics**

### Phase 2d: Multi-Leader Support
- Leader canons (individual POV maps)
- Per-leader guidance in Content Helper
- Per-leader breakdown in Narrative Tracker
- Leader-specific trusted sources

### Phase 2e: Full Knowledge Base Health
- Canon Critique dashboard
- Proactive staleness alerts
- Improvement recommendations

### Phase 2f: Discovery Layer
- Web search integration for thin coverage areas
- Clear visual separation of curated vs. discovered content
- Curation pipeline for promoting discoveries to canon
- User feedback loop ("suggest adding to canon")

---

## Success Metrics

### Job 1: Content Helper
- % of users who make edits after analysis
- Time from paste to insight < 30 seconds
- User-rated usefulness of blind spot identification
- Trust score: do users find coverage warnings credible?
- **Traceability:** % of suggestions users can trace to specific sources

### Job 2: Narrative Tracker
- Quarterly active usage (% return each quarter)
- Export/share rate
- Correlation between consistency score and brand metrics
- **Walking the Talk score improvements over time**
- **Influence diversity improvements over time**

### Job 3: Landscape Explorer
- Position statements created
- Whitespace opportunities identified as "useful"
- Time to develop a new POV (compared to without tool)

### Knowledge Base Health
- User trust in Compass (survey)
- Engagement with coverage warnings
- Canon improvement actions taken based on recommendations

### Multi-Leader
- Leaders with active personal canons
- Per-leader alignment score improvements
- Cross-leader consistency improvements

---

## Out of Scope for Phase 2

- Real-time monitoring of external content
- Competitor content analysis (analyzing their content, not just landscape)
- Automated content generation/ghostwriting
- Social media integration
- Team collaboration features (beyond multi-leader)
- API access for external tools

---

## Open Questions

1. **Authentication:** Job 2 requires user accounts. Do we gate all of Phase 2 behind auth, or just Job 2?
2. **Content storage:** How long do we retain user content? Privacy implications?
3. **Integration depth:** How much do we invest in Google Docs/CMS integrations vs. manual paste?
4. **Visualization:** How sophisticated does the landscape map need to be initially?
5. **Pricing:** Do different jobs warrant different pricing tiers?
6. **Position encoding:** How structured should company/leader positions be? Free text vs. tagged?
7. **Echo detection:** How do we reliably detect when user content "echoes" an external author without explicit citation?
8. **Leader onboarding:** How do we bootstrap a leader's personal canon? Interview? Content analysis?
9. **Multi-tenant:** Do we support multiple companies, or is this single-company initially?

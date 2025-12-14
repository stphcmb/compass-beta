# Search Expansion Strategy for Alin's Manifesto

## Strategic Framework

The manifesto presents **4 core domains** with **inherent tensions** that should drive query expansion:

```
Society Impact ←→ Individual Empowerment
(collective concern)   (personal opportunity)

Enterprise Strategy ←→ Worker Adaptation
(organizational)       (individual)

Technology Promise ←→ Technology Limits
(optimism)            (realism)
```

## 1. Query Expansion Mapping by Manifesto Theme

### A. Society & "Breaking the Fourth Wall"

**Core Concept**: AI democratizes knowledge, but risks mental health harm

**Expansion Strategy**:
```typescript
// When user searches: "AI democratizing knowledge"
Core queries: [
  "AI breaking fourth wall",
  "AI knowledge democratization",
  "AI reducing gatekeepers"
]

Context queries: [
  "AI literacy for everyone",
  "AI education access",
  "knowledge barriers AI"
]

Adjacent queries: [
  "AI mental health risks",          // Tension: benefit vs harm
  "AI sycophantic chatbots",         // Specific risk mentioned
  "AI echo chambers",                // Counter to democratization
  "AI community bonds erosion"       // Social cost
]

Alternative perspectives: [
  "AI widening digital divide",      // Skeptical view
  "AI reinforcing inequalities",     // Counter-narrative
  "enlightenment through AI"         // Optimistic framing
]
```

**Why This Works**: Surfaces both the **promise** (democratization) and **peril** (mental health) that Alin highlights, ensuring users see the full debate.

---

### B. Business Leaders & AI-Native Transformation

**Core Concept**: Augment workers (Iron Man suit) not replace them (Iron Man robot)

**Expansion Strategy**:
```typescript
// When user searches: "AI business transformation"
Core queries: [
  "AI-native business",
  "AI augmentation vs replacement",
  "AI business transformation"
]

Context queries: [
  "Iron Man suit vs robot",          // Karpathy framework
  "AI-first vs AI-native",           // Alin's distinction
  "people processes AI adoption",    // Why projects fail
  "managing AI agents"               // New skill needed
]

Adjacent queries: [
  "why AI projects fail",            // 90% failure rate
  "AI ROI measurement",
  "AI change management",
  "upskilling workforce AI"
]

Alternative perspectives: [
  "AI cost reduction strategy",      // Replacement mindset
  "AI headcount optimization",       // Counter to augmentation
  "AI technology-first approach"     // Counter to people-first
]
```

**Why This Works**: Contrasts the **augmentation philosophy** with the common **replacement mindset**, helping leaders see the strategic choice.

---

### C. Workers & Career Safeguarding

**Core Concept**: Master AI or risk "zombie jobs"

**Expansion Strategy**:
```typescript
// When user searches: "AI impact on my job"
Core queries: [
  "AI replacing jobs",
  "AI augmenting workers",
  "future-proof career AI"
]

Context queries: [
  "zombie jobs AI",                  // Alin's term
  "semi-technical roles AI",         // New requirement
  "managing AI agents workers",      // New opportunity
  "agentic workforce"                // Future vision
]

Adjacent queries: [
  "AI proof skills",
  "upskilling for AI era",
  "AI productivity tools workers",
  "human-AI collaboration"
]

Alternative perspectives: [
  "AI job creation",                 // Optimistic view
  "AI won't replace humans",         // Reassurance narrative
  "AI universal basic income",       // Post-work scenario
  "AI augmenting creativity"         // Capability enhancement
]
```

**Why This Works**: Balances **urgency** (zombie jobs) with **opportunity** (agentic teams), showing both risk and path forward.

---

### D. Technology Frontier & Limits

**Core Concept**: Agentic AI's potential vs scaling law limits

**Expansion Strategy**:
```typescript
// When user searches: "future of AI"
Core queries: [
  "agentic AI",
  "AI scaling laws",
  "AI autonomy levels"
]

Context queries: [
  "Karpathy autonomy slider",        // Framework reference
  "AI slop dead internet",           // Scaling risk
  "LLM language limitations",        // LeCun critique
  "AI physical world modeling"       // Beyond language
]

Adjacent queries: [
  "AI electrical power limits",
  "AI training data shortage",
  "multimodal AI future",
  "embodied AI"
]

Alternative perspectives: [
  "AGI near-term possibility",       // Optimistic view
  "AI winter coming",                // Skeptical view
  "AI incremental progress",         // Moderate view
  "AI breakthrough needed"           // Realist view
]
```

**Why This Works**: Explores the **spectrum of autonomy** while acknowledging **fundamental limits**, preventing over-hype.

---

## 2. Cross-Cutting Expansion Patterns

These patterns should apply across ALL manifesto-related queries:

### Persona-Based Expansion
```typescript
const PERSONA_EXPANSIONS = {
  leader: ["strategy", "ROI", "transformation", "change management"],
  worker: ["skills", "career", "upskilling", "job security"],
  technologist: ["architecture", "implementation", "autonomy", "capabilities"],
  skeptic: ["risks", "limitations", "failures", "hype"],
  optimist: ["potential", "breakthrough", "democratization", "empowerment"]
}
```

### Tension-Based Expansion
For every query, include perspectives from both sides of key tensions:

```typescript
const TENSION_PAIRS = [
  ["augmentation", "replacement"],
  ["AI-native", "AI-first"],
  ["people-first", "technology-first"],
  ["empowerment", "displacement"],
  ["democratization", "gatekeeping"],
  ["autonomy", "human oversight"],
  ["scaling", "limitations"],
  ["optimism", "realism"]
]
```

### Authority Citation Expansion
Reference thought leaders Alin cites:

```typescript
const CITED_AUTHORITIES = {
  "Andrej Karpathy": ["autonomy slider", "Iron Man suit vs robot"],
  "Yann LeCun": ["physical world modeling", "language limitations"],
  "MIT Study": ["90% AI project failure rate"]
}
```

---

## 3. Proposed Enhancements to Current System

### A. Add Manifesto-Aware Semantic Expansion

In `lib/api/thought-leaders.ts`, add new expansion rules:

```typescript
function expandManifestoQueries(query: string): string[] {
  const manifestoPatterns = [
    // Breaking the Fourth Wall
    {
      triggers: ["democratiz", "knowledge access", "barrier", "gatekeeper"],
      expansions: ["fourth wall", "enlightenment", "empowerment", "access", "literacy"]
    },

    // AI-Native vs AI-First
    {
      triggers: ["AI-first", "AI native", "transformation", "adoption"],
      expansions: ["AI-native", "people process", "change management", "upskilling"]
    },

    // Augmentation vs Replacement
    {
      triggers: ["augment", "replace", "Iron Man", "job loss"],
      expansions: ["suit vs robot", "collaboration", "displacement", "zombie jobs"]
    },

    // Agentic Workforce
    {
      triggers: ["agentic", "autonomous", "agent", "workflow"],
      expansions: ["autonomy", "supervision", "Karpathy slider", "human loop"]
    },

    // Technology Limits
    {
      triggers: ["scaling", "limitation", "dead internet", "slop"],
      expansions: ["scaling laws", "LeCun physics", "data shortage", "power limits"]
    }
  ]

  // Match and expand...
}
```

### B. Add Priority Scoring Based on Manifesto Relevance

```typescript
interface ExpandedQueryWithManifestoScore extends ExpandedQuery {
  manifestoRelevance?: number  // 0-10 score
  manifestoTheme?: 'society' | 'business' | 'worker' | 'technology'
}

function scoreManifestoRelevance(query: string): number {
  // Higher scores for queries directly addressing manifesto themes
  const manifestoKeywords = {
    high: ["fourth wall", "AI-native", "zombie jobs", "agentic", "augmentation"],  // 9-10
    medium: ["transformation", "upskilling", "autonomy", "democratization"],       // 6-8
    low: ["AI", "future", "impact"]                                                // 3-5
  }
  // Scoring logic...
}
```

### C. Create Domain-Specific N8N Prompts

Update the n8n workflow to accept domain context:

```typescript
// Enhanced request to n8n
POST /webhook/ai-query-expansion
{
  "query": "AI business transformation",
  "domain": "Enterprise AI Adoption",
  "manifestoContext": {
    "theme": "business",
    "keyTensions": ["augmentation vs replacement", "people vs technology"],
    "citedAuthorities": ["Andrej Karpathy"]
  }
}
```

The n8n Gemini prompt would then include:

```
You are expanding a query about "{domain}".
Key context from Alin's manifesto:
- This relates to the theme: {theme}
- Important tensions to explore: {keyTensions}
- Reference these thought leaders: {citedAuthorities}

Expand the query to surface BOTH sides of relevant debates...
```

---

## 4. UX Strategy for Manifesto-Driven Search

### A. Visual Cues for Tension-Based Results

```typescript
// In ExpandedQueries component
const TENSION_INDICATORS = {
  augmentation: { color: "blue", icon: "↗️", label: "Augmentation View" },
  replacement: { color: "red", icon: "↘️", label: "Replacement View" },
  optimist: { color: "green", icon: "🌟", label: "Optimistic View" },
  realist: { color: "orange", icon: "⚖️", label: "Balanced View" }
}
```

### B. "Explore the Other Side" Feature

After showing results, suggest counter-queries:

```
You searched: "AI will replace jobs"
👀 Explore the other side: "AI augmenting workers" | "AI creating new jobs"
```

### C. Manifesto Theme Tags

Tag each camp with manifesto themes:

```typescript
interface Camp {
  // existing fields...
  manifestoThemes?: Array<'society' | 'business' | 'worker' | 'technology'>
  tensionPosition?: {
    augmentVsReplace: 'augment' | 'replace' | 'neutral',
    optimismVsRealism: 'optimist' | 'realist' | 'balanced'
  }
}
```

---

## 5. Validation Strategy

Test expansion quality with manifesto-aligned queries:

```typescript
const TEST_QUERIES = [
  // Society
  "Will AI make us smarter or more dependent?",
  "AI breaking knowledge barriers",
  "AI mental health risks",

  // Business
  "Should we replace workers with AI?",
  "Why do AI transformations fail?",
  "AI-native vs AI-first company",

  // Workers
  "How to AI-proof my career?",
  "What are zombie jobs?",
  "Managing AI agents as a worker",

  // Technology
  "Will scaling laws continue?",
  "Dead internet theory",
  "Agentic AI autonomy levels"
]

// For each query, validate:
// 1. Do expanded queries surface multiple perspectives?
// 2. Are key manifesto concepts included?
// 3. Do results show both sides of relevant tensions?
// 4. Are cited authorities (Karpathy, LeCun) represented?
```

---

## 6. Implementation Roadmap

### Phase 1: Quick Wins (Current sprint)
- Add manifesto-specific semantic expansion patterns
- Update n8n prompt with manifesto context
- Add tension-pair tags to existing camps

### Phase 2: Enhanced Discovery (Next sprint)
- Implement "Explore the Other Side" feature
- Add manifesto theme filtering in UI
- Create manifesto relevance scoring

### Phase 3: Deep Integration (Future)
- Train custom expansion model on manifesto corpus
- Build interactive tension explorer
- Create personalized expansion based on user role (leader/worker/technologist)

---

## Summary: The Strategic Insight

**The key to search expansion for Alin's manifesto is surfacing TENSIONS, not just topics.**

Current system expands queries semantically (good).
**Manifesto-aware system should expand queries to reveal DEBATES** (better).

Every search should help users understand:
1. **What's the optimistic view?** (enlightenment, empowerment)
2. **What's the realistic concern?** (mental health, zombie jobs, scaling limits)
3. **Who are the key voices?** (Karpathy, LeCun, MIT study)
4. **What choice do I face?** (augment vs replace, AI-native vs AI-first)

This transforms search from "find information" to **"understand the landscape of thought"** – which is exactly what a compass should do.

---

## Related Documents

- [Alin's Manifesto](./Alin's%20manifesto.md) - Core thesis document
- [ADR-0006: Search Expansion Architecture](../architecture/decisions/0006-search-expansion-architecture.md) - Technical implementation
- Current implementation: `/lib/search-expansion/` - Modular architecture with n8n + Gemini integration

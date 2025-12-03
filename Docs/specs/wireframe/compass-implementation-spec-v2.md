# Compass Results Page - Implementation Spec v2

## Design Principles

### The "First-Time User" Rule
**Every label, badge, and term must be immediately understandable to someone who has never seen this tool before.** No jargon. No abstract terms. If you need to explain it, rename it.

### The "Plain English" Test
Before using any label, ask: *"Would my non-technical colleague immediately understand this?"*

---

## Naming Conventions

### Old → New: Camp Names

| Domain | Old Name (Confusing) | New Name (Intuitive) | Why It Works |
|--------|---------------------|---------------------|--------------|
| AI Progress | Grounding Realists | **Needs New Approaches** | Immediately says "current AI isn't enough" |
| AI Progress | Scaling Maximalists | **Scaling Will Deliver** | Immediately says "more compute = progress" |
| Society | Ethical Stewards | **Safety First** | Universal understanding |
| Society | Tech Realists | **Iterate Responsibly** | Action-oriented, clear |
| Society | Tech Utopians | **Democratize Fast** | Shows priority is speed |
| Governance | Regulatory Interventionists | **Regulate Now** | Two words, crystal clear |
| Governance | Adaptive Governance | **Evolve Together** | Collaborative, balanced |
| Governance | Innovation-First | **Let Industry Lead** | Self-explanatory |
| Future of Work | Displacement Realists | **Jobs Will Disappear** | Stark, clear position |
| Future of Work | Human-AI Collaboration | **Humans + AI Together** | Positive, clear |
| Enterprise | Tech-First | **Technology Leads** | Simple priority statement |
| Enterprise | Co-Evolution | **Evolve Together** | Collaborative process |
| Enterprise | Proof Seekers | **Measure After** | When they measure |
| Enterprise | Learning Architects | **Measure As You Go** | Continuous feedback |
| Enterprise | Tech Builders | **Build It, They'll Come** | Famous phrase, clear meaning |
| Enterprise | Business Whisperers | **Translation Is Key** | The core insight |

### Agreement Levels (Not "Alignment")

| Old Term | New Term | Badge Text | Hint Text |
|----------|----------|------------|-----------|
| Strong Alignment | **Agree** | `AGREES` | "Support your view" |
| Partial Alignment | **Partially Agree** | `PARTIAL` | "With some caveats" |
| Challenge | **Disagree** | `DISAGREES` | "Challenge your view" |
| Emerging | **New Voices** | `NEW` | "Emerging perspectives" |

---

## Component Specifications

### 1. Results Summary (Top)

**Header:** "Who agrees with your thesis?"  
**Subheader:** "Click to filter authors by their stance"

This immediately tells users:
1. What they're looking at
2. That it's interactive
3. What they'll learn

```
┌─────────────────────────────────────────────────────────────┐
│  Who agrees with your thesis?           🔍 "safety alignment" │
│  Click to filter authors by their stance                     │
│                                                              │
│  ┌────────┐ ┌────────────┐ ┌──────────┐ ┌───────────┐       │
│  │ 24     │ │ 12         │ │ 8        │ │ 5         │       │
│  │ Agree  │ │ Partially  │ │ Disagree │ │ New Voices│       │
│  │        │ │ Agree      │ │          │ │           │       │
│  └────────┘ └────────────┘ └──────────┘ └───────────┘       │
│                                                              │
│  Showing 24 authors who agree across 4 topics      [Clear]  │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Domain Headers

**Pattern:** Simple name + author count + key question

```
┌─────────────────────────────────────────────────────────────┐
│  [icon]  AI Technical Capabilities           [12 authors]   │
│          What's technically possible with AI and its limits?│
└─────────────────────────────────────────────────────────────┘
```

**Domain naming:**

| Original | Simplified |
|----------|-----------|
| AI Progress (Technical Frontier) | **AI Technical Capabilities** |
| Society & Ethics | **AI & Society** |
| Governance & Oversight | **AI Governance & Oversight** |
| Enterprise Transformation | **Enterprise AI Adoption** |
| Future of Work | **Future of Work** (keep) |

---

### 3. Viewpoint Slider (NOT "Position Spectrum")

**Key changes:**
- Remove "Position Spectrum" label entirely
- Replace with a **contextual question** specific to each domain
- Use plain language for endpoints

**Structure:**
```
Where do thinkers stand on AI's path forward?

┌──────────────────────────────────────────────────────────────┐
│  Needs New Approaches      │      Scaling Will Deliver       │
│      7 authors             │           5 authors             │
└──────────────────────────────────────────────────────────────┘
← More architectural changes needed    Current approach will work →
```

**Per-domain slider questions:**

| Domain | Slider Question |
|--------|----------------|
| AI Technical Capabilities | "Where do thinkers stand on AI's path forward?" |
| AI Governance | "How much regulation does AI need?" |
| AI & Society | "How should we approach AI's social impact?" |
| Enterprise AI | "What should lead: technology or people?" |
| Future of Work | "Will AI replace or augment workers?" |

**Slider tooltips:** Show on hover, explain the position in 1-2 sentences.

---

### 4. Author Cards

**Badge language:**
- `AGREES` (green) - not "Strong"
- `PARTIAL` (amber) - not "Partial Alignment"  
- `DISAGREES` (red) - not "Challenge"

**Viewpoint label:** Show the intuitive camp name (e.g., "Needs New Approaches")

```
┌─────────────────────────────────────┐
│  Yann LeCun                [AGREES] │
│  Chief AI Scientist, Meta           │
│  ┌────────────────────────────────┐ │
│  │ Needs New Approaches           │ │
│  └────────────────────────────────┘ │
│                                     │
│  WHY THIS MATTERS                   │
│  Leading voice arguing LLMs lack... │
│                                     │
│  "Auto-regressive LLMs are doomed"  │
│                                     │
│  📎 Meta AI Blog • Mar 2024         │
└─────────────────────────────────────┘
```

---

### 5. Enterprise Dimension Tabs

**Original labels → New labels:**

| Original | New (as questions) |
|----------|-------------------|
| Adoption Philosophy | **How to adopt?** |
| Measurement Approach | **How to measure?** |
| Translation Capability | **How to translate?** |

These tabs frame the sub-spectrums as actionable questions.

---

## Design System

### Typography (shadcn/modern SaaS standard)
- **Font:** Inter (or system fonts as fallback)
- **Headings:** 15-18px, weight 600
- **Body:** 13-14px, weight 400
- **Labels:** 11-12px, weight 500-600, uppercase for section headers

### Colors

```css
/* Agreement levels */
--agrees: #059669;
--agrees-bg: #ecfdf5;

--partial: #d97706;
--partial-bg: #fffbeb;

--disagrees: #dc2626;
--disagrees-bg: #fef2f2;

--new-voice: #7c3aed;
--new-voice-bg: #f5f3ff;

/* Slider gradient (left to right) */
--slider-cautious: #fecdd3;  /* pink/red-ish */
--slider-balanced: #fef3c7;   /* amber */
--slider-optimistic: #bbf7d0; /* green */
```

### Icons
Use **Lucide icons** throughout. Consistent stroke width (2px), 16-20px size.

| Element | Lucide Icon |
|---------|-------------|
| Search | `search` |
| External link | `external-link` |
| Saved search | `bookmark` |
| Close/Clear | `x` |
| AI Tech domain | `atom` or custom |
| Governance domain | `message-circle` |
| Society domain | `globe` |
| Enterprise domain | `building-2` |
| Future of Work domain | `users` |

---

## Interaction Flows

### Filtering

1. **Global filter (agreement cards):** Clicking "Agree" filters ALL domains to show only authors who agree
2. **Local filter (slider segment):** Clicking a slider segment filters only THAT domain
3. **Combined:** Both work together (global + local)

### Progressive Disclosure

- Show max **3 author cards** per domain by default
- "Show X more authors" button expands remaining
- Collapsed state shows enough to understand the domain's landscape

---

## Implementation Checklist

### Must-Have for MVP
- [ ] Agreement cards with clear labels (Agree/Partial/Disagree/New)
- [ ] Domain headers with key questions
- [ ] Slider bars with intuitive camp names
- [ ] Hover tooltips explaining each position
- [ ] 3-card limit with "show more"
- [ ] Global filtering from agreement cards
- [ ] Local filtering from slider segments

### Nice-to-Have (V2)
- [ ] Animated slider that feels like dragging
- [ ] Smooth expand/collapse animations
- [ ] Save filter preferences
- [ ] Remember last viewed state

---

## Files

- **Wireframe:** `compass-results-wireframe-v2.html` - Interactive HTML prototype
- **Taxonomy mapping:** Use the table above to map old camp names → new names

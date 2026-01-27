# Voice Lab

## Module Concept for Compass

---

## The Name

**Voice Lab**

Why this works:
- "Voice" signals writing style without being jargon-heavy
- "Lab" suggests experimentation, analysis, and creation
- Together they imply: this is where you study, capture, and deploy writing voices
- Short, memorable, action-oriented

Alternative names considered:
- Style DNA (too clinical)
- Voice Forge (too manufacturing-focused)
- Tone Studio (too audio-associated)
- Style Vault (too storage-focused, not active enough)

---

## What Voice Lab Does

Voice Lab is Compass's style intelligence engine. It performs three core functions:

| Function | Description |
|----------|-------------|
| **Capture** | Analyze writing samples to extract style patterns |
| **Store** | Save style profiles as reusable assets |
| **Deploy** | Apply style profiles to other Compass functions |

---

## Core Concept: The Style Profile

Voice Lab's central output is the **Style Profile**—a structured, machine-readable style guide that can be:
- Viewed by humans as documentation
- Consumed by AI Editor and Content Builder as instructions
- Versioned and iterated over time
- Shared across team members

A Style Profile contains:
- Style name and description
- Core principles (weighted by importance)
- Tone parameters
- Sentence-level rules
- Vocabulary preferences and restrictions
- Example transformations
- Application guidance

---

## Voice Lab Interface

### Main Views

**1. Library**
Grid or list of saved Style Profiles. Each card shows:
- Style name
- Source (who/what it was derived from)
- Date created / last updated
- Usage count (how often it's been applied)
- Quick actions: Edit, Duplicate, Apply, Delete

**2. Analyzer**
Where new Style Profiles are created:
- Upload or paste writing samples
- Set analysis depth (Quick / Standard / Deep)
- Review generated profile
- Edit and refine
- Save to library

**3. Profile Editor**
Detailed view of a single Style Profile:
- All sections editable
- Add/remove principles
- Adjust tone sliders
- Manage vocabulary lists
- Test with sample transformations

---

## Integration Map

```
┌─────────────────────────────────────────────────────────────────┐
│                          COMPASS                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌───────────┐      Style Profile      ┌──────────────────┐   │
│   │           │ ──────────────────────► │                  │   │
│   │ VOICE LAB │                         │    AI EDITOR     │   │
│   │           │ ◄────────────────────── │                  │   │
│   └───────────┘    Edited content for   └──────────────────┘   │
│         │          style refinement                             │
│         │                                                        │
│         │           Style Profile       ┌──────────────────┐   │
│         └─────────────────────────────► │                  │   │
│                                         │  CONTENT BUILDER │   │
│         ┌─────────────────────────────► │                  │   │
│         │         + Content Brief       └──────────────────┘   │
│         │                                         │             │
│         │                                         │             │
│         │          ┌──────────────────┐          │             │
│         │          │                  │ ◄────────┘             │
│         └───────── │     OUTPUTS      │   Generated content    │
│    Style-checked   │                  │                        │
│    deliverables    └──────────────────┘                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integration Details

### Voice Lab → AI Editor

**Use case:** "Edit this draft to match our CEO's voice"

**How it works:**
1. User opens AI Editor with a draft
2. User selects a Style Profile from Voice Lab
3. AI Editor receives the profile as a constraint layer
4. Edits and suggestions align with the style's principles, tone, and vocabulary rules
5. User can toggle style enforcement on/off during editing

**What AI Editor receives from Voice Lab:**
```
{
  "style_profile": {
    "name": "Constructive Confrontation",
    "principles": [...],
    "tone": {
      "directness": 0.9,
      "warmth": 0.6,
      "formality": 0.5,
      "urgency": 0.8
    },
    "vocabulary": {
      "prefer": ["harness", "transform", "compound"],
      "avoid": ["synergy", "leverage", "perhaps"],
      "never": ["stakeholder alignment", "circle back"]
    },
    "sentence_rules": {
      "max_hedge_words_per_paragraph": 1,
      "prefer_active_voice": true,
      "short_sentence_for_impact": true
    },
    "examples": [...]
  }
}
```

**UI integration:**
- Style Profile selector in AI Editor sidebar
- "Style Match" score showing how well current draft aligns
- Inline suggestions flagged as "style adjustment" vs "grammar/clarity"
- One-click "Apply style" to transform selected text

---

### Voice Lab → Content Builder

**Use case:** "Generate a leadership memo in Alin's voice about Q3 priorities"

**How it works:**
1. User opens Content Builder
2. User provides content brief (topic, key points, audience, format)
3. User selects a Style Profile from Voice Lab
4. Content Builder generates draft applying style constraints
5. Output reflects both the content requirements AND the style profile

**What Content Builder receives from Voice Lab:**
Same style profile object as AI Editor, plus:
- Transformation examples for few-shot learning
- Document architecture patterns (how to structure openings, transitions, closings)

**UI integration:**
- "Voice" dropdown in Content Builder settings
- Preview showing style characteristics that will be applied
- Generated content tagged with style attribution
- Option to "Generate without style" for comparison

---

### Voice Lab ← AI Editor (Feedback Loop)

**Use case:** "This edited version is better—update the style profile"

**How it works:**
1. User edits content in AI Editor with a Style Profile active
2. User makes manual changes that deviate from style suggestions
3. User flags changes as "style refinement" (not one-off exceptions)
4. Voice Lab receives the refinement data
5. Style Profile is updated or flagged for review

**Why this matters:**
Styles evolve. The feedback loop keeps profiles current without requiring full re-analysis.

---

### Voice Lab → Outputs (Style Validation)

**Use case:** "Check this final deliverable against our brand voice"

**How it works:**
1. User has a completed document
2. User runs "Style Check" against a selected profile
3. Voice Lab returns:
   - Overall match score
   - Section-by-section breakdown
   - Specific passages that deviate
   - Suggested corrections
4. User can accept suggestions or approve deviations

**UI integration:**
- "Check Style" action available on any document
- Report view showing alignment metrics
- Exportable as QA documentation

---

## User Workflows

### Workflow 1: Capture a Leader's Voice

**Scenario:** Marketing wants to draft thought leadership pieces that sound like the CEO.

1. Collect 5-10 writing samples from the CEO (emails, presentations, past articles)
2. Open Voice Lab → Analyzer
3. Upload samples
4. Run Deep Analysis
5. Review generated Style Profile
6. Refine principles and examples
7. Save as "CEO Voice"
8. Share with marketing team

**Time:** 30-45 minutes for initial capture

---

### Workflow 2: Generate Content in a Specific Voice

**Scenario:** Need to write a company announcement that sounds like the CEO.

1. Open Content Builder
2. Set content brief: "Company announcement about new product launch"
3. Select "CEO Voice" from Voice Lab
4. Generate draft
5. Review and refine in AI Editor (with same profile active)
6. Run final Style Check
7. Export

**Time:** 15-20 minutes for first draft

---

### Workflow 3: Maintain Brand Consistency

**Scenario:** Multiple writers contributing to a campaign; need consistent voice.

1. Create or select brand Style Profile in Voice Lab
2. Share profile with all contributors
3. Writers use AI Editor with profile active
4. All drafts run through Style Check before approval
5. Deviations flagged and corrected
6. Final outputs share consistent voice

**Ongoing process**

---

### Workflow 4: Evolve a Style Over Time

**Scenario:** Company voice is shifting; need to update the profile.

1. Collect recent writing samples showing the new direction
2. Open existing Style Profile in Voice Lab
3. Run "Compare" analysis against new samples
4. Review suggested updates
5. Accept, reject, or modify changes
6. Version the profile (keep old version accessible)
7. Notify users of update

**Time:** 20-30 minutes for update

---

## Style Profile Lifecycle

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ CAPTURE │ ──► │  REFINE │ ──► │ DEPLOY  │ ──► │ EVOLVE  │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │               │               │               │
     ▼               ▼               ▼               ▼
  Analyze        Edit and        Apply to        Update from
  samples        validate        Editor &        feedback &
                 profile         Builder         new samples
```

---

## Data Model (Simplified)

```
StyleProfile {
  id: string
  name: string
  description: string
  source: {
    type: "person" | "brand" | "document" | "custom"
    attribution: string
    samples: Sample[]
  }
  created_at: timestamp
  updated_at: timestamp
  version: number
  
  principles: Principle[]
  tone: ToneSettings
  vocabulary: VocabularyRules
  sentence_rules: SentenceRules
  document_patterns: DocumentPatterns
  transformations: Transformation[]
  
  metadata: {
    usage_count: number
    last_used: timestamp
    shared_with: User[]
  }
}

Principle {
  name: string
  description: string
  weight: number (0-1)
  examples: string[]
}

ToneSettings {
  directness: number (0-1)
  warmth: number (0-1)
  formality: number (0-1)
  urgency: number (0-1)
  complexity: number (0-1)
  // extensible for custom dimensions
}

VocabularyRules {
  prefer: string[]
  avoid: string[]
  never: string[]
  replace: { [key: string]: string }
}
```

---

## Voice Lab Settings

### Analysis Settings
- **Depth:** Quick (under 1,500 words output) / Standard (2,000-3,000 words) / Deep (3,000-4,000 words)
- **Focus areas:** Toggle which sections to analyze (tone, vocabulary, structure, etc.)
- **Comparison mode:** Analyze against an existing profile to show differences

### Profile Settings
- **Visibility:** Private / Team / Organization
- **Editability:** Owner only / Collaborators / Anyone with access
- **Versioning:** On/Off
- **Notifications:** Alert when profile is updated

### Integration Settings
- **Default profile:** Set a default for AI Editor and Content Builder
- **Enforcement level:** Strict (hard constraints) / Guided (suggestions) / Reference (information only)
- **Style Check threshold:** Minimum match score to pass validation

---

## Voice Lab + Anduin Brand

Given the existing Anduin brand skill, Voice Lab can:

1. **Import brand guidelines** as a foundational Style Profile
2. **Layer additional voices** on top (CEO voice + brand guidelines)
3. **Validate** that individual voices don't conflict with brand requirements
4. **Flag** when a Style Profile deviates from brand standards

This creates a hierarchy:
- **Brand Profile** (baseline, applies to everything)
- **Team Profiles** (layer on top for specific functions)
- **Personal Profiles** (individual voices within brand constraints)

---

## Success Metrics

| Metric | What It Measures |
|--------|------------------|
| Profiles created | Adoption of Voice Lab |
| Profiles applied | Integration with Editor/Builder |
| Style Check pass rate | Quality of style alignment |
| Time to first draft | Efficiency gains from style guidance |
| Revision cycles | Whether style guidance reduces back-and-forth |
| User satisfaction | Perceived value of style features |

---

## MVP Scope

For initial release, focus on:

1. **Analyzer** — Upload samples, generate Style Profile
2. **Library** — Save, view, edit profiles
3. **AI Editor integration** — Select profile, receive style-aligned suggestions
4. **Style Check** — Validate document against profile

Defer to later:
- Content Builder integration
- Feedback loop / auto-evolution
- Team sharing and permissions
- Brand hierarchy and layering
- Advanced versioning

---

## Summary

Voice Lab is Compass's answer to the question: "How do we write like [person/brand] consistently and at scale?"

It captures style intelligence from samples, stores it as reusable profiles, and deploys it across AI Editor and Content Builder. The result is consistent voice across all content, efficient onboarding of new writers, and preserved institutional knowledge of how key voices communicate.

The module completes the Compass content workflow:
- **Voice Lab** answers "How should it sound?"
- **Content Builder** answers "What should it say?"
- **AI Editor** answers "How do we make it better?"

Together, they form a closed loop from style capture to content generation to refinement.

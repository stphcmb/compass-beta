# Compass Modular Architecture

## Voice Lab Integration & System Design

---

## Part 1: User Stories, Goals & Pain Points

---

### Persona 1: The Content Creator

**Who they are:** Marketing specialist, content writer, or communications lead who produces written content regularly. Non-technical. Needs to write in various voices depending on context.

**User Stories:**

| Story | Goal | Pain Point |
|-------|------|------------|
| "I need to write a leadership memo that sounds like our CEO" | Produce authentic voice-matched content quickly | Spends hours trying to mimic someone's style by re-reading their past writing |
| "I want to maintain consistent brand voice across all my outputs" | Ensure everything sounds on-brand | Gets inconsistent feedback; no clear standard to measure against |
| "I need to onboard a new writer to our house style" | Transfer style knowledge efficiently | Style guides are abstract; new writers take months to "get it" |
| "I want to repurpose content for different channels without losing voice" | Adapt content while preserving identity | Manual rewriting is slow; loses voice nuance in translation |

**Primary goals:**
- Speed: Produce content faster without sacrificing quality
- Consistency: Hit the right voice reliably, every time
- Confidence: Know the output will pass review before submitting

**Pain points:**
- Style guides are too abstract to apply practically
- Voice matching is subjective and hard to verify
- Feedback loops are slow ("This doesn't sound like us" — but why?)
- Context-switching between voices is mentally taxing

---

### Persona 2: The Content Strategist

**Who they are:** Team lead or manager who oversees content output, sets standards, and ensures quality across multiple writers. Responsible for voice and brand consistency at scale.

**User Stories:**

| Story | Goal | Pain Point |
|-------|------|------------|
| "I need to capture our founder's voice before they leave" | Preserve institutional knowledge | Voice expertise lives in people's heads; walks out the door |
| "I want to QA content against our brand standards" | Ensure all output meets bar before publishing | Manual review doesn't scale; inconsistent application |
| "I need visibility into how well writers are matching style" | Track team performance and identify coaching needs | No metrics; purely subjective assessment |
| "I want to create voice variations for different audiences" | Develop audience-specific voice profiles | Single brand guide doesn't flex for context |

**Primary goals:**
- Governance: Set and enforce standards across team
- Scalability: Maintain quality as output volume grows
- Knowledge capture: Codify implicit voice knowledge explicitly

**Pain points:**
- Bottlenecked as the only person who "knows" the right voice
- Can't scale review without sacrificing quality
- Onboarding new writers takes too long
- Voice drift happens gradually and goes unnoticed

---

### Persona 3: The Executive / Subject Matter Expert

**Who they are:** Leader or expert whose voice needs to be captured and deployed at scale. Doesn't write their own content but needs output to sound authentically like them.

**User Stories:**

| Story | Goal | Pain Point |
|-------|------|------------|
| "I want my team to draft content that sounds like me" | Extend personal voice without personal time | Ghostwritten content sounds generic or off-brand |
| "I need to review drafts quickly and know they're close" | Minimize editing time on content review | Spends too much time rewriting to fix voice |
| "I want to approve a 'voice profile' rather than every piece" | Delegate content production confidently | Can't trust output without heavy personal review |

**Primary goals:**
- Authenticity: Output genuinely sounds like them
- Leverage: Multiply their voice without multiplying their time
- Control: Approve the system, not every artifact

**Pain points:**
- Ghostwritten content feels generic
- Constant revision cycles waste leadership time
- Can't articulate what makes their voice distinctive
- Team can't replicate their communication instincts

---

### Persona 4: The Builder / Power User

**Who they are:** Technically curious user who wants to construct and optimize the content creation system itself. May be product manager, ops lead, or advanced content creator.

**User Stories:**

| Story | Goal | Pain Point |
|-------|------|------------|
| "I want to create style profiles from scratch" | Build new voices for new contexts | Limited to existing templates; can't customize |
| "I need to combine multiple influences into one voice" | Create hybrid styles | Tools only work with single-source profiles |
| "I want to A/B test different voice approaches" | Optimize for audience response | No way to systematically compare voice variations |
| "I need to integrate voice profiles with our other tools" | Embed in existing workflows | Standalone tool creates friction |

**Primary goals:**
- Customization: Build exactly what's needed
- Experimentation: Test and iterate on voice approaches
- Integration: Connect with broader content ecosystem

**Pain points:**
- Tools are too rigid; can't be customized
- No way to version or evolve profiles systematically
- Insights trapped in silos; can't feed back into improvement
- Learning curve for advanced features is steep

---

## Part 2: User Flows

---

### Flow 1: Capture a Voice (Voice Lab)

**Trigger:** User has writing samples and wants to create a reusable Style Profile.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CAPTURE A VOICE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │ START   │    │ UPLOAD  │    │ ANALYZE │    │ REVIEW  │    │  SAVE   │  │
│  │         │───►│ SAMPLES │───►│         │───►│ & EDIT  │───►│         │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │              │              │              │              │        │
│       ▼              ▼              ▼              ▼              ▼        │
│  Open Voice    Drop files     Select depth    Review profile   Name and   │
│  Lab from      or paste       (Quick/Deep)    Edit principles  save to    │
│  nav           text           Hit "Analyze"   Test transforms  library    │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Detailed steps:**

1. **Entry:** User clicks "Voice Lab" in main navigation
2. **Upload:** 
   - Drag/drop files (PDF, DOCX, TXT, MD)
   - Paste text directly
   - Link to URLs (optional)
   - System shows sample count and word estimate
3. **Configure:**
   - Select analysis depth (Quick: 5 min / Standard: 10 min / Deep: 15 min)
   - Optional: Name the source (e.g., "CEO Communications")
4. **Analyze:**
   - Progress indicator during processing
   - Preview sections as they complete
5. **Review:**
   - Full Style Profile displayed in editor view
   - Each section expandable/collapsible
   - Inline editing available
   - "Test" panel to try transformations
6. **Save:**
   - Name the profile
   - Add description and tags
   - Set visibility (Private / Team / Org)
   - Save to library

**Exit points:**
- Saved profile → Library view
- Cancel → Discard or save draft
- Edit later → Save as draft

---

### Flow 2: Generate Content in a Voice (Content Builder + Voice Lab)

**Trigger:** User needs to create content and wants it in a specific voice.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GENERATE CONTENT IN A VOICE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │ START   │    │ BRIEF   │    │ SELECT  │    │GENERATE │    │ REFINE  │  │
│  │         │───►│ CONTENT │───►│ VOICE   │───►│         │───►│         │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │              │              │              │              │        │
│       ▼              ▼              ▼              ▼              ▼        │
│  Open Content   Enter topic    Pick Style     Generate with    Edit in    │
│  Builder        key points     Profile from   voice applied    AI Editor  │
│                 audience       Voice Lab                       (voice on) │
│                 format                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Detailed steps:**

1. **Entry:** User clicks "Content Builder" in main navigation
2. **Brief:**
   - Content type selector (memo, email, article, announcement, etc.)
   - Topic/subject field
   - Key points to include (bullet input)
   - Target audience
   - Desired length
3. **Select Voice:**
   - Voice picker dropdown shows profiles from Voice Lab library
   - Preview card shows profile summary
   - "No voice" option for neutral output
   - Quick-create link to Voice Lab if needed profile doesn't exist
4. **Generate:**
   - "Generate" button with voice attribution shown
   - Progress indicator
   - Output appears in preview panel
   - Regenerate option with same or different parameters
5. **Refine:**
   - "Open in Editor" sends to AI Editor with same voice profile active
   - OR export directly if satisfied
   - Style Match score shown

**Exit points:**
- Satisfied → Export / Copy / Save
- Needs work → AI Editor (with voice)
- Start over → Clear and re-brief

---

### Flow 3: Edit Content to Match a Voice (AI Editor + Voice Lab)

**Trigger:** User has existing content and wants to align it with a specific voice.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EDIT CONTENT TO MATCH VOICE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │ START   │    │  LOAD   │    │ SELECT  │    │  EDIT   │    │ VERIFY  │  │
│  │         │───►│ CONTENT │───►│ VOICE   │───►│         │───►│         │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │              │              │              │              │        │
│       ▼              ▼              ▼              ▼              ▼        │
│  Open AI       Paste, upload   Pick Style     Edit with        Run Style │
│  Editor        or continue     Profile        style-aware      Check     │
│                from Builder                   suggestions                 │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Detailed steps:**

1. **Entry:** User clicks "AI Editor" in main navigation (or arrives from Content Builder)
2. **Load:**
   - Paste text into editor
   - Upload file
   - Continue from Content Builder (content pre-loaded)
3. **Select Voice:**
   - Voice picker in editor toolbar
   - Shows current selection (or "None")
   - Selecting a profile enables style-aware mode
4. **Edit:**
   - Editor shows Style Match score in corner
   - Suggestions panel shows style-specific recommendations
   - Inline highlights for style deviations
   - Accept/reject individual suggestions
   - Toggle voice enforcement on/off
5. **Verify:**
   - "Run Style Check" for full report
   - Section-by-section breakdown
   - Overall pass/fail against threshold
   - Export or continue editing

**Exit points:**
- Passes check → Export / Copy / Save
- Needs work → Continue editing
- Change voice → Select different profile

---

### Flow 4: Validate Content Against Voice (Style Check)

**Trigger:** User has final content and wants to verify it matches voice before publishing.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VALIDATE AGAINST VOICE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐                  │
│  │ START   │    │  LOAD   │    │  CHECK  │    │ RESOLVE │                  │
│  │         │───►│ CONTENT │───►│         │───►│         │                  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘                  │
│       │              │              │              │                        │
│       ▼              ▼              ▼              ▼                        │
│  "Style Check"  Select content  Select profile  Review issues             │
│  from any       + profile       Run check       Fix or approve            │
│  module                                         deviations                 │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Detailed steps:**

1. **Entry:** 
   - "Style Check" button available in AI Editor toolbar
   - Also accessible from Library (right-click on any document)
2. **Load:**
   - Content loaded from current editor OR
   - Upload/paste for standalone check
   - Select Style Profile to check against
3. **Check:**
   - System analyzes content
   - Returns report with:
     - Overall score (0-100)
     - Pass/Fail status (based on threshold)
     - Section breakdown
     - Specific deviations flagged
4. **Resolve:**
   - For each deviation:
     - View original text
     - See suggested revision
     - Accept fix / Reject (approve deviation) / Edit manually
   - Re-run check after fixes
   - Export report as documentation

---

### Flow 5: Evolve a Voice Profile (Feedback Loop)

**Trigger:** User has been editing content and wants to incorporate refinements back into the Style Profile.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EVOLVE A VOICE PROFILE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │ EDITING │    │  FLAG   │    │ REVIEW  │    │ APPROVE │    │ VERSION │  │
│  │         │───►│REFINEMT │───►│ CHANGES │───►│         │───►│         │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │              │              │              │              │        │
│       ▼              ▼              ▼              ▼              ▼        │
│  User overrides  Mark as        Voice Lab      Accept or       Save as   │
│  style suggest.  "style         shows pending  reject each     new       │
│  in AI Editor    refinement"    refinements    refinement      version   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Detailed steps:**

1. **During Editing:**
   - User overrides a style suggestion in AI Editor
   - System prompts: "Save as style refinement?"
   - User confirms → refinement queued
2. **Flag:**
   - Refinement stored with context (original, override, reason)
   - Badge appears on profile in library showing pending refinements
3. **Review:**
   - Profile owner opens Voice Lab → Profile → Refinements tab
   - List of pending refinements with context
4. **Approve:**
   - For each: Accept (incorporate) / Reject (discard) / Modify
   - Accepted changes update profile rules
5. **Version:**
   - System prompts to save as new version or overwrite
   - Version history maintained
   - Notify users of profile update (optional)

---

## Part 3: Modular App Architecture

---

### Design Philosophy

Compass is built as a **module orchestration shell**. The shell provides:
- Navigation and routing
- Shared state management
- Common UI components
- Cross-module communication

Modules are **self-contained functional units** that:
- Own their own views and logic
- Expose interfaces for cross-module integration
- Can be enabled/disabled independently
- Share data through defined contracts

---

### Module Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              COMPASS SHELL                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Navigation  │  State Manager  │  UI Kit  │  Event Bus  │  Auth    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                  │
│   │   VOICE LAB   │  │CONTENT BUILDER│  │   AI EDITOR   │                  │
│   │               │  │               │  │               │                  │
│   │ - Analyzer    │  │ - Briefing    │  │ - Editor      │                  │
│   │ - Library     │  │ - Generator   │  │ - Suggestions │                  │
│   │ - Editor      │  │ - Templates   │  │ - Style Mode  │                  │
│   │ - Style Check │  │               │  │ - Export      │                  │
│   └───────┬───────┘  └───────┬───────┘  └───────┬───────┘                  │
│           │                  │                  │                          │
│           └──────────────────┼──────────────────┘                          │
│                              │                                              │
│                    ┌─────────▼─────────┐                                   │
│                    │   SHARED ASSETS   │                                   │
│                    │                   │                                   │
│                    │ - Style Profiles  │                                   │
│                    │ - Documents       │                                   │
│                    │ - Templates       │                                   │
│                    └───────────────────┘                                   │
│                                                                             │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                  │
│   │   RESEARCH    │  │    LAUNCH     │  │   [FUTURE]    │                  │
│   │   EXPANDER    │  │COMMAND CENTER │  │               │                  │
│   │               │  │               │  │ - Analytics   │                  │
│   │ - Web search  │  │ - Upload      │  │ - Integratns  │                  │
│   │ - Synthesis   │  │ - Analyze     │  │ - Workflows   │                  │
│   │ - Citations   │  │ - Outputs     │  │               │                  │
│   └───────────────┘  └───────────────┘  └───────────────┘                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Module Definitions

#### Voice Lab
**Purpose:** Capture, store, and deploy writing style intelligence.

**Core functions:**
- Analyze writing samples → Style Profile
- Store and manage Style Profiles
- Provide Style Profiles to other modules
- Validate content against profiles

**Exposes:**
- `getProfiles()` — List available profiles
- `getProfile(id)` — Retrieve specific profile
- `checkStyle(content, profileId)` — Validate content
- `onProfileUpdate` — Event when profile changes

**Consumes:**
- Documents from Shared Assets
- Edit events from AI Editor (for feedback loop)

---

#### Content Builder
**Purpose:** Generate content from briefs with optional voice application.

**Core functions:**
- Accept content brief (topic, format, audience)
- Generate content via AI
- Apply Style Profile constraints
- Output to editor or export

**Exposes:**
- `generate(brief, options)` — Create content
- `getTemplates()` — List content templates

**Consumes:**
- `Voice Lab.getProfiles()` — Available voices
- `Voice Lab.getProfile(id)` — Active voice constraints

---

#### AI Editor
**Purpose:** Edit content with AI assistance and optional style enforcement.

**Core functions:**
- Rich text editing environment
- AI-powered suggestions
- Style-aware editing mode
- Export and save

**Exposes:**
- `loadContent(content, options)` — Open content for editing
- `onContentChange` — Event for content updates
- `onStyleOverride` — Event when user overrides style suggestion

**Consumes:**
- `Voice Lab.getProfile(id)` — Active style constraints
- `Voice Lab.checkStyle()` — Style validation
- `Content Builder` output — Content to edit

---

#### Launch Command Center (Existing)
**Purpose:** Upload source materials, analyze, generate structured outputs.

**Core functions:**
- Upload documents
- Run analysis pipeline
- Generate narrative, messaging, assets

**Exposes:**
- `onAnalysisComplete` — Event with extracted data
- `getOutputs()` — Retrieve generated content

**Consumes:**
- Could consume `Voice Lab.getProfile(id)` for voice-matched output generation

---

#### Research Expander (Future)
**Purpose:** Deep research and synthesis from web sources.

**Core functions:**
- Web search and aggregation
- Source synthesis
- Citation management

**Exposes:**
- `research(query)` — Run research task
- `getCitations()` — Retrieve sources

**Consumes:**
- Could feed into Content Builder as source material

---

### Cross-Module Communication

**Event Bus Pattern:**

Modules communicate through a central event bus for loose coupling.

```javascript
// Voice Lab publishes
eventBus.emit('voicelab:profile-updated', { profileId, changes });

// AI Editor subscribes
eventBus.on('voicelab:profile-updated', (data) => {
  if (data.profileId === activeProfile) {
    refreshStyleConstraints();
  }
});
```

**Direct API Pattern:**

For synchronous data needs, modules expose APIs.

```javascript
// Content Builder calls Voice Lab directly
const profile = await voiceLab.getProfile(selectedProfileId);
const content = await contentBuilder.generate(brief, { style: profile });
```

---

### Shared State

**Global state managed by shell:**
- Current user
- Active workspace/project
- Navigation state
- Notification queue

**Module-specific state:**
- Owned entirely by module
- Exposed through getters if needed by others
- Persisted by module (local storage, backend, etc.)

**Shared Assets:**
- Style Profiles (owned by Voice Lab, consumed by others)
- Documents (shared library)
- Templates (owned by Content Builder)

---

## Part 4: UI Design Recommendations

---

### Shell Structure

Based on existing Compass patterns (dark theme, Anduin brand):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌──────┐                                                      ┌─────────┐ │
│  │ LOGO │   Compass                            Search    [?]   │ Profile │ │
│  └──────┘                                                      └─────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌───────────────────────────────────────────────────────────┐  │
│ │         │ │                                                           │  │
│ │  NAV    │ │                                                           │  │
│ │         │ │                       MODULE VIEW                         │  │
│ │ Voice   │ │                                                           │  │
│ │ Lab     │ │                   (Content area owned                     │  │
│ │         │ │                    by active module)                      │  │
│ │ Content │ │                                                           │  │
│ │ Builder │ │                                                           │  │
│ │         │ │                                                           │  │
│ │ Editor  │ │                                                           │  │
│ │         │ │                                                           │  │
│ │ Launch  │ │                                                           │  │
│ │ Center  │ │                                                           │  │
│ │         │ │                                                           │  │
│ │ ─────── │ │                                                           │  │
│ │Settings │ │                                                           │  │
│ └─────────┘ └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Shell provides:**
- Fixed header with logo, global search, help, profile
- Left navigation rail (collapsible)
- Main content area (module-controlled)
- Toast/notification layer
- Modal/overlay layer

---

### Voice Lab Views

#### Library View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Voice Lab                                              [+ New Profile]     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  Search profiles...      Filter: All ▼   Sort: Recent │
│  │ Quick Actions   │                                                        │
│  │ ┌─────────────┐ │  ┌────────────────┐ ┌────────────────┐ ┌────────────┐ │
│  │ │ Analyze New │ │  │ CEO Voice      │ │ Brand Voice    │ │ Technical  │ │
│  │ └─────────────┘ │  │                │ │                │ │ Docs       │ │
│  │ ┌─────────────┐ │  │ Source: Alin   │ │ Source: Brand  │ │            │ │
│  │ │ Style Check │ │  │ Updated: 2d    │ │ Guide          │ │ Source:    │ │
│  │ └─────────────┘ │  │ Used: 47x      │ │ Updated: 1w    │ │ Docs team  │ │
│  └─────────────────┘  │                │ │ Used: 123x     │ │ Updated:3d │ │
│                       │ [Edit] [Apply] │ │                │ │            │ │
│                       └────────────────┘ │ [Edit] [Apply] │ │[Edit][App] │ │
│                                          └────────────────┘ └────────────┘ │
│                                                                             │
│                       ┌────────────────┐ ┌────────────────┐                 │
│                       │ Sales Pitch    │ │ + Create New   │                 │
│                       │                │ │                │                 │
│                       │ Source: Sales  │ │                │                 │
│                       │ team           │ │   Drop files   │                 │
│                       │ Updated: 1mo   │ │   or click     │                 │
│                       │ Used: 12x      │ │                │                 │
│                       └────────────────┘ └────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Analyzer View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Library              Analyze New Voice                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────┐  ┌──────────────────────────────────┐ │
│  │                                 │  │  Settings                        │ │
│  │     ┌───────────────────┐       │  │                                  │ │
│  │     │                   │       │  │  Source Name                     │ │
│  │     │   Drop files      │       │  │  ┌────────────────────────────┐  │ │
│  │     │   here            │       │  │  │ CEO Communications         │  │ │
│  │     │                   │       │  │  └────────────────────────────┘  │ │
│  │     │   PDF, DOCX, TXT  │       │  │                                  │ │
│  │     │   or paste text   │       │  │  Analysis Depth                  │ │
│  │     │                   │       │  │  ○ Quick (5 min)                 │ │
│  │     └───────────────────┘       │  │  ● Standard (10 min)             │ │
│  │                                 │  │  ○ Deep (15 min)                 │ │
│  │  Uploaded:                      │  │                                  │ │
│  │  ┌────────────────────────────┐ │  │  Visibility                      │ │
│  │  │ 📄 Q3_memo.pdf      1.2k w │ │  │  ● Private                       │ │
│  │  │ 📄 Team_update.docx 800 w  │ │  │  ○ Team                          │ │
│  │  │ 📄 Strategy.md      2.1k w │ │  │  ○ Organization                  │ │
│  │  └────────────────────────────┘ │  │                                  │ │
│  │                                 │  │                                  │ │
│  │  Total: 3 files, ~4,100 words   │  │                                  │ │
│  └─────────────────────────────────┘  └──────────────────────────────────┘ │
│                                                                             │
│                              [Cancel]  [Analyze →]                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Profile Editor View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← Back                CEO Voice                    [Test] [Save] [Delete]  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐ ┌────────────────────────┐ │
│  │ Profile                                     │ │ Test Transformations   │ │
│  │                                             │ │                        │ │
│  │ ▼ Identity                                  │ │ Input:                 │ │
│  │   Name: CEO Voice                           │ │ ┌────────────────────┐ │ │
│  │   Style: Constructive Confrontation         │ │ │ We should consider │ │ │
│  │   Description: Direct, urgent, warm...      │ │ │ improving our...   │ │ │
│  │                                             │ │ └────────────────────┘ │ │
│  │ ▼ Principles (5)                            │ │                        │ │
│  │   ┌───────────────────────────────────────┐ │ │ Output:                │ │
│  │   │ 1. Directness Is Respect         [✎] │ │ │ ┌────────────────────┐ │ │
│  │   │    States hard truths without...     │ │ │ │ Our approach is    │ │ │
│  │   └───────────────────────────────────────┘ │ │ │ broken. Here's how │ │ │
│  │   ┌───────────────────────────────────────┐ │ │ │ we fix it...       │ │ │
│  │   │ 2. Discomfort With Purpose       [✎] │ │ │ └────────────────────┘ │ │
│  │   │    Every uncomfortable truth...      │ │ │                        │ │
│  │   └───────────────────────────────────────┘ │ │ [Transform]            │ │
│  │   [+ Add Principle]                         │ │                        │ │
│  │                                             │ │                        │ │
│  │ ▶ Tone Settings                             │ │                        │ │
│  │ ▶ Vocabulary Rules                          │ │                        │ │
│  │ ▶ Sentence Patterns                         │ │                        │ │
│  │ ▶ Example Transformations                   │ │                        │ │
│  │                                             │ │                        │ │
│  └─────────────────────────────────────────────┘ └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Cross-Module UI Patterns

#### Voice Picker (Shared Component)

Appears in Content Builder and AI Editor:

```
┌────────────────────────────────────┐
│ Voice:  ┌───────────────────────┐  │
│         │ CEO Voice         ▼  │  │
│         └───────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ ● CEO Voice                  │  │
│  │   Constructive Confrontation │  │
│  │                              │  │
│  │ ○ Brand Voice                │  │
│  │   Professional, warm         │  │
│  │                              │  │
│  │ ○ Technical Docs             │  │
│  │   Clear, precise             │  │
│  │                              │  │
│  │ ○ No voice (neutral)         │  │
│  │ ─────────────────────────    │  │
│  │ + Create new voice...        │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

#### Style Match Indicator (Shared Component)

Shows alignment with selected voice:

```
┌─────────────────────────┐
│ Style Match             │
│ ████████████░░░░  78%   │
│ 3 suggestions available │
└─────────────────────────┘
```

#### Style Check Report (Shared Component)

Full validation report:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Style Check: CEO Voice                                            [Close] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Overall Score: 78/100                                        ⚠ REVIEW    │
│   ████████████████████████████░░░░░░░░                                     │
│                                                                             │
│   Threshold: 80 (Not met)                                                   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│   Issues Found: 4                                                           │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │ ⚠ Line 3: Hedging language detected                                │  │
│   │   "We might want to consider..."                                    │  │
│   │   → Suggest: "We need to..."                                        │  │
│   │   [Accept] [Reject] [Edit]                                          │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │ ⚠ Line 7: Passive voice                                            │  │
│   │   "The decision was made..."                                        │  │
│   │   → Suggest: "We decided..."                                        │  │
│   │   [Accept] [Reject] [Edit]                                          │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                                    [Accept All]  [Re-check]  [Export PDF]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Content Builder with Voice Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Content Builder                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐ ┌────────────────────────────┐ │
│  │ Brief                                   │ │ Preview                    │ │
│  │                                         │ │                            │ │
│  │ Content Type                            │ │ ┌────────────────────────┐ │ │
│  │ ┌─────────────────────────────────────┐ │ │ │                        │ │ │
│  │ │ Leadership Memo                  ▼  │ │ │ │  The team stands at a  │ │ │
│  │ └─────────────────────────────────────┘ │ │ │  crossroads. Our Q3    │ │ │
│  │                                         │ │ │  results demand more   │ │ │
│  │ Topic                                   │ │ │  than reflection—they  │ │ │
│  │ ┌─────────────────────────────────────┐ │ │ │  demand action...      │ │ │
│  │ │ Q3 performance and Q4 priorities   │ │ │ │                        │ │ │
│  │ └─────────────────────────────────────┘ │ │ │                        │ │ │
│  │                                         │ │ └────────────────────────┘ │ │
│  │ Key Points                              │ │                            │ │
│  │ ┌─────────────────────────────────────┐ │ │ Voice: CEO Voice         │ │
│  │ │ • Revenue grew 12% YoY             │ │ │ Match: ████████░░ 85%    │ │
│  │ │ • Customer retention improved      │ │ │                            │ │
│  │ │ • Need to accelerate product dev   │ │ │                            │ │
│  │ └─────────────────────────────────────┘ │ │ [Open in Editor]          │ │
│  │                                         │ │ [Copy]                    │ │
│  │ Voice ──────────────────────────────── │ │ [Regenerate]              │ │
│  │ ┌─────────────────────────────────────┐ │ │                            │ │
│  │ │ CEO Voice                        ▼  │ │ │                            │ │
│  │ └─────────────────────────────────────┘ │ │                            │ │
│  │                                         │ │                            │ │
│  │                          [Generate →]   │ │                            │ │
│  └─────────────────────────────────────────┘ └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### AI Editor with Voice Mode

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AI Editor                           Voice: CEO Voice ▼    Match: 78%  [?] │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [B] [I] [U] │ H1 H2 H3 │ • ─ │ ↶ ↷ │        [Style Check] [Export] │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐ ┌──────────────────┐  │
│  │                                                 │ │ Suggestions      │  │
│  │  The team stands at a crossroads. Our Q3       │ │                  │  │
│  │  results demand more than reflection—they      │ │ Style (3)        │  │
│  │  demand action.                                │ │ ┌──────────────┐ │  │
│  │                                                 │ │ │ Line 5:      │ │  │
│  │  We might want to consider ← [highlighted]     │ │ │ "might want" │ │  │
│  │  accelerating our product development          │ │ │ → "need to"  │ │  │
│  │  timeline. The market won't wait, and          │ │ │ [Apply]      │ │  │
│  │  neither can we.                               │ │ └──────────────┘ │  │
│  │                                                 │ │ ┌──────────────┐ │  │
│  │  What does this mean for each of you?          │ │ │ Line 12:     │ │  │
│  │                                                 │ │ │ Passive      │ │  │
│  │  ...                                           │ │ │ → Active     │ │  │
│  │                                                 │ │ │ [Apply]      │ │  │
│  │                                                 │ │ └──────────────┘ │  │
│  │                                                 │ │                  │  │
│  │                                                 │ │ [Apply All]      │  │
│  └─────────────────────────────────────────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 5: Implementation Priorities

---

### Phase 1: Voice Lab MVP

**Scope:**
- Analyzer (upload → profile generation)
- Library (view, edit, delete profiles)
- Profile Editor (basic editing)

**Integration:**
- None yet; standalone module

**Success metric:**
- Users can create and save Style Profiles

---

### Phase 2: Editor Integration

**Scope:**
- Voice Picker component
- Style Match indicator
- Style-aware suggestions in AI Editor
- Basic Style Check

**Integration:**
- Voice Lab → AI Editor

**Success metric:**
- Users can edit content with voice guidance

---

### Phase 3: Content Builder Integration

**Scope:**
- Voice selection in Content Builder
- Voice-constrained generation
- Output to Editor flow

**Integration:**
- Voice Lab → Content Builder
- Content Builder → AI Editor

**Success metric:**
- Users can generate voice-matched content end-to-end

---

### Phase 4: Feedback Loop

**Scope:**
- Refinement flagging in Editor
- Refinement review in Voice Lab
- Profile versioning

**Integration:**
- AI Editor → Voice Lab (bidirectional)

**Success metric:**
- Profiles evolve based on usage

---

### Phase 5: Advanced Features

**Scope:**
- Profile layering (brand + personal)
- Team sharing and permissions
- Analytics and reporting
- API access

**Integration:**
- All modules fully connected

**Success metric:**
- Enterprise-ready voice management

---

## Summary

Compass becomes a modular content platform where:

- **Voice Lab** is the style intelligence engine
- **Content Builder** generates voice-matched content
- **AI Editor** refines content with voice awareness
- **Launch Command Center** and other modules can consume voice profiles

The shell orchestrates navigation, state, and cross-module communication while each module owns its domain. Shared components (Voice Picker, Style Match, Style Check) create consistent UX across modules.

This architecture supports the current use cases while allowing future modules to plug in and consume voice intelligence without rebuilding the core.

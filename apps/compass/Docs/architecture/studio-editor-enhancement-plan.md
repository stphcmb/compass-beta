# Studio Editor Enhancement Plan

## Problem Statement

The Studio Editor (`/studio/editor`) is the primary workspace for content projects, but:
1. Users can only see the current draft - no version history browsing
2. No way to revise specific sections of content
3. No integration with thought leader citations from Research Assistant
4. Analysis suggestions are read-only (can't apply them)
5. No clear connection to other Compass features
6. User flow is unclear - what's the path to a polished piece?

## Current User Flow (Pain Points)

```
Builder (Create Brief) → Editor (View Draft) → ??? → Export
         ↓                      ↓
    Voice Profile         Run Checks
    Selection            (Voice/Brief/Canon)
                              ↓
                        See Suggestions
                        (Can't apply them)
```

**Pain Points:**
1. **Dead End Analysis**: Run checks → see suggestions → manually copy/paste to fix
2. **No Version Control UI**: Versions saved but can't browse/compare/revert
3. **No Section-Level Editing**: Can only regenerate entire piece
4. **Isolated from Compass**: No thought leader citations, no perspective alignment
5. **Unclear Completion Path**: When is content "done"?

---

## Proposed User Flow (With Aha Moments)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  STUDIO EDITOR - Enhanced Workspace                                      │
├──────────────────────────────────────────────────────────────────────────┤
│  Toolbar: [Save] [Run Checks ▼] [Find Experts] [Export] [v3 ▼ History]  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────┐  ┌────────────────────────────────┐    │
│  │  Content Editor             │  │  Intelligence Panel            │    │
│  │  ─────────────────────────  │  │  ──────────────────────────    │    │
│  │                             │  │                                │    │
│  │  [Section 1]                │  │  📊 Project Health             │    │
│  │  The rise of AI agents...   │  │  ├─ Voice: 85% ✓              │    │
│  │                   [Improve] │  │  ├─ Brief: 4/5 points         │    │
│  │  ─────────────────────────  │  │  └─ Perspectives: 2 camps     │    │
│  │  --- (section break) ---    │  │                                │    │
│  │  ─────────────────────────  │  │  💡 Suggestions (3)            │    │
│  │  [Section 2]                │  │  ┌─────────────────────────┐  │    │
│  │  However, compliance...     │  │  │ "Strengthen opening"    │  │    │
│  │                   [Improve] │  │  │ Original: "AI is..."    │  │    │
│  │  ─────────────────────────  │  │  │ Suggested: "The rise.." │  │    │
│  │  --- (section break) ---    │  │  │ [Apply] [Dismiss]       │  │    │
│  │  ─────────────────────────  │  │  └─────────────────────────┘  │    │
│  │  [Section 3]                │  │                                │    │
│  │  In conclusion...           │  │  🎯 Missing Perspectives       │    │
│  │                   [Improve] │  │  ├─ "AI Safety Camp"          │    │
│  │                             │  │  │   Yoshua Bengio [+ Add]    │    │
│  │                             │  │  └─ "Scaling Maximalists"     │    │
│  │                             │  │      Sam Altman [+ Add]       │    │
│  │                             │  │                                │    │
│  │                             │  │  📚 Sources (2)                │    │
│  │                             │  │  ├─ Andrew Ng                 │    │
│  │                             │  │  │  "AI is the new..."        │    │
│  │                             │  │  │  [View] [Remove]           │    │
│  │                             │  │  └─ Fei-Fei Li                │    │
│  │                             │  │     "Human-centered AI..."    │    │
│  │                             │  │     [View] [Remove]           │    │
│  └─────────────────────────────┘  └────────────────────────────────┘    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Version History Dropdown (when clicked):
┌─────────────────────────────────┐
│ Version History                 │
├─────────────────────────────────┤
│ ● v3 (current) - 2 hours ago   │
│   "User edited section 2"       │
│                                 │
│ ○ v2 - Yesterday               │
│   "Applied voice suggestion"    │
│   [Restore] [Compare]          │
│                                 │
│ ○ v1 - 2 days ago              │
│   "Initial generation"          │
│   [Restore] [Compare]          │
└─────────────────────────────────┘
```

---

## Aha Moments for Users

### 1. "My writing has gaps I didn't know about"
- **Trigger**: Run perspective analysis
- **Experience**: See which thought leader camps are missing from their argument
- **Action**: One-click add citation from suggested expert

### 2. "I can cite real experts to strengthen my points"
- **Trigger**: Click "Find Experts" or "+ Add Citation"
- **Experience**: See relevant thought leaders with real quotes
- **Action**: Insert formatted citation into content

### 3. "The AI knows exactly what to fix"
- **Trigger**: Voice/brief check shows specific suggestions
- **Experience**: Click "Apply" and see the improvement inline
- **Action**: Accept or reject each suggestion

### 4. "I can go back to what worked"
- **Trigger**: Open version history
- **Experience**: Compare versions side-by-side, see what changed
- **Action**: Restore previous version or cherry-pick sections

### 5. "Each section can be perfected independently"
- **Trigger**: Click "Improve" on a specific section
- **Experience**: AI regenerates just that section with context
- **Action**: Accept new version or keep original

---

## Key Features to Implement

### Feature 1: Version History Panel
- List all versions with timestamps and change sources
- One-click restore to previous version
- Compare current vs. previous (simple diff view)
- Show change_source label (generated, user_edit, regenerated)

### Feature 2: Actionable Suggestions
- Voice check suggestions with "Apply" button
- Brief coverage gaps with "Expand this point" action
- Preview change before applying
- Auto-save as new version when suggestion applied

### Feature 3: Perspective Integration + Sources Panel
- Run perspective analysis to show camp alignment
- Display matched camps with confidence
- Show missing perspectives with suggested experts
- **Sources Panel**: Add thought leaders to cite
  - Search/browse relevant experts
  - Show quote + position + source link
  - Collapsible panel on right sidebar
  - No inline text changes - clean separation

### Feature 4: Section-Level Editing
- Manual section markers (`---` divider in content)
- Each section shows "Improve this section" button
- Regenerate section with full document context
- Preserves voice profile and brief constraints
- Creates new version when section improved

---

## Technical Approach

### Reuse from Research Assistant
- `lib/research-assistant/query.ts` - Camp/author queries
- `lib/research-assistant/gemini.ts` - LLM analysis
- `components/AIEditorResults.tsx` - Author card patterns
- `linkifyAuthors()` - Author mention linking

### New Components Needed
- `VersionHistoryPanel.tsx` - Version list and comparison
- `PerspectiveAlignmentPanel.tsx` - Camp matching display
- `CitationPicker.tsx` - Thought leader search and insert
- `SectionEditor.tsx` - Per-section editing controls
- `SuggestionApplicator.tsx` - Apply/reject suggestions inline

### API Endpoints Needed
- `GET /api/studio/projects/[id]/drafts` - Already exists, expose in UI
- `POST /api/studio/projects/[id]/drafts/[version]/restore` - Restore version
- `POST /api/studio/editor/analyze-perspectives` - Get camp alignment
- `POST /api/studio/editor/suggest-citations` - Get relevant experts
- `POST /api/studio/editor/improve-section` - Regenerate one section

### Database (No Changes Needed)
- `project_drafts` table already stores versions
- Just need UI to expose existing version data

---

## Files to Modify

### Primary
- `/app/studio/editor/page.tsx` - Main editor page
- `/lib/studio/editor/` - Add new analysis functions

### New Files
- `/components/studio/VersionHistoryPanel.tsx`
- `/components/studio/PerspectivePanel.tsx`
- `/components/studio/CitationPicker.tsx`
- `/components/studio/SuggestionCard.tsx`
- `/app/api/studio/editor/perspectives/route.ts`
- `/app/api/studio/editor/citations/route.ts`

### Reuse/Adapt
- `/lib/research-assistant/query.ts` - For camp queries
- `/components/AIEditorResults.tsx` - Author card patterns

---

## Verification Plan

1. **Version History**
   - Create project, make 3 versions
   - Open version panel, verify all versions shown
   - Restore v1, verify content reverts
   - Compare v1 vs v3, verify diff display

2. **Actionable Suggestions**
   - Run voice check with suggestions
   - Click "Apply" on suggestion
   - Verify content updates correctly
   - Verify new version created

3. **Perspective Integration**
   - Generate content about AI topic
   - Run perspective analysis
   - Verify camps matched and missing shown
   - Add citation, verify inserted correctly

4. **Section Improvement**
   - Open content with multiple sections
   - Click "Improve" on middle section
   - Verify only that section regenerates
   - Verify surrounding context preserved

---

## Design Decisions (Confirmed)

1. **Citation Format**: Sidebar "Sources" panel
   - Citations added to a collapsible Sources panel on the right
   - No inline text changes - keeps content clean
   - Panel shows: Author name, quote, source link, relevance note

2. **Section Detection**: Manual markers
   - Users insert `---` or similar marker to define section breaks
   - Each section gets its own "Improve" button
   - Gives users full control over what constitutes a "section"

3. **MVP Scope**: Full implementation (all 4 features)
   - Version History + Restore
   - Actionable Suggestions
   - Perspective Integration
   - Section-level Editing

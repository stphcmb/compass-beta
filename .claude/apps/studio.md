# Studio

> AI-powered content creation from brief to polished draft with voice consistency and validation

## Overview

**Studio** is the content generation app that takes users from idea to publishable draft:
- **Create content briefs** (topic, audience, key points)
- **Choose voice profile** (your style or default)
- **Generate AI drafts** with voice synthesis
- **Refine with validation** (voice check, brief coverage, canon check)
- **Track version history** and iterate
- **Export polished content**

**URL**: `studio.compass.app` (port 3002 in dev)
**Package**: `@compass/studio`
**Target users**: Content creators, marketers, thought leaders, agencies

## Key Features

### 1. Content Builder (Brief Creation)
**Route**: `/builder`

Multi-step form to create content briefs:
- **Title/Topic** - Main subject
- **Format** - Blog, LinkedIn, Memo, Byline
- **Audience** - Target readers
- **Key Points** - Main arguments (dynamic list)
- **Voice Profile** - Select from Voice Lab or skip
- **Domain** - AI discourse, Anduin product, or hybrid

**Implementation**:
- Client Component with form state
- Fetches voice profiles from Voice Lab API
- Inline voice creator (create profile without leaving)
- Saves to `projects` table

### 2. Draft Editor (Content Refinement)
**Route**: `/editor?project=[id]`

Full-featured editor with real-time validation:
- **Rich text editor** - Edit generated content
- **Auto-save** - Changes saved every 30 seconds
- **Word count** - Target ranges by format
- **3 validation checks**:
  1. **Voice Check** - Matches selected voice profile
  2. **Brief Coverage** - Addresses all key points
  3. **Canon Check** - Cites relevant Compass authors
- **Version history** - Restore previous drafts
- **Regenerate** - Create new version with feedback
- **Export** - Copy, download, or publish

**Implementation**:
- Client Component with real-time state
- Validation via API routes (streaming)
- Drafts stored in `drafts` table
- Citations tracked separately

### 3. Projects Dashboard
**Route**: `/` (home) and `/projects`

Manage all content projects:
- **Recent projects** (max 5 on home)
- **Status indicators** (brief, draft, editing, complete)
- **Quick actions** - Continue, review, view
- **Project cards** - Title, format, timestamp, voice indicator

### 4. Publishing Checklist
**Component in Editor**

Pre-publish validation checklist:
- Voice consistency score
- Brief coverage percentage
- Canon citations count
- Word count status
- All checks pass before export

## Routes Overview

### Public Routes
- `/sign-in`, `/sign-up` - Authentication (Clerk)

### Authenticated Routes
- `/` - Dashboard (recent projects)
- `/builder` - Create content brief
- `/editor?project=[id]` - Edit draft
- `/projects` - All projects list

## Database Ownership

Studio **owns and modifies** these tables:

| Table | Purpose |
|-------|---------|
| `projects` | Content projects with briefs |
| `drafts` | Version history of content |

**Fields in `projects`**:
- `id`, `user_id`, `title`, `format`, `audience`
- `key_points` (JSONB array)
- `additional_context` (text)
- `content_domain` (ai_discourse, anduin_product, hybrid)
- `voice_profile_id` (foreign key to Voice Lab)
- `status` (brief, draft, editing, complete)
- `created_at`, `updated_at`

**Fields in `drafts`**:
- `id`, `project_id`, `version`, `content`
- `citations` (JSONB array)
- `created_at`

**Can read from** (with RLS):
- `authors` (Compass) - For canon citations
- `camps` (Compass) - For perspective context
- `voice_profiles` (Voice Lab) - For voice synthesis

## Tech Stack Specifics

### AI/LLM
- **Gemini 2.5 Flash** for content generation
- Voice synthesis via Voice Lab integration
- Streaming validation checks
- Citation extraction and verification

### Content Formats
| Format | Word Target | Description |
|--------|-------------|-------------|
| Blog | 800-1200 | Structured with sections |
| LinkedIn | 150-300 | Conversational, brief |
| Memo | 300-500 | Bullet-focused, internal |
| Byline | 600-900 | Thought leadership, op-ed |

### Content Domains
- **AI Discourse** - Thought leadership about AI landscape
- **Anduin Product** - Solution-focused Anduin content
- **Hybrid** - Blends AI discourse with product messaging

## Directory Structure

```
apps/studio/
├── app/
│   ├── (auth)/              # Auth-protected routes
│   ├── projects/            # Project management
│   ├── brief/               # Brief creation
│   └── drafts/              # Draft editor
├── components/
├── lib/
└── public/
```

## Common Tasks

### 1. Create Content Project
**Flow**:
1. User clicks "Start New Content"
2. Fills content brief form (title, format, audience, key points)
3. Optionally selects voice profile or creates inline
4. Submits form → creates project with status="brief"
5. Generates draft → status="draft"
6. Redirects to editor

**API Routes**:
- `POST /api/studio/projects` - Create project
- `POST /api/studio/content/generate` - Generate initial draft

### 2. Edit Draft with Validation
**Flow**:
1. User loads editor with project ID
2. Content fetched and displayed
3. User edits text (auto-save every 30s)
4. Click "Analyze" → runs 3 validation checks:
   - Voice Check (via Voice Lab)
   - Brief Coverage (Gemini analysis)
   - Canon Check (Compass authors citations)
5. Results displayed in checklist panel

**API Routes**:
- `GET /api/studio/projects/[id]` - Get project
- `GET /api/studio/projects/[id]/drafts` - List versions
- `POST /api/studio/projects/[id]/drafts` - Save new version
- `POST /api/studio/editor/analyze` - Run validation checks

### 3. Regenerate Content
**Flow**:
1. User reviews draft in editor
2. Clicks "Regenerate" → opens feedback input
3. Enters feedback (e.g., "Make it more technical")
4. System generates new version preserving history
5. User can toggle between versions

**Implementation**:
- Creates new draft record (version++)
- Uses feedback in generation prompt
- Previous versions accessible via history panel

### 4. Export Content
**Options**:
- **Copy to Clipboard** - One-click copy
- **Download** - Saves as .txt or .md file
- **Publish** (future) - Direct publish to platforms

### 5. Integrate Voice Profile
**Flow**:
1. Builder page fetches available profiles
2. User selects profile or clicks "Create New"
3. If inline creation:
   - Opens InlineVoiceCreator component
   - Redirects to Voice Lab `/new` with return URL
   - Returns with new profile selected
4. Profile ID saved in project
5. Used for generation and voice validation

## Development Commands

```bash
# From repo root
pnpm dev:studio                # Start Studio only
pnpm --filter @compass/studio build
pnpm --filter @compass/studio lint
```

## Environment Variables

```bash
# apps/studio/.env.local
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
GEMINI_API_KEY=...
```

## API Routes

Studio uses **Route Handlers** for all operations:

| Route | Purpose |
|-------|---------|
| `GET /api/studio/projects` | List user's projects |
| `POST /api/studio/projects` | Create new project |
| `GET /api/studio/projects/[id]` | Get project details |
| `PATCH /api/studio/projects/[id]` | Update project |
| `DELETE /api/studio/projects/[id]` | Delete project |
| `GET /api/studio/projects/[id]/drafts` | List versions |
| `POST /api/studio/projects/[id]/drafts` | Save new draft |
| `GET /api/studio/projects/[id]/drafts/[version]` | Get specific version |
| `POST /api/studio/projects/[id]/fork` | Fork project |
| `POST /api/studio/content/generate` | Generate content |
| `POST /api/studio/editor/analyze` | Run validation checks |

## Integration Points

### From Compass → Studio
**"Draft This" flow**:
1. User completes Research Assistant analysis in Compass
2. Clicks "Draft This" button
3. Redirects to: `/studio/builder?thesis=[analyzed_text]`
4. Studio pre-fills title field with thesis
5. User completes brief and generates content

### From Voice Lab → Studio
**Voice profile selection**:
1. Studio Builder calls: `GET /api/voice-lab/profiles`
2. Displays profiles in dropdown
3. User selects or creates inline
4. Profile ID stored in project
5. Used for generation and validation

### From Studio → Voice Lab
**Voice validation**:
1. Editor calls: `POST /api/voice-lab/profiles/[id]/synthesize`
2. Compares generated content against profile
3. Returns voice consistency score
4. Displayed in publishing checklist

### From Studio → Compass
**Canon citations**:
1. Editor analyzes content for perspectives
2. Queries Compass `authors` and `camps` tables
3. Identifies relevant citations
4. Displays in canon check panel

## Security Notes

### RLS Policies
- `projects`: Users can only see/modify their own projects
- `drafts`: Users can only access their own draft versions
- Voice profiles: Read-only access via Voice Lab API
- Compass data: Public read access (authors, camps)

### API Authentication
- All routes require Clerk authentication
- User ID extracted from session
- Projects/drafts tied to user via `user_id`

## Performance Considerations

### Content Generation
- Initial generation: ~5-10 seconds
- Validation checks: ~3-5 seconds each
- Parallel validation for speed

### Auto-save
- Debounced 30 seconds after last edit
- Prevents excessive database writes
- Visual indicator for save status

### Version History
- Limit to 10 most recent versions
- Older versions archived or deleted
- Efficient JSONB storage for content

## Documentation Resources

### Platform-wide
- `/.claude/CLAUDE.md` - Main AI guidance
- `/.claude/rules/` - Development rules

### App-specific
- Create `/apps/studio/docs/` for detailed docs

## Future Enhancements

- **Template Library** - Pre-built content templates
- **Collaboration** - Shared projects with team
- **Version Control** - Git-like branching and merging
- **Export Formats** - Markdown, PDF, HTML, DOCX
- **SEO Optimization** - Keyword suggestions, readability scores
- **Publishing Integrations** - Direct publish to Medium, LinkedIn, etc.
- **Analytics** - Track content performance

---

**Last Updated**: 2026-01-28
**Port**: 3002
**Package**: `@compass/studio`

# Voice Lab

> Voice profile creation and synthesis for authentic, voice-consistent content generation

## Overview

**Voice Lab** helps users capture and apply their unique writing voice:
- **Create voice profiles** from writing samples (PDFs, text, URLs)
- **Synthesize content** in your authentic voice
- **Manage profile library** with multiple voices
- **Extract voice insights** for style understanding

**URL**: `voicelab.compass.app` (port 3001 in dev)
**Package**: `@compass/voice-lab`
**Status**: Beta (whitelist access only)
**Target users**: Content creators, authors, executives, brands

## Key Features

### 1. Voice Profile Creation
**Route**: `/new`

Multi-step wizard to create voice profiles:
1. **Upload samples** (PDF, text, or URL)
2. **AI extracts voice patterns** (tone, structure, vocabulary)
3. **Generate profile** with unique slug
4. **View insights** dashboard

**Implementation**:
- PDF extraction via dedicated API route
- Gemini 2.5 Flash for voice analysis
- Saves to `voice_profiles` and `voice_samples` tables

### 2. Profile Library
**Route**: `/library`

Browse and manage all voice profiles:
- Filter by status (ready, processing, needs_update)
- View profile cards with sample counts
- Load example profiles for testing
- Quick actions: edit, synthesize, delete

### 3. Profile Detail
**Route**: `/library/[slug]`

Deep dive into specific profile:
- View all writing samples
- See extracted voice insights
- Synthesize new content with this voice
- Edit profile metadata

### 4. Voice Synthesis
**Integration with Studio**

Voice profiles are used in Studio for content generation:
- Select voice profile in content builder
- Generate drafts in authentic voice
- Voice validation in editor

## Routes Overview

### Public Routes
- `/sign-in`, `/sign-up` - Authentication (Clerk)

### Authenticated Routes
- `/` - Redirects to `/library`
- `/library` - Profile library (main view)
- `/library/[slug]` - Profile detail page
- `/new` - Create new voice profile

## Database Ownership

Voice Lab **owns and modifies** these tables:

| Table | Purpose |
|-------|---------|
| `voice_profiles` | Voice profile metadata and slugs |
| `voice_samples` | Individual writing samples |

**Fields in `voice_profiles`**:
- `id`, `user_id`, `name`, `slug`
- `training_status` (ready, processing, needs_update)
- `voice_data` (JSONB) - extracted voice patterns
- `insights` (JSONB) - analysis results
- `created_at`, `updated_at`

**Can read from** (with RLS):
- `authors` (Compass) - For style comparisons

## Tech Stack Specifics

### AI/LLM
- **Gemini 2.5 Flash** for voice analysis
- PDF text extraction with custom parser
- Style pattern recognition
- Synthesis capabilities (used in Studio)

### Beta Access Control
- Whitelist-based access (ENV var)
- Graceful redirect for non-beta users
- Example profiles available for testing

### UI Components
- Multi-step wizard for profile creation
- Drag-and-drop file upload
- Real-time processing indicators
- Profile cards with status badges

## Directory Structure

```
apps/voice-lab/
├── app/
│   ├── (auth)/              # Auth-protected routes
│   ├── profile/             # User profile management
│   ├── analyze/             # Voice analysis
│   └── library/             # Profile history
├── components/
├── lib/
└── public/
```

## Common Tasks

### 1. Create Voice Profile
**Flow**:
1. User clicks "New Profile" in library
2. Uploads PDF or pastes text samples
3. AI analyzes samples and extracts voice patterns
4. Profile created with unique slug
5. Redirects to profile detail page

**API Routes**:
- `POST /api/voice-lab/profiles` - Create profile
- `POST /api/voice-lab/extract-pdf` - Extract text from PDF
- `POST /api/voice-lab/profiles/[id]/samples` - Add sample

### 2. Load Example Profiles
**Purpose**: Seed example profiles for testing/demo

**Implementation**:
- `POST /api/voice-lab/seed-examples` - Creates 5 example profiles
- `POST /api/voice-lab/seed-examples?force=true` - Deletes and recreates
- Examples: Steve Jobs, Seth Godin, Paul Graham, Hemingway, Zadie Smith

### 3. Synthesize Content
**Integration with Studio**:
1. User selects voice profile in Studio builder
2. Studio calls Voice Lab API for synthesis
3. Content generated in profile's voice style

**API Route**: `POST /api/voice-lab/profiles/[id]/synthesize`

### 4. Update Profile Status
**Workflow**:
- `processing` → AI analyzing samples
- `ready` → Profile available for use
- `needs_update` → Requires more samples or refresh

## Development Commands

```bash
# From repo root
pnpm dev:voice-lab             # Start Voice Lab only
pnpm --filter @compass/voice-lab build
pnpm --filter @compass/voice-lab lint
```

## Environment Variables

```bash
# apps/voice-lab/.env.local
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
GEMINI_API_KEY=...
```

## API Routes

Voice Lab uses **Route Handlers** for all operations:

| Route | Purpose |
|-------|---------|
| `GET /api/voice-lab/profiles` | List user's profiles |
| `POST /api/voice-lab/profiles` | Create new profile |
| `GET /api/voice-lab/profiles/[id]` | Get profile details |
| `PATCH /api/voice-lab/profiles/[id]` | Update profile |
| `DELETE /api/voice-lab/profiles/[id]` | Delete profile |
| `GET /api/voice-lab/profiles/by-slug/[slug]` | Get profile by slug |
| `POST /api/voice-lab/profiles/[id]/samples` | Add sample to profile |
| `POST /api/voice-lab/profiles/[id]/insights` | Generate insights |
| `POST /api/voice-lab/profiles/[id]/synthesize` | Synthesize content |
| `POST /api/voice-lab/extract-pdf` | Extract text from PDF |
| `POST /api/voice-lab/seed-examples` | Load example profiles |

## Integration Points

### From Voice Lab → Studio
**Voice selection flow**:
1. User creates voice profile in Voice Lab
2. Profile saved with unique slug
3. Studio fetches available profiles: `GET /api/voice-lab/profiles`
4. User selects profile in content builder
5. Studio uses profile for voice-consistent generation

### From Studio → Voice Lab
**Synthesis requests**:
1. Studio calls: `POST /api/voice-lab/profiles/[id]/synthesize`
2. Voice Lab generates content in profile's style
3. Returns synthesized content to Studio

## Security Notes

### RLS Policies
- `voice_profiles`: Users can only see/modify their own profiles
- `voice_samples`: Users can only access their own samples
- Example profiles: Public read access (marked with flag)

### Beta Access
- Whitelist stored in environment variable
- Checked on all authenticated routes
- Graceful redirect to waitlist page

### API Authentication
- All routes require Clerk authentication
- User ID extracted from session
- Profiles tied to user via `user_id` field

## Performance Considerations

### Voice Analysis
- PDF extraction: ~2-5 seconds
- Voice pattern analysis: ~3-8 seconds
- Parallel processing for multiple samples

### Storage
- Voice data stored as JSONB in PostgreSQL
- Efficient querying with GIN indexes
- Sample text truncation for large inputs

## Documentation Resources

### Platform-wide
- `/.claude/CLAUDE.md` - Main AI guidance
- `/.claude/rules/` - Development rules

### App-specific
- Create `/apps/voice-lab/docs/` for detailed docs

## Future Enhancements

- Audio file upload support
- Real-time voice coaching
- Team voice analytics
- Voice comparison tool (compare with Compass authors)
- Voice evolution tracking over time

---

**Last Updated**: 2026-01-28
**Port**: 3001
**Package**: `@compass/voice-lab`

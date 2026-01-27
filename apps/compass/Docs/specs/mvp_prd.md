# Compass MVP - Product Requirements Document
*NextJS + Supabase + shadcn-ui*

## Executive Summary
Compass is a positioning intelligence tool that helps executives validate their AI thought leadership by searching a curated database of AI thought leaders, understanding alignment/challenge dynamics, and identifying white space opportunities.

## Tech Stack (Fixed)
- **Frontend**: NextJS 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

---

## Core Features (MVP Only)

### 1. Home Screen

#### 1.1 Search Interface
**Primary search bar** (center of screen):
- Large text input field accepting 1-500 characters
- Placeholder text: "Paste your thesis or search by keywords..."
- Real-time character count indicator
- Search button triggers navigation to results page with query parameter
- Enter key submits search

**Advanced filters panel** (collapsible):
- Triggered by "Advanced Filters" button below search bar
- Contains four filter dropdowns in 2x2 grid:
  - Domain dropdown: All Domains, Business, Society, Workers, Technology, Policy & Regulation, Other
  - Camp/Position dropdown: Dynamically populated from camps table, includes "All Camps" option
  - Author Name text input: Free text search, matches partial names
  - Publication Date dropdown: Last 12 months (default), Last 6 months, Last 3 months
- Filters are additive (AND logic)
- Filter state persists when toggling panel visibility

**Suggested topics** (below search box):
- Display 3-5 static topic pills
- Clicking a pill populates search bar with that text
- Topics are hardcoded for MVP

#### 1.2 Sidebar Navigation
**Fixed left sidebar** (256px width):
- Application title "Compass" at top
- Two sections with distinct headers:

**Recent Searches section**:
- Shows last 10 unique searches from search_history table
- Each item displays truncated query (max 50 chars)
- Clicking item navigates to results with that query
- Sorted by timestamp descending
- Updates immediately after each new search

**Saved Searches section**:
- Shows all saved searches from saved_searches table
- Each item displays bookmark icon + truncated query
- Clicking item navigates to results with that query
- Blue background highlight on hover
- No delete functionality in MVP

### 2. Results Screen

#### 2.1 Persistent Search Bar
**Sticky top bar** with search query:
- Displays current search query in editable text field
- "Edit" button enables text field for modification
- Submitting edited query refreshes results
- Remains visible while scrolling results

#### 2.2 Positioning Snapshot Widget
**Executive summary box** displaying four metrics:
- **Strongly Aligned**: Count of camps with relevance="strong"
- **Partially Aligned**: Count of camps with relevance="partial"  
- **Challenging**: Count of camps with relevance="challenges"
- **Emerging**: Count of camps with relevance="emerging"
- Each metric shows large number with label below
- Color coding: green (strong), yellow (partial), red (challenges), purple (emerging)

#### 2.3 White Space Opportunities
**Opportunities panel** below positioning snapshot:
- Blue background callout box
- Displays up to 3 white space opportunities
- Each opportunity is a bullet point with explanation text
- Logic for identifying white space:
  - Topics with <3 sources in database
  - Domains with no camps matching query
  - Query concepts not covered by existing camps
- If no white space found, hide this section entirely

#### 2.4 Camps List
**Expandable camp sections** (accordion pattern):
- Each camp displays as a white card with:
  - Expand/collapse chevron icon (left)
  - Camp name (bold, large text)
  - Relevance badge (colored pill matching positioning snapshot colors)
  - Camp position summary (gray text, 1-2 lines)
  - Author count (right side, e.g., "12 authors")
- Click anywhere on card to expand/collapse
- Only one camp expanded at a time

**Expanded camp content**:
- Border-top separator from header
- List of author cards for this camp
- "Show more" button if >3 authors (loads remaining authors)

#### 2.5 Author Cards (within expanded camps)
Each author card contains:

**Author header**:
- Author name (clickable, navigates to author detail page)
- User icon next to name
- Affiliation and credibility tier below name
- Author type badge (right side, colored pill)

**Why It Matters section**:
- Label: "WHY IT MATTERS" (small caps, gray)
- Explanation text specific to this author-query combination
- Pulled from camp_authors.why_it_matters field

**Key Quote section** (grayed out for MVP):
- Placeholder gray box with "Quote coming soon"
- No actual quotes stored or displayed

**Citations list**:
- Label showing count (e.g., "3 CITATIONS")
- Each citation shows:
  - Document icon
  - Title and type in parentheses (e.g., "AI Playbook (Blog, 2024)")
  - External link icon (opens URL in new tab)
- Maximum 5 most recent citations shown
- Sorted by published_date descending

**View all sources link**:
- Text link at bottom: "View all sources by [Author Name] →"
- Opens author detail page

### 3. Author Detail Page

#### 3.1 Author Profile Section
**Header information**:
- Author name (large, bold)
- Affiliation
- Credibility tier badge
- Author type badge
- Back button returns to results page with previous query

**Position Summary**:
- Text block describing author's overall stance
- Aggregated from their camp affiliations

**Camp Affiliations**:
- List of all camps this author belongs to
- Each shows camp name and domain
- No confidence scores shown in MVP

#### 3.2 Sources List
**All sources by author**:
- Filtered to last 12 months only
- Each source shows:
  - Title (linked to URL)
  - Type badge (paper, blog, video, etc.)
  - Publication date
  - Summary text (first 200 chars)
  - Domain tag
- Sorted by publication date descending
- No pagination (show all)

### 4. Save & History Features

#### 4.1 Save Search
**Save button** on results page:
- Located in positioning snapshot widget
- Saves current query and filters to saved_searches table
- No duplicate checking
- Updates sidebar immediately
- No success confirmation needed

#### 4.2 Search History
**Automatic tracking**:
- Every search automatically saved to search_history table
- Includes query text and timestamp
- No filters saved in history
- Deduplication: same query within 1 minute not saved again
- No manual history management

### 5. Data Processing & Search Logic

#### 5.1 Query Processing
**Search execution**:
- Triggered by search button or enter key
- Minimum 1 character required
- Maximum 500 characters
- No query validation or preprocessing

**Matching logic**:
- Search against source.title and source.summary fields
- PostgreSQL ILIKE for case-insensitive partial matching
- Results include all sources matching query
- Group results by author, then by camp

#### 5.2 Camp Relevance Calculation
**Relevance assignment** (simplified for MVP):
- Count keyword matches between query and camp.position_summary
- >3 matches = "strong"
- 2-3 matches = "partial"  
- 1 match = "emerging"
- 0 matches = "challenges"
- Applied at display time, not stored

#### 5.3 Results Organization
**Grouping hierarchy**:
1. Group sources by author
2. Group authors by camp (via camp_authors table)
3. Sort camps by relevance (strong → partial → emerging → challenges)
4. Sort authors within camp by credibility_tier (high → medium → emerging)
5. Sort sources within author by published_date descending

---

## Out of Scope (Explicitly NOT Building)

### Security & Authentication
- ❌ User authentication system (no login required)
- ❌ Row Level Security (RLS) policies
- ❌ API rate limiting
- ❌ CORS configuration
- ❌ Environment-based secrets management
- ❌ Session management
- ❌ Password reset flows
- ❌ Email verification
- ❌ OAuth/SSO integration

### Advanced Features
- ❌ Real-time updates when database changes
- ❌ Collaborative features (sharing, comments)
- ❌ Export/download functionality (PDF, CSV)
- ❌ Email notifications or alerts
- ❌ Mobile app or responsive mobile design
- ❌ Dark mode
- ❌ Internationalization
- ❌ Accessibility features (ARIA labels, keyboard navigation)

### Content Management
- ❌ Admin panel for managing authors/sources
- ❌ Content moderation or approval workflows
- ❌ User-submitted content
- ❌ Editing or deleting saved searches
- ❌ Bulk operations on searches
- ❌ Search templates or presets

### Advanced Search
- ❌ Semantic/vector search
- ❌ Search suggestions or autocomplete
- ❌ Typo correction
- ❌ Synonym matching
- ❌ Multi-language search
- ❌ Search analytics or tracking
- ❌ A/B testing search algorithms

### Data Features
- ❌ Real quotes from sources (placeholder only)
- ❌ Trending topics or authors
- ❌ Time-based filtering beyond publication date
- ❌ Geographic filtering
- ❌ Citation formatting (APA, MLA)
- ❌ Source quality scoring
- ❌ Duplicate source detection

### Visualization
- ❌ Charts or graphs
- ❌ Network diagrams
- ❌ Timeline views
- ❌ Positioning maps
- ❌ Word clouds
- ❌ Statistical analysis

### Performance
- ❌ Caching layer (Redis, etc.)
- ❌ CDN setup
- ❌ Image optimization
- ❌ Lazy loading (except for author cards)
- ❌ Infinite scroll
- ❌ Query optimization beyond basic indexes

### Error Handling
- ❌ Comprehensive error messages
- ❌ Retry logic for failed requests
- ❌ Offline mode
- ❌ Error tracking (Sentry, etc.)
- ❌ 404 pages
- ❌ Loading skeletons

### Testing
- ❌ Unit tests
- ❌ Integration tests
- ❌ E2E tests
- ❌ Performance tests
- ❌ Security tests

### Documentation
- ❌ API documentation
- ❌ User guide
- ❌ Developer documentation
- ❌ Inline help tooltips

---

## Database Schema (Reference)

Tables required in Supabase:
- `authors` - AI thought leaders
- `sources` - Papers, blogs, videos by authors
- `camps` - Intellectual camps/positions
- `camp_authors` - Links authors to camps with metadata
- `topics` - Subject matter tags
- `source_topics` - Links sources to topics
- `saved_searches` - User's saved queries
- `search_history` - Automatic search tracking

See linked database schema for exact field definitions.

---

## Success Metrics

MVP is successful if:
1. Search returns relevant results in <3 seconds
2. Users can identify aligned vs challenging perspectives
3. White space opportunities surface for most queries
4. Search history and saved searches work reliably
5. All external source links are functional

---

## Data Requirements

### Initial Seed Data (Minimum)
- 30 authors across all credibility tiers
- 100 sources published within last 12 months
- 8-10 camps across all domains
- 50+ camp-author relationships
- 20 topics

### Content Guidelines
- Sources must have title, URL, summary, and publication date
- Summaries should be 100-300 words
- Each author must belong to at least one camp
- Each camp must have at least 2 authors
- URLs must be valid and publicly accessible

---

## Implementation Notes

### Page Routes (NextJS App Router)
- `/` - Home page with search
- `/results?q=[query]&domain=[domain]&camp=[camp]` - Results page
- `/author/[id]` - Author detail page

### Component Hierarchy
```
app/
  page.tsx                 // Home screen
  results/page.tsx         // Results screen
  author/[id]/page.tsx     // Author detail
  
components/
  SearchBar.tsx
  SearchFilters.tsx
  Sidebar.tsx
  PositioningSnapshot.tsx
  WhiteSpaceOpportunities.tsx
  CampAccordion.tsx
  AuthorCard.tsx
  SourcesList.tsx
```

### Supabase Setup
- Use Supabase client directly (no auth required)
- Anonymous/public access to all tables
- No RLS policies needed for MVP
- Direct database queries via Supabase JavaScript client

### State Management
- URL parameters for search state
- React state for UI interactions (expanded camps, filter visibility)
- No global state management needed

### Styling Guidelines
- Use shadcn-ui components where available
- Tailwind classes for layout and spacing
- Match colors from wireframe (green, yellow, red, purple for relevance)
- White cards on gray background pattern
- Fixed 256px sidebar width

---

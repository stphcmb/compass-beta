# Compass MVP

A positioning intelligence tool that helps executives validate their AI thought leadership by searching a curated database of AI thought leaders.

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  page.tsx                 # Home screen
  results/page.tsx         # Results screen
  author/[id]/page.tsx     # Author detail page
  layout.tsx               # Root layout
  globals.css              # Global styles

components/
  Sidebar.tsx              # Left sidebar with recent/saved searches
  SearchBar.tsx            # Main search input
  SearchFilters.tsx        # Advanced filters panel
  PositioningSnapshot.tsx  # Metrics display
  WhiteSpaceOpportunities.tsx # Opportunities panel
  CampAccordion.tsx        # Expandable camp sections
  AuthorCard.tsx           # Author card component
  AuthorProfile.tsx        # Author detail header
  SourcesList.tsx          # Sources list for author
  ui/                      # shadcn-ui components

lib/
  supabase.ts              # Supabase client
  utils.ts                 # Utility functions
```

## Database Setup

This project requires the following Supabase tables:
- `authors`
- `sources`
- `camps`
- `camp_authors`
- `topics`
- `source_topics`
- `saved_searches`
- `search_history`

See the PRD document for detailed schema requirements.

## Features

- Search interface with advanced filters
- Recent searches and saved searches sidebar
- Positioning snapshot with relevance metrics
- White space opportunities detection
- Expandable camp sections with author cards
- Author detail pages with sources list

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint


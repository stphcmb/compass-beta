# Supabase Integration Guide

## Overview
This document describes how the Compass MVP connects to the Supabase "AI Thought Leaders & Taxonomy Seed" dataset.

## Configuration

### Environment Variables
The following environment variables are configured in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://qbobesjpzawlffbgytve.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Supabase Client
The Supabase client is initialized in `/lib/supabase.ts` and used throughout the application.

## Database Schema

The integration expects the following tables in Supabase:

### 1. `authors` (Thought Leaders)
- `id` - unique identifier
- `name` - author name
- `affiliation` - organization/affiliation
- `position_summary` - summary of their position
- `credibility_tier` - credibility level
- `author_type` - type of author
- `created_at`, `updated_at` - timestamps

### 2. `camps` (Taxonomy Categories)
- `id` - unique identifier
- `name` - camp name
- `description` - camp description
- `position_summary` - summary of the camp's position
- `domain` - domain category (e.g., Business, Society, Workers, Technology, Policy & Regulation)
- `created_at`, `updated_at` - timestamps

### 3. `author_camp_mappings` (Relationships)
- `id` - unique identifier
- `author_id` - foreign key to authors table
- `camp_id` - foreign key to camps table
- `relevance` - relevance description (e.g., "Strong Alignment", "Challenges Your View")
- `created_at` - timestamp

## API Functions

All database queries are centralized in `/lib/api/thought-leaders.ts`:

### Main Functions

1. **getThoughtLeaders()** - Fetch all thought leaders
2. **getThoughtLeaderById(id)** - Fetch a specific thought leader
3. **getTaxonomyCamps()** - Fetch all taxonomy camps
4. **getCampsWithAuthors(query?, domain?)** - Fetch camps with their associated authors
5. **getAuthorsByCamp(campId)** - Fetch authors for a specific camp
6. **searchThoughtLeaders(query)** - Search thought leaders by name, position, or affiliation
7. **getCampsByDomain(domain)** - Get camps filtered by domain
8. **getDomains()** - Get all unique domains
9. **getDomainStats()** - Get statistics for each domain

## Frontend Components Updated

### 1. CampAccordion (`/components/CampAccordion.tsx`)
- Now fetches real camp data with authors from Supabase
- Displays camps based on search query and domain filters
- Shows loading states and handles empty results

### 2. TrendingDiscourse (`/components/TrendingDiscourse.tsx`)
- Fetches camp names to display as trending topics
- Falls back to static data if Supabase is unavailable
- Shows loading state while fetching

### 3. AuthorProfile (`/components/AuthorProfile.tsx`)
- Fetches individual author details from Supabase
- Displays author information, affiliation, and position summary
- Shows loading state while fetching

## Usage Examples

### Fetching Camps with Authors
```typescript
import { getCampsWithAuthors } from '@/lib/api/thought-leaders'

const camps = await getCampsWithAuthors('AI safety', 'Technology')
// Returns camps filtered by query and domain with their authors
```

### Searching Thought Leaders
```typescript
import { searchThoughtLeaders } from '@/lib/api/thought-leaders'

const results = await searchThoughtLeaders('AI ethics')
// Returns authors matching the search query
```

### Getting Domain Statistics
```typescript
import { getDomainStats } from '@/lib/api/thought-leaders'

const stats = await getDomainStats()
// Returns: { "Business": { campsCount: 5, authorsCount: 12 }, ... }
```

## Testing the Integration

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to http://localhost:3000** to see the homepage

3. **Test the following:**
   - Homepage loads with Trending Discourse section showing camps from Supabase
   - Click on "Discover by Domain" to filter by domain
   - Search for topics and see results page with camps and authors
   - Click on an author to view their profile

## Error Handling

All API functions include error handling:
- Return empty arrays/objects on error
- Log errors to console for debugging
- Check if Supabase client is configured before making queries
- Provide fallback data where appropriate

## Next Steps

To populate your Supabase database:

1. Create the tables (`authors`, `camps`, `author_camp_mappings`) in Supabase
2. Import your "AI Thought Leaders & Taxonomy Seed" data
3. Ensure proper Row Level Security (RLS) policies are set for public read access
4. Test queries in Supabase SQL editor before running the app

## Troubleshooting

**Issue: Data not loading**
- Check browser console for errors
- Verify environment variables in `.env.local`
- Confirm tables exist in Supabase
- Check RLS policies allow public read access

**Issue: "Supabase not configured" warnings**
- Verify `.env.local` exists and has correct values
- Restart the dev server after changing env variables

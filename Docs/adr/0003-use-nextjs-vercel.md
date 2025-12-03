# ADR 0003 – Use Next.js 14 + Vercel for Frontend and Hosting

## Status
**Accepted**

## Context

Compass needed a frontend framework and hosting solution that could:
- Render search results server-side for performance
- Support real-time interactivity (search, filters, accordions)
- Deploy easily and reliably
- Scale automatically with traffic
- Integrate seamlessly with Supabase backend
- Provide good developer experience for solo/small team

Constraints:
- Limited frontend engineering resources
- Need for rapid iteration
- SEO not critical (internal tool initially)
- Performance matters (search must be fast)

## Decision

Use **Next.js 14** (App Router) with **Vercel** hosting.

### Tech Stack
- **Framework**: Next.js 14.2.5 (App Router)
- **UI**: React 18, Tailwind CSS
- **State**: React hooks, URL params for search state
- **Hosting**: Vercel (serverless deployment)
- **Backend integration**: Supabase client SDK

### Architecture Pattern
- **Server Components**: For data fetching from Supabase
- **Client Components**: For interactive UI (accordions, search)
- **API Routes**: Minimal use (most data via direct Supabase calls)
- **Edge Runtime**: Not used (standard Node.js runtime sufficient)

## Consequences

### Positive

✅ **Server-side rendering**: Fast initial page loads
✅ **Zero-config deployment**: Push to GitHub → auto-deploy on Vercel
✅ **Automatic scaling**: Serverless handles traffic spikes
✅ **Developer experience**: Hot reload, TypeScript support, great docs
✅ **React ecosystem**: Access to entire React/npm ecosystem
✅ **Built-in routing**: File-based routing (no extra router config)
✅ **Image optimization**: Built-in next/image component
✅ **Free tier**: Generous Vercel free tier for MVP

### Negative / Tradeoffs

⚠️ **Vendor lock-in**: Vercel-specific features (ISR, Middleware) lock us in
⚠️ **Bundle size**: React adds ~40KB minimum
⚠️ **Complexity**: App Router learning curve, server/client components
⚠️ **Build times**: Can get slow as app grows
⚠️ **Cost scaling**: Vercel pricing jumps significantly at high traffic

### Mitigation

- **For vendor lock-in**: Keep core logic framework-agnostic
- **For bundle size**: Code splitting, dynamic imports where appropriate
- **For build times**: Optimize dependencies, use incremental builds
- **For cost**: Plan to self-host on Railway/Fly.io if Vercel becomes expensive

## Alternatives Considered

### Alternative A: Remix
**Why rejected**:
- Less mature ecosystem than Next.js
- Vercel deployment not as seamless
- Smaller community for troubleshooting
- App Router offers similar benefits

### Alternative B: SvelteKit
**Why rejected**:
- Smaller ecosystem
- Less Supabase integration examples
- Team less familiar with Svelte
- React ecosystem larger for components

### Alternative C: Astro
**Why rejected**:
- Better for content sites, not web apps
- Less suited for dynamic search application
- Would need React for interactivity anyway
- More complex mental model

### Alternative D: Vanilla React (Vite) + Separate Backend
**Why rejected**:
- Need to build and deploy API separately
- No SSR out of the box
- More infrastructure to manage
- Slower time to MVP

### Alternative E: Rails/Django Monolith
**Why rejected**:
- Heavier stack for simple search interface
- Less modern UI capabilities
- Team more familiar with React
- Harder to iterate on frontend

## Implementation Notes

### Project Structure
```
app/
├── page.tsx              # Homepage
├── results/
│   └── page.tsx          # Search results (main app)
├── authors/
│   └── page.tsx          # Author index
├── author/[id]/
│   └── page.tsx          # Author detail
└── layout.tsx            # Root layout
```

### Server vs Client Components

**Server Components** (default):
- Page layouts
- Data fetching from Supabase
- Static content rendering

**Client Components** (`'use client'`):
- SearchBar (user input)
- CampAccordion (expand/collapse)
- WhiteSpacePanel (interactive notes)
- Any component with useState, useEffect, onClick

### Deployment Flow
1. Push to `main` branch on GitHub
2. Vercel auto-detects changes
3. Runs `npm run build`
4. Deploys to production
5. Rollback available via Vercel dashboard

### Environment Variables
Managed in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (for scripts)

## Performance Characteristics

### Build Performance
- **Cold build**: ~30-60 seconds
- **Incremental build**: ~10-20 seconds
- **Hot reload**: <1 second

### Runtime Performance
- **Server component render**: ~100-300ms (depends on Supabase query)
- **Client hydration**: ~200-500ms
- **Search navigation**: ~50-150ms (URL param update)

## Related Decisions
- ADR 0001: Use Supabase (Next.js integrates well)
- ADR 0002: 3-tier taxonomy (affects how pages query data)

## Future Considerations

### When to Reconsider
- If Vercel costs exceed $100/month
- If we need custom server logic (WebSockets, long-running tasks)
- If App Router proves too constraining
- If build times exceed 5 minutes regularly

### Possible Future Moves
- Migrate to Remix if need more control over data loading
- Self-host on Railway/Fly.io with Docker
- Extract search API to separate service for reuse

## Date
Initial decision: ~October 2024
Documented: December 2024

## References
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [App Structure](../../app/)

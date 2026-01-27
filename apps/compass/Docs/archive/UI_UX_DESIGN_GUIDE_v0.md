# Compass UI/UX Design Guide

**Version**: 1.0
**Last Updated**: 2024-12-02
**Purpose**: Establish UI/UX design standards for the Compass AI Thought Leadership platform

---

## Table of Contents

1. [Visual Design Principles](#visual-design-principles)
2. [Interaction Design](#interaction-design)
3. [Accessibility Standards](#accessibility-standards)
4. [Performance Optimization](#performance-optimization)
5. [Responsive Design](#responsive-design)
6. [Component Library](#component-library)
7. [Testing & Iteration](#testing--iteration)

---

## 1. Visual Design Principles

### Color Palette

**Primary Colors**:
```css
--primary-blue: #2563eb;      /* Search highlights, CTAs */
--primary-dark: #1e40af;      /* Hover states */
--primary-light: #60a5fa;     /* Backgrounds, subtle emphasis */
```

**Neutral Colors**:
```css
--bg-white: #ffffff;          /* Main background */
--bg-gray-50: #f9fafb;        /* Card backgrounds */
--bg-gray-100: #f3f4f6;       /* Hover states */
--text-primary: #111827;      /* Headings */
--text-secondary: #6b7280;    /* Body text, meta info */
--border-gray: #e5e7eb;       /* Dividers, borders */
```

**Domain Colors** (for visual hierarchy):
```css
--domain-technical: #8b5cf6;    /* AI Technical Capabilities */
--domain-society: #ec4899;      /* AI & Society */
--domain-governance: #f59e0b;   /* AI Governance */
--domain-enterprise: #10b981;   /* Enterprise AI Adoption */
--domain-work: #3b82f6;         /* Future of Work */
```

**Status Colors**:
```css
--success: #10b981;           /* Success states */
--warning: #f59e0b;           /* Warning states */
--error: #ef4444;             /* Error states */
--info: #3b82f6;              /* Info states */
```

### Typography

**Font Stack**:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Helvetica Neue', Arial, sans-serif;
```

**Type Scale** (mobile-first, then desktop):
```css
/* Headings */
--h1: 2rem / 2.5rem;          /* 32px → 40px */
--h2: 1.5rem / 1.875rem;      /* 24px → 30px */
--h3: 1.25rem / 1.5rem;       /* 20px → 24px */
--h4: 1.125rem / 1.25rem;     /* 18px → 20px */

/* Body */
--body-large: 1.125rem;       /* 18px - Domain labels */
--body-base: 1rem;            /* 16px - Body text */
--body-small: 0.875rem;       /* 14px - Meta info */
--body-tiny: 0.75rem;         /* 12px - Badges, labels */
```

**Line Height**:
- Headings: 1.2
- Body text: 1.6
- Compact UI elements: 1.4

**Font Weight**:
- Regular: 400 (body text)
- Medium: 500 (emphasis)
- Semibold: 600 (headings, buttons)
- Bold: 700 (strong emphasis)

### Visual Hierarchy

**Primary Elements** (high contrast, largest size):
- Search bar
- Domain headings
- Author names
- Key quotes

**Secondary Elements** (medium contrast):
- Camp labels
- Affiliations
- "Why it matters" text
- Navigation elements

**Tertiary Elements** (low contrast, smaller):
- Metadata (dates, source counts)
- Helper text
- Badges (credibility tier, relevance)
- Dividers

### Spacing System

Use consistent 8px base unit:

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
```

**Application**:
- Component internal spacing: xs-sm
- Between related elements: md
- Between sections: lg-xl
- Page margins: xl-2xl

---

## 2. Interaction Design

### Navigation Patterns

**Primary Navigation**:
- Top bar with logo + search (persistent)
- Minimal navigation (Home, Authors, About)
- Search-first approach (users land on search)

**Secondary Navigation**:
- Domain accordion (expand/collapse)
- Camp filtering (inline within domain)
- Breadcrumbs for author detail pages

**Mobile Navigation**:
- Hamburger menu for secondary links
- Search bar remains prominent
- Bottom navigation for frequent actions (if needed)

### Search Experience

**Search Bar**:
```typescript
// Key features
- Autofocus on page load
- Clear icon when text present
- Real-time feedback (loading state)
- Enter key to submit
- Persist search query in URL
```

**Search Results**:
- Instant feedback (show "Searching..." state)
- Progressive loading for large result sets
- Clear "No results" state with suggestions
- Highlight search terms in results

**URL State Management**:
```
/results?q=search+terms
```
- Shareable URLs
- Browser back/forward support
- Bookmark-friendly

### Interactive Components

**Accordion Pattern** (Domain/Camp):
```typescript
// CampAccordion behavior
- Click domain header → expand/collapse all camps
- Click camp label → filter to that camp only
- Visual indicator (chevron) for expanded state
- Smooth animation (200-300ms)
- Preserve state during navigation
```

**Author Cards**:
- Hover state: subtle background change
- Click: navigate to author detail
- Touch-friendly target size (min 44x44px)
- Loading skeleton while fetching

**Buttons & CTAs**:
```css
/* Primary Button */
background: var(--primary-blue);
padding: 0.75rem 1.5rem;
border-radius: 0.5rem;
transition: all 200ms;

/* Hover */
background: var(--primary-dark);
transform: translateY(-1px);
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
```

**Feedback States**:
- **Loading**: Spinner or skeleton screens
- **Success**: Green checkmark + message (3s auto-dismiss)
- **Error**: Red banner with clear message + retry action
- **Empty state**: Helpful illustration + guidance

---

## 3. Accessibility Standards

### WCAG 2.1 AA Compliance

**Color Contrast**:
- Normal text: minimum 4.5:1
- Large text (18px+): minimum 3:1
- UI components: minimum 3:1

**Current Ratios** (verify these):
```css
/* Text on white */
--text-primary (#111827) on white: 16.5:1 ✅
--text-secondary (#6b7280) on white: 5.9:1 ✅

/* Interactive elements */
--primary-blue (#2563eb) on white: 5.8:1 ✅
```

### Semantic HTML

**Structure**:
```html
<header>
  <nav aria-label="Main navigation">
    <a href="/" aria-current="page">Home</a>
  </nav>
</header>

<main id="main-content">
  <section aria-labelledby="results-heading">
    <h1 id="results-heading">Search Results</h1>
    <!-- Content -->
  </section>
</main>

<footer>
  <!-- Footer content -->
</footer>
```

**Landmarks**:
- Use `<main>`, `<nav>`, `<aside>`, `<footer>`
- Provide `aria-label` for multiple navigation regions
- Use `aria-current="page"` for current page indicator

### Keyboard Navigation

**Focus Management**:
```css
/* Visible focus indicator */
:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove default outline, use custom */
:focus:not(:focus-visible) {
  outline: none;
}
```

**Tab Order**:
1. Skip to main content link
2. Logo / Home link
3. Search bar
4. Navigation links
5. Domain accordions (in order)
6. Author cards (in order)
7. Footer links

**Keyboard Shortcuts**:
- `/` → Focus search bar
- `Esc` → Clear search / Close modal
- `Arrow keys` → Navigate accordions
- `Enter/Space` → Expand/collapse, activate

### Screen Reader Support

**ARIA Labels**:
```html
<!-- Search -->
<input
  type="search"
  aria-label="Search for AI thought leaders"
  placeholder="e.g., enterprise adoption, safety concerns"
/>

<!-- Accordion -->
<button
  aria-expanded="true"
  aria-controls="domain-technical-content"
>
  AI Technical Capabilities
</button>

<!-- Status updates -->
<div role="status" aria-live="polite">
  Found 15 results
</div>
```

**Image Alt Text**:
```html
<!-- Author photos -->
<img
  src="/authors/sam-altman.jpg"
  alt="Sam Altman, CEO of OpenAI"
/>

<!-- Decorative images -->
<img src="/icon-search.svg" alt="" role="presentation" />
```

### Testing Checklist

- [ ] Test with VoiceOver (macOS)
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Keyboard-only navigation
- [ ] Color contrast validation (WAVE, axe DevTools)
- [ ] Automated testing (jest-axe, Lighthouse)

---

## 4. Performance Optimization

### Core Web Vitals Targets

**Largest Contentful Paint (LCP)**: < 2.5s
- Optimize search results rendering
- Use Next.js Image component for author photos
- Implement server-side rendering for initial content

**First Input Delay (FID)**: < 100ms
- Minimize JavaScript bundle size
- Use code splitting for routes
- Defer non-critical scripts

**Cumulative Layout Shift (CLS)**: < 0.1
- Reserve space for author cards (skeleton)
- Set explicit dimensions for images
- Avoid injecting content above existing content

### Image Optimization

**Next.js Image Component**:
```tsx
import Image from 'next/image'

<Image
  src="/authors/sam-altman.jpg"
  alt="Sam Altman"
  width={64}
  height={64}
  className="rounded-full"
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/..." // Generate at build time
/>
```

**Best Practices**:
- Use WebP format with JPEG fallback
- Serve responsive images (srcset)
- Lazy load below-the-fold images
- Use CDN for image delivery (Vercel automatically does this)

### Code Splitting

```typescript
// Route-based splitting (automatic with Next.js)
// pages/results.tsx → separate bundle

// Component-based splitting
const WhiteSpacePanel = dynamic(() => import('./WhiteSpacePanel'), {
  loading: () => <div>Loading notes...</div>,
  ssr: false // Client-side only
})
```

### Database Query Optimization

**Current Patterns**:
```typescript
// Fetch only needed fields
const authors = await supabase
  .from('authors')
  .select('id, name, header_affiliation, credibility_tier')
  .eq('id', authorId)
  .single()

// Use indexes for frequent queries
// - authors(name)
// - camp_authors(camp_id, author_id)
// - camps(domain_id)
```

### Caching Strategy

**Static Generation** (where possible):
```typescript
// Author detail pages - ISR
export async function generateStaticParams() {
  const authors = await getAuthors()
  return authors.map(a => ({ id: a.id }))
}

export const revalidate = 3600 // Revalidate every hour
```

**Client-Side Caching**:
- Cache search results in React state
- Use URL params to enable back/forward cache
- Consider React Query for server state management

---

## 5. Responsive Design

### Breakpoints

```css
/* Mobile-first approach */
--mobile: 320px;           /* Base */
--mobile-lg: 480px;        /* Large phones */
--tablet: 768px;           /* Tablets */
--desktop: 1024px;         /* Desktop */
--desktop-lg: 1280px;      /* Large desktop */
--desktop-xl: 1536px;      /* Extra large */
```

**Usage**:
```tsx
// Tailwind breakpoints
<div className="
  w-full              // Mobile: 100% width
  md:w-2/3            // Tablet: 66% width
  lg:w-1/2            // Desktop: 50% width
  xl:max-w-4xl        // Large: max 896px
">
```

### Layout Patterns

**Search Results Layout**:

**Mobile** (< 768px):
```
┌─────────────────┐
│   Search Bar    │
├─────────────────┤
│   Domain 1 ▼    │
│  ┌───────────┐  │
│  │ Author 1  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │ Author 2  │  │
│  └───────────┘  │
├─────────────────┤
│   Domain 2 ▶    │
└─────────────────┘
```

**Desktop** (≥ 1024px):
```
┌──────────────────────────────────┐
│          Search Bar              │
├────────────────┬─────────────────┤
│   Domain 1 ▼   │  WhiteSpace     │
│  ┌──────────┐  │   Panel         │
│  │ Author 1 │  │                 │
│  └──────────┘  │   (Notes,       │
│  ┌──────────┐  │    Thoughts)    │
│  │ Author 2 │  │                 │
│  └──────────┘  │                 │
│                │                 │
│   Domain 2 ▶   │                 │
└────────────────┴─────────────────┘
```

### Component Responsiveness

**Author Card**:
```tsx
<div className="
  p-4                 // Base padding
  sm:p-6              // More padding on larger screens
  border rounded-lg
  hover:shadow-md
  transition-shadow

  grid grid-cols-[auto_1fr]  // Photo + content
  gap-4
  sm:gap-6
">
  {/* Author photo */}
  <Image
    className="
      w-12 h-12         // Mobile: 48px
      sm:w-16 sm:h-16   // Desktop: 64px
    "
  />

  {/* Author info */}
  <div>
    <h3 className="
      text-base         // Mobile: 16px
      sm:text-lg        // Desktop: 18px
      font-semibold
    ">
      {author.name}
    </h3>
  </div>
</div>
```

**CampAccordion**:
```tsx
<div className="
  space-y-4           // Mobile: 16px vertical spacing
  lg:space-y-6        // Desktop: 24px vertical spacing
">
  <button className="
    w-full
    py-3 px-4         // Mobile
    lg:py-4 lg:px-6   // Desktop: more padding
    text-left
    text-lg           // Mobile: 18px
    lg:text-xl        // Desktop: 20px
  ">
```

### Touch Targets

**Minimum Sizes**:
```css
/* Interactive elements */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  /* Or use Tailwind: min-w-11 min-h-11 */
}

/* Spacing between targets */
.touch-spacing {
  margin: 8px 0;
  /* Tailwind: my-2 */
}
```

**Examples**:
- Accordion headers: 48px height minimum
- Author cards: Full width, 64px+ height
- Buttons: 44px height minimum
- Camp filter buttons: 40px height with 8px spacing

### Typography Scaling

```css
/* Fluid typography */
html {
  font-size: 16px;               /* Mobile base */
}

@media (min-width: 768px) {
  html {
    font-size: 17px;             /* Tablet: slightly larger */
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 18px;             /* Desktop: larger base */
  }
}
```

---

## 6. Component Library

### Primary Components

**SearchBar** (`components/SearchBar.tsx`)

**Purpose**: Main search input for finding authors/topics

**States**:
- Empty (placeholder text)
- Active (user typing)
- Filled (has value, show clear button)
- Loading (spinner icon)

**Props**:
```typescript
interface SearchBarProps {
  defaultValue?: string
  onSearch: (query: string) => void
  placeholder?: string
  autoFocus?: boolean
}
```

**Accessibility**:
- `aria-label="Search for AI thought leaders"`
- `role="search"` on wrapper
- Clear button: `aria-label="Clear search"`

---

**CampAccordion** (`components/CampAccordion.tsx`)

**Purpose**: Display domains with expandable camps and authors

**States**:
- Collapsed (show domain only)
- Expanded (show camps + authors)
- Selected camp (filter to one camp)
- Loading (skeleton)

**Props**:
```typescript
interface CampAccordionProps {
  domain: Domain
  camps: Camp[]
  selectedCampId?: string
  onCampSelect: (campId: string | null) => void
}
```

**Interaction**:
- Click domain header → toggle expand/collapse
- Click camp label → filter to that camp
- Click again → deselect camp (show all)

**Accessibility**:
- `aria-expanded="true|false"`
- `aria-controls="domain-{id}-content"`
- Keyboard: Enter/Space to toggle

---

**AuthorCard** (`components/AuthorCard.tsx`)

**Purpose**: Display author summary in search results

**Content**:
- Author photo (circular, 48px mobile / 64px desktop)
- Name (heading)
- Affiliation (subheading)
- Credibility tier badge
- Key quote snippet
- Camp relationship indicator

**Props**:
```typescript
interface AuthorCardProps {
  author: Author
  campRelationship?: CampAuthor
  onClick: () => void
}
```

**States**:
- Default
- Hover (subtle background change)
- Focus (visible outline)
- Loading (skeleton)

---

**WhiteSpacePanel** (`components/WhiteSpacePanel.tsx`)

**Purpose**: Collapsible notes panel for user thoughts

**Features**:
- Toggle expand/collapse
- Textarea for notes
- Local storage persistence
- Desktop-only (hidden on mobile)

**Props**:
```typescript
interface WhiteSpacePanelProps {
  defaultExpanded?: boolean
}
```

---

### Design Tokens

**Shadows**:
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
```

**Border Radius**:
```css
--radius-sm: 0.25rem;    /* 4px - badges */
--radius-md: 0.5rem;     /* 8px - cards */
--radius-lg: 0.75rem;    /* 12px - panels */
--radius-full: 9999px;   /* Circular - avatars */
```

**Transitions**:
```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

---

## 7. Testing & Iteration

### A/B Testing Priorities

**High Priority**:
1. Search result layout (list vs grid)
2. Domain accordion default state (collapsed vs expanded)
3. Author card information density
4. CTA button placement and copy

**Medium Priority**:
5. Color scheme for domain categories
6. Typography scale
7. WhiteSpace panel default state
8. Camp filter UI pattern

**Low Priority**:
9. Animation durations
10. Shadow depths
11. Border radius values

### Analytics Events

**Track These Interactions**:
```typescript
// Search behavior
analytics.track('search_query', { query, resultCount })
analytics.track('search_no_results', { query })

// Navigation
analytics.track('domain_expanded', { domainId, domainName })
analytics.track('camp_selected', { campId, campName })
analytics.track('author_clicked', { authorId, authorName })

// Engagement
analytics.track('quote_expanded', { authorId })
analytics.track('source_clicked', { authorId, sourceUrl })
analytics.track('whitespace_panel_toggled', { expanded })
```

### Heatmap Analysis

**Focus Areas**:
- Search bar usage patterns
- Domain expand/collapse frequency
- Author card click-through rates
- Camp filter usage
- Scroll depth on search results

**Tools**:
- Hotjar (heatmaps + session recordings)
- Microsoft Clarity (free, privacy-friendly)
- PostHog (open source, self-hosted option)

### User Feedback Mechanisms

**Inline Feedback**:
```tsx
// Bottom of search results
<div className="text-center py-8">
  <p className="text-gray-600 mb-4">
    Did you find what you were looking for?
  </p>
  <div className="flex gap-4 justify-center">
    <button onClick={() => trackFeedback('yes')}>
      👍 Yes
    </button>
    <button onClick={() => trackFeedback('no')}>
      👎 No
    </button>
  </div>
</div>
```

**Feedback Widget**:
- Floating button (bottom-right)
- Modal with feedback form
- Categories: Bug, Feature Request, General
- Optional email for follow-up

### Usability Testing Protocol

**Testing Scenarios**:
1. **Task**: Find authors who challenge AI scaling approaches
   - **Success**: User finds "Needs New Approaches" camp
   - **Measure**: Time to task, clicks, frustration

2. **Task**: Explore what Cassie Kozyrkov thinks about enterprise AI
   - **Success**: User finds Cassie in Enterprise domain
   - **Measure**: Navigation path, errors

3. **Task**: Compare two authors' positions on AI safety
   - **Success**: User opens both author pages
   - **Measure**: Method used, efficiency

**Frequency**:
- Initial launch: 5-8 users
- After major updates: 3-5 users
- Quarterly: 5-8 users

### Performance Monitoring

**Real User Monitoring (RUM)**:
```typescript
// Track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(metric => analytics.track('web_vital_cls', metric))
getFID(metric => analytics.track('web_vital_fid', metric))
getLCP(metric => analytics.track('web_vital_lcp', metric))
```

**Performance Budgets**:
- JavaScript bundle: < 200KB (gzipped)
- Initial page load: < 3s (LCP)
- Time to interactive: < 5s
- First Input Delay: < 100ms

---

## Design System Documentation

### Component States Documentation

For each component, document:

**Visual States**:
- Default
- Hover
- Active/Pressed
- Focus
- Disabled
- Loading
- Error

**Example** (Button):
```tsx
// Default
<Button>Search</Button>

// Loading
<Button loading>Searching...</Button>

// Disabled
<Button disabled>Search</Button>

// Error
<Button variant="error">Retry</Button>
```

### Design Tokens File

Create `styles/tokens.css`:
```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-text-primary: #111827;
  /* ... all tokens */

  /* Spacing */
  --space-xs: 0.25rem;
  /* ... spacing scale */

  /* Typography */
  --font-size-base: 1rem;
  /* ... type scale */
}
```

Import in global CSS:
```css
@import './tokens.css';
```

### Component Usage Examples

Maintain examples in Storybook or similar:

```tsx
// SearchBar.stories.tsx
export const Default = () => (
  <SearchBar placeholder="Search..." />
)

export const WithValue = () => (
  <SearchBar defaultValue="enterprise AI" />
)

export const Loading = () => (
  <SearchBar defaultValue="searching..." loading />
)
```

---

## Mobile-Specific Considerations

### Thumb Zones

**Optimal Touch Areas** (right-handed users, most common):

```
┌─────────────┐
│   ❌ Hard   │  Top of screen
│             │
│   ⚠️ OK     │  Middle
│             │
│   ✅ Easy   │  Bottom third (thumb-friendly)
└─────────────┘
```

**Implications**:
- Place search bar at top (users expect it)
- Place frequent actions at bottom (if nav needed)
- Avoid critical actions in top corners

### Touch Gestures

**Implemented**:
- Tap: Open/close accordions, select camps
- Scroll: Vertical scrolling (primary)

**Consider Adding**:
- Swipe: Navigate between author profiles
- Pull-to-refresh: Refresh search results
- Pinch-to-zoom: Not needed (text should scale)

### Mobile Performance

**Optimize For**:
- 3G network speeds (test with throttling)
- Older devices (test on 3-year-old phones)
- Battery efficiency (avoid heavy animations)

**Mobile-Specific Optimizations**:
```typescript
// Reduce animation on mobile
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

// Disable WhiteSpace panel on mobile (save memory)
const isMobile = window.innerWidth < 768
```

---

## Maintenance & Updates

### Quarterly Review Checklist

- [ ] Review analytics for pain points
- [ ] Check Core Web Vitals performance
- [ ] Test accessibility with latest tools
- [ ] Update design tokens if brand evolves
- [ ] Review and update component states
- [ ] Conduct usability testing session
- [ ] Update documentation with learnings

### Version Control

Track design system changes:

```markdown
## Version 1.1 - 2024-12-15
- Added: Domain color coding
- Changed: Increased author card padding
- Fixed: Focus states on mobile
- Deprecated: Old button styles
```

### Communication

When updating design system:
1. Document change in ADR (if architectural)
2. Update this guide
3. Update component documentation
4. Notify team in Slack/Discord
5. Update Storybook examples

---

## Quick Reference

### Critical Measurements

| Element | Mobile | Desktop |
|---------|--------|---------|
| Touch target | 44x44px | 44x44px |
| Body text | 16px | 18px |
| Line height (body) | 1.6 | 1.6 |
| Card padding | 16px | 24px |
| Section spacing | 24px | 32px |

### Color Contrast Ratios

| Combination | Ratio | Pass |
|-------------|-------|------|
| Text primary on white | 16.5:1 | ✅ AAA |
| Text secondary on white | 5.9:1 | ✅ AA |
| Primary blue on white | 5.8:1 | ✅ AA |
| Border gray on white | 1.3:1 | ❌ (decorative only) |

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | TBD |
| FID | < 100ms | TBD |
| CLS | < 0.1 | TBD |
| Bundle size | < 200KB | TBD |

---

## Related Documentation

- **Component Implementation**: See `/components` directory
- **Tailwind Config**: `tailwind.config.ts`
- **Global Styles**: `app/globals.css`
- **Design Tokens**: `styles/tokens.css` (to be created)

---

**Maintained by**: Compass team
**Last reviewed**: 2024-12-02
**Next review**: 2025-03-02


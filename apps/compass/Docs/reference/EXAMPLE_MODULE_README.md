# Example Module README

This is a concrete example of what a well-structured module README looks like. Use this as a reference when creating your own.

---

# Components

React components for the Compass UI, built with Next.js 14 and Tailwind CSS.

## Purpose

This module contains all reusable React components for the Compass application. Components are designed to be:
- Type-safe with TypeScript
- Accessible (WCAG 2.1 AA compliant)
- Responsive across devices
- Themeable with Tailwind CSS

Components follow atomic design principles, starting with base UI components (buttons, inputs) and composing them into feature-specific components (search bar, author cards).

## Key Exports

### SearchBar

**Location:** `components/SearchBar.tsx`

**Purpose:** Main search interface with autocomplete and recent searches

**Usage:**
```typescript
import { SearchBar } from '@/components/SearchBar'

<SearchBar
  onSearch={(query) => console.log(query)}
  placeholder="Search authors..."
  showRecentSearches={true}
/>
```

**Props:**
- `onSearch` (function): Callback fired when user submits search
- `placeholder` (string, optional): Placeholder text
- `showRecentSearches` (boolean, optional): Show recent searches dropdown

**Related:**
- Uses `useSearchHistory` hook from `lib/hooks`
- See SearchBar.tsx:78 for debounce implementation

### AuthorCard

**Location:** `components/AuthorCard.tsx`

**Purpose:** Displays author summary with camp affiliations and avatar

**Usage:**
```typescript
import { AuthorCard } from '@/components/AuthorCard'

<AuthorCard
  author={{
    id: 1,
    name: "Eliezer Yudkowsky",
    avatar_url: "/avatars/ey.jpg",
    camps: ["AI Safety", "Rationalism"]
  }}
  onClick={(id) => router.push(`/author/${id}`)}
/>
```

**Props:**
- `author` (Author): Author object from database
- `onClick` (function, optional): Click handler
- `showCamps` (boolean, optional): Display camp badges (default: true)

**Related:**
- See [ADR-0002: Component Composition](../../adr/0002-component-composition.md) for design rationale

### CampAccordion

**Location:** `components/CampAccordion.tsx`

**Purpose:** Collapsible section showing authors grouped by philosophical camp

**Usage:**
```typescript
import { CampAccordion } from '@/components/CampAccordion'

<CampAccordion
  camp={{
    id: 1,
    name: "AI Safety",
    description: "Focus on long-term AI risks",
    authors: [/* array of authors */]
  }}
  defaultExpanded={false}
/>
```

**Props:**
- `camp` (Camp): Camp object with nested authors
- `defaultExpanded` (boolean, optional): Initial expanded state
- `onAuthorClick` (function, optional): Author card click handler

## Directory Structure

```
components/
├── SearchBar.tsx           # Main search component
├── SearchFilters.tsx       # Advanced search filters
├── AuthorCard.tsx          # Author card component
├── AuthorProfile.tsx       # Author detail header
├── CampAccordion.tsx       # Collapsible camp section
├── PositioningSnapshot.tsx # Metrics display
├── WhiteSpacePanel.tsx     # Opportunities panel
├── Sidebar.tsx             # Left sidebar navigation
├── SourcesList.tsx         # Author sources list
├── ui/                     # Base UI components (shadcn)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── types.ts                # Shared TypeScript types
└── README.md               # This file
```

## Common Patterns

### Pattern 1: Data Fetching

Components receive data from server components or client-side hooks, not directly from Supabase.

```typescript
// ✅ Good: Component receives data as props
export function AuthorCard({ author }: { author: Author }) {
  return <div>{author.name}</div>
}

// ❌ Bad: Component fetches its own data
export function AuthorCard({ authorId }: { authorId: number }) {
  const author = supabase.from('authors').select('*').eq('id', authorId)
  return <div>{author.name}</div>
}
```

**When to use:** Always. Data fetching happens in server components or custom hooks.

**Example:** See `app/results/page.tsx:23` for server component data fetching

### Pattern 2: Compound Components

Complex components expose sub-components for flexible composition.

```typescript
// ✅ Good: Flexible composition
<Card>
  <Card.Header>
    <Card.Title>Author Name</Card.Title>
  </Card.Header>
  <Card.Content>...</Card.Content>
</Card>

// ❌ Bad: Monolithic component with many props
<Card title="Author Name" content="..." headerClass="..." />
```

**When to use:** For components with multiple layout variations

**Example:** See `ui/card.tsx:15` for compound component implementation

### Pattern 3: Controlled vs Uncontrolled

Form components can be controlled (React state) or uncontrolled (DOM state).

```typescript
// Controlled: State managed by parent
<SearchBar value={query} onChange={setQuery} />

// Uncontrolled: Component manages its own state
<SearchBar defaultValue="" onSubmit={handleSubmit} />
```

**When to use:**
- Controlled: When parent needs to read/modify state
- Uncontrolled: For simple forms where final value is all you need

**Example:** SearchBar supports both patterns (see SearchBar.tsx:45)

## Usage Guidelines

### Do's ✅

- Use TypeScript interfaces from `types.ts` for component props
- Follow Tailwind CSS for styling (no inline styles)
- Make components keyboard accessible
- Use semantic HTML elements
- Memoize expensive computations with `useMemo`
- Add `aria-label` for icons and non-text elements

### Don'ts ❌

- Don't import from `ui/` components directly; re-export in `components/index.ts`
- Don't fetch data inside presentational components
- Avoid `any` types; use proper TypeScript interfaces
- Don't use `div` for clickable elements (use `button`)
- Avoid deeply nested component hierarchies (>3 levels)

## Testing

### Running Tests

```bash
# Run all component tests
npm test components

# Run specific component tests
npm test SearchBar

# Run with coverage
npm test -- --coverage
```

### Test Strategy

- **Unit tests:** All components have unit tests for rendering and interactions
- **Integration tests:** Complex components (CampAccordion) test data flow
- **Visual regression:** Key components have Storybook stories
- **Accessibility:** Automated a11y tests using jest-axe

### Example Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('should call onSearch when form is submitted', () => {
    const handleSearch = jest.fn()
    render(<SearchBar onSearch={handleSearch} />)

    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'AI Safety' } })
    fireEvent.submit(input.closest('form'))

    expect(handleSearch).toHaveBeenCalledWith('AI Safety')
  })
})
```

## Dependencies

### Internal Dependencies

- `lib/supabase` - Database client (only in data-fetching hooks, not components)
- `lib/utils` - Utility functions (cn, formatDate, etc.)
- `lib/hooks` - Custom React hooks (useSearchHistory, etc.)

### External Dependencies

- `react` - Core React library
- `@radix-ui/*` - Accessible component primitives
- `class-variance-authority` - Type-safe variant styles
- `tailwind-merge` - Merge Tailwind classes safely

## Performance Considerations

- **Code splitting**: Feature-specific components are lazy-loaded
- **Memoization**: Expensive renders use React.memo
- **Virtual scrolling**: Large lists (search results) use react-virtual
- **Image optimization**: All images use Next.js Image component

## Accessibility

All components follow WCAG 2.1 AA standards:

- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Screen readers**: ARIA labels and roles provided where needed
- **Focus management**: Visible focus indicators on all interactive elements
- **Color contrast**: All text meets minimum contrast ratios
- **Reduced motion**: Respects `prefers-reduced-motion` media query

## Migration Guide

### Migrating from Class Components

If you have old class components, convert them to functional components with hooks:

```typescript
// Old: Class component
class AuthorCard extends React.Component {
  state = { expanded: false }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    return <div onClick={this.toggle}>...</div>
  }
}

// New: Functional component with hooks
function AuthorCard() {
  const [expanded, setExpanded] = useState(false)

  return <div onClick={() => setExpanded(!expanded)}>...</div>
}
```

### Migrating from CSS Modules

We've standardized on Tailwind CSS. To migrate:

1. Remove CSS module imports
2. Convert styles to Tailwind utility classes
3. Use `cn()` utility for conditional classes

```typescript
// Old: CSS modules
import styles from './AuthorCard.module.css'

<div className={styles.card}>...</div>

// New: Tailwind
import { cn } from '@/lib/utils'

<div className={cn("rounded-lg border p-4", highlighted && "bg-blue-50")}>
  ...
</div>
```

## Related Documentation

- [ADR-0002: Component Composition Strategy](../../adr/0002-component-composition.md) - Why we use compound components
- [ADR-0004: Styling Approach](../../adr/0004-styling-approach.md) - Tailwind CSS decision
- [Lib Documentation](../lib/README.md) - Utility functions and hooks
- [Shadcn UI Documentation](https://ui.shadcn.com/) - Base component library

## FAQ

### Why are components in a flat structure instead of grouped by feature?

We keep all components in one directory because:
1. Easy to find (predictable location)
2. Prevents duplication
3. Encourages reusability
4. Next.js app directory already groups by feature

See [ADR-0002](../../adr/0002-component-composition.md) for full rationale.

### Should I create a new component or extend an existing one?

Create a new component when:
- The behavior is fundamentally different
- The new component would require many conditional props
- The component serves a distinct purpose

Extend an existing component when:
- It's a variation of existing behavior
- You can use composition to customize it
- It shares >70% of the logic

### How do I handle forms?

For simple forms, use uncontrolled components with `useRef`.
For complex forms with validation, use React Hook Form.

See `SearchBar.tsx` for uncontrolled example.
See `SearchFilters.tsx` for React Hook Form example.

## Maintenance

**Last Updated:** 2025-12-02

**Maintainer:** Frontend Team

**Known Issues:**
- [#123](https://github.com/org/repo/issues/123) - SearchBar autocomplete performance on large datasets
- [#145](https://github.com/org/repo/issues/145) - CampAccordion animation jank on mobile

---

**Note:** This is an example README. Your actual module READMEs should follow this structure but with your specific content.

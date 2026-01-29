# Frontend Rules - Compass Platform

## Next.js 15 Conventions

- Use App Router (`/app` directory)
- Server Components by default (no 'use client' unless needed)
- Use `'use client'` directive only when:
  - Using React hooks (useState, useEffect, etc.)
  - Handling browser events
  - Using browser APIs (localStorage, etc.)
- Co-locate route files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Use route groups `(group-name)` for organization without affecting URL

## React 19 Patterns

- Prefer Server Components for data fetching
- Use Server Actions for mutations (no API routes needed)
- Use `useActionState` for form state management
- Use `useOptimistic` for optimistic UI updates
- Avoid `useEffect` for data fetching (use Server Components instead)

## Component Structure

**File naming**:
```
ResearchAssistant.tsx  // Components (PascalCase)
formatDate.ts          // Utilities (camelCase)
useAnalyzeText.ts      // Hooks (useCamelCase)
```

**Component organization**:
```
app/research-assistant/
├── page.tsx              # Route component (Server Component)
├── layout.tsx            # Layout (if needed)
├── loading.tsx           # Loading UI
├── error.tsx             # Error boundary
├── actions.ts            # Server Actions
└── components/           # Route-specific components
    ├── AnalysisForm.tsx
    └── ResultsDisplay.tsx
```

**Shared components**:
```
components/
├── ui/                   # Shadcn components
├── Header.tsx            # Global header
└── Footer.tsx            # Global footer

packages/ui/src/          # Cross-app components
└── components/
    └── Button.tsx
```

## Styling Conventions

**Tailwind utility classes** (no custom CSS unless necessary):
- Use CSS variables for colors (defined in `globals.css`)
- Responsive design: mobile-first (`sm:`, `md:`, `lg:` breakpoints)
- Use `className` not `style` prop (unless dynamic values)
- Group utilities: layout → spacing → typography → colors

**Example**:
```tsx
<div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 text-blue-900">
  <Icon className="w-5 h-5" />
  <span className="text-sm font-medium">Message</span>
</div>
```

## Import Order

```tsx
'use client'

// 1. React imports
import { useState } from 'react'

// 2. Next.js imports
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// 3. Third-party libraries
import { Loader2 } from 'lucide-react'

// 4. @compass/* packages
import { Button } from '@compass/ui'
import { analyzeText } from '@compass/ai'

// 5. @/ app imports (aliases)
import { Header } from '@/components/Header'
import { formatDate } from '@/lib/utils'

// 6. Relative imports
import { ResultsDisplay } from './components/ResultsDisplay'
```

## State Management

- **Server state**: Use Server Components (no state needed)
- **Form state**: Use `useActionState` or controlled inputs
- **UI state**: Use `useState` for local state only
- **Global state**: Context API (avoid unless necessary)
- **URL state**: Use `searchParams` for filters/pagination

## Performance

- Use `loading.tsx` for loading states
- Use `<Suspense>` for code splitting
- Use `next/image` for images (automatic optimization)
- Lazy load heavy components with `dynamic()`
- Avoid client-side data fetching (use Server Components)

## Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Color contrast meets WCAG AA standards

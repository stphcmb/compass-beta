# API Rules - Compass Platform

## Server Actions (Preferred)

**When to use**:
- Form submissions
- Create/update/delete operations
- App-internal mutations
- Any operation triggered by user interaction

**Where to define**:
```typescript
// Option 1: Inline in Server Component
// app/research-assistant/page.tsx
async function analyzeText(formData: FormData) {
  'use server'
  const text = formData.get('text')
  // ... perform analysis
}

// Option 2: Separate file (preferred for reuse)
// app/research-assistant/actions.ts
'use server'

export async function analyzeText(text: string) {
  // ... perform analysis
}
```

**Authentication pattern** (REQUIRED):
```typescript
'use server'

import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
})

export async function createAuthor(input: unknown) {
  // 1. Verify authentication
  const user = await currentUser()
  if (!user) return { error: 'Unauthorized' }

  // 2. Validate input
  const data = schema.parse(input)

  // 3. Perform operation
  const result = await supabase.from('authors').insert(data).select().single()

  if (!result.data) {
    return { error: 'Failed to create author' }
  }

  // 4. Revalidate if needed
  revalidatePath('/authors')

  return { success: true, data: result.data }
}
```

**Error handling**:
```typescript
'use server'

export async function createItem(data: unknown) {
  try {
    const validated = schema.parse(data)
    const result = await db.insert(validated)

    if (!result) {
      return { error: 'Operation failed' }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error('Create item failed:', error)
    return { error: 'An error occurred' }
  }
}
```

**Usage in client**:
```tsx
'use client'

import { createAuthor } from './actions'
import { useActionState } from 'react'

export function CreateAuthorForm() {
  const [state, action, isPending] = useActionState(createAuthor, null)

  return (
    <form action={action}>
      <input name="name" required />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Author'}
      </button>
    </form>
  )
}
```

## Route Handlers (Limited Use)

**ONLY use for**:
- Webhooks (Clerk, Stripe, external services)
- File upload/download
- Public API endpoints
- Scheduled/cron-triggered operations
- External callbacks that need specific URLs

**File location**:
```
app/api/
├── webhooks/
│   ├── clerk/route.ts
│   └── stripe/route.ts
├── upload/route.ts
└── public/
    └── authors/route.ts
```

**Pattern**:
```typescript
// app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    // Verify webhook signature
    const signature = request.headers.get('svix-signature')
    // ... verify signature

    // Process webhook
    // ...

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 400 }
    )
  }
}
```

## Input Validation

Always use Zod for input validation:

```typescript
import { z } from 'zod'

const authorSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
  tier: z.enum(['tier1', 'tier2', 'tier3']),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string().url()
  })).min(3)
})

export async function createAuthor(input: unknown) {
  'use server'

  const data = authorSchema.parse(input) // Throws if invalid
  // Proceed with validated data
}
```

## Response Formats

**Server Actions** return objects:
```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { error: string }
```

**Route Handlers** return `Response`:
```typescript
return NextResponse.json(
  { data: authors },
  { status: 200 }
)
```

## Database Queries in Actions

```typescript
'use server'

import { supabase } from '@compass/database'

export async function getAuthorWithCamps(authorId: string) {
  const { data, error } = await supabase
    .from('authors')
    .select(`
      id,
      name,
      camp_authors (
        camps (
          id,
          name
        )
      )
    `)
    .eq('id', authorId)
    .single()

  if (error) throw error
  return data
}
```

# @compass/auth

> Clerk authentication utilities for the Compass platform

## Purpose

Provides Clerk authentication components, hooks, and middleware utilities shared across all Compass applications. Centralizes authentication patterns and ensures consistent user management.

## Installation

This package is internal to the Compass monorepo and is imported via workspace protocol.

```json
{
  "dependencies": {
    "@compass/auth": "workspace:*"
  }
}
```

## Usage

### Provider Setup

Wrap your app with ClerkProvider:

```tsx
import { ClerkProvider } from '@compass/auth'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
```

### Client-Side Authentication

Use Clerk hooks in client components:

```tsx
'use client'

import { useUser, useAuth, useClerk } from '@compass/auth'

function ProfileComponent() {
  // Get current user
  const { user, isLoaded, isSignedIn } = useUser()

  if (!isLoaded) return <div>Loading...</div>
  if (!isSignedIn) return <div>Please sign in</div>

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Email: {user.emailAddresses[0].emailAddress}</p>
    </div>
  )
}

function AuthButtons() {
  const { signOut } = useClerk()
  const { userId } = useAuth()

  return (
    <>
      {userId ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <a href="/sign-in">Sign In</a>
      )}
    </>
  )
}
```

### Server-Side Authentication

Check authentication in Server Components and Server Actions:

```tsx
// Server Component
import { currentUser } from '@clerk/nextjs/server'

export default async function ProfilePage() {
  const user = await currentUser()

  if (!user) {
    return <div>Not authenticated</div>
  }

  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  )
}
```

```typescript
// Server Action
'use server'

import { currentUser } from '@clerk/nextjs/server'
import { supabase } from '@compass/database'

export async function createPost(title: string) {
  // ALWAYS verify authentication first
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Proceed with authenticated operation
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      title,
      author_email: user.emailAddresses[0].emailAddress
    })

  if (error) return { error: 'Failed to create post' }
  return { success: true, data }
}
```

### Middleware Configuration

Protect routes with authentication middleware:

```typescript
// middleware.ts (in your app root)
import { createMiddleware } from '@compass/auth'

export default createMiddleware([
  '/',           // Public home page
  '/about',      // Public about page
  '/sign-in(.*)', // Sign in pages
  '/sign-up(.*)', // Sign up pages
])

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

This will:
- Allow access to specified public routes
- Require authentication for all other routes
- Automatically redirect unauthenticated users to sign-in

### Sign In / Sign Up Components

```tsx
import { SignIn, SignUp } from '@compass/auth'

// Sign In page
export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
          },
        }}
      />
    </div>
  )
}

// Sign Up page
export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
          },
        }}
      />
    </div>
  )
}
```

### Advanced: Route Matching

Create custom middleware with specific route patterns:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@compass/auth'

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/blog(.*)',
  '/docs(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

// Define admin routes
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  // Public routes - no auth required
  if (isPublicRoute(request)) {
    return
  }

  // Admin routes - require specific role
  if (isAdminRoute(request)) {
    await auth.protect((has) => {
      return has({ role: 'admin' })
    })
    return
  }

  // All other routes - require authentication
  await auth.protect()
})
```

## API Reference

### Components

- `ClerkProvider` - Context provider for Clerk authentication (wrap your app)
- `SignIn` - Pre-built sign-in component with full functionality
- `SignUp` - Pre-built sign-up component with full functionality

### Client Hooks

- `useUser()` - Get current user information
  - Returns: `{ user, isLoaded, isSignedIn }`
- `useAuth()` - Get authentication state
  - Returns: `{ userId, isLoaded, isSignedIn, signOut }`
- `useClerk()` - Access Clerk instance methods
  - Returns: `{ signOut, openSignIn, openSignUp, ... }`

### Server Functions

- `currentUser()` - Get current user in Server Components/Actions
  - Returns: `User | null`
- `auth()` - Get auth state in Server Components/Actions
  - Returns: `{ userId, sessionId, ... }`

### Middleware

- `createMiddleware(publicRoutes: string[])` - Create authentication middleware
  - `publicRoutes` - Array of route patterns that don't require auth
  - Returns: Configured middleware function

- `clerkMiddleware(handler)` - Base Clerk middleware for custom logic
- `createRouteMatcher(patterns: string[])` - Create route matcher function

## Dependencies

- **@clerk/nextjs** - Clerk authentication for Next.js

## Development

### Environment Variables

Required in `.env.local`:

```bash
# Public (client-side safe)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Server-only
CLERK_SECRET_KEY=sk_test_...

# Optional: Custom sign-in/up URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### User Object

The `user` object contains:

```typescript
{
  id: string
  firstName: string | null
  lastName: string | null
  fullName: string | null
  emailAddresses: Array<{
    emailAddress: string
    id: string
  }>
  imageUrl: string
  createdAt: number
  updatedAt: number
  // ... more fields
}
```

### Best Practices

1. **Always verify auth in Server Actions**
   ```typescript
   const user = await currentUser()
   if (!user) return { error: 'Unauthorized' }
   ```

2. **Use hooks in client components only**
   ```tsx
   'use client'
   import { useUser } from '@compass/auth'
   ```

3. **Protect sensitive routes with middleware**
   ```typescript
   export default createMiddleware(['/'])
   ```

4. **Handle loading states**
   ```tsx
   if (!isLoaded) return <div>Loading...</div>
   ```

5. **Store user_id (not email) in database**
   ```typescript
   const { data } = await supabase
     .from('posts')
     .insert({ user_id: user.id }) // ✅ Use user.id
     // .insert({ email: user.email }) // ❌ Don't use email as ID
   ```

### Security Notes

- Never expose `CLERK_SECRET_KEY` in client-side code
- Always verify authentication server-side for mutations
- Use middleware to protect entire route groups
- Check user permissions before admin operations
- Don't trust client-side authentication state for security decisions

## Webhook Setup (Optional)

To sync Clerk users with your database, set up webhooks:

```typescript
// app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json({ error: 'No webhook secret' }, { status: 500 })
  }

  const payload = await request.text()
  const headers = {
    'svix-id': request.headers.get('svix-id') || '',
    'svix-timestamp': request.headers.get('svix-timestamp') || '',
    'svix-signature': request.headers.get('svix-signature') || '',
  }

  const wh = new Webhook(webhookSecret)

  try {
    const evt = wh.verify(payload, headers)

    // Handle different events
    if (evt.type === 'user.created') {
      // Sync user to your database
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
}
```

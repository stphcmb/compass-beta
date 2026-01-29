# Shared Packages - Compass Platform

## Overview

The Compass platform uses pnpm workspaces with 6 shared packages:

```
packages/
├── ui/          # @compass/ui - Shared React components
├── database/    # @compass/database - Supabase client and types
├── auth/        # @compass/auth - Clerk utilities
├── ai/          # @compass/ai - AI/LLM utilities (Gemini)
├── utils/       # @compass/utils - Common utilities
└── config/      # @compass/config - Shared configs
```

## When to Create a Shared Package

**Create a shared package when**:
- Code is used by 2+ apps
- Code provides a clear, isolated domain (UI, database, auth)
- Code has minimal dependencies
- Code changes infrequently (stable API)

**Keep code in app when**:
- Used by only one app
- App-specific business logic
- Rapid iteration/frequent changes
- Tightly coupled to app structure

**Rule of thumb**: Start in app, extract to package when 2nd app needs it.

## Using Shared Packages

**In app's package.json**:
```json
{
  "dependencies": {
    "@compass/ui": "workspace:*",
    "@compass/database": "workspace:*",
    "@compass/auth": "workspace:*",
    "@compass/ai": "workspace:*",
    "@compass/utils": "workspace:*"
  }
}
```

**Importing**:
```typescript
import { Button } from '@compass/ui'
import { supabase } from '@compass/database'
import { getCurrentUser } from '@compass/auth'
import { analyzeText } from '@compass/ai'
import { formatDate } from '@compass/utils'
```

## Package Structure

Each package follows this structure:
```
packages/package-name/
├── package.json
├── tsconfig.json
├── src/
│   └── index.ts         # Main entry point
└── README.md            # Package documentation
```

**package.json example**:
```json
{
  "name": "@compass/package-name",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "react": "^19.2.1"
  }
}
```

## Package Guidelines

### @compass/ui

**Purpose**: Shared React components used across apps

**What goes here**:
- Reusable UI components (Button, Card, Modal)
- Layout components used by multiple apps
- Shadcn UI component wrappers

**What doesn't**:
- App-specific components
- Complex feature components
- Components with app-specific business logic

**Example**:
```tsx
// packages/ui/src/components/Button.tsx
import { ButtonHTMLAttributes } from 'react'

export function Button({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      {...props}
    >
      {children}
    </button>
  )
}
```

### @compass/database

**Purpose**: Supabase client and TypeScript types

**What goes here**:
- Supabase client initialization
- Database types
- Shared database utilities

**What doesn't**:
- App-specific queries
- Business logic
- Migrations (those live in `/apps/compass/Docs/migrations/`)

**Example**:
```typescript
// packages/database/src/index.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type { Database } from './types'
```

### @compass/auth

**Purpose**: Clerk authentication utilities

**What goes here**:
- Auth helper functions
- User session utilities
- Permission checks

**What doesn't**:
- App-specific auth logic
- Route-specific middleware

**Example**:
```typescript
// packages/auth/src/index.ts
import { currentUser } from '@clerk/nextjs/server'

export async function getCurrentUser() {
  const user = await currentUser()
  if (!user) return null

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    name: user.fullName,
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}
```

### @compass/ai

**Purpose**: AI/LLM utilities (Google Gemini)

**What goes here**:
- Gemini API client
- Prompt utilities
- AI response parsing

**What doesn't**:
- App-specific prompts
- Feature-specific AI logic

**Example**:
```typescript
// packages/ai/src/index.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateText(prompt: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const result = await model.generateContent(prompt)
  return result.response.text()
}
```

### @compass/utils

**Purpose**: Common utilities

**What goes here**:
- Date formatting
- String utilities
- Array/object helpers
- Type guards

**What doesn't**:
- App-specific business logic
- Feature-specific utilities

**Example**:
```typescript
// packages/utils/src/index.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function cn(...classes: (string | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}
```

### @compass/config

**Purpose**: Shared configurations

**What goes here**:
- TypeScript configs
- ESLint configs
- Tailwind configs
- Shared constants

**What doesn't**:
- App-specific configs

## Dependency Rules

**Allowed**:
- ✅ Apps → Packages
- ✅ Packages → Packages
- ✅ Packages → External libraries

**Not allowed**:
- ❌ Apps → Apps
- ❌ Packages → Apps
- ❌ Circular dependencies between packages

## Versioning

**Use `workspace:*` for all internal packages**:
```json
{
  "dependencies": {
    "@compass/ui": "workspace:*"
  }
}
```

This ensures packages always use the latest local version.

## Building Packages

Packages are built automatically with apps. No separate build step needed for TypeScript-only packages.

For packages with build steps:
```json
// packages/ui/package.json
{
  "scripts": {
    "build": "tsc"
  }
}
```

## Documentation

Each package should have a `README.md` with:
- Purpose and scope
- Installation (not needed for monorepo)
- Usage examples
- API reference

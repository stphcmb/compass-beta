# @compass/utils

> Common utilities and helpers for the Compass platform

## Purpose

Provides shared utility functions used across all Compass applications. Includes class name merging for Tailwind, feature flag management, and other common helpers.

## Installation

This package is internal to the Compass monorepo and is imported via workspace protocol.

```json
{
  "dependencies": {
    "@compass/utils": "workspace:*"
  }
}
```

## Usage

### Class Name Merging

Merge Tailwind classes with proper conflict resolution:

```tsx
import { cn } from '@compass/utils'

function Button({ className, variant }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'px-4 py-2 rounded-lg font-medium transition-colors',

        // Variant styles
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',

        // User overrides
        className
      )}
    >
      {children}
    </button>
  )
}

// Usage
<Button className="mt-4 w-full" variant="primary">
  Click me
</Button>
// Result: Merges all classes with proper Tailwind conflict resolution
```

### Feature Flags

Check if features are enabled:

```tsx
import { isFeatureEnabled, FEATURES } from '@compass/utils'

function MyComponent() {
  if (isFeatureEnabled('CONTENT_HELPER')) {
    return <ContentHelperFeature />
  }

  return <DefaultView />
}

// Or access directly
if (FEATURES.ICP_STUDIO) {
  // Show ICP Studio
}
```

### Content Helper Feature

Check if Content Helper (Editorial Analysis Mode) should be shown:

```tsx
import { isContentHelperEnabled } from '@compass/utils'

function Sidebar() {
  return (
    <nav>
      <Link href="/research">Research</Link>
      {isContentHelperEnabled() && (
        <Link href="/content-helper">Content Helper</Link>
      )}
    </nav>
  )
}
```

### ICP Studio Feature

Check if ICP Studio should be available:

```tsx
import { isICPStudioEnabled } from '@compass/utils'

function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      {isICPStudioEnabled() && (
        <Link href="/studio">Studio</Link>
      )}
    </nav>
  )
}
```

### Beta Access Control

Check if user has access to beta features:

```tsx
import { VOICE_LAB_BETA_EMAILS, STUDIO_BETA_EMAILS } from '@compass/utils'

function checkBetaAccess(userEmail: string) {
  const normalizedEmail = userEmail.toLowerCase()

  if (VOICE_LAB_BETA_EMAILS.includes(normalizedEmail)) {
    // User has Voice Lab access
  }

  if (STUDIO_BETA_EMAILS.includes(normalizedEmail)) {
    // User has Studio access
  }
}
```

### Development Mode Check

Check if app is running in development:

```tsx
import { isDevelopment } from '@compass/utils'

function MyComponent() {
  if (isDevelopment()) {
    // Show debug information
    return <DebugPanel />
  }

  return null
}
```

## API Reference

### Class Name Utilities

- `cn(...inputs: ClassValue[]): string`
  - Merge class names with Tailwind conflict resolution
  - Uses `clsx` for conditional classes and `tailwind-merge` for conflicts
  - **Parameters:** Variable number of class name inputs (strings, objects, arrays)
  - **Returns:** Merged class name string
  - **Example:**
    ```typescript
    cn('px-4 py-2', isActive && 'bg-blue-600', className)
    ```

### Feature Flags

- `FEATURES` - Object containing all feature flags
  - `FEATURES.CONTENT_HELPER: boolean` - Editorial Analysis Mode toggle
  - `FEATURES.ICP_STUDIO: boolean` - Integrated Content Platform toggle

- `isFeatureEnabled(feature: keyof typeof FEATURES): boolean`
  - Check if a specific feature is enabled
  - **Parameters:** Feature key from `FEATURES` object
  - **Returns:** `true` if feature is enabled, `false` otherwise

- `isDevelopment(): boolean`
  - Check if app is running in development mode
  - **Returns:** `true` if `NODE_ENV === 'development'`

- `isContentHelperEnabled(): boolean`
  - Check if Content Helper should be available
  - Returns `true` if feature flag is on OR in development mode
  - **Returns:** `boolean`

- `isICPStudioEnabled(): boolean`
  - Check if ICP Studio should be available
  - Returns `true` only if feature flag is explicitly enabled
  - **Returns:** `boolean`

### Beta Whitelists

- `STUDIO_BETA_EMAILS: string[]`
  - Array of email addresses with Studio beta access
  - Emails are normalized to lowercase
  - Can be overridden via `NEXT_PUBLIC_STUDIO_BETA_EMAILS` env var (comma-separated)

- `VOICE_LAB_BETA_EMAILS: string[]`
  - Array of email addresses with Voice Lab beta access
  - Emails are normalized to lowercase
  - Can be overridden via `NEXT_PUBLIC_VOICE_LAB_BETA_EMAILS` env var (comma-separated)

## Dependencies

- **clsx** - Conditional class name construction
- **tailwind-merge** - Merge Tailwind classes with conflict resolution

## Development

### Environment Variables

Optional feature flag configuration in `.env.local`:

```bash
# Feature Flags
NEXT_PUBLIC_FF_CONTENT_HELPER=true
NEXT_PUBLIC_FF_ICP_STUDIO=false

# Beta Access (comma-separated emails)
NEXT_PUBLIC_VOICE_LAB_BETA_EMAILS=user1@example.com,user2@example.com
NEXT_PUBLIC_STUDIO_BETA_EMAILS=user1@example.com,user3@example.com
```

### Adding New Feature Flags

1. Add environment variable to `.env.local` and `.env.example`
2. Add flag to `FEATURES` object in `feature-flags.ts`:
   ```typescript
   export const FEATURES = {
     // ... existing flags
     NEW_FEATURE: process.env.NEXT_PUBLIC_FF_NEW_FEATURE === 'true',
   } as const;
   ```

3. Optional: Add helper function for complex logic:
   ```typescript
   export function isNewFeatureEnabled(): boolean {
     return FEATURES.NEW_FEATURE || someOtherCondition();
   }
   ```

4. Use in app:
   ```tsx
   import { isFeatureEnabled } from '@compass/utils'

   if (isFeatureEnabled('NEW_FEATURE')) {
     // Show feature
   }
   ```

### Class Name Merging Examples

```typescript
import { cn } from '@compass/utils'

// Conditional classes
cn('base-class', isActive && 'active-class', 'always-class')
// Result: 'base-class active-class always-class' (if isActive is true)

// Object syntax
cn('base', {
  'text-red-500': hasError,
  'text-green-500': isSuccess,
})

// Array syntax
cn(['base', 'another'], 'third')

// Tailwind conflict resolution
cn('px-4', 'px-6') // Result: 'px-6' (last one wins)
cn('text-red-500', 'text-blue-500') // Result: 'text-blue-500'

// User overrides
function Component({ className }) {
  return (
    <div className={cn('default-styles', className)}>
      {/* className takes precedence */}
    </div>
  )
}
```

### Beta Access Patterns

```typescript
'use server'

import { currentUser } from '@clerk/nextjs/server'
import { VOICE_LAB_BETA_EMAILS } from '@compass/utils'

export async function checkVoiceLabAccess() {
  const user = await currentUser()
  if (!user) return false

  const email = user.emailAddresses[0]?.emailAddress.toLowerCase()
  return VOICE_LAB_BETA_EMAILS.includes(email)
}
```

### Feature Flag Best Practices

1. **Use environment variables** for toggles
   ```bash
   NEXT_PUBLIC_FF_FEATURE_NAME=true
   ```

2. **Prefix with NEXT_PUBLIC** for client-side access
   ```typescript
   // ✅ Accessible in browser
   NEXT_PUBLIC_FF_CONTENT_HELPER=true

   // ❌ Server-only
   FF_CONTENT_HELPER=true
   ```

3. **Use helper functions** for complex logic
   ```typescript
   export function isFeatureAvailable(): boolean {
     return FEATURES.FEATURE_NAME || isDevelopment() || userHasPermission()
   }
   ```

4. **Document flag purpose**
   ```typescript
   /**
    * Content Helper (Editorial Analysis Mode)
    * Toggle for the content analysis feature
    *
    * Environment variable: NEXT_PUBLIC_FF_CONTENT_HELPER
    */
   CONTENT_HELPER: process.env.NEXT_PUBLIC_FF_CONTENT_HELPER === 'true',
   ```

5. **Clean up flags** after rollout
   ```typescript
   // Remove flag and checks once fully rolled out
   // if (isFeatureEnabled('OLD_FEATURE')) { ... }
   ```

## Common Patterns

### Conditional Rendering with Feature Flags

```tsx
import { isFeatureEnabled } from '@compass/utils'

function App() {
  return (
    <>
      <Header />
      <MainContent />
      {isFeatureEnabled('CONTENT_HELPER') && <ContentHelper />}
      <Footer />
    </>
  )
}
```

### Beta Gating

```tsx
import { STUDIO_BETA_EMAILS } from '@compass/utils'
import { useUser } from '@compass/auth'

function StudioPage() {
  const { user } = useUser()

  if (!user) return <div>Please sign in</div>

  const userEmail = user.emailAddresses[0]?.emailAddress.toLowerCase()
  const hasAccess = STUDIO_BETA_EMAILS.includes(userEmail)

  if (!hasAccess) {
    return <div>Studio is currently in private beta</div>
  }

  return <StudioApp />
}
```

### Styling with cn()

```tsx
import { cn } from '@compass/utils'

function Card({ className, variant, children }) {
  return (
    <div
      className={cn(
        // Base styles
        'rounded-lg border p-6 shadow-sm',

        // Variant styles
        {
          'bg-white': variant === 'default',
          'bg-blue-50 border-blue-200': variant === 'info',
          'bg-red-50 border-red-200': variant === 'error',
        },

        // User overrides
        className
      )}
    >
      {children}
    </div>
  )
}
```

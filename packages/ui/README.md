# @compass/ui

> Shared React UI components for the Compass platform

## Purpose

Provides reusable UI components used across all Compass applications (Compass, Voice Lab, and Studio). Built with React 19, Radix UI primitives, and Tailwind CSS for consistent styling and behavior.

## Installation

This package is internal to the Compass monorepo and is imported via workspace protocol.

```json
{
  "dependencies": {
    "@compass/ui": "workspace:*"
  }
}
```

## Usage

### Toast Notifications

A global toast notification system with success, error, and info variants, plus optional actions.

```tsx
'use client'

import { ToastProvider, useToast } from '@compass/ui'

// 1. Wrap your app with ToastProvider
export default function RootLayout({ children }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  )
}

// 2. Use the toast hook in any component
function MyComponent() {
  const { showToast } = useToast()

  const handleSave = async () => {
    try {
      await saveData()
      showToast('Saved successfully!', 'success')
    } catch (error) {
      showToast('Failed to save', 'error')
    }
  }

  // Toast with action
  const handleDelete = async () => {
    await deleteItem()
    showToast('Item deleted', 'success', {
      label: 'Undo',
      onClick: () => restoreItem()
    })
  }

  return <button onClick={handleSave}>Save</button>
}
```

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@compass/ui'

function MyComponent() {
  return (
    <>
      {/* Default button */}
      <Button>Click me</Button>

      {/* Variants */}
      <Button variant="default">Primary</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>

      {/* Sizes */}
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Icon />
      </Button>

      {/* Disabled state */}
      <Button disabled>Disabled</Button>
    </>
  )
}
```

### Input

A styled text input component.

```tsx
import { Input } from '@compass/ui'

function MyForm() {
  return (
    <form>
      <Input
        type="text"
        placeholder="Enter your name"
        required
      />
      <Input
        type="email"
        placeholder="Email address"
        disabled
      />
    </form>
  )
}
```

### PageHeader

A consistent page header component with title and optional description.

```tsx
import { PageHeader } from '@compass/ui'

function MyPage() {
  return (
    <>
      <PageHeader
        title="Research Assistant"
        description="Analyze content with AI-powered insights"
      />
      {/* Page content */}
    </>
  )
}
```

### Accordion

Expandable/collapsible content sections using Radix UI.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@compass/ui'

function MyComponent() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>
          Content for section 1
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>
          Content for section 2
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## API Reference

### Toast

- `ToastProvider` - Context provider for toast notifications (wrap your app)
- `useToast()` - Hook to show toast notifications
  - `showToast(message: string, type?: 'success' | 'error' | 'info', action?: { label: string, onClick: () => void })` - Show a toast notification

### Button

- `Button` - Button component with variants and sizes
- `buttonVariants` - CVA variants function for custom styling
- `ButtonProps` - TypeScript props interface

**Props:**
- `variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'`
- `size?: 'default' | 'sm' | 'lg' | 'icon'`
- All standard button HTML attributes

### Input

- `Input` - Styled text input component
- `InputProps` - TypeScript props interface

**Props:** All standard input HTML attributes

### PageHeader

- `PageHeader` - Page header with title and description

**Props:**
- `title: string` - Page title
- `description?: string` - Optional description

### Accordion

- `Accordion` - Container for accordion items
- `AccordionItem` - Individual accordion item
- `AccordionTrigger` - Clickable header for accordion item
- `AccordionContent` - Collapsible content

## Dependencies

- **React 19** - Core UI library
- **Radix UI** - Headless UI primitives (Accordion)
- **class-variance-authority** - Variant styling for Button
- **lucide-react** - Icon library (used in Toast)
- **@compass/utils** - Utility functions (cn for class merging)

## Development

### Adding New Components

1. Create component file in `src/` (e.g., `src/card.tsx`)
2. Export from `src/index.ts`
3. Add subpath export to `package.json` if needed
4. Use Tailwind classes for styling
5. Import `cn` from `@compass/utils` for conditional classes

### Styling Conventions

- Use Tailwind utility classes
- Use CSS variables for colors (defined in apps)
- Follow mobile-first responsive design
- Group utilities: layout → spacing → typography → colors

```tsx
// Example component structure
import { cn } from '@compass/utils'

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn(
      'rounded-lg border bg-card p-6',
      'shadow-sm hover:shadow-md transition-shadow',
      className
    )}>
      {children}
    </div>
  )
}
```

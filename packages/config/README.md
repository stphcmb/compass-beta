# @compass/config

> Shared configuration files for the Compass platform

## Purpose

Provides centralized configuration files used across all Compass applications, including Tailwind CSS presets, TypeScript configs, and design tokens. Ensures consistency in styling, build settings, and development experience.

## Installation

This package is internal to the Compass monorepo and is imported via workspace protocol.

```json
{
  "dependencies": {
    "@compass/config": "workspace:*"
  }
}
```

## Usage

### Tailwind CSS Configuration

Extend your app's Tailwind config with the shared preset:

```javascript
// apps/compass/tailwind.config.ts
import type { Config } from 'tailwindcss'
import { tailwindPreset } from '@compass/config'

const config: Config = {
  presets: [tailwindPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}', // Include UI package
  ],
  // App-specific overrides
  theme: {
    extend: {
      // Add app-specific customizations
    },
  },
}

export default config
```

### TypeScript Configuration

Extend your app's TypeScript config:

```json
// apps/compass/tsconfig.json
{
  "extends": "@compass/config/tsconfig",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/*"]
    }
  },
  "include": ["app", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
```

### CSS Design Tokens

Import design tokens in your global CSS:

```css
/* apps/compass/app/globals.css */
@import '@compass/config/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

/* App-specific styles */
```

## What's Included

### Tailwind Preset

The `tailwindPreset` includes:

- **Dark mode** - Class-based dark mode support
- **Container** - Centered container with responsive padding
- **Colors** - Extended color palette with CSS variables:
  - `border`, `input`, `ring`
  - `background`, `foreground`
  - `primary`, `secondary`, `destructive`, `muted`, `accent`
  - `popover`, `card`
- **Border radius** - Responsive border radius tokens
- **Animations** - Accordion animations (used by Radix UI)
- **Plugins** - `tailwindcss-animate` for additional animations

### Design System Colors

Colors use CSS variables for theme customization:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  /* ... more colors */
}
```

### Animations

Pre-configured animations for common UI patterns:

```typescript
// Accordion animations
keyframes: {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
}

animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
}
```

## API Reference

### Tailwind Preset

- `tailwindPreset: Partial<Config>`
  - Shared Tailwind configuration preset
  - Includes dark mode, colors, animations, and plugins
  - Use with `presets: [tailwindPreset]` in your Tailwind config

**Exported features:**
- Dark mode: `class` strategy
- Container: Centered with responsive padding
- Extended colors: Using CSS variables
- Border radius: `lg`, `md`, `sm` tokens
- Animations: Accordion animations
- Plugins: `tailwindcss-animate`

### TypeScript Config

- `@compass/config/tsconfig` - Base TypeScript configuration
  - Shared compiler options
  - Next.js-optimized settings
  - Strict type checking

### CSS Tokens

- `@compass/config/tokens.css` - Design token CSS variables
  - Color palette
  - Spacing scale
  - Typography tokens
  - Animation timings

## Dependencies

- **tailwindcss** - Core Tailwind CSS library
- **tailwindcss-animate** - Animation utilities plugin

## Development

### Customizing Theme Colors

Override colors in your app's Tailwind config:

```javascript
import { tailwindPreset } from '@compass/config'

const config = {
  presets: [tailwindPreset],
  theme: {
    extend: {
      colors: {
        // Add custom colors
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... more shades
        },

        // Override preset colors
        primary: {
          DEFAULT: 'hsl(var(--brand-primary))',
          foreground: 'hsl(var(--brand-primary-foreground))',
        },
      },
    },
  },
}
```

### Adding Custom Animations

```javascript
import { tailwindPreset } from '@compass/config'

const config = {
  presets: [tailwindPreset],
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
}
```

### Extending TypeScript Config

```json
{
  "extends": "@compass/config/tsconfig",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/*"],
      "@/components/*": ["./components/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  }
}
```

## CSS Variables Reference

### Color Variables

Use in your components with `hsl(var(--variable))`:

```tsx
function MyComponent() {
  return (
    <div className="bg-background text-foreground">
      <h1 className="text-primary">Title</h1>
      <p className="text-muted-foreground">Description</p>
      <button className="bg-accent text-accent-foreground">
        Click me
      </button>
    </div>
  )
}
```

### Available Color Variables

```
--background          Background color
--foreground          Text color

--primary             Primary brand color
--primary-foreground  Text on primary

--secondary           Secondary color
--secondary-foreground Text on secondary

--destructive         Error/danger color
--destructive-foreground Text on destructive

--muted               Subtle background
--muted-foreground    Subtle text

--accent              Accent color
--accent-foreground   Text on accent

--card                Card background
--card-foreground     Text on card

--popover             Popover background
--popover-foreground  Text on popover

--border              Border color
--input               Input border
--ring                Focus ring color
```

### Radius Variables

```
--radius              Base border radius (0.5rem)
```

Usage:
```tsx
<div className="rounded-lg"> {/* Uses var(--radius) */}
<div className="rounded-md"> {/* calc(var(--radius) - 2px) */}
<div className="rounded-sm"> {/* calc(var(--radius) - 4px) */}
```

## Best Practices

### 1. Use Preset, Don't Duplicate

```javascript
// ✅ Good: Extend preset
import { tailwindPreset } from '@compass/config'

export default {
  presets: [tailwindPreset],
  // App-specific config
}

// ❌ Bad: Duplicate config
export default {
  darkMode: 'class',
  theme: {
    extend: {
      // Duplicating preset config
    },
  },
}
```

### 2. App-Specific Customizations

Keep app-specific styles in the app, not in shared config:

```javascript
// ✅ Good: App-specific in app config
const config = {
  presets: [tailwindPreset],
  theme: {
    extend: {
      colors: {
        'compass-blue': '#0066cc', // Compass app only
      },
    },
  },
}

// ❌ Bad: App-specific in shared config
// Don't add app-specific colors to @compass/config
```

### 3. Use CSS Variables

```tsx
// ✅ Good: Use variables (themeable)
<div className="bg-background text-foreground">

// ❌ Bad: Hardcoded colors (not themeable)
<div className="bg-white text-black">
```

### 4. Consistent Spacing

```tsx
// ✅ Good: Use Tailwind scale
<div className="p-4 gap-6 space-y-8">

// ❌ Bad: Custom values
<div className="p-[17px] gap-[23px]">
```

### 5. Mobile-First Responsive

```tsx
// ✅ Good: Mobile-first
<div className="w-full sm:w-1/2 lg:w-1/3">

// ❌ Bad: Desktop-first
<div className="w-1/3 lg:w-1/2 sm:w-full">
```

## Troubleshooting

### Colors Not Working

If CSS variables aren't applied:

1. Check that you're importing tokens:
   ```css
   @import '@compass/config/tokens.css';
   ```

2. Verify Tailwind content paths include UI package:
   ```javascript
   content: [
     './app/**/*.{ts,tsx}',
     '../../packages/ui/src/**/*.{ts,tsx}', // ← Include this
   ]
   ```

### TypeScript Errors

If extending config causes errors:

```json
{
  "extends": "@compass/config/tsconfig",
  // Make sure these paths exist
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Animations Not Working

Ensure `tailwindcss-animate` is installed:

```bash
pnpm add -D tailwindcss-animate
```

## Updating the Preset

When adding new shared styles:

1. Update `src/tailwind.config.ts`
2. Test in at least one app
3. Document changes in this README
4. Consider backward compatibility
5. Communicate changes to team

Example:
```typescript
// packages/config/src/tailwind.config.ts
export const tailwindPreset = {
  // ... existing config
  theme: {
    extend: {
      // Add new shared utilities
      spacing: {
        '18': '4.5rem', // New spacing token
      },
    },
  },
} satisfies Partial<Config>
```

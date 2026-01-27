# Compass Design System v1.0

**Hybrid Swiss Editorial × Japanese Minimalism**

**Last Updated**: 2024-12-02
**Purpose**: Unified design language for Compass AI Thought Leadership platform

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Typography System](#2-typography-system)
3. [Color Language](#3-color-language)
4. [Spacing & Grid](#4-spacing--grid)
5. [Component Library](#5-component-library)
6. [Interaction Design](#6-interaction-design)
7. [Accessibility Standards](#7-accessibility-standards)
8. [Performance Requirements](#8-performance-requirements)
9. [Design Tokens](#9-design-tokens)
10. [Anti-Patterns](#10-anti-patterns)
11. [Implementation Guide](#11-implementation-guide)

---

## 1. Design Philosophy

### 1.1 Brand Principles

Compass is a knowledge-navigation product built for **clarity, depth, and intellectual calm**. The design reflects:
- The **precision of Swiss typography**
- The **serenity of Japanese minimalism**
- The **editorial authority** of a magazine
- The **functional clarity** of a research tool

**Non-negotiable truths**:

**Clarity Over Cleverness**
Every page should be instantly readable. Typography is the primary design element.

**Calm UI, Strong POV**
The interface is calm and neutral. The editorial content (insights, labels, narratives) provides the personality.

**Hierarchy is a Teaching Tool**
Compass guides thinking through strong headers, gentle descriptions, and intuitive grouping.

**Intentional Emptiness**
Whitespace is treated as a design element. Emptiness = breathing room.

**Precision at Every Pixel**
Swiss discipline: 8-pt grid. Everything aligns to exact spacing multiples.

### 1.2 Visual Identity

**Swiss Editorial**:
- Sharp rectangles, minimal curves
- Strong typography hierarchy
- Grid-based precision
- Functional clarity

**Japanese Minimalism**:
- Abundant whitespace
- Neutral color palette
- Subtle interactions
- Intentional restraint

**Editorial Authority**:
- Micro-narratives guide navigation
- Data-first, opinion after
- Confident, intelligent tone
- Magazine-quality presentation

---

## 2. Typography System

### 2.1 Font Stack

**Primary Sans (Swiss Precision)**:
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

**Alternative**: Neue Haas Grotesk, Suisse Intl (if licensing allows)

**Secondary Serif (Japanese Calm)** - Optional:
```css
font-family: 'Noto Serif', 'Source Serif Pro', Georgia, serif;
```

**When to use serif**:
- Long-form quotes (60+ words)
- Editorial insights
- "Why it matters" sections
- Highlighted passages

### 2.2 Type Scale

**Desktop Scale** (primary):

| Role | Size | Weight | Line Height | Tracking | Use |
|------|------|--------|-------------|----------|-----|
| **H1** | 40px (2.5rem) | 600-700 | 1.1-1.2 | +1 | Page titles, Domain headers |
| **H2** | 28px (1.75rem) | 600 | 1.2 | +1 | Section headers |
| **H3** | 20px (1.25rem) | 500-600 | 1.3 | 0 | Card titles, Author names |
| **H4** | 18px (1.125rem) | 500 | 1.3 | 0 | Subsection headers |
| **Body** | 16px (1rem) | 400-500 | 1.5-1.6 | 0 | Main text, descriptions |
| **Body Small** | 15px (0.938rem) | 400 | 1.5 | 0 | Secondary text |
| **Caption** | 14px (0.875rem) | 400 | 1.4 | 0 | Metadata, counts |
| **Tiny** | 13px (0.813rem) | 400-500 | 1.4 | 0 | Badges, labels |

**Mobile Scale** (320px-768px):

| Role | Size | Adjustment |
|------|------|------------|
| **H1** | 32px | -8px from desktop |
| **H2** | 24px | -4px from desktop |
| **H3** | 18px | -2px from desktop |
| **Body** | 15px | -1px from desktop |

### 2.3 Typography Rules

**Modular Scale**: 1.25 ratio (Minor Third)

**Tracking (Letter Spacing)**:
- Headings: +1 to +3 for Zen calmness
- Body: 0 (natural)
- All caps: +2 to +4

**Line Height**:
- Tight headings: 1.1-1.2
- Body text: 1.5-1.6 (optimal readability)
- UI elements: 1.4

**Weight Hierarchy**:
- Regular: 400 (body text)
- Medium: 500 (emphasis, UI)
- Semibold: 600 (headings, strong emphasis)
- Bold: 700 (H1 only)

**Font Pairing Rules**:
- Never mix fonts within a single card or component
- Use serif only for quotes or editorial content
- Maintain consistent weight within paragraphs

---

## 3. Color Language

### 3.1 Neutrals (Main Palette)

Neutrals carry **90% of the UI**.

```css
/* Backgrounds */
--color-bone: #F9F7F2;           /* Primary background */
--color-cloud: #F2F0EB;          /* Alternative background, cards */

/* Text */
--color-soft-black: #111111;     /* Titles, H1 */
--color-charcoal: #222222;       /* Main text, body */
--color-gray: #666666;           /* Secondary text */

/* UI Elements */
--color-ash: #CCCCCC;            /* Dividers, borders */
--color-white: #FFFFFF;          /* Contrast backgrounds */
```

**Usage Guidelines**:
- Page background: Bone (#F9F7F2)
- Card backgrounds: Cloud (#F2F0EB)
- Primary text: Charcoal (#222222)
- Headings: Soft Black (#111111)
- Dividers: Ash (#CCCCCC)

### 3.2 Accent Color (Swiss Precision)

**Primary Accent** - International Blue:
```css
--color-accent-primary: #0033FF;      /* Main accent */
--color-accent-dark: #0028CC;         /* Hover states */
--color-accent-light: #3D5FFF;        /* Subtle backgrounds */
--color-accent-pale: #E6EBFF;         /* Very subtle highlights */
```

**Alternative Options** (choose one):
- Deep Red: `#CC2233` (urgency, intellectual sharpness)
- Forest Green: `#0B7A47` (grounded, calm, nature-inspired)

**Accent Usage** (apply sparingly):
- Primary buttons
- Active navigation item
- Interactive hovers
- New content badges
- Focus states
- Links

### 3.3 Domain Colors (Editorial Hierarchy)

Subtle colors for domain categorization:

```css
--domain-technical: #8B7AA8;      /* AI Technical Capabilities */
--domain-society: #C97B8E;        /* AI & Society */
--domain-governance: #D9A05B;     /* AI Governance */
--domain-enterprise: #6B9B7B;     /* Enterprise AI Adoption */
--domain-work: #7894B3;           /* Future of Work */
```

**Usage**: Very subtle (10-15% opacity on backgrounds, full opacity on icons)

### 3.4 Status Colors

```css
--color-success: #0B7A47;         /* Success states */
--color-warning: #D9A05B;         /* Warning states */
--color-error: #CC2233;           /* Error states */
--color-info: #0033FF;            /* Info states */
```

### 3.5 Color Contrast Requirements

**WCAG 2.1 AA Compliance**:

| Combination | Ratio | Pass |
|-------------|-------|------|
| Soft Black on Bone | 17.2:1 | ✅ AAA |
| Charcoal on Bone | 15.8:1 | ✅ AAA |
| Accent Blue on Bone | 8.2:1 | ✅ AAA |
| Gray on Bone | 6.1:1 | ✅ AA |
| Ash on Bone | 2.3:1 | ⚠️ UI only |

---

## 4. Spacing & Grid

### 4.1 Grid System

**12-Column Grid**:
```css
--grid-columns: 12;
--grid-gutter: 24px;
--grid-margin: 48px;           /* Mobile: 24px */
--grid-margin-lg: 80px;        /* Desktop */
```

**Content Width**:
```css
--content-width-narrow: 640px;   /* Long-form reading */
--content-width-medium: 800px;   /* Standard content */
--content-width-wide: 1100px;    /* Maximum width */
```

**Responsive Breakpoints**:
```css
--breakpoint-mobile: 320px;      /* Base mobile */
--breakpoint-mobile-lg: 480px;   /* Large phones */
--breakpoint-tablet: 768px;      /* Tablets */
--breakpoint-desktop: 1024px;    /* Desktop */
--breakpoint-desktop-lg: 1280px; /* Large desktop */
--breakpoint-desktop-xl: 1536px; /* Extra large */
```

### 4.2 Spacing Scale (8pt Grid)

**Strict 8px base unit** for all spacing:

```css
--space-xs: 4px;       /* 0.25rem - Tiny gaps */
--space-sm: 8px;       /* 0.5rem  - Compact spacing */
--space-md: 16px;      /* 1rem    - Standard spacing */
--space-lg: 24px;      /* 1.5rem  - Related elements */
--space-xl: 32px;      /* 2rem    - Section spacing */
--space-2xl: 48px;     /* 3rem    - Major sections */
--space-3xl: 64px;     /* 4rem    - Page sections */
--space-4xl: 80px;     /* 5rem    - Hero sections */
```

### 4.3 Component Spacing Standards

**Card Padding**:
- Desktop: 24px (space-lg)
- Mobile: 20px (custom)

**Section Spacing**:
- Between sections: 48px (space-2xl) mobile, 80px (space-4xl) desktop
- Within sections: 24px (space-lg)

**Whitespace Rules**:
- More whitespace **above** headings than below
- Cards grouped with narrower spacing than sections
- Never fill entire screen unless data-heavy
- Empty states embrace emptiness

### 4.4 Alignment

**Text Alignment**:
- Headings: Left-aligned
- Body text: Left-aligned, max 75 characters per line
- Captions: Left-aligned or right-aligned for metadata

**Component Alignment**:
- Cards: Left-aligned in grid
- Buttons: Left-aligned in forms, right-aligned in dialogs
- Icons: Vertically centered with text

---

## 5. Component Library

### 5.1 Top Navigation

**Structure**:
```
┌─────────────────────────────────────────────┐
│ Logo    Discover  Domains  Authors  Search │
└─────────────────────────────────────────────┘
```

**Specifications**:
```css
height: 64px;
padding: 16px 48px; /* Mobile: 16px 24px */
border-bottom: 1px solid var(--color-ash);
background: var(--color-bone);
```

**Navigation Items**:
- Discover
- Domains
- White Space
- Authors
- Library (future)
- Search (icon, expands on click)

**States**:
- Default: Charcoal text
- Hover: Accent color underline (2px, 4px below text)
- Active: Accent color, no underline

### 5.2 Search Bar

**Default State**:
```html
<div class="search-bar">
  <icon>search</icon>
  <input placeholder="Search thought leaders, topics..." />
</div>
```

**Focus State**:
- Expands width (300px → 500px, 200ms ease)
- Accent color border (2px)
- Subtle overlay behind (rgba(0,0,0,0.05))
- Shows suggestions below

**Results Panel**:
- Two-column layout (desktop)
- Left: Recent searches
- Right: Recommendations, expanded queries
- Single column on mobile

**Specifications**:
```css
height: 44px;
padding: 12px 16px;
border-radius: 4px; /* Swiss sharp */
border: 1px solid var(--color-ash);
background: var(--color-white);
```

### 5.3 Cards (Editorial-style)

**Structure**:
```
┌─────────────────────────────────┐
│ [H3] Card Title                 │
│ Caption (metadata)              │
│ ─────────────────────────────   │ ← Thin divider
│ Short description (2-3 lines)   │
│ that provides context...        │
│                          [→]    │ ← Arrow on hover
└─────────────────────────────────┘
```

**Specifications**:
```css
padding: 24px;
border-radius: 4px; /* Sharp, Swiss */
background: var(--color-cloud);
border: 1px solid transparent;
transition: all 160ms ease;

/* Hover */
border-color: var(--color-ash);
box-shadow: 0px 2px 4px rgba(0,0,0,0.05);
transform: translateY(-1px);
```

**Visual Style**:
- Sharp rectangle edges (Swiss)
- Soft-neutral background (Japanese)
- No hard shadows (1-2px diffuse only)
- Right-arrow (→) appears on hover

### 5.4 Author Card

**Structure**:
```
┌─────────────────────────────────────────┐
│ ●────  [Author Name]                    │
│ Photo   [Affiliation]                   │
│ 48px    [Tier Badge] [Camp Badge]       │
│ ────────────────────────────────────    │
│ "Key quote excerpt that captures        │
│ their position on this topic..."        │
│                                          │
│ Why it matters: Brief context...        │
└─────────────────────────────────────────┘
```

**Specifications**:
```css
/* Container */
padding: 20px; /* Mobile: 16px */
border-radius: 4px;
background: var(--color-cloud);
display: grid;
grid-template-columns: 48px 1fr; /* Photo + content */
gap: 16px;

/* Photo */
width: 48px;
height: 48px;
border-radius: 50%;

/* Desktop: larger photo */
@media (min-width: 1024px) {
  grid-template-columns: 64px 1fr;

  img {
    width: 64px;
    height: 64px;
  }
}
```

**Touch Targets**: Entire card is clickable, minimum 64px height

### 5.5 Accordion (Domain/Camp)

**Structure**:
```
▼ AI Technical Capabilities        [Domain Header]
  ├─ Scaling Will Deliver          [Camp Option]
  ├─ Needs New Approaches          [Camp Option]

▶ AI & Society                     [Collapsed Domain]
```

**Specifications**:
```css
/* Domain Header */
padding: 16px 24px;
font-size: 20px; /* H3 */
font-weight: 600;
border-bottom: 1px solid var(--color-ash);
cursor: pointer;
transition: background 160ms;

/* Hover */
background: rgba(0, 51, 255, 0.03); /* Subtle accent tint */

/* Expanded State */
[aria-expanded="true"] {
  background: rgba(0, 51, 255, 0.05);
}

/* Camp Option */
padding: 12px 24px 12px 48px; /* Indent */
font-size: 16px;
cursor: pointer;
transition: all 160ms;
```

**Animation**:
- Expand/collapse: 180-240ms ease
- Height transition with overflow hidden
- Chevron rotation: 160ms ease

### 5.6 Buttons

**Primary Button**:
```css
background: var(--color-accent-primary);
color: var(--color-white);
padding: 12px 24px;
border-radius: 4px;
border: none;
font-size: 16px;
font-weight: 500;
cursor: pointer;
transition: all 120ms ease;

/* Hover */
background: var(--color-accent-dark);
transform: translateY(-1px);

/* Active */
transform: translateY(0);
```

**Secondary Button**:
```css
background: transparent;
color: var(--color-charcoal);
border: 1px solid var(--color-ash);
padding: 12px 24px;
border-radius: 4px;

/* Hover */
border-color: var(--color-charcoal);
```

**Tertiary Button** (Text Link):
```css
background: none;
color: var(--color-accent-primary);
text-decoration: none;
padding: 0;
border: none;

/* Hover */
text-decoration: underline;
text-underline-offset: 4px;
```

**Button Sizes**:
```css
/* Large */
padding: 14px 28px;
font-size: 18px;

/* Medium (default) */
padding: 12px 24px;
font-size: 16px;

/* Small */
padding: 8px 16px;
font-size: 14px;
```

### 5.7 Section Headers

**Structure**:
```
[H2] Section Title
[Caption] "7 new sources this week"
[Body Small] One-sentence micro-narrative providing context
```

**Example**:
```html
<section>
  <h2>Emerging Perspectives</h2>
  <p class="caption">7 new sources this week</p>
  <p class="micro-narrative">
    Recent voices challenging consensus on AI scaling
  </p>
</section>
```

**This is where editorial personality shines.**

### 5.8 Breadcrumbs

**Pattern**:
```
Home / AI & Society / Safety First / Stuart Russell
```

**Specifications**:
```css
font-size: 14px;
color: var(--color-gray);
display: flex;
gap: 8px;
align-items: center;

a {
  color: var(--color-gray);
  text-decoration: none;
  transition: color 120ms;
}

a:hover {
  color: var(--color-accent-primary);
}

/* Separator */
.separator {
  color: var(--color-ash);
  user-select: none;
}
```

### 5.9 Badges

**Credibility Tier Badges**:
```css
/* Major Voice */
background: rgba(0, 51, 255, 0.1);
color: var(--color-accent-primary);
padding: 4px 8px;
border-radius: 2px;
font-size: 13px;
font-weight: 500;
```

**Camp Relevance Badges**:
- **Strong**: Full accent color
- **Partial**: Accent at 60% opacity
- **Challenges**: Warning color
- **Emerging**: Info color

### 5.10 Icons

**Icon System**: Use **Phosphor Icons** or **Feather Icons**

**Specifications**:
```css
stroke-width: 1.5px;
size: 20px; /* Standard, can be 16px or 24px */
color: currentColor; /* Inherits text color */
```

**Rules**:
- No filled icons (line icons only)
- Always paired with text except for universal symbols (search, close)
- Vertically centered with adjacent text

---

## 6. Interaction Design

### 6.1 Motion Principles

**Duration Standards**:
```css
--duration-instant: 80ms;      /* Button press */
--duration-fast: 120ms;        /* Hover effects */
--duration-base: 160ms;        /* Standard transitions */
--duration-slow: 240ms;        /* Accordion expand */
--duration-page: 200ms;        /* Page transitions */
```

**Easing**:
```css
--ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
--ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
--ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
```

**Minimalism means subtlety** - avoid dramatic animations.

### 6.2 Interaction Patterns

**Hover Effects**:
- Color shift (120ms)
- Subtle lift (1-2px translateY)
- Border color change
- Underline appearance

**Click/Tap**:
- Button: 1-2px "press" down (80ms)
- Card: Immediate navigation
- Accordion: Smooth expand (180-240ms)

**Focus States**:
```css
:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
```

**Loading States**:
- Skeleton screens (preferred over spinners)
- Subtle pulse animation (1.2s ease-in-out infinite)
- Progress indicators for long operations

### 6.3 Scroll Behavior

```css
html {
  scroll-behavior: smooth;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6.4 Page Transitions

**Enter Animation**:
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-enter {
  animation: fadeIn 200ms ease;
}
```

---

## 7. Accessibility Standards

### 7.1 WCAG 2.1 AA Requirements

**Contrast Ratios**:
- Normal text (< 18px): **4.5:1 minimum**
- Large text (≥ 18px): **3:1 minimum**
- UI components: **3:1 minimum**

**Current Compliance**:
| Text | Background | Ratio | Pass |
|------|------------|-------|------|
| Soft Black | Bone | 17.2:1 | ✅ AAA |
| Charcoal | Bone | 15.8:1 | ✅ AAA |
| Accent | Bone | 8.2:1 | ✅ AAA |
| Gray | Bone | 6.1:1 | ✅ AA |

### 7.2 Semantic HTML

**Required Structure**:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Page Title - Compass</title>
  </head>
  <body>
    <a href="#main" class="skip-link">Skip to main content</a>

    <header role="banner">
      <nav aria-label="Main navigation">
        <!-- Navigation -->
      </nav>
    </header>

    <main id="main" role="main">
      <h1>Page Heading</h1>
      <!-- Content -->
    </main>

    <footer role="contentinfo">
      <!-- Footer -->
    </footer>
  </body>
</html>
```

### 7.3 Keyboard Navigation

**Tab Order**:
1. Skip to main content link
2. Logo / Home link
3. Primary navigation
4. Search bar
5. Main content (headings, links, interactive elements)
6. Footer links

**Required Keyboard Support**:
- `Tab` / `Shift+Tab`: Navigate between interactive elements
- `Enter` / `Space`: Activate buttons, links, accordions
- `Escape`: Close modals, clear search
- `Arrow keys`: Navigate within components (accordions, menus)
- `/`: Focus search bar (global shortcut)

### 7.4 Screen Reader Support

**ARIA Labels Required**:
```html
<!-- Search -->
<input
  type="search"
  aria-label="Search for thought leaders, topics, or positions"
  placeholder="Search..."
/>

<!-- Navigation -->
<nav aria-label="Main navigation">
  <a href="/discover" aria-current="page">Discover</a>
</nav>

<!-- Accordion -->
<button
  aria-expanded="false"
  aria-controls="domain-technical"
>
  AI Technical Capabilities
</button>
<div id="domain-technical" role="region">
  <!-- Content -->
</div>

<!-- Status Updates -->
<div role="status" aria-live="polite" aria-atomic="true">
  Found 15 results for "AI safety"
</div>
```

### 7.5 Touch Targets

**Minimum Sizes**:
```css
.touch-target {
  min-width: 44px;   /* WCAG 2.5.5 Level AAA */
  min-height: 44px;
  /* Compass uses 44px minimum (36px WCAG AA) */
}
```

**Spacing Between Targets**:
- Minimum 8px between interactive elements
- Prefer 12-16px for comfort

### 7.6 Form Accessibility

**Labels & Instructions**:
```html
<label for="search-input">
  Search for thought leaders
  <span class="required">*</span>
</label>
<input
  id="search-input"
  type="search"
  required
  aria-describedby="search-hint"
/>
<p id="search-hint" class="hint">
  Try searching for topics like "AI safety" or author names
</p>
```

**Error Handling**:
```html
<input
  aria-invalid="true"
  aria-describedby="error-message"
/>
<p id="error-message" role="alert">
  Please enter at least 3 characters
</p>
```

---

## 8. Performance Requirements

### 8.1 Core Web Vitals

**Targets**:
```
LCP (Largest Contentful Paint):  < 2.5s
FID (First Input Delay):          < 100ms
CLS (Cumulative Layout Shift):    < 0.1
```

**Monitoring**:
```typescript
import { getCLS, getFID, getLCP } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getLCP(console.log)
```

### 8.2 Performance Budgets

```
JavaScript bundle:     < 200KB (gzipped)
CSS bundle:            < 50KB (gzipped)
Fonts:                 < 100KB total
Images per page:       < 500KB total
Time to Interactive:   < 5s (3G)
```

### 8.3 Image Optimization

**Next.js Image Component** (required):
```tsx
import Image from 'next/image'

<Image
  src="/authors/sam-altman.jpg"
  alt="Sam Altman, CEO of OpenAI"
  width={64}
  height={64}
  loading="lazy"
  placeholder="blur"
/>
```

**Formats**:
- Primary: WebP
- Fallback: JPEG (quality 80)
- Icons: SVG

**Lazy Loading**:
- Below-the-fold images: `loading="lazy"`
- Above-the-fold: `loading="eager"` or `priority`

### 8.4 Code Splitting

```typescript
// Route-based (automatic with Next.js)
// pages/results.tsx → separate bundle

// Component-based
const WhiteSpacePanel = dynamic(
  () => import('./WhiteSpacePanel'),
  {
    loading: () => <Skeleton />,
    ssr: false
  }
)
```

---

## 9. Design Tokens

### 9.1 Complete Token Set

**For Development, Claude, Cursor**:

```css
:root {
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-serif: 'Noto Serif', 'Source Serif Pro', Georgia, serif;

  /* Type Scale */
  --text-h1: 2.5rem;      /* 40px */
  --text-h2: 1.75rem;     /* 28px */
  --text-h3: 1.25rem;     /* 20px */
  --text-h4: 1.125rem;    /* 18px */
  --text-body: 1rem;      /* 16px */
  --text-small: 0.938rem; /* 15px */
  --text-caption: 0.875rem; /* 14px */
  --text-tiny: 0.813rem;  /* 13px */

  /* Line Heights */
  --leading-tight: 1.2;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;

  /* Font Weights */
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  /* Colors - Neutrals */
  --color-bone: #F9F7F2;
  --color-cloud: #F2F0EB;
  --color-white: #FFFFFF;
  --color-soft-black: #111111;
  --color-charcoal: #222222;
  --color-gray: #666666;
  --color-ash: #CCCCCC;

  /* Colors - Accent */
  --color-accent: #0033FF;
  --color-accent-dark: #0028CC;
  --color-accent-light: #3D5FFF;
  --color-accent-pale: #E6EBFF;

  /* Colors - Domain */
  --domain-technical: #8B7AA8;
  --domain-society: #C97B8E;
  --domain-governance: #D9A05B;
  --domain-enterprise: #6B9B7B;
  --domain-work: #7894B3;

  /* Colors - Status */
  --color-success: #0B7A47;
  --color-warning: #D9A05B;
  --color-error: #CC2233;
  --color-info: #0033FF;

  /* Spacing (8pt grid) */
  --space-xs: 0.25rem;    /* 4px */
  --space-sm: 0.5rem;     /* 8px */
  --space-md: 1rem;       /* 16px */
  --space-lg: 1.5rem;     /* 24px */
  --space-xl: 2rem;       /* 32px */
  --space-2xl: 3rem;      /* 48px */
  --space-3xl: 4rem;      /* 64px */
  --space-4xl: 5rem;      /* 80px */

  /* Border Radius */
  --radius-sm: 2px;       /* Badges */
  --radius-md: 4px;       /* Cards, buttons (Swiss sharp) */
  --radius-lg: 8px;       /* Panels */
  --radius-full: 9999px;  /* Circular */

  /* Shadows */
  --shadow-sm: 0px 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0px 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0px 4px 8px rgba(0, 0, 0, 0.08);

  /* Transitions */
  --duration-instant: 80ms;
  --duration-fast: 120ms;
  --duration-base: 160ms;
  --duration-slow: 240ms;

  /* Grid */
  --grid-columns: 12;
  --grid-gutter: 24px;
  --grid-margin: 48px;
  --grid-margin-mobile: 24px;

  /* Breakpoints (for JS) */
  --breakpoint-mobile: 320px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-desktop-lg: 1280px;
}
```

### 9.2 Tailwind Configuration

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        bone: '#F9F7F2',
        cloud: '#F2F0EB',
        'soft-black': '#111111',
        charcoal: '#222222',
        gray: '#666666',
        ash: '#CCCCCC',
        accent: {
          DEFAULT: '#0033FF',
          dark: '#0028CC',
          light: '#3D5FFF',
          pale: '#E6EBFF',
        },
        domain: {
          technical: '#8B7AA8',
          society: '#C97B8E',
          governance: '#D9A05B',
          enterprise: '#6B9B7B',
          work: '#7894B3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif', 'Source Serif Pro', 'serif'],
      },
      fontSize: {
        h1: ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        h2: ['1.75rem', { lineHeight: '1.2', fontWeight: '600' }],
        h3: ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        h4: ['1.125rem', { lineHeight: '1.3', fontWeight: '500' }],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '5rem',
      },
    },
  },
}
```

---

## 10. Anti-Patterns

### 10.1 Do NOT Use

❌ **Visual Anti-Patterns**:
- Strong gradients
- Heavy drop shadows
- Rounded "pill" shapes everywhere
- Overly colored backgrounds
- Multiple accent colors
- Dense skeuomorphic elements

❌ **Interaction Anti-Patterns**:
- Hyper-motion animations
- Confetti or celebration animations
- Auto-playing videos
- Aggressive popups
- Scroll-jacking

❌ **Typography Anti-Patterns**:
- Mixing multiple font families in one view
- ALL CAPS for body text
- Center-aligned paragraphs
- Low contrast text (< 4.5:1)
- Line lengths > 75 characters

❌ **Layout Anti-Patterns**:
- Breaking the 8px grid
- Inconsistent spacing
- Cramped UI (insufficient whitespace)
- Cluttered information density

❌ **Content Anti-Patterns**:
- Emoji as primary visuals
- Hype language or marketing speak
- Vague "Learn More" CTAs
- Missing context for data

---

## 11. Implementation Guide

### 11.1 Setup Checklist

**Initial Setup**:
- [ ] Install Inter font via Google Fonts or self-host
- [ ] Create `styles/tokens.css` with all design tokens
- [ ] Configure Tailwind with custom theme
- [ ] Set up base styles in `globals.css`
- [ ] Configure Next.js Image optimization

**Component Development**:
- [ ] Follow component specifications in this doc
- [ ] Document props with TypeScript
- [ ] Include all required states (hover, focus, disabled, loading)
- [ ] Test keyboard navigation
- [ ] Verify accessibility with axe DevTools
- [ ] Check responsive behavior (320px-1920px)

### 11.2 File Structure

```
/
├── styles/
│   ├── tokens.css          # Design tokens
│   ├── globals.css         # Base styles
│   └── components.css      # Component-specific styles
│
├── components/
│   ├── SearchBar.tsx
│   ├── CampAccordion.tsx
│   ├── AuthorCard.tsx
│   ├── Button.tsx
│   └── ...
│
├── public/
│   └── fonts/
│       └── Inter/          # Self-hosted fonts (optional)
│
└── tailwind.config.ts      # Tailwind configuration
```

### 11.3 Code Examples

**Button Component**:
```tsx
// components/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  disabled,
  loading,
}: ButtonProps) {
  return (
    <button
      className={`
        button
        button--${variant}
        button--${size}
        ${disabled ? 'button--disabled' : ''}
        ${loading ? 'button--loading' : ''}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

### 11.4 Quality Checklist

**Before Shipping**:
- [ ] Passes WCAG 2.1 AA contrast requirements
- [ ] All interactive elements keyboard accessible
- [ ] Focus states visible and clear
- [ ] Touch targets minimum 44x44px
- [ ] Works on mobile (320px width)
- [ ] Works on desktop (1920px width)
- [ ] Loading states for async operations
- [ ] Error states with clear messages
- [ ] No layout shift (CLS < 0.1)
- [ ] Performance budget met (< 200KB JS)

### 11.5 Review Process

**Design Review**:
1. Compare against this design system
2. Check typography scale, spacing, colors
3. Verify Swiss precision (8px grid alignment)
4. Ensure Japanese minimalism (sufficient whitespace)
5. Confirm editorial tone (micro-narratives present)

**Code Review**:
1. TypeScript interfaces documented
2. Accessibility attributes present
3. Responsive behavior implemented
4. Performance optimizations applied
5. Error boundaries in place

---

## 12. Roadmap (Future Versions)

### v1.1 (Q1 2025)
- [ ] Dark mode color palette
- [ ] Data visualization style guide
- [ ] Advanced animation library
- [ ] Expanded icon set

### v1.2 (Q2 2025)
- [ ] Bookmarks/saved items patterns
- [ ] AI-generated insight cards
- [ ] Tag chip system
- [ ] Multi-column longform layout

### v2.0 (Q3 2025)
- [ ] Complete component library (20+ components)
- [ ] Interactive design system site
- [ ] Figma component library
- [ ] Advanced accessibility features

---

## Quick Reference Card

### Essential Measurements

| Element | Mobile | Desktop |
|---------|--------|---------|
| Body text | 15px | 16px |
| H1 | 32px | 40px |
| Line height (body) | 1.5-1.6 | 1.5-1.6 |
| Touch target | 44x44px | 44x44px |
| Card padding | 20px | 24px |
| Section spacing | 48px | 80px |

### Color Quick Pick

| Use | Color | Hex |
|-----|-------|-----|
| Page background | Bone | `#F9F7F2` |
| Card background | Cloud | `#F2F0EB` |
| Text | Charcoal | `#222222` |
| Accent | International Blue | `#0033FF` |
| Dividers | Ash | `#CCCCCC` |

### Spacing Quick Pick

| Gap | Size | Use |
|-----|------|-----|
| xs | 4px | Tight spacing |
| sm | 8px | Related items |
| md | 16px | Standard gap |
| lg | 24px | Card padding |
| xl | 32px | Between sections |
| 2xl | 48px | Major sections |

---

## Related Documentation

- **Component Implementations**: `/components` directory
- **Tailwind Config**: `tailwind.config.ts`
- **Global Styles**: `app/globals.css`
- **Design Tokens**: `styles/tokens.css`
- **ADR 0005**: Design System Standards decision

---

**Version**: 1.0
**Last Updated**: 2024-12-02
**Maintained by**: Compass team
**Next Review**: 2025-03-02


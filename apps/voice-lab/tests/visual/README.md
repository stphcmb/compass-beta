# Visual Regression Tests for Header

## Overview

This directory contains visual regression tests designed to catch layout bugs like the header cut-off issue that occurred on 2026-01-28.

## The Bug These Tests Prevent

**Problem**: The header was being cut off at the top of pages, with the purple gradient accent line not visible.

**Root Cause**: Insufficient padding-top on main content areas.

**What Went Wrong**:
- Header height: 64px (h-16)
- Required clearance: 64px + some spacing
- Actual padding: Varied by page, sometimes insufficient
- Result: Content overlapped or touched the header

## Tests Included

### 1. Header Visibility Test (`header.spec.ts`)

**Purpose**: Verify header is fully visible with all elements.

**What it checks**:
- ✅ Header element is visible
- ✅ Header height is exactly 64px
- ✅ Gradient accent line at absolute top (y=0, height=2px)
- ✅ Fixed positioning (position: fixed, top: 0, z-index: 30)
- ✅ Visual screenshot comparison

**Would have caught**: Header being cut off or gradient line not visible.

### 2. Header Content Test

**Purpose**: Verify all header content is visible and accessible.

**What it checks**:
- ✅ "Voice Lab" logo text visible
- ✅ All 3 navigation items visible (Home, Library, New Profile)
- ✅ UserButton container visible
- ✅ Visual screenshot of complete header

**Would have caught**: Any header elements being hidden or clipped.

### 3. Header Positioning Test (CRITICAL)

**Purpose**: Verify header remains fixed when scrolling.

**What it checks**:
- ✅ Header at y=0 initially
- ✅ Scroll down 500px
- ✅ Header still at y=0 (remains fixed)
- ✅ Header still visible after scroll

**Would have caught**: Header scrolling away or losing fixed position.

### 4. Content Clearance Test (CRITICAL - THE KEY TEST)

**Purpose**: **This is the most important test** - it would have caught the exact bug!

**What it checks**:
- ✅ Get header bottom position (y + height)
- ✅ Get main content top position
- ✅ **Assert main content starts BELOW header (no overlap)**
- ✅ **Assert clearance is at least 32px**

**Example measurements**:
```typescript
const headerBottom = 64  // Header is 64px tall, starting at y=0
const mainTop = 96       // Main starts at 96px (pt-24)
const clearance = 32     // 96 - 64 = 32px clearance ✅

// If bug present:
const mainTop = 56       // Insufficient padding
const clearance = -8     // NEGATIVE! Content overlaps header ❌
```

**Would have caught**: The exact header cut-off bug by detecting insufficient clearance.

### 5. Multi-Page Test

**Purpose**: Verify consistent clearance across all pages.

**What it checks**:
- ✅ Test home, library, and new profile pages
- ✅ Verify no overlap on any page
- ✅ Log clearance measurements per page
- ✅ Screenshot each page showing header/content relationship

**Would have caught**: Inconsistent padding across different pages.

### 6. Mobile Tests

**Purpose**: Verify mobile layout works correctly.

**What it checks**:
- ✅ Header fully visible on 375px width
- ✅ Header height still 64px
- ✅ Navigation labels hidden (only icons shown)
- ✅ Proper clearance on mobile
- ✅ Mobile-specific screenshots

**Would have caught**: Mobile-specific header issues.

### 7. Gradient & Styling Tests

**Purpose**: Verify visual styling is correct.

**What it checks**:
- ✅ Gradient line at absolute top (position: absolute, top: 0px)
- ✅ Height exactly 2px
- ✅ Contains linear-gradient
- ✅ Backdrop blur effect present
- ✅ Box shadow present
- ✅ Border bottom present

**Would have caught**: Gradient line missing or mispositioned.

## How to Use

### Running Tests

```bash
# Run all visual tests (currently skipped - needs auth setup)
pnpm test:e2e tests/visual/

# Run specific test file
pnpm test:e2e tests/visual/header.spec.ts

# Run with UI mode (interactive)
pnpm exec playwright test tests/visual/header.spec.ts --ui

# Generate baseline screenshots
pnpm exec playwright test tests/visual/header.spec.ts --update-snapshots
```

### Enabling Tests (Authentication Setup Required)

These tests are currently **skipped** because they require authentication. To enable:

#### Option 1: Mock Authentication (Recommended for CI)

Update `tests/fixtures/index.ts`:

```typescript
import { test as base } from '@playwright/test'

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Mock Clerk authentication
    await page.addInitScript(() => {
      // Mock window.__clerk or set auth cookies
      // This depends on your Clerk setup
    })
    await use(page)
  }
})
```

#### Option 2: Use Stored Auth State (Local Development)

```bash
# 1. Sign in once and save auth state
pnpm exec playwright codegen --save-storage=auth.json http://localhost:3001

# 2. Update playwright.config.ts to use stored auth
# projects: [
#   {
#     name: 'authenticated',
#     use: { storageState: 'auth.json' }
#   }
# ]

# 3. Remove test.skip from header.spec.ts
```

#### Option 3: Whitelist Test Routes (Quick Fix)

Add to middleware.ts:
```typescript
// Allow test routes to bypass auth
if (req.nextUrl.pathname.startsWith('/test-')) {
  return NextResponse.next()
}
```

### Interpreting Results

#### ✅ All Tests Pass
Your header layout is correct with proper clearance.

#### ❌ Clearance Test Fails
```
Expected: mainTop (96) > headerBottom (64)
Received: mainTop (56) > headerBottom (64) ❌

Expected: clearance (32) >= 32
Received: clearance (-8) >= 32 ❌
```

**Fix**: Increase padding-top on main element:
```tsx
<main className="pt-24"> {/* 96px padding */}
```

#### ❌ Screenshot Mismatch
Visual regression detected - review the diff image in test results.

## Screenshot Storage

Screenshots are stored in:
```
tests/visual/header.spec.ts-snapshots/
├── chromium/
│   ├── header-full-visibility.png
│   ├── header-content.png
│   ├── header-fixed-scroll.png
│   ├── header-content-clearance.png
│   └── ...
└── mobile/
    ├── header-mobile-visibility.png
    └── ...
```

Update baselines with: `--update-snapshots`

## CI/CD Integration

Add to GitHub Actions:

```yaml
- name: Run Visual Regression Tests
  run: pnpm test:e2e tests/visual/

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-visual-report
    path: apps/voice-lab/playwright-report/
```

## Best Practices

1. **Run tests locally before committing** layout changes
2. **Review screenshot diffs carefully** - intended changes are OK
3. **Update baselines** when intentionally changing header design
4. **Don't skip the clearance test** - it's the most important
5. **Test on multiple viewports** (desktop, tablet, mobile)

## Troubleshooting

### Tests Timeout
- Increase timeout in test: `test.setTimeout(60000)`
- Or use `domcontentloaded` instead of `networkidle`

### Screenshots Don't Match
- Update baselines: `--update-snapshots`
- Check for dynamic content (timestamps, user data)
- Use `mask` option to hide dynamic areas

### Auth Issues
- Set up authentication as described above
- Or create test-only routes that bypass auth

## Maintenance

- Review tests when header design changes
- Update clearance expectations if header height changes
- Add new tests for new header features
- Keep screenshots up to date

---

**Last Updated**: 2026-01-28
**Author**: QA Automation Agent
**Related**: Header cut-off bug fix, Visual regression testing

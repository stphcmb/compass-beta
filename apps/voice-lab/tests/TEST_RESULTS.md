# Test Results Documentation - Voice Lab

Comprehensive documentation of what each test validates, expected outcomes, and how tests prevent regressions (especially the header bug).

## Overview

This document explains:
- What each test suite validates
- Expected test outcomes
- How tests prevent specific bugs (header overlay issue)
- Visual regression examples
- Accessibility validation examples
- Success criteria for each test

## Test Suites

### 1. Visual Regression Tests

**Location**: `tests/visual/`

**Purpose**: Detect unintended visual changes through pixel-perfect screenshot comparison.

#### Test: Header Component Visibility

**File**: `tests/visual/header.spec.ts`

**What it validates**:
1. Header is visible at the top of every page
2. Header maintains consistent layout across routes
3. Logo displays correctly
4. Navigation elements are properly positioned
5. Responsive breakpoints work (mobile vs desktop)

**Test cases**:

| Test Case | Route | Viewport | What it Catches |
|-----------|-------|----------|-----------------|
| Header on sign-in (desktop) | `/sign-in` | 1440×900 | Header hidden by z-index, wrong positioning |
| Header on sign-in (mobile) | `/sign-in` | 390×844 | Mobile layout issues, hamburger menu |
| Header on demo page (desktop) | `/demo` | 1440×900 | Inconsistent header across routes |
| Header on demo page (mobile) | `/demo` | 390×844 | Mobile navigation issues |

**Expected outcome**:
- ✅ Screenshots match pixel-perfect (or within threshold)
- ✅ Header visible in top 100px of page
- ✅ Logo and navigation elements present
- ❌ FAIL if header is hidden, overlapped, or mispositioned

**How it prevented the header bug**:

The original header bug had these symptoms:
```css
/* Bug: Header was hidden behind main content */
header {
  position: sticky;  /* or position: relative */
  z-index: 1;        /* Too low! */
}

main {
  z-index: 10;       /* Higher than header - overlaps! */
  position: relative;
}
```

**Screenshot comparison would show**:

*Expected (baseline):*
```
┌─────────────────────────────────┐
│ [Logo] [Nav] [Sign In Button]  │ ← Header clearly visible
├─────────────────────────────────┤
│                                 │
│   Sign In Form                  │
│                                 │
└─────────────────────────────────┘
```

*Actual (with bug):*
```
┌─────────────────────────────────┐
│                                 │ ← Header NOT visible!
│   Sign In Form                  │   (Hidden behind main)
│                                 │
│                                 │
└─────────────────────────────────┘
```

**Test would fail with**:
```
Error: Screenshot comparison failed: 2,547 pixels differ (8.2% difference)
Expected: header-desktop-expected.png
Actual:   header-desktop-actual.png
Diff:     header-desktop-diff.png
```

**Visual diff image would highlight**:
- Red overlay where header should be visible
- Missing logo and navigation elements
- Content appearing in wrong position

#### Test: Demo Page Header

**File**: `tests/visual/header-demo.spec.ts`

**What it validates**:
1. Header renders consistently on demo page
2. Same header layout as other pages
3. No route-specific layout bugs

**Expected outcome**:
- ✅ Header matches sign-in page header
- ✅ Consistent styling and positioning
- ❌ FAIL if demo page has different header layout

---

### 2. Accessibility Tests

**Location**: `tests/a11y/`

**Purpose**: Ensure Voice Lab meets WCAG 2.1 AA standards for all users.

#### Test: WCAG Compliance

**File**: `tests/a11y/wcag-compliance.spec.ts`

**What it validates**:

| Validation | Description | Example Failure |
|------------|-------------|-----------------|
| **Color Contrast** | Text readable against background (4.5:1 normal, 3:1 large) | White text on light gray background |
| **Form Labels** | All inputs have associated labels | `<input>` without `<label>` or `aria-label` |
| **Alt Text** | Images have descriptive alt text | `<img src="logo.png">` (no alt) |
| **Keyboard Navigation** | All interactive elements accessible via keyboard | Custom button without `tabindex` |
| **ARIA Roles** | Semantic HTML or proper ARIA roles | `<div onclick="...">` instead of `<button>` |
| **Heading Hierarchy** | Logical heading structure (h1 → h2 → h3) | h1 followed by h4 (skips h2, h3) |
| **Focus Indicators** | Visible focus state on interactive elements | `:focus { outline: none }` without alternative |
| **Language** | Page has lang attribute | `<html>` without `lang="en"` |

**Test cases**:

```typescript
// Sign-in page accessibility
test('sign-in page meets WCAG AA', async ({ page }) => {
  await page.goto('/sign-in')

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  expect(accessibilityScanResults.violations).toEqual([])
})
```

**Expected outcome**:
- ✅ Zero violations found
- ✅ All rules pass (color-contrast, label, alt-text, etc.)
- ❌ FAIL if any WCAG AA violations detected

**Example violations**:

*Violation 1: Color Contrast*
```json
{
  "id": "color-contrast",
  "impact": "serious",
  "description": "Ensures foreground/background color contrast meets WCAG AA",
  "help": "Elements must have sufficient color contrast",
  "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/color-contrast",
  "nodes": [
    {
      "html": "<p class=\"text-gray-400\">Sign in to continue</p>",
      "target": [".text-gray-400"],
      "failureSummary": "Expected contrast ratio of 4.5:1 but found 3.2:1"
    }
  ]
}
```

*Violation 2: Missing Form Label*
```json
{
  "id": "label",
  "impact": "critical",
  "description": "Ensures every form element has a label",
  "help": "Form elements must have labels",
  "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/label",
  "nodes": [
    {
      "html": "<input type=\"email\" placeholder=\"Email\">",
      "target": ["input[type=\"email\"]"],
      "failureSummary": "Form element does not have an associated label"
    }
  ]
}
```

**How to fix violations**:

```typescript
// ❌ Before (violations)
<p className="text-gray-400">Sign in to continue</p>
<input type="email" placeholder="Email" />

// ✅ After (compliant)
<p className="text-gray-600">Sign in to continue</p>  // Darker gray for contrast
<label htmlFor="email">Email</label>
<input id="email" type="email" placeholder="Email" aria-label="Email address" />
```

---

### 3. Responsive Design Tests

**Location**: `tests/responsive/`

**Purpose**: Validate UI adapts correctly across all device sizes.

#### Test: Breakpoint Validation

**File**: `tests/responsive/breakpoints.spec.ts`

**What it validates**:

| Breakpoint | Width | What it Tests |
|------------|-------|---------------|
| **Mobile Small** | 375px | Smallest mobile (iPhone SE) |
| **Mobile** | 390px | Standard mobile (iPhone 12) |
| **Mobile Large** | 428px | Large mobile (iPhone 14 Pro Max) |
| **Tablet** | 768px | Small tablet (iPad Mini) |
| **Tablet Large** | 834px | Large tablet (iPad Air) |
| **Desktop** | 1024px | Small desktop/laptop |
| **Desktop Large** | 1440px | Standard desktop |
| **Desktop XL** | 1920px | Large desktop/monitor |

**Test cases**:

```typescript
test('header displays correctly at all breakpoints', async ({ page }) => {
  const breakpoints = [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
  ]

  for (const { name, width, height } of breakpoints) {
    await page.setViewportSize({ width, height })
    await page.goto('/sign-in')

    // Verify header visible
    await expect(page.locator('header')).toBeVisible()

    // Take screenshot
    await expect(page).toHaveScreenshot(`sign-in-${name}.png`)
  }
})
```

**Expected outcomes**:

*Mobile (390px)*:
- ✅ Header visible with logo and hamburger menu
- ✅ Navigation labels hidden (icons only)
- ✅ Content stacked vertically
- ✅ Forms full width
- ❌ FAIL if header overlaps content
- ❌ FAIL if text truncated incorrectly
- ❌ FAIL if horizontal scroll appears

*Tablet (768px)*:
- ✅ Header shows logo and partial navigation
- ✅ Navigation labels visible (some may condense)
- ✅ Content in 2-column grid
- ❌ FAIL if layout breaks between mobile and desktop

*Desktop (1440px)*:
- ✅ Header shows full navigation
- ✅ All navigation labels visible
- ✅ Content in multi-column layout
- ✅ Max-width constraints applied
- ❌ FAIL if content too wide
- ❌ FAIL if navigation wraps incorrectly

#### Test: Sign-In Page Responsive

**File**: `tests/responsive/sign-in-responsive.spec.ts`

**What it validates**:
1. Sign-in form adapts to mobile, tablet, desktop
2. Header remains visible at all sizes
3. Form inputs properly sized
4. Buttons accessible (not too small)
5. No horizontal scrolling

**Expected outcome**:
- ✅ Form centered on all viewports
- ✅ Minimum touch target size (44×44px) on mobile
- ✅ Text readable at all sizes
- ❌ FAIL if form too wide for mobile
- ❌ FAIL if inputs overlap
- ❌ FAIL if header hidden at any size

---

### 4. End-to-End Tests

**Location**: `tests/setup.spec.ts`

**Purpose**: Validate basic app functionality.

#### Test: App Setup

**What it validates**:
1. App loads successfully on port 3001
2. Environment variables configured
3. No critical JavaScript errors
4. Basic navigation works

**Expected outcome**:
- ✅ Page loads without errors
- ✅ Title contains "Voice Lab"
- ✅ Main content visible
- ❌ FAIL if 500 error
- ❌ FAIL if environment misconfigured

---

## Success Criteria Summary

### Visual Regression Tests

**Pass Criteria**:
- Screenshot diff < 0.1% (configurable threshold)
- Header visible in all screenshots
- Layout consistent across pages
- No overlapping elements

**Fail Indicators**:
- Screenshot diff > threshold
- Missing UI elements
- Wrong positioning
- Overlapping content

### Accessibility Tests

**Pass Criteria**:
- Zero WCAG violations
- All axe-core rules pass
- Color contrast ≥ 4.5:1 (normal text)
- All forms properly labeled

**Fail Indicators**:
- Any "critical" or "serious" violations
- Missing alt text
- Insufficient contrast
- Keyboard navigation broken

### Responsive Tests

**Pass Criteria**:
- No horizontal scroll on any viewport
- All content visible and accessible
- Touch targets ≥ 44×44px on mobile
- Text readable at all sizes

**Fail Indicators**:
- Horizontal scrolling
- Overlapping content
- Text truncated incorrectly
- Layout breaks at breakpoints

### End-to-End Tests

**Pass Criteria**:
- All user flows complete successfully
- No JavaScript errors
- Forms submit correctly
- Authentication works

**Fail Indicators**:
- Page crashes or errors
- Forms don't submit
- Navigation broken
- API failures

---

## How Tests Prevent the Header Bug

### The Original Bug

**Symptoms**:
```css
/* BEFORE: Bug present */
header {
  position: sticky;
  top: 0;
  z-index: 1;  /* ← TOO LOW */
}

main {
  position: relative;
  z-index: 10;  /* ← HIGHER THAN HEADER */
}
```

**Result**: Header hidden behind main content.

### How Each Test Suite Catches It

#### 1. Visual Regression Test

**Detection mechanism**: Pixel-perfect screenshot comparison

```typescript
// This test WOULD FAIL with the bug
await expect(page).toHaveScreenshot('header-desktop.png')

// Expected: Header visible in screenshot
// Actual: Header NOT visible (hidden behind main)
// Result: 2,547 pixels differ (FAIL)
```

#### 2. Accessibility Test

**Detection mechanism**: Semantic structure validation

```typescript
// This test might also catch it
const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

// Potential violations:
// - "landmark-no-duplicate-banner": Banner landmark not visible
// - "bypass": No way to skip navigation (if header hidden)
```

#### 3. Responsive Test

**Detection mechanism**: Layout validation at multiple viewports

```typescript
// This test WOULD FAIL at all breakpoints
for (const breakpoint of breakpoints) {
  await page.setViewportSize(breakpoint)
  await expect(page.locator('header')).toBeVisible()  // ← FAILS
}
```

#### 4. Visual Assertion

**Direct header visibility check**:
```typescript
// This assertion would catch it immediately
const header = page.locator('header')
await expect(header).toBeVisible()  // ← FAILS with bug
```

### The Fix

```css
/* AFTER: Bug fixed */
header {
  position: sticky;
  top: 0;
  z-index: 50;  /* ← HIGH ENOUGH */
}

main {
  position: relative;
  z-index: 1;   /* ← LOWER THAN HEADER */
}
```

### Test Validation After Fix

```
✅ Visual regression: Screenshots match
✅ Accessibility: Zero violations
✅ Responsive: Header visible at all breakpoints
✅ E2E: Page loads correctly
```

---

## Example Test Runs

### Successful Test Run

```bash
$ pnpm test

Running 12 tests using 2 workers

  ✓ [chromium] › visual/header.spec.ts:5:3 › header is visible on sign-in page (desktop) (2.1s)
  ✓ [mobile] › visual/header.spec.ts:5:3 › header is visible on sign-in page (mobile) (1.8s)
  ✓ [chromium] › visual/header-demo.spec.ts:5:3 › header is visible on demo page (desktop) (1.9s)
  ✓ [chromium] › a11y/wcag-compliance.spec.ts:7:3 › sign-in page meets WCAG AA (3.2s)
  ✓ [chromium] › a11y/wcag-compliance.spec.ts:15:3 › demo page meets WCAG AA (2.9s)
  ✓ [chromium] › responsive/sign-in-responsive.spec.ts:8:3 › displays correctly on mobile (390px) (1.5s)
  ✓ [chromium] › responsive/sign-in-responsive.spec.ts:16:3 › displays correctly on tablet (768px) (1.4s)
  ✓ [chromium] › responsive/sign-in-responsive.spec.ts:24:3 › displays correctly on desktop (1440px) (1.3s)
  ✓ [chromium] › responsive/breakpoints.spec.ts:10:3 › all breakpoints render correctly (5.2s)
  ✓ [chromium] › setup.spec.ts:5:3 › app loads successfully (1.1s)

  12 passed (23.4s)

To view the HTML report, run: pnpm test:report
```

### Failed Test Run (Header Bug Present)

```bash
$ pnpm test

Running 12 tests using 2 workers

  ✗ [chromium] › visual/header.spec.ts:5:3 › header is visible on sign-in page (desktop) (2.3s)

    Error: Screenshot comparison failed:

      2,547 of 310,752 pixels differ (0.82%)

    Expected: tests/visual/header.spec.ts-snapshots/header-desktop-expected.png
    Actual:   test-results/visual-header-spec-ts/header-desktop-actual.png
    Diff:     test-results/visual-header-spec-ts/header-desktop-diff.png

    Call log:
      - page.goto('http://localhost:3001/sign-in')
      - page.waitForLoadState('networkidle')
      - expect.toHaveScreenshot()

  ✗ [chromium] › responsive/sign-in-responsive.spec.ts:8:3 › displays correctly on mobile (390px) (1.6s)

    Error: locator('header').toBeVisible()

    Expected: visible
    Received: hidden

  2 failed
  10 passed (24.1s)
```

---

## Continuous Monitoring

### Regression Prevention

**How tests prevent regressions**:

1. **Pre-commit hooks**: Run tests before allowing commits
2. **Pull request checks**: Tests must pass before merge
3. **Nightly runs**: Full test suite runs daily
4. **Deployment gates**: Block deployments if tests fail

### Test Maintenance

**When to update tests**:
- ✅ Intentional UI changes (update screenshots)
- ✅ New features added (add new tests)
- ✅ Breaking changes (update assertions)
- ❌ Random failures (fix flaky tests, don't disable)

### Coverage Goals

| Test Type | Current Coverage | Target |
|-----------|------------------|--------|
| Visual Regression | 4 pages | All pages |
| Accessibility | 2 pages | All pages |
| Responsive | 8 breakpoints | 8+ breakpoints |
| E2E User Flows | 1 flow | All critical flows |

---

## Further Reading

- [Playwright Test Documentation](https://playwright.dev/docs/test-assertions)
- [Visual Regression Testing Guide](https://playwright.dev/docs/test-snapshots)
- [Axe-core Rules Reference](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Voice Lab Test README](./README.md)
- [CI Integration Guide](./CI_INTEGRATION.md)

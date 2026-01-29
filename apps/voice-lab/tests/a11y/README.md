# Accessibility Tests - Voice Lab

Comprehensive WCAG 2.1 AA compliance tests using @axe-core/playwright.

## What We Test

### 1. WCAG AA Compliance Test
- **Purpose**: Ensure all pages meet WCAG 2.1 Level AA standards
- **Pages tested**: Home (`/`), Library (`/library`), New Profile (`/new`)
- **Approach**: Uses Axe accessibility scanner to detect violations
- **Expected**: Zero violations for wcag2a and wcag2aa tags

### 2. Navigation Accessibility Test
- **What it validates**:
  - Header nav has `aria-label="Main navigation"`
  - All nav links have descriptive `aria-label` attributes
  - Active link has `aria-current="page"`
  - Icons have `aria-hidden="true"`
- **Why it matters**: Screen readers need semantic markup to understand navigation structure

### 3. Focus Indicators Test
- **What it validates**:
  - All interactive elements show visible focus ring
  - Focus ring meets contrast requirements (violet-400)
  - Tab order is logical and predictable
- **Why it matters**: Keyboard users need to see where focus is at all times
- **Artifacts**: Screenshots of focused elements saved to `test-results/a11y/`

### 4. Color Contrast Test
- **What it validates**:
  - All text meets 4.5:1 contrast ratio (WCAG AA standard)
  - `text-gray-600` on white backgrounds passes
  - Violet text on dark backgrounds passes
- **Why it matters**: Low contrast text is difficult to read, especially for users with low vision

### 5. Icon Button Labels Test
- **What it validates**:
  - All icon-only buttons have `aria-label` attribute
  - Delete buttons have descriptive labels (e.g., "Delete Voice Profile X")
  - Icons have `aria-hidden="true"` to prevent duplication
- **Why it matters**: Icon buttons are invisible to screen readers without labels

### 6. Modal Accessibility Test (Skipped - Future)
- **What it will validate**:
  - Modal has `role="dialog"`
  - Modal has `aria-modal="true"`
  - Modal has `aria-labelledby` pointing to title
  - Escape key closes modal
  - Focus is trapped inside modal
- **Status**: Tests written but skipped until modal component is implemented

### 7. Keyboard Navigation Test
- **What it validates**:
  - All interactive elements are keyboard accessible
  - Tab order is logical
  - Enter/Space keys activate buttons
  - Entire app is navigable without mouse
  - Skip to main content link works (if present)
- **Why it matters**: Many users rely solely on keyboard for navigation

## Running the Tests

```bash
# Run all accessibility tests
pnpm test tests/a11y

# Run with UI
pnpm test:ui tests/a11y

# Run specific test
pnpm test tests/a11y/wcag-compliance.spec.ts

# Run with headed browser (see what's happening)
pnpm test:headed tests/a11y
```

## Understanding Results

### Zero Violations = Pass
All tests should pass with zero violations. If violations are found:

1. Check console output for details
2. Review violation description and help URL
3. Fix the issue in source code
4. Re-run tests

### Violation Report Format
```
=== Violations Found ===

1. color-contrast: Elements must have sufficient color contrast
   Impact: serious
   Help: https://dequeuniversity.com/rules/axe/4.4/color-contrast
   Elements affected: 3
```

### Focus Test Screenshots
Focus indicator tests save screenshots to `test-results/a11y/`:
- `focus-button.png` - Focused button state
- `focus-link.png` - Focused link state
- `focus-input.png` - Focused input state

Review these to ensure focus rings are visible and aesthetically pleasing.

## Accessibility Standards

### WCAG 2.1 Level AA Requirements

| Guideline | Requirement | How We Test |
|-----------|-------------|-------------|
| **1.3.1 Info and Relationships** | Semantic HTML and ARIA | Axe scanner |
| **1.4.3 Contrast (Minimum)** | 4.5:1 for normal text | Color contrast tests |
| **2.1.1 Keyboard** | All functionality via keyboard | Keyboard navigation tests |
| **2.4.3 Focus Order** | Logical tab order | Tab order tests |
| **2.4.7 Focus Visible** | Visible focus indicator | Focus indicator tests |
| **4.1.2 Name, Role, Value** | ARIA labels on controls | Icon button tests |

### Our Focus Ring Standard
- **Color**: `ring-violet-400` (high contrast purple)
- **Width**: `ring-2` (2px)
- **Offset**: `ring-offset-2` (2px gap)
- **Classes**: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2`

## CI/CD Integration

These tests run automatically on:
- Pull requests (preview deployments)
- Merge to main (production deployments)

### Failing CI Checks
If accessibility tests fail in CI:
1. Run tests locally to reproduce
2. Fix violations in source code
3. Verify fixes locally
4. Push changes

**Never skip or ignore accessibility test failures.**

## Best Practices

### When Adding New Features
1. Run accessibility tests early and often
2. Use semantic HTML (`<button>`, `<nav>`, `<main>`)
3. Add `aria-label` to icon-only buttons
4. Test with keyboard before submitting PR
5. Verify focus indicators are visible

### When Fixing Violations
1. Read the violation help URL
2. Understand the WCAG guideline
3. Fix root cause (not just the symptom)
4. Test across multiple pages
5. Document the fix in PR

### When Reviewing PRs
1. Check accessibility test results
2. Tab through UI changes
3. Verify ARIA labels are descriptive
4. Check color contrast of new elements
5. Test with screen reader if possible

## Resources

- [Axe Accessibility Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Keyboard Navigation Guide](https://webaim.org/techniques/keyboard/)

## Future Enhancements

- [ ] Add screen reader testing (nvda, jaws, voiceover)
- [ ] Add automated ARIA live region tests
- [ ] Test with actual assistive technologies
- [ ] Add performance tests for accessibility features
- [ ] Test mobile accessibility (touch targets, gestures)
- [ ] Add visual regression tests for focus states

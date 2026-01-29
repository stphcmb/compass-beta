# Voice Lab Playwright Tests

This directory contains end-to-end tests for the Voice Lab application using Playwright.

## Directory Structure

```
tests/
├── README.md                     # This file
├── auth.setup.ts                 # Authentication setup (TODO: configure)
├── visual/
│   └── header.spec.ts            # Visual regression tests
├── accessibility/
│   └── a11y.spec.ts              # Accessibility tests with axe-core
├── responsive/
│   ├── breakpoints.spec.ts       # Full responsive tests (requires auth)
│   └── sign-in-responsive.spec.ts # Sign-in page responsive tests (no auth)
└── fixtures/                     # Test fixtures and helpers (future)
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run with UI mode (interactive)
pnpm test:ui

# Run in headed mode (visible browser)
pnpm test:headed

# View test report
pnpm test:report

# Run specific test file
pnpm test tests/visual/header.spec.ts

# Run tests for specific project (chromium/mobile)
pnpm test --project=chromium
pnpm test --project=mobile
```

## Test Types

### Visual Regression Tests (`visual/`)
Tests that verify UI components render correctly and detect unintended visual changes.

### Accessibility Tests (`a11y/`)
Tests that verify the application meets WCAG accessibility standards using @axe-core/playwright.

### Responsive Layout Tests (`responsive/`)
Tests that verify the application works correctly across different screen sizes and devices.

## Configuration

The Playwright configuration is defined in `playwright.config.ts` at the root of the Voice Lab app.

Key settings:
- Base URL: `http://localhost:3001`
- Projects: Desktop Chrome, Mobile (iPhone 12)
- Automatic dev server startup
- Screenshots on failure
- Trace on first retry

## Writing Tests

See the individual test files for examples of:
- Page interactions
- Visual regression testing
- Accessibility testing
- Responsive design testing
- Authentication flows

## Test Status Summary

| Test Suite | Status | Auth Required | Notes |
|------------|--------|---------------|-------|
| Visual Regression | ✅ Working | No | Header and layout tests |
| Accessibility | ✅ Working | No | WCAG 2.1 compliance tests |
| Sign-In Responsive | ✅ Working | No | Tests sign-in page at 3 breakpoints |
| Full Responsive | ⏸️ Pending | Yes | Requires auth setup to test /library, /new |

## Authentication Setup

### Current State

Tests requiring authentication (e.g., `/library`, `/new` pages) currently **skip** because auth is not configured. Only public pages (sign-in) are tested.

### Why Authentication is Needed

Voice Lab uses Clerk for authentication. Most pages redirect to sign-in if the user is not authenticated.

### How to Set Up Authentication

**Step 1: Create Test User**
1. Create a test user in Clerk dashboard
2. Add credentials to `.env.local`:
   ```
   TEST_USER_EMAIL=test@example.com
   TEST_USER_PASSWORD=secure_password_here
   ```

**Step 2: Update `tests/auth.setup.ts`**
```typescript
import { test as setup } from '@playwright/test'

const authFile = '.auth/user.json'

setup('authenticate', async ({ page }) => {
  await page.goto('/sign-in')

  // Fill in credentials
  await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!)
  await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!)

  // Submit and wait for redirect
  await page.click('button[type="submit"]')
  await page.waitForURL('/')

  // Save auth state
  await page.context().storageState({ path: authFile })
})
```

**Step 3: Enable in `playwright.config.ts`**
Uncomment the setup project and dependencies:
```typescript
projects: [
  {
    name: 'setup',
    testMatch: /.*\.setup\.ts/,
  },
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      storageState: '.auth/user.json',
    },
    dependencies: ['setup'],
  },
]
```

## Responsive Testing Strategy

Voice Lab uses mobile-first responsive design with Tailwind CSS:

| Breakpoint | Width  | Tailwind | Tested Features |
|------------|--------|----------|-----------------|
| Mobile     | 375px  | `<sm:`   | Stacked layout, hidden labels |
| Tablet     | 768px  | `sm:`    | Labels visible, 2-column grid |
| Desktop    | 1440px | `lg:`    | Full layout, multi-column |

### Common Responsive Patterns

1. **Navigation Labels**: `hidden sm:inline` (hidden on mobile)
2. **Card Layout**: Stack on mobile, grid on tablet+
3. **Form Heights**: `h-32 sm:h-40` (smaller on mobile)
4. **Max Width**: `max-w-5xl mx-auto` (centered with constraint)

## Screenshot Testing

### First Run

Screenshot tests will fail on first run with:
```
A snapshot doesn't exist at [...], writing actual.
```

This is **expected**! Playwright creates baseline screenshots.

### Approving Screenshots

1. Run tests: `pnpm test`
2. Review screenshots in `test-results/`
3. If correct, approve: `pnpm exec playwright test --update-snapshots`

### When to Update

Update screenshots when UI intentionally changes:
- ✅ Colors, spacing, fonts
- ✅ Layout structure
- ❌ Don't update for random failures or bugs

## Troubleshooting

### Tests Timeout

- Increase timeout in config or test
- Verify dev server is running
- Check baseURL matches server port (3001)

### Screenshots Don't Match

- Screenshots are platform-specific (Mac vs Linux)
- Ensure animations disabled: `animations: 'disabled'`
- Wait for full page load before screenshot

### Authentication Fails

- Verify test user exists in Clerk
- Check credentials in `.env.local`
- Ensure `.auth/user.json` has valid tokens
- Re-run setup if tokens expired

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: Run tests
        run: pnpm --filter @compass/voice-lab test:e2e
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: apps/voice-lab/playwright-report/
```

## Best Practices

1. **Independent tests**: Each test should work in isolation
2. **Use data-testid**: Add `data-testid="..."` for stable selectors
3. **Test user behavior**: Focus on what users do, not implementation
4. **Avoid hard waits**: Use `waitForSelector` not `waitForTimeout`
5. **Keep tests fast**: Mock external services when possible
6. **Document complex scenarios**: Explain "why" not just "what"

## Future Enhancements

- [ ] Set up authentication for full test coverage
- [ ] Add tests for voice profile creation flow
- [ ] Add tests for voice application workflow
- [ ] Add performance testing
- [ ] Add API mocking for offline testing
- [ ] Add cross-browser testing (Firefox, Safari)

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Clerk Testing Guide](https://clerk.com/docs/testing)
- [Voice Lab Docs](../../.claude/apps/voice-lab.md)

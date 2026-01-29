# CI/CD Integration Guide - Voice Lab Tests

Complete guide for integrating Voice Lab Playwright tests into CI/CD pipelines.

## Overview

This guide covers:
- GitHub Actions workflow configuration
- Vercel Preview integration
- Environment variable management
- Screenshot diff reporting
- Notification setup (Slack, Discord, email)
- Handling authentication in CI
- Performance optimization

## GitHub Actions Integration

### Basic Workflow

Create `.github/workflows/voice-lab-tests.yml`:

```yaml
name: Voice Lab E2E Tests

on:
  push:
    branches: [main, develop]
    paths:
      - 'apps/voice-lab/**'
      - 'packages/**'
      - '.github/workflows/voice-lab-tests.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'apps/voice-lab/**'
      - 'packages/**'

jobs:
  test:
    name: Playwright Tests
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium
        working-directory: apps/voice-lab

      - name: Run Playwright tests
        run: pnpm --filter @compass/voice-lab test
        env:
          # Supabase
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

          # Clerk
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY }}
          CLERK_SECRET_KEY: ${{ secrets.CLERK_SECRET_KEY }}

          # Test credentials (for authenticated tests)
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

          # Gemini AI
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: apps/voice-lab/playwright-report/
          retention-days: 30

      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-screenshots
          path: apps/voice-lab/test-results/
          retention-days: 7
```

### Advanced Multi-Browser Workflow

For comprehensive browser testing:

```yaml
name: Voice Lab E2E Tests (Multi-Browser)

on:
  pull_request:
    branches: [main]
    paths:
      - 'apps/voice-lab/**'
  schedule:
    - cron: '0 0 * * 0' # Weekly on Sunday

jobs:
  test:
    name: Test (${{ matrix.browser }})
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps ${{ matrix.browser }}
        working-directory: apps/voice-lab

      - name: Run tests
        run: pnpm --filter @compass/voice-lab test --project=${{ matrix.browser }}
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY }}
          CLERK_SECRET_KEY: ${{ secrets.CLERK_SECRET_KEY }}

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.browser }}
          path: apps/voice-lab/playwright-report/
```

### PR Comment with Test Results

Add test results as PR comment:

```yaml
      - name: Comment PR with results
        if: github.event_name == 'pull_request' && always()
        uses: daun/playwright-report-comment@v3
        with:
          report-path: apps/voice-lab/playwright-report
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Vercel Preview Integration

### Deploy and Test Workflow

Test against Vercel preview deployments:

```yaml
name: Deploy and Test Preview

on:
  pull_request:
    branches: [main]

jobs:
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    outputs:
      preview-url: ${{ steps.deploy.outputs.url }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Vercel
        id: deploy
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: apps/voice-lab

  test-preview:
    name: Test Preview Deployment
    needs: deploy-preview
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium
        working-directory: apps/voice-lab

      - name: Run tests against preview
        run: pnpm --filter @compass/voice-lab test
        env:
          BASE_URL: ${{ needs.deploy-preview.outputs.preview-url }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Comment preview URL
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `✅ Preview deployed and tested: ${{ needs.deploy-preview.outputs.preview-url }}`
            })
```

## Environment Variables in CI

### Required Environment Variables

Set these in GitHub Settings → Secrets and variables → Actions:

**Supabase**:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

**Clerk**:
```
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Test Credentials** (for authenticated tests):
```
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=secure_password_here
```

**Gemini AI**:
```
GEMINI_API_KEY=AIza...
```

**Vercel** (optional, for preview deployments):
```
VERCEL_TOKEN=...
VERCEL_ORG_ID=team_...
VERCEL_PROJECT_ID=prj_...
```

### Using Environment-Specific Configs

For different environments:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
  },

  // CI-specific settings
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['html'], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : 'html',
})
```

## Screenshot Diff Reporting

### Generating Diff Reports

Playwright automatically generates screenshot diffs on failure. Access them:

```yaml
      - name: Upload screenshot diffs
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: screenshot-diffs
          path: |
            apps/voice-lab/test-results/**/diff-*.png
            apps/voice-lab/test-results/**/actual-*.png
            apps/voice-lab/test-results/**/expected-*.png
          retention-days: 7
```

### Visual Regression Dashboard

For a visual diff dashboard, use [Argos CI](https://argos-ci.com/) or [Percy](https://percy.io/):

**Argos Example**:
```yaml
      - name: Upload screenshots to Argos
        if: always()
        run: |
          pnpm add -D @argos-ci/cli
          pnpm exec argos upload apps/voice-lab/test-results --token=${{ secrets.ARGOS_TOKEN }}
```

### Screenshot Platform Differences

Screenshots vary by OS. Solutions:

**Option 1: Docker (consistent environment)**:
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.58.0-jammy
    steps:
      - name: Run tests
        run: pnpm --filter @compass/voice-lab test
```

**Option 2: Platform-specific baselines**:
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: {
      fullPage: false,
      animations: 'disabled',
      // Use maxDiffPixels to tolerate minor differences
      maxDiffPixels: 100,
    },
  },
})
```

**Option 3: Separate baseline per OS**:
```bash
# Generate baselines on CI
pnpm test:update-snapshots

# Store in version control
git add tests/**/*-linux.png
git commit -m "Add Linux screenshot baselines"
```

## Handling Authentication in CI

### Setup Test User

1. **Create test user in Clerk**:
   - Go to Clerk Dashboard → Users
   - Create user: `test@example.com`
   - Set password: `SecureTestPassword123!`

2. **Add to GitHub Secrets**:
   ```
   TEST_USER_EMAIL=test@example.com
   TEST_USER_PASSWORD=SecureTestPassword123!
   ```

3. **Auth setup runs before tests**:
```yaml
      - name: Run tests with auth
        run: pnpm --filter @compass/voice-lab test
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
```

### Alternative: API Tokens

Skip UI login by using API tokens:

```typescript
// tests/auth.setup.ts
import { test as setup } from '@playwright/test'

setup('authenticate', async ({ request }) => {
  // Get token from API
  const response = await request.post('https://api.clerk.com/v1/sessions', {
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
    data: {
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD,
    },
  })

  const { token } = await response.json()

  // Save to storage state
  await context.storageState({
    path: '.auth/user.json',
    cookies: [
      {
        name: '__session',
        value: token,
        domain: 'localhost',
        path: '/',
      },
    ],
  })
})
```

## Notification Setup

### Slack Notifications

```yaml
      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "❌ Voice Lab tests failed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Voice Lab E2E Tests Failed*\n\n*Branch:* `${{ github.ref_name }}`\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}\n\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Test Report>"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Discord Notifications

```yaml
      - name: Notify Discord on failure
        if: failure()
        uses: sarisia/actions-status-discord@v1
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          title: "Voice Lab Tests Failed"
          description: |
            **Branch:** ${{ github.ref_name }}
            **Commit:** ${{ github.sha }}
            **Author:** ${{ github.actor }}
          color: 0xFF0000
```

### Email Notifications

GitHub automatically emails on workflow failure. To customize:

```yaml
      - name: Send email on failure
        if: failure()
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: smtp.gmail.com
          server_port: 587
          username: ${{ secrets.EMAIL_USERNAME }}
          password: ${{ secrets.EMAIL_PASSWORD }}
          subject: "❌ Voice Lab Tests Failed - ${{ github.ref_name }}"
          to: team@example.com
          from: CI Bot <ci@example.com>
          body: |
            Voice Lab E2E tests failed.

            Branch: ${{ github.ref_name }}
            Commit: ${{ github.sha }}
            Author: ${{ github.actor }}

            View report: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```

## Performance Optimization

### Caching

**Cache Playwright browsers**:
```yaml
      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ hashFiles('**/pnpm-lock.yaml') }}
```

**Cache pnpm store**:
```yaml
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
```

### Parallel Execution

Run test suites in parallel:

```yaml
jobs:
  test-visual:
    runs-on: ubuntu-latest
    steps:
      - name: Run visual tests
        run: pnpm --filter @compass/voice-lab test:visual

  test-a11y:
    runs-on: ubuntu-latest
    steps:
      - name: Run accessibility tests
        run: pnpm --filter @compass/voice-lab test:a11y

  test-responsive:
    runs-on: ubuntu-latest
    steps:
      - name: Run responsive tests
        run: pnpm --filter @compass/voice-lab test:responsive
```

### Selective Test Execution

Only run tests when relevant files change:

```yaml
on:
  pull_request:
    paths:
      - 'apps/voice-lab/**'
      - 'packages/ui/**'
      - 'packages/auth/**'
      - '!**/*.md'
```

## Test Report Dashboard

### GitHub Pages

Publish test reports to GitHub Pages:

```yaml
      - name: Deploy report to GitHub Pages
        if: always()
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: apps/voice-lab/playwright-report
          destination_dir: test-reports/${{ github.run_number }}
```

### Artifact Links in PR

```yaml
      - name: Comment PR with report link
        if: always() && github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const reportUrl = `https://${{ github.repository_owner }}.github.io/${{ github.event.repository.name }}/test-reports/${{ github.run_number }}/index.html`
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Test Results\n\n[View Full Report](${reportUrl})\n\n✅ Tests completed. Check artifacts for details.`
            })
```

## Debugging CI Failures

### Enable Debug Logging

```yaml
      - name: Run tests with debug
        run: pnpm --filter @compass/voice-lab test
        env:
          DEBUG: pw:api
          PWDEBUG: 1
```

### Record Video on Failure

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    video: process.env.CI ? 'retain-on-failure' : 'off',
  },
})
```

Upload videos:
```yaml
      - name: Upload test videos
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-videos
          path: apps/voice-lab/test-results/**/video.webm
```

### SSH into Runner (Emergency)

```yaml
      - name: Setup tmate session
        if: failure()
        uses: mxschmitt/action-tmate@v3
        timeout-minutes: 30
```

## Checklist

Before enabling CI:

- [ ] All environment variables configured in GitHub Secrets
- [ ] Test user created in Clerk
- [ ] Screenshots generated and committed
- [ ] Tests pass locally in CI mode: `CI=1 pnpm test`
- [ ] Workflow file validated: `actionlint .github/workflows/voice-lab-tests.yml`
- [ ] Notification webhooks configured (optional)
- [ ] Team notified about new CI checks

## Troubleshooting

### Tests Pass Locally But Fail in CI

**Cause**: Environment differences (OS, timezone, fonts).

**Solutions**:
- Run tests in Docker locally: `docker run -it mcr.microsoft.com/playwright:v1.58.0-jammy`
- Update screenshots in CI: `pnpm test:update-snapshots`
- Add threshold: `toHaveScreenshot({ threshold: 0.2 })`

### CI Runs Out of Memory

**Cause**: Too many parallel workers, large screenshots.

**Solutions**:
- Reduce workers: `workers: 1` in CI
- Disable video: `video: 'off'`
- Use `fullPage: false` for screenshots

### Authentication Fails in CI

**Cause**: Rate limits, network issues, invalid credentials.

**Solutions**:
- Add retries to auth setup
- Check Clerk dashboard for issues
- Verify secrets are set correctly
- Test auth locally with same credentials

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Vercel Deployments](https://vercel.com/docs/deployments/overview)
- [Argos CI Visual Testing](https://argos-ci.com/docs)

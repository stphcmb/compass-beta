import { test as setup, expect } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '../.auth/user.json')

/**
 * Authentication Setup for E2E Tests
 *
 * This file handles authentication for Playwright tests.
 * It signs in once and saves the authentication state to be reused by all tests.
 *
 * NOTE: For Voice Lab, authentication requires Clerk.
 * In a real scenario, you would:
 * 1. Set up test user credentials in environment variables
 * 2. Sign in through the Clerk sign-in page
 * 3. Save the authentication state
 *
 * For now, we'll create a basic setup that can be expanded.
 */

setup('authenticate', async ({ page }) => {
  // For development/testing, we can skip authentication by:
  // 1. Using a test mode in Clerk
  // 2. Mocking authentication
  // 3. Using a dedicated test user

  // Navigate to the app
  await page.goto('/')

  // Check if we're already authenticated
  const isSignedIn = await page
    .locator('header')
    .isVisible()
    .catch(() => false)

  if (!isSignedIn) {
    // If not authenticated and we see the sign-in page
    const isSignInPage = await page
      .locator('text=Sign in to Compass')
      .isVisible()
      .catch(() => false)

    if (isSignInPage) {
      // In a real scenario, you would sign in here
      // For now, we'll document what needs to be done

      /**
       * TODO: Set up proper authentication
       *
       * Option 1: Use Clerk test mode
       * - Configure Clerk to allow test mode
       * - Use test credentials
       *
       * Option 2: Use environment variables
       * const email = process.env.TEST_USER_EMAIL
       * const password = process.env.TEST_USER_PASSWORD
       * await page.fill('input[name="email"]', email!)
       * await page.fill('input[name="password"]', password!)
       * await page.click('button[type="submit"]')
       * await page.waitForURL('/')
       *
       * Option 3: Mock authentication state
       * - Use Playwright's browser context to inject auth cookies/tokens
       */

      console.log('⚠️  Authentication required but not configured')
      console.log('Tests will run in unauthenticated mode')
      console.log('Some tests may be skipped or show limited functionality')
    }
  }

  // Save authentication state (even if empty for now)
  await page.context().storageState({ path: authFile })
})

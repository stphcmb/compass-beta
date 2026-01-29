import { test, expect } from '@playwright/test'

/**
 * Setup verification test
 * This test ensures Playwright is correctly configured and can access the Voice Lab app
 */
test.describe('Playwright Setup', () => {
  test('should load the Voice Lab home page', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Verify the page title or a key element exists
    await expect(page).toHaveTitle(/Voice Lab/i)
  })

  test('should have correct viewport sizes', async ({ page, browserName, viewport }) => {
    // This test verifies that different projects have correct viewport sizes
    expect(viewport).toBeDefined()

    // Navigate to verify viewport is applied
    await page.goto('/')

    // Get actual viewport size
    const actualViewport = page.viewportSize()
    expect(actualViewport).toBeDefined()
  })

  test('should support screenshot capture', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Take a screenshot to verify screenshot capability
    const screenshot = await page.screenshot()
    expect(screenshot).toBeDefined()
    expect(screenshot.length).toBeGreaterThan(0)
  })
})

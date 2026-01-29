import { test as base } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Custom fixture for Voice Lab tests
 * Extends Playwright's base test with app-specific helpers
 */
export const test = base.extend({
  // Add custom fixtures here as needed
  // Example: authenticated user, mock data, etc.
})

export { expect } from '@playwright/test'

/**
 * Helper function to wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle')
}

/**
 * Helper function to take a full page screenshot
 */
export async function takeFullPageScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `test-results/screenshots/${name}.png`,
    fullPage: true,
  })
}

/**
 * Helper to check if element is visible in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector)
  const box = await element.boundingBox()

  if (!box) return false

  const viewport = page.viewportSize()
  if (!viewport) return false

  return (
    box.y >= 0 &&
    box.x >= 0 &&
    box.y + box.height <= viewport.height &&
    box.x + box.width <= viewport.width
  )
}

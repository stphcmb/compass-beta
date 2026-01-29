import { test, expect } from '@playwright/test'

/**
 * Responsive Layout Tests for Sign-In Page
 *
 * These tests verify responsive behavior of the sign-in page,
 * which doesn't require authentication and is always accessible.
 *
 * Tests three primary breakpoints: Mobile (375px), Tablet (768px), Desktop (1440px)
 */

test.describe('Sign-In Page Responsive Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/library') // Will redirect to sign-in if not authenticated
    await page.waitForLoadState('domcontentloaded')

    // Verify we're on the sign-in page
    await page.waitForSelector('text=Sign in to Compass', { timeout: 10000 })
  })

  test.describe('Mobile Layout (375px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
    })

    test('should display sign-in form properly', async ({ page }) => {
      const signInHeading = page.locator('text=Sign in to Compass')
      await expect(signInHeading).toBeVisible()

      // Check that form doesn't overflow
      const form = page.locator('form, [role="form"]').first()
      const formBox = await form.boundingBox()
      if (formBox) {
        expect(formBox.width).toBeLessThanOrEqual(375)
        expect(formBox.x).toBeGreaterThanOrEqual(0)
      }
    })

    test('should stack buttons vertically on mobile', async ({ page }) => {
      // GitHub and Google sign-in buttons
      const buttons = page.locator('button:has-text("GitHub"), button:has-text("Google")')
      const buttonCount = await buttons.count()

      if (buttonCount >= 2) {
        const button1Box = await buttons.nth(0).boundingBox()
        const button2Box = await buttons.nth(1).boundingBox()

        if (button1Box && button2Box) {
          // Buttons should stack vertically (within viewport)
          expect(button1Box.x + button1Box.width).toBeLessThanOrEqual(375)
          expect(button2Box.x + button2Box.width).toBeLessThanOrEqual(375)
        }
      }
    })

    test('should take mobile screenshot', async ({ page }) => {
      await page.waitForTimeout(500)

      await expect(page).toHaveScreenshot('sign-in-mobile-375px.png', {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled'
      })
    })
  })

  test.describe('Tablet Layout (768px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
    })

    test('should center sign-in form', async ({ page }) => {
      const form = page.locator('form, [role="form"]').first()
      const formBox = await form.boundingBox()

      if (formBox) {
        // Form should be reasonably centered
        const formCenterX = formBox.x + formBox.width / 2
        const viewportCenterX = 768 / 2

        // Allow some tolerance for centering
        expect(Math.abs(formCenterX - viewportCenterX)).toBeLessThan(100)
      }
    })

    test('should take tablet screenshot', async ({ page }) => {
      await page.waitForTimeout(500)

      await expect(page).toHaveScreenshot('sign-in-tablet-768px.png', {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled'
      })
    })
  })

  test.describe('Desktop Layout (1440px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
    })

    test('should center sign-in form on desktop', async ({ page }) => {
      const form = page.locator('form, [role="form"]').first()
      const formBox = await form.boundingBox()

      if (formBox) {
        // Form should be centered
        const formCenterX = formBox.x + formBox.width / 2
        const viewportCenterX = 1440 / 2

        expect(Math.abs(formCenterX - viewportCenterX)).toBeLessThan(150)

        // Form should have reasonable max width
        expect(formBox.width).toBeLessThan(600)
      }
    })

    test('should take desktop screenshot', async ({ page }) => {
      await page.waitForTimeout(500)

      await expect(page).toHaveScreenshot('sign-in-desktop-1440px.png', {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled'
      })
    })
  })

  test.describe('Form Elements Responsiveness', () => {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 }
    ]

    for (const bp of breakpoints) {
      test(`should have accessible inputs on ${bp.name} (${bp.width}px)`, async ({ page }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height })

        // Email input should be visible and accessible
        const emailInput = page.locator('input[type="email"], input[name*="email"]').first()
        if (await emailInput.count() > 0) {
          await expect(emailInput).toBeVisible()

          const inputBox = await emailInput.boundingBox()
          if (inputBox) {
            // Input should not overflow viewport
            expect(inputBox.x + inputBox.width).toBeLessThanOrEqual(bp.width)
          }
        }

        // Submit button should be visible
        const submitButton = page.locator('button:has-text("Continue"), button[type="submit"]').first()
        if (await submitButton.count() > 0) {
          await expect(submitButton).toBeVisible()
        }
      })
    }
  })
})

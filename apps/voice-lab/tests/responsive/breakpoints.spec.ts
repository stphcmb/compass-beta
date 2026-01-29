import { test, expect } from '@playwright/test'

/**
 * Responsive Layout Tests for Voice Lab
 * Tests three primary breakpoints: Mobile (375px), Tablet (768px), Desktop (1440px)
 *
 * These tests verify that the application adapts correctly to different screen sizes,
 * following the Tailwind responsive design patterns used throughout the app.
 */

/**
 * Helper to check if page requires authentication
 */
async function isAuthRequired(page: any): Promise<boolean> {
  return page.locator('text=Sign in to Compass').isVisible().catch(() => false)
}

test.describe('Responsive Layout Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to library page which has comprehensive layout elements
    await page.goto('/library')
    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded')
    // Give page time to render
    await page.waitForTimeout(1000)
  })

  test.describe('Mobile Layout (375px - iPhone SE)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
    })

    test('should hide navigation labels and show only icons', async ({ page }) => {
      // Skip if not authenticated
      if (await isAuthRequired(page)) {
        test.info().annotations.push({ type: 'skip', description: 'Requires authentication' })
        return
      }

      // Navigation labels should be hidden on mobile (hidden sm:inline class)
      // The labels have class "hidden sm:inline" which means hidden on mobile, visible on sm and up
      const navLabels = page.locator('nav a span.hidden')

      // Check that labels exist but are not visible on mobile
      const count = await navLabels.count()
      expect(count).toBeGreaterThan(0) // Labels should exist in DOM

      // On mobile (375px), these labels should not be visible
      for (let i = 0; i < count; i++) {
        const label = navLabels.nth(i)
        const isVisible = await label.isVisible()
        // Labels should be hidden on mobile
        expect(isVisible).toBe(false)
      }

      // Icons should be visible
      const navIcons = page.locator('nav a svg')
      const iconCount = await navIcons.count()
      expect(iconCount).toBeGreaterThan(0)
      await expect(navIcons.first()).toBeVisible()
    })

    test('should stack cards vertically', async ({ page }) => {
      // Wait for loading to complete
      await page.waitForSelector('text=Loading profiles...', { state: 'hidden', timeout: 15000 }).catch(() => {})

      // Check if cards are present
      const cards = page.locator('[data-testid="voice-profile-card"]')
      const cardCount = await cards.count()

      // Test only runs if cards exist
      if (cardCount >= 2) {
        // Get positions of first two cards
        const card1Box = await cards.nth(0).boundingBox()
        const card2Box = await cards.nth(1).boundingBox()

        if (card1Box && card2Box) {
          // Cards should stack vertically (card2 should be below card1)
          expect(card2Box.y).toBeGreaterThan(card1Box.y + card1Box.height - 10)

          // Cards should have similar x positions (centered or aligned)
          expect(Math.abs(card1Box.x - card2Box.x)).toBeLessThan(20)
        }
      } else {
        // If no cards, verify empty state or load examples button is shown
        const emptyState = page.locator('text=No voice profiles yet')
        const loadExamplesBtn = page.locator('button:has-text("Load Examples")')
        const hasEmptyState = (await emptyState.count()) > 0
        const hasLoadButton = (await loadExamplesBtn.count()) > 0

        expect(hasEmptyState || hasLoadButton).toBe(true)
      }
    })

    test('should have proper button sizing', async ({ page }) => {
      // Check "New Profile" button in header navigation
      const newButton = page.locator('nav a[href="/new"]')
      await expect(newButton).toBeVisible()

      const buttonBox = await newButton.boundingBox()
      if (buttonBox) {
        // Button should be visible and reasonable size
        expect(buttonBox.width).toBeGreaterThan(0)
        expect(buttonBox.width).toBeLessThanOrEqual(150) // Reasonable max width
      }

      // Also check the "New Profile" button on the page if it exists
      const pageNewButton = page.locator('main a[href="/new"]').first()
      const pageButtonCount = await pageNewButton.count()
      if (pageButtonCount > 0 && await pageNewButton.isVisible()) {
        const pageButtonBox = await pageNewButton.boundingBox()
        if (pageButtonBox) {
          // Button should not overflow viewport (with padding)
          expect(pageButtonBox.x + pageButtonBox.width).toBeLessThanOrEqual(375)
        }
      }
    })

    test('should have fully visible header without cutoff', async ({ page }) => {
      const header = page.locator('header')
      await expect(header).toBeVisible()

      const headerBox = await header.boundingBox()
      if (headerBox) {
        // Header should be at top of page
        expect(headerBox.y).toBe(0)

        // Header should be 64px tall (h-16)
        expect(headerBox.height).toBe(64)

        // Header should span full width
        expect(headerBox.width).toBe(375)
      }

      // Logo should be visible
      const logo = header.locator('text=Voice Lab')
      await expect(logo).toBeVisible()

      // UserButton should be visible (Clerk component)
      // Wait a bit for Clerk to load
      await page.waitForTimeout(1000)
      const userButton = header.locator('button[aria-label*="user"], .cl-userButton-root, .cl-avatarBox')
      const userButtonCount = await userButton.count()
      // UserButton might not be loaded yet, so this is optional
      if (userButtonCount > 0) {
        await expect(userButton.first()).toBeVisible()
      }
    })

    test('should take mobile screenshot', async ({ page }) => {
      // Wait for content to be fully rendered
      await page.waitForTimeout(1000)

      await expect(page).toHaveScreenshot('mobile-library-375px.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.02 // Allow 2% difference
      })
    })
  })

  test.describe('Tablet Layout (768px - iPad)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
    })

    test('should show navigation labels', async ({ page }) => {
      // Navigation labels should be visible on tablet (hidden sm:inline class)
      // The spans have "hidden sm:inline" which means they show on sm (640px) and up
      const navLabels = page.locator('nav a span.hidden')

      const count = await navLabels.count()
      expect(count).toBeGreaterThan(0) // Labels should exist

      // On tablet (768px), these labels SHOULD be visible
      for (let i = 0; i < count; i++) {
        const label = navLabels.nth(i)
        await expect(label).toBeVisible()
      }

      // Verify we can read the label text
      const firstLabel = navLabels.first()
      const text = await firstLabel.textContent()
      expect(text?.trim().length).toBeGreaterThan(0)
    })

    test('should display cards in grid layout', async ({ page }) => {
      // Wait for loading to complete
      await page.waitForSelector('text=Loading profiles...', { state: 'hidden', timeout: 15000 }).catch(() => {})

      const cards = page.locator('[data-testid="voice-profile-card"]')
      const cardCount = await cards.count()

      if (cardCount >= 2) {
        const card1Box = await cards.nth(0).boundingBox()
        const card2Box = await cards.nth(1).boundingBox()

        if (card1Box && card2Box) {
          // On tablet, cards might be in 2 columns if using grid
          // Check if cards are side-by-side or stacked
          const isSideBySide = Math.abs(card1Box.y - card2Box.y) < 50

          if (isSideBySide) {
            // Cards are in grid - verify horizontal spacing
            expect(card2Box.x).toBeGreaterThan(card1Box.x + card1Box.width)
          }
          // If not side-by-side, they're still stacking (acceptable on tablet)
        }
      }
    })

    test('should have proper action button spacing', async ({ page }) => {
      const cards = page.locator('[data-testid="voice-profile-card"]')
      const cardCount = await cards.count()

      if (cardCount > 0) {
        const card = cards.first()

        // Find action buttons (Analyze, Rename, Delete)
        const buttons = card.locator('button, a[role="button"]')
        const buttonCount = await buttons.count()

        if (buttonCount >= 2) {
          const button1Box = await buttons.nth(0).boundingBox()
          const button2Box = await buttons.nth(1).boundingBox()

          if (button1Box && button2Box) {
            // Buttons should have proper spacing (gap-2 or similar)
            const gap = button2Box.x - (button1Box.x + button1Box.width)
            expect(gap).toBeGreaterThanOrEqual(4) // At least 4px gap
          }
        }
      }
    })

    test('should take tablet screenshot', async ({ page }) => {
      await page.waitForTimeout(1000)

      await expect(page).toHaveScreenshot('tablet-library-768px.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.02
      })
    })
  })

  test.describe('Desktop Layout (1440px - Standard Desktop)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
    })

    test('should display full layout with proper constraints', async ({ page }) => {
      // Main content should respect max-width constraint
      const main = page.locator('main')
      await expect(main).toBeVisible()

      const mainBox = await main.boundingBox()
      if (mainBox) {
        // Content should be centered (mx-auto)
        const centerX = mainBox.x + mainBox.width / 2
        const viewportCenterX = 1440 / 2

        // Content should be roughly centered (within 50px tolerance)
        expect(Math.abs(centerX - viewportCenterX)).toBeLessThan(50)

        // Content width should respect max-w-5xl (1024px) constraint
        // or be reasonable for desktop
        expect(mainBox.width).toBeLessThanOrEqual(1200)
      }
    })

    test('should display cards in optimal grid layout', async ({ page }) => {
      // Wait for loading to complete
      await page.waitForSelector('text=Loading profiles...', { state: 'hidden', timeout: 15000 }).catch(() => {})

      const cards = page.locator('[data-testid="voice-profile-card"]')
      const cardCount = await cards.count()

      if (cardCount >= 3) {
        // Check if cards are arranged horizontally
        const card1Box = await cards.nth(0).boundingBox()
        const card2Box = await cards.nth(1).boundingBox()
        const card3Box = await cards.nth(2).boundingBox()

        if (card1Box && card2Box && card3Box) {
          // First two cards should be on same row
          const row1 = Math.abs(card1Box.y - card2Box.y) < 50

          if (row1) {
            // Verify horizontal arrangement
            expect(card2Box.x).toBeGreaterThan(card1Box.x)
          }
        }
      }
    })

    test('should have proper header layout', async ({ page }) => {
      const header = page.locator('header')
      await expect(header).toBeVisible()

      const headerBox = await header.boundingBox()
      if (headerBox) {
        // Header should span full width
        expect(headerBox.width).toBe(1440)

        // Header should maintain h-16 (64px) height
        expect(headerBox.height).toBe(64)
      }

      // All header elements should be visible
      await expect(header.locator('text=Voice Lab')).toBeVisible()

      const userButton = header.locator('.cl-userButton-root, [data-testid="user-button"]')
      const userButtonCount = await userButton.count()
      if (userButtonCount > 0) {
        await expect(userButton.first()).toBeVisible()
      }
    })

    test('should take desktop screenshot', async ({ page }) => {
      await page.waitForTimeout(1000)

      await expect(page).toHaveScreenshot('desktop-library-1440px.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.02
      })
    })
  })

  test.describe('Responsive Header Across Breakpoints', () => {
    const breakpoints = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1440, height: 900 }
    ]

    for (const breakpoint of breakpoints) {
      test(`should maintain consistent header at ${breakpoint.name} (${breakpoint.width}px)`, async ({ page }) => {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height })
        await page.goto('/library')

        const header = page.locator('header')
        await expect(header).toBeVisible()

        const headerBox = await header.boundingBox()
        if (headerBox) {
          // Height should always be h-16 (64px)
          expect(headerBox.height).toBe(64)

          // Header should span full width
          expect(headerBox.width).toBe(breakpoint.width)

          // Header should be at top
          expect(headerBox.y).toBe(0)
        }

        // Logo should always be visible
        const logo = header.locator('text=Voice Lab')
        await expect(logo).toBeVisible()

        // UserButton should always be visible
        const userButton = header.locator('button[aria-label*="user"], .cl-userButton-root, .cl-avatarBox')
        const userButtonCount = await userButton.count()
        if (userButtonCount > 0) {
          await expect(userButton.first()).toBeVisible()
        }
      })
    }
  })

  test.describe('Card Responsiveness Across Breakpoints', () => {
    test('should adapt VoiceProfileCard layout on mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/library')
      await page.waitForLoadState('domcontentloaded')
      await page.waitForSelector('text=Loading profiles...', { state: 'hidden', timeout: 15000 }).catch(() => {})

      const card = page.locator('[data-testid="voice-profile-card"]').first()
      const cardCount = await card.count()

      // Only test if cards exist
      if (cardCount === 0) {
        // Skip this test if no cards available
        return
      }

      await expect(card).toBeVisible()

      const cardBox = await card.boundingBox()
      if (cardBox) {
        // Card should not overflow viewport (accounting for padding)
        expect(cardBox.width).toBeLessThanOrEqual(375 - 32)

        // Card text should not overflow
        const cardText = card.locator('text=/./').first()
        const textBox = await cardText.boundingBox()
        if (textBox) {
          expect(textBox.x + textBox.width).toBeLessThanOrEqual(375 - 16)
        }
      }

      // Action buttons should remain accessible
      const buttons = card.locator('button, a[role="button"]')
      const buttonCount = await buttons.count()
      for (let i = 0; i < buttonCount; i++) {
        await expect(buttons.nth(i)).toBeVisible()
      }
    })

    test('should adapt VoiceProfileCard layout on tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/library')
      await page.waitForLoadState('domcontentloaded')
      await page.waitForSelector('text=Loading profiles...', { state: 'hidden', timeout: 15000 }).catch(() => {})

      const card = page.locator('[data-testid="voice-profile-card"]').first()
      const cardCount = await card.count()

      if (cardCount === 0) return // Skip if no cards

      await expect(card).toBeVisible()

      // Card should have proper spacing
      const cardBox = await card.boundingBox()
      if (cardBox) {
        expect(cardBox.width).toBeGreaterThan(300) // Should be wider than mobile
      }
    })

    test('should adapt VoiceProfileCard layout on desktop (1440px)', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/library')
      await page.waitForLoadState('domcontentloaded')
      await page.waitForSelector('text=Loading profiles...', { state: 'hidden', timeout: 15000 }).catch(() => {})

      const card = page.locator('[data-testid="voice-profile-card"]').first()
      const cardCount = await card.count()

      if (cardCount === 0) return // Skip if no cards

      await expect(card).toBeVisible()

      // Card should have optimal width for desktop
      const cardBox = await card.boundingBox()
      if (cardBox) {
        expect(cardBox.width).toBeGreaterThan(350)
        expect(cardBox.width).toBeLessThan(600) // Shouldn't be too wide
      }
    })
  })

  test.describe('Form Responsiveness (/new page)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/new')
      await page.waitForLoadState('networkidle')
    })

    test('should adapt form layout on mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Check textarea height adapts (h-32 on mobile)
      const textarea = page.locator('textarea').first()
      if (await textarea.count() > 0) {
        const textareaBox = await textarea.boundingBox()
        if (textareaBox) {
          // h-32 = 128px (but may vary slightly with padding)
          expect(textareaBox.height).toBeGreaterThanOrEqual(100)
          expect(textareaBox.height).toBeLessThanOrEqual(150)
        }
      }

      // Button groups should be accessible
      const buttons = page.locator('button')
      for (let i = 0; i < await buttons.count(); i++) {
        const button = buttons.nth(i)
        if (await button.isVisible()) {
          const buttonBox = await button.boundingBox()
          if (buttonBox) {
            // Buttons should not overflow viewport
            expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(375)
          }
        }
      }
    })

    test('should adapt form layout on tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })

      // Check textarea height adapts (h-40 on sm:)
      const textarea = page.locator('textarea').first()
      if (await textarea.count() > 0) {
        const textareaBox = await textarea.boundingBox()
        if (textareaBox) {
          // h-40 = 160px (but may vary)
          expect(textareaBox.height).toBeGreaterThanOrEqual(140)
        }
      }
    })

    test('should adapt form layout on desktop (1440px)', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })

      // Form should be centered and not too wide
      const form = page.locator('form').first()
      if (await form.count() > 0) {
        const formBox = await form.boundingBox()
        if (formBox) {
          expect(formBox.width).toBeLessThanOrEqual(1024) // max-w-5xl constraint
        }
      }
    })

    test('should adapt step indicator across breakpoints', async ({ page }) => {
      const breakpoints = [
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1440, height: 900 }
      ]

      for (const bp of breakpoints) {
        await page.setViewportSize(bp)

        // Step indicator should be visible at all breakpoints
        const stepIndicator = page.locator('[data-testid="step-indicator"]')
        if (await stepIndicator.count() > 0) {
          await expect(stepIndicator).toBeVisible()

          const stepBox = await stepIndicator.boundingBox()
          if (stepBox) {
            // Should not overflow viewport
            expect(stepBox.x + stepBox.width).toBeLessThanOrEqual(bp.width)
          }
        }
      }
    })
  })

  test.describe('Screenshot Comparison Tests', () => {
    const pages = [
      { path: '/library', name: 'library' },
      { path: '/new', name: 'new-profile' }
    ]

    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 }
    ]

    for (const pagePath of pages) {
      for (const bp of breakpoints) {
        test(`should match ${bp.name} screenshot for ${pagePath.name}`, async ({ page }) => {
          await page.setViewportSize({ width: bp.width, height: bp.height })
          await page.goto(pagePath.path)
          await page.waitForLoadState('networkidle')
          await page.waitForTimeout(1000) // Allow animations to complete

          await expect(page).toHaveScreenshot(`${pagePath.name}-${bp.name}-${bp.width}px.png`, {
            fullPage: true,
            maxDiffPixelRatio: 0.02, // Allow 2% difference for slight rendering variations
            animations: 'disabled' // Disable animations for consistent screenshots
          })
        })
      }
    }
  })
})

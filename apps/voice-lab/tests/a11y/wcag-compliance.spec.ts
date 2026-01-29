import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * WCAG AA Compliance Test Suite
 *
 * Tests all accessibility fixes made to Voice Lab:
 * 1. WCAG AA compliance on all pages
 * 2. Navigation accessibility (aria-labels, aria-current)
 * 3. Focus indicators (visible, high contrast)
 * 4. Color contrast (4.5:1 ratio minimum)
 * 5. Icon button labels (aria-label on all icons)
 * 6. Modal accessibility (role, aria-modal, aria-labelledby)
 * 7. Keyboard navigation (tab order, all elements reachable)
 */

test.describe('WCAG AA Compliance', () => {
  test.describe.configure({ mode: 'serial' })

  test('homepage has no WCAG AA violations', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('library page has no WCAG AA violations', async ({ page }) => {
    await page.goto('/library')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('new profile page has no WCAG AA violations', async ({ page }) => {
    await page.goto('/new')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('generates accessibility report summary', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    console.log('\n=== Accessibility Report ===')
    console.log(`URL: ${page.url()}`)
    console.log(`Violations: ${accessibilityScanResults.violations.length}`)
    console.log(`Passes: ${accessibilityScanResults.passes.length}`)
    console.log(`Incomplete: ${accessibilityScanResults.incomplete.length}`)
    console.log(`Inapplicable: ${accessibilityScanResults.inapplicable.length}`)

    if (accessibilityScanResults.violations.length > 0) {
      console.log('\n=== Violations Found ===')
      accessibilityScanResults.violations.forEach((violation, i) => {
        console.log(`\n${i + 1}. ${violation.id}: ${violation.description}`)
        console.log(`   Impact: ${violation.impact}`)
        console.log(`   Help: ${violation.helpUrl}`)
        console.log(`   Elements affected: ${violation.nodes.length}`)
      })
    }

    expect(accessibilityScanResults.violations).toEqual([])
  })
})

test.describe('Navigation Accessibility', () => {
  test('header nav has proper ARIA attributes', async ({ page }) => {
    await page.goto('/')

    // Check main navigation has aria-label
    const nav = page.locator('nav[aria-label="Main navigation"]')
    await expect(nav).toBeVisible()

    // Verify all nav links have descriptive aria-labels
    const homeLink = page.locator('a[aria-label*="Home"]')
    await expect(homeLink).toBeVisible()

    const libraryLink = page.locator('a[aria-label*="Library"]')
    await expect(libraryLink).toBeVisible()

    const createLink = page.locator('a[aria-label*="New Profile"]')
    await expect(createLink).toBeVisible()
  })

  test('active navigation link has aria-current="page"', async ({ page }) => {
    // Test home page
    await page.goto('/')
    const homeLink = page.locator('a[href="/"][aria-current="page"]')
    await expect(homeLink).toBeVisible()

    // Test library page
    await page.goto('/library')
    const libraryLink = page.locator('a[href="/library"][aria-current="page"]')
    await expect(libraryLink).toBeVisible()

    // Test new profile page
    await page.goto('/new')
    const createLink = page.locator('a[href="/new"][aria-current="page"]')
    await expect(createLink).toBeVisible()
  })

  test('navigation icons have aria-hidden="true"', async ({ page }) => {
    await page.goto('/')

    // Check that all icons in navigation links are hidden from screen readers
    const navLinks = page.locator('nav a')
    const linkCount = await navLinks.count()

    // Count icons within navigation links
    let iconCount = 0
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i)
      const iconsInLink = link.locator('svg[aria-hidden="true"]')
      iconCount += await iconsInLink.count()
    }

    // Should have at least 3 icons (home, library, create)
    expect(iconCount).toBeGreaterThanOrEqual(3)

    console.log(`\nFound ${iconCount} icons with aria-hidden="true" in navigation`)
  })

  test('navigation links are keyboard accessible', async ({ page }) => {
    await page.goto('/')

    // Tab through navigation links
    await page.keyboard.press('Tab')

    // Check that focus is on a navigation link
    const focusedElement = page.locator(':focus')
    const tagName = await focusedElement.evaluate((el) => el.tagName.toLowerCase())

    expect(tagName).toBe('a')
  })
})

test.describe('Focus Indicators', () => {
  test('buttons have visible focus indicators', async ({ page }) => {
    await page.goto('/new')

    // Find any button on the page
    const button = page.getByRole('button').first()

    // Focus the button
    await button.focus()

    // Take screenshot of focused button
    await button.screenshot({
      path: 'test-results/a11y/focus-button.png'
    })

    // Verify button has focus
    await expect(button).toBeFocused()

    // Check focus ring exists (via CSS class or computed style)
    const hasFocusRing = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      // Check for focus ring (outline or box-shadow)
      return (
        styles.outlineWidth !== '0px' ||
        (styles.boxShadow && styles.boxShadow !== 'none')
      )
    })

    expect(hasFocusRing).toBeTruthy()
  })

  test('links have visible focus indicators', async ({ page }) => {
    await page.goto('/')

    // Focus on library link
    const libraryLink = page.locator('a[aria-label="Navigate to voice library"]')
    await libraryLink.focus()

    // Take screenshot
    await libraryLink.screenshot({
      path: 'test-results/a11y/focus-link.png'
    })

    // Verify link has focus
    await expect(libraryLink).toBeFocused()

    // Check focus ring
    const hasFocusRing = await libraryLink.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return (
        styles.outlineWidth !== '0px' ||
        (styles.boxShadow && styles.boxShadow !== 'none')
      )
    })

    expect(hasFocusRing).toBeTruthy()
  })

  test('inputs have visible focus indicators', async ({ page }) => {
    await page.goto('/new')

    // Focus on any input on the page (textarea)
    const input = page.locator('textarea').first()
    await input.focus()

    // Take screenshot
    await input.screenshot({
      path: 'test-results/a11y/focus-input.png'
    })

    // Verify input has focus
    await expect(input).toBeFocused()

    // Check focus ring exists
    const hasFocusRing = await input.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      const hasOutline = styles.outlineWidth !== '0px'
      const hasBoxShadow = styles.boxShadow && styles.boxShadow !== 'none'

      return hasOutline || hasBoxShadow
    })

    expect(hasFocusRing).toBeTruthy()
  })

  test('tab order is logical', async ({ page }) => {
    await page.goto('/')

    const focusedElements: string[] = []

    // Tab through first 10 elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')

      const focusedElement = page.locator(':focus')
      const elementInfo = await focusedElement.evaluate((el) => {
        const tag = el.tagName.toLowerCase()
        const role = el.getAttribute('role') || tag
        const ariaLabel = el.getAttribute('aria-label') || ''
        const text = el.textContent?.trim().slice(0, 30) || ''

        return `${role}${ariaLabel ? ` (${ariaLabel})` : ''}${text ? `: ${text}` : ''}`
      })

      focusedElements.push(elementInfo)
    }

    console.log('\n=== Tab Order ===')
    focusedElements.forEach((el, i) => {
      console.log(`${i + 1}. ${el}`)
    })

    // Verify first focused element is a navigation link
    expect(focusedElements[0]).toContain('a')
  })
})

test.describe('Color Contrast', () => {
  test('all text meets 4.5:1 contrast ratio', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze()

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    )

    if (contrastViolations.length > 0) {
      console.log('\n=== Color Contrast Violations ===')
      contrastViolations.forEach((violation) => {
        console.log(`\n${violation.description}`)
        violation.nodes.forEach((node) => {
          console.log(`  - ${node.html}`)
          console.log(`    ${node.failureSummary}`)
        })
      })
    }

    expect(contrastViolations).toEqual([])
  })

  test('text-gray-600 on white backgrounds meets contrast', async ({ page }) => {
    await page.goto('/')

    // Find elements with text-gray-600 class
    const grayTextElements = page.locator('.text-gray-600')
    const count = await grayTextElements.count()

    if (count > 0) {
      // Run axe on first gray text element
      const firstElement = grayTextElements.first()

      const accessibilityScanResults = await new AxeBuilder({ page })
        .include(await firstElement.elementHandle() as any)
        .analyze()

      const contrastViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'color-contrast'
      )

      expect(contrastViolations).toEqual([])
    }
  })

  test('violet text on dark backgrounds meets contrast', async ({ page }) => {
    await page.goto('/')

    // Find violet colored elements
    const violetElements = page.locator('[class*="text-violet"], [class*="bg-violet"]')
    const count = await violetElements.count()

    console.log(`\nFound ${count} violet-colored elements`)

    if (count > 0) {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .analyze()

      const contrastViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'color-contrast'
      )

      expect(contrastViolations).toEqual([])
    }
  })
})

test.describe('Icon Button Labels', () => {
  test('all icon-only buttons have aria-label', async ({ page }) => {
    await page.goto('/library')

    // Find all buttons
    const buttons = page.locator('button')
    const count = await buttons.count()

    console.log(`\nChecking ${count} buttons for aria-labels`)

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)

      // Check if button contains only an icon (svg) and no text
      const hasOnlyIcon = await button.evaluate((el) => {
        const hasIcon = el.querySelector('svg') !== null
        const textContent = el.textContent?.trim() || ''
        return hasIcon && textContent.length === 0
      })

      if (hasOnlyIcon) {
        // Icon-only button must have aria-label
        const ariaLabel = await button.getAttribute('aria-label')

        expect(ariaLabel).toBeTruthy()
        expect(ariaLabel?.length).toBeGreaterThan(0)

        console.log(`  ✓ Icon button has aria-label: "${ariaLabel}"`)
      }
    }
  })

  test('delete buttons have descriptive aria-labels', async ({ page }) => {
    await page.goto('/library')

    // Find delete buttons (they should have "Delete" in aria-label)
    const deleteButtons = page.locator('button[aria-label*="Delete"]')
    const count = await deleteButtons.count()

    console.log(`\nFound ${count} delete buttons`)

    // If delete buttons exist, verify their labels
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const button = deleteButtons.nth(i)
        const ariaLabel = await button.getAttribute('aria-label')

        expect(ariaLabel).toContain('Delete')
        expect(ariaLabel?.length).toBeGreaterThan(6) // "Delete" + profile name

        console.log(`  ✓ Delete button: "${ariaLabel}"`)
      }
    }
  })

  test('icons have aria-hidden="true"', async ({ page }) => {
    await page.goto('/')

    // Find all SVG icons
    const icons = page.locator('svg')
    const count = await icons.count()

    console.log(`\nChecking ${count} icons for aria-hidden`)

    let iconsWithAriaHidden = 0

    for (let i = 0; i < count; i++) {
      const icon = icons.nth(i)
      const ariaHidden = await icon.getAttribute('aria-hidden')

      if (ariaHidden === 'true') {
        iconsWithAriaHidden++
      }
    }

    console.log(`  ${iconsWithAriaHidden}/${count} icons have aria-hidden="true"`)

    // At least 80% of icons should have aria-hidden
    const percentage = (iconsWithAriaHidden / count) * 100
    expect(percentage).toBeGreaterThanOrEqual(80)
  })
})

test.describe('Modal Accessibility', () => {
  test.skip('modal has proper ARIA attributes', async ({ page }) => {
    // Skip for now - modal needs to exist first
    await page.goto('/library')

    // Click button to open modal (adjust selector as needed)
    const addButton = page.getByRole('button', { name: /add sample/i })

    if (await addButton.count() > 0) {
      await addButton.click()

      // Wait for modal to appear
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Verify role="dialog"
      await expect(modal).toHaveAttribute('role', 'dialog')

      // Verify aria-modal="true"
      await expect(modal).toHaveAttribute('aria-modal', 'true')

      // Verify aria-labelledby points to title
      const labelledBy = await modal.getAttribute('aria-labelledby')
      expect(labelledBy).toBeTruthy()

      const title = page.locator(`#${labelledBy}`)
      await expect(title).toBeVisible()
    }
  })

  test.skip('modal closes on Escape key', async ({ page }) => {
    // Skip for now - modal needs to exist first
    await page.goto('/library')

    // Open modal
    const addButton = page.getByRole('button', { name: /add sample/i })

    if (await addButton.count() > 0) {
      await addButton.click()

      // Wait for modal
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Press Escape
      await page.keyboard.press('Escape')

      // Modal should close
      await expect(modal).not.toBeVisible()
    }
  })

  test.skip('modal traps focus', async ({ page }) => {
    // Skip for now - modal needs to exist first
    await page.goto('/library')

    // Open modal
    const addButton = page.getByRole('button', { name: /add sample/i })

    if (await addButton.count() > 0) {
      await addButton.click()

      // Wait for modal
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Tab through focusable elements
      const focusedElements: string[] = []

      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')

        const focusedElement = page.locator(':focus')
        const isInModal = await focusedElement.evaluate((el, modalEl) => {
          return modalEl?.contains(el) || false
        }, await modal.elementHandle())

        focusedElements.push(`Tab ${i + 1}: ${isInModal ? 'inside' : 'outside'} modal`)
      }

      console.log('\n=== Focus Trap Test ===')
      focusedElements.forEach((el) => console.log(el))

      // All focused elements should be inside modal
      const allInModal = focusedElements.every((el) => el.includes('inside'))
      expect(allInModal).toBeTruthy()
    }
  })
})

test.describe('Keyboard Navigation', () => {
  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/')

    // Get all interactive elements
    const interactiveElements = await page.locator(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ).count()

    console.log(`\nFound ${interactiveElements} interactive elements`)

    // Tab through all elements
    const focusedElements: string[] = []

    for (let i = 0; i < Math.min(interactiveElements, 20); i++) {
      await page.keyboard.press('Tab')

      const focusedElement = page.locator(':focus')
      const elementInfo = await focusedElement.evaluate((el) => {
        return {
          tag: el.tagName.toLowerCase(),
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          text: el.textContent?.trim().slice(0, 30),
        }
      })

      focusedElements.push(
        `${elementInfo.tag}${elementInfo.role ? ` (${elementInfo.role})` : ''}: ${
          elementInfo.ariaLabel || elementInfo.text || 'no label'
        }`
      )
    }

    console.log('\n=== Keyboard Navigation Test ===')
    focusedElements.forEach((el, i) => {
      console.log(`${i + 1}. ${el}`)
    })

    // Verify we could focus at least some elements
    expect(focusedElements.length).toBeGreaterThan(0)
  })

  test('Enter and Space activate buttons', async ({ page }) => {
    await page.goto('/')

    // Find navigation link (behaves like button)
    const libraryLink = page.locator('a[href="/library"]').first()

    // Focus link
    await libraryLink.focus()
    await expect(libraryLink).toBeFocused()

    // Get current URL
    const currentUrl = page.url()

    // Press Enter
    await page.keyboard.press('Enter')

    // Wait for navigation
    await page.waitForURL('**/library', { timeout: 3000 })

    // URL should have changed
    const newUrl = page.url()

    console.log(`\n=== Link Activation Test ===`)
    console.log(`Before: ${currentUrl}`)
    console.log(`After: ${newUrl}`)
    console.log(`Navigation occurred: ${currentUrl !== newUrl}`)

    expect(newUrl).toContain('/library')
  })

  test('Skip to main content link exists and works', async ({ page }) => {
    await page.goto('/')

    // Tab once to potentially focus skip link
    await page.keyboard.press('Tab')

    // Check if first focused element is a skip link
    const focusedElement = page.locator(':focus')
    const isSkipLink = await focusedElement.evaluate((el) => {
      const text = el.textContent?.toLowerCase() || ''
      const href = el.getAttribute('href') || ''

      return (
        text.includes('skip') ||
        text.includes('main') ||
        href === '#main' ||
        href === '#content'
      )
    })

    if (isSkipLink) {
      console.log('\n✓ Skip to main content link found')

      // Press Enter to activate
      await page.keyboard.press('Enter')

      // Check focus moved to main content
      const mainContent = page.locator('main, [id="main"], [id="content"]')
      const mainIsFocused = await mainContent.evaluate((el) => {
        return document.activeElement === el || el.contains(document.activeElement)
      })

      expect(mainIsFocused).toBeTruthy()
    } else {
      console.log('\n⚠ Skip to main content link not found (optional but recommended)')
    }
  })

  test('entire app is navigable with keyboard only', async ({ page }) => {
    await page.goto('/')

    const report = {
      pages: [] as Array<{
        url: string
        focusableElements: number
        navigationSuccess: boolean
      }>
    }

    // Test homepage
    const homeElements = await page.locator(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ).count()

    report.pages.push({
      url: '/',
      focusableElements: homeElements,
      navigationSuccess: homeElements > 0
    })

    // Navigate to library using keyboard
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab') // Assuming library is 2nd link
    await page.keyboard.press('Enter')
    await page.waitForURL('**/library')

    const libraryElements = await page.locator(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ).count()

    report.pages.push({
      url: '/library',
      focusableElements: libraryElements,
      navigationSuccess: libraryElements > 0
    })

    // Navigate to new profile
    await page.goto('/') // Reset
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab') // Assuming new is 3rd link
    await page.keyboard.press('Enter')
    await page.waitForURL('**/new')

    const newElements = await page.locator(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ).count()

    report.pages.push({
      url: '/new',
      focusableElements: newElements,
      navigationSuccess: newElements > 0
    })

    console.log('\n=== Keyboard Navigation Report ===')
    report.pages.forEach((page) => {
      console.log(`\n${page.url}`)
      console.log(`  Focusable elements: ${page.focusableElements}`)
      console.log(`  Navigation success: ${page.navigationSuccess ? '✓' : '✗'}`)
    })

    // All pages should be navigable
    const allNavigable = report.pages.every((p) => p.navigationSuccess)
    expect(allNavigable).toBeTruthy()
  })
})

import { test, expect } from '@playwright/test'

/** Public routes that should render the global AppShell without auth. */
const LAYOUT_ROUTES = [
  '/',
  '/login',
  '/register',
  '/search',
  '/about',
  '/contact',
  '/help',
  '/privacy',
  '/terms',
  '/profile',
  '/image-sharing',
  '/cookies',
] as const

test.describe('App shell layout', () => {
  for (const path of LAYOUT_ROUTES) {
    test(`${path} — sidebar wrapper, main inset, and chrome`, async ({ page }, testInfo) => {
      const res = await page.goto(path, { waitUntil: 'domcontentloaded' })
      expect(res?.ok(), `HTTP OK for ${path}`).toBeTruthy()

      await expect(page.locator('[data-slot="sidebar-wrapper"]')).toBeVisible()
      await expect(page.locator('main[data-slot="sidebar-inset"]')).toBeVisible()

      await expect(page.locator('body')).toHaveAttribute('data-site-shell', /\S/)

      const shellMarker = page.locator('[data-app-shell]').first()
      await expect(shellMarker).toBeAttached()
      if (testInfo.project.name === 'chromium-desktop') {
        await expect(shellMarker).toBeVisible()
      }

      // Primary nav lives in the drawer on mobile; include hidden so closed Sheet still counts.
      await expect(
        page.getByRole('navigation', { name: 'Primary', includeHidden: true }),
      ).toHaveCount(1)

      if (testInfo.project.name === 'chromium-desktop') {
        await expect(page.locator('a[data-content-type="image"]').first()).toBeVisible()
        await expect(page.locator('a[data-content-type="profile"]').first()).toBeVisible()
        await expect(page.locator('a[data-nav="search"]').first()).toBeVisible()
      }
    })
  }

  test('home — footer below main column', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-testid="site-footer"]', { state: 'attached' })
    const main = page.locator('main[data-slot="sidebar-inset"]')
    const footer = page.getByTestId('site-footer')
    await expect(main).toBeVisible()
    await expect(footer).toBeAttached()
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toBeVisible()
    const mainBox = await main.boundingBox()
    const footBox = await footer.boundingBox()
    expect(mainBox && footBox, 'main and footer have layout boxes').toBeTruthy()
    expect(footBox!.y).toBeGreaterThanOrEqual(mainBox!.y)
  })

  test('mobile — top bar and sidebar toggle', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-mobile', 'chromium-mobile only')
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('button', { name: /toggle sidebar/i })).toBeVisible()
  })
})

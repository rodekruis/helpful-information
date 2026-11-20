import { expect, test } from '@playwright/test';

/**
 * @param {import('@playwright/test').Page} page
 */
test.describe('App', () => {
  test('should load', async ({ page }) => {
    await page.goto('/');

    // Wait for app to finish loading
    await page.waitForLoadState('networkidle');

    // TODO: Verify the page loaded without errors by something more specific/better
    expect(page.url()).toMatch(/\/$/);
  });

  test('renders delayed data and navigates without ZoneJS', async ({
    page,
  }) => {
    /** @type {string[]} */
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    let release = () => {};
    let requestStarted = () => {};
    /** @type {Promise<void>} */
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    /** @type {Promise<void>} */
    const started = new Promise((resolve) => {
      requestStarted = resolve;
    });
    await page.route('**/Categories?*', async (route) => {
      requestStarted();
      await gate;
      await route.continue();
    });

    await page.goto('/test-local-1');
    try {
      await started;
      await expect(page.locator('.loading-text').first()).toBeVisible();
    } finally {
      release();
    }

    await expect(page.getByTestId('categories-list')).toContainText(
      'Category Alpha',
    );
    expect(await page.evaluate("'Zone' in window")).toBe(false);

    await page.getByRole('link', { name: 'Category Alpha' }).click();
    await expect(page).toHaveURL('/test-local-1/category-alpha');
    await expect(
      page.getByRole('heading', { name: 'Category Alpha' }),
    ).toBeVisible();
    await page.goBack();
    await expect(page.getByTestId('categories-list')).toContainText(
      'Category Alpha',
    );
    await page.goForward();
    await expect(
      page.getByRole('heading', { name: 'Category Alpha' }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
});

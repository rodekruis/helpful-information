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
});

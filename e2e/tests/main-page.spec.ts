import { expect, test } from '@playwright/test';

test.describe('Main-page', () => {
  test('should load and contain all the correct contents', async ({ page }) => {
    await page.goto('/');

    // Verify the page contents
    await expect(page).toHaveTitle(/Helpful Information/);
    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      'The Red Cross provides Helpful Information.',
    );
    await expect(page.getByRole('paragraph')).toHaveText(
      'Please choose a location.',
    );
  });

  test('should show a list of Region-buttons', async ({ page }) => {
    await page.goto('/');

    // Verify the page contents
    await expect(page.getByRole('list')).toBeVisible();
    await expect(
      page.getByRole('listitem', { includeHidden: false }),
    ).toHaveCount(3);
  });
});

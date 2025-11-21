import { expect, test } from '@playwright/test';

/**
 * @param {import('@playwright/test').Page} page
 */
test.describe('Main-page', () => {
  test('basic contents', async ({ page }) => {
    await page.goto('/');

    // Verify the page contents
    await expect(page).toHaveTitle(/Helpful Information/);
    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      'The Red Cross provides helpful information.',
    );
    await expect(page.getByRole('paragraph').last()).toHaveText(
      'Please select your region:',
    );
  });

  test('list of Region-buttons', async ({ page }) => {
    await page.goto('/');

    // Verify the page contents
    await expect(page.getByTestId('region-list')).toHaveRole('list');
    await expect(page.getByTestId('region-list')).toBeVisible();
    await expect(
      page
        .getByTestId('region-list')
        .getByRole('listitem', { includeHidden: false })
    ).toHaveCount(4);
  });
});

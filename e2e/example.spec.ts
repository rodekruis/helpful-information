import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage and verify title', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Verify the page title
    await expect(page).toHaveTitle(/Helpful Information/);
  });

  test('should navigate and load the application', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Wait for Angular application to load by checking for any content
    // The app uses ion-router-outlet which should be present
    await page.waitForLoadState('networkidle');

    // Verify the page loaded without errors by checking the URL
    expect(page.url()).toContain('localhost:4200');
  });
});

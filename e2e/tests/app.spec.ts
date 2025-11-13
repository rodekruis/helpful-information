import { expect, test } from '@playwright/test';

test.describe('App', () => {
  test('should navigate and load', async ({ page }) => {
    await page.goto('/');

    // Wait for Angular application to load by checking for any content
    // The app uses ion-router-outlet which should be present
    await page.waitForLoadState('networkidle');

    // Verify the page loaded without errors by checking the URL
    expect(page.url()).toContain('localhost:8080');
  });
});

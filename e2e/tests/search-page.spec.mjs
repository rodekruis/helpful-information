import { expect, test } from '@playwright/test';

import { RegionPage } from '../pages/RegionPage.mjs';
import { SearchPage } from '../pages/SearchPage.mjs';

/**
 * @param {import('@playwright/test').Page} page
 */
test.describe('Search-page', () => {
  test.beforeEach(async ({ page }) => {
    const regionPage = new RegionPage(page);
    await regionPage.goto('test-local-1');
    await regionPage.searchPageButton.click();
  });

  test('perform a successful search', async ({ page }) => {
    const query = 'test';
    const expectedSearchResultCount = 4;
    const expectedFirstResultText = 'A question to test with.';

    const searchPage = new SearchPage(page);
    await searchPage.performSearch({
      query,
    });

    await expect(searchPage.searchResultsLabel).toContainText(
      `${expectedSearchResultCount}`,
    );

    const searchResultsItems = searchPage.searchResultsItems;
    await expect(searchResultsItems).toHaveCount(expectedSearchResultCount);
    await expect(searchResultsItems.first()).toContainText(
      expectedFirstResultText,
    );
  });

  test('perform an usuccessful search', async ({ page }) => {
    const query = 'foo';
    const expectedSearchResultCount = 0;

    const searchPage = new SearchPage(page);

    await searchPage.performSearch({
      query,
    });

    await expect(searchPage.searchResultsLabel).toContainText(
      `${expectedSearchResultCount}`,
    );

    const searchResultsItems = searchPage.searchResultsItems;
    await expect(searchResultsItems).toHaveCount(expectedSearchResultCount);
  });
});

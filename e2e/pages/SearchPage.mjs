/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Locator} Locator
 */

import { expect } from '@playwright/test';

export class SearchPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    /** @type {Page} */
    this.page = page;
    /** @type {Locator} */
    this.searchInput = page.locator('[name=q]');
    /** @type {Locator} */
    this.searchButton = page.locator('[type=submit]');
    /** @type {Locator} */
    this.searchResultsLabel = page.getByTestId('search-results-label');
    /** @type {Locator} */
    this.searchResultsItems = page
      .getByTestId('search-results-list')
      .getByRole('list')
      .first()
      .locator('>li');
  }

  /**
   * @param {{query: string}} args
   * @returns {Promise<void>}
   */
  async performSearch({ query }) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  /**
   * @param {{expectedCount: number}} args
   * @returns {Promise<void>}
   */
  async assertSearchResultCount({ expectedCount }) {
    await expect(this.searchResultsLabel).toContainText(`${expectedCount}`);
    await expect(this.searchResultsItems).toHaveCount(expectedCount);
  }

  /**
   * @param {{
   * itemIndex: number,
   * expectedText: string
   * }} args
   * @returns {Promise<void>}
   */
  async assertSearchResultItemText({ itemIndex, expectedText }) {
    await expect(this.searchResultsItems.nth(itemIndex)).toContainText(
      expectedText,
    );
  }
}

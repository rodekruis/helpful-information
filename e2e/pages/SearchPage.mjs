/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Locator} Locator
 */

export class SearchPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    /** @type {Page} */
    this.page = page;
    /** @type {Locator} */
    this.searchInput = page.getByTestId('search-input');
    /** @type {Locator} */
    this.searchButton = page.getByTestId('search-button');
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
   * @param {object} args
   * @param {string} args.query
   * @returns {Promise<void>}
   */
  async performSearch({ query }) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }
}

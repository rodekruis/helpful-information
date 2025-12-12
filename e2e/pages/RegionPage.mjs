/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Locator} Locator
 */

export class RegionPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    /** @type {Page} */
    this.page = page;
    /** @type {Locator} */
    this.regionPageHeader = page.locator('h2').first();
    /** @type {Locator} */
    this.regionPageIntroduction = page.getByTestId('region-page-introduction');
    /** @type {Locator} */
    this.categoryList = page.getByTestId('categories-list').locator('li a');
  }

  /**
   * @param {string} regionSlug
   * @returns {Promise<void>}
   */
  async goto(regionSlug) {
    await this.page.goto(`/${regionSlug}`);
  }
}

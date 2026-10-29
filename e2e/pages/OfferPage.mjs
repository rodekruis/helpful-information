/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Locator} Locator
 */

export class OfferPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    /** @type {Page} */
    this.page = page;
    /** @type {Locator} */
    this.offerContainer = page.locator('article').first();
    /** @type {Locator} */
    this.offerPageHeader = this.offerContainer
      .getByRole('heading', { level: 2 })
      .first();
    /** @type {Locator} */
    this.offerDescription = this.offerContainer.locator('[markdown]').first();
    /** @type {Locator} */
    this.offerDetails = this.offerContainer.getByTestId('offer-details');
  }

  /**
   * @param {{
   * regionSlug: string,
   * categorySlug: string,
   * subCategorySlug: string,
   * offerSlug: string,
   * }} args
   * @returns {Promise<void>}
   */
  async goto({ regionSlug, categorySlug, subCategorySlug, offerSlug }) {
    await this.page.goto(
      `/${regionSlug}/${categorySlug}/${subCategorySlug}/${offerSlug}`,
    );
  }
}

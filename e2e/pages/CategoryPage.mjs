/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Locator} Locator
 */

export class CategoryPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    /** @type {Page} */
    this.page = page;
    const categoryContainer = page.locator('app-category-page');
    /** @type {Locator} */
    this.categoryPageHeader = categoryContainer.getByRole('heading', {
      level: 2,
    });
    /** @type {Locator} */
    this.categoryPageIntroduction = categoryContainer.locator('[markdown]');
    /** @type {Locator} */
    this.subCategoryList = categoryContainer
      .getByRole('list')
      .filter({ has: page.locator('app-sub-category-link') });
    /** @type {Locator} */
    this.subCategoryLinks = this.subCategoryList
      .getByRole('listitem')
      .getByRole('link');
  }

  /**
   * @param {{ regionSlug: string, categorySlug: string }} args
   * @returns {Promise<void>}
   */
  async goto({ regionSlug, categorySlug }) {
    await this.page.goto(`/${regionSlug}/${categorySlug}`);
  }
}

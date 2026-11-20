/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Locator} Locator
 */

export class SubCategoryPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    /** @type {Page} */
    this.page = page;
    /** @type {Locator} */
    this.pageContent = page.locator('app-sub-category-page');
    /** @type {Locator} */
    this.pageHeading = this.pageContent.getByRole('heading', { level: 2 });
    /** @type {Locator} */
    this.parentCategoryLink = this.pageContent
      .getByRole('navigation')
      .getByRole('link');
    /** @type {Locator} */
    this.introduction = this.pageContent.locator(':scope > [markdown]');
    /** @type {Locator} */
    this.topLevelQAs = this.pageContent.locator(
      ':scope > ul > li > app-q-a-set',
    );
    /** @type {Locator} */
    this.offerGroups = this.pageContent.locator('ul:has(app-offer-link)');
    /** @type {Locator} */
    this.offerLinks = this.pageContent.locator('app-offer-link > a');
    /** @type {Locator} */
    this.offerNames = this.offerLinks.locator(':scope > span > strong');
    /** @type {Locator} */
    this.offerPreviews = this.offerLinks.locator('[markdown]');
    /** @type {Locator} */
    this.offerImages = this.offerLinks.locator('img');
    /** @type {Locator} */
    this.chapterHeadings = this.pageContent.locator('h3[id^="ch-"]');
  }

  /**
   * @param {{
   * regionSlug: string,
   * categorySlug: string,
   * subCategorySlug: string,
   * }} args
   * @returns {Promise<void>}
   */
  async goto({ regionSlug, categorySlug, subCategorySlug }) {
    await this.page.goto(`/${regionSlug}/${categorySlug}/${subCategorySlug}`);
  }
}

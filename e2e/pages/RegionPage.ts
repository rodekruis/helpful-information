import type { Locator, Page } from '@playwright/test';

export class RegionPage {
  readonly page: Page;
  readonly regionPageHeader: Locator;
  readonly regionPageIntroduction: Locator;
  readonly categoryList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.regionPageHeader = page.locator('h2').first();
    this.regionPageIntroduction = page.getByTestId('region-page-introduction');
    this.categoryList = page.getByTestId('categories-list').locator('li a');
  }

  async goto(regionSlug: string) {
    await this.page.goto(`/${regionSlug}`);
  }
}

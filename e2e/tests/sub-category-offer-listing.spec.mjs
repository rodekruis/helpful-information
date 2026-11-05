import { expect, test } from '@playwright/test';

import { SubCategoryPage } from '../pages/SubCategoryPage.mjs';

/** @typedef {import('@playwright/test').Locator} Locator */

/** @param {Locator} offerLink */
const offerName = (offerLink) => offerLink.locator(':scope > span > strong');
/** @param {Locator} offerLink */
const offerPreview = (offerLink) => offerLink.locator('[markdown]');
/** @param {Locator} heading */
const chapterOffers = (heading) =>
  heading
    .locator('xpath=following-sibling::ul[1]')
    .locator('app-offer-link > a');
test.describe('SubCategory page - offer listings', () => {
  test('lists matching named and unnamed offers in chapter order', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
    });
    await expect(page).toHaveTitle(
      'Sub-Category - Category Alpha - Test Local 1 - Helpful Information [ development ]',
    );

    await expect(subCategoryPage.offerLinks).toHaveCount(7);
    await expect(subCategoryPage.offerNames).toHaveText([
      'The Servicename',
      'Another Service',
    ]);
    await expect(subCategoryPage.offerLinks.nth(0)).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/the-servicename',
    );
    await expect(subCategoryPage.offerLinks.nth(1)).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/another-service',
    );
    await expect(subCategoryPage.offerLinks.nth(2)).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/offer-3',
    );
    await expect(subCategoryPage.offerLinks.nth(3)).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/offer-7',
    );
    await expect(subCategoryPage.offerLinks.nth(4)).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/offer-8',
    );
    await expect(subCategoryPage.offerLinks.nth(5)).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/offer-5',
    );
    await expect(subCategoryPage.offerLinks.nth(6)).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/offer-6',
    );
    await expect(
      subCategoryPage.offerLinks.filter({
        hasText: '[Draft] Temporary Service',
      }),
    ).toHaveCount(0);
    await expect(
      subCategoryPage.offerLinks.filter({ hasText: 'Evil Service' }),
    ).toHaveCount(0);

    await expect(subCategoryPage.chapterHeadings).toHaveText([
      'Chapter B',
      'Chapter C',
    ]);
    await expect(subCategoryPage.chapterHeadings).toHaveCount(2);
    await expect(
      chapterOffers(subCategoryPage.chapterHeadings.nth(0)),
    ).toHaveCount(2);
    await expect(
      chapterOffers(subCategoryPage.chapterHeadings.nth(0)).nth(0),
    ).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/offer-7',
    );
    await expect(
      chapterOffers(subCategoryPage.chapterHeadings.nth(0)).nth(1),
    ).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/offer-8',
    );
    await expect(
      chapterOffers(subCategoryPage.chapterHeadings.nth(1)),
    ).toHaveCount(2);
    await expect(
      chapterOffers(subCategoryPage.chapterHeadings.nth(1)).nth(0),
    ).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/offer-5',
    );
    await expect(
      chapterOffers(subCategoryPage.chapterHeadings.nth(1)).nth(1),
    ).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/offer-6',
    );

    await expect(subCategoryPage.offerGroups).toHaveCount(3);
    const unnamedChapterGroup = subCategoryPage.offerGroups.first();
    await expect(unnamedChapterGroup.locator('app-offer-link > a')).toHaveCount(
      3,
    );
    await expect(unnamedChapterGroup.locator('h3[id^="ch-"]')).toHaveCount(0);
    await expect(
      unnamedChapterGroup.locator('app-offer-link > a').nth(0),
    ).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/the-servicename',
    );
    await expect(
      unnamedChapterGroup.locator('app-offer-link > a').nth(1),
    ).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/another-service',
    );
    await expect(
      unnamedChapterGroup.locator('app-offer-link > a').nth(2),
    ).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category/offer-3',
    );

    await expect(offerPreview(subCategoryPage.offerLinks.nth(0))).toContainText(
      'Provides this specific service.',
    );
    await expect(offerPreview(subCategoryPage.offerLinks.nth(0))).toContainText(
      'Described with multiple lines of text.',
    );
    await expect(
      offerPreview(subCategoryPage.offerLinks.nth(0)),
    ).not.toContainText('No level-1 Headings here');
    await expect(
      offerPreview(subCategoryPage.offerLinks.nth(0)).locator('strong'),
    ).toHaveText(['Mark', 'Down']);
    await expect(
      offerPreview(subCategoryPage.offerLinks.nth(0)).locator('b'),
    ).toHaveText('HTML');

    const secondPreview = offerPreview(subCategoryPage.offerLinks.nth(1));
    await expect(secondPreview).toContainText('Provides another Service.');
    await expect(secondPreview).not.toContainText(
      'this should not be visible in the list, only on the page',
    );
    await expect(offerPreview(subCategoryPage.offerLinks.nth(2))).toContainText(
      'Another service without a specific name.',
    );
  });

  test('shows two offers under each named chapter in order', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
    });
    await expect(page).toHaveTitle(
      'Sub-Category - Category Alpha - Test Local 1 - Helpful Information [ development ]',
    );

    const chapterB = subCategoryPage.chapterHeadings.filter({
      hasText: 'Chapter B',
    });
    const chapterC = subCategoryPage.chapterHeadings.filter({
      hasText: 'Chapter C',
    });
    await expect(chapterB).toHaveCount(1);
    await expect(chapterC).toHaveCount(1);
    await expect(chapterOffers(chapterB).locator('[markdown]')).toHaveText([
      'A service in Chapter B',
      'Another service in Chapter B',
    ]);
    await expect(chapterOffers(chapterC).locator('[markdown]')).toHaveText([
      'A service in Chapter C',
      'Another service in Chapter C',
    ]);
  });

  test('shows one filtered offer without named chapter headings', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'another-sub-category',
    });
    await expect(page).toHaveTitle(
      'Another Sub-Category - Category Alpha - Test Local 1 - Helpful Information [ development ]',
    );

    await expect(subCategoryPage.offerLinks).toHaveCount(1);
    await expect(offerName(subCategoryPage.offerLinks)).toHaveText(
      'Evil Service',
    );
    await expect(subCategoryPage.offerLinks).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/another-sub-category/evil-service',
    );
    await expect(offerPreview(subCategoryPage.offerLinks)).toContainText(
      'A row in the sheet containing',
    );
    await expect(subCategoryPage.chapterHeadings).toHaveCount(0);
    await expect(
      subCategoryPage.pageContent.locator('app-offer-link > a'),
    ).not.toContainText('The Servicename');
  });

  test('shows the single-level offer without chapter headings', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'single-level',
      subCategorySlug: 'single-level',
    });
    await expect(page).toHaveTitle(
      'Single Level - Single Level - Test Local 1 - Helpful Information [ development ]',
    );

    await expect(subCategoryPage.offerLinks).toHaveCount(1);
    await expect(offerName(subCategoryPage.offerLinks)).toHaveText(
      'Single Service',
    );
    await expect(subCategoryPage.offerLinks).toHaveAttribute(
      'href',
      '/test-local-1/single-level/single-level/single-service',
    );
    await expect(subCategoryPage.chapterHeadings).toHaveCount(0);
  });

  test('shows no offers or offer images on the empty route', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'empty',
      subCategorySlug: 'empty',
    });
    await expect(page).toHaveTitle(
      'Empty - Empty - Test Local 1 - Helpful Information [ development ]',
    );

    await expect(subCategoryPage.offerLinks).toHaveCount(0);
    await expect(subCategoryPage.offerImages).toHaveCount(0);
    await expect(subCategoryPage.chapterHeadings).toHaveCount(0);
  });

  test('renders fixture icons and the transparent fallback for a missing icon', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
    });
    await expect(page).toHaveTitle(
      'Sub-Category - Category Alpha - Test Local 1 - Helpful Information [ development ]',
    );

    const firstIcon = subCategoryPage.offerImages.nth(0);
    await firstIcon.scrollIntoViewIfNeeded();
    await expect(firstIcon).toHaveAttribute(
      'src',
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 100'%3E%3Crect width='150' height='100' x='0' y='0' fill='%23ddd'%3E%3C/rect%3E%3C/svg%3E",
    );

    const missingIcon = subCategoryPage.offerImages.nth(2);
    await missingIcon.scrollIntoViewIfNeeded();
    await expect(missingIcon).toHaveAttribute(
      'src',
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    );
    const secondIcon = subCategoryPage.offerImages.nth(1);
    await secondIcon.scrollIntoViewIfNeeded();
    await expect(secondIcon).toHaveAttribute(
      'src',
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 100'%3E%3Crect width='50' height='100' x='0' y='0' fill='%23ddd'%3E%3C/rect%3E%3C/svg%3E",
    );
  });

  test('loads a lazy offer image after scrolling it into view', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
    });
    await expect(page).toHaveTitle(
      'Sub-Category - Category Alpha - Test Local 1 - Helpful Information [ development ]',
    );

    const lastOffer = subCategoryPage.offerLinks.nth(6);
    await expect(lastOffer.locator('[loading="lazy"]')).toHaveCount(1);
    await lastOffer.scrollIntoViewIfNeeded();
    const lazyImage = lastOffer.locator('img');
    await expect(lazyImage).toBeVisible();
    await expect(lazyImage).toHaveAttribute(
      'src',
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    );
  });

  test('opens the representative named offer at its detail destination', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
    });
    await expect(page).toHaveTitle(
      'Sub-Category - Category Alpha - Test Local 1 - Helpful Information [ development ]',
    );

    await subCategoryPage.offerLinks.first().click();

    await expect(page).toHaveURL(
      '/test-local-1/category-alpha/sub-category/the-servicename',
    );
    await expect(page).toHaveTitle(
      'The Servicename - Sub-Category - Category Alpha - Test Local 1 - Helpful Information [ development ]',
    );
    await expect(
      page.locator('app-offer-page').getByRole('heading', {
        level: 2,
        name: 'The Servicename',
      }),
    ).toBeVisible();
  });
});

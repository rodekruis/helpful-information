import { createRequire } from 'node:module';

import { expect, test } from '@playwright/test';

import { SubCategoryPage } from '../pages/SubCategoryPage.mjs';

/** @typedef {import('@playwright/test').Locator} Locator */

const require = createRequire(import.meta.url);

/**
 * @param {string} filename
 * @param {string[]} requiredTags
 * @returns {Array<Record<string, string>>}
 */
function readFixture(filename, requiredTags) {
  const fixture = require(`../../data/test-sheet-id-1/values/${filename}`);
  if (
    !fixture ||
    !Array.isArray(fixture.values) ||
    !fixture.values.every(Array.isArray)
  ) {
    throw new Error(`Missing rows in fixture ${filename}`);
  }
  /** @type {unknown[][]} */
  const values = fixture.values;
  const headers = values[0];
  if (!headers) {
    throw new Error(`Missing header row in fixture ${filename}`);
  }

  const columns = Object.fromEntries(
    requiredTags.map((tag) => {
      const index = headers.findIndex((header) =>
        String(header).includes(`#${tag}`),
      );
      if (index < 0) {
        throw new Error(
          `Missing required #${tag} column in fixture ${filename}`,
        );
      }
      return [tag, index];
    }),
  );

  /** @type {Array<Record<string, string>>} */
  const rows = values
    .slice(1)
    .map((cells) =>
      Object.fromEntries(
        Object.entries(columns).map(([tag, column]) => [
          tag,
          String(cells[column] ?? ''),
        ]),
      ),
    );
  return rows;
}

/**
 * @param {Array<Record<string, string>>} rows
 * @param {string} description
 * @param {(row: Record<string, string>) => boolean} predicate
 */
function requireFixtureRow(rows, description, predicate) {
  const row = rows.find(predicate);
  if (!row) {
    throw new Error(`Missing selected fixture row: ${description}`);
  }
  return row;
}

const offerRows = readFixture('Offers.json', [
  'CATEGORY',
  'CHAPTER',
  'DESCRIPTION',
  'ICON',
  'ID',
  'NAME',
  'SLUG',
  'SUBCATEGORY',
  'VISIBLE',
]);

const alphaOffers = offerRows.filter(
  (row) => row.CATEGORY === '1' && row.SUBCATEGORY === '1',
);
const firstNamedOffer = requireFixtureRow(
  alphaOffers,
  'category-alpha/sub-category: The Servicename',
  (row) => row.SLUG === 'the-servicename',
);
const secondNamedOffer = requireFixtureRow(
  alphaOffers,
  'category-alpha/sub-category: Another Service',
  (row) => row.SLUG === 'another-service',
);
const unnamedOffer = requireFixtureRow(
  alphaOffers,
  'category-alpha/sub-category: unnamed offer',
  (row) => row.ID === '3',
);
const hiddenOffer = requireFixtureRow(
  alphaOffers,
  'category-alpha/sub-category: hidden Temporary Service',
  (row) => row.SLUG === 'temporary-service',
);
const chapterCFirst = requireFixtureRow(
  alphaOffers,
  'category-alpha/sub-category: first Chapter C offer',
  (row) =>
    row.CHAPTER === 'Chapter C' && row.DESCRIPTION === 'A service in Chapter C',
);
const chapterBFirst = requireFixtureRow(
  alphaOffers,
  'category-alpha/sub-category: first Chapter B offer',
  (row) =>
    row.CHAPTER === 'Chapter B' && row.DESCRIPTION === 'A service in Chapter B',
);
const chapterCSecond = requireFixtureRow(
  alphaOffers,
  'category-alpha/sub-category: second Chapter C offer',
  (row) =>
    row.CHAPTER === 'Chapter C' &&
    row.DESCRIPTION === 'Another service in Chapter C',
);
const chapterBSecond = requireFixtureRow(
  alphaOffers,
  'category-alpha/sub-category: second Chapter B offer',
  (row) =>
    row.CHAPTER === 'Chapter B' &&
    row.DESCRIPTION === 'Another service in Chapter B',
);
const anotherSubCategoryOffer = requireFixtureRow(
  offerRows,
  'category-alpha/another-sub-category: Evil Service',
  (row) =>
    row.CATEGORY === '1' &&
    row.SUBCATEGORY === '2' &&
    row.SLUG === 'evil-service',
);
const singleOffer = requireFixtureRow(
  offerRows,
  'single-level/single-level: Single Service',
  (row) =>
    row.CATEGORY === '4' &&
    row.SUBCATEGORY === '4' &&
    row.SLUG === 'single-service',
);

/** @param {Locator} offerLink */
const offerName = (offerLink) => offerLink.locator('strong.text-style--size-1');
/** @param {Locator} offerLink */
const offerPreview = (offerLink) => offerLink.locator('[markdown]');
/** @param {Locator} heading */
const chapterOffers = (heading) =>
  heading
    .locator('xpath=following-sibling::ul[1]')
    .locator('app-offer-link > a');
/**
 * @param {string} categorySlug
 * @param {string} subCategorySlug
 * @param {string} offerSlug
 */
const offerHref = (categorySlug, subCategorySlug, offerSlug) =>
  `/test-local-1/${categorySlug}/${subCategorySlug}/${offerSlug}`;

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
      firstNamedOffer.NAME,
      secondNamedOffer.NAME,
    ]);
    const listedDestinations = [
      offerHref('category-alpha', 'sub-category', 'the-servicename'),
      offerHref('category-alpha', 'sub-category', 'another-service'),
      offerHref('category-alpha', 'sub-category', 'offer-3'),
      offerHref('category-alpha', 'sub-category', 'offer-7'),
      offerHref('category-alpha', 'sub-category', 'offer-8'),
      offerHref('category-alpha', 'sub-category', 'offer-5'),
      offerHref('category-alpha', 'sub-category', 'offer-6'),
    ];
    for (const [index, destination] of listedDestinations.entries()) {
      await expect(subCategoryPage.offerLinks.nth(index)).toHaveAttribute(
        'href',
        destination,
      );
    }
    await expect(
      subCategoryPage.offerLinks.filter({ hasText: hiddenOffer.NAME }),
    ).toHaveCount(0);
    await expect(
      subCategoryPage.offerLinks.filter({ hasText: 'Evil Service' }),
    ).toHaveCount(0);

    await expect(subCategoryPage.chapterHeadings).toHaveText([
      chapterBFirst.CHAPTER,
      chapterCFirst.CHAPTER,
    ]);
    await expect(subCategoryPage.chapterHeadings).toHaveCount(2);
    await expect(
      chapterOffers(subCategoryPage.chapterHeadings.nth(0)),
    ).toHaveCount(2);
    for (const [index, destination] of [
      offerHref('category-alpha', 'sub-category', 'offer-7'),
      offerHref('category-alpha', 'sub-category', 'offer-8'),
    ].entries()) {
      await expect(
        chapterOffers(subCategoryPage.chapterHeadings.nth(0)).nth(index),
      ).toHaveAttribute('href', destination);
    }
    await expect(
      chapterOffers(subCategoryPage.chapterHeadings.nth(1)),
    ).toHaveCount(2);
    for (const [index, destination] of [
      offerHref('category-alpha', 'sub-category', 'offer-5'),
      offerHref('category-alpha', 'sub-category', 'offer-6'),
    ].entries()) {
      await expect(
        chapterOffers(subCategoryPage.chapterHeadings.nth(1)).nth(index),
      ).toHaveAttribute('href', destination);
    }

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
      offerHref('category-alpha', 'sub-category', 'the-servicename'),
    );
    await expect(
      unnamedChapterGroup.locator('app-offer-link > a').nth(1),
    ).toHaveAttribute(
      'href',
      offerHref('category-alpha', 'sub-category', 'another-service'),
    );
    await expect(
      unnamedChapterGroup.locator('app-offer-link > a').nth(2),
    ).toHaveAttribute(
      'href',
      offerHref('category-alpha', 'sub-category', 'offer-3'),
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
      unnamedOffer.DESCRIPTION,
    );
  });

  test('shows two offers under each named chapter in fixture order', async ({
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
      hasText: chapterBFirst.CHAPTER,
    });
    const chapterC = subCategoryPage.chapterHeadings.filter({
      hasText: chapterCFirst.CHAPTER,
    });
    await expect(chapterB).toHaveCount(1);
    await expect(chapterC).toHaveCount(1);
    await expect(chapterOffers(chapterB).locator('[markdown]')).toHaveText([
      chapterBFirst.DESCRIPTION,
      chapterBSecond.DESCRIPTION,
    ]);
    await expect(chapterOffers(chapterC).locator('[markdown]')).toHaveText([
      chapterCFirst.DESCRIPTION,
      chapterCSecond.DESCRIPTION,
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
      anotherSubCategoryOffer.NAME,
    );
    await expect(subCategoryPage.offerLinks).toHaveAttribute(
      'href',
      offerHref('category-alpha', 'another-sub-category', 'evil-service'),
    );
    await expect(offerPreview(subCategoryPage.offerLinks)).toContainText(
      'A row in the sheet containing',
    );
    await expect(subCategoryPage.chapterHeadings).toHaveCount(0);
    await expect(
      subCategoryPage.pageContent.locator('app-offer-link > a'),
    ).not.toContainText(firstNamedOffer.NAME);
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
      singleOffer.NAME,
    );
    await expect(subCategoryPage.offerLinks).toHaveAttribute(
      'href',
      offerHref('single-level', 'single-level', 'single-service'),
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
    await expect(subCategoryPage.pageContent.locator('ion-img')).toHaveCount(0);
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

    const firstIcon = subCategoryPage.offerLinks.nth(0).locator('ion-img');
    await expect(firstIcon).toHaveJSProperty('src', firstNamedOffer.ICON);
    await expect(firstIcon).toHaveAttribute('aria-hidden', 'true');
    await expect(firstIcon).toHaveAttribute('loading', 'lazy');

    const missingIcon = subCategoryPage.offerLinks.nth(2).locator('ion-img');
    await expect(missingIcon).toHaveJSProperty(
      'src',
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    );
    await expect(
      subCategoryPage.offerLinks.nth(1).locator('ion-img'),
    ).toHaveJSProperty('src', secondNamedOffer.ICON);
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
    await expect(lastOffer.locator('ion-img')).toHaveAttribute(
      'loading',
      'lazy',
    );
    await lastOffer.scrollIntoViewIfNeeded();
    const lazyImage = lastOffer.locator('ion-img img');
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
      offerHref('category-alpha', 'sub-category', 'the-servicename'),
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

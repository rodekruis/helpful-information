import { createRequire } from 'node:module';

import { expect, test } from '@playwright/test';

import { SubCategoryPage } from '../pages/SubCategoryPage.mjs';

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

const categories = readFixture('Categories.json', ['ID', 'NAME', 'SLUG']);
const subCategories = readFixture('Sub-Categories.json', [
  'CATEGORY',
  'ID',
  'NAME',
  'SLUG',
  'DESCRIPTION',
]);

const categoryAlpha = requireFixtureRow(
  categories,
  'category-alpha',
  (row) => row.SLUG === 'category-alpha',
);
const emptyCategory = requireFixtureRow(
  categories,
  'empty category',
  (row) => row.SLUG === 'empty',
);
const alphaSubCategory = requireFixtureRow(
  subCategories,
  'category-alpha/sub-category',
  (row) => row.CATEGORY === categoryAlpha.ID && row.SLUG === 'sub-category',
);
const richSubCategory = requireFixtureRow(
  subCategories,
  'category-alpha/another-sub-category rich introduction',
  (row) =>
    row.CATEGORY === categoryAlpha.ID && row.SLUG === 'another-sub-category',
);
const emptySubCategory = requireFixtureRow(
  subCategories,
  'empty/empty without description',
  (row) => row.CATEGORY === emptyCategory.ID && row.SLUG === 'empty',
);
const singleLevelCategory = requireFixtureRow(
  categories,
  'single-level category',
  (row) => row.SLUG === 'single-level',
);
const singleLevelSubCategory = requireFixtureRow(
  subCategories,
  'single-level/single-level',
  (row) =>
    row.CATEGORY === singleLevelCategory.ID && row.SLUG === 'single-level',
);
const qaCategory = requireFixtureRow(
  categories,
  'q-and-a-s category',
  (row) => row.SLUG === 'q-and-a-s',
);
const qaSubCategory = requireFixtureRow(
  subCategories,
  'q-and-a-s/q-and-a-s',
  (row) => row.CATEGORY === qaCategory.ID && row.SLUG === 'q-and-a-s',
);

/**
 * @param {Record<string, string>} subCategory
 * @param {Record<string, string>} category
 */
const pageTitle = (subCategory, category) =>
  `${subCategory.NAME} - ${category.NAME} - Test Local 1 - Helpful Information [ development ]`;

test.describe('SubCategory page - generic behavior', () => {
  test('direct navigation shows the exact identity, title, and parent destination', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
    });

    await expect(subCategoryPage.page).toHaveTitle(
      pageTitle(alphaSubCategory, categoryAlpha),
    );
    await expect(subCategoryPage.pageHeading).toHaveText('Sub-Category');
    await expect(subCategoryPage.parentCategoryLink).toHaveText(
      '＜ Category Alpha',
    );
    await expect(subCategoryPage.parentCategoryLink).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha',
    );
  });

  test('the parent link returns to a category with multiple subcategories', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
    });
    await expect(subCategoryPage.page).toHaveTitle(
      pageTitle(alphaSubCategory, categoryAlpha),
    );

    await subCategoryPage.parentCategoryLink.click();

    await expect(page).toHaveURL('/test-local-1/category-alpha');
    await expect(
      page.getByRole('heading', { level: 2, name: 'Category Alpha' }),
    ).toBeVisible();
  });

  test('the ordinary introduction uses subcategory text and headings', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
    });
    await expect(subCategoryPage.page).toHaveTitle(
      pageTitle(alphaSubCategory, categoryAlpha),
    );

    await expect(subCategoryPage.introduction).toBeVisible();
    await expect(subCategoryPage.introduction.locator('p').first()).toHaveText(
      'The description of this sub-category.',
    );
    await expect(
      subCategoryPage.introduction.getByRole('heading', { level: 3 }),
    ).toHaveText('Sub-heading');
    await expect(subCategoryPage.introduction).not.toContainText(
      'Description of First Category.',
    );
  });

  test('the rich introduction renders Markdown and inline HTML', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'another-sub-category',
    });
    await expect(subCategoryPage.page).toHaveTitle(
      pageTitle(richSubCategory, categoryAlpha),
    );

    const introduction = subCategoryPage.introduction;
    await expect(introduction.locator('p').first()).toHaveText(
      'Another description of this sub-category',
    );
    await expect(introduction.locator('p').nth(1)).toHaveText(
      'With MarkDown and/or HTML content:',
    );
    await expect(introduction.locator('p').nth(1).locator('strong')).toHaveText(
      ['Mark', 'Down'],
    );
    await expect(introduction.locator('p').nth(1).locator('b')).toHaveText(
      'HTML',
    );
    await expect(introduction.getByRole('listitem')).toHaveText([
      'lists',
      'plain URL-links',
      'links',
    ]);

    const externalLink = introduction.getByRole('link');
    await expect(externalLink).toHaveCount(1);
    await expect(externalLink).toHaveText('links');
    await expect(externalLink).toHaveAttribute('href', 'https://example.org');
    await expect(externalLink).toHaveAttribute('target', '_blank');
    await expect(externalLink).toHaveAttribute('rel', /external/);
    await expect(externalLink).toHaveAttribute('rel', /noopener/);
    await expect(externalLink).toHaveAttribute('rel', /noreferrer/);

    await expect(introduction.getByRole('heading', { level: 3 })).toHaveText(
      'No level-1 Headings here',
    );
    await expect(introduction.getByRole('heading', { level: 4 })).toHaveText(
      'Level 3+ Headings only here',
    );
    await expect(introduction.getByRole('separator')).toHaveCount(1);
  });

  test('an empty SubCategory keeps its identity and parent link only', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'empty',
      subCategorySlug: 'empty',
    });
    await expect(subCategoryPage.page).toHaveTitle(
      pageTitle(emptySubCategory, emptyCategory),
    );

    await expect(subCategoryPage.pageHeading).toHaveText('Empty');
    await expect(subCategoryPage.parentCategoryLink).toHaveText('＜ Empty');
    await expect(subCategoryPage.parentCategoryLink).toHaveAttribute(
      'href',
      '/test-local-1/empty',
    );
    await expect(subCategoryPage.introduction).toHaveCount(0);
    await expect(subCategoryPage.offerLinks).toHaveCount(0);
    await expect(subCategoryPage.topLevelQAs).toHaveCount(0);
  });

  test('the single-level SubCategory has its own introduction', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'single-level',
      subCategorySlug: 'single-level',
    });
    await expect(subCategoryPage.page).toHaveTitle(
      pageTitle(singleLevelSubCategory, singleLevelCategory),
    );

    await expect(subCategoryPage.pageHeading).toHaveText('Single Level');
    await expect(subCategoryPage.introduction).toContainText(
      'This sub-category has only 1 offer/question',
    );
    await expect(subCategoryPage.introduction.locator('small')).toContainText(
      'Deze pagina is er ook in het Nederlands.',
    );
  });

  test('the Q&As SubCategory has its own identity and parent navigation', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'q-and-a-s',
      subCategorySlug: 'q-and-a-s',
    });
    await expect(subCategoryPage.page).toHaveTitle(
      pageTitle(qaSubCategory, qaCategory),
    );

    await expect(subCategoryPage.pageHeading).toHaveText('Q&As');
    await expect(subCategoryPage.parentCategoryLink).toHaveText('＜ Q&As');
    await expect(subCategoryPage.parentCategoryLink).toHaveAttribute(
      'href',
      '/test-local-1/q-and-a-s',
    );
  });
});

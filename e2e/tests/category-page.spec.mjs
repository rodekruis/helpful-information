import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';

import { CategoryPage } from '../pages/CategoryPage.mjs';

/**
 * @param {string} fileName
 * @param {string[]} tags
 * @returns {Record<string, string>[]}
 */
function readSheet(fileName, tags) {
  /** @type {{ values: string[][] }} */
  const sheet = JSON.parse(
    readFileSync(
      new URL(`../../data/test-sheet-id-1/values/${fileName}`, import.meta.url),
      'utf8',
    ),
  );
  const [headers, ...rows] = sheet.values;
  if (!headers) {
    throw new Error(`Missing header row in ${fileName}`);
  }
  const columns = tags.map((tag) => {
    const index = headers.findIndex((header) => header.endsWith(`#${tag}`));
    if (index === -1) {
      throw new Error(`Missing #${tag} column in ${fileName}`);
    }
    return { tag, index };
  });
  return rows.map((row) =>
    Object.fromEntries(
      columns.map(({ tag, index }) => [tag, (row[index] ?? '').trim()]),
    ),
  );
}

const categories = readSheet('Categories.json', [
  'ID',
  'NAME',
  'SLUG',
  'DESCRIPTION',
]);
const subCategories = readSheet('Sub-Categories.json', [
  'CATEGORY',
  'NAME',
  'SLUG',
  'VISIBLE',
  'ICON',
]);

test.describe('Category-page', () => {
  for (const categorySlug of ['category-alpha', 'category-bravo', 'empty']) {
    const category = categories.find((row) => row.SLUG === categorySlug);
    if (!category) {
      throw new Error(`Missing category fixture: ${categorySlug}`);
    }
    const expectedSubCategories = subCategories.filter(
      (row) =>
        row.CATEGORY === category.ID &&
        ['1', 'SHOW', 'TRUE', 'VISIBLE', 'Y', 'YES'].includes(
          row.VISIBLE.toUpperCase(),
        ),
    );

    test.describe(categorySlug, () => {
      test.beforeEach(async ({ page }) => {
        const categoryPage = new CategoryPage(page);
        await categoryPage.goto({
          regionSlug: 'test-local-1',
          categorySlug,
        });

        await expect(categoryPage.categoryPageHeader).toHaveText(category.NAME);
        // The category title is set after the subcategories have loaded.
        await expect(page).toHaveTitle(new RegExp(`^${category.NAME} - `));
      });

      test('subcategory links', async ({ page }) => {
        const categoryPage = new CategoryPage(page);

        await expect(categoryPage.subCategoryList).toHaveCount(
          expectedSubCategories.length,
        );
        await expect(categoryPage.subCategoryList).toHaveText(
          expectedSubCategories.map((row) => row.NAME),
          { useInnerText: true },
        );

        for (const subCategory of expectedSubCategories) {
          const link = categoryPage.subCategoryList.and(
            page.getByRole('link', { name: subCategory.NAME, exact: true }),
          );
          await expect(link).toBeVisible();
          await expect(link).toHaveAttribute(
            'href',
            `/test-local-1/${categorySlug}/${subCategory.SLUG}`,
          );
        }
      });

      test('subcategory images follow the data', async ({ page }) => {
        const categoryPage = new CategoryPage(page);

        await expect(categoryPage.subCategoryList.locator('img')).toHaveCount(
          expectedSubCategories.length,
        );
        for (const subCategory of expectedSubCategories) {
          const image = categoryPage.subCategoryList
            .and(
              page.getByRole('link', { name: subCategory.NAME, exact: true }),
            )
            .locator('img');
          await expect(image).toBeVisible();
          await expect(image).toHaveAttribute(
            'src',
            subCategory.ICON || /^data:image\/gif;base64,/,
          );
        }
      });

      test('introduction follows the category data', async ({ page }) => {
        const categoryPage = new CategoryPage(page);

        if (category.DESCRIPTION) {
          await expect(categoryPage.categoryPageIntroduction).toBeVisible();
          await expect(
            categoryPage.categoryPageIntroduction
              .getByRole('paragraph')
              .first(),
          ).toHaveText(category.DESCRIPTION.split('\n')[0]);
        } else {
          await expect(categoryPage.categoryPageIntroduction).toHaveCount(0);
        }
      });
    });
  }

  test('introduction markdown-content', async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-bravo',
    });

    const introduction = categoryPage.categoryPageIntroduction;
    await expect(introduction.getByRole('paragraph').first()).toHaveText(
      'Another Category',
    );
    await expect(introduction.getByRole('paragraph').nth(1)).toHaveText(
      'With MarkDown and/or HTML content:',
    );
    await expect(introduction.getByRole('strong')).toHaveText(['Mark', 'Down']);
    await expect(introduction.locator('b')).toHaveText('HTML');
    await expect(introduction.getByRole('list')).toHaveCount(1);
    await expect(introduction.getByRole('listitem')).toHaveText([
      'lists',
      'plain URL-links',
      'links',
    ]);
    const link = introduction.getByRole('link', { name: 'links', exact: true });
    await expect(link).toHaveAttribute('href', 'https://example.org');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toHaveAttribute('rel', /noreferrer/);
    await expect(introduction.getByRole('heading', { level: 3 })).toHaveText(
      'No level-1 Headings here',
    );
    await expect(introduction.getByRole('heading', { level: 4 })).toHaveText(
      'Level 3+ Headings only here',
    );
    await expect(introduction.getByRole('separator')).toHaveCount(1);
  });
});

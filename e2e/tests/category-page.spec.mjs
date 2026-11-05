import { expect, test } from '@playwright/test';

import { CategoryPage } from '../pages/CategoryPage.mjs';

test.describe('Category-page', () => {
  test('multiple subcategory links', async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
    });

    await expect(categoryPage.categoryPageHeader).toHaveText('Category Alpha');
    await expect(categoryPage.subCategoryList).toBeVisible();
    await expect(
      categoryPage.subCategoryList.getByRole('listitem'),
    ).toHaveCount(2);
    await expect(categoryPage.subCategoryLinks).toHaveCount(2);
    await expect(categoryPage.subCategoryLinks).toHaveText(
      ['Sub-Category', 'Another Sub-Category'],
      { useInnerText: true },
    );
    await expect(categoryPage.subCategoryLinks.nth(0)).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/sub-category',
    );
    await expect(categoryPage.subCategoryLinks.nth(1)).toHaveAttribute(
      'href',
      '/test-local-1/category-alpha/another-sub-category',
    );
  });

  test('category without subcategories has no subcategory list', async ({
    page,
  }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-bravo',
    });

    // The category title is set after the subcategories have loaded.
    await expect(page).toHaveTitle(/^Category Bravo - /);
    await expect(categoryPage.categoryPageHeader).toHaveText('Category Bravo');
    await expect(categoryPage.subCategoryList).toHaveCount(0);
    await expect(categoryPage.subCategoryLinks).toHaveCount(0);
    await expect(
      categoryPage.categoryPageIntroduction.getByRole('list'),
    ).toHaveCount(1);
  });

  test('one subcategory link', async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'empty',
    });

    await expect(categoryPage.categoryPageHeader).toHaveText('Empty');
    await expect(categoryPage.subCategoryList).toBeVisible();
    await expect(
      categoryPage.subCategoryList.getByRole('listitem'),
    ).toHaveCount(1);
    await expect(categoryPage.subCategoryLinks).toHaveCount(1);
    await expect(categoryPage.subCategoryLinks).toHaveText(['Empty']);
    await expect(categoryPage.subCategoryLinks).toHaveAttribute(
      'href',
      '/test-local-1/empty/empty',
    );
  });

  test('subcategories with icons use the supplied image URLs', async ({
    page,
  }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
    });

    const images = categoryPage.subCategoryLinks.locator('img');
    await expect(images).toHaveCount(2);
    await expect(images.nth(0)).toBeVisible();
    await expect(images.nth(0)).toHaveAttribute(
      'src',
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50'%3E%3Crect width='100' height='50' x='0' y='0' fill='%23ddd'%3E%3C/rect%3E%3C/svg%3E",
    );
    await expect(images.nth(1)).toBeVisible();
    await expect(images.nth(1)).toHaveAttribute(
      'src',
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 100'%3E%3Crect width='50' height='100' x='0' y='0' fill='%23ddd'%3E%3C/rect%3E%3C/svg%3E",
    );
  });

  test('subcategory without an icon uses the full transparent-placeholder URL', async ({
    page,
  }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'empty',
    });

    const image = categoryPage.subCategoryLinks.locator('img');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute(
      'src',
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    );
  });

  test('category with a description shows its introduction', async ({
    page,
  }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
    });

    await expect(categoryPage.categoryPageIntroduction).toBeVisible();
    await expect(categoryPage.categoryPageIntroduction).toHaveText(
      'Description of First Category.',
    );
  });

  test('category without a description has no introduction', async ({
    page,
  }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'empty',
    });

    await expect(page).toHaveTitle(/^Empty - /);
    await expect(categoryPage.categoryPageHeader).toHaveText('Empty');
    await expect(categoryPage.categoryPageIntroduction).toHaveCount(0);
  });

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

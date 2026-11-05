import { expect, test } from '@playwright/test';

import { SubCategoryPage } from '../pages/SubCategoryPage.mjs';

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
      'Sub-Category - Category Alpha - Test Local 1 - Helpful Information [ development ]',
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
      'Sub-Category - Category Alpha - Test Local 1 - Helpful Information [ development ]',
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
      'Sub-Category - Category Alpha - Test Local 1 - Helpful Information [ development ]',
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
      'Another Sub-Category - Category Alpha - Test Local 1 - Helpful Information [ development ]',
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
      'Empty - Empty - Test Local 1 - Helpful Information [ development ]',
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
      'Single Level - Single Level - Test Local 1 - Helpful Information [ development ]',
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
      'Q&As - Q&As - Test Local 1 - Helpful Information [ development ]',
    );

    await expect(subCategoryPage.pageHeading).toHaveText('Q&As');
    await expect(subCategoryPage.parentCategoryLink).toHaveText('＜ Q&As');
    await expect(subCategoryPage.parentCategoryLink).toHaveAttribute(
      'href',
      '/test-local-1/q-and-a-s',
    );
  });
});

import { expect, test } from '@playwright/test';
import { RegionPage } from 'e2e/pages/RegionPage';

test.describe('Region-page', () => {
  test('title and introduction', async ({ page }) => {
    const regionPage = new RegionPage(page);
    await regionPage.goto('test-local-1');

    await expect(regionPage.regionPageHeader).toBeVisible();
    await expect(regionPage.regionPageHeader).toHaveText([`Test/Example`]);
    await expect(regionPage.regionPageIntroduction).toBeVisible();
    await expect(regionPage.regionPageIntroduction).toHaveText(/\w+/);
  });

  test('introduction markdown-content', async ({ page }) => {
    const regionPage = new RegionPage(page);
    await regionPage.goto('test-local-1');

    // Multiple paragraphs
    await expect(
      regionPage.regionPageIntroduction.locator('p').nth(0),
    ).toHaveText(['This website is made to give helpful information...']);
    await expect(
      regionPage.regionPageIntroduction.locator('p').nth(1),
    ).toHaveText(
      `Multiple lines of text,
can be used.
With MarkDown and/or HTML content:`,
      { useInnerText: true },
    );

    // Styled text
    await expect(
      regionPage.regionPageIntroduction.locator('p').nth(1).getByRole('strong'),
    ).toHaveText(['Mark', 'Down']);
    await expect(
      regionPage.regionPageIntroduction.locator('p').nth(1).locator('b'),
    ).toHaveText('HTML');

    // List(s)
    await expect(regionPage.regionPageIntroduction.locator('ul')).toHaveCount(
      1,
    );
    await expect(
      regionPage.regionPageIntroduction.locator('ul li'),
    ).toHaveCount(4);
    await expect(regionPage.regionPageIntroduction.locator('ul li')).toHaveText(
      [
        'lists',
        'plain URL-links: https://example.org',
        'links ',
        'links with MarkDown in them',
      ],
      { useInnerText: true },
    );

    // Link(s)
    await expect(regionPage.regionPageIntroduction.locator('a')).toHaveCount(3);
    // eslint-disable-next-line no-loops/no-loops
    for (const link of await regionPage.regionPageIntroduction
      .locator('a')
      .all()) {
      await expect(link).toHaveAttribute('href', 'https://example.org');
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /external/);
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAttribute('rel', /noreferrer/);
    }
    await expect(
      regionPage.regionPageIntroduction.locator('a').first(),
    ).toHaveAttribute('rel', /x-plain-url/);

    // Headings
    await expect(regionPage.regionPageIntroduction.locator('h3')).toHaveText([
      'No level-1 Headings here',
      'Level 3+ Headings only here',
    ]);

    // Extra's
    await expect(regionPage.regionPageIntroduction.locator('hr')).toHaveCount(
      1,
    );
  });

  test('main categories', async ({ page }) => {
    const regionPage = new RegionPage(page);
    await regionPage.goto('test-local-1');

    await expect(regionPage.categoryList).toHaveText(
      [
        'Category Alpha',
        'Category Bravo',
        'Empty',
        'Single Level',
        'Q&As',
        'Missing Slug',
        'Duplicate Slug 1',
        'Duplicate Slug 2',
      ],
      { useInnerText: true },
    );
  });

  test('first category with icon/image', async ({ page }) => {
    const regionPage = new RegionPage(page);
    await regionPage.goto('test-local-1');

    await expect(regionPage.categoryList.first()).toBeVisible();
    await expect(regionPage.categoryList.first().locator('img')).toBeVisible();
    await expect(
      (
        await regionPage.categoryList.first().locator('img').getAttribute('src')
      ).startsWith('data:image/svg+xml,'),
    ).toBeTruthy();
  });

  test('deep-link of category with single sub-category', async ({ page }) => {
    const regionPage = new RegionPage(page);
    await regionPage.goto('test-local-1');

    expect(
      (
        await regionPage.categoryList
          .filter({ hasText: 'Single Level' })
          .getAttribute('href')
      ).endsWith('/single-level/single-level'),
    ).toBeTruthy();
  });
});

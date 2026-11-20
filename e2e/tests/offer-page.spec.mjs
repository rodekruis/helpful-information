import { expect, test } from '@playwright/test';

import { OfferPage } from '../pages/OfferPage.mjs';

/**
 * @param {import('@playwright/test').Page} page
 */
test.describe('Offer-page', () => {
  test('title and description', async ({ page }) => {
    const offerPage = new OfferPage(page);
    await offerPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
      offerSlug: 'the-servicename',
    });

    await expect(offerPage.offerPageHeader).toBeVisible();
    await expect(offerPage.offerPageHeader).toHaveText(['The Servicename']);
    await expect(offerPage.offerDescription).toBeVisible();
    await expect(offerPage.offerDescription).toContainText(
      'Provides this specific service.',
    );
    await expect(offerPage.offerDescription).toContainText(
      'Described with multiple lines of text.',
    );
  });

  test('all optional sub-headers with full details', async ({ page }) => {
    const offerPage = new OfferPage(page);
    await offerPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
      offerSlug: 'the-servicename',
    });

    await expect(
      offerPage.offerDetails.getByRole('heading', { level: 3 }),
    ).toHaveText([
      /Open Ma-Vr/,
      /Open Weekend/,
      /Need to Know/,
      /URLs/,
      /Elektronische post/,
      /Telefoon/,
      /Adres/,
      /Custom heading/,
    ]);
  });

  test('URLs section contains links with valid URLs', async ({ page }) => {
    const offerPage = new OfferPage(page);
    await offerPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
      offerSlug: 'the-servicename',
    });

    const section = offerPage.offerDetails
      .getByRole('heading', { level: 3, name: /URLs/ })
      .locator('..');
    const items = section.getByRole('link');

    await expect(items).toHaveCount(2);

    for (const item of await items.all()) {
      await expect(item).toBeVisible();

      const href = await item.getAttribute('href');
      expect(href).not.toBeNull();

      const parsedUrl = new URL(href ?? '');
      expect(['http:', 'https:']).toContain(parsedUrl.protocol);

      await expect(item).toHaveAttribute('href', /^https?:\/\//);
      await expect(item).toHaveAttribute('target', '_blank');
      await expect(item).toHaveAttribute('rel', /noopener/);
      await expect(item).toHaveAttribute('rel', /noreferrer/);
    }
  });

  test('E-mails section contains links with valid `mailto:` URLs', async ({
    page,
  }) => {
    const offerPage = new OfferPage(page);
    await offerPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
      offerSlug: 'the-servicename',
    });

    const section = offerPage.offerDetails
      .getByRole('heading', { level: 3, name: /Elektronische post/ })
      .locator('..');
    const items = section.getByRole('link');

    await expect(items).toHaveCount(2);

    for (const item of await items.all()) {
      await expect(item).toBeVisible();

      const href = await item.getAttribute('href');
      expect(href).not.toBeNull();

      const parsedUrl = new URL(href ?? '');
      expect(parsedUrl.protocol).toBe('mailto:');

      await expect(item).toHaveAttribute('href', /^mailto:/);
    }
  });

  test('Phone-numbers section contains links with valid `tel:` URLs', async ({
    page,
  }) => {
    const offerPage = new OfferPage(page);
    await offerPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
      offerSlug: 'the-servicename',
    });

    const section = offerPage.offerDetails
      .getByRole('heading', { level: 3, name: /Telefoon/ })
      .locator('..');
    const items = section.getByRole('link');

    await expect(items).toHaveCount(2);

    for (const item of await items.all()) {
      await expect(item).toBeVisible();

      const href = await item.getAttribute('href');
      expect(href).not.toBeNull();

      const parsedUrl = new URL(href ?? '');
      expect(parsedUrl.protocol).toBe('tel:');

      await expect(item).toHaveAttribute('href', /^tel:/);
    }
  });

  // Test: A Last updated date is shown
  test('Last updated date is shown', async ({ page }) => {
    const offerPage = new OfferPage(page);
    await offerPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
      offerSlug: 'the-servicename',
    });

    const lastUpdatedSection = offerPage.page.getByRole('time').locator('..');
    const lastUpdatedTime = lastUpdatedSection.getByRole('time');

    await expect(lastUpdatedSection).toBeVisible();
    await expect(lastUpdatedSection).toHaveText(/Last changed:/);
    await expect(lastUpdatedTime).toHaveAttribute(
      'datetime',
      /\d{4}-\d{2}-\d{2}/,
    );
    await expect(lastUpdatedTime).toHaveText(/\d{1,2}-\d{1,2}-\d{4}/);
  });

  test('optional sub-headers are hidden when values are missing', async ({
    page,
  }) => {
    const offerPage = new OfferPage(page);
    await offerPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
      offerSlug: 'another-service',
    });

    await expect(
      offerPage.offerDetails.getByRole('heading', { level: 3 }),
    ).toHaveText([/Open Ma-Vr/, /Open Weekend/, /URLs/, /Telefoon/, /Adres/]);
    await expect(
      offerPage.offerDetails.getByRole('heading', {
        level: 3,
        name: 'Need to Know',
      }),
    ).toHaveCount(0);
    await expect(
      offerPage.offerDetails.getByRole('heading', {
        level: 3,
        name: 'Elektronische post',
      }),
    ).toHaveCount(0);
  });

  test('single-level offer shows no optional detail sections', async ({
    page,
  }) => {
    const offerPage = new OfferPage(page);
    await offerPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'single-level',
      subCategorySlug: 'single-level',
      offerSlug: 'single-service',
    });

    await expect(offerPage.offerPageHeader).toBeVisible();
    await expect(offerPage.offerPageHeader).toHaveText(['Single Service']);
    await expect(offerPage.offerDescription).toBeVisible();
    await expect(offerPage.offerDescription).toContainText(
      'This is the only service in this sub-category.',
    );

    await expect(
      offerPage.offerDetails.getByRole('heading', { level: 3 }),
    ).toHaveCount(0);
  });

  test('offer without name', async ({ page }) => {
    const offerPage = new OfferPage(page);
    await offerPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'category-alpha',
      subCategorySlug: 'sub-category',
      offerSlug: 'offer-3',
    });

    await expect(offerPage.offerContainer).toBeVisible();
    await expect(offerPage.offerPageHeader).toHaveCount(0);
  });
});

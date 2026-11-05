import { expect, test } from '@playwright/test';

import { SubCategoryPage } from '../pages/SubCategoryPage.mjs';

/**
 * @typedef {import('@playwright/test').Locator} Locator
 * @typedef {import('../pages/SubCategoryPage.mjs').SubCategoryPage} SubCategoryPageObject
 */

/**
 * @param {SubCategoryPageObject} subCategoryPage
 */
const topLevelQuestionSummaries = (subCategoryPage) =>
  subCategoryPage.topLevelQAs.locator(':scope > details > summary');

/** @param {Locator} qaSet */
const questionDetails = (qaSet) => qaSet.locator(':scope > details');
/** @param {Locator} qaSet */
const questionSummary = (qaSet) =>
  questionDetails(qaSet).locator(':scope > summary');
/** @param {Locator} qaSet */
const questionAnswer = (qaSet) =>
  questionDetails(qaSet).locator(':scope > .q-a-set--content');
/** @param {Locator} qaSet */
const questionMarkdownAnswer = (qaSet) =>
  questionAnswer(qaSet).locator(':scope > div[markdown]');
/** @param {Locator} qaSet */
const childDetails = (qaSet) => qaSet.locator('details.is_child');
/** @param {Locator} qaSet */
const childQuestionSummaries = (qaSet) =>
  childDetails(qaSet).locator(':scope > summary');
/** @param {Locator} child */
const childAnswer = (child) => child.locator(':scope > .q-a-set--content');
/** @param {Locator} child */
const childMarkdownAnswer = (child) =>
  childAnswer(child).locator(':scope > div[markdown]');

test.describe('SubCategory page - Q&A listings', () => {
  test('lists the two matching top-level questions in order', async ({
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

    await expect(subCategoryPage.topLevelQAs).toHaveCount(2);
    await expect(topLevelQuestionSummaries(subCategoryPage)).toHaveText([
      'Test Question 1',
      'Test Question 2',
    ]);
  });

  test('shows each matching answer and hides it again when collapsed', async ({
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

    const firstQuestion = subCategoryPage.topLevelQAs.nth(0);
    const firstAnswer = questionAnswer(firstQuestion);
    await expect(firstAnswer).toBeHidden();
    await questionSummary(firstQuestion).click();
    await expect(firstAnswer).toContainText('Test answer 1.');

    const secondQuestion = subCategoryPage.topLevelQAs.nth(1);
    const secondAnswer = questionAnswer(secondQuestion);
    await questionSummary(secondQuestion).click();
    await expect(secondAnswer).toContainText('Test answer 2.');

    await questionSummary(firstQuestion).click();
    await expect(firstAnswer).toBeHidden();
    await expect(secondAnswer).toBeVisible();
  });

  test('lists one answered question on the single-level route', async ({
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

    await expect(subCategoryPage.topLevelQAs).toHaveCount(1);
    await expect(topLevelQuestionSummaries(subCategoryPage)).toHaveText(
      'Single Question',
    );
    await questionSummary(subCategoryPage.topLevelQAs).click();
    await expect(questionAnswer(subCategoryPage.topLevelQAs)).toContainText(
      'Single Answer',
    );
  });

  test('shows no questions on routes without matching questions', async ({
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
    await expect(subCategoryPage.topLevelQAs).toHaveCount(0);

    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'empty',
      subCategorySlug: 'empty',
    });
    await expect(page).toHaveTitle(
      'Empty - Empty - Test Local 1 - Helpful Information [ development ]',
    );
    await expect(subCategoryPage.topLevelQAs).toHaveCount(0);
  });

  test('lists parent and child questions in their expected order', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'q-and-a-s',
      subCategorySlug: 'q-and-a-s',
    });
    await expect(page).toHaveTitle(
      'Q&As - Q&As - Test Local 1 - Helpful Information [ development ]',
    );

    await expect(subCategoryPage.topLevelQAs).toHaveCount(6);
    await expect(topLevelQuestionSummaries(subCategoryPage)).toHaveText([
      'A question to test with.',
      'Sub-Question D (invalid parent)',
      '(Sub-)Question S (pointing to self)',
      'Another long-winding question that will run over multiple lines, with VLW(Very Long Words) or abbriviations and special ⚠️ characters etc.',
      'I need shelter for a few days',
      'Test',
    ]);
    await expect(
      childQuestionSummaries(subCategoryPage.topLevelQAs.nth(0)),
    ).toHaveText(['Sub-Question A', 'Sub-Quèstion B', 'Sub-Question C']);
    await expect(
      childQuestionSummaries(subCategoryPage.topLevelQAs.nth(2)),
    ).toHaveText(['(Sub-)Question T (pointing to self)', '(Sub-)Question U']);
    await expect(
      childQuestionSummaries(subCategoryPage.topLevelQAs.nth(3)),
    ).toHaveText('Sub-Question E');
    await expect(childDetails(subCategoryPage.topLevelQAs.nth(1))).toHaveCount(
      0,
    );
  });

  test('shows nested answers independently and retains sibling expansion', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'q-and-a-s',
      subCategorySlug: 'q-and-a-s',
    });
    await expect(page).toHaveTitle(
      'Q&As - Q&As - Test Local 1 - Helpful Information [ development ]',
    );

    const parent = subCategoryPage.topLevelQAs.nth(0);
    await questionSummary(parent).click();
    await expect(questionMarkdownAnswer(parent)).toContainText(
      'A short and concise answer.',
    );

    const firstChild = childDetails(parent).nth(0);
    const secondChild = childDetails(parent).nth(1);
    await firstChild.locator(':scope > summary').click();
    await expect(childMarkdownAnswer(firstChild)).toHaveText('Sub-Answer A');
    await secondChild.locator(':scope > summary').click();
    await expect(childMarkdownAnswer(secondChild)).toHaveText('Sûb-Answer B');
    const thirdChild = childDetails(parent).nth(2);
    await thirdChild.locator(':scope > summary').click();
    await expect(childMarkdownAnswer(thirdChild)).toHaveText('Sub-Answer C');

    await firstChild.locator(':scope > summary').click();
    await expect(childAnswer(firstChild)).toBeHidden();
    await expect(childAnswer(secondChild)).toBeVisible();
    await secondChild.locator(':scope > summary').click();
    await expect(childAnswer(secondChild)).toBeHidden();

    const selfReferencingParent = subCategoryPage.topLevelQAs.nth(2);
    await questionSummary(selfReferencingParent).click();
    const selfChild = childDetails(selfReferencingParent).nth(0);
    await selfChild.locator(':scope > summary').click();
    await expect(childMarkdownAnswer(selfChild)).toContainText(
      '(Sub-)Answer T',
    );
    const otherSelfChild = childDetails(selfReferencingParent).nth(1);
    await otherSelfChild.locator(':scope > summary').click();
    await expect(childMarkdownAnswer(otherSelfChild)).toContainText(
      '(Sub-)Answer U',
    );

    const longParent = subCategoryPage.topLevelQAs.nth(3);
    await questionSummary(longParent).click();
    const longChild = childDetails(longParent);
    await longChild.locator(':scope > summary').click();
    await expect(
      childMarkdownAnswer(longChild).locator('p').first(),
    ).toHaveText('Sub-Answer E');
    await expect(
      childMarkdownAnswer(longChild).getByRole('listitem'),
    ).toHaveText(['highlighted sub-question', 'non-hightlighted parent']);
  });

  test('renders rich answers, external links, and their correct question association', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'q-and-a-s',
      subCategorySlug: 'q-and-a-s',
    });
    await expect(page).toHaveTitle(
      'Q&As - Q&As - Test Local 1 - Helpful Information [ development ]',
    );

    const parent = subCategoryPage.topLevelQAs.nth(0);
    await questionSummary(parent).click();
    const answer = questionMarkdownAnswer(parent);

    await expect(answer.locator('p').first()).toHaveText(
      'A short and concise answer.',
    );
    await expect(answer.locator('p').nth(1).locator('strong')).toHaveText([
      'Mark',
      'Down',
    ]);
    await expect(answer.locator('p').nth(1).locator('b')).toHaveText('HTML');
    await expect(answer.getByRole('listitem')).toHaveText([
      'https://example.org/see-this-link-for-more-info',
      'Or this one: www.example.org',
      'Or another one: https://this.example.org/',
      'numbered lists',
      'links',
    ]);
    const externalLinks = answer.getByRole('link');
    await expect(externalLinks).toHaveCount(4);
    await expect(externalLinks.nth(0)).toHaveAttribute(
      'href',
      'https://example.org/see-this-link-for-more-info',
    );
    await expect(externalLinks.nth(1)).toHaveAttribute(
      'href',
      'http://www.example.org',
    );
    await expect(externalLinks.nth(2)).toHaveAttribute(
      'href',
      'https://this.example.org/',
    );
    await expect(externalLinks.nth(3)).toHaveAttribute(
      'href',
      'https://example.org',
    );
    await expect(
      answer.locator('a[target="_blank"][rel~="noopener"][rel~="noreferrer"]'),
    ).toHaveCount(4);

    const secondParent = subCategoryPage.topLevelQAs.nth(1);
    await questionSummary(secondParent).click();
    await expect(questionMarkdownAnswer(secondParent)).toContainText(
      'Sub-Answer D',
    );
  });

  test('shows updated dates only where the fixture provides them', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'q-and-a-s',
      subCategorySlug: 'q-and-a-s',
    });
    await expect(page).toHaveTitle(
      'Q&As - Q&As - Test Local 1 - Helpful Information [ development ]',
    );

    const parent = subCategoryPage.topLevelQAs.nth(0);
    await questionSummary(parent).click();
    await expect(questionDetails(parent).getByRole('time')).toHaveAttribute(
      'datetime',
      '2022-05-20',
    );
    await expect(questionDetails(parent).getByRole('time')).toHaveText(
      '20-05-2022',
    );

    const firstChild = childDetails(parent).nth(0);
    await firstChild.locator(':scope > summary').click();
    await expect(childDetails(parent).nth(0).getByRole('time')).toHaveCount(0);

    const datedChild = childDetails(parent).nth(2);
    await datedChild.locator(':scope > summary').click();
    await expect(datedChild.getByRole('time')).toHaveAttribute(
      'datetime',
      '2022-05-31',
    );
    await expect(datedChild.getByRole('time')).toHaveText('31-05-2022');

    const longParent = subCategoryPage.topLevelQAs.nth(3);
    await questionSummary(longParent).click();
    await expect(questionDetails(longParent).getByRole('time')).toHaveAttribute(
      'datetime',
      '2048-02-03',
    );
    await expect(questionDetails(longParent).getByRole('time')).toHaveText(
      '03-02-2048',
    );
  });

  test('preserves long question labels and special characters without truncation', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'q-and-a-s',
      subCategorySlug: 'q-and-a-s',
    });
    await expect(page).toHaveTitle(
      'Q&As - Q&As - Test Local 1 - Helpful Information [ development ]',
    );

    await expect(topLevelQuestionSummaries(subCategoryPage).nth(3)).toHaveText(
      'Another long-winding question that will run over multiple lines, with VLW(Very Long Words) or abbriviations and special ⚠️ characters etc.',
    );
    await expect(
      childQuestionSummaries(subCategoryPage.topLevelQAs.nth(3)),
    ).toHaveText('Sub-Question E');
  });

  test('keeps highlighted questions in fixture order and excludes hidden or unanswered questions', async ({
    page,
  }) => {
    const subCategoryPage = new SubCategoryPage(page);
    await subCategoryPage.goto({
      regionSlug: 'test-local-1',
      categorySlug: 'q-and-a-s',
      subCategorySlug: 'q-and-a-s',
    });
    await expect(page).toHaveTitle(
      'Q&As - Q&As - Test Local 1 - Helpful Information [ development ]',
    );

    await expect(topLevelQuestionSummaries(subCategoryPage)).toHaveText([
      'A question to test with.',
      'Sub-Question D (invalid parent)',
      '(Sub-)Question S (pointing to self)',
      'Another long-winding question that will run over multiple lines, with VLW(Very Long Words) or abbriviations and special ⚠️ characters etc.',
      'I need shelter for a few days',
      'Test',
    ]);
    await expect(
      subCategoryPage.pageContent.getByText('Question without Answer', {
        exact: true,
      }),
    ).toHaveCount(0);
    await expect(
      subCategoryPage.pageContent.getByText(
        '[DRAFT] Question without a final answer',
        {
          exact: true,
        },
      ),
    ).toHaveCount(0);

    const ordinaryQuestion = subCategoryPage.topLevelQAs.nth(5);
    await questionSummary(ordinaryQuestion).click();
    const ordinaryAnswer = questionMarkdownAnswer(ordinaryQuestion);
    await expect(ordinaryAnswer).toContainText(
      'If you want to do a suggestions, send us email via:',
    );
    await expect(
      ordinaryAnswer.getByRole('link', { name: 'hia@example.org' }),
    ).toHaveAttribute('href', 'mailto:hia@example.org');
  });
});

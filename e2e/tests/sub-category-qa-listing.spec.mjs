import { createRequire } from 'node:module';

import { expect, test } from '@playwright/test';

import { SubCategoryPage } from '../pages/SubCategoryPage.mjs';

/**
 * @typedef {import('@playwright/test').Locator} Locator
 * @typedef {import('../pages/SubCategoryPage.mjs').SubCategoryPage} SubCategoryPageObject
 */

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

const qaRows = readFixture('Q&As.json', [
  'ANSWER',
  'CATEGORY',
  'HIGHLIGHT',
  'PARENT',
  'QUESTION',
  'SLUG',
  'SUBCATEGORY',
  'UPDATED',
  'VISIBLE',
]);

const mainQuestionOne = requireFixtureRow(
  qaRows,
  'category-alpha/sub-category: Test Question 1',
  (row) =>
    row.CATEGORY === '1' &&
    row.SUBCATEGORY === '1' &&
    row.QUESTION === 'Test Question 1',
);
const mainQuestionTwo = requireFixtureRow(
  qaRows,
  'category-alpha/sub-category: Test Question 2',
  (row) =>
    row.CATEGORY === '1' &&
    row.SUBCATEGORY === '1' &&
    row.QUESTION === 'Test Question 2',
);
const qaRouteRows = qaRows.filter(
  (row) => row.CATEGORY === '5' && row.SUBCATEGORY === '5',
);
const parentQuestion = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: parent with three child questions',
  (row) => row.SLUG === 'test-parent-1',
);
const childQuestionA = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: Sub-Question A',
  (row) => row.QUESTION === 'Sub-Question A',
);
const childQuestionB = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: Sub-Question B',
  (row) => row.QUESTION === 'Sub-Quèstion B',
);
const childQuestionC = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: dated Sub-Question C',
  (row) => row.QUESTION === 'Sub-Question C',
);
const invalidParentQuestion = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: question with nonexistent parent',
  (row) => row.QUESTION === 'Sub-Question D (invalid parent)',
);
const selfReferencingQuestion = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: first self-referencing duplicate slug',
  (row) =>
    row.QUESTION === '(Sub-)Question S (pointing to self)' &&
    row.SLUG === 'test-self',
);
const duplicateSelfQuestion = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: second self-referencing duplicate slug',
  (row) => row.QUESTION === '(Sub-)Question T (pointing to self)',
);
const selfChildQuestion = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: Sub-Question U',
  (row) => row.QUESTION === '(Sub-)Question U',
);
const longQuestion = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: long question with child and future date',
  (row) => row.SLUG === 'test-2',
);
const longChildQuestion = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: Sub-Question E',
  (row) => row.QUESTION === 'Sub-Question E',
);
const highlightedQuestion = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: highlighted question',
  (row) => row.QUESTION === 'I need shelter for a few days',
);
const otherVisibleQuestion = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: visible Test question',
  (row) => row.QUESTION === 'Test',
);
const unansweredQuestion = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: question without answer',
  (row) => row.QUESTION === 'Question without Answer',
);
const hiddenQuestion = requireFixtureRow(
  qaRouteRows,
  'q-and-a-s: hidden draft question',
  (row) => row.QUESTION === '[DRAFT] Question without a final answer',
);

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
  test('lists the two matching top-level questions in fixture order', async ({
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
      mainQuestionOne.QUESTION,
      mainQuestionTwo.QUESTION,
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
    await expect(firstAnswer).toContainText(mainQuestionOne.ANSWER);

    const secondQuestion = subCategoryPage.topLevelQAs.nth(1);
    const secondAnswer = questionAnswer(secondQuestion);
    await questionSummary(secondQuestion).click();
    await expect(secondAnswer).toContainText(mainQuestionTwo.ANSWER);

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

  test('shows no questions for routes without matching fixture questions', async ({
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

  test('keeps parent and child questions in separate ordered lists', async ({
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
      parentQuestion.QUESTION,
      invalidParentQuestion.QUESTION,
      selfReferencingQuestion.QUESTION,
      longQuestion.QUESTION,
      highlightedQuestion.QUESTION,
      otherVisibleQuestion.QUESTION,
    ]);
    await expect(
      childQuestionSummaries(subCategoryPage.topLevelQAs.nth(0)),
    ).toHaveText([
      childQuestionA.QUESTION,
      childQuestionB.QUESTION,
      childQuestionC.QUESTION,
    ]);
    await expect(
      childQuestionSummaries(subCategoryPage.topLevelQAs.nth(2)),
    ).toHaveText([duplicateSelfQuestion.QUESTION, selfChildQuestion.QUESTION]);
    await expect(
      childQuestionSummaries(subCategoryPage.topLevelQAs.nth(3)),
    ).toHaveText(longChildQuestion.QUESTION);
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
    await expect(childMarkdownAnswer(firstChild)).toHaveText(
      childQuestionA.ANSWER,
    );
    await secondChild.locator(':scope > summary').click();
    await expect(childMarkdownAnswer(secondChild)).toHaveText(
      childQuestionB.ANSWER,
    );
    const thirdChild = childDetails(parent).nth(2);
    await thirdChild.locator(':scope > summary').click();
    await expect(childMarkdownAnswer(thirdChild)).toHaveText(
      childQuestionC.ANSWER,
    );

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
      duplicateSelfQuestion.ANSWER,
    );
    const otherSelfChild = childDetails(selfReferencingParent).nth(1);
    await otherSelfChild.locator(':scope > summary').click();
    await expect(childMarkdownAnswer(otherSelfChild)).toContainText(
      selfChildQuestion.ANSWER,
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
    for (const [index, href] of [
      'https://example.org/see-this-link-for-more-info',
      'http://www.example.org',
      'https://this.example.org/',
      'https://example.org',
    ].entries()) {
      await expect(externalLinks.nth(index)).toHaveAttribute('href', href);
    }
    for (const link of await externalLinks.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAttribute('rel', /noreferrer/);
    }

    const secondParent = subCategoryPage.topLevelQAs.nth(1);
    await questionSummary(secondParent).click();
    await expect(questionMarkdownAnswer(secondParent)).toContainText(
      invalidParentQuestion.ANSWER,
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
      parentQuestion.UPDATED,
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
      childQuestionC.UPDATED,
    );
    await expect(datedChild.getByRole('time')).toHaveText('31-05-2022');

    const longParent = subCategoryPage.topLevelQAs.nth(3);
    await questionSummary(longParent).click();
    await expect(questionDetails(longParent).getByRole('time')).toHaveAttribute(
      'datetime',
      longQuestion.UPDATED,
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
      longQuestion.QUESTION,
    );
    await expect(
      childQuestionSummaries(subCategoryPage.topLevelQAs.nth(3)),
    ).toHaveText(longChildQuestion.QUESTION);
    expect(longQuestion.QUESTION).toContain('⚠️');
  });

  test('keeps highlighted questions in fixture order and excludes hidden or unanswered questions', async ({
    page,
  }) => {
    expect(highlightedQuestion.HIGHLIGHT).toBe('Yes');
    expect(otherVisibleQuestion.HIGHLIGHT).toBe('');

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
      parentQuestion.QUESTION,
      invalidParentQuestion.QUESTION,
      selfReferencingQuestion.QUESTION,
      longQuestion.QUESTION,
      highlightedQuestion.QUESTION,
      otherVisibleQuestion.QUESTION,
    ]);
    await expect(
      subCategoryPage.pageContent.getByText(unansweredQuestion.QUESTION, {
        exact: true,
      }),
    ).toHaveCount(0);
    await expect(
      subCategoryPage.pageContent.getByText(hiddenQuestion.QUESTION, {
        exact: true,
      }),
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

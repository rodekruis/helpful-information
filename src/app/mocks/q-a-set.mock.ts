import type { QASet } from 'src/app/models/qa-set.model';

// All properties sorted alphabetically.
export const mockQASet1: QASet = {
  answer: 'Answer A',
  categoryID: 1,
  children: [],
  dateUpdated: null,
  id: 1,
  isHighlight: true,
  isVisible: true,
  question: 'Question A',
  slug: 'question-1',
  subCategoryID: 1,
};

// All properties sorted alphabetically.
export const mockQASet2with1SubQuestion: QASet = {
  answer: 'Answer B',
  categoryID: 1,
  children: [
    {
      answer: 'Answer B-1',
      categoryID: 1,
      children: [],
      dateUpdated: null,
      id: 3,
      isHighlight: false,
      isVisible: true,
      parentSlug: 'mock-question-b',
      question: 'SubQuestion B-1',
      slug: 'question-3',
      subCategoryID: 2,
    },
  ],
  dateUpdated: null,
  id: 2,
  isHighlight: false,
  isVisible: true,
  question: 'Question B',
  slug: 'mock-question-b',
  subCategoryID: 1,
};

import { QASet } from 'src/app/models/qa-set.model';

export const mockQASet1: QASet = {
  id: 1,
  categoryID: 1,
  subCategoryID: 1,
  isVisible: true,
  dateUpdated: null,
  isHighlight: true,
  question: 'Question A',
  answer: 'Answer A',
  slug: 'question-1',
  children: [],
};

export const mockQASet2with1SubQuestion: QASet = {
  id: 2,
  categoryID: 1,
  subCategoryID: 1,
  isVisible: true,
  dateUpdated: null,
  isHighlight: false,
  question: 'Question B',
  answer: 'Answer B',
  slug: 'mock-question-b',
  children: [
    {
      id: 3,
      categoryID: 1,
      subCategoryID: 2,
      isVisible: true,
      dateUpdated: null,
      isHighlight: false,
      question: 'SubQuestion B-1',
      answer: 'Answer B-1',
      slug: 'question-3',
      parentSlug: 'mock-question-b',
      children: [],
    },
  ],
};

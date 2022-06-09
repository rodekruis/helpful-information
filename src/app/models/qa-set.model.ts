export class QASet {
  id: number;
  categoryID: number;
  subCategoryID: number;
  isVisible: boolean;
  dateUpdated: Date | null;
  question: string;
  answer: string;
}

// These string-values should be used (somewhere) in the cells of the first row of the Q&As-sheet
// In the form of a 'hashtag', like: "The answer (can be multi-line text) #ANSWER"
// To support/enable some explanation/translation in the header-row for editors and to keep freedom in the column-order
export enum QACol {
  id = 'ID',
  subcategory = 'SUBCATEGORY',
  category = 'CATEGORY',
  visible = 'VISIBLE',
  updated = 'UPDATED',
  question = 'QUESTION',
  answer = 'ANSWER',
}

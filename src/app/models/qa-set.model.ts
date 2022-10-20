export class QASet {
  id: number;
  categoryID: number;
  categoryName?: string;
  subCategoryID: number;
  subCategoryName?: string;
  isVisible: boolean;
  isHighlight: boolean;
  dateUpdated: Date | null;
  slug?: string;
  parentSlug?: string;
  question: string;
  answer: string;
  children: QASet[];
}

export enum QACol {
  id = 'ID',
  subcategory = 'SUBCATEGORY',
  category = 'CATEGORY',
  visible = 'VISIBLE',
  highlight = 'HIGHLIGHT',
  updated = 'UPDATED',
  slug = 'SLUG',
  parent = 'PARENT',
  question = 'QUESTION',
  answer = 'ANSWER',
}

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

// These labels should be used anywhere in the sheets' column-header, prefixed with a `#`
// For example: "Unique URL-part (no spaces or special characters) #SLUG"
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

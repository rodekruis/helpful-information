// All properties sorted alphabetically.
export class QASet {
  answer: string;
  categoryID: number;
  categoryName?: string;
  categorySlug?: string;
  children: QASet[];
  dateUpdated: Date | null;
  id: number;
  isHighlight: boolean;
  isVisible: boolean;
  parentSlug?: string;
  question: string;
  slug: string;
  subCategoryID: number;
  subCategoryName?: string;
  subCategorySlug?: string;
}

// These labels should be used anywhere in the sheets' column-header, prefixed with a `#`
// For example: "Unique URL-part (no spaces or special characters) #SLUG"
// All properties sorted alphabetically.
export enum QACol {
  answer = 'ANSWER',
  category = 'CATEGORY',
  highlight = 'HIGHLIGHT',
  id = 'ID',
  parent = 'PARENT',
  question = 'QUESTION',
  slug = 'SLUG',
  subcategory = 'SUBCATEGORY',
  updated = 'UPDATED',
  visible = 'VISIBLE',
}

export class SubCategory {
  subCategoryID: number;
  subCategoryName: string;
  subCategoryIcon: string;
  subCategoryDescription?: string;
  subCategoryVisible: boolean;
  categoryID: number;
}

// These string-values should be used (somewhere) in the cells of the first row of the sheet
// In the form of a 'hashtag', like: "The answer (can be multi-line text) #ANSWER"
// To support/enable some explanation/translation in the header-row for editors and to keep freedom in the column-order
export enum SubCategoryCol {
  id = 'ID',
  name = 'NAME',
  icon = 'ICON',
  description = 'DESCRIPTION',
  visible = 'VISIBLE',
  category = 'CATEGORY',
}

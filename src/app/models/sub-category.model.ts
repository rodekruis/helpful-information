export class SubCategory {
  subCategoryID: number;
  subCategoryName: string;
  subCategoryIcon: string;
  subCategoryDescription?: string;
  subCategoryVisible: boolean;
  categoryID: number;
}

// These labels should be used anywhere in the sheets' column-header, prefixed with a `#`
// For example: "Sub-Category Description (can be multiple lines) #DESCRIPTION"
export enum SubCategoryCol {
  id = 'ID',
  name = 'NAME',
  icon = 'ICON',
  description = 'DESCRIPTION',
  visible = 'VISIBLE',
  category = 'CATEGORY',
}

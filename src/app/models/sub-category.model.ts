export type SubCategory = {
  subCategoryID: number;
  slug?: string;
  subCategoryName: string;
  subCategoryIcon: string;
  subCategoryDescription?: string;
  subCategoryVisible: boolean;
  categoryID: number;
  categorySlug?: string;
  categoryName?: string;
};

// These labels should be used anywhere in the sheets' column-header, prefixed with a `#`
// For example: "Sub-Category Description (can be multiple lines) #DESCRIPTION"
export enum SubCategoryCol {
  id = 'ID',
  slug = 'SLUG',
  name = 'NAME',
  icon = 'ICON',
  description = 'DESCRIPTION',
  visible = 'VISIBLE',
  category = 'CATEGORY',
}

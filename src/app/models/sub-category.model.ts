// All properties sorted alphabetically.
export type SubCategory = {
  categoryID: number;
  categoryName?: string;
  categorySlug?: string;
  slug?: string;
  subCategoryDescription?: string;
  subCategoryIcon: string;
  subCategoryID: number;
  subCategoryName: string;
  subCategoryVisible: boolean;
};

// These labels should be used anywhere in the sheets' column-header, prefixed with a `#`
// For example: "Sub-Category Description (can be multiple lines) #DESCRIPTION"
// All properties sorted alphabetically.
export enum SubCategoryCol {
  category = 'CATEGORY',
  description = 'DESCRIPTION',
  icon = 'ICON',
  id = 'ID',
  name = 'NAME',
  slug = 'SLUG',
  visible = 'VISIBLE',
}

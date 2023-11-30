// All properties sorted alphabetically.
export type Category = {
  categoryDescription?: string;
  categoryIcon: string;
  categoryID: number;
  categoryName: string;
  categoryVisible: boolean;
  slug?: string;
};

// These labels should be used anywhere in the sheets' column-header, prefixed with a `#`
// For example: "Category Icon (can be any URL) #ICON"
// All properties sorted alphabetically.
export enum CategoryCol {
  description = 'DESCRIPTION',
  icon = 'ICON',
  id = 'ID',
  name = 'NAME',
  slug = 'SLUG',
  visible = 'VISIBLE',
}

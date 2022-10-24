export class Category {
  categoryID: number;
  categoryName: string;
  categoryIcon: string;
  categoryDescription?: string;
  categoryVisible: boolean;
}

// These labels should be used anywhere in the sheets' column-header, prefixed with a `#`
// For example: "Category Icon (can be any URL) #ICON"
export enum CategoryCol {
  id = 'ID',
  name = 'NAME',
  icon = 'ICON',
  description = 'DESCRIPTION',
  visible = 'VISIBLE',
}

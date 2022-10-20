export class SubCategory {
  subCategoryID: number;
  subCategoryName: string;
  subCategoryIcon: string;
  subCategoryDescription?: string;
  subCategoryVisible: boolean;
  categoryID: number;
}

export enum SubCategoryCol {
  id = 'ID',
  name = 'NAME',
  icon = 'ICON',
  description = 'DESCRIPTION',
  visible = 'VISIBLE',
  category = 'CATEGORY',
}

export class Category {
  categoryID: number;
  categoryName: string;
  categoryIcon: string;
  categoryDescription?: string;
  categoryVisible: boolean;
}

export enum CategoryCol {
  id = 'ID',
  name = 'NAME',
  icon = 'ICON',
  description = 'DESCRIPTION',
  visible = 'VISIBLE',
}

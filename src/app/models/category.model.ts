export class Category {
  categoryID: number;
  categoryName: string;
  categoryIcon: string;
  categoryDescription?: string;
  categoryVisible: boolean;
}

// These string-values should be used (somewhere) in the cells of the first row of the Q&As-sheet
// In the form of a 'hashtag', like: "The answer (can be multi-line text) #ANSWER"
// To support/enable some explanation/translation in the header-row for editors and to keep freedom in the column-order
export enum CategoryCol {
  id = 'ID',
  name = 'NAME',
  icon = 'ICON',
  description = 'DESCRIPTION',
  visible = 'VISIBLE',
}

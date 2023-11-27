import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { Category } from 'src/app/models/category.model';
import type { Offer } from 'src/app/models/offer.model';
import type { QASet } from 'src/app/models/qa-set.model';
import type { SubCategory } from 'src/app/models/sub-category.model';

@Pipe({
  name: 'categoryFilter',
  standalone: true,
})
export class CategoryFilterPipe implements PipeTransform {
  transform(
    items: Array<SubCategory | Offer | QASet>,
    category: Category,
  ): any {
    if (!items || !category) {
      return items;
    }
    return items.filter((item) => item.categoryID === category.categoryID);
  }
}

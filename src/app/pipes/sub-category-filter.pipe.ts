import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { Offer } from 'src/app/models/offer.model';
import type { QASet } from 'src/app/models/qa-set.model';
import type { SubCategory } from 'src/app/models/sub-category.model';

@Pipe({
  name: 'subCategoryFilter',
  standalone: true,
})
export class SubCategoryFilterPipe implements PipeTransform {
  transform(items: (Offer | QASet)[], subCategory: SubCategory): any[] {
    if (!items || !subCategory) {
      return items;
    }
    return items.filter(
      (item) => item.subCategoryID === subCategory.subCategoryID,
    );
  }
}

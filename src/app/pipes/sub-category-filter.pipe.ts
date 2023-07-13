import { Pipe, PipeTransform } from '@angular/core';
import { Offer } from 'src/app/models/offer.model';
import { QASet } from 'src/app/models/qa-set.model';
import { SubCategory } from 'src/app/models/sub-category.model';

@Pipe({
  name: 'subCategoryFilter',
  standalone: true,
})
export class SubCategoryFilterPipe implements PipeTransform {
  transform(items: Array<Offer | QASet>, subCategory: SubCategory): any {
    if (!items || !subCategory) {
      return items;
    }
    return items.filter(
      (item) => item.subCategoryID === subCategory.subCategoryID,
    );
  }
}

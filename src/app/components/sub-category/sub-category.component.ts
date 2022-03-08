import { Component, Input } from '@angular/core';
import { SubCategory } from 'src/app/models/sub-category.model';

@Component({
  selector: 'sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss'],
})
export class SubCategoryComponent {
  @Input()
  subCategory: SubCategory;

  @Input()
  showBottomDescription = false;

  @Input()
  referralSubCategoryButtonLabel = 'Click for Info';

  constructor() {}
}

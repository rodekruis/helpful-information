import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  @Input()
  public baseUrl: string = '';

  @Input()
  item: {
    categoryID?: number;
    categoryName?: string;
    subCategoryID?: number;
    subCategoryName?: string;
  };

  constructor() {}
}

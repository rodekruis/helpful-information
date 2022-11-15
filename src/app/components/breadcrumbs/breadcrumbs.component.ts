import { Component, Input } from '@angular/core';
import { QASet } from 'src/app/models/qa-set.model';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  @Input()
  public baseUrl: string = '';

  @Input()
  item: QASet;

  constructor() {}
}

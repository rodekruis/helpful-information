import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Offer } from 'src/app/models/offer.model';
import { QASet } from 'src/app/models/qa-set.model';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class BreadcrumbsComponent {
  @Input()
  public baseUrl: string = '';

  @Input()
  public item:
    | {
        categoryID?: number;
        categorySlug?: string;
        categoryName?: string;
        subCategoryID?: number;
        subCategorySlug?: string;
        subCategoryName?: string;
      }
    | Offer
    | QASet;

  constructor() {}
}

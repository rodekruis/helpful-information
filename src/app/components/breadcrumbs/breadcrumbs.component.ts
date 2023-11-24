import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { Offer } from 'src/app/models/offer.model';
import { QASet } from 'src/app/models/qa-set.model';
import { LoggingService } from 'src/app/services/logging.service';

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

  constructor(private loggingService?: LoggingService) {}

  public click(categorySlug: string, subCategorySlug?: string) {
    if (!this.loggingService) {
      return;
    }
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      subCategorySlug
        ? LoggingEvent.BreadcrumbSubCategory
        : LoggingEvent.BreadcrumbCategory,
      {
        categorySlug: categorySlug,
        subCategorySlug: subCategorySlug ? subCategorySlug : undefined,
      },
    );
  }
}

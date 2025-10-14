import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import type { Offer } from 'src/app/models/offer.model';
import type { QASet } from 'src/app/models/qa-set.model';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css'],
  imports: [RouterLink],
})
export class BreadcrumbsComponent {
  private loggingService = inject(LoggingService);

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

  public click(categorySlug: string, subCategorySlug?: string) {
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

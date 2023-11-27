import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import type { SubCategory } from 'src/app/models/sub-category.model';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
  selector: 'app-sub-category-link',
  templateUrl: './sub-category-link.component.html',
  styleUrls: ['./sub-category-link.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export class SubCategoryLinkComponent {
  @Input()
  subCategory: SubCategory;

  constructor(private loggingService?: LoggingService) {}

  public click() {
    if (!this.loggingService) {
      return;
    }
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.SubCategoryClick,
      {
        categoryID: this.subCategory.categoryID,
        categorySlug: this.subCategory.categorySlug
          ? this.subCategory.categorySlug
          : '',
        category: this.subCategory.categoryName,
        subCategoryID: this.subCategory.subCategoryID,
        subCategorySlug: this.subCategory.slug ? this.subCategory.slug : '',
        subCategory: this.subCategory.subCategoryName,
      },
    );
  }
}

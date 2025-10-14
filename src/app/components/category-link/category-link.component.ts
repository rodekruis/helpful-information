import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Category } from 'src/app/models/category.model';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import type { SubCategory } from 'src/app/models/sub-category.model';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
  selector: 'app-category-link',
  templateUrl: './cateogry-link.component.html',
  styleUrls: ['./cateogry-link.component.css'],
  imports: [RouterLink],
})
export class CategoryLinkComponent {
  private loggingService = inject(LoggingService);

  @Input()
  category: Category;

  @Input()
  onlyChildSubCategory: SubCategory;

  public click(category: Category) {
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.CategoryClick,
      {
        categoryID: category.categoryID,
        categorySlug: category.slug ? category.slug : '',
        category: category.categoryName,
      },
    );
  }
}

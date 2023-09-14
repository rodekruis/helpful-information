import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { SubCategory } from 'src/app/models/sub-category.model';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
  selector: 'app-category-link',
  templateUrl: './cateogry-link.component.html',
  styleUrls: ['./cateogry-link.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class CategoryLinkComponent {
  @Input()
  category: Category;

  @Input()
  onlyChildSubCategory: SubCategory;

  constructor(private loggingService?: LoggingService) {}

  public click(category: Category) {
    if (!this.loggingService) {
      return;
    }
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

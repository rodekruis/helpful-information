import { Component, Input } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { SubCategory } from 'src/app/models/sub-category.model';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss'],
})
export class SubCategoryComponent {
  @Input()
  subCategory: SubCategory;

  @Input()
  category: Category;

  constructor(private loggingService: LoggingService) {}

  public click() {
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.SubCategoryClick,
      {
        categoryID: this.category.categoryID,
        category: this.category.categoryName,
        subCategoryID: this.subCategory.subCategoryID,
        subCategory: this.subCategory.subCategoryName,
      },
    );
  }
}

import { Component, Input } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { SubCategory } from 'src/app/models/sub-category.model';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
  selector: 'app-link-tile',
  templateUrl: './link-tile.component.html',
  styleUrls: ['./link-tile.component.scss'],
})
export class LinkTileComponent {
  @Input()
  category: Category;

  @Input()
  subCategory: SubCategory;

  constructor(private loggingService: LoggingService) {}

  public click(category: Category) {
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.CategoryClick,
      {
        categoryID: category.categoryID,
        category: category.categoryName,
      },
    );
  }
}

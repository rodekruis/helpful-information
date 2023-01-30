import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { SubCategory } from 'src/app/models/sub-category.model';
import { LoggingService } from 'src/app/services/logging.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-link',
  templateUrl: './cateogry-link.component.html',
  styleUrls: ['./cateogry-link.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class CategoryLinkComponent {
  public useUrlSlugs = environment.useUrlSlugs;

  @Input()
  category: Category;

  @Input()
  onlyChildSubCategory: SubCategory;

  constructor(private loggingService: LoggingService) {}

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

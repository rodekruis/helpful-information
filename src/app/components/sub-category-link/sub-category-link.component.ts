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
  selector: 'app-sub-category-link',
  templateUrl: './sub-category-link.component.html',
  styleUrls: ['./sub-category-link.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class SubCategoryLinkComponent {
  public useUrlSlugs = environment.useUrlSlugs;

  @Input()
  subCategory: SubCategory;

  @Input()
  category: Category;

  constructor(private loggingService?: LoggingService) {}

  public click() {
    if (!this.loggingService) {
      return;
    }
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.SubCategoryClick,
      {
        categoryID: this.category.categoryID,
        categorySlug: this.category.slug ? this.category.slug : '',
        category: this.category.categoryName,
        subCategoryID: this.subCategory.subCategoryID,
        subCategorySlug: this.subCategory.slug ? this.subCategory.slug : '',
        subCategory: this.subCategory.subCategoryName,
      },
    );
  }
}

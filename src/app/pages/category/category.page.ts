import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SubCategoryLinkComponent } from 'src/app/components/sub-category-link/sub-category-link.component';
import { Category } from 'src/app/models/category.model';
import { SlugPrefix } from 'src/app/models/slug-prefix.enum';
import { SubCategory } from 'src/app/models/sub-category.model';
import { OffersService } from 'src/app/services/offers.service';
import { getLegacyID } from 'src/app/shared/utils';

@Component({
  selector: 'app-category-page',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [CommonModule, SubCategoryLinkComponent],
})
export class CategoryPageComponent implements OnInit {
  private region: string;

  @Input()
  public category: Category;

  @Input()
  public categories: Category[];

  @Input()
  public subCategories: SubCategory[];

  constructor(
    private route: ActivatedRoute,
    private offersService: OffersService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.handleRouteParams(params);
    });
  }

  private async handleRouteParams(params: Params) {
    let categorySlug = params.categorySlug;
    let legacyCategoryID = getLegacyID(categorySlug, SlugPrefix.category);

    this.region = params.region;

    if (!this.region && this.route.snapshot.parent) {
      this.region = this.route.snapshot.parent.params.region;
    }

    if (!this.region) return;

    if (!this.categories) {
      this.categories = await this.offersService.getCategories(this.region);
    }

    if (!this.categories) return;

    if (!this.category) {
      this.category = this.categories.find((category) => {
        return (
          category.slug === categorySlug ||
          category.categoryID === legacyCategoryID
        );
      });
    }

    if (!this.category) return;

    if (!this.subCategories) {
      this.subCategories = await this.offersService.getSubCategories(
        this.region,
      );

      if (this.subCategories) {
        this.subCategories = this.subCategories.filter((subCategory) => {
          return subCategory.categoryID === this.category.categoryID;
        });
      }
    }
  }
}
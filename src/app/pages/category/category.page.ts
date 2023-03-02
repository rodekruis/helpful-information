import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { SubCategoryLinkComponent } from 'src/app/components/sub-category-link/sub-category-link.component';
import { Category } from 'src/app/models/category.model';
import { SlugPrefix } from 'src/app/models/slug-prefix.enum';
import { SubCategory } from 'src/app/models/sub-category.model';
import { CategoryFilterPipe } from 'src/app/pipes/category-filter.pipe';
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { getLegacyID } from 'src/app/shared/utils';

@Component({
  selector: 'app-category-page',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SubCategoryLinkComponent,
    CategoryFilterPipe,
    MarkdownModule,
  ],
})
export default class CategoryPageComponent implements OnInit {
  private region: string;

  @Input()
  public category: Category;

  @Input()
  public subCategories: SubCategory[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offersService: OffersService,
    private pageMeta: PageMetaService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.handleRouteParams(params);
    });
  }

  private async handleRouteParams(params: Params) {
    this.region = params.region;

    if (!this.region && this.route.snapshot.parent) {
      this.region = this.route.snapshot.parent.params.region;
    }

    if (!this.region) return;

    if (!this.category) {
      this.category = await this.offersService.findCategory({
        region: this.region,
        categoryID: getLegacyID(params.categorySlug, SlugPrefix.category),
        categorySlug: params.categorySlug,
      });
    }

    if (!this.category) {
      this.router.navigate([this.region]);
      return;
    }

    if (!this.subCategories) {
      this.subCategories = await this.offersService.getAllSubCategories(
        this.region,
      );
    }

    this.pageMeta.setTitle({
      categoryName: this.category.categoryName,
    });

    this.pageMeta.setCanonicalUrl({
      region: this.region,
      categorySlug: this.category.slug,
    });

    // Upgrade ID-based slug(s) to real slug(s)
    if (params.categorySlug !== this.category.slug) {
      this.router.navigate([this.region, this.category.slug], {
        replaceUrl: true,
      });
    }
  }
}

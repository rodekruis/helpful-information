import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { LastUpdatedTimeComponent } from 'src/app/components/last-updated-time/last-updated-time.component';
import { OfferLinkComponent } from 'src/app/components/offer-link/offer-link.component';
import { QASetComponent } from 'src/app/components/q-a-set/q-a-set.component';
import { Category } from 'src/app/models/category.model';
import { Offer } from 'src/app/models/offer.model';
import { QASet } from 'src/app/models/qa-set.model';
import { SlugPrefix } from 'src/app/models/slug-prefix.enum';
import { SubCategory } from 'src/app/models/sub-category.model';
import { CategoryFilterPipe } from 'src/app/pipes/category-filter.pipe';
import { SubCategoryFilterPipe } from 'src/app/pipes/sub-category-filter.pipe';
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { getLegacyID } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sub-category-page',
  templateUrl: './sub-category.page.html',
  styleUrls: ['./sub-category.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    OfferLinkComponent,
    QASetComponent,
    LastUpdatedTimeComponent,
    CategoryFilterPipe,
    SubCategoryFilterPipe,
  ],
})
export class SubCategoryPageComponent implements OnInit {
  private region: string;

  public useQandAs = environment.useQandAs;

  @Input()
  public category: Category;

  @Input()
  public subCategory: SubCategory;

  @Input()
  public offers: Offer[];
  @Input()
  public qaSets: QASet[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offersService: OffersService,
    private pageMeta: PageMetaService,
  ) {}

  ngOnInit() {
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

    if (!this.subCategory) {
      this.subCategory = await this.offersService.findSubCategory({
        region: this.region,
        categoryID: this.category.categoryID,
        categorySlug: this.category.slug,
        subCategorySlug: params.subCategorySlug,
        subCategoryID: getLegacyID(
          params.subCategorySlug,
          SlugPrefix.subCategory,
        ),
      });
    }

    if (!this.subCategory) {
      this.router.navigate([this.region, this.category.slug]);
      return;
    }

    if (!this.offers) {
      this.offers = await this.offersService.getOffers(this.region);
    }

    if (environment.useQandAs && !this.qaSets) {
      this.qaSets = await this.offersService.getQAs(this.region);
    }

    this.pageMeta.setTitle({
      subCategoryName: this.subCategory.subCategoryName,
      categoryName: this.category.categoryName,
    });

    // Upgrade ID-based slug(s) to real slug(s)
    if (params.subCategorySlug !== this.subCategory.slug) {
      this.router.navigate(
        [this.region, this.category.slug, this.subCategory.slug],
        {
          replaceUrl: true,
        },
      );
    }
  }
}

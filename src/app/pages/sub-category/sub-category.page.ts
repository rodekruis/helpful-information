import { NgFor, NgIf } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import type { Params } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FeedbackLinkComponent } from 'src/app/components/feedback-link/feedback-link.component';
import { LastUpdatedTimeComponent } from 'src/app/components/last-updated-time/last-updated-time.component';
import { OfferLinkComponent } from 'src/app/components/offer-link/offer-link.component';
import { ParentLinkComponent } from 'src/app/components/parent-link/parent-link.component';
import { QASetComponent } from 'src/app/components/q-a-set/q-a-set.component';
import type { Category } from 'src/app/models/category.model';
import type { Offer } from 'src/app/models/offer.model';
import type { QASet } from 'src/app/models/qa-set.model';
import type { RegionData } from 'src/app/models/region-data';
import { SlugPrefix } from 'src/app/models/slug-prefix.enum';
import type { SubCategory } from 'src/app/models/sub-category.model';
import { CategoryFilterPipe } from 'src/app/pipes/category-filter.pipe';
import { SubCategoryFilterPipe } from 'src/app/pipes/sub-category-filter.pipe';
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { getLegacyID } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sub-category-page',
  templateUrl: './sub-category.page.html',
  styleUrls: ['./sub-category.page.css'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    OfferLinkComponent,
    QASetComponent,
    LastUpdatedTimeComponent,
    FeedbackLinkComponent,
    CategoryFilterPipe,
    SubCategoryFilterPipe,
    MarkdownModule,
    ParentLinkComponent,
  ],
})
export default class SubCategoryPageComponent implements OnInit {
  public region: string;
  public regionData: RegionData;

  public useOffers = environment.useOffers;
  public useQandAs = environment.useQandAs;

  @Input()
  public category: Category;

  @Input()
  public subCategory: SubCategory;

  @Input()
  public offers: Offer[];
  public offerChapters: Offer[][];

  @Input()
  public qaSets: QASet[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offersService: OffersService,
    private regionDataService: RegionDataService,
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

    if (this.useOffers && !this.offers) {
      this.offers = (await this.offersService.getOffers(this.region)).filter(
        (offer) =>
          offer.categoryID === this.category.categoryID &&
          offer.subCategoryID === this.subCategory.subCategoryID,
      );

      // Slice all Offers into OfferSets by chapterName
      const offerSets = new Map<string, Offer[]>();
      this.offers.forEach((offer) => {
        if (!offerSets.has(offer.chapterName)) {
          offerSets.set(offer.chapterName, []);
        }
        offerSets.get(offer.chapterName).push(offer);
      });
      this.offerChapters = Array.from(offerSets.values());
    }

    if (this.useQandAs && !this.qaSets) {
      this.qaSets = await this.offersService.getQAs(this.region);
    }

    this.regionData = await this.regionDataService.getData(this.region);

    this.pageMeta.setTitle({
      subCategoryName: this.subCategory.subCategoryName,
      categoryName: this.subCategory.categoryName,
      region: this.region,
    });

    this.pageMeta.setCanonicalUrl({
      region: this.region,
      categorySlug: this.subCategory.categorySlug,
      subCategorySlug: this.subCategory.slug,
    });

    // Upgrade ID-based slug(s) to real slug(s)
    if (params.subCategorySlug !== this.subCategory.slug) {
      this.router.navigate(
        [this.region, this.subCategory.categorySlug, this.subCategory.slug],
        {
          replaceUrl: true,
        },
      );
    }
  }
}

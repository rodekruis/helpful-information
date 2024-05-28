import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import type { Params } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackLinkComponent } from 'src/app/components/feedback-link/feedback-link.component';
import { LastUpdatedTimeComponent } from 'src/app/components/last-updated-time/last-updated-time.component';
import { OfferComponent } from 'src/app/components/offer/offer.component';
import { ParentLinkComponent } from 'src/app/components/parent-link/parent-link.component';
import type { Offer } from 'src/app/models/offer.model';
import type { RegionData } from 'src/app/models/region-data';
import { SlugPrefix } from 'src/app/models/slug-prefix.enum';
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { getLegacyID } from 'src/app/shared/utils';

@Component({
  selector: 'app-offer-page',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.css'],
  standalone: true,
  imports: [
    OfferComponent,
    LastUpdatedTimeComponent,
    FeedbackLinkComponent,
    ParentLinkComponent,
  ],
})
export default class OfferPageComponent implements OnInit {
  public region: string;
  public regionData: RegionData;

  @Input()
  public offer: Offer;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private regionDataService: RegionDataService,
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

    this.regionData = await this.regionDataService.getData(this.region);

    this.pageMeta.setDirection(this.regionData.localeDirection);
    this.pageMeta.setLanguage(this.regionData.localeLanguage);

    if (!this.offer) {
      this.offer = await this.offersService.findOffer({
        region: this.region,
        categoryID: getLegacyID(params.categorySlug, SlugPrefix.category),
        categorySlug: params.categorySlug,
        subCategoryID: getLegacyID(
          params.subCategorySlug,
          SlugPrefix.subCategory,
        ),
        subCategorySlug: params.subCategorySlug,
        offerID: getLegacyID(params.offerSlug, SlugPrefix.offer),
        offerSlug: params.offerSlug,
      });
    }
    if (!this.offer) {
      this.router.navigate([
        this.region,
        params.categorySlug,
        params.subCategorySlug,
      ]);
      return;
    }

    this.pageMeta.setTitle({
      offerName: this.offer.offerName ? this.offer.offerName : '',
      subCategoryName: this.offer.subCategoryName,
      categoryName: this.offer.categoryName,
      region: this.region,
    });

    this.pageMeta.setCanonicalUrl({
      region: this.region,
      categorySlug: this.offer.categorySlug,
      subCategorySlug: this.offer.subCategorySlug,
      offerSlug: this.offer.slug,
    });

    // Upgrade ID-based slug(s) to real slug(s)
    if (params.offerSlug !== this.offer.slug) {
      this.router.navigate(
        [
          this.region,
          this.offer.categorySlug,
          this.offer.subCategorySlug,
          this.offer.slug,
        ],
        {
          replaceUrl: true,
        },
      );
    }
  }
}

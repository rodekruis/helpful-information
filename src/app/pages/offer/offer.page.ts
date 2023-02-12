import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/components/breadcrumbs/breadcrumbs.component';
import { LastUpdatedTimeComponent } from 'src/app/components/last-updated-time/last-updated-time.component';
import { OfferComponent } from 'src/app/components/offer/offer.component';
import { Offer } from 'src/app/models/offer.model';
import { SlugPrefix } from 'src/app/models/slug-prefix.enum';
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { getLegacyID } from 'src/app/shared/utils';

@Component({
  selector: 'app-offer-page',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    BreadcrumbsComponent,
    OfferComponent,
    LastUpdatedTimeComponent,
  ],
})
export class OfferPageComponent implements OnInit {
  public region: string;

  @Input()
  public offer: Offer;

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

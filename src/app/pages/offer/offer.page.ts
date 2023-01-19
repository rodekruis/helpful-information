import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/components/breadcrumbs/breadcrumbs.component';
import { OfferComponent } from 'src/app/components/offer/offer.component';
import { Category } from 'src/app/models/category.model';
import { Offer } from 'src/app/models/offer.model';
import { QASet } from 'src/app/models/qa-set.model';
import { SlugPrefix } from 'src/app/models/slug-prefix.enum';
import { SubCategory } from 'src/app/models/sub-category.model';
import { OffersService } from 'src/app/services/offers.service';
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
  ],
})
export class OfferPageComponent implements OnInit {
  public region: string;

  @Input()
  public category: Category;

  @Input()
  public subCategory: SubCategory;

  @Input()
  public categories: Category[];
  @Input()
  public subCategories: SubCategory[];
  @Input()
  public offers: Offer[];
  @Input()
  public qaSets: QASet[];

  @Input()
  public offer: Offer;

  constructor(
    private route: ActivatedRoute,
    private offersService: OffersService,
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

    let offerSlug = params.offerSlug;
    let legacyOfferID = getLegacyID(offerSlug, SlugPrefix.offer);

    if (!this.offers) {
      this.offers = await this.offersService.getOffers(this.region);
    }

    if (!this.offer) {
      this.offer = this.offers.find((offer: Offer) => {
        return offer.slug === offerSlug || offer.offerID === legacyOfferID;
      });
    }
  }
}

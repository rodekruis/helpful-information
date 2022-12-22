import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OfferLinkComponent } from 'src/app/components/offer-link/offer-link.component';
import { Category } from 'src/app/models/category.model';
import { Offer } from 'src/app/models/offer.model';
import { QASet } from 'src/app/models/qa-set.model';
import { ReferralPageData } from 'src/app/models/referral-page-data';
import { SlugPrefix } from 'src/app/models/slug-prefix.enum';
import { SubCategory } from 'src/app/models/sub-category.model';
import { OffersService } from 'src/app/services/offers.service';
import { SharedModule } from 'src/app/shared/shared.module';
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
    SharedModule,
    IonicModule,
    OfferLinkComponent,
  ],
})
export class SubCategoryPageComponent implements OnInit {
  private region: string;

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

  public referralPageData: ReferralPageData;

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
    let categorySlug = params.categorySlug;
    let legacyCategoryID = getLegacyID(categorySlug, SlugPrefix.category);

    let subCategorySlug = params.subCategorySlug;
    let legacySubCategoryID = getLegacyID(
      subCategorySlug,
      SlugPrefix.subCategory,
    );

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
    if (!this.subCategories) return;

    if (!this.subCategory) {
      this.subCategory = this.subCategories.find((subCategory) => {
        return (
          subCategory.slug === subCategorySlug ||
          subCategory.subCategoryID === legacySubCategoryID
        );
      });
    }

    if (!this.subCategory) return;

    if (!this.offers) {
      this.offers = await this.offersService.getOffers(this.region);
    }

    if (environment.useQandAs && !this.qaSets) {
      this.qaSets = await this.offersService.getQAs(this.region);
    }
  }
}

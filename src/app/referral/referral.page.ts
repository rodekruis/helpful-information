import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { Offer } from 'src/app/models/offer.model';
import { ReferralPageData } from 'src/app/models/referral-page-data';
import { SubCategory } from 'src/app/models/sub-category.model';
import { LastUpdatedTimeService } from 'src/app/services/last-updated-time.service';
import { LoggingService } from 'src/app/services/logging.service';
import { LogoService } from 'src/app/services/logo.service';
import { OffersService } from 'src/app/services/offers.service';
import { ReferralPageDataService } from 'src/app/services/referral-page-data.service';
import { environment } from 'src/environments/environment';
import { QASet } from '../models/qa-set.model';

@Component({
  selector: 'app-referral',
  templateUrl: 'referral.page.html',
  styleUrls: ['referral.page.scss'],
})
export class ReferralPageComponent implements OnInit {
  public region: string;
  public regions: string[] = environment.regions.trim().split(/\s*,\s*/);
  public regionsLabels: string[] = environment.regionsLabels
    .trim()
    .split(/\s*,\s*/);

  public offers: Offer[];
  public qaSets: QASet[];
  public categories: Category[];
  public subCategories: SubCategory[];

  public category: Category;
  public subCategory: SubCategory;
  public offer: Offer;

  public referralPageData: ReferralPageData = {};

  public readonly rootHref: string = '/';

  public loading = false;

  public pageHeader = environment.mainPageHeader;
  public pageIntroduction = environment.mainPageIntroduction;

  constructor(
    public offersService: OffersService,
    private route: ActivatedRoute,
    private router: Router,
    private loggingService: LoggingService,
    private referralPageDataService: ReferralPageDataService,
    private lastUpdatedTimeService: LastUpdatedTimeService,
    private titleService: Title,
    private logoService: LogoService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.region = params.region;
      this.loadReferralData();
    });
  }

  public getRegionHref() {
    return this.rootHref + this.region;
  }

  public isSupportedRegion() {
    return this.region && this.regions.includes(this.region);
  }

  public hasDataToShow(): boolean {
    // When environment.useQandAs == false, Offers need to be available
    // When environment.useQandAs == true, Offers OR Q&A-sets can be empty
    return (
      this.categories &&
      this.categories.some((item) => item.categoryVisible) &&
      this.subCategories &&
      this.subCategories.some((item) => item.subCategoryVisible) &&
      ((environment.useQandAs === false &&
        this.offers &&
        this.offers.some((item) => item.offerVisible)) ||
        (environment.useQandAs &&
          !(
            (!this.offers || !this.offers.some((item) => item.offerVisible)) &&
            (!this.qaSets || !this.qaSets.some((item) => item.isVisible))
          )))
    );
  }

  private async loadReferralData() {
    if (this.isSupportedRegion()) {
      this.loading = true;
      this.referralPageData =
        await this.referralPageDataService.getReferralPageData(this.region);

      this.titleService.setTitle(this.referralPageData.referralPageTitle);

      this.logoService.setLogo(this.referralPageData.referralPageLogo);

      this.lastUpdatedTimeService.setLastUpdatedTime(
        this.referralPageData.referralLastUpdatedTime,
      );

      this.categories = await this.offersService.getCategories(this.region);
      this.subCategories = await this.offersService.getSubCategories(
        this.region,
      );
      this.offers = await this.offersService.getOffers(this.region);

      if (environment.useQandAs) {
        this.qaSets = await this.offersService.getQAs(this.region);
      }

      this.readQueryParams();

      this.loading = false;
    } else {
      this.router.navigate([this.rootHref]);
    }
  }

  private readQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if ('categoryID' in params) {
        this.category = this.categories.find(
          (category) => category.categoryID === Number(params.categoryID),
        );
      }
      if ('subCategoryID' in params) {
        this.subCategory = this.subCategories.find(
          (subCategory) =>
            subCategory.subCategoryID === Number(params.subCategoryID),
        );
      }
      if ('offerID' in params) {
        this.offer = this.offers.find(
          (offer) => offer.offerID === Number(params.offerID),
        );
      }
    });
  }

  public getNextSubCategory(category: Category) {
    const subCategories: SubCategory[] = this.subCategories.filter(
      (subCategory: SubCategory) => {
        return subCategory.categoryID === category.categoryID;
      },
    );
    return subCategories.length === 1 ? subCategories[0] : null;
  }

  public clickCategory(category: Category, isBack: boolean = false) {
    this.category = category;
    this.subCategory = isBack ? null : this.getNextSubCategory(category);
    this.offer = null;
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.CategoryClick,
      this.getLogProperties(isBack),
    );
    this.router.navigate([this.getRegionHref()], {
      queryParams: {
        categoryID: this.category.categoryID,
        subCategoryID: this.subCategory ? this.subCategory.subCategoryID : null,
      },
    });
  }

  public clickSubCategory(subCategory: SubCategory, isBack: boolean = false) {
    this.subCategory = subCategory;
    this.offer = null;
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.SubCategoryClick,
      this.getLogProperties(isBack),
    );
    this.router.navigate([this.getRegionHref()], {
      queryParams: {
        categoryID: this.category.categoryID,
        subCategoryID: this.subCategory.subCategoryID,
      },
    });
  }

  public clickOffer(offer: Offer, isBack: boolean = false) {
    this.offer = offer;
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.OfferClick,
      this.getLogProperties(isBack),
    );
    this.router.navigate([this.getRegionHref()], {
      queryParams: {
        categoryID: this.category.categoryID,
        subCategoryID: this.subCategory.subCategoryID,
        offerID: this.offer.offerID,
      },
    });
  }

  goBack() {
    if (this.offer) {
      this.loggingService.logEvent(
        LoggingEventCategory.ai,
        LoggingEvent.BackFromOffer,
        this.getLogProperties(true),
      );
      this.clickSubCategory(this.subCategory, true);
    } else if (this.subCategory) {
      this.loggingService.logEvent(
        LoggingEventCategory.ai,
        LoggingEvent.BackFromSubCategory,
        this.getLogProperties(true),
      );
      if (this.getNextSubCategory(this.category)) {
        this.category = null;
        this.subCategory = null;
        this.router.navigate([this.getRegionHref()]);
      } else {
        this.clickCategory(this.category);
      }
    } else if (this.category) {
      this.loggingService.logEvent(
        LoggingEventCategory.ai,
        LoggingEvent.BackFromCategory,
        this.getLogProperties(true),
      );
      this.category = null;
      this.router.navigate([this.getRegionHref()]);
    } else {
      this.loggingService.logEvent(
        LoggingEventCategory.ai,
        LoggingEvent.BackFromRegion,
        this.getLogProperties(true),
      );
      this.router.navigate([this.rootHref]);
    }
  }

  getLogProperties(isBack: boolean) {
    const logParams: { [key: string]: any } = { isBack };
    if (this.offer) {
      logParams.offerID = this.offer.offerID;
    }
    if (this.subCategory) {
      logParams.subCategoryID = this.subCategory.subCategoryID;
      logParams.subCategory = this.subCategory.subCategoryName;
    }
    if (this.category) {
      logParams.categoryID = this.category.categoryID;
      logParams.category = this.category.categoryName;
    }
    return logParams;
  }

  showRootPage() {
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.MainScreenClick,
      this.getLogProperties(true),
    );
    this.category = null;
    this.subCategory = null;
    this.offer = null;
    this.router.navigate([this.rootHref]);
  }

  logContactClick(type: 'tel' | 'whatsapp') {
    let event = LoggingEvent.FooterContactClick;

    if (type === 'whatsapp') {
      event = LoggingEvent.FooterWhatsAppClick;
    }

    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      event,
      this.getLogProperties(true),
    );
  }
}

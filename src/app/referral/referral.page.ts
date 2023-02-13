import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { Offer } from 'src/app/models/offer.model';
import { RegionData } from 'src/app/models/region-data';
import { SubCategory } from 'src/app/models/sub-category.model';
import { LastUpdatedTimeService } from 'src/app/services/last-updated-time.service';
import { LoggingService } from 'src/app/services/logging.service';
import { OffersService } from 'src/app/services/offers.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { environment } from 'src/environments/environment';
import { QASet } from '../models/qa-set.model';
import { SlugPrefix } from '../models/slug-prefix.enum';
import { PageMetaService } from '../services/page-meta.service';
import { createSlug, getParentPath } from '../shared/utils';

@Component({
  selector: 'app-referral',
  templateUrl: 'referral.page.html',
  styleUrls: ['referral.page.scss'],
})
export class ReferralPageComponent implements OnInit {
  public region: string;
  public regions: string[];
  public regionsLabels: string[];

  public offers: Offer[];
  public qaSets: QASet[];
  public categories: Category[];
  public subCategories: SubCategory[];

  public category: Category;
  public subCategory: SubCategory;
  public offer: Offer;

  public regionData: RegionData = {};

  private readonly rootHref = '/';

  public loading = false;

  public useUrlSlugs = environment.useUrlSlugs;
  public useQandAs = environment.useQandAs;
  public useQandASearch = environment.useQandASearch;

  public pageHeader = environment.mainPageHeader;
  public pageIntroduction = environment.mainPageIntroduction;
  public errorHeader = environment.errorHeader;
  public errorMessage = environment.errorMessage;
  public errorContactUrl = environment.errorContactUrl;
  public errorRetry = environment.errorRetry;

  constructor(
    private offersService: OffersService,
    private route: ActivatedRoute,
    private router: Router,
    private loggingService: LoggingService,
    private regionDataService: RegionDataService,
    private lastUpdatedTimeService: LastUpdatedTimeService,
    private pageMeta: PageMetaService,
  ) {
    this.regions = environment.regions.trim().split(/\s*,\s*/);
    this.regionsLabels = environment.regionsLabels.trim().split(/\s*,\s*/);

    this.route.params.subscribe((params: Params) => {
      this.region = params.region;

      if (!this.isSupportedRegion()) {
        this.pageMeta.setTitle({ override: environment.appName });
      }
    });
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.upgradeLegacyUrls(queryParams);
    });
  }

  async ngOnInit() {
    if (!this.isSupportedRegion()) {
      this.pageMeta.setTitle({ override: environment.appName });
      this.router.navigate([this.rootHref]);
      return;
    }

    await this.loadReferralData();

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.handleQueryParams(queryParams);
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
      ((this.useQandAs === false &&
        this.offers &&
        this.offers.some((item) => item.offerVisible)) ||
        (this.useQandAs &&
          !(
            (!this.offers || !this.offers.some((item) => item.offerVisible)) &&
            (!this.qaSets || !this.qaSets.some((item) => item.isVisible))
          )))
    );
  }

  public hasContactOptions(): boolean {
    return (
      !!this.regionData.contactPhoneNumber ||
      !!this.regionData.contactWhatsAppLink ||
      !!this.regionData.contactTelegramLink
    );
  }

  private async loadReferralData() {
    this.loading = true;
    this.regionData = await this.regionDataService.getData(this.region);

    this.pageMeta.setTitle({ region: this.regionData.pageTitle });

    this.lastUpdatedTimeService.setLastUpdatedTime(
      this.regionData.lastUpdatedTime,
    );
    this.lastUpdatedTimeService.setLastUpdatedLabel(
      this.regionData.labelLastUpdated,
    );

    this.categories = await this.offersService.getCategories(this.region);
    this.subCategories = await this.offersService.getAllSubCategories(
      this.region,
    );
    this.offers = await this.offersService.getOffers(this.region);

    if (this.useQandAs) {
      this.qaSets = await this.offersService.getQAs(this.region);
    }

    this.loading = false;
  }

  private handleQueryParams(params: Params) {
    if (!Object.keys(params).length) {
      this.pageMeta.setTitle({ region: this.regionData.pageTitle });
    }

    let categoryName: string;
    let subCategoryName: string;
    let offerName: string;

    if (!!params.categoryID && this.categories) {
      this.category = this.categories.find(
        (category) => category.categoryID === Number(params.categoryID),
      );
      if (!this.category) {
        this.loggingService.logEvent(
          LoggingEventCategory.error,
          LoggingEvent.NotFoundCategory,
          {
            categoryID: params.categoryID,
          },
        );
      }
      if (!!this.category && !!this.category.categoryName) {
        categoryName = this.category.categoryName;
      }
    } else {
      this.category = null;
    }
    if (!!params.subCategoryID && this.subCategories) {
      this.subCategory = this.subCategories.find(
        (subCategory) =>
          subCategory.subCategoryID === Number(params.subCategoryID) &&
          subCategory.categoryID === Number(params.categoryID),
      );
      if (!this.subCategory) {
        this.loggingService.logEvent(
          LoggingEventCategory.error,
          LoggingEvent.NotFoundSubCategory,
          {
            subCategoryID: params.subCategoryID,
            categoryID: params.categoryID,
          },
        );
      }

      if (!!this.subCategory && !!this.subCategory.subCategoryName) {
        subCategoryName = this.subCategory.subCategoryName;
      }
    } else {
      this.subCategory = null;
    }
    if (!!params.offerID && this.offers) {
      this.offer = this.offers.find(
        (offer) =>
          offer.offerID === Number(params.offerID) &&
          offer.categoryID === Number(params.categoryID) &&
          offer.subCategoryID === Number(params.subCategoryID),
      );
      if (!this.offer) {
        this.loggingService.logEvent(
          LoggingEventCategory.error,
          LoggingEvent.NotFoundOffer,
          {
            offerID: params.offerID,
            subCategoryID: params.subCategoryID,
            categoryID: params.categoryID,
          },
        );
      }
      if (!!this.offer && !!this.offer.offerName) {
        offerName = this.offer.offerName;
      }
    } else {
      this.offer = null;
    }

    this.pageMeta.setTitle({ offerName, subCategoryName, categoryName });
  }

  public clickCategory(category: Category) {
    this.category = category;
    this.subCategory = null;
    this.offer = null;
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.CategoryClick,
      this.getLogProperties(),
    );
    this.router.navigate([this.getRegionHref()], {
      queryParams: {
        categoryID: this.category.categoryID,
        subCategoryID: this.subCategory ? this.subCategory.subCategoryID : null,
      },
    });
  }

  public clickSubCategory(subCategory: SubCategory) {
    this.subCategory = subCategory;
    this.offer = null;
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.SubCategoryClick,
      this.getLogProperties(),
    );
    this.router.navigate([this.getRegionHref()], {
      queryParams: {
        categoryID: this.category.categoryID,
        subCategoryID: this.subCategory.subCategoryID,
      },
    });
  }

  public goBack() {
    if (this.useUrlSlugs) {
      this.router.navigateByUrl(getParentPath(window.location.pathname));
      return;
    }
    if (this.offer) {
      this.loggingService.logEvent(
        LoggingEventCategory.ai,
        LoggingEvent.BackFromOffer,
        this.getLogProperties(),
      );
      this.clickSubCategory(this.subCategory);
    } else if (this.subCategory) {
      this.loggingService.logEvent(
        LoggingEventCategory.ai,
        LoggingEvent.BackFromSubCategory,
        this.getLogProperties(),
      );
      if (
        this.offersService.getOnlyChildSubCategory(
          this.category,
          this.subCategories,
        )
      ) {
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
        this.getLogProperties(),
      );
      this.category = null;
      this.router.navigate([this.getRegionHref()]);
    } else {
      this.loggingService.logEvent(
        LoggingEventCategory.ai,
        LoggingEvent.BackFromRegion,
        this.getLogProperties(),
      );
      this.router.navigate([this.rootHref]);
    }
  }

  getLogProperties() {
    const logParams: { [key: string]: any } = {
      isBack: true,
    };
    if (this.offer) {
      logParams.offerID = this.offer.offerID;
      logParams.offerSlug = this.offer.slug ? this.offer.slug : '';
      logParams.offerName = this.offer.offerName ? this.offer.offerName : '';
    }
    if (this.subCategory) {
      logParams.subCategoryID = this.subCategory.subCategoryID;
      logParams.subCategorySlug = this.subCategory.slug
        ? this.subCategory.slug
        : '';
      logParams.subCategory = this.subCategory.subCategoryName;
    }
    if (this.category) {
      logParams.categoryID = this.category.categoryID;
      logParams.categorySlug = this.category.slug ? this.category.slug : '';
      logParams.category = this.category.categoryName;
    }
    return logParams;
  }

  showRootPage() {
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.MainScreenClick,
      this.getLogProperties(),
    );
    this.category = null;
    this.subCategory = null;
    this.offer = null;
    this.router.navigate([this.rootHref]);
  }

  logContactClick(type: 'tel' | 'whatsapp' | 'telegram') {
    let event = LoggingEvent.FooterContactClick;

    if (type === 'whatsapp') {
      event = LoggingEvent.FooterWhatsAppClick;
    }

    if (type === 'telegram') {
      event = LoggingEvent.FooterTelegramClick;
    }

    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      event,
      this.getLogProperties(),
    );
  }

  /**
   * To support possible bookmarks of the old, query-style URLs
   */
  private upgradeLegacyUrls(queryParams: Params) {
    if (this.useQandAs && !!queryParams.highlights) {
      this.router.navigate([this.getRegionHref(), 'highlights'], {
        replaceUrl: true,
      });
    }
    if (this.useQandASearch && !!queryParams.search) {
      this.router.navigate([this.getRegionHref(), 'search'], {
        replaceUrl: true,
        queryParamsHandling: 'merge',
        queryParams: {
          search: null,
          q: !!queryParams.q ? queryParams.q : null,
        },
      });
    }
    if (
      this.useUrlSlugs &&
      (!!queryParams.categoryID ||
        !!queryParams.subCategoryID ||
        !!queryParams.offerID)
    ) {
      let upgradedUrl = this.getRegionHref();
      if (!!queryParams.categoryID) {
        upgradedUrl +=
          '/' + createSlug('', queryParams.categoryID, SlugPrefix.category);
      }
      if (!!queryParams.subCategoryID) {
        upgradedUrl +=
          '/' +
          createSlug('', queryParams.subCategoryID, SlugPrefix.subCategory);
      }
      if (!!queryParams.offerID) {
        upgradedUrl +=
          '/' + createSlug('', queryParams.offerID, SlugPrefix.offer);
      }
      this.router.navigateByUrl(upgradedUrl, {
        replaceUrl: true,
      });
    }
  }
}

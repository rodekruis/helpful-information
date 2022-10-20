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
import { OffersService } from 'src/app/services/offers.service';
import { ReferralPageDataService } from 'src/app/services/referral-page-data.service';
import { environment } from 'src/environments/environment';
import { QASet } from '../models/qa-set.model';
import { SearchService } from '../services/search.service';
import { SpreadsheetService } from '../services/spreadsheet.service';

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
  public qaHighlights: QASet[];
  public categories: Category[];
  public subCategories: SubCategory[];

  public category: Category;
  public subCategory: SubCategory;
  public offer: Offer;

  public referralPageData: ReferralPageData = {};

  public readonly rootHref: string = '/';

  public loading = false;
  public useQandAs = environment.useQandAs;
  public showHighlights = false;

  public useQandASearch = environment.useQandASearch;
  public showSearch = false;
  public searchQuery: string;
  public searchResults: QASet[] = [];

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
    private referralPageDataService: ReferralPageDataService,
    private lastUpdatedTimeService: LastUpdatedTimeService,
    private titleService: Title,
    private searchService: SearchService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.region = params.region;
      this.loadReferralData();
    });
    if (this.useQandAs) {
      this.route.queryParams.subscribe((queryParams) => {
        this.showHighlights = !!queryParams.highlights;

        if (this.useQandASearch) {
          this.showSearch = !!queryParams.search;
          this.searchQuery = !!queryParams.q ? queryParams.q : '';
        }
      });
    }
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
      !!this.referralPageData.referralPhoneNumber ||
      !!this.referralPageData.referralWhatsAppLink ||
      !!this.referralPageData.referralTelegramLink
    );
  }

  private async loadReferralData() {
    if (this.isSupportedRegion()) {
      this.loading = true;
      this.referralPageData =
        await this.referralPageDataService.getReferralPageData(this.region);

      this.updatePageTitle(this.referralPageData.referralPageTitle);

      this.lastUpdatedTimeService.setLastUpdatedTime(
        this.referralPageData.referralLastUpdatedTime,
      );

      this.categories = await this.offersService.getCategories(this.region);
      this.subCategories = await this.offersService.getSubCategories(
        this.region,
      );
      this.offers = await this.offersService.getOffers(this.region);

      if (this.useQandAs) {
        this.qaSets = (await this.offersService.getQAs(this.region)).map(
          (qaSet) => this.addParentCategoryNames(qaSet),
        );
        this.qaHighlights = this.createHighlights(this.qaSets);
      }
      if (this.useQandASearch) {
        this.searchService.setSource(this.qaSets);
      }

      this.readQueryParams();

      this.loading = false;
    } else {
      this.updatePageTitle(environment.appName);
      this.router.navigate([this.rootHref]);
    }
  }

  private createHighlights(qaSets: QASet[]): QASet[] {
    // Create a deep copy of the Q&A set:
    const items = qaSets.map((item) => ({ ...item }));
    return items
      .filter((item) => item.isHighlight && item.isVisible)
      .sort((a, b) => {
        if (!a.dateUpdated || !b.dateUpdated) {
          return 0;
        }
        return a.dateUpdated.getTime() - b.dateUpdated.getTime();
      })
      .map((item) => {
        if (!item.children) {
          return item;
        }
        const highlightedChildren = item.children.filter(
          (child) => child.isHighlight,
        );
        // If only a few children are highlighted include those
        // If NO children are highlighted include all
        if (highlightedChildren.length) {
          item.children = highlightedChildren;
        }
        return item;
      });
  }

  private addParentCategoryNames(entity: Offer): Offer;
  private addParentCategoryNames(entity: QASet): QASet;
  private addParentCategoryNames(entity: QASet | Offer): QASet | Offer {
    entity.categoryName = SpreadsheetService.getCategoryName(
      entity.categoryID,
      this.categories,
    );
    entity.subCategoryName = SpreadsheetService.getSubCategoryName(
      entity.subCategoryID,
      this.subCategories,
    );
    return entity;
  }

  private updatePageTitle(
    root: string | null,
    categoryName?: string,
    subCategoryName?: string,
    offerName?: string,
  ) {
    let title = '';

    if (root) {
      title = root;
    }

    if (categoryName) {
      title += ' : ' + categoryName;
    }

    if (subCategoryName) {
      title += ' / ' + subCategoryName;
    }

    if (offerName) {
      title += ' : ' + offerName;
    }

    if (!!environment.envName) {
      title += ` [ ${environment.envName} ]`;
    }

    this.titleService.setTitle(title);
  }

  private readQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if (!params.length) {
        this.updatePageTitle(this.referralPageData.referralPageTitle);
      }
      let categoryName: string;
      let subCategoryName: string;
      let offerName: string;

      if ('categoryID' in params) {
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
      if ('subCategoryID' in params) {
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
      if ('offerID' in params) {
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
      this.updatePageTitle(
        this.referralPageData.referralPageTitle,
        categoryName,
        subCategoryName,
        offerName,
      );

      if ('q' in params) {
        this.performSearch(params.q);
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
    } else if (this.showHighlights) {
      this.loggingService.logEvent(
        LoggingEventCategory.ai,
        LoggingEvent.BackFromHighlights,
        this.getLogProperties(true),
      );
      this.router.navigate([this.getRegionHref()]);
    } else if (this.showSearch) {
      this.loggingService.logEvent(
        LoggingEventCategory.ai,
        LoggingEvent.BackFromSearch,
        this.getLogProperties(true),
      );
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
      logParams.offerName = this.offer.offerName ? this.offer.offerName : '';
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
      this.getLogProperties(true),
    );
  }

  public performSearch(rawQuery: string): void {
    const safeQuery = this.searchService.sanitizeSearchQuery(rawQuery);

    this.router.navigate([this.getRegionHref()], {
      queryParams: { q: safeQuery },
      queryParamsHandling: 'merge',
    });

    this.searchResults = this.searchService.query(safeQuery);

    if (this.searchResults.length > 1) {
      const resultFrame = document.getElementById('search-results');
      if (resultFrame) {
        resultFrame.focus();
      }
    }
  }
}

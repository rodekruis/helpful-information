import { Location, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';
import { AppHeaderComponent } from 'src/app/components/header/header.component';
import { Category } from 'src/app/models/category.model';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { Offer } from 'src/app/models/offer.model';
import { QASet } from 'src/app/models/qa-set.model';
import { RegionData } from 'src/app/models/region-data';
import { SlugPrefix } from 'src/app/models/slug-prefix.enum';
import { SubCategory } from 'src/app/models/sub-category.model';
import { LastUpdatedTimeService } from 'src/app/services/last-updated-time.service';
import { LoggingService } from 'src/app/services/logging.service';
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { createSlug, getParentPath, getPathDepth } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-referral',
  templateUrl: 'referral.page.html',
  styleUrls: ['referral.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    AppHeaderComponent,
    NgIf,
    RouterOutlet,
    MarkdownModule,
    NgFor,
    RouterLink,
  ],
})
export class ReferralPageComponent implements OnInit {
  public region: string;
  public regions: string[];
  public regionsLabels: string[];

  private offers: Offer[];
  private qaSets: QASet[];
  private categories: Category[];
  private subCategories: SubCategory[];

  public regionData: RegionData = {};

  private readonly rootHref = '/';

  public loading = false;

  private useOffers = environment.useOffers;
  private useQandAs = environment.useQandAs;
  private useQandASearch = environment.useQandASearch;

  public pageHeader = environment.mainPageHeader;
  public pageIntroduction = environment.mainPageIntroduction;
  public pageNotification = environment.mainPageNotification;
  public errorHeader = environment.errorHeader;
  public errorMessage = environment.errorMessage;
  public errorContactUrl = environment.errorContactUrl;
  public errorRetry = environment.errorRetry;

  constructor(
    private offersService: OffersService,
    private route: ActivatedRoute,
    private router: Router,
    private regionDataService: RegionDataService,
    private lastUpdatedTimeService: LastUpdatedTimeService,
    private pageMeta: PageMetaService,
    private location: Location,
    private loggingService?: LoggingService,
  ) {
    this.regions = environment.regions.trim().split(/\s*,\s*/);
    this.regionsLabels = environment.regionsLabels.trim().split(/\s*,\s*/);

    this.route.params.subscribe((params: Params) => {
      this.region = params.region;

      if (!this.isSupportedRegion()) {
        this.pageMeta.setDirection('');
        this.pageMeta.setLanguage('');
        this.pageMeta.setTitle({ override: environment.appName });
        this.pageMeta.setCanonicalUrl({});
      }
    });
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.upgradeLegacyUrls(queryParams);
    });
  }

  public async ngOnInit() {
    if (!this.isSupportedRegion()) {
      this.pageMeta.setDirection('');
      this.pageMeta.setLanguage('');
      this.pageMeta.setTitle({ override: environment.appName });
      this.pageMeta.setCanonicalUrl({});
      this.router.navigate([this.rootHref]);
      return;
    }

    await this.loadAllData();
  }

  public getRegionHref() {
    return this.rootHref + this.region;
  }

  public isSupportedRegion() {
    return this.region && this.regions.includes(this.region);
  }

  public hasDataToShow(): boolean {
    return (
      this.categories &&
      this.categories.some((item) => item.categoryVisible) &&
      this.subCategories &&
      this.subCategories.some((item) => item.subCategoryVisible) &&
      // When environment.useQandAs == true, Offers OR Q&A-sets can be empty
      ((this.useOffers === true &&
        this.useQandAs === true &&
        !(
          (!this.offers || !this.offers.some((item) => item.offerVisible)) &&
          (!this.qaSets || !this.qaSets.some((item) => item.isVisible))
        )) ||
        // When environment.useOffers === false, Q&A-sets need to be available
        (this.useOffers === false &&
          this.useQandAs === true &&
          this.qaSets &&
          this.qaSets.some((item) => item.isVisible)) ||
        // When environment.useQandAs == false, Offers need to be available
        (this.useOffers === true &&
          this.useQandAs === false &&
          this.offers &&
          this.offers.some((item) => item.offerVisible)))
    );
  }

  public hasContactOptions(): boolean {
    return (
      !!this.regionData.contactPhoneNumber ||
      !!this.regionData.contactWhatsAppLink ||
      !!this.regionData.contactTelegramLink
    );
  }

  public getNotificationContent(): string {
    if (!!this.regionData.pageNotification) {
      return this.regionData.pageNotification;
    }
    return environment.mainPageNotification;
  }

  private async loadAllData() {
    this.loading = true;
    this.regionData = await this.regionDataService.getData(this.region);

    this.pageMeta.setDirection(this.regionData.localeDirection);
    this.pageMeta.setLanguage(this.regionData.localeLanguage);
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
    if (this.useOffers) {
      this.offers = await this.offersService.getOffers(this.region);
    }
    if (this.useQandAs) {
      this.qaSets = await this.offersService.getQAs(this.region);
    }

    this.loading = false;
  }

  public goBack(): void {
    const currentPath = this.location.path();
    const pathDepth = getPathDepth(currentPath);
    const parentPath = getParentPath(currentPath);

    let event = LoggingEvent.BackButtonClick;

    switch (pathDepth) {
      case 4:
        event = LoggingEvent.BackFromOffer;
        break;
      case 3:
        event = LoggingEvent.BackFromSubCategory;
        break;
      case 2:
        if (currentPath.match(/\/highlights$/)) {
          event = LoggingEvent.BackFromHighlights;
          break;
        }
        if (currentPath.match(/\/search$/)) {
          event = LoggingEvent.BackFromSearch;
          break;
        }
        event = LoggingEvent.BackFromCategory;
        break;
      case 1:
        event = LoggingEvent.BackFromRegion;
        break;
    }

    if (this.loggingService) {
      this.loggingService.logEvent(LoggingEventCategory.ai, event, {
        isBack: true,
      });
    }

    this.router.navigateByUrl(parentPath || '/');
  }

  public showRootPage() {
    if (this.loggingService) {
      this.loggingService.logEvent(
        LoggingEventCategory.ai,
        LoggingEvent.MainScreenClick,
        { isBack: true },
      );
    }
    this.router.navigate([this.rootHref]);
  }

  public logContactClick(type: 'tel' | 'whatsapp' | 'telegram') {
    if (!this.loggingService) {
      return;
    }
    let event = LoggingEvent.FooterContactClick;

    if (type === 'whatsapp') {
      event = LoggingEvent.FooterWhatsAppClick;
    }

    if (type === 'telegram') {
      event = LoggingEvent.FooterTelegramClick;
    }

    this.loggingService.logEvent(LoggingEventCategory.ai, event);
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
      !!queryParams.categoryID ||
      !!queryParams.subCategoryID ||
      !!queryParams.offerID
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

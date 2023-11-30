import { Location, NgFor, NgIf } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { Params } from '@angular/router';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { IonContent, IonFooter, IonHeader } from '@ionic/angular/standalone';
import { MarkdownComponent } from 'ngx-markdown';
import { AppHeaderComponent } from 'src/app/components/header/header.component';
import type { Category } from 'src/app/models/category.model';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import type { RegionData } from 'src/app/models/region-data';
import { SlugPrefix } from 'src/app/models/slug-prefix.enum';
import type { SubCategory } from 'src/app/models/sub-category.model';
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
    AppHeaderComponent,
    MarkdownComponent,
    NgFor,
    NgIf,
    RouterLink,
    RouterOutlet,
    IonHeader,
    IonContent,
    IonFooter,
  ],
})
export class ReferralPageComponent implements OnInit {
  public region: string;
  public regions: string[];
  public regionsLabels: string[];

  private categories: Category[];
  private subCategories: SubCategory[];

  public regionData: RegionData = {};

  private readonly rootHref = '/';

  public loading = false;
  public dataAvailable = false;

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

  private hasDataAvailable(): boolean {
    const hasCategories = this.categories.length > 0;
    const hasSubCategories = this.subCategories.length > 0;

    return hasCategories && hasSubCategories;
  }

  public hasContactOptions(): boolean {
    return (
      !!this.regionData.contactPhoneNumber ||
      !!this.regionData.contactWhatsAppLink ||
      !!this.regionData.contactTelegramLink
    );
  }

  public getNotificationContent(): string {
    if (this.regionData.pageNotification) {
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
      await this.offersService.getOffers(this.region);
    }
    if (this.useQandAs) {
      await this.offersService.getQAs(this.region);
    }

    this.dataAvailable = this.hasDataAvailable();

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
          q: queryParams.q ? queryParams.q : null,
        },
      });
    }
    if (
      !!queryParams.categoryID ||
      !!queryParams.subCategoryID ||
      !!queryParams.offerID
    ) {
      let upgradedUrl = this.getRegionHref();
      if (queryParams.categoryID) {
        upgradedUrl +=
          '/' + createSlug('', queryParams.categoryID, SlugPrefix.category);
      }
      if (queryParams.subCategoryID) {
        upgradedUrl +=
          '/' +
          createSlug('', queryParams.subCategoryID, SlugPrefix.subCategory);
      }
      if (queryParams.offerID) {
        upgradedUrl +=
          '/' + createSlug('', queryParams.offerID, SlugPrefix.offer);
      }
      this.router.navigateByUrl(upgradedUrl, {
        replaceUrl: true,
      });
    }
  }
}

import { NgFor, NgIf } from '@angular/common';
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
import {
  createRegionLabels,
  createRegionSlugs,
} from 'src/app/shared/util.environment';
import { extractPageTitleFromMarkdown } from 'src/app/shared/util.markdown';
import { createSlug } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';
import { AppPath } from 'src/routes';

@Component({
  selector: 'app-referral',
  templateUrl: 'referral.page.html',
  styleUrls: ['referral.page.css'],
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
  public pageFooter = environment.mainFooter;
  public pageAbout = environment.pageAbout;
  public pagePrivacy = environment.pagePrivacy;
  public errorHeader = environment.errorHeader;
  public errorMessage = environment.errorMessage;
  public errorContactUrl = environment.errorContactUrl;
  public errorRetry = environment.errorRetry;

  public AppPath = AppPath;

  constructor(
    private offersService: OffersService,
    private route: ActivatedRoute,
    private router: Router,
    private regionDataService: RegionDataService,
    private lastUpdatedTimeService: LastUpdatedTimeService,
    private pageMeta: PageMetaService,
    private loggingService?: LoggingService,
  ) {
    this.regions = createRegionSlugs();
    this.regionsLabels = createRegionLabels();

    this.route.params.subscribe((params: Params) => {
      this.region = params.region;

      if (!this.isSupportedRegion()) {
        this.resetPageMeta();

        if (this.isStaticPage()) {
          this.setStaticPageMeta();
        }
      }
    });
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.upgradeLegacyUrls(queryParams);
    });
  }

  public async ngOnInit() {
    if (!this.isSupportedRegion()) {
      this.resetPageMeta();

      if (this.isStaticPage()) {
        this.setStaticPageMeta();
        return;
      }

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

  public isStaticPage(page?: AppPath) {
    if (page) {
      return this.route.snapshot.data.path === page;
    }

    return (
      this.route.snapshot.data.isAboutPage ||
      this.route.snapshot.data.isPrivacyPage
    );
  }

  private resetPageMeta() {
    this.pageMeta.setDirection('');
    this.pageMeta.setLanguage('');
    this.pageMeta.setCanonicalUrl({});
    this.pageMeta.setTitle({ override: environment.appName });
  }

  private setStaticPageMeta() {
    let pageContent;

    if (this.route.snapshot.data.isAboutPage && !!environment.pageAbout) {
      pageContent = environment.pageAbout;
    }
    if (this.route.snapshot.data.isPrivacyPage && !!environment.pagePrivacy) {
      pageContent = environment.pagePrivacy;
    }

    if (!pageContent) {
      return;
    }

    const pageTitle = extractPageTitleFromMarkdown(pageContent);
    this.pageMeta.setTitle({
      override: `${pageTitle} - ${environment.appName}`,
    });
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

  public getFooterContent(): string {
    if (this.regionData.pageFooter) {
      return this.regionData.pageFooter;
    }
    return environment.mainFooter;
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
   * @deprecated
   */
  private upgradeLegacyUrls(queryParams: Params) {
    if (this.useQandAs && !!queryParams.highlights) {
      this.router.navigate([this.getRegionHref(), AppPath.highlights], {
        replaceUrl: true,
      });
    }
    if (this.useQandASearch && !!queryParams.search) {
      this.router.navigate([this.getRegionHref(), AppPath.search], {
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

import { Location } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import type { Params } from '@angular/router';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { IonContent, IonHeader } from '@ionic/angular/standalone';
import { MarkdownComponent } from 'ngx-markdown';
import { filter } from 'rxjs';
import { AppHeaderComponent } from 'src/app/components/header/header.component';
import type { Category } from 'src/app/models/category.model';
import type { RegionSet } from 'src/app/models/config.model';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import type { RegionData } from 'src/app/models/region-data';
import type { SubCategory } from 'src/app/models/sub-category.model';
import { ConfigService } from 'src/app/services/config.service';
import { LastUpdatedTimeService } from 'src/app/services/last-updated-time.service';
import { LoggingService } from 'src/app/services/logging.service';
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { createLocaleAlternatives } from 'src/app/shared/util.locales';
import { extractPageTitleFromMarkdown } from 'src/app/shared/util.markdown';
import { environment } from 'src/environments/environment';
import { AppPath } from 'src/routes';

@Component({
  selector: 'app-referral',
  templateUrl: 'referral.page.html',
  styleUrls: ['referral.page.css'],
  imports: [
    AppHeaderComponent,
    MarkdownComponent,
    RouterLink,
    RouterOutlet,
    IonHeader,
    IonContent,
  ],
})
export class ReferralPageComponent implements OnInit {
  @ViewChild('content')
  private content: IonContent;

  public region: string;
  public regionSets: RegionSet[];

  private categories: Category[];
  private subCategories: SubCategory[];

  public regionData: RegionData = {};

  public loading = false;
  public dataAvailable = false;
  public mainUrl: string;

  private useOffers = environment.useOffers;
  private useQandAs = environment.useQandAs;

  public localeLanguage = environment.localeLanguage;
  public localeDir = environment.localeDir;
  public localeAlternatives = createLocaleAlternatives(
    environment.localeAlternatives,
  );
  public localeAlternativesExplanation =
    environment.localeAlternativesExplanation;
  public pageHeader = environment.mainPageHeader;
  public pageIntroduction = environment.mainPageIntroduction;
  public pageNotification = environment.mainPageNotification;
  public pageFooter = environment.mainFooter;
  public pageAbout = environment.pageAbout?.trim();
  public pagePrivacy = environment.pagePrivacy?.trim();
  public errorHeader = environment.errorHeader;
  public errorMessage = environment.errorMessage;
  public errorContactUrl = environment.errorContactUrl;
  public errorRetry = environment.errorRetry;

  public AppPath = AppPath;

  constructor(
    private offersService: OffersService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private regionDataService: RegionDataService,
    private lastUpdatedTimeService: LastUpdatedTimeService,
    private pageMeta: PageMetaService,
    private loggingService: LoggingService,
    private configService: ConfigService,
  ) {
    this.regionSets = this.configService.config.regions;

    this.mainUrl = this.location.normalize('/');

    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => {
        if (this.content) {
          // To prevent a confusing scroll-position inherited from a previous page:
          this.content.scrollToTop(0);
        }
      });

    this.route.params.subscribe((params: Params) => {
      this.region = params.region;

      if (!this.isSupportedRegion()) {
        this.resetPageMeta();

        if (this.isStaticPage()) {
          this.setStaticPageMeta();
        }
      }
    });
  }

  public async ngOnInit() {
    if (!this.isSupportedRegion()) {
      this.resetPageMeta();

      if (this.isStaticPage()) {
        this.setStaticPageMeta();
        return;
      }

      this.router.navigate(['/']);
      return;
    }

    await this.loadAllData();
  }

  public isSupportedRegion() {
    return (
      this.region && !!this.configService.getRegionByRegionSlug(this.region)
    );
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
    this.pageMeta.setDirection(
      environment.localeDir ? environment.localeDir : '',
    );
    this.pageMeta.setLanguage(
      environment.localeLanguage ? environment.localeLanguage : '',
    );
    this.pageMeta.setCanonicalUrl({});
    this.pageMeta.setTitle({});
  }

  private setStaticPageMeta() {
    let pageContent;

    if (this.route.snapshot.data.isAboutPage && !!this.pageAbout) {
      pageContent = this.pageAbout;
    }
    if (this.route.snapshot.data.isPrivacyPage && !!this.pagePrivacy) {
      pageContent = this.pagePrivacy;
    }

    if (!pageContent) {
      this.router.navigate(['/'], {
        replaceUrl: true,
      });
      return;
    }

    const pageTitle = extractPageTitleFromMarkdown(pageContent);
    this.pageMeta.setTitle({
      pageName: pageTitle,
      region: this.region ? this.region : '',
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
    this.pageMeta.setTitle({ region: this.region });

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
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.MainScreenClick,
    );
    this.router.navigate(['/']);
  }

  public logContactClick(type: 'tel' | 'whatsapp' | 'telegram') {
    let event = LoggingEvent.FooterContactClick;

    if (type === 'whatsapp') {
      event = LoggingEvent.FooterWhatsAppClick;
    }

    if (type === 'telegram') {
      event = LoggingEvent.FooterTelegramClick;
    }

    this.loggingService.logEvent(LoggingEventCategory.ai, event);
  }

  public logNotificationDismiss(
    target: EventTarget | HTMLDetailsElement,
  ): void {
    if ((target as HTMLDetailsElement).open) {
      return;
    }

    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.NotificationDismissed,
    );
  }
}

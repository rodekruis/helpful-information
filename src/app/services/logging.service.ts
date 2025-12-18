import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DebugPlugin } from '@microsoft/applicationinsights-debugplugin-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { createKeyValueList } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';

// Declaring external 'data-store's / APIs
declare global {
  interface Window {
    // Matomo API
    _paq?: any[];
    // GoatCounter API
    goatcounter?: {
      allow_local?: boolean;
      no_events?: boolean;
      no_onload?: boolean;
      allow_frame?: boolean;
      endpoint?: string;
      count?: (params?: {
        path?: string | ((p: string) => string);
        title?: string;
        referrer?: string;
        event?: boolean;
      }) => void;
    };
  }
}

interface EventProperties {
  name?: string;
  value?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  router = inject(Router);

  matomoInitialized: boolean;

  goatCounterInitialized: boolean;

  appInsights: ApplicationInsights;
  appInsightsInitialized: boolean;

  constructor() {
    this.setupMatomo();
    this.setupGoatCounter();
    this.setupApplicationInsights();
  }

  private parseConnectionStringInfo(connectionString: string | undefined) {
    const properties = ['id', 'api', 'sdk'];
    const connection: { id?: string; api?: string; sdk?: string } = {};
    if (typeof connectionString === 'string') {
      const allParts = connectionString.split(';');
      allParts.forEach((part: string) => {
        const [key, value] = part.split('=');
        if (properties.includes(key)) {
          connection[key as keyof typeof connection] = value;
        }
      });
    }
    return connection;
  }

  private setupMatomo() {
    const connection = this.parseConnectionStringInfo(
      environment.matomoConnectionString,
    );

    if (!connection.id || !connection.api || !connection.sdk) {
      return;
    }

    window._paq = window._paq || [];
    window._paq.push(['setDoNotTrack', true]);
    window._paq.push(['disableCookies']);
    window._paq.push(['enableLinkTracking']);
    window._paq.push(['enableHeartBeatTimer']);

    (() => {
      window._paq.push(['setTrackerUrl', connection.api]);
      window._paq.push(['setSiteId', connection.id]);

      const script = document.createElement('script');
      script.async = true;
      script.src = connection.sdk;
      document.head.appendChild(script);

      this.matomoInitialized = true;
    })();
  }

  private setupGoatCounter() {
    const connection = this.parseConnectionStringInfo(
      environment.goatCounterConnectionString,
    );

    if (!connection.api || !connection.sdk) {
      return;
    }

    (() => {
      window.goatcounter = window.goatcounter || {
        allow_local: false,
        no_events: true,
        no_onload: false,
        allow_frame: true,
        endpoint: connection.api,
      };
      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = connection.sdk;

      // Only initionalize after script has loaded
      script.addEventListener('load', () => {
        this.goatCounterInitialized = true;
      });
      document.head.appendChild(script);

      // Listen for navigation-events for pageview-tracking (as it is not built-into GoatCounter)
      this.router.events.subscribe((event) => {
        if (this.goatCounterInitialized && event instanceof NavigationEnd) {
          // Wait for the new page to have fully rendered
          window.setTimeout(() => {
            this.logPageView();
          }, 100);
        }
      });
    })();
  }

  private setupApplicationInsights() {
    if (
      !environment.appInsightsConnectionString ||
      this.appInsightsInitialized
    ) {
      return;
    }

    let debugPluginInstance;
    let debugPluginConfig: Record<string, unknown> = {};

    if (!environment.production) {
      debugPluginInstance = new DebugPlugin();
      debugPluginConfig = {
        [DebugPlugin.identifier]: {
          // See: https://github.com/microsoft/ApplicationInsights-JS/tree/main/extensions/applicationinsights-debugplugin-js#basic-usage
          trackers: [
            'trackDependencyData',
            'trackEvent',
            'trackException',
            'trackMetric',
            'trackPageView',
            'trackTrace',
          ],
        },
      };
    }

    this.appInsights = new ApplicationInsights({
      config: {
        connectionString: environment.appInsightsConnectionString,
        disableCookiesUsage: true,
        enableAutoRouteTracking: true,
        enableAjaxErrorStatusText: true,
        enableSessionStorageBuffer: true,
        enableUnhandledPromiseRejectionTracking: true,
        extensions: debugPluginInstance ? [debugPluginInstance] : [],
        loggingLevelConsole: 2,
        loggingLevelTelemetry: 2,
        extensionConfig: {
          ['AppInsightsCfgSyncPlugin']: { cfgUrl: '' },
          ...debugPluginConfig,
        },
      },
    });

    this.appInsights.loadAppInsights();
    this.appInsightsInitialized = true;
  }

  public logPageView(name?: string): void {
    if (this.matomoInitialized) {
      window._paq.push(['setDocumentTitle', name ?? document.title]);
      window._paq.push(['trackPageView']);
    }
    if (this.goatCounterInitialized) {
      window.goatcounter.count();
    }
    if (this.appInsightsInitialized) {
      // Not necessary because of `enableAutoRouteTracking`-setting in `setupApplicationInsights()`
    }
    console.info(`LOG: PageView: "${name ?? ''}"`);
  }

  public logEvent(
    category: LoggingEventCategory | string,
    action: LoggingEvent | string,
    properties?: EventProperties,
  ): void {
    if (this.matomoInitialized) {
      window._paq.push([
        'trackEvent',
        category === LoggingEventCategory.ai ? 'UI' : category,
        action,
        properties && properties.name ? properties.name : undefined,
        properties && properties.value ? properties.value : undefined,
      ]);
    }
    if (this.goatCounterInitialized) {
      if (this.goatCounterShouldExcludeEvent(action)) {
        return;
      }

      window.goatcounter.count({
        path: `_${action}`,
        title: this.goatCounterPrepareEventDetails(properties),
        referrer: window.location.toString(),
        event: true,
      });
    }
    if (this.appInsightsInitialized) {
      this.appInsights.trackEvent(
        {
          name: `referral-${action}`,
        },
        {
          url: window.location.toString(),
          category,
          action,
          ...properties,
        },
      );
    }
    console.info(`LOG Event: ${category} - ${action}`, properties);
  }

  public logException(exception: Error): void {
    if (this.appInsightsInitialized) {
      this.appInsights.trackException({
        exception,
      });
    }
    console.error(`LOG Exception`, exception);
  }

  public logTrace(
    message: string,
    properties?: Record<string, boolean | number | string>,
  ): void {
    if (this.appInsightsInitialized) {
      this.appInsights.trackTrace({ message }, properties);
    }
    console.error(`LOG Trace: "${message}"`, properties);
  }

  private goatCounterPrepareEventDetails(properties?: EventProperties): string {
    let eventDetails = '';

    if (properties && Object.keys(properties).length > 0) {
      eventDetails = createKeyValueList(properties);
    }

    return eventDetails;
  }

  private goatCounterShouldExcludeEvent(
    action: LoggingEvent | string,
  ): boolean {
    const excludedEvents = [
      LoggingEvent.CategoryClick,
      LoggingEvent.OfferClick,
      LoggingEvent.OfferDetailClick,
      LoggingEvent.SubCategoryClick,
    ] as string[];

    return excludedEvents.includes(action as string);
  }
}

import { Injectable } from '@angular/core';
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
      count?: (params: {
        path?: string;
        title?: string;
        event?: boolean;
      }) => void;
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
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
      const script = document.createElement('script');
      script.async = true;
      script.dataset.goatcounter = connection.api;
      script.src = connection.sdk;
      document.head.appendChild(script);

      this.goatCounterInitialized = true;
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
    if (this.appInsightsInitialized) {
      // Not necessary because of `enableAutoRouteTracking`-setting in `setupApplicationInsights()`
    }
    console.info(`LOG: PageView: "${name ?? ''}"`);
  }

  public logEvent(
    category: LoggingEventCategory | string,
    action: LoggingEvent | string,
    properties?: {
      name?: string;
      value?: number;
      [key: string]: any;
    },
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
    if (this.goatCounterInitialized && !!window.goatcounter?.count) {
      const categoryAsPrefix =
        category === LoggingEventCategory.ai ? '_' : `_${category}`;
      let eventDetails = '';

      if (properties && Object.keys(properties).length === 1 && !!properties.name) {
        eventDetails = properties.name;
      } else if (properties && Object.keys(properties).length > 1) {
        eventDetails = createKeyValueList(properties);
      }

      window.goatcounter.count({
        path: `${categoryAsPrefix}/${action}`,
        title: eventDetails,
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
}

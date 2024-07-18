import { Injectable } from '@angular/core';
import { DebugPlugin } from '@microsoft/applicationinsights-debugplugin-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  appInsights: ApplicationInsights;
  appInsightsInitialized: boolean;

  constructor() {
    this.setupApplicationInsights();
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
    if (this.appInsightsInitialized) {
      this.appInsights.trackPageView({ name });
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

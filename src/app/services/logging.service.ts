import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { SeverityLevel } from 'src/app/models/severity-level.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  appInsights: ApplicationInsights;
  appInsightsEnabled: boolean;

  constructor() {
    this.setupApplicationInsights();
  }

  private setupApplicationInsights() {
    if (!environment.appInsightsConnectionString || this.appInsightsEnabled) {
      return;
    }
    this.appInsights = new ApplicationInsights({
      config: {
        connectionString: environment.appInsightsConnectionString,
        disableCookiesUsage: true,
        enableSessionStorageBuffer: true,
        enableAutoRouteTracking: true,
        enableUnhandledPromiseRejectionTracking: true,
        extensionConfig: {
          ['AppInsightsCfgSyncPlugin']: { cfgUrl: '' },
        },
      },
    });

    this.appInsights.loadAppInsights();
    this.appInsightsEnabled = true;
  }

  public logPageView(name?: string): void {
    if (this.appInsightsEnabled) {
      this.appInsights.trackPageView({ name });
    }
    this.displayOnConsole(`logPageView: ${name}`, SeverityLevel.Information);
  }

  public logError(error: any, severityLevel?: SeverityLevel): void {
    this.displayOnConsole(error, severityLevel);
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
    if (this.appInsightsEnabled) {
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
    this.displayOnConsole(
      `logEvent: ${category} - ${action} - properties: ${JSON.stringify(
        properties,
      )}`,
      SeverityLevel.Information,
    );
  }

  public logException(exception: Error, severityLevel?: SeverityLevel): void {
    if (this.appInsightsEnabled) {
      this.appInsights.trackException({
        exception,
        severityLevel,
      });
    }
    this.displayOnConsole(exception, severityLevel);
  }

  public logTrace(message: string, properties?: { [key: string]: any }): void {
    if (this.appInsightsEnabled) {
      this.appInsights.trackTrace({ message }, properties);
    }
    this.displayOnConsole(
      `logTrace: ${message} - properties: ${JSON.stringify(properties)}`,
    );
  }

  private displayOnConsole(
    error: any,
    severityLevel: SeverityLevel = SeverityLevel.Error,
  ): void {
    if (environment.production) {
      return;
    }

    switch (severityLevel) {
      case SeverityLevel.Critical:
      case SeverityLevel.Error:
        console.error(error);
        break;
      case SeverityLevel.Warning:
        console.warn(error);
        break;
      case SeverityLevel.Information:
        console.log(error);
        break;
    }
  }
}

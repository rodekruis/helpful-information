import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import {
  LoggingEvent,
  LoggingEventCategory,
} from './models/logging-event.enum';
import { LoggingService } from './services/logging.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  public envName: string = environment.envName;

  constructor(
    private platform: Platform,
    private loggingService: LoggingService,
    private swUpdates: SwUpdate,
  ) {
    this.initializeApp();

    this.loggingService.logPageView('app');

    this.swUpdates.versionUpdates.subscribe((evt) => {
      switch (evt.type) {
        case 'VERSION_READY':
          console.log(
            `ServiceWorker: New version ready: ${evt.latestVersion.hash}`,
          );
          this.loggingService.logEvent(
            LoggingEventCategory.sw,
            LoggingEvent.SwUpdateAvailable,
            {
              name: evt.latestVersion.hash,
            },
          );

          this.swUpdates.activateUpdate().then(
            (activated) => {
              console.log(
                'ServiceWorker: activateUpdate: ',
                activated,
                evt.latestVersion.hash,
              );
              if (!activated) {
                return;
              }
              this.loggingService.logEvent(
                LoggingEventCategory.sw,
                LoggingEvent.SwUpdateActivated,
                {
                  name: evt.latestVersion.hash,
                },
              );
              document.location.reload();
            },
            (error) => {
              console.error('ServiceWorker: activateUpdate: ', error);
              this.loggingService.logEvent(
                LoggingEventCategory.error,
                LoggingEvent.error,
                { name: 'ServiceWorker: activateUpdate error' },
              );
            },
          );
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.warn(
            `ServiceWorker: Failed to install version: '${evt.version.hash}`,
            evt.error,
          );
          this.loggingService.logEvent(
            LoggingEventCategory.error,
            LoggingEvent.error,
            { name: 'ServiceWorker: VERSION_INSTALLATION_FAILED' },
          );
          break;
      }
    });
    this.swUpdates.unrecoverable.subscribe((error) => {
      console.error('ServiceWorker unrecoverable error:', error);
      this.loggingService.logEvent(
        LoggingEventCategory.error,
        LoggingEvent.error,
        {
          name: 'ServiceWorker: unrecoverable error',
          reason: error.reason,
        },
      );
      document.location.reload();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (!!this.envName) {
        document.title += ` [ ${this.envName} ]`;
      }
    });
  }
}

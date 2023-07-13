import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { LoggingService } from 'src/app/services/logging.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  public envName: string = environment.envName;

  constructor(
    private loggingService: LoggingService,
    private swUpdates: SwUpdate,
  ) {
    this.setUpExternalLinkTracking();

    this.handleServiceWorkerUpdates();
    this.handleServiceWorkerErrors();
  }

  private setUpExternalLinkTracking(): void {
    document.addEventListener(
      'click',
      (event) => {
        const target = event.target as HTMLElement;

        // Stop if not directly ON or WITHIN a link
        if (target.tagName !== 'A' && !target.closest('a')) {
          return;
        }

        // Use link itself or closest parent link
        const link = (
          target.tagName === 'A' ? target : target.closest('a')
        ) as HTMLAnchorElement;

        // Ignore internal links
        if (link.hostname === window.location.hostname) {
          return;
        }

        this.loggingService.logEvent(
          LoggingEventCategory.ai,
          LoggingEvent.ExternalLinkClick,
          {
            href: link.href,
            linkText: link.innerText || '',
            metaKey: event.metaKey || undefined,
            shiftKey: event.shiftKey || undefined,
            ctrlKey: event.ctrlKey || undefined,
          },
        );
      },
      {
        capture: false,
        passive: true,
      },
    );
  }

  private handleServiceWorkerUpdates(): void {
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

          this.swUpdates
            .activateUpdate()
            .then((activated) => {
              console.log(
                'ServiceWorker: activateUpdate: ',
                activated,
                evt.latestVersion.hash,
              );
              if (!activated) {
                this.loggingService.logEvent(
                  LoggingEventCategory.sw,
                  LoggingEvent.SwUpdateNotActivated,
                  {
                    name: evt.latestVersion.hash,
                  },
                );

                return activated;
              }
              this.loggingService.logEvent(
                LoggingEventCategory.sw,
                LoggingEvent.SwUpdateActivated,
                {
                  name: evt.latestVersion.hash,
                },
              );
              document.location.reload();
              return activated;
            })
            .catch((error) => {
              console.error('ServiceWorker: activateUpdate: ', error);
              this.loggingService.logEvent(
                LoggingEventCategory.error,
                LoggingEvent.error,
                { name: 'ServiceWorker: activateUpdate error' },
              );
            });
          break;
        case 'NO_NEW_VERSION_DETECTED':
          this.loggingService.logEvent(
            LoggingEventCategory.sw,
            LoggingEvent.SwUpdateNotAvailable,
            {
              name: evt.version.hash,
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
  }

  private handleServiceWorkerErrors(): void {
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
}

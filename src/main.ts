import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { LoggingService } from 'src/app/services/logging.service';
import { ngxMarkdownModuleFactory } from 'src/app/shared/ngx-markdown.factory';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app/app.component';
import { routes } from './routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(
      routes,
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
        urlUpdateStrategy: 'eager',
      }),
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
      }),
    ),
    importProvidersFrom(
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.useServiceWorker && environment.production,
        registrationStrategy: 'registerWhenStable:3000',
      }),
      ngxMarkdownModuleFactory(),
    ),
    LoggingService,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(withInterceptorsFromDi()),
    provideIonicAngular({
      mode: 'md',
      animated: false,
    }),
  ],
}).catch((err) => console.error(err));
